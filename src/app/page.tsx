import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { LiquidNav } from "@/components/layout/liquid-nav";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { Hero } from "@/components/landing/hero";
import { KineticWords } from "@/components/landing/kinetic-words";
import { OrbitSection } from "@/components/landing/orbit-section";

/* ─── Integrations strip (honest framing) ─────────────────── */
function IntegrationsStrip() {
  const tools = [
    { name: "Slack",        initials: "SL", color: "linear-gradient(135deg,#4A154B,#36C5F0)" },
    { name: "Google Drive", initials: "GD", color: "linear-gradient(135deg,#0F9D58,#F4B400)" },
    { name: "Notion",       initials: "NT", color: "linear-gradient(135deg,#1F1F1F,#444)" },
    { name: "Linear",       initials: "LI", color: "linear-gradient(135deg,#5E6AD2,#9CA2F5)" },
    { name: "GitHub",       initials: "GH", color: "linear-gradient(135deg,#24292E,#586069)" },
    { name: "Figma",        initials: "FG", color: "linear-gradient(135deg,#A259FF,#F24E1E)" },
    { name: "Zoom",         initials: "ZM", color: "linear-gradient(135deg,#2D8CFF,#4087FA)" },
  ];
  return (
    <div className="relative py-14 border-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto px-5">
        <p className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase mb-8"
          style={{ color: "#A7A3C2" }}>
          Works with the tools you already use
        </p>
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-3">
          {tools.map((t) => (
            <div
              key={t.name}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F4F4FB",
              }}
            >
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold text-white"
                style={{ background: t.color }}>
                {t.initials}
              </span>
              {t.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Final CTA ──────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative px-5 py-32 text-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(124,58,237,0.16) 0%, transparent 65%)" }}
      />
      <div className="absolute inset-0 dark-grid-bg opacity-25 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 text-violet-200 text-xs font-semibold mb-8"
          style={{ background: "rgba(124,58,237,0.10)" }}>
          <Zap size={10} className="fill-violet-400 text-violet-400" />
          Start today · Free · No credit card
        </div>
        <h2 className="font-display font-bold mb-6 leading-[1.05] tracking-[-0.03em]"
          style={{
            fontSize: "clamp(40px, 5.5vw, 72px)",
            color: "#F4F4FB",
          }}>
          Leave the meeting with the<br />
          <span className="accent-text">workspace already built.</span>
        </h2>
        <p className="text-lg mb-12 max-w-xl mx-auto leading-relaxed" style={{ color: "#A7A3C2" }}>
          Every decision captured. Every task assigned. Every risk flagged.
          Your team moves the moment the call ends.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)",
              boxShadow: "0 24px 60px rgba(124,58,237,0.40), 0 0 30px rgba(124,58,237,0.25)",
            }}
          >
            Try Flowstate free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium text-base transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F4F4FB",
            }}
          >
            See interactive demo
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="px-5 py-8" style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(0,0,0,0.20)",
    }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7C3AED,#5B2BD6)" }}>
            <Zap size={10} className="text-white fill-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: "#F4F4FB" }}>Flowstate</span>
        </div>
        <p className="text-xs" style={{ color: "#A7A3C2" }}>
          © 2026 Flowstate · AI Meeting-to-Delivery OS
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: "#A7A3C2" }}>
          <Link href="/demo"    className="hover:text-white transition-colors">Demo</Link>
          <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
          <Link href="/sign-up" className="hover:text-white transition-colors">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <LiquidNav />
      <main className="relative">
        <Hero />
        <IntegrationsStrip />
        <KineticWords />
        <OrbitSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
