import { toPersianDigits } from "@/lib/persianNumber";
import type { ListingSpec } from "@/types/listingDetail";

interface SpecRow {
  label: string;
  value: string;
}

function buildSpecRows(spec: ListingSpec): SpecRow[] {
  const rows: (SpecRow | null)[] = [
    spec.body_type ? { label: "نوع بدنه", value: spec.body_type } : null,
    spec.gearbox ? { label: "گیربکس", value: spec.gearbox } : null,
    spec.drive_axis ? { label: "نوع دیفرانسیل", value: spec.drive_axis } : null,
    spec.fuel_type ? { label: "نوع سوخت", value: spec.fuel_type } : null,
    spec.engine_volume ? { label: "حجم موتور", value: `${toPersianDigits(spec.engine_volume)} لیتر` } : null,
    spec.engine_code ? { label: "کد موتور", value: spec.engine_code } : null,
    spec.power_hp !== null ? { label: "قدرت موتور", value: `${toPersianDigits(spec.power_hp)} اسب بخار` } : null,
    spec.torque_nm !== null ? { label: "گشتاور", value: `${toPersianDigits(spec.torque_nm)} نیوتن‌متر` } : null,
    spec.acceleration_sec !== null ? { label: "شتاب صفر تا صد", value: `${toPersianDigits(spec.acceleration_sec)} ثانیه` } : null,
    spec.top_speed_kmh !== null ? { label: "حداکثر سرعت", value: `${toPersianDigits(spec.top_speed_kmh)} کیلومتر بر ساعت` } : null,
    spec.fuel_consumption ? { label: "مصرف سوخت", value: spec.fuel_consumption } : null,
    spec.chassis_type ? { label: "نوع شاسی", value: spec.chassis_type } : null,
    spec.length_mm !== null ? { label: "طول", value: `${toPersianDigits(spec.length_mm)} میلی‌متر` } : null,
    spec.width_mm !== null ? { label: "عرض", value: `${toPersianDigits(spec.width_mm)} میلی‌متر` } : null,
    spec.height_mm !== null ? { label: "ارتفاع", value: `${toPersianDigits(spec.height_mm)} میلی‌متر` } : null,
    spec.wheelbase_mm !== null ? { label: "فاصله محورها", value: `${toPersianDigits(spec.wheelbase_mm)} میلی‌متر` } : null,
    spec.weight_kg !== null ? { label: "وزن", value: `${toPersianDigits(spec.weight_kg)} کیلوگرم` } : null,
    spec.fuel_tank_l !== null ? { label: "حجم باک سوخت", value: `${toPersianDigits(spec.fuel_tank_l)} لیتر` } : null,
    spec.tire_front ? { label: "لاستیک جلو", value: spec.tire_front } : null,
    spec.tire_rear ? { label: "لاستیک عقب", value: spec.tire_rear } : null,
    spec.extra_features ? { label: "امکانات اضافه", value: spec.extra_features } : null,
  ];
  return rows.filter((row): row is SpecRow => row !== null);
}

export function SpecList({ spec }: { spec: ListingSpec }) {
  const rows = buildSpecRows(spec);
  if (rows.length === 0) return null;

  return (
    <div className="shadow-card rounded-[20px] border border-transparent bg-white p-6">
      <h2 className="mb-4 text-sm font-bold text-stone-800">مشخصات فنی</h2>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between border-b border-stone-50 pb-2.5 text-sm">
            <dt className="text-stone-400">{row.label}</dt>
            <dd className="font-semibold text-stone-700">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
