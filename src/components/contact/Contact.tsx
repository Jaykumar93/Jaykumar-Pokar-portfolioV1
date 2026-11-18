import { profile } from "@/data/profile";
import { Arrow } from "@/components/ui/Arrow";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact">
      <div className="wrap contact-grid">
        <div>
          <span className="eyebrow">Contact</span>
          <h2 className="big">
            Let&apos;s build the <span>next thing.</span>
          </h2>
          <div className="mail">
            <a className="btn btn-primary" href={`mailto:${profile.email}`} data-dock="email">
              {profile.email} <Arrow />
            </a>
          </div>
          <div className="soc">
            <a className="btn btn-line" href={profile.github} target="_blank" rel="noopener" data-dock="github">
              GitHub
            </a>
            <a className="btn btn-line" href={profile.linkedin} target="_blank" rel="noopener" data-dock="linkedin">
              LinkedIn
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
