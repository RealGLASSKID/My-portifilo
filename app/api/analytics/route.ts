import { NextRequest, NextResponse } from "next/server";
import { recordPageView } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path : "/";
    const visitorId = typeof body.visitorId === "string" ? body.visitorId : "anon";
    const referrer = typeof body.referrer === "string" ? body.referrer : "";

    await recordPageView({ path, visitorId, referrer });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("analytics error", e);
    return NextResponse.json({ ok: false }, { status: 200 }); // don't break UX
  }
}
