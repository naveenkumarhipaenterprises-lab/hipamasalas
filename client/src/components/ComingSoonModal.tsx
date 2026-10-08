import { useEffect, useState } from "react";
import { MessageCircle, ShoppingBag, Sparkles, X, Mail } from "lucide-react";
import { siteIdentity } from "@shared/hipaContent";
import { trackEvent } from "@/lib/analytics";

export function openComingSoonModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hipa:open-coming-soon"));
  }
}

export function ComingSoonModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("hipa:open-coming-soon", handleOpen);
    return () => window.removeEventListener("hipa:open-coming-soon", handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="coming-soon-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div className="coming-soon-modal">
        <button
          type="button"
          className="coming-soon-close-btn"
          aria-label="Close dialog"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>

        <div className="coming-soon-icon-wrap">
          <ShoppingBag size={32} />
          <span className="coming-soon-sparkle">
            <Sparkles size={16} />
          </span>
        </div>

        <p className="coming-soon-eyebrow">HIPA ONLINE STORE</p>
        <h2 id="coming-soon-title" className="coming-soon-title">
          OUR ONLINE STORE IS COMING SOON!
        </h2>

        <div className="coming-soon-body">
          <p>
            We're working on something exciting for you. Soon you'll be able to shop HIPA Masala products online with a smooth and easy experience.
          </p>
          <p className="coming-soon-subtext">
            Stay tuned — we'll be arriving soon with great offers!
          </p>
        </div>

        <div className="coming-soon-divider" />

        <div className="coming-soon-alternatives">
          <p className="coming-soon-alt-heading">Need spices or bulk supply today?</p>
          <div className="coming-soon-actions">
            <a
              href={siteIdentity.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp-live"
              onClick={() => {
                trackEvent("whatsapp_click", { location: "coming_soon_modal" });
                setIsOpen(false);
              }}
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
            <a
              href="/contact#enquire"
              className="btn btn-outline"
              onClick={() => {
                trackEvent("enquiry_cta_click", { location: "coming_soon_modal" });
                setIsOpen(false);
              }}
            >
              <Mail size={16} /> Send Enquiry
            </a>
          </div>
        </div>

        <button
          type="button"
          className="coming-soon-dismiss"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
