import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ updates: [] }, { headers: { "Cache-Control": "public, max-age=60" } });
}
