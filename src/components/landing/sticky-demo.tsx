"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  FileText, Brain, CheckCircle2, Zap, ShieldAlert,
  ListChecks, Clock, User, BarChart3, Activity,
} from "lucide-react";

/* ── Right-side visual panels ─────────────────────────────── */

function MeetingSourcePanel() {
  const lines = [
    "[00:00] Maya: Alright, let's lock the launch date.",
    "[00:08] Daniel: I can have the beta invite flow ready by June 5th.",
    "[00:21] Sofia: Landing page copy freezes this Friday.",
    "[00:34] Maya: June 15th is non-negotiable. Everyone aligned?",
    "[00:45] Priya: We need to watch email rate limits during the big send.",
    "[00:58] Daniel: Agreed. I'll flag it as a risk in the tracker.",
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const ts = lines.map((_, i) =>
      setTimeout(() => setVisible(i + 1), 250 + i * 550)
    );
    return () => ts.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl bg-[#F8F9FC] border border-[#E7E8F0] p-4 font-mono h-full min-h-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={12} className="text-[#9CA3AF]" />
        <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Meeting Transcript</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-[#9CA3AF]">Live</span>
        </span>
      </div>
      <div className="space-y-2">
        {lines.slice(0, visible).map((line, i) => {
          const [ts, ...rest] = line.split(" ");
          const speaker = rest[0];
          const text = rest.slice(1).join(" ");
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] leading-relaxed"
            >
              <span className="text-[#9CA3AF] mr-2">{ts}</span>
              <span className="text-violet-600 font-semibold">{speaker}</span>{" "}
              <span className="text-[#374151]">{text}</span>
            </motion.div>
          );
        })}
        {visible < lines.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1.5 h-3.5 bg-violet-400/70 rounded-sm"
          />
        )}
      </div>
    </div>
  );
}

function AIExtractionPanel() {
  const items = [
    { type: "Decision", icon: CheckCircle2, color: "text-violet-700", bg: "bg-violet-50 border-violet-200", text: "Launch date locked: June 15th",      conf: 98, delay: 0 },
    { type: "Task",     icon: ListChecks,   color: "text-cyan-700",   bg: "bg-cyan-50 border-cyan-200",     text: "Beta invite flow — Daniel — June 5", conf: 96, delay: 0.14 },
    { type: "Task",     icon: ListChecks,   color: "text-cyan-700",   bg: "bg-cyan-50 border-cyan-200",     text: "Copy freeze — Sofia — Friday",        conf: 94, delay: 0.26 },
    { type: "Risk",     icon: ShieldAlert,  color: "text-orange-700", bg: "bg-orange-50 border-orange-200", text: "Email rate limits during send",        conf: 88, delay: 0.38 },
  ];

  return (
    <div className="rounded-xl bg-white border border-[#E7E8F0] p-4 h-full min-h-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={12} className="text-violet-500" />
        <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">AI Extraction</span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="ml-auto text-[9px] text-violet-500/60 font-mono"
        >
          claude-opus-4-7
        </motion.span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 18, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: item.delay, duration: 0.28 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${item.bg}`}
            >
              <Icon size={12} className={item.color} />
              <div className="flex-1 min-w-0">
                <p className={`text-[9px] font-bold uppercase tracking-wider ${item.color}`}>{item.type}</p>
                <p className="text-[11px] text-[#374151] truncate mt-0.5">{item.text}</p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: item.delay + 0.35 }}
                className={`text-[9px] font-bold tabular-nums ${item.color} opacity-70`}
              >
                {item.conf}%
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ActionBoardPanel() {
  const cols = [
    {
      label: "To Do", dot: "bg-[#D1D5DB]", tc: "text-[#6B7280]",
      tasks: [
        { title: "Beta invite flow", owner: "Daniel", due: "Jun 5" },
        { title: "Set up send monitoring", owner: "Priya", due: "Jun 10" },
      ],
    },
    {
      label: "In Progress", dot: "bg-blue-400", tc: "text-blue-600",
      tasks: [{ title: "Landing page copy", owner: "Sofia", due: "Fri" }],
    },
    {
      label: "Done", dot: "bg-green-400", tc: "text-green-600",
      tasks: [{ title: "LCP performance audit", owner: "Daniel", due: "—" }],
    },
  ];

  return (
    <div className="rounded-xl bg-white border border-[#E7E8F0] p-4 h-full min-h-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={12} className="text-[#9CA3AF]" />
        <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Delivery Board</span>
        <span className="ml-auto text-[9px] text-[#9CA3AF]">4 tasks</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {cols.map((col, ci) => (
          <div key={col.label}>
            <div className="flex items-center gap-1 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
              <span className={`text-[9px] font-semibold ${col.tc}`}>{col.label}</span>
            </div>
            <div className="space-y-1.5">
              {col.tasks.map((task, ti) => (
                <motion.div
                  key={ti}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.1 + ti * 0.08 }}
                  className="bg-[#F8F9FC] border border-[#E7E8F0] rounded-lg p-2"
                >
                  <p className="text-[10px] text-[#374151] leading-tight mb-1">{task.title}</p>
                  <div className="flex items-center gap-1">
                    <User size={8} className="text-[#9CA3AF]" />
                    <span className="text-[9px] text-[#9CA3AF]">{task.owner}</span>
                    {task.due !== "—" && (
                      <>
                        <Clock size={8} className="text-[#9CA3AF] ml-1" />
                        <span className="text-[9px] text-[#9CA3AF]">{task.due}</span>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityLogPanel() {
  const events = [
    { actor: "Flowstate AI", action: "extracted", detail: "4 tasks, 1 decision, 1 risk", time: "just now", color: "text-violet-600", dot: "bg-violet-400" },
    { actor: "Sofia",        action: "claimed",   detail: "Landing page copy task",       time: "1m ago",  color: "text-cyan-600",   dot: "bg-cyan-400" },
    { actor: "Daniel",       action: "moved",     detail: "Beta invite flow → In Progress",time: "3m ago",  color: "text-blue-600",   dot: "bg-blue-400" },
    { actor: "Maya",         action: "reviewed",  detail: "June 15 decision confirmed",   time: "5m ago",  color: "text-green-600",  dot: "bg-green-400" },
    { actor: "Priya",        action: "flagged",   detail: "Email rate limit risk",         time: "7m ago",  color: "text-orange-600", dot: "bg-orange-400" },
  ];

  return (
    <div className="rounded-xl bg-white border border-[#E7E8F0] p-4 h-full min-h-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={12} className="text-[#9CA3AF]" />
        <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Activity Log</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-[#9CA3AF]">Live</span>
        </span>
      </div>
      <div className="space-y-3">
        {events.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.25 }}
            className="flex items-start gap-2.5"
          >
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${e.dot}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] leading-snug">
                <span className={`font-semibold ${e.color}`}>{e.actor}</span>
                <span className="text-[#6B7280]"> {e.action} </span>
                <span className="text-[#374151]">{e.detail}</span>
              </p>
            </div>
            <span className="text-[9px] text-[#9CA3AF] flex-shrink-0">{e.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Step config ─────────────────────────────────────────── */
const STEPS = [
  {
    eyebrow: "Step 01",
    headline: "Capture the\nmeeting.",
    sub: "Zoom transcripts, Loom recordings, Otter.ai exports, Google Meet notes — Flowstate reads them all.",
    Panel: MeetingSourcePanel,
    pillColor: "bg-violet-500",
    accentBg: "from-violet-50 to-transparent",
  },
  {
    eyebrow: "Step 02",
    headline: "Extract\neverything.",
    sub: "Claude identifies every decision, task, owner, deadline, and risk — with a confidence score and source quote.",
    Panel: AIExtractionPanel,
    pillColor: "bg-cyan-500",
    accentBg: "from-cyan-50 to-transparent",
  },
  {
    eyebrow: "Step 03",
    headline: "Assign\nownership.",
    sub: "A live delivery board appears with tasks pre-assigned, priorities set, and deadlines attached. Nothing to configure.",
    Panel: ActionBoardPanel,
    pillColor: "bg-blue-400",
    accentBg: "from-blue-50 to-transparent",
  },
  {
    eyebrow: "Step 04",
    headline: "Deliver from\nthe board.",
    sub: "Every action is logged. Every owner notified. Follow the work as it moves from extracted to shipped.",
    Panel: ActivityLogPanel,
    pillColor: "bg-green-400",
    accentBg: "from-green-50 to-transparent",
  },
];

/* ── Component ───────────────────────────────────────────── */
export function StickyDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActiveStep(v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.75 ? 2 : 3);
    });
  }, [scrollYProgress]);

  const step = STEPS[activeStep];
  const ActivePanel = step.Panel;

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[#FBFBFD]">
        {/* Ambient bg tint */}
        <div className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${step.accentBg} transition-all duration-700`} />

        <div className="relative w-full max-w-7xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: text */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.18em] mb-5">
                  {step.eyebrow}
                </p>
                <h2
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] gradient-text mb-6"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {step.headline}
                </h2>
                <p className="text-base lg:text-lg text-[#374151] leading-relaxed max-w-md">
                  {step.sub}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Step indicators */}
            <div className="flex items-center gap-3 mt-10">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === activeStep ? `w-12 ${s.pillColor}` : i < activeStep ? "w-4 bg-[#D1D5DB]" : "w-2.5 bg-[#E7E8F0]"
                  }`}
                />
              ))}
              <span className="ml-2 text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">
                {activeStep + 1} / {STEPS.length}
              </span>
            </div>
          </div>

          {/* Right: visual panel */}
          <div>
            <div className="rounded-2xl border border-[#E7E8F0] bg-white p-1 shadow-xl shadow-[#0E1330]/8">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-[#E7E8F0]">
                <div className="w-2 h-2 rounded-full bg-red-400/50" />
                <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                <div className="w-2 h-2 rounded-full bg-green-400/50" />
                <div className="flex-1 mx-3 h-4 rounded bg-[#F2F3F8] flex items-center justify-center">
                  <span className="text-[9px] text-[#9CA3AF] font-mono">app.flowstate.ai</span>
                </div>
                <Zap size={9} className="text-violet-500" />
              </div>

              {/* Panel */}
              <div className="p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ActivePanel />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue on first step */}
        {activeStep === 0 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-px h-10 bg-gradient-to-b from-[#D1D5DB] to-transparent mx-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
}
