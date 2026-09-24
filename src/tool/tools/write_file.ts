import { z } from "zod";
import type { Tool } from "../types";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export const fileWrite: Tool<
  { path: z.ZodString; content: z.ZodString },
  { written: boolean }
> = {
  name: "write_file",
  description:
    "Create a new file and fill it with content. Returns true when a file is created.",
  parameters: z.object({
    path: z.string().describe("path of the new file"),
    content: z.string().describe("content of the new file"),
  }),
  getPermissionKey: ({ path }) => ({ kind: "command", value: path }),
  execute: async ({ path, content }) => {
    try {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, { encoding: "utf-8", flag: "wx" }); // wx: fail with EEXIST if the file already exists (atomic check and create)
      return {
        written: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        if ("code" in error && error.code === "EEXIST") {
          throw new Error(`File already exists: "${path}"`);
        }
        throw new Error(`Error writing file "${path}": ${error.message}`);
      }
      throw new Error(`Error writing file "${path}"`);
    }
  },
};
