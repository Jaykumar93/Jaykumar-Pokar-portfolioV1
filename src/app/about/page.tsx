import type { Metadata } from "next";
import { resume } from "@/data/resume";

export const metadata: Metadata = {
  title: "About",
  description: `About ${resume.name} — ${resume.title}`,
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <p className="mt-6 leading-relaxed opacity-80">{resume.summary}</p>

      <h2 className="mt-10 text-xl font-semibold">Skills</h2>
      <dl className="mt-4 space-y-3">
        {Object.entries(resume.skills).map(([category, items]) => (
          <div key={category}>
            <dt className="text-sm font-medium opacity-60">{category}</dt>
            <dd className="opacity-90">{items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
