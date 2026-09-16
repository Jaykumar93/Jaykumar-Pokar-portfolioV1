"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [{ href: "/", label: "Home" }];

// The home page renders its own nav (PrototypeNav) merged into the hero;
// this generic chrome would otherwise stack a second, mismatched bar on
// top of it. It's kept as a fallback for any future route added beside "/".
const HIDE_ON = ["/"];

export function Navbar() {
  const pathname = usePathname();
  if (HIDE_ON.includes(pathname ?? "")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/80 backdrop-blur dark:border-white/10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Jaykumar Pokar
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="opacity-80 transition-opacity hover:opacity-100">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
