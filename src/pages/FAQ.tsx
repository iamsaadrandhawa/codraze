import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Faq } from '../lib/types';
import PageHero from '../components/ui/PageHero';
import FAQItem from '../components/ui/FAQItem';
import CTA from '../components/ui/CTA';

export default function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
      if (!error && data) setFaqs(data);
      setLoading(false);
    })();
  }, []);

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
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
              </div>
            ) : faqs.length === 0 ? (
              <p className="text-center text-ink-muted">No FAQs published yet.</p>
            ) : (
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <FAQItem key={f.id} question={f.question} answer={f.answer} delay={i * 50} />
                ))}
              </div>
            )}

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

      
    </>
  );
}