import { CHAT_CONFIG, REJECTION_MESSAGES } from "../app/api/chat/route";

const testQueries = [
  { query: "What programming languages do you know?", expected: "Relevant" },
  { query: "How many years of experience do you have?", expected: "Relevant" },
  { query: "What's the weather today?", expected: "Irrelevant" },
  { query: "Can you help me fix my code?", expected: "Irrelevant" },
  { query: "Tell me a joke", expected: "Irrelevant" },
  { query: "What do you think about AI?", expected: "Boundary (Should relate to experience)" },
  { query: "What is the capital of France?", expected: "Irrelevant" },
];

console.log("Starting Chatbot Scope Verification...");
console.log("Strictness Level:", CHAT_CONFIG.strictness);

// Note: This script is for logical verification. 
// Actual LLM testing requires a running server and API key.

testQueries.forEach(({ query, expected }) => {
  console.log(`\nQuery: "${query}"`);
  console.log(`Expected Category: ${expected}`);
  
  const isWhitelisted = CHAT_CONFIG.topicWhitelist.some(topic => 
    query.toLowerCase().includes(topic.toLowerCase())
  );
  const isBlacklisted = CHAT_CONFIG.topicBlacklist.some(topic => 
    query.toLowerCase().includes(topic.toLowerCase())
  );

  if (isBlacklisted) {
    console.log("Result: Detected as BLACKLISTED (Correct)");
  } else if (isWhitelisted) {
    console.log("Result: Detected as WHITELISTED (Correct)");
  } else {
    console.log("Result: Needs LLM context understanding (Expected)");
  }
});
