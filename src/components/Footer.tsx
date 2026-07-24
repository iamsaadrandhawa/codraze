import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Check, X } from 'lucide-react';
import { footerLinks, socials, icons } from '../data';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pricingData, setPricingData] = useState([]);

  // Fetch pricing data
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data, error } = await supabase
          .from('pricing')
          .select('*')
          .eq('is_active', true)
          .eq('status', 'published')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setPricingData(data || []);
      } catch (error) {
        console.error('Error fetching pricing:', error);
      }
    };

    fetchPricing();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubscriptionStatus(null);
    setErrorMessage('');

    try {
      // Check if email already exists
      const { data: existing, error: checkError } = await supabase
        .from('subscribers')
        .select('id, status')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        if (existing.status === 'inactive') {
          // Reactivate subscriber
          const { error: updateError } = await supabase
            .from('subscribers')
            .update({
              status: 'active',
              unsubscribed_at: null,
              updated_at: new Date().toISOString()
            })
            .eq('email', email);

          if (updateError) throw updateError;

          setSubscriptionStatus('success');
          setEmail('');
        } else {
          setSubscriptionStatus('error');
          setErrorMessage('This email is already subscribed!');
        }
      } else {
        // Insert new subscriber
        const { error: insertError } = await supabase
          .from('subscribers')
          .insert({
            email: email,
            ip_address: await getClientIP(),
            user_agent: navigator.userAgent,
            status: 'active'
          });

        if (insertError) throw insertError;

        setSubscriptionStatus('success');
        setEmail('');
      }

      // Auto-dismiss success after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus(null);
      }, 5000);

    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get client IP
  const getClientIP = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-edge/10 bg-surface-base">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blaze-500/40 to-transparent" />

      <div className="container-px py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-md ring-1 ring-slate-200 dark:ring-slate-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(249,115,22,0.25)]">
                <img
                  src="/logo.png"
                  alt="Codraze Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="leading-none">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                  Cod
                  <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent">
                    raze
                  </span>
                </h1>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Fast, powerful software solutions — development, networking, and training. Built by
              engineers who ship.
            </p>

            {/* Newsletter - Fixed: Input and button on same row */}
            <form onSubmit={handleSubscribe} className="mt-6 flex max-w-sm flex-col gap-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl border ${
                      subscriptionStatus === 'error' 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                        : subscriptionStatus === 'success'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                        : 'border-edge/10 bg-surface-raised/60'
                    } py-2.5 pl-10 pr-3 text-sm text-ink-strong placeholder-ink-faint outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20 disabled:opacity-50`}
                  />
                  {subscriptionStatus === 'success' && (
                    <Check className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
                  )}
                  {subscriptionStatus === 'error' && (
                    <X className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-none rounded-xl bg-gradient-to-r from-blaze-500 to-blaze-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-blaze-400 hover:to-blaze-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? '...' : 'Subscribe'}
                </button>
              </div>
              
              {/* Status Messages */}
              {subscriptionStatus === 'success' && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ Successfully subscribed!
                </p>
              )}
              {subscriptionStatus === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  ✗ {errorMessage}
                </p>
              )}
            </form>

            {/* Socials */}
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => {
                const Icon = icons[s.icon as keyof typeof icons];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge/10 bg-edge/5 text-ink-muted transition-all hover:border-blaze-500/50 hover:bg-blaze-500/10 hover:text-blaze-500 hover:-translate-y-0.5 dark:hover:text-blaze-300"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink-strong">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-sm text-ink-muted transition-colors hover:text-blaze-600 dark:hover:text-blaze-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 border-t border-edge/10 pt-6 sm:flex-row">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Codraze. All rights reserved.
          </p>
          <p className="text-xs text-ink-faint">
            Developed by{' '}
            <Link to="/" className="font-semibold text-blaze-600 hover:text-blaze-500 dark:text-blaze-400 dark:hover:text-blaze-300">
              Codraze
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}