"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@prisma/client";
import { TaskCard } from "./task-card";

type Status = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

const COLUMNS: { id: Status; label: string; color: string; dot: string; glow: string }[] = [
  { id: "TODO",        label: "To Do",       color: "#ABA6C9",  dot: "#ABA6C9", glow: "rgba(171,166,201,0.30)" },
  { id: "IN_PROGRESS", label: "In Progress", color: "#60A5FA",  dot: "#60A5FA", glow: "rgba(96,165,250,0.60)" },
  { id: "BLOCKED",     label: "Blocked",     color: "#FFB89E",  dot: "#FF6B4A", glow: "rgba(255,107,74,0.60)" },
  { id: "DONE",        label: "Done",        color: "#86EFAC",  dot: "#22C55E", glow: "rgba(34,197,94,0.60)" },
];

function SortableTask({
  task,
  onStatusChange,
  onTaskClick,
}: {
  task: Task;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onStatusChange={onStatusChange} isDragging={isDragging} onTaskClick={onTaskClick} />
    </div>
  );
}

interface ActionBoardProps {
  tasks: Task[];
  workspaceId: string;
  onTaskClick?: (task: Task) => void;
}

export function ActionBoard({ tasks: initialTasks, onTaskClick }: ActionBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, newStatus: Task["status"]) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );

      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: initialTasks.find((i) => i.id === taskId)?.status ?? t.status }
              : t
          )
        );
      }
    },
    [initialTasks]
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const targetColumn = COLUMNS.find((c) => c.id === over.id);
    if (targetColumn) {
      const task = tasks.find((t) => t.id === active.id);
      if (task && task.status !== targetColumn.id) {
        updateTaskStatus(task.id, targetColumn.id);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div key={col.id} id={col.id}>
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-2 h-2 rounded-full" style={{ background: col.dot, boxShadow: `0 0 6px ${col.glow}` }} />
                <span className="text-xs font-semibold" style={{ color: col.color }}>
                  {col.label}
                </span>
                <span
                  className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#ABA6C9",
                    border: "1px solid rgba(168,140,255,0.10)",
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Drop zone */}
              <SortableContext
                items={colTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <motion.div
                  layout
                  className="min-h-[120px] rounded-xl p-2 space-y-2 transition-colors"
                  style={{
                    border: "1px dashed rgba(168,140,255,0.16)",
                    background: "rgba(255,255,255,0.015)",
                  }}
                >
                  <AnimatePresence>
                    {colTasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onStatusChange={updateTaskStatus}
                        onTaskClick={onTaskClick}
                      />
                    ))}
                  </AnimatePresence>

                  {colTasks.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-xs" style={{ color: "#6E6A87" }}>
                      Drop here
                    </div>
                  )}
                </motion.div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 scale-105 shadow-2xl shadow-black/40">
            <TaskCard task={activeTask} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
