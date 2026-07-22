import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Mail,
  LogOut,
  ExternalLink,
  HandCoins,
  GraduationCap,
  HeartPulse,
  UserPlus,
  ShieldQuestionIcon,
  KeyRound,
  Menu,
  X,
  CreditCard,
  Monitor
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { canAccessTab } from '../../lib/permissions';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, tabKey: 'dashboard' },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText, tabKey: 'blogs' },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban, tabKey: 'projects' },
  { to: '/admin/services', label: 'Services', icon: HandCoins, tabKey: 'services' },
  { to: '/admin/courses', label: 'Courses', icon: GraduationCap, tabKey: 'courses' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: HeartPulse, tabKey: 'testimonials' },
   { to: '/admin/subscribers', label: 'Subscribers', icon: UserPlus, tabKey: 'subscribers' },
  { to: '/admin/pricing', label: 'Pricing', icon: CreditCard, tabKey: 'pricing' },
  { to: '/admin/faq', label: 'FAQ', icon: ShieldQuestionIcon, tabKey: 'faq' },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail, tabKey: 'contacts' },
  { to: '/admin/location', label: 'Location', icon: Monitor, tabKey: 'location' },
];

const superAdminNav = [
  { to: '/admin/users', label: 'Users', icon: UserPlus },
  { to: '/admin/roles', label: 'Roles', icon: KeyRound },
];

export default function AdminLayout() {
  const { signOut, user, profile, role } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const visibleNav = nav.filter((n) => canAccessTab(profile, role, n.tabKey));
  const fullNav = profile?.is_super_admin ? [...visibleNav, ...superAdminNav] : visibleNav;

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070b18] text-slate-200">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0a0f1e] lg:flex">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 border-b border-white/10 px-6 py-5">
          <img src="/logo.png" alt="Codraze" className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-extrabold text-white">
            Cod<span className="text-orange-500">raze</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {fullNav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? 'bg-orange-500/15 text-orange-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <n.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
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

      {/* ===== MOBILE HEADER ===== */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0a0f1e] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <img src="/logo.png" alt="Codraze" className="h-8 w-8 object-contain" />
            <span className="font-display text-base font-extrabold text-white">
              Cod<span className="text-orange-500">raze</span>
            </span>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* ===== MOBILE SIDEBAR ===== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-[#0a0f1e] transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Mobile Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <img src="/logo.png" alt="Codraze" className="h-8 w-8 object-contain" />
            <span className="font-display text-base font-extrabold text-white">
              Cod<span className="text-orange-500">raze</span>
            </span>
          </Link>
          <button
            onClick={closeMobileMenu}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {fullNav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? 'bg-orange-500/15 text-orange-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <n.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Footer Actions */}
        <div className="border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            onClick={closeMobileMenu}
          >
            <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.8} />
            View Site
          </a>
          <button
            onClick={() => {
              closeMobileMenu();
              handleLogout();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4.5 w-4.5" strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {user && (
            <div className="mb-4 hidden text-right text-xs text-slate-500 lg:block">
              Signed in as <span className="font-medium text-slate-400">{user.email}</span>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}