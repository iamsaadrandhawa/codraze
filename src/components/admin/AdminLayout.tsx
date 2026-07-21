import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderKanban, Mail, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/contacts', label: 'Messages', icon: Mail },
];

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#070b18] text-slate-200">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0a0f1e] lg:flex">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 border-b border-white/10 px-6 py-5">
          <img src="/logo.png" alt="Codraze" className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-extrabold text-white">
            Cod<span className="text-orange-500">raze</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blaze-500/15 text-blaze-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <n.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.8} />
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4.5 w-4.5" strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0a0f1e] px-4 py-3 lg:hidden">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="Codraze" className="h-8 w-8 object-contain" />
          <span className="font-display text-base font-extrabold text-white">
            Cod<span className="text-orange-500">raze</span>
          </span>
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {/* Mobile nav */}
      <nav className="flex gap-1 overflow-x-auto border-b border-white/10 bg-[#0a0f1e] px-3 py-2 lg:hidden">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex flex-none items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive ? 'bg-blaze-500/15 text-blaze-400' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <n.icon className="h-4 w-4" strokeWidth={1.8} />
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* Main */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {user && (
            <div className="mb-6 hidden text-right text-xs text-slate-500 lg:block">
              Signed in as <span className="font-medium text-slate-400">{user.email}</span>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
