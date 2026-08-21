import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import {
  resolveSafePath,
} from "../utils/path.utils.js";

const WORKSPACE_ROOT = path.resolve(
  process.cwd(),
  "workspace"
);

export type FileSystemErrorCode =
  | "FILE_NOT_FOUND"
  | "PATH_NOT_ALLOWED"
  | "NOT_A_FILE"
  | "NOT_A_DIRECTORY"
  | "UNKNOWN_ERROR";

export type FileSystemResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: FileSystemErrorCode;
      message: string;
    };

export async function listDirectory(
  relativePath: string
): Promise<FileSystemResult<string[]>> {
  try {
    const absolutePath = resolveSafePath(
      WORKSPACE_ROOT,
      relativePath
    );

    const entries = await readdir(absolutePath, {
      withFileTypes: true,
    });

    return {
      success: true,
      // Stable ordering makes tool output easier for both people and models
      // to scan and produces predictable results across operating systems.
      data: entries
        .map((entry) =>
          entry.isDirectory()
            ? `${entry.name}/`
            : entry.name
        )
        .sort((left, right) => left.localeCompare(right)),
    };
  } catch (error: unknown) {
    return handleFileSystemError(error);
  }
}

export async function readWorkspaceFile(
  relativePath: string
): Promise<FileSystemResult<string>> {
  try {
    const absolutePath = resolveSafePath(
      WORKSPACE_ROOT,
      relativePath
    );

    const content = await readFile(
      absolutePath,
      "utf-8"
    );

    return {
      success: true,
      data: content,
    };
  } catch (error: unknown) {
    return handleFileSystemError(error);
  }
}

function handleFileSystemError<T>(
  error: unknown
): FileSystemResult<T> {
  if (
    error instanceof Error &&
    error.message.startsWith(
      "Path is outside the allowed workspace"
    )
  ) {
    return {
      success: false,
      error: "PATH_NOT_ALLOWED",
      message: error.message,
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const code = String(error.code);

    if (code === "ENOENT") {
      return {
        success: false,
        error: "FILE_NOT_FOUND",
        message:
          "The requested file or directory does not exist.",
      };
    }

    if (code === "EISDIR") {
      return {
        success: false,
        error: "NOT_A_FILE",
        message:
          "The requested path points to a directory, not a file.",
      };
    }

    if (code === "ENOTDIR") {
      return {
        success: false,
        error: "NOT_A_DIRECTORY",
        message:
          "A path segment is not a directory.",
      };
    }
  }

  return {
    success: false,
    error: "UNKNOWN_ERROR",
    message:
      error instanceof Error
        ? error.message
        : "Unknown filesystem error.",
  };
}
