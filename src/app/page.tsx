import Link from "next/link";
import { profile } from "@/data/profile";
import { featuredProjects, projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

/**
 * Re-rendered on the server hourly, so anything that reads live data stays
 * current without a redeploy.
 */
export const revalidate = 3600;

export default function Home() {
  const areas = Array.from(new Set(projects.flatMap((p) => p.areas)));

  return (
    <div className="page-in">
      <section className="hero">
        <div className="hero-mesh" aria-hidden="true" />
        <div className="wrap hero-inner">
          <p className="eyebrow">{profile.title} · {profile.location}</p>
          <h1>
            I build <span className="accent">AI agents</span> that do real work.
          </h1>
          <p className="lede">{profile.tagline}</p>

          <div className="cta-row">
            <Link href="/projects" className="btn btn-primary">
              See the work <span aria-hidden="true">→</span>
            </Link>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="btn"
            >
              GitHub
            </a>
            <a href={`mailto:${profile.links.email}`} className="btn">
              Get in touch
            </a>
          </div>

          <div className="hero-meta">
            <span className="hero-dot" aria-hidden="true" />
            <span>{projects.length} projects</span>
            <span>{areas.length} areas</span>
            <span>Available for opportunities</span>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Selected work</p>
            <h2 style={{ fontSize: "clamp(24px,3.6vw,34px)", marginBottom: 12 }}>
              Four worth reading first
            </h2>
            <p className="lede" style={{ marginBottom: 32 }}>
              Each has its own page — what it does, the engineering decisions behind it, and
              live repository data pulled from GitHub.
            </p>
          </Reveal>

          <div className="grid">
            {featuredProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 70}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div style={{ marginTop: 28 }}>
              <Link href="/projects" className="btn">
                All {projects.length} projects <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      <section className="section">
        <div className="wrap wrap-narrow">
          <Reveal>
            <p className="eyebrow">About</p>
            <div className="prose" style={{ marginBottom: 28 }}>
              {profile.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <Link href="/about" className="btn">
              More about me <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
