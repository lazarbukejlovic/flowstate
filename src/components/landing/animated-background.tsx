"use client";

/* ─── Static star field (deterministic positions) ────────── */
const STARS = Array.from({ length: 80 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rnd = (s: number) => ((s * 9301 + 49297) % 233280) / 233280;
  return {
    left: rnd(seed) * 100,
    top: rnd(seed + 17) * 100,
    size: 0.5 + rnd(seed + 33) * 1.8,
    opacity: 0.2 + rnd(seed + 51) * 0.7,
    twinkleDur: 2 + rnd(seed + 71) * 4,
    delay: rnd(seed + 89) * 6,
  };
});

const PARTICLES = [
  { left: "12%", top: "22%", size: 3, color: "rgba(167,139,250,0.9)",  delay: 0,    dur: 18 },
  { left: "28%", top: "55%", size: 2, color: "rgba(96,165,250,0.8)",   delay: 2,    dur: 22 },
  { left: "42%", top: "33%", size: 4, color: "rgba(34,211,238,0.85)",  delay: 4.5,  dur: 26 },
  { left: "58%", top: "72%", size: 2, color: "rgba(167,139,250,0.7)",  delay: 1.5,  dur: 19 },
  { left: "72%", top: "20%", size: 3, color: "rgba(139,92,246,0.85)",  delay: 3,    dur: 24 },
  { left: "85%", top: "55%", size: 2, color: "rgba(96,165,250,0.7)",   delay: 5,    dur: 21 },
  { left: "8%",  top: "75%", size: 3, color: "rgba(34,211,238,0.7)",   delay: 6.5,  dur: 25 },
];

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">

      {/* ─── Deep cosmic base ───────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 100% 70% at 50% -8%, rgba(124,58,237,0.25) 0%, transparent 50%)",
            "radial-gradient(ellipse 60% 50% at 90% 30%, rgba(59,130,246,0.14) 0%, transparent 55%)",
            "radial-gradient(ellipse 50% 50% at 10% 70%, rgba(6,182,212,0.10) 0%, transparent 55%)",
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(79,28,157,0.20) 0%, transparent 60%)",
            "linear-gradient(180deg, #050810 0%, #070B14 50%, #04060C 100%)",
          ].join(", "),
        }}
      />

      {/* ─── Star field ─────────────────────────────────── */}
      <div className="absolute inset-0">
        {STARS.map((s, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: "white",
              opacity: s.opacity,
              boxShadow: s.size > 1.2 ? `0 0 ${s.size * 2}px rgba(255,255,255,0.4)` : undefined,
              animation: `twinkle ${s.twinkleDur}s ease-in-out infinite ${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ─── Grid overlay ───────────────────────────────── */}
      <div className="absolute inset-0 dark-grid-bg opacity-30" />

      {/* ─── Distant nebulas ────────────────────────────── */}
      <div
        className="blob-float absolute -top-[15%] left-[40%] -translate-x-1/2 w-[1100px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 60%)" }}
      />
      <div
        className="blob-float-slow absolute top-[25%] -right-[15%] w-[900px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.13) 0%, transparent 60%)" }}
      />
      <div
        className="blob-float-med absolute -bottom-[12%] -left-[10%] w-[800px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.10) 0%, transparent 60%)" }}
      />
      <div
        className="blob-float absolute bottom-[10%] right-[20%] w-[600px] h-[500px] rounded-full opacity-70"
        style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.10) 0%, transparent 60%)", animationDelay: "8s" }}
      />

      {/* ─── Scanning beam ──────────────────────────────── */}
      <div
        className="beam-sweep absolute top-0 bottom-0 w-[1px]"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.4) 30%, rgba(167,139,250,0.9) 50%, rgba(124,58,237,0.4) 70%, transparent 100%)",
          boxShadow: "0 0 20px rgba(124,58,237,0.6), 0 0 40px rgba(124,58,237,0.3)",
        }}
      />

      {/* ─── Larger floating particles ──────────────────── */}
      {PARTICLES.map((p, i) => (
        <div
          key={`part-${i}`}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 6}px ${p.color}`,
            animation: `blob-float ${p.dur}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}

      {/* ─── Bottom wave/mesh effect ────────────────────── */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{ height: "180px", opacity: 0.42 }}
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(124,58,237,0.6)" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.5)" />
          </linearGradient>
        </defs>
        {/* Multiple wave paths for depth */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M 0 ${130 + i * 8} Q 360 ${100 + i * 12} 720 ${135 + i * 6} T 1440 ${125 + i * 9} L 1440 200 L 0 200 Z`}
            fill={i % 2 === 0 ? "url(#waveGrad1)" : "url(#waveGrad2)"}
            opacity={0.18 - i * 0.025}
          />
        ))}
      </svg>

      {/* ─── Bottom fade to black for depth ─────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none"
        style={{ background: "linear-gradient(to top, #04060C 0%, transparent 100%)" }}
      />

    </div>
  );
}
