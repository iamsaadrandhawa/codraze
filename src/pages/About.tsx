import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Rocket, ShieldCheck, Target, Award, Users, Briefcase, Zap } from 'lucide-react';
import { stats } from '../data';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import CTA from '../components/ui/CTA';
import { useReveal } from '../hooks/useReveal';

const values = [
  { icon: Rocket, title: 'Speed as a Standard', text: 'We ship fast without cutting corners — lean processes, modern tooling, and reusable architecture.' },
  { icon: ShieldCheck, title: 'Built to be Reliable', text: 'Security, testing, and infrastructure baked in from day one. Software you can trust in production.' },
  { icon: Target, title: 'Outcome-Driven', text: 'We measure success by your results — adoption, performance, and business impact, not just lines of code.' },
];

const milestones = [
  { icon: Briefcase, title: '50+ Projects', text: 'Delivered across e-commerce, healthcare, education, and finance.' },
  { icon: Users, title: '200+ Students', text: 'Trained through our hands-on, project-based courses.' },
  { icon: Award, title: '5+ Years', text: 'Of combined experience in development and networking.' },
  { icon: Zap, title: '24h Response', text: 'Average response time for new project inquiries.' },
];

export default function About() {
  const { ref, visible } = useReveal();

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={<>Built by engineers who <span className="text-gradient">ship</span></>}
        subtitle="Codraze is a software house where speed meets substance. We build fast, reliable software and teach the next generation of developers."
      />

      {/* Story section */}
      <section className="section-pad">
        <div className="container-px">
          <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
            <div>
              <span className="eyebrow">
                <Flame className="h-3.5 w-3.5" />
                How We Started
              </span>
              <h2 className="heading-lg mt-5 text-balance">
                From frustration to <span className="text-gradient">solution</span>
              </h2>
              <div className="mt-5 space-y-4 text-ink-muted">
                <p>
                  Codraze was founded by a MERN stack developer and networking professional who saw
                  the same problem everywhere: businesses paying for slow, fragile software and
                  students learning theory without ever shipping real products.
                </p>
                <p>
                  We built Codraze to be different — a software house where{' '}
                  <span className="font-semibold text-ink">speed meets substance</span>. Every
                  project is engineered by hands-on engineers. Every course is taught by people who
                  build for a living.
                </p>
                <p>
                  Today, Codraze serves clients worldwide with custom software, networking
                  solutions, and career-changing tech education.
                </p>
              </div>
              <Link to="/contact" className="btn-primary mt-8">
                Work With Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="card card-hover p-6 text-center">
                  <div className="text-3xl font-extrabold text-blaze-500 dark:text-blaze-400">{s.value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-faint">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad section-alt">
        <div className="container-px">
          <SectionHeading
            eyebrow="Our Values"
            title={<>What drives <span className="text-gradient">everything we do</span></>}
            subtitle="Three principles that guide every project, every course, and every client relationship."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="card card-hover group flex flex-col items-start p-7"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blaze-500/20 to-blaze-700/10 p-3 ring-1 ring-blaze-500/20 transition-transform duration-300 group-hover:scale-110">
                  <v.icon className="h-6 w-6 text-blaze-500 dark:text-blaze-400" strokeWidth={1.8} />
                </div>
                <h3 className="heading-md mt-6 text-xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-pad">
        <div className="container-px">
          <SectionHeading
            eyebrow="By The Numbers"
            title={<>Our impact in <span className="text-gradient">numbers</span></>}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <div
                key={m.title}
                className="card card-hover group flex flex-col items-center p-6 text-center"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blaze-500/10 ring-1 ring-blaze-500/20 transition-transform duration-300 group-hover:scale-110">
                  <m.icon className="h-6 w-6 text-blaze-500 dark:text-blaze-400" strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink-strong">{m.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Want to work with us?"
        subtitle="Let's build something blazing fast together."
        primaryLabel="Contact Us"
        secondaryLabel="See Pricing"
        secondaryTo="/pricing"
      />
    </>
  );
}
