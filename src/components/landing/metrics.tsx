"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Metric {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  color: string;
}

const METRICS: Metric[] = [
  { value: 14,  suffix: "s",        label: "Average extraction time",     sub: "From raw transcript to structured workspace", color: "text-violet-600" },
  { value: 6,   suffix: " tasks",   label: "Auto-assigned per meeting",   sub: "With owners, deadlines, and priorities set",  color: "text-cyan-600" },
  { value: 4,   suffix: " decisions", label: "Captured per session",      sub: "Every resolution logged with context",        color: "text-blue-600" },
  { value: 3,   suffix: " risks",   label: "Flagged before they escalate", sub: "Severity-scored so teams act first",         color: "text-orange-600" },
  { value: 100, suffix: "%",        label: "Source-linked",               sub: "Every output traceable to the exact quote",   color: "text-green-600" },
];

function CountUp({ target, suffix, color, active }: { target: number; suffix: string; color: string; active: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    setDisplay(0);
    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (current >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [active, target]);

  return (
    <span className={`text-5xl lg:text-6xl font-black tabular-nums leading-none ${color}`}>
      {display}{suffix}
    </span>
  );
}

export function Metrics() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-28 px-5 overflow-hidden bg-[#F2F3F8]">
      {/* Subtle top/bottom fade */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#FBFBFD] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#FBFBFD] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.18em] mb-4">
            By the numbers
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text">
            A meeting processed in seconds,<br className="hidden sm:block" /> not hours.
          </h2>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-[#E7E8F0] rounded-2xl overflow-hidden border border-[#E7E8F0] shadow-md shadow-[#0E1330]/4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col gap-3 p-6 lg:p-8 bg-white hover:bg-[#FBFBFD] transition-colors"
            >
              <CountUp target={m.value} suffix={m.suffix} color={m.color} active={isInView} />
              <div>
                <p className="text-sm font-semibold text-[#0E1330] leading-snug mb-1">{m.label}</p>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">{m.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-[11px] text-[#9CA3AF] mt-6"
        >
          Metrics based on Q2 Product Launch Sync demo transcript · 847 words · 5 speakers
        </motion.p>
      </div>
    </section>
  );
}
