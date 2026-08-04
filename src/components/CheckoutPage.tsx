import { useState } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { useCart } from '@/hooks/useCart';
import { supabase, type OrderInsert, type OrderItemInsert } from '@/lib/supabase';

function formatPrice(price: number, lang: 'en' | 'fa') {
  const formatted = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(price);
  return lang === 'fa' ? `${formatted} تومان` : `${formatted} Toman`;
}

export function CheckoutPage() {
  const { t, lang } = useLang();
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError(t.checkout.emptyCartError);
      return;
    }
    if (!name.trim()) {
      setError(t.checkout.nameError);
      return;
    }
    if (!phone.trim()) {
      setError(t.checkout.phoneError);
      return;
    }
    if (!address.trim()) {
      setError(t.checkout.addressError);
      return;
    }

    setLoading(true);

    try {
      // 1. Create the order
      const orderInsert: OrderInsert = {
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || null,
        customer_address: address.trim(),
        total_amount: totalPrice,
        status: 'pending',
        authority: null,
        ref_id: null,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single();

      if (orderError || !order) {
        setError(t.checkout.paymentError);
        setLoading(false);
        return;
      }

      // 2. Create order items
      const orderItems: OrderItemInsert[] = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: lang === 'en' ? item.name_en : item.name_fa,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      await supabase.from('order_items').insert(orderItems);

      // 3. Call the Zarinpal edge function to create payment
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/zarinpal?action=create`;
      const res = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!res.ok) {
        setError(t.checkout.paymentError);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.error || !data.gatewayUrl) {
        setError(t.checkout.paymentError);
        setLoading(false);
        return;
      }

      // 4. Redirect to Zarinpal gateway
      // Don't clear cart yet — only clear on payment success
      window.location.href = data.gatewayUrl;
    } catch {
      setError(t.checkout.paymentError);
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="pt-20 lg:pt-24">
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
              {t.checkout.title}
            </h1>
          </div>
        </div>
        <div className="section-pad">
          <div className="container-px">
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-lg text-ink-500">{t.checkout.emptyCartError}</p>
              <button
                onClick={() => navigate({ name: 'shop' })}
                className="mt-8 rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800"
              >
                {t.cart.browseShop}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-ink-900 section-pad">
        <div className="container-px">
          <button
            onClick={() => navigate({ name: 'cart' })}
            className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t.checkout.backToCart}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">
            {t.checkout.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-300">
            {t.checkout.subtitle}
          </p>
        </div>
      </div>

      {/* Checkout form */}
      <div className="section-pad">
        <div className="container-px">
          <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-5">
            {/* Customer info */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-serif text-xl font-bold text-ink-900">
                  {t.checkout.customerInfo}
                </h2>
                <div>
                  <label htmlFor="co-name" className="mb-1.5 block text-sm font-medium text-ink-700">
                    {t.checkout.fullName}
                  </label>
                  <input
                    id="co-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-ink-200 bg-cream-50 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
                  />
                </div>
                <div>
                  <label htmlFor="co-phone" className="mb-1.5 block text-sm font-medium text-ink-700">
                    {t.checkout.phone}
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-ink-200 bg-cream-50 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
                  />
                </div>
                <div>
                  <label htmlFor="co-email" className="mb-1.5 block text-sm font-medium text-ink-700">
                    {t.checkout.email}
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-ink-200 bg-cream-50 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
                  />
                </div>
                <div>
                  <label htmlFor="co-address" className="mb-1.5 block text-sm font-medium text-ink-700">
                    {t.checkout.address}
                  </label>
                  <textarea
                    id="co-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-ink-200 bg-cream-50 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-base font-medium text-cream-100 transition-all hover:bg-ink-800 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t.checkout.processing}
                    </>
                  ) : (
                    t.checkout.payNow
                  )}
                </button>
              </form>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl border border-ink-100 bg-cream-50 p-6">
                <h2 className="font-serif text-xl font-bold text-ink-900">
                  {t.checkout.orderSummary}
                </h2>
                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-ink-900">
                          {lang === 'en' ? item.name_en : item.name_fa}
                        </p>
                        <p className="text-xs text-ink-400">
                          {item.quantity} × {formatPrice(item.price, lang)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-ink-700">
                        {formatPrice(item.price * item.quantity, lang)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-ink-100 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-ink-600">{t.cart.subtotal}</span>
                    <span className="font-serif text-xl font-bold text-ink-900">
                      {formatPrice(totalPrice, lang)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
