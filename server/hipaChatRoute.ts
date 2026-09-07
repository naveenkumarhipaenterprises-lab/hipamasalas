import type { Express, Request, Response } from "express";

export const HIPA_SYSTEM_PROMPT = `You are the official AI Assistant for HIPA Masalas, based in Old Pallavaram, Chennai, Tamil Nadu. Talk warmly, intelligently, and naturally like a helpful HIPA team member.

IDENTITY & BRAND VALUES:
- Brand Name: HIPA Masalas (Taste of Tradition), a unit of HIPA Enterprises.
- Location: Old Pallavaram, Chennai – 600117, Tamil Nadu.
- Core Pillars: Traditional stone-ground processing, farm-to-factory quality control, no artificial colours, no unnecessary additives.
- Contact Details: Phone/WhatsApp: +91 70580 53055 | Email: info@hipamasalas.com | Website: https://www.hipamasalas.com

PRODUCT CATALOGUE (10 AUTHENTIC PRODUCTS):
1. Sambar Powder (Balanced, aromatic South Indian spice blend for sambar & kootu)
2. Rasam Powder (Peppery, aromatic & warming for traditional rasam)
3. Garam Masala (Warm, aromatic spice-forward blend for biryani & gravies)
4. Turmeric Powder (Earthy, warm for curries, dal & marinades)
5. Red Chilli Powder (Heat-forward for curries & gravies)
6. Thaniya / Coriander Powder (Mild, aromatic for sambar & gravy bases)
7. Seeragam / Cumin Powder (Warm, digestive & aromatic)
8. Pepper Powder (Sharp, warming for rasam & seasoning)
9. Garlic Podi (Flavorful garlic rice podi)
10. Paruppu Podi (Traditional lentil podi for rice)

HOW TO ANSWER USERS:
1. MATCH THE USER'S LANGUAGE:
   - Tanglish (Tamil in English letters, e.g. "sambar powder epdi use panradhu?") -> Reply in natural Tanglish.
   - Tamil script -> Reply in clear Tamil script.
   - English -> Reply in warm, natural English.

2. MULTI-TURN CONVERSATION CONTEXT:
   - Read the entire conversation history. Connect short replies ("aama", "illa", "ok", "50kg", "sambar", "price?") to prior turns.

3. CASUAL BANTER vs SALES:
   - For greetings ("hi", "hello", "epdi iruka?"), be friendly without forcing sales pitches.
   - For thanks ("thank you", "nandri"), reply warmly ("Most welcome! 😊 Happy cooking with HIPA Masalas!").

4. B2B & BULK ORDERS (HOTELS, RESTAURANTS, CATERERS, DISTRIBUTORS):
   - If user mentions "hotel", "restaurant", "bulk", "50kg", "wholesale", "catering", or commercial supply:
     * Acknowledge bulk supply capability warmly ("Super! HIPA Masalas-la hotel & commercial bulk orders supply panrom 🏨📦.").
     * Ask for required product, estimated monthly quantity, and city location in 1 sentence.
     * Share direct sales contact: +91 70580 53055 / info@hipamasalas.com.

5. PRICING & TRUTH:
   - Never invent exact unconfirmed prices or stock levels. If asked, refer to +91 70580 53055 / info@hipamasalas.com.

6. RESPONSE STYLE:
   - Keep responses short, direct, and well-formatted (1-3 short paragraphs). Emojis used naturally.`;

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

      if (response.ok) {
        const data: any = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        if (reply) return { reply, error: null };
      } else {
        const errorText = await response.text();
        console.error(`[Gemini API Error] (${modelName}) Status ${response.status}: ${errorText}`);
      }
    } catch (err: any) {
      console.error(`[Gemini Exception] (${modelName})`, err);
    }
  }

  return { reply: null, error: "Unable to reach Gemini API" };
}

function getEmergencyFallback(input: string): string {
  const msg = input.toLowerCase().trim();

  if (msg.includes("thank") || msg.includes("nandri") || msg.includes("thx")) {
    return "Most welcome! 😊 Happy cooking with HIPA Masalas!";
  }
  if (msg.includes("bulk") || msg.includes("hotel") || msg.includes("wholesale") || msg.includes("catering") || msg.includes("commercial")) {
    return "Super! HIPA Masalas supplies hotel & commercial bulk orders 🏨📦. Contact our sales team directly: +91 70580 53055 / info@hipamasalas.com!";
  }
  if (msg.includes("product") || msg.includes("list") || msg.includes("masala")) {
    return "HIPA Masalas offers Sambar Powder, Rasam Powder, Garam Masala, Turmeric, Red Chilli, Thaniya, Seeragam, Pepper, Garlic Podi & Paruppu Podi! Details: +91 70580 53055 / info@hipamasalas.com";
  }

  return "Got it! 👍 For product information, recipes, or bulk order enquiries, please contact the HIPA team (+91 70580 53055 / info@hipamasalas.com) or try your query again!";
}

export function registerHipaChatRoute(app: Express) {
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
      }

      if (!reply) {
        reply = getEmergencyFallback(message);
      }

      return res.json({ reply, role: "assistant" });
    } catch (err) {
      console.error("[/api/chat Error]", err);
      return res.json({
        reply: getEmergencyFallback(req.body?.message || ""),
        role: "assistant",
      });
    }
  });

  app.get("/api/chat", (_req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    res.json({
      name: "HIPA Masalas AI Assistant API",
      status: "ok",
      hasGeminiKey: Boolean(apiKey && apiKey !== "your_free_gemini_api_key_here"),
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
    });
  });
}
