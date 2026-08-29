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

async function callGeminiAPI(
  apiKey: string,
  userMessage: string,
  history: Array<{ role: string; content: string }> = []
): Promise<{ reply: string | null; error: string | null }> {
  const primaryModel = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const candidateModels = Array.from(new Set([primaryModel, "gemini-2.5-flash-lite", "gemini-2.5-flash"]));

  console.log(`[Gemini Debug] Has GEMINI_API_KEY: ${Boolean(apiKey)}`);

  for (const modelName of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    console.log(`[Gemini Debug] Attempting Gemini Model: ${modelName}`);

    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const msg of history) {
        if (msg && typeof msg.content === "string" && msg.content.trim()) {
          const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
          contents.push({
            role,
            parts: [{ text: msg.content.trim() }],
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: userMessage.trim() }],
    });

    const trimmedContents = contents.slice(-14);

    const payload = {
      systemInstruction: {
        parts: [{ text: HIPA_SYSTEM_PROMPT }],
      },
      contents: trimmedContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log(`[Gemini Debug] (${modelName}) Response Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data: any = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        if (reply) return { reply, error: null };
      } else {
        const errorText = await response.text();
        console.error(`[Gemini API Error] (${modelName}) Status ${response.status}: ${errorText}`);
        if (errorText.includes("API_KEY_INVALID")) {
          return { reply: null, error: `Invalid GEMINI_API_KEY: ${errorText}` };
        }
      }
    } catch (err: any) {
      console.error(`[Gemini Exception] (${modelName})`, err);
    }
  }

  return { reply: null, error: "Failed to get response from Gemini API" };
}

export function registerChatRoute(app: Express) {
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body || {};
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message is required." });
      }

      let reply: string | null = null;
      const apiKey = process.env.GEMINI_API_KEY;

      // 1. PRIMARY: GOOGLE GEMINI API
      if (apiKey && apiKey !== "your_free_gemini_api_key_here") {
        const result = await callGeminiAPI(apiKey, message, history);
        if (result.reply) {
          reply = result.reply;
        }
      } else {
        console.warn("[Gemini Warning] GEMINI_API_KEY is missing or contains placeholder string!");
      }

      // 2. FALLBACK: GROQ API
      if (!reply && process.env.GROQ_API_KEY) {
        try {
          console.log("[Groq Fallback] Attempting Groq API...");
          const messages = [{ role: "system", content: HIPA_SYSTEM_PROMPT }];
          if (Array.isArray(history)) {
            for (const m of history) {
              if (m && typeof m.content === "string") messages.push({ role: m.role, content: m.content });
            }
          }
          messages.push({ role: "user", content: message.trim() });

          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
              messages,
              temperature: 0.7,
              max_tokens: 500,
            }),
          });

          if (groqRes.ok) {
            const data: any = await groqRes.json();
            reply = data.choices?.[0]?.message?.content?.trim() || null;
          }
        } catch (groqErr) {
          console.error("[Groq Error]", groqErr);
        }
      }

      // 3. ZERO-KEY FALLBACK (Pollinations AI)
      if (!reply) {
        try {
          console.log("[Pollinations Fallback] Attempting zero-key fallback...");
          const messages = [{ role: "system", content: HIPA_SYSTEM_PROMPT }];
          if (Array.isArray(history)) {
            for (const m of history) {
              if (m && typeof m.content === "string") messages.push({ role: m.role, content: m.content });
            }
          }
          messages.push({ role: "user", content: message.trim() });

          const pollinationsRes = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages, model: "openai" }),
          });

          if (pollinationsRes.ok) {
            reply = (await pollinationsRes.text()).trim() || null;
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
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_free_gemini_api_key_here"),
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
    });
  });
}
