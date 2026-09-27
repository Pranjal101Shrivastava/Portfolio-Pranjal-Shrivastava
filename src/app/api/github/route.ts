import { NextResponse } from "next/server";
import { getRepoStats, getLanguages } from "@/lib/github";
import { projects } from "@/data/projects";

/**
 * Live repository data as JSON: /api/github?repo=owner/name
 *
 * The pages render this server-side already, so nothing on the site depends on
 * this route. It exists so the data is addressable — for a future client-side
 * refresh, a status check, or anything else that wants the numbers without
 * scraping a page.
 *
 * `repo` is validated against the catalogue rather than passed through, so the
 * endpoint cannot be used to proxy arbitrary GitHub requests from this origin.
 */
export const revalidate = 3600;

const ALLOWED = new Set(
  projects.map((p) => p.repo).filter((r): r is string => typeof r === "string"),
);

export async function GET(request: Request) {
  const repo = new URL(request.url).searchParams.get("repo");

  if (!repo) {
    return NextResponse.json(
      { repos: Array.from(ALLOWED) },
      { headers: { "Cache-Control": "public, s-maxage=3600" } },
    );
  }
  if (!ALLOWED.has(repo)) {
    return NextResponse.json({ error: "Unknown repository" }, { status: 404 });
  }

  const [stats, languages] = await Promise.all([getRepoStats(repo), getLanguages(repo)]);
  if (!stats && !languages) {
    return NextResponse.json(
      { error: "GitHub unreachable", repo },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { repo, stats, languages, fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
