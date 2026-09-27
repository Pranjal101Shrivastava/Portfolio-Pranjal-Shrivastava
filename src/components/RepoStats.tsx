import { getRepoStats, getLanguages, relativeTime, formatCount } from "@/lib/github";
import LanguageBar from "./LanguageBar";

/**
 * Live repository facts, fetched server-side on every revalidation.
 *
 * Renders nothing at all when GitHub is unreachable. A portfolio that says
 * "could not load stats" is drawing attention to its own plumbing; a portfolio
 * that quietly omits a secondary detail is just a portfolio.
 */
export default async function RepoStats({
  repo,
  showLanguages = true,
}: {
  repo: string;
  showLanguages?: boolean;
}) {
  const [stats, languages] = await Promise.all([
    getRepoStats(repo),
    showLanguages ? getLanguages(repo) : Promise.resolve(null),
  ]);

  if (!stats && !languages) return null;

  return (
    <div>
      {stats && (
        <div className="stats">
          <span className="stat-live">
            <span className="pulse" aria-hidden="true" />
            live from GitHub
          </span>
          {stats.stars > 0 && (
            <span className="stat">
              <b>{formatCount(stats.stars)}</b> stars
            </span>
          )}
          {stats.forks > 0 && (
            <span className="stat">
              <b>{formatCount(stats.forks)}</b> forks
            </span>
          )}
          {stats.pushedAt && (
            <span className="stat">
              updated <b>{relativeTime(stats.pushedAt)}</b>
            </span>
          )}
          {stats.license && (
            <span className="stat">
              <b>{stats.license}</b>
            </span>
          )}
        </div>
      )}
      {languages && languages.length > 0 && <LanguageBar languages={languages} />}
    </div>
  );
}
