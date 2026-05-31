"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { DemoTask } from "@/lib/demo/demo-data";

type Status = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

const COLUMNS: { id: Status; label: string; color: string; dot: string; glow: string }[] = [
  { id: "TODO",        label: "To Do",       color: "#ABA6C9", dot: "#ABA6C9", glow: "rgba(171,166,201,0.30)" },
  { id: "IN_PROGRESS", label: "In Progress", color: "#60A5FA", dot: "#60A5FA", glow: "rgba(96,165,250,0.60)" },
  { id: "BLOCKED",     label: "Blocked",     color: "#FFB89E", dot: "#FF6B4A", glow: "rgba(255,107,74,0.60)" },
  { id: "DONE",        label: "Done",        color: "#86EFAC", dot: "#22C55E", glow: "rgba(34,197,94,0.60)" },
];

const PRIORITY_DOTS: Record<string, { bg: string; glow: string }> = {
  HIGH:   { bg: "#FF6B4A", glow: "rgba(255,107,74,0.6)" },
  MEDIUM: { bg: "#F5A524", glow: "rgba(245,165,36,0.6)" },
  LOW:    { bg: "#22C55E", glow: "rgba(34,197,94,0.6)" },
};

const PRIORITY_BADGE: Record<string, { color: string; bg: string; border: string }> = {
  HIGH:   { color: "#FFB89E", bg: "rgba(255,107,74,0.14)", border: "rgba(255,107,74,0.32)" },
  MEDIUM: { color: "#FDD27E", bg: "rgba(245,165,36,0.14)", border: "rgba(245,165,36,0.32)" },
  LOW:    { color: "#86EFAC", bg: "rgba(34,197,94,0.14)",  border: "rgba(34,197,94,0.32)" },
};

const OWNER_GRADIENT: Record<string, string> = {
  violet:  "from-violet-500 to-violet-700",
  blue:    "from-blue-500 to-blue-700",
  emerald: "from-emerald-500 to-emerald-700",
  amber:   "from-amber-500 to-amber-700",
};

function DemoTaskCard({ task, onClick }: { task: DemoTask; onClick: (t: DemoTask) => void }) {
  const confColor =
    task.aiConfidence >= 90 ? "#22C55E" :
    task.aiConfidence >= 70 ? "#F5A524" : "#FF6B4A";
  const pri = PRIORITY_BADGE[task.priority];
  const dot = PRIORITY_DOTS[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onClick={() => onClick(task)}
      className="rounded-xl p-3.5 cursor-pointer transition-all group"
      style={{
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(168,140,255,0.16)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      }}
    >
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: dot.bg, boxShadow: `0 0 6px ${dot.glow}` }} />
        <p className="text-[13px] font-medium leading-snug flex-1" style={{ color: "#F5F4FC" }}>
          {task.title}
        </p>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap" style={{ marginLeft: 16 }}>
        <div className="flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${OWNER_GRADIENT[task.ownerColor] ?? "from-violet-500 to-violet-700"} flex items-center justify-center text-[8px] font-bold text-white`}>
            {task.ownerInitials}
          </div>
          <span className="text-[10px]" style={{ color: "#ABA6C9" }}>{task.ownerName.split(" ")[0]}</span>
        </div>

        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
          style={{ color: pri.color, background: pri.bg, border: `1px solid ${pri.border}` }}>
          {task.priority}
        </span>

        {task.deadline && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#ABA6C9",
              border: "1px solid rgba(168,140,255,0.10)",
            }}>
            {task.deadline}
          </span>
        )}

        <span className="ml-auto text-[9px] font-bold" style={{ color: confColor }}>
          {task.aiConfidence}%
        </span>
      </div>
    </motion.div>
  );
}

interface DemoBoardProps {
  tasks: DemoTask[];
  onTaskClick: (task: DemoTask) => void;
}

export function DemoBoard({ tasks, onTaskClick }: DemoBoardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2 h-2 rounded-full"
                style={{ background: col.dot, boxShadow: `0 0 6px ${col.glow}` }} />
              <span className="text-xs font-semibold" style={{ color: col.color }}>{col.label}</span>
              <span
                className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#ABA6C9",
                  border: "1px solid rgba(168,140,255,0.10)",
                }}>
                {colTasks.length}
              </span>
            </div>

            <div className="min-h-[120px] rounded-xl p-2 space-y-2"
              style={{
                border: "1px dashed rgba(168,140,255,0.16)",
                background: "rgba(255,255,255,0.015)",
              }}>
              <AnimatePresence>
                {colTasks.map((task) => (
                  <DemoTaskCard key={task.id} task={task} onClick={onTaskClick} />
                ))}
              </AnimatePresence>

              {colTasks.length === 0 && (
                <div className="flex items-center justify-center h-20 text-[11px]" style={{ color: "#6E6A87" }}>
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
