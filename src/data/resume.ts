import type { ResumeData } from "@/types/resume";

/**
 * Single source of truth for resume content, kept in sync with
 * ../../../resume/resume.txt. Update both when the resume changes.
 */
export const resume: ResumeData = {
  name: "Jaykumar Pokar",
  title: "Full-Stack Developer (.NET, React/Angular) | AI-Integrated Applications",
  phone: "+91 87672 85611",
  email: "jaykumarpokar9@gmail.com",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/jaykumarpokar/" },
    { label: "Portfolio", url: "https://jaykumarpokar.netlify.app/" },
    { label: "GitHub", url: "https://github.com/Jaykumar93" },
  ],
  summary:
    "Full-stack developer with 2 years of production experience building scalable .NET Core / ASP.NET backends and Angular UI components, plus hands-on experience shipping AI-integrated applications end to end — including a React Native app with a Retrieval-Augmented Generation (RAG) coaching assistant built on Google Gemini, Groq, and Supabase pgvector. Comfortable owning a feature from database schema through UI to LLM integration.",
  quickFacts: [
    { label: "Location", value: "Pune, India" },
    { label: "Company", value: "Coditas" },
    { label: "Focus", value: ".NET Core & AI-Integrated Apps" },
  ],
  skills: {
    Languages: ["C#", "JavaScript", "TypeScript"],
    Backend: [
      ".NET Core",
      "ASP.NET MVC",
      "ASP.NET Web API",
      "WCF",
      "Entity Framework",
      "LINQ",
      "RESTful API design",
    ],
    Frontend: ["React", "React Native", "Angular", "jQuery", "Bootstrap", "HTML5", "CSS3"],
    "Database & Cache": ["SQL Server", "PostgreSQL (Supabase)", "MongoDB", "Redis Cache", "pgvector"],
    "AI / LLM": [
      "Google Gemini API",
      "Groq API",
      "Retrieval-Augmented Generation (RAG)",
      "Agentic tool-calling",
      "Embeddings",
    ],
    "AI Tools I Use": ["Claude", "Claude Code", "ChatGPT", "Cursor", "Stitch"],
    Messaging: ["SignalR", "RabbitMQ"],
    "Tools & DevOps": ["Git", "GitHub", "GitLab", "Jira", "SSMS", "Jest", "EAS Build", "Supabase Edge Functions"],
  },
  experience: [
    {
      role: "Software Engineer",
      company: "Coditas",
      location: "Pune, India",
      start: "August 2024",
      end: "Present",
      bullets: [
        "Scaled ASP.NET Core REST APIs serving reporting and calling workflows for a high-traffic production system used by thousands of users.",
        "Boosted large-scale operations efficiency by 40% by shipping Bulk Assignment Upload, Bulk Data Update, and automated reporting features, building both the .NET Core backend services and the Angular UI components.",
        "Cut API request processing time by 25% by refactoring the backend filter pipeline into a modular, testable architecture.",
        "Eliminated a redundant DB round-trip and an O(n) linear scan from a latency-critical call-transfer path, and removed an unnecessary transaction wrapper from the recording-playback path to cut DB contention.",
        "Designed and shipped Beacon, a 7-widget sales-performance dashboard for reps and managers — new SQL Server schema and stored procedures, .NET Core services, and an Angular/Kendo UI, including Redis-locked Lead Pool checkout and a consolidated follow-up queue with CRM re-attribution.",
        "Resolved 200+ production and pre-production defects over 2 years by pairing with QA and product teams, improving system stability and reducing recurring incidents.",
        "Delivered business-critical backend enhancements ahead of schedule, reducing delivery timelines by 20% and earning direct client appreciation.",
        "Ran two-week Agile sprints with GitLab version control and Jira-tracked backlogs, keeping release cadence predictable across the team.",
      ],
      metrics: [
        { value: "40%", label: "efficiency gain" },
        { value: "25%", label: "faster requests" },
        { value: "200+", label: "issues resolved" },
        { value: "20%", label: "faster delivery" },
      ],
    },
    {
      role: "Associate Software Engineer Intern",
      company: "Coditas",
      location: "Pune, India",
      start: "January 2024",
      end: "August 2024",
      bullets: [
        "Built a full-stack Diet Planner application end to end — JWT authentication, role-based authorization, and RESTful CRUD APIs backed by SQL Server.",
        "Designed a normalized relational schema for user profiles, meal preferences, and nutritional data, improving data consistency and query efficiency.",
        "Implemented real-time notifications and group messaging using SignalR, increasing application interactivity and user engagement.",
        "Reduced database load by 35% and improved API response times by integrating Redis caching for frequently accessed data.",
        "Built a responsive UI with HTML, CSS, JavaScript, and Bootstrap, ensuring smooth usability across devices.",
      ],
      metrics: [{ value: "35%", label: "DB load reduction" }],
    },
  ],
  projects: [
    {
      name: "Stryde — AI-Powered Marathon Training App",
      tagline: "Personal project",
      stack: ["React Native (Expo)", "TypeScript", "Supabase (Postgres/pgvector)", "Google Gemini", "Groq"],
      bullets: [
        "Built a cross-platform marathon-training app end to end with React Native and TypeScript, from a rule-based training-plan engine (base-build-peak-taper periodization) to offline-first GPS run tracking with GPX/TCX export.",
        "Designed and shipped an AI running coach using a hybrid RAG pipeline — Gemini embeddings and Supabase pgvector similarity search combined with Postgres full-text search — grounded in a self-authored knowledge base and the user's own logged activity data.",
        "Implemented an agentic tool-calling chat loop (Google Gemini primary, Groq fallback) that executes multiple tools concurrently, including a live web-search tool via the Tavily API.",
        "Modeled a 10-table Postgres schema (profiles, plans, activities, coach_messages, knowledge_base, and more) across 29 incremental Supabase migrations.",
        "Covered the training-plan engine, GPS/activity-stats, and export logic with Jest unit tests (17 test files) to keep deterministic plan logic isolated from the AI layer.",
      ],
      link: "https://github.com/Jaykumar93/MarathonApp",
      docsLink: "https://htmlpreview.github.io/?https://github.com/Jaykumar93/MarathonApp/blob/main/docs/stryde-docs-updated.html",
    },
  ],
  education: [
    {
      degree: "Bachelor of Technology - Information Technology",
      school: "JSPM's Rajarshi Shahu College of Engineering",
      location: "Pune, India",
      detail: "CGPA: 8.9 | Graduation year: 2024",
    },
  ],
  resumePdfUrl: "/resume.pdf",
};
