import { Bot } from "lucide-react";
import { lazy, Suspense, useState } from "react";

// The chat window (state, network calls, UI) is only needed after the visitor interacts,
// so it is split into its own chunk and fetched on first hover/focus/click of the launcher.
const loadPanel = () => import("./HipaChatPanel");
const HipaChatPanel = lazy(loadPanel);

export function HipaChatWidget() {
  const [open, setOpen] = useState(false);
  const [activated, setActivated] = useState(false);
  const prefetch = () => {
    void loadPanel();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        className="fab fab-ai"
        aria-label="Chat with HIPA AI Assistant"
        aria-expanded={open}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        onClick={() => {
          setActivated(true);
          setOpen(!open);
        }}
        style={{
          backgroundColor: "#8B2C1F",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "0 8px 24px rgba(139, 44, 31, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          transition: "transform 0.2s ease, background-color 0.2s ease",
          cursor: "pointer",
        }}
      >
        <Bot size={22} />
        <span
          style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "12px",
            height: "12px",
            backgroundColor: "#22c55e",
            borderRadius: "50%",
            border: "2px solid #ffffff",
          }}
        />
      </button>

      {activated && (
        <Suspense fallback={null}>
          <HipaChatPanel open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
