/**
 * Pure functions to clean meeting transcript files (.vtt, .srt) down to readable
 * speaker-attributed text. Plain .txt is passed through unchanged.
 *
 * Strips:
 *   - WEBVTT / NOTE / STYLE blocks
 *   - cue identifiers
 *   - timestamp lines (HH:MM:SS.mmm --> HH:MM:SS.mmm  /  with comma for SRT)
 *   - VTT inline tags (<v Speaker>…</v>, <c>, <i>…)
 *   - repeated blank lines
 */

const VTT_TIMESTAMP_RE =
  /^\d{2}:\d{2}(:\d{2})?[.,]\d{3}\s*-->\s*\d{2}:\d{2}(:\d{2})?[.,]\d{3}.*$/;
const SRT_TIMESTAMP_RE =
  /^\d{2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{3}.*$/;
const PURE_NUMBER_RE = /^\d+$/;
const VTT_VOICE_TAG_RE = /<v\s+([^>]+)>/g;
const ANY_VTT_TAG_RE = /<\/?[a-zA-Z][^>]*>/g;

function normalize(raw: string): string[] {
  return raw
    .replace(/^﻿/, "") // strip BOM
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
}

function collapseBlankLines(lines: string[]): string {
  const out: string[] = [];
  for (const line of lines) {
    if (line === "" && out.length > 0 && out[out.length - 1] === "") continue;
    out.push(line);
  }
  return out.join("\n").trim();
}

export function cleanVtt(raw: string): string {
  const lines = normalize(raw);
  const out: string[] = [];
  let inNoteBlock = false;
  let inStyleBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (inNoteBlock || inStyleBlock) {
      if (trimmed === "") {
        inNoteBlock = false;
        inStyleBlock = false;
      }
      continue;
    }

    if (trimmed === "") {
      out.push("");
      continue;
    }
    if (trimmed === "WEBVTT" || /^WEBVTT[\s-]/.test(trimmed)) continue;
    if (/^NOTE(\s|$)/.test(trimmed)) {
      inNoteBlock = true;
      continue;
    }
    if (/^STYLE(\s|$)/.test(trimmed)) {
      inStyleBlock = true;
      continue;
    }
    if (VTT_TIMESTAMP_RE.test(trimmed)) continue;
    if (PURE_NUMBER_RE.test(trimmed)) continue;

    // VTT speaker tag: <v Maya>Text → "Maya: Text"
    let processed = trimmed.replace(VTT_VOICE_TAG_RE, "$1: ");
    processed = processed.replace(ANY_VTT_TAG_RE, "");
    processed = processed.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
    processed = processed.replace(/\s+/g, " ").trim();

    if (processed) out.push(processed);
  }

  return collapseBlankLines(out);
}

export function cleanSrt(raw: string): string {
  const lines = normalize(raw);
  const out: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      out.push("");
      continue;
    }
    if (PURE_NUMBER_RE.test(trimmed)) continue;
    if (SRT_TIMESTAMP_RE.test(trimmed)) continue;

    // SRT sometimes carries inline tags too
    const processed = trimmed.replace(ANY_VTT_TAG_RE, "").replace(/\s+/g, " ").trim();
    if (processed) out.push(processed);
  }

  return collapseBlankLines(out);
}

export type TranscriptKind = "vtt" | "srt" | "txt";

export function detectKind(filename: string): TranscriptKind {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".vtt")) return "vtt";
  if (lower.endsWith(".srt")) return "srt";
  return "txt";
}

/**
 * Front door: route the raw file content to the right cleaner based on the
 * filename. Plain text passes through with whitespace normalization only.
 */
export function cleanTranscriptFile(filename: string, raw: string): { kind: TranscriptKind; text: string } {
  const kind = detectKind(filename);
  if (kind === "vtt") return { kind, text: cleanVtt(raw) };
  if (kind === "srt") return { kind, text: cleanSrt(raw) };
  return { kind, text: collapseBlankLines(normalize(raw)) };
}
