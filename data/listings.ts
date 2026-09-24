import type { AdCategoryTab, Brand, CarListing, MarketStat } from "@/types/listing";

/**
 * Stand-ins for calls to Karno's internal listings service.
 * The artificial delay mirrors real network latency so the
 * Suspense boundaries around these calls have something to show for themselves.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMarketStats(): Promise<MarketStat[]> {
  await delay(400);
  return [
    { id: "active", value: "۱۲,۴۵۰", label: "خودروی فعال", tone: "orange" },
    { id: "monthly", value: "۸,۹۲۰", label: "معامله این ماه", tone: "sky" },
    { id: "rating", value: "۴.۹", label: "رضایت کاربران", tone: "neutral" },
    { id: "support", value: "۲۴h", label: "پشتیبانی", tone: "peach" },
  ];
}

export async function getFeaturedListing(): Promise<CarListing> {
  await delay(500);
  return {
    id: "santafe-2024",
    title: "هیوندای سانتافه ۲۰۲۴",
    usageType: "zero",
    year: "۱۴۰۳",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۲,۴۱۰",
    price: "۲.۸۵۰ میلیون تومان",
    postedAt: "امروز",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    imageAlt: "هیوندای سانتافه",
  };
}

export async function getSecondaryListings(): Promise<CarListing[]> {
  await delay(450);
  return [
    {
      id: "bmw-330i",
      title: "ب‌ام‌و سری ۳ — ۳۳۰i",
      usageType: "used",
      mileage: 28000,
      year: "۱۴۰۲",
      city: "تهران",
      transmission: "اتوماتیک",
      views: "۱,۸۵۰",
      price: "۱.۹۵۰ میلیون",
      priceLabel: "قیمت نهایی",
      postedAt: "۱ روز پیش",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
      imageAlt: "ب‌ام‌و سری ۳",
    },
    {
      id: "porsche-cayman",
      title: "پورشه کیمن S",
      usageType: "used",
      mileage: 15000,
      year: "۱۴۰۱",
      city: "تهران",
      transmission: "اتوماتیک",
      views: "۹۲۰",
      price: "۱۲.۵۰۰ میلیون",
      postedAt: "۲ روز پیش",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
      imageAlt: "پورشه کیمن",
    },
  ];
}

export async function getBrands(): Promise<Brand[]> {
  await delay(350);
  return [
    { id: "ik", name: "ایران‌خودرو", initials: "IK", count: "۴,۵۲۰ خودرو", tone: "orange" },
    { id: "sa", name: "سایپا", initials: "SA", count: "۳,۸۱۰ خودرو", tone: "sky" },
    { id: "hy", name: "هیوندای", initials: "HY", count: "۲,۱۴۰ خودرو", tone: "neutral" },
    { id: "bm", name: "ب‌ام‌و", initials: "BM", count: "۹۸۰ خودرو", tone: "neutral" },
    { id: "bz", name: "مرسدس بنز", initials: "BZ", count: "۷۶۰ خودرو", tone: "neutral" },
    { id: "ki", name: "کیا", initials: "KI", count: "۱,۳۲۰ خودرو", tone: "neutral" },
    { id: "ty", name: "تویوتا", initials: "TY", count: "۱,۶۵۰ خودرو", tone: "neutral" },
    { id: "po", name: "پژو", initials: "PO", count: "۲,۹۸۰ خودرو", tone: "neutral" },
    { id: "rn", name: "رنو", initials: "RN", count: "۸۹۰ خودرو", tone: "neutral" },
    { id: "ch", name: "چری", initials: "CH", count: "۱,۱۰۰ خودرو", tone: "neutral" },
    { id: "mg", name: "ام‌جی", initials: "MG", count: "۷۴۰ خودرو", tone: "neutral" },
    { id: "all", name: "همه برندها", initials: "+", count: "۴۰+ برند", tone: "neutral" },
  ];
}

/**
 * The full ad pool backing the homepage's "latest ads" carousel, the
 * category-tab carousel, and the /listings page. `tags` says which of the
 * four category tabs (جدیدترین‌ها / پربازدیدترین / اقتصادی / لوکس) an ad
 * qualifies for — a single ad can show up under more than one tab.
 */
interface MasterListing extends CarListing {
  tags: AdCategoryTab[];
}

const masterListings: MasterListing[] = [
  {
    id: "santafe",
    title: "هیوندای سانتافه ۲۰۲۴",
    usageType: "zero",
    year: "۱۴۰۳",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۲,۴۱۰",
    price: "۲.۸۵۰ میلیون",
    postedAt: "امروز",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    imageAlt: "هیوندای سانتافه",
    tags: ["new", "luxury"],
  },
  {
    id: "lexus-rx350h",
    title: "لکسوس RX 350h",
    usageType: "zero",
    year: "۱۴۰۳",
    city: "اصفهان",
    transmission: "هیبرید",
    views: "۱,۲۴۰",
    price: "۱۵.۸۰۰ میلیون",
    postedAt: "دیروز",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=350&fit=crop",
    imageAlt: "لکسوس RX",
    tags: ["new", "luxury"],
  },
  {
    id: "peugeot-206",
    title: "پژو ۲۰۶ تیپ ۲",
    usageType: "used",
    mileage: 98000,
    year: "۱۳۹۹",
    city: "کرج",
    transmission: "دنده‌ای",
    views: "۱,۱۲۰",
    price: "۶۸۰ میلیون",
    postedAt: "۲ روز پیش",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&h=350&fit=crop",
    imageAlt: "پژو ۲۰۶",
    tags: ["economy", "popular"],
  },
  {
    id: "tara",
    title: "تارا اتوماتیک",
    usageType: "used",
    mileage: 32000,
    year: "۱۴۰۲",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۹۴۰",
    price: "۱.۸۵۰ میلیون",
    postedAt: "۳ روز پیش",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=350&fit=crop",
    imageAlt: "تارا اتوماتیک",
    tags: ["new", "economy"],
  },
  {
    id: "tiggo7",
    title: "تیگو ۷ پرو",
    usageType: "used",
    mileage: 61000,
    year: "۱۴۰۱",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۵,۶۷۰",
    price: "۲.۱۵۰ میلیون",
    postedAt: "۳ روز پیش",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=350&fit=crop",
    imageAlt: "تیگو ۷ پرو",
    tags: ["popular"],
  },
  {
    id: "vw-golf-gti",
    title: "فولکس واگن گلف GTI",
    usageType: "used",
    mileage: 45000,
    year: "۱۴۰۲",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۸۹۰",
    price: "توافقی",
    postedAt: "۲ روز پیش",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&h=350&fit=crop",
    imageAlt: "فولکس واگن گلف",
    tags: ["luxury"],
  },
  {
    id: "nissan-xtrail",
    title: "نیسان ایکس‌تریل",
    usageType: "zero",
    year: "۱۴۰۳",
    city: "مشهد",
    transmission: "CVT",
    views: "۱,۵۶۰",
    price: "۳.۲۰۰ میلیون",
    postedAt: "۳ روز پیش",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500&h=350&fit=crop",
    imageAlt: "نیسان ایکس‌تریل",
    tags: ["new", "popular"],
  },
  {
    id: "bmw-330i",
    title: "ب‌ام‌و سری ۳ — ۳۳۰i",
    usageType: "used",
    mileage: 28000,
    year: "۱۴۰۲",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۱,۸۵۰",
    price: "۱.۹۵۰ میلیون",
    priceLabel: "قیمت نهایی",
    postedAt: "۱ روز پیش",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    imageAlt: "ب‌ام‌و سری ۳",
    tags: ["popular", "luxury"],
  },
  {
    id: "porsche-cayman",
    title: "پورشه کیمن S",
    usageType: "used",
    mileage: 15000,
    year: "۱۴۰۱",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۹۲۰",
    price: "۱۲.۵۰۰ میلیون",
    postedAt: "۲ روز پیش",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
    imageAlt: "پورشه کیمن",
    tags: ["luxury"],
  },
  {
    id: "kia-sportage",
    title: "کیا اسپورتیج",
    usageType: "used",
    mileage: 40000,
    year: "۱۴۰۲",
    city: "شیراز",
    transmission: "اتوماتیک",
    views: "۶,۱۲۰",
    price: "۳.۴۵۰ میلیون",
    postedAt: "۴ روز پیش",
    image: "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=500&h=350&fit=crop",
    imageAlt: "کیا اسپورتیج",
    tags: ["popular", "new"],
  },
  {
    id: "toyota-camry",
    title: "تویوتا کمری هیبرید",
    usageType: "zero",
    year: "۱۴۰۳",
    city: "تهران",
    transmission: "هیبرید",
    views: "۴,۳۲۰",
    price: "۵.۲۰۰ میلیون",
    postedAt: "دیروز",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&h=350&fit=crop",
    imageAlt: "تویوتا کمری",
    tags: ["popular", "luxury"],
  },
  {
    id: "renault-sandero",
    title: "رنو ساندرو (L90)",
    usageType: "used",
    mileage: 152000,
    year: "۱۳۹۷",
    city: "مشهد",
    transmission: "اتوماتیک",
    views: "۹۸۰",
    price: "۵۲۰ میلیون",
    postedAt: "۱ هفته پیش",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&h=350&fit=crop",
    imageAlt: "رنو ساندرو",
    tags: ["economy"],
  },
  {
    id: "mercedes-eclass",
    title: "مرسدس بنز E200",
    usageType: "pre_sale",
    year: "۱۴۰۳",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۳,۴۲۰",
    price: "۸.۹۰۰ میلیون",
    postedAt: "۲ روز پیش",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=350&fit=crop",
    imageAlt: "مرسدس بنز E200",
    tags: ["luxury"],
  },
  {
    id: "bmw-m4",
    title: "ب‌ام‌و M4 کامپتیشن",
    usageType: "used",
    mileage: 12000,
    year: "۱۴۰۱",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۸,۹۱۰",
    price: "۲۲.۵۰۰ میلیون",
    postedAt: "۵ روز پیش",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ba9dd?w=500&h=350&fit=crop",
    imageAlt: "ب‌ام‌و M4",
    tags: ["popular", "luxury"],
  },
  {
    id: "dena-plus",
    title: "دنا پلاس توربو",
    usageType: "pre_sale",
    year: "۱۴۰۲",
    city: "تبریز",
    transmission: "اتوماتیک",
    views: "۷۶۰",
    price: "۱.۱۵۰ میلیون",
    postedAt: "۴ روز پیش",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&h=350&fit=crop",
    imageAlt: "دنا پلاس",
    tags: ["economy", "new"],
  },
  {
    id: "shahin",
    title: "شاهین G دنده‌ای",
    usageType: "pre_sale",
    year: "۱۴۰۲",
    city: "اهواز",
    transmission: "دنده‌ای",
    views: "۵۴۰",
    price: "۹۸۰ میلیون",
    postedAt: "۶ روز پیش",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=350&fit=crop",
    imageAlt: "شاهین",
    tags: ["economy", "new"],
  },
];

function stripTags(listing: MasterListing): CarListing {
  const { id, title, usageType, mileage, year, city, transmission, views, price, priceLabel, postedAt, image, imageAlt } =
    listing;
  return { id, title, usageType, mileage, year, city, transmission, views, price, priceLabel, postedAt, image, imageAlt };
}

export async function getLatestListings(limit = 12): Promise<CarListing[]> {
  await delay(700);
  return masterListings.slice(0, limit).map(stripTags);
}

export async function getAllListings(): Promise<CarListing[]> {
  await delay(500);
  return masterListings.map(stripTags);
}

export async function getAdsByCategory(tab: AdCategoryTab): Promise<CarListing[]> {
  await delay(300);
  return masterListings.filter((listing) => listing.tags.includes(tab)).map(stripTags);
}
