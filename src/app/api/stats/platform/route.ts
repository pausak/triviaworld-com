import { NextResponse } from "next/server";
import { getPlatformStats } from "@/lib/db/stats";

// Read-only platform metrics (aggregate counts only, no PII). Unique-user counts
// come from the users table / COUNT(DISTINCT user_id), never from per-game rows.
export async function GET() {
  try {
    const stats = await getPlatformStats();
    return NextResponse.json(stats);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load platform stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
