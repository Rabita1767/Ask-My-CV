"use client";

import { motion, Variants } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";
import { useInView } from "@/lib/useInView";

export default function Education() {
  // Section heading reveal
  const [headingRef, headingInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const degrees = [
    {
      title: "B.Sc. in Information Technology",
      institution: "Jahangirnagar University",
      detail: "CGPA: 3.54",
      dotColor: "bg-zinc-500",
      activeDotColor: "group-hover:bg-blue-400",
    },
    {
      title: "HSC",
      institution: "Birshreshtha Noor Mohammad Public College",
      period: "2015–2017",
      dotColor: "bg-zinc-600",
      activeDotColor: "group-hover:bg-cyan-400",
    },
    {
      title: "SSC",
      institution: "Kamrunnesa Govt. Girls\u2019 High School, Dhaka",
      period: "2009–2015",
      dotColor: "bg-zinc-700",
      activeDotColor: "group-hover:bg-zinc-400",
    },
  ];

  const courses = [
    {
      title: "Microservices with Node.js and React",
      provider: "Udemy",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Next.js: The Complete Developer's Guide",
      provider: "Udemy",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Laravel 11 – From Basics to Advanced",
      provider: "Udemy",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <section id="education" className="py-24 relative max-w-5xl mx-auto px-6">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] -z-10" />

      {/* Heading — IO-driven reveal */}
      <div
        ref={headingRef}
        className={`mb-16 ${headingInView ? "is-visible" : ""}`}
      >
        <div className="reveal-up stagger-1">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-100">
            Education &amp; <span className="text-gradient">Courses</span>
          </h2>
        </div>
        <div className="reveal-up stagger-2">
          <p className="text-zinc-400 text-lg max-w-2xl">
            Academic background and professional development courses that form
            the foundation of my engineering expertise.
          </p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Education Credentials */}
        <motion.div
          variants={item}
          className="bento-card group flex flex-col h-full bg-zinc-900/30"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-zinc-800/50 rounded-xl text-blue-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100">
              Academic Degrees
            </h3>
          </div>

          <div className="space-y-8 flex-grow">
            {degrees.map((deg) => (
              <DegreeEntry key={deg.title} deg={deg} />
            ))}
          </div>
        </motion.div>

        {/* Courses & Professional Development */}
        <motion.div variants={item} className="space-y-6">
          <div className="bento-card flex flex-col h-full bg-zinc-900/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-zinc-800/50 rounded-xl text-purple-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100">
                Udemy Courses
              </h3>
            </div>

            <div className="space-y-6 flex-grow">
              {courses.map((course) => (
                <CourseEntry key={course.title} course={course} />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Single degree row — dot color transitions when entry enters viewport via IO */
function DegreeEntry({
  deg,
}: Readonly<{
  deg: {
    title: string;
    institution: string;
    detail?: string;
    period?: string;
    dotColor: string;
    activeDotColor: string;
  };
}>) {
  const [entryRef, entryInView] = useInView<HTMLDivElement>({ threshold: 0.5 });

  return (
    <div ref={entryRef} className="relative pl-6 border-l border-zinc-700/50">
      <div
        className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-zinc-900 transition-colors duration-700 ${deg.dotColor} ${
          entryInView ? "!bg-blue-400" : ""
        }`}
      />
      {deg.period ? (
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="text-md font-bold text-zinc-200">{deg.title}</h4>
            <p className="text-zinc-400 text-sm">{deg.institution}</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-zinc-800/80 rounded border border-zinc-700 text-zinc-400 shrink-0">
            {deg.period}
          </span>
        </div>
      ) : (
        <>
          <h4 className="text-lg font-bold text-zinc-200">{deg.title}</h4>
          <p className="text-zinc-400 font-medium mb-1">{deg.institution}</p>
          {deg.detail && <p className="text-zinc-500 text-sm">{deg.detail}</p>}
        </>
      )}
    </div>
  );
}

/** Single course row — dot activates via IO */
function CourseEntry({
  course,
}: Readonly<{
  course: {
    title: string;
    provider: string;
    color: string;
    bg: string;
  };
}>) {
  const [courseRef, courseInView] = useInView<HTMLDivElement>({
    threshold: 0.5,
  });

  return (
    <div ref={courseRef} className="relative pl-6 border-l border-zinc-700/50">
      <div
        className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-zinc-900 transition-all duration-700 ${course.bg} ${
          courseInView ? "scale-125" : "scale-100"
        }`}
      />
      <h4 className="text-sm font-bold text-zinc-200">{course.title}</h4>
      <p className={`text-xs font-medium mt-1 ${course.color}`}>
        {course.provider}
      </p>
    </div>
  );
}
