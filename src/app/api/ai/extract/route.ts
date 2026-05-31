import { NextRequest, NextResponse } from "next/server";
import { extractMeeting } from "@/lib/ai/extract-meeting";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, meetingTitle } = body as {
      transcript: string;
      meetingTitle?: string;
    };

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 }
      );
    }

    if (transcript.trim().length < 50) {
      return NextResponse.json(
        { error: "Transcript is too short to extract meaningful data" },
        { status: 400 }
      );
    }

    const result = await extractMeeting(transcript, meetingTitle);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Extract route error:", err);
    return NextResponse.json(
      { error: "Failed to process transcript" },
      { status: 500 }
    );
  }
}
