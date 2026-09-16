export interface PortfolioSubproject {
  name: string;
  status: "Completed" | "In Progress";
  description: string;
  details: string[];
}

export interface PortfolioProject {
  slug: string;
  name: string;
  tagline: string;
  status: "Completed" | "In Progress";
  description: string;
  /** Short, punchy teasers shown on the collapsed/hover card. */
  bullets: string[];
  /** Full, unique write-up shown in the click-to-open modal. */
  details: string[];
  stack: string[];
  subprojects?: PortfolioSubproject[];
  metric?: { value: string; label: string };
  link?: string;
  docsLink?: string;
}

/**
 * Portfolio project listing. The resume's Projects section (src/data/resume.ts)
 * covers resume-style bullets; this is the richer, portfolio-page version.
 */
export const projects: PortfolioProject[] = [
  {
    slug: "connect-and-sell",
    name: "Connect & Sell",
    tagline: "Full-time — Coditas (Current)",
    status: "In Progress",
    description:
      "The core support platform behind a high-traffic B2B sales product — bulk data tooling, automated reporting, and a performance-critical request pipeline serving real clients in production every day.",
    bullets: [
      "Bulk Assignment Upload & Bulk Data Update system",
      "Automated report generation — 40% efficiency gain",
      "Beacon dashboard — 7 widgets, Redis-locked Lead Pool checkout",
    ],
    details: [
      "Scaled ASP.NET Core REST APIs serving reporting and calling workflows for a high-traffic production system used by thousands of users.",
      "Shipped Bulk Assignment Upload and Bulk Data Update — letting managers reassign or edit thousands of records in one operation instead of one at a time — cutting large-scale operations effort by 40%.",
      "Refactored the backend filter pipeline into a modular, testable architecture, cutting API request processing time by 25%.",
      "Eliminated a redundant DB round-trip and an O(n) linear scan from a latency-critical call-transfer path, and removed an unnecessary transaction wrapper from the recording-playback path to cut DB contention.",
      "Resolved 200+ production and pre-production defects over 2 years by pairing with QA and product teams, improving system stability and reducing recurring incidents.",
    ],
    stack: ["ASP.NET MVC", "REST API", "SQL Server", "Entity Framework", "Redis", "RabbitMQ", "Angular", "Kendo UI"],
    subprojects: [
      {
        name: "Beacon — Sales Performance Dashboard",
        status: "Completed",
        description:
          "A dedicated analytics dashboard for reps and managers, built as its own feature inside Connect & Sell.",
        details: [
          "Designed and shipped a 7-widget sales-performance dashboard end-to-end — new SQL Server schema (cas_BeaconTarget, cas_FollowupUtilization, cas_BeaconActionPlanStatus) and stored procedures, .NET Core services, and the Angular/Kendo UI.",
          "Built a consolidated follow-up list that merges every list a rep owns into one prioritized dialing queue, then reattributes each call back to its original source list and CRM campaign so reporting stays accurate.",
          "Implemented Redis-locked batch checkout for a shared Lead Pool so multiple reps pulling from the same pool can't collide on contact ownership.",
          "Shipped manager-configurable performance targets (weekly/monthly/quarterly), a live leaderboard, YTD time-saved analytics, and a recordings-review widget with inline playback.",
        ],
      },
    ],
    metric: { value: "40%", label: "efficiency ↑" },
  },
  {
    slug: "diet-planner",
    name: "Diet Planner",
    tagline: "Intern Project — Coditas",
    status: "Completed",
    description:
      "A full-stack diet management platform built solo during my internship, from schema design through auth to a responsive UI — the project that took me from tutorials to shipping production-shaped code.",
    bullets: [
      "Real-time group messaging via SignalR",
      "Redis caching — 35% DB load reduction",
      "Role-based authorization system",
    ],
    details: [
      "Built a full-stack Diet Planner application end to end — JWT authentication, role-based authorization, and RESTful CRUD APIs backed by SQL Server.",
      "Designed a normalized relational schema for user profiles, meal preferences, and nutritional data, improving data consistency and query efficiency.",
      "Implemented real-time notifications and group messaging using SignalR, increasing application interactivity and user engagement.",
      "Integrated Redis caching for frequently accessed data, cutting database load by 35% and improving API response times.",
      "Built a responsive UI with HTML, CSS, JavaScript, and Bootstrap, ensuring smooth usability across devices.",
    ],
    stack: ["ASP.NET Core", "SignalR", "Redis", "SQL Server", "Bootstrap", "JWT"],
    metric: { value: "35%", label: "DB load ↓" },
    link: "https://github.com/Jaykumar93/DietPlanner",
  },
  {
    slug: "stryde",
    name: "Stryde",
    tagline: "Personal project — AI marathon coach",
    status: "Completed",
    description:
      "A cross-platform marathon-training app I built on my own time to go deeper on AI than my day job called for — a rule-based training engine, offline GPS tracking, and an AI coach grounded in real running data.",
    bullets: [
      "Hybrid RAG coach — Gemini + Supabase pgvector",
      "Agentic tool-calling with live web search",
      "10-table Postgres schema, 29 migrations",
    ],
    details: [
      "Built a cross-platform marathon-training app end to end with React Native and TypeScript, from a rule-based training-plan engine (base-build-peak-taper periodization) to offline-first GPS run tracking with GPX/TCX export.",
      "Designed and shipped an AI running coach using a hybrid RAG pipeline — Gemini embeddings and Supabase pgvector similarity search combined with Postgres full-text search — grounded in a self-authored knowledge base and the user's own logged activity data.",
      "Implemented an agentic tool-calling chat loop (Google Gemini primary, Groq fallback) that executes multiple tools concurrently, including a live web-search tool via the Tavily API.",
      "Modeled a 10-table Postgres schema (profiles, plans, activities, coach_messages, knowledge_base, and more) across 29 incremental Supabase migrations.",
      "Covered the training-plan engine, GPS/activity-stats, and export logic with Jest unit tests (17 test files) to keep deterministic plan logic isolated from the AI layer.",
    ],
    stack: ["React Native", "Expo", "TypeScript", "Supabase", "Postgres", "pgvector", "Google Gemini", "Groq"],
    metric: { value: "Hybrid RAG", label: "AI running coach" },
    link: "https://github.com/Jaykumar93/MarathonApp",
    docsLink: "https://htmlpreview.github.io/?https://github.com/Jaykumar93/MarathonApp/blob/main/docs/stryde-docs-updated.html",
  },
];
