# Portfolio

### → **[portfolio-pranjal-shrivastava-mnmc02gy6.vercel.app](https://portfolio-pranjal-shrivastava-mnmc02gy6.vercel.app/)**

Personal portfolio for Pranjal Shrivastava. Next.js App Router, server-rendered,
deployed free on Vercel — and written so it can move somewhere else without a rewrite.

> **Note on the link above.** That is a *deployment* URL: it carries a build hash
> (`mnmc02gy6`) and is pinned to one specific deployment forever. It will keep working,
> but it will not follow future pushes. The project's production alias — shown at the top
> of the project in the Vercel dashboard, usually
> `portfolio-pranjal-shrivastava.vercel.app` — always points at the latest deployment and
> is the better link to share. Swap it in here once you've confirmed it.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 20 or newer.

---

## What to edit

Almost everything you'll want to change lives in two files. No content is hardcoded
into a component.

| File | Holds |
| --- | --- |
| `src/data/profile.ts` | Name, title, location, intro paragraphs, links, skills |
| `src/data/projects.ts` | Every project: blurb, summary, highlights, decisions, stack |

Adding a project means adding one object to the `projects` array. Its page, its card,
its filter entry and its live GitHub panel all follow from that — there is no separate
page file to create.

### Placeholders to fill in

Search the repo for `PLACEHOLDER`. Version 1 ships with these deliberately unfilled
rather than guessed:

```bash
grep -rn "PLACEHOLDER" src/
```

- `profile.ts` — prior roles and employers, LinkedIn URL, résumé link, job title
- `projects.ts` — corpus size and retrieval metrics for the RAG project
- `src/app/about/page.tsx` — the Experience section

---

## Is it actually dynamic?

Yes, in the way that matters: pages are rendered **on the server** and re-rendered on a
schedule, not baked once at build time.

- Every project page fetches its repository's stars, forks, last-push time, licence and
  language breakdown from the GitHub API, server-side.
- `export const revalidate = 3600` means each page re-renders hourly on the next request.
  Push a commit to any project and the portfolio reflects it within the hour — no
  redeploy.
- `/api/github?repo=owner/name` serves the same data as JSON.
- `RepoStats` streams in behind `<Suspense>`, so a slow or unreachable GitHub never
  delays the page content.

Every GitHub call fails soft and returns `null`; a page that can't reach GitHub renders
without that panel rather than erroring. That's why the build succeeds in a sandbox with
no network.

### Optional: a GitHub token

Unauthenticated GitHub allows 60 requests/hour per IP. With hourly revalidation over nine
repositories that's comfortable, but if you hit a limit, set `GITHUB_TOKEN` (a classic
token with **no scopes** is enough for public repos) to raise it to 5,000/hour.

In Vercel: Project → Settings → Environment Variables. Locally: put it in `.env.local`.
The site works without it.

---

## Deploying

### Vercel (free)

Nothing to configure — Vercel detects Next.js and uses the right settings.

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
3. **Import** this repository.
4. Leave every setting at its default. Framework should read *Next.js*.
5. **Deploy**.

You get a `*.vercel.app` URL, automatic HTTPS, and a fresh deploy on every push to
`main`. The Hobby plan covers this comfortably and does not require a card.

### If you ever need to leave Vercel

This is a standard Next.js app with no Vercel-specific APIs, so it runs anywhere that
runs Node:

| Target | How |
| --- | --- |
| **Netlify** | Import the repo; add `@netlify/plugin-nextjs` (Netlify suggests it automatically) |
| **Cloudflare Pages** | Import the repo, framework preset *Next.js* |
| **Render / Railway / Fly** | Build `npm run build`, start `npm start`, expose the port |
| **Your own server** | `npm ci && npm run build && npm start` behind nginx or Caddy |
| **Docker** | Standard Next.js Dockerfile; no extra configuration needed |

**A static export is possible but lossy.** Adding `output: "export"` to
`next.config.mjs` produces plain files you can host on GitHub Pages or any static host —
but it drops the API route and freezes the GitHub data at build time, so the site stops
being dynamic. Prefer any of the Node hosts above.

---

## Structure

```
src/
├── app/
│   ├── layout.tsx              shell, fonts, theme bootstrap
│   ├── page.tsx                home — hero, featured work, intro
│   ├── globals.css             design tokens and every style
│   ├── not-found.tsx           404
│   ├── about/page.tsx
│   ├── projects/
│   │   ├── page.tsx            index
│   │   ├── ProjectFilter.tsx   client-side filtering by area
│   │   └── [slug]/page.tsx     one page per project
│   └── api/github/route.ts     live repo data as JSON
├── components/
│   ├── Nav.tsx  ThemeToggle.tsx  Footer.tsx
│   ├── Reveal.tsx              scroll-reveal wrapper
│   ├── ProjectCard.tsx  AreaTag.tsx
│   ├── RepoStats.tsx           live GitHub panel (server component)
│   └── LanguageBar.tsx         language split chart
├── data/
│   ├── profile.ts              ← edit this
│   └── projects.ts             ← and this
└── lib/github.ts               GitHub fetching, fails soft
```

---

## Design notes

**Grey ground, two themes.** Dark by default; light is a genuine second theme with
re-picked greys rather than an inversion, so contrast holds in both. The choice is
remembered per browser and applied before first paint, so a light-mode visitor never
sees a dark flash.

**Two palettes, on purpose.** Area tags use low-chroma greys — the tag's own text says
what it is, so its colour is decorative. The language chart uses a separate, validated
categorical palette, because there colour *encodes identity* and has to survive colour
vision deficiency. The tag palette fails every categorical check (adjacent pairs at ΔE 5.9
for normal vision); the chart palette passes lightness band, chroma floor, CVD separation,
normal-vision floor and contrast on both surfaces.

**The chart follows the rules that matter.** Colour follows the language, never its rank,
so Python is the same colour on every page. There's a 2px gap between segments, and every
language is named with its percentage in the legend — so the bar is readable without
distinguishing any two hues.

**Animation is an enhancement, never a requirement.** Scroll reveals are only armed once
the component has mounted *and* confirmed `IntersectionObserver` exists, so
server-rendered HTML ships fully visible. A three-second failsafe reveals anything the
observer somehow missed — a missed animation is nothing, permanently invisible content is
a broken page. Everything stops under `prefers-reduced-motion`.

---

## Licence

MIT.
