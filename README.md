# کارنو (Karno) — Iranian Car Marketplace Landing Page

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 rebuild of the
21st.dev bento-grid reference sketch, fully in Farsi/RTL.

## Note on scope

No existing project was found at `/mnt/project` (it was empty), so this was built
fresh against the tech stack specified in the brief rather than adapted from an
existing codebase. If you have an existing Karno repo, drop these files in and
resolve any naming collisions with what's already there.

## Loading states for /listings and /listings/[id]

Both routes were freezing the *previous* page during navigation — no visual
feedback while the new page's server-side data fetch (search/filters +
search/listings, or the listing detail call) was in flight. Added
`app/listings/loading.tsx` and `app/listings/[id]/loading.tsx` — Next.js App
Router's dedicated convention for this: dropping a `loading.tsx` next to a
`page.tsx` automatically wraps the route in a Suspense boundary, so Next shows
it immediately on navigation (client-side transitions included) while the
target page's data loads, instead of the browser just sitting on the old page
with no feedback. Both skeletons mirror their real page's layout (grid
columns, card shapes, sidebar sections) so there's minimal layout shift once
the real content swaps in; the real `<Navbar />` renders immediately in both
(no data dependency), only the data-dependent content below it is a skeleton.

## Fixed: brands/models silently missing from /listings filters

Root cause, confirmed against the backend team's own description of the
`search/filters` contract: `brands` and `provinces` are documented as wrapped
in `{ data: [...] }` (Laravel API Resources) while every other field is a bare
array. The existing code (`rawFilters.brands?.data ?? []`) already matched
that documented shape correctly — but that's exactly the fragility: if the
*live* response for either field doesn't match the doc precisely (comes back
as a bare array, double-wrapped, or missing), reading `.data` off the wrong
shape resolves to `undefined` and silently falls back to an empty list, with
no error thrown anywhere to surface the mismatch.

Replaced the inline per-field `?.data ?? []` checks (used in both
`app/listings/page.tsx` and the wizard's `lib/listingWizardClient.ts`) with one
shared, shape-agnostic normalizer: **`lib/normalizeSearchFilters.ts`**. Its
`unwrapArray()` helper checks the actual runtime shape of each field —
`Array.isArray()` first, then unwraps `.data` (recursively, so an accidental
`{ data: { data: [...] } }` double-wrap also resolves correctly) — rather than
assuming the doc's shape is exactly what arrives. This makes brand/province
parsing correct regardless of which shape the live backend actually sends,
closing off this entire class of bug rather than re-fixing the same symptom
again if it recurs with a different field.

Verified against three mock response shapes for `brands`/`provinces`: the
documented `{ data: [...] }` wrapper, a bare array (the scenario the backend
team's bug description points at), and a double-wrapped `{ data: { data: [...] } }`
— all three now correctly populate the brand/province checkboxes on
`/listings`, where the old code would have silently shown zero brands for the
bare-array case specifically.

## Mobile filter bar (bama.ir/car style)

Replaced the plain "فیلترها" trigger button with a real filter bar, matching
[bama.ir/car](https://bama.ir/car): `components/search/FilterSidebar.tsx` now
renders a `fixed inset-x-0 top-[68px]` bar directly below the header on mobile
(`lg:hidden`) — "moves with the header" because it's pinned at a fixed offset
from it, not just `sticky` (which would only engage once scrolled into that
position). `app/listings/page.tsx`'s top padding grew to `pt-[166px] lg:pt-[110px]`
to leave room for it.

The bar is a horizontally-scrollable row of chips built from the *same* filter
state as the desktop sidebar (single source of truth, so switching viewport
width never loses a selection):

- **Active filters** — one chip per selected value (each brand, each model,
  each usage type, each color, each fuel type — not one combined chip per
  category) in orange with an **×** that removes just that one value and
  re-navigates immediately, without waiting for "اعمال فیلترها". Price/year
  collapse to a single removable chip each (e.g. "از ۲۰۰ میلیون تومان") since
  they're really one range concept, not two independent values.
- **Inactive filters** — a curated set of 5 always-shown placeholder chips
  (ترتیب / برند، مدل / نوع کارکرد / قیمت / استان و شهر) that open the full
  filter modal when tapped. Year, mileage, color, and fuel don't get a
  permanent placeholder (that would make the bar a wall of empty chips by
  default) — they only appear once actually selected.
- The **فیلترها** button (dark pill, funnel icon) opens the same full-screen
  bottom-sheet modal as before — the complete filter form, not a subset —
  which is also where brand/model/color (the "too many options" fields) live,
  each showing 6 with a "نمایش N مورد بیشتر" toggle.

Verified against a mock with a mix of active (`brands[]`, `usage_type[]`) and
untouched filters — confirmed both chip types render with the right labels and
the fixed-position class is present.

## Fixes: hero search dropdown + filter sidebar

- **Hero search results were getting clipped, not actually "under" the next
  section.** Root cause: the Hero `<section>` had `overflow-hidden` (leftover
  from an earlier design that needed it to clip decorative blobs — the current
  design doesn't have those anymore). Since the search dropdown is an
  absolutely-positioned descendant, anything past the section's bottom edge was
  invisible, which reads exactly like "goes under the next section." Changed to
  `overflow-x-hidden` — keeps horizontal containment, lets the dropdown render
  normally.
- **Popular-tag buttons weren't reliably navigating.** Switched them from
  `onClick` + `router.push` to real `<Link href="/listings?q=...">` — a native
  anchor is the most reliable way to guarantee navigation regardless of any
  timing interaction with the debounced-search effect.
- **Search results are now a swiper**, not a vertical dropdown list — reuses
  `useFreeDragCarousel` (same hook as the homepage carousels) for a horizontal
  row of compact result cards with a fixed height, so a large result set can't
  ever push down toward the footer regardless of count.
- **Loading state**: the magnifying-glass icon swaps for a spinning ring while
  a search is in flight.
- **Filter sidebar didn't scroll independently** — it was `sticky` with no
  bounded height, so once its content (10 filter sections) exceeded the
  viewport, hovering over it just scrolled the whole page instead of the
  sidebar itself. Fixed by giving the sticky card a
  `max-h-[calc(100vh-150px)]` + internal `overflow-y-auto` — standard browser
  behavior then takes over: scrolling while hovering the sidebar scrolls the
  sidebar until it hits its own top/bottom, then falls through to the page.
- **Mobile filter UX rebuilt bama.ir-style** (`components/search/FilterSidebar.tsx`
  now renders two shells from one shared state: a `hidden lg:block` sticky
  sidebar for desktop, and a `lg:hidden` slim "فیلترها" bar + full-screen
  bottom-sheet modal for mobile — matching the reference
  [bama.ir/car](https://bama.ir/car) pattern). The mobile button shows a live
  count badge of active filters; the modal contains the complete filter form
  (brand, model, province/city, price, year, mileage, color, fuel type, sort —
  not a stripped-down subset), with an "اعمال فیلترها" bar pinned to the
  modal's bottom.
- **Show-6-then-more** for brand, model, and color lists (the fields most
  likely to have many options) — `CheckboxList` in `FilterSidebar.tsx` slices
  to the first 6 with a "نمایش N مورد بیشتر" toggle to reveal the rest. Verified
  against a 9-brand / 8-color mock to confirm the threshold and remaining-count
  math are both correct.

## Homepage ad carousels

- **جدیدترین آگهی‌ها** (`ListingsSection` → `ListingsCarousel`) — 12 ads + a trailing
  "نمایش همه آگهی‌ها" card (13th slide), fractional/peeking `slidesPerView`
  (1.25 → 2.3 → 3.3 → 4.2 across breakpoints), and the **active (rightmost) card is
  enlarged** (`scale-[1.06]` + elevated shadow) while its neighbors sit at
  `scale-[0.94]`/reduced opacity — the bama.ir "براساس کاربرد" effect. Manual
  prev/next only, no autoplay.
- **آگهی‌های پیشنهادی** (`FeaturedAdsSection` → `FeaturedAdsCarousel`) — same four
  tabs as before (جدیدترین‌ها / پربازدیدترین / اقتصادی / لوکس), but each tab now
  shows real ad cards matching what the tab name means (newest postings / most-viewed
  / lowest-priced / luxury brands & higher price — see the `tags` on each entry in
  `data/listings.ts`), plus a trailing "نمایش همه" card. **No active-card enlarging
  here** — uniform card sizing, autoplay with pause-on-hover (unchanged from before).
- **`/listings`** (`app/listings/page.tsx`) — the actual destination behind every
  "نمایش همه" card. Plain grid, no carousel. Reads `?category=` to filter down to
  one of the four tabs (that's what the featured-ads carousel's show-all card links
  to); with no query param it shows the full ad pool.
- `components/ListingCard.tsx` — the single presentational ad card shared by both
  carousels and the `/listings` grid (previously duplicated in `ListingsGrid.tsx`,
  now removed).

- **Free-drag mode**: both carousels support pointer-drag panning — mouse
  (click-and-drag) and touch alike, via `components/useFreeDragCarousel.ts`, a
  shared hook driving both. Dragging tracks the pointer 1:1 in real time (no lag,
  no snap while moving), but **on release it settles on the nearest full card**
  rather than stopping half-way between two — `Math.round()` on the drag-end
  offset gives the usual "past the halfway point" commit threshold for free. A 6px
  movement threshold before capture keeps clicks on nested buttons (bookmark,
  etc.) working normally, and `draggable={false}` + a prevented native
  `dragstart` stop the browser's built-in image/text drag from hijacking
  mouse-drags on desktop. Prev/next buttons still work and animate via the same
  underlying offset the drag uses.
- **Ad cards redesigned** (`ListingCard.tsx`, reused by both carousels, the
  dashboard's `AdCard.tsx`, and `/listings`): the top-left corner tag is now
  always the car's usage type — **صفر** (zero-km) / **کارکرده** (used) /
  **پیش‌فروش / حواله** (pre-sale), from a new `usageType` field on `CarListing`
  (`lib/usageType.ts`) — replacing the old ad-hoc "ویژه"/"فوری"/"پرفروش" promo
  badges, which are gone. Year, city, and view-count each get an icon
  (`components/CardMetaIcons.tsx`); "used" cars additionally show mileage with a
  gauge icon (`lib/persianNumber.ts`'s `formatKilometers`). Negotiable-priced ads
  (`price: "توافقی"`) show that directly in the price slot instead of a number —
  there's no separate "توافقی" badge duplicating it.

## Body-type browse row

A free-drag swiper of car-body-type silhouettes (ون / کروک / کوپه / وانت /
کراس‌اوور, plus سدان / هاچبک / شاسی‌بلند) between the brand grid and the
featured-ads section — `components/BodyTypeSection.tsx` -> `BodyTypeSwiper.tsx`,
using the same `useFreeDragCarousel` hook as the other two carousels. Icons are
hand-drawn line-art SVGs (`components/BodyTypeIcons.tsx`) rather than a design
library, since no body-type icon set was provided. Each item links to
`/listings?bodyType=<type>` — the mock ad pool doesn't carry a body-type field to
actually filter by yet, so today that link just lands on the full listings page;
wiring in real filtering is a matter of adding that field once real data exists.

## Listing detail page (`/listings/[id]`)

Public, per the doc (`Auth: ندارد`) — no login guard. Implements
`GET /api/listings/{id}` exactly:

- **Never cached** — `lib/publicListingApi.ts` sets `cache: "no-store"`
  explicitly and says why in a comment: this endpoint has a side effect (each
  call logs a view), so caching or prefetching it would silently inflate/skip
  view counts.
- **404 handling matches the doc's privacy behavior**: non-existent, deleted,
  and draft/pending/rejected listings all 404 identically (the doc is explicit
  that hidden-vs-nonexistent must not be distinguishable) — handled via Next's
  `notFound()` plus a custom Farsi 404 (`app/listings/[id]/not-found.tsx`).
  Non-404 failures (network errors, 5xx) get a distinct "try again" message
  instead of being folded into the same 404, since that's a different failure
  mode than "this listing doesn't exist."
- **`spec` fields are hidden, not shown as "نامشخص", when null** — per the doc's
  explicit instruction — via `components/listing-detail/SpecList.tsx` filtering
  each of the 21 possible spec fields before rendering.
- **Contact button is a real `tel:` link** built from
  `listing.contact.tel_link` exactly as the doc specifies (a site-wide support
  number, not the seller's real number, which the API never exposes) — never
  hardcoded.
- **`related_listings.data`** (note the extra `.data` wrapper the doc calls out,
  vs. `listing` which is unwrapped) renders as its own card
  (`RelatedListingCard.tsx`) — a deliberately distinct component from the
  homepage's `ListingCard`, since the related-listing shape genuinely differs
  (numeric price, plain-string city, singular `cover_image`, no transmission/
  views field).
- Price formatting (`formatPriceToman` in `lib/persianNumber.ts`) matches the
  site's existing convention (raw Toman -> "X.XXX میلیون تومان"); a
  `formatRelativeTime` helper turns the ISO `created_at` into the same
  "امروز"/"دیروز"/"X روز پیش" style used throughout the mock data (no calendar
  library — good enough for relative display, not a full Jalali conversion).
- Homepage/`/listings`-grid cards (`ListingCard.tsx`) now link to
  `/listings/{id}` — note the homepage's mock ad pool uses string slugs as ids
  (e.g. `santafe`), not the numeric ids a real backend would use, so those
  particular links won't resolve against the real API until real listing data
  replaces the mocks; the detail page itself is fully wired to the real
  endpoint regardless.

## Fixes from the Aug 2 round

- **Fixed the `related_listings.data.length` crash on `/listings/[id]`.** The
  real backend doesn't necessarily wrap `related_listings` in `{ data: [...] }`
  the way the doc's example shows — `lib/publicListingApi.ts` now normalizes
  it defensively (handles the documented `{ data }` wrapper, a bare array, or
  the key being missing entirely) before the page ever sees it, so a schema
  mismatch degrades to "no related listings" instead of crashing the page.
  The related-listings section itself was found commented out (a prior
  workaround for the crash) and has been restored.
- **Mobile contact bar added above the seller's description**
  (`components/listing-detail/MobileContactBar.tsx`) — a tappable `tel:` bar
  matching the reference design, visible only below the `lg` breakpoint. The
  existing sidebar "تماس با کارنو" card is now `hidden lg:block` (it's only
  useful once the two-column layout kicks in at `lg`; below that it used to
  render at the very bottom of a long stacked page, which is exactly what the
  new bar fixes).
- **Icons added to the برند و مدل info card**: `TagIcon` (brand/model),
  `SlidersIcon` (trim), `BeakerIcon` (body color / interior color / paint
  status) — new additions to `components/CardMetaIcons.tsx`, alongside a
  `PhoneIcon` used by the new contact bar.
- **Removed dead code that was silently breaking `next build`.** The uploaded
  project had ~30 orphaned files (`components/ui/*`, `components/skeletons/*`,
  kebab-case components like `header.tsx`/`search-bar.tsx`/`brands-grid.tsx`,
  and several `lib/*` files) importing `lucide-react` and `swiper/react` —
  neither installed — plus a stale `ListingsGrid.tsx` referencing fields
  removed from `CarListing` a while back. None of it was reachable from any
  page (verified via grep before deleting anything), but TypeScript type-checks
  every file in the project regardless of whether it's imported, so this was
  failing `tsc --noEmit` / `next build` outright. It looks like leftover
  scaffolding from a separate design exploration (the `lucide-react`/`swiper`
  imports are a strong tell) that never got wired into `app/page.tsx`, which
  still used the original hand-built components the whole time. Removed rather
  than left broken — if that alternate design was actually wanted, it'd need
  `npm install lucide-react swiper` and real integration, not a silent partial
  copy sitting next to the working app.

## Dashboard (`/dashboard`)

Protected route: `app/dashboard/page.tsx` reads the `karno_session` cookie server-side,
calls `getMe`, and redirects to `/login?next=/dashboard` if there's no valid session.
Tabs are URL-driven (`/dashboard?tab=...`, plus per-tab params like `status=`,
`page=`, `ticket=`, `new=`) via `components/dashboard/DashboardTabs.tsx`. All four
tabs are wired to the real `/api/user/*` and `/api/support/*` endpoints — the BFF
proxy layer lives in `lib/userPanelApi.ts` (server-only) + `lib/userPanelClient.ts`
(browser-side, for the interactive bits) + route handlers under
`app/api/user/` and `app/api/support/`.

- **آگهی‌های من** (`my-ads`) — `MyAdsSection` calls `GET /user/listings?tab=&page=`
  for the three real tabs (**فعال / تکمیل‌نشده / غیرفعال**, matching the doc's exact
  status groupings — e.g. "غیرفعال" bundles pending+rejected+sold+expired). Tab
  buttons are plain links (not client state) so real pagination works correctly;
  getting the count badges still means fetching all three tabs' `meta.total` per
  page load (one full page for the active tab, one lightweight page-1 call each for
  the other two, in parallel). "تکمیل‌نشده" ads link their "ادامه ثبت‌آگهی" button
  straight to `/dashboard/listing` — the wizard already resumes via its own
  `GET /draft/current`, so no need to pass `current_step` through manually.
- **آگهی‌های ذخیره شده** (`saved`) — `SavedAdsSection` calls
  `GET /user/saved-listings`; "حذف از ذخیره‌شده‌ها" calls the real
  `DELETE /user/saved-listings/{listingId}` (note: listing id, not `saved_id`, per
  the doc). Entries whose `listing.status` isn't `active` show a "دیگر در دسترس
  نیست" badge instead of a broken link, per the doc's explicit warning that saved
  records outlive the listing they point to.
- **`BookmarkButton` now does real saving**, not just a local toggle — but only
  where a real numeric listing id exists to save against (the public
  `/listings/[id]` detail page). Homepage/carousel cards still use mock string ids
  (`santafe`, etc.), so their bookmark button stays local-only — wiring those up
  means giving the mock ad pool real ids first, otherwise every click would 422
  against the real API for a listing that doesn't exist.
- **احراز هویت** (`verification`) — the auth doc's "no profile-update endpoint yet"
  gap is half-closed: this doc adds a *real* `PUT /user/profile/national-code`,
  so the form now only takes the national code (exactly what the endpoint accepts)
  and actually persists it, surfacing the exact 422 messages (bad format vs.
  duplicate) from the API. Name/city are still display-only (still no endpoint for
  those).
- **تماس با پشتیبانی** (`support`) — a real thread-based ticketing UI, not a
  one-shot message form: ticket list (`GET /support/tickets`) -> new-ticket form
  (`POST /support/tickets`) -> thread view (`GET /support/tickets/{id}`) with
  message bubbles (user right-aligned, admin left) and a reply box
  (`POST /support/tickets/{id}/reply`). A closed ticket's 409 is caught and shown
  as "این تیکت بسته شده — یک تیکت جدید باز کنید" rather than a generic error, per
  the doc. No websocket/polling (the doc is explicit there isn't one server-side) —
  there's a manual "بررسی پاسخ جدید" button that just re-fetches the thread.
- **`/dashboard/listings/[id]`** — a new page using `GET /user/listings/{id}`,
  which the doc built specifically so an owner can see their own
  pending/rejected/draft listing (the public `/listings/[id]` only shows
  active/sold). Reuses `ListingGallery`/`SpecList` from the public detail page;
  drops the "contact seller" sidebar since you don't need to call yourself.
- **درباره ما** — not an in-page tab; it's a plain link to `/about`
  (`app/about/page.tsx`), per the request that this one just navigates away.

## Listing draft wizard (`/dashboard/listing`)

Implements the 10-step `POST /api/listings/draft/*` wizard from the API doc, behind
the same BFF pattern as auth: every draft endpoint requires `Authorization: Bearer`,
so the token is attached server-side from the HttpOnly cookie and never touches
client JS.

- **Proxy layer**: `lib/listingApi.ts` (server-only client) + `lib/apiProxy.ts`
  (shared `withAuthProxy` helper) + `lib/apiError.ts` (the `ApiError` class, now
  shared between the auth and listing proxies — `AuthApiError` is a re-export of it
  for backward compatibility). Base URL: `API_BASE_URL` env var, defaulting to
  `https://auto-gallery.amlakemoon.com/api`.
- **Routes**: `app/api/listings/draft/start`, `/current`, `/[id]` (DELETE = cancel),
  `/[id]/submit`, `/[id]/images` (POST, multipart, re-validates type/size
  server-side even though the client already checks), `/[id]/images/[imageId]`
  (DELETE). The 9 simple `PUT .../{step}` steps and the 2 dependent
  `GET .../{step}-options` steps (year-options, trim-options) share **one** dynamic
  route, `app/api/listings/draft/[id]/[step]/route.ts`, whitelisted against
  `lib/wizardSteps.ts` — rather than 11 near-identical route files.
  `GET /api/search/filters` gets its own proxy at `app/api/search/filters/route.ts`
  (best-effort auth: attaches the token if present, doesn't require it).
- **Only steps 3 (year) and 4 (trim) fetch live, selection-dependent options** —
  exactly as the doc specifies. Every other step's options (brands w/ nested
  models, usage types, colors, paintwork statuses, provinces w/ nested cities, sale
  types) come from one `GET /api/search/filters` call made once when the wizard
  loads (`lib/listingWizardClient.ts`'s `wizardApi.getFilters`, cached in
  component state — never refetched per step).
- **On an honest schema gap**: the doc only ever shows `ListingDraft` in its *empty*
  state (`brand: null`, `car_model: null`, etc.) — it doesn't show what those fields
  look like once set. `types/listingDraft.ts` types them `unknown` rather than
  guessing wrong with confidence. The wizard instead tracks what the user picked as
  its own client-side "selections" state (`components/dashboard/listing-wizard/types.ts`),
  populated at the moment of selection from the already-known `/search/filters`
  list — which is always precisely known regardless of what shape the server echoes
  back. On **resume** (reopening an in-progress draft), `extractIdName` in
  `lib/listingWizardClient.ts` makes a best-effort guess at the likely
  `{ id, name }` shape to pre-fill labels, but degrades to blank (not a crash) if
  that guess is wrong — the user just re-confirms that step. Scalar fields the doc
  *does* show clearly (`year`, `mileage`, `price`, `sale_type`, `usage_type`,
  `description`, `is_exchange`, `images`) are typed properly and always resume
  correctly.
- **UI**: `ListingWizard.tsx` orchestrates 10 step components + a review/submit
  step (`components/dashboard/listing-wizard/steps/`), all sharing
  `WizardStepShell` for consistent chrome. `StepsOverview` shows all 11 steps
  (10 + review) with live progress; only steps ≤ the furthest one reached are
  clickable, matching the doc's "steps must be completed in order" rule. On
  submit, a 422's `errors.missing_fields` is mapped back to the specific step via
  `MISSING_FIELD_TO_STEP` (`lib/wizardSteps.ts`) and rendered as "برگشت به «X»"
  buttons, per the doc's explicit guidance. Price input shows comma-formatted
  digits but sends the raw number, per the doc ("قیمت... کاما و واحد رو فرانت اضافه
  کنه"). "لغو ثبت‌آگهی" calls `DELETE /draft/{id}` after an inline (non-native)
  confirm.
- Entry points: Navbar's "ثبت آگهی رایگان", the homepage CTA section, and a
  "+ ثبت آگهی جدید" button on the dashboard's My Ads tab all link here; the page
  itself redirects to `/login?next=/dashboard/listing` if there's no valid session.

Tested end-to-end against an extended mock of the real API — full happy path
(start → all 10 steps → image upload, including a rejected non-image file → submit)
plus the early-submit 422/`missing_fields` path and cancel, all through the actual
Next.js proxy routes, not just type-checked.

## Real search: hero bar + `/listings` filter page

Wired up `GET /api/search/filters`, `/search/listings`, and `/search/hero` — the
homepage search box and `/listings` were placeholders before this; both are now
backed by the real API, not mock data.

- **`types/search.ts`** is now the single source of truth for the filter-option
  shapes (`BrandOption`, `ProvinceOption`, `ColorOption`, etc.) — previously
  duplicated (and, for `brands`/`provinces`, *wrongly typed as bare arrays*) in
  `types/listingDraft.ts`. The listing-draft wizard doc's companion doc confirmed
  the real shape: `brands` and `provinces` are wrapped in `{ data: [...] }`
  (Laravel API Resources), everything else — `fuel_types`, `colors`,
  `paintwork_statuses`, `usage_types`, `sale_types`, `sort_options` — is a bare
  array. That's called out in the doc as deliberate, not a bug. `lib/listingApi.ts`
  and `lib/listingWizardClient.ts` (the wizard's `normalizeFilters`) were both
  fixed to unwrap `brands.data`/`provinces.data` correctly — they'd been silently
  reading past the wrapper and falling back to an empty brand list.
- **Hero search bar** (`components/SearchBar.tsx`) now debounces (350ms) into
  `GET /api/search/hero`, showing a live dropdown of matches (thumbnail, title,
  year, city, price) that navigate straight to `/listings/{id}`. Submitting the
  form (Enter, or the search button) goes to `/listings?q=...`.
- **`/listings`** is a real filter/search page now, not the old mock
  "all ads" grid: `components/search/FilterSidebar.tsx` (client) renders every
  facet from `/search/filters` — brand→model cascading checkboxes,
  province→city cascading selects, usage type, price/year/mileage ranges, color
  swatches, fuel type, sort — and batches them into one URL navigation on
  "اعمال فیلترها" (not one request per checkbox click). The page itself is a
  server component reading `searchParams` directly, per the doc's own suggested
  Next.js pattern ("فیلترها رو از URL بخون، مستقیم به query string پاس بده").
- **The `q` / structured-filter gap**: the doc is explicit that `search/listings`
  doesn't support a free-text `q` param (that's what `search/hero` is for) — so
  when the hero bar's `q` lands on `/listings` with no other filters set, the page
  calls `search/hero` instead of `search/listings` so the query still does
  something, rather than being silently dropped. Applying any structured filter
  switches back to `search/listings` as usual.
- Reused `RelatedListingCard` (already built for the listing-detail page) for
  search results — `SearchListingCard` and `RelatedListingSummary` turned out to
  be structurally identical, so no new card component was needed.
- The homepage's `FeaturedAdsCarousel` "نمایش همه" links used to point at a
  `category=` param the mock `/listings` page understood but the real one
  doesn't — remapped to real `sort=` values instead (`newest`/`price_asc`/
  `price_desc`) so they still do something sensible rather than silently no-op.

## Wizard fix: current_step can now decrease

A companion revision to the listing-draft-wizard doc clarified a real behavior
change: editing brand, model, or year *after* already progressing further
resets `current_step` down (not just up) — e.g. editing brand after reaching
step 7 snaps the server's `current_step` back to 2, because steps 3-7's data
actually got wiped server-side. Previously the wizard's `furthestStep` only ever
grew (`Math.max`), so the steps-overview would keep showing now-invalid steps as
completed. Fixed in `ListingWizard.tsx`: brand/model/year's `onComplete` handlers
now call a new `jumpToServerStep(listing.current_step)` — trusting the server's
value exactly, per the doc's explicit instruction not to cache or guess it
client-side — while every other step keeps the old `Math.max`-based `goToStep`
(correct there, since only these three steps are chain-dependent on the car
catalog). Verified against a mock that reproduces the exact scenario: advance to
step 8, re-submit brand, confirm the response's `current_step` really drops to 2.

## Getting started

```bash
cp .env.example .env.local   # point AUTH_API_BASE_URL / API_BASE_URL at your Laravel backend
npm install
npm run dev
```

Open http://localhost:3000. This needs internet access on first `npm run build`/`dev`
to fetch the Vazirmatn font via `next/font/google` (only fetched once, then cached).

## Auth (mobile + OTP)

Implements the mobile-number + OTP flow from the Laravel Sanctum auth API doc, via a
BFF (Backend-for-Frontend) pattern so the Sanctum bearer token never touches client JS:

- `lib/authApi.ts` — server-only client for the Laravel endpoints
  (`otp/request`, `otp/verify`, `me`, `logout`). Reads its base URL from
  `AUTH_API_BASE_URL` (see `.env.example`).
- `app/api/auth/otp/request/route.ts` and `app/api/auth/otp/verify/route.ts` —
  Next.js Route Handlers that proxy those two calls. `otp/verify` is the only place
  the raw token is ever seen server-side; it's immediately written to an **HttpOnly**
  `karno_session` cookie (`lib/sessionCookie.ts`) and never included in the JSON sent
  back to the browser.
- `app/api/auth/me/route.ts` / `app/api/auth/logout/route.ts` — read the cookie,
  attach `Authorization: Bearer …` when calling Laravel on the client's behalf.
- `app/api/session/route.ts` — the boolean-only check `SessionSync` already used;
  now backed by a real `/auth/me` call so `Navbar` shows the user's actual name.
- `components/LoginForm.tsx` (`app/login/page.tsx`) — the two-step client UI: enter
  mobile → request code → enter 5-digit code → verify. Handles every response shape
  from the doc: 422 validation, 429 with `retry_after_seconds` (disables "ارسال مجدد
  کد" with a live countdown), the generic "invalid or expired" 422 on verify, and
  surfaces `debug_code` only when the backend actually returns it (local/dev only).
  On success, redirects to `?next=` if present (e.g. `/login?next=/dashboard`, set
  automatically when the dashboard bounces an unauthenticated visitor), otherwise
  straight to `/dashboard`.
- `components/Navbar.tsx` — "ورود" now links to `/login`; once logged in it shows the
  user's name plus a working "خروج" (sign out) button that calls `/api/auth/logout`.

Tested end-to-end against a throwaway mock of the Laravel API during development
(OTP request → wrong-code 422 → correct-code sets the HttpOnly cookie → `/api/session`
and `/api/auth/me` both reflect the logged-in profile → logout clears it). Point
`AUTH_API_BASE_URL` at the real backend and the same code path applies.

## Architecture notes

- **RTL/Farsi**: `<html lang="fa" dir="rtl">` in `app/layout.tsx`, Vazirmatn loaded via
  `next/font/google` with the `arabic` subset (covers Farsi/Persian numerals). All copy,
  including numerals, uses real Farsi text (۱۴۰۳, ۲.۸۵۰ میلیون تومان, etc.), no lorem ipsum.
- **Tailwind v4**: CSS-first config in `app/globals.css` — no `tailwind.config.js`. Every
  custom token from the reference sketch (`cream`, `orange`, `sky`, `peach`, `paleblue`,
  the `warm-*`/`sky-*` scales, custom shadows, `float`/`blob` keyframes) is defined in
  `@theme` so it's available as ordinary utility classes (`bg-cream`, `shadow-bento`, etc.).
- **Client boundaries** are limited to genuinely interactive components:
  `Navbar` (scroll effect), `SearchBar` (debounced input), `BookmarkButton` (toggle),
  `Reveal` (IntersectionObserver), `ReviewsCarousel` (tabs + slide/autoplay), and
  `SessionSync` (session fetch). Every other component is a plain server component.
- **Suspense + skeletons**: `BentoGrid`, `ListingsData` (latest-ads carousel), and the
  featured-ads category tabs (`FeaturedAdsSection`) are `async` server components
  hitting a mock data layer (`data/listings.ts`) with artificial latency, each wrapped
  in `<Suspense>` with a purpose-built skeleton.
- **Session/Zustand**: see the "Auth (mobile + OTP)" section above — `lib/store.ts`
  (Zustand) mirrors only a boolean + display name, the real Sanctum token lives in an
  HttpOnly cookie the client never touches.
- **Images**: `next/image` throughout, with `images.unsplash.com` allow-listed in
  `next.config.ts`.
- **Strict TypeScript**: `strict: true` + `noUncheckedIndexedAccess: true`; no `any`
  anywhere. `npx tsc --noEmit` and `npx eslint .` both pass clean.

## Known gaps vs. the sketch

- The vanilla-JS 21st.dev sketch used raw DOM manipulation; this port re-implements
  every interaction (bookmarking, carousel, scroll reveal, navbar blur) as idiomatic
  React state/effects rather than porting the DOM script 1:1.
- Mobile nav menu (hamburger) isn't in the reference sketch either, so it wasn't added —
  the desktop links simply hide below `md`. Flag if you want one.
- The carousel is a hand-rolled flex/translate implementation (no Swiper dependency,
  since the original tech-stack brief only calls for Swiper "if used" for carousels —
  happy to swap in `swiper/react` if you'd rather have its touch/pagination features).
