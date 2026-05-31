import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status: string };

    const validStatuses = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status: status as "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE" },
    });

    await prisma.activityLog.create({
      data: {
        workspaceId: task.workspaceId,
        actorName: task.ownerName ?? "Team member",
        action: "updated_task",
        detail: `Moved "${task.title}" to ${status.replace("_", " ").toLowerCase()}`,
      },
    });

    return NextResponse.json(task);
  } catch (err) {
    console.error("Task PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
