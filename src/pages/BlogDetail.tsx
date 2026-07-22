import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Flame, Hash, Share2, Heart, Bookmark, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Blog } from '../lib/types';

interface BlogDetail extends Blog {
  read_time?: string;
  formatted_date?: string;
  time_ago?: string;
  category?: string;
  author?: string;
}

function estimateReadTime(content: string | null): string {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

function getCategory(content: string | null): string {
  if (!content) return 'Article';
  const categoryMatch = content.match(/category:?\s*([^\n]+)/i);
  return categoryMatch ? categoryMatch[1].trim() : 'Article';
}

function getAuthor(content: string | null): string {
  if (!content) return 'Codraze Team';
  const authorMatch = content.match(/author:?\s*([^\n]+)/i);
  return authorMatch ? authorMatch[1].trim() : 'Codraze Team';
}

function cleanContent(content: string | null): string {
  if (!content) return '';
  return content
    .replace(/^author:?\s*[^\n]+\n?/im, '')
    .replace(/^category:?\s*[^\n]+\n?/im, '')
    .trim();
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (error || !data) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const processedPost: BlogDetail = {
          ...data,
          read_time: estimateReadTime(data.content),
          formatted_date: formatDate(data.created_at),
          time_ago: getTimeAgo(data.created_at),
          category: getCategory(data.content),
          author: getAuthor(data.content),
          content: cleanContent(data.content),
          tags: data.tags ?? [],
        };

        setPost(processedPost);

        const { data: related, error: relatedError } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .neq('id', data.id)
          .limit(3)
          .order('created_at', { ascending: false });

        if (!relatedError && related) {
          const processedRelated = related.map((r: Blog) => ({
            ...r,
            read_time: estimateReadTime(r.content),
            formatted_date: formatDate(r.created_at),
            time_ago: getTimeAgo(r.created_at),
            category: getCategory(r.content),
            author: getAuthor(r.content),
          }));
          setRelatedPosts(processedRelated);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
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
          <Link to="/blog" className="btn-primary mt-6 inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <article className="pt-28 sm:pt-32 lg:pt-36">
        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="container-px">
            <div className="relative mx-auto mb-10 max-w-4xl overflow-hidden rounded-3xl shadow-xl shadow-black/5">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
              {post.category && (
                <span className="absolute left-5 top-5 rounded-full bg-blaze-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg">
                  {post.category}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="container-px">
          <div className="mx-auto max-w-3xl">
            {/* Back Button */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-blaze-600 dark:hover:text-blaze-300"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            {/* Title */}
            <h1 className="mt-6 text-balance text-3xl font-bold leading-tight text-ink-strong sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>
            )}

            {/* Author + Meta */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-edge/10 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-blaze-400/25 to-blaze-600/25 ring-1 ring-blaze-500/20">
                  <span className="text-sm font-bold text-blaze-500">
                    {post.author?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-strong">{post.author}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.formatted_date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.read_time}
                    </span>
                    {post.time_ago && (
                      <span className="inline-flex items-center gap-1 text-blaze-500">
                        <Flame className="h-3.5 w-3.5" />
                        {post.time_ago}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Share & Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    isLiked ? 'bg-red-500/10 text-red-500' : 'bg-edge/5 text-ink-muted hover:bg-edge/10'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} />
                  <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    isBookmarked ? 'bg-blaze-500/10 text-blaze-500' : 'bg-edge/5 text-ink-muted hover:bg-edge/10'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-blaze-500' : ''}`} />
                  <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: post.title, text: post.excerpt || '', url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-edge/5 px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-edge/10"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              className="blog-content prose prose-slate mt-10 max-w-none prose-headings:font-bold prose-headings:text-ink-strong prose-p:leading-relaxed prose-p:text-ink-muted prose-a:text-blaze-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-ink-strong prose-img:rounded-2xl prose-blockquote:border-l-blaze-500 prose-blockquote:text-ink-muted prose-code:rounded prose-code:bg-edge/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-blaze-600 prose-code:before:content-none prose-code:after:content-none dark:prose-invert dark:prose-blockquote:text-ink-muted"
              dangerouslySetInnerHTML={{ __html: post.content || 'No content available.' }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 border-t border-edge/10 pt-8">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Tags</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="group inline-flex items-center gap-1 rounded-full bg-blaze-500/10 px-3.5 py-1.5 text-sm font-medium text-blaze-600 ring-1 ring-blaze-500/15 transition-colors hover:bg-blaze-500/15 dark:text-blaze-300"
                    >
                      <Hash className="h-3.5 w-3.5 opacity-60" strokeWidth={2.5} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-pad">
          <div className="container-px">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-ink-strong">Related Articles</h2>
              <p className="mt-2 text-sm text-ink-muted">You might also enjoy these posts</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="group rounded-xl border border-edge/10 bg-surface-card p-4 transition-all hover:-translate-y-1 hover:border-blaze-500/30 hover:shadow-lg"
                  >
                    {related.cover_image_url && (
                      <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-lg">
                        <img
                          src={related.cover_image_url}
                          alt={related.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <h3 className="line-clamp-2 font-semibold text-ink-strong transition-colors group-hover:text-blaze-500">
                      {related.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
                      <span>{related.formatted_date}</span>
                      <span>•</span>
                      <span>{related.read_time}</span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blaze-500">
                      Read More
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}