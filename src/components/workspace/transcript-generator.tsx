"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, Loader2, Zap, ArrowRight, FileText, Mic, FileUp } from "lucide-react";
import { DEMO_TRANSCRIPT } from "@/lib/demo/transcript";
import { VoiceRecorder } from "./voice-recorder";
import { ZoomImporter } from "./zoom-importer";
import type { TranscriptKind } from "@/lib/parsers/transcript-parsers";

type Step = "input" | "processing" | "done";
type SourceTab = "manual" | "voice" | "zoom";

interface ProcessingStage {
  id: string;
  label: string;
  detail: string;
  duration: number;
}

const STAGES: ProcessingStage[] = [
  { id: "parse",     label: "Parsing transcript",       detail: "Tokenizing and identifying speakers",   duration: 1000 },
  { id: "decisions", label: "Extracting decisions",     detail: "Finding consensus points and outcomes",  duration: 1400 },
  { id: "tasks",     label: "Assigning task owners",    detail: "Mapping commitments to participants",    duration: 1600 },
  { id: "risks",     label: "Detecting risks",          detail: "Scoring severity and suggesting fixes",  duration: 1200 },
  { id: "followups", label: "Capturing follow-ups",     detail: "Open loops, commitments, blockers",      duration: 1000 },
  { id: "build",     label: "Building workspace",       detail: "Generating board and execution plan",    duration: 800 },
];

const SOURCE_TABS: { id: SourceTab; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "manual", label: "Manual transcript", icon: FileText, desc: "Paste any meeting text" },
  { id: "voice",  label: "Voice recording",   icon: Mic,      desc: "Record + Whisper transcribe" },
  { id: "zoom",   label: "Zoom transcript",   icon: FileUp,   desc: "Import .vtt / .srt / .txt" },
];

const SOURCE_BADGE: Record<SourceTab | "imported-vtt" | "imported-srt", { label: string; color: string; bg: string; border: string }> = {
  manual:        { label: "Manual transcript",        color: "#C4B5FD", bg: "rgba(124,58,237,0.14)", border: "rgba(124,58,237,0.32)" },
  voice:         { label: "Voice recording",          color: "#86EFAC", bg: "rgba(34,197,94,0.14)",  border: "rgba(34,197,94,0.32)" },
  zoom:          { label: "Zoom transcript",          color: "#67E8F9", bg: "rgba(34,211,238,0.14)", border: "rgba(34,211,238,0.32)" },
  "imported-vtt": { label: "Imported · Zoom (VTT)",   color: "#67E8F9", bg: "rgba(34,211,238,0.14)", border: "rgba(34,211,238,0.32)" },
  "imported-srt": { label: "Imported · Zoom (SRT)",   color: "#67E8F9", bg: "rgba(34,211,238,0.14)", border: "rgba(34,211,238,0.32)" },
};

function ProcessingTheater({ stageIndex, done }: { stageIndex: number; done: boolean }) {
  const completedStages = done ? STAGES.length : stageIndex;
  const progress = Math.round((completedStages / STAGES.length) * 100);

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="relative flex items-center justify-center w-32 h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-violet-500/15"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-cyan-500/20"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-20 h-20 rounded-full bg-violet-600/20 blur-xl"
        />
        <div className="relative w-14 h-14 rounded-2xl bg-[#0c0c16] border border-violet-500/30 flex items-center justify-center shadow-xl shadow-violet-500/20">
          {done ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle2 size={22} className="text-emerald-400" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain size={22} className="text-violet-400" />
            </motion.div>
          )}
        </div>
        {!done && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
            style={{ transformOrigin: "center" }}
          >
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/60"
              style={{ top: "0%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
          <Zap size={10} className="text-violet-400 fill-violet-400" />
          <span className="text-[11px] font-semibold text-violet-300">claude-opus-4-7</span>
          {!done && (
            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <span className="text-[11px] text-violet-400/60">·</span>
            </motion.div>
          )}
          <span className="text-[11px] text-violet-400/60">{done ? "Complete" : "Processing"}</span>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-2">
        {STAGES.map((stage, i) => {
          const isComplete = done || i < stageIndex;
          const isActive = !done && i === stageIndex;
          const isPending = !done && i > stageIndex;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center">
                {isComplete ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </motion.div>
                ) : isActive ? (
                  <Loader2 size={15} className="text-violet-400 animate-spin" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-white/15" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-snug ${
                  isComplete ? "text-white/70" : isActive ? "text-white" : "text-white/30"
                }`}>
                  {stage.label}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-[11px] text-cyan-400/60 mt-0.5"
                  >
                    {stage.detail}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">
            {done ? "Workspace ready" : "Extracting..."}
          </span>
          <span className={`text-[10px] font-bold tabular-nums ${done ? "text-emerald-400" : "text-violet-400"}`}>
            {progress}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full ${done ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-gradient-to-r from-violet-500 to-cyan-500"}`}
          />
        </div>
      </div>

      {done && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-white/60 text-center"
        >
          Opening your workspace...
        </motion.p>
      )}
    </div>
  );
}

export function TranscriptGenerator() {
  const router = useRouter();
  const [transcript, setTranscript] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<SourceTab>("manual");
  const [sourceBadge, setSourceBadge] = useState<keyof typeof SOURCE_BADGE>("manual");

  useEffect(() => {
    if (step !== "processing") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    STAGES.forEach((stage, i) => {
      const delay = STAGES.slice(0, i).reduce((sum, s) => sum + s.duration, 0);
      timers.push(setTimeout(() => setStageIndex(i), delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [step]);

  async function handleGenerate() {
    if (transcript.trim().length < 50) {
      setError("Please paste a longer transcript (at least 50 characters).");
      return;
    }
    setError(null);
    setStep("processing");
    setStageIndex(0);

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, meetingTitle: meetingTitle || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create workspace");
      }
      const data = await res.json();
      setStageIndex(STAGES.length);
      setStep("done");
      setTimeout(() => router.push(`/workspaces/${data.id}`), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  }

  function loadDemo() {
    setTranscript(DEMO_TRANSCRIPT.trim());
    setMeetingTitle("Q2 Product Launch Sync");
    setSourceBadge("manual");
    setTab("manual");
  }

  function handleVoiceTranscribed(text: string) {
    setTranscript(text);
    setSourceBadge("voice");
    setError(null);
  }

  function handleZoomImported(text: string, kind: TranscriptKind, filename: string) {
    setTranscript(text);
    if (kind === "vtt") setSourceBadge("imported-vtt");
    else if (kind === "srt") setSourceBadge("imported-srt");
    else setSourceBadge("zoom");
    setError(null);
    // Default the title to the imported filename (without extension) if none set yet
    if (!meetingTitle) {
      const base = filename.replace(/\.[^.]+$/, "");
      setMeetingTitle(base);
    }
  }

  if (step === "processing" || step === "done") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-[500px] flex items-center justify-center"
        >
          <ProcessingTheater stageIndex={stageIndex} done={step === "done"} />
        </motion.div>
      </AnimatePresence>
    );
  }

  const ready = transcript.trim().length >= 50;
  const badge = SOURCE_BADGE[sourceBadge];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      {/* ─── Source selector ───────────────────────────── */}
      <div>
        <p className="block text-xs font-medium text-white/50 mb-2">Meeting source</p>
        <div
          className="grid grid-cols-3 gap-1.5 p-1 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(168,140,255,0.16)",
          }}
        >
          {SOURCE_TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="flex items-start gap-2 p-2.5 rounded-lg text-left transition-all"
                style={{
                  background: active
                    ? "linear-gradient(180deg, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0.18) 100%)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(167,139,250,0.40)"
                    : "1px solid transparent",
                  boxShadow: active ? "0 4px 16px rgba(124,58,237,0.25)" : undefined,
                }}
              >
                <t.icon size={14} style={{ color: active ? "#C4B5FD" : "#A78BFA", flexShrink: 0, marginTop: 2 }} />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold leading-tight" style={{ color: active ? "#F5F4FC" : "#ABA6C9" }}>
                    {t.label}
                  </p>
                  <p className="text-[10px] leading-tight mt-0.5 truncate" style={{ color: active ? "#C4B5FD" : "#6E6A87" }}>
                    {t.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Source-specific UI ────────────────────────── */}
      <AnimatePresence mode="wait">
        {tab === "voice" && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <VoiceRecorder onTranscribed={handleVoiceTranscribed} />
          </motion.div>
        )}
        {tab === "zoom" && (
          <motion.div
            key="zoom"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <ZoomImporter onImported={handleZoomImported} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Meeting title ────────────────────────────── */}
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">
          Meeting title <span className="text-white/25 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          placeholder="e.g. Q2 Product Launch Sync"
          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all text-sm"
        />
      </div>

      {/* ─── Transcript textarea ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs font-medium text-white/50">Meeting transcript</label>
            {transcript.trim().length > 0 && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                style={{
                  color: badge.color,
                  background: badge.bg,
                  border: `1px solid ${badge.border}`,
                }}
              >
                {badge.label}
              </span>
            )}
          </div>
          {tab === "manual" && (
            <button
              type="button"
              onClick={loadDemo}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
            >
              Load demo transcript <ArrowRight size={11} />
            </button>
          )}
        </div>
        <textarea
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (sourceBadge !== "manual") setSourceBadge("manual");
          }}
          placeholder={
            tab === "voice"
              ? "Record above, then click Transcribe — text will appear here."
              : tab === "zoom"
              ? "Upload a .vtt / .srt / .txt file above — cleaned transcript will appear here."
              : "Paste your meeting transcript here… Zoom, Teams, Loom, Otter.ai — any format works."
          }
          rows={10}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all text-sm resize-none font-mono leading-relaxed"
        />
        <p className="text-[11px] text-white/25 mt-1.5">
          {transcript.length} characters ·{" "}
          {transcript.trim().length === 0
            ? "Waiting for transcript"
            : transcript.trim().length < 50
            ? `${50 - transcript.trim().length} more characters needed`
            : `Ready to generate workspace · ~${Math.round(transcript.trim().split(/\s+/).length)} words`}
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!ready}
        className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-white/[0.05] disabled:text-white/20 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-500/25 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Brain size={15} />
        Generate workspace with AI
      </button>

      <p className="text-center text-xs text-white/25">
        claude-opus-4-7 · Extracts tasks, decisions, risks, follow-ups
      </p>
    </motion.div>
  );
}
