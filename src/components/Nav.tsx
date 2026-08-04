import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate, useRouter } from '@/lib/router';
import type { RouteName } from '@/lib/router';

export function Nav() {
  const { t, lang, setLang, dir } = useLang();
  const { route } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links: { name: RouteName; label: string }[] = [
    { name: 'materials', label: t.nav.materials },
    { name: 'ideas', label: t.nav.ideas },
    { name: 'blog', label: t.nav.blog },
    { name: 'shop', label: t.nav.shop },
    { name: 'contact', label: t.nav.contact },
  ];

  const go = (name: RouteName) => {
    navigate({ name });
    setMobileOpen(false);
  };

  const isActive = (name: RouteName) => route.name === name || (name === 'materials' && route.name === 'materials');

  return (
    <header
      dir={dir}
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-px flex h-16 items-center justify-between lg:h-20">
        <button onClick={() => go('home')} className="flex items-center gap-2">
          <span className={`font-serif text-xl font-bold lg:text-2xl ${scrolled || route.name !== 'home' ? 'text-ink-900' : 'text-cream-50'}`}>
            RUF
          </span>
          <span className={`text-xs font-medium uppercase tracking-widest ${scrolled || route.name !== 'home' ? 'text-brass-600' : 'text-brass-400'}`}>
            Cabinetry
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => go(link.name)}
              className={`text-sm font-medium transition-colors ${
                scrolled || route.name !== 'home'
                  ? isActive(link.name) ? 'text-brass-600' : 'text-ink-600 hover:text-ink-900'
                  : isActive(link.name) ? 'text-brass-400' : 'text-cream-300 hover:text-cream-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              scrolled || route.name !== 'home'
                ? 'border-ink-200 text-ink-600 hover:bg-ink-100'
                : 'border-cream-200/30 text-cream-300 hover:bg-cream-50/10'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'en' ? 'FA' : 'EN'}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden ${scrolled || route.name !== 'home' ? 'text-ink-900' : 'text-cream-50'}`}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-cream-50 lg:hidden">
          <div className="container-px flex flex-col py-4">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => go(link.name)}
                className={`py-3 text-left text-sm font-medium ${isActive(link.name) ? 'text-brass-600' : 'text-ink-600'}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
