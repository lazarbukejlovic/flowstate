import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

export const runtime = "nodejs";
// 30s ceiling — Whisper round-trip for short recordings stays well under this.
export const maxDuration = 30;

// Whisper's published limit is 25MB; we cap at 24MB to leave headroom for the multipart envelope.
const MAX_BYTES = 24 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to transcribe voice notes." }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Transcription is not configured on this server (missing OPENAI_API_KEY)." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const file = formData.get("audio");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No audio file in request." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "The recording is empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Recording is too large. Keep voice notes under ~24 MB." },
      { status: 413 },
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const result = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "text",
    });

    // `response_format: "text"` returns a raw string instead of an object
    const text = typeof result === "string" ? result : (result as { text?: string }).text ?? "";

    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcription failed.";
    // Surface a clean message; never echo back keys or stacks
    return NextResponse.json({ error: cleanErrorMessage(message) }, { status: 502 });
  }
}

function cleanErrorMessage(raw: string): string {
  // Don't leak OpenAI auth/quota internals beyond what the user actually needs to fix
  if (/api key|incorrect_api_key|invalid_api_key/i.test(raw)) {
    return "Transcription rejected the API key on this server.";
  }
  if (/quota|insufficient_quota/i.test(raw)) {
    return "Transcription quota exceeded on this server.";
  }
  if (/rate.?limit/i.test(raw)) {
    return "Too many transcription requests. Try again in a moment.";
  }
  return raw.length > 200 ? "Transcription failed." : raw;
}
