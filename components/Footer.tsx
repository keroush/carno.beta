const serviceLinks = ["خرید خودرو", "فروش خودرو", "اجاره بلندمدت", "مقایسه خودرو"];
const companyLinks = ["درباره ما", "تماس با ما", "قوانین و مقررات", "حریم خصوصی"];

export function Footer() {
  return (
    <footer className="border-t border-stone-100/80 py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="shadow-glow flex h-9 w-9 items-center justify-center rounded-xl bg-orange">
                <svg className="h-[18px] w-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-lg font-bold text-stone-800">کارنو</span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-stone-400">
              بزرگترین بازارگاه خودروی ایران با هدف شفاف‌سازی قیمت‌ها و تسهیل فرآیند خرید و فروش خودرو
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-stone-800">خدمات</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-stone-400 transition-colors hover:text-orange">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-stone-800">کارنو</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-stone-400 transition-colors hover:text-orange">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-stone-800">تماس</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>۰۲۱-۴۵۶۷۸۹۰۰</li>
              <li>support@karno.ir</li>
              <li>تهران، خیابان ولیعصر</li>
            </ul>
          </div>
        </div>

        <div className="divider-gradient mb-6" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-stone-300">تمامی حقوق محفوظ است. کارنو ۱۴۰۳</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[11px] text-stone-300 transition-colors hover:text-orange">
              قوانین
            </a>
            <a href="#" className="text-[11px] text-stone-300 transition-colors hover:text-orange">
              حریم خصوصی
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
