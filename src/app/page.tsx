"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import SkillsBento from "@/components/SkillsBento";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Chatbot from "@/components/Chatbot";
import {
  MessageCircle,
  User as UserIcon,
  Briefcase,
  Code,
  GraduationCap,
  Home as HomeIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Home", icon: HomeIcon, component: Hero },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    component: Experience,
  },
  { id: "skills", label: "Skills", icon: UserIcon, component: SkillsBento },
  { id: "projects", label: "Projects", icon: Code, component: Projects },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    component: Education,
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [activeTab, setActiveTab] = useState<"chat" | "portfolio">("chat");
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle responsiveness
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Intersection Observer to track active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [activeTab, isDesktop]);

  // Scroll-progress IntersectionObserver — multi-threshold on each section
  const updateProgress = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const sectionIndex = SECTIONS.findIndex((s) => s.id === entry.target.id);
      if (sectionIndex === -1) return;

      if (entry.isIntersecting) {
        // Progress = (sectionIndex + intersectionRatio) / total sections
        const raw = (sectionIndex + entry.intersectionRatio) / SECTIONS.length;
        setScrollProgress(Math.min(raw, 1));
      }
    });
  }, []);

  useEffect(() => {
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const progressObserver = new IntersectionObserver(updateProgress, {
      root: null,
      threshold: thresholds,
    });

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) progressObserver.observe(element);
    });

    return () => progressObserver.disconnect();
  }, [activeTab, isDesktop, updateProgress]);

  const scrollToSection = (id: string) => {
    if (!isDesktop) setActiveTab("portfolio");

    // Small delay to ensure tab switch happens before scroll if on mobile
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress * 100}%` }}
        aria-hidden="true"
      />

      {/* Global Background Elements */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-50"></div>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-[100px] pointer-events-none -z-20"></div>

      {isDesktop ? (
        /* Desktop Split Layout */
        <div className="flex h-screen overflow-hidden">
          {/* Left Side: Portfolio (Scrollable) */}
          <div
            ref={scrollContainerRef}
            className="w-[60%] overflow-y-auto scroll-smooth custom-scrollbar"
          >
            <div className="max-w-4xl mx-auto py-12 px-8">
              {SECTIONS.map((section) => (
                <div key={section.id} id={section.id} className="mb-20">
                  <section.component />
                  {section.id !== "education" && (
                    <div className="h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent my-20" />
                  )}
                </div>
              ))}

              <footer className="mt-20 py-8 border-t border-zinc-800/50 text-center text-zinc-500 text-sm">
                <p>
                  &copy; {new Date().getFullYear()} Rabita Amin. Crafted with
                  Next.js &amp; Tailwind CSS.
                </p>
              </footer>
            </div>
          </div>

          {/* Right Side: Chatbot (Fixed) */}
          <div className="w-[40%] border-l border-zinc-800/50 bg-zinc-950/30 backdrop-blur-md z-10">
            <Chatbot
              isInline
              activeSection={activeSection}
              onNavigate={scrollToSection}
            />
          </div>
        </div>
      ) : (
        /* Mobile/Tablet Tabbed Layout */
        <div className="flex flex-col h-screen">
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === "chat" ? (
                <motion.div
                  key="chat-tab"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <Chatbot
                    isInline
                    activeSection={activeSection}
                    onNavigate={scrollToSection}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="portfolio-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full overflow-y-auto pt-4"
                >
                  <div className="px-4 pb-24">
                    {SECTIONS.map((section) => (
                      <div key={section.id} id={section.id} className="mb-12">
                        <section.component />
                        {section.id !== "education" && (
                          <div className="h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent my-12" />
                        )}
                      </div>
                    ))}
                    <footer className="py-8 border-t border-zinc-800/50 text-center text-zinc-500 text-sm">
                      <p>&copy; {new Date().getFullYear()} Rabita Amin.</p>
                    </footer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation Tabs */}
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800/50 z-100 px-6 py-3">
            <div className="max-w-md mx-auto flex items-center justify-around">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "chat" ? "text-blue-500" : "text-zinc-500"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${activeTab === "chat" ? "bg-blue-500/10" : ""}`}
                >
                  <MessageCircle size={24} />
                </div>
                <span className="text-[10px] font-medium">Chat</span>
              </button>

              <button
                onClick={() => setActiveTab("portfolio")}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "portfolio" ? "text-blue-500" : "text-zinc-500"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${activeTab === "portfolio" ? "bg-blue-500/10" : ""}`}
                >
                  <UserIcon size={24} />
                </div>
                <span className="text-[10px] font-medium">Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
