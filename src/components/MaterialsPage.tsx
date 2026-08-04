import { useEffect, useState, useMemo } from 'react';
import { Search, Heart, ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { supabase, type Material } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';

export function MaterialsPage() {
  const { t, lang } = useLang();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'color' | 'material'>('all');

  useEffect(() => {
    supabase
      .from('materials')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setMaterials(data as Material[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const matchesFilter = filter === 'all' || m.category === filter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        m.name_en.toLowerCase().includes(q) ||
        m.name_fa.includes(search) ||
        m.code.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [materials, filter, search]);

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-ink-900 section-pad">
        <div className="container-px">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t.materialsPage.backToHome}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">
            {t.materialsPage.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-300">
            {t.materialsPage.subtitle}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-16 z-30 border-b border-ink-100 bg-cream-100/90 backdrop-blur-md lg:top-20">
        <div className="container-px flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-full bg-cream-200 p-1">
            {([
              { key: 'all', label: t.materialsPage.filterAll },
              { key: 'color', label: t.materialsPage.filterColors },
              { key: 'material', label: t.materialsPage.filterMaterials },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f.key
                    ? 'bg-ink-900 text-cream-100'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 text-ink-400 h-4 w-4 ltr:left-4 rtl:right-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.materialsPage.searchPlaceholder}
              className="w-full rounded-full border border-ink-200 bg-cream-50 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200 sm:w-72 ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-ink-400">{t.materialsPage.noResults}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {filtered.map((mat, i) => (
                <Reveal key={mat.id} delay={i * 60}>
                  <article className="group overflow-hidden rounded-2xl border border-ink-100 bg-cream-50 transition-all duration-300 hover:border-brass-300 hover:shadow-xl hover:shadow-brass-500/10">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={mat.image_url}
                        alt={lang === 'en' ? mat.name_en : mat.name_fa}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 lg:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          mat.category === 'color'
                            ? 'bg-brass-100 text-brass-700'
                            : 'bg-sage-100 text-sage-600'
                        }`}>
                          {mat.category === 'color' ? t.materialsPage.color : t.materialsPage.material}
                        </span>
                        <span className="text-xs font-semibold text-ink-400">{mat.code}</span>
                      </div>
                      <h3 className="mt-3 font-serif text-xl font-bold text-ink-900">
                        {lang === 'en' ? mat.name_en : mat.name_fa}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">
                        {lang === 'en' ? mat.description_en : mat.description_fa}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
