import { geolocation } from "@vercel/functions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const geo = geolocation(request);

  const country =
    geo.country ??
    request.headers.get("x-vercel-ip-country") ??
    (process.env.NODE_ENV === "development" ? "KR" : "US");

  return NextResponse.json({
    country,
    city: geo.city ?? null,
    region: geo.region ?? null,
  });
}