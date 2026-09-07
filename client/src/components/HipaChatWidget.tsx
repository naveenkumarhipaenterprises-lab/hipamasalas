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
  content: "Hey 👋 Welcome to HIPA Masalas!\n\nAsk me about traditional masalas, recipes, cooking guidance, products, or bulk orders.\n\nTamil or Tanglish-la kooda kekkalam 😄",
};

const QUICK_CHIPS = [
  { label: "Sambar Recipe 🍲", text: "Sambar powder epdi use panradhu?" },
  { label: "Products List 📦", text: "What products do you have?" },
  { label: "Hotel / Bulk 🏨", text: "I need bulk masala supply for my hotel" },
  { label: "Tanglish Help 💬", text: "epdi iruka bro?" },
];

export function HipaChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading, open]);

  // Focus input when popup opens
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
      const historyPayload = nextMessages.slice(1).map((m) => ({
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
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || "For assistance, please contact HIPA team (+91 70580 53055 / info@hipamasalas.com).";

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("[HipaChatWidget Error]", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Network konjam slow-ah iruku 😅. Please try again or reach the HIPA team at +91 70580 53055 / info@hipamasalas.com!",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
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

      {/* Floating Responsive Chat Window */}
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
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#ffffff" }}>HIPA AI Assistant</h4>
                <p style={{ margin: 0, fontSize: "11px", opacity: 0.85, color: "#f3f4f6" }}>Taste of Tradition</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                aria-label="Restart conversation"
                title="Restart conversation"
                onClick={handleReset}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.85,
                }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.85,
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: "#f9fafb",
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "84%",
                      padding: "10px 14px",
                      borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                      backgroundColor: isUser ? "#8B2C1F" : "#ffffff",
                      color: isUser ? "#ffffff" : "#1f2937",
                      fontSize: "13.5px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      boxShadow: isUser ? "0 2px 8px rgba(139, 44, 31, 0.2)" : "0 2px 6px rgba(0, 0, 0, 0.05)",
                      border: isUser ? "none" : "1px solid #e5e7eb",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "16px 16px 16px 2px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Chips */}
          {messages.length <= 2 && !loading && (
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #f3f4f6",
                display: "flex",
                gap: "6px",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSend(chip.text)}
                  style={{
                    fontSize: "11.5px",
                    padding: "5px 10px",
                    borderRadius: "12px",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
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
              placeholder="Ask about masalas, recipes..."
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "20px",
                border: "1px solid #d1d5db",
                fontSize: "13px",
                outline: "none",
                backgroundColor: loading ? "#f9fafb" : "#ffffff",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: input.trim() && !loading ? "#8B2C1F" : "#e5e7eb",
                color: "#ffffff",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !loading ? "pointer" : "default",
                transition: "background-color 0.2s ease",
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
