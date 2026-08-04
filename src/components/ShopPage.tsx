import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, ShoppingBag, Bell, X, Check, Loader2 } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { Reveal } from './Reveal';
import { useCart } from '@/hooks/useCart';
import { db } from '@/lib/db';
import type { Product, Category, NotifyRequestInsert } from '@/lib/db';

function formatPrice(price: number, lang: 'en' | 'fa') {
  const formatted = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(price);
  return lang === 'fa' ? `${formatted} تومان` : `${formatted} Toman`;
}

export function ShopPage() {
  const { t, lang, dir } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [notifyProduct, setNotifyProduct] = useState<Product | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifyDone, setNotifyDone] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([db.listProducts(), db.listCategories()]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category_id === activeCategory);
  }, [products, activeCategory]);

  const handleNotifySubmit = async () => {
    if (!notifyProduct || !notifyEmail) return;
    setNotifySubmitting(true);
    const payload: NotifyRequestInsert = { product_id: notifyProduct.id, email: notifyEmail };
    await db.insertNotifyRequest(payload);
    setNotifySubmitting(false);
    setNotifyDone(true);
  };

  const closeNotify = () => { setNotifyProduct(null); setNotifyEmail(''); setNotifyDone(false); };

  return (
    <div className="pt-20 lg:pt-24">
      <div className="bg-ink-900 section-pad">
        <div className="container-px" dir={dir}>
          <button onClick={() => navigate({ name: 'home' })} className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{t.shop.backToHome}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">{t.shop.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-300">{t.shop.subtitle}</p>
        </div>
      </div>

      <div className="sticky top-16 z-30 border-b border-ink-100 bg-cream-100/90 backdrop-blur-md lg:top-20">
        <div className="container-px py-4">
          <div className="flex gap-1 overflow-x-auto rounded-full bg-cream-200 p-1 w-fit">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-ink-900 text-cream-100' : 'text-ink-500 hover:text-ink-700'}`}
            >
              {t.shop.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-ink-900 text-cream-100' : 'text-ink-500 hover:text-ink-700'}`}
              >
                {lang === 'en' ? cat.name_en : cat.name_fa}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center"><p className="text-ink-400">{t.shop.noProducts ?? 'No products found.'}</p></div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {filtered.map((product, i) => {
                const inStock = product.stock > 0;
                return (
                  <Reveal key={product.id} delay={i * 60}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-cream-50 transition-all duration-300 hover:border-brass-300 hover:shadow-xl hover:shadow-brass-500/10">
                      <div className="aspect-square overflow-hidden">
                        <img src={product.image_url} alt={lang === 'en' ? product.name_en : product.name_fa} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="flex flex-1 flex-col p-5 lg:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-ink-400">{product.code}</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${inStock ? 'bg-sage-100 text-sage-600' : 'bg-red-50 text-red-500'}`}>
                            {inStock ? `${t.shop.inStock} (${product.stock})` : t.shop.outOfStock}
                          </span>
                        </div>
                        <h3 className="mt-3 font-serif text-xl font-bold text-ink-900">{lang === 'en' ? product.name_en : product.name_fa}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-500 line-clamp-2">{lang === 'en' ? product.description_en : product.description_fa}</p>
                        <p className="mt-3 text-lg font-bold text-brass-600">{formatPrice(product.price, lang)}</p>
                        <div className="mt-4 flex-1" />
                        {inStock ? (
                          <button onClick={() => addToCart({ id: product.id, name_en: product.name_en, name_fa: product.name_fa, code: product.code, image_url: product.image_url, price: product.price, stock: product.stock })} className="flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-cream-100 transition-all hover:bg-ink-800">
                            <ShoppingBag className="h-4 w-4" />{t.shop.addToCart}
                          </button>
                        ) : (
                          <button onClick={() => { setNotifyProduct(product); setNotifyDone(false); }} className="flex items-center justify-center gap-2 rounded-full border border-brass-300 px-6 py-3 text-sm font-medium text-brass-600 transition-all hover:bg-brass-50">
                            <Bell className="h-4 w-4" />{t.shop.notifyMe}
                          </button>
                        )}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {notifyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-cream-50 p-6 lg:p-8">
            {notifyDone ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-sage-600"><Check className="h-7 w-7" /></div>
                <p className="mt-4 text-base text-ink-700">{t.shop.notifySuccess}</p>
                <button onClick={closeNotify} className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800">{t.shop.notifyCancel}</button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-ink-900">{t.shop.notifyMe}</h3>
                  <button onClick={closeNotify} className="rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-100"><X className="h-5 w-5" /></button>
                </div>
                <p className="mb-4 text-sm text-ink-500">{lang === 'en' ? notifyProduct.name_en : notifyProduct.name_fa}</p>
                <input type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder={t.shop.notifyEmailPlaceholder} className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200" />
                <div className="mt-6 flex gap-3">
                  <button onClick={handleNotifySubmit} disabled={!notifyEmail || notifySubmitting} className="flex items-center justify-center gap-2 rounded-full bg-brass-500 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-brass-400 disabled:opacity-60">
                    {notifySubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                    {t.shop.notifySubmit}
                  </button>
                  <button onClick={closeNotify} className="rounded-full border border-ink-200 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100">{t.shop.notifyCancel}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
