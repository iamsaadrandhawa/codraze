import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { portfolio } from '../data';
import PageHero from '../components/ui/PageHero';
import ProjectCard from '../components/ui/ProjectCard';
import CTA from '../components/ui/CTA';

export default function Portfolio() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title={<>Projects we're <span className="text-gradient">proud of</span></>}
        subtitle="A selection of platforms, apps, and systems we've designed and shipped for clients across industries."
      />

      <section className="section-pad">
        <div className="container-px">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((p, i) => (
              <ProjectCard key={p.name} {...p} delay={i * 60} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-ink-muted">Have a project in mind? Let's bring it to life.</p>
            <Link to="/contact" className="btn-primary mt-5">
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
