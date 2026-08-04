import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { useCart } from '@/hooks/useCart';

function formatPrice(price: number, lang: 'en' | 'fa') {
  const formatted = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(price);
  return lang === 'fa' ? `${formatted} تومان` : `${formatted} Toman`;
}

export function CartPage() {
  const { t, lang } = useLang();
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-ink-900 section-pad">
        <div className="container-px">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t.shop.backToHome}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">
            {t.cart.title}
          </h1>
        </div>
      </div>

      {/* Cart content */}
      <div className="section-pad">
        <div className="container-px">
          {items.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-200 text-ink-300">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <p className="mt-6 text-lg font-medium text-ink-700">{t.cart.empty}</p>
              <p className="mt-2 text-sm text-ink-400">{t.cart.emptyHint}</p>
              <button
                onClick={() => navigate({ name: 'shop' })}
                className="mt-8 rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800"
              >
                {t.cart.browseShop}
              </button>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              {/* Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-ink-100 bg-cream-50 p-4 lg:p-5"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                      <img src={item.image_url} alt={lang === 'en' ? item.name_en : item.name_fa} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-ink-900">
                            {lang === 'en' ? item.name_en : item.name_fa}
                          </h3>
                          <p className="mt-0.5 text-xs text-ink-400">{item.code}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-full p-2 text-ink-300 transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label={t.cart.remove}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        {/* Quantity selector */}
                        <div className="flex items-center gap-2 rounded-full border border-ink-200 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold text-ink-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-bold text-ink-900">
                          {formatPrice(item.price * item.quantity, lang)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-8 rounded-2xl border border-ink-100 bg-cream-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-ink-600">{t.cart.subtotal}</span>
                  <span className="font-serif text-2xl font-bold text-ink-900">
                    {formatPrice(totalPrice, lang)}
                  </span>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate({ name: 'checkout' })}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800"
                  >
                    {t.cart.checkout}
                  </button>
                  <button
                    onClick={() => navigate({ name: 'shop' })}
                    className="rounded-full border border-ink-200 px-8 py-4 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
                  >
                    {t.cart.continueShopping}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
