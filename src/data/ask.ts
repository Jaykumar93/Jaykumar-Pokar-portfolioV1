import { engIndex } from "./engineering";

/** `{L0}`..`{L3}` in an answer render as the coloured layer squares (Data, Services, Interface, AI). */
export type AskAction =
  | { label: string; type: "go"; id: string }
  | { label: string; type: "case"; index: number }
  | { label: string; type: "eng"; index: number }
  | { label: string; type: "mail" }
  | { label: string; type: "link"; url: string };

export interface AskItem { q: string; a: string; actions: AskAction[] }

export const askItems: AskItem[] = [
  { q: "What do you do?", a: "I am a full stack AI engineer. I build .NET backends and Angular or React interfaces, and I ship AI features end to end, from the database schema to the LLM call.", actions: [{ label: "See the projects", type: "go", id: "projects" }] },
  { q: "Where are you strongest?", a: "{L0}{L1} Services and data. Three years of .NET APIs, SQL Server, Redis and CRM integrations at Coditas. I am growing fastest on the {L3} AI layer.", actions: [{ label: "See the toolkit", type: "go", id: "toolkit" }, { label: "Read about me", type: "go", id: "about" }] },
  { q: "What are you building now?", a: "Cursus, a free AI marathon coach in early access. Tested rules plan the training and the AI only explains it.", actions: [{ label: "Open the case study", type: "case", index: 0 }, { label: "Try the explainers", type: "go", id: "engineering" }] },
  { q: "How do you use AI?", a: "Two ways. As a tool while I build: Claude, Claude Code, Cursor and ChatGPT. And as a feature: hybrid retrieval and tool-calling in Cursus, with tested code deciding every number.", actions: [{ label: "See how the guard works", type: "eng", index: engIndex("rules") }] },
  { q: "Can we talk?", a: "Yes. Email is the fastest way. I am based in Pune, India.", actions: [{ label: "Copy email", type: "mail" }, { label: "LinkedIn", type: "link", url: "https://www.linkedin.com/in/jaykumarpokar/" }, { label: "GitHub", type: "link", url: "https://github.com/Jaykumar93" }] },
];
