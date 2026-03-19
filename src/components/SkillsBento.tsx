"use client";

import { motion, Variants } from "framer-motion";
import {
  Database,
  Server,
  Component,
  MessageSquareCode,
  Wrench,
  Code,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";

export default function SkillsBento() {
  const [highlightedType, setHighlightedType] = useState<string | null>(null);

  // Intersection Observer refs for the pill rows
  const [langsRef, langsInView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [dbRef, dbInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  // Section heading reveal
  const [headingRef, headingInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
  });

  useEffect(() => {
    const handleHighlight = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; type: string }>;
      if (customEvent.detail.type === "skill") {
        setHighlightedType(customEvent.detail.id);
        setTimeout(() => setHighlightedType(null), 3000);
      }
    };

    globalThis.addEventListener("highlight-item", handleHighlight);
    return () =>
      globalThis.removeEventListener("highlight-item", handleHighlight);
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const languages = ["HTML", "JavaScript", "TypeScript", "PHP"];
  const databases = ["MongoDB", "PostgreSQL", "MySQL"];

  return (
    <section id="skills" className="py-24 relative max-w-5xl mx-auto px-6">
      {/* Section heading — IO-driven reveal */}
      <div
        ref={headingRef}
        className={`mb-16 text-center ${headingInView ? "is-visible" : ""}`}
      >
        <div className="reveal-up stagger-1">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-100">
            Core <span className="text-gradient">Competencies</span>
          </h2>
        </div>
        <div className="reveal-up stagger-2">
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            A blend of full-stack engineering disciplines, focusing on scalable
            backends, modern frontends, and integrations.
          </p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
      >
        {/* Backend - Large spanning 2 cols */}
        <motion.div
          variants={item}
          className={cn(
            "bento-card relative overflow-hidden group md:col-span-2 flex flex-col justify-end p-8 transition-all duration-500",
            highlightedType === "backend"
              ? "ring-2 ring-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.01]"
              : "",
          )}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20 z-0 transition-all duration-500 group-hover:bg-blue-500/20" />
          <Server className="w-10 h-10 text-blue-400 mb-6 z-10" />
          <h3 className="text-2xl font-bold text-zinc-100 mb-2 z-10">
            Backend Development
          </h3>
          <p className="text-zinc-400 z-10 max-w-md">
            Designing scalable REST APIs with{" "}
            <strong className="text-zinc-200">
              Node.js (Express + TypeScript)
            </strong>{" "}
            and <strong className="text-zinc-200">PHP/Laravel</strong>. Secure
            JWT auth, Docker containerization, Swagger docs.
          </p>
        </motion.div>

        {/* Frontend */}
        <motion.div
          variants={item}
          className={cn(
            "bento-card relative overflow-hidden group flex flex-col p-8",
            highlightedType === "frontend"
              ? "ring-2 ring-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.01]"
              : "",
          )}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl z-0 transition-all duration-500 group-hover:bg-cyan-500/20" />
          <Component className="w-8 h-8 text-cyan-400 mb-auto z-10" />
          <div className="z-10 mt-6">
            <h3 className="text-xl font-bold text-zinc-100 mb-2">
              Frontend Interfaces
            </h3>
            <p className="text-zinc-400 text-sm">
              React.js, Next.js, Tailwind CSS, SCSS, Bootstrap, Redux, RTK Query
              &amp; Chart.js.
            </p>
          </div>
        </motion.div>

        {/* Integrations & Tooling */}
        <motion.div
          variants={item}
          className="bento-card relative overflow-hidden group flex flex-col p-8"
        >
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl z-0 transition-all duration-500 group-hover:bg-purple-500/20" />
          <MessageSquareCode className="w-8 h-8 text-purple-400 mb-auto z-10" />
          <div className="z-10 mt-6">
            <h3 className="text-xl font-bold text-zinc-100 mb-2">
              AI &amp; Integrations
            </h3>
            <p className="text-zinc-400 text-sm">
              OpenAI API, Slack Bolt, Jira API, Socket.IO, Redis, RabbitMQ,
              NodeMailer.
            </p>
          </div>
        </motion.div>

        {/* Dev Tools - spanning 2 cols */}
        <motion.div
          variants={item}
          className="bento-card relative overflow-hidden group md:col-span-2 flex justify-between items-end p-8"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] z-0" />
          <div className="z-10 max-w-sm">
            <Wrench className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold text-zinc-100 mb-2">
              Dev Tools &amp; Infrastructure
            </h3>
            <p className="text-zinc-400">
              Git, GitHub, Docker, Swagger, Postman — with strong knowledge of{" "}
              <strong className="text-zinc-200">
                Atomic Design principles
              </strong>
              .
            </p>
          </div>
          <div className="z-10 hidden md:grid grid-cols-2 gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
            {["Git", "Docker", "Swagger", "Postman"].map((skill) => (
              <div
                key={skill}
                className="px-3 py-1 border border-zinc-700 rounded-md text-xs text-zinc-300 backdrop-blur-sm"
              >
                {skill}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Core Languages — IO-driven staggered pill reveal */}
        <motion.div
          variants={item}
          className="bento-card md:col-span-3 flex flex-wrap gap-4 items-center justify-center p-6 border-dashed border-zinc-800"
        >
          <Code className="w-5 h-5 text-zinc-500 mr-2" />
          <div
            ref={langsRef}
            className={`flex flex-wrap gap-4 items-center ${langsInView ? "is-visible" : ""}`}
          >
            {languages.map((lang, i) => (
              <span
                key={lang}
                className={`reveal-scale stagger-${i + 1} px-4 py-2 bg-zinc-900/50 rounded-full text-zinc-300 font-medium text-sm border border-zinc-800 hover:border-zinc-700 transition-colors`}
              >
                {lang}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Databases — IO-driven staggered pill reveal */}
        <motion.div
          variants={item}
          className="bento-card md:col-span-3 flex flex-wrap gap-4 items-center justify-center p-6 bg-zinc-900/20"
        >
          <Database className="w-5 h-5 text-zinc-500 mr-2" />
          <div
            ref={dbRef}
            className={`flex flex-wrap gap-4 items-center ${dbInView ? "is-visible" : ""}`}
          >
            {databases.map((db, i) => (
              <span
                key={db}
                className={`reveal-scale stagger-${i + 1} text-zinc-400 font-medium text-sm hover:text-blue-400 transition-colors cursor-default`}
              >
                {db}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
