import type { AgentMessage } from "../provider";
import { complete } from "../provider";
import { runLoop } from "./loop";

const messages: AgentMessage[] = [
  {
    type: "system",
    content:
      "You are a coding assistant. Use tools when needed. DO NOT READ CRITICAL FILES LIKE .env",
  },
  {
    type: "user",
    content: "what is the content of package.json?",
  },
];

const result = await runLoop({
  messages,
  complete,
  config: { maxIterations: 5 },
});

console.log(
  `\nstopReason: ${result.stopReason}, iterations: ${result.iterations}`,
);
