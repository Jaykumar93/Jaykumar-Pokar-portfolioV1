import { resume } from "@/data/resume";
import { HeroScene } from "@/components/three/HeroScene";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-8 px-6 py-16 sm:grid-cols-2 sm:py-24">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-widest opacity-60">
          Hi, I&apos;m
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{resume.name}</h1>
        <p className="mt-4 max-w-md text-lg opacity-80">{resume.title}</p>
        <p className="mt-6 max-w-md opacity-70">{resume.summary}</p>
      </div>
      <HeroScene />
    </section>
  );
}
