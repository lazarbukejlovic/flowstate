"use client";

import { motion } from "framer-motion";
import type { Task } from "@prisma/client";

const PRIORITY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  HIGH:   { color: "#FFB89E", bg: "rgba(255,107,74,0.14)", border: "rgba(255,107,74,0.32)" },
  MEDIUM: { color: "#FDD27E", bg: "rgba(245,165,36,0.14)", border: "rgba(245,165,36,0.32)" },
  LOW:    { color: "#86EFAC", bg: "rgba(34,197,94,0.14)",  border: "rgba(34,197,94,0.32)" },
};

const PRIORITY_DOTS: Record<string, { bg: string; glow: string }> = {
  HIGH:   { bg: "#FF6B4A", glow: "rgba(255,107,74,0.6)" },
  MEDIUM: { bg: "#F5A524", glow: "rgba(245,165,36,0.6)" },
  LOW:    { bg: "#22C55E", glow: "rgba(34,197,94,0.6)" },
};

function formatDeadline(date: Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
  isDragging?: boolean;
}

const NEXT_STATUS: Record<Task["status"], Task["status"] | null> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  BLOCKED: "IN_PROGRESS",
  DONE: null,
};

export function TaskCard({ task, onStatusChange, onTaskClick, isDragging }: TaskCardProps) {
  const deadlineText = formatDeadline(task.deadline);
  const isOverdue =
    task.deadline && new Date(task.deadline) < new Date() && task.status !== "DONE";
  const priStyle = PRIORITY_STYLES[task.priority];
  const priDot   = PRIORITY_DOTS[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      onClick={() => onTaskClick?.(task)}
      className="rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all group"
      style={{
        background: isDragging
          ? "linear-gradient(180deg, rgba(124,58,237,0.12), rgba(34,211,238,0.06))"
          : "rgba(255,255,255,0.045)",
        border: isDragging
          ? "1px solid rgba(168,140,255,0.40)"
          : "1px solid rgba(168,140,255,0.16)",
        backdropFilter: "blur(12px)",
        boxShadow: isDragging
          ? "0 24px 60px rgba(0,0,0,0.55), 0 0 32px rgba(124,58,237,0.30)"
          : "0 8px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* Priority dot + title */}
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: priDot.bg, boxShadow: `0 0 6px ${priDot.glow}` }}
        />
        <p className="text-sm font-medium leading-snug flex-1" style={{ color: "#F5F4FC" }}>
          {task.title}
        </p>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "#ABA6C9", marginLeft: 18 }}>
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap mt-3">
        {task.ownerName && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7C3AED,#5B2BD6)" }}>
              {task.ownerName.charAt(0)}
            </div>
            <span className="text-[11px]" style={{ color: "#ABA6C9" }}>{task.ownerName}</span>
          </div>
        )}
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
          style={{ color: priStyle.color, background: priStyle.bg, border: `1px solid ${priStyle.border}` }}
        >
          {task.priority}
        </span>
        {deadlineText && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={
              isOverdue
                ? { color: "#FFB89E", background: "rgba(255,107,74,0.14)", border: "1px solid rgba(255,107,74,0.32)" }
                : { color: "#ABA6C9", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,140,255,0.10)" }
            }
          >
            {deadlineText}
          </span>
        )}
      </div>

      {/* Quick action */}
      {onStatusChange && NEXT_STATUS[task.status] && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const next = NEXT_STATUS[task.status];
            if (next) onStatusChange(task.id, next);
          }}
          className="mt-3 w-full text-[11px] py-1.5 rounded-lg transition-all"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(168,140,255,0.14)",
            color: "#ABA6C9",
          }}
        >
          Move to {NEXT_STATUS[task.status]?.replace("_", " ").toLowerCase()} →
        </button>
      )}
    </motion.div>
  );
}
