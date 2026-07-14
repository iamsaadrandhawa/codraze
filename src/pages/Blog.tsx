import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../data';
import PageHero from '../components/ui/PageHero';
import BlogCard from '../components/ui/BlogCard';
import CTA from '../components/ui/CTA';

export default function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Our Blog"
        title={<>Insights & <span className="text-gradient">stories</span></>}
        subtitle="Articles on development, networking, design, and career growth from the Codraze team."
      />

      <section className="section-pad">
        <div className="container-px">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((p, i) => (
              <BlogCard key={p.title} {...p} delay={i * 60} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-ink-muted">Want more content? Subscribe to our newsletter.</p>
            <Link to="/contact" className="btn-primary mt-5">
              Get In Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTA
        title="Have a story to share?"
        subtitle="We're always looking for guest writers and collaborators."
        primaryLabel="Contact Us"
        secondaryLabel="View Services"
        secondaryTo="/services"
      />
    </>
  );
}
