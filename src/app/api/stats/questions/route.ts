import { NextResponse } from "next/server";
import { getQuestionStats } from "@/lib/db/questions";

// Read-only monitoring for the write-through question bank. Counts only — no
// question content is exposed.
export async function GET() {
  try {
    const stats = await getQuestionStats();
    return NextResponse.json(stats);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load question stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
