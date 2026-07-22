import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Course, CourseInput, CourseStatus, CourseLevelKey } from '../../../lib/types';
import { slugify } from '../../../lib/utils';
import { icons } from '../../../data';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400';

const iconOptions = Object.keys(icons);
const levelKeys: CourseLevelKey[] = ['beginner', 'intermediate', 'advanced'];

export default function AdminCourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Code2');
  const [level, setLevel] = useState('Beginner');
  const [levelKey, setLevelKey] = useState<CourseLevelKey>('beginner');
  const [duration, setDuration] = useState('');
  const [topics, setTopics] = useState<string[]>(['']);
  const [status, setStatus] = useState<CourseStatus>('draft');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data, error } = await supabase.from('courses').select('*').eq('id', id).maybeSingle();
      if (error || !data) {
        setError('Course not found');
        setLoading(false);
        return;
      }
      const c = data as Course;
      setTitle(c.title);
      setSlug(c.slug);
      setSlugTouched(true);
      setDescription(c.description ?? '');
      setIcon(c.icon || 'Code2');
      setLevel(c.level || 'Beginner');
      setLevelKey(c.level_key || 'beginner');
      setDuration(c.duration ?? '');
      setTopics(c.topics?.length ? c.topics : ['']);
      setStatus(c.status);
      setLoading(false);
    })();
  }, [id, isEdit]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
  };

  const updateTopic = (i: number, val: string) => {
    setTopics((prev) => prev.map((t, idx) => (idx === i ? val : t)));
  };

  const addTopic = () => setTopics((prev) => [...prev, '']);
  const removeTopic = (i: number) => setTopics((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required');
      return;
    }
    setSaving(true);
    const payload: CourseInput = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      icon,
      level: level.trim() || 'Beginner',
      level_key: levelKey,
      duration: duration.trim() || null,
      topics: topics.map((t) => t.trim()).filter(Boolean),
      status,
    };
    let res;
    if (isEdit) {
      res = await supabase.from('courses').update(payload).eq('id', id);
    } else {
      res = await supabase.from('courses').insert(payload);
    }
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    navigate('/admin/courses');
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
      <Link to="/admin/courses" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>
      <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Course' : 'New Course'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div>
          <label className={labelClass} htmlFor="title">Title *</label>
          <input id="title" className={inputClass} value={title} onChange={(e) => handleTitleChange(e.target.value)} required placeholder="Course title" />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">Slug *</label>
          <input
            id="slug"
            className={inputClass}
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
            required
            placeholder="course-slug"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="description">Description</label>
          <textarea id="description" rows={3} className={`${inputClass} resize-none`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="icon">Icon</label>
            <select id="icon" className={inputClass} value={icon} onChange={(e) => setIcon(e.target.value)}>
              {iconOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="duration">Duration</label>
            <input id="duration" className={inputClass} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 8 weeks" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="level">Level Label</label>
            <input id="level" className={inputClass} value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. Beginner to Advanced" />
          </div>
          <div>
            <label className={labelClass} htmlFor="levelKey">Level Key</label>
            <select id="levelKey" className={inputClass} value={levelKey} onChange={(e) => setLevelKey(e.target.value as CourseLevelKey)}>
              {levelKeys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Topics</label>
          <div className="space-y-2">
            {topics.map((t, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputClass}
                  value={t}
                  onChange={(e) => updateTopic(i, e.target.value)}
                  placeholder={`Topic ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeTopic(i)}
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:border-red-500/50 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTopic}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blaze-400 hover:text-blaze-300"
          >
            <Plus className="h-4 w-4" /> Add topic
          </button>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <div className="flex gap-2">
            {(['draft', 'published'] as CourseStatus[]).map((s) => (
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
          <Link to="/admin/courses" className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">
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