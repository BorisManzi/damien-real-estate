import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const preferredLocation = String(body.preferredLocation || "").trim();

    if (!name || !phone || !preferredLocation) {
      return NextResponse.json(
        { error: "Name, phone and preferred location are required." },
        { status: 400 }
      );
    }

    // MVP: log lead. Replace with email/CRM/database webhook later.
    const lead = {
      ...body,
      name,
      phone,
      preferredLocation,
      receivedAt: new Date().toISOString(),
    };

    console.log("[Damien lead]", JSON.stringify(lead));

    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
