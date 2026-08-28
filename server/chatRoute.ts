import type { Express, Request, Response } from "express";

const HIPA_SYSTEM_PROMPT = `You are the official AI assistant for HIPA Masalas, a Chennai, Tamil Nadu-based Indian spice and masala brand.
Your job is to help website visitors with:
- HIPA product information (Sambar Powder, Rasam Powder, Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Powder, Pepper Powder, Garam Masala)
- Spice and masala selection & everyday cooking advice
- Product discovery & simple recipes
- Retail, Wholesale, B2B, Restaurant, Hotel, Exporter enquiries
- Company info (Location: Chennai, Tamil Nadu; Phone: +91 70580 53055; Email: info@hipamasalas.com; Website: https://www.hipamasalas.com/)

Brand Personality: Friendly, helpful, authentic, simple, premium, human, professional. Avoid corporate speak or sounding robotic.
Languages: Clear English, Tamil, and Tanglish (Tamil-English mixing, e.g. "Sambar-ku HIPA Sambar Powder use pannalaam").
Rule: Never invent unconfirmed prices, ingredients, discounts, or health claims. If unsure, offer to connect them with the HIPA team.
Answer Length: Short and direct (1-4 sentences).`;

export function registerChatRoute(app: Express) {
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body || {};
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message is required." });
      }

      const messages = [
        { role: "system", content: HIPA_SYSTEM_PROMPT },
      ];

      if (Array.isArray(history)) {
        for (const m of history) {
          if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string") {
            messages.push({ role: m.role, content: m.content });
          }
        }
      }
      messages.push({ role: "user", content: message.trim() });

      // Keep context length compact
      const MAX_MESSAGES = 16;
      if (messages.length > MAX_MESSAGES) {
        const sys = messages[0];
        const tail = messages.slice(-(MAX_MESSAGES - 1));
        messages.length = 0;
        messages.push(sys, ...tail);
      }

      let reply = "";

      // 1. GOOGLE GEMINI FREE API (Primary)
      if (process.env.GEMINI_API_KEY) {
        try {
          const geminiRes = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gemini-1.5-flash",
                messages,
                temperature: 0.7,
              }),
            }
          );

          if (geminiRes.ok) {
            const data: any = await geminiRes.json();
            reply = data.choices?.[0]?.message?.content?.trim() || "";
          } else {
            console.error("[Gemini API Error]", await geminiRes.text());
          }
        } catch (err) {
          console.error("[Gemini Fetch Error]", err);
        }
      }

      // 2. GROQ FREE API FALLBACK
      if (!reply && process.env.GROQ_API_KEY) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages,
              temperature: 0.7,
              max_tokens: 500,
            }),
          });

          if (groqRes.ok) {
            const data: any = await groqRes.json();
            reply = data.choices?.[0]?.message?.content?.trim() || "";
          }
        } catch (err) {
          console.error("[Groq Fetch Error]", err);
        }
      }

      // 3. ZERO-KEY FALLBACK (POLLINATIONS FREE AI - Works out of the box)
      if (!reply) {
        try {
          const pollinationsRes = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages,
              model: "openai",
            }),
          });

          if (pollinationsRes.ok) {
            reply = (await pollinationsRes.text()).trim();
          }
        } catch (pErr) {
          console.error("[Pollinations Error]", pErr);
        }
      }

      if (!reply) {
        reply =
          "Hi! I'm currently having trouble connecting to the AI assistant. Feel free to contact our team directly at info@hipamasalas.com or +91 70580 53055!";
      }

      return res.json({ reply, role: "assistant" });
    } catch (err) {
      console.error("[/api/chat Error]", err);
      return res.json({
        reply: "I'm having a little trouble right now. Please try again or reach the HIPA team at info@hipamasalas.com / +91 70580 53055.",
        role: "assistant",
      });
    }
  });

  app.get("/api/chat", (_req: Request, res: Response) => {
    res.json({
      name: "HIPA Masalas AI Chatbot API",
      status: "ok",
      provider: process.env.GEMINI_API_KEY ? "Google Gemini Free API" : "Zero-Key Fallback",
    });
  });
}
