import { describe, expect, it } from "vitest";
import { answerLocally, detectIntents, detectProducts, detectTanglish, normalise, previousTurns } from "./hipaAnswers";
import { products, siteIdentity } from "../shared/hipaContent";

const ask = (message: string, history: Array<{ role: string; content: string }> = []) => answerLocally(message, history);

/** Builds the history exactly as the website sends it: earlier turns plus the message being asked. */
const conversation = (...questions: string[]) => {
  const history: Array<{ role: string; content: string }> = [];
  for (const question of questions.slice(0, -1)) {
    history.push({ role: "user", content: question });
    history.push({ role: "assistant", content: answerLocally(question, [...history, { role: "user", content: question }]) });
  }
  const current = questions[questions.length - 1];
  return { current, history: [...history, { role: "user", content: current }] };
};
const askInConversation = (...questions: string[]) => {
  const { current, history } = conversation(...questions);
  return answerLocally(current, history);
};

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

  it("does not mistake everyday ingredients in a product question for products we do not make", () => {
    const notInRange = /isn't in the HIPA range|aren't in the HIPA range/;
    for (const message of ["does sambar powder contain dal", "rasam powder la salt irukka?", "sambar powder for rice", "how much oil should i add to the sambar"]) {
      expect(ask(message), message).not.toMatch(notInRange);
    }
    expect(ask("does sambar powder contain dal")).toContain("Fenugreek");
    expect(ask("rasam powder la salt irukka?")).toContain("Rasam Powder");
    expect(ask("do you have whole spices like cardamom")).toMatch(notInRange);
    expect(ask("do you sell pickles")).toMatch(/Pickles aren't in the HIPA range/);
  });

  it("treats a missing order as a complaint, not as a new order", () => {
    for (const message of ["I haven't received my order", "where is my order", "order placed last week still not received"]) {
      const answer = ask(message);
      expect(answer, message).toMatch(/sorry/i);
      expect(answer, message).not.toContain("orders are taken directly");
    }
  });

  it("reads 'enna irukku' after a product as an ingredients question", () => {
    const answer = ask("Garam masala la enna enna irukku?");
    expect(answer).toContain("Ingredients:");
    expect(answer).not.toContain("8 products");
  });

  it("does not state policies the website does not", () => {
    const unsupported = /stockist|supermarket|UPI|next working day|two to three months|no fixed minimum|samples? (?:are|for trade buyers are) arranged/i;
    for (const message of ["where can I buy your masala?", "how long can I store turmeric powder", "what are your timings", "payment options?", "talk to a human", "minimum order quantity for distributors", "can I get samples for my shop"]) {
      expect(ask(message), message).not.toMatch(unsupported);
    }
    expect(ask("how to use rasam powder")).not.toMatch(/teaspoons? of Rasam Powder/);
    expect(ask("how do I cook with your powders")).toContain("1 tablespoon of Rasam Powder");
  });
});

describe("short follow-ups use the previous turn", () => {
  it("drops the website's copy of the current message from the history", () => {
    const turns = previousTurns([{ role: "user", content: "hi" }, { role: "assistant", content: "Hello" }, { role: "user", content: " price? " }], "price?");
    expect(turns).toEqual([{ role: "user", content: "hi" }, { role: "assistant", content: "Hello" }]);
    expect(previousTurns([{ role: "user", content: "price?" }], "price?")).toEqual([]);
  });

  it("carries the product into a one-word price question", () => {
    const answer = askInConversation("tell me about cumin powder", "price?");
    expect(answer).toContain("Cumin Powder");
    expect(answer).toContain(siteIdentity.phone);
  });

  it("carries the question onto a one-word product reply", () => {
    const answer = askInConversation("what pack sizes do you have for", "pepper");
    expect(answer).toContain("Pepper Powder");
    expect(answer).toContain("50g");
  });

  it("treats a bare quantity as a bulk follow-up and keeps the product", () => {
    expect(askInConversation("bulk supply for my hotel", "50kg")).toContain("quantity: 50kg");
    const answer = askInConversation("I need rasam powder for my restaurant", "50kg");
    expect(answer).toContain("quantity: 50kg");
    expect(answer).toContain("Rasam Powder");
  });

  it("does not carry a product the visitor never named out of a generic answer", () => {
    const answer = askInConversation("do you sponsor television programmes", "ok what is the price");
    expect(answer).not.toContain("Sambar Powder");
    expect(answer).toContain(siteIdentity.phone);
  });

  it("survives a malformed history instead of throwing", () => {
    expect(() => answerLocally("price?", "nonsense" as unknown as [])).not.toThrow();
    expect(() => answerLocally("price?", { role: "user" } as unknown as [])).not.toThrow();
    expect(answerLocally("hi", [null, 5, { role: "model" }, { role: "user", content: 7 }] as unknown as [])).toMatch(/welcome|assistant/i);
    expect(answerLocally(undefined as unknown as string, [])).toContain("HIPA Masala");
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
