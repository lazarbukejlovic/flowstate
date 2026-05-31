"use client";

import { motion } from "framer-motion";
import type { Decision } from "@prisma/client";

interface DecisionPanelProps {
  decisions: Decision[];
}

export function DecisionPanel({ decisions }: DecisionPanelProps) {
  if (decisions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-violet-500/20 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-violet-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-white">
          Decisions
        </h3>
        <span className="ml-auto text-xs text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
          {decisions.length}
        </span>
      </div>

      <div className="space-y-3">
        {decisions.map((decision, i) => (
          <motion.div
            key={decision.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="pl-3 border-l-2 border-violet-500/40"
          >
            <p className="text-sm text-white/80 font-medium">{decision.title}</p>
            {decision.context && (
              <p className="text-xs text-white/40 mt-1 leading-relaxed">
                {decision.context}
              </p>
            )}
            {decision.ownerName && (
              <p className="text-[11px] text-violet-400/70 mt-1">
                Owner: {decision.ownerName}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
