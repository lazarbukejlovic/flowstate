"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Sparkles, CheckSquare, ShieldAlert,
  Users, LayoutGrid, MessageSquare, Share2, Download, PlayCircle,
} from "lucide-react";
import { FallingLetters } from "./falling-letters";

/* ─── Data ────────────────────────────────────────────────── */
const DECISIONS = [
  { title: "Launch date confirmed", detail: "June 30, 2026" },
  { title: "Pricing model",         detail: "Adopt tiered pricing" },
  { title: "Analytics rollout",     detail: "Phase 1 in July" },
  { title: "Beta access",           detail: "Invite 500 users" },
];
const ACTIONS = [
  { task: "Create launch plan",    owner: "Daniel", ownerColor: "bg-blue-500",    date: "Jun 16" },
  { task: "Finalize pricing page", owner: "Maya",   ownerColor: "bg-violet-500",  date: "Jun 17" },
  { task: "Update help center",    owner: "Sofia",  ownerColor: "bg-cyan-500",    date: "Jun 18" },
  { task: "Prepare beta invites",  owner: "Ethan",  ownerColor: "bg-emerald-500", date: "Jun 19" },
];
const BOARD_COLS = [
  { label: "To do",       n: 3, bar: "bg-white/25",    text: "text-white/55" },
  { label: "In progress", n: 2, bar: "bg-blue-400",    text: "text-blue-300" },
  { label: "Blocked",     n: 1, bar: "bg-orange-400",  text: "text-orange-300" },
  { label: "Done",        n: 5, bar: "bg-green-400",   text: "text-green-300" },
];

/* ─── Floating data fragments around mockup ──────────────── */
const DATA_FRAGMENTS = [
  { text: "decision",   x: "8%",  y: "12%", color: "#A78BFA", delay: 0,   dur: 5.5 },
  { text: "98%",        x: "92%", y: "20%", color: "#22D3EE", delay: 1.4, dur: 6.5 },
  { text: "risk →",     x: "5%",  y: "55%", color: "#FDBA74", delay: 2.6, dur: 6.0 },
  { text: "Maya",       x: "94%", y: "60%", color: "#6EE7B7", delay: 0.8, dur: 7.0 },
  { text: "3.2s",       x: "10%", y: "78%", color: "#93C5FD", delay: 3.5, dur: 5.8 },
  { text: "blocked",    x: "92%", y: "85%", color: "#FCA5A5", delay: 1.8, dur: 6.2 },
];

/* ─── Animated mockup scan line ──────────────────────────── */
function MockupScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 pointer-events-none z-30"
      style={{
        height: 2,
        background: "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.0) 10%, rgba(167,139,250,0.9) 50%, rgba(167,139,250,0.0) 90%, transparent 100%)",
        boxShadow: "0 0 14px rgba(167,139,250,0.6), 0 0 28px rgba(124,58,237,0.4)",
      }}
      animate={{ top: ["8%", "92%", "8%"] }}
      transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Live Product Mockup ──────────────────────────────────── */
function ProductMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(180deg, rgba(15,22,40,0.94) 0%, rgba(10,14,26,0.94) 100%)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(124,58,237,0.22)",
        boxShadow: [
          "0 50px 120px rgba(0,0,0,0.75)",
          "0 0 0 1px rgba(255,255,255,0.04) inset",
          "0 0 100px rgba(124,58,237,0.18)",
          "0 0 200px rgba(59,130,246,0.10)",
        ].join(", "),
      }}
    >
      {/* Animated scan line over mockup */}
      <MockupScanLine />

      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-black/20">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/55" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/55" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/55" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5">
          <Zap size={9} className="text-violet-400 fill-violet-400" />
          <span className="text-[10px] text-white/35 font-mono">app.flowstate.ai / workspace</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-green-400"
            style={{ boxShadow: "0 0 6px rgba(74,222,128,0.9)" }}
          />
          <span className="text-[10px] text-green-400/90">AI Active</span>
        </div>
      </div>

      {/* Sidebar + main */}
      <div className="grid grid-cols-[44px_1fr] min-h-[420px]">
        {/* Sidebar */}
        <div className="border-r border-white/[0.05] py-3 px-2 flex flex-col gap-2 bg-black/15">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-600/40">
            <Zap size={11} className="text-white fill-white" />
          </div>
          {[
            { icon: LayoutGrid, active: true },
            { icon: MessageSquare, active: false },
            { icon: CheckSquare, active: false },
            { icon: ShieldAlert, active: false },
            { icon: Users, active: false },
          ].map((item, i) => (
            <div key={i}
              className={`w-7 h-7 rounded-md flex items-center justify-center mx-auto ${
                item.active ? "bg-violet-500/15 text-violet-300 border border-violet-500/20" : "text-white/25 hover:text-white/55 hover:bg-white/[0.04]"
              } transition-colors`}>
              <item.icon size={13} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col">
          {/* Meeting header */}
          <div className="px-4 pt-3.5 pb-3 border-b border-white/[0.05]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-white mb-0.5 truncate">Q2 Product Launch Sync</h3>
                <div className="flex items-center gap-2 text-[10px] text-white/35">
                  <span>Jun 15, 2026</span><span className="text-white/15">·</span>
                  <span>56m</span><span className="text-white/15">·</span>
                  <span>12 attendees</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="flex -space-x-1.5">
                  {[["bg-violet-500","M"],["bg-blue-500","S"],["bg-cyan-500","D"]].map(([c,l],i) => (
                    <div key={i} className={`w-5 h-5 rounded-full ${c} border border-[#0A0E1A] flex items-center justify-center text-[7px] font-bold text-white shadow-md`}>{l}</div>
                  ))}
                  <div className="w-5 h-5 rounded-full bg-white/10 border border-[#0A0E1A] flex items-center justify-center text-[7px] text-white/55">+9</div>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] text-white/60 bg-white/[0.04] border border-white/[0.07]">
                  <Share2 size={8} />Share
                </button>
                <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] bg-violet-600 text-white border border-violet-500/40 shadow-md shadow-violet-600/30">
                  <Download size={8} />Export
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mt-2.5">
              <div className="flex items-center gap-1 overflow-x-auto flex-1">
                {["Overview","Transcript","Insights","Decisions","Risks","Actions"].map((tab, i) => (
                  <button key={tab}
                    className={`text-[10px] px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors ${
                      i === 0
                        ? "bg-violet-500/18 text-violet-200 border border-violet-500/25"
                        : "text-white/35 hover:text-white/70"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 pl-2">
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 6px rgba(74,222,128,0.9)" }}
                />
                <span className="text-[10px] text-green-400/90 font-medium whitespace-nowrap">AI analysis complete</span>
              </div>
            </div>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-3 divide-x divide-white/[0.04] flex-1">
            {/* Decisions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider">Decisions · 4</p>
                <Sparkles size={9} className="text-violet-400" />
              </div>
              <div className="space-y-2">
                {DECISIONS.map((d) => (
                  <div key={d.title} className="flex items-start gap-2 rounded-md px-1 py-0.5">
                    <div className="w-3.5 h-3.5 rounded-sm bg-violet-500/15 border border-violet-500/35 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-[2px] bg-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/85 leading-tight truncate font-medium">{d.title}</p>
                      <p className="text-[9px] text-violet-400/85 mt-0.5 truncate">{d.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider">Actions · 7</p>
                <motion.span
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[8px] px-1 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/25 font-bold"
                >+3 new</motion.span>
              </div>
              <div className="space-y-2">
                {ACTIONS.slice(0, 4).map((a) => (
                  <div key={a.task} className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-[2px] bg-blue-400/55" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-white/85 truncate font-medium">{a.task}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className={`w-3 h-3 rounded-full ${a.ownerColor} flex items-center justify-center text-[6px] text-white font-bold shadow-sm`}>
                          {a.owner[0]}
                        </div>
                        <span className="text-[9px] text-white/40">{a.owner} · {a.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Board */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[9px] text-white/40 font-semibold uppercase tracking-wider">Delivery board</p>
                <span className="text-[8px] text-green-300">Live</span>
              </div>
              <div className="space-y-1.5">
                {BOARD_COLS.map((col, i) => (
                  <div key={col.label} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${col.bar} flex-shrink-0`} />
                    <span className={`text-[9px] font-medium ${col.text} w-[56px] flex-shrink-0 truncate`}>{col.label}</span>
                    <div className="flex-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${col.bar} opacity-80`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(col.n * 22, 100)}%` }}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.15, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[9px] text-white/35 flex-shrink-0 tabular-nums">{col.n}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 mt-3 pt-2.5 border-t border-white/[0.05]">
                <p className="text-[8px] text-white/30 uppercase tracking-wider mb-1.5">In progress</p>
                {[
                  { task: "Finalize pricing page", owner: "Maya",  ownerColor: "bg-violet-500" },
                  { task: "Update help center",    owner: "Sofia", ownerColor: "bg-cyan-500" },
                ].map((it) => (
                  <div key={it.task} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="text-[9px] text-white/65 flex-1 truncate">{it.task}</span>
                    <div className={`w-3 h-3 rounded-full ${it.ownerColor} text-[6px] text-white font-bold flex items-center justify-center`}>{it.owner[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI bar */}
          <div className="px-3 py-2.5 border-t border-white/[0.05] flex items-center gap-2 bg-black/15">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.025]">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={10} className="text-violet-400 flex-shrink-0" />
              </motion.div>
              <span className="text-[11px] text-white/35 flex-1">Ask anything about this meeting…</span>
              <kbd className="text-[8px] text-white/30 px-1.5 py-0.5 rounded border border-white/[0.10] bg-white/[0.04]">⌘K</kbd>
            </div>
            <button className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/35 hover:bg-violet-500 transition-colors">
              <ArrowRight size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating cards data ──────────────────────────────────── */
type CardPos = { top?: string; bottom?: string; left?: string; right?: string };
type CardConfig = { key: string; pos: CardPos; delay: number; drift: { dx: number; dy: number; rot: number; dur: number } };

const CARD_CONFIGS: CardConfig[] = [
  { key: "summary",  pos: { top: "8%",  left: "-2%" },  delay: 0.95, drift: { dx: 4, dy: 5, rot: 0.6, dur: 7 } },
  { key: "risks",    pos: { top: "62%", left: "2%"  },  delay: 1.05, drift: { dx: 5, dy: 6, rot: 0.5, dur: 8 } },
  { key: "owners",   pos: { top: "78%", left: "30%" },  delay: 1.15, drift: { dx: 4, dy: 4, rot: 0.4, dur: 9 } },
  { key: "momentum", pos: { top: "92%", right: "10%" }, delay: 1.25, drift: { dx: 5, dy: 5, rot: 0.5, dur: 8.5 } },
  { key: "tools",    pos: { top: "10%", right: "-4%" }, delay: 1.35, drift: { dx: 4, dy: 6, rot: 0.6, dur: 9.5 } },
];

/* ─── Reusable card shell ────────────────────────────────── */
function CardShell({
  children, glowColor, className = "",
}: {
  children: React.ReactNode;
  glowColor: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.10] ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(22,30,52,0.88) 0%, rgba(12,18,32,0.88) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: `0 22px 48px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.04), 0 0 36px ${glowColor}`,
        minWidth: 170,
      }}
    >
      {children}
    </div>
  );
}

function SummaryCard() {
  return (
    <CardShell glowColor="rgba(124,58,237,0.22)" className="p-3.5 w-[200px]">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
          <Sparkles size={12} className="text-violet-300" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-white/90">AI Summary</p>
          <p className="text-[9px] text-white/40">Generated in 32s</p>
        </div>
      </div>
      <p className="text-[10px] text-white/55 leading-relaxed">
        Key outcomes, decisions, and 7 action items detected.
      </p>
      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/[0.06]">
        <div className="w-4 h-4 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[7px] text-white/40">DC</div>
        <div className="w-4 h-4 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[7px] text-white/40">PD</div>
      </div>
    </CardShell>
  );
}

function RisksCard() {
  return (
    <CardShell glowColor="rgba(249,115,22,0.25)" className="p-3.5 w-[210px]">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
          <ShieldAlert size={12} className="text-orange-300" />
        </div>
        <p className="text-[11px] font-semibold text-white/90 flex-1">Risks detected</p>
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30"
        >3</motion.span>
      </div>
      <div className="space-y-1.5">
        {[
          { name: "Launch timeline",   level: "High",   color: "text-red-300",    dot: "bg-red-400" },
          { name: "Analytics scope",   level: "Medium", color: "text-orange-300", dot: "bg-orange-400" },
          { name: "Resource capacity", level: "Low",    color: "text-green-300",  dot: "bg-green-400" },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className={`w-1.5 h-1.5 rounded-full ${r.dot} flex-shrink-0`} />
              <span className="text-[10px] text-white/65 truncate">{r.name}</span>
            </div>
            <span className={`text-[9px] font-bold ${r.color}`}>{r.level}</span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function OwnersCard() {
  return (
    <CardShell glowColor="rgba(6,182,212,0.22)" className="p-3.5 w-[200px]">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
          <Users size={12} className="text-cyan-300" />
        </div>
        <p className="text-[11px] font-semibold text-white/90 flex-1">Owner clarity</p>
        <span className="text-[10px] font-bold text-cyan-300">100%</span>
      </div>
      <p className="text-[10px] text-white/50 leading-snug mb-2.5">All action items have owners and due dates.</p>
      <div className="flex -space-x-1.5">
        {["bg-violet-500","bg-blue-500","bg-cyan-500","bg-emerald-500"].map((c, i) => (
          <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-[#0A0E1A] shadow-md`} />
        ))}
        <div className="w-5 h-5 rounded-full bg-white/10 border-2 border-[#0A0E1A] flex items-center justify-center text-[7px] text-white/55">+3</div>
      </div>
    </CardShell>
  );
}

function MomentumCard() {
  return (
    <CardShell glowColor="rgba(16,185,129,0.22)" className="p-3.5 w-[215px]">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <LayoutGrid size={12} className="text-emerald-300" />
        </div>
        <p className="text-[11px] font-semibold text-white/90 flex-1">Delivery momentum</p>
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">On track</span>
      </div>
      <p className="text-[10px] text-white/55 leading-snug">2 ahead, 1 at risk. You&apos;re in good shape.</p>
      {/* Sparkline */}
      <svg className="mt-2 w-full" height="24" viewBox="0 0 120 24" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.4)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>
        <path d="M 0 18 L 20 14 L 40 16 L 60 8 L 80 11 L 100 4 L 120 6 L 120 24 L 0 24 Z" fill="url(#sparkGrad)" />
        <motion.path
          d="M 0 18 L 20 14 L 40 16 L 60 8 L 80 11 L 100 4 L 120 6"
          stroke="#22D3EE" strokeWidth="1.5" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.4, ease: "easeInOut" }}
        />
      </svg>
    </CardShell>
  );
}

function ToolsCard() {
  const tools = [
    { initial: "SL", color: "bg-emerald-600" },
    { initial: "GD", color: "bg-yellow-500" },
    { initial: "NT", color: "bg-slate-700" },
  ];
  return (
    <CardShell glowColor="rgba(59,130,246,0.22)" className="p-3.5 w-[185px]">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Share2 size={12} className="text-blue-300" />
        </div>
        <p className="text-[11px] font-semibold text-white/90 flex-1">Connected tools</p>
        <span className="text-[9px] font-bold text-blue-300">12</span>
      </div>
      <div className="flex items-center gap-1.5">
        {tools.map((t, i) => (
          <div key={i} className={`w-7 h-7 rounded-lg ${t.color} border border-white/[0.10] flex items-center justify-center text-[8px] font-bold text-white shadow-sm`}>
            {t.initial}
          </div>
        ))}
        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.10] flex items-center justify-center text-[9px] font-semibold text-white/55">
          +9
        </div>
      </div>
    </CardShell>
  );
}

const CARD_MAP = {
  summary:  SummaryCard,
  risks:    RisksCard,
  owners:   OwnersCard,
  momentum: MomentumCard,
  tools:    ToolsCard,
};

/* ─── Cosmic curved beam ──────────────────────────────────── */
function CosmicBeam() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="beam-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(124,58,237,0.0)" />
          <stop offset="20%"  stopColor="rgba(124,58,237,0.95)" />
          <stop offset="60%"  stopColor="rgba(96,165,250,0.90)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.0)" />
        </linearGradient>
        <linearGradient id="beam-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(167,139,250,0.0)" />
          <stop offset="30%"  stopColor="rgba(167,139,250,1)" />
          <stop offset="70%"  stopColor="rgba(125,211,252,1)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.0)" />
        </linearGradient>
      </defs>

      {/* Wide outer glow — breathing */}
      <motion.path
        d="M 300 380 Q 550 580 850 720 T 1280 760"
        stroke="url(#beam-grad)"
        strokeWidth="70"
        fill="none"
        animate={{ opacity: [0.30, 0.50, 0.30] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        filter="url(#beam-glow-strong)"
      />
      {/* Mid glow */}
      <path
        d="M 300 380 Q 550 580 850 720 T 1280 760"
        stroke="url(#beam-grad)"
        strokeWidth="14"
        fill="none"
        opacity="0.75"
        filter="url(#beam-glow)"
      />
      {/* Bright core line */}
      <motion.path
        d="M 300 380 Q 550 580 850 720 T 1280 760"
        stroke="url(#beam-grad-2)"
        strokeWidth="2.5"
        fill="none"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particles flowing along the beam */}
      <motion.circle
        r="3"
        fill="#A78BFA"
        filter="url(#beam-glow)"
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        style={{ offsetPath: "path('M 300 380 Q 550 580 850 720 T 1280 760')" }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        r="2"
        fill="#22D3EE"
        filter="url(#beam-glow)"
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        style={{ offsetPath: "path('M 300 380 Q 550 580 850 720 T 1280 760')" }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2.5 }}
      />

      {/* Second beam swooping up */}
      <motion.path
        d="M 380 260 Q 600 100 900 70 T 1280 50"
        stroke="url(#beam-grad)"
        strokeWidth="48"
        fill="none"
        animate={{ opacity: [0.18, 0.30, 0.18] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        filter="url(#beam-glow-strong)"
      />
      <path
        d="M 380 260 Q 600 100 900 70 T 1280 50"
        stroke="url(#beam-grad-2)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-36 lg:pb-32">
      {/* Cosmic curved beam — behind everything */}
      <div className="absolute inset-0 hidden lg:block">
        <CosmicBeam />
      </div>

      <div className="relative max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.25fr] gap-10 lg:gap-12 items-center">

          {/* ─── LEFT: Text ───────────────────────────────── */}
          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 text-violet-200 text-[11px] font-semibold mb-7 tracking-wide"
              style={{ background: "rgba(124,58,237,0.10)", backdropFilter: "blur(8px)", boxShadow: "0 0 24px rgba(124,58,237,0.18)" }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={11} className="text-violet-300" />
              </motion.span>
              AI MEETING-TO-DELIVERY OS
            </motion.div>

            {/* Headline — must render complete, never clipped */}
            <h1
              className="font-display font-bold tracking-[-0.035em] mb-7"
              style={{
                fontSize: "clamp(52px, 7vw, 92px)",
                lineHeight: 1.02,
                color: "#F4F4FB",
              }}
            >
              <span className="block whitespace-nowrap">
                <FallingLetters text="From meetings to" delay={0.15} stagger={0.020} />
              </span>
              <span className="block">
                <FallingLetters text="momentum." delay={0.45} stagger={0.022} className="accent-text" />
              </span>
            </h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="text-base lg:text-lg leading-relaxed max-w-lg mb-9"
              style={{ color: "#A7A3C2" }}
            >
              Flowstate turns messy conversations into owned actions, clear decisions, and delivery that moves.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="flex flex-wrap gap-3 mb-9"
            >
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)",
                  boxShadow: "0 20px 50px rgba(124,58,237,0.40), 0 0 30px rgba(124,58,237,0.30)",
                }}
              >
                Try Flowstate free
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm transition-all backdrop-blur"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#F4F4FB",
                }}
              >
                <PlayCircle size={15} />
                See how it works
              </Link>
            </motion.div>

            {/* Trust checks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-4 flex-wrap"
            >
              {[
                "Works with any meeting",
                "Source-linked to the transcript",
                "Secure by design",
              ].map((s) => (
                <div key={s} className="flex items-center gap-1.5 text-[11px]" style={{ color: "#A7A3C2" }}>
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.30)" }}>
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#22C55E", boxShadow: "0 0 4px rgba(34,197,94,0.6)" }} />
                  </div>
                  {s}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT: Mockup with surrounding cards ───── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16,1,0.3,1] }}
            className="relative"
            style={{ minHeight: 600 }}
          >
            {/* Floating data fragments around mockup */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none -m-16">
              {DATA_FRAGMENTS.map((f) => (
                <motion.span
                  key={f.text}
                  className="absolute text-[10px] font-mono font-semibold whitespace-nowrap"
                  style={{
                    color: f.color,
                    left: f.x,
                    top: f.y,
                    textShadow: `0 0 8px ${f.color}80`,
                  }}
                  animate={{
                    opacity: [0, 0.85, 0],
                    y: [0, -16, -32],
                  }}
                  transition={{
                    duration: f.dur,
                    delay: f.delay,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                >
                  {f.text}
                </motion.span>
              ))}
            </div>

            {/* Mockup with subtle floating */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
              style={{ transform: "perspective(1400px) rotateY(-3.5deg) rotateX(2deg)" }}
            >
              <ProductMockup />

              {/* Ambient glow under mockup */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 -z-10 rounded-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse, rgba(124,58,237,0.22) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
            </motion.div>

            {/* Floating cards — desktop, positioned absolutely with drift */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              {CARD_CONFIGS.map((cfg, i) => {
                const CardComp = CARD_MAP[cfg.key as keyof typeof CARD_MAP];
                return (
                  <motion.div
                    key={cfg.key}
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: cfg.delay, duration: 0.6, ease: [0.16,1,0.3,1] }}
                    className="absolute"
                    style={cfg.pos}
                  >
                    {/* Drift wrapper */}
                    <motion.div
                      animate={{
                        x:      [0, cfg.drift.dx, 0, -cfg.drift.dx, 0],
                        y:      [0, -cfg.drift.dy, 0, cfg.drift.dy, 0],
                        rotate: [0, cfg.drift.rot, 0, -cfg.drift.rot, 0],
                      }}
                      transition={{ duration: cfg.drift.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    >
                      <CardComp />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Mobile floating cards */}
        <div className="lg:hidden mt-8 flex gap-3 overflow-x-auto pb-3 -mx-5 px-5">
          {CARD_CONFIGS.map((cfg) => {
            const CardComp = CARD_MAP[cfg.key as keyof typeof CARD_MAP];
            return (
              <div key={cfg.key} className="flex-shrink-0">
                <CardComp />
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="micro-label" style={{ color: "rgba(255,255,255,0.20)" }}>scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent"
        />
      </motion.div>
    </section>
  );
}
