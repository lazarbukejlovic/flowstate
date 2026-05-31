import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LiquidNav } from "@/components/layout/liquid-nav";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { WorkspaceClient } from "@/components/workspace/workspace-client";
import { Brain, ListChecks, ShieldAlert, CheckSquare, ArrowLeft } from "lucide-react";

async function getWorkspace(id: string) {
  if (id === "demo") {
    return prisma.workspace.findFirst({
      where: { isDemo: true },
      include: {
        tasks: { orderBy: { createdAt: "asc" } },
        decisions: { orderBy: { createdAt: "asc" } },
        activityLogs: { orderBy: { createdAt: "desc" }, take: 20 },
        meetingSource: { include: { risks: true, followUps: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  return prisma.workspace.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { createdAt: "asc" } },
      decisions: { orderBy: { createdAt: "asc" } },
      activityLogs: { orderBy: { createdAt: "desc" }, take: 20 },
      meetingSource: { include: { risks: true, followUps: true } },
    },
  });
}

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getWorkspace(id);

  if (!workspace) notFound();

  const openTasks = workspace.tasks.filter((t) => t.status !== "DONE").length;
  const doneTasks = workspace.tasks.filter((t) => t.status === "DONE").length;
  const total = workspace.tasks.length;
  const progress = total > 0 ? Math.round((doneTasks / total) * 100) : 0;
  const risks = workspace.meetingSource?.risks ?? [];
  const followUps = workspace.meetingSource?.followUps ?? [];
  const openFollowUps = followUps.filter((f) => !f.completed).length;

  const metrics = [
    { icon: ListChecks,  label: "Open tasks", value: openTasks,                  color: "#22D3EE", glow: "rgba(34,211,238,0.18)" },
    { icon: Brain,       label: "Decisions",  value: workspace.decisions.length, color: "#A855F7", glow: "rgba(168,85,247,0.18)" },
    { icon: ShieldAlert, label: "Risks",      value: risks.length,               color: "#FF6B4A", glow: "rgba(255,107,74,0.20)" },
    { icon: CheckSquare, label: "Follow-ups", value: openFollowUps,              color: "#22C55E", glow: "rgba(34,197,94,0.18)" },
  ];

  return (
    <>
      <AnimatedBackground />
      <LiquidNav />
      <main className="min-h-screen pt-20 pb-16 relative">
        <div className="max-w-7xl mx-auto px-5 pt-6 pb-12">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#ABA6C9" }}>
            <Link href="/dashboard" className="flex items-center gap-1.5 transition-colors hover:opacity-80">
              <ArrowLeft size={12} />
              Meeting workspaces
            </Link>
            <span style={{ color: "#6E6A87" }}>/</span>
            <span className="truncate max-w-xs" style={{ color: "#F5F4FC" }}>{workspace.title}</span>
          </div>

          {/* Workspace header */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-5 mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="font-display text-2xl font-bold tracking-[-0.02em]" style={{ color: "#F5F4FC" }}>
                  {workspace.title}
                </h1>
                {workspace.isDemo && (
                  <span
                    className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: "rgba(124,58,237,0.14)",
                      color: "#C4B5FD",
                      border: "1px solid rgba(124,58,237,0.32)",
                    }}
                  >
                    Demo workspace
                  </span>
                )}
              </div>
              {workspace.summary && (
                <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#F5F4FC" }}>{workspace.summary}</p>
              )}
              {workspace.meetingSource?.meetingTitle && (
                <p className="text-xs mt-1" style={{ color: "#ABA6C9" }}>
                  Source: {workspace.meetingSource.meetingTitle}
                </p>
              )}
            </div>

            {/* Progress */}
            <div className="flex-shrink-0 w-36">
              <div className="text-right mb-1.5">
                <span className="text-xs" style={{ color: "#ABA6C9" }}>{doneTasks}/{total} done</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden mb-1.5"
                style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#7C3AED,#22D3EE)",
                    boxShadow: "0 0 12px rgba(124,58,237,0.50)",
                  }}
                />
              </div>
              <div className="text-right">
                <span className="text-xs" style={{ color: "#ABA6C9" }}>{progress}% complete</span>
              </div>
            </div>
          </div>

          {/* Metric strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.045)",
                  border: "1px solid rgba(168,140,255,0.16)",
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 16px 40px rgba(0,0,0,0.35), 0 0 24px ${m.glow}`,
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${m.color}1A`, border: `1px solid ${m.color}40` }}>
                  <m.icon size={15} style={{ color: m.color }} />
                </div>
                <div>
                  <p className="font-display text-xl font-bold leading-none tracking-[-0.02em]"
                    style={{ color: m.color }}>{m.value}</p>
                  <p className="text-[10px] mt-1" style={{ color: "#ABA6C9" }}>{m.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabbed workspace client */}
          <WorkspaceClient
            workspaceId={workspace.id}
            tasks={workspace.tasks}
            decisions={workspace.decisions}
            risks={risks.map((r) => ({ ...r, severity: r.severity as "LOW" | "MEDIUM" | "HIGH" }))}
            followUps={followUps}
            activityLogs={workspace.activityLogs}
          />
        </div>
      </main>
    </>
  );
}
