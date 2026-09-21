import type { Tool } from "../types";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import z from "zod";

export const bashTool: Tool<
  { command: z.ZodString },
  { stdout: string; stderr: string }
> = {
  name: "bash",
  description: "use the bash shell",
  parameters: z.object({
    command: z.string().describe("command to execute in bash"),
  }),
  execute: async ({ command }) => {
    try {
      const execAsync = promisify(exec);
      return await execAsync(command);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Bash execution failed: ${error.message}`);
      }
      throw new Error("Bash execution failed");
    }
  },
};
