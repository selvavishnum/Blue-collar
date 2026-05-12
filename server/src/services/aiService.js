import OpenAI from "openai";
import { VELAI_BOT_SYSTEM_PROMPT, PROFILE_EXTRACTION_PROMPT } from "../prompts/velaiBot.js";

let openaiClient = null;

function getClient() {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * Send a message to the AI chatbot and get a response.
 * @param {Array} messages - Array of {role, content} objects (full conversation history)
 * @returns {string} - AI response text
 */
export async function getChatResponse(messages) {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: VELAI_BOT_SYSTEM_PROMPT },
      ...messages,
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

/**
 * Extract a structured worker profile JSON from a conversation transcript.
 * @param {Array} messages - Full conversation history
 * @returns {Object} - Parsed worker profile object
 */
export async function extractProfile(messages) {
  const client = getClient();

  // Build a clean transcript string
  const transcript = messages
    .map((m) => `${m.role === "assistant" ? "Bot" : "Worker"}: ${m.content}`)
    .join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: PROFILE_EXTRACTION_PROMPT },
      { role: "user", content: `TRANSCRIPT:\n${transcript}` },
    ],
    max_tokens: 500,
    temperature: 0.1, // Low temp for accurate data extraction
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content.trim();
  return JSON.parse(raw);
}

/**
 * Generate the initial greeting message from the bot.
 * @returns {string}
 */
export async function getInitialGreeting() {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: VELAI_BOT_SYSTEM_PROMPT },
      { role: "user", content: "[START_CONVERSATION]" },
    ],
    max_tokens: 150,
    temperature: 0.8,
  });

  return response.choices[0].message.content.trim();
}
