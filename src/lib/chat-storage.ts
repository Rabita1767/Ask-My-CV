import { jsPDF } from "jspdf";

/**
 * Chat history persistence utilities using localStorage.
 */

export interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  status?: "sent" | "error";
  metadata?: {
    suggestedQuestions?: string[];
    [key: string]: unknown;
  };
}

const CHAT_HISTORY_KEY = "portfolio_chat_history";
const MAX_MESSAGES = 50;

/**
 * Saves chat history to localStorage, maintaining only the last MAX_MESSAGES.
 */
export const saveChatHistory = (messages: Message[]): void => {
  if (globalThis.window === undefined) return;

  try {
    // Keep only the last MAX_MESSAGES
    const historyToSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(historyToSave));
  } catch (error) {
    console.error("Failed to save chat history:", error);
  }
};

/**
 * Loads chat history from localStorage.
 */
export const loadChatHistory = (): Message[] => {
  if (globalThis.window === undefined) return [];

  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Message[];
  } catch (error) {
    console.error("Failed to load chat history:", error);
    return [];
  }
};

/**
 * Clears chat history from localStorage.
 */
export const clearChatHistory = (): void => {
  if (globalThis.window === undefined) return;
  localStorage.removeItem(CHAT_HISTORY_KEY);
};

/**
 * Exports chat history as a modern PDF file.
 */
export const exportChatHistory = (messages: Message[]): void => {
  if (globalThis.window === undefined) return;

  try {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    let yPosition = 25;

    // --- Header Section ---
    // Background accent for header
    doc.setFillColor(30, 41, 59); // zinc-900 equivalent
    doc.rect(0, 0, pageWidth, 50, "F");

    // Name and Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Rabita Amin", margin, 20);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Software Engineer", margin, 28);

    // Contact Details (Header Right)
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    const contactX = pageWidth - margin;
    doc.text("rabitaamin26@gmail.com", contactX, 15, { align: "right" });
    doc.text("LinkedIn: rabita-amin", contactX, 29, { align: "right" });
    doc.text("GitHub: Rabita1767", contactX, 36, { align: "right" });

    yPosition = 65;

    // --- Content Title ---
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Chat Conversation History", margin, yPosition);

    doc.setDrawColor(59, 130, 246); // blue-500
    doc.setLineWidth(1);
    doc.line(margin, yPosition + 2, margin + 40, yPosition + 2);

    yPosition += 15;

    // --- Messages Section ---
    doc.setFontSize(11);
    messages.forEach((msg) => {
      // Split text first to calculate spacing
      const lines = doc.splitTextToSize(msg.content, maxWidth - 10);
      const messageHeight = lines.length * 6 + 15;

      // Check for page break
      if (yPosition + messageHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 25;

        // Re-add vertical accent line for new page
        doc.setDrawColor(228, 228, 231); // zinc-200
        doc.setLineWidth(0.5);
      }

      // Vertical accent line for message thread
      doc.setDrawColor(228, 228, 231);
      doc.setLineWidth(1);
      doc.line(margin, yPosition, margin, yPosition + messageHeight - 5);

      // Role Label with accent background
      const isUser = msg.role === "user";
      const labelText = isUser ? "YOU" : "AI ASSISTANT";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);

      if (isUser) {
        doc.setTextColor(37, 99, 235); // blue-600
      } else {
        doc.setTextColor(71, 85, 105); // zinc-600
      }

      doc.text(labelText, margin + 5, yPosition);
      yPosition += 6;

      // Message Content
      doc.setTextColor(39, 39, 42); // zinc-800
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 15) {
          doc.addPage();
          yPosition = 25;
        }
        doc.text(line, margin + 5, yPosition);
        yPosition += 6;
      });

      yPosition += 8; // Extra padding between messages
    });

    // --- Footer Section ---
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);

      // Horizontal line above footer
      doc.setDrawColor(240, 240, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      doc.text(
        `Exported on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}  |  Portfolio of Rabita Amin`,
        margin,
        pageHeight - 10,
      );

      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" },
      );
    }

    const exportFileDefaultName = `portfolio_chat_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(exportFileDefaultName);
  } catch (error) {
    console.error("Failed to export chat history:", error);
  }
};
