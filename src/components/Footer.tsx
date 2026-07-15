import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { footerLinks, socials, icons } from '../data';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-edge/10 bg-surface-base">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blaze-500/40 to-transparent" />

      <div className="container-px py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
  to="/"
  className="group inline-flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
>
  {/* Logo */}
  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-md ring-1 ring-slate-200 dark:ring-slate-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(249,115,22,0.25)]">
    <img
      src="/logo.png"
      alt="Codraze Logo"
      className="h-8 w-8 object-contain"
    />
  </div>

  {/* Brand Name */}
  <div className="leading-none">
    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
      Cod
      <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent">
        raze
      </span>
    </h1>
  </div>
</Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Fast, powerful software solutions — development, networking, and training. Built by
              engineers who ship.
            </p>

            {/* Newsletter */}
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex max-w-sm gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-xl border border-edge/10 bg-surface-raised/60 py-2.5 pl-10 pr-3 text-sm text-ink-strong placeholder-ink-faint outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20"
                />
              </div>
              <button
                type="submit"
                className="flex-none rounded-xl bg-gradient-to-r from-blaze-500 to-blaze-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-blaze-400 hover:to-blaze-500"
              >
                Subscribe
              </button>
            </form>

            {/* Socials */}
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => {
                const Icon = icons[s.icon as keyof typeof icons];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge/10 bg-edge/5 text-ink-muted transition-all hover:border-blaze-500/50 hover:bg-blaze-500/10 hover:text-blaze-500 hover:-translate-y-0.5 dark:hover:text-blaze-300"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink-strong">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-sm text-ink-muted transition-colors hover:text-blaze-600 dark:hover:text-blaze-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 border-t border-edge/10 pt-6 sm:flex-row">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Codraze. All rights reserved.
          </p>
          <p className="text-xs text-ink-faint">
            Developed by{' '}
            <Link to="/" className="font-semibold text-blaze-600 hover:text-blaze-500 dark:text-blaze-400 dark:hover:text-blaze-300">
              Codraze
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
