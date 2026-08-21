import {
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { createModel } from "../models/model.js";

import {
  frontendRequirementSchema,
  type FrontendRequirement,
} from "../schemas/requirement.schema.js";

import {
  REQUIREMENT_ANALYZER_SYSTEM_PROMPT,
} from "../prompts/requirement.prompt.js";

export async function analyzeRequirement(
  request: string
): Promise<FrontendRequirement> {
  const model = createModel();

  const structuredModel =
    model.withStructuredOutput(
      frontendRequirementSchema
    );

  const messages = [
    new SystemMessage(
      REQUIREMENT_ANALYZER_SYSTEM_PROMPT
    ),

    new HumanMessage(request),
  ];

  return structuredModel.invoke(messages);
}