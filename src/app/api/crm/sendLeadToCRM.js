/** Central CRM / Supabase lead helpers (reusable across forms). */

export const LEAD_SOURCE = "bmwengines.uk";

const SUPABASE_WEBHOOK_URL =
  process.env.SUPABASE_WEBHOOK_URL ||
  "https://gfrnxvolaqbfalerfhsr.supabase.co/functions/v1/receive-lead";

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

const SUPABASE_REST_URL =
  process.env.SUPABASE_REST_URL ||
  "https://gfrnxvolaqbfalerfhsr.supabase.co/rest/v1";

function capacityToLitres(engineCapacity) {
  const capacityRaw = engineCapacity ? String(engineCapacity).replace(/[^\d.]/g, "") : "";
  const capacityNum = capacityRaw ? Number(capacityRaw) : NaN;
  if (!Number.isFinite(capacityNum) || capacityNum <= 0) return "";
  // DVLA often returns cc (e.g. 1995) — convert to litres for CRM.
  if (capacityNum >= 100) return (capacityNum / 1000).toFixed(1);
  return String(capacityNum);
}

/**
 * Build CRM-compatible lead payload from quote (or any) form state.
 * Follows the central Edge Function field names.
 */
export function buildQuoteLeadPayload({ contact, vehicle, calculator = null, source = LEAD_SOURCE }) {
  const vrm = String(vehicle?.vrm || "")
    .replace(/\s+/g, "")
    .toUpperCase();
  const model = vehicle?.model || vehicle?.series || "";

  const payload = {
    name: contact?.name || "",
    email: contact?.email || "",
    number: contact?.phone || contact?.number || "",
    postcode: contact?.postcode || "",
    vehicle_brand: vehicle?.brand || "",
    vehicle_model: model,
    vehicle_reg: vrm,
    vehicle_vrm: vrm,
    vehicle_series: vehicle?.series || "",
    vehicle_year: vehicle?.year ? String(vehicle.year) : "",
    engine_capacity: capacityToLitres(vehicle?.engineCapacity),
    fuel_type: vehicle?.fuelType || vehicle?.fuel_type || "",
    vehicle_part: "Engine",
    description: contact?.remarks || contact?.description || "",
    source,
    honeypot: contact?.honeypot || "",
  };

  // Email-only — stripped before CRM POST.
  if (calculator && typeof calculator === "object") {
    payload.calculator = calculator;
  }

  return payload;
}

/** Fields accepted by the Edge Function (no calculator / honeypot). */
export function toCrmLeadPayload(payload = {}) {
  return {
    name: payload.name || "",
    email: payload.email || "",
    number: payload.number || "",
    postcode: payload.postcode || "",
    vehicle_brand: payload.vehicle_brand || "",
    vehicle_model: payload.vehicle_model || "",
    vehicle_reg: payload.vehicle_reg || payload.vehicle_vrm || "",
    vehicle_vrm: payload.vehicle_vrm || payload.vehicle_reg || "",
    vehicle_series: payload.vehicle_series || "",
    vehicle_year: payload.vehicle_year || "",
    engine_capacity: payload.engine_capacity || "",
    fuel_type: payload.fuel_type || "",
    vehicle_part: payload.vehicle_part || "Engine",
    description: payload.description || "",
    source: payload.source || LEAD_SOURCE,
  };
}

/** POST lead to central Supabase receive-lead Edge Function. */
export async function sendLeadToCRM(payload) {
  if (!SUPABASE_WEBHOOK_URL) {
    throw new Error("SUPABASE_WEBHOOK_URL is not configured");
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is not configured");
  }

  const body = toCrmLeadPayload(payload);
  console.log("Sending lead to Supabase...", body.source);

  const response = await fetch(SUPABASE_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });

  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.error ||
      data?.message ||
      data?.raw ||
      `Lead send failed (${response.status})`;
    console.error("lead sent failed", message);
    throw new Error(typeof message === "string" ? message : "Lead send failed");
  }

  if (data?.error) {
    console.error("lead sent failed", data.error.message || data.error);
    throw new Error(data.error.message || "Lead send failed");
  }

  console.log("lead sent to Supabase.");
  return data?.success ?? data;
}

/** Fetch leads for this site only (source = bmwengines.uk). */
export async function fetchSiteLeads({ limit = 100 } = {}) {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is not configured");
  }

  const params = new URLSearchParams({
    source: `eq.${LEAD_SOURCE}`,
    order: "createdAt.desc",
    limit: String(limit),
  });

  const response = await fetch(`${SUPABASE_REST_URL}/leads?${params.toString()}`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : [];
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.raw ||
      `Failed to fetch leads (${response.status})`;
    throw new Error(typeof message === "string" ? message : "Failed to fetch leads");
  }

  return Array.isArray(data) ? data : [];
}
