"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link2, BarChart2, Eye, Shield } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Link2,
    title: "Source-linked tasks",
    body: "Every task, decision, and risk is traceable back to the exact quote in the transcript. Nothing is invented — everything is grounded.",
    badge: "Zero hallucination by design",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    iconBg: "bg-violet-100",
    badgeColor: "text-violet-700 bg-violet-100 border-violet-200",
  },
  {
    icon: BarChart2,
    title: "AI confidence scores",
    body: "Each extraction comes with a confidence percentage. You see exactly how certain the model is — so your team knows what to double-check.",
    badge: "Transparent AI reasoning",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    iconBg: "bg-cyan-100",
    badgeColor: "text-cyan-700 bg-cyan-100 border-cyan-200",
  },
  {
    icon: Eye,
    title: "Human-in-the-loop",
    body: "Flowstate is a tool, not a replacement. Every output is editable. Teams stay in control of what gets shipped and what gets closed.",
    badge: "Always editable · Always yours",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    badgeColor: "text-blue-700 bg-blue-100 border-blue-200",
  },
  {
    icon: Shield,
    title: "Role-based access",
    body: "Owners, editors, and viewers. The people in the meeting can act — stakeholders can observe. Your data stays in the right hands.",
    badge: "Owner · Editor · Viewer",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    badgeColor: "text-green-700 bg-green-100 border-green-200",
  },
];

export function TrustSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-28 px-5 overflow-hidden bg-[#F2F3F8]">
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
            Built with trust
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text mb-5">
            AI you can verify,<br className="hidden sm:block" /> not just trust blindly.
          </h2>
          <p className="text-base text-[#374151] max-w-xl mx-auto">
            Flowstate shows its work. Every extraction is source-linked, confidence-rated, and editable by your team.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`group flex flex-col gap-5 p-6 rounded-2xl border ${item.border} ${item.bg}
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0E1330]/6 transition-all duration-300`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                  <Icon size={18} className={item.color} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#0E1330] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#374151] leading-relaxed">{item.body}</p>
                </div>

                {/* Badge */}
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
