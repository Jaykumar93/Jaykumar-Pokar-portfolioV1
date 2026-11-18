"use client";

import { profile } from "@/data/profile";
import { useUI } from "@/components/providers/UIProvider";
import { ContactForm } from "./ContactForm";

export function Contact() {
  const { copyEmail } = useUI();
  return (
    <section id="contact">
      <div className="wrap contact-grid">
        <div>
          <span className="eyebrow">Contact</span>
          <h2 className="big">
            Let&apos;s build the <span>next thing.</span>
          </h2>
          <div className="mail">
            <code>{profile.email}</code>
            <button className="btn btn-line" type="button" onClick={copyEmail}>
              Copy email
            </button>
          </div>
          <div className="soc">
            <a className="btn btn-line" href={profile.github} target="_blank" rel="noopener">
              GitHub
            </a>
            <a className="btn btn-line" href={profile.linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
