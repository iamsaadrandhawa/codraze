import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project } from '../lib/types';
import PageHero from '../components/ui/PageHero';
import ProjectCard from '../components/ui/ProjectCard';
import CTA from '../components/ui/CTA';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (!error && data) setProjects(data);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title={<>Projects we're <span className="text-gradient">proud of</span></>}
        subtitle="A selection of platforms, apps, and systems we've designed and shipped for clients across industries."
      />

      <section className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-edge/20 border-t-blaze-500" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderKanban className="h-12 w-12 text-ink-faint" />
              <p className="mt-4 text-ink-muted">No projects published yet. Check back soon!</p>
              <Link to="/contact" className="btn-primary mt-6">
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  name={p.title}
                  category="Project"
                  image={p.cover_image_url || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  description={p.description || ''}
                  tags={p.tech_stack ?? []}
                  link={p.project_url || '#'}
                  delay={i * 60}
                />
              ))}
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="mt-14 text-center">
              <p className="text-ink-muted">Have a project in mind? Let's bring it to life.</p>
              <Link to="/contact" className="btn-primary mt-5">
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <CTA
        title="Like what you see?"
        subtitle="Let's build something you'll be proud of too."
        primaryLabel="Get Started"
        secondaryLabel="View Services"
        secondaryTo="/services"
      />
    </>
  );
}
