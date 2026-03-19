"use client";

import { motion } from "framer-motion";
import {
  FolderGit2,
  Globe,
  Code2,
  MessageSquareCode,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "SWAPIverse",
    description:
      "Full-stack Star Wars explorer with search & caching. Fetches characters, planets, and starships from SWAPI with fast Redis caching and a modern React frontend built with RTK Query.",
    tags: [
      "Node.js",
      "Express",
      "TypeScript",
      "React",
      "Vite",
      "RTK Query",
      "Redis",
    ],
    icon: <Globe className="w-6 h-6 text-purple-400" />,
    color: "from-purple-500/20 to-transparent",
    live: "https://swapi-with-upstash.vercel.app/",
    repo: "https://github.com/Rabita1767/Swapi-full-stack",
  },
  {
    id: 2,
    title: "Image Processor",
    description:
      "Image compression system with async task handling and real-time progress notifications. Uses RabbitMQ for message brokering and Socket.IO for live updates, deployed on Vercel.",
    tags: ["Node.js", "Express", "Next.js", "MongoDB", "RabbitMQ", "Socket.IO"],
    icon: <Code2 className="w-6 h-6 text-orange-400" />,
    color: "from-orange-500/20 to-transparent",
    repo: "https://github.com/Rabita1767/image-processor-app",
    live: "https://vercel.com/rabita-amins-projects/image-processor-app-aj94",
  },
  {
    id: 3,
    title: "LearnWave",
    description:
      "Full-stack e-learning platform with course management, enrollment & progress tracking, and dedicated Admin/User dashboards. Media assets stored on AWS S3.",
    tags: ["Node.js", "React", "MongoDB", "AWS S3"],
    icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
    color: "from-blue-500/20 to-transparent",
    repo: "https://github.com/Rabita1767/LearnWave-E-learning-platform-",
  },
  {
    id: 4,
    title: "AI Chatbot (OpenAI)",
    description:
      "Integrated an AI chatbot using the OpenAI API into a production backend, enabling smart conversational support. Also built a Slack–Jira integration supporting task creation, assignment, and threaded conversations.",
    tags: ["OpenAI API", "Node.js", "Slack Bolt", "Jira API", "TypeScript"],
    icon: <MessageSquareCode className="w-6 h-6 text-cyan-400" />,
    color: "from-cyan-500/20 to-transparent",
  },
];

/** Per-card shimmer line that expands via IO */
function ProjectCard({
  project,
  index,
  highlightedId,
}: Readonly<{
  project: (typeof projects)[0];
  index: number;
  highlightedId: number | null;
}>) {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = shimmerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "bento-card group flex flex-col h-full relative overflow-hidden transition-all duration-500",
        highlightedId === project.id
          ? "ring-2 ring-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]"
          : "",
      )}
    >
      {/* Subtle Gradient Overlay */}
      <div
        className={cn(
          "absolute -top-32 -right-32 w-64 h-64 bg-linear-to-bl",
          project.color,
          "rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700",
        )}
      />

      <div className="mb-6 flex items-center justify-between">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl group-hover:border-zinc-700 transition-colors">
          {project.icon}
        </div>
        <FolderGit2 className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>

      <h3 className="text-xl font-bold text-zinc-100 mb-3">{project.title}</h3>
      <p className="text-zinc-400 text-sm mb-4 grow leading-relaxed">
        {project.description}
      </p>

      {(project.live || project.repo) && (
        <div className="flex gap-3 mb-4">
          {project.repo && (
            <Link
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-all"
            >
              GitHub →
            </Link>
          )}
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/60 px-3 py-1.5 rounded-lg transition-all"
            >
              Live Demo →
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-800/50">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-zinc-900/40 text-zinc-400 text-xs font-medium rounded-md border border-zinc-800"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Hover + IO shimmer line */}
      <div
        ref={shimmerRef}
        className="shimmer-line absolute bottom-0 left-0 h-1 bg-linear-to-r from-blue-500 to-cyan-400"
      />
    </motion.div>
  );
}

export default function Projects() {
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // Section heading reveal via IO
  const [headingRef, headingInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
  });

  useEffect(() => {
    const handleHighlight = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; type: string }>;
      if (customEvent.detail.type === "project") {
        setHighlightedId(Number.parseInt(customEvent.detail.id));
        setTimeout(() => setHighlightedId(null), 3000);
      }
    };

    globalThis.addEventListener("highlight-item", handleHighlight);
    return () =>
      globalThis.removeEventListener("highlight-item", handleHighlight);
  }, []);

  return (
    <section id="projects" className="py-24 relative max-w-5xl mx-auto px-6">
      {/* Heading — IO-driven reveal */}
      <div
        ref={headingRef}
        className={`mb-16 ${headingInView ? "is-visible" : ""}`}
      >
        <div className="reveal-up stagger-1">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-100">
            Personal <span className="text-gradient">Projects</span>
          </h2>
        </div>
        <div className="reveal-up stagger-2">
          <p className="text-zinc-400 text-lg max-w-2xl">
            Hands-on projects showcasing full-stack development with modern web
            technologies, async processing, and AI integration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            highlightedId={highlightedId}
          />
        ))}
      </div>
    </section>
  );
}
