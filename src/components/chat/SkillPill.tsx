"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkillPillProps {
  skill: string;
  onClick?: (skill: string) => void;
}

export const SkillPill: React.FC<SkillPillProps> = ({ skill, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick?.(skill)}
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer mr-2 mb-2"
    >
      {skill}
    </motion.button>
  );
};
