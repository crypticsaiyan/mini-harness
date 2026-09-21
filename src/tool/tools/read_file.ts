import { readFile } from "node:fs/promises";
import z from "zod";
import type { Tool } from "../types";

const DEFAULT_LIMIT = 2000;

export const fileRead: Tool<
  {
    path: z.ZodString;
    offset: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
  },
  { content: string; totalLines: number; truncated: boolean }
> = {
  name: "readFile",
  description:
    "Read a file's content, optionally starting at a line offset with a limit",
  parameters: z.object({
    path: z.string().describe("path of the file"),
    offset: z
      .number()
      .describe("line offset to start reading from (default 0)")
      .optional(),
    limit: z
      .number()
      .describe(`number of lines to show (default ${DEFAULT_LIMIT})`)
      .optional(),
  }),
  execute: async ({ path, offset = 0, limit = DEFAULT_LIMIT }) => {
    try {
      const content = await readFile(path, "utf-8");
      const lines = content.split("\n");
      const output = lines.slice(offset, offset + limit).join("\n");
      return {
        content: output,
        totalLines: lines.length,
        truncated: offset + limit < lines.length,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error reading file "${path}": ${error.message}`);
      }
      throw new Error(`Error reading file "${path}"`);
    }
  },
};
