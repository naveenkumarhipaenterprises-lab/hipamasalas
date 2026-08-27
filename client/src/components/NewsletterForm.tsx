import { FormEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setStatus("success");
      trackEvent("newsletter_submit", { source: "homepage_footer" });
    },
    onError: () => setStatus("error"),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    if (values.get("newsletterConsent") !== "on") return;
    setStatus("idle");
    subscribe.mutate({ emailAddress: String(values.get("newsletterEmail") || ""), consent: true });
  }

  if (status === "success") return <p className="newsletter-status" role="status">Thank you. Your subscription request has been recorded.</p>;

  return <form className="cta-form" onSubmit={submit}>
    <label className="sr-only" htmlFor="newsletterEmail">Email address</label>
    <input id="newsletterEmail" name="newsletterEmail" type="email" placeholder="Enter your email address" required autoComplete="email" data-analytics-field="newsletter_email" />
    <button className="btn btn-primary" type="submit" disabled={subscribe.isPending} data-analytics-event="newsletter_submit">{subscribe.isPending ? <LoaderCircle className="spin" size={17} /> : "Subscribe"}</button>
    <label className="newsletter-consent"><input name="newsletterConsent" type="checkbox" required /> <span>I agree that HIPA Masalas may use my email for product updates.</span></label>
    {status === "error" && <p className="newsletter-error" role="alert">We could not record your subscription. Please try again.</p>}
  </form>;
}
