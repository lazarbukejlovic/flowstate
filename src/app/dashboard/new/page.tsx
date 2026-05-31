import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LiquidNav } from "@/components/layout/liquid-nav";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { TranscriptGenerator } from "@/components/workspace/transcript-generator";
import { ArrowLeft, Brain, ListChecks, ShieldAlert } from "lucide-react";

export default async function NewWorkspacePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <AnimatedBackground />
      <LiquidNav />
      <main className="min-h-screen pt-24 pb-16 px-6 relative">
        <div className="max-w-2xl mx-auto pt-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "#ABA6C9" }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 transition-colors hover:opacity-80"
            >
              <ArrowLeft size={13} />
              Dashboard
            </Link>
            <span style={{ color: "#6E6A87" }}>/</span>
            <span style={{ color: "#F5F4FC" }}>New workspace</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-[-0.02em] mb-2" style={{ color: "#F5F4FC" }}>
              Create workspace
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#ABA6C9" }}>
              Paste your meeting transcript below. Flowstate will extract tasks,
              decisions, risks, and owners — and build your delivery board
              instantly.
            </p>
          </div>

          {/* Features hint */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: ListChecks,  label: "Tasks & owners",   color: "#22D3EE", glow: "rgba(34,211,238,0.18)" },
              { icon: Brain,       label: "Key decisions",    color: "#A855F7", glow: "rgba(168,85,247,0.18)" },
              { icon: ShieldAlert, label: "Risks flagged",    color: "#FF6B4A", glow: "rgba(255,107,74,0.18)" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs"
                style={{
                  background: "rgba(255,255,255,0.045)",
                  border: "1px solid rgba(168,140,255,0.16)",
                  backdropFilter: "blur(12px)",
                  color: "#F5F4FC",
                  boxShadow: `0 0 16px ${item.glow}`,
                }}
              >
                <item.icon size={13} style={{ color: item.color }} />
                {item.label}
              </div>
            ))}
          </div>

          {/* Form card — dark glass */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(28,22,56,0.65) 0%, rgba(15,11,36,0.65) 100%)",
              border: "1px solid rgba(168,140,255,0.18)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03), 0 0 40px rgba(124,58,237,0.12)",
            }}
          >
            <TranscriptGenerator />
          </div>
        </div>
      </main>
    </>
  );
}
