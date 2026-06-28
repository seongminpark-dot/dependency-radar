import { geolocation } from "@vercel/functions";
import { NextResponse } from "next/server";
import { incrementCountryVisit } from "@/lib/visitorCounter";

export async function POST(request: Request) {
  const geo = geolocation(request);

  const country =
    geo.country ??
    request.headers.get("x-vercel-ip-country") ??
    (process.env.NODE_ENV === "development" ? "KR" : "XX");

  const result = await incrementCountryVisit(country);

  return NextResponse.json(result);
}
