import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Loader2, DollarSign, IndianRupee } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import CTA from '../components/ui/CTA';
import { useReveal } from '../hooks/useReveal';
import { supabase } from '../lib/supabase';
import type { PricingPlan } from '../lib/types';

// Currency rates
const USD_TO_PKR = 278;

// Format price based on currency
const formatPrice = (price: string, currency: 'USD' | 'PKR'): string => {
  if (price.toLowerCase() === 'custom') return 'Custom';
  
  const numPrice = parseFloat(price.replace(/[$,]/g, ''));
  if (isNaN(numPrice)) return price;

  if (currency === 'PKR') {
    const pkrPrice = numPrice * USD_TO_PKR;
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(pkrPrice);
  }

  return `$${numPrice.toLocaleString()}`;
};

export default function Pricing() {
  const { ref, visible } = useReveal();
  const [pricingData, setPricingData] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('PKR');

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('pricing')
          .select('*')
          .eq('is_active', true)
          .eq('status', 'published')
          .order('display_order', { ascending: true });

        if (supabaseError) throw supabaseError;

        setPricingData(data || []);
        setTimeout(() => setShowPricing(true), 300);
      } catch (err) {
        console.error('Error fetching pricing:', err);
        setError(err instanceof Error ? err.message : 'Failed to load pricing data');
        setShowPricing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  // Toggle currency
  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'PKR' : 'USD');
  };

  // Loading state
  if (loading) {
    return (
      <>
        <PageHero
          eyebrow="Pricing"
          title={<>Transparent pricing for <span className="text-gradient">every stage</span></>}
          subtitle="From a first landing page to a full-scale platform — pick a package that fits where you are. Custom quotes available on request."
        />
        <section className="section-pad">
          <div className="container-px">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-blaze-500" />
                <p className="mt-4 text-ink-muted">Loading pricing plans...</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHero
          eyebrow="Pricing"
          title={<>Transparent pricing for <span className="text-gradient">every stage</span></>}
          subtitle="From a first landing page to a full-scale platform — pick a package that fits where you are. Custom quotes available on request."
        />
        <section className="section-pad">
          <div className="container-px">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/10">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-blaze-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blaze-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (pricingData.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Pricing"
          title={<>Transparent pricing for <span className="text-gradient">every stage</span></>}
          subtitle="From a first landing page to a full-scale platform — pick a package that fits where you are. Custom quotes available on request."
        />
        <section className="section-pad">
          <div className="container-px">
            <div className="rounded-2xl border border-edge/10 bg-surface-raised p-8 text-center">
              <p className="text-ink-muted">No pricing plans available at the moment.</p>
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blaze-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blaze-600 transition-colors"
              >
                Contact us for a quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={<>Transparent pricing for <span className="text-gradient">every stage</span></>}
        subtitle="From a first landing page to a full-scale platform — pick a package that fits where you are. Custom quotes available on request."
      />

      <section className="section-pad">
        <div className="container-px">
          {/* Currency Toggle */}
          <div className="mb-8 flex items-center justify-end gap-3">
            <span className="text-sm text-ink-muted">Display in:</span>
            <button
              onClick={toggleCurrency}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                currency === 'PKR'
                  ? 'bg-blaze-500 text-white'
                  : 'border border-edge/10 bg-edge/5 text-ink-muted hover:bg-edge/10'
              }`}
            >
              <IndianRupee className="h-4 w-4" />
              PKR
            </button>
            <button
              onClick={toggleCurrency}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                currency === 'USD'
                  ? 'bg-blaze-500 text-white'
                  : 'border border-edge/10 bg-edge/5 text-ink-muted hover:bg-edge/10'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              USD
            </button>
          </div>

          {/* Pricing Cards */}
          <div
            ref={ref}
            className={`transition-all duration-700 ${
              showPricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="grid items-stretch gap-6 lg:grid-cols-3">
              {pricingData.map((plan, i) => {
                const isCustom = plan.price.toLowerCase() === 'custom';
                const displayPrice = isCustom ? plan.price : formatPrice(plan.price, currency);
                
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
                      plan.is_featured
                        ? 'border-blaze-500/50 bg-gradient-to-b from-blaze-500/10 to-surface-card shadow-2xl lg:-translate-y-3 dark:shadow-black/40'
                        : 'card card-hover'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    {plan.is_featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blaze-500 to-blaze-600 px-3.5 py-1 text-xs font-semibold text-white shadow-lg shadow-blaze-600/40">
                          <Sparkles className="h-3.5 w-3.5" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-semibold text-ink-strong">{plan.name}</h3>
                    <p className="mt-2 text-sm text-ink-muted">{plan.description}</p>

                    <div className="mt-5 flex flex-col">
                      <div className="flex items-end gap-1.5">
                        <span className="text-4xl font-extrabold text-ink-strong">{displayPrice}</span>
                        {!isCustom && (
                          <span className="mb-1.5 text-sm text-ink-faint">/ {plan.period}</span>
                        )}
                      </div>
                      {/* Show USD reference when PKR is selected */}
                      {currency === 'PKR' && !isCustom && (
                        <span className="mt-1 text-xs text-ink-faint">
                          ≈ ${parseFloat(plan.price.replace(/[$,]/g, '')).toLocaleString()} USD
                        </span>
                      )}
                    </div>

                    <ul className="mt-6 flex-1 space-y-3">
                      {plan.features &&
                        plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2.5 text-sm text-ink">
                            <span
                              className={`flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                                plan.is_featured ? 'bg-blaze-500/20' : 'bg-edge/5'
                              }`}
                            >
                              <Check
                                className="h-3 w-3 text-blaze-500 dark:text-blaze-400"
                                strokeWidth={3}
                              />
                            </span>
                            {feature}
                          </li>
                        ))}
                    </ul>

                    <Link
                      to={plan.cta_url || '/contact'}
                      className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                        plan.is_featured
                          ? 'bg-gradient-to-r from-blaze-500 to-blaze-600 text-white hover:from-blaze-400 hover:to-blaze-500 shadow-lg shadow-blaze-600/30'
                          : 'border border-edge/10 bg-edge/5 text-ink-strong hover:bg-edge/10'
                      }`}
                    >
                      {plan.cta_text || 'Get Started'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-ink-faint">
            Need something different?{' '}
            <Link
              to="/contact"
              className="font-semibold text-blaze-600 hover:text-blaze-500 dark:text-blaze-400 dark:hover:text-blaze-300 transition-colors"
            >
              Get a custom quote →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="section-pad section-alt">
        <div className="container-px">
          <SectionHeading
            eyebrow="Questions"
            title={<>Not sure which plan <span className="text-gradient">fits?</span></>}
            subtitle="Check our FAQ for answers about pricing, timelines, and what's included."
          />
          <div className="mt-10 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 rounded-xl border border-edge/10 bg-edge/5 px-6 py-3 text-sm font-semibold text-ink-strong hover:bg-edge/10 transition-colors"
            >
              View FAQs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}