import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border border-edge/10 bg-edge/5 text-ink-muted transition-all duration-300 hover:border-blaze-500/50 hover:text-blaze-500 dark:hover:text-blaze-300 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 animate-fade-in" />
      ) : (
        <Moon className="h-5 w-5 animate-fade-in" />
      )}
    </button>
  );
}
