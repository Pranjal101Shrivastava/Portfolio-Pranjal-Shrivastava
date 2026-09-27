/**
 * Everything personal in one file.
 *
 * Anything marked PLACEHOLDER is a guess or a gap — edit it here and every page
 * that uses it updates. Nothing personal is hardcoded into a component.
 */

export const profile = {
  name: "Pranjal Shrivastava",
  // PLACEHOLDER — adjust to the title you actually want to lead with.
  title: "Software Engineer",
  location: "San Jose, California",

  // The one-line version, used in the hero and as the page description.
  tagline:
    "I build AI agents that do real work, and the unglamorous machinery that makes them trustworthy.",

  // The longer version, on the home page. Two or three short paragraphs.
  intro: [
    "I'm a software engineer working mostly where language models meet real systems — agents that change state, retrieval that has to return the right thing, and the validation layers that sit between a model's output and anything irreversible.",
    // PLACEHOLDER — replace with your actual background: degree, program, grad year, employers.
    "I'm currently a graduate student at San Jose State University. Before that, PLACEHOLDER — add your prior roles, internships or employers here.",
    "Most of what I build runs locally and costs nothing to operate. That constraint is deliberate: it forces the design to be honest about what it actually needs.",
  ],

  links: {
    github: "https://github.com/Pranjal101Shrivastava",
    email: "pranjal.shrivastava@sjsu.edu",
    // PLACEHOLDER — add your real LinkedIn handle, or delete the entry.
    linkedin: "https://www.linkedin.com/in/PLACEHOLDER",
    // PLACEHOLDER — a hosted PDF, or delete the entry.
    resume: "",
  },

  // Grouped so the About page can show shape rather than a word cloud.
  skills: [
    {
      group: "Agents & LLM systems",
      items: [
        "Agent design",
        "Tool/action layers",
        "Prompt engineering",
        "RAG",
        "Embeddings & retrieval",
        "Evaluation harnesses",
      ],
    },
    {
      group: "Languages",
      items: ["Python", "JavaScript", "TypeScript", "SQL", "Java"],
    },
    {
      group: "Web",
      items: ["React", "Next.js", "Node.js", "Redux Toolkit", "REST APIs", "SCSS"],
    },
    {
      group: "ML & data",
      items: [
        "PyTorch",
        "scikit-learn",
        "FAISS",
        "sentence-transformers",
        "Pandas",
        "NumPy",
      ],
    },
    {
      group: "Platform",
      items: ["AWS Bedrock", "Docker", "Git", "GitHub Actions", "Vercel"],
    },
  ],
} as const;

export type Profile = typeof profile;
