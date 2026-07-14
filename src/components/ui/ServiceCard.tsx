import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { icons } from '../../data';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  points?: string[];
  delay?: number;
}

export default function ServiceCard({
  icon,
  title,
  description,
  points,
  delay = 0,
}: ServiceCardProps) {
  const Icon = icons[icon as keyof typeof icons];
  const { Check } = icons;

  return (
    <article
      className="card card-hover group relative flex flex-col p-7"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blaze-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blaze-500/20 to-blaze-700/10 p-3 ring-1 ring-blaze-500/20 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6 text-blaze-500 dark:text-blaze-400" strokeWidth={1.8} />
      </div>

      <h3 className="heading-md mt-6 text-xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{description}</p>

      {points && (
        <ul className="mt-5 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm text-ink">
              <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-blaze-500/15">
                <Check className="h-3 w-3 text-blaze-500 dark:text-blaze-400" strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/services"
        className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-blaze-600 transition-colors hover:text-blaze-500 dark:text-blaze-400 dark:hover:text-blaze-300"
      >
        Learn More
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
