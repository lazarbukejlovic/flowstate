"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ListChecks, ShieldAlert, Activity, Shield, Sparkles, Users } from "lucide-react";
import { FlowstateOperator } from "./flowstate-operator";

const ICON_MAP = {
  brain:       Brain,
  listChecks:  ListChecks,
  shieldAlert: ShieldAlert,
  activity:    Activity,
  shield:      Shield,
  sparkles:    Sparkles,
  users:       Users,
} as const;

export type FeatureIconKey = keyof typeof ICON_MAP;

export interface SerializableFeature {
  icon: FeatureIconKey;
  label: string;
  desc: string;
}

interface OperatorAuthPanelProps {
  features: SerializableFeature[];
  /** Optional: notify parent when Flow is woken (so it can stagger in the auth cards) */
  onAwake?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function OperatorAuthPanel({ features, onAwake }: OperatorAuthPanelProps) {
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    if (awake) onAwake?.();
  }, [awake, onAwake]);

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-6">
      <FlowstateOperator onWake={() => setAwake(true)} />

      <AnimatePresence mode="wait">
        {awake ? (
          <motion.div
            key="awake"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55, ease: EASE }}
            className="relative mt-6 w-full max-w-sm"
          >
            <div className="grid grid-cols-2 gap-2.5">
              {features.map((f, i) => {
                const Icon = ICON_MAP[f.icon];
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.45, ease: EASE }}
                    className="flex items-start gap-2 p-2.5 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.045)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(168,140,255,0.18)",
                    }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(124,58,237,0.16)", border: "1px solid rgba(124,58,237,0.32)" }}>
                      <Icon size={11} style={{ color: "#A78BFA" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold leading-tight" style={{ color: "#F5F4FC" }}>{f.label}</p>
                      <p className="text-[9px] leading-tight mt-0.5 truncate" style={{ color: "#ABA6C9" }}>{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sleeping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            className="relative mt-6 w-full max-w-sm opacity-25"
          >
            <div className="grid grid-cols-2 gap-2.5">
              {features.map((f) => {
                const Icon = ICON_MAP[f.icon];
                return (
                  <div
                    key={f.label}
                    className="flex items-start gap-2 p-2.5 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(168,140,255,0.10)",
                    }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.20)" }}>
                      <Icon size={11} style={{ color: "#A78BFA" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold leading-tight" style={{ color: "#F5F4FC" }}>{f.label}</p>
                      <p className="text-[9px] leading-tight mt-0.5 truncate" style={{ color: "#ABA6C9" }}>{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mt-6 flex items-center gap-3 flex-wrap justify-center"
      >
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#ABA6C9" }}>
          <Shield size={10} style={{ color: "#A78BFA" }} />
          Enterprise-grade security
        </div>
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#ABA6C9" }}>
          <Sparkles size={10} style={{ color: "#A78BFA" }} />
          Source-linked
        </div>
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#ABA6C9" }}>
          <Activity size={10} style={{ color: "#A78BFA" }} />
          Audit trail
        </div>
      </motion.div>
    </div>
  );
}
