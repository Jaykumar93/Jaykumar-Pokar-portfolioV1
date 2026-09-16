"use client";

import { useEffect } from "react";
import type { PortfolioProject } from "@/data/projects";
import styles from "@/app/page.module.css";

export function ProjectModal({
  project,
  onClose,
}: {
  project: PortfolioProject | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <span
          className={`${styles.statusBadge} ${project.status === "Completed" ? styles.done : styles.progress}`}
        >
          {project.status}
        </span>
        <h3 className={styles.modalTitle}>{project.name}</h3>
        <p className={styles.projectTagline}>{project.tagline}</p>
        <p className={styles.modalDesc}>{project.description}</p>

        <p className={styles.stackLabel}>What I built</p>
        <ul className={styles.modalBullets}>
          {project.details.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        {project.subprojects && project.subprojects.length > 0 && (
          <div className={styles.subprojects}>
            <p className={styles.stackLabel}>Sub-projects</p>
            {project.subprojects.map((sp) => (
              <div key={sp.name} className={styles.subprojectCard}>
                <div className={styles.subprojectHeader}>
                  <span className={styles.subprojectName}>{sp.name}</span>
                  <span
                    className={`${styles.subprojectStatus} ${sp.status === "Completed" ? styles.done : styles.progress}`}
                  >
                    {sp.status}
                  </span>
                </div>
                <p className={styles.subprojectDesc}>{sp.description}</p>
                <ul className={styles.subprojectBullets}>
                  {sp.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className={styles.projectStackBlock}>
          <p className={styles.stackLabel}>Skills</p>
          <div className={styles.projectStack}>
            {project.stack.map((s) => (
              <span key={s} className={styles.projectStackTag}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {(project.link || project.docsLink) && (
          <div className={styles.modalLinks}>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.modalLink}>
                View on GitHub ↗
              </a>
            )}
            {project.docsLink && (
              <a href={project.docsLink} target="_blank" rel="noopener noreferrer" className={styles.modalLink}>
                View Docs ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
