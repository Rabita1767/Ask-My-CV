"use client";

import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface QuickActionProps {
  label: string;
  onClick: (message: string) => void;
}

export const QuickAction: React.FC<QuickActionProps> = ({ label, onClick }) => {
  return (
    <motion.button
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(label)}
      className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all mb-2 text-left"
    >
      <Send size={12} className="text-blue-500/50" />
      <span>{label}</span>
    </motion.button>
  );
};
