import { client, MODEL } from "./client.ts";
import normalize from "./normalize.ts";

const completion = await client.chat.send({
  chatRequest: {
    model: MODEL,
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?",
      },
    ],
  },
});

if (completion instanceof ReadableStream) {
  throw new Error("Expected a non-streaming response");
}

console.log(normalize(completion));
