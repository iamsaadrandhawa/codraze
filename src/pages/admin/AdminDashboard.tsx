import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, FolderKanban, Mail, MailWarning, 
  CheckCircle2, FileEdit, ArrowRight, 
  Users, TrendingUp, Eye, Clock,
  BarChart3, PieChart, Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Blog, ContactSubmission, Profile } from '../../lib/types';
import { formatDate, formatDateTime } from '../../lib/utils';

interface Stats {
  publishedBlogs: number;
  draftBlogs: number;
  projects: number;
  contacts: number;
  unread: number;
  totalUsers: number;
  activeUsers: number;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [blogsByStatus, setBlogsByStatus] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [blogs, projects, contacts, profiles] = await Promise.all([
          supabase.from('blogs').select('*').order('created_at', { ascending: false }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*'),
        ]);

        if (blogs.error) throw blogs.error;
        if (projects.error) throw projects.error;
        if (contacts.error) throw contacts.error;
        if (profiles.error) throw profiles.error;

        const blogRows = blogs.data ?? [];
        const projectRows = projects.data ?? [];
        const contactRows = contacts.data ?? [];
        const profileRows = profiles.data ?? [];

        // Blog status breakdown for chart
        const published = blogRows.filter((b) => b.status === 'published').length;
        const drafts = blogRows.filter((b) => b.status === 'draft').length;
        const archived = blogRows.filter((b) => b.status === 'archived').length;

        setBlogsByStatus([
          { label: 'Published', value: published, color: '#22c55e' },
          { label: 'Drafts', value: drafts, color: '#f59e0b' },
          { label: 'Archived', value: archived, color: '#6b7280' },
        ]);

        setStats({
          publishedBlogs: published,
          draftBlogs: drafts,
          projects: projectRows.length,
          contacts: contactRows.length,
          unread: contactRows.filter((c) => !c.is_read).length,
          totalUsers: profileRows.length,
          activeUsers: profileRows.filter((p) => p.status === 'active').length,
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

  // Horizontal bar chart component
  const HorizontalBarChart = ({ data }: { data: ChartData[] }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    
    return (
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Donut chart (CSS-based)
  const DonutChart = ({ data }: { data: ChartData[] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;
    
    const segments = data.map((item) => {
      const percent = (item.value / total) * 100;
      const start = cumulativePercent;
      cumulativePercent += percent;
      return { ...item, percent, start };
    });

    return (
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
          {segments.map((item, index) => {
            const circumference = 2 * Math.PI * 40;
            const dashLength = (item.percent / 100) * circumference;
            const dashOffset = circumference - ((item.start / 100) * circumference);
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={`${dashLength} ${circumference}`}
                strokeDashoffset={dashOffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{total}</div>
            <div className="text-[10px] text-slate-500">Total</div>
          </div>
        </div>
      </div>
    );
  };

  const cards = [
    { label: 'Published Blogs', value: stats?.publishedBlogs ?? 0, icon: CheckCircle2, to: '/admin/blogs', color: 'text-emerald-400' },
    { label: 'Draft Blogs', value: stats?.draftBlogs ?? 0, icon: FileEdit, to: '/admin/blogs', color: 'text-amber-400' },
    { label: 'Projects', value: stats?.projects ?? 0, icon: FolderKanban, to: '/admin/projects', color: 'text-sky-400' },
    { label: 'Messages', value: stats?.contacts ?? 0, icon: Mail, to: '/admin/contacts', color: 'text-blaze-400' },
    { label: 'Unread', value: stats?.unread ?? 0, icon: MailWarning, to: '/admin/contacts', color: 'text-red-400' },
    { label: 'Users', value: stats?.totalUsers ?? 0, icon: Users, to: '/admin/users', color: 'text-purple-400' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">Overview of your content and messages</p>

      {/* Stat Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card group border-white/10 bg-white/5 p-4 transition-all hover:border-blaze-500/40 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <c.icon className={`h-5 w-5 ${c.color}`} strokeWidth={1.8} />
              <ArrowRight className="h-3 w-3 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-blaze-400" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-white">{c.value}</div>
            <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Blog Status Chart */}
        <div className="card border-white/10 bg-white/5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <BarChart3 className="h-4 w-4 text-blaze-400" /> Blog Status
          </h2>
          <div className="mt-4">
            <HorizontalBarChart data={blogsByStatus} />
          </div>
        </div>

        {/* Blog Distribution Donut */}
        <div className="card border-white/10 bg-white/5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <PieChart className="h-4 w-4 text-blaze-400" /> Distribution
          </h2>
          <div className="mt-4 flex items-center justify-center gap-6">
            <DonutChart data={blogsByStatus} />
            <div className="space-y-1.5 text-xs">
              {blogsByStatus.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card border-white/10 bg-white/5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Activity className="h-4 w-4 text-blaze-400" /> Quick Stats
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-slate-400">Total Users</span>
              <span className="text-sm font-bold text-white">{stats?.totalUsers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-slate-400">Active Users</span>
              <span className="text-sm font-bold text-emerald-400">{stats?.activeUsers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-slate-400">Messages</span>
              <span className="text-sm font-bold text-blaze-400">{stats?.contacts ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Unread</span>
              <span className="text-sm font-bold text-red-400">{stats?.unread ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
                    b.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 
                    b.status === 'draft' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-gray-500/15 text-gray-400'
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

      {/* User Activity Flowchart (Text-based visualization) */}
      <div className="mt-6 card border-white/10 bg-white/5 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          <TrendingUp className="h-4 w-4 text-blaze-400" /> Content Flow
        </h2>
        <div className="mt-4 overflow-x-auto">
          <div className="flex min-w-[600px] items-center justify-between gap-4 text-xs">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-emerald-400">
                {stats?.publishedBlogs ?? 0}
              </div>
              <span className="mt-1 text-slate-500">Published</span>
              <div className="mt-1 h-8 w-0.5 bg-emerald-500/30" />
            </div>
            
            <div className="h-0.5 w-12 bg-emerald-500/30" />
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-amber-500/20 px-3 py-1.5 text-amber-400">
                {stats?.draftBlogs ?? 0}
              </div>
              <span className="mt-1 text-slate-500">Drafts</span>
              <div className="mt-1 h-8 w-0.5 bg-amber-500/30" />
            </div>
            
            <div className="h-0.5 w-12 bg-amber-500/30" />
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-sky-500/20 px-3 py-1.5 text-sky-400">
                {stats?.projects ?? 0}
              </div>
              <span className="mt-1 text-slate-500">Projects</span>
              <div className="mt-1 h-8 w-0.5 bg-sky-500/30" />
            </div>
            
            <div className="h-0.5 w-12 bg-sky-500/30" />
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blaze-500/20 px-3 py-1.5 text-blaze-400">
                {stats?.contacts ?? 0}
              </div>
              <span className="mt-1 text-slate-500">Messages</span>
              <div className="mt-1 h-8 w-0.5 bg-blaze-500/30" />
            </div>
          </div>
          
          <div className="mt-2 text-center text-[10px] text-slate-500">
            Content Flow: Blog Posts → Projects → User Engagement
          </div>
        </div>
      </div>
    </div>
  );
}