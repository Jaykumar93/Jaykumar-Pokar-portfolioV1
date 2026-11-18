import { profile } from "@/data/profile";
import { Arrow } from "@/components/ui/Arrow";
import { AskMe } from "./AskMe";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow fade">Full Stack AI Engineer, {profile.location}</span>
          <h1 aria-label={profile.name}>
            <span className="l">
              <span>Jaykumar</span>
            </span>
            <span className="l">
              <span>
                Pokar<b className="dot">.</b>
              </span>
            </span>
          </h1>
          <p className="role fade d1">.NET, Angular / React, AI-integrated applications</p>
          <p className="lead fade d2">
            Three years building scalable .NET backends and Angular interfaces for a high-traffic B2B platform at Coditas. I also ship AI apps end to end, from the database schema to the LLM.
          </p>
          <div className="cta fade d3">
            <a className="btn btn-primary" href="#projects">
              View projects <Arrow />
            </a>
            <a className="btn btn-line" href={profile.resumeUrl} target="_blank" rel="noopener">
              Read résumé <Arrow />
            </a>
          </div>
          <div className="meta fade d4">
            <span className="chip">Currently at Coditas</span>
            <span className="chip">3 years in production</span>
            <span className="chip">.NET</span>
            <span className="chip">RAG, Gemini, pgvector</span>
          </div>
        </div>
        <div className="stage fade d2">
          <AskMe />
        </div>
      </div>
    </section>
  );
}
