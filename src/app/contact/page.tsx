import type { Metadata } from "next";
import { resume } from "@/data/resume";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${resume.name}.`,
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-6 opacity-80">
        Reach out at{" "}
        <a href={`mailto:${resume.email}`} className="underline">
          {resume.email}
        </a>{" "}
        or {resume.phone}.
      </p>
      <ul className="mt-6 flex flex-wrap gap-4">
        {resume.links.map((link) => (
          <li key={link.label}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
