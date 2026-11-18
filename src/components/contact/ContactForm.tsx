"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { Arrow } from "@/components/ui/Arrow";
import { useUI } from "@/components/providers/UIProvider";
import "./contact.css";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
type Status = "idle" | "sending" | "error";
type Errors = { name?: string; email?: string; message?: string };

export function ContactForm() {
  const { toast } = useUI();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(data.get("email") ?? "").trim())) next.email = "Enter a valid email address.";
    if (!String(data.get("message") ?? "").trim()) next.message = "Write a message.";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!ACCESS_KEY) {
      console.error("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set. See .env.local.example");
      setStatus("error");
      return;
    }
    data.append("access_key", ACCESS_KEY);
    data.set("subject", String(data.get("subject") || "Portfolio inquiry"));
    data.append("from_name", "Portfolio contact form");

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: data });
      const result = await res.json();
      if (result.success) {
        setStatus("idle");
        form.reset();
        toast("Message sent. I'll get back to you soon.");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="card" onSubmit={onSubmit} noValidate>
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="two">
        <div className="fld">
          <label htmlFor="f-name">Full name</label>
          <input id="f-name" name="name" autoComplete="name" required aria-invalid={!!errors.name} disabled={status === "sending"} />
          <div className="err">{errors.name}</div>
        </div>
        <div className="fld">
          <label htmlFor="f-email">Email address</label>
          <input id="f-email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} disabled={status === "sending"} />
          <div className="err">{errors.email}</div>
        </div>
      </div>
      <div className="fld">
        <label htmlFor="f-subject">Subject</label>
        <input id="f-subject" name="subject" disabled={status === "sending"} />
      </div>
      <div className="fld">
        <label htmlFor="f-msg">Message</label>
        <textarea id="f-msg" name="message" rows={5} required aria-invalid={!!errors.message} disabled={status === "sending"} />
        <div className="err">{errors.message}</div>
      </div>
      <button className="btn btn-primary" type="submit" style={{ justifySelf: "start" }} disabled={status === "sending"}>
        {status === "sending" ? (
          "Sending..."
        ) : (
          <>
            Send message <Arrow />
          </>
        )}
      </button>
      {status === "error" && (
        <p className="form-error" role="alert">
          That did not send. Email me directly instead: <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      )}
    </form>
  );
}
