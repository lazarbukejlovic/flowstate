"use client";

import { useRef, useId, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Zap, Mic, ListChecks, Users, ShieldAlert,
  Calendar, LayoutGrid, Share2,
} from "lucide-react";

/* ─── Geometry (logical 800×800 space, scaled to fit the responsive square) ─── */
const SIZE = 800;
const CX = SIZE / 2;       // 400
const CY = SIZE / 2;       // 400

const REDUCE = "(prefers-reduced-motion: reduce)";

/* Card radii = 35–39% of the logical container (per spec's 38–42% guideline,
 * pulled in slightly so cards never bleed outside the aspect-locked square). */
const ORBIT_CARDS = [
  {
    id: "transcript",
    label: "Transcript Ingestion",
    desc: "Recording & transcribing…",
    icon: Mic,
    color: "text-blue-300",
    border: "rgba(96,165,250,0.32)",
    glow: "rgba(59,130,246,0.32)",
    particle: "rgba(96,165,250,1)",
    radius: 290,   // 36.2%
    duration: 86,  // slow, elegant
    angle: 0,
    live: true,
  },
  {
    id: "actions",
    label: "Action Items",
    desc: "7 new detected",
    icon: ListChecks,
    color: "text-violet-300",
    border: "rgba(167,139,250,0.32)",
    glow: "rgba(124,58,237,0.32)",
    particle: "rgba(167,139,250,1)",
    badge: "7 new",
    radius: 305,
    duration: 78,
    angle: 51,
  },
  {
    id: "owners",
    label: "Owners",
    desc: "Auto-assigned · 4 people",
    icon: Users,
    color: "text-emerald-300",
    border: "rgba(110,231,183,0.32)",
    glow: "rgba(16,185,129,0.27)",
    particle: "rgba(110,231,183,1)",
    badge: "Auto",
    radius: 295,
    duration: 70,
    angle: 102,
  },
  {
    id: "risks",
    label: "Risks",
    desc: "3 detected",
    icon: ShieldAlert,
    color: "text-orange-300",
    border: "rgba(253,186,116,0.32)",
    glow: "rgba(255,107,74,0.30)",
    particle: "rgba(253,186,116,1)",
    badge: "3 detected",
    radius: 308,
    duration: 82,
    angle: 153,
  },
  {
    id: "timeline",
    label: "Timeline",
    desc: "Updated live",
    icon: Calendar,
    color: "text-cyan-300",
    border: "rgba(103,232,249,0.32)",
    glow: "rgba(34,211,238,0.27)",
    particle: "rgba(34,211,238,1)",
    badge: "Updated",
    radius: 295,
    duration: 74,
    angle: 204,
  },
  {
    id: "delivery",
    label: "Delivery Board",
    desc: "Live · 5 done · 2 in progress",
    icon: LayoutGrid,
    color: "text-green-300",
    border: "rgba(134,239,172,0.32)",
    glow: "rgba(34,197,94,0.32)",
    particle: "rgba(134,239,172,1)",
    radius: 312,
    duration: 88,
    angle: 255,
    live: true,
  },
  {
    id: "sync",
    label: "Team Sync",
    desc: "All updates synchronized",
    icon: Share2,
    color: "text-blue-300",
    border: "rgba(125,211,252,0.32)",
    glow: "rgba(59,130,246,0.27)",
    particle: "rgba(125,211,252,1)",
    badge: "Connected",
    radius: 300,
    duration: 80,
    angle: 306,
  },
];

function polarPoint(angleDeg: number, radius: number) {
  const r = (angleDeg * Math.PI) / 180;
  return { x: CX + Math.cos(r) * radius, y: CY + Math.sin(r) * radius };
}

/* ─── Inflowing data particle (card → core) ──────────────── */
function InflowParticle({
  from, color, delay, duration, glowId,
}: {
  from: { x: number; y: number };
  color: string;
  delay: number;
  duration: number;
  glowId: string;
}) {
  return (
    <motion.circle
      r={2.5}
      fill={color}
      filter={`url(#${glowId})`}
      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
      animate={{
        cx: [from.x, CX, CX],
        cy: [from.y, CY, CY],
        opacity: [0, 1, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeIn", times: [0, 0.85, 1] }}
    />
  );
}

/* ─── Orbiting card — outer rotates, inner counter-rotates ─── */
function OrbitingCard({
  card, inView, idx,
}: { card: (typeof ORBIT_CARDS)[0]; inView: boolean; idx: number }) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ rotate: card.angle, opacity: 0, scale: 0.85 }}
      animate={inView ? { rotate: card.angle + 360, opacity: 1, scale: 1 } : {}}
      transition={{
        rotate:  { duration: card.duration, repeat: Infinity, ease: "linear" },
        opacity: { duration: 0.55, delay: 0.4 + idx * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        scale:   { duration: 0.55, delay: 0.4 + idx * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      }}
      style={{
        position: "absolute",
        left: CX,
        top: CY,
        width: 0,
        height: 0,
        willChange: "transform",
      }}
      data-orbit-card
    >
      <div style={{ position: "absolute", left: card.radius, top: 0, transform: "translate(-50%, -50%)" }}>
        {/* Counter-rotate so card text stays upright */}
        <motion.div
          initial={{ rotate: -card.angle }}
          animate={inView ? { rotate: -(card.angle + 360) } : {}}
          transition={{ duration: card.duration, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        >
          <motion.div
            animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.10, 1] }}
            transition={{ duration: 3.5 + idx * 0.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-3 rounded-2xl pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${card.glow} 0%, transparent 70%)`, filter: "blur(10px)" }}
          />
          <div
            className="relative rounded-2xl border px-3.5 py-3 flex items-center gap-2.5 whitespace-nowrap"
            style={{
              backdropFilter: "blur(16px)",
              boxShadow: `0 16px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${card.glow}`,
              background: "linear-gradient(180deg, rgba(28,22,56,0.88) 0%, rgba(15,11,36,0.88) 100%)",
              borderColor: card.border,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: card.glow.replace("0.32", "0.18").replace("0.27", "0.15").replace("0.30", "0.18"),
                border: `1px solid ${card.border}`,
              }}
            >
              <Icon size={15} className={card.color} />
            </motion.div>
            <div>
              <p className="text-[12px] font-semibold leading-tight" style={{ color: "#F5F4FC" }}>{card.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#ABA6C9" }}>{card.desc}</p>
            </div>
            {card.live && (
              <div className="ml-1 flex items-center gap-1 flex-shrink-0 px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.32)" }}>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-1 h-1 rounded-full"
                  style={{ background: "#22C55E", boxShadow: "0 0 6px rgba(34,197,94,0.9)" }}
                />
                <span className="text-[8px] font-bold tracking-wider" style={{ color: "#86EFAC" }}>LIVE</span>
              </div>
            )}
            {card.badge && !card.live && (
              <span
                className="ml-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: card.glow.replace("0.32", "0.14").replace("0.27", "0.12").replace("0.30", "0.14"),
                  border: `1px solid ${card.border}`,
                  color: card.color === "text-blue-300" ? "#93C5FD"
                    : card.color === "text-violet-300" ? "#C4B5FD"
                    : card.color === "text-emerald-300" ? "#86EFAC"
                    : card.color === "text-orange-300" ? "#FDD27E"
                    : card.color === "text-cyan-300" ? "#67E8F9"
                    : card.color === "text-green-300" ? "#86EFAC"
                    : "#F5F4FC",
                }}
              >
                {card.badge}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Mobile fallback grid card ──────────────────────────── */
function GridCard({ card, inView, idx }: { card: (typeof ORBIT_CARDS)[0]; inView: boolean; idx: number }) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + idx * 0.07, duration: 0.45, ease: [0.22,1,0.36,1] as [number, number, number, number] }}
      className="rounded-xl border px-3 py-2.5 flex items-center gap-3"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(15,11,36,0.75)",
        borderColor: card.border,
        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 16px ${card.glow}`,
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: card.glow.replace("0.32", "0.15").replace("0.27", "0.12").replace("0.30", "0.15"),
          border: `1px solid ${card.border}`,
        }}>
        <Icon size={16} className={card.color} />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#F5F4FC" }}>{card.label}</p>
        <p className="text-xs mt-0.5" style={{ color: "#ABA6C9" }}>{card.desc}</p>
      </div>
      {card.live && (
        <div className="ml-auto flex items-center gap-1 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#22C55E", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
          <span className="text-[9px] font-bold" style={{ color: "#86EFAC" }}>LIVE</span>
        </div>
      )}
    </motion.div>
  );
}

const STATS = [
  { value: "10×",    label: "Faster decision capture" },
  { value: "3.2×",   label: "Fewer risks missed" },
  { value: "~4 hrs", label: "Saved per meeting" },
  { value: "98%",    label: "Teams more aligned" },
];

function Sparkle({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M 6 0 L 7 5 L 12 6 L 7 7 L 6 12 L 5 7 L 0 6 L 5 5 Z" fill="#A78BFA" />
    </svg>
  );
}

/* ─── ResizeObserver-based scale hook ────────────────────── */
function useContainerScale(targetSize: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setScale(w / targetSize);
    });
    ro.observe(el);
    // Initial measurement
    const initialW = el.getBoundingClientRect().width;
    if (initialW > 0) setScale(initialW / targetSize);
    return () => ro.disconnect();
  }, [targetSize]);
  return { ref, scale };
}

/* ─── Main section ────────────────────────────────────────── */
export function OrbitSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-12% 0px" });
  const reactId = useId().replace(/[:]/g, "");
  const glowFilter = `pglow-${reactId}`;
  const { ref: orbitBoxRef, scale } = useContainerScale(SIZE);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Section background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[900px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.13) 0%, transparent 65%)" }}
      />

      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] as [number, number, number, number] }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-violet-200 text-xs font-semibold mb-5"
            style={{
              background: "rgba(124,58,237,0.10)",
              border: "1px solid rgba(124,58,237,0.32)",
              backdropFilter: "blur(8px)",
            }}>
            <Sparkle />
            One AI core. Eight execution outputs.
          </div>
          <h2 className="font-display font-bold mb-4 tracking-[-0.035em]"
            style={{
              fontSize: "clamp(40px, 6vw, 80px)",
              lineHeight: 1.02,
              color: "#F5F4FC",
            }}>
            The AI engine for<br />
            <span className="accent-text">delivery that moves.</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg leading-relaxed" style={{ color: "#ABA6C9" }}>
            Flowstate listens, understands, and turns every conversation into a coordinated delivery board.
          </p>
        </motion.div>
      </div>

      {/* ─── Centered, aspect-locked square orbit container (md+) ─── */}
      <div className="hidden md:flex items-center justify-center relative">
        <div
          ref={orbitBoxRef}
          className="relative"
          style={{
            width: "min(720px, 78vh, 90vw)",
            aspectRatio: "1 / 1",
            margin: "0 auto",
          }}
        >
          {/* Logical 800×800 inner space scaled to fit */}
          <div
            style={{
              width: SIZE,
              height: SIZE,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: "center",
            }}
          >
            {/* SVG layer — orbit rings + inflowing particles + traveling dots */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
            >
              <defs>
                <filter id={glowFilter} x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="3" />
                  <feComposite in="SourceGraphic" />
                </filter>
                <filter id={`ringGlow-${reactId}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>

              {/* Static dashed orbit rings */}
              <circle cx={CX} cy={CY} r={290} fill="none" stroke="rgba(124,58,237,0.14)" strokeWidth={1} strokeDasharray="3 14" />
              <circle cx={CX} cy={CY} r={320} fill="none" stroke="rgba(124,58,237,0.10)" strokeWidth={1} strokeDasharray="3 18" />
              <circle cx={CX} cy={CY} r={210} fill="none" stroke="rgba(59,130,246,0.10)" strokeWidth={1} strokeDasharray="2 10" />

              {/* Breathing ring */}
              <motion.circle
                cx={CX} cy={CY} r={260}
                fill="none"
                stroke="rgba(124,58,237,0.30)"
                strokeWidth={1}
                filter={`url(#ringGlow-${reactId})`}
                animate={{ opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Inflowing data particles from each card's start angle */}
              {ORBIT_CARDS.map((card, idx) => {
                const from = polarPoint(card.angle, card.radius - 70);
                return (
                  <g key={card.id}>
                    <InflowParticle from={from} color={card.particle} delay={idx * 0.5}        duration={3.4 + idx * 0.2} glowId={glowFilter} />
                    <InflowParticle from={from} color={card.particle} delay={idx * 0.5 + 1.7}  duration={3.4 + idx * 0.2} glowId={glowFilter} />
                  </g>
                );
              })}

              {/* Particles traveling along the orbit ring (clockwise illusion) */}
              {[0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={`sweep-${i}`}
                  r={3}
                  fill="rgba(167,139,250,1)"
                  filter={`url(#${glowFilter})`}
                  animate={{
                    cx: Array.from({ length: 36 }, (_, k) => {
                      const t = (k / 35) * 2 * Math.PI;
                      return CX + Math.cos(t) * 290;
                    }),
                    cy: Array.from({ length: 36 }, (_, k) => {
                      const t = (k / 35) * 2 * Math.PI;
                      return CY + Math.sin(t) * 290;
                    }),
                  }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: i * 5.5 }}
                />
              ))}
            </svg>

            {/* ─── Central AI Core ─── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, ease: [0.22,1,0.36,1] as [number, number, number, number] }}
              className="absolute"
              style={{ left: CX, top: CY, transform: "translate(-50%, -50%)" }}
            >
              {/* Pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[0, 1.2, 2.4].map((d) => (
                  <motion.div
                    key={d}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.45, 0, 0.45] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeOut", delay: d }}
                    className="absolute rounded-full border border-violet-400/30"
                    style={{ width: 220, height: 220 }}
                  />
                ))}
              </div>

              {/* Ambient halo */}
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute pointer-events-none"
                style={{
                  width: 480, height: 480, left: -240, top: -240,
                  background: "radial-gradient(circle, rgba(124,58,237,0.32) 0%, transparent 60%)",
                }}
              />

              {/* Orb body — breathing glow */}
              <motion.div
                animate={{
                  scale: [1, 1.03, 1],
                  boxShadow: [
                    "0 0 80px rgba(124,58,237,0.60), 0 0 160px rgba(124,58,237,0.30), 0 0 240px rgba(124,58,237,0.15), inset 0 0 60px rgba(167,139,250,0.25)",
                    "0 0 110px rgba(124,58,237,0.85), 0 0 220px rgba(124,58,237,0.45), 0 0 320px rgba(124,58,237,0.22), inset 0 0 80px rgba(167,139,250,0.40)",
                    "0 0 80px rgba(124,58,237,0.60), 0 0 160px rgba(124,58,237,0.30), 0 0 240px rgba(124,58,237,0.15), inset 0 0 60px rgba(167,139,250,0.25)",
                  ],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center overflow-hidden"
                style={{
                  background: "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.25) 0%, rgba(167,139,250,0.50) 22%, rgba(124,58,237,0.88) 58%, rgba(79,28,157,1) 100%)",
                  border: "1px solid rgba(167,139,250,0.40)",
                  willChange: "transform",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 pointer-events-none rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.18) 20%, transparent 40%, rgba(34,211,238,0.22) 60%, transparent 80%, rgba(167,139,250,0.22) 100%)",
                  }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-1 rounded-full pointer-events-none"
                  style={{
                    background: "conic-gradient(from 90deg, transparent 78%, rgba(255,255,255,0.32) 90%, transparent 100%)",
                  }}
                />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: "12%", left: "20%", width: "32%", height: "24%",
                    background: "radial-gradient(ellipse, rgba(255,255,255,0.50), transparent 70%)",
                    filter: "blur(3px)",
                    borderRadius: "50%",
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.10, 1], y: [0, -2, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <Zap size={44} className="text-white fill-white" style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.7))" }} />
                </motion.div>
              </motion.div>

              {/* AI Core pill (placed BELOW the orb, BELOW where any card could overlap) */}
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-full whitespace-nowrap"
                style={{
                  bottom: -28,
                  background: "linear-gradient(180deg, rgba(20,15,40,0.95) 0%, rgba(10,8,24,0.95) 100%)",
                  border: "1px solid rgba(167,139,250,0.35)",
                  padding: "5px 14px",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(124,58,237,0.20)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkle />
                  <span className="text-[11px] font-bold" style={{ color: "#F5F4FC" }}>Flowstate Core</span>
                </div>
              </div>
            </motion.div>

            {/* Orbiting feature cards */}
            {ORBIT_CARDS.map((card, idx) => (
              <OrbitingCard key={card.id} card={card} inView={inView} idx={idx} />
            ))}
          </div>
        </div>
      </div>

      {/* Caption — placed OUTSIDE the orbit container so it never sits behind a card */}
      <div className="hidden md:block text-center mt-6 mb-2">
        <p className="text-sm leading-relaxed" style={{ color: "#ABA6C9" }}>
          Understands. Extracts. Acts.
        </p>
        <p className="text-xs" style={{ color: "#6E6A87" }}>Continuously improving.</p>
      </div>

      {/* Mobile grid (below md) */}
      <div className="md:hidden max-w-2xl mx-auto px-5 grid grid-cols-1 gap-3 mt-4 mb-12">
        <div className="flex items-center justify-center gap-3 py-6 mt-2 rounded-2xl"
          style={{
            background: "rgba(124,58,237,0.06)",
            border: "1px solid rgba(124,58,237,0.22)",
          }}>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.20) 0%, rgba(124,58,237,0.85) 60%, rgba(79,28,157,1) 100%)",
              boxShadow: "0 0 40px rgba(124,58,237,0.50)",
              border: "1px solid rgba(167,139,250,0.40)",
            }}
          >
            <Zap size={20} className="text-white fill-white" />
          </motion.div>
          <div>
            <p className="text-base font-bold" style={{ color: "#F5F4FC" }}>Flowstate Core</p>
            <p className="text-[12px]" style={{ color: "#ABA6C9" }}>Understands. Extracts. Acts.</p>
          </div>
        </div>
        {ORBIT_CARDS.map((card, idx) => (
          <GridCard key={card.id} card={card} inView={inView} idx={idx} />
        ))}
      </div>

      {/* Stats strip */}
      <div className="relative max-w-6xl mx-auto px-5 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.6, ease: [0.22,1,0.36,1] as [number, number, number, number] }}
          className="rounded-2xl p-6 lg:p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(28,22,56,0.70) 0%, rgba(15,11,36,0.70) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(168,140,255,0.18)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
          />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {STATS.map((s, i) => (
              <div key={s.value} className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.32)",
                    boxShadow: "0 0 16px rgba(124,58,237,0.22)",
                  }}
                >
                  <Zap size={16} style={{ color: "#A855F7" }} />
                </motion.div>
                <div>
                  <p className="font-display text-2xl font-bold leading-none tracking-[-0.025em]"
                    style={{ color: "#F5F4FC" }}>{s.value}</p>
                  <p className="text-[10px] mt-1 leading-tight" style={{ color: "#ABA6C9" }}>{s.label}</p>
                </div>
                {i < STATS.length - 1 && (
                  <div className="hidden lg:block h-10 w-px ml-auto" style={{ background: "rgba(168,140,255,0.10)" }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reduced motion: freeze orbit rotation (cards still visible at their start angles) */}
      <style>{`
        @media ${REDUCE} {
          [data-orbit-card] { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
