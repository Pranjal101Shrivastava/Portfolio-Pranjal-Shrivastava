/**
 * Live repository data.
 *
 * This is what makes the site dynamic rather than a set of baked pages: project
 * pages are server-rendered and re-fetch GitHub on a schedule, so stars, the
 * language split and "last pushed" are current without a redeploy.
 *
 * Two constraints shape it:
 *
 *   1. Unauthenticated GitHub allows 60 requests per hour per IP. With an hour
 *      of revalidation and nine repositories that is comfortable, but it means
 *      failure has to be ordinary rather than exceptional.
 *   2. A build can run somewhere GitHub is unreachable. Every call therefore
 *      fails soft and returns null; no page may depend on the data arriving.
 *
 * Set GITHUB_TOKEN in the environment to raise the rate limit to 5,000/hour.
 * It is optional and the site works without it.
 */

export type RepoStats = {
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  pushedAt: string | null;
  createdAt: string | null;
  homepage: string | null;
  topics: string[];
  license: string | null;
  size: number;
  defaultBranch: string;
};

export type LanguageSlice = {
  name: string;
  bytes: number;
  share: number;
  color: string;
};

/** Revalidate hourly: fresh enough to be true, rare enough to stay in budget. */
const REVALIDATE_SECONDS = 3600;

function headers(): HeadersInit {
  const base: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  const token = process.env.GITHUB_TOKEN;
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
}

async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Network unreachable, DNS failure, a proxy in the way at build time.
    // None of these are worth failing a page render over.
    return null;
  }
}

export async function getRepoStats(fullName: string): Promise<RepoStats | null> {
  type Raw = {
    full_name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    subscribers_count?: number;
    open_issues_count: number;
    pushed_at: string | null;
    created_at: string | null;
    homepage: string | null;
    topics?: string[];
    license?: { spdx_id?: string | null } | null;
    size: number;
    default_branch: string;
  };
  const raw = await ghFetch<Raw>(`/repos/${fullName}`);
  if (!raw || !raw.full_name) return null;
  return {
    fullName: raw.full_name,
    description: raw.description,
    stars: raw.stargazers_count ?? 0,
    forks: raw.forks_count ?? 0,
    watchers: raw.subscribers_count ?? 0,
    openIssues: raw.open_issues_count ?? 0,
    pushedAt: raw.pushed_at,
    createdAt: raw.created_at,
    homepage: raw.homepage,
    topics: raw.topics ?? [],
    license: raw.license?.spdx_id ?? null,
    size: raw.size ?? 0,
    defaultBranch: raw.default_branch ?? "main",
  };
}

/**
 * GitHub's own language colours, so the bar reads the way the language chips
 * do everywhere else a developer has seen them. Unknown languages fall back to
 * a neutral grey rather than a random hue.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#F1E05A",
  TypeScript: "#3178C6",
  HTML: "#E34C26",
  CSS: "#563D7C",
  SCSS: "#C6538C",
  Java: "#B07219",
  Shell: "#89E051",
  "Jupyter Notebook": "#DA5B0B",
  C: "#555555",
  "C++": "#F34B7D",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Dockerfile: "#384D54",
  Makefile: "#427819",
  Vue: "#41B883",
  Svelte: "#FF3E00",
};

const FALLBACK_COLOR = "#6E777D";

export function languageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? FALLBACK_COLOR;
}

/**
 * The language split, largest first, as shares of total bytes.
 *
 * Anything under 1.5% is folded into "Other" rather than rendered as a
 * one-pixel sliver nobody can see or hover.
 */
export async function getLanguages(fullName: string): Promise<LanguageSlice[] | null> {
  const raw = await ghFetch<Record<string, number>>(`/repos/${fullName}/languages`);
  if (!raw || typeof raw !== "object") return null;

  const entries = Object.entries(raw).filter(([, b]) => typeof b === "number" && b > 0);
  const total = entries.reduce((sum, [, b]) => sum + b, 0);
  if (!total) return null;

  const MIN_SHARE = 0.015;
  const big: LanguageSlice[] = [];
  let otherBytes = 0;

  entries
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, bytes]) => {
      const share = bytes / total;
      if (share < MIN_SHARE) otherBytes += bytes;
      else big.push({ name, bytes, share, color: languageColor(name) });
    });

  if (otherBytes > 0) {
    big.push({
      name: "Other",
      bytes: otherBytes,
      share: otherBytes / total,
      color: FALLBACK_COLOR,
    });
  }
  return big;
}

/** "3 days ago" — relative time without pulling in a date library. */
export function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
    [Infinity, "year"],
  ];
  const divisors = [1, 60, 3600, 86400, 604800, 2629800, 31557600];

  for (let i = 0; i < units.length; i++) {
    if (seconds < units[i][0]) {
      const value = Math.round(seconds / divisors[i]);
      try {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
          -value,
          units[i][1],
        );
      } catch {
        return `${value} ${units[i][1]}${value === 1 ? "" : "s"} ago`;
      }
    }
  }
  return "";
}

export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n < 10000 ? 1 : 0)}k`;
}
