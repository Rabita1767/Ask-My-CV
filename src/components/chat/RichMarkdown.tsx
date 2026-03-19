"use client";

import React, { useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuickAction } from "./QuickAction";
import { cn } from "@/lib/utils";

interface RichMarkdownProps {
  content: string;
  onQuickAction?: (message: string) => void;
}

const MarkdownComponents = (onQuickAction?: (message: string) => void): Components => ({
  h3: ({ children }) => {
    const text = React.Children.toArray(children).join("");
    const hasEmoji = text.includes("🛠️") || text.includes("💼") || text.includes("📁") || text.includes("🎓");
    return (
      <h3 className={cn(
        "text-lg font-bold text-zinc-100 mt-6 mb-2 flex items-center gap-2",
        !hasEmoji && "mt-4"
      )}>
        {children}
      </h3>
    );
  },
  h4: ({ children }) => <h4 className="text-md font-bold text-white mt-4 mb-2">{children}</h4>,
  p: ({ children }) => {
    const text = React.Children.toArray(children).join("");
    
    if (text.startsWith("[CTA:") && text.endsWith("]")) {
      const label = text.slice(5, -1).trim();
      return <QuickAction label={label} onClick={(msg) => onQuickAction?.(msg)} />;
    }
    
    return <p className="leading-relaxed mb-4 last:mb-0">{children}</p>;
  },
  li: ({ children }) => (
    <li className="flex items-start gap-2 mb-2 last:mb-0">
      <span className="text-blue-500 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" /> 
      <div className="flex-1">{children}</div>
    </li>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    return isInline ? (
      <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-blue-400 text-[0.9em] font-mono border border-zinc-700/50">
        {children}
      </code>
    ) : (
      <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto my-4 scrollbar-thin">
        <code className={cn("text-xs font-mono text-zinc-300", className)}>
          {children}
        </code>
      </pre>
    );
  },
  a: ({ children, href }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500 transition-all font-medium"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-zinc-800">
      <table className="w-full text-xs text-left border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-zinc-900/80 border-b border-zinc-800">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-2 font-bold text-zinc-100">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2 border-b border-zinc-800 text-zinc-400">{children}</td>,
});

export const RichMarkdown: React.FC<RichMarkdownProps> = ({ content, onQuickAction }) => {
  const components = useMemo(() => MarkdownComponents(onQuickAction), [onQuickAction]);

  return (
    <div className="rich-markdown space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
