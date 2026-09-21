import type { AgentMessage, ProviderResponse, ToolSpec } from "../provider";

export type CompleteFunc = (
  // generates the next completion
  messages: AgentMessage[],
  tools: ToolSpec[],
) => Promise<ProviderResponse>;

// dependency injecting interfaces for loop

// loop config
export interface LoopConfig {
  maxIterations: number;
}

// loop input format
export interface LoopInput {
  messages: AgentMessage[];
  complete: CompleteFunc;
  config: LoopConfig;
}

export type StopReason =
  "completed" | "max_iterations" | "error" | "length" | "content_filter";

// loop output format
export interface LoopOutput {
  messages: AgentMessage[];
  stopReason: StopReason;
  iterations: number;
}
