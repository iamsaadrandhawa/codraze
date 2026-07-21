import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Blog, BlogInput, BlogStatus } from '../../../lib/types';
import { slugify } from '../../../lib/utils';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400';

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [status, setStatus] = useState<BlogStatus>('draft');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data, error } = await supabase.from('blogs').select('*').eq('id', id).maybeSingle();
      if (error || !data) {
        setError('Blog not found');
        setLoading(false);
        return;
      }
      const b = data as Blog;
      setTitle(b.title);
      setSlug(b.slug);
      setSlugTouched(true);
      setExcerpt(b.excerpt ?? '');
      setContent(b.content ?? '');
      setCoverImageUrl(b.cover_image_url ?? '');
      setStatus(b.status);
      setLoading(false);
    })();
  }, [id, isEdit]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required');
      return;
    }
    setSaving(true);
    const payload: BlogInput = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim() || null,
      cover_image_url: coverImageUrl.trim() || null,
      status,
    };
    let res;
    if (isEdit) {
      res = await supabase.from('blogs').update(payload).eq('id', id);
    } else {
      res = await supabase.from('blogs').insert(payload);
    }
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    navigate('/admin/blogs');
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
      <Link to="/admin/blogs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to blogs
      </Link>
      <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Blog' : 'New Blog'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div>
          <label className={labelClass} htmlFor="title">Title *</label>
          <input id="title" className={inputClass} value={title} onChange={(e) => handleTitleChange(e.target.value)} required placeholder="Blog title" />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">Slug *</label>
          <input
            id="slug"
            className={inputClass}
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
            required
            placeholder="blog-slug"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" rows={2} className={`${inputClass} resize-none`} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary" />
        </div>
        <div>
          <label className={labelClass} htmlFor="content">Content (Markdown)</label>
          <textarea id="content" rows={12} className={`${inputClass} resize-y font-mono text-[13px]`} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your blog in markdown…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="cover">Cover Image URL</label>
          <input id="cover" className={inputClass} value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://…" />
          {coverImageUrl && (
            <img src={coverImageUrl} alt="Cover preview" className="mt-3 h-40 w-full rounded-lg object-cover" />
          )}
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <div className="flex gap-2">
            {(['draft', 'published'] as BlogStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  status === s ? 'bg-blaze-500 text-white' : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/admin/blogs" className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">
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
