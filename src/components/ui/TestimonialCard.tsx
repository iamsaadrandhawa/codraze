import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  delay?: number;
}

export default function TestimonialCard({
  name,
  role,
  image,
  quote,
  rating,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <figure
      className="card card-hover group relative flex flex-col p-7"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Quote className="absolute right-6 top-6 h-10 w-10 text-blaze-500/15" fill="currentColor" />

      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, idx) => (
          <Star
            key={idx}
            className="h-4 w-4 text-blaze-500 dark:text-blaze-400"
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
      </div>

      <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">"{quote}"</blockquote>

      <figcaption className="mt-6 flex items-center gap-3.5">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-11 w-11 rounded-full object-cover ring-2 ring-blaze-500/30"
        />
        <div>
          <div className="text-sm font-semibold text-ink-strong">{name}</div>
          <div className="text-xs text-ink-faint">{role}</div>
        </div>
      </figcaption>
    </figure>
  );
}
