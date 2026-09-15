export interface PortfolioProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  link?: string;
}

/**
 * Portfolio project listing. The resume's Projects section (src/data/resume.ts)
 * covers resume-style bullets; this is the richer, portfolio-page version.
 */
export const projects: PortfolioProject[] = [
  {
    slug: "stryde",
    name: "Stryde",
    tagline: "AI-powered marathon training app",
    description:
      "A cross-platform marathon-training app with a rule-based training-plan engine, offline-first GPS run tracking, and an AI running coach built on a hybrid RAG pipeline (Google Gemini embeddings + Supabase pgvector + Postgres full-text search) with agentic tool-calling and live web search.",
    stack: ["React Native", "Expo", "TypeScript", "Supabase", "Postgres", "pgvector", "Google Gemini", "Groq"],
    link: undefined, // TODO: add repo or demo link
  },
];
