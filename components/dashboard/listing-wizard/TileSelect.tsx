"use client";

interface TileOption {
  value: string | number;
  label: string;
  sublabel?: string;
}

interface TileSelectProps {
  options: TileOption[];
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  columns?: 2 | 3 | 4;
}

export function TileSelect({ options, value, onChange, columns = 3 }: TileSelectProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-2.5`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-4 py-3 text-right text-sm font-semibold transition-colors ${
              isSelected
                ? "border-orange/30 bg-orange/10 text-orange"
                : "border-stone-200 text-stone-600 hover:border-orange/20 hover:text-orange"
            }`}
          >
            {option.label}
            {option.sublabel && <span className="mt-0.5 block text-[11px] font-normal text-stone-400">{option.sublabel}</span>}
          </button>
        );
      })}
    </div>
  );
}
