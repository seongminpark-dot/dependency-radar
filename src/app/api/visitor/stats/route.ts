import { NextResponse } from "next/server";
import { getVisitorStats } from "@/lib/visitorCounter";

export async function GET() {
  const result = await getVisitorStats();

  return NextResponse.json(result);
}
