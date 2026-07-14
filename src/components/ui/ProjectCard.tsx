import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  link: string;
  delay?: number;
}

export default function ProjectCard({
  name,
  category,
  image,
  description,
  tags,
  link,
  delay = 0,
}: ProjectCardProps) {
  return (
    <article
      className="card card-hover group overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-surface-base/30 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-surface-base/70 px-3 py-1 text-xs font-medium text-blaze-600 backdrop-blur dark:text-blaze-300">
          {category}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-ink-strong transition-colors group-hover:text-blaze-600 dark:group-hover:text-blaze-300">
            {name}
          </h3>
          <a
            href={link}
            aria-label={`View ${name}`}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-edge/10 bg-edge/5 text-ink-muted transition-all hover:border-blaze-500/50 hover:text-blaze-500 dark:hover:text-blaze-300"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-edge/5 px-2 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-edge/10"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
