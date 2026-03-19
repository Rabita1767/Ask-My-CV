"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, Award } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";

const experiences = [
  {
    id: 1,
    role: "Software Engineer",
    company: "BJIT (Bangladesh Japan Information & Technology Ltd.)",
    period: "2023 – 2025",
    description:
      "Designed and built scalable full-stack systems using the MERN stack, contributing to multiple production-grade web applications.",
    highlights: [
      "Designed scalable backend systems using Node.js (Express + TypeScript) with MongoDB",
      "Developed secure REST APIs with JWT authentication and documented with Swagger",
      "Built responsive frontends using React.js & Next.js following Atomic Design principles",
      "Integrated Redis (caching), RabbitMQ (message broker), and NodeMailer (email handling)",
      "Used Docker for containerization and managed state using Redux",
      "Developed Xamify — an online testing system with role-based authentication",
      "Built an AI chatbot using OpenAI API and created Slack–Jira integration",
    ],
    achievement: "🥉 3rd Place – Web Technology Training (MERN), BJIT Academy",
  },
];

/** Observe a single card's visibility; pulse the timeline dot on entry. */
function useCardInView() {
  const cardRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dotRef.current?.classList.add("pulse-dot");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { cardRef, dotRef };
}

export default function Experience() {
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // Section heading reveal via Intersection Observer
  const [headingRef, headingInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
  });

  useEffect(() => {
    const handleHighlight = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; type: string }>;
      if (customEvent.detail.type === "experience") {
        setHighlightedId(Number.parseInt(customEvent.detail.id));
        setTimeout(() => setHighlightedId(null), 3000);
      }
    };

    globalThis.addEventListener("highlight-item", handleHighlight);
    return () =>
      globalThis.removeEventListener("highlight-item", handleHighlight);
  }, []);

  return (
    <section id="experience" className="py-24 relative max-w-5xl mx-auto px-6">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      {/* Heading — IO-driven reveal-up */}
      <div
        ref={headingRef}
        className={`mb-16 ${headingInView ? "is-visible" : ""}`}
      >
        <div className="reveal-up stagger-1">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-100">
            Professional <span className="text-gradient">Experience</span>
          </h2>
        </div>
        <div className="reveal-up stagger-2">
          <p className="text-zinc-400 text-lg max-w-2xl">
            My journey as a Full-Stack Developer building scalable,
            production-grade web applications with modern technologies.
          </p>
        </div>
      </div>

      <div className="relative border-l border-zinc-800/50 pl-8 ml-4">
        <div className="space-y-16">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              index={index}
              highlightedId={highlightedId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  exp,
  index,
  highlightedId,
}: Readonly<{
  exp: (typeof experiences)[0];
  index: number;
  highlightedId: number | null;
}>) {
  const { cardRef, dotRef } = useCardInView();

  return (
    <motion.div
      key={exp.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline Dot — pulses via IO when card enters viewport */}
      <div
        ref={dotRef}
        className="absolute -left-[41px] mt-1.5 w-5 h-5 rounded-full border-4 border-[#09090b] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
      />

      <div
        ref={cardRef}
        className={cn(
          "bento-card relative overflow-hidden group transition-all duration-500",
          highlightedId === exp.id
            ? "ring-2 ring-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]"
            : "",
        )}
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
          <Calendar className="w-4 h-4" />
          {exp.period}
        </div>

        <h3 className="text-xl font-bold text-zinc-100 mb-1">{exp.role}</h3>
        <div className="flex items-center gap-2 text-zinc-300 font-medium mb-4">
          <Briefcase className="w-4 h-4 text-zinc-500" />
          {exp.company}
        </div>

        <p className="text-zinc-400 mb-6">{exp.description}</p>

        <div className="space-y-2 mb-6">
          <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3">
            Key Responsibilities
          </h4>
          {exp.highlights.map((h) => (
            <div
              key={h}
              className="flex items-start gap-2 text-zinc-400 text-sm"
            >
              <span className="text-blue-400 mt-1 shrink-0">▸</span>
              {h}
            </div>
          ))}
        </div>

        {exp.achievement && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800/50 text-sm text-yellow-400/80">
            <Award className="w-4 h-4 shrink-0" />
            {exp.achievement}
          </div>
        )}
      </div>
    </motion.div>
  );
}
