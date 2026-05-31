"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { cleanTranscriptFile, type TranscriptKind } from "@/lib/parsers/transcript-parsers";

interface ZoomImporterProps {
  /** Receives the cleaned transcript text once a file is parsed. */
  onImported: (text: string, kind: TranscriptKind, filename: string) => void;
}

const ACCEPT = ".vtt,.srt,.txt";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — transcripts are text, this is plenty

const KIND_LABEL: Record<TranscriptKind, string> = {
  vtt: "VTT",
  srt: "SRT",
  txt: "Plain text",
};

export function ZoomImporter({ onImported }: ZoomImporterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [imported, setImported] = useState<{ name: string; kind: TranscriptKind; chars: number } | null>(null);

  async function processFile(file: File) {
    setError(null);
    if (file.size === 0) {
      setError("That file is empty.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is too large. Keep transcripts under 5 MB.");
      return;
    }
    const ext = file.name.toLowerCase();
    if (!ext.endsWith(".vtt") && !ext.endsWith(".srt") && !ext.endsWith(".txt")) {
      setError("Unsupported file type. Use .vtt, .srt, or .txt.");
      return;
    }

    try {
      const raw = await file.text();
      const { kind, text } = cleanTranscriptFile(file.name, raw);
      if (!text || text.length < 5) {
        setError("Couldn't read any text from that file.");
        return;
      }
      onImported(text, kind, file.name);
      setImported({ name: file.name, kind, chars: text.length });
    } catch {
      setError("Couldn't read that file. Check the format and try again.");
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
    // Reset so the same filename can be picked twice in a row
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
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
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(34,211,238,0.14)", border: "1px solid rgba(34,211,238,0.32)" }}>
          <FileUp size={13} style={{ color: "#67E8F9" }} />
        </div>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: "#F5F4FC" }}>Import Zoom transcript</p>
          <p className="text-[10px]" style={{ color: "#ABA6C9" }}>
            Upload a Zoom transcript file exported from a recorded meeting.
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        className="rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
        style={{
          background: dragOver ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.025)",
          border: `1px dashed ${dragOver ? "rgba(34,211,238,0.50)" : "rgba(168,140,255,0.22)"}`,
        }}
      >
        <FileText size={20} style={{ color: dragOver ? "#22D3EE" : "#A78BFA" }} />
        <p className="text-[12px] font-semibold" style={{ color: "#F5F4FC" }}>
          Drop a transcript file or click to choose
        </p>
        <p className="text-[10px]" style={{ color: "#ABA6C9" }}>
          .vtt · .srt · .txt — timestamps and cue numbers are cleaned automatically.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={onSelect}
          className="hidden"
        />
      </div>

      {/* Status badge */}
      <AnimatePresence>
        {imported && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 flex-wrap"
          >
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.32)",
                color: "#86EFAC",
              }}
            >
              <CheckCircle2 size={10} />
              {imported.kind === "txt" ? "Imported from Zoom transcript" : "Zoom transcript cleaned"}
            </span>
            <span className="text-[10px]" style={{ color: "#ABA6C9" }}>
              {imported.name} · {KIND_LABEL[imported.kind]} · {imported.chars.toLocaleString()} chars
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div
          className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl text-[12px]"
          style={{
            background: "rgba(255,107,74,0.10)",
            border: "1px solid rgba(255,107,74,0.32)",
            color: "#FFB89E",
          }}
        >
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
