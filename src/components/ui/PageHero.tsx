import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40">
      <div
        className="hero-grid pointer-events-none absolute inset-0 text-ink-strong"
        style={{ opacity: 'var(--grid-opacity)' }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blaze-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-1/4 h-72 w-72 rounded-full bg-blaze-600/10 blur-[120px]" />

      <div className="container-px relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <span className="eyebrow">
              <Flame className="h-3.5 w-3.5" />
              {eyebrow}
            </span>
          </div>
          <h1 className="heading-xl mt-6 text-balance">{title}</h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink-muted sm:text-lg">
              {subtitle}
            </p>
          )}
          
        </div>
      </div>
    </section>
  );
}
