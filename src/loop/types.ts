import type { AgentMessage, ProviderResponse, ToolSpec } from "../provider";
import type { ToolContext } from "../tool/types";

export type CompleteFunc = (
  // generates the next completion
  messages: AgentMessage[],
  tools: ToolSpec[],
  signal: AbortSignal,
) => Promise<ProviderResponse>;

// dependency injecting interfaces for loop

// loop config
export interface LoopConfig {
  maxIterations: number;
  maxTokens: number;
}

// loop input format
export interface LoopInput {
  messages: AgentMessage[];
  complete: CompleteFunc;
  config: LoopConfig;
  ctx: ToolContext;
}

export type StopReason =
  | "stop"
  | "max_iterations"
  | "error"
  | "length"
  | "content_filter"
  | "interrupted"
  | "max_tokens";

// loop output format
export interface LoopOutput {
  messages: AgentMessage[];
  stopReason: StopReason;
  iterations: number;
}
