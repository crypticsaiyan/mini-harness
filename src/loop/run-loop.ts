import type { AgentMessage } from "../provider";
import { complete } from "../provider";
import { runLoop } from "./loop";
import type { Session } from "../session";

const messages: AgentMessage[] = [
  {
    type: "system",
    content:
      "You are a coding assistant. Use tools when needed. DO NOT READ CRITICAL FILES LIKE .env",
  },
  {
    type: "user",
    content:
      "create a new folder named test_run and write a file to print hello world in c.",
  },
];

const session: Session = {
  permissions: {
    allowList: [],
    projectRoot: process.cwd(),
  },
};

const result = await runLoop({
  messages,
  complete,
  config: { maxIterations: 10 },
  ctx: {
    session,
    asker: async () => "allow-once",
  },
});

console.log(
  `\nstopReason: ${result.stopReason}, iterations: ${result.iterations}`,
);
