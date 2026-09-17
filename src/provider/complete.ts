import { client, MODEL } from "./client.js";
import { normalize, toSdkMsg, toSdkTool } from "./normalize.js";
import type { AgentMessage, ProviderResponse, ToolSpec } from "./types.js";

export async function complete(
  messages: AgentMessage[],
  tools: ToolSpec[] = [],
): Promise<ProviderResponse> {
  const completion = await client.chat.send({
    chatRequest: {
      model: MODEL,
      messages: messages.map(toSdkMsg),
      tools: tools.map(toSdkTool),
      stream: false,
    },
  });

  if (completion instanceof ReadableStream) {
    throw new Error("Expected a non-streaming response");
  }

  return normalize(completion);
}
