import { NextRequest, NextResponse } from "next/server";

function parseAllowed() {
  return new Set(
    (process.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

/**
 * Terapkan header CORS hanya kalau cross-origin.
 * - Same-origin -> selalu allowed (tanpa header CORS).
 * - Tanpa Origin (server-to-server) -> allowed.
 * - Cross-origin -> cek allowlist.
 */
export function applyCors(req: NextRequest, extra: HeadersInit = {}) {
  const headers = new Headers(extra);
  const origin = req.headers.get("origin") || "";
  const self = req.nextUrl.origin;

  const isCrossOrigin = origin && origin !== self;
  if (!isCrossOrigin) {
    return { isAllowed: true, headers, isCrossOrigin: false, origin };
  }

  // Cross-origin: cek allowlist
  const allowed = parseAllowed();
  const isAllowed = allowed.size === 0 || allowed.has(origin);

  if (isAllowed) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Credentials", "true");
    const reqHeaders = req.headers.get("access-control-request-headers");
    if (reqHeaders) headers.set("Access-Control-Allow-Headers", reqHeaders);
    headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    headers.set("Access-Control-Max-Age", "86400");
  }

  return { isAllowed, headers, isCrossOrigin: true, origin };
}

export function handlePreflight(req: NextRequest) {
  const { isAllowed, headers, isCrossOrigin } = applyCors(req);
  if (isCrossOrigin && !isAllowed) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, { status: 204, headers });
}
