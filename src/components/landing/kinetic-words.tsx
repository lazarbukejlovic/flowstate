"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Brain, ListChecks, Zap, ShieldAlert, User } from "lucide-react";

/* ──────────────────────────────────────────────────────────── */
/* STEP PANELS                                                  */
/* ──────────────────────────────────────────────────────────── */

function CapturePanel() {
  const lines = [
    { speaker: "Maya",   text: "June 15th is non-negotiable. Everyone aligned?" },
    { speaker: "Sofia",  text: "Landing page copy freezes Friday. Marketing needs 2 weeks." },
    { speaker: "Daniel", text: "Beta invite flow by June 5th, 500 users before launch." },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const ts = lines.map((_, i) => setTimeout(() => setVisible(i + 1), 300 + i * 650));
    return () => ts.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border border-white/[0.08] p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
      <p className="micro-label mb-3">Meeting Source</p>
      <div className="space-y-2.5">
        {lines.slice(0, visible).map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="text-[11px] leading-relaxed">
            <span className="text-violet-400 font-semibold">{l.speaker}:</span>{" "}
            <span className="text-white/65">{l.text}</span>
          </motion.div>
        ))}
        {visible < lines.length && (
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1.5 h-4 bg-violet-500 rounded-sm" />
        )}
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[10px] text-white/35">transcript ingested · 1,240 words</span>
      </div>
    </div>
  );
}

function ExtractPanel() {
  const chips = [
    { icon: Brain,       label: "Decision", detail: "Launch date confirmed: June 15th",   color: "text-violet-400", bg: "border-violet-500/20", conf: 96, delay: 0 },
    { icon: ListChecks,  label: "Task",     detail: "Sofia owns messaging freeze: Friday", color: "text-cyan-400",   bg: "border-cyan-500/20",   conf: 98, delay: 0.12 },
    { icon: Zap,         label: "Deadline", detail: "Beta invite flow: June 5th",          color: "text-blue-400",   bg: "border-blue-500/20",   conf: 91, delay: 0.24 },
    { icon: ShieldAlert, label: "Risk",     detail: "Email rate limits during send",       color: "text-orange-400", bg: "border-orange-500/20", conf: 87, delay: 0.36 },
  ];
  return (
    <div className="space-y-2">
      {chips.map((c) => (
        <motion.div key={c.label}
          initial={{ opacity: 0, x: 20, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: c.delay, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`flex items-center gap-3 p-3 rounded-xl border ${c.bg}`}
          style={{ background: "rgba(255,255,255,0.04)" }}>
          <c.icon size={12} className={c.color} />
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-bold ${c.color} uppercase tracking-wider`}>{c.label}</p>
            <p className="text-[11px] text-white/75 mt-0.5 truncate">{c.detail}</p>
          </div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: c.delay + 0.3 }}
            className={`text-[9px] font-bold ${c.color} flex-shrink-0`}>
            {c.conf}%
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

const OWNERS = [
  { name: "Sofia",  initials: "SO", color: "from-violet-500 to-violet-700", task: "Hero copy freeze" },
  { name: "Daniel", initials: "DA", color: "from-blue-500 to-blue-700",     task: "Beta invite flow" },
  { name: "Maya",   initials: "MA", color: "from-emerald-500 to-emerald-700", task: "Launch checklist" },
];

function AssignPanel() {
  return (
    <div className="space-y-3">
      {OWNERS.map((o, i) => (
        <motion.div
          key={o.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.14, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07]"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${o.color} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
            {o.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-white/90">{o.task}</p>
            <p className="text-[10px] text-white/40 mt-0.5">Owner: {o.name}</p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.14 + 0.25, type: "spring", stiffness: 300 }}
            className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0"
          >
            <User size={10} className="text-emerald-400" />
          </motion.div>
        </motion.div>
      ))}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-[10px] text-white/30 text-center pt-1"
      >
        3 owners assigned · 7 tasks distributed
      </motion.p>
    </div>
  );
}

function DeliverPanel() {
  const cols = [
    { label: "Todo",        color: "text-white/45", dot: "bg-white/25",   tasks: ["Review beta list", "Set up monitoring"] },
    { label: "In Progress", color: "text-blue-400",  dot: "bg-blue-400",  tasks: ["Hero copy", "Invite flow"] },
    { label: "Done",        color: "text-green-400", dot: "bg-green-400", tasks: ["LCP audit"] },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {cols.map((col, ci) => (
          <div key={col.label}>
            <div className="flex items-center gap-1 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
              <span className={`text-[9px] font-semibold ${col.color}`}>{col.label}</span>
            </div>
            <div className="space-y-1.5">
              {col.tasks.map((t, ti) => (
                <motion.div key={ti}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.1 + ti * 0.08, duration: 0.2 }}
                  className="text-[10px] text-white/65 border border-white/[0.07] rounded-lg px-2 py-1.5 leading-tight"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  {t}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-violet-500/22 bg-violet-500/8"
      >
        <Zap size={11} className="text-violet-400 flex-shrink-0" />
        <span className="text-[11px] text-violet-300 font-semibold">Execution brief ready</span>
        <span className="ml-auto text-[9px] text-violet-400/60">copy →</span>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* STEP CONFIG                                                  */
/* ──────────────────────────────────────────────────────────── */

const STEPS = [
  {
    word: "capture",
    gradientClass: "gradient-text",
    subtitle: "Drop in any transcript, recording link, or meeting notes.",
    detail: "Meeting source · 1,240 words ingested",
    Panel: CapturePanel,
  },
  {
    word: "extract",
    gradientClass: "accent-text",
    subtitle: "Decisions, tasks, risks, deadlines — source-linked and confidence-scored.",
    detail: "Decision register · Risk flags · AI confidence",
    Panel: ExtractPanel,
  },
  {
    word: "assign",
    gradientClass: "violet-text",
    subtitle: "Owners automatically mapped to tasks. Deadlines inferred from context.",
    detail: "Owner map · 7 tasks distributed · 3 owners",
    Panel: AssignPanel,
  },
  {
    word: "deliver",
    gradientClass: "cyan-text",
    subtitle: "Live delivery board, execution brief, and full activity log — instantly.",
    detail: "Delivery board · Execution brief · Activity log",
    Panel: DeliverPanel,
  },
];

/* ──────────────────────────────────────────────────────────── */
/* COMPONENT                                                    */
/* ──────────────────────────────────────────────────────────── */

export function KineticWords() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActiveIndex(v < 0.25 ? 0 : v < 0.50 ? 1 : v < 0.75 ? 2 : 3);
    });
  }, [scrollYProgress]);

  const step = STEPS[activeIndex];
  const ActivePanel = step.Panel;

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Section glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 65%)" }} />
        </div>
        {/* Grid */}
        <div className="absolute inset-0 dark-grid-bg opacity-40 pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-20 items-center">

          {/* Left: big word */}
          <div>
            <p className="micro-label mb-5">What Flowstate does</p>
            <p className="text-xl lg:text-2xl font-semibold text-white/55 mb-0 leading-snug">
              With Flowstate, teams
            </p>

            {/* Animated word */}
            <div className="relative overflow-hidden mt-1" style={{ height: "1.05em" }}>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeIndex}
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-105%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className={`font-display text-[5.5rem] sm:text-[7rem] lg:text-[8rem] xl:text-[9.5rem] font-bold leading-none tracking-[-0.04em] ${step.gradientClass}`}
                >
                  {step.word}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4"
              >
                <p className="text-base lg:text-lg text-white/55 leading-relaxed max-w-lg">
                  {step.subtitle}
                </p>
                <p className="text-[11px] text-white/30 mt-2 font-medium">
                  {step.detail}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress pills */}
            <div className="flex items-center gap-2 mt-8">
              {STEPS.map((s, i) => (
                <div
                  key={s.word}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === activeIndex ? "w-10 bg-violet-500" : "w-2.5 bg-white/15"
                  }`}
                />
              ))}
              <span className="ml-3 micro-label" style={{ color: "rgba(255,255,255,0.25)" }}>
                {activeIndex + 1} / {STEPS.length}
              </span>
            </div>
          </div>

          {/* Right: visual panel */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-white/[0.08] p-5 shadow-2xl shadow-black/40"
              style={{ background: "rgba(10,14,26,0.70)", backdropFilter: "blur(16px)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="micro-label">AI Processing</span>
                <span className="ml-auto text-[10px] text-violet-400 font-semibold">claude-opus-4-7</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <ActivePanel />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
