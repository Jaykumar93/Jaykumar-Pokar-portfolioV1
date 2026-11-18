import { ProgressBar } from "@/components/chrome/ProgressBar";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import { Hero } from "@/components/hero/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { About } from "@/components/about/About";
import { Projects } from "@/components/projects/Projects";
import { Engineering } from "@/components/engineering/Engineering";
import { Experience } from "@/components/experience/Experience";
import { Toolkit } from "@/components/toolkit/Toolkit";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  return (
    <>
      <ProgressBar />
      <Nav />
      <main className="page" id="top">
        <Hero />
        <Metrics />
        <About />
        <Projects />
        <Engineering />
        <Experience />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
