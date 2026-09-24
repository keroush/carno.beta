"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatKilometers,
  formatPriceToman,
  toPersianDigits,
} from "@/lib/persianNumber";
import type { NormalizedSearchFilters } from "@/lib/normalizeSearchFilters";
import type {
  CarModelOption,
  SearchListingsQuery,
  SearchUsageType,
  SortOptionValue,
} from "@/types/search";

interface FilterSidebarProps {
  filters: NormalizedSearchFilters;
  initialQuery: SearchListingsQuery;
}

interface FilterState {
  brandIds: number[];
  modelIds: number[];
  provinceId: number | undefined;
  cityId: number | undefined;
  usageTypes: SearchUsageType[];
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  mileageMax: string;
  colorIds: number[];
  fuelTypeIds: number[];
  sort: SortOptionValue | "";
}

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
  onRemove?: () => void;
}

const VISIBLE_LIMIT = 6;

function formatWithCommas(digitsOnly: string): string {
  if (!digitsOnly) return "";
  return Number(digitsOnly).toLocaleString("en-US");
}

function toggleInArray<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function FunnelIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M6.75 12h10.5m-7.5 5.25h4.5"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

export function FilterSidebar({ filters, initialQuery }: FilterSidebarProps) {
  const router = useRouter();

  const [brandIds, setBrandIds] = useState<number[]>(initialQuery.brands ?? []);
  const [modelIds, setModelIds] = useState<number[]>(initialQuery.models ?? []);
  const [provinceId, setProvinceId] = useState<number | undefined>(
    initialQuery.province_id,
  );
  const [cityId, setCityId] = useState<number | undefined>(
    initialQuery.city_id,
  );
  const [usageTypes, setUsageTypes] = useState<SearchUsageType[]>(
    initialQuery.usage_type ?? [],
  );
  const [priceMin, setPriceMin] = useState(
    initialQuery.price_min ? String(initialQuery.price_min) : "",
  );
  const [priceMax, setPriceMax] = useState(
    initialQuery.price_max ? String(initialQuery.price_max) : "",
  );
  const [yearMin, setYearMin] = useState(
    initialQuery.year_min ? String(initialQuery.year_min) : "",
  );
  const [yearMax, setYearMax] = useState(
    initialQuery.year_max ? String(initialQuery.year_max) : "",
  );
  const [mileageMax, setMileageMax] = useState(
    initialQuery.mileage_max ? String(initialQuery.mileage_max) : "",
  );
  const [colorIds, setColorIds] = useState<number[]>(initialQuery.colors ?? []);
  const [fuelTypeIds, setFuelTypeIds] = useState<number[]>(
    initialQuery.fuel_types ?? [],
  );
  const [sort, setSort] = useState<SortOptionValue | "">(
    initialQuery.sort ?? "",
  );

  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const [modelsExpanded, setModelsExpanded] = useState(false);
  const [colorsExpanded, setColorsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const availableModels = useMemo(
    () =>
      filters.brands
        .filter((brand) => brandIds.includes(brand.id))
        .flatMap((brand) => brand.models),
    [filters.brands, brandIds],
  );
  const availableCities = useMemo(
    () =>
      filters.provinces.find((province) => province.id === provinceId)
        ?.cities ?? [],
    [filters.provinces, provinceId],
  );

  function currentState(): FilterState {
    return {
      brandIds,
      modelIds,
      provinceId,
      cityId,
      usageTypes,
      priceMin,
      priceMax,
      yearMin,
      yearMax,
      mileageMax,
      colorIds,
      fuelTypeIds,
      sort,
    };
  }

  function navigateWithFilters(overrides: Partial<FilterState>) {
    const state = { ...currentState(), ...overrides };
    const params = new URLSearchParams();
    state.brandIds.forEach((id) => params.append("brands[]", String(id)));
    state.modelIds.forEach((id) => params.append("models[]", String(id)));
    if (state.provinceId) params.set("province_id", String(state.provinceId));
    if (state.cityId) params.set("city_id", String(state.cityId));
    state.usageTypes.forEach((value) => params.append("usage_type[]", value));
    if (state.priceMin) params.set("price_min", state.priceMin);
    if (state.priceMax) params.set("price_max", state.priceMax);
    if (state.yearMin) params.set("year_min", state.yearMin);
    if (state.yearMax) params.set("year_max", state.yearMax);
    if (state.mileageMax) params.set("mileage_max", state.mileageMax);
    state.colorIds.forEach((id) => params.append("colors[]", String(id)));
    state.fuelTypeIds.forEach((id) =>
      params.append("fuel_types[]", String(id)),
    );
    if (state.sort) params.set("sort", state.sort);

    setIsMobileOpen(false);
    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleBrandToggle(brandId: number) {
    const nextBrandIds = toggleInArray(brandIds, brandId);
    const stillAvailableModelIds = filters.brands
      .filter((brand) => nextBrandIds.includes(brand.id))
      .flatMap((brand) => brand.models.map((model) => model.id));
    const nextModelIds = modelIds.filter((id) =>
      stillAvailableModelIds.includes(id),
    );
    setBrandIds(nextBrandIds);
    setModelIds(nextModelIds);
  }

  function handleApply() {
    navigateWithFilters({});
  }

  function handleClear() {
    setIsMobileOpen(false);
    router.push("/listings");
  }

  // --- Chip-removal handlers: update local state AND navigate immediately, ---
  // --- since removing an active chip is an obvious one-click action that   ---
  // --- shouldn't wait for the "اعمال فیلترها" button like the full form.   ---
  function removeBrandChip(brandId: number) {
    const nextBrandIds = brandIds.filter((id) => id !== brandId);
    const stillAvailableModelIds = filters.brands
      .filter((brand) => nextBrandIds.includes(brand.id))
      .flatMap((brand) => brand.models.map((model) => model.id));
    const nextModelIds = modelIds.filter((id) =>
      stillAvailableModelIds.includes(id),
    );
    setBrandIds(nextBrandIds);
    setModelIds(nextModelIds);
    navigateWithFilters({ brandIds: nextBrandIds, modelIds: nextModelIds });
  }
  function removeModelChip(modelId: number) {
    const next = modelIds.filter((id) => id !== modelId);
    setModelIds(next);
    navigateWithFilters({ modelIds: next });
  }
  function removeSortChip() {
    setSort("");
    navigateWithFilters({ sort: "" });
  }
  function removeUsageChip(value: SearchUsageType) {
    const next = usageTypes.filter((v) => v !== value);
    setUsageTypes(next);
    navigateWithFilters({ usageTypes: next });
  }
  function removeLocationChip() {
    setProvinceId(undefined);
    setCityId(undefined);
    navigateWithFilters({ provinceId: undefined, cityId: undefined });
  }
  function removePriceChip() {
    setPriceMin("");
    setPriceMax("");
    navigateWithFilters({ priceMin: "", priceMax: "" });
  }
  function removeYearChip() {
    setYearMin("");
    setYearMax("");
    navigateWithFilters({ yearMin: "", yearMax: "" });
  }
  function removeMileageChip() {
    setMileageMax("");
    navigateWithFilters({ mileageMax: "" });
  }
  function removeColorChip(colorId: number) {
    const next = colorIds.filter((id) => id !== colorId);
    setColorIds(next);
    navigateWithFilters({ colorIds: next });
  }
  function removeFuelChip(fuelId: number) {
    const next = fuelTypeIds.filter((id) => id !== fuelId);
    setFuelTypeIds(next);
    navigateWithFilters({ fuelTypeIds: next });
  }

  // Curated quick-access chips always show a placeholder when inactive
  // (sort, brand/model, usage type, price, location); the rest (year,
  // mileage, color, fuel) only appear once actually selected, to keep the
  // bar from being a wall of empty chips on first load.
  const chips: FilterChip[] = [];

  const activeSortLabel = filters.sortOptions.find(
    (option) => option.value === sort,
  )?.label;
  chips.push(
    activeSortLabel
      ? {
          id: "sort",
          label: activeSortLabel,
          active: true,
          onRemove: removeSortChip,
        }
      : { id: "sort", label: "ترتیب", active: false },
  );

  if (brandIds.length === 0 && modelIds.length === 0) {
    chips.push({ id: "brand-model", label: "برند، مدل", active: false });
  } else {
    filters.brands
      .filter((brand) => brandIds.includes(brand.id))
      .forEach((brand) =>
        chips.push({
          id: `brand-${brand.id}`,
          label: brand.name,
          active: true,
          onRemove: () => removeBrandChip(brand.id),
        }),
      );
    filters.brands
      .flatMap((brand) => brand.models)
      .filter((model) => modelIds.includes(model.id))
      .forEach((model) =>
        chips.push({
          id: `model-${model.id}`,
          label: model.name,
          active: true,
          onRemove: () => removeModelChip(model.id),
        }),
      );
  }

  if (usageTypes.length === 0) {
    chips.push({ id: "usage", label: "نوع کارکرد", active: false });
  } else {
    usageTypes.forEach((value) => {
      const label =
        filters.usageTypes.find((option) => option.value === value)?.label ??
        value;
      chips.push({
        id: `usage-${value}`,
        label,
        active: true,
        onRemove: () => removeUsageChip(value),
      });
    });
  }

  if (cityId) {
    const city = filters.provinces
      .flatMap((province) => province.cities)
      .find((c) => c.id === cityId);
    chips.push({
      id: "location",
      label: city?.name ?? "شهر",
      active: true,
      onRemove: removeLocationChip,
    });
  } else if (provinceId) {
    const province = filters.provinces.find((p) => p.id === provinceId);
    chips.push({
      id: "location",
      label: province?.name ?? "استان",
      active: true,
      onRemove: removeLocationChip,
    });
  } else {
    chips.push({ id: "location", label: "استان و شهر", active: false });
  }

  if (priceMin || priceMax) {
    const label =
      priceMin && priceMax
        ? `${formatPriceToman(Number(priceMin))} تا ${formatPriceToman(Number(priceMax))}`
        : priceMin
          ? `از ${formatPriceToman(Number(priceMin))}`
          : `تا ${formatPriceToman(Number(priceMax))}`;
    chips.push({ id: "price", label, active: true, onRemove: removePriceChip });
  } else {
    chips.push({ id: "price", label: "قیمت", active: false });
  }

  if (yearMin || yearMax) {
    const label =
      yearMin && yearMax
        ? `سال ${toPersianDigits(yearMin)} تا ${toPersianDigits(yearMax)}`
        : yearMin
          ? `از سال ${toPersianDigits(yearMin)}`
          : `تا سال ${toPersianDigits(yearMax)}`;
    chips.push({ id: "year", label, active: true, onRemove: removeYearChip });
  }

  if (mileageMax) {
    chips.push({
      id: "mileage",
      label: `حداکثر ${formatKilometers(Number(mileageMax))}`,
      active: true,
      onRemove: removeMileageChip,
    });
  }

  filters.colors
    .filter((color) => colorIds.includes(color.id))
    .forEach((color) =>
      chips.push({
        id: `color-${color.id}`,
        label: color.name,
        active: true,
        onRemove: () => removeColorChip(color.id),
      }),
    );

  filters.fuelTypes
    .filter((fuel) => fuelTypeIds.includes(fuel.id))
    .forEach((fuel) =>
      chips.push({
        id: `fuel-${fuel.id}`,
        label: fuel.name,
        active: true,
        onRemove: () => removeFuelChip(fuel.id),
      }),
    );

  function CheckboxList<T extends { id: number; name: string }>({
    label,
    items,
    selected,
    onToggle,
    expanded,
    onExpandChange,
  }: {
    label: string;
    items: T[];
    selected: number[];
    onToggle: (id: number) => void;
    expanded: boolean;
    onExpandChange: (value: boolean) => void;
  }) {
    if (items.length === 0) return null;
    const visibleItems = expanded ? items : items.slice(0, VISIBLE_LIMIT);
    const remaining = items.length - VISIBLE_LIMIT;

    return (
      <div>
        <p className="mb-2 text-xs font-bold text-stone-700">{label}</p>
        <div className="grid grid-cols-2 gap-2">
          {visibleItems.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 text-xs text-stone-600"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => onToggle(item.id)}
                className="h-3.5 w-3.5 rounded border-stone-300 text-orange focus:ring-orange/30"
              />
              {item.name}
            </label>
          ))}
        </div>
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => onExpandChange(!expanded)}
            className="mt-2 text-[11px] font-semibold text-orange hover:text-warm-500"
          >
            {expanded
              ? "نمایش کمتر"
              : `نمایش ${toPersianDigits(remaining)} مورد بیشتر`}
          </button>
        )}
      </div>
    );
  }

  const fieldsContent = (
    <div className="space-y-6">
      {filters.sortOptions.length > 0 && (
        <div>
          <label
            htmlFor="sort"
            className="mb-1.5 block text-xs font-bold text-stone-700"
          >
            مرتب‌سازی
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOptionValue)}
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-700 outline-none focus:border-orange/40"
          >
            <option value="">پیش‌فرض</option>
            {filters.sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {filters.usageTypes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-stone-700">کارکرد</p>
          <div className="grid grid-cols-2 gap-1">
            {filters.usageTypes.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-xs text-stone-600"
              >
                <input
                  type="checkbox"
                  checked={usageTypes.includes(option.value)}
                  onChange={() =>
                    setUsageTypes((prev) => toggleInArray(prev, option.value))
                  }
                  className="h-3.5 w-3.5 rounded border-stone-300 text-orange focus:ring-orange/30"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <CheckboxList
        label="برند"
        items={filters.brands}
        selected={brandIds}
        onToggle={handleBrandToggle}
        expanded={brandsExpanded}
        onExpandChange={setBrandsExpanded}
      />

      <CheckboxList<CarModelOption>
        label="مدل"
        items={availableModels}
        selected={modelIds}
        onToggle={(id) => setModelIds((prev) => toggleInArray(prev, id))}
        expanded={modelsExpanded}
        onExpandChange={setModelsExpanded}
      />

      {filters.provinces.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-stone-700">استان و شهر</p>
          <div className="space-y-2">
            <select
              value={provinceId ?? ""}
              onChange={(event) => {
                const value = event.target.value
                  ? Number(event.target.value)
                  : undefined;
                setProvinceId(value);
                setCityId(undefined);
              }}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-700 outline-none focus:border-orange/40"
            >
              <option value="">همه استان‌ها</option>
              {filters.provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            {availableCities.length > 0 && (
              <select
                value={cityId ?? ""}
                onChange={(event) =>
                  setCityId(
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-700 outline-none focus:border-orange/40"
              >
                <option value="">همه شهرها</option>
                {availableCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-bold text-stone-700">
          محدوده قیمت (تومان)
        </p>
        <div className="flex items-center gap-2">
          <input
            inputMode="numeric"
            dir="ltr"
            value={formatWithCommas(priceMin)}
            onChange={(event) =>
              setPriceMin(event.target.value.replace(/[^\d]/g, ""))
            }
            placeholder="از"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-700 outline-none focus:border-orange/40"
          />
          <input
            inputMode="numeric"
            dir="ltr"
            value={formatWithCommas(priceMax)}
            onChange={(event) =>
              setPriceMax(event.target.value.replace(/[^\d]/g, ""))
            }
            placeholder="تا"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-700 outline-none focus:border-orange/40"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-stone-700">سال ساخت</p>
        <div className="flex items-center gap-2">
          <input
            inputMode="numeric"
            dir="ltr"
            value={yearMin}
            onChange={(event) =>
              setYearMin(event.target.value.replace(/[^\d]/g, "").slice(0, 4))
            }
            placeholder="از"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-700 outline-none focus:border-orange/40"
          />
          <input
            inputMode="numeric"
            dir="ltr"
            value={yearMax}
            onChange={(event) =>
              setYearMax(event.target.value.replace(/[^\d]/g, "").slice(0, 4))
            }
            placeholder="تا"
            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-700 outline-none focus:border-orange/40"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="mileageMax"
          className="mb-2 block text-xs font-bold text-stone-700"
        >
          حداکثر کارکرد (کیلومتر)
        </label>
        <input
          id="mileageMax"
          inputMode="numeric"
          dir="ltr"
          value={formatWithCommas(mileageMax)}
          onChange={(event) =>
            setMileageMax(event.target.value.replace(/[^\d]/g, ""))
          }
          placeholder="مثلاً 100000"
          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-700 outline-none focus:border-orange/40"
        />
      </div>

      {filters.colors.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-stone-700">رنگ بدنه</p>
          <div className="flex flex-wrap gap-2">
            {(colorsExpanded
              ? filters.colors
              : filters.colors.slice(0, VISIBLE_LIMIT)
            ).map((color) => {
              const isSelected = colorIds.includes(color.id);
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() =>
                    setColorIds((prev) => toggleInArray(prev, color.id))
                  }
                  title={color.name}
                  className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] ${
                    isSelected
                      ? "border-orange/30 bg-orange/10 text-orange"
                      : "border-stone-200 text-stone-600"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-stone-200"
                    style={{ backgroundColor: color.hex_code }}
                  />
                  {color.name}
                </button>
              );
            })}
          </div>
          {filters.colors.length > VISIBLE_LIMIT && (
            <button
              type="button"
              onClick={() => setColorsExpanded((prev) => !prev)}
              className="mt-2 text-[11px] font-semibold text-orange hover:text-warm-500"
            >
              {colorsExpanded
                ? "نمایش کمتر"
                : `نمایش ${toPersianDigits(filters.colors.length - VISIBLE_LIMIT)} مورد بیشتر`}
            </button>
          )}
        </div>
      )}

      {filters.fuelTypes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold text-stone-700">نوع سوخت</p>
          <div className="grid grid-cols-3 gap-2">
            {filters.fuelTypes.map((fuel) => (
              <label
                key={fuel.id}
                className="flex items-center gap-2 text-xs text-stone-600"
              >
                <input
                  type="checkbox"
                  checked={fuelTypeIds.includes(fuel.id)}
                  onChange={() =>
                    setFuelTypeIds((prev) => toggleInArray(prev, fuel.id))
                  }
                  className="h-3.5 w-3.5 rounded border-stone-300 text-orange focus:ring-orange/30"
                />
                {fuel.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const applyClearButtons = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleApply}
        className="flex-1 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5"
      >
        اعمال فیلترها
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-500 hover:border-stone-300"
      >
        پاک کردن
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop: sticky sidebar with its own independent scroll region */}
      <aside className="hidden lg:sticky lg:top-[110px] lg:block lg:max-h-[calc(100vh-150px)] lg:self-start">
        <div className="shadow-card flex max-h-[calc(100vh-150px)] flex-col overflow-hidden rounded-[20px] border border-transparent bg-white">
          <div className="flex-1 overflow-y-auto p-5">{fieldsContent}</div>
          <div className="border-t border-stone-50 p-4">
            {applyClearButtons}
          </div>
        </div>
      </aside>

      {/* Mobile: bama.ir-style filter bar, fixed below the header, moves with it while scrolling */}
      <div className="fixed inset-x-0 top-[68px] z-40 border-b border-stone-100 bg-white/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-stone-800 px-3.5 py-1.5 text-xs font-semibold text-white"
          >
            <FunnelIcon className="h-3.5 w-3.5" />
            فیلترها
          </button>

          {chips.map((chip) =>
            chip.active ? (
              <span
                key={chip.id}
                className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-orange/20 bg-orange/10 px-3 py-1.5 text-xs font-semibold text-orange"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`حذف فیلتر ${chip.label}`}
                  className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-orange/20"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </span>
            ) : (
              <button
                key={chip.id}
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="flex-shrink-0 whitespace-nowrap rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600"
              >
                {chip.label}
              </button>
            ),
          )}
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[24px] bg-white">
            <div className="flex items-center justify-between border-b border-stone-50 p-4">
              <h2 className="text-sm font-bold text-stone-800">فیلترها</h2>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="بستن"
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-50"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{fieldsContent}</div>
            <div className="border-t border-stone-50 p-4">
              {applyClearButtons}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
