"use client";

import { motion } from "framer-motion";
import type { ActivityLog } from "@prisma/client";

interface ActivityLogProps {
  logs: ActivityLog[];
}

function timeAgo(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

const ACTION_ICONS: Record<string, string> = {
  created_workspace: "🚀",
  updated_task: "✓",
  added_task: "＋",
  added_decision: "◆",
  completed_task: "✓",
  default: "·",
};

export function ActivityLogPanel({ logs }: ActivityLogProps) {
  if (logs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-white">Activity</h3>
        <span className="ml-auto text-xs text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
          {logs.length}
        </span>
      </div>

      <div className="space-y-0">
        {logs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
          >
            <div className="w-5 h-5 rounded-full bg-white/[0.05] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
              {ACTION_ICONS[log.action] ?? ACTION_ICONS.default}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium text-white/60">
                  {log.actorName ?? "System"}
                </span>
                <span className="text-[10px] text-white/25 flex-shrink-0">
                  {timeAgo(log.createdAt)}
                </span>
              </div>
              {log.detail && (
                <p className="text-xs text-white/35 mt-0.5 leading-snug truncate">
                  {log.detail}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
