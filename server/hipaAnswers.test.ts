import { describe, expect, it } from "vitest";
import { answerLocally, detectIntents, detectProducts, detectTanglish, normalise } from "./hipaAnswers";
import { products, siteIdentity } from "../shared/hipaContent";

const ask = (message: string, history: Array<{ role: string; content: string }> = []) => answerLocally(message, history);

describe("local chat answers differ by question", () => {
  it("gives distinct answers to distinct everyday questions", () => {
    const questions = [
      "hi",
      "what products do you have?",
      "sambar powder price",
      "where can I buy your masala?",
      "do you deliver to Bangalore?",
      "what pack sizes do you have",
      "ingredients of garam masala",
      "how to use rasam powder",
      "how long can I store turmeric powder",
      "I need 50kg sambar powder for my hotel every month",
      "contact number",
      "where are you located",
      "what are your timings",
      "do you have fssai licence",
      "tell me about hipa",
      "do you have garlic podi",
      "any job openings",
      "the pack I bought was damaged",
    ];
    const answers = questions.map((question) => ask(question));
    expect(new Set(answers).size).toBe(questions.length);
    for (const answer of answers) expect(answer.length).toBeGreaterThan(40);
  });

  it("does not fall back to one generic line for an unknown question", () => {
    const a = ask("do you sponsor television programmes");
    const b = ask("will you be at the trade fair next month");
    expect(a).not.toBe(b);
    expect(a).toContain("sponsor television programmes");
    expect(b).toContain("trade fair next month");
  });
});

describe("product and intent detection", () => {
  it("recognises products in English, Tamil and Hindi spellings", () => {
    expect(detectProducts(normalise("manjal thool irukka")).map((p) => p.slug)).toEqual(["turmeric-powder"]);
    expect(detectProducts(normalise("jeera powder and dhania powder")).map((p) => p.slug).sort()).toEqual(["coriander-powder", "cumin-powder"]);
    expect(detectProducts(normalise("milagai thool price")).map((p) => p.slug)).toEqual(["red-chilli-powder"]);
    expect(detectProducts(normalise("garam masala"))).toHaveLength(1);
    expect(detectProducts(normalise("masala list"))).toHaveLength(0);
  });

  it("separates look-alike intents", () => {
    expect(detectIntents(normalise("where can i buy sambar powder near me"))).toContain("buy");
    expect(detectIntents(normalise("where can i buy sambar powder near me"))).not.toContain("location");
    expect(detectIntents(normalise("where are you located"))).toContain("location");
    expect(detectIntents(normalise("what is your fssai number"))).toContain("quality");
    expect(detectIntents(normalise("what is your fssai number"))).not.toContain("contact");
    expect(detectIntents(normalise("which store sells it"))).not.toContain("storage");
  });

  it("understands product names and questions written in Tamil script", () => {
    expect(detectProducts(normalise("மிளகாய் தூள் விலை என்ன")).map((p) => p.slug)).toEqual(["red-chilli-powder"]);
    expect(detectIntents(normalise("மிளகாய் தூள் விலை என்ன"))).toContain("price");
    expect(ask("சாம்பார் பொடி எங்கே கிடைக்கும்")).toContain("Sambar Powder");
    expect(ask("is sambar powder spicy")).toMatch(/mild-to-medium/i);
  });

  it("detects Tanglish and Tamil script", () => {
    expect(detectTanglish("sambar powder epdi use panradhu?")).toBe(true);
    expect(detectTanglish("சாம்பார் பொடி விலை")).toBe(true);
    expect(detectTanglish("How much is the sambar powder?")).toBe(false);
  });
});

describe("answers stay truthful to the site data", () => {
  it("never quotes a price", () => {
    for (const message of ["sambar powder price", "how much is garam masala", "rate for 1kg turmeric", "evlo?"]) {
      const answer = ask(message);
      expect(answer).not.toMatch(/₹\s?\d|\brs\.?\s?\d/i);
      expect(answer).toContain(siteIdentity.phone);
    }
  });

  it("quotes each product's own pack sizes", () => {
    for (const product of products) {
      const answer = ask(`${product.name} pack sizes`);
      for (const size of product.packSizes) expect(answer).toContain(size);
    }
    expect(ask("pepper powder pack sizes")).toContain("50g");
    expect(ask("sambar powder pack sizes")).not.toContain("50g");
  });

  it("lists exactly the eight products and no retired ones", () => {
    const answer = ask("what products do you have?");
    for (const product of products) expect(answer).toContain(product.name);
    expect(answer).not.toMatch(/podi/i);
  });

  it("explains what is not in the range and suggests the closest product", () => {
    const answer = ask("do you sell garlic podi?");
    expect(answer).toMatch(/isn't in the HIPA range|aren't in the HIPA range/);
    expect(answer).toContain("Red Chilli Powder");
  });

  it("uses the product page ingredients", () => {
    const answer = ask("what is in your sambar powder");
    expect(answer).toContain("Fenugreek");
    expect(answer).toContain("no artificial colours");
  });

  it("points bulk buyers to the team with the right details", () => {
    const answer = ask("I run a restaurant and need 100kg rasam powder monthly");
    expect(answer).toContain("quantity: 100kg");
    expect(answer).toContain("Rasam Powder");
    expect(answer).toContain(siteIdentity.gstin);
  });

  it("gives the address and map for location questions", () => {
    const answer = ask("enga irukinga");
    expect(answer).toContain("Zamin Pallavaram");
    expect(answer).toContain("google.com/maps");
  });
});

describe("short follow-ups use the previous turn", () => {
  it("carries the product into a one-word price question", () => {
    const history = [
      { role: "user", content: "tell me about cumin powder" },
      { role: "assistant", content: ask("tell me about cumin powder") },
    ];
    const answer = ask("price?", history);
    expect(answer).toContain("Cumin Powder");
    expect(answer).toContain(siteIdentity.phone);
  });

  it("carries the question onto a one-word product reply", () => {
    const history = [
      { role: "user", content: "what pack sizes do you have for" },
      { role: "assistant", content: ask("what pack sizes do you have for") },
    ];
    const answer = ask("pepper", history);
    expect(answer).toContain("Pepper Powder");
    expect(answer).toContain("50g");
  });

  it("treats a bare quantity as a bulk follow-up", () => {
    const history = [
      { role: "user", content: "bulk supply for my hotel" },
      { role: "assistant", content: ask("bulk supply for my hotel") },
    ];
    expect(ask("50kg", history)).toContain("quantity: 50kg");
  });

  it("answers small talk warmly without a sales pitch", () => {
    expect(ask("epdi iruka bro?")).toContain("Nalla iruken");
    expect(ask("thanks")).toMatch(/welcome/i);
    expect(ask("hi")).not.toContain("Pack sizes:");
  });

  it("replies in Tanglish when asked in Tanglish", () => {
    expect(ask("sambar powder vilai evlo")).toMatch(/pannunga|sollunga|kelunga/);
    expect(ask("How much is sambar powder")).not.toMatch(/pannunga/);
  });
});
