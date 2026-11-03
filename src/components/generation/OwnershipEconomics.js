"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import ui from "@/data/shared/generationPageUi.json";
import { bandColor } from "./generationSection";

const UI = ui.ownershipEconomics || {};

// Colours sampled from the designs (dark); light is the same design in daylight colours.
const TONES = {
  light: {
    "--oe-bg": "#f6f8fb",
    "--oe-head": "#edf1f6",
    "--oe-row": "#ffffff",
    "--oe-row-alt": "#f7f9fc",
    "--oe-line": "#e4e9ef",
    "--oe-col": "#dde3ea",
    "--oe-border": "#d9dfe7",
    "--oe-text": "#0b1726",
    "--oe-muted": "#46536a",
    "--oe-code": "#0a5ad2",
    "--oe-blue": "#0a5ad2",
    "--oe-rule-bg": "linear-gradient(135deg, #f1f7ff 0%, #e6f0ff 100%)",
    "--oe-rule-border": "#7faaf0",
    "--oe-rule-glow": "0 0 0 1px rgba(10,90,210,0.06), 0 10px 30px rgba(10,90,210,0.10)",
    "--oe-take-bg": "#ffffff",
    "--oe-take-border": "#dde3ea",
    "--oe-take-row": "#f7f9fc",
    "--oe-disc": "#0b4aa8",
    "--oe-shadow": "0 12px 32px rgba(10,26,43,0.07)",
    "--oe-warn": "#eaa900",
    "--oe-ok": "#2f9e44",
    "--oe-thumb": "#2f74e0",
    "--oe-red": "#d62828",
    "--oe-info": "#0a64e0",
    "--oe-least": "#2f9e44",
    "--oe-most": "#d62828",
    "--oe-value": "#0a5ad2",
    "--oe-halo": "0 0 2px rgba(246,248,251,0.9), 0 0 8px rgba(246,248,251,0.85), 0 0 18px rgba(246,248,251,0.7)",
    "--oe-warn-text": "#9a6700",
    "--oe-ok-text": "#23803a",
    "--oe-thumb-text": "#1f62c9",
    "--oe-red-text": "#c22323",
    "--oe-info-text": "#0a5ad2",
    "--oe-least-text": "#23803a",
    "--oe-most-text": "#c22323",
    "--oe-value-text": "#0a5ad2",
  },
  dark: {
    "--oe-bg": "#01060c",
    "--oe-head": "linear-gradient(180deg, #131b23 0%, #0d151c 100%)",
    "--oe-row": "#111922",
    "--oe-row-alt": "#08111a",
    "--oe-line": "#1e242b",
    "--oe-col": "#2f353c",
    "--oe-border": "#2c3137",
    "--oe-text": "#ffffff",
    "--oe-muted": "rgba(255,255,255,0.84)",
    "--oe-code": "#5a95e6",
    "--oe-blue": "#4a8fe4",
    "--oe-rule-bg": "linear-gradient(160deg, #001a3d 0%, #00132b 55%, #000f22 100%)",
    "--oe-rule-border": "#2f6fc4",
    "--oe-rule-glow": "0 0 0 1px rgba(47,111,196,0.25), 0 0 26px rgba(30,110,230,0.22)",
    "--oe-take-bg": "linear-gradient(180deg, #0c1116 0%, #060d15 100%)",
    "--oe-take-border": "#3a3e43",
    "--oe-take-row": "#0b131c",
    "--oe-disc": "#01377b",
    "--oe-shadow": "0 14px 34px rgba(0,0,0,0.45)",
    "--oe-warn": "#f7ba0a",
    "--oe-ok": "#64ba50",
    "--oe-thumb": "#5b98f7",
    "--oe-red": "#d61f20",
    "--oe-info": "#0267e0",
    "--oe-least": "#6cc35a",
    "--oe-most": "#ff3b3b",
    "--oe-value": "#4d93f0",
    "--oe-halo": "0 0 2px rgba(1,6,12,0.9), 0 0 8px rgba(1,6,12,0.85), 0 0 18px rgba(1,6,12,0.7)",
    "--oe-warn-text": "#f7ba0a",
    "--oe-ok-text": "#6cc35a",
    "--oe-thumb-text": "#62a0fa",
    "--oe-red-text": "#ff4b4b",
    "--oe-info-text": "#4d93f0",
    "--oe-least-text": "#6cc35a",
    "--oe-most-text": "#ff4b4b",
    "--oe-value-text": "#4d93f0",
  },
};

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";

const stripTags = (value = "") => String(value ?? "").replace(/<[^>]*>/g, "");

// " -text" / " - text" / " – text" -> " — text" (ranges such as "£2,500–£5,000" have no spaces and stay as they are)
function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)|\s+–\s+/g, " — ");
}

// "Risk vs Reward -budget for chain history…" -> lead + the rest.
function splitLead(value = "") {
  const match = dash(value).match(/^(.*?)\s+—\s+(.*)$/);
  return match ? { lead: match[1].trim(), rest: match[2].trim() } : { lead: "", rest: dash(value) };
}

// "BMW 3 Series E90 - Ownership Economics" -> "BMW 3 Series E90" + "Ownership Economics".
function splitTitle(value = "") {
  const match = dash(value).match(/^(.*?)\s+—\s+(.*)$/);
  return match ? { main: match[1], accent: match[2] } : { main: dash(value), accent: "" };
}

// Running text keeps number ranges on one line ("40–65%", "£3,200–£5,500"): a word joiner after the dash.
function keepRanges(html = "") {
  return String(html ?? "").replace(/([\d%])–(?=[£$€\d])/g, "$1–\u2060");
}

// Line breaks where the design breaks narrow cells: after an en dash ("£650–" / "£1,800"), a slash
// ("Thermostat/" / "swirl flaps", "N52B25/" / "30") and a drive name ("(xDrive" / "30d)"); tags are left alone.
function breakable(html = "") {
  return String(html ?? "")
    .split(/(<[^>]*>)/)
    .map((part) => (part.startsWith("<") ? part : part.replace(/([–/])(?=[^\s–/])/g, "$1<wbr>").replace(/([xs]Drive)(?=\d)/g, "$1<wbr>")))
    .join("");
}

/* ---------- The garage scene ----------
   The E90 page's own artwork (its car in the underground car park, extended to the right so wide screens keep
   garage beyond the car) and, for every other page and the light theme, the same garage with the E90 taken out and
   rebuilt behind it (public/generation/ownership/). All are 4120x1232: the artwork's 992px-tall frame with 240px of
   wall fading into shadow added above it (for layouts whose scene starts below the section's top edge). CAR is where
   the E90 stands in them, so each generation's own rear three-quarter photo is stood in exactly the same place. */
const SCENE = {
  plate: { dark: "/generation/ownership/garage-dark.webp", light: "/generation/ownership/garage-light.webp" },
  width: 4120,
  height: 1232,
  frame: 992, // the artwork's own frame (the part below the added wall)
};
const TOP = (SCENE.height - SCENE.frame) / SCENE.height;
const CAR = { left: 0.33034, right: 0.74709, top: TOP + (71 / SCENE.height), bottom: TOP + (934 / SCENE.height) };
// Per unit of the frame's height (--oe-h): the car's width, the scene right of its tail, the frame below its tyres.
const CAR_W = ((CAR.right - CAR.left) * SCENE.width) / SCENE.frame;
const PAST_CAR = ((1 - CAR.right) * SCENE.width) / SCENE.frame;
const BELOW_CAR = (SCENE.frame - 934) / SCENE.frame;
const CAR_BOX_RATIO = ((CAR.right - CAR.left) * SCENE.width) / ((CAR.bottom - CAR.top) * SCENE.height);
const pct = (value) => `${(value * 100).toFixed(3)}%`;

// The scene is sized by --oe-h (its frame's height) and placed by the car: its tail --oe-over past the table's right
// edge, its tyres --oe-d below the table's top edge (the car's lower part tucks behind the table, as in the design).
const SCENE_BOX = {
  height: `calc(${(SCENE.height / SCENE.frame).toFixed(5)} * var(--oe-h))`,
  aspectRatio: `${SCENE.width} / ${SCENE.height}`,
  right: `calc(-1 * (var(--oe-over) + ${PAST_CAR.toFixed(4)} * var(--oe-h)))`,
  bottom: `calc(-1 * (var(--oe-d) + ${BELOW_CAR.toFixed(4)} * var(--oe-h)))`,
  maskImage: "linear-gradient(90deg, transparent 3%, #000 21%, #000 90%, transparent 100%), var(--oe-vmask)",
  WebkitMaskImage: "linear-gradient(90deg, transparent 3%, #000 21%, #000 90%, transparent 100%), var(--oe-vmask)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

// Phones: the scene's own fade, top and bottom only; tablets and desktops also fade it out under the table's top edge
// (only the strip right of the table shows there).
const SCENE_VARS = [
  "[--oe-h:29vw] [--oe-d:calc(var(--oe-h)*0.04)] [--oe-over:0px]",
  "[--oe-vmask:linear-gradient(180deg,transparent_0%,#000_13%,#000_100%)]",
  "md:max-lg:[--oe-h:calc((100vw_-_64px)*0.254)] md:max-lg:[--oe-d:calc(var(--oe-h)*0.16)] md:max-lg:[--oe-over:8px]",
  "md:[--oe-vmask:linear-gradient(180deg,transparent_0%,#000_12%,#000_79%,transparent_97.6%)]",
  "lg:[--oe-d:calc(var(--oe-h)*0.3)] lg:max-[1440px]:[--oe-over:16px] lg:max-[1440px]:[--oe-h:calc(270px_+_(100vw_-_1024px)*0.08)]",
].join(" ");

// The generation's own photo, stood where the E90 stands: as wide as the E90 (or as tall, for taller cars), tail and
// tyres on the E90's, so every page frames its car the same way. Never mirrored.
function SceneCar({ src, fit, view, isDark }) {
  const w = fit?.width || 1000;
  const h = fit?.height || 600;
  const f = { top: fit?.top || 0, bottom: fit?.bottom || 0, left: fit?.left || 0, right: fit?.right || 0 };
  const visW = w * (1 - f.left - f.right);
  const visH = h * (1 - f.top - f.bottom);
  // units: the car box's width = 1
  const scale = visW / visH >= CAR_BOX_RATIO ? 1 / visW : 1 / CAR_BOX_RATIO / visH;
  const carWidth = visW * scale;
  const photo = {
    position: "absolute",
    width: pct(w * scale),
    height: "auto",
    maxWidth: "none",
    right: pct(-f.right * w * scale),
    bottom: pct(-f.bottom * h * scale * CAR_BOX_RATIO),
  };
  // A car facing right ("back-right") shows its tail lights and plate at its left end, where the phone heading runs:
  // phones stand it a little smaller, still on the same floor line and against the same right edge.
  const box = view === "back-right" ? "max-md:origin-bottom-right max-md:scale-[0.86]" : "";
  return (
    <div className={`absolute ${box}`} style={{ left: pct(CAR.left), width: pct(CAR.right - CAR.left), top: pct(CAR.top), height: pct(CAR.bottom - CAR.top) }}>
      {/* contact shadow under the tyres */}
      <div
        className={`absolute bottom-[-3%] h-[9%] rounded-[50%] blur-[7px] ${isDark ? "bg-black/80" : "bg-[#1b2433]/30"}`}
        style={{ right: pct(carWidth * 0.04), width: pct(carWidth * 0.92) }}
      />
      <Image
        src={src}
        alt=""
        width={w}
        height={h}
        sizes="(min-width: 1024px) 620px, (min-width: 768px) 50vw, 60vw"
        style={photo}
        // the studio-lit photo, toned down to the car park's low light in the dark theme
        className={isDark ? "brightness-[0.8] contrast-[1.06] saturate-[0.95]" : ""}
      />
    </div>
  );
}

function Scene({ data, isDark }) {
  const own = isDark && data.art?.dark ? data.art.dark : null;
  const plate = own || SCENE.plate[isDark ? "dark" : "light"];
  const car = !own && data.image ? data.image : null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute" style={SCENE_BOX}>
      <Image src={plate} alt="" fill sizes="(min-width: 1024px) 1260px, (min-width: 768px) 100vw, 120vw" className="object-cover" />
      {car ? <SceneCar src={car} fit={data.imageFit} view={data.imageView} isDark={isDark} /> : null}
    </div>
  );
}

/* ---------- Icons (24px grid) ---------- */
const STROKE = {
  engine: (
    <>
      <path d="M8 4.5h7M11.5 4.5v3" />
      <path d="M6.5 9 8 7.5h9V11h1.8V9h2.7v8.5h-2.7v-3H17v5h-6.5l-2-2h-2V15h-2v2.5h-2v-7h2V13h2z" />
    </>
  ),
  gauge: (
    <>
      <path d="M5.2 18.6a8.8 8.8 0 1 1 13.6 0" />
      <path d="m12 14 3.4-4.4" />
      <circle cx="12" cy="14.6" r="1.3" />
      <path d="M12 6.4v1.2M7.3 8.3l.8.8M16.7 8.3l-.8.8M5.4 12.6h1.2M17.4 12.6h1.2" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.2v4.6M12 17.1h.01" />
    </>
  ),
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  recon: (
    <>
      <path d="M8 4.5h7M11.5 4.5v3" />
      <path d="M6.5 9 8 7.5h9V11h1.8V9h2.7v8.5h-2.7v-3H17v5h-6.5l-2-2h-2V15h-2v2.5h-2v-7h2V13h2z" />
      <path d="M13.9 12.1a2.3 2.3 0 1 0-.4 2.6M14 10.6v1.6h-1.6" strokeWidth="1.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 4.8 5.6v6c0 4.4 3 8 7.2 9.6 4.2-1.6 7.2-5.2 7.2-9.6v-6z" />
      <path d="m8.7 12.2 2.3 2.3 4.4-4.6" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
};

function Icon({ name, className, strokeWidth = 1.6 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {STROKE[name]}
    </svg>
  );
}

// Engine, Typical Mileage, Common Major Failure, Repair Cost, Replacement Cost, Ownership Verdict
const COLUMN_ICONS = ["engine", "gauge", "warning", "wrench", "recon", "shield"];

// Filled verdict badges, as drawn in the designs.
function VerdictIcon({ kind, className }) {
  const color = `var(--oe-${kind})`;
  if (kind === "warn") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M10.2 3.3 1.8 18.1A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.8 3.3a2 2 0 0 0-3.6 0z" fill={color} />
        <path d="M12 8.6v5.6M12 17.4h.01" stroke="#1d1500" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "thumb") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M2.4 10.2h4.2V21H2.4zM8.4 21h8.7a2.1 2.1 0 0 0 2-1.6l1.5-6.9a2 2 0 0 0-2-2.5h-4.9l.8-4a2 2 0 0 0-3.7-1.4L8.4 10.2z" fill={color} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10.6" fill={color} />
      {kind === "ok" ? <path d="m7 12.4 3.3 3.3 6.6-7" fill="none" stroke="#0b1f08" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {kind === "red" ? <path d="M12 6.6v6.6M12 17.1h.01" stroke="#fff" strokeWidth="2.7" strokeLinecap="round" /> : null}
      {kind === "info" ? <path d="M12 10.8v6.4M12 7.2h.01" stroke="#fff" strokeWidth="2.7" strokeLinecap="round" /> : null}
    </svg>
  );
}

// The E90's verdictType wins; otherwise the verdict's own title decides, as the designs colour them: costly or
// risky-to-avoid in red, watch-outs in amber, the picks in green, good choices with a thumb, plain facts in blue.
const KIND_RULES = [
  ["red", /expensive|high risk|highest risk|high cost|premium cost|costly|avoid|high power, high/],
  ["warn", /risk|watch|caution|enthusiast|collector only|maintenance|complex|too early|specialist|underpowered|outdated|dull|track focused/],
  ["ok", /^best|safe bet|sweet spot|ultimate|definitive|legendary|bulletproof|simple & reliable|robust|future-proof|most refined|overlooked gem/],
  ["info", /^rare|^us |limited|niche|pioneer|first bmw|^the /],
  ["thumb", /solid|strong|good|improved|smooth|torquey|budget|efficient|economy|choice|pick|performance|flagship|character|classic|collect|purist|entry|diesel|petrol|six|four|v8|v12|hybrid|value/],
];
function verdictKind(row, lead = "") {
  const type = row.verdictType;
  const title = stripTags(lead || splitLead(row.ownershipVerdict).lead || row.ownershipVerdict).toLowerCase().replace(/[\u2010-\u2011]/g, "-");
  if (type === "warning") return "warn";
  if (type === "danger") return "red";
  if (type === "success") return "ok";
  if (type === "info") return /solid|good|strong|underrated/.test(title) ? "thumb" : "info";
  return KIND_RULES.find(([, pattern]) => pattern.test(title))?.[0] || "info";
}

/* ---------- Key takeaway discs: piggy bank, coins, diamond ---------- */
const GLYPHS = {
  least: (
    <>
      <path d="M3.6 13.1c0-3.2 3-5.5 6.9-5.5h2.4c2.6 0 4.7 1.1 5.7 2.8h1.8v3.8h-1.6a5.6 5.6 0 0 1-2.2 2.6v2.6h-2.7v-1.5h-3.8v1.5H7.4v-2.3a5.1 5.1 0 0 1-3.8-4z" fill="currentColor" />
      <circle cx="16.3" cy="11.6" r="0.9" fill="var(--oe-glyph-cut)" />
      <circle cx="12" cy="4.6" r="2.6" fill="currentColor" />
      <path d="M12 3.4v2.4" stroke="var(--oe-glyph-cut)" strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  most: (
    <>
      <path d="M3 9.6c0-1 2-1.8 4.6-1.8s4.6.8 4.6 1.8v8.6c0 1-2 1.8-4.6 1.8S3 19.2 3 18.2z" fill="currentColor" />
      <path d="M3 12.4c0 1 2 1.8 4.6 1.8s4.6-.8 4.6-1.8M3 15.3c0 1 2 1.8 4.6 1.8s4.6-.8 4.6-1.8M3 9.6c0 1 2 1.8 4.6 1.8s4.6-.8 4.6-1.8" fill="none" stroke="var(--oe-glyph-cut)" strokeWidth="1" />
      <circle cx="16.6" cy="16.4" r="4.4" fill="currentColor" />
      <path d="M17.7 14.6c-.3-.4-.8-.6-1.3-.6-.8 0-1.4.5-1.4 1.1 0 1.4 2.9.9 2.9 2.4 0 .6-.6 1.1-1.5 1.1-.6 0-1.1-.2-1.4-.7M16.5 13.2v.8M16.5 18.6v.8" fill="none" stroke="var(--oe-glyph-cut)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M17.6 9.8V2.8M14.9 5.4l2.7-2.7 2.7 2.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  value: (
    <>
      <path d="M6.4 4.3h11.2l3.9 5.1L12 20.6 2.5 9.4z" fill="currentColor" />
      <path d="M2.7 9.4h18.6M8.9 4.4 12 9.4l3.1-5M12 20.4 8.4 9.5M12 20.4l3.6-10.9" fill="none" stroke="var(--oe-glyph-cut)" strokeWidth="1" strokeLinejoin="round" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5.5M12 7.8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
};

// "Which E90 Costs Least To Own?" -> least / most / value (piggy bank / coins / diamond; green / red / blue on phones).
function takeawayKind(question = "") {
  const value = stripTags(question).toLowerCase();
  if (value.includes("least")) return "least";
  if (value.includes("most")) return "most";
  if (value.includes("value")) return "value";
  return "info";
}

function TakeawayDisc({ kind, phone, className }) {
  // Phones colour each disc by its meaning (with a lighter ring); tablets and desktops draw them all in BMW navy.
  const tone = kind === "info" ? "value" : kind;
  const fill = phone ? `color-mix(in srgb, var(--oe-${tone}) 42%, #06101b)` : "var(--oe-disc)";
  const ring = phone ? `color-mix(in srgb, var(--oe-${tone}) 85%, transparent)` : "transparent";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full text-white ${className}`} style={{ background: fill, boxShadow: `inset 0 0 0 1.5px ${ring}` }}>
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" aria-hidden="true" style={{ "--oe-glyph-cut": fill }}>
        {GLYPHS[kind]}
      </svg>
    </span>
  );
}

// Glowing ring with balance scales, as in the design's rule card.
function ScalesBadge({ className }) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center rounded-full border-[2.5px] border-[#3a8dff] bg-[radial-gradient(circle_at_50%_42%,#073a86_0%,#03204d_60%,#02142f_100%)] shadow-[0_0_26px_rgba(40,128,255,0.65),0_0_8px_rgba(110,175,255,0.85),inset_0_0_18px_rgba(40,128,255,0.5)] ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[62%] w-[62%] text-white" aria-hidden="true">
        <circle cx="12" cy="3.6" r="1.25" fill="currentColor" />
        <path d="M11.2 4.6h1.6l.5 14h-2.6z" fill="currentColor" />
        <path d="M7.6 19.2h8.8a1 1 0 0 1 1 1v.6H6.6v-.6a1 1 0 0 1 1-1z" fill="currentColor" />
        <path d="M3.4 6.6h17.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.2 6.8 2.3 12.8M5.2 6.8l2.9 6M18.8 6.8l-2.9 6M18.8 6.8l2.9 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M1.8 12.8h6.8a3.4 3.4 0 0 1-6.8 0zM15.4 12.8h6.8a3.4 3.4 0 0 1-6.8 0z" fill="currentColor" />
      </svg>
    </span>
  );
}

/* ---------- The six-column table (every width; phones compress it as the phone design does) ---------- */
// Column shares from the design (180/216/240/222/263/339 of 1460), re-balanced for Inter (a wider face than the
// design's) so its line breaks hold at 1440+: one-line "Typical Mileage" / "Common Major Failure" and
// "Thermostat/swirl flaps", two-line verdicts. Phones give each column just what its words need at 12px and the
// verdict the rest.
const COLS = [
  "w-[18%] min-[390px]:max-[480px]:w-[16.6%] min-[480px]:max-md:w-[14%] md:max-lg:w-[14%] lg:max-xl:w-[13%] xl:w-[12.28%]",
  "w-[13.4%] min-[390px]:max-[480px]:w-[13.6%] min-[480px]:max-md:w-[11%] md:max-lg:w-[12%] lg:max-xl:w-[12.5%] xl:w-[14.81%]",
  "w-[15.6%] min-[390px]:max-[480px]:w-[15.5%] min-[480px]:max-md:w-[17%] md:max-lg:w-[17%] lg:max-xl:w-[19.5%] xl:w-[19.05%]",
  "w-[16%] min-[390px]:max-[480px]:w-[15.2%] min-[480px]:max-md:w-[14%] md:max-lg:w-[14%] lg:max-xl:w-[13.7%] xl:w-[12.5%]",
  "w-[16%] min-[390px]:max-[480px]:w-[15.5%] min-[480px]:max-md:w-[15%] md:max-lg:w-[16%] lg:max-xl:w-[15.3%] xl:w-[16.37%]",
  "w-[21%] min-[390px]:max-[480px]:w-[23.6%] min-[480px]:max-md:w-[29%] md:max-lg:w-[27%] lg:max-xl:w-[26%] xl:w-[24.99%]",
];

// Chrome hyphenates lowercase words but leaves capitalised ones ("Thermostat", "Turbocharger") whole, which a
// phone-narrow cell cannot hold: soft hyphens between syllables (VC|CV, V|CV; digraphs stay together; never within
// 3 letters of an end). A word with no such break splits at a compound part instead ("Light|weight").
const VOWEL = /[aeiouy]/i;
const DIGRAPH = /^(ch|sh|th|ph|gh|ck|qu)$/i;
const COMPOUND_PARTS = ["weight", "ship", "wheel", "work", "board", "light", "line", "power"];
function syllables(word) {
  const breaks = [];
  for (let i = 3; i <= word.length - 3; i += 1) {
    const [a, b, c, d] = [word[i - 2], word[i - 1], word[i], word[i + 1]];
    const vcCv = VOWEL.test(a) && !VOWEL.test(b) && !VOWEL.test(c) && VOWEL.test(d) && !DIGRAPH.test(b + c);
    const vCv = VOWEL.test(b) && !VOWEL.test(c) && (VOWEL.test(d) || (/^(ch|sh|th|ph)$/i.test(c + d) && VOWEL.test(word[i + 2] || "")));
    if (vcCv || vCv) breaks.push(i);
  }
  if (!breaks.length) {
    const lower = word.toLowerCase();
    const at = COMPOUND_PARTS.map((part) => lower.indexOf(part, 3)).find((i) => i >= 3 && word.length - i >= 3);
    if (at !== undefined) breaks.push(at);
  }
  return breaks.reduceRight((out, i) => `${out.slice(0, i)}\u00ad${out.slice(i)}`, word);
}
function softBreaks(html = "") {
  return String(html ?? "")
    .split(/(<[^>]*>)/)
    .map((part) => (part.startsWith("<") ? part : part.replace(/\b[A-Z][a-z]{8,}\b/g, syllables).replace(/\u2011/g, "-")))
    .join("");
}

// Phones: six columns in ~360px, so long label words may break, at a syllable ("Replace-ment", "(Special-ist)");
// from 768px every label word fits its column whole and the header turns hyphenation off.
const SUFFIX = /(ment|ship|ist|age|ure|cal|mon)(\)?)$/i;
function softHyphens(text = "") {
  return String(text)
    .split(" ")
    .map((word) => (word.replace(/[^a-z]/gi, "").length >= 6 ? word.replace(SUFFIX, "\u00ad$1$2") : word))
    .join(" ");
}

// "Repair Cost (Specialist)" -> "Repair Cost" + "(Specialist)" on its own line, as in the design.
function HeaderLabel({ label }) {
  const text = softHyphens(label);
  const match = text.match(/^(.*?)\s*(\([^)]*\))\s*$/);
  if (!match) return <span>{text}</span>;
  return (
    <span>
      {match[1]} <span className="md:block">{match[2]}</span>
    </span>
  );
}

// Cell type, phone first: the phone design compresses the same table (icons over labels, prices on two lines).
// Header: icon over label (the phone design's header) up to 1440px, where the design's icon-beside-label row fits.
const TH = [
  "border-[var(--oe-col)] align-middle text-center font-semibold uppercase text-[var(--oe-text)]",
  "px-[2px] py-2 text-[12px] leading-[1.25] tracking-[-0.01em] [hyphens:manual] max-[480px]:normal-case",
  "md:max-[1440px]:px-2 md:max-[1440px]:py-3 md:max-[1440px]:leading-[1.35] md:text-[12.5px] md:tracking-normal md:[hyphens:none] lg:text-[14px] lg:tracking-[-0.01em]",
  "min-[1440px]:py-2.5 min-[1440px]:pl-[26px] min-[1440px]:pr-1.5 min-[1440px]:text-left min-[1440px]:leading-[1.55]",
].join(" ");
// Body cells; paddings in disjoint ranges so no breakpoint can override another by stylesheet order.
const PAD = "px-[2px] py-2 md:max-lg:px-2.5 md:max-lg:py-3 lg:max-xl:px-4 lg:max-xl:py-3 xl:max-[1440px]:px-5 xl:py-2.5 min-[1440px]:px-7";
const TD = `border-l border-t border-[var(--oe-col)] align-middle text-center text-[12px] leading-[1.35] text-[var(--oe-text)] max-md:[hyphens:auto] max-md:[overflow-wrap:anywhere] md:text-left md:text-[14px] md:leading-snug lg:text-[16px] xl:text-[17px] ${PAD} ${HTML}`;
const ENGINE = `border-t border-[var(--oe-col)] align-middle text-center font-semibold leading-[1.3] text-[var(--oe-code)] [overflow-wrap:anywhere] text-[12px] md:text-left md:text-[15px] md:leading-snug lg:text-[17px] xl:text-[20px] px-[2px] py-2 md:max-lg:px-2.5 md:max-lg:py-3 lg:max-xl:pl-5 lg:max-xl:pr-2 lg:max-xl:py-3 xl:max-[1440px]:pl-6 xl:max-[1440px]:pr-2 xl:py-2.5 min-[1440px]:pl-9 min-[1440px]:pr-3 ${HTML}`;

function EconomicsTable({ columns, rows }) {
  return (
    <div className="relative z-10 -mx-2 overflow-hidden rounded-[10px] border border-[var(--oe-border)] [background:var(--oe-row)] [box-shadow:var(--oe-shadow)] md:mx-0">
      <table className="w-full table-fixed border-collapse text-left">
        <colgroup>
          {COLS.map((width, index) => (
            <col key={index} className={width} />
          ))}
        </colgroup>
        <thead className="[background:var(--oe-head)]">
          <tr>
            {columns.map((label, index) => (
              <th key={label} scope="col" className={`${TH} ${index ? "border-l" : ""}`}>
                <span className={`flex flex-col items-center gap-1 md:gap-1.5 min-[1440px]:flex-row min-[1440px]:gap-2.5 ${index === 0 ? "min-[1440px]:pl-2" : ""} ${index === columns.length - 1 ? "min-[1440px]:justify-center" : ""}`}>
                  <Icon name={COLUMN_ICONS[index]} className="h-[18px] w-[18px] shrink-0 md:max-[1440px]:h-6 md:max-[1440px]:w-6 min-[1440px]:h-[27px] min-[1440px]:w-[27px]" />
                  <HeaderLabel label={label} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const verdict = splitLead(row.ownershipVerdict);
            const kind = verdictKind(row, verdict.lead);
            return (
              <tr key={`${row.engine}-${index}`} className={index % 2 ? "bg-[var(--oe-row-alt)]" : "bg-[var(--oe-row)]"}>
                <th scope="row" className={ENGINE} dangerouslySetInnerHTML={{ __html: softBreaks(breakable(row.engine)) }} />
                <td className={TD} dangerouslySetInnerHTML={{ __html: softBreaks(breakable(dash(row.typicalMileage))) }} />
                <td className={`${TD} text-left`} dangerouslySetInnerHTML={{ __html: softBreaks(breakable(dash(row.commonMajorFailure))) }} />
                <td className={TD} dangerouslySetInnerHTML={{ __html: softBreaks(breakable(dash(row.repairCostSpecialist))) }} />
                <td className={TD} dangerouslySetInnerHTML={{ __html: softBreaks(breakable(dash(row.replacementCostRecon))) }} />
                <td className="border-l border-t border-[var(--oe-col)] py-2 pl-1.5 pr-1 align-middle md:max-lg:px-2.5 md:max-lg:py-3 lg:max-xl:px-4 lg:max-xl:py-3 xl:py-2.5 xl:pl-6 xl:pr-5">
                  {/* Phones: the badge floats beside the verdict's title (on the narrowest, above it, so the title keeps the
                      column's full width) and the words run on under it; tablets and desktops set it beside the verdict */}
                  <span className="block md:flex md:items-center md:gap-3 xl:gap-4">
                    <VerdictIcon kind={kind} className="mb-0.5 block h-4 w-4 shrink-0 min-[390px]:float-left min-[390px]:mb-0 min-[390px]:mr-1 min-[390px]:mt-px md:float-none md:mr-0 md:mt-0 md:h-6 md:w-6 xl:h-[27px] xl:w-[27px]" />
                    <span className={`block text-[12px] leading-[1.35] text-[var(--oe-muted)] [hyphens:auto] max-md:[overflow-wrap:anywhere] md:min-w-0 md:text-[13.5px] md:leading-snug md:[hyphens:manual] lg:text-[14.5px] xl:text-[15.5px] xl:leading-[1.3] ${HTML}`}>
                      {verdict.lead ? (
                        <>
                          <strong
                            className="block font-semibold text-[var(--verdict)] [hyphens:manual] md:inline md:text-[var(--oe-text)]"
                            style={{ "--verdict": `var(--oe-${kind}-text)` }}
                            dangerouslySetInnerHTML={{ __html: softBreaks(verdict.lead) }}
                          />{" "}
                          — <span dangerouslySetInnerHTML={{ __html: softBreaks(verdict.rest) }} />
                        </>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: softBreaks(verdict.rest) }} />
                      )}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// "…a repair decision, not a financial one. Value the car first." -> the closing "Value the car first…" line is the
// rule's highlight, as in the design (the E90 data names it; the other pages end their rule with it).
function ruleParts(rule) {
  const text = keepRanges(dash(rule.text));
  if (rule.highlight) return { text, highlight: rule.highlight };
  const match = text.match(/^(.*[.!?])\s+(Value the car first[^.!?]{0,30}[.!?])$/);
  return match ? { text: match[1], highlight: match[2] } : { text, highlight: "" };
}

function RuleCard({ rule, wide }) {
  const { text, highlight } = ruleParts(rule);
  return (
    <div className="flex items-center gap-4 rounded-[12px] border border-[var(--oe-rule-border)] p-4 [background:var(--oe-rule-bg)] [box-shadow:var(--oe-rule-glow)] md:gap-7 md:p-6 lg:gap-8 lg:px-8 lg:py-7 xl:gap-[34px] xl:py-8 xl:pl-[34px] xl:pr-8">
      <ScalesBadge className="h-[60px] w-[60px] self-start max-md:mt-1 md:h-24 md:w-24 md:self-center xl:h-[120px] xl:w-[120px]" />
      {/* a card on its own (no takeaways) keeps the copy to a readable measure */}
      <div className={`min-w-0 ${wide ? "lg:max-w-[880px]" : ""}`}>
        <p className={`text-[13px] font-semibold uppercase tracking-[0.02em] text-[var(--oe-blue)] md:font-medium lg:text-[15px] xl:text-[16px] ${HTML}`} dangerouslySetInnerHTML={{ __html: rule.title }} />
        <p className={`mt-1.5 text-[14px] leading-[1.55] text-[var(--oe-text)] md:text-[15.5px] lg:text-[16.5px] xl:mt-2 xl:text-[17px] xl:leading-[1.6] ${HTML}`} dangerouslySetInnerHTML={{ __html: text }} />
        {highlight ? (
          <p className={`mt-2 text-[17px] font-semibold leading-tight text-[var(--oe-blue)] md:text-[19px] xl:mt-4 xl:text-[22px] ${HTML}`} dangerouslySetInnerHTML={{ __html: highlight }} />
        ) : null}
      </div>
    </div>
  );
}

function Takeaways({ items }) {
  return (
    <div className="rounded-[12px] border border-[var(--oe-take-border)] p-3 [background:var(--oe-take-bg)] md:px-6 md:py-5 xl:px-7 xl:pb-1.5 xl:pt-3">
      <p className="px-1 text-[13px] font-semibold uppercase tracking-[0.02em] text-[var(--oe-blue)] md:px-0 md:font-medium lg:text-[15px] xl:text-[16px]">{UI.keyTakeaways || "Key Takeaways"}</p>
      <ul className="mt-2.5 flex flex-col gap-2 md:mt-2 md:gap-0 xl:mt-1">
        {items.map((item) => {
          const kind = takeawayKind(item.question);
          const answer = splitLead(item.answer);
          return (
            <li
              key={item.question}
              className="flex items-center gap-2.5 rounded-[10px] border border-[var(--oe-take-border)] bg-[var(--oe-take-row)] px-3 py-3 md:gap-4 md:rounded-none md:border-0 md:border-t md:border-[var(--oe-line)] md:bg-transparent md:px-0 md:py-3 md:first:border-t-0 xl:gap-6 xl:py-2"
            >
              <TakeawayDisc kind={kind} phone className="h-10 w-10 md:hidden" />
              <TakeawayDisc kind={kind} className="hidden h-12 w-12 md:flex xl:h-[58px] xl:w-[58px]" />
              <span className="min-w-0 flex-1">
                <span className={`block text-[14px] font-semibold leading-snug text-[var(--oe-text)] md:text-[16px] md:text-[var(--oe-blue)] xl:text-[18px] ${HTML}`} dangerouslySetInnerHTML={{ __html: item.question }} />
                <span className={`mt-0.5 block text-[13.5px] leading-[1.45] text-[var(--oe-muted)] md:text-[15px] md:text-[var(--oe-text)] xl:text-[16px] ${HTML}`}>
                  {answer.lead ? (
                    <>
                      <span
                        className="font-medium text-[var(--lead)] md:font-normal md:text-inherit"
                        style={{ "--lead": `var(--oe-${kind === "info" ? "value" : kind}-text)` }}
                        dangerouslySetInnerHTML={{ __html: answer.lead }}
                      />{" "}
                      — <span dangerouslySetInnerHTML={{ __html: answer.rest }} />
                    </>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: answer.rest }} />
                  )}
                </span>
              </span>
              <Icon name="chevron" strokeWidth={2} className="h-5 w-4 shrink-0 text-[var(--oe-muted)] md:hidden" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function OwnershipEconomics({ data , band }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  // Band colour from the page (sections alternate plain / tinted); the design colour when none is given.
  const vars = { ...TONES[isDark ? "dark" : "light"], ...(band ? { "--oe-bg": bandColor(isDark, band) } : {}) };
  const title = splitTitle(data.h2 || UI.eyebrow || "Ownership Economics");
  // Wide desktops set the title on one line beside the car, as in the design, when it fits there
  // ("BMW 3 Series E90 — Ownership Economics"); longer ones ("BMW 2 Series Active Tourer F45 — …") keep two lines
  // and get a taller car beside them.
  const oneLine = stripTags(`${title.main} — ${title.accent}`).length <= 38;
  const columns = data.columns || [];
  const rows = (data.rows || []).filter((row) => row && row.engine);
  const takeaways = data.keyTakeaways || [];

  return (
    <section style={vars} className={`relative w-full overflow-hidden bg-[var(--oe-bg)] text-[var(--oe-text)] ${sectionFont.className}`}>
      <div className="site-container relative pb-10 pt-4 md:pb-12 md:pt-8 lg:pb-12 lg:pt-[27px]">
        <div className={`relative pb-3 md:pb-7 lg:pb-[30px] ${SCENE_VARS} ${oneLine ? "min-[1440px]:[--oe-h:272px]" : "min-[1440px]:[--oe-h:300px]"} min-[1440px]:[--oe-over:28px]`}>
          <Scene data={data} isDark={isDark} />
          <div className="relative z-10 md:max-w-[calc(100%_-_(var(--oe-car-w)*var(--oe-h)_-_var(--oe-over))_-_28px)]" style={{ "--oe-car-w": CAR_W.toFixed(4) }}>
            {/* Phones: the heading keeps to the design's measure left of the car ("BMW 3 Series E90 —" / "Ownership
                Economics"); longer titles wrap to a third line rather than run across the car */}
            <p className="flex items-center gap-2 text-[12px] font-medium uppercase leading-[1.3] tracking-[0.02em] text-[var(--oe-blue)] [text-shadow:var(--oe-halo)] md:gap-2.5 md:text-[15px] md:leading-normal md:tracking-[0.03em] md:[text-shadow:none] xl:text-[16px]">
              <span aria-hidden="true" className="h-[2px] w-5 bg-[var(--oe-blue)] md:hidden" />
              {title.accent || UI.eyebrow || "Ownership Economics"}
            </p>
            <h2 className={`mt-1 text-[clamp(18.5px,5vw,30px)] font-semibold leading-[1.13] tracking-[-0.015em] text-[var(--oe-text)] max-md:max-w-[11.6em] max-md:[text-shadow:var(--oe-halo)] md:mt-2.5 md:leading-[1.15] md:text-[34px] lg:text-[40px] xl:text-[42px] ${HTML}`}>
              <span dangerouslySetInnerHTML={{ __html: title.main }} />
              {title.accent ? (
                <>
                  {" —"}
                  <br className={oneLine ? "min-[1440px]:hidden" : ""} />
                  <span className={oneLine ? "hidden min-[1440px]:inline" : "hidden"}> </span>
                  <span dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            <span aria-hidden="true" className="mt-2.5 block h-[3px] w-14 rounded-full bg-[linear-gradient(90deg,var(--oe-blue),color-mix(in_srgb,var(--oe-blue)_70%,transparent))] md:mt-4 md:w-16 xl:mt-[22px] xl:w-[67px]" />
          </div>
        </div>

        {rows.length ? <EconomicsTable columns={columns} rows={rows} /> : null}

        {data.economicsRule || takeaways.length ? (
          <div className={`relative z-10 grid gap-3 lg:gap-4 ${data.economicsRule && takeaways.length ? "lg:grid-cols-[minmax(0,1.36fr)_minmax(0,1fr)]" : ""} ${rows.length ? "mt-4" : ""}`}>
            {data.economicsRule ? <RuleCard rule={data.economicsRule} wide={!takeaways.length} /> : null}
            {takeaways.length ? <Takeaways items={takeaways} /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
