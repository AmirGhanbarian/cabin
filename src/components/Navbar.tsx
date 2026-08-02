import { useState } from 'react';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { useScrolled } from '@/hooks/useScrolled';
import { useLang } from '@/lib/lang-context';
import { navigate, type Route } from '@/lib/router';

type NavLink = {
  label: string;
  route: Route;
  hash?: string;
};

export function Navbar() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const { t, lang, toggleLang } = useLang();

  const isOnHome = !window.location.hash || window.location.hash === '#';
  const showLight = isOnHome && !scrolled;

  const navLinks: NavLink[] = [
    { label: t.nav.collections, route: { name: 'home' }, hash: '#collections' },
    { label: t.nav.whyRuf, route: { name: 'home' }, hash: '#why-ruf' },
    { label: t.nav.process, route: { name: 'home' }, hash: '#process' },
    { label: t.nav.materials, route: { name: 'materials' } },
    { label: t.nav.ideas, route: { name: 'ideas' } },
    { label: t.nav.blog, route: { name: 'blog' } },
    { label: t.nav.reviews, route: { name: 'home' }, hash: '#testimonials' },
    { label: t.nav.faq, route: { name: 'home' }, hash: '#faq' },
  ];

  const handleNavClick = (link: NavLink) => {
    setOpen(false);
    if (link.route.name === 'home' && link.hash) {
      if (!isOnHome) {
        navigate({ name: 'home' });
        setTimeout(() => {
          document.querySelector(link.hash!)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link.route);
    }
  };

  const scrollToContact = () => {
    setOpen(false);
    if (!isOnHome) {
      navigate({ name: 'home' });
      setTimeout(() => {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const textColor = showLight ? 'text-cream-100' : 'text-ink-600';
  const textHover = showLight ? 'hover:text-cream-50' : 'hover:text-ink-900';
  const logoColor = showLight ? 'text-cream-50' : 'text-ink-900';
  const phoneColor = showLight ? 'text-cream-200 hover:text-cream-50' : 'text-ink-700 hover:text-brass-500';
  const toggleColor = showLight ? 'text-cream-100' : 'text-ink-800';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-100/90 backdrop-blur-md border-b border-ink-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between lg:h-20">
        {/* Logo */}
        <button
          onClick={() => navigate({ name: 'home' })}
          className="group flex items-center gap-2"
        >
          <span className={`font-serif text-2xl font-bold tracking-tight transition-colors ${logoColor}`}>
            RUF
          </span>
          <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-brass-500 transition-transform group-hover:scale-150" />
        </button>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link, i) => (
            <li key={i}>
              <button
                onClick={() => handleNavClick(link)}
                className={`text-sm font-medium transition-colors ${textColor} ${textHover}`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              showLight
                ? 'border-cream-200/30 text-cream-100 hover:bg-cream-50/10'
                : 'border-ink-200 text-ink-600 hover:bg-ink-100'
            }`}
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'en' ? 'FA' : 'EN'}
          </button>

          <a
            href="tel:+15550100"
            className={`hidden items-center gap-2 text-sm font-medium transition-colors sm:flex ${phoneColor}`}
          >
            <Phone className="h-4 w-4" />
            {t.nav.callUs}
          </a>
          <button
            onClick={scrollToContact}
            className="hidden rounded-full bg-brass-500 px-6 py-2.5 text-sm font-medium text-ink-900 shadow-lg shadow-brass-500/20 transition-all hover:scale-[1.02] hover:bg-brass-400 sm:inline-flex"
          >
            {t.nav.getQuote}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 ${toggleColor}`}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden bg-cream-100/95 backdrop-blur-md transition-all duration-300 ${
          open ? 'max-h-screen border-b border-ink-100' : 'max-h-0'
        }`}
      >
        <ul className="container-px flex flex-col gap-1 py-4">
          {navLinks.map((link, i) => (
            <li key={i}>
              <button
                onClick={() => handleNavClick(link)}
                className="w-full py-3 text-left text-base font-medium text-ink-700 transition-colors hover:text-brass-500"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={scrollToContact}
              className="mt-2 w-full rounded-full bg-brass-500 px-6 py-3 text-sm font-medium text-ink-900"
            >
              {t.nav.getQuote}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
