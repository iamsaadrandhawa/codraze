import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, KeyRound } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Role } from '../../../lib/types';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('roles').select('*').order('created_at', { ascending: false });
    if (!error && data) setRoles(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('roles').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles</h1>
          <p className="mt-1 text-sm text-slate-400">Define which tabs and permissions each role has</p>
        </div>
        <Link to="/admin/roles/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New Role
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
          </div>
        ) : roles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <KeyRound className="h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">No roles yet</p>
            <Link to="/admin/roles/new" className="mt-4 text-sm font-medium text-blaze-400 hover:text-blaze-300">
              Create your first role →
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Tabs</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {roles.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-white/5">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-200">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.description}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {r.tabs.map((t) => (
                        <span key={t} className="rounded-full bg-blaze-500/10 px-2 py-0.5 text-[10px] font-medium text-blaze-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/roles/${r.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-blaze-500/50 hover:text-blaze-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(r.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-red-500/50 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete role?"
        message="Users with this role will lose their permissions. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}