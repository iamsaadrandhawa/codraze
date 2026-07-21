import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Blog } from '../lib/types';
import PageHero from '../components/ui/PageHero';
import BlogCard from '../components/ui/BlogCard';
import CTA from '../components/ui/CTA';

interface PublicBlog extends Blog {
  read_time?: string;
}

function estimateReadTime(content: string | null): string {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export default function Blog() {
  const [posts, setPosts] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPosts(data.map((b) => ({ ...b, read_time: estimateReadTime(b.content) })));
      }
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Our Blog"
        title={<>Insights & <span className="text-gradient">stories</span></>}
        subtitle="Articles on development, networking, design, and career growth from the Codraze team."
      />

      <section className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-ink-faint" />
              <p className="mt-4 text-ink-muted">No blog posts published yet. Check back soon!</p>
              <Link to="/contact" className="btn-primary mt-6">
                Get In Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <BlogCard
                  key={p.id}
                  title={p.title}
                  excerpt={p.excerpt || ''}
                  image={p.cover_image_url || 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  author="Codraze Team"
                  date={new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  category="Article"
                  readTime={p.read_time || '5 min read'}
                  slug={p.slug}
                  delay={i * 60}
                />
              ))}
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="mt-14 text-center">
              <p className="text-ink-muted">Want more content? Subscribe to our newsletter.</p>
              <Link to="/contact" className="btn-primary mt-5">
                Get In Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
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
