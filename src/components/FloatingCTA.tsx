import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLang } from '@/lib/lang-context';

export function FloatingCTA() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const contactSection = document.querySelector('#contact');
      const contactTop = contactSection?.getBoundingClientRect().top ?? 9999;

      setShow(scrolled > 600 && contactTop > 200);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() =>
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
      }
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brass-500 px-6 py-4 text-sm font-medium text-ink-900 shadow-xl shadow-brass-500/30 transition-all hover:scale-105 hover:bg-brass-400 sm:hidden"
    >
      <ArrowUp className="h-4 w-4" />
      {t.floatingCta.getQuote}
    </button>
  );
}
