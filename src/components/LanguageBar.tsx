import type { LanguageSlice } from "@/lib/github";

/**
 * Language split as a part-to-whole bar.
 *
 * Two rules from the chart spec drive the implementation:
 *
 *   · **Colour follows the entity, never its rank.** Python is the same colour
 *     in every repository on this site. Assigning by position would repaint a
 *     language whenever a different one happened to be largest, which makes the
 *     colour meaningless across pages.
 *   · **Identity is never colour-alone.** Every segment is named with its
 *     percentage in the legend below, so the bar is readable without
 *     distinguishing any two hues — which is also what relieves the sub-3:1
 *     contrast of three light-mode slots.
 */

/** Fixed slot per language. Stable across the whole site. */
const SLOT: Record<string, string> = {
  Python: "var(--series-1)",
  HTML: "var(--series-2)",
  SCSS: "var(--series-3)",
  JavaScript: "var(--series-4)",
  CSS: "var(--series-5)",
  Shell: "var(--series-6)",
  TypeScript: "var(--series-7)",
  "Jupyter Notebook": "var(--series-8)",
};

/**
 * A language with no assigned slot gets one deterministically from its name, so
 * it is at least consistent between renders and between pages — never random,
 * and never dependent on how large it happens to be in this repository.
 */
function colorFor(name: string): string {
  if (name === "Other") return "var(--series-other)";
  if (SLOT[name]) return SLOT[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return `var(--series-${(hash % 8) + 1})`;
}

function pct(share: number): string {
  const p = share * 100;
  return p < 1 ? "<1%" : `${p.toFixed(p < 10 ? 1 : 0)}%`;
}

export default function LanguageBar({ languages }: { languages: LanguageSlice[] }) {
  if (!languages.length) return null;

  return (
    <figure style={{ margin: 0 }}>
      <div
        className="langbar"
        role="img"
        aria-label={`Language breakdown: ${languages
          .map((l) => `${l.name} ${pct(l.share)}`)
          .join(", ")}`}
      >
        {languages.map((lang) => (
          <div
            key={lang.name}
            className="langbar-seg"
            style={{
              flexGrow: lang.share,
              flexBasis: 0,
              background: colorFor(lang.name),
            }}
            title={`${lang.name} — ${pct(lang.share)}`}
          />
        ))}
      </div>

      <figcaption className="langkey">
        {languages.map((lang) => (
          <span className="langkey-item" key={lang.name}>
            <span
              className="langkey-swatch"
              style={{ background: colorFor(lang.name) }}
              aria-hidden="true"
            />
            <b>{lang.name}</b> {pct(lang.share)}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
