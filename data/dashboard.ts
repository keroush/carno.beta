import type { MyAdListing, MyAdStatus, SavedAdListing } from "@/types/dashboard";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const myAds: MyAdListing[] = [
  {
    id: "my-tara",
    title: "تارا اتوماتیک",
    usageType: "used",
    mileage: 32000,
    year: "۱۴۰۲",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۳۴۰",
    price: "۱.۸۵۰ میلیون",
    postedAt: "۵ روز پیش",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=350&fit=crop",
    imageAlt: "تارا اتوماتیک",
    status: "active",
  },
  {
    id: "my-206",
    title: "پژو ۲۰۶ تیپ ۲",
    usageType: "used",
    mileage: 98000,
    year: "۱۳۹۹",
    city: "کرج",
    transmission: "دنده‌ای",
    views: "۱۲۰",
    price: "۶۸۰ میلیون",
    postedAt: "۲ هفته پیش",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&h=350&fit=crop",
    imageAlt: "پژو ۲۰۶",
    status: "active",
  },
  {
    id: "my-tiggo",
    title: "تیگو ۷ پرو",
    usageType: "used",
    mileage: 61000,
    year: "۱۴۰۱",
    city: "تهران",
    transmission: "اتوماتیک",
    views: "۰",
    price: "—",
    postedAt: "امروز",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=350&fit=crop",
    imageAlt: "تیگو ۷ پرو",
    status: "incomplete",
    completionPercent: 60,
  },
  {
    id: "my-l90",
    title: "رنو ساندرو (L90)",
    usageType: "used",
    mileage: 152000,
    year: "۱۳۹۷",
    city: "مشهد",
    transmission: "اتوماتیک",
    views: "۹۸۰",
    price: "۵۲۰ میلیون",
    postedAt: "۱ ماه پیش",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&h=350&fit=crop",
    imageAlt: "رنو ساندرو",
    status: "inactive",
    inactiveReason: "فروخته شد",
  },
  {
    id: "my-santafe",
    title: "هیوندای سانتافه",
    usageType: "used",
    mileage: 44000,
    year: "۱۴۰۰",
    city: "اصفهان",
    transmission: "اتوماتیک",
    views: "۲,۱۰۰",
    price: "۲.۹۰۰ میلیون",
    postedAt: "۲ ماه پیش",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    imageAlt: "هیوندای سانتافه",
    status: "inactive",
    inactiveReason: "توسط پشتیبانی غیرفعال شد",
  },
];

export async function getMyAds(): Promise<Record<MyAdStatus, MyAdListing[]>> {
  await delay(500);
  return {
    active: myAds.filter((ad) => ad.status === "active"),
    incomplete: myAds.filter((ad) => ad.status === "incomplete"),
    inactive: myAds.filter((ad) => ad.status === "inactive"),
  };
}

export async function getSavedAds(): Promise<SavedAdListing[]> {
  await delay(450);
  return [
    {
      id: "saved-camry",
      title: "تویوتا کمری هیبرید",
      usageType: "used",
      mileage: 12000,
      year: "۱۴۰۳",
      city: "تهران",
      transmission: "هیبرید",
      views: "۴,۳۲۰",
      price: "۵.۲۰۰ میلیون",
      postedAt: "دیروز",
      image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&h=350&fit=crop",
      imageAlt: "تویوتا کمری",
      savedAt: "۲ روز پیش",
    },
    {
      id: "saved-sportage",
      title: "کیا اسپورتیج",
      usageType: "used",
      mileage: 34000,
      year: "۱۴۰۲",
      city: "شیراز",
      transmission: "اتوماتیک",
      views: "۶,۱۲۰",
      price: "۳.۴۵۰ میلیون",
      postedAt: "۳ روز پیش",
      image: "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=500&h=350&fit=crop",
      imageAlt: "کیا اسپورتیج",
      savedAt: "۵ روز پیش",
    },
  ];
}
