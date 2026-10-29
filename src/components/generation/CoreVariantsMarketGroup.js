"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import { variantFont as sectionFont } from "@/components/variant/variantFont";

// Sections 8 (Core Variants) and 9 (Market Intelligence), drawn as one band as in the design.

// Colours sampled from the dark design; light is the same design on white.
const TONES = {
  light: {
    "--cv-bg": "#f6f8fb",
    "--cv-card": "#ffffff",
    "--cv-border": "#dde3ec",
    "--cv-line": "#e6ebf2",
    "--cv-divider": "#e1e6ee",
    "--cv-text": "#0b1726",
    "--cv-muted": "#4a5565",
    "--cv-sky": "#0a62c9",
    "--cv-green": "#2c8a1c",
    "--cv-teal": "#0f7f8c",
    "--cv-index": "#5776a6",
    "--cv-icon": "#2f5fc4",
    "--cv-disc": "#0a45b4",
    "--cv-outline": "#b8c2d0",
    "--cv-head-bg": "#f3f6fa",
    "--cv-head-border": "#e3e8ef",
    "--cv-cell-line": "#e8edf3",
    "--cv-diesel-dot": "#2b74d0",
    "--cv-petrol-dot": "#3f9a2c",
    "--cv-hybrid-dot": "#1b9aa8",
    "--cv-shadow": "0 12px 30px rgba(10,26,43,0.06)",
  },
  dark: {
    "--cv-bg": "#00060d",
    "--cv-card": "#01060c",
    "--cv-border": "#2c3037",
    "--cv-line": "#20252c",
    "--cv-divider": "#171b21",
    "--cv-text": "#ffffff",
    "--cv-muted": "rgba(255,255,255,0.8)",
    "--cv-sky": "#4fa3df",
    "--cv-green": "#97ce7c",
    "--cv-teal": "#5ccbd6",
    "--cv-index": "#6b89b8",
    "--cv-icon": "#5576cc",
    "--cv-disc": "#06349a",
    "--cv-outline": "#3e4349",
    "--cv-head-bg": "#00040a",
    "--cv-head-border": "#161b21",
    "--cv-cell-line": "#0f151c",
    "--cv-diesel-dot": "#2770c2",
    "--cv-petrol-dot": "#4f9a3a",
    "--cv-hybrid-dot": "#1b9aa8",
    "--cv-shadow": "none",
  },
};

const LABELS = {
  scopeNote: "Scope note:",
  alpina: "Alpina:",
  liveFeed: "Live Feed",
  columns: ["Vehicle", "Location", "Issue", "Enquiries", "Updated"],
};

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";

function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)/g, " — ").replace(/‑/g, "-");
}

const plainLength = (value = "") => String(value ?? "").replace(/<[^>]*>/g, "").length;

// Slashed lists ("N57D30/M57D30", "E90/E92/E93") may break after each slash in narrow cards.
const breakSlashes = (html = "") =>
  String(html ?? "")
    .split(/(<[^>]+>)/)
    .map((part) => (part.startsWith("<") ? part : part.replace(/\/(?=\S)/g, "/​")))
    .join("");

// "1. N47D20C 2.0 Diesel" -> "N47D20C 2.0 Diesel": the list numbers itself.
const unnumber = (value = "") => String(value ?? "").replace(/^\s*\d+[.)]\s+/, "").replace(/\.\s*$/, "");

// "N47D20C (largest share of 1,450 JLR-wide figure)" -> "N47D20C" over its note, as in the design; so are
// "BMW 440i — based on model-level request data [BMW-VERIFIED]" and "318is [PATTERN DATA]".
function splitNote(value = "") {
  const text = String(value ?? "");
  const match = text.match(/^(.+?)\s+((?:\(|—|–|\[).*)$/);
  return match ? { main: match[1], note: match[2].replace(/^[—–]\s*/, "") } : { main: text, note: "" };
}

// "reconditioned, supply only [BMW-QUOTE]" -> text + tag.
function splitTag(value = "") {
  const match = String(value ?? "").match(/^(.*?)\s*(\[[^\]]+\])\s*$/);
  return match ? { text: match[1], tag: match[2] } : { text: String(value ?? ""), tag: "" };
}

// "£2,500–£8,000 supply-only [BMW-QUOTE]." -> figures ["£2,500", "£8,000"], text "supply-only", tag "[BMW-QUOTE]";
// a separate note field (E90) adds its own text and tag.
function splitCost(value = "", note = "") {
  const clean = (text) => String(text ?? "").trim().replace(/\.$/, "").replace(/‑/g, "-");
  const match = clean(value).match(/^([£$€][\d,.]+(?:\s*[–-]\s*[£$€]?[\d,.]+)?)\s*(.*)$/);
  const figures = match ? match[1].split(/\s*[–-]\s*/) : [clean(value)];
  const rest = splitTag([match ? match[2] : "", clean(note)].filter(Boolean).join(" ").replace(/^\((.*)\)(?=\s|$)/, "$1"));
  return { figures, text: rest.text.replace(/^\((.*)\)$/, "$1"), tag: rest.tag };
}

// "5 enquiries" -> figure + label.
function splitCount(value = "") {
  const match = String(value ?? "").match(/^(\d[\d,]*\+?)\s+(.*)$/);
  return match ? { figure: match[1], label: match[2] } : { figure: "", label: String(value ?? "") };
}

// "Updated Monthly" -> two lines, as in the design.
const twoWords = (value = "") => String(value ?? "").replace(/^(\S+)\s+/, "$1\n");

// "740e · 740Le · …" strings and {name, url} objects both become {name, url}; a name that lists several variants
// ("725d · 725Ld · 730d …") is split too, each keeping the link only when it names that variant.
// A grouped entry ("Petrol V8 Variants: 730i V8 · 740i") becomes a group label ("V8") on its own line, then its names.
function variantList(list = []) {
  return list.flatMap((item) => {
    const full = typeof item === "string" ? item : item?.name || "";
    const url = typeof item === "string" ? "" : item?.url || "";
    const group = full.match(/^([^:·•<>/]{3,40}):\s*(.+)$/);
    const name = group ? group[2] : full;
    const label = group ? group[1].replace(/^(?:Petrol|Diesel|Hybrid|Plug-in Hybrid)\s+/i, "").replace(/\s+Variants?$/i, "").replace(/\u2011/g, "-") : "";
    const names = name.split(/\s*[·•]\s*|,\s+/).map((part) => part.trim()).filter(Boolean);
    const head = label ? [{ label }] : [];
    if (names.length < 2) return name ? [...head, { name, url }] : [];
    const slug = url.split("/").pop()?.toLowerCase() || "";
    return [...head, ...names.map((part) => ({ name: part, url: part.toLowerCase().replace(/\s+/g, "-") === slug ? url : "" }))];
  });
}

/* ---------- Icons (24px grid, currentColor) ---------- */
const PATHS = {
  bars: (
    <>
      <rect x="4.5" y="13" width="4" height="7" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="10" y="9" width="4" height="11" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="15.5" y="4.5" width="4" height="15.5" rx="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  car: (
    <>
      <path d="M6.2 10.6 7.6 6.9A2 2 0 0 1 9.5 5.6h5a2 2 0 0 1 1.9 1.3l1.4 3.7" />
      <path d="M4.6 12.4a1.8 1.8 0 0 1 1.8-1.8h11.2a1.8 1.8 0 0 1 1.8 1.8V17a.9.9 0 0 1-.9.9H5.5a.9.9 0 0 1-.9-.9z" fill="currentColor" stroke="none" />
      <path d="M6.5 17.9v1.6M17.5 17.9v1.6" />
      <circle cx="7.8" cy="14.2" r="1.05" fill="var(--cv-disc)" stroke="none" />
      <circle cx="16.2" cy="14.2" r="1.05" fill="var(--cv-disc)" stroke="none" />
    </>
  ),
  pound: <path d="M16.2 6.6A3.9 3.9 0 0 0 9.2 8.4V13m-3 0h7.6M6.4 19h11.2M9.2 13c0 2.7-.7 4.6-2.8 6" strokeWidth="2.3" />,
  warning: (
    <>
      <path d="M10.3 4.1 2.6 17.6a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.1a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.3v4.6M12 17.2h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 10.6v6.2M12 7.4h.01" strokeWidth="2.2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.2s-6.4-5.8-6.4-11a6.4 6.4 0 0 1 12.8 0c0 5.2-6.4 11-6.4 11z" />
      <circle cx="12" cy="10.2" r="2.4" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4.6H7.1a1.6 1.6 0 0 0-1.6 1.6v13.2A1.6 1.6 0 0 0 7.1 21h9.8a1.6 1.6 0 0 0 1.6-1.6V6.2a1.6 1.6 0 0 0-1.6-1.6H15" />
      <rect x="9" y="3" width="6" height="3.2" rx="1" />
      <path d="M12 9.6v7.2M10 11.6h4M10 14.8h4" />
    </>
  ),
  refresh: (
    <>
      <path d="M19.4 10.6A7.6 7.6 0 0 0 6 7.2L4.6 8.8" />
      <path d="M4.4 4.8v4.2h4.2" />
      <path d="M4.6 13.4A7.6 7.6 0 0 0 18 16.8l1.4-1.6" />
      <path d="M19.6 19.2V15h-4.2" />
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="10.4" r="2.1" fill="currentColor" stroke="none" />
      <path d="M12 12.6V21" />
      <path d="M8.6 6.9a4.9 4.9 0 0 0 0 7M15.4 6.9a4.9 4.9 0 0 1 0 7M5.7 4a9 9 0 0 0 0 12.8M18.3 4a9 9 0 0 1 0 12.8" />
    </>
  ),
  barrel: (
    <>
      <path d="M5.6 4.6C5.6 3.7 8.5 3 12 3s6.4.7 6.4 1.6v14.8c0 .9-2.9 1.6-6.4 1.6s-6.4-.7-6.4-1.6z" fill="currentColor" stroke="none" />
      <path d="M5.6 8.6c1.5.7 3.8 1.1 6.4 1.1s4.9-.4 6.4-1.1M5.6 15.4c1.5.7 3.8 1.1 6.4 1.1s4.9-.4 6.4-1.1" stroke="var(--cv-cut)" strokeWidth="1.3" />
      <ellipse cx="12" cy="12.6" rx="1.7" ry="1.25" stroke="var(--cv-cut)" strokeWidth="1.3" />
    </>
  ),
  pump: (
    <>
      <path d="M4 21V4.9A1.9 1.9 0 0 1 5.9 3h7.4a1.9 1.9 0 0 1 1.9 1.9V21z" fill="currentColor" stroke="none" />
      <rect x="6.3" y="5.6" width="6.6" height="4.8" rx="0.6" fill="var(--cv-cut)" stroke="none" />
      <path d="M15.2 9.2h1.6a1.5 1.5 0 0 1 1.5 1.5v5.6a1.35 1.35 0 0 0 2.7 0V8.3a2 2 0 0 0-.6-1.4l-2.2-2.2" strokeWidth="1.7" />
      <path d="M2.6 21h14" strokeWidth="1.8" />
    </>
  ),
  bolt: <path d="M13.4 2.5 4.8 13.6h6.4l-1 7.9 8.6-11.1h-6.4z" fill="currentColor" stroke="none" />,
};

function Icon({ name, className, strokeWidth = 1.8, style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

// Solid blue disc with a white icon, as at the head of each market card.
function Disc({ icon, className }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--cv-disc)] text-white ${className}`}>
      <Icon name={icon} className="h-[52%] w-[52%]" strokeWidth={2} />
    </span>
  );
}

// Section heading with the short blue / navy / red rule under it.
function SectionHeading({ title, className = "", textClass }) {
  return (
    <div className={className}>
      <h2 className={`font-bold uppercase leading-[1.08] tracking-[-0.012em] text-[var(--cv-text)] ${textClass}`} dangerouslySetInnerHTML={{ __html: title }} />
      <span aria-hidden="true" className="mt-[12px] flex h-[3px] w-[86px] lg:mt-[13px]">
        <span className="w-[46px] bg-[#1f7fe0]" />
        <span className="w-[22px] bg-[#1a3c7c]" />
        <span className="w-[18px] bg-[#d0262f]" />
      </span>
    </div>
  );
}

/* ---------- The studio ---------- */
// The client's E90 artwork is 3842x1088; the other generations get the same studio with the E90 taken out
// (public/generation/core/studio-*.webp, same size), and their own photo stood where the E90 stands.
const STUDIO = {
  ratio: 3842 / 1088,
  // Where the E90's body sits in the artwork (fractions of its width / height; bottom = the lowest tyre).
  car: { left: 0.581, right: 0.986, top: 0.097, bottom: 0.814 },
  plate: { dark: "/generation/core/studio-dark.webp", light: "/generation/core/studio-light.webp" },
  tile: { dark: "/generation/core/tile-dark.webp", light: "/generation/core/tile-light.webp" },
};
// A photo without measured bounds: the typical margins of the three-quarter cut-outs.
const DEFAULT_FIT = { width: 740, height: 510, top: 0.11, bottom: 0.16, left: 0.03, right: 0.035 };

const pct = (value) => `${(value * 100).toFixed(3)}%`;

// The photo's box inside the studio (fractions of the studio box). The visible car spans the E90's length; a
// taller body (SUVs) keeps its roof clear of the top edge and is centred on the E90 instead. Tyres stand on the
// E90's tyre line.
function carFrame(fit) {
  const f = fit || DEFAULT_FIT;
  const { ratio, car } = STUDIO;
  const aspect = (f.width * (1 - f.left - f.right)) / (f.height * (1 - f.top - f.bottom));
  let width = (car.right - car.left) * ratio; // in studio heights
  let height = width / aspect;
  const maxHeight = car.bottom - 0.04;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspect;
  }
  const left = ((car.left + car.right) / 2) * ratio - width / 2;
  const boxWidth = width / (1 - f.left - f.right);
  const boxHeight = height / (1 - f.top - f.bottom);
  return {
    box: { left: (left - f.left * boxWidth) / ratio, width: boxWidth / ratio, top: car.bottom - height - f.top * boxHeight, height: boxHeight },
    body: { left: left / ratio, width: width / ratio, height },
    bottomMargin: f.bottom * boxHeight,
  };
}

function StudioCar({ src, fit, alt, isDark, sizes }) {
  const { box, body, bottomMargin } = carFrame(fit);
  const floor = STUDIO.car.bottom;
  const reflection = body.height * 0.42;
  return (
    <>
      {/* Mirror image in the polished floor, fading out a short way below the tyres */}
      <div
        aria-hidden="true"
        className={`absolute overflow-hidden [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.75),transparent)] ${isDark ? "opacity-30" : "opacity-[0.16]"}`}
        style={{ left: pct(box.left), width: pct(box.width), top: pct(floor), height: pct(reflection) }}
      >
        <div className="absolute inset-x-0 -scale-y-100" style={{ top: pct(-bottomMargin / reflection), height: pct(box.height / reflection) }}>
          <Image src={src} alt="" fill sizes={sizes} className="object-fill blur-[0.6px]" />
        </div>
      </div>
      {/* Soft pool of shadow under the body, then the dark contact line where the tyres meet the floor */}
      <div
        aria-hidden="true"
        className={`absolute rounded-[50%] blur-[18px] ${isDark ? "bg-black/80" : "bg-[#1b2433]/30"}`}
        style={{ left: pct(body.left + body.width * 0.02), width: pct(body.width * 0.96), top: pct(floor - body.height * 0.06), height: pct(body.height * 0.14) }}
      />
      <div
        aria-hidden="true"
        className={`absolute rounded-[50%] blur-[4px] ${isDark ? "bg-black/90" : "bg-[#0d1522]/40"}`}
        style={{ left: pct(body.left + body.width * 0.06), width: pct(body.width * 0.88), top: pct(floor - body.height * 0.022), height: pct(body.height * 0.045) }}
      />
      {/* Studio photos are lit brighter than the dark studio: toned down a touch there so the car sits in it. */}
      <div className="absolute" style={{ left: pct(box.left), width: pct(box.width), top: pct(box.top), height: pct(box.height) }}>
        <Image src={src} alt={alt} fill sizes={sizes} className={`object-fill ${isDark ? "brightness-[0.9] saturate-[0.95]" : ""}`} />
      </div>
    </>
  );
}

// The studio scene filling its (3842:1088) box: the page's own artwork, else the empty studio with this
// generation's photo; generations without a photo show the studio alone.
function StudioScene({ data, isDark, sizes }) {
  const own = data.art ? (isDark ? data.art.dark || data.art.light : data.art.light || data.art.dark) : null;
  const alt = String(data.art?.alt || "");
  if (own) return <Image src={own} alt={alt} fill sizes={sizes} className="object-cover" />;
  return (
    <>
      <Image src={STUDIO.plate[isDark ? "dark" : "light"]} alt="" fill sizes={sizes} className="object-cover" />
      {data.image ? <StudioCar src={data.image} fit={data.imageFit} alt={alt} isDark={isDark} sizes={sizes} /> : null}
    </>
  );
}

// Desktop: the studio along the top right of the band, the car's tail near the screen edge as at 1536px in the
// design; its left part and floor melt into the page behind the cards. It shares the section's one grid cell with
// the content, so the band is never shorter than the studio.
function DesktopStudio({ data, isDark }) {
  const mask = "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 24%, #000 38%, #000 97%, transparent 100%)";
  return (
    <div
      className="pointer-events-none relative hidden w-[92%] self-start justify-self-end overflow-hidden [grid-area:1/1] lg:block xl:w-[min(1500px,100%)]"
      style={{ marginRight: "max(0px, calc((100% - 88rem) / 2 - 64px))", aspectRatio: String(STUDIO.ratio), maskImage: mask, WebkitMaskImage: mask }}
    >
      <StudioScene data={data} isDark={isDark} sizes="(min-width: 1536px) 1500px, 100vw" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[7%] bg-[linear-gradient(180deg,var(--cv-bg),transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(0deg,var(--cv-bg),transparent)]" />
    </div>
  );
}

// Phones + tablets: the studio as a full-width band under the heading, right-aligned as on desktop and scaled
// so the car spans ~87% of a phone (~65% of a tablet). With no car to show it is a shorter strip of the wall, its
// light shafts and the M stripes.
function BandStudio({ data, isDark }) {
  const empty = !data.art && !data.image;
  return (
    <div className={`relative -mx-4 mt-5 overflow-hidden md:-mx-8 md:mt-6 lg:hidden ${empty ? "aspect-[2.5] md:aspect-[3.4]" : "aspect-[1.642] md:aspect-[2.207]"}`}>
      <div className="absolute right-0 top-0 w-[215%] overflow-hidden md:w-[160%]" style={{ aspectRatio: String(STUDIO.ratio) }}>
        <StudioScene data={data} isDark={isDark} sizes="(min-width: 768px) 160vw, 215vw" />
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[12%] bg-[linear-gradient(180deg,var(--cv-bg),transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[20%] bg-[linear-gradient(0deg,var(--cv-bg),transparent)]" />
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[14%] bg-[linear-gradient(90deg,var(--cv-bg),transparent)]" />
    </div>
  );
}

/* ---------- Section 8: Core Variants ---------- */
const FUEL_CARDS = [
  { key: "dieselVariants", label: "Diesel Variants", icon: "barrel", tone: "sky", dot: "diesel", slab: "linear-gradient(180deg,#0a47b2 0%,#063a92 48%,#032160 100%)", cut: "#0a3a8f" },
  { key: "petrolVariants", label: "Petrol Variants", icon: "pump", tone: "green", dot: "petrol", slab: "linear-gradient(180deg,#43892b 0%,#2f6a20 50%,#1a3d11 100%)", cut: "#2b6420" },
  { key: "hybridVariants", label: "Plug-in Hybrid Variants", icon: "bolt", tone: "teal", dot: "hybrid", slab: "linear-gradient(180deg,#1b9aa8 0%,#127482 50%,#0a4952 100%)", cut: "#0f6672" },
];

// Name sizes: the design's 22px for short codes ("320d"); a section of mostly longer names ("xDrive30d") a step down
// so two still fit a line; descriptions over 14 characters smaller again, wrapping inside the card.
const NAME_SIZE = { short: "text-[19px] xl:text-[22px]", medium: "text-[17px] xl:text-[19px]" };

function FuelCard({ card, variants, tier, className = "" }) {
  return (
    <div className={`relative flex min-h-[112px] overflow-hidden rounded-[10px] border border-[var(--cv-border)] bg-[var(--cv-card)] [box-shadow:var(--cv-shadow)] xl:min-h-[136px] ${className}`}>
      {/* The coloured slab with its slanted right edge */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[92px] [clip-path:polygon(0_0,100%_0,50%_100%,0_100%)] xl:w-[120px]" style={{ background: card.slab }} />
      <span className="relative flex w-[60px] shrink-0 items-center justify-center xl:w-[92px]" style={{ "--cv-cut": card.cut }}>
        <Icon name={card.icon} className="h-10 w-10 text-white xl:h-[48px] xl:w-[48px]" strokeWidth={1.6} />
      </span>
      <div className="relative min-w-0 flex-1 py-4 pl-[30px] pr-3 xl:pb-[22px] xl:pl-[24px] xl:pr-3 xl:pt-[19px]">
        <p className="text-[14px] font-semibold uppercase leading-tight tracking-[0.02em] xl:text-[16px]" style={{ color: `var(--cv-${card.tone})` }}>
          {card.label}
        </p>
        {/* A dot before every name; the list sits one dot-width left inside a clipping box, so the dot that would
            start each line is cut off and no line begins with a stray dot. */}
        <div className="mt-1.5 overflow-hidden xl:mt-2">
          <ul className={`-ml-[22px] flex flex-wrap items-center gap-y-0.5 font-semibold leading-[1.55] text-[var(--cv-text)] xl:gap-y-0 xl:leading-[1.727] ${NAME_SIZE[tier]}`}>
            {variants.map((variant, index) => {
              if (variant.label) {
                return (
                  <li key={`label-${variant.label}-${index}`} className={`basis-full pl-[22px] text-[13px] font-semibold uppercase leading-[1.3] tracking-[0.02em] text-[var(--cv-muted)] lg:text-[14px] ${index ? "mt-1.5" : ""}`}>
                    {variant.label}
                  </li>
                );
              }
              const short = plainLength(variant.name) <= 14;
              const size = short ? "" : "min-w-0 text-[16px] xl:text-[18px] [overflow-wrap:anywhere]";
              return (
                <li key={`${variant.name}-${index}`} className={`flex items-center ${short ? "shrink-0 whitespace-nowrap" : "min-w-0"}`}>
                  <span aria-hidden="true" className="flex w-[22px] shrink-0 justify-center">
                    <span className="h-[5px] w-[5px] rounded-full" style={{ background: `var(--cv-${card.dot}-dot)` }} />
                  </span>
                  {variant.url ? (
                    <a href={variant.url} className={`text-inherit no-underline hover:underline ${size}`} dangerouslySetInnerHTML={{ __html: variant.name }} />
                  ) : (
                    <span className={size} dangerouslySetInnerHTML={{ __html: variant.name }} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CoreVariants({ data }) {
  const cards = FUEL_CARDS.map((card) => ({ card, variants: variantList(data[card.key]) })).filter((entry) => entry.variants.length);
  const lengths = cards.flatMap(({ variants }) => variants.filter((variant) => variant.name).map((variant) => plainLength(variant.name))).filter((length) => length <= 14);
  const tier = lengths.filter((length) => length > 6).length * 3 > lengths.length ? "medium" : "short";
  return (
    <>
      {cards.length ? (
        <div className={`mt-5 grid gap-3 lg:mt-[13px] lg:gap-4 ${cards.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {cards.map(({ card, variants }, index) => (
            <FuelCard
              key={card.key}
              card={card}
              variants={variants}
              tier={tier}
              // An odd last card spans the row.
              className={cards.length % 2 && cards.length > 1 && index === cards.length - 1 ? "sm:col-span-2" : ""}
            />
          ))}
        </div>
      ) : null}
      {data.alpinaVariant ? (
        <p className={`mt-3 rounded-[10px] border border-[var(--cv-border)] bg-[var(--cv-card)] px-4 py-3 text-[15px] leading-[1.55] text-[var(--cv-muted)] lg:mt-4 lg:px-5 ${HTML}`}>
          <span className="font-semibold text-[var(--cv-text)]">{LABELS.alpina} </span>
          <span dangerouslySetInnerHTML={{ __html: dash(data.alpinaVariant) }} />
        </p>
      ) : null}
      {data.scopeNote ? (
        <div className="mt-3 flex items-start gap-3.5 rounded-[10px] border border-[var(--cv-border)] bg-[var(--cv-card)] px-4 py-4 [box-shadow:var(--cv-shadow)] lg:mt-[22px] lg:gap-6 lg:px-[18px] lg:pb-[15px] lg:pt-[17px]">
          <Icon name="info" className="mt-0.5 h-8 w-8 shrink-0 text-[var(--cv-icon)] lg:mt-0 lg:h-10 lg:w-10" strokeWidth={1.5} />
          <p className={`min-w-0 text-[15px] leading-[1.55] text-[var(--cv-text)] lg:text-[16px] lg:leading-[1.45] ${HTML}`}>
            <span className="text-[var(--cv-sky)]">{LABELS.scopeNote} </span>
            <span dangerouslySetInnerHTML={{ __html: dash(data.scopeNote) }} />
          </p>
        </div>
      ) : null}
    </>
  );
}

/* ---------- Section 9: Market Intelligence ---------- */
function StatCard({ icon, title, children, className = "" }) {
  return (
    <div className={`relative flex min-w-0 flex-col rounded-[10px] border border-[var(--cv-border)] bg-[var(--cv-card)] px-3.5 pb-4 pt-3.5 [box-shadow:var(--cv-shadow)] md:max-[1399px]:px-4 md:max-[1399px]:pt-4 min-[1400px]:pb-5 min-[1400px]:pl-[14px] min-[1400px]:pr-[10px] min-[1400px]:pt-[18px] ${className}`}>
      {/* Disc beside the title where the card is wide; above it on phones and beside the live feed, where four cards
          and the feed share the row and a title beside the disc would break mid-word. */}
      <div className="flex flex-col items-start gap-2.5 md:max-[1399px]:flex-row md:max-[1399px]:items-center md:max-[1399px]:gap-3 min-[1400px]:gap-3">
        <Disc icon={icon} className="h-10 w-10 min-[1400px]:h-[41px] min-[1400px]:w-[41px]" />
        <p className="min-w-0 text-[13px] font-semibold uppercase leading-[1.35] tracking-[0.01em] text-[var(--cv-sky)] md:text-[14px] min-[1400px]:tracking-normal [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: breakSlashes(title) }} />
      </div>
      <div className="mt-3.5 flex flex-1 flex-col md:max-[1399px]:mt-5 min-[1400px]:mt-[24px]">{children}</div>
    </div>
  );
}

function RankedList({ items, withNotes = false, roomy = false }) {
  return (
    <ol className={`flex flex-col ${roomy ? "gap-3 md:gap-[18px]" : "gap-3 md:gap-[14px]"}`}>
      {items.map((item, index) => {
        const text = breakSlashes(dash(unnumber(item)));
        const { main, note } = withNotes ? splitNote(text) : { main: text, note: "" };
        return (
          <li key={`${item}-${index}`} className="grid grid-cols-[18px_minmax(0,1fr)] text-[15px] leading-[1.35] text-[var(--cv-text)] md:max-[1399px]:grid-cols-[24px_minmax(0,1fr)] md:max-[1399px]:text-[16px] min-[1400px]:grid-cols-[22px_minmax(0,1fr)]">
            <span className="text-[var(--cv-index)]">{index + 1}.</span>
            <span className="min-w-0 [overflow-wrap:anywhere]">
              <span className={HTML} dangerouslySetInnerHTML={{ __html: main }} />
              {note ? <span className={`mt-0.5 block text-[13px] leading-[1.4] text-[var(--cv-muted)] md:mt-1 md:text-[14px] ${HTML}`} dangerouslySetInnerHTML={{ __html: note }} /> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// Faint saloon outline at the foot of the "most requested variants" card.
function CarOutline({ className }) {
  return (
    <svg viewBox="0 0 156 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* The body, faintly filled under its outline */}
      <path
        d="M3.5 35.5c-.4-3.6.4-6.1 2.6-7.2 4.4-2.2 13.2-3.5 21.6-4.6 6.3-4.9 13.6-10.6 19.2-13.3 5.4-2.6 11.7-3.4 23.4-3.4 12.6 0 21.3 1.8 28.7 6.1 4.3 2.5 8.3 5.6 12.4 8.6 9.5.9 22.8 2.6 33.6 5.4 4.6 1.2 6.6 3.4 6.8 7.1l.2 2.7c.1 1.6-.9 2.8-2.6 2.9l-8 .5L118 41.5H7.5c-2 0-3.6-1.4-4-3.3z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="none"
      />
      <path d="M3.5 35.5c-.4-3.6.4-6.1 2.6-7.2 4.4-2.2 13.2-3.5 21.6-4.6 6.3-4.9 13.6-10.6 19.2-13.3 5.4-2.6 11.7-3.4 23.4-3.4 12.6 0 21.3 1.8 28.7 6.1 4.3 2.5 8.3 5.6 12.4 8.6 9.5.9 22.8 2.6 33.6 5.4 4.6 1.2 6.6 3.4 6.8 7.1l.2 2.7c.1 1.6-.9 2.8-2.6 2.9l-8 .5" />
      <path d="M17.5 41.5h-10c-2 0-3.6-1.4-4-3.3l-.3-1.4M38.5 41.5h79.5" />
      <path d="M33.5 23.5c8.8-.7 19.2-1 29.6-1.1V10.1c-5.5.4-10.1 1.6-13.4 3.5-5 2.9-10.9 6.9-16.2 9.9zM67.3 22.4c10.1 0 20.4.4 29.2 1.2 2.1.2 3-1.2 1.6-2.7-3.4-3.5-8-7.4-12.6-9.4-4.8-2.1-11-2.6-18.2-2.6z" />
      <path d="M63.2 22.5V36M96.8 24.5l-1.4 11.5M136.5 30.5h8" />
      <circle cx="28" cy="38.4" r="8.3" />
      <circle cx="28" cy="38.4" r="4.6" />
      <circle cx="128.3" cy="38.4" r="8.3" />
      <circle cx="128.3" cy="38.4" r="4.6" />
    </svg>
  );
}

// The live feed's photo: this generation's car on a corner of the studio, as in the design.
function SceneThumb({ src, isDark, className = "" }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-[5px] ${isDark ? "" : "ring-1 ring-[var(--cv-line)]"} ${className}`}>
      <Image src={STUDIO.tile[isDark ? "dark" : "light"]} alt="" fill sizes="96px" className="object-cover" />
      {src ? (
        <>
          <span aria-hidden="true" className={`absolute inset-x-[6%] bottom-[8%] h-[12%] rounded-[50%] blur-[3px] ${isDark ? "bg-black/80" : "bg-[#0d1522]/30"}`} />
          {/* The photo spans the tile (its side margins just outside it); it is moved down by its typical empty
              bottom margin so the tyres meet the floor. */}
          <span className="absolute -inset-x-[4%] bottom-[11%]">
            <Image src={src} alt="" width={740} height={510} sizes="120px" className={`block h-auto w-full translate-y-[16%] ${isDark ? "brightness-[0.92]" : ""}`} />
          </span>
        </>
      ) : (
        // Generations without a photo: the saloon outline, so the tile still reads as a vehicle.
        <CarOutline className={`absolute inset-x-[12%] bottom-[22%] h-auto w-[76%] ${isDark ? "text-white/35" : "text-[#9aa6b6]"}`} />
      )}
    </span>
  );
}

function LiveFeed({ rows, isDark, side }) {
  // Side by side with the cards (wide screens) the columns follow the design's widths; full width they relax.
  const cols = side
    ? "md:max-[1399px]:grid-cols-[minmax(0,1.45fr)_minmax(0,1.2fr)_minmax(0,1.35fr)_minmax(0,0.85fr)_minmax(0,0.9fr)] min-[1400px]:grid-cols-[minmax(0,162fr)_minmax(0,121fr)_minmax(0,135fr)_minmax(0,91fr)_minmax(0,97fr)]"
    : "md:grid-cols-[minmax(0,1.45fr)_minmax(0,1.2fr)_minmax(0,1.35fr)_minmax(0,0.85fr)_minmax(0,0.9fr)]";
  const cell = "flex min-w-0 items-center px-2.5 min-[1400px]:px-[7px]";
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-[10px] border border-[var(--cv-border)] bg-[var(--cv-card)] p-3 [box-shadow:var(--cv-shadow)] md:p-[12px]">
      <p className="flex items-center gap-3 px-1 pt-1 text-[17px] font-bold uppercase tracking-[0.01em] text-[var(--cv-text)] md:px-[7px] md:pt-[6px] md:text-[18px]">
        <Icon name="live" className="h-[26px] w-[26px] text-[var(--cv-sky)]" strokeWidth={1.9} />
        {LABELS.liveFeed}
      </p>
      {/* Tablets + desktop: the design's five columns */}
      <div className="mt-[13px] hidden flex-1 flex-col md:flex" role="table" aria-label={LABELS.liveFeed}>
        <div role="row" className={`grid ${cols} items-center rounded-[8px] border border-[var(--cv-head-border)] bg-[var(--cv-head-bg)] py-[11px]`}>
          {LABELS.columns.map((label) => (
            <span key={label} role="columnheader" className={`${cell} whitespace-nowrap text-[14px] font-semibold uppercase tracking-[0.01em] text-[var(--cv-sky)]`}>
              {label}
            </span>
          ))}
        </div>
        {rows.map((row, index) => {
          const count = splitCount(row.enquiries);
          const line = index ? "border-t border-[var(--cv-cell-line)]" : "";
          const split = "border-l border-[var(--cv-cell-line)]";
          return (
            <div key={`${row.vehicle}-${index}`} role="row" className={`grid flex-1 ${cols} items-stretch text-[14px] leading-[1.45] text-[var(--cv-text)] ${line}`}>
              <span role="cell" className="flex min-w-0 items-center gap-2.5 py-[10px] pr-[7px]">
                <SceneThumb src={row.image} isDark={isDark} className="h-[54px] w-[62px] min-[1400px]:h-[52px] min-[1400px]:w-[58px]" />
                <span className={`min-w-0 [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: breakSlashes(row.vehicle) }} />
              </span>
              <span role="cell" className={`${cell} ${split} gap-1.5 py-[10px]`}>
                <Icon name="pin" className="h-5 w-5 shrink-0 text-[var(--cv-icon)]" strokeWidth={1.7} />
                <span className={`min-w-0 [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: breakSlashes(row.location) }} />
              </span>
              <span role="cell" className={`${cell} ${split} gap-1.5 py-[10px]`}>
                <Icon name={/inspection|check|consult|service|calibrat/i.test(row.issue) ? "clipboard" : "warning"} className="h-[22px] w-[22px] shrink-0 text-[var(--cv-icon)]" strokeWidth={1.7} />
                <span className={`min-w-0 [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: breakSlashes(row.issue) }} />
              </span>
              <span role="cell" className={`${cell} ${split} py-[10px]`}>
                <span className="min-w-0">
                  {count.figure ? <span className="block text-[18px] font-semibold leading-[1.2]">{count.figure}</span> : null}
                  <span className="block">{count.label}</span>
                </span>
              </span>
              <span role="cell" className={`${cell} ${split} gap-1.5 py-[10px]`}>
                <Icon name="refresh" className="h-[18px] w-[18px] shrink-0 text-[var(--cv-icon)]" strokeWidth={1.8} />
                <span className="min-w-0 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: twoWords(row.updated) }} />
              </span>
            </div>
          );
        })}
      </div>
      {/* Phones: one row per enquiry — photo, vehicle, place and issue, with the count at the right */}
      <ul className="mt-3 md:hidden">
        {rows.map((row, index) => {
          const count = splitCount(row.enquiries);
          return (
            <li key={`${row.vehicle}-${index}`} className="flex items-center gap-3 border-t border-[var(--cv-line)] py-3 first:border-t-0 first:pt-1">
              <SceneThumb src={row.image} isDark={isDark} className="h-[58px] w-[66px] self-start" />
              <span className="min-w-0 flex-1">
                <span className={`block text-[15px] font-semibold leading-snug text-[var(--cv-text)] [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: breakSlashes(row.vehicle) }} />
                <span className="mt-1 flex flex-col gap-0.5 text-[14px] leading-snug text-[var(--cv-muted)]">
                  <span className="flex items-start gap-1.5">
                    <Icon name="pin" className="mt-[1px] h-4 w-4 shrink-0 text-[var(--cv-icon)]" strokeWidth={1.8} />
                    <span dangerouslySetInnerHTML={{ __html: breakSlashes(row.location) }} />
                  </span>
                  <span className="flex items-start gap-1.5">
                    <Icon name={/inspection|check|consult|service|calibrat/i.test(row.issue) ? "clipboard" : "warning"} className="mt-[1px] h-4 w-4 shrink-0 text-[var(--cv-icon)]" strokeWidth={1.8} />
                    <span className="min-w-0 [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: breakSlashes(row.issue) }} />
                  </span>
                </span>
              </span>
              <span className="w-[74px] shrink-0 self-start text-right">
                {count.figure ? <span className="block text-[20px] font-semibold leading-none text-[var(--cv-text)]">{count.figure}</span> : null}
                <span className="mt-1 block text-[13px] text-[var(--cv-muted)]">{count.label}</span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] leading-tight text-[var(--cv-muted)]">
                  <Icon name="refresh" className="h-3.5 w-3.5 shrink-0 text-[var(--cv-icon)]" strokeWidth={2} />
                  <span dangerouslySetInnerHTML={{ __html: row.updated }} />
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Some generations carry the section with every field empty: nothing to show then.
const hasMarket = (data) =>
  Boolean(
    data &&
      (data.mostRequestedEngines?.length || data.mostRequestedVariants?.length || data.averageReplacementCost || data.mostCommonFailures?.length || data.liveFeed?.length),
  );

// Card widths beside the live feed: just wide enough for each title on two lines.
const CARD_FR = { engines: 175, variants: 163, cost: 181, failures: 150 };

function MarketIntelligence({ data, code, isDark }) {
  const cost = splitCost(data.averageReplacementCost, data.averageReplacementCostNote);
  const engines = data.mostRequestedEngines || [];
  const variants = data.mostRequestedVariants || [];
  const failures = data.mostCommonFailures || [];
  const rows = data.liveFeed || [];
  const label = code ? `${code} ` : "";
  const cards = [
    engines.length ? { key: "engines", icon: "bars", title: `Most Requested ${label}Engines (2025)`, body: <RankedList items={engines} withNotes /> } : null,
    variants.length
      ? {
          key: "variants",
          icon: "car",
          title: `Most Requested ${label}Variants`,
          body: (
            <>
              <RankedList items={variants} withNotes roomy />
              <CarOutline className="mx-auto mt-auto block h-auto w-[86%] max-w-[156px] pt-5 text-[var(--cv-outline)]" />
            </>
          ),
        }
      : null,
    data.averageReplacementCost
      ? {
          key: "cost",
          icon: "pound",
          title: `Average ${label}Replacement Cost`,
          body: (
            <div className="-mt-1 border-t border-[var(--cv-line)] pt-3.5 md:-mt-2 md:max-[1399px]:pt-4 min-[1400px]:pt-[18px]">
              <p className={`font-bold leading-[1.02] tracking-[-0.02em] text-[var(--cv-text)] ${cost.figures.length > 1 ? "text-[24px] md:text-[30px]" : "text-[34px] md:max-[1399px]:text-[44px] min-[1400px]:text-[42px]"}`}>
                {/* A range keeps each end whole and drops "£8,000" to its own line only where the card is narrow. */}
                {cost.figures.map((figure, index) => (
                  <span key={index} className="inline-block whitespace-nowrap">
                    {figure}
                    {index < cost.figures.length - 1 ? "–" : ""}
                  </span>
                ))}
              </p>
              {cost.text ? <p className="mt-2 text-[15px] leading-[1.45] text-[var(--cv-text)] md:mt-2.5 md:text-[17px]" dangerouslySetInnerHTML={{ __html: cost.text }} /> : null}
              {cost.tag ? <p className="mt-3 text-[14px] text-[var(--cv-sky)] md:mt-5 md:text-[15px]">{cost.tag}</p> : null}
            </div>
          ),
        }
      : null,
    failures.length ? { key: "failures", icon: "warning", title: `Most Common ${label}Failures`, body: <RankedList items={failures} withNotes roomy /> } : null,
  ].filter(Boolean);

  const side = cards.length > 0 && rows.length > 0;
  // Phones + tablets two by two; small desktops all across; beside the live feed, widths from the titles' lengths.
  const grid = {
    "--cv-n": String(cards.length),
    "--cv-across": cards.map((card) => `minmax(0,${CARD_FR[card.key]}fr)`).join(" "),
  };
  const heading = <SectionHeading title={data.h2 || "Market Intelligence"} textClass="text-[clamp(25px,7vw,28px)] md:text-[32px]" />;
  return (
    <div className={side ? "min-[1400px]:grid min-[1400px]:grid-cols-[minmax(0,1fr)_minmax(0,632px)] min-[1400px]:gap-x-4" : ""}>
      <div className="flex min-w-0 flex-col min-[1400px]:pt-[6px]">
        {heading}
        {cards.length ? (
          <div
            className="mt-5 grid flex-1 grid-cols-2 gap-3 md:max-[1399px]:gap-4 lg:mt-[13px] lg:max-[1399px]:grid-cols-[repeat(var(--cv-n),minmax(0,1fr))] min-[1400px]:gap-[12px] min-[1400px]:[grid-template-columns:var(--cv-across)]"
            style={grid}
          >
            {cards.map((card, index) => (
              <StatCard key={card.key} icon={card.icon} title={card.title} className={cards.length % 2 && index === cards.length - 1 ? "max-lg:col-span-2" : ""}>
                {card.body}
              </StatCard>
            ))}
          </div>
        ) : null}
      </div>
      {rows.length ? (
        <div className={`mt-4 flex min-w-0 flex-col ${side ? "md:max-[1399px]:mt-5 min-[1400px]:mt-0" : "md:mt-5"}`}>
          <LiveFeed rows={rows} isDark={isDark} side={side} />
        </div>
      ) : null}
    </div>
  );
}

export default function CoreVariantsMarketGroup({ coreVariants, marketIntelligence, generationCode = "" }) {
  const { theme } = useTheme();
  if (!coreVariants && !hasMarket(marketIntelligence)) return null;

  const isDark = theme === "dark";
  const vars = TONES[isDark ? "dark" : "light"];
  // "All variants listed are E90 saloon only…" / the page's code, for "Most Requested E90 Engines".
  const code = generationCode || (String(coreVariants?.scopeNote || "").match(/listed are (\S+)/i) || [])[1] || "";
  const market = hasMarket(marketIntelligence) ? <MarketIntelligence data={marketIntelligence} code={code} isDark={isDark} /> : null;
  // Most pages carry "Core Variants" as the subheading and "Diesel & Petrol Lineup" as the h2; the design titles the
  // section "Core Variants" either way.
  const title = coreVariants ? coreVariants.subheading || coreVariants.h2 || "Core Variants" : "";

  return (
    <section style={vars} className={`relative w-full overflow-hidden bg-[var(--cv-bg)] text-[var(--cv-text)] lg:grid ${sectionFont.className}`}>
      {coreVariants ? <DesktopStudio data={coreVariants} isDark={isDark} /> : null}
      <div className="site-container relative pb-10 pt-7 [grid-area:1/1] md:pb-12 md:pt-9 lg:pb-[30px] lg:pt-[30px]">
        {coreVariants ? (
          // Desktop: at least as tall as the car and its floor shadow (the studio's height is its width / 3.53),
          // so Market Intelligence always starts below the car.
          <div className="lg:max-xl:min-h-[calc(92vw*0.86/3.531-48px)] lg:w-[56%] xl:min-h-[calc(min(1500px,100vw)*0.86/3.531-48px)] xl:w-[52.2%]">
            <SectionHeading title={title} textClass="text-[clamp(26px,7.4vw,30px)] md:text-[38px] lg:text-[40px] xl:text-[44px]" />
            <BandStudio data={coreVariants} isDark={isDark} />
            <CoreVariants data={coreVariants} />
          </div>
        ) : null}
        {coreVariants && market ? <hr className="mb-5 mt-8 border-[var(--cv-divider)] md:mb-6 md:mt-10 lg:mb-[16px] lg:mt-[18px]" /> : null}
        {market}
      </div>
    </section>
  );
}
