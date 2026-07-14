import { useReveal } from '../../hooks/useReveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: SectionHeadingProps) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="heading-lg mt-5 text-balance">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-balance text-base leading-relaxed text-ink-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
