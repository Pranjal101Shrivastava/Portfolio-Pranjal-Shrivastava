"use client";

import { useMemo, useState } from "react";
import type { Area, Project } from "@/data/projects";
import { allAreas } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

/**
 * Client-side filtering over the catalogue.
 *
 * Filters sit in one row above the results, and the count is always visible so
 * an empty result reads as a filter state rather than a broken page.
 */
export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Area | null>(null);

  const shown = useMemo(
    () => (active ? projects.filter((p) => p.areas.includes(active)) : projects),
    [projects, active],
  );

  const counts = useMemo(() => {
    const map = new Map<Area, number>();
    allAreas.forEach((a) => map.set(a, projects.filter((p) => p.areas.includes(a)).length));
    return map;
  }, [projects]);

  return (
    <>
      <div className="filter-row">
        <button
          className="chip"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
        >
          All
        </button>
        {allAreas.map((area) => (
          <button
            key={area}
            className="chip"
            aria-pressed={active === area}
            onClick={() => setActive(active === area ? null : area)}
          >
            {area}
            <span style={{ opacity: 0.55, marginLeft: 6 }}>{counts.get(area) ?? 0}</span>
          </button>
        ))}
        <span className="filter-count">
          {shown.length} of {projects.length}
        </span>
      </div>

      <div className="grid stagger" key={active ?? "all"}>
        {shown.map((project, i) => (
          <div key={project.slug} style={{ animationDelay: `${i * 55}ms` }}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </>
  );
}
