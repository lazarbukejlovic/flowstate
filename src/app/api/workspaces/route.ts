import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { extractMeeting } from "@/lib/ai/extract-meeting";

export async function GET() {
  try {
    const { userId } = await auth();

    const workspaces = await prisma.workspace.findMany({
      where: userId
        ? { OR: [{ createdById: userId }, { isDemo: true }] }
        : { isDemo: true },
      include: {
        tasks: { select: { id: true, status: true } },
        decisions: { select: { id: true } },
        meetingSource: { select: { meetingTitle: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(workspaces);
  } catch (err) {
    console.error("Workspaces GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { transcript, meetingTitle } = body as {
      transcript: string;
      meetingTitle?: string;
    };

    if (!transcript || transcript.trim().length < 50) {
      return NextResponse.json(
        { error: "Valid transcript required" },
        { status: 400 }
      );
    }

    const extracted = await extractMeeting(transcript, meetingTitle);

    const workspace = await prisma.workspace.create({
      data: {
        title: extracted.workspaceTitle,
        summary: extracted.summary,
        createdById: userId ?? undefined,
        isDemo: false,
        meetingSource: {
          create: {
            meetingTitle: meetingTitle ?? extracted.workspaceTitle,
            transcript,
            risks: {
              create: extracted.risks.map((r) => ({
                title: r.title,
                severity: r.severity,
                mitigation: r.mitigation,
              })),
            },
            followUps: {
              create: extracted.followUps.map((f) => ({
                title: f.title,
                ownerName: f.owner,
              })),
            },
          },
        },
        tasks: {
          create: extracted.tasks.map((t) => ({
            title: t.title,
            description: t.description,
            ownerName: t.owner,
            deadline: t.deadline ? new Date(t.deadline) : null,
            priority: t.priority,
            status: t.status,
          })),
        },
        decisions: {
          create: extracted.decisions.map((d) => ({
            title: d.title,
            context: d.context,
            ownerName: d.owner,
          })),
        },
        activityLogs: {
          create: [
            {
              actorName: "Flowstate AI",
              action: "created_workspace",
              detail: `Workspace created from meeting: "${meetingTitle ?? extracted.workspaceTitle}"`,
            },
          ],
        },
      },
    });

    return NextResponse.json({ id: workspace.id, title: workspace.title });
  } catch (err) {
    console.error("Workspace POST error:", err);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }
}
