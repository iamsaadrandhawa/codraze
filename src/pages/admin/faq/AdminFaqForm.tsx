import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Faq, FaqInput, FaqStatus } from '../../../lib/types';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400';

export default function AdminFaqForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState<FaqStatus>('draft');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data, error } = await supabase.from('faqs').select('*').eq('id', id).maybeSingle();
      if (error || !data) {
        setError('FAQ not found');
        setLoading(false);
        return;
      }
      const f = data as Faq;
      setQuestion(f.question);
      setAnswer(f.answer);
      setDisplayOrder(f.display_order);
      setStatus(f.status);
      setLoading(false);
    })();
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!question.trim() || !answer.trim()) {
      setError('Question and answer are required');
      return;
    }
    setSaving(true);
    const payload: FaqInput = {
      question: question.trim(),
      answer: answer.trim(),
      display_order: displayOrder,
      status,
    };
    let res;
    if (isEdit) {
      res = await supabase.from('faqs').update(payload).eq('id', id);
    } else {
      res = await supabase.from('faqs').insert(payload);
    }
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    navigate('/admin/faq');
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
      <Link to="/admin/faq" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to FAQ
      </Link>
      <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit FAQ' : 'New FAQ'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div>
          <label className={labelClass} htmlFor="question">Question *</label>
          <input id="question" className={inputClass} value={question} onChange={(e) => setQuestion(e.target.value)} required placeholder="What services does Codraze offer?" />
        </div>
        <div>
          <label className={labelClass} htmlFor="answer">Answer *</label>
          <textarea id="answer" rows={5} className={`${inputClass} resize-none`} value={answer} onChange={(e) => setAnswer(e.target.value)} required placeholder="Write the answer…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="order">Display Order</label>
          <input
            id="order"
            type="number"
            className={inputClass}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            placeholder="0"
          />
          <p className="mt-1.5 text-xs text-slate-500">Lower numbers appear first.</p>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <div className="flex gap-2">
            {(['draft', 'published'] as FaqStatus[]).map((s) => (
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
          <Link to="/admin/faq" className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">
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