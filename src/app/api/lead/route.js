import { sendLeadToCRM } from "@/components/shared/sendLeadToCRM";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (payload?.honeypot) {
      return Response.json({ success: true, skipped: true });
    }

    if (!payload?.name || !payload?.email || !payload?.number) {
      return Response.json({ error: "Name, email and phone are required" }, { status: 400 });
    }

    const result = await sendLeadToCRM(payload);
    return Response.json({ success: true, result });
  } catch (error) {
    console.error("lead proxy failed", error);
    return Response.json(
      { error: error.message || "Failed to send lead to CRM" },
      { status: 502 },
    );
  }
}
