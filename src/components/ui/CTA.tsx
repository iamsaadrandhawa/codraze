import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';

interface CTAProps {
  title?: React.ReactNode;
  subtitle?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export default function CTA({
  title = 'Ready to move fast?',
  subtitle = "Let's build your software, fix your network, or level up your skills.",
  primaryLabel = 'Start Your Project',
  primaryTo = '/contact',
  secondaryLabel = 'Explore Services',
  secondaryTo = '/services',
}: CTAProps) {
  const { ref, visible } = useReveal();

  return (
    <section className="section-pad">
      <div className="container-px">
        <div
          ref={ref}
          className={`reveal ${visible ? 'is-visible' : ''} relative overflow-hidden rounded-3xl border border-edge/10 bg-gradient-to-br from-surface-card to-surface-raised p-8 sm:p-12`}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blaze-600/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-blaze-600/10 blur-[80px]" />

          <div className="relative flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h3 className="heading-md text-2xl sm:text-3xl">{title}</h3>
              <p className="mt-2 text-ink-muted">{subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={primaryTo} className="btn-primary">
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={secondaryTo} className="btn-ghost">
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
