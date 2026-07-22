import { useEffect, useState } from 'react';
import { Plus, UserPlus, ShieldCheck } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Profile, Role } from '../../../lib/types';
import { formatDate } from '../../../lib/utils';
import { useAuth } from '../../../lib/auth';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [makeSuperAdmin, setMakeSuperAdmin] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('roles').select('*').order('name'),
    ]);
    if (p) setProfiles(p);
    if (r) setRoles(r);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

 const handleAddUser = async () => {
  setError(null);
  setSuccess(null);
  
  if (!email.trim()) {
    setError('Email is required');
    return;
  }
  if (!password.trim()) {
    setError('Password is required');
    return;
  }
  if (password.trim().length < 8) {
    setError('Password must be at least 8 characters');
    return;
  }
  if (!makeSuperAdmin && !roleId) {
    setError('Select a role, or mark as Super Admin');
    return;
  }
  
  setAdding(true);
  const { data, error } = await supabase.functions.invoke('create-admin-user', {
    body: {
      email: email.trim(),
      password: password.trim(),
      full_name: fullName.trim(),
      role_id: makeSuperAdmin ? null : roleId,
      is_super_admin: makeSuperAdmin,
    },
  });
  setAdding(false);
  
  if (error) { 
    setError(error.message); 
    return; 
  }
  if (data?.error) { 
    setError(data.error); 
    return; 
  }
  
  setSuccess(`User created successfully. They can now log in with their password.`);
  setEmail('');
  setPassword('');
  setFullName('');
  setRoleId('');
  setMakeSuperAdmin(false);
  setShowAddUser(false);
  load();
};

  const updateUserRole = async (id: string, newRoleId: string) => {
    await supabase.from('profiles').update({ role_id: newRoleId || null }).eq('id', id);
    load();
  };

  const toggleStatus = async (p: Profile) => {
    await supabase.from('profiles').update({ status: p.status === 'active' ? 'disabled' : 'active' }).eq('id', p.id);
    load();
  };

  const roleName = (id: string | null) => roles.find((r) => r.id === id)?.name ?? '—';

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="mt-1 text-sm text-slate-400">Manage who has access to the admin panel</p>
        </div>
        <button onClick={() => setShowAddUser((v) => !v)} className="btn-primary">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {showAddUser && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold text-white">Add a new admin user</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blaze-500/50"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blaze-500/50"
              placeholder="Password (min 8 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blaze-500/50 sm:col-span-2"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <select
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-blaze-500/50 disabled:opacity-50"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              disabled={makeSuperAdmin}
            >
              <option value="">Select a role…</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={makeSuperAdmin}
                onChange={(e) => setMakeSuperAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-blaze-500 focus:ring-blaze-500/40"
              />
              Make Super Admin
            </label>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          {success && <p className="mt-3 text-sm text-emerald-400">{success}</p>}
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowAddUser(false)} className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">
              Cancel
            </button>
            <button onClick={handleAddUser} disabled={adding} className="btn-primary disabled:opacity-60">
              <UserPlus className="h-4 w-4" /> {adding ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Joined</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {profiles.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-white/5">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 font-medium text-slate-200">
                      {p.full_name || p.email}
                      {p.id === currentUser?.id && <ShieldCheck className="h-3.5 w-3.5 text-blaze-400" />}
                    </div>
                    <div className="text-xs text-slate-500">{p.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.is_super_admin ? (
                      <span className="rounded-full bg-blaze-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-blaze-400">
                        Super Admin
                      </span>
                    ) : (
                      <select
                        value={p.role_id ?? ''}
                        onChange={(e) => updateUserRole(p.id, e.target.value)}
                        disabled={p.id === currentUser?.id}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 outline-none disabled:opacity-50"
                      >
                        <option value="">No role</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      p.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-slate-400 sm:table-cell">{formatDate(p.created_at)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => toggleStatus(p)}
                      disabled={p.id === currentUser?.id}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                        p.status === 'active'
                          ? 'border-white/10 text-slate-400 hover:border-red-500/50 hover:text-red-400'
                          : 'border-white/10 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'
                      }`}
                    >
                      {p.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}