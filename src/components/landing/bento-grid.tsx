"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { Brain, ShieldAlert, ListChecks, Users, ArrowRight, TrendingUp, Zap } from "lucide-react";

const EXTRACTIONS = [
  { icon: Brain,       label: "Decisions",  count: 4, color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  { icon: ListChecks,  label: "Tasks",      count: 8, color: "text-cyan-700",   bg: "bg-cyan-50 border-cyan-200" },
  { icon: ShieldAlert, label: "Risks",      count: 3, color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  { icon: Users,       label: "Follow-ups", count: 3, color: "text-green-700",  bg: "bg-green-50 border-green-200" },
];

function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl border border-[#E7E8F0] bg-white overflow-hidden group
        hover:border-violet-200 hover:shadow-xl hover:shadow-[#0E1330]/6
        transition-[border-color,box-shadow] duration-300 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section id="features" className="relative px-5 py-24 overflow-hidden bg-[#FBFBFD]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-violet-100/40 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.18em] mb-4">
            Everything you need
          </p>
          <h2 className="text-3xl md:text-5xl font-black gradient-text leading-tight">
            From transcript to delivery board<br />in 30 seconds.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Left: Meeting input */}
          <BentoCard className="p-6" delay={0.05}>
            <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-4">
              Paste any meeting source.
            </p>
            <div className="space-y-2.5 mb-4">
              {["zoom.us/rec/Q2-launch-sync", "meet.google.com/abc-xyz-def", "Or paste transcript directly ↓"].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-[#6B7280]">
                  <div className="w-4 h-4 rounded border border-[#E7E8F0] bg-[#F8F9FC] flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  </div>
                  <span className="font-mono text-[11px]">{s}</span>
                </div>
              ))}
            </div>
            <div className="py-2.5 px-4 rounded-xl bg-violet-600 text-center text-[12px] text-white font-semibold group-hover:bg-violet-700 transition-colors shadow-md shadow-violet-600/20">
              Generate workspace →
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />
          </BentoCard>

          {/* Top Center: AI extraction */}
          <BentoCard className="p-6" delay={0.1}>
            <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-4">
              AI extracts decisions. You get action.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {EXTRACTIONS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.25 }}
                  className={`flex items-center gap-2 p-3 rounded-xl border ${item.bg}`}
                >
                  <item.icon size={14} className={item.color} />
                  <div>
                    <p className={`text-sm font-bold ${item.color}`}>{item.count}</p>
                    <p className="text-[10px] text-[#6B7280]">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#E7E8F0] flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <Zap size={9} className="text-violet-500" />
              claude-opus-4-7 · 3.2s · 98% avg confidence
            </div>
          </BentoCard>

          {/* Top Right: Live board */}
          <BentoCard className="p-6" delay={0.15}>
            <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-4">
              Delivery board. No setup.
            </p>
            <div className="space-y-2">
              {[
                { status: "In Progress", task: "Finalize hero copy", owner: "Sofia",  priority: "HIGH", pColor: "text-orange-600" },
                { status: "In Progress", task: "Beta invite flow",   owner: "Daniel", priority: "HIGH", pColor: "text-orange-600" },
                { status: "Todo",        task: "Launch monitoring",  owner: "Ethan",  priority: "MED",  pColor: "text-amber-600" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.1, duration: 0.2 }}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F8F9FC] border border-[#E7E8F0] group-hover:bg-[#F2F3F8] transition-colors"
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.status === "In Progress" ? "bg-blue-400" : "bg-[#D1D5DB]"}`} />
                  <p className="text-[11px] text-[#374151] flex-1 truncate">{item.task}</p>
                  <span className={`text-[9px] font-semibold ${item.pColor}`}>{item.priority}</span>
                  <span className="text-[10px] text-[#9CA3AF]">{item.owner}</span>
                </motion.div>
              ))}
            </div>
          </BentoCard>

          {/* Bottom Left: Stats */}
          <BentoCard className="p-6" delay={0.12}>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={14} className="text-green-500" />
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                The numbers
              </p>
            </div>
            <div className="space-y-5">
              {[
                { value: "4.2×", label: "Faster workspace setup",  color: "text-violet-600" },
                { value: "87%",  label: "Fewer lost action items",  color: "text-cyan-600" },
                { value: "6 hrs",label: "Saved per team per week",  color: "text-green-600" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className={`text-4xl font-black ${stat.color} leading-none`}>{stat.value}</p>
                  <p className="text-xs text-[#6B7280] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Bottom Center: Quote */}
          <BentoCard className="p-6" delay={0.17}>
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-sm text-[#374151] leading-relaxed mb-5">
              &ldquo;Flowstate feels like a chief of staff sitting inside every meeting. Decisions stick, owners are accountable, nothing falls through.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                AK
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0E1330]">Alex Kim</p>
                <p className="text-[11px] text-[#6B7280]">Product Lead</p>
              </div>
            </div>
          </BentoCard>

          {/* Bottom Right: CTA */}
          <BentoCard className="p-6 overflow-hidden" delay={0.2}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-transparent to-cyan-50/60 pointer-events-none" />
            <div className="relative">
              <p className="text-lg font-bold text-[#0E1330] mb-1.5">
                Run the Q2 Launch demo
              </p>
              <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
                See a real workspace built from a 1,200-word meeting transcript. No login required.
              </p>
              <div className="space-y-2.5">
                <Link
                  href="/demo"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all shadow-md shadow-violet-600/20"
                >
                  Open live demo
                  <ArrowRight size={14} />
                </Link>
                <SignUpButton mode="modal">
                  <button className="w-full py-3 px-4 rounded-xl border border-[#E7E8F0] hover:border-violet-200 text-[#374151] hover:text-[#0E1330] text-sm font-medium transition-all bg-white hover:bg-violet-50">
                    Create free account
                  </button>
                </SignUpButton>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
