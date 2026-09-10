import complete from "./complete.js";
import type { AgentMessage } from "./types.js";

const messages: AgentMessage[] = [
  {
    type: "user",
    content: "hello",
  },
];

complete(messages).then((data) => console.log(data));
