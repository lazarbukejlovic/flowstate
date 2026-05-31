"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, LayoutGrid, Plus, ExternalLink, ArrowRight, X } from "lucide-react";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  group: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  workspaceId?: string;
}

export function CommandPalette({ workspaceId }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "new-workspace",
      label: "New workspace",
      description: "Create workspace from meeting transcript",
      icon: Plus,
      action: () => router.push("/dashboard/new"),
      group: "Actions",
      shortcut: "N",
    },
    {
      id: "dashboard",
      label: "Go to Dashboard",
      description: "View all workspaces",
      icon: LayoutGrid,
      action: () => router.push("/dashboard"),
      group: "Navigation",
    },
    {
      id: "demo",
      label: "Open live demo",
      description: "Q2 Product Launch Sync workspace",
      icon: ExternalLink,
      action: () => router.push("/demo"),
      group: "Navigation",
    },
    {
      id: "sign-in",
      label: "Sign in",
      description: "Access your account",
      icon: ArrowRight,
      action: () => router.push("/sign-in"),
      group: "Account",
    },
    {
      id: "sign-up",
      label: "Create free account",
      description: "Start using Flowstate",
      icon: Zap,
      action: () => router.push("/sign-up"),
      group: "Account",
    },
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const groups = Array.from(new Set(filtered.map((c) => c.group)));

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const runCommand = useCallback(
    (cmd: Command) => {
      cmd.action();
      handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) handleClose();
        else handleOpen();
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[selectedIndex];
        if (cmd) runCommand(cmd);
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, selectedIndex, handleOpen, handleClose, runCommand]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  let flatIndex = -1;

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={handleClose}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -12 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="fixed top-[18%] left-1/2 -translate-x-1/2 w-full max-w-[520px] z-[70] px-4"
            >
              <div className="rounded-2xl border border-white/[0.1] bg-[#0e0e18] shadow-2xl shadow-black/80 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
                  <Search size={16} className="text-white/30 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search commands..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-white/25 hover:text-white/50 transition-colors">
                      <X size={13} />
                    </button>
                  )}
                  <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] text-white/30 font-mono">
                    esc
                  </kbd>
                </div>

                {/* Commands */}
                <div className="max-h-[320px] overflow-y-auto py-2">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-white/30 text-center py-8">No commands found</p>
                  ) : (
                    groups.map((group) => {
                      const groupCmds = filtered.filter((c) => c.group === group);
                      return (
                        <div key={group}>
                          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider px-4 py-2">
                            {group}
                          </p>
                          {groupCmds.map((cmd) => {
                            flatIndex++;
                            const currentIndex = flatIndex;
                            const isSelected = currentIndex === selectedIndex;

                            return (
                              <button
                                key={cmd.id}
                                onClick={() => runCommand(cmd)}
                                onMouseEnter={() => setSelectedIndex(currentIndex)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                  isSelected ? "bg-violet-500/15" : "hover:bg-white/[0.04]"
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  isSelected
                                    ? "bg-violet-500/25 border border-violet-500/30"
                                    : "bg-white/[0.04] border border-white/[0.07]"
                                }`}>
                                  <cmd.icon size={13} className={isSelected ? "text-violet-300" : "text-white/40"} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-white/70"}`}>
                                    {cmd.label}
                                  </p>
                                  {cmd.description && (
                                    <p className="text-[11px] text-white/30 truncate">{cmd.description}</p>
                                  )}
                                </div>
                                {cmd.shortcut && (
                                  <kbd className="flex-shrink-0 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-white/30 font-mono">
                                    {cmd.shortcut}
                                  </kbd>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                      <Zap size={8} className="text-white fill-white" />
                    </div>
                    <span className="text-[10px] text-white/20 font-semibold">Flowstate</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/20">
                    <span>↑↓ navigate</span>
                    <span>↵ select</span>
                    <span>esc close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
