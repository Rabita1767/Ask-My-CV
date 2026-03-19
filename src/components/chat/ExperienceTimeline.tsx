"use client";

import React from "react";
import { Briefcase, Calendar } from "lucide-react";

interface ExperienceItemProps {
  company: string;
  role: string;
  period: string;
  children: React.ReactNode;
}

export const ExperienceTimeline: React.FC<{ items: ExperienceItemProps[] }> = ({ items }) => {
  return (
    <div className="space-y-6 my-4 border-l-2 border-zinc-800 pl-4 ml-2">
      {items.map((item, idx) => (
        <div key={`${item.company}-${idx}`} className="relative">
          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-zinc-950 shadow-sm" />
          <div className="mb-1 flex items-center gap-2 text-blue-400 text-xs font-medium">
            <Calendar size={12} />
            {item.period}
          </div>
          <h4 className="text-zinc-100 font-bold text-sm leading-tight">{item.role}</h4>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2">
            <Briefcase size={12} className="text-zinc-500" />
            {item.company}
          </div>
          <div className="text-zinc-400 text-xs leading-relaxed">
            {item.children}
          </div>
        </div>
      ))}
    </div>
  );
};
