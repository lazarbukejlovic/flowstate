"use client";

import { motion } from "framer-motion";
import { FileText, Brain, ListChecks, LayoutGrid, Activity, X, Check } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const WORKFLOW_STEPS = [
  { icon: FileText,   label: "Transcript",  desc: "Paste any meeting transcript or link",        color: "text-white/60",   dot: "bg-white/20" },
  { icon: Brain,      label: "Decisions",   desc: "AI extracts every decision and its context",   color: "text-violet-400", dot: "bg-violet-500" },
  { icon: ListChecks, label: "Tasks",       desc: "Tasks assigned with owners, dates, priority",  color: "text-cyan-400",   dot: "bg-cyan-500" },
  { icon: LayoutGrid, label: "Board",       desc: "Live kanban workspace built automatically",    color: "text-emerald-400",dot: "bg-emerald-500" },
  { icon: Activity,   label: "Activity",    desc: "Full execution log — every change tracked",    color: "text-blue-400",   dot: "bg-blue-500" },
];

const EXTRACTIONS = [
  {
    icon: Brain,
    title: "Decisions",
    desc: "Every decision made in the meeting, with context and owner. No more 'I thought we decided...'",
    color: "text-violet-400",
    bg: "border-violet-500/20 bg-violet-500/[0.06]",
    example: "Freeze landing page copy by Friday — Sofia Ramirez",
  },
  {
    icon: ListChecks,
    title: "Tasks",
    desc: "Action items with owners, deadlines, priority, and the exact quote from the transcript.",
    color: "text-cyan-400",
    bg: "border-cyan-500/20 bg-cyan-500/[0.06]",
    example: "Build beta invite flow · Daniel Brooks · Jun 5 · HIGH",
  },
  {
    icon: Brain,
    title: "Risks",
    desc: "Risks detected from the conversation — with severity rating and AI-suggested mitigation.",
    color: "text-amber-400",
    bg: "border-amber-500/20 bg-amber-500/[0.06]",
    example: "Email rate limits during beta send · HIGH · Pre-warm domain",
  },
  {
    icon: Activity,
    title: "Follow-ups",
    desc: "Open loops, commitments, and follow-up items — tracked and owned, not lost in notes.",
    color: "text-emerald-400",
    bg: "border-emerald-500/20 bg-emerald-500/[0.06]",
    example: "Get legal approval on pricing claims · Sofia Ramirez",
  },
];

const USE_CASES = [
  { label: "Product launch sync",      icon: "🚀", desc: "Extract scope decisions, owner assignments, and launch blockers automatically." },
  { label: "Client delivery call",     icon: "🤝", desc: "Turn client feedback sessions into scoped tasks and risk flags instantly." },
  { label: "Sprint planning",          icon: "⚡", desc: "Paste the planning transcript. Board is ready before the retro ends." },
  { label: "Investor update",          icon: "📊", desc: "Capture commitments and follow-up items from board meetings automatically." },
  { label: "Agency status meeting",    icon: "🎯", desc: "Every client decision tracked. Every owner notified. Every deadline visible." },
];

const BEFORE = ["Slack thread with action items", "Notes doc no one reads", "Follow-ups in someone's inbox", "Forgotten owners", "Missed deadlines"];
const AFTER  = ["AI-built action board", "Decisions captured with context", "Tasks owned and tracked", "Activity log for accountability", "AI deadline inference"];

export function ProductStory() {
  return (
    <>
      {/* ─── Stepper ──────────────────────────────────────────────── */}
      <section id="workflow" className="section-shell px-5 py-24 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-3xl md:text-4xl font-black gradient-text">
            From conversation to execution
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-0 overflow-x-auto pb-4">
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step.label} className="flex md:flex-col items-center md:items-center gap-4 md:gap-0 flex-1 min-w-[140px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
                className="flex flex-col md:items-center gap-2 md:gap-3"
              >
                <div className="w-11 h-11 rounded-2xl border bg-white/[0.04] border-white/[0.08] flex items-center justify-center"
                  style={{ background: "rgba(12,12,22,0.8)" }}>
                  <step.icon size={18} className={step.color} />
                </div>
                <div className="md:text-center">
                  <p className={`text-sm font-semibold ${step.color}`}>{step.label}</p>
                  <p className="text-[11px] text-white/35 mt-0.5 leading-snug max-w-[130px]">{step.desc}</p>
                </div>
              </motion.div>
              {i < WORKFLOW_STEPS.length - 1 && (
                <div className="flex-1 md:flex-none md:w-full flex items-center md:justify-center my-0 md:my-4">
                  <div className="h-px md:h-px w-full bg-gradient-to-r from-white/10 via-violet-500/30 to-white/10" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Extractions ─────────────────────────────────────────── */}
      <section className="section-shell px-5 py-20 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">What Flowstate extracts</p>
            <h2 className="text-3xl md:text-4xl font-black gradient-text">
              Every signal from every meeting
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXTRACTIONS.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={`p-5 rounded-2xl border ${item.bg}`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <item.icon size={16} className={item.color} />
                  <h3 className={`font-bold text-base ${item.color}`}>{item.title}</h3>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-3">{item.desc}</p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 border border-white/[0.05]">
                  <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Example</span>
                  <span className="text-[11px] text-white/55 font-mono">{item.example}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Use cases ────────────────────────────────────────────── */}
      <section className="section-shell px-5 py-24 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">Built for real delivery</p>
          <h2 className="text-3xl md:text-4xl font-black gradient-text">Any meeting. Any team.</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.label}
              {...fadeUp}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="p-5 rounded-2xl border border-white/[0.06] bg-[#0c0c16] hover:border-white/[0.1] transition-colors"
            >
              <span className="text-2xl mb-3 block">{uc.icon}</span>
              <h3 className="font-bold text-white mb-1.5 text-sm">{uc.label}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Before / After ────────────────────────────────────────── */}
      <section className="section-shell px-5 py-20 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">Why it replaces scattered work</p>
          <h2 className="text-3xl md:text-4xl font-black gradient-text">Replace the noise. Keep the signal.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-red-500/15 bg-red-500/[0.04]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <X size={12} className="text-red-400" />
              </div>
              <h3 className="font-bold text-red-400 text-sm">Before Flowstate</h3>
            </div>
            <ul className="space-y-3">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/45">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          {/* After */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={12} className="text-emerald-400" />
              </div>
              <h3 className="font-bold text-emerald-400 text-sm">With Flowstate</h3>
            </div>
            <ul className="space-y-3">
              {AFTER.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/75">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  );
}
