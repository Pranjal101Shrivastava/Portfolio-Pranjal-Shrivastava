import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectFilter from "./ProjectFilter";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects across AI agents, retrieval, full-stack and machine learning.",
};

export const revalidate = 3600;

export default function ProjectsPage() {
  return (
    <div className="page-in section">
      <div className="wrap">
        <p className="eyebrow">Projects</p>
        <h1 style={{ fontSize: "clamp(30px,5vw,46px)", marginBottom: 14 }}>
          Nine things I built
        </h1>
        <p className="lede" style={{ marginBottom: 34 }}>
          Agents that change real state, retrieval systems, a full front-end application and
          classical machine learning. Filter by area, or read them in order.
        </p>
        <ProjectFilter projects={projects} />
      </div>
    </div>
  );
}
