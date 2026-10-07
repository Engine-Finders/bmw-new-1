import { fetchSiteLeads } from "@/app/api/crm/sendLeadToCRM";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitRaw = Number(searchParams.get("limit") || 100);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 500) : 100;

    const leads = await fetchSiteLeads({ limit });
    return Response.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error("leads fetch failed", error);
    return Response.json(
      { success: false, error: error.message || "Failed to fetch leads" },
      { status: 502 },
    );
  }
}
