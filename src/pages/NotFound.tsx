import { Link } from 'react-router-dom';
import { Home, ArrowRight, Flame } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-20">
      <div className="hero-grid pointer-events-none absolute inset-0 text-ink-strong" style={{ opacity: 'var(--grid-opacity)' }} />
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-blaze-600/15 blur-[120px]" />

      <div className="container-px relative text-center">
        <div className="flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blaze-500 to-blaze-700 shadow-lg shadow-blaze-600/30">
            <Flame className="h-8 w-8 text-white" strokeWidth={2.5} />
          </span>
        </div>
        <h1 className="mt-8 font-display text-7xl font-extrabold text-ink-strong sm:text-8xl">
          4<span className="text-gradient">0</span>4
        </h1>
        <h2 className="heading-md mt-4">Page Not Found</h2>
        <p className="mx-auto mt-4 max-w-md text-ink-muted">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link to="/services" className="btn-ghost">
            Explore Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
