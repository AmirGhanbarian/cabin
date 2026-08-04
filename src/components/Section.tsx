import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  tone?: 'dark' | 'light';
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
  tone = 'dark',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start';
  const titleColor = tone === 'light' ? 'text-cream-50' : 'text-ink-900';
  const descColor = tone === 'light' ? 'text-cream-300' : 'text-ink-500';

  return (
    <Reveal className={`flex flex-col ${alignClass} max-w-2xl ${className}`}>
      {eyebrow && (
        <span className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brass-500">
          {eyebrow}
        </span>
      )}
      <h2 className={`font-serif text-heading ${titleColor} text-balance`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${descColor} text-balance`}>{description}</p>
      )}
    </Reveal>
  );
}

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`section-pad container-px ${className}`}>
      {children}
    </section>
  );
}
