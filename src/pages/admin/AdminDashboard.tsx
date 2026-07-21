import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderKanban, Mail, MailWarning, CheckCircle2, FileEdit, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Blog, ContactSubmission } from '../../lib/types';
import { formatDate, formatDateTime } from '../../lib/utils';

interface Stats {
  publishedBlogs: number;
  draftBlogs: number;
  projects: number;
  contacts: number;
  unread: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [blogs, projects, contacts] = await Promise.all([
          supabase.from('blogs').select('*').order('created_at', { ascending: false }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        ]);

        if (blogs.error) throw blogs.error;
        if (projects.error) throw projects.error;
        if (contacts.error) throw contacts.error;

        const blogRows = blogs.data ?? [];
        const projectRows = projects.data ?? [];
        const contactRows = contacts.data ?? [];

        setStats({
          publishedBlogs: blogRows.filter((b) => b.status === 'published').length,
          draftBlogs: blogRows.filter((b) => b.status === 'draft').length,
          projects: projectRows.length,
          contacts: contactRows.length,
          unread: contactRows.filter((c) => !c.is_read).length,
        });
        setRecentBlogs(blogRows.slice(0, 5));
        setRecentContacts(contactRows.slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
      </div>
    );
  }

  const cards = [
    { label: 'Published Blogs', value: stats?.publishedBlogs ?? 0, icon: CheckCircle2, to: '/admin/blogs', color: 'text-emerald-400' },
    { label: 'Draft Blogs', value: stats?.draftBlogs ?? 0, icon: FileEdit, to: '/admin/blogs', color: 'text-amber-400' },
    { label: 'Projects', value: stats?.projects ?? 0, icon: FolderKanban, to: '/admin/projects', color: 'text-sky-400' },
    { label: 'Messages', value: stats?.contacts ?? 0, icon: Mail, to: '/admin/contacts', color: 'text-blaze-400' },
    { label: 'Unread', value: stats?.unread ?? 0, icon: MailWarning, to: '/admin/contacts', color: 'text-red-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">Overview of your content and messages</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card group border-white/10 bg-white/5 p-5 transition-all hover:border-blaze-500/40 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <c.icon className={`h-6 w-6 ${c.color}`} strokeWidth={1.8} />
              <ArrowRight className="h-4 w-4 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-blaze-400" />
            </div>
            <div className="mt-4 text-3xl font-extrabold text-white">{c.value}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent blogs */}
        <div className="card border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FileText className="h-4 w-4 text-blaze-400" /> Recent Blogs
            </h2>
            <Link to="/admin/blogs" className="text-xs text-blaze-400 hover:text-blaze-300">View all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentBlogs.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No blogs yet</p>
            ) : (
              recentBlogs.map((b) => (
                <Link key={b.id} to="/admin/blogs" className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-200">{b.title}</div>
                    <div className="text-xs text-slate-500">{formatDate(b.created_at)}</div>
                  </div>
                  <span className={`ml-3 flex-none rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    b.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {b.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent contacts */}
        <div className="card border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-blaze-400" /> Recent Messages
            </h2>
            <Link to="/admin/contacts" className="text-xs text-blaze-400 hover:text-blaze-300">View all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentContacts.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No messages yet</p>
            ) : (
              recentContacts.map((c) => (
                <Link key={c.id} to="/admin/contacts" className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-200">
                      {!c.is_read && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-blaze-500 align-middle" />}
                      {c.name}
                    </div>
                    <div className="text-xs text-slate-500">{formatDateTime(c.created_at)}</div>
                  </div>
                  <span className="ml-3 truncate text-xs text-slate-400">{c.email}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
