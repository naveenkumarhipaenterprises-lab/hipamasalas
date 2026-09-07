import React, { useEffect, useRef, useState } from "react";
import { Bot, Loader2, RotateCcw, Send, X } from "lucide-react";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

const INITIAL_WELCOME: Message = {
  id: "welcome-1",
  role: "assistant",
  content: "Hey 👋 Welcome to HIPA!\n\nAsk me about masalas, recipes, cooking ideas, products or bulk orders.\n\nTamil / Tanglish-la kooda kekkalam 😄",
};

const QUICK_CHIPS = [
  { label: "Sambar Recipe 🍲", text: "Sambar powder epdi use panradhu?" },
  { label: "Products List 📦", text: "What products do you have?" },
  { label: "Hotel / Bulk 🏨", text: "I need bulk masala supply for my hotel" },
  { label: "Tanglish Help 💬", text: "epdi iruka bro?" },
];

export function SiteChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading, open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const handleReset = () => {
    setMessages([{ ...INITIAL_WELCOME, id: `welcome-${Date.now()}` }]);
    setInput("");
  };

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!overrideText) setInput("");
    setLoading(true);

    try {
      // Build history payload for Gemini (format role: user / assistant)
      const historyPayload = nextMessages.slice(1).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || "Oops 😅 konjam network issue. One more time try pannunga!";

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyText,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("[SiteChatWidget Error]", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Oops 😅 Connection konjam slow-ah iruku. One more time try pannunga or direct-a HIPA team-a contact pannunga (+91 70580 53055 / info@hipamasalas.com)!",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Generic Robot Icon Floating Action Button */}
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
          cursor: "pointer",
        }}
      >
        <Bot size={22} />
        <span
          style={{
            position: "absolute",
            top: "-3px",
            right: "-3px",
            width: "12px",
            height: "12px",
            backgroundColor: "#22c55e",
            borderRadius: "50%",
            border: "2px solid #ffffff",
          }}
        />
      </button>

      {/* Floating ChatGPT Mini Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "365px",
            maxWidth: "calc(100vw - 32px)",
            height: "530px",
            maxHeight: "calc(100vh - 110px)",
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
          {/* Header */}
          <div
            style={{
              backgroundColor: "#8B2C1F",
              color: "#ffffff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>HIPA AI Assistant</h4>
                <p style={{ margin: 0, fontSize: "11px", opacity: 0.85 }}>Taste of Tradition</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={handleReset}
                title="New Chat / Clear History"
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  opacity: 0.85,
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  opacity: 0.85,
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
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
                    maxWidth: "84%",
                    padding: "10px 14px",
                    borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    fontSize: "13.5px",
                    lineHeight: "1.48",
                    whiteSpace: "pre-wrap",
                    backgroundColor: m.role === "user" ? "#8B2C1F" : "#ffffff",
                    color: m.role === "user" ? "#ffffff" : "#1f2937",
                    boxShadow: m.role === "assistant" ? "0 2px 8px rgba(0, 0, 0, 0.05)" : "0 2px 6px rgba(139, 44, 31, 0.2)",
                    border: m.role === "assistant" ? "1px solid #e5e7eb" : "none",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Thinking / Typing indicator */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#6b7280",
                  fontSize: "13px",
                  padding: "6px 10px",
                }}
              >
                <Loader2 size={16} className="animate-spin" color="#8B2C1F" />
                <span>HIPA AI is typing...</span>
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
              {QUICK_CHIPS.map(q => (
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
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
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
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
                transition: "background-color 0.15s ease",
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
