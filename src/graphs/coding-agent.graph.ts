import { SystemMessage } from "@langchain/core/messages";
import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import {
  ToolNode,
  toolsCondition,
} from "@langchain/langgraph/prebuilt";

import { createModel } from "../models/model.js";
import { CODING_AGENT_SYSTEM_PROMPT } from "../prompts/coding-agent.prompt.js";
import { filesystemTools } from "../tools/filesystem.tools.js";

/**
 * Builds the coding agent as a small LangGraph state machine.
 *
 * Flow: START -> agent -> tools -> agent ... -> END
 * The model chooses whether it needs a tool. Tool results are appended to the
 * shared message state, so the next model call can reason over real file data.
 */
export function createCodingAgentGraph() {
  const modelWithTools = createModel().bindTools(filesystemTools);
  const toolNode = new ToolNode(filesystemTools);

  const callAgent = async (state: typeof MessagesAnnotation.State) => {
    // The system message is supplied on every model call but is not stored in
    // graph state. This keeps the caller-facing history focused on the run.
    const response = await modelWithTools.invoke([
      new SystemMessage(CODING_AGENT_SYSTEM_PROMPT),
      ...state.messages,
    ]);

    return { messages: [response] };
  };

  return new StateGraph(MessagesAnnotation)
    .addNode("agent", callAgent)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    // If the model requested tools, run them. Otherwise the answer is final.
    .addConditionalEdges("agent", toolsCondition, ["tools", END])
    .addEdge("tools", "agent")
    .compile();
}
