import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { projects, projectBySlug } from "@/data/projects";
import AreaTag, { areaTone } from "@/components/AreaTag";
import RepoStats from "@/components/RepoStats";
import Reveal from "@/components/Reveal";

export const revalidate = 3600;

/** Every project page is prerendered, then refreshed on the revalidation window. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return { title: "Not found" };
  return { title: project.name, description: project.blurb };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const tone = areaTone(project.areas[0]);
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="page-in section" style={{ ["--tone" as string]: tone } as never}>
      <div className="wrap wrap-narrow">
        <Link href="/projects" className="back">
          <span aria-hidden="true">←</span> All projects
        </Link>

        <header style={{ marginTop: 26, marginBottom: 30 }}>
          <div className="tags" style={{ marginBottom: 16 }}>
            {project.areas.map((a) => (
              <AreaTag key={a} area={a} />
            ))}
            {project.private && <span className="tag tag-private">Private repo</span>}
          </div>

          <h1 style={{ fontSize: "clamp(30px,5.4vw,50px)", marginBottom: 16 }}>
            {project.name}
          </h1>
          <p className="lede">{project.blurb}</p>

          <div className="cta-row">
            {project.repo ? (
              <a
                className="btn btn-primary"
                href={`https://github.com/${project.repo}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                View on GitHub <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="btn" style={{ cursor: "default", opacity: 0.75 }}>
                Private repository — available on request
              </span>
            )}
            {project.demo && (
              <a
                className="btn"
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
              >
                Live demo <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          {/* Streams in after the page renders, so a slow or unreachable GitHub
              never delays the content that matters. */}
          {project.repo && (
            <div style={{ marginTop: 26 }}>
              <Suspense fallback={null}>
                <RepoStats repo={project.repo} />
              </Suspense>
            </div>
          )}
        </header>

        <hr className="rule" />

        <Reveal>
          <section style={{ paddingBlock: 34 }}>
            <div className="prose">
              {project.summary.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        </Reveal>

        <hr className="rule" />

        <Reveal>
          <section style={{ paddingBlock: 34 }}>
            <p className="eyebrow">What it does</p>
            <ul className="checklist">
              {project.highlights.map((h, i) => (
                <li key={i}>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <hr className="rule" />

        <Reveal>
          <section style={{ paddingBlock: 34 }}>
            <p className="eyebrow">Engineering decisions</p>
            <div style={{ display: "grid", gap: 26 }}>
              {project.decisions.map((d) => (
                <div className="decision" key={d.title}>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <hr className="rule" />

        <Reveal>
          <section style={{ paddingBlock: 34 }}>
            <p className="eyebrow">Built with</p>
            <div className="tags">
              {project.stack.map((s) => (
                <span className="tag tag-plain" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </section>
        </Reveal>

        <hr className="rule" />

        <nav style={{ paddingTop: 30 }}>
          <Link href={`/projects/${next.slug}`} className="card" style={{ ["--tone" as string]: areaTone(next.areas[0]) } as never}>
            <span className="eyebrow" style={{ margin: 0 }}>Next project</span>
            <h3 className="card-title">{next.name}</h3>
            <p className="card-blurb">{next.blurb}</p>
            <div className="card-foot">
              <span className="card-go">Read <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
}
