import { iconFileFor } from "@/components/home/homeIcons";

// The original homepage icon names (and the emoji used in its data) -> the client's icon artwork.
const ALIAS = {
  chart: "real-inquiries",
  tool: "vetted-specialist",
  wrench: "vetted-specialist",
  book: "oem-references",
  trophy: "top-choice",
  engine: "engine",
  gear: "engine",
  car: "vehicle",
  users: "users-team",
  shield: "genuine-failure-data",
  shortcut: "symptoms",
  clipboard: "diagnose",
  thermometer: "cooling-temp",
  disc: "chain",
  drop: "oil-leak",
  droplet: "diesel",
  bolt: "electrical",
  smoke: "smoke-check",
  fuel: "pump",
  pump: "pump",
  flame: "fire",
  fire: "fire",
  refresh: "refresh-cycle",
  exhaust: "exhaust",
  steering: "suspension",
  warning: "check-watch",
  alert: "check-watch",
  question: "doc-search",
  tag: "price-tag",
  crown: "flagship-choice",
  check: "check",
  link: "link",
  file: "note",
  star: "star",
  bulb: "bulb",
  pound: "pound-shield",
  globe: "location",
  pulse: "live",
  timeline: "generations",
  insight: "insight",
  chat: "quote",
  dot: "check",
  "📊": "real-inquiries",
  "🔧": "vetted-specialist",
  "📖": "oem-references",
  "🏆": "top-choice",
  "✅": "safe-buy",
  "⚠️": "check-watch",
  "🔴": "fire",
  "🔥": "high-demand",
  "💎": "niche-style",
  "👑": "flagship-choice",
  "⛓️": "chain",
  "💚": "heart",
  "⭐": "star",
};

function fileFor(name) {
  return iconFileFor(ALIAS[name] || name);
}

/** True when the client has artwork for this icon name. */
export function hasBrandIcon(name) {
  return Boolean(fileFor(name));
}

/**
 * The client's icon artwork, drawn in the current text colour (BMW blue on light surfaces,
 * white on filled circles and in dark mode), so it drops into the slots the line icons used.
 * `scale` enlarges the artwork inside its box: the line icons left more air around their strokes.
 */
export default function BrandIcon({ name, className = "h-5 w-5", scale = 1.3 }) {
  const file = fileFor(name);
  if (!file) return null;
  const url = `/${encodeURIComponent("BMW White")}/${encodeURIComponent(file.replace(/\.png$/i, ".webp"))}`;
  const mask = `url("${url}") center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{
        backgroundColor: "currentColor",
        WebkitMask: mask,
        mask,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
    />
  );
}
