import { ChatGroq } from "@langchain/groq";

import { env } from "../config/env.js";

export function createModel() {
  return new ChatGroq({
    apiKey: env.GROQ_API_KEY,
    model: env.GROQ_MODEL,
    temperature: 0,
  });
}
