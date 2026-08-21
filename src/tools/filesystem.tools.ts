import { tool } from "langchain";
import { z } from "zod";

import {
  listDirectory,
  readWorkspaceFile,
} from "../services/filesystem.service.js";

export const listDirectoryTool = tool(
  async ({ path }) => {
    return listDirectory(path);
  },
  {
    name: "list_directory",

    description:
      "List files and folders inside a directory in the frontend project workspace. Use this when you need to inspect project structure or when you do not know the exact file path.",

    schema: z.object({
      path: z
        .string()
        .describe(
          "Directory path relative to the workspace root"
        ),
    }),
  }
);

export const readFileTool = tool(
  async ({ path }) => {
    return readWorkspaceFile(path);
  },
  {
    name: "read_file",

    description:
      "Read the complete text contents of one known file inside the frontend project workspace. Use this only when the exact file path is already known.",

    schema: z.object({
      path: z
        .string()
        .describe(
          "File path relative to the workspace root"
        ),
    }),
  }
);

// Export one shared collection so the model and LangGraph ToolNode always use
// exactly the same tools.
export const filesystemTools = [listDirectoryTool, readFileTool];
