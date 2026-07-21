import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { contactInfo, icons } from '../data';
import PageHero from '../components/ui/PageHero';
import { supabase } from '../lib/supabase';

const services = [
  'Software Development',
  'IT & Networking Solutions',
  'Tech Courses & Training',
  'UI/UX Design',
  'Mobile App Development',
  'DevOps & Cloud',
  'Other / Not Sure',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: services[0],
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: `${form.message}${form.service ? `\n\nService of interest: ${form.service}` : ''}`,
      });

      if (error) throw error;

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '', service: services[0] });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-edge/10 bg-surface-raised/60 px-4 py-3 text-sm text-ink-strong placeholder-ink-faint outline-none transition-all duration-200 focus:border-blaze-500/50 focus:bg-surface-raised focus:ring-2 focus:ring-blaze-500/20';

  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title={<>Let's build something <span className="text-gradient">blazing fast</span></>}
        subtitle="Tell us about your project, your goals, or the course you're interested in. We'll get back to you within 24 hours."
      />

      <section className="section-pad">
        <div className="container-px">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="service" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Service of Interest
                  </label>
                  <select
                    id="service"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className={inputClass}
                  >
                    {services.map((s) => (
                      <option key={s} value={s} className="bg-surface-raised text-ink-strong">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project or what you'd like to learn..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending...' : status === 'success' ? (
                    <>
                      <Check className="h-4 w-4" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <p className="text-center text-sm text-emerald-600 dark:text-emerald-400">
                    Thanks! We'll get back to you within 24 hours.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-center text-sm text-red-600 dark:text-red-400">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-4 lg:col-span-2">
              {contactInfo.map((c) => {
                const Icon = icons[c.icon as keyof typeof icons];
                return (
                  <a key={c.label} href={c.href} className="card card-hover group flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-blaze-500/20 to-blaze-700/10 ring-1 ring-blaze-500/20 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5 text-blaze-500 dark:text-blaze-400" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-ink-faint">{c.label}</div>
                      <div className="text-sm font-semibold text-ink-strong">{c.value}</div>
                    </div>
                  </a>
                );
              })}

              <a
                href="https://wa.me/+923171725977"
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-500/15 hover:-translate-y-0.5 dark:text-emerald-300"
              >
                <MessageCircle className="h-5 w-5" />
                Chat on WhatsApp
              </a>

              <div className="card p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Response Time</p>
                <p className="mt-1 text-sm text-ink-muted">
                  We typically respond within <span className="font-semibold text-ink-strong">24 hours</span> during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
