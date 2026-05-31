"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ShieldAlert,
  ListChecks,
  Activity,
  Zap,
  CheckSquare,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import {
  DEMO_TASKS,
  DEMO_DECISIONS,
  DEMO_RISKS,
  DEMO_FOLLOWUPS,
  DEMO_ACTIVITY,
  DEMO_TEAM,
  type DemoTask,
} from "@/lib/demo/demo-data";
import { TeamPresence } from "@/components/workspace/team-presence";
import { CopyBrief } from "@/components/workspace/copy-brief";
import { DemoBoard } from "@/components/workspace/demo-board";
import { TaskDrawer } from "@/components/workspace/task-drawer";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { GlassPanel, SeverityTag, StatusPill, ConfidenceDot } from "@/components/ui/primitives";

type Tab = "board" | "decisions" | "risks" | "followups" | "activity";

const TABS: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
  { id: "board",     label: "Board",      icon: ListChecks,  count: DEMO_TASKS.filter((t) => t.status !== "DONE").length },
  { id: "decisions", label: "Decisions",  icon: Brain,       count: DEMO_DECISIONS.length },
  { id: "risks",     label: "Risks",      icon: ShieldAlert, count: DEMO_RISKS.length },
  { id: "followups", label: "Follow-ups", icon: CheckSquare, count: DEMO_FOLLOWUPS.filter((f) => !f.completed).length },
  { id: "activity",  label: "Activity",   icon: Activity,    count: DEMO_ACTIVITY.length },
];

const OWNER_GRADIENT: Record<string, string> = {
  violet:  "from-violet-500 to-violet-700",
  blue:    "from-blue-500 to-blue-700",
  emerald: "from-emerald-500 to-emerald-700",
  amber:   "from-amber-500 to-amber-700",
};

const ACTION_ICONS: Record<string, string> = {
  created_workspace: "🚀",
  updated_task:      "✓",
  added_task:        "＋",
  added_decision:    "◆",
  completed_task:    "✓",
  blocked_task:      "⚠",
};

const WORKSPACE_SUMMARY =
  "The team confirmed a non-negotiable June 15th launch date driven by a board presentation the following day. Sofia owns the landing page messaging freeze by May 30th; any slip directly delays launch. Daniel committed to the beta invite flow by June 5th, contingent on invite copy from Sofia by end of week. The analytics dashboard scope was cut to a stripped metrics view, shipping post-launch. Three risks were flagged: email rate limits during the beta send, mobile page performance, and early beta churn.";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: EASE },
};

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<Tab>("board");
  const [activeTask, setActiveTask] = useState<DemoTask | null>(null);

  return (
    <div className="min-h-screen relative" style={{ background: "#07060F", color: "#F5F4FC" }}>
      <AnimatedBackground />

      {/* Top nav strip */}
      <div
        className="sticky top-0 px-5 py-3 flex items-center justify-between gap-4"
        style={{
          zIndex: 100,
          background: "rgba(7,6,15,0.82)",
          backdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid rgba(168,140,255,0.16)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#ABA6C9" }}
        >
          <ArrowLeft size={14} />
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7C3AED,#5B2BD6)" }}>
              <Zap size={8} className="text-white fill-white" />
            </span>
            <span style={{ color: "#F5F4FC" }}>Flowstate</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.30)",
              color: "#C4B5FD",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#A855F7", boxShadow: "0 0 6px rgba(168,85,247,0.8)" }} />
            Live demo
          </span>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg,#7C3AED,#5B2BD6)",
              boxShadow: "0 8px 24px rgba(124,58,237,0.30)",
            }}
          >
            Get started free
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 py-8 space-y-7">
        {/* Workspace header */}
        <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="font-display text-2xl font-bold tracking-[-0.02em]" style={{ color: "#F5F4FC" }}>
                Q2 Product Launch Sync
              </h1>
              <StatusPill kind="complete" />
            </div>
            <p className="text-sm" style={{ color: "#ABA6C9" }}>
              Extracted from 1,240-word transcript ·{" "}
              <span style={{ color: "#A855F7" }}>claude-opus-4-7</span> ·{" "}
              <span style={{ color: "#22D3EE" }}>3.2s</span> ·{" "}
              <ConfidenceDot value={96} /> avg confidence
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <TeamPresence team={DEMO_TEAM} />
            <CopyBrief
              title="Q2 Product Launch Sync"
              summary={WORKSPACE_SUMMARY}
              decisions={DEMO_DECISIONS}
              tasks={DEMO_TASKS}
              risks={DEMO_RISKS}
              followUps={DEMO_FOLLOWUPS}
            />
          </div>
        </motion.div>

        {/* Metric strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: EASE }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "Open Tasks", value: DEMO_TASKS.filter((t) => t.status !== "DONE").length, color: "#22D3EE", icon: ListChecks,  glow: "rgba(34,211,238,0.18)" },
            { label: "Decisions",  value: DEMO_DECISIONS.length,                                color: "#A855F7", icon: Brain,       glow: "rgba(168,85,247,0.18)" },
            { label: "Risks",      value: DEMO_RISKS.length,                                    color: "#FF6B4A", icon: ShieldAlert, glow: "rgba(255,107,74,0.20)" },
            { label: "Follow-ups", value: DEMO_FOLLOWUPS.filter((f) => !f.completed).length,    color: "#22C55E", icon: CheckSquare, glow: "rgba(34,197,94,0.18)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(168,140,255,0.16)",
                backdropFilter: "blur(16px)",
                boxShadow: `0 16px 40px rgba(0,0,0,0.35), 0 0 24px ${stat.glow}`,
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}1A`, border: `1px solid ${stat.color}40` }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="font-display text-2xl font-bold leading-none tracking-[-0.02em]"
                  style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] mt-1" style={{ color: "#ABA6C9" }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* AI Execution Brief */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
        >
          <GlassPanel glow="violet" className="p-5 relative overflow-hidden">
            {/* subtle scan beam */}
            <motion.div
              className="absolute inset-x-0 h-px pointer-events-none"
              style={{
                top: "50%",
                background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)",
                boxShadow: "0 0 10px rgba(168,85,247,0.5)",
              }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <div className="flex items-center gap-2 mb-3 relative">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.16)", border: "1px solid rgba(168,140,255,0.25)" }}>
                <Sparkles size={13} style={{ color: "#A855F7" }} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#ABA6C9" }}>
                AI Execution Brief
              </span>
              <span className="ml-auto text-[10px] font-mono" style={{ color: "#6E6A87" }}>
                Generated in 32s
              </span>
            </div>
            <p className="text-sm leading-relaxed relative" style={{ color: "#F5F4FC" }}>
              {WORKSPACE_SUMMARY}
            </p>
          </GlassPanel>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="flex items-center gap-1 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(168,140,255,0.16)", paddingBottom: 1 }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all -mb-px"
              style={{
                borderBottom: activeTab === tab.id
                  ? "2px solid #A855F7"
                  : "2px solid transparent",
                color: activeTab === tab.id ? "#F5F4FC" : "#ABA6C9",
              }}
            >
              <tab.icon size={13} />
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: activeTab === tab.id ? "rgba(124,58,237,0.20)" : "rgba(255,255,255,0.05)",
                    color: activeTab === tab.id ? "#C4B5FD" : "#ABA6C9",
                    border: activeTab === tab.id ? "1px solid rgba(124,58,237,0.30)" : "1px solid rgba(168,140,255,0.10)",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {activeTab === "board" && (
              <DemoBoard tasks={DEMO_TASKS} onTaskClick={setActiveTask} />
            )}

            {activeTab === "decisions" && (
              <div className="space-y-3">
                {DEMO_DECISIONS.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <GlassPanel className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-1 flex-shrink-0 self-stretch rounded-full mt-1"
                          style={{ background: "linear-gradient(180deg,#A855F7,#7C3AED)", boxShadow: "0 0 12px rgba(168,85,247,0.45)" }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="text-sm font-semibold" style={{ color: "#F5F4FC" }}>{d.title}</p>
                            <StatusPill kind="decided" dot={false} />
                          </div>
                          <p className="text-xs leading-relaxed mb-3" style={{ color: "#ABA6C9" }}>{d.context}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${OWNER_GRADIENT[DEMO_TEAM.find((m) => m.name === d.ownerName)?.color ?? "violet"]} flex items-center justify-center text-[9px] font-bold text-white`}>
                                {d.ownerName.split(" ").map((p) => p[0]).join("")}
                              </div>
                              <span className="text-[11px]" style={{ color: "#C4B5FD" }}>{d.ownerName}</span>
                            </div>
                            <span className="text-[10px]" style={{ color: "#6E6A87" }}>{d.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "risks" && (
              <div className="space-y-3">
                {DEMO_RISKS.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <GlassPanel glow={r.severity === "HIGH" ? "coral" : "none"} className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" style={{
                          color: r.severity === "HIGH" ? "#FF6B4A" :
                                 r.severity === "MEDIUM" ? "#F5A524" : "#22C55E",
                        }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <p className="text-sm font-semibold" style={{ color: "#F5F4FC" }}>{r.title}</p>
                            <SeverityTag level={r.severity as "HIGH" | "MEDIUM" | "LOW"} />
                          </div>
                        </div>
                      </div>
                      <div
                        className="ml-7 px-3 py-2.5 rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          border: "1px solid rgba(168,140,255,0.12)",
                        }}
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1"
                          style={{ color: "#6E6A87" }}>Mitigation</span>
                        <p className="text-xs leading-relaxed" style={{ color: "#F5F4FC" }}>{r.mitigation}</p>
                      </div>
                    </GlassPanel>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "followups" && (
              <div className="space-y-2">
                {DEMO_FOLLOWUPS.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                    style={{
                      background: f.completed
                        ? "rgba(34,197,94,0.06)"
                        : "rgba(255,255,255,0.035)",
                      border: f.completed
                        ? "1px solid rgba(34,197,94,0.25)"
                        : "1px solid rgba(168,140,255,0.14)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: f.completed ? "rgba(34,197,94,0.18)" : "transparent",
                        border: f.completed ? "1px solid rgba(34,197,94,0.40)" : "1px solid rgba(168,140,255,0.25)",
                      }}
                    >
                      {f.completed && <Check size={10} style={{ color: "#22C55E" }} />}
                    </div>
                    <p
                      className={`text-sm flex-1 ${f.completed ? "line-through" : ""}`}
                      style={{ color: f.completed ? "#6E6A87" : "#F5F4FC" }}
                    >
                      {f.title}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${OWNER_GRADIENT[DEMO_TEAM.find((m) => m.name === f.ownerName)?.color ?? "violet"]} flex items-center justify-center text-[8px] font-bold text-white`}>
                        {f.ownerName.split(" ").map((p) => p[0]).join("")}
                      </div>
                      <span className="text-[10px]" style={{ color: "#ABA6C9" }}>{f.ownerName}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "activity" && (
              <GlassPanel className="overflow-hidden">
                <div className="divide-y" style={{ borderColor: "rgba(168,140,255,0.10)" }}>
                  {DEMO_ACTIVITY.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid rgba(168,140,255,0.06)" }}
                    >
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${OWNER_GRADIENT[entry.actorColor] ?? "from-violet-500 to-violet-700"} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                        {entry.actorInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xs font-semibold" style={{ color: "#F5F4FC" }}>
                            {entry.actorName}
                          </span>
                          <span className="text-[10px] flex-shrink-0" style={{ color: "#6E6A87" }}>{entry.time}</span>
                        </div>
                        <p className="text-xs mt-0.5 leading-snug" style={{ color: "#ABA6C9" }}>{entry.detail}</p>
                      </div>
                      <span className="text-base flex-shrink-0 opacity-60">
                        {ACTION_ICONS[entry.action] ?? "·"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </GlassPanel>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Signup nudge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(34,211,238,0.06) 100%)",
            border: "1px solid rgba(124,58,237,0.30)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.20)",
          }}
        >
          <div className="relative">
            <p className="text-sm font-bold mb-1" style={{ color: "#F5F4FC" }}>
              This is a live demo workspace — yours will be built from your own meetings.
            </p>
            <p className="text-xs" style={{ color: "#ABA6C9" }}>
              Paste any transcript and get a full execution brief in under 30 seconds.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 relative">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all whitespace-nowrap hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)",
                boxShadow: "0 12px 32px rgba(124,58,237,0.40)",
              }}
            >
              Start free
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/sign-in"
              className="text-sm transition-colors whitespace-nowrap"
              style={{ color: "#ABA6C9" }}
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Task drawer */}
      <TaskDrawer task={activeTask} onClose={() => setActiveTask(null)} />
    </div>
  );
}
