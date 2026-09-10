import type { ChatFunctionTool, ChatMessages } from "@openrouter/sdk/models";
import { client, MODEL } from "./client.ts";
import normalize from "./normalize.ts";
import type { AgentMessage, ProviderResponse } from "./types.js";

function toSdkMsg(msg: AgentMessage): ChatMessages {
  switch (msg.type) {
    case "user":
    case "system":
      return {
        role: msg.type,
        content: msg.content,
      };
    case "assistant":
      return {
        role: "assistant",
        content: msg.content,
        toolCalls: msg.toolCalls?.map((tc) => ({
          id: tc.toolId,
          type: "function",
          function: {
            name: tc.name,
            arguments: tc.arguments,
          },
        })),
      };
    case "tool":
      return {
        role: "tool",
        toolCallId: msg.toolCallId,
        content: msg.content,
      };
  }
}

export default async function complete(
  messages: AgentMessage[],
  tools: ChatFunctionTool[] = [],
): Promise<ProviderResponse> {
  const completion = await client.chat.send({
    chatRequest: {
      model: MODEL,
      messages: messages.map(toSdkMsg),
      tools,
      stream: false,
    },
  });

  if (completion instanceof ReadableStream) {
    throw new Error("Expected a non-streaming response");
  }

  return normalize(completion);
}
