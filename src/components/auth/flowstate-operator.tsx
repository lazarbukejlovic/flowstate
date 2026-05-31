"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Hand, ChevronUp } from "lucide-react";

/* Drop your 3D render at /public/flow-robot.png — component auto-detects it.
 * If missing, falls back to /public/flow-robot.svg, then to the inline SVG. */
const FLOW_ROBOT_PNG = "/flow-robot.png";
const FLOW_ROBOT_SVG = "/flow-robot.svg";

/* ─── Orbit particle ─────────────────────────────────────── */
function OrbitDot({
  radius, size, color, duration, initialAngle = 0, awake,
}: {
  radius: number; size: number; color: string;
  duration: number; initialAngle?: number; awake: boolean;
}) {
  const r = awake ? radius : radius * 0.7;
  const d = awake ? duration : duration * 2.2;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, background: color,
        boxShadow: `0 0 ${size * 4}px ${color}`,
        left: "50%", top: "50%",
        marginLeft: -size / 2, marginTop: -size / 2,
      }}
      animate={{
        x: [
          Math.cos((initialAngle * Math.PI) / 180) * r,
          Math.cos(((initialAngle + 120) * Math.PI) / 180) * r,
          Math.cos(((initialAngle + 240) * Math.PI) / 180) * r,
          Math.cos((initialAngle * Math.PI) / 180) * r,
        ],
        y: [
          Math.sin((initialAngle * Math.PI) / 180) * r,
          Math.sin(((initialAngle + 120) * Math.PI) / 180) * r,
          Math.sin(((initialAngle + 240) * Math.PI) / 180) * r,
          Math.sin((initialAngle * Math.PI) / 180) * r,
        ],
        opacity: awake ? 1 : 0.3,
      }}
      transition={{ duration: d, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Pulse ring ─────────────────────────────────────────── */
function PulseRing({ delay, color, awake }: { delay: number; color: string; awake: boolean }) {
  if (!awake) return null;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none border-2"
      style={{ borderColor: color, left: "50%", top: "42%", translateX: "-50%", translateY: "-50%" }}
      initial={{ width: 80, height: 80, opacity: 0.7 }}
      animate={{ width: 380, height: 380, opacity: 0 }}
      transition={{ duration: 3.2, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

/* ─── Typewriter ─────────────────────────────────────────── */
function useTypewriter(text: string, speed = 38, startDelay = 0, active = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    let i = 0;
    const delay = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay, active]);

  return { displayed, done };
}

/* ─── Speech bubble ──────────────────────────────────────── */
function SpeechBubble({ awake, line1, line2, line3 }: {
  awake: boolean;
  line1: { displayed: string; done: boolean };
  line2: { displayed: string; done: boolean };
  line3: { displayed: string; done: boolean };
}) {
  return (
    <AnimatePresence>
      {awake && (
        <motion.div
          key="bubble"
          initial={{ opacity: 0, x: -16, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22,1,0.36,1] as [number, number, number, number] }}
          className="absolute z-30"
          style={{ left: "74%", top: "20%" }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-2xl px-4 py-3 max-w-[260px]"
            style={{
              background: "linear-gradient(180deg, rgba(28,22,56,0.96) 0%, rgba(15,11,36,0.96) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(167,139,250,0.35)",
              boxShadow: "0 18px 44px rgba(0,0,0,0.60), 0 0 36px rgba(124,58,237,0.25)",
            }}
          >
            {/* Pointer to the bot */}
            <svg className="absolute -left-2.5 top-6" width="14" height="20" viewBox="0 0 14 20" fill="none">
              <path d="M 14 0 L 14 20 L 0 10 Z" fill="rgba(28,22,56,0.96)" />
              <path d="M 14 0 L 0 10 L 14 20" stroke="rgba(167,139,250,0.35)" strokeWidth="1" fill="none" />
            </svg>

            <div className="flex items-start gap-1.5 mb-1.5">
              <motion.div
                animate={{ rotate: [0, 18, -8, 18, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
              >
                <Hand size={14} className="text-yellow-300 flex-shrink-0" />
              </motion.div>
              <span className="text-[12px] font-semibold" style={{ color: "#F5F4FC" }}>
                {line1.displayed}
                {!line1.done && line1.displayed && <span className="typewriter-cursor" />}
              </span>
            </div>
            {line1.done && (
              <p className="text-[13px] font-semibold leading-snug mb-1.5" style={{ color: "#F5F4FC" }}>
                I&apos;m <span style={{ color: "#A855F7" }}>Flow</span>,&nbsp;
                <span>
                  {line2.displayed}
                  {!line2.done && <span className="typewriter-cursor" />}
                </span>
              </p>
            )}
            {line2.done && (
              <p className="text-[11px] leading-relaxed min-h-[16px]" style={{ color: "#ABA6C9" }}>
                {line3.displayed}
                {!line3.done && <span className="typewriter-cursor" />}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Inline SVG fallback (used when /flow-robot.png is missing) ─── */
function FallbackRobotSvg() {
  return (
    <svg width="240" height="280" viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fbHead" cx="50%" cy="25%" r="70%">
          <stop offset="0%"  stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F2EEFF" />
          <stop offset="100%" stopColor="#C9C0E5" />
        </radialGradient>
        <radialGradient id="fbShoulder" cx="50%" cy="20%" r="70%">
          <stop offset="0%"  stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#BAB0D8" />
        </radialGradient>
        <radialGradient id="fbVisor" cx="50%" cy="40%" r="65%">
          <stop offset="0%"  stopColor="#1E1438" />
          <stop offset="100%" stopColor="#08031A" />
        </radialGradient>
        <radialGradient id="fbEye" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#FFF8FF" />
          <stop offset="35%"  stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
      </defs>
      {/* Body */}
      <path
        d="M 18 188 Q 16 174 30 172 L 170 172 Q 184 174 182 188 L 182 215 Q 182 228 170 228 L 30 228 Q 18 228 18 215 Z"
        fill="url(#fbShoulder)" stroke="rgba(124,58,237,0.28)" strokeWidth="1"
      />
      {/* Chest bolt */}
      <circle cx="100" cy="200" r="12" fill="rgba(124,58,237,0.85)" />
      <circle cx="100" cy="200" r="10" fill="rgba(167,139,250,0.95)" />
      <path d="M 102 192 L 96 202 L 100 202 L 98 208 L 104 198 L 100 198 Z" fill="#fff" />
      {/* Neck */}
      <rect x="82" y="150" width="36" height="24" rx="6" fill="#E8E1F8" stroke="rgba(124,58,237,0.2)" strokeWidth="0.8" />
      {/* Head */}
      <path
        d="M 28 118 Q 18 90 22 60 Q 30 22 100 18 Q 170 22 178 60 Q 182 90 172 118 Q 168 158 100 162 Q 32 158 28 118 Z"
        fill="url(#fbHead)" stroke="rgba(124,58,237,0.32)" strokeWidth="1.2"
      />
      {/* Visor */}
      <rect x="32" y="74" width="136" height="50" rx="14" fill="url(#fbVisor)" stroke="rgba(124,58,237,0.50)" strokeWidth="1.2" />
      {/* Eyes */}
      <ellipse cx="68"  cy="98" rx="14" ry="13" fill="url(#fbEye)" />
      <ellipse cx="68"  cy="95" rx="4"  ry="3"  fill="#FFFFFF" opacity="0.95" />
      <ellipse cx="132" cy="98" rx="14" ry="13" fill="url(#fbEye)" />
      <ellipse cx="132" cy="95" rx="4"  ry="3"  fill="#FFFFFF" opacity="0.95" />
      {/* Smile */}
      <path d="M 88 116 Q 100 122 112 116" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Cheek blush */}
      <circle cx="48"  cy="110" r="4" fill="rgba(255,182,193,0.4)" />
      <circle cx="152" cy="110" r="4" fill="rgba(255,182,193,0.4)" />
      {/* Antenna */}
      <rect x="95" y="-6" width="10" height="24" rx="5" fill="#D4CCEC" stroke="rgba(124,58,237,0.3)" strokeWidth="0.5" />
      <circle cx="100" cy="-9" r="9"  fill="rgba(124,58,237,0.25)" />
      <circle cx="100" cy="-9" r="5"  fill="#7C3AED" />
      <circle cx="100" cy="-9" r="2.5" fill="#A78BFA" />
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────── */
interface FlowstateOperatorProps {
  onWake?: () => void;
}

export function FlowstateOperator({ onWake }: FlowstateOperatorProps) {
  const [awake, setAwake] = useState(false);
  const [pngFailed, setPngFailed] = useState(false);
  const [svgFailed, setSvgFailed] = useState(false);

  const line1 = useTypewriter("Hi there 👋", 38, 250, awake);
  const line2 = useTypewriter("your AI launch assistant.", 36, line1.done ? 200 : 99999, awake);
  const line3 = useTypewriter("I'll help you turn meetings into momentum.", 32, line2.done ? 150 : 99999, awake);

  function handleClick() {
    if (!awake) {
      setAwake(true);
      onWake?.();
    }
  }

  return (
    <div className="relative flex flex-col items-center" style={{ width: 340, minHeight: 480 }}>

      {/* ─── Glowing platform under the bot ─────────────── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: 70, left: "50%", transform: "translateX(-50%)" }}
        animate={{
          opacity: awake ? [0.85, 1, 0.85] : 0.6,
          scale: awake ? [1, 1.04, 1] : 1,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: awake ? 280 : 220,
            height: awake ? 72 : 58,
            background: "radial-gradient(ellipse, rgba(124,58,237,0.65) 0%, rgba(124,58,237,0.25) 40%, transparent 70%)",
            filter: "blur(8px)",
            transition: "width 600ms, height 600ms",
          }}
        />
      </motion.div>
      <div
        className="absolute pointer-events-none transition-all duration-700"
        style={{
          bottom: 90,
          left: "50%",
          transform: "translateX(-50%)",
          width: awake ? 180 : 142,
          height: awake ? 14 : 12,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(167,139,250,0.92) 0%, rgba(124,58,237,0.48) 60%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />

      {/* Expanding rings on the platform when awake */}
      {awake && (
        <>
          {[0, 0.8, 1.6].map((d) => (
            <motion.div
              key={d}
              className="absolute pointer-events-none rounded-full border"
              style={{ left: "50%", bottom: 80, transform: "translateX(-50%)", borderColor: "rgba(167,139,250,0.65)" }}
              initial={{ width: 150, height: 18, opacity: 0.8 }}
              animate={{ width: 290, height: 34, opacity: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, delay: d }}
            />
          ))}
        </>
      )}

      {/* Ambient halo */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.32) 0%, transparent 65%)",
          opacity: awake ? 1 : 0.55,
        }}
      />
      <div
        className="absolute w-56 h-56 rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(34,211,238,0.22) 0%, transparent 65%)",
          opacity: awake ? 1 : 0.30,
        }}
      />

      {/* Pulse rings */}
      <PulseRing delay={0}   color="rgba(124,58,237,0.32)" awake={awake} />
      <PulseRing delay={1.5} color="rgba(34,211,238,0.24)" awake={awake} />

      {/* Orbit particles */}
      <OrbitDot radius={130} size={6} color="rgba(124,58,237,1)"     duration={6}   initialAngle={0}   awake={awake} />
      <OrbitDot radius={130} size={4} color="rgba(34,211,238,0.9)"   duration={6}   initialAngle={180} awake={awake} />
      <OrbitDot radius={158} size={5} color="rgba(167,139,250,0.85)" duration={10}  initialAngle={60}  awake={awake} />
      <OrbitDot radius={158} size={3} color="rgba(34,211,238,0.75)"  duration={10}  initialAngle={240} awake={awake} />
      <OrbitDot radius={100} size={4} color="rgba(245,165,36,0.75)"  duration={4.5} initialAngle={90}  awake={awake} />

      {/* Speech bubble */}
      <SpeechBubble awake={awake} line1={line1} line2={line2} line3={line3} />

      {/* ─── The bot: PNG render OR fallback SVG ─── */}
      <motion.div
        className="relative cursor-pointer select-none"
        animate={{
          y:      awake ? [0, -12, 0] : [0, -4, 0],
          rotate: awake ? [0, 1.5, 0, -1.5, 0] : [0, 1, 0, -1, 0],
        }}
        transition={{ duration: awake ? 5 : 7, repeat: Infinity, ease: "easeInOut" }}
        onClick={handleClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={{
          zIndex: 10,
          marginTop: 18,
          filter: awake
            ? "drop-shadow(0 12px 32px rgba(124,58,237,0.55)) drop-shadow(0 0 60px rgba(124,58,237,0.40))"
            : "drop-shadow(0 8px 24px rgba(124,58,237,0.35))",
          transition: "filter 0.5s ease",
        }}
        role="button"
        aria-label="Activate Flow"
      >
        {!pngFailed ? (
          <Image
            src={FLOW_ROBOT_PNG}
            alt="Flow — your AI launch assistant"
            width={280}
            height={320}
            priority
            onError={() => setPngFailed(true)}
            style={{ width: 280, height: "auto" }}
            unoptimized
          />
        ) : !svgFailed ? (
          <Image
            src={FLOW_ROBOT_SVG}
            alt="Flow — your AI launch assistant"
            width={280}
            height={320}
            priority
            onError={() => setSvgFailed(true)}
            style={{ width: 280, height: "auto" }}
            unoptimized
          />
        ) : (
          <FallbackRobotSvg />
        )}
      </motion.div>

      {/* Click hint (when asleep) */}
      <AnimatePresence>
        {!awake && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            onClick={handleClick}
            className="absolute z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all hover:scale-105"
            style={{
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(180deg, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.10) 100%)",
              border: "1px solid rgba(124,58,237,0.45)",
              backdropFilter: "blur(12px)",
              color: "#F5F4FC",
              boxShadow: "0 12px 30px rgba(124,58,237,0.30), 0 0 28px rgba(124,58,237,0.20)",
            }}
          >
            <Sparkles size={13} style={{ color: "#A78BFA" }} />
            <span>Click <span style={{ color: "#A78BFA" }} className="font-semibold">Flow</span> to continue</span>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronUp size={14} style={{ color: "#A78BFA" }} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating data fragments on wake */}
      {awake && ([
        { text: "decision",   x: -150, y: 105, color: "#A78BFA", delay: 0.5 },
        { text: "98%",        x: 138,  y: 140, color: "#22D3EE", delay: 1.5 },
        { text: "risk →",     x: -150, y: 195, color: "#FDD27E", delay: 1.0 },
        { text: "Sofia",      x: 138,  y: 232, color: "#86EFAC", delay: 2.2 },
        { text: "3.2s",       x: 120,  y: 75,  color: "#93C5FD", delay: 3.0 },
      ] as { text: string; x: number; y: number; color: string; delay: number }[]).map((frag) => (
        <motion.span
          key={frag.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [frag.y, frag.y - 18, frag.y - 36] }}
          transition={{ duration: 5, repeat: Infinity, delay: frag.delay }}
          className="absolute text-[10px] font-mono font-semibold pointer-events-none whitespace-nowrap"
          style={{
            color: frag.color,
            left: `calc(50% + ${frag.x}px)`,
            zIndex: 5,
            textShadow: `0 0 10px ${frag.color}90`,
          }}
        >
          {frag.text}
        </motion.span>
      ))}
    </div>
  );
}
