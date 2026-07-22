import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { navLinks } from '../data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-edge/10 bg-surface-base/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between lg:h-20">
        {/* Logo */}
      <Link
  to="/"
  className="group inline-flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
>
  <img
    src="/logo.png"
    alt="Codraze Logo"
    className="h-11 w-11 object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-2"
  />

  <div className="leading-none">
    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
      Cod<span className="text-orange-500">raze</span>
    </h1>
  </div>
</Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blaze-600 dark:text-blaze-400'
                      : 'text-ink-muted hover:text-ink-strong'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-blaze-500" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop right */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <a
                href="https://wa.me/923171725977?text=Hello%20Codraze!%20I%20am%20interested%20in%20your%20services.%20Please%20share%20more%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-400/30 bg-emerald-500/30 px-4 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-500/15 hover:-translate-y-0.5 dark:text-emerald-300"
              >
                <MessageCircle className="h-5 w-5" />
                  Quick Chat
              </a>
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-edge/10 bg-edge/5 text-ink-strong"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-edge/10 bg-surface-base/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? 'max-h-[600px]' : 'max-h-0'
        }`}
      >
        <ul className="container-px flex flex-col gap-1 py-4">
          {navLinks.map((l, i) => (
            <li
              key={l.to}
              style={{ animationDelay: `${i * 40}ms` }}
              className={open ? 'animate-slide-in-left' : ''}
            >
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blaze-500/10 text-blaze-600 dark:text-blaze-400'
                      : 'text-ink-muted hover:bg-edge/5 hover:text-ink-strong'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="mt-2">
             <a
                href="https://wa.me/923171725977?text=Hello%20Codraze!%20I%20am%20interested%20in%20your%20services.%20Please%20share%20more%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-400/30 bg-emerald-500/30 px-4 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-500/15 hover:-translate-y-0.5 dark:text-emerald-300"
              >
                <MessageCircle className="h-5 w-5" />
                  Quick Chat
                               </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
