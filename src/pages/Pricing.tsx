import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { pricing } from '../data';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import CTA from '../components/ui/CTA';
import { useReveal } from '../hooks/useReveal';

export default function Pricing() {
  const { ref, visible } = useReveal();

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={<>Transparent pricing for <span className="text-gradient">every stage</span></>}
        subtitle="From a first landing page to a full-scale platform — pick a package that fits where you are. Custom quotes available on request."
      />

      <section className="section-pad">
        <div className="container-px">
          <div
            ref={ref}
            className={`reveal ${visible ? 'is-visible' : ''} grid items-stretch gap-6 lg:grid-cols-3`}
          >
            {pricing.map((p, i) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
                  p.featured
                    ? 'border-blaze-500/50 bg-gradient-to-b from-blaze-500/10 to-surface-card shadow-2xl lg:-translate-y-3 dark:shadow-black/40'
                    : 'card card-hover'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blaze-500 to-blaze-600 px-3.5 py-1 text-xs font-semibold text-white shadow-lg shadow-blaze-600/40">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-ink-strong">{p.name}</h3>
                <p className="mt-2 text-sm text-ink-muted">{p.description}</p>

                <div className="mt-5 flex items-end gap-1.5">
                  <span className="text-4xl font-extrabold text-ink-strong">{p.price}</span>
                  <span className="mb-1.5 text-sm text-ink-faint">/ {p.period}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                      <span className={`flex h-5 w-5 flex-none items-center justify-center rounded-full ${p.featured ? 'bg-blaze-500/20' : 'bg-edge/5'}`}>
                        <Check className="h-3 w-3 text-blaze-500 dark:text-blaze-400" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`mt-7 w-full ${p.featured ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-ink-faint">
            Need something different?{' '}
            <Link to="/contact" className="font-semibold text-blaze-600 hover:text-blaze-500 dark:text-blaze-400 dark:hover:text-blaze-300">
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
            <Link to="/faq" className="btn-ghost">
              View FAQs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTA
        title="Still have questions?"
        subtitle="We're happy to help you find the right plan for your needs."
        primaryLabel="Contact Us"
        secondaryLabel="View Services"
        secondaryTo="/services"
      />
    </>
  );
}
