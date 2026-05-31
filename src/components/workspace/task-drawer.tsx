"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Quote, Brain, Calendar, User, Zap } from "lucide-react";
import type { DemoTask } from "@/lib/demo/demo-data";

const PRIORITY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  HIGH:   { color: "#FFB89E", bg: "rgba(255,107,74,0.14)", border: "rgba(255,107,74,0.32)" },
  MEDIUM: { color: "#FDD27E", bg: "rgba(245,165,36,0.14)", border: "rgba(245,165,36,0.32)" },
  LOW:    { color: "#86EFAC", bg: "rgba(34,197,94,0.14)",  border: "rgba(34,197,94,0.32)" },
};

const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  TODO:        { color: "#ABA6C9", bg: "rgba(255,255,255,0.04)", border: "rgba(168,140,255,0.16)" },
  IN_PROGRESS: { color: "#93C5FD", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.30)" },
  BLOCKED:     { color: "#FFB89E", bg: "rgba(255,107,74,0.14)",  border: "rgba(255,107,74,0.32)" },
  DONE:        { color: "#86EFAC", bg: "rgba(34,197,94,0.14)",   border: "rgba(34,197,94,0.32)" },
};

const OWNER_COLORS: Record<string, string> = {
  violet:  "bg-violet-600",
  blue:    "bg-blue-600",
  emerald: "bg-emerald-600",
  amber:   "bg-amber-600",
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? "#22C55E" : value >= 70 ? "#F5A524" : "#FF6B4A";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{value}%</span>
    </div>
  );
}

interface TaskDrawerProps {
  task: DemoTask | null;
  onClose: () => void;
}

export function TaskDrawer({ task, onClose }: TaskDrawerProps) {
  return (
    <AnimatePresence>
      {task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(7,6,15,0.65)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 flex flex-col overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(15,11,36,0.97) 0%, rgba(7,6,15,0.97) 100%)",
              borderLeft: "1px solid rgba(168,140,255,0.18)",
              boxShadow: "-40px 0 100px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.15)",
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 flex items-start gap-3"
              style={{ borderBottom: "1px solid rgba(168,140,255,0.12)" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {(() => {
                    const p = PRIORITY_COLORS[task.priority];
                    return (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                        style={{ color: p.color, background: p.bg, border: `1px solid ${p.border}` }}>
                        {task.priority}
                      </span>
                    );
                  })()}
                  {(() => {
                    const s = STATUS_COLORS[task.status];
                    return (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                        style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                        {task.status.replace("_", " ")}
                      </span>
                    );
                  })()}
                </div>
                <h2 className="text-sm font-bold leading-snug" style={{ color: "#F5F4FC" }}>{task.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all mt-1"
                style={{ color: "#ABA6C9", background: "rgba(255,255,255,0.04)" }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Owner + Deadline */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(168,140,255,0.14)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <User size={10} style={{ color: "#ABA6C9" }} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#ABA6C9" }}>Owner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${OWNER_COLORS[task.ownerColor] ?? "bg-violet-600"} flex items-center justify-center text-[9px] font-bold text-white`}>
                      {task.ownerInitials}
                    </div>
                    <span className="text-xs truncate" style={{ color: "#F5F4FC" }}>{task.ownerName}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(168,140,255,0.14)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Calendar size={10} style={{ color: "#ABA6C9" }} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#ABA6C9" }}>Due</span>
                  </div>
                  <span className="text-xs" style={{ color: "#F5F4FC" }}>{task.deadline}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#ABA6C9" }}>Description</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#F5F4FC" }}>{task.description}</p>
              </div>

              {/* Source Quote */}
              <div className="rounded-xl p-4"
                style={{
                  background: "rgba(124,58,237,0.10)",
                  border: "1px solid rgba(124,58,237,0.32)",
                  boxShadow: "0 0 24px rgba(124,58,237,0.15)",
                }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Quote size={11} style={{ color: "#A855F7" }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#C4B5FD" }}>From the transcript</span>
                </div>
                <p className="text-[13px] italic leading-relaxed" style={{ color: "#F5F4FC" }}>&ldquo;{task.sourceQuote}&rdquo;</p>
              </div>

              {/* AI Confidence */}
              <div className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(168,140,255,0.14)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={12} style={{ color: "#A855F7" }} />
                  <span className="text-xs font-semibold" style={{ color: "#ABA6C9" }}>AI Extraction Confidence</span>
                </div>
                <ConfidenceBar value={task.aiConfidence} />
                <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "#ABA6C9" }}>{task.aiReason}</p>
              </div>

              {/* Related Decision */}
              {task.relatedDecision && (
                <div className="rounded-xl p-4"
                  style={{
                    background: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.30)",
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={11} style={{ color: "#22D3EE" }} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#67E8F9" }}>Linked decision</span>
                  </div>
                  <p className="text-[13px] leading-snug" style={{ color: "#F5F4FC" }}>{task.relatedDecision}</p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
