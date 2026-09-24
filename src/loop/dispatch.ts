// ToolCall[] => runTool() => ToolMessage[]

import type { ToolCall, ToolMessage } from "../provider";
import { runTool } from "../tool";
import type { ToolContext } from "../tool/types";

export async function dispatchTool(
  toolCalls: ToolCall[],
  ctx: ToolContext,
): Promise<ToolMessage[]> {
  const toolResponse: Array<ToolMessage> = [];
  for (const tool of toolCalls) {
    if (ctx.signal.aborted) {
      toolResponse.push({
        type: "tool",
        toolCallId: tool.toolCallId,
        content: "Error: cancelled by user",
      });
      continue;
    }
    const content = await runTool(tool.name, tool.arguments, ctx);
    toolResponse.push({
      type: "tool",
      toolCallId: tool.toolCallId,
      content,
    });
  }
  return toolResponse;
}
