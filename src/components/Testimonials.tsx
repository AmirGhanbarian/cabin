import { Star, Quote } from 'lucide-react';
import { Reveal } from './Reveal';
import { Section, SectionHeading } from './Section';
import { useLang } from '@/lib/lang-context';

export function Testimonials() {
  const { t } = useLang();

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow={t.testimonials.eyebrow}
        title={t.testimonials.title}
        description={t.testimonials.description}
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
        {t.testimonials.items.map((item, i) => (
          <Reveal key={i} delay={i * 100}>
            <figure className="flex h-full flex-col rounded-2xl border border-ink-100 bg-cream-50 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-ink-900/5">
              <Quote className="h-8 w-8 text-brass-300" />
              <div className="mt-4 flex gap-0.5">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-brass-400 text-brass-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink-700">
                "{item.quote}"
              </blockquote>
              <figcaption className="mt-6 border-t border-ink-100 pt-4">
                <div className="font-semibold text-ink-900">{item.name}</div>
                <div className="mt-0.5 text-sm text-ink-400">{item.location}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
