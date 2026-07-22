import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderKanban, Mail, LogOut, ExternalLink, HandCoins, GraduationCap, HeartPulse, UserPlus, ShieldQuestionIcon, KeyRound } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { canAccessTab } from '../../lib/permissions';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, tabKey: 'dashboard' },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText, tabKey: 'blogs' },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban, tabKey: 'projects' },
  { to: '/admin/services', label: 'Services', icon: HandCoins, tabKey: 'services' },
  { to: '/admin/courses', label: 'Courses', icon: GraduationCap, tabKey: 'courses' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: HeartPulse, tabKey: 'testimonials' },
  { to: '/admin/faq', label: 'FAQ', icon: ShieldQuestionIcon, tabKey: 'faq' },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail, tabKey: 'contacts' },
];

const superAdminNav = [
  { to: '/admin/users', label: 'Users', icon: UserPlus },
  { to: '/admin/roles', label: 'Roles', icon: KeyRound },
];

export default function AdminLayout() {
  const { signOut, user, profile, role } = useAuth();
  const navigate = useNavigate();

  const visibleNav = nav.filter((n) => canAccessTab(profile, role, n.tabKey));
  const fullNav = profile?.is_super_admin ? [...visibleNav, ...superAdminNav] : visibleNav;

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#070b18] text-slate-200">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0a0f1e] lg:flex">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 border-b border-white/10 px-6 py-5">
          <img src="/logo.png" alt="Codraze" className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-extrabold text-white">
            Cod<span className="text-orange-500">raze</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {fullNav.map((n) => (
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

      <nav className="flex gap-1 overflow-x-auto border-b border-white/10 bg-[#0a0f1e] px-3 py-2 lg:hidden">
        {fullNav.map((n) => (
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