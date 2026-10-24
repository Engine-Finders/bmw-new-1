"use client";

import { useId } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import ui from "@/data/shared/generationPageUi.json";
import { splitEngineDatabaseH2 } from "./generationSection";

const UI = ui.engineDatabase;

// Ten columns from 1440px (the desktop design; narrower, "Displacement" no longer fits its column);
// the phone design's seven columns below that.
// Column widths from the desktop design (px at 1536, used as ratios), rebalanced so every cell of the design
// ("Years (E90 saloon)", "Single-turbo", "N57D30 NEW", "316d, 318d, 320d") stays on one line at our 16px/14px type.
const DESKTOP_COLS = "grid-cols-[minmax(0,138fr)_minmax(0,72fr)_minmax(0,138fr)_minmax(0,116fr)_minmax(0,136fr)_minmax(0,162fr)_minmax(0,154fr)_minmax(0,170fr)_minmax(0,140fr)_minmax(0,150fr)]";
// The phone design's seven columns, measured from it (px of an 827px-wide table).
const PHONE_COLS = "grid-cols-[minmax(0,123fr)_minmax(0,108fr)_minmax(0,102fr)_minmax(0,84fr)_minmax(0,130fr)_minmax(0,111fr)_minmax(0,169fr)]";
const MOBILE_COLS = "grid-cols-[minmax(104px,1.2fr)_minmax(96px,1.1fr)_minmax(76px,0.9fr)_minmax(72px,0.85fr)_minmax(104px,1.15fr)_minmax(80px,0.95fr)_minmax(120px,1.3fr)]";

// Colours sampled from the designs (light / dark).
const TONES = {
  light: {
    "--db-bg": "#f6f8fb",
    "--db-card": "#ffffff",
    "--db-head": "#ffffff",
    "--db-line": "#e6eaf0",
    "--db-text": "#0b1726",
    "--db-muted": "#4a5565",
    "--db-soft": "#6b7685",
    "--db-blue": "#0a5bd3",
    "--db-code": "#0a5bd3",
    "--db-green": "#1d8a3f",
    "--db-green-bg": "rgba(29,138,63,0.08)",
    "--db-pill": "rgba(10,91,211,0.08)",
    "--db-pill-text": "#0a5bd3",
    "--db-amber": "#b86e00",
    "--db-shadow": "0 12px 32px rgba(10,26,43,0.07)",
  },
  dark: {
    "--db-bg": "#0b1826",
    "--db-card": "rgba(12,27,45,0.88)",
    "--db-head": "rgba(255,255,255,0.03)",
    "--db-line": "rgba(255,255,255,0.1)",
    "--db-text": "#ffffff",
    "--db-muted": "rgba(255,255,255,0.86)",
    "--db-soft": "rgba(255,255,255,0.7)",
    "--db-blue": "#4d9bff",
    "--db-code": "#ffffff",
    "--db-green": "#4cc46f",
    "--db-green-bg": "rgba(76,196,111,0.1)",
    "--db-pill": "#123a73",
    "--db-pill-text": "#9cc8ff",
    "--db-amber": "#f5a524",
    "--db-shadow": "0 12px 32px rgba(0,0,0,0.35)",
  },
};

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";

function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)/g, " — ");
}

function Html({ html, className = "" }) {
  return <span className={`${HTML} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

// "2010–2011 (MY2011 only)" -> main + "(MY2011 only)" on its own smaller line.
function splitParen(value = "") {
  const match = String(value).match(/^(.*?)\s*(\([^)]*\))\s*$/);
  return match && match[1] ? { main: match[1], sub: match[2] } : { main: String(value), sub: "" };
}

// "Petrol, twin-turbo" -> "Petrol" + "Twin-turbo".
function splitFuel(value = "") {
  const [main, ...rest] = String(value).split(",");
  const sub = rest.join(",").trim();
  return { main: main.trim(), sub: sub ? sub[0].toUpperCase() + sub.slice(1) : "" };
}

// Trailing "[BMW-QUOTE]" / "[PLACEHOLDER -confirm vs cost sheet]" -> value + short tag.
function splitTag(value = "") {
  const match = String(value).match(/^(.*?)\s*\[([^\]]+)\]\s*(.*)$/);
  if (!match) return { main: String(value).trim(), tag: "", rest: "" };
  return { main: match[1].trim(), tag: match[2].split(/\s+[-—]/)[0].trim(), rest: match[3].trim() };
}

// "- (pattern data)" -> dash over "(pattern data)"; "830 JLR-wide [BMW-VERIFIED]" -> figure, scope, tag.
function splitEnquiries(value = "") {
  const text = String(value ?? "").trim();
  if (!text) return { figure: "—", note: "", tag: "" };
  const pattern = text.match(/^-\s*(\(pattern data\))$/i);
  if (pattern) return { figure: "—", note: pattern[1], tag: "" };
  const { main, tag, rest } = splitTag(text);
  const figure = main.match(/^([\d,]+\+?)\s*(.*)$/);
  if (figure) return { figure: figure[1], note: [figure[2], rest].filter(Boolean).join(" "), tag };
  return { figure: "", note: [main, rest].filter(Boolean).join(" "), tag };
}

const tagTone = (tag = "") => (/VERIFIED/i.test(tag) ? "text-[var(--db-green)]" : /PATTERN/i.test(tag) ? "text-[var(--db-soft)]" : "text-[var(--db-blue)]");

const ICON_PATHS = {
  pump: (
    <>
      <path d="M4 20V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 14 5v15" />
      <path d="M3 20h12M6.5 7.5h5v3.5h-5z" />
      <path d="M14 9h2a1.5 1.5 0 0 1 1.5 1.5v5a1.25 1.25 0 0 0 2.5 0V8.2a2 2 0 0 0-.6-1.4L17.5 5" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  circleCheck: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m7.5 12.3 3 3 6-6.3" />
    </>
  ),
  userCircle: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M6.3 18.6a6.5 6.5 0 0 1 11.4 0" />
    </>
  ),
  starCircle: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m12 6.6 1.65 3.35 3.7.54-2.68 2.6.63 3.68L12 15.03l-3.3 1.74.63-3.68-2.68-2.6 3.7-.54z" fill="currentColor" />
    </>
  ),
  fileText: (
    <>
      <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" />
      <path d="M14 2.5V8h5.5M8.5 12.5h7M8.5 15.5h7M8.5 18.5h4.5" />
    </>
  ),
};

// Data icon names -> the glyphs the designs draw for them.
const ITEM_ICONS = { check: "circleCheck", info: "userCircle", diamond: "starCircle", book: "fileText" };

function Icon({ name, className = "h-5 w-5", strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICON_PATHS[name] || ICON_PATHS.fileText}
    </svg>
  );
}

// Blue shield with a white tick and a silver rim, as drawn in the designs.
function ShieldBadge({ className }) {
  // Desktop and phone each draw one; ids must differ or the hidden copy's gradients win.
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6ebf2" />
          <stop offset="1" stopColor="#9aa7b8" />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f86ff" />
          <stop offset="1" stopColor="#0646b8" />
        </linearGradient>
      </defs>
      <path d="M32 2 60 12v22c0 18-12 30-28 36C16 64 4 52 4 34V12z" fill={`url(#${id}-rim)`} />
      <path d="M32 8 54 16v18c0 14.5-9.5 24.5-22 29.5C19.5 58.5 10 48.5 10 34V16z" fill={`url(#${id}-fill)`} />
      <path d="m21 36 8 8 15-16" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FuelIcon({ fuel = "", className }) {
  const value = fuel.toLowerCase();
  if (/electric|\bev\b|battery/.test(value)) return <span className="text-[var(--db-blue)]"><Icon name="bolt" className={className} /></span>;
  const tone = value.includes("diesel") ? "text-[var(--db-green)]" : /hybrid|phev|mhev/.test(value) ? "text-[var(--db-blue)]" : "text-[var(--db-muted)]";
  return <span className={tone}><Icon name="pump" className={className} strokeWidth={1.6} /></span>;
}

function Stack({ main, sub, className = "", subClass = "" }) {
  return (
    <span className={`flex min-w-0 flex-col ${className}`}>
      <Html html={main} />
      {sub ? <Html html={sub} className={`text-[var(--db-muted)] ${subClass}`} /> : null}
    </span>
  );
}

// "★★★★☆ [PROVISIONAL -pending dedicated Engine Page]" -> stars, short tag, and the reason as a detail line.
// "★★★☆☆ 1,450 JLR-wide; 380 F30 model-level [BMW-VERIFIED -…]" -> the figures become detail lines too.
// A separate reliabilityTag / reliabilityDetail on the row takes precedence.
function splitReliability(engine) {
  const text = String(engine.reliability || "").trim();
  const stars = (text.match(/^[★☆½\s]+/) || [""])[0].trim();
  const rest = text.slice(stars.length).trim();
  const bracket = rest.match(/\[([^\]]+)\]/);
  const [shortTag, ...reason] = bracket ? bracket[1].split(/\s+-/) : [""];
  const lead = bracket ? rest.slice(0, bracket.index).trim() : rest;
  const details = [
    ...String(engine.reliabilityDetail || lead).split(";"),
    engine.reliabilityTag ? "" : reason.join(" -"),
  ]
    .map((part) => part.trim())
    .filter(Boolean);
  return { stars: stars || "—", tag: engine.reliabilityTag || shortTag.trim(), details };
}

// Stars, then the data tag (verified = green pill; the rest blue), then the detail lines.
function Reliability({ engine, phone }) {
  const { stars, tag, details } = splitReliability(engine);
  const verified = /VERIFIED/i.test(tag);
  return (
    <span className="flex min-w-0 flex-col items-center gap-1 text-center">
      <span className={`whitespace-nowrap tracking-[0.08em] text-[var(--db-text)] ${phone ? "text-[14px]" : "text-[20px] leading-none tracking-[0.12em]"}`}>{stars}</span>
      {tag ? (
        <span
          className={`max-w-full rounded-[4px] font-medium uppercase leading-tight ${
            verified
              ? "border border-[var(--db-green)] bg-[var(--db-green-bg)] px-1.5 py-px text-[var(--db-green)]"
              : phone
                ? "bg-[var(--db-pill)] px-1.5 py-0.5 text-[var(--db-blue)]"
                : "text-[var(--db-blue)]"
          } ${phone ? "text-[10.5px] md:text-[13px] lg:text-[14px]" : "text-[14px]"}`}
        >
          {phone ? tag : UI.desktopTagLabels?.[tag] || tag}
        </span>
      ) : null}
      {details.map((line) => (
        <Html key={line} html={line} className={`leading-tight text-[var(--db-muted)] ${phone ? "text-[11px] md:text-[13px] lg:text-[14px]" : `text-[14px] tracking-[-0.01em] ${line.length <= 22 ? "whitespace-nowrap" : ""}`}`} />
      ))}
    </span>
  );
}

function Enquiries({ value, phone }) {
  const { figure, note, tag } = splitEnquiries(value);
  return (
    <span className="flex min-w-0 flex-col items-center text-center leading-tight">
      {figure ? <span className={`text-[var(--db-text)] ${figure === "—" ? "" : "font-medium"} ${phone ? "text-[15px]" : "text-[16px]"}`}>{figure}</span> : null}
      {note ? <Html html={note} className={`mt-0.5 text-[var(--db-muted)] ${phone ? "text-[11.5px] md:text-[13px] lg:text-[14px]" : "text-[14px]"}`} /> : null}
      {tag ? <span className={`mt-0.5 font-medium ${tagTone(tag)} ${phone ? "text-[11px] md:text-[13px] lg:text-[14px]" : "text-[14px]"}`}>{phone ? tag : `[${tag}]`}</span> : null}
    </span>
  );
}

function Cost({ value, phone }) {
  const { main, tag, rest } = splitTag(dash(value));
  return (
    <span className="flex min-w-0 flex-col items-center text-center leading-tight">
      <Html html={[main, rest].filter(Boolean).join(" ") || "—"} className={`whitespace-nowrap font-medium text-[var(--db-text)] ${phone ? "text-[14px] tracking-[-0.01em] lg:text-[15px]" : "text-[16px]"}`} />
      {tag ? <span className={`mt-1 ${tagTone(tag)} ${phone ? "text-[11px] md:text-[13px] lg:text-[14px]" : "text-[14px]"}`}>[{tag}]</span> : null}
    </span>
  );
}

function CodeCell({ engine, phone }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <Html html={engine.engineCode} className={`font-semibold text-[var(--db-code)] [overflow-wrap:anywhere] ${phone ? "text-[15px]" : "text-[16px]"}`} />
        {engine.isNew && !phone ? (
          <span className="rounded-[3px] bg-[var(--db-blue)] px-1 py-px text-[12px] font-semibold uppercase leading-tight text-white">{UI.newBadge}</span>
        ) : null}
      </span>
      {phone && engine.family ? <Html html={engine.family} className="mt-0.5 text-[13px] lg:text-[14px] text-[var(--db-soft)]" /> : null}
    </span>
  );
}

function FuelCell({ fuel, phone }) {
  const { main, sub } = splitFuel(fuel);
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <FuelIcon fuel={fuel} className={`shrink-0 ${phone ? "h-5 w-5" : "h-[22px] w-[22px]"}`} />
      <Stack main={main} sub={sub} subClass={phone ? "text-[11px] md:text-[13px] lg:text-[14px] leading-tight" : "whitespace-nowrap text-[14px] leading-tight"} className={phone ? "text-[14px]" : ""} />
    </span>
  );
}

const cell = "flex min-w-0 items-center border-l border-[var(--db-line)] first:border-l-0";

function DesktopTable({ engines, columns }) {
  return (
    <div className="hidden overflow-hidden rounded-[12px] border border-[var(--db-line)] bg-[var(--db-card)] [box-shadow:var(--db-shadow)] min-[1440px]:block">
      <div className={`grid ${DESKTOP_COLS} border-b border-[var(--db-line)] bg-[var(--db-head)]`}>
        {columns.map((label, index) => (
          <span
            key={index}
            className={`${cell} px-2.5 py-4 text-[15px] font-medium leading-tight text-[var(--db-blue)] [[data-theme=dark]_&]:text-white ${index >= 6 ? "justify-center text-center" : ""}`}
          >
            {label}
          </span>
        ))}
      </div>
      {engines.map((engine, index) => {
        const power = splitParen(engine.power);
        const years = splitParen(engine.years);
        return (
          <div key={`${engine.engineCode}-${index}`} className={`grid ${DESKTOP_COLS} border-b border-[var(--db-line)] text-[16px] leading-snug text-[var(--db-text)] last:border-b-0`}>
            <span className={`${cell} px-3 py-2`}><CodeCell engine={engine} /></span>
            <span className={`${cell} px-3 py-2`}><Html html={engine.family || "—"} /></span>
            <span className={`${cell} px-3 py-2`}><FuelCell fuel={engine.fuel} /></span>
            <span className={`${cell} px-3 py-2`}><Html html={engine.displacement || "—"} /></span>
            <span className={`${cell} px-3 py-2`}><Stack main={power.main || "—"} sub={power.sub} subClass="text-[14px]" /></span>
            <span className={`${cell} px-3 py-2`}><Stack main={years.main || "—"} sub={years.sub} subClass="text-[14px]" /></span>
            <span className={`${cell} justify-center px-2 py-2 text-center`}><Html html={engine.variants || "—"} /></span>
            <span className={`${cell} justify-center px-2 py-2`}><Reliability engine={engine} /></span>
            <span className={`${cell} justify-center px-2 py-2`}><Enquiries value={engine.enquiries} /></span>
            <span className={`${cell} justify-center px-2 py-2`}><Cost value={engine.avgReconCost} /></span>
          </div>
        );
      })}
    </div>
  );
}

// Laptops (1024–1439px): the phone design's seven columns at fixed desktop sizes.
// Phones and tablets (below 1024px): the phone design itself — all seven columns on screen, every size a share of the screen width
// (vw values = design px ÷ 8.62, the design being 862px wide), so it scales with the phone like the design does.
function PhoneTable({ engines }) {
  const head = "flex min-w-0 items-center justify-center border-l border-[var(--db-line)] first:border-l-0 px-[0.8vw] py-[1.4vw] text-center text-[1.95vw] leading-[1.25] text-[var(--db-text)]";
  const td = "flex min-w-0 items-center justify-center border-l border-[var(--db-line)] py-[2.4vw] text-center";
  return (
    // Inter runs wider than the design's face, so the table is set a touch tighter to keep the design's line breaks.
    <div className="mx-[2.1vw] overflow-hidden rounded-[1.6vw] border border-[var(--db-line)] bg-[var(--db-card)] tracking-[-0.02em] [box-shadow:var(--db-shadow)] md:mx-[calc(2.1vw-var(--gutter))] md:rounded-[12px] lg:hidden">
      <div className={`grid ${PHONE_COLS} min-h-[6vw] border-b border-[var(--db-line)]`}>
        {UI.mobileColumns.map((label, index) => (
          <span key={label} className={`${head} ${index === 0 ? "justify-start whitespace-nowrap pl-[1.75vw] pr-[0.4vw] text-left" : ""}`}>
            {label}
          </span>
        ))}
      </div>
      {engines.map((engine, index) => {
        const power = splitParen(engine.power);
        const years = splitParen(engine.years);
        const fuel = splitFuel(engine.fuel);
        const enquiries = splitEnquiries(engine.enquiries);
        const cost = splitTag(dash(engine.avgReconCost));
        const { stars, tag, details } = splitReliability(engine);
        return (
          <div key={`${engine.engineCode}-${index}`} className={`grid ${PHONE_COLS} border-b border-[var(--db-line)] text-[var(--db-text)] last:border-b-0`}>
            <span className="flex min-w-0 flex-col justify-center py-[2.4vw] pl-[1.75vw] pr-[0.4vw]">
              <Html html={engine.engineCode} className="text-[2.2vw] font-semibold leading-[1.25] tracking-[-0.03em] text-[var(--db-code)] [overflow-wrap:anywhere]" />
              {engine.family ? <Html html={engine.family} className="mt-[0.4vw] text-[2.03vw] leading-[1.25] text-[var(--db-soft)]" /> : null}
            </span>
            <span className={`${td} flex-col px-[0.8vw]`}>
              <span className="flex min-w-0 items-center gap-[1vw]">
                <FuelIcon fuel={engine.fuel} className="h-[3vw] w-[2.7vw] shrink-0" />
                <Html html={fuel.main} className="text-left text-[2.2vw] leading-[1.25]" />
              </span>
              {fuel.sub ? <Html html={fuel.sub} className="mt-[0.4vw] text-[1.68vw] leading-[1.2] text-[var(--db-muted)]" /> : null}
            </span>
            <span className={`${td} flex-col px-[0.5vw] text-[2.2vw] leading-[1.3]`}>
              <Html html={power.main || "—"} />
              {power.sub ? <Html html={power.sub} className="mt-[0.3vw] text-[1.6vw] leading-[1.2] tracking-[-0.03em] text-[var(--db-muted)]" /> : null}
            </span>
            <span className={`${td} flex-col px-[0.5vw] text-[2.2vw] leading-[1.3]`}>
              <Html html={years.main || "—"} />
              {years.sub ? <Html html={years.sub} className="mt-[0.3vw] text-[1.6vw] leading-[1.2] tracking-[-0.03em] text-[var(--db-muted)]" /> : null}
            </span>
            <span className={`${td} flex-col px-[0.6vw]`}>
              <span className="whitespace-nowrap text-[2.2vw] leading-none tracking-[0.12em]">{stars}</span>
              {tag ? (
                <span
                  className={`mt-[0.9vw] max-w-full whitespace-nowrap rounded-[0.4vw] px-[0.6vw] py-[0.4vw] text-[1.42vw] font-medium uppercase leading-tight tracking-[-0.01em] ${
                    /VERIFIED/i.test(tag)
                      ? "border border-[var(--db-green)] bg-[var(--db-green-bg)] text-[var(--db-green)]"
                      : "bg-[var(--db-pill)] text-[var(--db-pill-text)]"
                  }`}
                >
                  {tag}
                </span>
              ) : null}
              {details.map((line) => (
                <Html key={line} html={line} className={`mt-[0.4vw] text-[1.5vw] leading-[1.3] tracking-[-0.03em] text-[var(--db-muted)] ${line.length <= 22 ? "whitespace-nowrap" : ""}`} />
              ))}
            </span>
            <span className={`${td} flex-col px-[0.8vw] leading-[1.35]`}>
              {enquiries.figure ? <span className="text-[2.2vw]">{enquiries.figure}</span> : null}
              {enquiries.note ? <Html html={enquiries.note} className="mt-[0.3vw] max-w-[9.5vw] text-[1.74vw] leading-[1.45] text-[var(--db-muted)]" /> : null}
              {enquiries.tag ? <span className={`mt-[0.3vw] whitespace-nowrap text-[1.6vw] font-medium tracking-[-0.03em] ${tagTone(enquiries.tag)}`}>{enquiries.tag}</span> : null}
            </span>
            <span className={`${td} gap-[0.3vw] pl-[0.4vw] pr-[1vw]`}>
              <span className="flex min-w-0 flex-1 flex-col items-center leading-[1.3]">
                <Html html={[cost.main, cost.rest].filter(Boolean).join(" ") || "—"} className="whitespace-nowrap text-[1.95vw] font-medium tracking-[-0.03em]" />
                {cost.tag ? (
                  <span className={`mt-[0.3vw] text-[1.68vw] ${/PLACEHOLDER/i.test(cost.tag) ? "text-[var(--db-amber)]" : tagTone(cost.tag)}`}>[{cost.tag}]</span>
                ) : null}
              </span>
              <Icon name="chevron" strokeWidth={2} className="h-[2.8vw] w-[2.2vw] shrink-0 text-[var(--db-soft)]" />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TabletTable({ engines }) {
  return (
    <div className="hidden overflow-hidden rounded-[12px] border border-[var(--db-line)] bg-[var(--db-card)] [box-shadow:var(--db-shadow)] lg:max-[1439px]:block">
      <div>
        <div className={`grid ${MOBILE_COLS} border-b border-[var(--db-line)]`}>
          {UI.mobileColumns.map((label, index) => (
            <span
              key={label}
              className={`${cell} justify-center px-2 py-3 text-center text-[13px] font-medium leading-tight text-[var(--db-text)] md:text-[14px] ${index === 0 ? "justify-start text-left" : ""}`}
            >
              {label}
            </span>
          ))}
        </div>
        {engines.map((engine, index) => {
          const power = splitParen(engine.power);
          const years = splitParen(engine.years);
          return (
            <div key={`${engine.engineCode}-${index}`} className={`grid ${MOBILE_COLS} border-b border-[var(--db-line)] text-[14px] leading-snug text-[var(--db-text)] last:border-b-0`}>
              <span className={`${cell} px-2.5 py-3`}><CodeCell engine={engine} phone /></span>
              <span className={`${cell} px-2 py-3`}><FuelCell fuel={engine.fuel} phone /></span>
              <span className={`${cell} justify-center px-2 py-2 text-center`}><Stack main={power.main || "—"} sub={power.sub} subClass="text-[11px] md:text-[13px] lg:text-[14px]" /></span>
              <span className={`${cell} justify-center px-2 py-2 text-center`}><Stack main={years.main || "—"} sub={years.sub} subClass="text-[11px] md:text-[13px] lg:text-[14px]" /></span>
              <span className={`${cell} justify-center px-1.5 py-3`}><Reliability engine={engine} phone /></span>
              <span className={`${cell} justify-center px-1.5 py-3`}><Enquiries value={engine.enquiries} phone /></span>
              <span className={`${cell} gap-1 py-3 pl-2 pr-1.5`}>
                <span className="flex flex-1 justify-center"><Cost value={engine.avgReconCost} phone /></span>
                <Icon name="chevron" strokeWidth={2} className="h-4 w-4 shrink-0 text-[var(--db-soft)]" />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Items whose label is not a "Codes:" heading continue the previous item ("The ★★★★☆ rating here is derived" + "From …").
function groupItems(items) {
  const groups = [];
  items.forEach((item) => {
    const lead = String(item.label || "").trim();
    if (groups.length && lead && !lead.endsWith(":")) groups[groups.length - 1].continuation.push(item);
    else groups.push({ item, continuation: [] });
  });
  return groups;
}

const lowerFirst = (text = "") => text.replace(/^([A-Z])(?=[a-z])/, (letter) => letter.toLowerCase());
const continuationText = (item) => `${lowerFirst(item.label)} ${lowerFirst(item.text)}`;

function Confidence({ data, code }) {
  const groups = groupItems(data.items);
  const main = groups.map((group) => group.item);
  const notes = groups.flatMap((group) => group.continuation);
  const tone = (item) => (item.iconColor === "success" ? "text-[var(--db-green)]" : "text-[var(--db-blue)]");
  const note = UI.dataNote;

  return (
    <div className="mx-[2.1vw] mt-[2vw] rounded-[1.6vw] border border-[var(--db-line)] bg-[var(--db-card)] [box-shadow:var(--db-shadow)] md:mx-0 md:mt-6 md:rounded-[12px]">
      {/* Desktop: shield | title over the coded items | the derived-rating note */}
      <div className={`hidden lg:grid ${notes.length ? "grid-cols-[128px_1fr_28%]" : "grid-cols-[136px_1fr]"}`}>
        <div className="flex items-center justify-center border-r border-[var(--db-line)] py-6">
          <ShieldBadge className="h-[92px] w-[82px]" />
        </div>
        <div className="px-5 py-5">
          {data.title ? <h3 className="text-[22px] font-semibold leading-tight text-[var(--db-text)]">{data.title}</h3> : null}
          <ul className="mt-4 grid auto-cols-fr grid-flow-col">
            {main.map((item, index) => (
              <li key={index} className={`flex gap-3 pr-4 ${index ? "border-l border-[var(--db-line)] pl-4" : ""}`}>
                <span className={tone(item)}><Icon name={ITEM_ICONS[item.icon]} className="h-7 w-7 shrink-0" strokeWidth={1.6} /></span>
                <span className="min-w-0">
                  <Html html={item.label} className="block text-[16px] font-medium leading-snug tracking-[-0.01em] text-[var(--db-text)]" />
                  <Html html={dash(item.text)} className="mt-1 block text-[15px] leading-[1.55] text-[var(--db-muted)]" />
                </span>
              </li>
            ))}
          </ul>
        </div>
        {notes.length ? (
          <div className="flex gap-3 border-l border-[var(--db-line)] px-6 py-6">
            <span className="text-[var(--db-blue)]"><Icon name="fileText" className="h-7 w-7 shrink-0" strokeWidth={1.6} /></span>
            <span className="flex flex-col gap-2">
              {notes.map((item, index) => (
                <Html key={index} html={dash(continuationText(item))} className="text-[15px] leading-[1.55] text-[var(--db-muted)]" />
              ))}
            </span>
          </div>
        ) : null}
      </div>

      {/* Tablets: shield beside the title, then one row per item; continuations join their item */}
      <div className="hidden px-6 py-5 md:block lg:hidden">
        <div className="flex items-center gap-4">
          <ShieldBadge className="h-[60px] w-[54px] shrink-0" />
          {data.title ? <h3 className="text-[19px] font-semibold leading-tight text-[var(--db-text)]">{data.title}</h3> : null}
        </div>
        <ul className="mt-3">
          {groups.map(({ item, continuation }, index) => (
            <li key={index} className="flex items-center gap-3 border-b border-[var(--db-line)] py-4 last:border-b-0">
              <span className={tone(item)}><Icon name={ITEM_ICONS[item.icon]} className="h-9 w-9 shrink-0" strokeWidth={1.5} /></span>
              <span className="min-w-0 flex-1">
                <Html html={item.label} className={`block text-[16px] font-semibold leading-snug ${tone(item)}`} />
                <Html
                  html={dash([item.text.replace(/[;.]?\s*$/, continuation.length ? ";" : "$&"), ...continuation.map(continuationText)].join(" "))}
                  className="mt-1 block text-[14px] leading-[1.55] text-[var(--db-muted)]"
                />
              </span>
              <Icon name="chevron" strokeWidth={2} className="h-5 w-5 shrink-0 text-[var(--db-soft)]" />
            </li>
          ))}
          {note ? (
            <li className="flex items-center gap-3 py-4">
              <span className="text-[var(--db-blue)]"><Icon name="fileText" className="h-9 w-9 shrink-0" strokeWidth={1.5} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-semibold leading-snug text-[var(--db-blue)]">{note.label}</span>
                <span className="mt-1 block text-[14px] leading-[1.55] text-[var(--db-muted)]">
                  {code ? note.text.replace("{code}", code) : note.text.replace(" {code}-specific", "")}
                </span>
              </span>
            </li>
          ) : null}
        </ul>
      </div>

      {/* Phones: the phone design — shield column, title, one row per item with a chevron, then the data note (vw = design px ÷ 8.62) */}
      <div className="grid grid-cols-[12vw_1fr] pb-[0.6vw] pl-[2.55vw] pr-[2.6vw] pt-[2.6vw] md:hidden">
        <ShieldBadge className="h-[11vw] w-[8.1vw]" />
        <div className="min-w-0">
          {data.title ? <h3 className="mt-[0.6vw] text-[2.44vw] font-semibold leading-tight text-[var(--db-text)]">{data.title}</h3> : null}
          <ul>
            {groups.map(({ item, continuation }, index) => (
              <li key={index} className="flex items-center gap-[1.6vw] border-b border-[var(--db-line)] py-[2.6vw] first:pt-[1.4vw]">
                <span className={tone(item)}><Icon name={ITEM_ICONS[item.icon]} className="h-[5.8vw] w-[5.8vw] shrink-0" strokeWidth={1.5} /></span>
                <span className="min-w-0 flex-1">
                  <Html html={item.label} className={`block text-[2.2vw] font-semibold leading-snug ${tone(item)}`} />
                  <Html
                    html={dash([item.text.replace(/[;.]?\s*$/, continuation.length ? ";" : "$&"), ...continuation.map(continuationText)].join(" "))}
                    className="mt-[0.5vw] block text-[1.97vw] leading-[1.47] text-[var(--db-text)] opacity-90"
                  />
                </span>
                <Icon name="chevron" strokeWidth={2} className="h-[2.8vw] w-[2.2vw] shrink-0 text-[var(--db-soft)]" />
              </li>
            ))}
            {note ? (
              <li className="flex items-center gap-[1.6vw] py-[2.6vw]">
                <span className="text-[var(--db-blue)]"><Icon name="fileText" className="h-[5.8vw] w-[5.8vw] shrink-0" strokeWidth={1.5} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[2.2vw] font-semibold leading-snug text-[var(--db-blue)]">{note.label}</span>
                  <span className="mt-[0.5vw] block text-[1.97vw] leading-[1.47] text-[var(--db-text)] opacity-90">
                    {code ? note.text.replace("{code}", code) : note.text.replace(" {code}-specific", "")}
                  </span>
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Translucent M stripes running off the top-right corner.
function Stripes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -top-10 right-0 h-[360px] w-[60%] max-w-[640px] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)] md:h-[480px]">
      <div className="absolute inset-y-0 right-[-6%] flex -skew-x-[34deg] gap-0">
        <span className="h-full w-[90px] bg-[#2f80ed] opacity-[0.12] md:w-[150px]" />
        <span className="h-full w-[60px] bg-[#2f80ed] opacity-[0.35] md:w-[100px] [[data-theme=dark]_&]:opacity-[0.45] [[data-theme=dark]_&]:bg-[#1c4fbf]" />
        <span className="h-full w-[60px] bg-[#e3262f] opacity-[0.6] md:w-[100px] [[data-theme=dark]_&]:opacity-[0.35]" />
      </div>
    </div>
  );
}

export default function EngineDatabase({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitEngineDatabaseH2(dash(data.h2));
  // "… Engine Codes —" / "… Engine Codes -": the dash is drawn between the two lines below.
  const titleMain = String(title.main).replace(/\s*[-—–]\s*$/, "");
  const engines = data.engines || [];
  // The page's own column labels (they name its generation), falling back to the design's labels.
  const columns = UI.columns.map((label, index) => data.columns?.[index] || label);
  // "BMW 3 Series E90 Engine Codes" -> "E90" for the data note.
  const code = (String(data.h2 || "").match(/^BMW .*?\s(\S+)\s+(?:Engine|Powertrain) Codes/) || [])[1] || "";
  const vars = { ...TONES[isDark ? "dark" : "light"], "--db-solid": isDark ? "#0e1f33" : "#ffffff" };

  return (
    <section
      style={vars}
      className={`relative w-full overflow-hidden bg-[var(--db-bg)] [background-image:linear-gradient(180deg,var(--db-bg)_0%,color-mix(in_srgb,var(--db-bg)_70%,#dfe9f7)_100%)] [[data-theme=dark]_&]:[background-image:linear-gradient(180deg,#0b1826_0%,#0c2140_100%)] ${sectionFont.className}`}
    >
      <Stripes />
      <div className="site-container relative pb-[4vw] pt-[4vw] max-md:px-0 md:pb-12 md:pt-10 lg:pb-14">
        {/* Phones: the design's 3.25vw text inset (the table runs wider, 2.1vw from the edges) */}
        <div className="max-md:px-[3.25vw]">
          <p className="text-[2.05vw] font-medium uppercase tracking-[0.03em] text-[var(--db-blue)] md:text-[17px]">{UI.eyebrow}</p>
          <h2 className="t-h2 mt-[1.4vw] max-w-[22em] font-bold tracking-[-0.02em] text-[var(--db-text)] max-md:max-w-[90vw] max-md:text-[5.5vw] max-md:leading-[1.04] md:mt-2">
            <Html html={titleMain} />
            {title.accent ? (
              <>
                {/* No break between the last word and the dash, so "Codes —" moves down together as in the designs. */}
                {"\u00a0— "}
                <Html html={title.accent} className="lg:block" />
              </>
            ) : null}
          </h2>
          {data.subHeadline ? (
            <p className={`mt-[1.6vw] max-w-[680px] text-[2.03vw] leading-[1.54] text-[var(--db-muted)] max-md:max-w-[67vw] md:mt-3 md:text-[17px] md:leading-[1.6] lg:text-[18px] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(data.subHeadline) }} />
          ) : null}
        </div>

        {engines.length ? (
          <div className="mt-[3.2vw] md:mt-7">
            <DesktopTable engines={engines} columns={columns} />
            <TabletTable engines={engines} />
            <PhoneTable engines={engines} />
          </div>
        ) : null}

        {/* Spec notes that came with the table on some pages ("Engine Specifications:" + bullet list) */}
        {data.notes?.items?.length ? (
          <div className="mx-[2.1vw] mt-[2vw] rounded-[1.6vw] border border-[var(--db-line)] bg-[var(--db-card)] px-4 py-4 [box-shadow:var(--db-shadow)] md:mx-0 md:mt-5 md:rounded-[12px] md:px-6 md:py-5">
            {data.notes.title ? <h3 className="text-[15px] font-semibold text-[var(--db-text)] md:text-[17px]">{data.notes.title.replace(/:\s*$/, "")}</h3> : null}
            <ul className="mt-2 grid gap-x-8 gap-y-1.5 text-[14px] leading-snug text-[var(--db-muted)] md:mt-3 md:grid-cols-2 lg:text-[15px]">
              {data.notes.items.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--db-blue)]" />
                  <Html html={item} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.confidenceScore?.items?.length ? <Confidence data={data.confidenceScore} code={code} /> : null}
      </div>
    </section>
  );
}
