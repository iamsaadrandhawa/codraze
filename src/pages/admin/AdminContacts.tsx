import { useEffect, useState } from 'react';
import { Mail, Trash2, MailOpen, Mail as MailIcon, X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ContactSubmission } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setContacts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openMessage = async (c: ContactSubmission) => {
    setSelected(c);
    if (!c.is_read) {
      await supabase.from('contact_submissions').update({ is_read: true }).eq('id', c.id);
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_read: true } : x)));
    }
  };

  const toggleRead = async (c: ContactSubmission) => {
    const next = !c.is_read;
    await supabase.from('contact_submissions').update({ is_read: next }).eq('id', c.id);
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_read: next } : x)));
    if (selected?.id === c.id) setSelected({ ...c, is_read: next });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('contact_submissions').delete().eq('id', deleteId);
    if (selected?.id === deleteId) setSelected(null);
    setDeleteId(null);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Messages</h1>
      <p className="mt-1 text-sm text-slate-400">Contact form submissions</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">No messages yet</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Email</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Received</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contacts.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openMessage(c)}
                  className="cursor-pointer transition-colors hover:bg-white/5"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {!c.is_read && <span className="h-2 w-2 flex-none rounded-full bg-blaze-500" />}
                      <span className={`font-medium ${c.is_read ? 'text-slate-300' : 'text-white'}`}>{c.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-slate-400 sm:table-cell">{c.email}</td>
                  <td className="hidden px-5 py-3.5 text-slate-400 md:table-cell">{formatDateTime(c.created_at)}</td>
                  <td className="px-5 py-3.5">
                    {c.is_read ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500"><MailOpen className="h-3.5 w-3.5" /> Read</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-blaze-400"><MailIcon className="h-3.5 w-3.5" /> Unread</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleRead(c)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-blaze-500/50 hover:text-blaze-400"
                        title={c.is_read ? 'Mark unread' : 'Mark read'}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(c.id)}
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

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0f1320] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Message</h2>
              <button onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">From</div>
                <div className="mt-1 text-sm font-medium text-white">{selected.name}</div>
                <a href={`mailto:${selected.email}`} className="text-sm text-blaze-400 hover:text-blaze-300">{selected.email}</a>
              </div>
              {selected.phone && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Phone</div>
                  <div className="mt-1 text-sm text-slate-300">{selected.phone}</div>
                </div>
              )}
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Received</div>
                <div className="mt-1 text-sm text-slate-300">{formatDateTime(selected.created_at)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Message</div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{selected.message}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => toggleRead(selected)} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
                  {selected.is_read ? 'Mark unread' : 'Mark read'}
                </button>
                <button onClick={() => setDeleteId(selected.id)} className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete message?"
        message="This will permanently delete the contact submission."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
