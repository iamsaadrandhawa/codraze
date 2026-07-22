import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { icons } from '../data';
import { supabase } from '../lib/supabase';
import type { Service, Course } from '../lib/types';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import ServiceCard from '../components/ui/ServiceCard';
import CTA from '../components/ui/CTA';

const levelStyles: Record<string, string> = {
  beginner: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
  intermediate: 'bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300',
  advanced: 'bg-blaze-500/15 text-blaze-700 ring-blaze-500/20 dark:text-blaze-300',
};

export default function Services() {
  const { Clock, BarChart3, Check } = icons;

  const [services, setServices] = useState<Service[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [servicesRes, coursesRes] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: true }),
        supabase
          .from('courses')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: true }),
      ]);

      if (!servicesRes.error && servicesRes.data) setServices(servicesRes.data);
      if (!coursesRes.error && coursesRes.data) setCourses(coursesRes.data);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title={<>Everything you need to <span className="text-gradient">build & grow</span></>}
        subtitle="From custom software to network infrastructure to career-changing courses — Codraze covers the full technology lifecycle."
      />

      {/* All services */}
      <section className="section-pad">
        <div className="container-px">
          <SectionHeading
            eyebrow="What We Offer"
            title={<>Our core services, <span className="text-gradient">one reliable partner</span></>}
            subtitle="Each service is delivered by experienced engineers who've shipped real products."
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
                  delay={i * 80}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Courses */}
      <section className="section-pad section-alt">
        <div className="container-px">
          <SectionHeading
            eyebrow="Learn With Us"
            title={<>Courses that get you <span className="text-gradient">job-ready</span></>}
            subtitle="Project-based training taught by engineers who ship real software. No fluff — just skills you can use."
          />
          {loading ? (
            <div className="mt-14 flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
            </div>
          ) : courses.length === 0 ? (
            <p className="mt-14 text-center text-ink-muted">No courses available yet.</p>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((c, i) => {
                const Icon = icons[c.icon as keyof typeof icons];
                return (
                  <article
                    key={c.id}
                    className="card card-hover group flex flex-col p-6"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blaze-500/20 to-blaze-700/10 ring-1 ring-blaze-500/20 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5 text-blaze-500 dark:text-blaze-400" strokeWidth={1.8} />
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${levelStyles[c.level_key]}`}>
                        {c.level}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-ink-strong">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(c.topics ?? []).map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-md bg-edge/5 px-2 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-edge/10">
                          <Check className="h-3 w-3 text-blaze-500/70 dark:text-blaze-400/70" strokeWidth={3} />
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs font-medium text-ink-faint">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blaze-500 dark:text-blaze-400" />
                        {c.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5 text-blaze-500 dark:text-blaze-400" />
                        {c.level}
                      </span>
                    </div>
                    <Link to="/contact" className="btn-primary mt-6 w-full text-xs">
                      Enroll Now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="section-pad">
        <div className="container-px">
          <SectionHeading
            eyebrow="How We Work"
            title={<>Our <span className="text-gradient">process</span></>}
            subtitle="A proven workflow that ensures every project is delivered on time, on budget, and beyond expectations."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Discover', text: 'We learn your business, goals, and challenges to define the right solution.' },
              { step: '02', title: 'Design', text: 'We create wireframes, architecture, and a clear roadmap before writing code.' },
              { step: '03', title: 'Develop', text: 'We build in agile sprints with weekly demos and continuous feedback.' },
              { step: '04', title: 'Deploy', text: 'We launch, monitor, and support — ensuring your software runs flawlessly.' },
            ].map((p, i) => (
              <div
                key={p.step}
                className="card card-hover group relative flex flex-col p-6"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-4xl font-extrabold text-blaze-500/20 dark:text-blaze-400/20">{p.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink-strong">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Ready to get started?"
        subtitle="Tell us about your project and we'll provide a tailored proposal within 24 hours."
        secondaryLabel="See Pricing"
        secondaryTo="/pricing"
      />
    </>
  );
}