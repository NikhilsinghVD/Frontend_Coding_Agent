import type {
  FrontendRequirement,
} from "../schemas/requirement.schema.js";

export function hasBlockingAmbiguities(
  requirement: FrontendRequirement
): boolean {
  return requirement.ambiguities.some(
    (ambiguity) => ambiguity.blocking
  );
}