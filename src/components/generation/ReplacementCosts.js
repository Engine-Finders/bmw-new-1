"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import { engineImageFor } from "@/components/shared/carImage";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import ui from "@/data/shared/generationPageUi.json";

const UI = ui.replacementCosts || {};

// Colours sampled from the designs (dark); light is the same design in daylight colours.
const TONES = {
  light: {
    "--rc-bg": "#f6f8fb",
    "--rc-text": "#0b1726",
    "--rc-muted": "#46536a",
    "--rc-blue": "#0a5ad2",
    "--rc-rule": "#0a5ad2",
    "--rc-rule-2": "#a9c4f0",
    "--rc-head": "linear-gradient(180deg,#edf3fc 0%,#e2ebf8 100%)",
    "--rc-head-text": "#0b1726",
    "--rc-head-icon": "#0a5ad2",
    "--rc-row": "#ffffff",
    "--rc-row-alt": "#f6f9fd",
    "--rc-line": "#e3e9f1",
    "--rc-col": "#e3e9f1",
    "--rc-border": "#d6dfeb",
    "--rc-code": "#0a5ad2",
    "--rc-petrol": "#0a5ad2",
    "--rc-turbo": "#d62828",
    "--rc-diesel": "#1d8a3f",
    "--rc-hybrid": "#0f7f8c",
    "--rc-electric": "#6d4fd8",
    "--rc-label": "#26344a",
    "--rc-card": "#ffffff",
    "--rc-trust-bg": "linear-gradient(180deg,#ffffff 0%,#f6f9fe 100%)",
    "--rc-trust-border": "#d6dfeb",
    "--rc-icon": "#0a5ad2",
    "--rc-icon-glow": "none",
    "--rc-shadow": "0 12px 32px rgba(10,26,43,0.07)",
  },
  dark: {
    "--rc-bg": "#000b17",
    "--rc-text": "#ffffff",
    "--rc-muted": "rgba(255,255,255,0.9)",
    "--rc-blue": "#3d97e3",
    "--rc-rule": "#3995db",
    "--rc-rule-2": "#05264d",
    "--rc-head": "linear-gradient(180deg,#022b5f 0%,#022047 100%)",
    "--rc-head-text": "#ffffff",
    "--rc-head-icon": "#ffffff",
    "--rc-row": "#04121d",
    "--rc-row-alt": "#0f1923",
    "--rc-line": "#202c35",
    "--rc-col": "#2b333b",
    "--rc-border": "#3c454e",
    "--rc-code": "#4f9ff0",
    "--rc-petrol": "#4f9ff0",
    "--rc-turbo": "#f0504a",
    "--rc-diesel": "#5cc66b",
    "--rc-hybrid": "#3fc6d4",
    "--rc-electric": "#a58bff",
    "--rc-label": "rgba(255,255,255,0.92)",
    "--rc-card": "#03101c",
    "--rc-trust-bg": "linear-gradient(180deg,#00132d 0%,#010c1b 100%)",
    "--rc-trust-border": "#3a4354",
    "--rc-icon": "#5d9aea",
    "--rc-icon-glow": "drop-shadow(0 0 9px rgba(61,151,227,0.5))",
    "--rc-shadow": "none",
  },
};

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";
const plain = (value = "") => String(value ?? "").replace(/<[^>]*>/g, "");
const dash = (value = "") => String(value ?? "").replace(/\s+-\s*(?=\S)/g, " — ");
const pct = (value) => `${(value * 100).toFixed(3)}%`;
// The legacy -webkit- composite first: Chrome aliases it to mask-composite, so whichever comes last wins.
const fade = (...layers) => ({ WebkitMaskImage: layers.join(","), maskImage: layers.join(","), WebkitMaskComposite: "source-in", maskComposite: "intersect" });
// Chrome still draws a faint 1px line at a masked plate's left edge, where its mask is clear: trim that edge off.
const TRIM_LEFT = { clipPath: "inset(0 0 0 4px)" };

// "E90 Engine Replacement Costs — By Engine and Condition" -> main + accent.
function splitTitle(value = "") {
  const match = String(value ?? "").match(/^(.*?)\s+[-—–]\s+(.*)$/);
  return match ? { main: match[1], accent: match[2] } : { main: String(value ?? ""), accent: "" };
}

// "316i–318i (N46)" -> "316i–318i" + "(N46)"; on desktop a year range stays on the variant's line ("335i (2006–2010)").
// Slashed lists ("116d/118d/120d") may break after each slash in narrow cells.
function splitVariant(value = "") {
  const text = dash(value).replace(/\/(?=\S)/g, "/​");
  const match = text.match(/^(.*?)\s*(\([^)]*\))\s*$/);
  if (!match || !match[1]) return { main: text, paren: "", years: false };
  return { main: match[1], paren: match[2], years: /^\(\d{4}/.test(match[2]) };
}

// A few rows in the data have every cell moved one column to the right (variant last, a price in the engine-code
// cell); they are read back into place.
function normaliseRow(row) {
  const isPrice = (value) => /^\s*£/.test(plain(value));
  const isHours = (value) => /\bhrs?\b/i.test(plain(value));
  if (isPrice(row.engineCode) && isHours(row.rebuiltSupply) && !isHours(row.labourHours) && !isPrice(row.labourHours)) {
    return { ...row, variant: row.labourHours, engineCode: row.variant, usedSupply: row.engineCode, reconditionedSupply: row.usedSupply, rebuiltSupply: row.reconditionedSupply, labourHours: row.rebuiltSupply };
  }
  return row;
}

// The row's own fuelType, else BMW's engine code (D = diesel; PHEV / eMotor = plug-in hybrid), else the variant name.
const DIESEL_CODE = /\b(?:[A-Z]\d{2}D\d{2}|M47|M57|M67|N47|N57|B37|B47|B57)/;
function fuelOf(row) {
  const given = String(row.fuelType || "").toLowerCase();
  if (given) return /diesel/.test(given) ? "diesel" : /electric|\bev\b/.test(given) ? "electric" : /hybrid|phev/.test(given) ? "hybrid" : "petrol";
  const code = plain(row.engineCode).toUpperCase();
  const variant = plain(row.variant).trim();
  if (/^i[x\d]/i.test(variant) || (/ELECTRIC|EDRIVE/.test(code) && !/[BNS]\d{2}/.test(code))) return "electric";
  if (
    /PHEV|HYBRID|ELECTRIC|E-?MOTOR/.test(code) ||
    /\bphev\b|^active\s?hybrid/i.test(variant) ||
    (/\b(?:m?\d{2,3}x?e|[xs]drive\d{2}e)\b/i.test(variant) && /^(?:B3|B4|B5|N2|N6)/.test(code))
  )
    return "hybrid";
  if (DIESEL_CODE.test(code) || /\b(?:\d{3}|[xs]drive\d{2}|m\d{2})(?:d|td|tds|sd)\b|\b\d\.\d\s?s?d\b|diesel/i.test(variant)) return "diesel";
  return "petrol";
}

// Phone design: engine codes coloured by fuel, and the big turbocharged petrols (six cylinders and up: N54/N55, B58,
// S55/S58, N63/S63, ...) in red, as the 335i's N54/N55 are in the design.
const TURBO_SIX = /^(?:N54|N55|N63|N74|B58|S55|S58|S63|S68|M102|M106)/;
function codeColour(row, fuel) {
  if (fuel !== "petrol") return `var(--rc-${fuel})`;
  return TURBO_SIX.test(plain(row.engineCode).trim().toUpperCase()) ? "var(--rc-turbo)" : "var(--rc-petrol)";
}

const FUEL_GROUPS = [
  { key: "petrol", icon: "tag", colour: "var(--rc-petrol)", tab: "linear-gradient(90deg,#0b3f9b 0%,#1458c7 100%)", border: "rgba(47,128,237,0.6)", fill: "rgba(36,110,220,0.09)" },
  { key: "diesel", icon: "pump", colour: "var(--rc-diesel)", tab: "linear-gradient(90deg,#0f5019 0%,#1d7a2c 100%)", border: "rgba(84,184,92,0.55)", fill: "rgba(70,170,80,0.08)" },
  { key: "hybrid", icon: "bolt", colour: "var(--rc-hybrid)", tab: "linear-gradient(90deg,#0a525d 0%,#13808d 100%)", border: "rgba(63,198,212,0.55)", fill: "rgba(63,198,212,0.08)" },
  { key: "electric", icon: "plug", colour: "var(--rc-electric)", tab: "linear-gradient(90deg,#3a2a8e 0%,#5a43c7 100%)", border: "rgba(165,139,255,0.55)", fill: "rgba(165,139,255,0.08)" },
];

// Phone tables show at most `max` engines side by side; longer groups split into even blocks (7 -> 4 + 3, 9 -> 3 + 3 + 3).
function blocks(list, max = 4) {
  const count = Math.ceil(list.length / max);
  const base = Math.floor(list.length / count);
  const extra = list.length % count;
  const out = [];
  let start = 0;
  for (let index = 0; index < count; index += 1) {
    const size = base + (index < extra ? 1 : 0);
    out.push(list.slice(start, start + size));
    start += size;
  }
  return out;
}

// Rough widths (px) of the longest piece of a cell that cannot wrap, from Inter's advance widths: engine codes at
// 12.5px semibold (they may break after a slash), prices at 14px (they may break after the dash or a space).
const codeWidth = (text) => [...text].reduce((sum, ch) => sum + (/[A-Z]/.test(ch) ? 8.8 : /\d/.test(ch) ? 7.6 : /[a-z]/.test(ch) ? 7 : /[/()]/.test(ch) ? 4.5 : 6), 0);
const valueWidth = (text) =>
  [...text].reduce((sum, ch) => sum + (ch === "1" ? 5.6 : /\d/.test(ch) ? 8 : ch === "£" ? 8.4 : /[,.]/.test(ch) ? 3.4 : ch === "–" ? 9.5 : ch === "—" ? 14 : /[a-z]/.test(ch) ? 7.2 : /[A-Z]/.test(ch) ? 9 : 7), 0);
function widestPieces(rows) {
  let code = 0;
  let value = 0;
  for (const row of rows) {
    for (const piece of plain(row.engineCode).split(/(?<=\/)|\s+/)) code = Math.max(code, codeWidth(piece));
    for (const key of PRICE_FIELDS) for (const piece of dash(plain(row[key])).split(/(?<=[–—-])|\s+/)) value = Math.max(value, valueWidth(piece));
  }
  return { code, value };
}

/* ---------- Icons (24px grid) ---------- */
const PATHS = {
  car: (
    <>
      <path d="M4.6 11.4 6.4 7A2 2 0 0 1 8.25 5.8h7.5A2 2 0 0 1 17.6 7l1.8 4.4" />
      <path d="M3.5 13a1.6 1.6 0 0 1 1.6-1.6h13.8A1.6 1.6 0 0 1 20.5 13v3.6a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
      <path d="M5.6 17.6v1.6M18.4 17.6v1.6M6.3 14.5h2.2M15.5 14.5h2.2M10 15.5h4" />
    </>
  ),
  engine: (
    <>
      <path d="M8.5 5h6M11.5 5v2.6" />
      <path d="M6.2 7.6h10.6l2 2.2h1.4V8.4h2.3v8.2h-2.3v-1.4h-1.6L16 18.6H9.6l-2.4-2.4H5.3v-2.3H3V10.4h2.3V8.5z" />
      <circle cx="12" cy="12.8" r="2.1" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1a1 1 0 0 1 .7.3l7.2 7.2a1 1 0 0 1 0 1.4l-8.1 8.1a1 1 0 0 1-1.4 0l-7.2-7.2a1 1 0 0 1-.3-.7z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  refresh: (
    <>
      <path d="M19.4 10.4A7.5 7.5 0 0 0 6 6.8L4.6 8.4" />
      <path d="M4.6 4.4v4h4" />
      <path d="M4.6 13.6A7.5 7.5 0 0 0 18 17.2l1.4-1.6" />
      <path d="M19.4 19.6v-4h-4" />
    </>
  ),
  // Shield with a quartered (roundel-like) face, as the design's "Rebuilt" and "Quality Assured" icons.
  shield: (
    <>
      <path d="M12 2.8 4.8 5.6v6c0 4.4 3 8 7.2 9.6 4.2-1.6 7.2-5.2 7.2-9.6v-6z" />
      <path d="M12 5.7 7.3 7.5V12H12zM12 12h4.7c-.3 2.8-2.1 5.2-4.7 6.5z" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  pump: (
    <>
      <path d="M4.5 20.5V5A1.5 1.5 0 0 1 6 3.5h6.5A1.5 1.5 0 0 1 14 5v15.5" />
      <path d="M3 20.5h12.5M7 7h4.5v3.5H7z" />
      <path d="M14 9.5h1.8a1.5 1.5 0 0 1 1.5 1.5v5a1.3 1.3 0 0 0 2.6 0V8.4a2 2 0 0 0-.6-1.4l-2-2" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 14H11l-1 7.5L18.5 10H12z" />,
  plug: (
    <>
      <path d="M8.5 3.5v4M15.5 3.5v4M6 7.5h12v3a6 6 0 0 1-12 0z" />
      <path d="M12 16.5v4" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9.3" r="6.3" />
      <path d="m8.3 14.3-1.5 7 5.2-2.6 5.2 2.6-1.5-7" />
      <path d="M10.6 12.2V6.6h1.9c.9 0 1.5.6 1.5 1.4s-.6 1.3-1.5 1.3h-1.9m0 0h2.1c1 0 1.6.6 1.6 1.45s-.6 1.45-1.6 1.45h-2.1" />
    </>
  ),
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  truck: (
    <>
      <path d="M6 6.5h8.5v9.6H6M14.5 9.6h3.6l2.9 3.2v3.3h-6.5" />
      <circle cx="8.6" cy="17.4" r="1.7" />
      <circle cx="17.6" cy="17.4" r="1.7" />
      <path d="M1.6 9.6h3M1 12.1h3.6M2.2 14.6h2.4" />
      <path d="M8.6 9.4h3.2l-1.3 2.4h2" />
    </>
  ),
};

function Icon({ name, className, strokeWidth = 1.7, style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {PATHS[name] || PATHS.shield}
    </svg>
  );
}

// Variant, Engine Code, Used, Reconditioned, Rebuilt, Labour Hours
const COLUMN_ICONS = ["car", "engine", "tag", "refresh", "shield", "clock"];
const PRICE_FIELDS = ["usedSupply", "reconditionedSupply", "rebuiltSupply", "labourHours"];

/* ---------- Header scene ----------
   The garage of the E90 artwork, this generation's car from behind at three-quarters standing where the E90 stands in
   it, and this generation's engine beside it (desktop) or in front of it (phones), as in the designs. The E90 page
   shows its own artwork in the dark theme; every other page, and the light theme, stands its car in the car-free
   garage plates made from that artwork. Plates and artwork share one framing (x 1200–4320 of the 4320×992 artwork),
   so the car box below is the E90's own box in it. */
const PLATE = {
  ratio: 3120 / 992,
  dark: "/generation/replacement/garage-dark.webp",
  light: "/generation/replacement/garage-light.webp",
  car: { left: (2561 - 1200) / 3120, width: 1718 / 3120, top: 71 / 992 },
};
const CAR_ASPECT = 2; // the E90's box in the plate: 1718 wide, 859 from its roof to the floor under its nearest tyre

// Visible extents of each engine cut-out: [width, height, top, bottom, left, right] (fractions of the file).
const ENGINE_FIT = {
  "/e90/engine.webp": [533, 469, 0.019, 0.026, 0.092, 0.079],
  "/engines/b37d15.webp": [540, 540, 0.057, 0.059, 0.019, 0.019],
  "/engines/b38a15a.webp": [540, 540, 0.067, 0.067, 0.02, 0.019],
  "/engines/b38b15m0.webp": [540, 540, 0.078, 0.08, 0.02, 0.02],
  "/engines/b47c20.webp": [540, 540, 0.124, 0.124, 0.019, 0.019],
  "/engines/b47d20d.webp": [540, 540, 0.044, 0.046, 0.019, 0.02],
  "/engines/b47tu2.webp": [540, 540, 0.037, 0.041, 0.017, 0.02],
  "/engines/b48a20.webp": [540, 540, 0.019, 0.019, 0.039, 0.039],
  "/engines/b48b20b.webp": [540, 540, 0.02, 0.02, 0.033, 0.033],
  "/engines/b48d20.webp": [540, 540, 0.019, 0.02, 0.044, 0.05],
  "/engines/b57d30-a-b.webp": [540, 540, 0.043, 0.043, 0.019, 0.019],
  "/engines/b57d30c.webp": [540, 540, 0.115, 0.115, 0.019, 0.02],
  "/engines/b58b30.webp": [540, 540, 0.1, 0.102, 0.019, 0.02],
  "/engines/b58b30o0.webp": [540, 540, 0.02, 0.02, 0.031, 0.031],
  "/engines/b58d30.webp": [540, 540, 0.028, 0.03, 0.019, 0.02],
  "/engines/n13b16a.webp": [540, 540, 0.019, 0.019, 0.044, 0.046],
  "/engines/n20b20.webp": [540, 540, 0.019, 0.019, 0.089, 0.089],
  "/engines/n47d16.webp": [540, 540, 0.065, 0.063, 0.019, 0.019],
  "/engines/n47d20c.webp": [540, 540, 0.122, 0.122, 0.019, 0.019],
  "/engines/n55b30.webp": [540, 540, 0.052, 0.052, 0.019, 0.019],
  "/engines/n57d30a.webp": [540, 540, 0.05, 0.052, 0.019, 0.019],
  "/engines/n57d30t0.webp": [540, 540, 0.019, 0.019, 0.028, 0.03],
  "/engines/s55b30a.webp": [540, 540, 0.02, 0.019, 0.056, 0.056],
  "/engines/s58b30t.webp": [540, 540, 0.072, 0.072, 0.019, 0.02],
  "/engines/s58tu2.webp": [540, 540, 0.067, 0.065, 0.019, 0.019],
  "/engines/s63b44a.webp": [540, 540, 0.081, 0.083, 0.02, 0.022],
  "/engines/s63b44t0.webp": [540, 540, 0.057, 0.057, 0.019, 0.022],
  "/engines/s63b44t2.webp": [540, 540, 0.141, 0.141, 0.019, 0.022],
  "/engines/s63b44t3.webp": [540, 540, 0.081, 0.08, 0.02, 0.019],
  "/engines/s63b44t4.webp": [540, 540, 0.061, 0.061, 0.019, 0.019],
  "/engines/s68b44.webp": [540, 540, 0.143, 0.143, 0.019, 0.019],
};

// This generation's engine: the page's own artwork, else the first engine in its table with a photo (the E90
// artwork's engine is an M57D30, so M57 generations show it).
function engineFor(rows, art) {
  if (art?.engine) return art.engine;
  for (const row of rows) {
    const code = plain(row.engineCode);
    const image = engineImageFor(code) || (/\bM57/i.test(code) ? "/e90/engine.webp" : null);
    if (image) return image;
  }
  return null;
}

// The plate placed so its E90 box coincides with the car box (left / width / top as CSS lengths).
function plateBox(left, width, top) {
  const w = `(${width}) / ${PLATE.car.width.toFixed(5)}`;
  return {
    left: `calc(${left} - ${w} * ${PLATE.car.left.toFixed(5)})`,
    top: `calc(${top} - ${w} / ${PLATE.ratio.toFixed(5)} * ${PLATE.car.top.toFixed(5)})`,
    width: `calc(${w})`,
    aspectRatio: `${PLATE.ratio.toFixed(5)}`,
  };
}

// A cut-out standing in its box (the E90's proportions): the visible car spans the box width, or its height for a
// taller car, centred, its lowest tyre on the box's bottom edge, with a contact shadow and a faint wet-floor reflection.
function StandingCar({ src, fit, isDark, style, sizes }) {
  const f = fit || { width: 860, height: 500, top: 0.1, bottom: 0.12, left: 0.06, right: 0.06 };
  const visW = 1 - f.left - f.right;
  const visH = 1 - f.top - f.bottom;
  const fileAspect = f.width / f.height;
  // the file's width as a fraction of the box width: the visible car fills the width unless that makes it too tall
  const imgW = Math.min(1 / visW, fileAspect / CAR_ASPECT / visH);
  const imgH = (imgW * CAR_ASPECT) / fileAspect; // the file's height as a fraction of the box height
  const carW = visW * imgW;
  const left = 0.5 - (f.left + visW / 2) * imgW;
  const REFL = 0.4; // reflection strip height, as a fraction of the box height
  return (
    <div className="absolute" style={style}>
      <div className={`absolute bottom-[-5%] h-[16%] rounded-[50%] blur-xl ${isDark ? "bg-black/80" : "bg-[#0b1726]/30"}`} style={{ left: pct(0.5 - carW / 2 + 0.05), right: pct(0.5 - carW / 2 + 0.05) }} />
      <div className={`absolute bottom-[-1.2%] h-[4.5%] rounded-[50%] blur-[3px] ${isDark ? "bg-black/90" : "bg-[#0b1726]/45"}`} style={{ left: pct(0.5 - carW / 2 + 0.09), right: pct(0.5 - carW / 2 + 0.09) }} />
      {/* Wet-floor reflection: the car flipped under its tyres, fading out quickly */}
      <div className={`absolute inset-x-0 top-full overflow-hidden ${isDark ? "opacity-30" : "opacity-[0.18]"}`} style={{ height: pct(REFL), ...fade("linear-gradient(180deg,#000 0%,transparent 75%)") }}>
        <div className="absolute -scale-y-100" style={{ left: pct(left), width: pct(imgW), height: pct(imgH / REFL), top: pct(-(f.bottom * imgH) / REFL) }}>
          <Image src={src} alt="" fill sizes={sizes} className={`object-fill blur-[1px] ${isDark ? "brightness-[0.55]" : ""}`} />
        </div>
      </div>
      <div className="absolute" style={{ left: pct(left), width: pct(imgW), height: pct(imgH), top: pct(1 - (1 - f.bottom) * imgH) }}>
        <Image src={src} alt="" fill sizes={sizes} className={`object-fill ${isDark ? "brightness-[0.8] contrast-[1.06] saturate-[0.9]" : ""}`} />
      </div>
    </div>
  );
}

// An engine cut-out standing in its box: the visible engine as wide as the box allows (or as tall), on its bottom edge,
// against the box's left edge or centred.
function StandingEngine({ src, isDark, style, sizes, align = "center" }) {
  const [w, h, top, bottom, left, right] = ENGINE_FIT[src] || [540, 540, 0.05, 0.05, 0.02, 0.02];
  const visAspect = ((1 - left - right) * w) / ((1 - top - bottom) * h);
  const visible = `min(100cqw, 100cqh * ${visAspect.toFixed(4)})`;
  const x = align === "left" ? `calc(${visible} * ${(-left / (1 - left - right)).toFixed(4)})` : `calc(50cqw - ${visible} * ${((left + (1 - left - right) / 2) / (1 - left - right)).toFixed(4)})`;
  return (
    <div className="absolute [container-type:size]" style={style}>
      <div className="absolute bottom-0" style={{ left: x, width: `calc(${visible} / ${(1 - left - right).toFixed(4)})`, aspectRatio: `${w} / ${h}`, transform: `translateY(${(bottom * 100).toFixed(2)}%)` }}>
        <div className={`absolute bottom-[3%] left-[14%] right-[14%] h-[10%] rounded-[50%] blur-lg ${isDark ? "bg-black/85" : "bg-[#0b1726]/25"}`} />
        <Image src={src} alt="" fill sizes={sizes} className={`object-contain ${isDark ? "brightness-[0.84] drop-shadow-[0_16px_24px_rgba(0,0,0,0.6)]" : "drop-shadow-[0_14px_22px_rgba(10,26,43,0.22)]"}`} />
      </div>
    </div>
  );
}

function HeaderScene({ data, engineSrc, isDark }) {
  const art = isDark ? data.art?.dark : null;
  const car = art ? null : data.image;
  const hasCar = Boolean(art || car);
  // No photo of this generation and none of its engines: the garage alone, framed as it is around a car.
  const garage = art || PLATE[isDark ? "dark" : "light"];

  /* Desktop: in units of --h, the scene's height. The car box is 1.745h wide; its left edge (--car-l) sits right of the
     heading, or as far right as the engine beside it allows, whichever is further right. */
  // With no engine photo the car moves into the middle of the car + engine space.
  const d = { left: engineSrc ? "var(--car-l)" : "calc(var(--car-l) + var(--h) * 0.5)", width: "calc(var(--h) * 1.745)", top: "calc(var(--h) * 0.062)" };
  // In plate coordinates the car's left edge is 1.382h in: fade in from 0.42h before it; fade out at the bottom and right.
  const dMask = fade(
    "linear-gradient(90deg,transparent calc(var(--h) * 0.96),#000 calc(var(--h) * 1.52))",
    "linear-gradient(180deg,#000 72%,transparent 99%)",
    "linear-gradient(270deg,transparent 0,#000 calc(var(--h) * 0.2))"
  );
  const dCar = { left: d.left, top: d.top, width: d.width, height: `calc(${d.width} / ${CAR_ASPECT})` };
  const dEngine = hasCar
    ? { left: "calc(var(--car-l) + var(--h) * 1.757)", top: "calc(var(--h) * 0.005)", width: "calc(var(--h) * 1.06)", height: "calc(var(--h) * 0.985)" }
    : { left: "calc(var(--car-l) + var(--h) * 0.22)", top: "calc(var(--h) * 0.03)", width: "calc(var(--h) * 1.3)", height: "calc(var(--h) * 0.92)" };

  /* Phones and tablets: the car (--c wide) top-right, the engine in front of its lower part, right of the heading. */
  const m = { left: "calc(100cqw - var(--c) - var(--cr))", width: "var(--c)", top: engineSrc ? "var(--ct)" : "calc(var(--ct) + var(--c) * 0.3)" };
  const carIn = PLATE.car.left / PLATE.car.width; // the plate's width before the car, in car widths
  const mMask = fade(
    `linear-gradient(90deg,transparent calc(var(--c) * ${(carIn - 0.12).toFixed(3)}),#000 calc(var(--c) * ${(carIn + 0.1).toFixed(3)}))`,
    "linear-gradient(180deg,transparent 0,#000 8%,#000 60%,transparent 97%)",
    "linear-gradient(270deg,transparent 0,#000 5%)"
  );
  const mCar = { left: m.left, top: m.top, width: m.width, height: `calc(var(--c) / ${CAR_ASPECT})` };
  const mEngine = hasCar
    ? { left: "calc(100cqw - var(--cr) - var(--c) * 0.92)", top: "calc(var(--ct) + var(--c) * var(--et))", width: "calc(var(--c) * 0.86)", height: "calc(var(--c) * var(--eh))" }
    : { left: "calc(100cqw - var(--cr) - var(--c) * 0.96)", top: "var(--ct)", width: "calc(var(--c) * 0.94)", height: "calc(var(--c) * 0.86)" };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 hidden h-[var(--h)] lg:block">
        <div className="absolute" style={{ ...plateBox(d.left, d.width, d.top), ...dMask, ...TRIM_LEFT }}>
          <Image src={garage} alt="" fill sizes="900px" className="object-cover" />
        </div>
        {car ? <StandingCar src={car} fit={data.imageFit} isDark={isDark} style={dCar} sizes="480px" /> : null}
        {engineSrc ? <StandingEngine src={engineSrc} isDark={isDark} style={dEngine} align={hasCar ? "left" : "center"} sizes="360px" /> : null}
      </div>
      <div className="absolute inset-x-0 top-0 h-[calc(var(--ct)_+_var(--c)*1.2)] lg:hidden">
        <div className="absolute" style={{ ...plateBox(m.left, m.width, m.top), ...mMask, ...TRIM_LEFT }}>
          <Image src={garage} alt="" fill sizes="(min-width: 640px) 70vw, 85vw" className="object-cover" />
        </div>
        {car ? <StandingCar src={car} fit={data.imageFit} isDark={isDark} style={mCar} sizes="(min-width: 640px) 40vw, 46vw" /> : null}
        {engineSrc ? <StandingEngine src={engineSrc} isDark={isDark} style={mEngine} sizes="(min-width: 640px) 36vw, 40vw" /> : null}
      </div>
    </div>
  );
}

/* ---------- Desktop: one table, every engine ---------- */
const TABLE_COLS = "grid-cols-[minmax(0,215fr)_minmax(0,200fr)_minmax(0,195fr)_minmax(0,290fr)_minmax(0,222fr)_minmax(0,205fr)]";

function Table({ columns, rows }) {
  return (
    <div className="relative hidden overflow-hidden rounded-[12px] border border-[var(--rc-border)] bg-[var(--rc-row)] [box-shadow:var(--rc-shadow)] lg:block" role="table">
      <div className={`grid ${TABLE_COLS}`} style={{ background: "var(--rc-head)" }} role="row">
        {columns.map((label, index) => (
          <span
            key={label}
            role="columnheader"
            className={`flex min-h-[56px] min-w-0 items-center gap-2.5 px-4 py-3 text-[14px] font-semibold uppercase leading-[1.25] tracking-[0.01em] text-[var(--rc-head-text)] xl:min-h-[60px] xl:gap-3 2xl:min-h-[63px] 2xl:whitespace-nowrap 2xl:px-6 2xl:text-[15px] ${index ? "border-l border-[var(--rc-col)]" : ""}`}
          >
            <Icon name={COLUMN_ICONS[index]} className="h-[22px] w-[22px] shrink-0 text-[var(--rc-head-icon)] xl:h-6 xl:w-6 2xl:h-[26px] 2xl:w-[26px]" strokeWidth={1.6} />
            <span className="min-w-0">{label}</span>
          </span>
        ))}
      </div>
      {rows.map((row, index) => {
        const variant = splitVariant(row.variant);
        const cell = "flex min-w-0 items-center justify-center border-l border-[var(--rc-col)] px-2 py-2 text-center text-[16px] leading-snug text-[var(--rc-text)] xl:px-3 xl:text-[17px] 2xl:text-[19px]";
        return (
          <div key={`${row.engineCode}-${index}`} role="row" className={`grid min-h-[48px] ${TABLE_COLS} border-t border-[var(--rc-line)] xl:min-h-[52px] 2xl:min-h-[55px] ${index % 2 ? "bg-[var(--rc-row-alt)]" : "bg-[var(--rc-row)]"}`}>
            <span role="cell" className="flex min-w-0 flex-col justify-center px-4 py-2 xl:px-5 2xl:px-6 2xl:py-[9px]">
              <span className={`text-[16px] font-semibold leading-tight text-[var(--rc-text)] xl:text-[17px] 2xl:text-[19px] ${HTML}`}>
                <span dangerouslySetInnerHTML={{ __html: variant.main }} />
                {variant.paren && variant.years ? <>{" "}<span className="whitespace-nowrap font-normal">{variant.paren}</span></> : null}
              </span>
              {variant.paren && !variant.years ? <span className="mt-0.5 text-[14px] font-medium leading-tight text-[var(--rc-text)] xl:text-[15px] 2xl:text-[16px]">{variant.paren}</span> : null}
            </span>
            <span
              role="cell"
              className={`flex min-w-0 items-center border-l border-[var(--rc-col)] px-4 py-2 text-[16px] font-semibold leading-snug text-[var(--rc-code)] [overflow-wrap:anywhere] xl:px-6 xl:text-[17px] 2xl:px-8 2xl:text-[19px] ${HTML}`}
              dangerouslySetInnerHTML={{ __html: dash(row.engineCode) }}
            />
            {PRICE_FIELDS.map((key) => (
              <span key={key} role="cell" className={`${cell} ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(row[key]) || "—" }} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Phones + tablets: the phone design's fuel groups ---------- */
// Chevron outlines across the header row: a "<" before the first engine, a ">" between engines, the first highlighted.
function Chevrons({ count, colour }) {
  const p = 11; // chevron depth, % of a cell
  const W = count * 100;
  const first = `M${p} 0H${100 - p / 2}L${100 + p / 2} 50L${100 - p / 2} 100H${p}L0 50Z`;
  const lines = [`M${p} 0L0 50L${p} 100`];
  for (let index = 1; index < count; index += 1) lines.push(`M${index * 100 - p / 2} 0L${index * 100 + p / 2} 50L${index * 100 - p / 2} 100`);
  return (
    <svg viewBox={`0 0 ${W} 100`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d={first} fill={colour} fillOpacity="0.1" stroke="none" />
      {lines.map((line) => (
        <path key={line} d={line} fill="none" stroke={colour} strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

function GroupBlock({ group, rows, labels, first }) {
  const count = rows.length;
  const dense = count >= 4; // phones: the label icons go above the labels so four engines fit
  const cols = { gridTemplateColumns: `var(--lab) repeat(${count}, minmax(0,1fr))` };
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] border ${first ? "rounded-tl-none" : ""}`}
      style={{ borderColor: group.border, background: `linear-gradient(180deg, ${group.fill} 0%, transparent 65%), var(--rc-card)`, "--lab": dense ? "var(--lab4)" : "var(--lab3)" }}
    >
      <div className="grid" style={cols}>
        <span aria-hidden="true" />
        <div className="relative grid" style={{ gridColumn: "2 / -1", gridTemplateColumns: `repeat(${count}, minmax(0,1fr))` }}>
          <Chevrons count={count} colour={group.colour} />
          {rows.map((row, index) => {
            const variant = splitVariant(row.variant);
            return (
              <div key={`${row.engineCode}-${index}`} className="relative flex min-w-0 flex-col items-center justify-center px-[4%] pb-3 pt-3.5 text-center sm:px-[8%] sm:pb-[1.6cqw] sm:pt-[1.9cqw]">
                <Icon name="engine" className="h-[26px] w-[26px] shrink-0 sm:h-[clamp(28px,3.6cqw,38px)] sm:w-[clamp(28px,3.6cqw,38px)]" strokeWidth={1.5} style={{ color: group.colour }} />
                <span className={`mt-1.5 max-w-full text-[13.5px] font-semibold leading-[1.25] text-[var(--rc-text)] [hyphens:auto] [overflow-wrap:break-word] sm:mt-[0.9cqw] sm:text-[clamp(14px,1.8cqw,18.5px)] ${HTML}`} dangerouslySetInnerHTML={{ __html: variant.main }} />
                {variant.paren ? <span className="max-w-full text-[12.5px] leading-[1.25] text-[var(--rc-label)] [hyphens:auto] [overflow-wrap:break-word] sm:text-[clamp(13px,1.65cqw,17px)]">{variant.paren}</span> : null}
                <span className={`mt-1 max-w-full text-[12.5px] font-semibold leading-tight [overflow-wrap:anywhere] sm:mt-[0.5cqw] sm:text-[clamp(13.5px,1.65cqw,17px)] ${HTML}`} style={{ color: codeColour(row, group.key) }} dangerouslySetInnerHTML={{ __html: dash(row.engineCode).replace(/\/(?=\S)/g, "/\u200b") }} />
              </div>
            );
          })}
        </div>
      </div>
      {PRICE_FIELDS.map((key, fieldIndex) => (
        <div key={key} className="grid border-t border-[var(--rc-line)]" style={cols}>
          <span
            className={`flex min-w-0 items-center gap-1.5 px-2 py-2.5 text-[12.5px] leading-[1.25] text-[var(--rc-label)] sm:gap-[1cqw] sm:px-[1.6cqw] sm:py-[1.2cqw] sm:text-[clamp(13px,1.45cqw,15px)] ${dense ? "max-[479px]:flex-col max-[479px]:justify-center max-[479px]:gap-1 max-[479px]:px-1 max-[479px]:text-center max-[379px]:text-[12px]" : ""}`}
          >
            <Icon name={COLUMN_ICONS[fieldIndex + 2]} className="h-[17px] w-[17px] shrink-0 text-[var(--rc-text)] sm:h-[clamp(17px,2.1cqw,22px)] sm:w-[clamp(17px,2.1cqw,22px)]" strokeWidth={1.6} />
            <span className="min-w-0">{labels[fieldIndex]}</span>
          </span>
          {rows.map((row, index) => (
            <span
              key={`${row.engineCode}-${index}`}
              className={`flex min-w-0 items-center justify-center border-l border-[var(--rc-line)] px-[3px] py-2.5 text-center text-[14px] leading-[1.3] text-[var(--rc-text)] max-[379px]:px-[2px] sm:px-[0.8cqw] sm:py-[1.2cqw] sm:text-[clamp(14px,1.85cqw,19px)] ${HTML}`}
              dangerouslySetInnerHTML={{ __html: dash(row[key]) || "—" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PhoneGroups({ columns, rows }) {
  const labels = columns.slice(2);
  const grouped = FUEL_GROUPS.map((group) => ({ group, rows: rows.filter((row) => fuelOf(row) === group.key) })).filter((entry) => entry.rows.length);
  return (
    <div className="flex flex-col gap-7 sm:gap-[3.2cqw] lg:hidden">
      {grouped.map(({ group, rows: groupRows }) => {
        // Four engines across where their codes and prices fit a phone's quarter-width cells (~55px of text at 360px,
        // ~61px at 390px); otherwise narrow phones take three at a time.
        const { code, value } = widestPieces(groupRows);
        const fitsAt = (codeCell, valueCell) => code <= codeCell && value <= valueCell;
        const four = blocks(groupRows, 4);
        const three = blocks(groupRows, 3);
        const same = four.length === three.length && four.every((block, index) => block.length === three[index].length);
        const layouts = same || fitsAt(55, 55.5)
          ? [{ list: four, className: "" }]
          : fitsAt(61, 62)
            ? [{ list: four, className: "max-[379px]:hidden" }, { list: three, className: "min-[380px]:hidden" }]
            : [{ list: four, className: "max-[439px]:hidden" }, { list: three, className: "min-[440px]:hidden" }];
        return (
          <div key={group.key}>
            <p
              className="relative z-10 inline-flex items-center gap-2 rounded-tl-[12px] py-2 pl-3.5 pr-8 text-[13.5px] font-semibold uppercase tracking-[0.02em] text-white [clip-path:polygon(0_0,calc(100%-20px)_0,100%_100%,0_100%)] sm:gap-[1.2cqw] sm:py-[1cqw] sm:pl-[1.8cqw] sm:pr-[4.4cqw] sm:text-[clamp(14px,1.75cqw,18px)]"
              style={{ background: group.tab }}
            >
              <Icon name={group.icon} className="h-[18px] w-[18px] shrink-0 sm:h-[clamp(18px,2.4cqw,26px)] sm:w-[clamp(18px,2.4cqw,26px)]" strokeWidth={1.8} />
              {UI.groups?.[group.key] || group.key}
            </p>
            {layouts.map(({ list, className }) => (
              <div key={className || "all"} className={className}>
                <div className="flex flex-col gap-3 sm:gap-[1.6cqw]">
                  {list.map((block, index) => (
                    <GroupBlock key={index} group={group} rows={block} labels={labels} first={index === 0} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Trust strip ---------- */
function TrustBadge({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="rc-badge-glow" cx="50%" cy="50%" r="50%">
          <stop offset="58%" stopColor="#1f6fe0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1f6fe0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rc-badge-disc" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#0d3c8c" />
          <stop offset="100%" stopColor="#03122e" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="59" fill="url(#rc-badge-glow)" />
      <circle cx="60" cy="60" r="49" fill="url(#rc-badge-disc)" stroke="#3b8ef2" strokeWidth="1.6" />
      <circle cx="60" cy="60" r="43" fill="none" stroke="#2f80f0" strokeOpacity="0.35" strokeWidth="1" />
      <path d="M60 29 37.5 37.4v19.4c0 15.4 9.6 27.9 22.5 33.6 12.9-5.7 22.5-18.2 22.5-33.6V37.4z" fill="#0a1f45" stroke="#ffffff" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="m44.5 70 7.4-20h6.3l-7.4 20z" fill="#5aa7ff" />
      <path d="m53.8 70 7.4-20h6.3l-7.4 20z" fill="#1f3f99" />
      <path d="m63.1 70 7.4-20h6.3l-7.4 20z" fill="#e3262f" />
    </svg>
  );
}

function TrustStrip({ heading, text, items }) {
  if (!heading && !items?.length) return null;
  // Each sentence on its own line, as in the design.
  const sentences = dash(text || "").split(/(?<=\.)\s+(?=[A-Z])/).filter(Boolean);
  return (
    <div
      className="relative mt-5 overflow-hidden rounded-[12px] border border-[var(--rc-trust-border)] [box-shadow:var(--rc-shadow)] sm:mt-[2.4cqw] lg:mt-5 xl:grid xl:grid-cols-[46.5fr_53.5fr] 2xl:mt-[22px]"
      style={{ background: "var(--rc-trust-bg)" }}
    >
      {heading ? (
        <div className="flex items-center gap-4 px-4 py-4 sm:gap-[2.6cqw] sm:px-[3cqw] sm:py-[2.4cqw] lg:gap-6 lg:px-8 lg:py-5 xl:gap-6 xl:pl-[30px] xl:pr-3">
          <TrustBadge className="h-[72px] w-[72px] shrink-0 sm:h-[clamp(76px,10cqw,96px)] sm:w-[clamp(76px,10cqw,96px)] xl:h-[100px] xl:w-[100px]" />
          <div className="min-w-0">
            <p className="text-[18px] font-semibold leading-tight text-[var(--rc-text)] sm:text-[clamp(19px,2.5cqw,24px)] lg:text-[22px] xl:text-[23px] 2xl:text-[24px]" dangerouslySetInnerHTML={{ __html: heading }} />
            {sentences.length ? (
              <div className="mt-2 flex flex-col gap-1 text-[14px] leading-[1.5] text-[var(--rc-muted)] sm:mt-[1cqw] sm:text-[clamp(14px,1.7cqw,15px)] lg:mt-2.5 lg:gap-1.5 xl:mt-3 xl:text-[14px] xl:tracking-[-0.005em] 2xl:mt-3.5">
                {sentences.map((sentence) => (
                  <p key={sentence} className={HTML} dangerouslySetInnerHTML={{ __html: sentence }} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {items?.length ? (
        <ul className={`relative grid grid-cols-2 sm:grid-cols-4 xl:py-5 2xl:py-6 ${heading ? "border-t border-[var(--rc-line)] xl:border-t-0" : ""}`}>
          {items.map((item, index) => (
            <li key={item.title} className={`relative flex min-w-0 flex-col items-center px-3 py-4 text-center sm:px-[1.4cqw] sm:py-[2.4cqw] lg:py-5 xl:justify-center xl:px-1.5 xl:py-1 ${index >= 2 ? "max-sm:border-t max-sm:border-[var(--rc-line)]" : ""}`}>
              {/* Dividers: between the two columns on phones, between all four on tablets, and before each on desktop */}
              <span aria-hidden="true" className={`absolute bottom-0 left-0 top-0 w-px bg-[var(--rc-line)] xl:bottom-[6%] xl:top-[6%] xl:bg-[var(--rc-trust-border)] ${index % 2 ? "" : "max-sm:hidden"} ${index === 0 ? "sm:max-xl:hidden" : ""}`} />
              <Icon name={item.icon} className="h-9 w-9 text-[var(--rc-icon)] [filter:var(--rc-icon-glow)] sm:h-[clamp(36px,4.6cqw,44px)] sm:w-[clamp(36px,4.6cqw,44px)] xl:h-10 xl:w-10 2xl:h-[46px] 2xl:w-[46px]" strokeWidth={1.5} />
              <span className={`mt-2 text-[14.5px] font-semibold leading-snug text-[var(--rc-text)] sm:text-[clamp(14.5px,1.8cqw,16px)] lg:text-[16px] xl:mt-2.5 xl:text-[15px] 2xl:mt-3 2xl:text-[16px] ${HTML}`} dangerouslySetInnerHTML={{ __html: item.title }} />
              <span className={`mt-1 text-[13px] leading-[1.45] text-[var(--rc-muted)] sm:text-[clamp(13px,1.6cqw,14.5px)] lg:text-[14px] xl:max-[1399px]:text-[13.5px] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(item.text) }} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function ReplacementCosts({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const vars = TONES[isDark ? "dark" : "light"];
  const title = splitTitle(dash(data.h2 || "Engine Replacement Costs"));
  // Desktop breaks after the dash, as in the design, when the first line fits beside the car; longer titles wrap.
  const breakAfterDash = plain(title.main).length <= 28;
  const columns = data.columns?.length ? data.columns : ["Variant", "Engine Code", "Used (Supply)", "Reconditioned (Supply)", "Rebuilt (Supply)", "Labour Hours"];
  const rows = (data.rows || []).filter((row) => row && (row.variant || row.engineCode)).map(normaliseRow);
  const engineSrc = engineFor(rows, data.art);
  const subHeadline = data.subHeadline || UI.subHeadline;
  const eyebrow = UI.eyebrow || "Replacement Costs";

  return (
    // Layout variables (all in one place):
    //   desktop  --h scene height · --fs heading size · --tw heading width · --car-l the car's left edge
    //   phone    --c car width · --cr its inset from the right · --ct its top
    <section
      style={vars}
      className={[
        "relative w-full overflow-hidden bg-[var(--rc-bg)] text-[var(--rc-text)] [container-type:inline-size]",
        sectionFont.className,
        "[--c:46cqw] [--cr:2.5cqw] [--ct:16px] [--lab4:90px] [--lab3:116px] max-[379px]:[--lab4:86px]",
        "sm:[--c:38cqw] sm:[--cr:3.3cqw] sm:[--ct:1.8cqw] sm:[--lab4:17.5cqw] sm:[--lab3:17.5cqw] [--et:0.4] [--eh:0.72] sm:[--et:0.34] sm:[--eh:0.62]",
        "[--gl:max(32px,calc((100cqw_-_1408px)/2_+_32px))]",
        // The car + engine scene (2.82h wide) starts 16px clear of the heading's widest line and ends at the screen edge
        // (on very wide screens one engine-width past the content); --fit shrinks --h where both would not fit.
        "[--car-l:max(calc(var(--gl)_+_var(--tw)_+_16px),calc(min(100cqw,100cqw_-_var(--gl)_+_var(--h)*1.06)_-_var(--h)*2.82))]",
        "[--fit:calc((100cqw_-_var(--gl)_-_var(--tw)_-_16px)/2.82)]",
        "lg:max-xl:[--h:min(230px,calc(200px_+_(100cqw_-_1009px)*0.3),var(--fit))] lg:max-xl:[--fs:34px] lg:max-xl:[--tw:calc(var(--fs)*12)]",
        "xl:max-2xl:[--h:min(270px,calc(206px_+_(100cqw_-_1265px)*0.28),var(--fit))] xl:max-2xl:[--fs:40px] xl:[--tw:calc(var(--fs)*16.25)]",
        "2xl:max-[1919px]:[--h:min(274px,calc(267px_+_(100cqw_-_1521px)*0.3),var(--fit))] 2xl:max-[1919px]:[--fs:42px]",
        "min-[1920px]:[--h:min(274px,var(--fit))] min-[1920px]:[--fs:46px]",
      ].join(" ")}
    >
      {/* Every page has the garage; the car and the engine stand in it when this generation has photos of them. */}
      <HeaderScene data={data} engineSrc={engineSrc} isDark={isDark} />

      <div className="site-container relative pb-10 pt-[22px] sm:pb-[5cqw] sm:pt-[2.6cqw] lg:pb-12 lg:pt-[30px] xl:pt-[34px] 2xl:pb-14 2xl:pt-[38px]">
        {/* Heading: phones keep it left of the car and engine (the sub-headline follows below them); tablets keep the
            sub-headline in the column too; desktops keep the block as tall as the scene so the table starts below it. */}
        <div className="sm:max-lg:min-h-[calc(var(--ct)_+_var(--c)*0.98_-_2.6cqw)] lg:max-xl:min-h-[calc(var(--h)_-_54px)] xl:max-2xl:min-h-[calc(var(--h)_-_58px)] 2xl:min-h-[calc(var(--h)_-_62px)]">
          <div className="max-sm:min-h-[calc(var(--ct)_+_var(--c)*1.13_-_22px)] max-sm:max-w-[calc(100cqw_-_var(--c)_-_var(--cr)_-_28px)] sm:max-md:max-w-[calc(100cqw_-_var(--c)_-_var(--cr)_-_32px)] md:max-lg:max-w-[calc(100cqw_-_var(--c)_-_var(--cr)_-_48px)]">
            <p className="text-[13px] font-medium uppercase tracking-[0.03em] text-[var(--rc-blue)] sm:text-[clamp(13px,1.65cqw,17px)] lg:text-[14px] 2xl:text-[15px]">{eyebrow}</p>
            <h2
              className={`mt-2 text-[clamp(23px,6.4cqw,27px)] font-semibold leading-[1.14] tracking-[-0.015em] text-[var(--rc-text)] sm:mt-[1cqw] sm:text-[clamp(26px,4.2cqw,42px)] lg:mt-3 lg:max-w-[var(--tw)] lg:text-[length:var(--fs)] ${HTML}`}
            >
              <span dangerouslySetInnerHTML={{ __html: title.main }} />
              {title.accent ? (
                <>
                  {" — "}
                  <br className={breakAfterDash ? "hidden xl:inline" : "hidden"} />
                  <span dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            <span aria-hidden="true" className="mt-4 flex h-[3px] w-[96px] sm:mt-[1.8cqw] sm:w-[clamp(96px,13cqw,136px)] lg:mt-[15px] lg:w-[62px]">
              {/* Phones: blue / navy / red, as in the phone design; desktop: the short blue rule */}
              <span className="w-[34%] bg-[#2f80ed] lg:w-[71%] lg:bg-[var(--rc-rule)]" />
              <span className="w-[33%] bg-[#1c3f94] lg:w-[29%] lg:bg-[var(--rc-rule-2)]" />
              <span className="w-[33%] bg-[#e3262f] lg:hidden" />
            </span>
            {subHeadline ? (
              <p
                className={`mt-4 hidden text-[clamp(15px,1.95cqw,19px)] leading-[1.55] text-[var(--rc-muted)] sm:mt-[2.2cqw] sm:block lg:mt-[17px] lg:max-w-[min(36em,var(--tw))] lg:text-[16px] lg:leading-[1.6] xl:max-[1919px]:text-[17px] min-[1920px]:text-[18px] ${HTML}`}
                dangerouslySetInnerHTML={{ __html: dash(subHeadline) }}
              />
            ) : null}
          </div>
          {subHeadline ? (
            <p className={`mt-4 text-[15px] leading-[1.55] text-[var(--rc-muted)] sm:hidden ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(subHeadline) }} />
          ) : null}
        </div>

        {rows.length ? (
          <div className="relative mt-7 sm:mt-[3.4cqw] lg:mt-6">
            <Table columns={columns} rows={rows} />
            <PhoneGroups columns={columns} rows={rows} />
          </div>
        ) : null}

        <TrustStrip heading={data.trustHeading || UI.trustHeading} text={data.trustText || UI.trustText} items={data.trustStrip?.length ? data.trustStrip : UI.trustStrip} />
      </div>
    </section>
  );
}

