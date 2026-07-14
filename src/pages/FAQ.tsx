import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { faqs } from '../data';
import PageHero from '../components/ui/PageHero';
import FAQItem from '../components/ui/FAQItem';
import CTA from '../components/ui/CTA';

export default function FAQ() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={<>Questions? <span className="text-gradient">We've got answers</span></>}
        subtitle="Everything you need to know about our services, courses, pricing, and process. Can't find what you're looking for? Reach out."
      />

      <section className="section-pad">
        <div className="container-px">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <FAQItem key={f.question} {...f} delay={i * 50} />
              ))}
            </div>

            {/* Still have questions */}
            <div className="mt-12 rounded-2xl border border-blaze-500/20 bg-blaze-500/5 p-7 text-center">
              <MessageCircle className="mx-auto h-10 w-10 text-blaze-500 dark:text-blaze-400" />
              <h3 className="heading-md mt-4 text-xl">Still have questions?</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Our team is ready to help. Get in touch and we'll answer within 24 hours.
              </p>
              <Link to="/contact" className="btn-primary mt-6">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTA
        title="Ready to get started?"
        subtitle="Let's build something blazing fast together."
        primaryLabel="Start Your Project"
        secondaryLabel="See Pricing"
        secondaryTo="/pricing"
      />
    </>
  );
}
