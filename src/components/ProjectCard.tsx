import Link from "next/link";
import type { Project } from "@/data/projects";
import AreaTag, { areaTone } from "./AreaTag";

export default function ProjectCard({ project }: { project: Project }) {
  const tone = areaTone(project.areas[0]);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card"
      style={{ ["--tone" as string]: tone } as never}
    >
      <h3 className="card-title">
        {project.name}
        {project.private && <span className="tag tag-private">Private</span>}
      </h3>
      <p className="card-blurb">{project.blurb}</p>
      <div className="tags">
        {project.areas.map((a) => (
          <AreaTag key={a} area={a} />
        ))}
      </div>
      <div className="card-foot">
        <span className="stat" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
          {project.year}
        </span>
        <span className="card-go">
          Read <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
