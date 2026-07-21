import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

export default function AdminLogin() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) {
    const dest = (location.state as { from?: string })?.from ?? '/admin/dashboard';
    return <Navigate to={dest} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b18] px-4">
      <div className="hero-grid pointer-events-none absolute inset-0 text-white" style={{ opacity: 0.04 }} />
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-blaze-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-72 w-72 rounded-full bg-blaze-600/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <img src="/logo.png" alt="Codraze" className="h-12 w-12 object-contain drop-shadow-lg" />
          <span className="font-display text-2xl font-extrabold tracking-tight text-white">
            Cod<span className="text-orange-500">raze</span>
          </span>
        </Link>

        <div className="card border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-center text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-center text-sm text-slate-400">Sign in to manage your content</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@codraze.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <Link to="/" className="mt-6 block text-center text-xs text-slate-500 transition-colors hover:text-slate-300">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
