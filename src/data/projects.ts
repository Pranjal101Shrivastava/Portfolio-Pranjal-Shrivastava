/**
 * The project catalogue.
 *
 * Every entry is written from what is actually in the repository, not from a
 * summary of it. Where a fact was not verifiable, the field says PLACEHOLDER
 * rather than guessing — a portfolio that overstates is worse than one with a
 * gap in it.
 *
 * `repo` is the GitHub path used to fetch live stats at request time. A project
 * with `private: true` has no public link and is badged instead.
 */

export type Area =
  | "AI agents"
  | "Retrieval"
  | "Full-stack"
  | "Machine learning"
  | "Infrastructure"
  | "Developer tooling";

export type Project = {
  slug: string;
  name: string;
  /** One line. Shown on cards and as the page subtitle. */
  blurb: string;
  areas: Area[];
  repo: string | null;
  private?: boolean;
  demo?: string;
  year: string;
  /** The opening of the project page — what it is and why it exists. */
  summary: string[];
  /** Concrete, checkable claims. Numbers come from the repo. */
  highlights: string[];
  /** The interesting engineering decision, and the reasoning. */
  decisions: { title: string; body: string }[];
  stack: string[];
  /** Ordered from most to least central. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "order-of-play",
    name: "Order of Play",
    blurb:
      "A personal-secretary agent that schedules your day as an ordered queue instead of a calendar — and notices what you keep avoiding.",
    areas: ["AI agents", "Full-stack"],
    repo: "Pranjal101Shrivastava/AIAgent-OrderOfPlay",
    year: "2026",
    featured: true,
    summary: [
      "Calendar apps model time as fixed slots. That fits meetings and fails everything else: put a 2:15pm block on deep work and you either obey a machine that knows nothing about your state, or you ignore it and the calendar becomes fiction.",
      "Order of Play removes the time axis entirely. Tasks belong to a day and have an order within it, never a start time. Rescheduling is a conversation — tell it you're tired and it moves the heavy task, promotes something lighter, and explains itself in two sentences.",
      "The feature that separates it from a to-do list is the push counter. Every deferral to a later day earns a mark; at three, the agent stops being polite and asks what is actually blocking you. To-do lists record what you intend to do and stay silent about what you keep not doing — which is the more useful signal, and the one you are least likely to notice yourself.",
    ],
    highlights: [
      "Seven-operation action whitelist between the model and storage — the model proposes, the program disposes",
      "163 assertions and 46 browser checks, with zero npm dependencies",
      "Pure domain logic in 9 ES modules, bundled back into one publishable HTML file by a 120-line build script",
      "CI on Node 20 and 22 that also fails if the built artifact is out of sync with source",
    ],
    decisions: [
      {
        title: "The model never touches storage",
        body:
          "It returns a list of proposed actions; a separate pure layer validates each one against a closed whitelist and compiles it into operation descriptors that the page executes. Dispatch is explicit comparison, never a lookup from a model-supplied string, so an action named `__proto__` or `constructor` resolves to nothing rather than to something callable. A malformed or adversarial response can produce a wrong plan — that risk is irreducible — but it cannot produce an arbitrary write.",
      },
      {
        title: "Undo by snapshot, not by inverse operations",
        body:
          "A single turn can produce a dozen writes. Inverting each one individually is where undo implementations corrupt state silently: every operation needs a correct inverse and they must compose in reverse. A snapshot cannot be wrong about what the state was. The cost is memory, which for a single-user queue is irrelevant — a clean trade of something plentiful for the elimination of a bug class.",
      },
      {
        title: "A bug that only testing surfaced",
        body:
          "Overdue tasks were being displayed as upcoming. The day router was a chain of equality tests against today, tomorrow and someday, with everything else falling through to 'Later this week' — so a task from last Tuesday was presented as future work. For a tool built to notice avoidance, this hid exactly the tasks most likely to be avoided. A chain of equality tests ending in a catch-all is always worth a second look.",
      },
    ],
    stack: ["JavaScript", "Node.js", "node:test", "GitHub Actions", "Claude API"],
  },

  {
    slug: "agentic-job-pipeline",
    name: "Agentic Job Pipeline",
    blurb:
      "Crawls 104 job boards every six hours, ranks every posting against your resumes, and drafts a tailored application when you approve one.",
    areas: ["AI agents", "Retrieval", "Infrastructure"],
    repo: "Pranjal101Shrivastava/agentic-job-pipeline",
    year: "2026",
    featured: true,
    summary: [
      "Applying in the first hours after a posting goes live is the cheapest advantage available in a job search. So the pipeline treats freshness as a scoring feature rather than a sort order, runs the crawl on a schedule, and pushes new strong matches to you as a desktop notification.",
      "A full crawl takes about eight minutes and pulls roughly 12,000 live postings across 104 boards. Each is scored against every resume profile you've added, so the same posting ranks differently depending on which version of yourself you'd apply as.",
      "Nothing is ever submitted without you. The whole thing runs on your own machine with no API keys, no hosted services, and nothing that can bill you — and it works fully offline against 180 bundled postings if you have no network at all.",
    ],
    highlights: [
      "104 job boards, ~12,000 live postings per crawl, on a six-hour schedule",
      "Semantic ranking via sentence-transformers, with a graceful fallback when the model isn't installed",
      "Multi-resume profiles — the same posting scores differently per profile",
      "Runs entirely offline; a bundled sample corpus makes the whole app usable with no network",
    ],
    decisions: [
      {
        title: "Freshness as a feature, not a sort",
        body:
          "Recency is folded into the score itself rather than applied afterwards as an ordering. A three-hour-old posting that matches reasonably well should outrank a perfect match from last week, because the perfect match has already been seen by several hundred people. Making that a scoring term rather than a tiebreak is what turns the tool from a search box into a pipeline.",
      },
      {
        title: "Local-only, deliberately",
        body:
          "No API keys and no hosted services means there is nothing to bill you and nothing to leak. The semantic model is a one-time 90MB download that then runs offline forever; skip it and the app degrades to lexical scoring rather than failing. Every dependency that could become a running cost was designed out.",
      },
      {
        title: "Approval is a hard gate",
        body:
          "The agent drafts, it never submits. Automation that can send something on your behalf has a failure mode that automation which only prepares does not, and for job applications that failure is unrecoverable and public.",
      },
    ],
    stack: ["Python", "sentence-transformers", "FastAPI", "SQLite", "Web crawling"],
  },

  {
    slug: "multimodal-prompt-recommender",
    name: "Multimodal Prompt Recommender",
    blurb:
      "A two-stage retrieval engine over a catalogue of 200 prompt templates that adapts to what you've been working on this session.",
    areas: ["Retrieval", "Machine learning"],
    repo: "Pranjal101Shrivastava/multimodal-prompt-recommender",
    year: "2026",
    featured: true,
    summary: [
      "Describe a task in plain language — 'the site is down and I need to write an update for customers' — and it returns the prompt templates most likely to help, scored and explained.",
      "Retrieval runs in two stages: a fast candidate pass over the whole catalogue, then a more expensive re-rank over the survivors. That shape is the standard answer to the precision/latency trade-off in information retrieval, and it's what lets the engine stay responsive while still being picky about the top few results.",
      "It also adapts within a session. What you asked for five minutes ago shifts what comes back now, so a run of related queries converges rather than restarting from scratch each time.",
    ],
    highlights: [
      "Two-stage retrieve-then-rerank over a 200-template catalogue",
      "Session-aware — recent queries shift subsequent ranking",
      "Local embedding index, built in about 30 seconds, then fully offline",
      "Interactive REPL and single-shot CLI modes",
    ],
    decisions: [
      {
        title: "Two stages rather than one",
        body:
          "A single expensive scoring pass over 200 templates is affordable; over 20,000 it is not. Splitting into a cheap recall stage and an expensive precision stage means the architecture survives the catalogue growing by two orders of magnitude without a rewrite — you widen or narrow the candidate set and the second stage is unchanged.",
      },
      {
        title: "Session state as a ranking signal",
        body:
          "Treating the session as context rather than a series of independent queries is what makes it feel like a tool rather than a search box. The mechanism is deliberately simple and inspectable — recent queries bias the scoring — because an opaque personalisation layer that occasionally surfaces something baffling is worse than none.",
      },
    ],
    stack: ["Python", "sentence-transformers", "NumPy", "Vector search", "CLI"],
  },

  {
    slug: "movix",
    name: "Movix",
    blurb:
      "A React single-page movie browser over the TMDB API — carousels, infinite scroll, video playback and a full detail view.",
    areas: ["Full-stack"],
    repo: "Pranjal101Shrivastava/moview_fullStack",
    year: "2026",
    summary: [
      "A complete front-end application rather than a component demo: five routed pages, global state, a reusable data-fetching layer, and the kind of interaction polish that only shows up when you actually finish something.",
      "State is handled with Redux Toolkit, routing with React Router, and every network call goes through one custom `useFetch` hook rather than being scattered through components — so loading and error states are handled in one place and behave the same everywhere.",
      "The interaction details are where the work went: lazy-loaded images with placeholders, an infinite-scroll explore page, embedded trailer playback, circular rating indicators and a responsive SCSS layout built on shared mixins.",
    ],
    highlights: [
      "Five routes — home, explore, details, search results and a 404",
      "Redux Toolkit store with a dedicated slice for home-page data",
      "One `useFetch` hook centralising every API call, loading and error path",
      "Infinite scroll, lazy-loaded imagery, embedded video and circular rating meters",
    ],
    decisions: [
      {
        title: "One fetching hook, not per-component calls",
        body:
          "Every request goes through a single `useFetch` hook. The payoff is that loading, error and empty states are implemented once and behave identically across the app — the alternative is five slightly different spinners and at least one screen that silently shows nothing when a call fails.",
      },
      {
        title: "SCSS with shared mixins over a utility framework",
        body:
          "Breakpoints and repeated patterns live in a mixins file, so the responsive rules are written once and referenced. For an app of this size that keeps the styles readable without taking on a framework's conventions.",
      },
    ],
    stack: [
      "React",
      "Vite",
      "Redux Toolkit",
      "React Router",
      "SCSS",
      "Axios",
      "TMDB API",
    ],
  },

  {
    slug: "coding-harness-project",
    name: "Coding Harness Project",
    blurb:
      "Three AI coding-agent harnesses — one written from nothing in ten stages — verified by 118 tests that need no API key and no network.",
    areas: ["AI agents", "Developer tooling", "Infrastructure"],
    repo: "Pranjal101Shrivastava/coding-harness-project",
    year: "2026",
    featured: true,
    summary: [
      "An agent harness is the machinery around a model: the loop, the tool definitions, the state, the permissions, the plugins. This project builds three of them and demonstrates each working.",
      "Part A is a coding harness written from nothing across ten progressive stages. Part B takes an existing harness and customises it in depth with seven plugins, two written from scratch. Part C is a custom ML autoresearch harness plus a plugin that exposes it to a coding agent.",
      "The part that matters most is how it's verified. All 118 tests run offline with no API key and no network beyond localhost, because the repo ships an OpenAI-compatible mock model endpoint that answers from a script. Change one environment variable and the same code runs against real models on a free tier.",
    ],
    highlights: [
      "Three harnesses: one from scratch, one customised with seven plugins, one for ML autoresearch",
      "118 tests, all offline — no API key, no network beyond 127.0.0.1, no cost",
      "A mock OpenAI-compatible endpoint that makes agent behaviour deterministically testable",
      "Same code runs against real models by changing a single environment variable",
    ],
    decisions: [
      {
        title: "A mock model endpoint is what makes agents testable",
        body:
          "The standard objection to testing an agent is that the model is non-deterministic, so there is nothing stable to assert on. Putting a scripted OpenAI-compatible server behind the same interface removes the non-determinism from the test path entirely: the harness, the tool dispatch, the loop and the error handling all become ordinary software with ordinary tests. The model stays untested, which is correct — that belongs in an evaluation harness, not a unit test.",
      },
      {
        title: "Build one from scratch before customising one",
        body:
          "Part A exists so that Part B is informed. Extending someone else's harness without having built the pieces yourself means treating its abstractions as given; having written the loop, the tool layer and the permission model once makes it obvious which of its decisions are essential and which are incidental.",
      },
    ],
    stack: ["Python", "unittest", "OpenRouter", "Plugin architecture", "Mock servers"],
  },

  {
    slug: "rag-summarizer-qa",
    name: "RAG Summarizer & QA Chatbot",
    blurb:
      "A retrieval-augmented generation pipeline with a decoupled architecture for vector search and generation.",
    areas: ["Retrieval", "AI agents", "Machine learning"],
    repo: "Pranjal101Shrivastava/RAG-textsummarizerandQAchatbot",
    year: "2026",
    summary: [
      "A RAG pipeline built for deterministic context retrieval and abstractive summarisation, targeting the Gemini API.",
      "The architecture deliberately decouples vector search from generation. Retrieval is a separate, inspectable stage with its own behaviour and its own failure modes, rather than an implementation detail hidden inside a generation call — which means you can evaluate whether the right context was found independently of whether the answer was any good.",
      "That separation is the single most useful property a RAG system can have. When an answer is wrong, the first question is always whether retrieval failed or generation did, and a coupled design cannot tell you.",
    ],
    highlights: [
      "Decoupled retrieval and generation stages, independently evaluable",
      "Deterministic context retrieval — the same query returns the same context",
      "Abstractive summarisation over retrieved passages",
      "Built against the Gemini API",
      // PLACEHOLDER — add corpus size, chunking strategy and any eval numbers.
      "PLACEHOLDER — corpus size, chunk strategy and retrieval metrics",
    ],
    decisions: [
      {
        title: "Determinism in the retrieval stage",
        body:
          "Generation is non-deterministic and there is nothing to be done about that. Retrieval does not have to be. Making the context selection reproducible means a regression can be localised: if the same query returns different passages, that is a retrieval bug; if it returns the same passages and a worse answer, that is the model.",
      },
    ],
    stack: ["Python", "Gemini API", "Vector search", "RAG"],
  },

  {
    slug: "text-summarizer-ai",
    name: "TextSummarizerAI",
    blurb:
      "Document summarisation and question answering on AWS Bedrock — Claude 3 Haiku for generation, Amazon Titan for embeddings, FAISS for search.",
    areas: ["Retrieval", "Infrastructure", "Machine learning"],
    repo: "Pranjal101Shrivastava/TextSummarizerAI",
    year: "2026",
    summary: [
      "A RAG system built on managed cloud infrastructure rather than local models: Amazon Titan produces the embeddings, FAISS handles vector search, and Claude 3 Haiku generates the summaries and answers.",
      "Give it a document and it will summarise it or answer questions grounded in it. The interesting constraint is that it works on large documents, which means chunking, indexing and retrieval all have to behave sensibly well past what fits in a single context window.",
      "It is a useful counterpart to the local-first projects: the same problem shape, solved with managed services, with the cost and operational trade-offs that implies.",
    ],
    highlights: [
      "AWS Bedrock for both embedding and generation",
      "Amazon Titan embeddings indexed with FAISS",
      "Claude 3 Haiku chosen for response generation",
      "Handles documents well beyond a single context window",
    ],
    decisions: [
      {
        title: "Haiku for generation, on purpose",
        body:
          "Summarisation and grounded question answering over retrieved passages is not a task that rewards the largest available model — the hard part has already been done by retrieval. Choosing the fast, inexpensive tier keeps per-document cost low and latency acceptable, which is what makes the tool usable on a real pile of documents rather than a demo of one.",
      },
      {
        title: "FAISS rather than a hosted vector database",
        body:
          "For a single-tenant document set, an in-process index avoids an entire service dependency, its network hop and its bill. The trade is that scaling past one machine would mean replacing it — a deliberate deferral, not an oversight.",
      },
    ],
    stack: ["Python", "AWS Bedrock", "Claude 3 Haiku", "Amazon Titan", "FAISS"],
  },

  {
    slug: "tfidf-spam-filter",
    name: "TF-IDF Spam Filter",
    blurb:
      "Spam detection that catches character-substitution tricks — 'fr33 m0ney' — while still forgiving ordinary human typos.",
    areas: ["Machine learning"],
    repo: "Pranjal101Shrivastava/spam-filter-model-",
    year: "2025",
    summary: [
      "A spam classifier built from the fundamentals: TF-IDF term weighting feeding a Naive Bayes classifier, with a web interface for testing it interactively.",
      "The addition that makes it more than a textbook exercise is deliberate-obfuscation detection. Spam uses character substitution to evade lexical filters — 'fr33' for 'free', 'm0ney' for 'money', 'c1ick' for 'click' — and a naive tokeniser sees those as unknown words rather than as the words they obviously are.",
      "The harder half of that problem is not catching the substitutions. It is catching them without punishing ordinary typing: a real person mistyping a word should not look like a spammer evading a filter. The system distinguishes the two rather than normalising everything aggressively and hoping.",
    ],
    highlights: [
      "TF-IDF weighting into a Naive Bayes classifier, implemented from the maths",
      "Character-substitution normalisation: 3→e, 0→o, 1→l, @→a, $→s",
      "Distinguishes deliberate obfuscation from innocent typos",
      "Web interface with worked examples and per-word score explanations",
    ],
    decisions: [
      {
        title: "Separating obfuscation from error",
        body:
          "Normalising every substitution aggressively would catch all the spam and also flag anyone who types quickly. The signal that separates them is intent-shaped: deliberate substitution clusters inside otherwise well-formed high-value words, while genuine typos scatter. Treating those as different phenomena is the whole difficulty of the feature.",
      },
      {
        title: "Explaining the score",
        body:
          "The interface shows which terms drove a classification. For a filter that will occasionally be wrong, being able to see why is the difference between a tool someone trusts and one they turn off.",
      },
    ],
    stack: ["Python", "scikit-learn", "TF-IDF", "Naive Bayes", "Flask"],
  },

  {
    slug: "resume-tailor-skill",
    name: "Resume Tailor Skill",
    blurb:
      "An authoring skill that screens a job posting for work-authorisation blockers, then produces a verified one-page PDF tailored to it.",
    areas: ["Developer tooling", "AI agents"],
    repo: null,
    private: true,
    year: "2026",
    summary: [
      "A packaged agent skill rather than an application: a workflow definition, a house style guide, and a structured profile of verifiable facts that the agent is allowed to draw on.",
      "It screens first and writes second. Before tailoring anything it checks the posting for work-authorisation restrictions — no sponsorship, citizenship requirements, clearance, ITAR — and stops if the role cannot be accepted. Doing that check first saves the effort, and doing it automatically means it never gets skipped when you're moving fast.",
      "The output is a verified one-page PDF with working links. 'Verified' is the operative word: page count and link targets are checked rather than assumed, because a résumé that silently spills onto a second page or ships a dead link is worse than no automation at all.",
    ],
    highlights: [
      "Screens for work-authorisation blockers before doing any work",
      "Tailors against a structured fact base — employers, dates, metrics — so nothing is invented",
      "Produces a one-page PDF with clickable links, verified rather than assumed",
      "Loads automatically into a Claude Code session from the repository",
    ],
    decisions: [
      {
        title: "A fact base the agent cannot exceed",
        body:
          "Tailoring is the exact task where a language model is most tempted to improve on reality. Constraining it to a structured file of verifiable facts — real employers, real dates, real numbers — means the model chooses what to emphasise and in what words, and never what is true.",
      },
      {
        title: "Verify the artifact, not the intention",
        body:
          "The PDF is checked after it is produced: one page, links that resolve. Prompt instructions shape behaviour and do not guarantee it, so anything that must hold gets asserted against the output.",
      },
    ],
    stack: ["Claude Code skills", "PDF generation", "Markdown", "Workflow design"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const allAreas: Area[] = [
  "AI agents",
  "Retrieval",
  "Machine learning",
  "Full-stack",
  "Infrastructure",
  "Developer tooling",
];

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
