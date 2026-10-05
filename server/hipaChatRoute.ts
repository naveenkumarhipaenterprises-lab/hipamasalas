import type { Express, Request, Response } from "express";
import { answerLocally } from "./hipaAnswers";

export const HIPA_SYSTEM_PROMPT = `You are a real human team member at HIPA Masala in Old Pallavaram, Chennai, Tamil Nadu. Talk warmly, naturally, and wittily to visitors on the official HIPA website like a friendly, helpful colleague chatting on WhatsApp.

IDENTITY & BRAND VALUES:
- Brand Name: HIPA Masala (Taste of Tradition), a unit of HIPA Enterprises.
- Location: Plot No. 10, (Highway Colony), 5th Main Road, Zamin Pallavaram, Highway Nagar, Perumal Nagar, Old Pallavaram, Chennai – 600117, Tamil Nadu, India.
- Pillars: Whole spices selected and cleaned before milling, controlled low-temperature milling, slow-roasted blends, FSSAI-licensed (Lic. No. 22426423000366), no artificial colours, no unnecessary additives.
- Contact: Phone/WhatsApp: +91 70580 53055 | Email: info@hipamasalas.com | Website: https://www.hipamasalas.com

PRODUCT CATALOGUE:
1. Sambar Powder (Traditional South Indian flavor for sambar, kootu & lentils)
2. Rasam Powder (Peppery, warming & aromatic for South Indian rasam)
3. Garam Masala (Warm & aromatic spice blend for biryani, kurma & gravies)
4. Turmeric Powder (Earthy, vibrant for curries, sambar & marinades)
5. Red Chilli Powder (Heat-forward for gravies & spice bases)
6. Thaniya / Coriander Powder (Mild, aromatic for gravy bases)
7. Seeragam / Cumin Powder (Warm, digestive & aromatic)
8. Pepper Powder (Sharp, warming for rasam & seasoning)
These eight are the only products HIPA Masala makes. In Tamil "podi" simply means powder, so "sambar podi", "rasam podi" or "milagai podi" mean the Sambar, Rasam and Red Chilli Powders above. Rice-mix podis (garlic podi, paruppu podi, idli podi), pastes, pickles and whole spices are not in the range today: say so politely and suggest the closest product above.

HOW TO ANSWER VISITORS (HUMAN TALKING RULES):
1. THINK BEFORE RESPONDING:
   - Read the whole conversation history carefully.
   - Interpret short replies ("aama", "illa", "ok", "50kg", "sambar", "price?", "first one", "venam") DIRECTLY in relation to what was discussed in the previous turn.

2. LANGUAGE MATCHING:
   - Tanglish (Tamil in English letters, e.g. "sambar powder epdi use panradhu?") -> Reply in natural Tanglish.
   - Tamil script -> Reply in clear Tamil script.
   - English -> Reply in warm Indian English.

3. CASUAL BANTER vs SALES:
   - "hi" / "hello" / "epdi iruka?" -> Respond warmly and casually ("Nalla iruken 😄 Neenga epdi irukinga?") without forcing a sales pitch.
   - "thank you" / "nandri" -> Respond warmly ("Most welcome! 😊 Happy cooking with HIPA Masala! Vera edhavadhu help venum-na sollunga!").

4. BUSINESS & B2B BULK ORDERS (HOTELS, RESTAURANTS, CATERERS, DISTRIBUTORS):
   - If user mentions "hotel", "restaurant", "bulk", "50kg", "100kg", "wholesale", "catering", or asks for bulk supply:
     * Immediately acknowledge bulk supply capability ("Super! HIPA Masala-la hotel, restaurant & commercial bulk orders supply panrom 🏨📦.").
     * Ask for required product name, estimated monthly quantity (kg), and city location in 1 single friendly sentence.
     * Share direct sales contact: +91 70580 53055 / info@hipamasalas.com.

5. PRICING & TRUTH:
   - Never invent exact prices or stock counts. Direct users to +91 70580 53055 / info@hipamasalas.com.

6. RESPONSE STYLE:
   - Short, direct, human-like (1-3 short paragraphs max). Use emojis naturally.`;

function buildGeminiContents(
  userMessage: string,
  history: Array<{ role: string; content: string }> = []
): Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> {
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
  const validHistory = (Array.isArray(history) ? history : []).filter(
    (m) => m && typeof m.content === "string" && m.content.trim()
  );

  let startIndex = 0;
  if (validHistory.length > 0) {
    const firstRole = validHistory[0].role;
    if (firstRole === "assistant" || firstRole === "model") {
      startIndex = 1;
    }
  }

  for (let i = startIndex; i < validHistory.length; i++) {
    const m = validHistory[i];
    const role: "user" | "model" = m.role === "assistant" || m.role === "model" ? "model" : "user";
    const text = m.content.trim();

    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += `\n${text}`;
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }

  const currentText = userMessage.trim();
  if (contents.length > 0 && contents[contents.length - 1].role === "user") {
    contents[contents.length - 1] = { role: "user", parts: [{ text: currentText }] };
  } else {
    contents.push({ role: "user", parts: [{ text: currentText }] });
  }

  while (contents.length > 0 && contents[0].role !== "user") {
    contents.shift();
  }

  return contents;
}

const GEMINI_TIMEOUT_MS = 6000; // per attempt
const GEMINI_BUDGET_MS = 7000; // across all attempts, so the serverless function always answers in time

async function callGeminiAPI(
  apiKey: string,
  userMessage: string,
  history: Array<{ role: string; content: string }> = []
): Promise<{ reply: string | null; error: string | null }> {
  // Gemini 1.5 models were retired in 2025; try the configured model, then current Flash models.
  const candidateModels = Array.from(
    new Set([
      process.env.GEMINI_MODEL,
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash",
    ])
  ).filter(Boolean) as string[];

  const contents = buildGeminiContents(userMessage, history);
  const trimmedContents = contents.slice(-20);
  const deadline = Date.now() + GEMINI_BUDGET_MS;

  for (const modelName of candidateModels) {
    const remaining = deadline - Date.now();
    if (remaining < 750) break; // out of time: let the local engine answer
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

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

    // The site runs as a serverless function with a short wall-clock budget, so each attempt is
    // capped; on a timeout the local answer engine replies instead of leaving the visitor waiting.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(GEMINI_TIMEOUT_MS, remaining));
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (response.ok) {
        const data: any = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        if (reply) {
          return { reply, error: null };
        }
      } else {
        const errorText = await response.text();
        console.error(`[Gemini Error] ${modelName} status ${response.status}: ${errorText}`);
      }
    } catch (err: any) {
      console.error(`[Gemini Exception] ${modelName}:`, err);
      if (err?.name === "AbortError") break; // slow upstream: do not burn the budget on a second model
    } finally {
      clearTimeout(timer);
    }
  }

  return { reply: null, error: "Failed to get response from Gemini API" };
}


/**
 * Answer used whenever the hosted model is not available (no key, quota, timeout, error).
 * Delegates to the local answer engine, which reads the live product data and understands
 * English, Tanglish and Tamil questions instead of returning one canned line.
 */
export function getIntelligentFallback(input: string, history: Array<{ role: string; content: string }> = []): string {
  return answerLocally(input, history);
}

export function registerHipaChatRoute(app: Express) {
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history: rawHistory } = req.body || {};
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message is required." });
      }
      const history = Array.isArray(rawHistory) ? rawHistory : [];

      let reply: string | null = null;
      const apiKey =
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_KEY ||
        process.env.GOOGLE_GEMINI_API_KEY ||
        process.env.VITE_GEMINI_API_KEY ||
        process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (apiKey && apiKey !== "your_free_gemini_api_key_here") {
        const result = await callGeminiAPI(apiKey, message, history);
        if (result.reply) {
          reply = result.reply;
        }
      }

      if (!reply) {
        reply = getIntelligentFallback(message, history);
      }

      return res.json({ reply, role: "assistant" });
    } catch (err) {
      console.error("[/api/chat Error]", err);
      return res.json({
        reply: getIntelligentFallback(typeof req.body?.message === "string" ? req.body.message : "", Array.isArray(req.body?.history) ? req.body.history : []),
        role: "assistant",
      });
    }
  });

  app.get("/api/chat", (_req: Request, res: Response) => {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    res.json({
      name: "HIPA Masala AI Assistant API",
      status: "ok",
      hasGeminiKey: Boolean(apiKey && apiKey !== "your_free_gemini_api_key_here"),
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      localEngine: true,
    });
  });
}
