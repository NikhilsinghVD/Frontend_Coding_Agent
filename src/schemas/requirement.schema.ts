import { z } from "zod";

const ambiguitySchema = z.object({
  question: z.string(),
  blocking: z.boolean(),
  reason: z.string(),
});

export const frontendRequirementSchema = z.object({
  featureName: z.string(),

  summary: z.string(),

  framework: z.enum([
    "react",
    "nextjs",
    "unknown",
  ]),

  language: z.enum([
    "typescript",
    "javascript",
    "unknown",
  ]),

  uiLibrary: z.string().nullable(),

  functionalRequirements: z.array(z.string()),

  nonFunctionalRequirements: z.array(z.string()),

  accessibilityRequirements: z.array(z.string()),

  testingRequirements: z.array(z.string()),

  ambiguities: z.array(ambiguitySchema),
});

export type FrontendRequirement =
  z.infer<typeof frontendRequirementSchema>;