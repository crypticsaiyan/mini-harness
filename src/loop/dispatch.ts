// ToolCall[] => runTool() => ToolMessage[]

import type { ToolCall, ToolMessage } from "../provider";
import type { Session } from "../session";
import { runTool } from "../tool";

export async function dispatchTool(
  toolCalls: ToolCall[],
  session: Session,
): Promise<ToolMessage[]> {
  const toolResponse: Array<ToolMessage> = [];
  for (const tool of toolCalls) {
    const content = await runTool(tool.name, tool.arguments, session);
    toolResponse.push({
      type: "tool",
      toolCallId: tool.toolCallId,
      content,
    });
  }
  return toolResponse;
}
