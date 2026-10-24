"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import { engineImageFor } from "@/components/shared/carImage";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import ui from "@/data/shared/generationPageUi.json";

const UI = ui.bestWorstEngines;

// Engine names without a code ("4.0 V8 Supercharged (XJR)") use the V8 / V6 that generation was built with.
const GENERATION_ENGINES = {
  x308: { v8: "aj27" },
  x100: { v8: "aj27" },
  "x350-x358": { v8: "aj34", v6: "aj30" },
  x351: { v8: "aj133", v6: "aj126" },
  x150: { v8: "aj133" },
  x152: { v8: "aj133", v6: "aj126" },
  x250: { v8: "aj133", v6: "aj126" },
  x260: { v6: "aj126" },
  x761: { v8: "508ps", v6: "aj126" },
  x200: { v8: "aj-v8", v6: "aj-v6" },
  x400: { v6: "aj-v6" },
};

// No photo of the exact engine: a BMW engine of the same layout and fuel stands in as illustration
// (shown with empty alt text, so it is never presented as that engine). V10/V12 have no close match.
const STAND_INS = [
  [/\b(m57|n57|b57|m51|m21)/, "n57d30a"],
  [/\b(m47|n47|b47|m41)/, "n47d20c"],
  [/\b(b38|b37)/, "b38a15a"],
  [/\b(n62|n63|m60|m62|s62|s63|s65|s68)/, "s63b44t0"],
  [/\b(n5[0-5]|m5[0-4]|s5[0-8]|m20|m30|s38|b58)/, "n55b30"],
  [/\b(n4[0-6]|n13|n20|n26|m4[0-4]|s14|m10|b4[68])/, "n20b20"],
];

function standInEngineImage(item) {
  const plain = `${item.engine || ""} ${item.engineNote || ""}`.replace(/<[^>]*>/g, " ").toLowerCase();
  const key = STAND_INS.find(([pattern]) => pattern.test(plain))?.[1];
  return key ? engineImageFor(key) : null;
}

function exactEngineImage(item, generationCode = "") {
  const text = `${item.engine || ""} ${item.engineNote || ""}`;
  const direct = engineImageFor(text);
  if (direct) return direct;
  const family = GENERATION_ENGINES[String(generationCode).toLowerCase()];
  const plain = text.replace(/<[^>]*>/g, " ").toLowerCase();
  if (family?.v8 && /\bv8\b/.test(plain)) return engineImageFor(family.v8);
  if (family?.v6 && /\bv6\b/.test(plain)) return engineImageFor(family.v6);
  return null;
}

// Colours sampled from the designs (dark); light uses deeper shades of the same hues on white.
const TONES = {
  light: {
    "--bw-bg": "#f6f8fb",
    "--bw-card": "#ffffff",
    "--bw-line": "#e3e8ef",
    "--bw-text": "#0b1726",
    "--bw-muted": "#4a5565",
    "--bw-head": "#0b1726",
    "--bw-note": "#eef3fa",
    "--bw-shadow": "0 10px 28px rgba(10,26,43,0.07)",
    "--bw-green": "#1d8a3f",
    "--bw-blue": "#0a5bd3",
    "--bw-red": "#d62828",
    "--bw-orange": "#d9730d",
  },
  dark: {
    "--bw-bg": "#0b1826",
    "--bw-card": "rgba(14,28,46,0.78)",
    "--bw-line": "rgba(255,255,255,0.12)",
    "--bw-text": "#ffffff",
    "--bw-muted": "rgba(255,255,255,0.82)",
    "--bw-head": "rgba(255,255,255,0.88)",
    "--bw-note": "rgba(77,155,255,0.1)",
    "--bw-shadow": "0 12px 30px rgba(0,0,0,0.35)",
    "--bw-green": "#5ccf6f",
    "--bw-blue": "#4d9bff",
    "--bw-red": "#ff5a52",
    "--bw-orange": "#ffa13a",
  },
};

// Slot -> colour + icon, as in the designs; slots the designs don't show get the nearest match.
function slotStyle(slot = "") {
  const label = slot.toLowerCase();
  if (label.includes("best diesel") || label.includes("best overall")) return { tone: "green", icon: "check" };
  if (label.includes("best petrol") || label.includes("performance")) return { tone: "blue", icon: "tools" };
  if (label.includes("highest risk")) return { tone: "red", icon: "warning" };
  if (label.includes("expensive")) return { tone: "orange", icon: "dollar" };
  if (label.includes("best value")) return { tone: "green", icon: "star" };
  if (label.includes("overlooked")) return { tone: "blue", icon: "shield" };
  return { tone: "blue", icon: "info" };
}

const PATHS = {
  check: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m7.5 12.3 3 3 6-6.3" />
    </>
  ),
  tools: (
    <>
      <circle cx="12" cy="12" r="10" />
      <g transform="translate(5.6 5.6) scale(0.54)" strokeWidth="3">
        <path d="M15.6 4.2a3.6 3.6 0 0 0-3.4 4.7L4.6 16.5a1.6 1.6 0 0 0 2.3 2.3l7.6-7.6a3.6 3.6 0 0 0 4.7-3.4l-2 2-2.1-.6-.6-2.1z" />
        <path d="m4.5 5.5 1-1 2.2 1.3 4.6 4.6M12.6 12.6l1.2-1.2 5.8 5.8a.85.85 0 0 1 0 1.2l-1.2 1.2a.85.85 0 0 1-1.2 0z" />
      </g>
    </>
  ),
  warning: (
    <>
      <path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4.5M12 17h.01" />
    </>
  ),
  dollar: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M14.8 8.6c-.5-.8-1.5-1.3-2.8-1.3-1.7 0-2.8.9-2.8 2.1 0 2.8 5.8 1.5 5.8 4.5 0 1.3-1.2 2.2-3 2.2-1.4 0-2.5-.6-3-1.5M12 5.8v1.5M12 16.6v1.6" />
    </>
  ),
  star: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.18" />
      <path d="m12 6.6 1.65 3.35 3.7.54-2.68 2.6.63 3.68L12 15.03l-3.3 1.74.63-3.68-2.68-2.6 3.7-.54z" fill="currentColor" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4.5 5.4v6.1c0 4.6 3.1 8.4 7.5 10 4.4-1.6 7.5-5.4 7.5-10V5.4z" fill="currentColor" fillOpacity="0.12" />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
      <path d="M8.5 16.2a3.6 3.6 0 0 1 7 0z" fill="currentColor" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 11v5.5M12 7.6h.01" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
};

function Icon({ name, className, strokeWidth = 1.7 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";

function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)/g, " — ");
}

// "123d (N47D20D, 2.0-litre twin-turbo)" / "N54B30 HPFP & Injector Failure" -> code + note, as E90's split fields.
function splitEngine(item) {
  const engine = String(item.engine || "").trim();
  if (item.engineNote) return { code: engine, note: item.engineNote };
  const match = engine.match(/^(\S+)\s+(.+)$/);
  return match ? { code: match[1], note: match[2] } : { code: engine, note: "" };
}

const hasText = (value) => Boolean(String(value ?? "").replace(/<[^>]+>/g, "").trim());
const hasContent = (item) => item && [item.slot, item.engine, item.quote, item.whoItsFor].some(hasText);
// Full-width rows: the overlooked pick, and summaries with no single engine (one long paragraph).
const isWide = (item) => item.fullWidth || /overlooked/i.test(item.slot || "") || !hasText(item.engine);

function EngineImage({ item, generationCode, className, sizes }) {
  const exact = exactEngineImage(item, generationCode);
  const src = exact || standInEngineImage(item);
  if (!src) return null;
  const alt = exact ? String(item.engine || "").replace(/<[^>]*>/g, "").split(/\s[–-]\s|"/)[0].trim() : "";
  return (
    <span className={`relative block ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]" />
    </span>
  );
}

const quoteHtml = (quote) => `“${dash(quote)}”`;

/* ---------- Desktop (from 1024px): cards in a row with a coloured bottom bar ---------- */
function DesktopCard({ item, generationCode }) {
  const { tone, icon } = slotStyle(item.slot);
  const color = `var(--bw-${tone})`;
  const { code, note } = splitEngine(item);
  return (
    <article
      className="flex h-full flex-col rounded-[10px] border border-[var(--bw-line)] bg-[var(--bw-card)] px-4 pb-4 pt-4 [box-shadow:var(--bw-shadow)]"
      style={{ borderBottom: `3px solid ${color}` }}
    >
      <div className="grid grid-cols-[34px_1fr] items-start gap-x-3">
        <span style={{ color }}>
          <Icon name={icon} className="h-[34px] w-[34px]" />
        </span>
        <div className="min-w-0">
          <p className="text-[16px] font-medium leading-tight" style={{ color }} dangerouslySetInnerHTML={{ __html: item.slot }} />
          <p className={`mt-1.5 text-[20px] font-semibold leading-tight text-[var(--bw-text)] ${HTML}`} dangerouslySetInnerHTML={{ __html: code }} />
          {note ? <p className={`mt-0.5 text-[14px] leading-snug text-[var(--bw-muted)] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(note) }} /> : null}
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2">
        <EngineImage item={item} generationCode={generationCode} sizes="120px" className="-ml-1 mt-1 h-[84px] w-[86px] shrink-0" />
        <p className={`min-w-0 text-[14px] leading-[1.5] tracking-[-0.005em] text-[var(--bw-muted)] [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: quoteHtml(item.quote) }} />
      </div>
      {hasText(item.whoItsFor) ? (
        <p className={`mt-auto pl-1 pt-3 text-[15px] leading-[1.45] text-[var(--bw-text)] ${HTML}`}>
          <span className="font-medium" style={{ color }}>{UI.whoItsFor}</span>{" "}
          <span dangerouslySetInnerHTML={{ __html: dash(item.whoItsFor) }} />
        </p>
      ) : null}
      {item.modelWideNote ? (
        <p className={`mt-2 flex items-start gap-1.5 rounded-[6px] bg-[var(--bw-note)] px-2.5 py-1.5 text-[14px] leading-snug text-[var(--bw-muted)] ${HTML}`}>
          <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--bw-blue)]" />
          <span dangerouslySetInnerHTML={{ __html: dash(item.modelWideNote) }} />
        </p>
      ) : null}
    </article>
  );
}

function DesktopWide({ item }) {
  const { tone, icon } = slotStyle(item.slot);
  const color = `var(--bw-${tone})`;
  const { code, note } = splitEngine(item);
  const hasEngine = hasText(code);
  const hasWho = hasText(item.whoItsFor);
  return (
    <article
      className={`grid items-center gap-x-6 rounded-[10px] border border-[var(--bw-line)] bg-[var(--bw-card)] px-6 py-5 [box-shadow:var(--bw-shadow)] ${
        hasEngine ? (hasWho ? "grid-cols-[56px_minmax(0,0.85fr)_minmax(0,2fr)_minmax(0,0.85fr)]" : "grid-cols-[56px_minmax(0,0.85fr)_minmax(0,2.85fr)]") : "grid-cols-[56px_minmax(0,1fr)]"
      }`}
    >
      <span style={{ color }} className="drop-shadow-[0_0_14px_currentColor]">
        <Icon name={icon} className="h-14 w-14" strokeWidth={1.5} />
      </span>
      {hasEngine ? (
        <div className="min-w-0">
          <p className="text-[16px] font-medium leading-tight" style={{ color }} dangerouslySetInnerHTML={{ __html: item.slot }} />
          <p className={`mt-1.5 text-[20px] font-semibold leading-snug text-[var(--bw-text)] ${HTML}`}>
            <span dangerouslySetInnerHTML={{ __html: code }} />
            {note ? <span className="text-[15px] font-normal text-[var(--bw-muted)]" dangerouslySetInnerHTML={{ __html: ` ${dash(note)}` }} /> : null}
          </p>
        </div>
      ) : null}
      <div className={`min-w-0 ${hasEngine ? "border-l border-[var(--bw-line)] pl-6" : ""}`}>
        {!hasEngine ? <p className="mb-1.5 text-[16px] font-medium leading-tight" style={{ color }} dangerouslySetInnerHTML={{ __html: item.slot }} /> : null}
        <p
          className={`text-[15px] leading-[1.6] text-[var(--bw-muted)] ${HTML}`}
          dangerouslySetInnerHTML={{ __html: hasEngine ? quoteHtml(item.quote) : dash(item.quote) }}
        />
      </div>
      {hasEngine && hasWho ? (
        <p className={`min-w-0 border-l border-[var(--bw-line)] pl-6 text-[15px] leading-[1.5] text-[var(--bw-muted)] ${HTML}`}>
          <span className="font-medium" style={{ color }}>{UI.whoItsFor}</span>{" "}
          <span dangerouslySetInnerHTML={{ __html: dash(item.whoItsFor) }} />
        </p>
      ) : null}
    </article>
  );
}

/* ---------- Phones + tablets (below 1024px): the phone design, sizes = design px ÷ 8.62, capped ---------- */
function PhoneCard({ item, generationCode }) {
  const { tone, icon } = slotStyle(item.slot);
  const color = `var(--bw-${tone})`;
  const { code, note } = splitEngine(item);
  const hasEngine = hasText(code);
  return (
    <article
      className="overflow-hidden rounded-[min(1.4vw,12px)] border border-[var(--bw-line)] bg-[var(--bw-card)] [box-shadow:var(--bw-shadow)]"
      style={{ borderLeft: `max(0.5vw,3px) solid ${color}` }}
    >
      <div className="grid grid-cols-[min(24.5vw,190px)_minmax(0,1fr)] pb-[2.6vw] pr-[3vw] pt-[2.6vw]">
        <div className="flex flex-col items-start pl-[2.8vw]">
          <span style={{ color }}>
            <Icon name={icon} className="h-[min(5.2vw,40px)] w-[min(5.2vw,40px)]" />
          </span>
          {hasEngine ? (
            <EngineImage item={item} generationCode={generationCode} sizes="(max-width: 1024px) 20vw, 160px" className="ml-[1vw] mt-[1.6vw] h-[min(17vw,132px)] w-[min(18vw,140px)]" />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="flex items-start gap-[1vw]">
            <div className="min-w-0 flex-1">
              <p className="text-[min(2.3vw,18px)] font-medium leading-tight" style={{ color }} dangerouslySetInnerHTML={{ __html: item.slot }} />
              {hasEngine ? (
                <p className={`mt-[0.8vw] text-[min(3.2vw,24px)] font-semibold leading-snug text-[var(--bw-text)] ${HTML}`}>
                  <span dangerouslySetInnerHTML={{ __html: code }} />
                  {note ? <span className="text-[min(2vw,16px)] font-normal text-[var(--bw-muted)]" dangerouslySetInnerHTML={{ __html: `  ${dash(note)}` }} /> : null}
                </p>
              ) : null}
            </div>
            <Icon name="chevron" strokeWidth={2} className="mt-[3vw] h-[min(3vw,22px)] w-[min(2.4vw,18px)] shrink-0 text-[var(--bw-muted)]" />
          </div>
          <p
            className={`mt-[1.6vw] text-[min(1.95vw,16px)] leading-[1.6] text-[var(--bw-muted)] ${HTML}`}
            dangerouslySetInnerHTML={{ __html: hasEngine ? quoteHtml(item.quote) : dash(item.quote) }}
          />
          {hasText(item.whoItsFor) ? (
            <p className={`mt-[1.8vw] border-t border-[var(--bw-line)] pt-[1.8vw] text-[min(1.95vw,16px)] leading-[1.5] text-[var(--bw-text)] ${HTML}`}>
              <span className="font-medium" style={{ color }}>{UI.whoItsFor}</span>{" "}
              <span dangerouslySetInnerHTML={{ __html: dash(item.whoItsFor) }} />
            </p>
          ) : null}
        </div>
      </div>
      {item.modelWideNote ? (
        <p className={`mx-[0.8vw] mb-[0.8vw] flex items-center justify-center gap-[1vw] rounded-[min(0.8vw,8px)] bg-[var(--bw-note)] px-[2vw] py-[1.2vw] text-[min(2vw,16px)] leading-snug text-[var(--bw-muted)] ${HTML}`}>
          <Icon name="info" className="h-[min(2.6vw,20px)] w-[min(2.6vw,20px)] shrink-0 text-[var(--bw-blue)]" />
          <span dangerouslySetInnerHTML={{ __html: dash(item.modelWideNote) }} />
        </p>
      ) : null}
    </article>
  );
}

export default function BestWorstEngines({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const items = (data.items || []).filter(hasContent);
  if (!items.length) return null;

  const cards = items.filter((item) => !isWide(item));
  const wide = items.filter(isWide);
  // One row of up to five cards from 1440px (the design); narrower desktops and six or more cards go three to a row.
  const cols = cards.length <= 5 ? cards.length : 3;
  const vars = TONES[isDark ? "dark" : "light"];
  const heading = String(data.h2 || UI.eyebrow);

  return (
    <section
      style={vars}
      className={`relative w-full overflow-hidden bg-[var(--bw-bg)] text-[var(--bw-text)] [background-image:radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--bw-blue)_7%,transparent),transparent_60%)] ${sectionFont.className}`}
    >
      <div className="site-container relative pb-[5vw] pt-[4.4vw] max-lg:px-[3.5vw] lg:pb-14 lg:pt-12">
        <div className="max-lg:px-[0.9vw]">
          <p className="flex items-center gap-[1.4vw] text-[min(1.97vw,15px)] font-medium uppercase tracking-[0.1em] lg:gap-3 lg:text-[14px]">
            <span className="text-[var(--bw-head)]">{UI.sectionNumber}</span>
            <span aria-hidden="true" className="h-px w-[min(2.6vw,22px)] bg-[var(--bw-head)] opacity-60" />
            <span className="text-[var(--bw-blue)]">{UI.eyebrow}</span>
          </p>
          <h2
            className={`mt-[1.2vw] text-[min(5.3vw,44px)] font-semibold leading-[1.15] tracking-[-0.015em] text-[var(--bw-head)] lg:mt-2 lg:text-[34px] ${HTML}`}
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        </div>

        {/* Phones + tablets: one card per pick, stacked */}
        <div className="mt-[3vw] flex flex-col gap-[1.5vw] lg:hidden">
          {[...cards, ...wide].map((item, index) => (
            <PhoneCard key={`${item.slot}-${index}`} item={item} generationCode={data.generationCode} />
          ))}
        </div>

        {/* Desktop: the picks side by side, then the full-width rows */}
        <div className="hidden lg:block">
          {cards.length ? (
            <div
              className={`mt-6 grid gap-4 [grid-template-columns:var(--bw-cols)] ${cols > 3 ? "lg:max-[1439px]:grid-cols-3" : ""}`}
              style={{ "--bw-cols": `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {cards.map((item, index) => (
                <DesktopCard key={`${item.slot}-${index}`} item={item} generationCode={data.generationCode} />
              ))}
            </div>
          ) : null}
          {wide.length ? (
            <div className="mt-4 flex flex-col gap-4">
              {wide.map((item, index) => (
                <DesktopWide key={`${item.slot}-${index}`} item={item} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
