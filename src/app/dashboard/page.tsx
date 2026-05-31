import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LiquidNav } from "@/components/layout/liquid-nav";
import { AnimatedBackground } from "@/components/landing/animated-background";
import {
  Plus,
  ArrowRight,
  Brain,
  ListChecks,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

async function getDashboardData(userId: string) {
  const [workspaces, taskStats] = await Promise.all([
    prisma.workspace.findMany({
      where: { OR: [{ createdById: userId }, { isDemo: true }] },
      include: {
        tasks: { select: { id: true, status: true, priority: true } },
        decisions: { select: { id: true } },
        meetingSource: {
          select: {
            meetingTitle: true,
            risks: { select: { id: true, severity: true } },
          },
        },
        activityLogs: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.task.aggregate({
      where: { workspace: { OR: [{ createdById: userId }, { isDemo: true }] } },
      _count: { _all: true },
    }),
  ]);

  const openTasks = workspaces.flatMap((w) =>
    w.tasks.filter((t) => t.status !== "DONE")
  ).length;

  const highPriorityOpen = workspaces.flatMap((w) =>
    w.tasks.filter((t) => t.status !== "DONE" && t.priority === "HIGH")
  ).length;

  const totalDecisions = workspaces.reduce((sum, w) => sum + w.decisions.length, 0);
  const highRisks = workspaces.flatMap((w) => (w.meetingSource?.risks ?? []).filter((r) => r.severity === "HIGH")).length;

  return {
    workspaces,
    openTasks,
    highPriorityOpen,
    totalDecisions,
    totalTasks: taskStats._count._all,
    highRisks,
  };
}

function WorkspaceCard({
  workspace,
}: {
  workspace: Awaited<ReturnType<typeof getDashboardData>>["workspaces"][0];
}) {
  const openTasks = workspace.tasks.filter((t) => t.status !== "DONE").length;
  const doneTasks = workspace.tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = workspace.tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const blockedTasks = workspace.tasks.filter((t) => t.status === "BLOCKED").length;
  const total = workspace.tasks.length;
  const progress = total > 0 ? Math.round((doneTasks / total) * 100) : 0;
  const hasHighRisk = (workspace.meetingSource?.risks ?? []).some((r) => r.severity === "HIGH");

  return (
    <Link href={`/workspaces/${workspace.id}`}>
      <div
        className="group relative rounded-2xl border border-white/[0.08] p-5 hover:border-violet-500/40 transition-all duration-200 cursor-pointer overflow-hidden h-full flex flex-col"
        style={{
          background: "linear-gradient(180deg, rgba(20,28,48,0.65) 0%, rgba(10,14,26,0.65) 100%)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
          style={{ background: "radial-gradient(ellipse at top left, rgba(124,58,237,0.12) 0%, transparent 60%)" }} />

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3 relative">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate group-hover:text-violet-200 transition-colors">
              {workspace.title}
            </h3>
            <p className="text-[11px] text-white/40 mt-0.5 truncate">
              {workspace.meetingSource?.meetingTitle ?? "Meeting workspace"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {workspace.isDemo && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25 font-semibold">
                Demo
              </span>
            )}
            {hasHighRisk && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/12 text-orange-300 border border-orange-500/25 font-semibold">
                Risk
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap relative">
          <div className="flex items-center gap-1.5">
            <ListChecks size={11} className="text-cyan-300" />
            <span className="text-[11px] text-white/55">{total} tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Brain size={11} className="text-violet-300" />
            <span className="text-[11px] text-white/55">{workspace.decisions.length} decisions</span>
          </div>
          {blockedTasks > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/12 text-red-300 border border-red-500/25 font-semibold">
              {blockedTasks} blocked
            </span>
          )}
          {inProgressTasks > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/12 text-blue-300 border border-blue-500/25 font-semibold">
              {inProgressTasks} active
            </span>
          )}
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mb-3 relative">
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-gradient-to-r from-violet-500 to-cyan-400"
                style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(124,58,237,0.6)" }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-white/40">{progress}% complete</span>
              <span className={`text-[10px] font-medium ${openTasks > 0 ? "text-orange-300" : "text-emerald-300"}`}>
                {openTasks > 0 ? `${openTasks} open` : "All done"}
              </span>
            </div>
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between relative">
          <div className="flex items-center gap-1">
            {workspace.tasks.filter((t) => t.status === "DONE").slice(0, 5).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ))}
            {workspace.tasks.filter((t) => t.status === "IN_PROGRESS").slice(0, 3).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            ))}
            {workspace.tasks.filter((t) => t.status === "TODO").slice(0, 3).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
            ))}
          </div>
          <span className="text-[10px] text-violet-300/0 group-hover:text-violet-300 transition-all flex items-center gap-1 font-medium">
            Open <ArrowRight size={9} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  const { workspaces, openTasks, highPriorityOpen, totalDecisions, totalTasks, highRisks } =
    await getDashboardData(userId);

  const hoursSaved = Math.round(workspaces.length * 1.5);
  const hasWorkspaces = workspaces.length > 0;

  const metrics = [
    {
      icon: Zap,
      label: "Workspaces",
      value: workspaces.length,
      sub: "All time",
      color: "text-violet-300",
      bg: "bg-violet-500/10 border-violet-500/25",
      iconBg: "bg-violet-500/15 border-violet-500/25",
    },
    {
      icon: ListChecks,
      label: "Open tasks",
      value: openTasks,
      sub: `${highPriorityOpen} high priority`,
      color: "text-cyan-300",
      bg: "bg-cyan-500/10 border-cyan-500/25",
      iconBg: "bg-cyan-500/15 border-cyan-500/25",
    },
    {
      icon: Brain,
      label: "Decisions",
      value: totalDecisions,
      sub: "Captured",
      color: "text-violet-300",
      bg: "bg-violet-500/10 border-violet-500/25",
      iconBg: "bg-violet-500/15 border-violet-500/25",
    },
    {
      icon: TrendingUp,
      label: "Hours saved",
      value: `~${hoursSaved}h`,
      sub: "vs. manual setup",
      color: "text-emerald-300",
      bg: "bg-emerald-500/10 border-emerald-500/25",
      iconBg: "bg-emerald-500/15 border-emerald-500/25",
    },
  ];

  return (
    <>
      <AnimatedBackground />
      <LiquidNav />
      <main className="min-h-screen pt-20 pb-16 relative">
        <div className="max-w-7xl mx-auto px-5 py-10">

          {/* ─── Header ─── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 animate-pulse" />
                <span className="text-xs text-white/40 font-medium tracking-wide">Meeting workspaces · Active</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-white tracking-[-0.025em]">
                Good to see you, {firstName}.
              </h1>
              <p className="text-sm text-white/50 mt-1">
                {hasWorkspaces
                  ? `${openTasks} open tasks across ${workspaces.length} workspaces`
                  : "Your delivery command center is ready."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/demo"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/[0.10] text-white/65 hover:text-white hover:bg-white/[0.04] text-xs font-medium transition-all"
              >
                View demo
              </Link>
              <Link
                href="/dashboard/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/30"
              >
                <Plus size={14} />
                New workspace
              </Link>
            </div>
          </div>

          {/* ─── Metrics ─── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-white/[0.08] p-4 flex items-start gap-3"
                style={{
                  background: "linear-gradient(180deg, rgba(20,28,48,0.55) 0%, rgba(10,14,26,0.55) 100%)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                }}
              >
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${m.iconBg}`}>
                  <m.icon size={14} className={m.color} />
                </div>
                <div>
                  <p className="text-[11px] text-white/40 mb-0.5">{m.label}</p>
                  <p className={`font-display text-2xl font-bold leading-none ${m.color} tracking-[-0.02em]`}>{m.value}</p>
                  <p className="text-[10px] text-white/35 mt-1">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Alert strip ─── */}
          {(highRisks > 0 || (highPriorityOpen > 0 && hasWorkspaces)) && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-500/25 mb-6"
              style={{ background: "rgba(249,115,22,0.06)" }}>
              <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0 shadow-sm shadow-orange-400/50" />
              <p className="text-xs text-orange-200">
                {highRisks > 0 && `${highRisks} high-severity risk${highRisks > 1 ? "s" : ""} detected`}
                {highRisks > 0 && highPriorityOpen > 0 && " · "}
                {highPriorityOpen > 0 && `${highPriorityOpen} high-priority task${highPriorityOpen > 1 ? "s" : ""} still open`}
              </p>
            </div>
          )}

          {/* ─── Workspaces ─── */}
          {!hasWorkspaces ? (
            <div className="rounded-2xl border border-dashed border-white/[0.10] p-16 text-center"
              style={{
                background: "linear-gradient(180deg, rgba(20,28,48,0.45) 0%, rgba(10,14,26,0.45) 100%)",
                backdropFilter: "blur(16px)",
              }}>
              <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-5"
                style={{ boxShadow: "0 0 24px rgba(124,58,237,0.30)" }}>
                <Zap size={22} className="text-violet-300 fill-violet-300" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">No workspaces yet</h3>
              <p className="text-sm text-white/50 mb-6 max-w-sm mx-auto">
                Paste any meeting transcript and Flowstate AI will extract every decision, task, and risk in seconds.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/30"
                >
                  <Plus size={14} />
                  Create first workspace
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.10] text-white/65 hover:text-white hover:bg-white/[0.04] text-sm font-medium transition-all"
                >
                  See demo first
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                  Workspaces
                </h2>
                <span className="text-xs text-white/35">{workspaces.length} total</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workspaces.map((ws) => (
                  <WorkspaceCard key={ws.id} workspace={ws} />
                ))}

                {/* Add new card */}
                <Link href="/dashboard/new">
                  <div className="rounded-2xl border border-dashed border-white/[0.10] p-5 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all cursor-pointer h-full flex flex-col items-center justify-center gap-3 min-h-[160px] group"
                    style={{ background: "rgba(255,255,255,0.015)" }}>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.10] group-hover:border-violet-500/30 group-hover:bg-violet-500/10 flex items-center justify-center transition-all">
                      <Plus size={18} className="text-white/45 group-hover:text-violet-300 transition-colors" />
                    </div>
                    <p className="text-sm text-white/50 group-hover:text-white/75 transition-colors font-medium">
                      New workspace
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* ─── Quick actions footer ─── */}
          {hasWorkspaces && (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: Clock,
                  title: "New from transcript",
                  desc: "Paste any meeting text",
                  href: "/dashboard/new",
                  accent: "text-violet-300",
                },
                {
                  icon: CheckCircle2,
                  title: "View live demo",
                  desc: "Q2 Product Launch Sync",
                  href: "/demo",
                  accent: "text-cyan-300",
                },
                {
                  icon: TrendingUp,
                  title: `${totalTasks} tasks extracted`,
                  desc: "Across all your workspaces",
                  href: "#",
                  accent: "text-emerald-300",
                },
              ].map((action) => (
                <Link key={action.title} href={action.href}>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/[0.08] hover:border-violet-500/35 transition-all group"
                    style={{
                      background: "linear-gradient(180deg, rgba(20,28,48,0.55) 0%, rgba(10,14,26,0.55) 100%)",
                      backdropFilter: "blur(12px)",
                    }}>
                    <action.icon size={16} className={`${action.accent} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors truncate">
                        {action.title}
                      </p>
                      <p className="text-[11px] text-white/40 truncate">{action.desc}</p>
                    </div>
                    <ArrowRight size={13} className="ml-auto text-white/25 group-hover:text-violet-300 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
