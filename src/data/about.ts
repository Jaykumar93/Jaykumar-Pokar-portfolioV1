import type { LayerKey } from "./types";
import { engIndex } from "./engineering";

export const bio = [
  "I'm a full stack AI engineer in Pune. For three years at Coditas I've worked on a B2B outbound sales-calling platform, from its older .NET Framework and WCF code to newer .NET APIs with an Angular interface.",
  "I like owning a feature end to end: the schema, the service, the screen and, lately, the LLM call. I started as an intern in January 2024 by building a whole app alone, and I still work that way. Ship it, then make it fast.",
  "Outside work I build Cursus, a free marathon-training app where rules decide the numbers and AI explains them. I built it to go deeper on AI than my day job asks.",
  "I use Claude, Claude Code, Cursor and ChatGPT while I build, and I keep correctness in tested code, not in the model.",
];

export const facts = [
  ["Location", "Pune, India"],
  ["Company", "Coditas"],
  ["Focus", ".NET & AI-integrated apps"],
  ["Education", "B.Tech, Information Technology"],
] as const;

export interface StoryStep { tab: string; heading: string; body: string; on: LayerKey[]; sel: LayerKey }
export const storySteps: StoryStep[] = [
  { tab: "Jan 2024, Intern", heading: "Started by shipping a whole app.", body: "The Diet Planner took me from tutorials to production-shaped code: JWT auth, role-based access, a SQL Server schema, SignalR messaging and Redis caching.", on: [0, 1, 2], sel: 1 },
  { tab: "Aug 2024, Engineer", heading: "Then moved onto a platform real clients use daily.", body: "On Connect & Sell I scaled APIs, shipped bulk tooling, CRM integrations and the Beacon dashboard, and removed slow spots from latency-critical paths.", on: [0, 1, 2], sel: 1 },
  { tab: "Beyond work, AI", heading: "And went deeper on AI on my own time.", body: "Cursus (formerly Stryde) is a marathon-training app where rules build the plan and a hybrid RAG coach explains it, with Groq as a free-tier backup for Gemini.", on: [3], sel: 3 },
];

export interface LayerInfo { name: string; text: string; chips: string[]; label: string }
export const layers: LayerInfo[] = [
  { name: "Data", label: "Data: SQL, Postgres, Redis", text: "Schemas and stored procedures on SQL Server, Postgres with Row Level Security and pgvector, and Redis for hot reads.", chips: ["SQL Server", "PostgreSQL", "Redis Cache", "pgvector", "Entity Framework"] },
  { name: "Services", label: "Services: .NET, WCF, APIs", text: ".NET and WCF services, REST APIs, CRM integrations, SignalR for real-time, RabbitMQ events and Supabase Edge Functions.", chips: [".NET", "WCF", "ASP.NET Web API", "SignalR", "RabbitMQ", "Salesforce and HubSpot integrations"] },
  { name: "Interface", label: "Interface: Angular, React", text: "Angular with Kendo UI at work, React, Next.js and React Native in my own apps.", chips: ["Angular", "React", "Next.js", "React Native", "Tailwind CSS"] },
  { name: "AI", label: "AI: RAG, LLM, tools", text: "Hybrid retrieval, Gemini with a Groq fallback and tool-calling. Rules keep the numbers; the model explains them.", chips: ["Google Gemini", "Groq", "Retrieval-Augmented Generation (RAG)", "Agentic tool-calling", "MCP"] },
];

export type Target = { type: "case"; index: number } | { type: "eng"; index: number };
export const principles: { title: string; line: string; proof: string; label: string; go: Target }[] = [
  { title: "Own it end to end", line: "I would rather own a feature from schema to screen than pass it along in pieces.", proof: "I built the Diet Planner alone as an intern, and at Coditas I shipped the Beacon dashboard from SQL schema to Angular interface.", label: "See the Diet Planner", go: { type: "case", index: 2 } },
  { title: "Fix the slow path first", line: "Before adding more, I look for the step that makes everything behind it wait.", proof: "Refactoring a backend filter pipeline cut API request processing time by 25%, and removing an O(n) scan from a latency-critical path cut delay on every call transfer.", label: "See the trace", go: { type: "eng", index: engIndex("trace") } },
  { title: "Keep AI on a leash", line: "Models write words. Tested code decides numbers.", proof: "In Cursus, a deterministic plan engine produces every training number. If the coach returns a figure, the app swaps in the engine's value. 304 tests guard the rules.", label: "See the guard", go: { type: "eng", index: engIndex("rules") } },
  { title: "Make failure safe", line: "Phones die and caches go down. The user should not notice.", proof: "Cursus saves a run on the device before uploading it. On the platform, a Redis outage is logged and the request is still served.", label: "See a crash recovered", go: { type: "eng", index: engIndex("offline") } },
];
