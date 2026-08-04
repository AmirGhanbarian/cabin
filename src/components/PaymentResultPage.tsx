import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { navigate } from '@/lib/router';

export function PaymentResultPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const authority = params.get('Authority');
    const statusParam = params.get('Status');

    if (statusParam === 'OK' && authority) {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-5">
      <div className="w-full max-w-md rounded-3xl bg-cream-50 p-8 text-center shadow-xl">
        {status === 'loading' ? (
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-brass-500" />
        ) : status === 'success' ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage-100 text-sage-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-6 font-serif text-2xl font-bold text-ink-900">Payment Successful</h1>
            <p className="mt-2 text-sm text-ink-500">Your order has been confirmed.</p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <XCircle className="h-10 w-10" />
            </div>
            <h1 className="mt-6 font-serif text-2xl font-bold text-ink-900">Payment Failed</h1>
            <p className="mt-2 text-sm text-ink-500">The payment was not completed.</p>
          </>
        )}
        <button onClick={() => navigate({ name: 'shop' })} className="mt-8 rounded-full bg-ink-900 px-8 py-3 text-sm font-medium text-cream-100 transition-colors hover:bg-ink-800">
          Back to shop
        </button>
      </div>
    </div>
  );
}
