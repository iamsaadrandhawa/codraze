import { useEffect, useState } from 'react';

const STORAGE_KEY = 'codraze_splash_seen';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(prefersDark.matches);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    prefersDark.addEventListener('change', handleThemeChange);
    return () => prefersDark.removeEventListener('change', handleThemeChange);
  }, []);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(STORAGE_KEY, '1');
        onDone();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const bgColor = isDark ? 'bg-[#070b18]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const progressBg = isDark ? 'bg-white/10' : 'bg-gray-200';
  const progressTextColor = isDark ? 'text-slate-600' : 'text-slate-400';
  const glowColor = isDark ? 'bg-blaze-600/20' : 'bg-orange-400/20';
  const gridOpacity = isDark ? '0.04' : '0.02';

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${bgColor} transition-colors duration-300`}>
      <div 
        className="hero-grid pointer-events-none absolute inset-0" 
        style={{ 
          opacity: gridOpacity,
          backgroundImage: isDark 
            ? 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)'
            : 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />
      <div className={`pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full ${glowColor} blur-[120px]`} />

      <div className="relative flex flex-col items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Codraze" className="h-14 w-14 object-contain animate-fade-in drop-shadow-lg" />
          <h1 className={`font-display text-4xl font-extrabold tracking-tight ${textColor} animate-fade-in sm:text-5xl`}>
            Cod<span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">raze</span>
          </h1>
        </div>

        <p className={`mt-3 text-xs font-medium uppercase tracking-[0.3em] ${subtitleColor} animate-fade-in`}>
          Software · Networking · Training
        </p>

        <div className={`mt-8 h-1 w-56 overflow-hidden rounded-full ${progressBg}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-[width] duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`mt-2 text-[11px] font-medium tabular-nums ${progressTextColor}`}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

export function shouldShowSplash(): boolean {
  try {
    return !sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return true;
  }
}

export function clearSplashFlag() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}