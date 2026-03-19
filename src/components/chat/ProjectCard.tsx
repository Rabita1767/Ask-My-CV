"use client";

import React from "react";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  links?: {
    demo?: string;
    github?: string;
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, techStack, links }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 my-4 group hover:border-blue-500/30 transition-all">
      <h4 className="text-zinc-100 font-bold mb-1 group-hover:text-blue-400 transition-colors">{title}</h4>
      <p className="text-zinc-400 text-xs mb-3 leading-relaxed">{description}</p>
      
      <div className="flex flex-wrap gap-1.5 mb-4">
        {techStack.map((tech) => (
          <span 
            key={tech} 
            className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] text-zinc-500 border border-zinc-700/50"
          >
            {tech}
          </span>
        ))}
      </div>

      {(links?.demo || links?.github) && (
        <div className="flex gap-3">
          {links.demo && (
            <a 
              href={links.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
          {links.github && (
            <a 
              href={links.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <Github size={12} />
              GitHub
            </a>
          )}
        </div>
      )}
    </div>
  );
};
