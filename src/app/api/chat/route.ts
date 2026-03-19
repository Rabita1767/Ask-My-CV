import { Ollama } from "ollama";
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { checkGlobalLimit, incrementGlobalCount } from "@/lib/rate-limit";

// Cache CV content to avoid repeated disk reads
let cvContent = "";

export const REJECTION_MESSAGES = [
  "I'm designed to only answer questions about Rabita Amin's professional background and CV. Could you please ask something related to her experience, skills, or projects?",
  "That's outside my knowledge area! I'm here to help with questions about Rabita's professional experience, education, and skills. What would you like to know about her background?",
  "I specialize in discussing Rabita's CV and portfolio. Feel free to ask me about her work experience, technical skills, or any projects she's worked on!",
  "I'm not able to answer that question. I can only provide information about Rabita's professional journey. Is there something specific about her background you'd like to explore?",
];

export const CHAT_CONFIG = {
  strictness: "high", // high, medium, low
  topicWhitelist: [
    "work experience",
    "employment history",
    "education",
    "certifications",
    "technical skills",
    "programming languages",
    "frameworks",
    "tools",
    "projects",
    "professional accomplishments",
    "contact information",
    "availability",
    "professional interests",
    "career goals",
  ],
  topicBlacklist: [
    "general knowledge",
    "personal opinions",
    "tech support",
    "math",
    "current events",
    "news",
    "weather",
    "jokes",
  ],
};

function getCVContent() {
  if (cvContent) return cvContent;
  try {
    const cvPath = path.join(process.cwd(), "Rabita_Amin.md");
    cvContent = fs.readFileSync(cvPath, "utf8");
    return cvContent;
  } catch (error) {
    console.error("Error reading CV file:", error);
    return "CV content not available.";
  }
}

export async function POST(req: Request) {
  try {
    const isRateLimitEnabled = true;
    const dailyLimit = 1000;

    if (isRateLimitEnabled) {
      const { allowed } = checkGlobalLimit(dailyLimit);
      if (!allowed) {
        return NextResponse.json(
          {
            error:
              "Global API limit reached. Please try again later or contact me via email.",
          },
          { status: 429 },
        );
      }
    }

    const { messages } = await req.json();
    const apiKey = process.env.OLLAMA_CLOUD_API_KEY;
    const model = process.env.OLLAMA_MODEL || "gemma3:4b-cloud";

    if (!apiKey) {
      return NextResponse.json(
        { error: "OLLAMA_CLOUD_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const ollama = new Ollama({
      host: process.env.OLLAMA_BASE_URL || "https://ollama.com/api",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const context = getCVContent();

    const systemPrompt = `You are an AI assistant for Rabita Amin's portfolio website. 
Answer questions about her professional background, skills, and experience based on the provided CV.

--- SCOPE (Strictness: ${CHAT_CONFIG.strictness.toUpperCase()}) ---
Whitelisted topics: ${CHAT_CONFIG.topicWhitelist.join(", ")}
Blacklisted topics: ${CHAT_CONFIG.topicBlacklist.join(", ")}

--- REJECTION PROTOCOL ---
If out-of-scope, respond with EXACTLY ONE of these:
${REJECTION_MESSAGES.map((msg) => `- "${msg}"`).join("\n")}

Context (Rabita's CV):
${context}

--- OPERATIONAL INSTRUCTIONS ---
1. Use CV context for accuracy. Tone: professional, helpful, friendly.
2. Keep responses concise. Represent Rabita's professional persona.
3. Suggest 1-2 follow-up questions at the end using: [CTA: Question]

--- FORMATTING GUIDE ---
Use Markdown:
- Headers: ### 🛠️ Technical Skills, ### 💼 Work Experience, etc.
- Skills: **Category**: - Skill 1, - Skill 2
- Highlights: **bold** for tech, *italics* for metrics, \`code\` for terms.
- Structured info: Use tables or horizontal rules (---) when appropriate.`;

    // Truncate message history to the most recent 10 messages to save tokens
    const recentMessages = messages.slice(-10);

    const chatResponse = await ollama.chat({
      model: model,
      messages: [{ role: "system", content: systemPrompt }, ...recentMessages],
      stream: false,
      options: {
        num_ctx: 8192,
      },
    });
    console.log("hbdhsbdshdhsa", chatResponse);
    if (isRateLimitEnabled) {
      incrementGlobalCount();
    }

    return NextResponse.json(chatResponse);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred during the chat request";
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
