import type { ToolSpec } from "../provider/index.js";
import { bashTool } from "./tools/bash.js";
import type { Tool } from "./types.js";
import z from "zod";

export const registry: Record<string, Tool<any, unknown>> = {
  bash: bashTool,
};

export function generateToolsArray(): ToolSpec[] {
  let availableTools: ToolSpec[] = [];
  Object.values(registry).forEach((tool) => {
    availableTools.push({
      name: tool.name,
      description: tool.description,
      parameters: z.toJSONSchema(tool.parameters),
    });
  });
  return availableTools;
}

export async function runTool(name: string, args: string): Promise<string> {
  const tool = registry[name];

  if (!tool) {
    return `Error: unknown tool "${name}"`;
  }

  let jsonParsed: unknown;
  try {
    jsonParsed = JSON.parse(args);
  } catch {
    return `Error: malformed JSON arguments for tool "${name}": ${args}`;
  }

  const parsedArgs = tool.parameters.safeParse(jsonParsed);
  if (!parsedArgs.success) {
    return `Error: invalid arguments for tool "${name}": ${parsedArgs.error.message}`;
  }

  try {
    const run = await tool.execute(parsedArgs.data);
    return JSON.stringify(run);
  } catch (error) {
    const message = error instanceof Error ? error.message : error;
    return `Error: tool "${name}" failed: ${message}`;
  }
}
