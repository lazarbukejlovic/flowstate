"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  color?: "violet" | "blue" | "emerald" | "amber";
  index?: number;
}

const COLOR_MAP = {
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export function MetricCard({
  label,
  value,
  subtext,
  color = "violet",
  index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`rounded-2xl border p-5 ${COLOR_MAP[color]}`}
    >
      <p className="text-xs font-medium text-white/40 mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtext && <p className="text-xs mt-1 opacity-60">{subtext}</p>}
    </motion.div>
  );
}
