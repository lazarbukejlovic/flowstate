"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { OperatorAuthPanel, type SerializableFeature } from "./operator-auth-panel";

interface AuthShellProps {
  features: SerializableFeature[];
  activeTab: "signin" | "signup";
  title: string;
  subtitle: string;
  children: ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const SESSION_KEY = "flow-revealed";

function TabButton({ href, active, label }: { href: string; active: boolean; label: string }) {
  if (active) {
    return (
      <div
        className="flex-1 text-center py-2 text-sm font-semibold rounded-lg"
        style={{
          background: "linear-gradient(180deg, rgba(124,58,237,0.40) 0%, rgba(124,58,237,0.20) 100%)",
          border: "1px solid rgba(167,139,250,0.35)",
          boxShadow: "0 4px 16px rgba(124,58,237,0.30)",
          color: "#F5F4FC",
        }}
      >
        {label}
      </div>
    );
  }
  return (
    <Link
      href={href}
      className="flex-1 text-center py-2 text-sm font-medium rounded-lg transition-colors"
      style={{ color: "#ABA6C9" }}
    >
      {label}
    </Link>
  );
}

export function AuthShell({ features, activeTab, title, subtitle, children }: AuthShellProps) {
  const [revealed, setRevealed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Restore previously-revealed state from sessionStorage so returning users skip the wake.
  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "1") {
      setRevealed(true);
    }
    setMounted(true);
  }, []);

  function handleAwake() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    // Wait for Flow's 3-line welcome to play (≈ 2.4s) before sliding the auth card in.
    window.setTimeout(() => setRevealed(true), 2400);
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: "#07060F" }}>
      {/* Cinematic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 70% 80% at 26% 50%, rgba(124,58,237,0.20) 0%, transparent 55%)",
              "radial-gradient(ellipse 50% 60% at 80% 20%, rgba(34,211,238,0.10) 0%, transparent 55%)",
              "linear-gradient(180deg, #05040E 0%, #07060F 50%, #04030B 100%)",
            ].join(", "),
          }}
        />
        <div className="absolute inset-0 dark-grid-bg opacity-25" />
        {Array.from({ length: 36 }).map((_, i) => {
          const seed = (i * 9301 + 49297) % 233280;
          const rnd = (s: number) => ((s * 9301 + 49297) % 233280) / 233280;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${rnd(seed) * 100}%`,
                top: `${rnd(seed + 17) * 100}%`,
                width: 1 + rnd(seed + 33) * 1.5,
                height: 1 + rnd(seed + 33) * 1.5,
                opacity: 0.3 + rnd(seed + 51) * 0.5,
              }}
            />
          );
        })}
      </div>

      {/* ─── LEFT: Flow ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col relative overflow-hidden border-r"
        style={{ borderColor: "rgba(168,140,255,0.10)" }}>
        {/* Wave at bottom */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ height: 140, opacity: 0.35 }}
        >
          <defs>
            <linearGradient id="authWave" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(124,58,237,0.6)" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M 0 ${140 + i * 6} Q 360 ${110 + i * 12} 720 ${145 + i * 6} T 1440 ${130 + i * 9} L 1440 200 L 0 200 Z`}
              fill="url(#authWave)"
              opacity={0.20 - i * 0.04}
            />
          ))}
        </svg>

        {/* Logo */}
        <div className="relative z-10 px-10 pt-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:shadow-violet-600/60 transition-shadow"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)",
                boxShadow: "0 8px 24px rgba(124,58,237,0.40)",
              }}
            >
              <Zap size={14} className="text-white fill-white" />
            </div>
            <span className="text-base font-bold" style={{ color: "#F5F4FC" }}>Flowstate</span>
          </Link>
        </div>

        <div className="relative z-10 flex-1">
          <OperatorAuthPanel features={features} onAwake={handleAwake} />
        </div>
      </div>

      {/* ─── RIGHT: Auth (revealed by Flow) ─────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B2BD6 100%)" }}>
              <Zap size={12} className="text-white fill-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: "#F5F4FC" }}>Flowstate</span>
          </div>

          <AnimatePresence mode="wait">
            {revealed && mounted ? (
              <motion.div
                key="auth-card"
                initial={{ opacity: 0, x: 60, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.75, ease: EASE }}
                className="relative"
              >
                {/* Connecting glow streak from Flow to the card */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: [0, 0.6, 0], scaleX: [0, 1, 1] }}
                  transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
                  className="absolute hidden lg:block pointer-events-none"
                  style={{
                    left: -200,
                    top: "30%",
                    width: 200,
                    height: 2,
                    transformOrigin: "left center",
                    background: "linear-gradient(90deg, rgba(124,58,237,0.0), rgba(167,139,250,0.9), rgba(34,211,238,0.5), rgba(124,58,237,0.0))",
                    boxShadow: "0 0 12px rgba(167,139,250,0.7), 0 0 24px rgba(124,58,237,0.4)",
                  }}
                />

                {/* The card */}
                <div
                  className="rounded-3xl p-7 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(28,22,56,0.78) 0%, rgba(15,11,36,0.82) 100%)",
                    backdropFilter: "blur(28px)",
                    border: "1px solid rgba(168,140,255,0.18)",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03), 0 0 60px rgba(124,58,237,0.18)",
                  }}
                >
                  {/* Tab toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
                    className="flex items-center gap-1 p-1 rounded-xl mb-6"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(168,140,255,0.16)",
                    }}
                  >
                    <TabButton href="/sign-in" active={activeTab === "signin"} label="Sign in" />
                    <TabButton href="/sign-up" active={activeTab === "signup"} label="Sign up" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.3, ease: EASE }}
                    className="text-center mb-6"
                  >
                    <h1 className="font-display text-2xl font-bold tracking-tight mb-1" style={{ color: "#F5F4FC" }}>
                      {title}
                    </h1>
                    <p className="text-sm" style={{ color: "#ABA6C9" }}>{subtitle}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                  >
                    {children}
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-center text-[11px] mt-5"
                  style={{ color: "#6E6A87" }}
                >
                  By {activeTab === "signin" ? "signing in" : "creating an account"}, you agree to our{" "}
                  <Link href="/terms" className="transition-colors hover:opacity-80" style={{ color: "#ABA6C9" }}>Terms</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="transition-colors hover:opacity-80" style={{ color: "#ABA6C9" }}>Privacy</Link>.
                </motion.p>
              </motion.div>
            ) : mounted ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-center"
              >
                <div
                  className="rounded-3xl p-10 lg:p-14 relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px dashed rgba(168,140,255,0.22)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="flex flex-col items-center gap-5">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: "#A855F7",
                        boxShadow: "0 0 18px rgba(168,85,247,0.8), 0 0 32px rgba(124,58,237,0.4)",
                      }}
                    />
                    <p className="text-sm font-medium" style={{ color: "#F5F4FC" }}>
                      Click <span style={{ color: "#A78BFA" }}>Flow</span> to begin
                    </p>
                    <p className="text-xs max-w-[220px] leading-relaxed" style={{ color: "#ABA6C9" }}>
                      Your AI assistant will guide you in.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
