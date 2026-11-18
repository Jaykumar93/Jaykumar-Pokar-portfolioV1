export type EngKey = "rules" | "rag" | "plan" | "propose" | "gps" | "offline" | "trace" | "cache" | "lock" | "bulk";

export interface EngItem {
  key: EngKey;
  group: "Cursus" | "My work";
  title: string;
  short: string;
  source: string;
  why: string;
  did: string;
}

export const engineering: EngItem[] = [
  { key: "rules", group: "Cursus", title: "Rules make the numbers", short: "Rules vs AI", source: "From my Cursus repo", why: "A language model can write a convincing weekly mileage that no plan ever set. Cursus lets rules decide every number and lets the AI explain them.", did: "In Cursus, a deterministic plan engine produces every training number. If the model returns a mileage figure, the app replaces it with the engine's value." },
  { key: "rag", group: "Cursus", title: "How the coach answers", short: "Retrieval and backup model", source: "From my Cursus repo", why: "The coach retrieves from a knowledge base and the runner's own logs before it writes, so replies are grounded. Cursus runs on free tiers, so Gemini can hit its limits, and a second model is there as a backup.", did: "Built hybrid retrieval in Cursus: Postgres full-text plus pgvector similarity. Gemini Flash answers first, with Groq behind a provider layer as a free-tier backup. Provider keys stay on the server in Edge Functions." },
  { key: "plan", group: "Cursus", title: "From one race to a plan", short: "Plan builder", source: "From my Cursus repo", why: "Cursus can set training paces from a race result, a target time or a Riegel prediction. Riegel scales a time you already ran to a new distance, so a 10K result predicts a half or full marathon.", did: "Built the plan engine in pure TypeScript, from base to taper, with paces from a race result, a target time or a Riegel prediction. The block shape and numbers here are illustrative. The real engine is unit-tested." },
  { key: "propose", group: "Cursus", title: "Propose, never impose", short: "Plan versions", source: "From my Cursus repo", why: "A plan that rewrites itself silently is hard to trust. Cursus keeps the original plan and an active plan apart, and any adaptive change is only a proposal until the runner accepts it.", did: "Stored plan_original and plan_active separately and made every adaptive change a proposal the runner confirms. A missed run offers inline options such as moving it to tomorrow, with no guilt-toned messages." },
  { key: "gps", group: "Cursus", title: "Cleaning noisy GPS", short: "GPS filtering", source: "From my Cursus repo", why: "GPS points jump around, especially between buildings or under trees. Add up every jump and a short run reports far too much. Filtering drops points no runner could have reached.", did: "Added distance and pace noise filtering to run tracking, tuned for battery with balanced accuracy and a point every few seconds or about 10 m. The jump limit and track here are illustrative." },
  { key: "offline", group: "Cursus", title: "A run survives a crash", short: "Offline-first", source: "From my Cursus repo", why: "Phones die and apps get killed mid-run. If the run only exists in memory until upload, it is gone.", did: "Cursus saves a finished run on the device before uploading, and unsaved runs survive the app being killed. Hold-to-stop also prevents pocket taps from ending a run." },
  { key: "trace", group: "My work", title: "Where the time goes", short: "Request trace", source: "Concept from my work, illustrative", why: "Every request passes through a chain of steps. When one step is slow or does the same work twice, everything behind it waits.", did: "Refactored the backend filter pipeline into a modular, testable architecture, cutting API request processing time by 25%. Timings here are for illustration." },
  { key: "cache", group: "My work", title: "Cache hit, miss or down", short: "Graceful degradation", source: "From the platform codebase", why: "A cache should make things faster, never make things break. If Redis is unreachable, the request should still be served.", did: "In the platform, a Redis failure is logged and swallowed, and the call carries on without the cache. I also used Redis caching to cut database load by 35% in the Diet Planner." },
  { key: "lock", group: "My work", title: "Two reps, one lead pool", short: "Redis lock", source: "Concept from my work, illustrative", why: "When two reps pull leads from the same pool at the same moment, both can get the same lead. A Redis lock makes them take turns.", did: "Built Redis-locked batch checkout for the shared Lead Pool in Beacon." },
  { key: "bulk", group: "My work", title: "A bad row must not stop the batch", short: "Idempotent bulk job", source: "From my work", why: "In a bulk job, one bad row should be reported, not fatal. And running the same job again should skip what already worked instead of redoing it.", did: "Built a support tool that fetches call recordings from an uploaded spreadsheet. Failures are isolated per row, and re-runs skip files that were already downloaded." },
];

/** Index of an explainer by key, so other sections can link to it without hard-coding positions. */
export const engIndex = (key: EngKey): number => engineering.findIndex((e) => e.key === key);
