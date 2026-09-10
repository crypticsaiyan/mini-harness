// Need to know when:
// 1) Response from the provider
// 2) Agent message (Tool result/ text)
// 3) Tool calls requested by the provider

export type ToolCall = {
  toolId: string;
  name: string;
  arguments: string;
};

export type FinishReason =
  | "tool_calls"
  | "stop"
  | "length"
  | "content_filter"
  | "error";

export type Statistics = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type ProviderResponse = {
  message: AssistantMessage;
  finishReason: FinishReason;
  stats: Statistics;
};

export type UserMessage = {
  type: "user";
  content: string;
};

export type SystemMessage = {
  type: "system";
  content: string;
};

// previous provider response
export type AssistantMessage = {
  type: "assistant";
  content: string;
  toolCalls?: ToolCall[];
};

export type ToolMessage = {
  type: "tool";
  toolCallId: string;
  content: string;
};

export type AgentMessage =
  | UserMessage
  | SystemMessage
  | AssistantMessage
  | ToolMessage;
