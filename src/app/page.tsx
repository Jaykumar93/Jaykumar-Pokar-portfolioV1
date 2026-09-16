"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { LiquidBall } from "@/components/three/LiquidBall";
import { ParallaxShapes } from "@/components/ParallaxShapes";
import { PrototypeNav } from "@/components/PrototypeNav";
import { SocialRail } from "@/components/SocialRail";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ContactForm } from "@/components/ContactForm";
import { resume } from "@/data/resume";
import { projects, type PortfolioProject } from "@/data/projects";
import { display, body, mono } from "@/lib/fonts";
import { skillIcons } from "@/lib/skillIcons";
import styles from "./page.module.css";

const allSkills = Object.values(resume.skills).flat();

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [pageReady, setPageReady] = useState(false);
  const handleLoadComplete = useCallback(() => setPageReady(true), []);

  return (
    <div id="top" className={`${styles.page} ${display.variable} ${body.variable} ${mono.variable}`} style={{ fontFamily: "var(--font-body), sans-serif" }}>
      <LoadingScreen onComplete={handleLoadComplete} />
      <PrototypeNav name={resume.name} />
      <SocialRail />
      {/* ---------- HERO (ink) ---------- */}
      <section style={{ height: "100vh", position: "relative", overflow: "hidden", background: "var(--ink)" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <ParallaxShapes />
        </div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <Canvas camera={{ position: [0, 0, 4.5], fov: 42 }}>
            <Suspense fallback={null}>
              <LiquidBall />
            </Suspense>
          </Canvas>
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 8%",
            pointerEvents: "none",
          }}
        >
          {pageReady && (
            <>
              <ScrambleText
                as="p"
                text="Hi, I'm"
                className={styles.mono}
                style={{ opacity: 0.5, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}
                delay={100}
                duration={450}
              />
              <h1
                className={styles.display}
                style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", fontWeight: 800, margin: 0, maxWidth: 720, color: "var(--paper)" }}
              >
                <ScrambleText text={resume.name.split(" ")[0]} delay={350} duration={650} />{" "}
                <ScrambleText
                  text={resume.name.split(" ")[1]}
                  style={{ color: "var(--vermilion)" }}
                  delay={750}
                  duration={500}
                />
              </h1>
              <ScrambleText
                as="p"
                text={resume.title}
                style={{ opacity: 0.7, fontSize: 18, marginTop: 16, maxWidth: 480, display: "inline-block" }}
                delay={1150}
                duration={700}
              />
              <div
                className={styles.heroIn}
                style={{ display: "flex", gap: 12, marginTop: 32, pointerEvents: "auto", animationDelay: "1.75s" }}
              >
                <ArrowButton href="#projects" variant="solid">View Projects</ArrowButton>
                <ArrowButton href={resume.resumePdfUrl} variant="outline">Download Résumé</ArrowButton>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---------- ABOUT (paper) ---------- */}
      <section id="about" className={styles.sectionPaper}>
        <Reveal>
          <SectionLabel tone="paper">About</SectionLabel>
        </Reveal>
        <div className={styles.aboutGrid}>
          <Reveal>
            <div className={styles.factGrid}>
              {resume.quickFacts.map((fact) => (
                <div key={fact.label} className={styles.factItem}>
                  <div className={styles.factLabel}>{fact.label}</div>
                  <div className={styles.factValue}>{fact.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontSize: 19, lineHeight: 1.75, opacity: 0.9 }}>{resume.summary}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- TOOLKIT (ink) ---------- */}
      <section className={styles.sectionInk}>
        <Reveal>
          <SectionLabel tone="ink">Toolkit</SectionLabel>
        </Reveal>

        <Reveal delay={60}>
          <div className={styles.toolkitMarquee}>
            <div className={styles.toolkitMarqueeTrack}>
              {[...allSkills, ...allSkills].map((skill, i) => {
                const Icon = skillIcons[skill];
                return (
                  <span key={`${skill}-${i}`} className={styles.toolkitMarqueeChip}>
                    {Icon && <Icon />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className={styles.toolkitRows}>
          {Object.entries(resume.skills).map(([category, items], i) => (
            <Reveal key={category} delay={i * 60}>
              <div className={styles.toolkitRow}>
                <h3 className={styles.toolkitRowLabel}>{category}</h3>
                <div className={styles.toolkitRowTags}>
                  {items.map((item) => {
                    const Icon = skillIcons[item];
                    return (
                      <span key={item} className={styles.toolkitRowTag}>
                        {Icon && <Icon />}
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- EXPERIENCE (paper) ---------- */}
      <section id="experience" className={styles.sectionPaper}>
        <Reveal>
          <SectionLabel tone="paper">Experience</SectionLabel>
        </Reveal>
        <div className={styles.timeline}>
          {resume.experience.map((job, i) => (
            <Reveal key={job.role} delay={i * 100}>
              <div className={styles.timelineItem}>
                <span className={styles.timelineDot} />
                <div className={styles.timelineHead}>
                  <h3 className={styles.timelineRole}>{job.role}</h3>
                  <span className={styles.timelineCompany}>{job.company}</span>
                </div>
                <p className={styles.timelineMeta}>{job.start.toUpperCase()} – {job.end.toUpperCase()} · {job.location}</p>
                <ul className={styles.timelineBullets}>
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className={styles.timelinePills}>
                  {job.metrics.map((m) => (
                    <span key={m.label} className={styles.metricPill}>
                      <b><CountUp value={m.value} /></b>
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- PROJECTS (ink) ---------- */}
      <section id="projects" className={styles.sectionInk}>
        <Reveal>
          <SectionLabel tone="ink">Projects</SectionLabel>
        </Reveal>
        <div className={styles.projectGrid}>
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <div
                className={styles.projectCard}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProject(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(p);
                  }
                }}
              >
                {p.metric && <div className={styles.projectMetric}>{p.metric.value} {p.metric.label}</div>}

                <div className={styles.projectCollapsed}>
                  <span className={styles.projectIndex}>PROJECT_{String(i + 1).padStart(2, "0")}</span>
                  <h3>{p.name}</h3>
                  <p className={styles.projectTagline}>{p.tagline}</p>
                  <p className={styles.hoverHint}>Click for details ↓</p>
                </div>

                <div className={styles.projectExpanded}>
                  <span className={`${styles.statusBadge} ${p.status === "Completed" ? styles.done : styles.progress}`}>
                    {p.status}
                  </span>
                  <h3>{p.name}</h3>
                  <p className={styles.projectTagline}>{p.tagline}</p>
                  <p className={styles.projectDesc}>{p.description}</p>
                  <ul className={styles.projectBullets}>
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className={styles.projectStackBlock}>
                    <p className={styles.stackLabel}>Skills</p>
                    <div className={styles.projectStack}>
                      {p.stack.map((s) => (
                        <span key={s} className={styles.projectStackTag}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* ---------- CONTACT (paper) ---------- */}
      <section id="contact" className={styles.sectionPaper} style={{ paddingBottom: 60 }}>
        <Reveal>
          <SectionLabel tone="paper">Contact</SectionLabel>
          <h2 className={styles.contactLine}>Let&apos;s build the next thing.</h2>
        </Reveal>

        <div className={styles.contactGrid}>
          <Reveal delay={80}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <ArrowButton href={`mailto:${resume.email}`} variant="solid">Email Me</ArrowButton>
              {resume.links.map((l) => (
                <ArrowButton key={l.label} href={l.url} variant="outline">{l.label}</ArrowButton>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <ContactForm fallbackEmail={resume.email} />
          </Reveal>
        </div>
      </section>

      <footer style={{ padding: "24px 8%", background: "var(--paper)", color: "var(--graphite)", fontSize: 12 }} className={styles.mono}>
        © {new Date().getFullYear()} {resume.name}
      </footer>
    </div>
  );
}
