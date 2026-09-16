"use client";

import { usePathname } from "next/navigation";
import { resume } from "@/data/resume";

// The home page renders its own footer inline; this generic one is kept as
// a fallback for any future route added beside "/".
const HIDE_ON = ["/"];

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  if (HIDE_ON.includes(pathname ?? "")) return null;

  return (
    <footer className="border-t border-black/10 py-8 text-center text-sm opacity-70 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6">
        <div className="flex gap-4">
          {resume.links.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
        <p>
          © {year} {resume.name}
        </p>
      </div>
    </footer>
  );
}
