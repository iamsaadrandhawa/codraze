import { useEffect, useState } from 'react';

const STORAGE_KEY = 'codraze_splash_seen';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

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

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070b18]">
      <div className="hero-grid pointer-events-none absolute inset-0 text-white" style={{ opacity: 0.04 }} />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blaze-600/20 blur-[120px]" />

      <div className="relative flex flex-col items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Codraze" className="h-14 w-14 object-contain animate-fade-in drop-shadow-lg" />
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white animate-fade-in sm:text-5xl">
            Cod<span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">raze</span>
          </h1>
        </div>

        <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-slate-500 animate-fade-in">
          Software · Networking · Training
        </p>

        <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blaze-500 to-blaze-600 transition-[width] duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="mt-2 text-[11px] font-medium tabular-nums text-slate-600">{Math.round(progress)}%</span>
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
