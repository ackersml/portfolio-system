import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In production, send an email or store in a ticketing system here.
    // For now, just respond success.
    return NextResponse.json({ ok: true, received: body }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


