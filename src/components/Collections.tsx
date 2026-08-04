import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { Section, SectionHeading } from './Section';
import { useLang } from '@/lib/lang-context';

const collectionImages = [
  'https://images.pexels.com/photos/6969865/pexels-photo-6969865.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/7045356/pexels-photo-7045356.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/16501286/pexels-photo-16501286.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/7061400/pexels-photo-7061400.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

export function Collections() {
  const { t } = useLang();

  return (
    <Section id="collections">
      <SectionHeading
        eyebrow={t.collections.eyebrow}
        title={t.collections.title}
        description={t.collections.description}
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
        {t.collections.items.map((col, i) => (
          <Reveal key={i} delay={i * 100}>
            <article className="group relative overflow-hidden rounded-3xl bg-ink-900">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={collectionImages[i]}
                  alt={col.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-900/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brass-400">
                      {col.tagline}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-cream-50 lg:text-3xl">
                      {col.name}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-cream-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {col.description}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass-500/90 text-ink-900 transition-all group-hover:bg-brass-400 group-hover:scale-110">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
