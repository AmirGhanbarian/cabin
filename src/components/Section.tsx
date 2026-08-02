import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start';

  return (
    <Reveal className={`flex flex-col ${alignClass} max-w-2xl ${className}`}>
      {eyebrow && (
        <span className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brass-500">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-heading text-ink-900 text-balance">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-500 text-balance">{description}</p>
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
