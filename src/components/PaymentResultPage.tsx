import { useEffect, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase';

export function PaymentResultPage({ status, authority }: { status: 'success' | 'fail'; authority?: string }) {
  const { t } = useLang();
  const { clearCart } = useCart();
  const [verifying, setVerifying] = useState(true);
  const [refId, setRefId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (status === 'fail') {
      setVerifying(false);
      setFailed(true);
      return;
    }

    // Verify the payment with the edge function
    const verifyPayment = async () => {
      try {
        const { data: order } = await supabase
          .from('orders')
          .select('id')
          .eq('authority', authority ?? '')
          .maybeSingle();

        if (!order) {
          setVerifying(false);
          setFailed(true);
          return;
        }

        const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/zarinpal?action=verify`;
        const res = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ authority, orderId: order.id }),
        });

        const data = await res.json();

        if (data.success) {
          setRefId(data.refId ?? null);
          clearCart();
        } else {
          setFailed(true);
        }
      } catch {
        setFailed(true);
      }
      setVerifying(false);
    };

    verifyPayment();
  }, [status, authority, clearCart]);

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-brass-500" />
          <p className="mt-4 text-sm text-ink-500">{t.checkout.processing}</p>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100 px-5">
        <div className="w-full max-w-md rounded-3xl bg-cream-50 p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <X className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-serif text-2xl font-bold text-ink-900">
            {t.paymentResult.failedTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            {t.paymentResult.failedBody}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate({ name: 'shop' })}
              className="rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800"
            >
              {t.paymentResult.backToShop}
            </button>
            <button
              onClick={() => navigate({ name: 'home' })}
              className="rounded-full border border-ink-200 px-8 py-3.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
            >
              {t.paymentResult.backToHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-5">
      <div className="w-full max-w-md rounded-3xl bg-cream-50 p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-bold text-ink-900">
          {t.paymentResult.successTitle}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          {t.paymentResult.successBody}
        </p>
        {refId && (
          <div className="mt-5 rounded-xl bg-cream-200/50 px-4 py-3">
            <p className="text-xs text-ink-400">{t.paymentResult.orderRef}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-ink-900">{refId}</p>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate({ name: 'shop' })}
            className="rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800"
          >
            {t.paymentResult.backToShop}
          </button>
          <button
            onClick={() => navigate({ name: 'home' })}
            className="rounded-full border border-ink-200 px-8 py-3.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
          >
            {t.paymentResult.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
}
