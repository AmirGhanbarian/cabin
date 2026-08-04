import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { Reveal } from './Reveal';
import { db } from '@/lib/db';
import type { Material } from '@/lib/db';

export function MaterialsPage() {
  const { t, dir, lang } = useLang();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'color' | 'material'>('all');

  useEffect(() => {
    db.listMaterials().then((m) => { setMaterials(m); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? materials : materials.filter((m) => m.category === filter);

  return (
    <div className="pt-20 lg:pt-24">
      <div className="bg-ink-900 section-pad">
        <div className="container-px" dir={dir}>
          <button
            onClick={() => navigate({ name: 'home' })}
            className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t.materials.backToHome}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">{t.materials.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-300">{t.materials.subtitle}</p>
        </div>
      </div>

      <div className="sticky top-16 z-30 border-b border-ink-100 bg-cream-100/90 backdrop-blur-md lg:top-20">
        <div className="container-px py-4">
          <div className="flex gap-1 w-fit rounded-full bg-cream-200 p-1">
            {(['all', 'material', 'color'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-ink-900 text-cream-100' : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {f === 'all' ? 'All' : f === 'material' ? t.materials.materials : t.materials.colors}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((mat, i) => (
                <Reveal key={mat.id} delay={i * 60}>
                  <div className="group overflow-hidden rounded-2xl border border-ink-100 bg-cream-50 transition-all hover:border-brass-300 hover:shadow-xl hover:shadow-brass-500/10">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={mat.image_url}
                        alt={lang === 'en' ? mat.name_en : mat.name_fa}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-400">{mat.code}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${mat.category === 'color' ? 'bg-brass-100 text-brass-700' : 'bg-sage-100 text-sage-600'}`}>
                          {mat.category}
                        </span>
                      </div>
                      <h3 className="mt-2 font-serif font-bold text-ink-900">{lang === 'en' ? mat.name_en : mat.name_fa}</h3>
                      <p className="mt-1 text-sm text-ink-500 line-clamp-2">{lang === 'en' ? mat.description_en : mat.description_fa}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
