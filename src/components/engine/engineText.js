// Engine page data helpers (plain functions, safe on the server and the client).

const PLACEHOLDER = /\[(?:X|N|Score|link|TBC|TBD|\.\.\.)\]/gi;
const TAG = /\[([A-Z][A-Z0-9]*(?:[ \-‑][A-Z0-9]+)*)\]/g;

/** U+2011 non-breaking hyphen → "-" (for matching labels). */
export function normHyphen(value = "") {
  return String(value ?? "").replace(/‑/g, "-");
}

/** Normalise one string: mojibake £, U+2011, spaced dashes, curly quotes, whitespace. */
export function cleanText(value = "") {
  return String(value ?? "")
    .replace(/Â£/g, "£")
    .replace(/‑/g, "-")
    .replace(/(\S)\s+-\s*(?=\S)/g, "$1 – ")
    .replace(/"([^"]*)"/g, "“$1”")
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when the value carries an unfilled placeholder like [X], [N] or [Score]. */
export function hasPlaceholder(value = "") {
  PLACEHOLDER.lastIndex = 0;
  return PLACEHOLDER.test(String(value ?? ""));
}

/** The value with [TAGS] and placeholders removed (cleaned). */
export function stripTags(value = "") {
  return cleanText(String(value ?? "").replace(PLACEHOLDER, "").replace(TAG, "")).replace(/\s+([.,;:)])/g, "$1");
}

/** "116–204 hp [BMW-VERIFIED]" → { text: "116–204 hp", tags: ["BMW-VERIFIED"] }. */
export function splitTags(value = "") {
  const raw = normHyphen(value).replace(PLACEHOLDER, "");
  const tags = [...raw.matchAll(TAG)].map((m) => m[1]);
  return { text: stripTags(raw), tags };
}

/** Text → segments [{ type: "text" | "tag", value }]; placeholders dropped, dashes/quotes cleaned. */
export function textSegments(value = "") {
  const clean = cleanText(String(value ?? "").replace(PLACEHOLDER, "")).replace(/\s+([.,;:])/g, "$1");
  const out = [];
  let last = 0;
  for (const m of clean.matchAll(TAG)) {
    if (m.index > last) out.push({ type: "text", value: clean.slice(last, m.index) });
    out.push({ type: "tag", value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < clean.length) out.push({ type: "text", value: clean.slice(last) });
  return out;
}

/** Leading figure of a label: "1,450+ Enquiries" → { figure: "1,450+", label: "Enquiries" }. */
export function splitFigure(label = "") {
  if (hasPlaceholder(label)) return { figure: "", label: stripTags(label).replace(/^[+\s]*(?:\/\s*\d+)?\s*/, "") };
  const clean = stripTags(label);
  const m = clean.match(/^([~£]?\d[\d,.]*\s*(?:\+|%)?(?:\s*\/\s*\d+)?)\s*(.*)$/);
  return m ? { figure: m[1].replace(/\s+/g, ""), label: m[2] } : { figure: "", label: clean };
}

/** "66/100" → 66 (or null for "[Score]/100"). */
export function parseScore(value = "") {
  if (hasPlaceholder(value)) return null;
  const m = String(value ?? "").match(/(\d+(?:\.\d+)?)\s*\/\s*100/);
  return m ? Number(m[1]) : null;
}

/** "3½★ out of 5", "3.5★", "4.0★", "4★" → 3.5 / 4 (or null). */
export function parseStars(value = "") {
  const m = String(value ?? "").match(/(\d+(?:\.\d+)?)(½)?/);
  return m ? Number(m[1]) + (m[2] ? 0.5 : 0) : null;
}

/** 3.5 → "3½", 4 → "4", null → "–". */
export function formatStars(n) {
  if (n == null) return "–";
  const whole = Math.floor(n);
  return n - whole >= 0.5 ? `${whole}½` : String(whole);
}

/** "BMW N40 / N42" → "N40 / N42". */
export function engineCode(label = "") {
  return stripTags(label).replace(/^BMW\s+/i, "").trim();
}

/** Every spelling of the code a heading may use: "N40 / N42", "N40/N42". */
export function codeVariants(code = "") {
  const spaced = code.trim();
  const tight = spaced.replace(/\s*\/\s*/g, "/");
  return [...new Set([spaced, tight].filter(Boolean))].sort((a, b) => b.length - a.length);
}

/**
 * "2007–2019" → { start: 2007, end: 2019, endLabel: "2019", span: 12, label: "2007–2019" }.
 * Handles "2014–present", "N13: 2011–2016; N20: 2011–2017", tags. Null when no year is found.
 */
export function parseYears(value = "", now = new Date().getFullYear()) {
  const raw = stripTags(value);
  const years = [...raw.matchAll(/\b(19|20)\d{2}\b/g)].map((m) => Number(m[0]));
  if (!years.length) return null;
  const start = Math.min(...years);
  const present = /present|still in use/i.test(raw);
  const end = present ? now : Math.max(...years);
  const endLabel = present ? "Present" : String(end);
  return { start, end, endLabel, span: Math.max(0, end - start), label: `${start}–${endLabel}` };
}

/** "1,450+" from the hero strip ("1,450+ Enquiries") or the lead ("Backed by 1,450+ real UK enquiries"); "" if none. */
export function enquiriesFrom(hero = {}) {
  const item = (hero?.trustStrip || []).find((s) => /enquir/i.test(s?.label || ""));
  const fig = item ? splitFigure(item.label).figure : "";
  if (fig) return fig;
  const m = String(hero?.subHeadline || "").match(/(\d[\d,]*\+?)\s+(?:real\s+)?UK enquiries/i);
  return m ? m[1] : "";
}

/** Metric → value map with U+2011 normalised in the metric names. */
export function glanceMap(rows = []) {
  return Object.fromEntries((rows || []).map((row) => [normHyphen(row.metric), row.value]));
}

/** The models row whichever way it is spelled ("Models Fitted (BMW only)" / "(BMW)"). */
export function modelsFittedOf(map = {}) {
  const key = Object.keys(map).find((k) => k.startsWith("Models Fitted"));
  return key ? map[key] : "";
}

/** "Exclusive to BMW…" → true. */
export function isExclusive(crossBrand = "") {
  return /^exclusive/i.test(stripTags(crossBrand));
}

/**
 * Two pages' compatibility tables leaked an "Engine" header cell, shifting every field by one.
 * Re-chunk them as model, generation, variant, years, engine so photos are picked per real row.
 */
export function realignCompatibility(compatibility) {
  const rows = compatibility?.rows || [];
  if (!rows.length || !/^engine$/i.test(stripTags(rows[0].model))) return compatibility;
  const cells = rows.flatMap((row) => [row.model, row.generation, row.variantBadge, row.years].map((v) => v ?? ""));
  const out = [];
  for (let i = 1; i + 3 < cells.length; i += 5) {
    const [model, generation, variantBadge, years, engine = ""] = cells.slice(i, i + 5);
    out.push({ model: String(model).replace(/^BMW\s+/i, ""), generation, variantBadge, years, engine });
  }
  return { ...compatibility, rows: out };
}
