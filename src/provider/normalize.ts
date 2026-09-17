// conversion between sdk types and custom types

import {
  type ChatChoice,
  type ChatFunctionTool,
  type ChatMessages,
  type ChatResult,
  type ChatToolCall,
  type ChatUsage,
} from "@openrouter/sdk/models";

import type {
  AgentMessage,
  AssistantMessage,
  FinishReason,
  ProviderResponse,
  Statistics,
  ToolCall,
  ToolSpec,
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
  const msg = choice.message.content;
  if (choice) {
    return {
      type: "assistant",
      content: typeof msg === "string" ? msg : null,
      toolCalls: normalizeToolCalls(choice.message.toolCalls),
    };
  }
  throw new Error("Invalid message content format");
}

export function normalize(completion: ChatResult): ProviderResponse {
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

export function toSdkMsg(msg: AgentMessage): ChatMessages {
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

export function toSdkTool(tool: ToolSpec): ChatFunctionTool {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  };
}
