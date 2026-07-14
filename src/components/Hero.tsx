import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Flame, Sparkles, Zap, Code2, Network, Database, Terminal, Cpu, Wifi, Cable, Cloud, GitBranch, Globe, Radio } from 'lucide-react';
import { stats } from '../data';
import { useTypewriter } from '../hooks/useTypewriter';

const floatIcons = [
  { Icon: Code2, className: 'left-[6%] top-[18%] animate-float-a', size: 'h-7 w-7', color: 'text-blaze-500 dark:text-blaze-400' },
  { Icon: Terminal, className: 'right-[8%] top-[14%] animate-float-b', size: 'h-6 w-6', color: 'text-emerald-500 dark:text-emerald-400' },
  { Icon: Database, className: 'left-[12%] bottom-[20%] animate-float-c', size: 'h-6 w-6', color: 'text-sky-500 dark:text-sky-400' },
  { Icon: Cpu, className: 'right-[6%] bottom-[24%] animate-float-d', size: 'h-7 w-7', color: 'text-blaze-500 dark:text-blaze-400' },
  { Icon: Wifi, className: 'left-[3%] top-[48%] animate-float-b', size: 'h-6 w-6', color: 'text-sky-500 dark:text-sky-400' },
  { Icon: Cable, className: 'right-[3%] top-[52%] animate-float-a', size: 'h-6 w-6', color: 'text-emerald-500 dark:text-emerald-400' },
  { Icon: Cloud, className: 'left-[18%] top-[8%] animate-float-d', size: 'h-5 w-5', color: 'text-ink-muted' },
  { Icon: GitBranch, className: 'right-[16%] bottom-[10%] animate-float-c', size: 'h-5 w-5', color: 'text-blaze-500 dark:text-blaze-400' },
  { Icon: Globe, className: 'left-[44%] top-[6%] animate-float-a', size: 'h-5 w-5', color: 'text-ink-muted' },
  { Icon: Radio, className: 'right-[40%] bottom-[8%] animate-float-b', size: 'h-5 w-5', color: 'text-sky-500 dark:text-sky-400' },
];

export default function Hero() {
  const typed = useTypewriter();

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      <div className="hero-grid pointer-events-none absolute inset-0 text-ink-strong" style={{ opacity: 'var(--grid-opacity)' }} />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blaze-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-1/4 h-72 w-72 rounded-full bg-blaze-600/10 blur-[120px]" />

      {/* Floating icons */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {floatIcons.map(({ Icon, className, size, color }, i) => (
          <div key={i} className={`absolute ${className} opacity-60 dark:opacity-70`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-edge/10 bg-surface-card/40 backdrop-blur-sm">
              <Icon className={`${size} ${color}`} strokeWidth={1.8} />
            </div>
          </div>
        ))}
      </div>

      {/* Animated wires */}
      <svg className="pointer-events-none absolute inset-0 hidden lg:block" width="100%" height="100%" fill="none" preserveAspectRatio="none">
        <path d="M 0 200 Q 200 120 400 220 T 800 180" stroke="url(#wireGrad)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-wire-dash" strokeLinecap="round" />
        <path d="M 1200 300 Q 1000 200 800 320 T 400 280" stroke="url(#wireGrad)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-wire-dash" strokeLinecap="round" style={{ animationDelay: '0.5s' }} />
        <path d="M 100 500 Q 300 380 600 480 T 1100 420" stroke="url(#wireGrad)" strokeWidth="1" strokeDasharray="4 8" className="animate-wire-dash" strokeLinecap="round" style={{ animationDelay: '1s' }} />
        <defs>
          <linearGradient id="wireGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff5a14" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff5a14" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff5a14" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container-px relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              Software · Networking · Training
            </span>
          </div>

          <h1 className="heading-xl mt-6 text-balance">
            Build fast, powerful{' '}
            <span className="text-gradient">
              {typed}
              <span className="ml-0.5 inline-block w-[3px] animate-caret-blink bg-blaze-500 align-middle dark:bg-blaze-400" style={{ height: '0.85em' }} />
            </span>
            <br />
            that moves your business forward
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink-muted sm:text-lg">
            Codraze is a software house crafting full-stack web & mobile apps, IT and networking
            solutions, and hands-on tech courses — engineered for speed, built to scale.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary w-full sm:w-auto">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/services" className="btn-ghost w-full sm:w-auto">
              Explore Services
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: Code2, label: 'MERN Development' },
              { icon: Network, label: 'Networking Solutions' },
              { icon: GraduationCap, label: 'Tech Courses' },
            ].map((p) => (
              <span key={p.label} className="inline-flex items-center gap-2 rounded-full border border-edge/10 bg-edge/5 px-4 py-2 text-xs font-medium text-ink-muted backdrop-blur">
                <p.icon className="h-3.5 w-3.5 text-blaze-500 dark:text-blaze-400" />
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* Code window */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="card overflow-hidden shadow-2xl dark:shadow-black/50">
            <div className="flex items-center gap-2 border-b border-edge/10 bg-surface-raised/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-green-400/80" />
              <span className="ml-3 flex items-center gap-1.5 text-xs font-medium text-ink-faint">
                <Flame className="h-3.5 w-3.5 text-blaze-500 dark:text-blaze-400" />
                codraze.ts
              </span>
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed sm:text-sm">
              <code className="font-mono">
                <span className="text-ink-faint">{`// We build blazing-fast software`}</span>
                {'\n'}
                <span className="text-blaze-500 dark:text-blaze-400">const</span>{' '}
                <span className="text-sky-500 dark:text-sky-300">codraze</span>{' '}
                <span className="text-ink-faint">=</span>{' '}
                <span className="text-ink">{'{'}</span>
                {'\n  '}
                <span className="text-emerald-600 dark:text-emerald-300">stack</span>
                <span className="text-ink-faint">:</span>{' '}
                <span className="text-amber-600 dark:text-amber-300">"MERN"</span>
                <span className="text-ink-faint">,</span>
                {'\n  '}
                <span className="text-emerald-600 dark:text-emerald-300">services</span>
                <span className="text-ink-faint">:</span>{' '}
                <span className="text-ink">[</span>
                <span className="text-amber-600 dark:text-amber-300">"dev"</span>
                <span className="text-ink-faint">,</span>{' '}
                <span className="text-amber-600 dark:text-amber-300">"networking"</span>
                <span className="text-ink-faint">,</span>{' '}
                <span className="text-amber-600 dark:text-amber-300">"courses"</span>
                <span className="text-ink">]</span>
                <span className="text-ink-faint">,</span>
                {'\n  '}
                <span className="text-emerald-600 dark:text-emerald-300">speed</span>
                <span className="text-ink-faint">:</span>{' '}
                <span className="text-sky-500 dark:text-sky-300">Infinity</span>
                <span className="text-ink-faint">,</span>
                {'\n  '}
                <span className="text-emerald-600 dark:text-emerald-300">ship</span>
                <span className="text-ink-faint">:</span>{' '}
                <span className="text-blaze-500 dark:text-blaze-400">async</span>{' '}
                <span className="text-ink">() {'=>'}</span>{' '}
                <span className="text-amber-600 dark:text-amber-300">"delivered"</span>
                <span className="text-ink-faint">,</span>
                {'\n'}
                <span className="text-ink">{'}'}</span>
                {'\n'}
                <span className="text-blaze-500 dark:text-blaze-400">await</span>{' '}
                <span className="text-sky-500 dark:text-sky-300">codraze</span>
                <span className="text-ink-faint">.</span>
                <span className="text-emerald-600 dark:text-emerald-300">ship</span>
                <span className="text-ink-faint">()</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-3xl font-extrabold text-ink-strong sm:text-4xl">
                <Zap className="h-5 w-5 text-blaze-500 dark:text-blaze-400 sm:h-6 sm:w-6" />
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-faint sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-blaze-500/40 to-transparent" />
    </section>
  );
}
