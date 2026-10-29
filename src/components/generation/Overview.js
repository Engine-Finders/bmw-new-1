"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import ui from "@/data/shared/generationPageUi.json";

const UI = ui.overview;

// Colours sampled from the designs (dark); light mirrors the same design on white.
const TONES = {
  light: {
    "--ov-bg": "#ffffff",
    "--ov-card": "#ffffff",
    "--ov-line": "#e3e8ef",
    "--ov-divider": "#e3e8ef",
    "--ov-text": "#0b1726",
    "--ov-muted": "#4a5565",
    "--ov-blue": "#0a52cc",
    "--ov-shadow": "0 12px 32px rgba(10,26,43,0.07)",
  },
  dark: {
    "--ov-bg": "#000f20",
    "--ov-card": "#011223",
    "--ov-line": "#2e3a4b",
    "--ov-divider": "#28374a",
    "--ov-text": "#ffffff",
    "--ov-muted": "rgba(255,255,255,0.84)",
    "--ov-blue": "#2a7fe8",
    "--ov-shadow": "none",
  },
};

// The page's own phone artwork (e.g. /e90/overview_mobile_dark.webp): its size, and where the car sits in it
// (fractions of its width/height). Phones frame it as the design does: the car spans 12%→77% of the screen with
// its roof 7.5% below the top of the band.
const OWN_ART = { ratio: 1442 / 1248, car: { left: 0.03, right: 0.92, top: 0.238 } };
const PHONE_CAR = { left: 0.12, right: 0.77, top: 0.075 };

// The artwork is narrower than the screen at this scale, so each side is filled by stretching the artwork's own
// outermost strip (sky, skyline, water, ground all run horizontally) out to the screen edge, under the artwork's
// faded edge.
function ownArtFrame(src) {
  const { ratio, car } = OWN_ART;
  const width = (PHONE_CAR.right - PHONE_CAR.left) / (car.right - car.left);
  const left = PHONE_CAR.left - car.left * width;
  const right = 1 - left - width;
  const height = width / ratio;
  const pct = (value) => `${(value * 100).toFixed(2)}%`;
  const box = { top: 0, aspectRatio: String(ratio), marginTop: pct(-(car.top * height - PHONE_CAR.top)) };
  // The fillers' boxes keep the artwork's height (same aspect ratio rule as the artwork, scaled by width).
  const strip = 0.02;
  // Each filler runs in under the artwork as far as the artwork's edge fade starts, so no seam shows through it.
  const filler = (side, size, under) => ({
    ...box,
    [side]: 0,
    width: pct(size + under),
    aspectRatio: `${(size + under) / width} / ${1 / ratio}`,
    backgroundImage: `url("${src}")`,
    backgroundRepeat: "no-repeat",
    // The strip spans the filler: the whole artwork drawn 1/strip times the filler's width.
    backgroundSize: `${(100 / strip).toFixed(0)}% 100%`,
    backgroundPosition: side,
  });
  // The artwork's own edges fade into the fillers, just outside the car's nose and tail.
  const mask = `linear-gradient(to right, transparent 0%, #000 ${pct(car.left + 0.01)}, #000 ${pct(car.right + 0.015)}, transparent 100%)`;
  return {
    art: { ...box, left: pct(left), width: pct(width), maskImage: mask, WebkitMaskImage: mask },
    fillLeft: left > 0 ? filler("left", left, (car.left + 0.015) * width) : null,
    fillRight: right > 0 ? filler("right", right, (1 - car.right - 0.005) * width) : null,
  };
}

// Pages without their own artwork get the E90 artwork's city scene with its car taken out (skyline, water, tarmac,
// M stripes; a mirrored 300px strip added on the left so phones have scenery left of the car). The generation's
// three-quarter photo stands where the E90 stands: `car` is that box (fractions of the plate), `ext` the added strip.
const CITY = {
  dark: {
    src: "/generation/overview/city-dark.webp",
    ratio: 2540 / 1248,
    ext: 300 / 2540,
    car: { left: 0.134, right: 0.644, top: 0.235 },
    carClassName: "left-[13.4%] right-[35.6%] top-[23.5%] bottom-[23.2%]",
  },
  light: {
    src: "/generation/overview/city-light.webp",
    ratio: 2472 / 1280,
    ext: 300 / 2472,
    car: { left: 0.1355, right: 0.684, top: 0.235 },
    carClassName: "left-[13.55%] right-[31.6%] top-[23.5%] bottom-[22.6%]",
  },
};

// Phones: the plate scaled so its car spans PHONE_CAR, as the page's own phone artwork is framed.
function cityFrame({ ratio, car }) {
  const width = (PHONE_CAR.right - PHONE_CAR.left) / (car.right - car.left);
  const pct = (value) => `${(value * 100).toFixed(2)}%`;
  return {
    top: 0,
    left: pct(PHONE_CAR.left - car.left * width),
    width: pct(width),
    aspectRatio: String(ratio),
    marginTop: pct(-(car.top * (width / ratio) - PHONE_CAR.top)),
  };
}

// The page's own desktop artwork (e.g. /e90/overview_dark.webp) is 2.53:1, its car in the left 42%.
const OWN_WIDE_RATIO = 3156 / 1248;

// Desktop: the scene runs from the box's left edge, as tall as the section, but never so tall that the car's tail
// (≈1.07× the scene height from the left) runs past ~80% of the box into the fade, as it would beside the
// fixed-width text column at 1280–1500px. A shorter scene sits level with the copy; its sky and ground fade into
// the page.
function DesktopScene({ ratio, ext = 0, children }) {
  return (
    <div
      className="absolute left-0 top-1/2 h-[min(100%,76cqw)] -translate-y-1/2"
      style={{ aspectRatio: String(ratio), transform: ext ? `translateX(-${(ext * 100).toFixed(2)}%)` : undefined }}
    >
      {children}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[18%] bg-[linear-gradient(180deg,var(--ov-bg)_0%,transparent_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[12%] bg-[linear-gradient(0deg,var(--ov-bg)_0%,transparent_100%)]" />
    </div>
  );
}

function CityScene({ data, isDark, phone = false }) {
  const city = CITY[isDark ? "dark" : "light"];
  const scene = (
    <CarOnBackground
      src={data.image}
      fit={data.imageFit}
      alt={String(data.h2 || "").replace(/<[^>]*>/g, "")}
      isDark={isDark}
      background={city.src}
      className="absolute inset-0"
      bgClassName="object-cover"
      carClassName={city.carClassName}
      sizes={phone ? "130vw" : "(min-width: 1280px) 1400px, 100vw"}
    />
  );
  if (!phone) return <DesktopScene ratio={city.ratio} ext={city.ext}>{scene}</DesktopScene>;
  return (
    <div className="absolute" style={cityFrame(city)}>
      {scene}
    </div>
  );
}

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";

// Desktop text column width from the design (755px at 1536); the picture fills the space to its left.
const TEXT_COL = "755px";

function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)/g, " — ");
}

// "Sibling body styles in this generation" -> "Sibling Body Styles in this Generation", as in the designs;
// "in this Generation" stays together so it drops to its own line on phones.
const SMALL_WORDS = new Set(["in", "this", "of", "the", "and", "a", "to", "for"]);
function titleCase(label = "") {
  return label
    .split(" ")
    .map((word, index) => (index && SMALL_WORDS.has(word.toLowerCase()) ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ")
    .replace(/ in this (\S+)$/, " in\u00a0this\u00a0$1");
}

// Desktop drops the "in this Generation" tail ("Sibling Body Styles"), as in the desktop design.
const shortLabel = (label = "") => titleCase(label).replace(/\s+in\u00a0this\u00a0\S+$/, "");

// "BMW 3 Series E46" on the 3 Series E90 page -> "E46"; "BMW M3 (E46)" on an M3 page -> "E46".
// Other models' names ("BMW 3 Series Compact" on a 1 Series page) are kept in full.
function shortRelative(value = "", model = "") {
  if (!model || !value.startsWith(`${model} `)) return value;
  const rest = value.slice(model.length + 1).trim();
  if (/^(Compact|Touring|Coup|Convertible|Gran|Active)/i.test(rest)) return value;
  return rest.replace(/^\(([^)]+)\)(.*)$/, "$1$2");
}

// "BMW E9x (shared with E91 Touring, E92 Coupé, E93 Convertible)" -> main + "(…)" on its own line(s). On desktop,
// when every shared body is already listed under the sibling styles, only their codes are kept: "(E91, E92, E93)".
function splitPlatform(value = "", siblings = "") {
  const match = value.match(/^(.*?)\s*(\(.*\))\s*$/);
  if (!match) return { main: value, paren: "", short: "" };
  const shared = match[2].match(/^\(shared with (.+)\)$/i);
  const bodies = shared ? shared[1].split(/,\s*/) : [];
  const listed = bodies.length && bodies.every((body) => siblings.includes(body));
  return { main: match[1], paren: match[2], short: listed ? `(${bodies.map((body) => body.split(" ")[0]).join(", ")})` : match[2] };
}

function parseKeyFacts(keyFacts) {
  if (Array.isArray(keyFacts)) return keyFacts;
  if (typeof keyFacts !== "string" || !keyFacts.trim()) return [];
  return keyFacts
    .split(" • ")
    .map((chunk) => chunk.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((chunk) => {
      const index = chunk.indexOf(":");
      return index === -1 ? { label: chunk, value: "" } : { label: chunk.slice(0, index).trim(), value: chunk.slice(index + 1).trim() };
    });
}

// Intro in two paragraphs, split at the middle sentence (3 sentences -> 2 + 1, as in the designs).
function introParagraphs(intro = "") {
  const sentences = dash(intro).trim().split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
  if (sentences.length < 2) return sentences;
  const cut = Math.ceil(sentences.length / 2);
  return [sentences.slice(0, cut).join(" "), sentences.slice(cut).join(" ")];
}

// The enquiry count ("256 real UK engine enquiries", "380+ …") stands out (larger, blue) and [TAG]s are blue;
// other figures ("F30 3 Series", "2.0-litre", years) stay plain text.
const COUNT = /(\[[^\]]+\]|\b\d[\d,]*\+?(?=\s+(?:real\s+)?(?:UK\s+)?(?:engine\s+)?(?:replacement\s+)?enquir))/gi;
function MarketLine({ text = "", figureClass }) {
  return String(text)
    .split(COUNT)
    .filter(Boolean)
    .map((part, index) => {
      if (/^\[[^\]]+\]$/.test(part)) return <span key={index} className="whitespace-nowrap text-[var(--ov-blue)]">{part}</span>;
      if (/^\d[\d,]*\+?$/.test(part)) return <span key={index} className={`font-semibold text-[var(--ov-blue)] ${figureClass}`}>{part}</span>;
      return <span key={index}>{part}</span>;
    });
}

const PATHS = {
  car: (
    <>
      <path d="M4.5 11 6.4 6.3A2.2 2.2 0 0 1 8.4 5h7.2a2.2 2.2 0 0 1 2 1.3l1.9 4.7" />
      <path d="M3 12.6A1.6 1.6 0 0 1 4.6 11h14.8a1.6 1.6 0 0 1 1.6 1.6V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M5.5 18v1.6M18.5 18v1.6M6.5 14.5h2M15.5 14.5h2M3 11 1.8 10M21 11l1.2-1" />
    </>
  ),
  arrow: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M7.5 12h9m-3.5-3.5L16.5 12 13 15.5" />
    </>
  ),
};

function Icon({ name, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

const factIcon = (label = "") => (/predecessor|successor/i.test(label) ? "arrow" : "car");

// Navy disc with a thin blue rim, a thick blue ring, a pale bullseye and a dart, as drawn in the designs.
function TargetBadge({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22.6" fill="#05162e" stroke="#2f80f0" strokeWidth="1.6" />
      <circle cx="23" cy="25" r="11.5" fill="none" stroke="#2a74e6" strokeWidth="4.6" />
      <circle cx="23" cy="25" r="5" fill="#d8e7ff" />
      <circle cx="23" cy="25" r="1.4" fill="#2a74e6" />
      <path d="m23 25 11.5-11.5" stroke="#cfe0ff" strokeWidth="2" strokeLinecap="round" />
      <path d="m33 15 1.2-5.2 2.4 2.6 2.6 2.4-5.2 1.2z" fill="#4d93ff" />
    </svg>
  );
}

function OwnArt({ src, alt }) {
  const frame = ownArtFrame(src);
  return (
    <>
      {frame.fillLeft ? <div aria-hidden="true" className="absolute" style={frame.fillLeft} /> : null}
      {frame.fillRight ? <div aria-hidden="true" className="absolute" style={frame.fillRight} /> : null}
      <div className="absolute" style={frame.art}>
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 80vw, 90vw" className="object-cover" />
      </div>
      {/* The sky fades in from the top and the band's sides recede, across artwork and fillers alike. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[38%] bg-[linear-gradient(180deg,var(--ov-bg)_0%,transparent_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,var(--ov-bg)_0%,transparent_14%,transparent_84%,var(--ov-bg)_100%)] opacity-70" />
    </>
  );
}

export default function Overview({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const facts = parseKeyFacts(data.keyFacts);
  const paragraphs = introParagraphs(data.intro);
  const art = data.art;
  // A theme without its own artwork uses the other theme's (same design, the page colours change around it).
  const wideSrc = art ? (isDark ? art.dark || art.light : art.light || art.dark) || null : null;
  const tallSrc = art ? (isDark ? art.mobileDark || art.mobileLight : art.mobileLight || art.mobileDark) || null : null;
  const vars = TONES[isDark ? "dark" : "light"];
  // "BMW 3 Series E90 - Overview" -> "BMW 3 Series", to shorten "BMW 3 Series E46" to "E46" in the key facts.
  const model = String(data.h2 || "").replace(/<[^>]*>/g, "").split(/\s+[-—–]\s*/)[0].trim().split(" ").slice(0, -1).join(" ");
  const siblings = facts.find((fact) => /sibling/i.test(fact.label))?.value || "";

  // Tablets follow the phone design (sizes are its px ÷ 7.8 at 390px, as vw), capped at the desktop sizes so they
  // never outgrow the desktop layout. Phones keep its layout at readable sizes (copy 15px, never under 13px),
  // so the key facts sit two by two there.
  const factCols = facts.length === 4 ? "max-md:grid-cols-2 grid-cols-[260fr_199fr_175fr_306fr] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,0.95fr)_minmax(0,1.6fr)]" : "max-md:grid-cols-2 md:grid-flow-col md:auto-cols-fr";

  return (
    <section style={vars} className={`relative w-full overflow-hidden bg-[var(--ov-bg)] text-[var(--ov-text)] ${sectionFont.className}`}>
      {/* Desktop: the picture fills the space left of the text column, the section's full height, with its ground
          running to the bottom as in the designs; only the sky fades into the page. The page's own artwork (E90),
          else the same city scene with this generation's car where the E90 stands. */}
      <div
        className="absolute inset-y-0 left-0 hidden overflow-hidden [container-type:inline-size] [mask-image:linear-gradient(90deg,#000_72%,transparent_100%)] xl:block"
        style={{ right: `calc(max(var(--gutter), (100% - 88rem) / 2 + var(--gutter)) + ${TEXT_COL} + 16px)` }}
      >
        {wideSrc ? (
          <DesktopScene ratio={OWN_WIDE_RATIO}>
            <Image src={wideSrc} alt={art?.alt || ""} fill sizes="(min-width: 1280px) 1500px, 100vw" className="object-cover object-left" />
          </DesktopScene>
        ) : (
          <CityScene data={data} isDark={isDark} />
        )}
      </div>

      {/* Phones + tablets: the picture as a band across the top, the car a little left of centre (12%→77% of the
          width) as in the phone design; the band's ground fades into the page under the tyres. */}
      <div className="relative aspect-[100/44] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,#000_88%,transparent_100%)] xl:hidden">
        {tallSrc ? (
          <OwnArt src={tallSrc} alt={art.alt || ""} />
        ) : wideSrc ? (
          <Image src={wideSrc} alt={art?.alt || ""} fill sizes="100vw" className="object-cover object-[20%_55%]" />
        ) : (
          <>
            <CityScene data={data} isDark={isDark} phone />
            {/* Same finish as the page's own phone artwork: the sky fades in from the top, the sides recede. */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[38%] bg-[linear-gradient(180deg,var(--ov-bg)_0%,transparent_100%)]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,var(--ov-bg)_0%,transparent_14%,transparent_84%,var(--ov-bg)_100%)] opacity-70" />
          </>
        )}
      </div>

      <div className="site-container relative max-xl:px-[5.86vw] xl:grid xl:grid-cols-[minmax(0,1fr)_755px] xl:gap-4 xl:pb-9 xl:pt-4">
        <div aria-hidden="true" className="hidden xl:block" />
        <div className="min-w-0 pb-[4vw] max-md:pb-8 xl:pb-0">
          <p className="mt-[1.4vw] text-[min(2.05vw,15px)] font-medium max-md:mt-2 max-md:text-[13px] uppercase tracking-[0.03em] text-[var(--ov-blue)] xl:mt-0 xl:text-[15px]">
            {UI.eyebrow}
          </p>
          <h2
            className={`t-h2 mt-[1.2vw] font-bold tracking-[-0.02em] max-xl:text-[min(5.6vw,var(--fs-h2))] max-xl:leading-[1.15] max-md:mt-1.5 max-md:text-[clamp(26px,7.2vw,30px)] max-md:leading-[1.15] xl:mt-2 xl:text-[46px] xl:leading-[1.15] ${HTML}`}
            dangerouslySetInnerHTML={{ __html: dash(data.h2) }}
          />
          {paragraphs.length ? (
            <div className={`mt-[2vw] flex max-w-[79.5vw] flex-col gap-[min(2vw,14px)] text-[min(2.36vw,18px)] leading-[1.55] tracking-[-0.025em] text-[var(--ov-muted)] max-md:mt-3 max-md:max-w-none max-md:gap-3 max-md:text-[15px] max-md:leading-[1.6] max-md:tracking-normal xl:mt-3 xl:max-w-none xl:gap-2.5 xl:text-[16.5px] xl:leading-[1.33] xl:tracking-normal ${HTML}`}>
              {paragraphs.map((html, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
            </div>
          ) : null}

          {facts.length ? (
            <div className="-mx-[1.76vw] mt-[4.4vw] rounded-[min(2.1vw,14px)] border border-[var(--ov-line)] bg-[var(--ov-card)] px-[2.4vw] pb-[2.8vw] pt-[3vw] [box-shadow:var(--ov-shadow)] max-md:mt-6 max-md:rounded-[12px] max-md:px-4 max-md:pb-2 max-md:pt-4 xl:mx-0 xl:mt-4 xl:rounded-[14px] xl:px-7 xl:pb-4 xl:pt-4">
              <p className="text-[min(2.05vw,15px)] font-medium uppercase tracking-[0.03em] text-[var(--ov-blue)] max-md:text-[13px] xl:text-[14px]">{UI.keyFacts}</p>
              <ul className={`mt-[2.8vw] grid ${factCols} max-md:mt-1 xl:mt-3`}>
                {facts.map((fact, index) => {
                  const platform = /platform/i.test(fact.label) ? splitPlatform(dash(fact.value), siblings) : null;
                  const value = /predecessor|successor/i.test(fact.label) ? shortRelative(dash(fact.value), model) : dash(fact.value);
                  return (
                    <li
                      key={`${fact.label}-${index}`}
                      className={`flex min-w-0 flex-col items-center px-[1.2vw] text-center max-md:px-2 max-md:py-4 xl:flex-row xl:items-center xl:gap-3 xl:px-3 xl:text-left xl:first:pl-0 ${
                        index ? "border-l border-[var(--ov-divider)]" : ""
                      } ${index % 2 ? "" : "max-md:border-l-0"} ${index >= 2 ? "max-md:border-t max-md:border-t-[var(--ov-divider)]" : ""}`}
                    >
                      <span className="text-[var(--ov-blue)] [[data-theme=dark]_&]:xl:text-white">
                        <Icon name={factIcon(fact.label)} className="h-[min(7.8vw,44px)] w-[min(7.8vw,44px)] shrink-0 max-md:h-8 max-md:w-8 xl:h-[30px] xl:w-[30px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="mt-[1.6vw] block text-[min(2.3vw,16px)] font-semibold leading-[1.3] max-md:mt-2 max-md:text-[15px] xl:mt-0 xl:text-[15px]">
                          <span className="xl:hidden">{titleCase(fact.label)}</span>
                          <span className="hidden xl:inline">{shortLabel(fact.label)}</span>
                        </span>
                        {platform ? (
                          <span className={`mt-[0.8vw] block text-[min(1.9vw,15px)] leading-[1.45] text-[var(--ov-muted)] max-md:mt-1 max-md:text-[13.5px] [overflow-wrap:anywhere] xl:mt-0.5 xl:text-[13px] xl:leading-[1.4] ${HTML}`}>
                            <span className="block" dangerouslySetInnerHTML={{ __html: platform.main }} />
                            {platform.paren ? (
                              <>
                                <span className="block xl:hidden" dangerouslySetInnerHTML={{ __html: platform.paren }} />
                                <span className="hidden xl:block" dangerouslySetInnerHTML={{ __html: platform.short }} />
                              </>
                            ) : null}
                          </span>
                        ) : (
                          <span
                            className={`mt-[0.8vw] block text-[min(1.9vw,15px)] leading-[1.45] text-[var(--ov-muted)] max-md:mt-1 max-md:text-[13.5px] [overflow-wrap:anywhere] xl:mt-0.5 xl:text-[13px] xl:leading-[1.4] ${HTML}`}
                            dangerouslySetInnerHTML={{ __html: value }}
                          />
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {data.marketIntelligenceLine ? (
            <div className="-mx-[1.76vw] mt-[1.7vw] flex items-center gap-[3.4vw] rounded-[min(2.1vw,14px)] border border-[var(--ov-line)] bg-[var(--ov-card)] px-[2.7vw] py-[2.8vw] [box-shadow:var(--ov-shadow)] max-md:mt-3 max-md:items-start max-md:gap-3.5 max-md:rounded-[12px] max-md:p-4 xl:mx-0 xl:mt-3 xl:gap-4 xl:rounded-[14px] xl:px-4 xl:py-3">
              <TargetBadge className="h-[min(10.35vw,56px)] w-[min(10.35vw,56px)] shrink-0 max-md:h-12 max-md:w-12 xl:h-[46px] xl:w-[46px]" />
              <div className="min-w-0">
                <p className="text-[min(2.05vw,15px)] font-medium uppercase tracking-[0.03em] text-[var(--ov-blue)] max-md:text-[13px] xl:text-[14px]">{UI.marketIntelligence}</p>
                <p className="mt-[0.6vw] text-[min(2.3vw,17px)] leading-[1.48] tracking-[-0.015em] max-md:mt-1 max-md:text-[15px] max-md:leading-[1.55] max-md:tracking-normal xl:mt-1 xl:text-[16px] xl:leading-[1.45] xl:tracking-[-0.01em]">
                  <MarketLine text={dash(data.marketIntelligenceLine)} figureClass="text-[min(3.4vw,24px)] max-md:text-[21px] xl:text-[22px]" />
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
