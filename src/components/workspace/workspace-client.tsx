"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ListChecks, ShieldAlert, Activity, CheckSquare, Check } from "lucide-react";
import type { Task, Decision } from "@prisma/client";
import { ActionBoard } from "./action-board";
import { WorkspaceTaskDrawer } from "./workspace-task-drawer";
import { GlassPanel, SeverityTag, StatusPill } from "@/components/ui/primitives";

type Tab = "board" | "decisions" | "risks" | "followups" | "activity";

interface Risk {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  mitigation: string | null;
}
interface FollowUp {
  id: string;
  title: string;
  ownerName: string | null;
  completed: boolean;
}
interface ActivityLog {
  id: string;
  actorName: string | null;
  action: string;
  detail: string | null;
  createdAt: Date | string;
}
interface WorkspaceClientProps {
  workspaceId: string;
  tasks: Task[];
  decisions: Decision[];
  risks: Risk[];
  followUps: FollowUp[];
  activityLogs: ActivityLog[];
}

const ACTION_ICONS: Record<string, string> = {
  created_workspace: "🚀",
  updated_task:      "✓",
  added_task:        "＋",
  added_decision:    "◆",
  completed_task:    "✓",
  blocked_task:      "⚠",
};

function timeAgo(date: Date | string): string {
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

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function WorkspaceClient({
  workspaceId,
  tasks,
  decisions,
  risks,
  followUps,
  activityLogs,
}: WorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("board");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const openFollowUps = followUps.filter((f) => !f.completed).length;

  const TABS: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "board",     label: "Board",      icon: ListChecks,  count: tasks.filter((t) => t.status !== "DONE").length },
    { id: "decisions", label: "Decisions",  icon: Brain,       count: decisions.length },
    { id: "risks",     label: "Risks",      icon: ShieldAlert, count: risks.length },
    { id: "followups", label: "Follow-ups", icon: CheckSquare, count: openFollowUps },
    { id: "activity",  label: "Activity",   icon: Activity,    count: activityLogs.length },
  ];

  return (
    <>
      {/* Tab bar */}
      <div
        className="flex items-center gap-1 overflow-x-auto mb-6"
        style={{ borderBottom: "1px solid rgba(168,140,255,0.16)", paddingBottom: 1 }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all -mb-px"
            style={{
              borderBottom: activeTab === tab.id ? "2px solid #A855F7" : "2px solid transparent",
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
      </div>

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
            <ActionBoard
              tasks={tasks}
              workspaceId={workspaceId}
              onTaskClick={setActiveTask}
            />
          )}

          {activeTab === "decisions" && (
            <div className="space-y-3">
              {decisions.length === 0 ? (
                <p className="text-sm py-8 text-center" style={{ color: "#ABA6C9" }}>No decisions captured.</p>
              ) : (
                decisions.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <GlassPanel className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-1 flex-shrink-0 self-stretch rounded-full mt-1"
                          style={{ background: "linear-gradient(180deg,#A855F7,#7C3AED)", boxShadow: "0 0 12px rgba(168,85,247,0.40)" }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="text-sm font-semibold" style={{ color: "#F5F4FC" }}>{d.title}</p>
                            <StatusPill kind="decided" dot={false} />
                          </div>
                          {d.context && (
                            <p className="text-xs leading-relaxed mb-3" style={{ color: "#ABA6C9" }}>{d.context}</p>
                          )}
                          {d.ownerName && (
                            <span className="text-[11px]" style={{ color: "#C4B5FD" }}>Owner: {d.ownerName}</span>
                          )}
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "risks" && (
            <div className="space-y-3">
              {risks.length === 0 ? (
                <p className="text-sm py-8 text-center" style={{ color: "#ABA6C9" }}>No risks detected.</p>
              ) : (
                risks.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <GlassPanel glow={r.severity === "HIGH" ? "coral" : "none"} className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <ShieldAlert size={15} className="flex-shrink-0 mt-0.5" style={{
                          color: r.severity === "HIGH" ? "#FF6B4A" :
                                 r.severity === "MEDIUM" ? "#F5A524" : "#22C55E",
                        }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-sm font-semibold" style={{ color: "#F5F4FC" }}>{r.title}</p>
                            <SeverityTag level={r.severity} />
                          </div>
                        </div>
                      </div>
                      {r.mitigation && (
                        <div
                          className="ml-7 px-3 py-2.5 rounded-lg"
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(168,140,255,0.12)",
                          }}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "#6E6A87" }}>
                            Mitigation
                          </span>
                          <p className="text-xs leading-relaxed" style={{ color: "#F5F4FC" }}>{r.mitigation}</p>
                        </div>
                      )}
                    </GlassPanel>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "followups" && (
            <div className="space-y-2">
              {followUps.length === 0 ? (
                <p className="text-sm py-8 text-center" style={{ color: "#ABA6C9" }}>No follow-ups tracked.</p>
              ) : (
                followUps.map((f, i) => (
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
                    {f.ownerName && (
                      <span className="text-[11px] flex-shrink-0" style={{ color: "#ABA6C9" }}>{f.ownerName}</span>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <GlassPanel className="overflow-hidden">
              {activityLogs.length === 0 ? (
                <p className="text-sm py-8 text-center" style={{ color: "#ABA6C9" }}>No activity yet.</p>
              ) : (
                <div>
                  {activityLogs.map((entry, i, arr) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]"
                      style={i < arr.length - 1 ? { borderBottom: "1px solid rgba(168,140,255,0.08)" } : undefined}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#7C3AED,#5B2BD6)" }}>
                        {entry.actorName?.charAt(0) ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xs font-semibold" style={{ color: "#F5F4FC" }}>
                            {entry.actorName ?? "System"}
                          </span>
                          <span className="text-[10px] flex-shrink-0" style={{ color: "#6E6A87" }}>
                            {timeAgo(entry.createdAt)}
                          </span>
                        </div>
                        {entry.detail && (
                          <p className="text-xs mt-0.5 leading-snug" style={{ color: "#ABA6C9" }}>{entry.detail}</p>
                        )}
                      </div>
                      <span className="text-base flex-shrink-0 opacity-60">
                        {ACTION_ICONS[entry.action] ?? "·"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassPanel>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Task drawer */}
      <WorkspaceTaskDrawer task={activeTask} onClose={() => setActiveTask(null)} />
    </>
  );
}
