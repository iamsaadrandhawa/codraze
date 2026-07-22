import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, ShieldCheck, Target, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Blog, Project, Service, Testimonial } from '../lib/types';
import Hero from '../components/Hero';
import SectionHeading from '../components/ui/SectionHeading';
import ServiceCard from '../components/ui/ServiceCard';
import ProjectCard from '../components/ui/ProjectCard';
import TestimonialCard from '../components/ui/TestimonialCard';
import BlogCard from '../components/ui/BlogCard';
import CTA from '../components/ui/CTA';
import { useReveal } from '../hooks/useReveal';

interface PublicBlog extends Blog {
  read_time?: string;
}

function estimateReadTime(content: string | null): string {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const values = [
  { icon: Rocket, title: 'Speed as a Standard', text: 'We ship fast without cutting corners — lean processes, modern tooling, and reusable architecture.' },
  { icon: ShieldCheck, title: 'Built to be Reliable', text: 'Security, testing, and infrastructure baked in from day one. Software you can trust in production.' },
  { icon: Target, title: 'Outcome-Driven', text: 'We measure success by your results — adoption, performance, and business impact.' },
];

export default function Home() {
  const { ref: introRef, visible: introVisible } = useReveal();

  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [servicesRes, projectsRes, testimonialsRes, blogsRes] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: true })
          .limit(3),
        supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(2),
        supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      if (!servicesRes.error && servicesRes.data) setServices(servicesRes.data);
      if (!projectsRes.error && projectsRes.data) setProjects(projectsRes.data);
      if (!testimonialsRes.error && testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (!blogsRes.error && blogsRes.data) {
        setBlogPosts(blogsRes.data.map((b) => ({ ...b, read_time: estimateReadTime(b.content) })));
      }

      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Hero />

      {/* Short Introduction / About Preview */}
      <section className="section-pad">
        <div className="container-px">
          <div ref={introRef} className={`reveal ${introVisible ? 'is-visible' : ''} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
            <div>
              <span className="eyebrow">
                <Flame className="h-3.5 w-3.5" />
                Who We Are
              </span>
              <h2 className="heading-lg mt-5 text-balance">
                Built by engineers who ship — <span className="text-gradient">not just talk</span>
              </h2>
              <p className="mt-5 text-ink-muted">
                Codraze was founded by a MERN stack developer and networking professional who saw
                the same problem everywhere: businesses paying for slow, fragile software and
                students learning theory without ever shipping real products.
              </p>
              <p className="mt-4 text-ink-muted">
                We built Codraze to be different — a software house where{' '}
                <span className="font-semibold text-ink">speed meets substance</span>. Every
                project is engineered by hands-on engineers. Every course is taught by people who
                build for a living.
              </p>
              <Link to="/about" className="btn-primary mt-8">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {values.map((v) => (
                <div key={v.title} className="card card-hover group flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-blaze-500/20 to-blaze-700/10 ring-1 ring-blaze-500/20 transition-transform duration-300 group-hover:scale-110">
                    <v.icon className="h-5 w-5 text-blaze-500 dark:text-blaze-400" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink-strong">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-pad section-alt">
        <div className="container-px">
          <SectionHeading
            eyebrow="What We Do"
            title={<>Three core services, <span className="text-gradient">one reliable partner</span></>}
            subtitle="From custom software to network infrastructure to career-changing courses — Codraze covers the full technology lifecycle."
          />
          {loading ? (
            <div className="mt-14 flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
            </div>
          ) : services.length === 0 ? (
            <p className="mt-14 text-center text-ink-muted">No services available yet.</p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <ServiceCard
                  key={s.id}
                  title={s.title}
                  description={s.description || ''}
                  icon={s.icon}
                  points={s.points ?? []}
                  delay={i * 100}
                />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/services" className="btn-ghost">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section-pad">
        <div className="container-px">
          <SectionHeading
            eyebrow="Our Work"
            title={<>Projects we're <span className="text-gradient">proud of</span></>}
            subtitle="A selection of platforms, apps, and systems we've designed and shipped for clients across industries."
          />
          {loading ? (
            <div className="mt-14 flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
            </div>
          ) : projects.length === 0 ? (
            <p className="mt-14 text-center text-ink-muted">No projects published yet.</p>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  name={p.title}
                  category="Project"
                  image={p.cover_image_url || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  description={p.description || ''}
                  tags={p.tech_stack ?? []}
                  link={p.project_url || '#'}
                  delay={i * 80}
                />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/portfolio" className="btn-ghost">
              Explore Portfolio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="section-pad section-alt">
        <div className="container-px">
          <SectionHeading
            eyebrow="Testimonials"
            title={<>Loved by clients <span className="text-gradient">& students</span></>}
            subtitle="Don't take our word for it — here's what the people we've worked with have to say."
          />
          {loading ? (
            <div className="mt-14 flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
            </div>
          ) : testimonials.length === 0 ? (
            <p className="mt-14 text-center text-ink-muted">No testimonials yet.</p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <TestimonialCard
                  key={t.id}
                  name={t.name}
                  role={t.role || ''}
                  image={t.image_url || ''}
                  quote={t.quote}
                  rating={t.rating}
                  delay={i * 90}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Preview */}
      <section className="section-pad">
        <div className="container-px">
          <SectionHeading
            eyebrow="From Our Blog"
            title={<>Insights & <span className="text-gradient">stories</span></>}
            subtitle="Articles on development, networking, design, and career growth from the Codraze team."
          />
          {loading ? (
            <div className="mt-14 flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
            </div>
          ) : blogPosts.length === 0 ? (
            <p className="mt-14 text-center text-ink-muted">No blog posts published yet. Check back soon!</p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {blogPosts.map((p, i) => (
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
                  delay={i * 80}
                />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/blog" className="btn-ghost">
              Read Our Blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

     
    </>
  );
}