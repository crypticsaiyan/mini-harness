// normalize the SDK response types

import {
  type ChatChoice,
  type ChatResult,
  type ChatToolCall,
  type ChatUsage,
} from "@openrouter/sdk/models";

import type {
  AssistantMessage,
  FinishReason,
  ProviderResponse,
  Statistics,
  ToolCall,
} from "./types.js";

// as ChatFinishReasonEnum is an OpenEnum, it can consider unwanted values
function normalizeFinishReason(raw: string | null): FinishReason {
  switch (raw) {
    case "tool_calls":
      return "tool_calls";
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content_filter";
    case "error":
      return "error";
    default:
      throw new Error("Non-standard finish reason");
  }
}

function normalizeStats(usage: ChatUsage | undefined): Statistics {
  if (usage) {
    return {
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
    };
  }
  throw new Error("Error fetching stats");
}

function normalizeToolCalls(raw: ChatToolCall[] | undefined): ToolCall[] {
  let result: ToolCall[] = [];
  if (raw) {
    for (const tool of raw) {
      result.push({
        toolId: tool.id,
        name: tool.function.name,
        arguments: tool.function.arguments,
      });
    }
  }
  return result;
}

function normalizeAssistantMessage(choice: ChatChoice): AssistantMessage {
  if (choice && typeof choice.message.content === "string") {
    return {
      type: "assistant",
      content: choice.message.content,
      toolCalls: normalizeToolCalls(choice.message.toolCalls),
    };
  }
  throw new Error("Invalid message content format");
}

export default function normalize(completion: ChatResult): ProviderResponse {
  const choice = completion.choices[0];
  if (!choice) {
    throw new Error("Did not receive correct response");
  }

  return {
    message: normalizeAssistantMessage(choice),
    finishReason: normalizeFinishReason(choice.finishReason),
    stats: normalizeStats(completion.usage),
  };
}
