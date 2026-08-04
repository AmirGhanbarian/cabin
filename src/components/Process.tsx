import { Reveal } from './Reveal';
import { Section, SectionHeading } from './Section';
import { useLang } from '@/lib/lang-context';

export function Process() {
  const { t } = useLang();

  return (
    <Section id="process">
      <SectionHeading
        eyebrow={t.process.eyebrow}
        title={t.process.title}
        description={t.process.description}
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {t.process.steps.map((step, i) => (
          <Reveal key={i} delay={i * 120}>
            <div className="relative h-full">
              {i < t.process.steps.length - 1 && (
                <div className="absolute top-8 left-[60%] hidden h-px w-full bg-gradient-to-r from-brass-300 to-transparent lg:block rtl:bg-gradient-to-l" />
              )}

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass-300 bg-cream-50 font-serif text-xl font-bold text-brass-500">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>

              <h3 className="mt-6 font-serif text-xl font-bold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
