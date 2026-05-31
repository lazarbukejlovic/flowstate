"use client";

import type { DemoTeamMember } from "@/lib/demo/demo-data";

const COLOR_MAP: Record<string, string> = {
  violet:  "bg-violet-600",
  blue:    "bg-blue-600",
  emerald: "bg-emerald-600",
  amber:   "bg-amber-600",
};

interface TeamPresenceProps {
  team: DemoTeamMember[];
}

export function TeamPresence({ team }: TeamPresenceProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {team.map((member) => (
          <div
            key={member.name}
            className={`relative w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-lg ${COLOR_MAP[member.color] ?? "bg-violet-600"}`}
            style={{ border: "2px solid #0F0B24", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
            title={`${member.name} · ${member.role}${member.online ? " · Online" : ""}`}
          >
            {member.initials}
            {member.online && (
              <span
                className="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full"
                style={{
                  background: "#22C55E",
                  border: "1.5px solid #0F0B24",
                  boxShadow: "0 0 6px rgba(34,197,94,0.8)",
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-[11px]" style={{ color: "#ABA6C9" }}>
        <span style={{ color: "#86EFAC" }}>{team.filter((m) => m.online).length} online</span>
        {" · "}{team.length} team members
      </div>
    </div>
  );
}
