import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = { title: "About", description: profile.tagline };
export const revalidate = 3600;

export default function AboutPage() {
  return (
    <div className="page-in section">
      <div className="wrap wrap-narrow">
        <p className="eyebrow">About</p>
        <h1 style={{ fontSize: "clamp(30px,5vw,46px)", marginBottom: 22 }}>
          {profile.name}
        </h1>

        <div className="prose" style={{ marginBottom: 12 }}>
          {profile.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <hr className="rule" style={{ marginBlock: 34 }} />

        <Reveal>
          <p className="eyebrow">What I work with</p>
          <div style={{ display: "grid", gap: 26 }}>
            {profile.skills.map((group) => (
              <div className="skillgroup" key={group.group}>
                <h3>{group.group}</h3>
                <div className="tags">
                  {group.items.map((item) => (
                    <span className="tag tag-plain" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <hr className="rule" style={{ marginBlock: 34 }} />

        {/* PLACEHOLDER — replace with real experience entries. */}
        <Reveal>
          <p className="eyebrow">Experience</p>
          <div className="prose">
            <p>
              <strong>PLACEHOLDER</strong> — add roles here: employer, title, dates, and one
              or two lines on what you actually shipped. Edit{" "}
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em" }}>
                src/data/profile.ts
              </code>{" "}
              and this section.
            </p>
          </div>
        </Reveal>

        <hr className="rule" style={{ marginBlock: 34 }} />

        <Reveal>
          <p className="eyebrow">Get in touch</p>
          <div className="cta-row" style={{ marginTop: 0 }}>
            <a className="btn btn-primary" href={`mailto:${profile.links.email}`}>
              {profile.links.email}
            </a>
            <a
              className="btn"
              href={profile.links.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub ↗
            </a>
          </div>
          <p style={{ marginTop: 18, color: "var(--ink-3)", fontSize: 13.5 }}>
            {projects.length} projects across {new Set(projects.flatMap((p) => p.areas)).size}{" "}
            areas of software engineering.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
