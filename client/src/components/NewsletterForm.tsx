import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    if (values.get("newsletterConsent") !== "on") return;
    setStatus("idle");
    const emailAddress = String(values.get("newsletterEmail") || "").trim().toLowerCase();
    try {
      const existing = JSON.parse(window.localStorage.getItem("hipa-newsletter-subscriptions") || "[]") as string[];
      if (!existing.includes(emailAddress)) existing.push(emailAddress);
      window.localStorage.setItem("hipa-newsletter-subscriptions", JSON.stringify(existing));
      setStatus("success");
      trackEvent("newsletter_submit", { source: "homepage_footer", storage: "local" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") return <p className="newsletter-status" role="status">Thank you. Your update request is saved on this device.</p>;

  return <form className="cta-form" onSubmit={submit}>
    <label className="sr-only" htmlFor="newsletterEmail">Email address</label>
    <input id="newsletterEmail" name="newsletterEmail" type="email" placeholder="Enter your email address" required autoComplete="email" data-analytics-field="newsletter_email" />
    <button className="btn btn-primary" type="submit" data-analytics-event="newsletter_submit">Subscribe</button>
    <label className="newsletter-consent"><input name="newsletterConsent" type="checkbox" required /> <span>I agree that HIPA Masalas may use my email for product updates.</span></label>
    {status === "error" && <p className="newsletter-error" role="alert">We could not record your subscription. Please try again.</p>}
  </form>;
}
