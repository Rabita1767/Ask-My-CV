"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  X,
  Send,
  User,
  Bot,
  MinusCircle,
  Trash2,
  Download,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  exportChatHistory,
  type Message,
} from "@/lib/chat-storage";
import { checkSessionLimit, recordMessage } from "@/lib/rate-limit";
import { RichMarkdown } from "./chat/RichMarkdown";

const SECTION_QUESTIONS: Record<string, string[]> = {
  hero: [
    "What are your top skills?",
    "Tell me about your background.",
    "What kind of roles are you looking for?",
    "How can I contact you?",
  ],
  experience: [
    "Tell me about your work at BJIT.",
    "What did you build at BJIT as a Software Engineer?",
    "What is the Xamify project you worked on?",
    "Tell me about your backend engineering experience.",
  ],
  skills: [
    "What are your favorite technologies?",
    "Tell me about your experience with Node.js and Express.",
    "How proficient are you with React and Next.js?",
    "What frontend tools do you use?",
  ],
  projects: [
    "Tell me more about SWAPIverse.",
    "What was the most challenging project you worked on?",
    "Tell me about the Image Processor project.",
    "What is LearnWave?",
  ],
  education: [
    "Where did you graduate from?",
    "What was your major in university?",
    "What courses have you taken?",
  ],
};

const DEFAULT_QUESTIONS = [
  "What are your top skills?",
  "Tell me about your BJIT experience.",
  "Which projects have you worked on?",
  "How can I contact Rabita?",
];

interface ChatbotProps {
  isInline?: boolean;
  activeSection?: string;
  onNavigate?: (id: string) => void;
}

// Constants for rate limiting
const MAX_MESSAGES = 20;
const WINDOW_HOURS = 1;
const COOLDOWN_SECONDS = 5;

export default function Chatbot({
  isInline = false,
  activeSection = "hero",
  onNavigate,
}: Readonly<ChatbotProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Rate limiting state
  const [remaining, setRemaining] = useState(MAX_MESSAGES);
  const [cooldown, setCooldown] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const placeholderText = useMemo(() => {
    if (isBlocked) return "Limit reached...";
    if (cooldown > 0) return `Wait ${cooldown}s...`;
    return "Type a message...";
  }, [isBlocked, cooldown]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = useCallback(
    async (text: string = input) => {
      if (!text.trim() || isLoading) return;

      const limitCheck = checkSessionLimit(
        MAX_MESSAGES,
        WINDOW_HOURS,
        COOLDOWN_SECONDS,
      );
      if (!limitCheck.allowed) {
        if (limitCheck.reason === "cooldown") {
          setError(
            `Please wait ${limitCheck.cooldownSeconds} seconds before your next message.`,
          );
        } else {
          setError(
            "You've reached your message limit. Please try again later or email me at rabitaamin26@gmail.com",
          );
        }
        return;
      }

      const userMessage: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setError(null);

      // Record message immediately to update UI count
      recordMessage();
      const updatedLimit = checkSessionLimit(
        MAX_MESSAGES,
        WINDOW_HOURS,
        COOLDOWN_SECONDS,
      );
      setRemaining(updatedLimit.remaining);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            context: { activeSection }, // Pass context to AI
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get response");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        console.error("Chat error:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please check your API key.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, activeSection],
  );

  // Load chat history ONCE on mount
  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }

    if (isInline) {
      setIsOpen(true);
    }
  }, [isInline]); // Runs on mount and if isInline changes

  // 'ask-bot' Event Listener
  useEffect(() => {
    const handleAskBot = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        handleSend(customEvent.detail);
        if (!isInline) setIsOpen(true);
      }
    };

    globalThis.addEventListener("ask-bot", handleAskBot);
    return () => globalThis.removeEventListener("ask-bot", handleAskBot);
  }, [isInline, handleSend]);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage?.role === "assistant" && !isLoading) {
      const content = lastMessage.content.toLowerCase();

      // Experience Highlights
      if (
        content.includes("dutch-bangla") ||
        content.includes("senior officer")
      ) {
        globalThis.dispatchEvent(
          new CustomEvent("highlight-item", {
            detail: { id: "1", type: "experience" },
          }),
        );
      } else if (
        content.includes("bjit") ||
        content.includes("software engineer")
      ) {
        globalThis.dispatchEvent(
          new CustomEvent("highlight-item", {
            detail: { id: "2", type: "experience" },
          }),
        );
      }

      // Project Highlights
      if (
        content.includes("document data extraction") ||
        content.includes("ai document")
      ) {
        globalThis.dispatchEvent(
          new CustomEvent("highlight-item", {
            detail: { id: "1", type: "project" },
          }),
        );
      } else if (content.includes("aws") || content.includes("serverless")) {
        globalThis.dispatchEvent(
          new CustomEvent("highlight-item", {
            detail: { id: "2", type: "project" },
          }),
        );
      } else if (
        content.includes("microservices") ||
        content.includes("banking system")
      ) {
        globalThis.dispatchEvent(
          new CustomEvent("highlight-item", {
            detail: { id: "3", type: "project" },
          }),
        );
      } else if (
        content.includes("portfolio") ||
        content.includes("dashboard")
      ) {
        globalThis.dispatchEvent(
          new CustomEvent("highlight-item", {
            detail: { id: "4", type: "project" },
          }),
        );
      }

      // Skill Highlights
      if (content.includes("ai & data") || content.includes("llm")) {
        globalThis.dispatchEvent(
          new CustomEvent("highlight-item", {
            detail: { id: "ai", type: "skill" },
          }),
        );
      } else if (content.includes("frontend") || content.includes("react")) {
        globalThis.dispatchEvent(
          new CustomEvent("highlight-item", {
            detail: { id: "frontend", type: "skill" },
          }),
        );
      }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Initial and periodic limit check
  useEffect(() => {
    const updateLimits = () => {
      const result = checkSessionLimit(
        MAX_MESSAGES,
        WINDOW_HOURS,
        COOLDOWN_SECONDS,
      );
      setRemaining(result.remaining);

      if (result.reason === "cooldown" && result.cooldownSeconds) {
        setCooldown(result.cooldownSeconds);
      } else {
        setCooldown(0);
      }

      if (!result.allowed && result.reason === "limit_reached") {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    };

    updateLimits();
    const interval = setInterval(updateLimits, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClearChat = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setMessages([]);
    clearChatHistory();
    setShowConfirmDelete(false);
  };

  const handleExportChat = () => {
    exportChatHistory(messages);
  };

  const currentSuggestions = useMemo(() => {
    return SECTION_QUESTIONS[activeSection] || DEFAULT_QUESTIONS;
  }, [activeSection]);

  const chatContainer = (
    <div
      className={cn(
        "flex flex-col h-full overflow-hidden transition-all duration-300 relative",
        !isInline &&
          "bg-zinc-950/90 border border-zinc-800 shadow-2xl rounded-2xl",
        !isInline && isMinimized
          ? "h-14 w-64"
          : !isInline && "h-[500px] w-[350px] md:w-[400px] backdrop-blur-xl",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "p-4 border-b border-zinc-800 flex items-center justify-between",
          isInline ? "bg-zinc-900/30" : "bg-zinc-900/50",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
              <Bot className="text-blue-500" size={20} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-900" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-100 text-sm tracking-tight">
              Rabita&apos;s AI Assistant
            </span>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Sparkles size={10} className="text-blue-400" />
              {remaining} questions left
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportChat}
            disabled={messages.length === 0}
            title="Export Chat"
            className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 disabled:opacity-30"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleClearChat}
            disabled={messages.length === 0}
            title="Clear Chat"
            className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 disabled:opacity-30"
          >
            <Trash2 size={16} />
          </button>
          {!isInline && (
            <>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
              >
                <MinusCircle size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 z-110 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl w-full max-w-[280px] text-center">
              <div className="bg-red-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <h3 className="text-zinc-100 font-semibold mb-2">Clear Chat?</h3>
              <p className="text-zinc-400 text-xs mb-6">
                All messages will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-zinc-100 text-sm font-medium transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(!isMinimized || isInline) && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar">
            {messages.length === 0 && (
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <div className="bg-blue-600/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3 border border-blue-500/10">
                    <Bot className="text-blue-500" size={32} />
                  </div>
                  <h2 className="text-zinc-100 font-bold text-xl mb-2 tracking-tight">
                    Welcome!
                  </h2>
                  <p className="text-zinc-400 text-sm px-8 leading-relaxed">
                    I&apos;m an AI trained on Rabita&apos;s professional
                    background. How can I help you today?
                  </p>
                </div>

                <div className="grid gap-2 pt-4">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold px-1 flex items-center gap-2">
                    <ArrowRight size={10} /> Suggested for you
                  </p>
                  {currentSuggestions.map((q, i) => (
                    <button
                      key={`${q}-${i}`}
                      onClick={() => handleSend(q)}
                      disabled={isBlocked || cooldown > 0}
                      className="group text-sm p-3 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:text-zinc-100 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-left flex items-start gap-3"
                    >
                      <Sparkles
                        size={14}
                        className="text-blue-500/30 group-hover:text-blue-400 shrink-0 mt-0.5"
                      />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={`${m.role}-${i}`}
                className={cn(
                  "flex gap-3 text-sm",
                  m.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                    m.role === "user"
                      ? "bg-zinc-800 border-zinc-700"
                      : "bg-blue-600/10 text-blue-500 border-blue-500/20",
                  )}
                >
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] p-3.5 rounded-2xl shadow-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none",
                  )}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <RichMarkdown
                      content={m.content}
                      onQuickAction={handleSend}
                    />
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Bot className="text-blue-500 animate-pulse" size={14} />
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-red-400 text-xs text-center space-y-2">
                <p>{error}</p>
                {isBlocked && (
                  <a
                    href="mailto:rabitaamin26@gmail.com"
                    className="inline-block underline font-bold hover:text-red-300 transition-colors"
                  >
                    Contact via Email
                  </a>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Context-aware suggestions bar */}
          {messages.length > 0 && !isLoading && (
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                {currentSuggestions.slice(0, 3).map((q, i) => (
                  <button
                    key={`mini-${q}-${i}`}
                    onClick={() => handleSend(q)}
                    disabled={isBlocked || cooldown > 0}
                    className="whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div
            className={cn(
              "p-4 border-t border-zinc-800 bg-zinc-950/50 mt-auto",
              isInline && "pb-6 md:pb-4",
            )}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholderText}
                disabled={isBlocked || cooldown > 0}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl pl-12 pr-14 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 disabled:opacity-50"
              />
              <div className="absolute left-4 text-zinc-500">
                <Bot size={18} />
              </div>
              <button
                type="submit"
                disabled={
                  isLoading || !input.trim() || isBlocked || cooldown > 0
                }
                className="absolute right-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white p-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                {cooldown > 0 ? (
                  <span className="text-[10px] font-bold">{cooldown}</span>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>

            {/* Quick Navigation Toggle */}
            {isInline && onNavigate && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center opacity-60 hover:opacity-100 transition-opacity">
                <p className="w-full text-[9px] text-center text-zinc-600 uppercase tracking-widest font-bold mb-1">
                  Quick Jump
                </p>
                {["projects", "experience", "skills"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onNavigate(s)}
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-md border transition-all capitalize",
                      activeSection === s
                        ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                        : "border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:text-zinc-300",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (isInline) {
    return chatContainer;
  }

  return (
    <div className="fixed bottom-6 right-6 z-100 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4"
          >
            {chatContainer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
