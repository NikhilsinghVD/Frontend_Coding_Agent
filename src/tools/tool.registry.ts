import {
  listDirectoryTool,
  readFileTool,
} from "./filesystem.tools.js";

// Registry maps tool names to actual LangChain tool objects.
// Later we can add many more tools here without changing agent logic.
export const toolRegistry = {
  list_directory: listDirectoryTool,
  read_file: readFileTool,
} as const;

//Important note: as const keeps the keys as exact literal types instead of widening them to generic string.