import type { ReactNode, HTMLAttributes } from "react";

/* ─── GlassPanel ─────────────────────────────────────────── */
interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "none" | "violet" | "cyan" | "coral";
  variant?: "default" | "raised" | "modal";
  children?: ReactNode;
}
const GLOW_MAP: Record<NonNullable<GlassPanelProps["glow"]>, string> = {
  none:   "",
  violet: "0 0 32px rgba(124,58,237,0.18)",
  cyan:   "0 0 32px rgba(34,211,238,0.18)",
  coral:  "0 0 32px rgba(255,107,74,0.18)",
};
export function GlassPanel({
  glow = "none", variant = "default", className = "", children, style, ...rest
}: GlassPanelProps) {
  const base =
    "rounded-2xl border";
  const bg =
    variant === "raised"
      ? "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)"
      : variant === "modal"
        ? "rgba(15,11,36,0.92)"
        : "rgba(255,255,255,0.045)";
  const cardShadow = "0 24px 70px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)";
  const composedShadow = GLOW_MAP[glow]
    ? `${cardShadow}, ${GLOW_MAP[glow]}`
    : cardShadow;
  return (
    <div
      className={`${base} ${className}`}
      style={{
        background: bg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(168,140,255,0.16)",
        boxShadow: composedShadow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ─── Button ─────────────────────────────────────────────── */
type ButtonVariant = "primary" | "ghost" | "danger";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}
const BUTTON_VARIANTS: Record<ButtonVariant, { bg: string; color: string; border: string; shadow: string; hover: string }> = {
  primary: {
    bg: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)",
    color: "#FFFFFF",
    border: "none",
    shadow: "0 18px 40px rgba(124,58,237,0.40), 0 0 24px rgba(124,58,237,0.25)",
    hover: "translateY(-1px)",
  },
  ghost: {
    bg: "rgba(255,255,255,0.04)",
    color: "#F5F4FC",
    border: "1px solid rgba(168,140,255,0.18)",
    shadow: "none",
    hover: "none",
  },
  danger: {
    bg: "linear-gradient(135deg, #FF6B4A 0%, #E04A2A 100%)",
    color: "#FFFFFF",
    border: "none",
    shadow: "0 18px 40px rgba(255,107,74,0.30)",
    hover: "translateY(-1px)",
  },
};
export function Button({
  variant = "primary", fullWidth, className = "", children, style, ...rest
}: ButtonProps) {
  const v = BUTTON_VARIANTS[variant];
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      style={{
        background: v.bg,
        color: v.color,
        border: v.border,
        boxShadow: v.shadow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ─── StatusPill ─────────────────────────────────────────── */
type StatusKind = "decided" | "blocked" | "ontrack" | "live" | "complete" | "atrisk";
const STATUS_MAP: Record<StatusKind, { label: string; color: string; bg: string; border: string }> = {
  decided:  { label: "Decided",             color: "#C4B5FD", bg: "rgba(124,58,237,0.14)", border: "rgba(124,58,237,0.32)" },
  blocked:  { label: "Blocked",             color: "#FFB89E", bg: "rgba(255,107,74,0.14)", border: "rgba(255,107,74,0.32)" },
  ontrack:  { label: "On track",            color: "#86EFAC", bg: "rgba(34,197,94,0.14)",  border: "rgba(34,197,94,0.32)" },
  live:     { label: "LIVE",                color: "#86EFAC", bg: "rgba(34,197,94,0.14)",  border: "rgba(34,197,94,0.32)" },
  complete: { label: "AI analysis complete", color: "#86EFAC", bg: "rgba(34,197,94,0.14)", border: "rgba(34,197,94,0.32)" },
  atrisk:   { label: "At risk",             color: "#FDD27E", bg: "rgba(245,165,36,0.14)", border: "rgba(245,165,36,0.32)" },
};
export function StatusPill({
  kind, label, dot = true,
}: { kind: StatusKind; label?: string; dot?: boolean }) {
  const s = STATUS_MAP[kind];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />}
      {label ?? s.label}
    </span>
  );
}

/* ─── SeverityTag ────────────────────────────────────────── */
type SeverityKind = "HIGH" | "MEDIUM" | "LOW";
const SEVERITY_MAP: Record<SeverityKind, { color: string; bg: string; border: string }> = {
  HIGH:   { color: "#FFB89E", bg: "rgba(255,107,74,0.14)", border: "rgba(255,107,74,0.34)" },
  MEDIUM: { color: "#FDD27E", bg: "rgba(245,165,36,0.14)", border: "rgba(245,165,36,0.34)" },
  LOW:    { color: "#86EFAC", bg: "rgba(34,197,94,0.14)",  border: "rgba(34,197,94,0.34)" },
};
export function SeverityTag({ level }: { level: SeverityKind }) {
  const s = SEVERITY_MAP[level];
  return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {level}
    </span>
  );
}

/* ─── ConfidenceDot ──────────────────────────────────────── */
export function ConfidenceDot({ value }: { value: number }) {
  const color = value >= 90 ? "#22C55E" : value >= 70 ? "#F5A524" : "#FF6B4A";
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
      />
      <span className="text-[10px] font-semibold tabular-nums" style={{ color }}>
        {value}%
      </span>
    </span>
  );
}

/* ─── GlowBorder wrapper ─────────────────────────────────── */
export function GlowBorder({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.55) 0%, rgba(34,211,238,0.35) 100%)",
        padding: "1px",
      }}
    >
      <div className="relative rounded-2xl" style={{ background: "#0F0B24" }}>
        {children}
      </div>
    </div>
  );
}
