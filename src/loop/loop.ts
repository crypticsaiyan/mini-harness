import type { AgentMessage } from "../provider";
import { generateToolsArray } from "../tool";
import type { ToolContext } from "../tool/types";
import { dispatchTool } from "./dispatch";
import type { LoopInput, LoopOutput } from "./types";

export async function runLoop(input: LoopInput): Promise<LoopOutput> {
  let iterations = 0;
  let tokensUsed = 0;
  const messages: Array<AgentMessage> = [...input.messages];
  const ctx: ToolContext = input.ctx;

  while (true) {
    if (ctx.signal.aborted) {
      return {
        messages,
        stopReason: "interrupted",
        iterations,
      };
    }
    console.log("Running loop ", iterations);
    if (iterations >= input.config.maxIterations) {
      return {
        messages,
        stopReason: "max_iterations",
        iterations,
      };
    }

    let completion;
    try {
      completion = await input.complete(
        messages,
        generateToolsArray(),
        ctx.signal,
      );
    } catch (error) {
      if (ctx.signal.aborted)
        return { messages, stopReason: "interrupted", iterations };
      throw error;
    }

    tokensUsed += completion.stats.totalTokens;

    // console.log(messages);
    console.dir(messages, { depth: null });
    messages.push(completion.message);

    const finishReason = completion.finishReason;

    if (finishReason === "tool_calls") {
      if (completion.message.toolCalls) {
        const toolCallResults = await dispatchTool(
          completion.message.toolCalls,
          ctx,
        );
        for (const result of toolCallResults) {
          messages.push(result);
        }
      } else {
        return {
          messages,
          stopReason: "error",
          iterations,
        };
      }
    } else if (
      finishReason === "error" ||
      finishReason === "stop" ||
      finishReason === "length" ||
      finishReason === "content_filter"
    ) {
      return {
        messages,
        stopReason: finishReason,
        iterations,
      };
    }
    if (tokensUsed > input.config.maxTokens) {
      return {
        messages,
        stopReason: "max_tokens",
        iterations,
      };
    }
    iterations++;
  }
}
