"use client";

import { motion, Variants } from "framer-motion";
import { Mail, ExternalLink, Github, Linkedin, Code2 } from "lucide-react";
import Link from "next/link";
import { useInView } from "@/lib/useInView";

export default function Hero() {
  const [orbRef, orbInView] = useInView<HTMLDivElement>({ threshold: 0.01 });

  const [socialRef, socialInView] = useInView<HTMLDivElement>({
    threshold: 0.1,
  });

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
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <section
      ref={orbRef}
      className="relative min-h-[90vh] flex flex-col justify-center pt-20 pb-12 overflow-hidden"
    >
      {/* Background glowing orbs — lazy-activated via Intersection Observer */}
      <div
        className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen transition-opacity duration-1000 ${
          orbInView ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen transition-opacity duration-1000 delay-300 ${
          orbInView ? "opacity-100" : "opacity-0"
        }`}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-6 w-full"
      >
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Available for Opportunities
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
        >
          Hi, I&apos;m Rabita Amin <br />
          <span className="text-gradient">Full-Stack Developer.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
        >
          A dedicated Full-Stack Developer with{" "}
          <strong className="text-zinc-200">2 years of experience</strong>{" "}
          building scalable backend systems and modern web applications. Expert
          in{" "}
          <strong className="text-zinc-200">
            Node.js, React.js &amp; Next.js
          </strong>{" "}
          , with a proactive &quot;can-do&quot; attitude and strong
          organizational skills.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-4 mb-14">
          <a
            href="mailto:rabitaamin26@gmail.com"
            className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-900 px-6 py-3 rounded-full font-semibold hover:bg-white hover:scale-105 transition-all"
          >
            <Mail className="w-4 h-4" /> Get in touch
          </a>
          <a
            href="#experience"
            className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-6 py-3 rounded-full font-semibold hover:bg-zinc-800 hover:text-white transition-all"
          >
            View Experience
          </a>
        </motion.div>

        {/* Social cards — staggered reveal via Intersection Observer */}
        <div
          ref={socialRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${socialInView ? "is-visible" : ""}`}
        >
          {[
            {
              href: "https://linkedin.com/in/rabita-amin",
              icon: <Linkedin className="w-5 h-5 text-blue-400" />,
              title: "LinkedIn",
              handle: "rabita-amin",
              delay: "stagger-1",
            },
            {
              href: "https://github.com/Rabita1767",
              icon: <Github className="w-5 h-5 text-zinc-300" />,
              title: "GitHub",
              handle: "@Rabita1767",
              delay: "stagger-2",
            },
            {
              href: "https://leetcode.com/u/Rabita1767/",
              icon: <Code2 className="w-5 h-5 text-yellow-500" />,
              title: "LeetCode",
              handle: "Rabita1767",
              delay: "stagger-3",
            },
          ].map((card) => (
            <div key={card.title} className={`reveal-scale ${card.delay}`}>
              <SocialCard
                href={card.href}
                icon={card.icon}
                title={card.title}
                handle={card.handle}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function SocialCard({
  href,
  icon,
  title,
  handle,
}: Readonly<{
  href: string;
  icon: React.ReactNode;
  title: string;
  handle: string;
}>) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bento-card group flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-4">
        {icon}
        <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
      </div>
      <div>
        <h3 className="font-medium text-zinc-200">{title}</h3>
        <p className="text-sm text-zinc-500 mt-1">{handle}</p>
      </div>
    </Link>
  );
}
