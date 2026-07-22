import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Star } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Testimonial, TestimonialInput, TestimonialStatus } from '../../../lib/types';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400';

export default function AdminTestimonialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<TestimonialStatus>('draft');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).maybeSingle();
      if (error || !data) {
        setError('Testimonial not found');
        setLoading(false);
        return;
      }
      const t = data as Testimonial;
      setName(t.name);
      setRole(t.role ?? '');
      setImageUrl(t.image_url ?? '');
      setQuote(t.quote);
      setRating(t.rating);
      setStatus(t.status);
      setLoading(false);
    })();
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !quote.trim()) {
      setError('Name and quote are required');
      return;
    }
    setSaving(true);
    const payload: TestimonialInput = {
      name: name.trim(),
      role: role.trim() || null,
      image_url: imageUrl.trim() || null,
      quote: quote.trim(),
      rating,
      status,
    };
    let res;
    if (isEdit) {
      res = await supabase.from('testimonials').update(payload).eq('id', id);
    } else {
      res = await supabase.from('testimonials').insert(payload);
    }
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    navigate('/admin/testimonials');
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
      <Link to="/admin/testimonials" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to testimonials
      </Link>
      <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Testimonial' : 'New Testimonial'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">Name *</label>
            <input id="name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Client name" />
          </div>
          <div>
            <label className={labelClass} htmlFor="role">Role / Company</label>
            <input id="role" className={inputClass} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. CEO, TechStart Inc." />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="quote">Quote *</label>
          <textarea id="quote" rows={4} className={`${inputClass} resize-none`} value={quote} onChange={(e) => setQuote(e.target.value)} required placeholder="What they said…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="image">Photo URL</label>
          <input id="image" className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="mt-3 h-20 w-20 rounded-full object-cover" />
          )}
        </div>
        <div>
          <label className={labelClass}>Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="p-0.5"
              >
                <Star className={`h-6 w-6 transition-colors ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <div className="flex gap-2">
            {(['draft', 'published'] as TestimonialStatus[]).map((s) => (
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
          <Link to="/admin/testimonials" className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">
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