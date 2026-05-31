"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface VoiceRecorderProps {
  /** Called with the cleaned transcript text when Whisper returns successfully. */
  onTranscribed: (text: string) => void;
}

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

function extFromMime(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("mp4"))  return "mp4";
  if (mime.includes("ogg"))  return "ogg";
  if (mime.includes("wav"))  return "wav";
  return "webm";
}

function formatTime(s: number): string {
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

type Status = "idle" | "recording" | "ready" | "transcribing" | "done";

export function VoiceRecorder({ onTranscribed }: VoiceRecorderProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ok = !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";
      setSupported(ok);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // intentionally empty: cleanup runs on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    setError(null);
    if (!supported) {
      setError("Your browser doesn't support voice recording. Try a recent Chrome, Edge, or Safari.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const finalMime = recorder.mimeType || mimeType || "audio/webm";
        const finalBlob = new Blob(chunksRef.current, { type: finalMime });
        setBlob(finalBlob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(finalBlob);
        });
        setStatus("ready");
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorderRef.current = recorder;
      recorder.start(250);

      setSeconds(0);
      setStatus("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setError("Microphone access denied. Enable it in your browser settings and try again.");
      } else if (name === "NotFoundError") {
        setError("No microphone found on this device.");
      } else {
        setError("Couldn't start recording. Check your microphone and try again.");
      }
      setStatus("idle");
    }
  }

  function stop() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function clear() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setBlob(null);
    setSeconds(0);
    setStatus("idle");
    setError(null);
  }

  async function transcribe() {
    if (!blob) return;
    setStatus("transcribing");
    setError(null);
    try {
      const mime = blob.type || "audio/webm";
      const ext = extFromMime(mime);
      const form = new FormData();
      form.append("audio", blob, `recording.${ext}`);

      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data: { text?: string; error?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Transcription failed.");
      }
      const text = (data.text ?? "").trim();
      if (!text) {
        throw new Error("Transcription returned no text. Try a clearer recording.");
      }
      onTranscribed(text);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed.");
      setStatus("ready");
    }
  }

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(168,140,255,0.16)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.16)", border: "1px solid rgba(124,58,237,0.32)" }}>
            <Mic size={13} style={{ color: "#A78BFA" }} />
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: "#F5F4FC" }}>Record voice note</p>
            <p className="text-[10px]" style={{ color: "#ABA6C9" }}>
              Capture a quick brief or recap with your microphone.
            </p>
          </div>
        </div>

        <RecordingTimer status={status} seconds={seconds} />
      </div>

      {!supported && (
        <ErrorPill text="Your browser doesn't support voice recording. Try Chrome, Edge, or Safari." />
      )}

      {/* Action area */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {status === "idle" && (
          <button
            type="button"
            onClick={start}
            disabled={!supported}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)",
              color: "#FFFFFF",
              boxShadow: "0 12px 30px rgba(124,58,237,0.30)",
            }}
          >
            <Mic size={13} />
            Start recording
          </button>
        )}

        {status === "recording" && (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #FF6B4A 0%, #E04A2A 100%)",
              color: "#FFFFFF",
              boxShadow: "0 12px 30px rgba(255,107,74,0.30)",
            }}
          >
            <Square size={11} className="fill-white" />
            Stop recording
          </button>
        )}

        {(status === "ready" || status === "done") && (
          <>
            <button
              type="button"
              onClick={transcribe}
              disabled={status === "done"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-px disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)",
                color: "#FFFFFF",
                boxShadow: "0 12px 30px rgba(124,58,237,0.30)",
              }}
            >
              <Mic size={13} />
              Transcribe
            </button>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(168,140,255,0.18)",
                color: "#F5F4FC",
              }}
            >
              <Trash2 size={12} />
              Clear
            </button>
          </>
        )}

        {status === "transcribing" && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm"
            style={{
              background: "rgba(124,58,237,0.16)",
              border: "1px solid rgba(124,58,237,0.32)",
              color: "#C4B5FD",
            }}
          >
            <Loader2 size={13} className="animate-spin" />
            Transcribing with Whisper…
          </div>
        )}
      </div>

      {/* Playback when we have audio */}
      {audioUrl && status !== "idle" && (
        <audio
          src={audioUrl}
          controls
          className="w-full mt-1"
          style={{ filter: "invert(0.85) hue-rotate(180deg)" }}
        />
      )}

      {/* Status / errors */}
      <AnimatePresence>
        {status === "done" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold"
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.32)",
              color: "#86EFAC",
            }}
          >
            <CheckCircle2 size={11} />
            Voice note transcribed
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-3">
          <ErrorPill text={error} />
        </div>
      )}
    </div>
  );
}

function ErrorPill({ text }: { text: string }) {
  return (
    <div
      className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[12px]"
      style={{
        background: "rgba(255,107,74,0.10)",
        border: "1px solid rgba(255,107,74,0.32)",
        color: "#FFB89E",
      }}
    >
      <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </div>
  );
}

function RecordingTimer({ status, seconds }: { status: Status; seconds: number }) {
  const dot =
    status === "recording" ? "#FF6B4A"
      : status === "ready" || status === "done" ? "#22C55E"
      : "#6E6A87";
  const label =
    status === "recording" ? "Recording"
      : status === "ready" ? "Ready"
      : status === "transcribing" ? "Processing"
      : status === "done" ? "Transcribed"
      : "Idle";
  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,140,255,0.14)" }}>
      <span
        className={status === "recording" ? "animate-pulse" : ""}
        style={{
          width: 6, height: 6, borderRadius: 999,
          background: dot,
          boxShadow: status === "recording" ? "0 0 8px rgba(255,107,74,0.8)" : undefined,
        }}
      />
      <span className="text-[10px] font-semibold tabular-nums" style={{ color: "#F5F4FC" }}>
        {formatTime(seconds)}
      </span>
      <span className="text-[10px]" style={{ color: "#ABA6C9" }}>{label}</span>
    </div>
  );
}
