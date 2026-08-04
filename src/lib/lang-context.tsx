import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'fa';

type Dict = Record<string, any>;

const en: Dict = {
  nav: { home: 'Home', materials: 'Materials', ideas: 'Ideas', blog: 'Blog', shop: 'Shop', contact: 'Contact', admin: 'Admin' },
  brandTagline: 'Cabinetry',
  hero: {
    eyebrow: 'Custom Cabinetry',
    title: 'Crafted cabinetry for spaces that matter',
    subtitle: 'Kitchenchoob designs and builds bespoke MDF cabinetry — from kitchen islands to walk-in closets — with meticulous attention to material, color, and craft.',
    cta: 'Explore materials',
    secondaryCta: 'Browse ideas',
  },
  materials: {
    eyebrow: 'Materials & Colors',
    title: 'A curated palette of MDF materials and finishes',
    subtitle: 'Every project starts with the right material. Explore our selection of premium MDF panels, colors, and textures.',
    backToHome: 'Back to home',
    colors: 'Colors',
    materials: 'Materials',
  },
  ideas: {
    eyebrow: 'Design Ideas',
    title: 'Inspiration for your next project',
    subtitle: 'Browse our collection of cabinetry designs — from modern kitchens to custom closets.',
    backToHome: 'Back to home',
    liked: 'You liked',
    likedHint: 'these will be shared with your inquiry',
    like: 'Like',
    unlike: 'Unlike',
  },
  blog: {
    eyebrow: 'Journal',
    title: 'Notes on craft, material, and design',
    subtitle: 'Guides, thoughts, and stories from the workshop.',
    backToHome: 'Back to home',
    readMore: 'Read more',
    backToBlog: 'Back to journal',
  },
  shop: {
    eyebrow: 'Shop',
    title: 'Materials, hardware, and panels',
    subtitle: 'Order directly from our selection of cabinetry components.',
    backToHome: 'Back to home',
    allCategories: 'All',
    inStock: 'In stock',
    outOfStock: 'Out of stock',
    addToCart: 'Add to cart',
    notifyMe: 'Notify me',
    notifyEmailPlaceholder: 'your@email.com',
    notifySubmit: 'Notify me',
    notifyCancel: 'Close',
    notifySuccess: 'We will email you when this item is back in stock.',
  },
  cart: {
    title: 'Your cart',
    empty: 'Your cart is empty',
    checkout: 'Checkout',
    remove: 'Remove',
    total: 'Total',
    continueShopping: 'Continue shopping',
  },
  checkout: {
    title: 'Checkout',
    subtitle: 'Enter your details to complete the order.',
    name: 'Full name',
    phone: 'Phone number',
    email: 'Email (optional)',
    address: 'Delivery address',
    submit: 'Place order',
    placing: 'Placing order...',
    success: 'Order placed successfully!',
    orderNumber: 'Order number',
    backToShop: 'Back to shop',
  },
  contact: {
    eyebrow: 'Get in touch',
    title: 'Let us build something beautiful together',
    description: 'Tell us about your project and we will get back to you within 48 hours.',
    callDirectly: 'Call directly',
    emailUs: 'Email us',
    serviceArea: 'Service area',
    serviceAreaValue: 'Greater Metropolitan Area',
    formTitle: 'Request a consultation',
    formSubtitle: 'Fill out the form below and we will be in touch.',
    name: 'Name',
    namePlaceholder: 'Your full name',
    nameError: 'Please enter your name',
    phone: 'Phone',
    phonePlaceholder: 'Your phone number',
    phoneError: 'Please enter a valid phone number',
    email: 'Email',
    emailOptional: '(optional)',
    emailPlaceholder: 'you@email.com',
    message: 'Message',
    messagePlaceholder: 'Tell us about your project...',
    submit: 'Send request',
    sending: 'Sending...',
    successTitle: 'Thank you!',
    successBody: 'We have received your request and will be in touch within 48 hours.',
    submitAnother: 'Send another request',
    error: 'Something went wrong. Please try again.',
    agree: 'By submitting, you agree to be contacted about your inquiry.',
  },
  footer: {
    tagline: 'Bespoke cabinetry crafted with care.',
    rights: 'All rights reserved.',
    links: 'Links',
    contact: 'Contact',
  },
};

const fa: Dict = {
  nav: { home: 'خانه', materials: 'متریال', ideas: 'ایده‌ها', blog: 'وبلاگ', shop: 'فروشگاه', contact: 'تماس', admin: 'مدیریت' },
  brandTagline: 'کابینت',
  hero: {
    eyebrow: 'کابینت سفارشی',
    title: 'کابینت‌سازی هنری برای فضاهایی که مهمند',
    subtitle: 'Kitchenchoob طراحی و ساخت کابینت ام دی اف سفارشی — از جزیره آشپزخانه تا کلوزت باز — با توجه دقیق به متریال، رنگ و کیفیت ساخت.',
    cta: 'مشاهده متریال',
    secondaryCta: 'مرور ایده‌ها',
  },
  materials: {
    eyebrow: 'متریال و رنگ',
    title: 'پالت انتخابی متریال و پوشش‌های ام دی اف',
    subtitle: 'هر پروژه با متریال درست شروع می‌شود. انتخاب ما از پنل‌های ام دی اف ممتاز، رنگ‌ها و بافت‌ها.',
    backToHome: 'بازگشت به خانه',
    colors: 'رنگ‌ها',
    materials: 'متریال',
  },
  ideas: {
    eyebrow: 'ایده‌های طراحی',
    title: 'الهام برای پروژه بعدی شما',
    subtitle: 'مجموعه‌ای از طراحی‌های کابینت — از آشپزخانه‌های مدرن تا کلوزت‌های سفارشی.',
    backToHome: 'بازگشت به خانه',
    liked: 'شما پسندیدید',
    likedHint: 'اینها با درخواست شما به اشتراک گذاشته می‌شوند',
    like: 'پسندیدن',
    unlike: 'حذف پسند',
  },
  blog: {
    eyebrow: 'روزنامه',
    title: 'یادداشت‌هایی درباره صنعت، متریال و طراحی',
    subtitle: 'راهنماها، افکار و داستان‌هایی از کارگاه.',
    backToHome: 'بازگشت به خانه',
    readMore: 'ادامه مطلب',
    backToBlog: 'بازگشت به روزنامه',
  },
  shop: {
    eyebrow: 'فروشگاه',
    title: 'متریال، اکسسوری و پنل',
    subtitle: 'مستقیم از انتخاب قطعات کابینت سفارش دهید.',
    backToHome: 'بازگشت به خانه',
    allCategories: 'همه',
    inStock: 'موجود',
    outOfStock: 'ناموجود',
    addToCart: 'افزودن به سبد',
    notifyMe: 'اطلاع بده',
    notifyEmailPlaceholder: 'ایمیل شما',
    notifySubmit: 'اطلاع بده',
    notifyCancel: 'بستن',
    notifySuccess: 'وقتی این محصول موجود شد، به شما ایمیل می‌زنیم.',
  },
  cart: {
    title: 'سبد خرید شما',
    empty: 'سبد خرید شما خالی است',
    checkout: 'تسویه حساب',
    remove: 'حذف',
    total: 'مجموع',
    continueShopping: 'ادامه خرید',
  },
  checkout: {
    title: 'تسویه حساب',
    subtitle: 'اطلاعات خود را وارد کنید تا سفارش تکمیل شود.',
    name: 'نام کامل',
    phone: 'شماره تلفن',
    email: 'ایمیل (اختیاری)',
    address: 'آدرس تحویل',
    submit: 'ثبت سفارش',
    placing: 'در حال ثبت...',
    success: 'سفارش با موفقیت ثبت شد!',
    orderNumber: 'شماره سفارش',
    backToShop: 'بازگشت به فروشگاه',
  },
  contact: {
    eyebrow: 'تماس با ما',
    title: 'بیایید چیزی زیبا بسازیم',
    description: 'درباره پروژه خود به ما بگویید و ما ظرف ۴۸ ساعت با شما تماس می‌گیریم.',
    callDirectly: 'تماس مستقیم',
    emailUs: 'ایمیل',
    serviceArea: 'منطقه خدمت',
    serviceAreaValue: 'منطقه کلان‌شهری',
    formTitle: 'درخواست مشاوره',
    formSubtitle: 'فرم زیر را پر کنید تا با شما تماس بگیریم.',
    name: 'نام',
    namePlaceholder: 'نام کامل شما',
    nameError: 'لطفاً نام خود را وارد کنید',
    phone: 'تلفن',
    phonePlaceholder: 'شماره تلفن شما',
    phoneError: 'لطفاً یک شماره تلفن معتبر وارد کنید',
    email: 'ایمیل',
    emailOptional: '(اختیاری)',
    emailPlaceholder: 'ایمیل شما',
    message: 'پیام',
    messagePlaceholder: 'درباره پروژه خود بنویسید...',
    submit: 'ارسال درخواست',
    sending: 'در حال ارسال...',
    successTitle: 'سپاسگزاریم!',
    successBody: 'درخواست شما را دریافت کردیم و ظرف ۴۸ ساعت تماس می‌گیریم.',
    submitAnother: 'ارسال درخواست دیگر',
    error: 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
    agree: 'با ارسال، موافقت می‌کنید درباره درخواست شما تماس گرفته شود.',
  },
  footer: {
    tagline: 'کابینت سفارشی با دقت ساخته شده است.',
    rights: 'تمام حقوق محفوظ است.',
    links: 'لینک‌ها',
    contact: 'تماس',
  },
};

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  dir: 'ltr' | 'rtl';
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = lang === 'fa' ? fa : en;
  const dir = lang === 'fa' ? 'rtl' : 'ltr';
  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
