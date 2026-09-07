import type { Express, Request, Response } from "express";

export const HIPA_SYSTEM_PROMPT = `You are a real human team member at HIPA Masalas in Chennai, Tamil Nadu. Talk naturally, warmly, and wittily to website visitors just like a helpful, friendly colleague chatting on WhatsApp.

CRITICAL HUMAN TALKING RULES:
1. THINK BEFORE YOU TALK:
   - Carefully read the whole conversation history.
   - Figure out what the user is ACTUALLY trying to say right now.
   - If the user sends short replies like "illa", "aama", "hotel", "sambar", "50 kg", "price evlo?", "first one", "venam", interpret it DIRECTLY in relation to what you asked or discussed in the previous turn!
   - Connect the dots across turns naturally. Never answer a message in isolation.

2. ABSOLUTELY NO FAQ / CATALOGUE DUMPS:
   - NEVER list all 10 products with bullet points unless the customer explicitly asks "list your products" or "what masalas do you have?".
   - NEVER sound like a customer service script, database search, or bot menu.
   - Do NOT constantly repeat "Welcome to HIPA Masalas" or "How can I help you today?".

3. CASUAL BANTER IS HUMAN:
   - "hi" / "hey" -> Say a warm, casual hello ("Hey! 👋 Welcome to HIPA! Enna panreenga?").
   - "epdi iruka?" -> "Nalla iruken 😄 Neenga epdi irukinga?"
   - "saptiya?" -> "Naan AI bro 😄 sapda mudiyadhu! Neenga saptingala? Enna special inniku?"
   - "illa" (after saptiya) -> "Aiyo 😄 appo first poi sapdunga! Enna sapda poringa?"
   - "pasikuthu" -> "Aiyo 😄 appo first sapadu dhaan important! Enna sapda poringa?"
   - Only bring up HIPA masalas when food, cooking, recipes, or buying is actually mentioned. Don't force sales pitches into casual banter!

4. BUSINESS & B2B LOGIC:
   - If user mentions "hotel", "restaurant", "50kg", "100kg", "bulk", or "wholesale", talk like a sharp, helpful business manager.
   - Ask for product name, monthly quantity, and city location in a single friendly sentence.
   - If they already mentioned running a hotel, DO NOT ask "Are you a business?".

5. LANGUAGE MATCHING:
   - Tanglish -> Natural Tanglish (Tamil in English letters, e.g. "sambar-ku HIPA Sambar Powder use pannalaam", "nalla iruken 😄").
   - Tamil -> Natural Tamil script.
   - English -> Warm Indian English.
   - Seamlessly handle spelling typos like "saptiyaa", "masla", "epdi", "vnum", "nga", "bro".

HIPA KNOWLEDGE BASE:
- Brand: HIPA Masalas (Taste of Tradition), Chennai, Tamil Nadu (Website: https://www.hipamasalas.com/, Phone/WhatsApp: +91 70580 53055, Email: info@hipamasalas.com).
- 10 Authentic Products: Sambar Powder, Rasam Powder, Garam Masala, Turmeric Powder, Red Chilli Powder, Thaniya (Coriander) Powder, Seeragam (Cumin) Powder, Pepper Powder, Garlic Podi, Paruppu Podi.
- STRICT TRUTH: Never invent exact prices, stock counts, discounts, or health claims. If unconfirmed, say: "Exact price details confirm-ah kidaikadhu 😊 HIPA team (+91 70580 53055) kitta current details check panni guide panren."

RESPONSE STYLE:
- Keep normal conversational responses short and direct (1-3 short paragraphs). Emojis used naturally.`;

function getHipaKnowledgeFallback(input: string, history: Array<{ role: string; content: string }> = []): string {
  const msg = input.toLowerCase().trim();
  const lastAssistantMsg = history.filter(h => h.role === "assistant" || h.role === "model").pop()?.content.toLowerCase() || "";
  const hadHotelContext = history.some(h => (h.content || "").toLowerCase().includes("hotel") || (h.content || "").toLowerCase().includes("shop") || (h.content || "").toLowerCase().includes("restaurant"));

  // Appreciation / Gratitude
  if (msg.includes("thank") || msg.includes("tnx") || msg.includes("nandri") || msg.includes("thx") || msg === "ok thankyou" || msg === "okay thankyou" || msg === "ok thanks") {
    return "Most welcome! 😊 Happy cooking with HIPA Masalas! Vera edhavadhu help venum-na sollunga!";
  }

  // Contextual Short Answers
  if (msg === "illa" || msg === "no") {
    if (lastAssistantMsg.includes("saptingala") || lastAssistantMsg.includes("saptiya")) {
      return "Aiyo 😄 appo first poi sapdunga! Enna sapda poringa?";
    }
    if (lastAssistantMsg.includes("home use")) {
      return "Super 👍 Commercial / Hotel requirement-na bulk supply details share panren!";
    }
    return "Seri 👍 Edhavadhu masala or recipe help venum-na sollunga!";
  }

  if (msg === "aama" || msg === "yes" || msg === "correct" || msg === "seri" || msg === "okay") {
    if (lastAssistantMsg.includes("saptingala")) {
      return "Super 😄 Enna saptinga?";
    }
    return "Super 👍 Next enna details venum sollunga!";
  }

  if (msg === "first one" || msg === "first") {
    return "Sure! Sambar Powder - 🍲 Traditional South Indian flavor. Pack size & price details venuma?";
  }

  if (msg === "second one" || msg === "second") {
    return "Sure! Rasam Powder - 🥣 Comforting authentic Rasam flavour. Pack size details venuma?";
  }

  if (msg === "venam" || msg === "no need") {
    return "Seri 👍 Clear! Vera edhavadhu products or recipe assistance venuma?";
  }

  // Multi-turn continuation
  if (msg === "sambar" || msg === "sambar powder" || msg === "sambar masala") {
    if (hadHotelContext || lastAssistantMsg.includes("hotel")) {
      return "Sure 👍 Hotel use-ku Sambar Powder bulk requirement-aa? Approx quantity evlo venum?";
    }
    return "Nice 😋 Sambar fan ah! HIPA Sambar Powder try pannirukingala? Super flavour kidaikkum!";
  }

  if (msg.includes("50 kg") || msg.includes("50kg") || msg.includes("100kg") || msg.includes("100 kg")) {
    return "Super 👍 50kg bulk requirement recorded. HIPA sales team (+91 70580 53055) direct-a connect pannuvanga!";
  }

  if (msg.includes("chennai") || msg.includes("location") || msg.includes("city")) {
    return "Chennai-la irukinga 👍. Your location note panniten. Bulk order details-ku HIPA sales team direct-a guide pannuvanga!";
  }

  if (msg.includes("enga kedaikum") || msg.includes("where to buy")) {
    return "HIPA Masalas online website (https://www.hipamasalas.com/) moolama and Chennai stores-la available. Direct order-ku Phone/WhatsApp (+91 70580 53055) contact pannalam!";
  }

  // Casual conversation
  if (msg === "hi" || msg === "hello" || msg === "hey") {
    return "Hey 👋 Welcome to HIPA! Enna panreenga?";
  }

  if (msg.includes("epdi iruka") || msg.includes("how are you")) {
    return "Nalla iruken 😄 Neenga epdi irukinga?";
  }

  if (msg.includes("saptiya") || msg.includes("sapdu") || msg.includes("saapadu")) {
    return "Naan AI bro 😄 sapda mudiyadhu! Neenga saptingala?";
  }

  if (msg.includes("naan sapten") || msg.includes("nan sapten") || msg.includes("ate")) {
    return "Super 😄 Enna saptinga?";
  }

  if (msg.includes("hotel vachiruken") || msg.includes("hotel iruku") || msg.includes("enaku hotel iruku")) {
    return "Super 👍 Hotel requirement-ku HIPA bulk supply help pannalam. Enna product venum?";
  }

  if (msg.includes("price evlo") || msg.includes("cost") || msg.includes("evlo")) {
    if (lastAssistantMsg.includes("sambar")) {
      return "Sambar Powder price details available-ah kidaikudhu. Pack size and availability HIPA team (+91 70580 53055) kitta confirm pannalam!";
    }
    return "Which product price venum? 😊 Sambar Powder, Rasam Powder, Garam Masala etc. sollunga.";
  }

  if (msg.includes("masala venum") || msg.includes("masla venum")) {
    return "Sure 😊 Enna type masala venum? Sambar, Rasam, Garam Masala... edhu try panna poringa?";
  }

  if (msg.includes("enna iruku") || msg.includes("products") || msg.includes("list")) {
    return "HIPA Masalas offers authentic Sambar Powder, Rasam Powder, Garam Masala, Turmeric, Red Chilli, Thaniya, Seeragam, Pepper, Garlic Podi & Paruppu Podi. Enna product details venum?";
  }

  if (msg.includes("sambar epdi seiyanum") || msg.includes("recipe")) {
    return "Simple-a sollren 😄 Dal boil panni tamarind extract, vegetables and HIPA Sambar Powder sethu boil pannunga. Ghee-la mustard & curry leaves temper panna traditional sambar ready!";
  }

  if (msg.includes("garam masala")) {
    return "Biryani, kurma and gravies-ku HIPA Garam Masala perfect choice 😋! Rich aromatic taste kidaikkum.";
  }

  if (msg.includes("elon musk")) {
    return "Elon Musk pathi general-a solla mudiyum 😄 but naan principalmente HIPA Masalas & cooking guidance-ku iruken. Enna masala help venum?";
  }

  return "Got it! 👍 HIPA Masalas products, recipes, or bulk orders pathi edhavadhu kekka poringala?";
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
