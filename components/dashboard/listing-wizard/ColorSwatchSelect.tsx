"use client";

import type { ColorOption } from "@/types/listingDraft";

interface ColorSwatchSelectProps {
  colors: ColorOption[];
  value?: number;
  onChange: (colorId: number | undefined) => void;
  allowClear?: boolean;
}

export function ColorSwatchSelect({ colors, value, onChange, allowClear }: ColorSwatchSelectProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {allowClear && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
            value === undefined ? "border-orange/30 bg-orange/10 text-orange" : "border-stone-200 text-stone-500 hover:border-orange/20"
          }`}
        >
          بدون انتخاب
        </button>
      )}
      {colors.map((color) => {
        const isSelected = value === color.id;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onChange(color.id)}
            title={color.name}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              isSelected ? "border-orange/30 bg-orange/10 text-orange" : "border-stone-200 text-stone-600 hover:border-orange/20"
            }`}
          >
            <span
              className="h-4 w-4 flex-shrink-0 rounded-full border border-stone-200"
              style={{ backgroundColor: color.hex_code }}
            />
            {color.name}
          </button>
        );
      })}
    </div>
  );
}
