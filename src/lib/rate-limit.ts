/**
 * Rate limiting utilities for the portfolio chatbot.
 * Handles both client-side (session) and server-side (global) checks.
 */

// --- Client-side Session Tracking ---

export interface SessionLimitData {
  count: number;
  lastReset: number;
  lastMessageTime: number;
}

const STORAGE_KEY = 'chat_limit_data';

export const getSessionLimitData = (): SessionLimitData => {
  if (typeof globalThis.window === 'undefined') return { count: 0, lastReset: Date.now(), lastMessageTime: 0 };
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const fresh: SessionLimitData = { count: 0, lastReset: Date.now(), lastMessageTime: 0 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  
  return JSON.parse(stored);
};

export const updateSessionLimitData = (data: SessionLimitData) => {
  if (typeof globalThis.window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * Checks if the user is within their session limits.
 * Returns { allowed: boolean, remaining: number, nextAllowedMessage: number }
 */
export const checkSessionLimit = (
  maxMessages: number,
  windowHours: number,
  cooldownSeconds: number
) => {
  const data = getSessionLimitData();
  const now = Date.now();
  const windowMs = windowHours * 60 * 60 * 1000;
  const cooldownMs = cooldownSeconds * 1000;

  // Reset window if expired
  if (now - data.lastReset > windowMs) {
    data.count = 0;
    data.lastReset = now;
    updateSessionLimitData(data);
  }

  // Check cooldown
  if (now - data.lastMessageTime < cooldownMs) {
    return {
      allowed: false,
      remaining: Math.max(0, maxMessages - data.count),
      cooldownSeconds: Math.ceil((cooldownMs - (now - data.lastMessageTime)) / 1000),
      reason: 'cooldown'
    };
  }

  // Check total count
  if (data.count >= maxMessages) {
    return {
      allowed: false,
      remaining: 0,
      reason: 'limit_reached'
    };
  }

  return {
    allowed: true,
    remaining: maxMessages - data.count,
    reason: null
  };
};

/**
 * Records a successful message count increment.
 */
export const recordMessage = () => {
  const data = getSessionLimitData();
  data.count += 1;
  data.lastMessageTime = Date.now();
  updateSessionLimitData(data);
};

// --- Server-side Global Tracking ---
// Note: In a true serverless environment, this requires a persistent store like Redis.
// This is a simple in-memory implementation that resets on process restart.

let globalDailyCount = 0;
let lastGlobalReset = Date.now();

export const checkGlobalLimit = (dailyLimit: number) => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (now - lastGlobalReset > oneDayMs) {
    globalDailyCount = 0;
    lastGlobalReset = now;
  }

  if (globalDailyCount >= dailyLimit) {
    return { allowed: false };
  }

  return { allowed: true };
};

export const incrementGlobalCount = () => {
  globalDailyCount += 1;
};
