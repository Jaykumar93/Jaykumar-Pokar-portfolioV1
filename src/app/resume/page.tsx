import type { Metadata } from "next";
import { resume } from "@/data/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: `${resume.name}'s resume — ${resume.title}`,
};

export default function ResumePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
        <a
          href={resume.resumePdfUrl}
          download
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Download PDF
        </a>
      </div>

      <p className="mt-6 opacity-80">{resume.summary}</p>

      <h2 className="mt-10 text-xl font-semibold">Experience</h2>
      <div className="mt-4 space-y-8">
        {resume.experience.map((job) => (
          <div key={`${job.company}-${job.role}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium">
                {job.role} — {job.company}
              </h3>
              <span className="text-sm opacity-60">
                {job.start} - {job.end}
              </span>
            </div>
            <p className="text-sm opacity-60">{job.location}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 opacity-80">
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold">Projects</h2>
      <div className="mt-4 space-y-8">
        {resume.projects.map((project) => (
          <div key={project.name}>
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-sm opacity-60">{project.stack.join(" · ")}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 opacity-80">
              {project.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold">Education</h2>
      <div className="mt-4 space-y-4">
        {resume.education.map((edu) => (
          <div key={edu.school}>
            <h3 className="font-medium">{edu.degree}</h3>
            <p className="text-sm opacity-60">
              {edu.school}, {edu.location}
            </p>
            <p className="text-sm opacity-60">{edu.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
