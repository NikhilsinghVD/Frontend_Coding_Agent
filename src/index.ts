import { AIMessage, HumanMessage } from "@langchain/core/messages";

import { createCodingAgentGraph } from "./graphs/coding-agent.graph.js";

const DEFAULT_REQUEST =
  "Inspect demo-react-app and explain what the ProductTable component currently does.";

async function main() {
  // Joining argv lets the user pass a normal multi-word request after `--`.
  const request = process.argv.slice(2).join(" ").trim() || DEFAULT_REQUEST;
  const graph = createCodingAgentGraph();

  console.log(`Request: ${request}\n`);

  const result = await graph.invoke(
    { messages: [new HumanMessage(request)] },
    // Protect against a model repeatedly requesting tools.
    { recursionLimit: 12 },
  );

  const finalMessage = result.messages.at(-1);

  if (!(finalMessage instanceof AIMessage)) {
    throw new Error("The graph finished without an AI response.");
  }

  console.log("Final answer:\n");
  console.log(finalMessage.text);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Application failed:", message);
  process.exitCode = 1;
});
