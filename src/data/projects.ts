import type { Project } from './types';

export const projects: Project[] = [
  {
    "name": "Cursus",
    "former": "formerly Stryde",
    "tag": "Personal project, AI marathon coach",
    "status": "Early access",
    "vis": "cursus",
    "desc": "A free, Android-first marathon training app for self-coached runners. Deterministic rules build the plan, and the AI coach only explains it.",
    "bullets": [
      "Rules produce the numbers, AI explains them",
      "Hybrid RAG coach on Gemini, with Groq as a free-tier backup",
      "22 test suites, 304 tests, WCAG AA contrast checks"
    ],
    "details": [
      "Built a periodised training plan (base, build, peak, taper) with a beginner safety gate. Paces come from a race result, a target time, or a Riegel prediction. All of it lives in a pure TypeScript plan engine with no I/O, so it is unit-tested and runnable from the command line.",
      "Designed the core rule: rules produce the numbers and AI explains them. If the coach returns a weekly mileage figure, the app replaces it with the engine's value, and plan changes are only proposed until the runner confirms them.",
      "Built live GPS run tracking with accuracy filtering, background tracking, voice cues, pause and resume, and hold-to-stop. Finished runs are saved on the device before upload, so a killed app does not lose them.",
      "Shipped an AI coach with hybrid retrieval: Postgres full-text search plus pgvector similarity over a curated knowledge base and the runner's own logged runs. Gemini is the primary model with Groq as fallback, and Tavily handles live web search.",
      "Modeled the backend on Supabase: Postgres with Row Level Security, Auth, Storage, pg_cron, 31 migrations, and four Deno Edge Functions that keep provider keys off the device.",
      "Added post-run reflection with rules-based insights, personal bests, Health Connect import, GPX and TCX export, race-day weather and daily notifications.",
      "Held quality with 22 Jest suites (304 tests), a WCAG AA contrast test across both themes, a clean type-check and a design lint."
    ],
    "stack": [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "Postgres",
      "pgvector",
      "Google Gemini",
      "Groq",
      "Tavily",
      "Edge Functions"
    ],
    "flow": [
      [
        "Runner",
        "Expo app, offline-first"
      ],
      [
        "Plan engine",
        "pure TypeScript rules"
      ],
      [
        "Supabase",
        "Postgres, RLS, Edge Functions"
      ],
      [
        "Hybrid retrieval",
        "pgvector + full-text"
      ],
      [
        "Gemini / Groq",
        "explains, never invents numbers"
      ]
    ],
    "line": "Free AI marathon coach. Rules plan, AI explains.",
    "layers": [
      0,
      1,
      2,
      3
    ],
    "role": "Solo, design to release",
    "problem": "AI coaches can invent training numbers that no plan ever set.",
    "built": "A tested rules engine builds the plan, and a hybrid-retrieval coach explains it, with Groq as a fallback.",
    "result": "304 tests across 22 suites, now in early access.",
    "facts": [
      [
        "304",
        "tests, 22 suites"
      ],
      [
        "31",
        "database migrations"
      ],
      [
        "4",
        "Edge Functions"
      ]
    ],
    "metric": [
      "304",
      "tests across 22 suites"
    ],
    "link": "https://github.com/Jaykumar93/MarathonApp",
    "docs": "https://github.com/Jaykumar93/MarathonApp/blob/main/docs/plan/MAIN_PLAN.md",
    "docsLabel": "Read the plan",
    "gallery": [
      [
        "home",
        "Home"
      ],
      [
        "plan",
        "Plan"
      ],
      [
        "run",
        "Live run"
      ],
      [
        "summary",
        "Run summary"
      ],
      [
        "coach",
        "Coach"
      ],
      [
        "pb",
        "Personal best"
      ]
    ],
    "video": {
      "src": "/media/cursus/promo.mp4",
      "poster": "/media/cursus/poster.jpg"
    }
  },
  {
    "name": "Connect & Sell",
    "tag": "Full-time, Coditas",
    "status": "In Progress",
    "vis": "platform",
    "desc": "A B2B sales acceleration platform for outbound calling and lead management, including Salesforce and HubSpot CRM integrations. I work across its older .NET Framework code and the newer .NET APIs with an Angular UI.",
    "bullets": [
      "Real-time engine on WCF, SQL Server, Redis and RabbitMQ",
      "Bulk upload, bulk update and automated reporting, 40% efficiency gain",
      "Bulk recording retrieval tool with idempotent re-runs"
    ],
    "details": [
      "Work across the platform's generations: the original .NET Framework engine and web app (WCF, ASP.NET MVC, Entity Framework) and the newer .NET APIs with an Angular and Kendo UI.",
      "Scaled REST APIs serving reporting and calling workflows for a high-traffic production system used by thousands of users.",
      "Built and maintained CRM integrations with Salesforce and HubSpot, syncing lead and call-activity data through their APIs.",
      "Shipped Bulk Assignment Upload and Bulk Data Update, letting managers reassign or edit thousands of records in one operation, cutting large-scale operations effort by 40%.",
      "Refactored the backend filter pipeline into a modular, testable architecture, cutting API request processing time by 25%.",
      "Eliminated a redundant DB round-trip and an O(n) linear scan from a latency-critical call-transfer path, and removed an unnecessary transaction wrapper from the recording-playback path to cut DB contention.",
      "Resolved 200+ production and pre-production defects by pairing with QA and product teams, improving stability and reducing recurring incidents.",
      "Documented APIs with Swagger/OpenAPI, tested them in Postman, and shipped releases through Jenkins CI/CD pipelines."
    ],
    "stack": [
      ".NET",
      ".NET Framework",
      "WCF",
      "ASP.NET MVC",
      "Entity Framework",
      "SQL Server",
      "Redis",
      "RabbitMQ",
      "MassTransit",
      "Angular",
      "Kendo UI",
      "Salesforce",
      "HubSpot",
      "Jenkins"
    ],
    "flow": [
      [
        "Agents and admins",
        "web, Angular and desktop clients"
      ],
      [
        "WCF engine",
        "real-time sessions and dialing"
      ],
      [
        "Redis + RabbitMQ",
        "phone-number cache, events"
      ],
      [
        "SQL Server",
        "stored procedures"
      ],
      [
        "CRM sync",
        "Salesforce and HubSpot"
      ]
    ],
    "subs": [
      {
        "name": "Beacon, sales performance dashboard",
        "status": "Completed",
        "vis": "dash",
        "desc": "A dedicated analytics dashboard for reps and managers, built as its own feature inside the platform.",
        "details": [
          "Designed and shipped a 7-widget sales-performance dashboard end to end: new SQL Server schema and stored procedures, .NET services, and the Angular and Kendo UI.",
          "Built a consolidated follow-up list that merges every list a rep owns into one prioritized dialing queue, then reattributes each call to its original source list and CRM campaign so reporting stays accurate.",
          "Implemented Redis-locked batch checkout for a shared Lead Pool so reps pulling from the same pool can't collide on contact ownership.",
          "Shipped manager-configurable performance targets, a live leaderboard, time-saved analytics, and a recordings-review widget with inline playback."
        ]
      },
      {
        "name": "Bulk recording retrieval tool",
        "status": "Completed",
        "desc": "A support tool that fetches call recordings in bulk from an uploaded spreadsheet.",
        "details": [
          "Reads a spreadsheet of call identifiers and retrieves the matching recordings in one batch.",
          "Matches each call to its recording with a configurable time window, converting time zones, handling different dial-prefix formats and choosing the longest matching call.",
          "Re-runs are idempotent: files already downloaded are skipped, and one bad row is reported instead of stopping the batch.",
          "Masks credentials in logs and blocks duplicate submissions while a request is running."
        ]
      }
    ],
    "line": "B2B outbound calling and lead platform, from .NET Framework to modern .NET.",
    "layers": [
      0,
      1,
      2
    ],
    "role": "Engineer on the team, 3 years",
    "problem": "A high-traffic calling platform where slow paths and one-by-one edits cost agents and managers time.",
    "built": "Bulk upload and update, a modular request pipeline, CRM integrations, the Beacon dashboard and a recording retrieval tool.",
    "result": "40% efficiency gain and 25% faster requests.",
    "facts": [
      [
        "3 yrs",
        "on the platform"
      ],
      [
        "40%",
        "bulk operations efficiency"
      ],
      [
        "200+",
        "defects resolved"
      ]
    ],
    "metric": [
      "40%",
      "efficiency gain"
    ]
  },
  {
    "name": "Diet Planner",
    "tag": "Intern project, Coditas",
    "status": "Completed",
    "vis": "diet",
    "desc": "A full-stack diet management platform built solo during my internship, from schema design through auth to a responsive UI.",
    "bullets": [
      "Real-time group messaging via SignalR",
      "Redis caching, 35% DB load reduction",
      "Role-based authorization system"
    ],
    "details": [
      "Built a full-stack Diet Planner application end to end: JWT authentication, role-based authorization, and RESTful CRUD APIs backed by SQL Server.",
      "Designed a normalized relational schema for user profiles, meal preferences, and nutritional data, improving data consistency and query efficiency.",
      "Implemented real-time notifications and group messaging using SignalR, increasing application interactivity and user engagement.",
      "Integrated Redis caching for frequently accessed data, cutting database load by 35% and improving API response times.",
      "Built a responsive UI with HTML, CSS, JavaScript, and Bootstrap, ensuring smooth usability across devices."
    ],
    "stack": [
      "ASP.NET",
      "SignalR",
      "Redis",
      "SQL Server",
      "Bootstrap",
      "JWT"
    ],
    "flow": [
      [
        "Bootstrap UI",
        "responsive screens"
      ],
      [
        "ASP.NET API",
        "JWT + role-based auth"
      ],
      [
        "Redis",
        "cache for hot reads"
      ],
      [
        "SQL Server",
        "normalized schema"
      ]
    ],
    "line": "Full-stack diet platform with real-time group chat.",
    "layers": [
      0,
      1,
      2
    ],
    "role": "Solo, as an intern",
    "problem": "A diet platform needs safe logins, live updates and fast reads.",
    "built": "JWT and role-based auth, SignalR group chat and a Redis cache over a normalized SQL Server schema.",
    "result": "35% lower database load.",
    "facts": [
      [
        "35%",
        "lower database load"
      ],
      [
        "JWT",
        "auth and roles"
      ],
      [
        "SignalR",
        "real-time chat"
      ]
    ],
    "metric": [
      "35%",
      "DB load reduction"
    ],
    "link": "https://github.com/Jaykumar93/DietPlanner"
  }
];
