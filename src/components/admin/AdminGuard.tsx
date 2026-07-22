import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { canAccessTab } from '../../lib/permissions';

interface AdminGuardProps {
  tabKey?: string;
  superAdminOnly?: boolean;
}

export default function AdminGuard({ tabKey, superAdminOnly }: AdminGuardProps) {
  const { session, loading, profile, role, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || (session && profileLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b18]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (profile?.status === 'disabled') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#070b18] text-center">
        <p className="text-lg font-semibold text-white">Your account has been disabled</p>
        <p className="text-sm text-slate-400">Contact a super admin for access.</p>
      </div>
    );
  }

  if (superAdminOnly && !profile?.is_super_admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (tabKey && !canAccessTab(profile, role, tabKey)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}