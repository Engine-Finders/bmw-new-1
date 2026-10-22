import ui from "@/data/shared/variantPageUi.json";

export { ui };

/** Plain text of a JSON string that may hold markup. */
export function plain(value = "") {
  return String(value ?? "").replace(/<[^>]*>/g, "").trim();
}

/** " - " written in the JSON reads as an em dash in the designs. */
export function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s+/g, " — ");
}

/** Fills {variant} / {model} / {count} style placeholders. */
export function fill(template = "", values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));
}

/** Leading "* ", "1. " or "→ " list/arrow markers and a trailing arrow, as typed in the JSON. */
export function stripMarker(value = "") {
  return String(value ?? "")
    .replace(/^\s*(?:\*|•|\d+\.)\s+/, "")
    .replace(/^\s*→\s*/, "")
    .replace(/\s*→\s*$/, "")
    .trim();
}

/** All-caps words in a title ("THROUGH TIME", "2 SERIES") read as title case in the designs. */
export function titleCaseShouting(value = "") {
  return String(value).replace(/\b([A-Z]{4,})\b/g, (word) => word[0] + word.slice(1).toLowerCase());
}

/**
 * Splits trailing "[TAG]" / "【TAG】" markers off a value. Only the tag's head is shown
 * ("[PLACEHOLDER - confirm vs cost sheet]" -> "PLACEHOLDER"), as in the designs.
 */
export function splitTags(value = "") {
  const tags = [];
  const main = String(value ?? "")
    .replace(/\s*[[【]([^\]】]+)[\]】]/g, (match, tag) => {
      tags.push(tag.split(/\s+-\s+/)[0].trim());
      return "";
    })
    .trim();
  return { main, tags };
}

/** "★★★★½ caption" -> { rating: 4.5, caption }. Null when the text has no stars. */
export function parseStars(value = "") {
  const match = String(value).match(/([★☆½]+)/);
  if (!match) return null;
  const full = (match[1].match(/★/g) || []).length;
  const half = match[1].includes("½") ? 0.5 : 0;
  const caption = String(value).replace(match[1], "").trim();
  return { rating: full + half, caption };
}

/** First entry of a [{ match, ... }] keyword list whose regex matches the text. */
export function byKeyword(list = [], text = "", key = "icon", fallback = null) {
  const lower = plain(text).toLowerCase().replace(/[\u2010-\u2015]/g, "-");
  const hit = list.find((entry) => new RegExp(entry.match, "i").test(lower));
  return hit ? hit[key] : fallback;
}

/** Number word for small counts ("Four"), digits beyond the list. */
export function countWord(count) {
  return ui.numberWords[count] || String(count);
}

/** Splits "Title - description" (checklist items, spec labels). */
export function splitTitle(value = "") {
  const clean = stripMarker(value);
  const index = clean.indexOf(" - ");
  if (index === -1) return { title: clean, text: "" };
  return { title: clean.slice(0, index).trim(), text: clean.slice(index + 3).trim() };
}

/** Urgency colour token from the JSON's emoji, or the label when there is no emoji. */
export function urgencyTone(urgency = {}, index = 0) {
  const icon = urgency?.icon || "";
  if (icon.includes("🔴")) return "red";
  if (icon.includes("🟡")) return "yellow";
  if (icon.includes("🟠")) return "orange";
  if (icon.includes("🟢")) return "green";
  const label = String(urgency?.label || "").toLowerCase();
  if (/immediate|urgent|critical/.test(label)) return "red";
  if (/monitor|low/.test(label)) return "yellow";
  if (/check|soon|plan/.test(label)) return "orange";
  return ["red", "yellow", "orange"][index % 3];
}

export const TONE_VAR = {
  red: "var(--color-v-red)",
  yellow: "var(--color-v-yellow)",
  orange: "var(--color-v-orange)",
  green: "var(--color-v-green)",
};

/** Splits a list into two columns, the first one longer by at most one item. */
export function balancedColumns(items = []) {
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
}

/** Values for the {variant} / {model} placeholders. */
export function pageValues(vehicle = "") {
  return { variant: vehicle || "BMW" };
}

/** Links inside JSON copy: body weight (the base layer sets links to 900), blue, underline on hover. */
export const RICH_LINKS = "[&_a]:font-[inherit] [&_a]:text-[var(--color-v-blue)] hover:[&_a]:underline";

/** JSON copy that may hold markup (links, <strong>): rendered as HTML, " - " shown as an em dash. */
export function Rich({ html = "", as: Tag = "span", className = "" }) {
  return <Tag className={`${RICH_LINKS} ${className}`} dangerouslySetInnerHTML={{ __html: dash(html) }} />;
}
