import { ArrowRight, Star } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';

const heroImage =
  'https://images.pexels.com/photos/7167061/pexels-photo-7167061.jpeg?auto=compress&cs=tinysrgb&w=1920';

export function Hero() {
  const { t } = useLang();

  const scrollToContact = () => {
    navigate({ name: 'home' });
    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury modern kitchen with premium cabinetry"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-900/40 to-ink-950/80" />
        <div className="absolute inset-0 bg-grain opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col justify-center container-px pt-20">
        <div className="max-w-3xl">
          <div className="animate-fade-up flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brass-400 text-brass-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-cream-200">
              {t.hero.trustedBy}
            </span>
          </div>

          <h1
            className="mt-6 animate-fade-up font-serif text-display text-cream-50 text-balance"
            style={{ animationDelay: '0.1s' }}
          >
            {t.hero.title}
          </h1>

          <p
            className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-cream-200"
            style={{ animationDelay: '0.2s' }}
          >
            {t.hero.description}
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: '0.3s' }}
          >
            <button
              onClick={scrollToContact}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brass-500 px-8 py-4 text-base font-medium text-ink-900 shadow-xl shadow-brass-500/30 transition-all hover:scale-[1.02] hover:bg-brass-400"
            >
              {t.hero.cta}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>
            <button
              onClick={() =>
                document.querySelector('#collections')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-200/30 px-8 py-4 text-base font-medium text-cream-100 backdrop-blur-sm transition-all hover:border-cream-200/60 hover:bg-cream-50/10"
            >
              {t.hero.explore}
            </button>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-16 flex animate-fade-up flex-wrap gap-x-12 gap-y-6"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { value: '25yr', label: t.hero.stats.warranty },
              { value: '500+', label: t.hero.stats.delivered },
              { value: '4.9/5', label: t.hero.stats.rating },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-3xl font-bold text-cream-50">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-cream-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-cream-200/30 p-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-cream-200/60" />
        </div>
      </div>
    </section>
  );
}
