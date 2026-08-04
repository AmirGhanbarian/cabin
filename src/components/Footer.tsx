import { Phone, Mail, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate, type Route } from '@/lib/router';

type FooterLink = {
  label: string;
  route: Route;
  hash?: string;
};

export function Footer() {
  const { t } = useLang();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const links: FooterLink[] = [
    { label: t.nav.collections, route: { name: 'home' }, hash: '#collections' },
    { label: t.nav.whyRuf, route: { name: 'home' }, hash: '#why-ruf' },
    { label: t.nav.process, route: { name: 'home' }, hash: '#process' },
    { label: t.nav.shop, route: { name: 'shop' } },
    { label: t.nav.materials, route: { name: 'materials' } },
    { label: t.nav.ideas, route: { name: 'ideas' } },
    { label: t.nav.blog, route: { name: 'blog' } },
    { label: t.nav.faq, route: { name: 'home' }, hash: '#faq' },
    { label: t.nav.getQuote, route: { name: 'home' }, hash: '#contact' },
  ];

  const handleLinkClick = (link: FooterLink) => {
    if (link.route.name === 'home' && link.hash) {
      if (!window.location.hash || window.location.hash === '#') {
        document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate({ name: 'home' });
        setTimeout(() => {
          document.querySelector(link.hash ?? '')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(link.route);
    }
  };

  return (
    <footer className="bg-ink-950 text-cream-200">
      <div className="container-px py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold text-cream-50">RUF</span>
              <span className="h-2 w-2 rounded-full bg-brass-500" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-300">
              {t.footer.description}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-200/10 transition-colors hover:border-brass-400/40 hover:bg-brass-500/10"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-cream-300" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-200/10 transition-colors hover:border-brass-400/40 hover:bg-brass-500/10"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-cream-300" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream-50">
              {t.footer.getInTouch}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="tel:+15550100" className="flex items-center gap-2 text-cream-300 transition-colors hover:text-brass-400">
                  <Phone className="h-4 w-4" />
                  +1 555-0100
                </a>
              </li>
              <li>
                <a href="mailto:hello@rufcabinetry.com" className="flex items-center gap-2 text-cream-300 transition-colors hover:text-brass-400">
                  <Mail className="h-4 w-4" />
                  hello@rufcabinetry.com
                </a>
              </li>
            </ul>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream-50">
              {t.footer.explore}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {links.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="text-cream-300 transition-colors hover:text-brass-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream-200/10 pt-8 sm:flex-row">
          <p className="text-xs text-cream-400">
            © {new Date().getFullYear()} RUF Cabinetry. {t.footer.rights}
          </p>
          <button
            onClick={scrollTop}
            className="flex items-center gap-2 text-xs text-cream-400 transition-colors hover:text-brass-400"
          >
            {t.footer.backToTop}
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
