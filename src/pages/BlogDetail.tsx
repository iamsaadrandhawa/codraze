import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Blog } from '../lib/types';
import CTA from '../components/ui/CTA';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="container-px text-center">
          <Flame className="mx-auto h-12 w-12 text-blaze-500" />
          <h1 className="heading-md mt-6">Post not found</h1>
          <p className="mt-3 text-ink-muted">This blog post doesn't exist or isn't published yet.</p>
          <Link to="/blog" className="btn-primary mt-6">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const readTime = post.content
    ? `${Math.max(1, Math.round(post.content.trim().split(/\s+/).length / 200))} min read`
    : '1 min read';

  return (
    <>
      <article className="pt-28 sm:pt-32 lg:pt-36">
        {post.cover_image_url && (
          <div className="container-px">
            <div className="mx-auto mb-8 max-w-4xl overflow-hidden rounded-2xl">
              <img src={post.cover_image_url} alt={post.title} className="h-64 w-full object-cover sm:h-80 lg:h-96" />
            </div>
          </div>
        )}

        <div className="container-px">
          <div className="mx-auto max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-blaze-600 dark:hover:text-blaze-300">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            <div className="mt-6 flex items-center gap-4 text-xs text-ink-faint">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readTime}
              </span>
            </div>

            <h1 className="heading-lg mt-4 text-balance">{post.title}</h1>

            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>
            )}

            <div className="mt-8 border-t border-edge/10 pt-8">
              <div className="prose-content whitespace-pre-wrap text-base leading-relaxed text-ink">
                {post.content || 'No content available.'}
              </div>
            </div>
          </div>
        </div>
      </article>

      <CTA
        title="Enjoyed this article?"
        subtitle="Let's build something blazing fast together."
        primaryLabel="Contact Us"
        secondaryLabel="View Services"
        secondaryTo="/services"
      />
    </>
  );
}
