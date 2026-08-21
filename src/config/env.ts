import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1),
  // Keep the model configurable because hosted model IDs are deprecated over
  // time. This default is Groq's recommended 120B replacement for Llama 3.3.
  GROQ_MODEL: z.string().min(1).default("openai/gpt-oss-120b"),
});

export const env = envSchema.parse(process.env);
