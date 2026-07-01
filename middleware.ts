import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "datlora.com";

const REDIRECT_HOSTS = new Set([
  "dependency-radar-three.vercel.app",
  "www.datlora.com",
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  if (REDIRECT_HOSTS.has(host)) {
    const url = request.nextUrl.clone();

    url.protocol = "https";
    url.hostname = CANONICAL_HOST;

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
