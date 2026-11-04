import { fetchVehicleDetails, normalizeVehicleDetails } from "@/components/shared/fetchVehicleDetails";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vrm = searchParams.get("vrm") || searchParams.get("reg") || "";

  if (!vrm.trim()) {
    return Response.json({ error: "Registration number is required" }, { status: 400 });
  }

  try {
    const result = await fetchVehicleDetails(vrm);
    const vehicle = normalizeVehicleDetails(result, vrm);

    if (!vehicle.brand && !vehicle.year && !vehicle.series) {
      return Response.json({ error: "No vehicle details found for that registration", vehicle, raw: result }, { status: 404 });
    }

    return Response.json({ vehicle, raw: result });
  } catch (error) {
    console.error("vehicle-lookup failed", error);
    const message = error.message || "Failed to fetch vehicle details";
    const status = /API error:\s*400/i.test(message) ? 502 : 502;
    return Response.json({ error: message }, { status });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const reg = body?.reg || body?.vrm || "";

    if (!reg || typeof reg !== "string" || !reg.trim()) {
      return Response.json({ error: "Registration number is required" }, { status: 400 });
    }

    const result = await fetchVehicleDetails(reg);
    const vehicle = normalizeVehicleDetails(result, reg);

    if (!vehicle.brand && !vehicle.year && !vehicle.series) {
      return Response.json({ error: "No vehicle details found for that registration", vehicle }, { status: 404 });
    }

    return Response.json({ vehicle, raw: result });
  } catch (error) {
    console.error("POST vehicle-lookup failed", error);
    return Response.json({ error: error.message || "Failed to fetch vehicle details" }, { status: 502 });
  }
}
