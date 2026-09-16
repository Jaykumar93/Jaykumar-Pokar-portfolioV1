"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";

type Status = "idle" | "sending" | "success" | "error";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!WEB3FORMS_ACCESS_KEY) {
      console.error("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set — see .env.local.example");
      setStatus("error");
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("subject", String(data.get("subject") || "Portfolio inquiry"));
    data.append("from_name", "Portfolio contact form");

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* honeypot — real visitors never fill this in, bots do */}
      <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Full name</label>
          <input id="contact-name" name="name" type="text" required disabled={status === "sending"} />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email">Email address</label>
          <input id="contact-email" name="email" type="email" required disabled={status === "sending"} />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-subject">Subject</label>
        <input id="contact-subject" name="subject" type="text" disabled={status === "sending"} />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows={4} required disabled={status === "sending"} />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {status === "success" && (
        <p className={styles.formStatus} role="status">
          Thanks — your message is in. I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className={`${styles.formStatus} ${styles.formStatusError}`} role="alert">
          Something went wrong sending that. Mind emailing me directly instead?{" "}
          <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>
        </p>
      )}
    </form>
  );
}
