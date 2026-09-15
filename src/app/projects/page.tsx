import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and case studies.",
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <ul className="mt-8 space-y-6">
        {projects.map((project) => (
          <li key={project.slug} className="rounded-lg border border-black/10 p-6 dark:border-white/10">
            <Link href={`/projects/${project.slug}`} className="text-xl font-semibold hover:underline">
              {project.name}
            </Link>
            <p className="mt-1 text-sm opacity-60">{project.tagline}</p>
            <p className="mt-3 opacity-80">{project.description}</p>
            <p className="mt-3 text-sm opacity-60">{project.stack.join(" · ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
