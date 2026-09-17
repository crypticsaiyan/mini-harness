// OpenRouter config

import dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";

dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is not set");
}

export const client = new OpenRouter({
  apiKey,
});

export const MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";
