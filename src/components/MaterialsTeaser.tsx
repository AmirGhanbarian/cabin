import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { Section, SectionHeading } from './Section';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { supabase, type Material } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function MaterialsTeaser() {
  const { t, lang } = useLang();
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    supabase
      .from('materials')
      .select('*')
      .order('sort_order', { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data) setMaterials(data as Material[]);
      });
  }, []);

  return (
    <Section id="materials" className="bg-ink-900">
      <SectionHeading
        eyebrow={t.materials.eyebrow}
        title={t.materials.title}
        description={t.materials.description}
      />

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {materials.map((mat, i) => (
          <Reveal key={mat.id} delay={i * 80}>
            <div className="group relative overflow-hidden rounded-2xl">
              <div className="aspect-square overflow-hidden">
                <img
                  src={mat.image_url}
                  alt={lang === 'en' ? mat.name_en : mat.name_fa}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <span className="text-xs font-medium text-brass-400">{mat.code}</span>
                <h3 className="mt-1 font-serif text-lg font-bold text-cream-50 lg:text-xl">
                  {lang === 'en' ? mat.name_en : mat.name_fa}
                </h3>
                <p className="mt-1 text-xs text-cream-300 lg:text-sm line-clamp-2">
                  {lang === 'en' ? mat.description_en : mat.description_fa}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate({ name: 'materials' })}
          className="group inline-flex items-center gap-2 rounded-full border border-cream-200/30 px-8 py-4 text-base font-medium text-cream-100 transition-all hover:border-cream-200/60 hover:bg-cream-50/10"
        >
          {t.materials.exploreCatalog}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </button>
      </div>
    </Section>
  );
}
