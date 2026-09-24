export interface ListingImageDetail {
  id: number;
  path: string;
  order: number;
}

export interface NamedRef {
  id: number;
  name: string;
}

export interface BrandRef extends NamedRef {
  slug: string;
}

export interface CarModelRef extends NamedRef {
  slug: string;
}

export interface GenerationRef extends NamedRef {
  year_from: number;
  year_to: number;
}

export interface CityRef extends NamedRef {
  province: string;
}

export interface ColorRef extends NamedRef {
  hex_code: string;
}

export interface ListingSpec {
  drive_axis: string | null;
  gearbox: string | null;
  engine_code: string | null;
  engine_volume: string | null;
  fuel_type: string | null;
  power_hp: number | null;
  torque_nm: number | null;
  acceleration_sec: number | null;
  top_speed_kmh: number | null;
  fuel_consumption: string | null;
  body_type: string | null;
  chassis_type: string | null;
  length_mm: number | null;
  width_mm: number | null;
  height_mm: number | null;
  wheelbase_mm: number | null;
  weight_kg: number | null;
  fuel_tank_l: number | null;
  tire_front: string | null;
  tire_rear: string | null;
  extra_features: string | null;
}

export interface ListingDetail {
  id: number;
  title: string;
  year: number;
  price: number;
  sale_type: "cash" | "negotiable" | string;
  sale_type_label: string;
  is_exchange: boolean;
  usage_type: "zero" | "used" | "pre_sale" | string;
  usage_type_label: string;
  mileage: number | null;
  delivery_date: string | null;
  description: string | null;
  status: "active" | "sold" | string;
  status_label: string;
  created_at: string;

  brand: BrandRef;
  car_model: CarModelRef;
  generation: GenerationRef;
  trim: NamedRef;

  city: CityRef;

  paintwork_status: NamedRef;
  body_color: ColorRef;
  interior_color: ColorRef | null;

  spec: ListingSpec;
  images: ListingImageDetail[];

  seller: { name: string };
  contact: { phone: string; tel_link: string };

  views_count: number;
}

export interface RelatedListingSummary {
  id: number;
  title: string;
  year: number;
  price: number;
  usage_type: string;
  usage_type_label: string;
  mileage: number | null;
  city: string;
  cover_image: string;
  created_at: string;
}

export interface ListingDetailResponse {
  listing: ListingDetail;
  related_listings: { data: RelatedListingSummary[] };
}
