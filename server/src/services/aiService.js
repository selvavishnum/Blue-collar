import { GoogleGenerativeAI } from "@google/generative-ai";
import { VELAI_BOT_SYSTEM_PROMPT, PROFILE_EXTRACTION_PROMPT } from "../prompts/velaiBot.js";

let genAI = null;

function getClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Send a message to the AI chatbot and get a response.
 * @param {Array} messages - Array of {role, content} objects (full conversation history)
 * @returns {string} - AI response text
 */
export async function getChatResponse(messages) {
  const client = getClient();

  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: VELAI_BOT_SYSTEM_PROMPT,
    generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
  });

  // Gemini uses "model" role instead of "assistant"
  // Skip the last message (latest user msg) — it goes into sendMessage
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMsg = messages[messages.length - 1];
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMsg.content);
  return result.response.text().trim();
}

/**
 * Extract a structured worker profile JSON from a conversation transcript.
 * @param {Array} messages - Full conversation history
 * @returns {Object} - Parsed worker profile object
 */
export async function extractProfile(messages) {
  const client = getClient();

  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const transcript = messages
    .map((m) => `${m.role === "assistant" ? "Bot" : "Worker"}: ${m.content}`)
    .join("\n");

  const result = await model.generateContent(
    `${PROFILE_EXTRACTION_PROMPT}\n\nTRANSCRIPT:\n${transcript}`
  );

  return JSON.parse(result.response.text().trim());
}

/**
 * Generate the initial greeting message from the bot.
 * @returns {string}
 */
export async function getInitialGreeting() {
  const client = getClient();

  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: VELAI_BOT_SYSTEM_PROMPT,
    generationConfig: { maxOutputTokens: 150, temperature: 0.8 },
  });

  const result = await model.generateContent("[START_CONVERSATION]");
  return result.response.text().trim();
}
