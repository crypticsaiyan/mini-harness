import type { AgentMessage } from "../provider";
import { generateToolsArray } from "../tool";
import { dispatchTool } from "./dispatch";
import type { LoopInput, LoopOutput } from "./types";

export async function runLoop(input: LoopInput): Promise<LoopOutput> {
  let iterations = 0;
  const messages: Array<AgentMessage> = [...input.messages];

  while (true) {
    console.log("Running loop ", iterations);
    if (iterations >= input.config.maxIterations) {
      return {
        messages,
        stopReason: "max_iterations",
        iterations,
      };
    }

    const completion = await input.complete(messages, generateToolsArray());
    // console.log(messages);
    console.dir(messages, { depth: null });
    messages.push(completion.message);

    const finishReason = completion.finishReason;

    if (finishReason === "tool_calls") {
      if (completion.message.toolCalls) {
        const toolCallResults = await dispatchTool(
          completion.message.toolCalls,
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
    } else if (finishReason === "error") {
      return {
        messages,
        stopReason: "error",
        iterations,
      };
    } else if (finishReason === "stop") {
      return {
        messages,
        stopReason: "completed",
        iterations,
      };
    } else if (finishReason === "length") {
      return {
        messages,
        stopReason: "length",
        iterations,
      };
    } else if (finishReason === "content_filter") {
      return {
        messages,
        stopReason: "content_filter",
        iterations,
      };
    }
    iterations++;
  }
}
