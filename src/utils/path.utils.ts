import path from "node:path";

export function resolveSafePath(
  root: string,
  relativePath: string
): string {
  const resolvedRoot = path.resolve(root);

  const resolvedPath = path.resolve(
    resolvedRoot,
    relativePath
  );

  const relative = path.relative(
    resolvedRoot,
    resolvedPath
  );

  const isOutsideRoot =
    relative.startsWith("..") ||
    path.isAbsolute(relative);

  if (isOutsideRoot) {
    throw new Error(
      `Path is outside the allowed workspace: ${relativePath}`
    );
  }

  return resolvedPath;
}