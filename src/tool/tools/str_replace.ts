import { z } from "zod";
import type { Tool } from "../types";
import { readFile, writeFile } from "node:fs/promises";

export const strReplace: Tool<
  { path: z.ZodString; oldString: z.ZodString; newString: z.ZodString },
  { replaced: boolean }
> = {
  name: "str_replace",
  description:
    "Replace a unique value of oldString with newString in a file. Fails if oldString appears zero or multiple times.",
  parameters: z.object({
    path: z.string().describe("path to the file to edit"),
    oldString: z
      .string()
      .describe("exact text to find, must be unique in the file"),
    newString: z.string().describe("text to replace it with"),
  }),
  execute: async ({ path, oldString, newString }) => {
    try {
      let content = "";

      content = await readFile(path, "utf-8");

      const count = content.split(oldString).length - 1;

      if (count === 0) {
        throw new Error("no string found");
      } else if (count > 1) {
        throw new Error(`string found ${count} times, add more context`);
      }
      if (oldString === newString) {
        throw new Error("both the new and the old string are the same");
      }

      const updated = content.replace(oldString, newString);
      await writeFile(path, updated, "utf-8");

      return {
        replaced: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error while replacing in "${path}": ${error.message}`);
      }
      throw new Error(`Error while replacing in "${path}`);
    }
  },
};
