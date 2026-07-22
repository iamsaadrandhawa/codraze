import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, Clock, Tag } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  timeAgo?: string;
  category: string;
  readTime: string;
  slug?: string;
  delay?: number;
  tags?: string[];
}

export default function BlogCard({
  title,
  excerpt,
  image,
  author,
  date,
  timeAgo,
  category,
  readTime,
  slug,
  delay = 0,
  tags = [],
}: BlogCardProps) {
  return (
    <article
      className="card card-hover group flex flex-col overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base/60 to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute left-4 top-4 rounded-full bg-surface-base/80 px-3 py-1 text-xs font-medium text-blaze-600 backdrop-blur dark:text-blaze-300">
          {category}
        </span>

        {/* Read Time Badge */}
        <span className="absolute right-4 top-4 rounded-full bg-surface-base/80 px-3 py-1 text-xs font-medium text-ink-muted backdrop-blur">
          {readTime}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-ink-faint">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blaze-400/20 to-blaze-600/20">
              <span className="text-xs font-semibold text-blaze-500">
                {author.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-medium text-ink-muted">{author}</span>
          </div>
          <div className="flex items-center gap-3">
            {timeAgo ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {date}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-semibold text-ink-strong transition-colors group-hover:text-blaze-600 dark:group-hover:text-blaze-300 line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted line-clamp-3">
          {excerpt}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-edge/5 px-2 py-0.5 text-xs text-ink-faint"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-ink-faint">+{tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Read More Link */}
        <Link
          to={slug ? `/blog/${slug}` : '/blog'}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blaze-600 transition-colors hover:text-blaze-500 dark:text-blaze-400 dark:hover:text-blaze-300 group/link"
        >
          Read More
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}