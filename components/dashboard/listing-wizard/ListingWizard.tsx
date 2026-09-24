"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  extractIdName,
  normalizeFilters,
  wizardApi,
  WizardApiError,
} from "@/lib/listingWizardClient";
import { REVIEW_STEP_ID } from "@/lib/wizardSteps";
import { StepsOverview } from "@/components/dashboard/listing-wizard/StepsOverview";
import { StepBrand } from "@/components/dashboard/listing-wizard/steps/StepBrand";
import { StepModel } from "@/components/dashboard/listing-wizard/steps/StepModel";
import { StepYear } from "@/components/dashboard/listing-wizard/steps/StepYear";
import { StepTrim } from "@/components/dashboard/listing-wizard/steps/StepTrim";
import { StepUsage } from "@/components/dashboard/listing-wizard/steps/StepUsage";
import { StepBody } from "@/components/dashboard/listing-wizard/steps/StepBody";
import { StepLocation } from "@/components/dashboard/listing-wizard/steps/StepLocation";
import { StepPrice } from "@/components/dashboard/listing-wizard/steps/StepPrice";
import { StepDescription } from "@/components/dashboard/listing-wizard/steps/StepDescription";
import { StepImages } from "@/components/dashboard/listing-wizard/steps/StepImages";
import { StepReview } from "@/components/dashboard/listing-wizard/steps/StepReview";
import type { WizardSelections } from "@/components/dashboard/listing-wizard/types";
import type { ListingDraft, SearchFiltersResponse } from "@/types/listingDraft";

type Phase = "loading" | "ready" | "fatal" | "submitted";
type NormalizedFilters = ReturnType<typeof normalizeFilters>;

export function ListingWizard() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("loading");
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  const [filters, setFilters] = useState<NormalizedFilters | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [selections, setSelections] = useState<WizardSelections>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [cancelStage, setCancelStage] = useState<"idle" | "confirm">("idle");
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [{ listing }, rawFilters] = await Promise.all([
          wizardApi.getCurrent(),
          wizardApi.getFilters(),
        ]);
        if (cancelled) return;

        const normalized = normalizeFilters(
          rawFilters as SearchFiltersResponse,
        );
        setFilters(normalized);

        const activeDraft = listing ?? (await wizardApi.start()).listing;
        if (cancelled) return;

        setDraft(activeDraft);

        const resumeStep =
          activeDraft.current_step >= 1 ? activeDraft.current_step : 1;
        setActiveStep(resumeStep);
        setFurthestStep(Math.max(resumeStep, 1));

        // Best-effort rehydration of display labels for a resumed draft — see
        // extractIdName's doc comment for why this can't be fully relied on.
        const brand = extractIdName(activeDraft.brand);
        const model = extractIdName(activeDraft.car_model);
        const bodyColor = extractIdName(activeDraft.body_color);
        const interiorColor = extractIdName(activeDraft.interior_color);
        const paintworkStatus = extractIdName(activeDraft.paintwork_status);
        const city = extractIdName(activeDraft.city);
        const province = city
          ? normalized.provinces.find((p) =>
              p.cities.some((c) => c.id === city.id),
            )
          : undefined;

        setSelections({
          brandId: brand?.id,
          brandName: brand?.name,
          modelId: model?.id,
          modelName: model?.name,
          year: activeDraft.year ?? undefined,
          bodyColorId: bodyColor?.id,
          bodyColorName: bodyColor?.name,
          interiorColorId: interiorColor?.id,
          interiorColorName: interiorColor?.name,
          paintworkStatusId: paintworkStatus?.id,
          paintworkStatusName: paintworkStatus?.name,
          provinceId: province?.id,
          provinceName: province?.name,
          cityId: city?.id,
          cityName: city?.name,
          usageType: activeDraft.usage_type ?? undefined,
          mileage: activeDraft.mileage ?? undefined,
          deliveryDate: activeDraft.delivery_date ?? undefined,
          saleType: activeDraft.sale_type ?? undefined,
          price: activeDraft.price ?? undefined,
          isExchange: activeDraft.is_exchange,
          description: activeDraft.description ?? undefined,
        });

        setPhase("ready");
      } catch (err) {
        if (!cancelled) {
          setFatalError(
            err instanceof WizardApiError
              ? err.message
              : "بارگذاری اطلاعات با خطا مواجه شد.",
          );
          setPhase("fatal");
        }
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  function goToStep(step: number) {
    setActiveStep(step);
    setFurthestStep((prev) => Math.max(prev, step));
  }

  /**
   * Brand/model/year are chain-dependent: changing any of them clears the
   * fields downstream and the server's current_step can genuinely DECREASE
   * (not just increase) — e.g. editing brand after already reaching step 7
   * snaps current_step back to 2, because steps 3-7's data just got wiped.
   * furthestStep must follow that exactly rather than only ever growing, or
   * the steps overview would keep showing now-invalid steps as completed.
   */
  function jumpToServerStep(serverCurrentStep: number) {
    setActiveStep(serverCurrentStep);
    setFurthestStep(serverCurrentStep);
  }

  async function handleCancel() {
    if (cancelStage === "idle") {
      setCancelStage("confirm");
      setTimeout(
        () => setCancelStage((stage) => (stage === "confirm" ? "idle" : stage)),
        4000,
      );
      return;
    }
    if (!draft) return;
    setIsCanceling(true);
    try {
      await wizardApi.cancel(draft.id);
      router.push("/dashboard?tab=my-ads");
    } catch {
      setIsCanceling(false);
      setCancelStage("idle");
    }
  }

  if (phase === "loading") {
    return (
      <div className="shadow-bento mx-auto w-full max-w-2xl animate-pulse rounded-[28px] bg-white p-8">
        <div className="mb-4 h-5 w-40 rounded bg-stone-100" />
        <div className="h-24 rounded bg-stone-100" />
      </div>
    );
  }

  if (phase === "fatal") {
    return (
      <div className="shadow-bento mx-auto w-full max-w-2xl rounded-[28px] bg-white p-8 text-center">
        <p className="mb-4 text-sm text-stone-500">{fatalError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (phase === "submitted") {
    return (
      <div className="shadow-bento mx-auto w-full max-w-2xl rounded-[28px] bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/10">
          <svg
            className="h-7 w-7 text-orange"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-bold text-stone-800">
          آگهی شما ثبت شد
        </h2>
        <p className="mb-6 text-sm text-stone-400">{submittedMessage}</p>
        <a
          href="/dashboard?tab=my-ads"
          className="inline-block rounded-xl bg-orange px-6 py-2.5 text-sm font-semibold text-white shadow-md"
        >
          مشاهده آگهی‌های من
        </a>
      </div>
    );
  }

  if (!draft || !filters) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs text-stone-400">
          پیش‌نویس شما به‌صورت خودکار ذخیره می‌شود
        </p>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isCanceling}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            cancelStage === "confirm"
              ? "bg-red-500 text-white"
              : "text-stone-400 hover:text-red-500"
          }`}
        >
          {isCanceling
            ? "در حال حذف..."
            : cancelStage === "confirm"
              ? "مطمئنید؟ برای تایید بزنید"
              : "لغو ثبت‌ آگهی"}
        </button>
      </div>

      <StepsOverview
        activeStep={activeStep}
        furthestStep={furthestStep}
        onJump={goToStep}
      />

      {activeStep === 1 && (
        <StepBrand
          draftId={draft.id}
          brands={filters.brands}
          selectedBrandId={selections.brandId}
          onComplete={(listing, brand) => {
            setDraft(listing);
            setSelections((prev) => ({
              ...prev,
              brandId: brand.id,
              brandName: brand.name,
              modelId: undefined,
              modelName: undefined,
              year: undefined,
              trimId: undefined,
              trimLabel: undefined,
            }));
            jumpToServerStep(listing.current_step);
          }}
        />
      )}

      {activeStep === 2 && selections.brandId && (
        <StepModel
          draftId={draft.id}
          brandName={selections.brandName ?? ""}
          models={
            filters.brands.find((b) => b.id === selections.brandId)?.models ??
            []
          }
          selectedModelId={selections.modelId}
          onComplete={(listing, model) => {
            setDraft(listing);
            setSelections((prev) => ({
              ...prev,
              modelId: model.id,
              modelName: model.name,
              year: undefined,
              trimId: undefined,
              trimLabel: undefined,
            }));
            jumpToServerStep(listing.current_step);
          }}
          onBack={() => goToStep(1)}
        />
      )}

      {activeStep === 3 && (
        <StepYear
          draftId={draft.id}
          modelName={selections.modelName ?? ""}
          selectedYear={selections.year}
          onComplete={(listing, year) => {
            setDraft(listing);
            setSelections((prev) => ({
              ...prev,
              year,
              trimId: undefined,
              trimLabel: undefined,
            }));
            jumpToServerStep(listing.current_step);
          }}
          onBack={() => goToStep(2)}
        />
      )}

      {activeStep === 4 && selections.year && (
        <StepTrim
          draftId={draft.id}
          year={selections.year}
          selectedTrimId={selections.trimId}
          onComplete={(listing, trim) => {
            setDraft(listing);
            setSelections((prev) => ({
              ...prev,
              trimId: trim.id,
              trimLabel: `${trim.name} (${trim.generation_name})`,
            }));
            goToStep(5);
          }}
          onBack={() => goToStep(3)}
        />
      )}

      {activeStep === 5 && (
        <StepUsage
          draftId={draft.id}
          usageTypes={filters.usageTypes}
          selectedUsageType={selections.usageType}
          selectedMileage={selections.mileage}
          selectedDeliveryDate={selections.deliveryDate}
          onComplete={(listing, values) => {
            setDraft(listing);
            setSelections((prev) => ({ ...prev, ...values }));
            goToStep(6);
          }}
          onBack={() => goToStep(4)}
        />
      )}

      {activeStep === 6 && (
        <StepBody
          draftId={draft.id}
          colors={filters.colors}
          paintworkStatuses={filters.paintworkStatuses}
          selectedBodyColorId={selections.bodyColorId}
          selectedInteriorColorId={selections.interiorColorId}
          selectedPaintworkStatusId={selections.paintworkStatusId}
          onComplete={(listing, values) => {
            setDraft(listing);
            setSelections((prev) => ({
              ...prev,
              bodyColorId: values.bodyColor.id,
              bodyColorName: values.bodyColor.name,
              interiorColorId: values.interiorColor?.id,
              interiorColorName: values.interiorColor?.name,
              paintworkStatusId: values.paintworkStatus.id,
              paintworkStatusName: values.paintworkStatus.name,
            }));
            goToStep(7);
          }}
          onBack={() => goToStep(5)}
        />
      )}

      {activeStep === 7 && (
        <StepLocation
          draftId={draft.id}
          provinces={filters.provinces}
          selectedProvinceId={selections.provinceId}
          selectedCityId={selections.cityId}
          onComplete={(listing, values) => {
            setDraft(listing);
            setSelections((prev) => ({
              ...prev,
              provinceId: values.province.id,
              provinceName: values.province.name,
              cityId: values.city.id,
              cityName: values.city.name,
            }));
            goToStep(8);
          }}
          onBack={() => goToStep(6)}
        />
      )}

      {activeStep === 8 && (
        <StepPrice
          draftId={draft.id}
          saleTypes={filters.saleTypes}
          selectedSaleType={selections.saleType}
          selectedPrice={selections.price}
          selectedIsExchange={selections.isExchange}
          onComplete={(listing, values) => {
            setDraft(listing);
            setSelections((prev) => ({ ...prev, ...values }));
            goToStep(9);
          }}
          onBack={() => goToStep(7)}
        />
      )}

      {activeStep === 9 && (
        <StepDescription
          draftId={draft.id}
          selectedDescription={selections.description}
          onComplete={(listing, description) => {
            setDraft(listing);
            setSelections((prev) => ({ ...prev, description }));
            goToStep(10);
          }}
          onBack={() => goToStep(8)}
        />
      )}

      {activeStep === 10 && (
        <StepImages
          draftId={draft.id}
          images={draft.images}
          onImagesChange={(images) =>
            setDraft((prev) => (prev ? { ...prev, images } : prev))
          }
          onContinue={() => goToStep(REVIEW_STEP_ID)}
          onBack={() => goToStep(9)}
        />
      )}

      {activeStep === REVIEW_STEP_ID && (
        <StepReview
          draftId={draft.id}
          draft={draft}
          selections={selections}
          onSubmitted={(message) => {
            setSubmittedMessage(message);
            setPhase("submitted");
          }}
          onJumpToStep={goToStep}
          onBack={() => goToStep(10)}
        />
      )}
    </div>
  );
}
