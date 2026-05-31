"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Code2, Palette, TrendingUp, Handshake } from "lucide-react";

const ROLES = [
  {
    icon: Rocket,
    role: "Product Lead",
    quote: "I used to spend the hour after every meeting rewriting my notes into tasks. Now the workspace is ready before I've closed my laptop.",
    detail: "Decisions logged · Owners assigned · Deadlines set",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    iconBg: "bg-violet-100",
  },
  {
    icon: Code2,
    role: "Engineer",
    quote: "I finally know exactly what I'm responsible for after a sync. No more hunting through Slack threads for the action item someone mentioned once.",
    detail: "My tasks · My deadlines · Source quotes",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    iconBg: "bg-cyan-100",
  },
  {
    icon: Palette,
    role: "Designer",
    quote: "The copy deadline was buried in a 45-minute recording. Flowstate pulled it out in seconds and put it on the board with my name on it.",
    detail: "Design tasks · Asset deadlines · Feedback loops",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
  },
  {
    icon: TrendingUp,
    role: "Growth Lead",
    quote: "We were launching in 3 weeks and nobody had a shared list of what needed to happen. Flowstate gave us that in one paste.",
    detail: "Launch tasks · Risk flags · Milestone tracking",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
  },
  {
    icon: Handshake,
    role: "Client Partner",
    quote: "I send clients the execution brief right after a call. They know what's happening, who owns it, and when it's done. No follow-up emails needed.",
    detail: "Execution brief · Delivery schedule · Risk visibility",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
  },
];

export function TeamSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-28 px-5 bg-[#FBFBFD] overflow-hidden">
      <div className="absolute inset-0 pearl-grid-bg opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.18em] mb-4">
            Built for every seat in the room
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text mb-5">
            Every role leaves the meeting<br className="hidden sm:block" /> knowing exactly what to do.
          </h2>
          <p className="text-base text-[#374151] max-w-xl mx-auto">
            Flowstate surfaces the right information for whoever&apos;s asking — without everyone sitting through the full recording.
          </p>
        </motion.div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.role}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={`group flex flex-col gap-4 p-5 rounded-2xl border ${r.border} ${r.bg}
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0E1330]/6 transition-all duration-300`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${r.iconBg}`}>
                  <Icon size={16} className={r.color} />
                </div>

                {/* Role label */}
                <p className={`text-xs font-bold uppercase tracking-wider ${r.color}`}>{r.role}</p>

                {/* Quote */}
                <p className="text-[12px] text-[#374151] leading-relaxed flex-1">
                  &ldquo;{r.quote}&rdquo;
                </p>

                {/* Detail */}
                <p className={`text-[10px] ${r.color} opacity-70 leading-relaxed border-t ${r.border} pt-3`}>
                  {r.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
