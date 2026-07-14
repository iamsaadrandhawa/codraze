import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  delay?: number;
}

export default function BlogCard({
  title,
  excerpt,
  image,
  date,
  category,
  readTime,
  delay = 0,
}: BlogCardProps) {
  return (
    <article
      className="card card-hover group flex flex-col overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base/60 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-surface-base/80 px-3 py-1 text-xs font-medium text-blaze-600 backdrop-blur dark:text-blaze-300">
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold text-ink-strong transition-colors group-hover:text-blaze-600 dark:group-hover:text-blaze-300">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{excerpt}</p>

        <Link
          to="/blog"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blaze-600 transition-colors hover:text-blaze-500 dark:text-blaze-400 dark:hover:text-blaze-300"
        >
          Read More
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
