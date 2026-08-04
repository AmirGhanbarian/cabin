import { ShieldCheck, Hammer, Trees, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';
import { Section, SectionHeading } from './Section';
import { useLang } from '@/lib/lang-context';

const icons = [Hammer, Trees, ShieldCheck, Sparkles];

export function WhyRUF() {
  const { t } = useLang();

  return (
    <Section id="why-ruf" className="bg-cream-200/50">
      <SectionHeading
        eyebrow={t.whyRuf.eyebrow}
        title={t.whyRuf.title}
        description={t.whyRuf.description}
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {t.whyRuf.features.map((feat, i) => {
          const Icon = icons[i];
          return (
            <Reveal key={i} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-ink-100 bg-cream-50 p-8 transition-all duration-300 hover:border-brass-300 hover:shadow-xl hover:shadow-brass-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brass-500/10 text-brass-500 transition-colors group-hover:bg-brass-500 group-hover:text-ink-900">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-serif text-xl font-bold text-ink-900">
                  {feat.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {feat.description}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
