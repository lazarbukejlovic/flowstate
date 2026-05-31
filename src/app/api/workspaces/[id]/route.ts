import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: "asc" },
        },
        decisions: {
          orderBy: { createdAt: "asc" },
        },
        activityLogs: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        meetingSource: {
          include: {
            risks: true,
            followUps: true,
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workspace);
  } catch (err) {
    console.error("Workspace GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 500 }
    );
  }
}
