import { Phone, Mail, MapPin } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';

export function Footer() {
  const { t, dir } = useLang();
  return (
    <footer dir={dir} className="bg-ink-950 text-cream-300">
      <div className="container-px py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-cream-50">Kitchenchoob</span>
              
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-300/80">{t.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream-50">{t.footer.links}</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <button onClick={() => navigate({ name: 'materials' })} className="text-left text-cream-300/80 hover:text-cream-50">{t.nav.materials}</button>
              <button onClick={() => navigate({ name: 'ideas' })} className="text-left text-cream-300/80 hover:text-cream-50">{t.nav.ideas}</button>
              <button onClick={() => navigate({ name: 'blog' })} className="text-left text-cream-300/80 hover:text-cream-50">{t.nav.blog}</button>
              <button onClick={() => navigate({ name: 'shop' })} className="text-left text-cream-300/80 hover:text-cream-50">{t.nav.shop}</button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-cream-50">{t.footer.contact}</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <a href="tel:+15550100" className="flex items-center gap-2 text-cream-300/80 hover:text-cream-50">
                <Phone className="h-4 w-4 text-brass-400" /> +1 555-0100
              </a>
              <a href="mailto:hello@kitchenchoob.com" className="flex items-center gap-2 text-cream-300/80 hover:text-cream-50">
                <Mail className="h-4 w-4 text-brass-400" /> hello@kitchenchoob.com
              </a>
              <div className="flex items-center gap-2 text-cream-300/80">
                <MapPin className="h-4 w-4 text-brass-400" /> {t.contact.serviceAreaValue}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cream-200/10 pt-6 text-center text-xs text-cream-300/60">
          © {new Date().getFullYear()} Kitchenchoob. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
