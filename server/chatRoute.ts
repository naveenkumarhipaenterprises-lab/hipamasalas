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

function getHipaKnowledgeFallback(input: string): string {
  const msg = input.toLowerCase();

  // Product discovery
  if (msg.includes("product") || msg.includes("list") || msg.includes("range") || (msg.includes("masala") && msg.includes("what"))) {
    return "HIPA Masalas offers 8 authentic spice products inspired by traditional South Indian recipes:\n\n1. 🍲 Sambar Powder\n2. 🥣 Rasam Powder\n3. 🌟 Turmeric Powder\n4. 🌶️ Red Chilli Powder\n5. 🌿 Coriander Powder\n6. 🟤 Cumin Powder\n7. ⚫ Pepper Powder\n8. 🔥 Garam Masala\n\nWhich product would you like to know more about?";
  }

  // Sambar / Recipe (English/Tanglish/Tamil)
  if (msg.includes("sambar") || msg.includes("சாம்பார்")) {
    return "Sambar-ku HIPA Sambar Powder use pannalaam! 🍲\n\n**Quick Step-by-Step Sambar Recipe:**\n1. Boil toor dal with a pinch of HIPA Turmeric Powder until soft.\n2. Boil cooked dal with tamarind extract, salt, and vegetables (drumstick/shallots/brinjal).\n3. Add 1-2 tbsp HIPA Sambar Powder and simmer for 5 mins.\n4. Prepare tadka (mustard seeds, curry leaves, asafoetida in ghee/oil) and pour over sambar.\n\nEnjoy hot with rice or idli! 🍚";
  }

  // Rasam / Recipe
  if (msg.includes("rasam") || msg.includes("ரசம்")) {
    return "For comforting, soothing rasam, use HIPA Rasam Powder! 🥣\n\n**Simple Rasam Recipe:**\n1. Boil tamarind water with tomatoes, crushed garlic, and HIPA Rasam Powder.\n2. Add cooked dal water (optional) and salt; bring to a single froth.\n3. Temper with mustard seeds, cumin, and curry leaves in ghee.\n\nServe hot as a soup or with rice!";
  }

  // B2B / Bulk orders
  if (msg.includes("bulk") || msg.includes("hotel") || msg.includes("restaurant") || msg.includes("catering") || msg.includes("distributor") || msg.includes("wholesale")) {
    return "HIPA Masalas handles bulk and business enquiries for hotels, restaurants, caterers, distributors, and exporters! 🏨\n\nTo help us assist your business requirement, please share:\n1. Your Name & Business Name\n2. City / Location\n3. Required Products & Approximate Monthly Quantity\n\nOur B2B team will get back to you directly!";
  }

  // Contact info
  if (msg.includes("contact") || msg.includes("phone") || msg.includes("email") || msg.includes("number") || msg.includes("address") || msg.includes("location")) {
    return "You can reach the HIPA Masalas team directly at:\n\n📧 **Email:** info@hipamasalas.com\n📞 **Phone:** +91 70580 53055\n📍 **Location:** Chennai, Tamil Nadu, India\n🌐 **Website:** https://www.hipamasalas.com/\n\nFeel free to call or WhatsApp us for instant enquiries!";
  }

  // Default HIPA team member greeting/guidance
  return "Hi! 👋 Welcome to **HIPA Masalas — Taste of Tradition**.\n\nI can help you explore our 8 masala products, guide you with recipes, or process bulk and B2B orders for your business. What are you looking for today?";
}

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
      // Multi-env variable lookup in case user configured an alias in Vercel
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || process.env.GOOGLE_GEMINI_API_KEY;

      // 1. PRIMARY: GOOGLE GEMINI API
      if (apiKey && apiKey !== "your_free_gemini_api_key_here") {
        const result = await callGeminiAPI(apiKey, message, history);
        if (result.reply) {
          reply = result.reply;
        }
      } else {
        console.warn("[Gemini Warning] GEMINI_API_KEY is missing or placeholder!");
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

      // 3. GUARANTEED KNOWLEDGE FALLBACK (Never return an error message to the customer!)
      if (!reply) {
        reply = getHipaKnowledgeFallback(message);
      }

      return res.json({ reply, role: "assistant" });
    } catch (err) {
      console.error("[/api/chat Error]", err);
      return res.json({
        reply: getHipaKnowledgeFallback(req.body?.message || ""),
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
