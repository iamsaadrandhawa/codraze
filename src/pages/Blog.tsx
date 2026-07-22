import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Search, X, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Blog } from '../lib/types';
import PageHero from '../components/ui/PageHero';
import BlogCard from '../components/ui/BlogCard';
import CTA from '../components/ui/CTA';

// =====================================================
// Types
// =====================================================

interface PublicBlog extends Blog {
  read_time?: string;
  formatted_date?: string;
  time_ago?: string;
  category?: string;
  author?: string;
  tags?: string[];
}

// =====================================================
// Utility Functions
// =====================================================

function estimateReadTime(content: string | null): string {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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
  if (categoryMatch) {
    return categoryMatch[1].trim();
  }
  
  const categories = ['Development', 'Networking', 'Design', 'DevOps', 'Career', 'Security', 'Engineering', 'AI/ML', 'Mobile'];
  for (const cat of categories) {
    if (content.toLowerCase().includes(cat.toLowerCase())) {
      return cat;
    }
  }
  
  return 'Article';
}

function extractTags(content: string | null): string[] {
  if (!content) return [];
  
  const tagsMatch = content.match(/tags:?\s*([^\n]+)/i);
  if (tagsMatch) {
    return tagsMatch[1].split(',').map(t => t.trim());
  }
  
  return [];
}

function getAuthor(content: string | null): string {
  if (!content) return 'Codraze Team';
  
  const authorMatch = content.match(/author:?\s*([^\n]+)/i);
  if (authorMatch) {
    return authorMatch[1].trim();
  }
  
  return 'Codraze Team';
}

// =====================================================
// Main Blog Component
// =====================================================

export default function Blog() {
  const [posts, setPosts] = useState<PublicBlog[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const processedPosts = data.map((b: Blog) => {
            const category = getCategory(b.content);
            const tags = extractTags(b.content);
            
            return {
              ...b,
              read_time: estimateReadTime(b.content),
              formatted_date: formatDate(b.created_at),
              time_ago: getTimeAgo(b.created_at),
              category: category,
              author: getAuthor(b.content),
              tags: tags,
            };
          });

          setPosts(processedPosts);
          setFilteredPosts(processedPosts);

          const uniqueCategories = ['All', ...new Set(processedPosts.map(p => p.category || 'Article'))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        (post.tags && post.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <>
        <PageHero
          eyebrow="Our Blog"
          title={<>Insights & <span className="text-gradient">stories</span></>}
          subtitle="Articles on development, networking, design, and career growth from the Codraze team."
        />
        <section className="section-pad">
          <div className="container-px">
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Our Blog"
        title={<>Insights & <span className="text-gradient">stories</span></>}
        subtitle="Articles on development, networking, design, and career growth from the Codraze team."
      />

      <section className="section-pad">
        <div className="container-px">
          {posts.length > 0 && (
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded-xl border border-edge/10 bg-surface-raised/60 py-2.5 pl-10 pr-10 text-sm text-ink-strong placeholder-ink-faint outline-none transition-all focus:border-blaze-500/50 focus:ring-2 focus:ring-blaze-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-ink-faint" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-blaze-500 text-white shadow-lg shadow-blaze-500/30'
                        : 'border border-edge/10 bg-surface-raised/60 text-ink-muted hover:bg-edge/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-ink-faint" />
              {posts.length === 0 ? (
                <>
                  <p className="mt-4 text-ink-muted">No blog posts published yet. Check back soon!</p>
                  <Link to="/contact" className="btn-primary mt-6 inline-flex items-center gap-2">
                    Get In Touch
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <p className="mt-4 text-ink-muted">No posts match your search criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="btn-ghost mt-6 inline-flex items-center gap-2"
                  >
                    Clear filters
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-ink-muted">
                  Showing <span className="font-semibold text-ink-strong">{filteredPosts.length}</span>
                  {' '}article{filteredPosts.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((p, i) => (
                  <BlogCard
                    key={p.id}
                    title={p.title}
                    excerpt={p.excerpt || ''}
                    image={p.cover_image_url || 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    author={p.author || 'Codraze Team'}
                    date={p.formatted_date || formatDate(p.created_at)}
                    timeAgo={p.time_ago || getTimeAgo(p.created_at)}
                    category={p.category || 'Article'}
                    readTime={p.read_time || '5 min read'}
                    slug={p.slug}
                    delay={i * 60}
                    tags={p.tags || []}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      
    </>
  );
}