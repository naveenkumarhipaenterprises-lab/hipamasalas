import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, X, RotateCcw, MessageCircle, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! ?? Welcome to **HIPA Masalas**.\n\nI'm your AI Spice Assistant powered by Gemini. I can help you explore our masalas, find the right product for your recipe, or assist with bulk and B2B enquiries.\n\n**What are you looking for today?**",
};

const QUICK_REPLIES = [
  { label: "??? Explore Products", text: "What products do you have?" },
  { label: "?? Find a Masala", text: "Which masala should I buy for cooking?" },
  { label: "?? Bulk / B2B Enquiry", text: "I need masala in bulk for my hotel/business" },
  { label: "?? Contact HIPA", text: "How do I contact HIPA Masalas?" },
];

export function SiteChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = { id: String(Date.now()), role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newHistory.filter(m => m.id !== "welcome").map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm having a little trouble right now. Please try again or reach our team at info@hipamasalas.com!";
      setMessages(prev => [...prev, { id: String(Date.now() + 1), role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: "Sorry, I couldn't reach the AI server. Please contact HIPA at **info@hipamasalas.com** / **+91 70580 53055**.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME_MSG]);
    setInput("");
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        className="fab fab-ai"
        aria-label="Chat with HIPA AI Assistant"
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: "#8B2C1F",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "0 8px 24px rgba(139, 44, 31, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          transition: "transform 0.2s ease",
        }}
      >
        <Sparkles size={20} className="animate-spin-slow" />
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            width: "12px",
            height: "12px",
            backgroundColor: "#22c55e",
            borderRadius: "50%",
            border: "2px solid #ffffff",
          }}
        />
      </button>

      {/* Floating Chat Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "360px",
            maxWidth: "calc(100vw - 32px)",
            height: "520px",
            maxHeight: "calc(100vh - 120px)",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              backgroundColor: "#8B2C1F",
              color: "#ffffff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>HIPA AI Assistant</h4>
                <p style={{ margin: 0, fontSize: "11px", opacity: 0.85 }}>Taste of Tradition · Gemini Free AI</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", opacity: 0.8, padding: "4px" }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close chat"
                style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", opacity: 0.8, padding: "4px" }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              padding: "14px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: "#f9fafb",
            }}
          >
            {messages.map(m => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius: "16px",
                    fontSize: "13.5px",
                    lineHeight: "1.45",
                    whiteSpace: "pre-wrap",
                    backgroundColor: m.role === "user" ? "#8B2C1F" : "#ffffff",
                    color: m.role === "user" ? "#ffffff" : "#1f2937",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    border: m.role === "assistant" ? "1px solid #e5e7eb" : "none",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "13px" }}>
                <Loader2 size={16} className="animate-spin" />
                <span>HIPA AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Quick Reply Chips */}
          {messages.length <= 2 && !loading && (
            <div
              style={{
                padding: "8px 12px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              {QUICK_REPLIES.map(q => (
                <button
                  key={q.text}
                  type="button"
                  onClick={() => handleSend(q.text)}
                  style={{
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "4px 10px",
                    fontSize: "11.5px",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "10px 12px",
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about masalas, recipes, or bulk..."
              style={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: "20px",
                padding: "8px 14px",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                backgroundColor: input.trim() && !loading ? "#8B2C1F" : "#9ca3af",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !loading ? "pointer" : "default",
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
