import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import {
  type Role, type RoleInput, type ModuleKey,
  MODULE_LABELS, TAB_OPTIONS, emptyPermissions,
} from '../../../lib/types';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400';

const moduleKeys = Object.keys(MODULE_LABELS) as ModuleKey[];
const actions: Array<'create' | 'read' | 'update' | 'delete'> = ['read', 'create', 'update', 'delete'];

export default function AdminRoleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tabs, setTabs] = useState<string[]>(['dashboard']);
  const [permissions, setPermissions] = useState(emptyPermissions());
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data, error } = await supabase.from('roles').select('*').eq('id', id).maybeSingle();
      if (error || !data) {
        setError('Role not found');
        setLoading(false);
        return;
      }
      const r = data as Role;
      setName(r.name);
      setDescription(r.description ?? '');
      setTabs(r.tabs);
      setPermissions({ ...emptyPermissions(), ...r.permissions });
      setLoading(false);
    })();
  }, [id, isEdit]);

  const toggleTab = (key: string) => {
    setTabs((prev) => (prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]));
  };

  const togglePermission = (mod: ModuleKey, action: 'create' | 'read' | 'update' | 'delete') => {
    setPermissions((prev) => ({
      ...prev,
      [mod]: { ...prev[mod], [action]: !prev[mod][action] },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Role name is required');
      return;
    }
    setSaving(true);
    const payload: RoleInput = {
      name: name.trim(),
      description: description.trim() || null,
      tabs,
      permissions,
    };
    let res;
    if (isEdit) {
      res = await supabase.from('roles').update(payload).eq('id', id);
    } else {
      res = await supabase.from('roles').insert(payload);
    }
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    navigate('/admin/roles');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/roles" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to roles
      </Link>
      <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Role' : 'New Role'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div>
          <label className={labelClass} htmlFor="name">Role Name *</label>
          <input id="name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Data Entry" />
        </div>
        <div>
          <label className={labelClass} htmlFor="description">Description</label>
          <input id="description" className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Can only manage blog posts" />
        </div>

        <div>
          <label className={labelClass}>Visible Tabs</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TAB_OPTIONS.map((t) => (
              <label
                key={t.key}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={tabs.includes(t.key)}
                  onChange={() => toggleTab(t.key)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-blaze-500 focus:ring-blaze-500/40"
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Module Permissions</label>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Module</th>
                  {actions.map((a) => (
                    <th key={a} className="px-4 py-2.5 text-center font-medium capitalize">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {moduleKeys.map((mod) => (
                  <tr key={mod}>
                    <td className="px-4 py-2.5 font-medium text-slate-300">{MODULE_LABELS[mod]}</td>
                    {actions.map((a) => (
                      <td key={a} className="px-4 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions[mod][a]}
                          onChange={() => togglePermission(mod, a)}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-blaze-500 focus:ring-blaze-500/40"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/admin/roles" className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}