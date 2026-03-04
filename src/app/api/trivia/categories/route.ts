import { NextResponse } from "next/server";
import { fetchCategories } from "@/lib/opentdb";

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
