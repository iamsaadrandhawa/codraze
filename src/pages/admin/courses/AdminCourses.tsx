import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Course } from '../../../lib/types';
import { formatDate } from '../../../lib/utils';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (!error && data) setCourses(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from('courses').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="mt-1 text-sm text-slate-400">Manage the courses shown on your site</p>
        </div>
        <Link to="/admin/courses/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New Course
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <GraduationCap className="h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">No courses yet</p>
            <Link to="/admin/courses/new" className="mt-4 text-sm font-medium text-blaze-400 hover:text-blaze-300">
              Create your first course →
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Level</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Created</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {courses.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-white/5">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-200">{c.title}</div>
                    <div className="text-xs text-slate-500">/{c.slug}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{c.level}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      c.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-slate-400 sm:table-cell">{formatDate(c.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/courses/${c.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-blaze-500/50 hover:text-blaze-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
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

      <ConfirmDialog
        open={!!deleteId}
        title="Delete course?"
        message="This will permanently delete the course. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}