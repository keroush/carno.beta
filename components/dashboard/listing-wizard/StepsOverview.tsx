"use client";

import { REVIEW_STEP_ID, WIZARD_STEPS } from "@/lib/wizardSteps";

interface StepsOverviewProps {
  activeStep: number;
  furthestStep: number;
  onJump: (step: number) => void;
}

const allSteps = [...WIZARD_STEPS, { id: REVIEW_STEP_ID, key: "review" as const, title: "بازبینی و ثبت نهایی", shortLabel: "ثبت نهایی" }];

export function StepsOverview({ activeStep, furthestStep, onJump }: StepsOverviewProps) {
  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <ol className="flex min-w-max items-center gap-1.5">
        {allSteps.map((step, index) => {
          const isCompleted = step.id < furthestStep;
          const isActive = step.id === activeStep;
          const isReachable = step.id <= furthestStep;

          return (
            <li key={step.id} className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={!isReachable}
                onClick={() => isReachable && onJump(step.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-orange text-white shadow-md"
                    : isCompleted
                      ? "bg-orange/10 text-orange hover:bg-orange/15"
                      : "bg-stone-50 text-stone-300"
                } ${!isReachable ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white text-orange" : isCompleted ? "bg-orange text-white" : "bg-stone-200 text-stone-400"
                  }`}
                >
                  {isCompleted ? "✓" : step.id}
                </span>
                <span className="whitespace-nowrap">{step.shortLabel}</span>
              </button>
              {index < allSteps.length - 1 && <span className="h-px w-3 bg-stone-200" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
