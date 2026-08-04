import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { useCart } from '@/hooks/useCart';
import { db } from '@/lib/db';
import type { OrderInsert, OrderItemInsert } from '@/lib/db';
import { DB_BACKEND, ZARINPAL_MERCHANT_ID, ZARINPAL_CALLBACK_URL } from '@/lib/db-config';

function formatPrice(price: number, lang: 'en' | 'fa') {
  const formatted = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(price);
  return lang === 'fa' ? `${formatted} تومان` : `${formatted} Toman`;
}

type Status = 'form' | 'loading' | 'success' | 'error';

export function CheckoutPage() {
  const { t, lang, dir } = useLang();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [status, setStatus] = useState<Status>('form');
  const [orderId, setOrderId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return;
    setStatus('loading');
    try {
      const order: OrderInsert = {
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: form.email.trim() || null,
        customer_address: form.address.trim(),
        total_amount: total,
        status: 'pending',
        authority: null,
        ref_id: null,
      };
      const orderItems: OrderItemInsert[] = items.map((item) => ({
        order_id: '',
        product_id: item.id,
        product_name: item.name_en,
        quantity: item.quantity,
        unit_price: item.price,
      }));
      const newOrderId = await db.insertOrder(order, orderItems);
      setOrderId(newOrderId);
      clearCart();
      setStatus('success');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to place order');
      setStatus('error');
    }
  };

  const canPayLive = DB_BACKEND === 'supabase' && ZARINPAL_MERCHANT_ID && ZARINPAL_CALLBACK_URL;

  return (
    <div className="pt-20 lg:pt-24" dir={dir}>
      <div className="bg-ink-900 py-12 lg:py-16">
        <div className="container-px">
          <button onClick={() => navigate({ name: 'cart' })} className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{t.cart.title}
          </button>
          <h1 className="font-serif text-display text-cream-50">{t.checkout.title}</h1>
          <p className="mt-2 text-cream-300">{t.checkout.subtitle}</p>
        </div>
      </div>

      <div className="section-pad">
        <div className="container-px max-w-2xl">
          {status === 'success' ? (
            <div className="rounded-3xl border border-sage-200 bg-sage-50 p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mt-6 font-serif text-2xl font-bold text-ink-900">{t.checkout.success}</h2>
              <p className="mt-2 text-sm text-ink-500">{t.checkout.orderNumber}: {orderId.slice(0, 8)}</p>
              <button onClick={() => navigate({ name: 'shop' })} className="mt-8 rounded-full bg-ink-900 px-8 py-3 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800">
                {t.checkout.backToShop}
              </button>
            </div>
          ) : items.length === 0 && status !== 'error' ? (
            <div className="rounded-2xl border border-dashed border-ink-200 py-20 text-center">
              <p className="text-ink-400">{t.cart.empty}</p>
              <button onClick={() => navigate({ name: 'shop' })} className="mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800">
                {t.cart.continueShopping}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 rounded-2xl border border-ink-100 bg-cream-50 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-ink-400">{t.cart.title}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-ink-700">{lang === 'en' ? item.name_en : item.name_fa} × {item.quantity}</span>
                      <span className="font-semibold text-ink-900">{formatPrice(item.price * item.quantity, lang)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-ink-100 pt-4 flex items-center justify-between">
                  <span className="text-sm text-ink-500">{t.cart.total}</span>
                  <span className="font-serif text-xl font-bold text-ink-900">{formatPrice(total, lang)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-ink-100 bg-cream-50 p-6 lg:p-8">
                <div>
                  <label htmlFor="co-name" className="mb-1.5 block text-sm font-medium text-ink-700">{t.checkout.name} *</label>
                  <input id="co-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200" />
                </div>
                <div>
                  <label htmlFor="co-phone" className="mb-1.5 block text-sm font-medium text-ink-700">{t.checkout.phone} *</label>
                  <input id="co-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
                    className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200" />
                </div>
                <div>
                  <label htmlFor="co-email" className="mb-1.5 block text-sm font-medium text-ink-700">{t.checkout.email}</label>
                  <input id="co-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200" />
                </div>
                <div>
                  <label htmlFor="co-address" className="mb-1.5 block text-sm font-medium text-ink-700">{t.checkout.address} *</label>
                  <textarea id="co-address" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required
                    className="w-full resize-none rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200" />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />{errorMsg || t.contact.error}
                  </div>
                )}

                {!canPayLive && (
                  <p className="rounded-xl bg-brass-50 px-4 py-3 text-xs text-brass-700">
                    {lang === 'en'
                      ? 'You are in local database mode. Orders are saved locally. Live payment requires switching to the PostgreSQL backend.'
                      : 'شما در حالت پایگاه داده محلی هستید. سفارش‌ها به صورت محلی ذخیره می‌شوند. پرداخت زنده نیاز به تغییر به پایگاه داده PostgreSQL دارد.'}
                  </p>
                )}

                <button type="submit" disabled={status === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-full bg-brass-500 px-8 py-4 text-base font-medium text-ink-900 shadow-lg shadow-brass-500/20 transition-all hover:scale-[1.01] hover:bg-brass-400 disabled:opacity-60 disabled:hover:scale-100">
                  {status === 'loading' ? <><Loader2 className="h-5 w-5 animate-spin" />{t.checkout.placing}</> : t.checkout.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
