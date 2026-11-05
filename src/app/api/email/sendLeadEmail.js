import { Resend } from "resend";
import { LEAD_SOURCE } from "@/app/api/crm/sendLeadToCRM";

/**
 * Lead notification email (Resend) — universal lead email template.
 * Recipient is hardcoded - do not move to env.
 */
const LEAD_TO_EMAIL = "ef2crm@gmail.com";
// const LEAD_TO_EMAIL = "hashirafridi474747@gmail.com";

const LEAD_FROM_EMAIL = "BMW Engines <leads@bmwengines.uk>";
const SITE_NAME = "BMW Reliability Guide";
const SITE_DOMAIN = "bmwengines.uk";
const SITE_URL = `https://${SITE_DOMAIN}`;
const SITE_LOGO_URL = `${SITE_URL}/Rectangular.png`;

const C = {
  navy: "#0f2744",
  navyMid: "#163357",
  labelBg: "#eef2f7",
  border: "#d9e2ec",
  text: "#1a2b3c",
  muted: "#5b6b7c",
  link: "#1d4ed8",
  pageBg: "#e8eef5",
  yellow: "#f5c518",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function trimOrEmpty(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function displayOrNotProvided(value) {
  const v = trimOrEmpty(value);
  return v || "Not provided";
}

function formatReceivedUk(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  return `${get("day")} ${get("month")} ${get("year")} at ${get("hour")}:${get("minute")} (UK)`;
}

function makeLeadReference(date = new Date()) {
  const stamp = date.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BE-${stamp}-${rand}`;
}

/** engine_capacity may arrive as litres (1.5) or cc (1498). */
function formatEngineCapacityCc(value) {
  const raw = trimOrEmpty(value).replace(/,/g, "");
  if (!raw) return "";
  const num = Number(raw.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num) || num <= 0) return "";
  const cc = num >= 100 ? Math.round(num) : Math.round(num * 1000);
  const litres = (cc / 1000).toFixed(1);
  return `${cc.toLocaleString("en-GB")} cc (${litres}L)`;
}

function isAllowedSitePage(url) {
  try {
    const u = new URL(String(url));
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    return host === SITE_DOMAIN || host.endsWith(`.${SITE_DOMAIN}`);
  } catch {
    return false;
  }
}

/** Normalize submitted page URL for display / linking. */
function normalizeSourcePage(url) {
  const raw = trimOrEmpty(url);
  if (!raw) return "";

  // Relative site path → absolute production URL
  if (raw.startsWith("/")) {
    return `${SITE_URL}${raw}`;
  }

  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");

    // Local / preview hosts: keep full URL so Page is never blank during testing
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".vercel.app")) {
      return u.href;
    }

    // Same site (any scheme) → force https production URL with path/query
    if (host === SITE_DOMAIN || host.endsWith(`.${SITE_DOMAIN}`)) {
      return `${SITE_URL}${u.pathname}${u.search}${u.hash}`;
    }

    return "";
  } catch {
    return "";
  }
}

function pageLinkHtml(url) {
  const v = normalizeSourcePage(url);
  if (!v) return escapeHtml("Not provided");

  // Only https site URLs become clickable links (handover rule)
  if (isAllowedSitePage(v)) {
    return `<a href="${escapeAttr(v)}" style="color:${C.link};text-decoration:underline">${escapeHtml(v)}</a>`;
  }

  // Localhost / preview: still show the URL (plain text)
  return escapeHtml(v);
}

function row(label, valueHtml, { last = false } = {}) {
  const border = last ? "border-bottom:0" : `border-bottom:1px solid ${C.border}`;
  return `<tr>
  <td valign="top" width="38%" style="padding:11px 14px;background:${C.labelBg};color:${C.text};font-size:13px;font-weight:700;${border}">${escapeHtml(label)}</td>
  <td valign="top" style="padding:11px 14px;background:#fff;color:${C.text};font-size:14px;line-height:1.45;overflow-wrap:anywhere;${border}">${valueHtml}</td>
</tr>`;
}

function textRow(label, value, { always = false, last = false } = {}) {
  const v = trimOrEmpty(value);
  if (!v && !always) return "";
  return row(label, escapeHtml(always ? displayOrNotProvided(v) : v), { last });
}

function mailtoRow(label, email, opts = {}) {
  const v = trimOrEmpty(email);
  if (!v) return row(label, escapeHtml("Not provided"), opts);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return row(label, escapeHtml(v), opts);
  return row(
    label,
    `<a href="mailto:${escapeAttr(v)}" style="color:${C.link};text-decoration:underline">${escapeHtml(v)}</a>`,
    opts,
  );
}

function telRow(label, phone, opts = {}) {
  const v = trimOrEmpty(phone);
  if (!v) return row(label, escapeHtml("Not provided"), opts);
  const tel = v.replace(/[^\d+]/g, "");
  if (!tel) return row(label, escapeHtml(v), opts);
  return row(
    label,
    `<a href="tel:${escapeAttr(tel)}" style="color:${C.link};text-decoration:underline">${escapeHtml(v)}</a>`,
    opts,
  );
}

function vrmRow(label, vrm, opts = {}) {
  const v = trimOrEmpty(vrm).toUpperCase();
  if (!v) return row(label, escapeHtml("Not provided"), opts);
  return row(
    label,
    `<span style="display:inline-block;background:${C.yellow};color:#111;font-weight:800;font-size:15px;letter-spacing:0.06em;padding:5px 12px;border-radius:4px;border:1px solid #d4a80f">${escapeHtml(v)}</span>`,
    opts,
  );
}

function sourceSiteRow(site, opts = {}) {
  const v = trimOrEmpty(site) || SITE_DOMAIN;
  return row(
    "Source",
    `<a href="${escapeAttr(SITE_URL)}" style="color:${C.link};text-decoration:underline">${escapeHtml(v)}</a>`,
    opts,
  );
}

function sourcePageRow(url, opts = {}) {
  return row("Page", pageLinkHtml(url), opts);
}

function sectionHeader(iconChar, title) {
  return `<tr>
  <td style="background:${C.navy};padding:12px 16px;border-radius:8px 8px 0 0">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="width:28px;height:28px;background:${C.navyMid};border-radius:6px;text-align:center;vertical-align:middle;font-size:14px;line-height:28px;color:#fff">${iconChar}</td>
      <td style="padding-left:10px;color:#fff;font-size:14px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase">${escapeHtml(title)}</td>
    </tr></table>
  </td>
</tr>`;
}

function sectionCard(iconChar, title, rowsHtml) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;border-collapse:separate;border-spacing:0;border:1px solid ${C.border};border-radius:8px;overflow:hidden">
  ${sectionHeader(iconChar, title)}
  <tr>
    <td style="padding:0;background:#fff">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">${rowsHtml}</table>
    </td>
  </tr>
</table>`;
}

function normalizeLead(payload = {}) {
  const make = trimOrEmpty(payload.vehicle_brand || payload.vehicle_make);
  const model = trimOrEmpty(payload.vehicle_model || payload.vehicle_series);
  const vrm = trimOrEmpty(payload.vehicle_vrm || payload.vehicle_reg).toUpperCase();

  return {
    name: trimOrEmpty(payload.name),
    email: trimOrEmpty(payload.email),
    phone: trimOrEmpty(payload.number || payload.phone),
    postcode: trimOrEmpty(payload.postcode),
    additional_information: trimOrEmpty(payload.description || payload.additional_information),
    vehicle_reg: vrm,
    vehicle_make: make,
    vehicle_model: model,
    vehicle_year: trimOrEmpty(payload.vehicle_year),
    engine_capacity_cc: formatEngineCapacityCc(payload.engine_capacity || payload.engine_capacity_cc),
    fuel_type: trimOrEmpty(payload.fuel_type),
    source_site: LEAD_SOURCE || SITE_DOMAIN,
    source_page: normalizeSourcePage(
      payload.pageUrl || payload.source_page || payload.sourcePage || "",
    ),
  };
}

function buildLeadRows(lead) {
  return [
    textRow("Name", lead.name, { always: true }),
    mailtoRow("Email", lead.email),
    telRow("Phone Number", lead.phone),
    textRow("Postcode", lead.postcode, { always: true }),
    textRow("Additional Information", lead.additional_information, { always: true, last: true }),
  ].join("");
}

function buildVehicleRows(lead) {
  return [
    vrmRow("Vehicle Reg", lead.vehicle_reg),
    textRow("Vehicle Make", lead.vehicle_make, { always: true }),
    textRow("Vehicle Model", lead.vehicle_model, { always: true }),
    textRow("Vehicle Year", lead.vehicle_year, { always: true }),
    textRow("Engine Capacity", lead.engine_capacity_cc, { always: true }),
    textRow("Fuel Type", lead.fuel_type, { always: true, last: true }),
  ].join("");
}

function buildSourceRows(lead) {
  return [sourceSiteRow(lead.source_site), sourcePageRow(lead.source_page, { last: true })].join("");
}

function buildLeadEmailHtml({ lead, leadReference, receivedUk }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:24px 10px;background:${C.pageBg};font-family:Arial,Helvetica,sans-serif;color:${C.text}">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border-collapse:separate;border-spacing:0;border-radius:12px;overflow:hidden;box-shadow:0 8px 28px rgba(15,39,68,0.12)">
    <tr>
      <td style="background:${C.navy};padding:1px 20px;color:#fff">
        <img src="${SITE_LOGO_URL}" alt="${escapeHtml(SITE_NAME)}" width="220" style="display:block;width:220px;max-width:70%;height:auto;border:0;outline:none;text-decoration:none;margin:0" />
        <div style="height:1px;background:rgba(158,182,212,0.35);margin:10px 0 12px"></div>
        <div style="font-size:26px;font-weight:800;line-height:1.15;color:#fff;padding-bottom:12px">New Quote Request</div>
        <div style="font-size:14px;color:#b7c7db;margin-top:0;padding-bottom:14px;line-height:1.5;overflow-wrap:anywhere">A new enquiry has been submitted from ${escapeHtml(lead.source_site || SITE_DOMAIN)}${lead.source_page ? ` · Page: ${escapeHtml(lead.source_page)}` : ""}.</div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 1px;background:#f7f9fc">
        ${sectionCard("&#128100;", "Customer Details", buildLeadRows(lead))}
        ${sectionCard("&#128663;", "Vehicle Details", buildVehicleRows(lead))}
        ${sectionCard("&#128279;", "Source", buildSourceRows(lead))}
      </td>
    </tr>
    <tr>
      <td style="background:${C.navy};padding:16px 20px;border-top:3px solid #3b82f6">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="color:#c5d4e6;font-size:13px;line-height:1.5;vertical-align:middle">
            Lead Reference: <span style="color:#93c5fd;font-weight:700">#${escapeHtml(leadReference)}</span>
          </td>
          <td align="right" style="color:#c5d4e6;font-size:13px;line-height:1.5;vertical-align:middle;white-space:nowrap">
            Received: ${escapeHtml(receivedUk)}
          </td>
        </tr></table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildLeadEmailText({ lead, leadReference, receivedUk }) {
  const line = (label, value) => `${label}: ${displayOrNotProvided(value)}`;
  return [
    `New Quote Request — ${SITE_NAME}`,
    SITE_DOMAIN,
    `A new enquiry has been submitted from ${lead.source_site || SITE_DOMAIN}${lead.source_page ? ` · Page: ${lead.source_page}` : ""}.`,
    "",
    "CUSTOMER DETAILS",
    line("Name", lead.name),
    line("Email", lead.email),
    line("Phone Number", lead.phone),
    line("Postcode", lead.postcode),
    line("Additional Information", lead.additional_information),
    "",
    "VEHICLE DETAILS",
    line("Vehicle Reg", lead.vehicle_reg),
    line("Vehicle Make", lead.vehicle_make),
    line("Vehicle Model", lead.vehicle_model),
    line("Vehicle Year", lead.vehicle_year),
    line("Engine Capacity", lead.engine_capacity_cc),
    line("Fuel Type", lead.fuel_type),
    "",
    "SOURCE",
    line("Source", lead.source_site),
    line("Page", lead.source_page),
    "",
    `Lead Reference: #${leadReference}`,
    `Received: ${receivedUk}`,
  ].join("\n");
}

function buildSubject(lead) {
  const vehicleBit = [lead.vehicle_make, lead.vehicle_model].filter(Boolean).join(" ").trim();
  const parts = ["New Lead", SITE_NAME];
  if (vehicleBit) parts.push(vehicleBit);
  if (lead.vehicle_reg) parts.push(lead.vehicle_reg);
  return parts.join(" | ");
}

/** Send ops alert via Resend. Calculator data stays email-only if present in payload notes. */
export async function sendLeadEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const now = new Date();
  const lead = normalizeLead(payload);
  if (payload?.calculator && typeof payload.calculator === "object") {
    const calcBits = [
      payload.calculator.diagnosis && `Diagnosis: ${payload.calculator.diagnosis}`,
      payload.calculator.verdict && `Verdict: ${payload.calculator.verdict}`,
    ].filter(Boolean);
    if (calcBits.length) {
      lead.additional_information = [lead.additional_information, `Calculator — ${calcBits.join(" · ")}`]
        .filter(Boolean)
        .join("\n");
    }
  }

  const leadReference = makeLeadReference(now);
  const receivedUk = formatReceivedUk(now);
  const customerEmail = lead.email;
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: LEAD_FROM_EMAIL,
    to: [LEAD_TO_EMAIL],
    ...(customerEmail ? { replyTo: customerEmail } : {}),
    subject: buildSubject(lead),
    html: buildLeadEmailHtml({ lead, leadReference, receivedUk }),
    text: buildLeadEmailText({ lead, leadReference, receivedUk }),
  });

  if (error) {
    console.error("lead email failed", error);
    throw new Error(error.message || "Failed to send lead email");
  }

  console.log("lead email sent to", LEAD_TO_EMAIL, data?.id || "", leadReference);
  return data;
}
