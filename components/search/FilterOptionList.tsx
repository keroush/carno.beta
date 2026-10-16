"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { toPersianDigits } from "@/lib/persianNumber";
import type { ColorOption } from "@/types/search";

/** How many options a filter shows inline before the rest move into the "show more" dialog. */
const VISIBLE_LIMIT = 6;

/**
 * Styled like the sidebar's <select> dropdowns. Notes how many of the options
 * hidden behind it are already ticked, so a selection never "disappears" from view.
 */
function MoreButton({ remaining, selectedHidden, onClick }: { remaining: number; selectedHidden: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="mt-2 flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700 outline-none transition-colors hover:border-orange/40 focus-visible:border-orange/40"
    >
      <span>
        نمایش {toPersianDigits(remaining)} مورد بیشتر
        {selectedHidden > 0 && <span className="text-orange"> · {toPersianDigits(selectedHidden)} انتخاب‌شده</span>}
      </span>
      <svg className="h-3.5 w-3.5 flex-shrink-0 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
      </svg>
    </button>
  );
}

function ConfirmButton({ selectedCount, onClick }: { selectedCount: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      تایید{selectedCount > 0 && ` (${toPersianDigits(selectedCount)} انتخاب‌شده)`}
    </button>
  );
}

interface CheckboxOptionListProps<T extends { id: number; name: string }> {
  label: string;
  items: T[];
  selected: number[];
  onToggle: (id: number) => void;
}

/**
 * A checkbox filter. The first few options show inline; if there are more, a
 * "show more" button opens a dialog listing *all* of them. Ticks in the dialog
 * apply immediately (same state as the inline boxes). The dialog closes on a
 * click anywhere outside it, Esc, ×, or the confirm button.
 *
 * Deliberately a top-level component, not one defined inside FilterSidebar's
 * render: that would be a new component type every render and remount (closing
 * the dialog) on each toggle.
 */
export function CheckboxOptionList<T extends { id: number; name: string }>({ label, items, selected, onToggle }: CheckboxOptionListProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  if (items.length === 0) return null;

  const visible = items.slice(0, VISIBLE_LIMIT);
  const hidden = items.slice(VISIBLE_LIMIT);
  const selectedHidden = hidden.filter((item) => selected.includes(item.id)).length;
  const selectedCount = items.filter((item) => selected.includes(item.id)).length;

  const renderRow = (item: T, padded: boolean) => (
    <label key={item.id} className={`flex cursor-pointer items-center gap-2 text-xs text-stone-600 ${padded ? "py-1.5" : ""}`}>
      <input
        type="checkbox"
        checked={selected.includes(item.id)}
        onChange={() => onToggle(item.id)}
        className="h-3.5 w-3.5 rounded border-stone-300 text-orange focus:ring-orange/30"
      />
      {item.name}
    </label>
  );

  return (
    <div>
      <p className="mb-2 text-xs font-bold text-stone-700">{label}</p>
      <div className="grid grid-cols-2 gap-2">{visible.map((item) => renderRow(item, false))}</div>
      {hidden.length > 0 && <MoreButton remaining={hidden.length} selectedHidden={selectedHidden} onClick={() => setIsOpen(true)} />}

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title={label} footer={<ConfirmButton selectedCount={selectedCount} onClick={() => setIsOpen(false)} />}>
        <div className="grid grid-cols-2 gap-x-4">{items.map((item) => renderRow(item, true))}</div>
      </Modal>
    </div>
  );
}

interface ColorOptionListProps {
  label?: string;
  colors: ColorOption[];
  selected: number[];
  onToggle: (id: number) => void;
}

/** Same behavior as CheckboxOptionList, rendered as colour swatch chips. */
export function ColorOptionList({ label = "رنگ بدنه", colors, selected, onToggle }: ColorOptionListProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (colors.length === 0) return null;

  const visible = colors.slice(0, VISIBLE_LIMIT);
  const hidden = colors.slice(VISIBLE_LIMIT);
  const selectedHidden = hidden.filter((color) => selected.includes(color.id)).length;
  const selectedCount = colors.filter((color) => selected.includes(color.id)).length;

  const renderChip = (color: ColorOption) => {
    const isSelected = selected.includes(color.id);
    return (
      <button
        key={color.id}
        type="button"
        onClick={() => onToggle(color.id)}
        title={color.name}
        aria-pressed={isSelected}
        className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] ${
          isSelected ? "border-orange/30 bg-orange/10 text-orange" : "border-stone-200 text-stone-600"
        }`}
      >
        <span className="h-3 w-3 rounded-full border border-stone-200" style={{ backgroundColor: color.hex_code }} />
        {color.name}
      </button>
    );
  };

  return (
    <div>
      <p className="mb-2 text-xs font-bold text-stone-700">{label}</p>
      <div className="flex flex-wrap gap-2">{visible.map(renderChip)}</div>
      {hidden.length > 0 && <MoreButton remaining={hidden.length} selectedHidden={selectedHidden} onClick={() => setIsOpen(true)} />}

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title={label} footer={<ConfirmButton selectedCount={selectedCount} onClick={() => setIsOpen(false)} />}>
        <div className="flex flex-wrap gap-2">{colors.map(renderChip)}</div>
      </Modal>
    </div>
  );
}
