import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { Reveal } from './Reveal';
import { db } from '@/lib/db';
import type { Material } from '@/lib/db';

export function Hero() {
  const { t, dir } = useLang();
  return (
    <section dir={dir} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Luxury cabinetry"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/40 to-ink-950/80" />
        <div className="absolute inset-0 bg-grain opacity-20" />
      </div>

      <div className="relative container-px py-32 text-center">
        <Reveal>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-brass-400">
            {t.hero.eyebrow}
          </span>
          <h1 className="mt-4 text-display font-serif font-bold text-cream-50 text-balance max-w-3xl mx-auto leading-[1.05]">
            {t.hero.title}
          </h1>
          <p className="mt-6 mx-auto max-w-xl text-lg leading-relaxed text-cream-300">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate({ name: 'materials' })}
              className="flex items-center gap-2 rounded-full bg-brass-500 px-8 py-4 text-base font-medium text-ink-900 shadow-lg shadow-brass-500/30 transition-all hover:scale-[1.02] hover:bg-brass-400"
            >
              {t.hero.cta} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button
              onClick={() => navigate({ name: 'ideas' })}
              className="flex items-center gap-2 rounded-full border border-cream-200/30 px-8 py-4 text-base font-medium text-cream-50 backdrop-blur-sm transition-all hover:border-cream-200/60 hover:bg-cream-50/10"
            >
              {t.hero.secondaryCta}
            </button>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border-2 border-cream-200/40 flex items-start justify-center pt-1.5">
          <div className="h-2 w-0.5 rounded-full bg-cream-200/60" />
        </div>
      </div>
    </section>
  );
}

export function MaterialsTeaser() {
  const { t, dir, lang } = useLang();
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    db.listMaterials().then((m) => setMaterials(m.slice(0, 4)));
  }, []);

  return (
    <section dir={dir} className="section-pad bg-cream-100">
      <div className="container-px">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-600">{t.materials.eyebrow}</span>
            <h2 className="mt-3 font-serif text-heading text-ink-900 text-balance">{t.materials.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">{t.materials.subtitle}</p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map((mat, i) => (
            <Reveal key={mat.id} delay={i * 80}>
              <div className="group overflow-hidden rounded-2xl bg-cream-50 border border-ink-100 transition-all hover:shadow-xl hover:border-brass-300">
                <div className="aspect-square overflow-hidden">
                  <img src={mat.image_url} alt={mat.name_en} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-ink-400">{mat.code}</span>
                  <h3 className="mt-1 font-serif font-bold text-ink-900">{lang === 'en' ? mat.name_en : mat.name_fa}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate({ name: 'materials' })}
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-8 py-3 text-sm font-medium text-ink-700 transition-all hover:bg-ink-900 hover:text-cream-50 hover:border-ink-900"
            >
              View all materials <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
