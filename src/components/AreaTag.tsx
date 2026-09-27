import type { Area } from "@/data/projects";

/**
 * Area colours are decorative: the tag's own text says what it is, so the
 * colour only has to be pleasant and consistent. That is why these are the
 * low-chroma site greys rather than the chart palette — they would fail every
 * categorical check, and they do not need to pass one.
 */
const TONE: Record<Area, string> = {
  "AI agents": "var(--a-agents)",
  Retrieval: "var(--a-retrieval)",
  "Machine learning": "var(--a-ml)",
  "Full-stack": "var(--a-fullstack)",
  Infrastructure: "var(--a-infra)",
  "Developer tooling": "var(--a-tooling)",
};

export function areaTone(area: Area): string {
  return TONE[area] ?? "var(--ink-3)";
}

export default function AreaTag({ area }: { area: Area }) {
  return (
    <span className="tag" style={{ ["--tone" as string]: areaTone(area) } as never}>
      {area}
    </span>
  );
}
