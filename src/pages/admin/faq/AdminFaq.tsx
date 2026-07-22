import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ShieldQuestionIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Faq } from '../../../lib/types';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
    if (!error && data) setFaqs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('faqs').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">FAQ</h1>
          <p className="mt-1 text-sm text-slate-400">Manage frequently asked questions</p>
        </div>
        <Link to="/admin/faq/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New FAQ
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShieldQuestionIcon className="h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">No FAQs yet</p>
            <Link to="/admin/faq/new" className="mt-4 text-sm font-medium text-blaze-400 hover:text-blaze-300">
              Add your first FAQ →
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Question</th>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {faqs.map((f) => (
                <tr key={f.id} className="transition-colors hover:bg-white/5">
                  <td className="px-5 py-3.5">
                    <div className="max-w-md truncate font-medium text-slate-200">{f.question}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{f.display_order}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      f.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/faq/${f.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-blaze-500/50 hover:text-blaze-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(f.id)}
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
        title="Delete FAQ?"
        message="This will permanently delete this FAQ entry. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}