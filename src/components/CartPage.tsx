import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { useCart } from '@/hooks/useCart';

function formatPrice(price: number, lang: 'en' | 'fa') {
  const formatted = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(price);
  return lang === 'fa' ? `${formatted} تومان` : `${formatted} Toman`;
}

export function CartPage() {
  const { t, lang, dir } = useLang();
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="pt-20 lg:pt-24" dir={dir}>
      <div className="bg-ink-900 py-12 lg:py-16">
        <div className="container-px">
          <button onClick={() => navigate({ name: 'shop' })} className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{t.cart.continueShopping}
          </button>
          <h1 className="font-serif text-display text-cream-50">{t.cart.title}</h1>
        </div>
      </div>

      <div className="section-pad">
        <div className="container-px max-w-3xl">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 py-20 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-ink-300" />
              <p className="mt-4 text-ink-400">{t.cart.empty}</p>
              <button onClick={() => navigate({ name: 'shop' })} className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800">
                {t.cart.continueShopping}
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-cream-50 p-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <img src={item.image_url} alt={lang === 'en' ? item.name_en : item.name_fa} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-ink-900">{lang === 'en' ? item.name_en : item.name_fa}</h3>
                      <p className="text-xs text-ink-400">{item.code}</p>
                      <p className="mt-1 text-sm font-semibold text-brass-600">{formatPrice(item.price, lang)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 rounded-full border border-ink-200 text-ink-600 transition-colors hover:bg-ink-100">−</button>
                      <span className="w-8 text-center text-sm font-medium text-ink-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 rounded-full border border-ink-200 text-ink-600 transition-colors hover:bg-ink-100">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-cream-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-500">{t.cart.total}</span>
                  <span className="font-serif text-2xl font-bold text-ink-900">{formatPrice(total, lang)}</span>
                </div>
                <button onClick={() => navigate({ name: 'checkout' })} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brass-500 px-8 py-4 text-base font-medium text-ink-900 shadow-lg shadow-brass-500/20 transition-all hover:scale-[1.01] hover:bg-brass-400">
                  {t.cart.checkout}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
