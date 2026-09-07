import type { Express, Request, Response } from "express";

export const HIPA_SYSTEM_PROMPT = `You are a real human team member at HIPA Masalas in Chennai, Tamil Nadu. You handle customer conversations on the official HIPA Masalas website.

YOUR GENERAL DIRECTION & BEHAVIOR PRINCIPLES:

1. CONVERSATIONAL UNDERSTANDING & CONTEXT MEMORY:
   - Carefully read the FULL conversation history. Always interpret the user's message in relation to prior turns.
   - Effortlessly handle short replies (e.g. "aama", "illa", "ok", "50kg", "sambar", "price evlo?", "first one", "venam") by connecting them to what was previously asked or discussed.
   - Seamlessly understand casual typing, typos, and mixed languages (Tanglish - Tamil in English letters, Tamil script, English).

2. GENERAL QUERY DIRECTIONS (HANDLE ALL TYPES NATURALLY):

   A. CASUAL BANTER & GREETINGS:
      - Respond naturally, warmly, and casually like a friendly team member on WhatsApp ("Hey! 👋 Welcome to HIPA! Enna panreenga?").
      - For casual questions ("epdi iruka?", "saptiya?", "pasikuthu"), reply like a caring human.
      - Do NOT force a product sales pitch into purely casual greetings or banter.

   B. GRATITUDE & CLOSING STATEMENTS:
      - For thanks/appreciation ("thank you", "thanks bro", "nandri", "okay thankyou", "ok thx"), respond warmly: "Most welcome! 😊 Happy cooking with HIPA Masalas! Vera edhavadhu help venum-na sollunga!"

   C. B2B / BULK / HOTEL / COMMERCIAL INQUIRIES:
      - If the user mentions "hotel", "restaurant", "bulk", "50kg", "100kg", "wholesale", "catering", "commercial", or asks for bulk supply:
        * Immediately acknowledge bulk supply capability: "Super! HIPA Masalas-la hotel & commercial bulk orders supply panrom 🏨📦."
        * Ask for required product name, estimated monthly quantity (kg), and city location in one friendly sentence.
        * Share direct sales contact info (+91 70580 53055 / info@hipamasalas.com) so they can reach the team directly.
        * NEVER ask generic home cooking questions like "what are you cooking today?" when a business customer reaches out.

   D. PRODUCT, RECIPE & COOKING GUIDANCE:
      - Answer recipe questions naturally with easy traditional step-by-step guidance.
      - Recommend relevant HIPA products (Sambar Powder, Rasam Powder, Garam Masala, Turmeric Powder, Red Chilli Powder, Thaniya Powder, Seeragam Powder, Pepper Powder, Garlic Podi, Paruppu Podi).
      - NEVER dump the entire product catalogue with bullet points unless explicitly requested ("list all products").

   E. PRICING & STRICT ACCURACY:
      - Never invent exact prices, stock counts, or discounts. If unconfirmed, say: "Exact price details confirm-ah kidaikadhu 😊 HIPA team (+91 70580 53055) kitta current details check panni guide panren."

   F. OFF-TOPIC QUESTIONS:
      - For completely unrelated topics (e.g. "who is elon musk?"), give a brief 1-line answer or politely redirect to HIPA Masalas and cooking guidance.

3. RESPONSE STYLE:
   - Natural, warm, crisp, and direct (1-3 short paragraphs max). Emojis used naturally.
   - Never sound like a hardcoded bot menu, customer service script, or database search output.`;

function getHipaKnowledgeFallback(input: string, history: Array<{ role: string; content: string }> = []): string {
  const msg = input.toLowerCase().trim();

  // Emergency safety fallback when Gemini API network connection fails
  if (msg.includes("thank") || msg.includes("nandri") || msg.includes("thx")) {
    return "Most welcome! 😊 Happy cooking with HIPA Masalas! Vera edhavadhu help venum-na sollunga!";
  }

  if (msg.includes("bulk") || msg.includes("hotel") || msg.includes("wholesale") || msg.includes("catering") || msg.includes("commercial") || msg.includes("supply")) {
    return "Super! HIPA Masalas-la hotel & commercial bulk orders supply panrom 🏨📦. Enna product & monthly quantity venum sollunga! Direct sales team contact: +91 70580 53055 / info@hipamasalas.com";
  }

  if (msg.includes("product") || msg.includes("list") || msg.includes("masala")) {
    return "HIPA Masalas offers Sambar Powder, Rasam Powder, Garam Masala, Turmeric, Red Chilli, Thaniya, Seeragam, Pepper, Garlic Podi & Paruppu Podi! Product & order details-ku HIPA team contact: +91 70580 53055 / info@hipamasalas.com";
  }

  return "Got it! 👍 HIPA Masalas products, recipes, or bulk order details-ku direct-a HIPA team-a contact pannalam (+91 70580 53055 / info@hipamasalas.com) or please try sending your message again!";
}

async function callGeminiAPI(
  apiKey: string,
  userMessage: string,
  history: Array<{ role: string; content: string }> = []
): Promise<{ reply: string | null; error: string | null }> {
  const primaryModel = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const candidateModels = Array.from(new Set([primaryModel, "gemini-2.5-flash-lite", "gemini-2.5-flash"]));

  for (const modelName of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

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

    const trimmedContents = contents.slice(-20);
    console.log(`[Gemini API] Executing ${modelName} | History turns: ${trimmedContents.length} | Prompt: "${userMessage}"`);

    const payload = {
      systemInstruction: {
        parts: [{ text: HIPA_SYSTEM_PROMPT }],
      },
      contents: trimmedContents,
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 500,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log(`[Gemini API] Response status: ${response.status} ${response.statusText}`);

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
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || process.env.GOOGLE_GEMINI_API_KEY;

      if (apiKey && apiKey !== "your_free_gemini_api_key_here") {
        const result = await callGeminiAPI(apiKey, message, history);
        if (result.reply) {
          reply = result.reply;
        }
      } else {
        console.warn("[Gemini Warning] GEMINI_API_KEY is missing or placeholder!");
      }

      // Backup LLM (Groq) if configured
      if (!reply && process.env.GROQ_API_KEY) {
        try {
          console.log("[Groq Backup] Attempting Groq API...");
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
              temperature: 0.75,
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

      // Knowledge Fallback
      if (!reply) {
        reply = getHipaKnowledgeFallback(message, history);
      }

      return res.json({ reply, role: "assistant" });
    } catch (err) {
      console.error("[/api/chat Error]", err);
      return res.json({
        reply: getHipaKnowledgeFallback(req.body?.message || "", req.body?.history || []),
        role: "assistant",
      });
    }
  });

  app.get("/api/chat", (_req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    res.json({
      name: "HIPA Masalas AI Chatbot API",
      status: "ok",
      hasGeminiKey: Boolean(apiKey && apiKey !== "your_free_gemini_api_key_here"),
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
    });
  });
}
