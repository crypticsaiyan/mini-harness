// ToolCall[] => runTool() => ToolMessage[]

import type { ToolCall, ToolMessage } from "../provider";
import { runTool } from "../tool";

export async function dispatchTool(
  toolCalls: ToolCall[],
): Promise<ToolMessage[]> {
  const toolResponse: Array<ToolMessage> = [];
  for (const tool of toolCalls) {
    const content = await runTool(tool.name, tool.arguments);
    toolResponse.push({
      type: "tool",
      toolCallId: tool.toolCallId,
      content,
    });
  }
  return toolResponse;
}
