import type { Express, Request, Response } from "express";

export const HIPA_SYSTEM_PROMPT = `You are a real human team member at HIPA Masalas in Old Pallavaram, Chennai, Tamil Nadu. Talk warmly, naturally, and wittily to visitors on the official HIPA website like a friendly, helpful colleague chatting on WhatsApp.

IDENTITY & BRAND VALUES:
- Brand Name: HIPA Masalas (Taste of Tradition), a unit of HIPA Enterprises.
- Location: Old Pallavaram, Chennai – 600117, Tamil Nadu.
- Pillars: Traditional stone-ground processing, farm-to-factory quality control, no artificial colours, no unnecessary additives.
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
9. Garlic Podi (Flavorful garlic rice podi)
10. Paruppu Podi (Traditional lentil podi for rice)

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
   - "thank you" / "nandri" -> Respond warmly ("Most welcome! 😊 Happy cooking with HIPA Masalas! Vera edhavadhu help venum-na sollunga!").

4. BUSINESS & B2B BULK ORDERS (HOTELS, RESTAURANTS, CATERERS, DISTRIBUTORS):
   - If user mentions "hotel", "restaurant", "bulk", "50kg", "100kg", "wholesale", "catering", or asks for bulk supply:
     * Immediately acknowledge bulk supply capability ("Super! HIPA Masalas-la hotel, restaurant & commercial bulk orders supply panrom 🏨📦.").
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

async function callGeminiAPI(
  apiKey: string,
  userMessage: string,
  history: Array<{ role: string; content: string }> = []
): Promise<{ reply: string | null; error: string | null }> {
  const candidateModels = Array.from(
    new Set([
      process.env.GEMINI_MODEL,
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash-8b",
    ])
  ).filter(Boolean) as string[];

  const contents = buildGeminiContents(userMessage, history);
  const trimmedContents = contents.slice(-20);

  for (const modelName of candidateModels) {
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

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    }
  }

  return { reply: null, error: "Failed to get response from Gemini API" };
}

function getIntelligentFallback(input: string, history: Array<{ role: string; content: string }> = []): string {
  const msg = input.toLowerCase().trim();
  const lastAssistantMsg = history.filter((h) => h.role === "assistant" || h.role === "model").pop()?.content.toLowerCase() || "";

  // Greetings & Casual Conversation
  if (msg.includes("epdi iruka") || msg.includes("epdi irukinga") || msg.includes("how are you")) {
    return "Nalla iruken 😄 Neenga epdi irukinga? HIPA Masalas website-ku welcome!";
  }

  if (msg === "hi" || msg === "hello" || msg === "hey" || msg === "vanakkam") {
    return "Hey 👋 Welcome to HIPA Masalas! Enna cooking or product help venum?";
  }

  if (msg.includes("saptiya") || msg.includes("saapadu")) {
    return "Naan AI assistant 😄 sapda mudiyadhu! Neenga saptingala?";
  }

  if (msg.includes("thank") || msg.includes("nandri") || msg.includes("thx") || msg === "ok thankyou" || msg === "okay thankyou") {
    return "Most welcome! 😊 Happy cooking with HIPA Masalas! Vera edhavadhu help venum-na sollunga!";
  }

  // Bulk & Commercial Requirements
  if (msg.includes("bulk") || msg.includes("hotel") || msg.includes("wholesale") || msg.includes("catering") || msg.includes("commercial") || msg.includes("supply")) {
    return "Super! HIPA Masalas-la hotel & commercial bulk orders supply panrom 🏨📦. Enna product & monthly quantity venum sollunga! Direct sales contact: +91 70580 53055 / info@hipamasalas.com";
  }

  // Product List
  if (msg.includes("product") || msg.includes("list") || msg.includes("masala") || msg.includes("what do you have")) {
    return "HIPA Masalas offers authentic Sambar Powder, Rasam Powder, Garam Masala, Turmeric, Red Chilli, Thaniya, Seeragam, Pepper, Garlic Podi & Paruppu Podi! Order & product details-ku HIPA team contact: +91 70580 53055 / info@hipamasalas.com";
  }

  // Recipe Guidance
  if (msg.includes("recipe") || msg.includes("sambar epdi") || msg.includes("rasam epdi")) {
    return "Simple-a sollren 😄 HIPA Masalas authentic traditional spices use panni easy-a cook pannalam! Sambar & Rasam powders 50g to 1kg packs-la kidaikudhu.";
  }

  return "Got it! 👍 HIPA Masalas products, recipes, or bulk order details pathi edhavadhu kekka poringala? HIPA team direct contact: +91 70580 53055 / info@hipamasalas.com!";
}

export function registerHipaChatRoute(app: Express) {
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body || {};
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message is required." });
      }

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
        reply: getIntelligentFallback(req.body?.message || "", req.body?.history || []),
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
      name: "HIPA Masalas AI Assistant API",
      status: "ok",
      hasGeminiKey: Boolean(apiKey && apiKey !== "your_free_gemini_api_key_here"),
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });
  });
}
