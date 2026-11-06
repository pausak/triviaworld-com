import { NextRequest, NextResponse } from "next/server";
import { getPlaythrough, startNextQuestion } from "@/lib/playthrough";

// The page calls this when it shows the next question, so time spent reading the
// last answer does not count against the player.
export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();
  const playthrough = typeof sessionId === "string" ? getPlaythrough(sessionId) : undefined;
  if (!playthrough) {
    return NextResponse.json({ error: "Session not found or expired" }, { status: 404 });
  }
  startNextQuestion(playthrough);
  return NextResponse.json({ ok: true });
}
