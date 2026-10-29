"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import CarOnBackground from "@/components/shared/CarOnBackground";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import ui from "@/data/shared/generationPageUi.json";

const UI = ui.overview;

// Colours sampled from the designs (dark); light mirrors them on white.
const TONES = {
  light: {
    "--ov-bg": "#ffffff",
    "--ov-card": "#ffffff",
    "--ov-line": "#e3e8ef",
    "--ov-text": "#0b1726",
    "--ov-muted": "#4a5565",
    "--ov-blue": "#0a5bd3",
    "--ov-shadow": "0 12px 32px rgba(10,26,43,0.07)",
  },
  dark: {
    "--ov-bg": "#0b1826",
    "--ov-card": "rgba(14,31,52,0.72)",
    "--ov-line": "rgba(255,255,255,0.14)",
    "--ov-text": "#ffffff",
    "--ov-muted": "rgba(255,255,255,0.82)",
    "--ov-blue": "#4d9bff",
    "--ov-shadow": "none",
  },
};

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";

// Desktop text column width from the design (755px at 1536); the picture fills the space to its left.
const TEXT_COL = "755px";

function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)/g, " — ");
}

// "Sibling body styles in this generation" -> "Sibling Body Styles in this Generation", as in the designs.
const SMALL_WORDS = new Set(["in", "this", "of", "the", "and", "a", "to", "for"]);
function titleCase(label = "") {
  return label
    .split(" ")
    .map((word, index) => (index && SMALL_WORDS.has(word.toLowerCase()) ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
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

// The enquiry count stands out (larger, blue) and [TAG]s are blue; years stay plain text.
function MarketLine({ text = "", figureClass }) {
  return String(text)
    .split(/(\[[^\]]+\]|\b\d[\d,]*\+?\b)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (/^\[[^\]]+\]$/.test(part)) return <span key={index} className="text-[var(--ov-blue)]">{part}</span>;
      if (/^\d[\d,]*\+?$/.test(part) && !/^(19|20)\d\d$/.test(part)) {
        return <span key={index} className={`font-medium text-[var(--ov-blue)] ${figureClass}`}>{part}</span>;
      }
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

// Blue disc with a target and dart, as drawn in the designs.
function TargetBadge({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#0a3f9c" stroke="#2f80ed" strokeWidth="1.5" />
      <circle cx="23" cy="25" r="13" fill="none" stroke="#9cc8ff" strokeWidth="3" />
      <circle cx="23" cy="25" r="7.5" fill="none" stroke="#ffffff" strokeWidth="3" />
      <circle cx="23" cy="25" r="2.6" fill="#9cc8ff" />
      <path d="m23 25 11-11" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m31 12 4.5-1.5L34 15l-3 .5z" fill="#ffffff" />
    </svg>
  );
}

// The picture: the page's own artwork when it has one (E90), else this generation's car on BMW's background.
function Art({ data, src, isDark, sizes, carClassName, imageClassName, priority = false }) {
  if (src) return <Image src={src} alt={data.art?.alt || ""} fill sizes={sizes} priority={priority} className={imageClassName} />;
  return (
    <CarOnBackground
      src={data.image}
      fit={data.imageFit}
      alt={String(data.h2 || "").replace(/<[^>]*>/g, "")}
      isDark={isDark}
      className="absolute inset-0"
      carClassName={carClassName}
      sizes={sizes}
    />
  );
}

export default function Overview({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const facts = parseKeyFacts(data.keyFacts);
  const paragraphs = introParagraphs(data.intro);
  const art = data.art;
  const wideSrc = art ? (isDark ? art.dark : art.light) : null;
  const tallSrc = art ? (isDark ? art.mobileDark : art.mobileLight) || wideSrc : null;
  const vars = TONES[isDark ? "dark" : "light"];

  // Phones and tablets follow the phone design (sizes are its px ÷ 10.24, the design being 1024px wide),
  // capped at the desktop sizes so tablets never outgrow the desktop layout.
  // Phones: key facts two to a row (four across squeezes the labels into each other); tablets up: one row.
  const factCols =
    facts.length === 4
      ? "grid-cols-2 gap-y-4 md:gap-y-0 md:grid-cols-[260fr_199fr_175fr_306fr] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.25fr)]"
      : "grid-cols-2 gap-y-4 md:grid-flow-col md:auto-cols-fr md:grid-cols-none md:gap-y-0";

  return (
    <section style={vars} className={`relative w-full overflow-hidden bg-[var(--ov-bg)] text-[var(--ov-text)] ${sectionFont.className}`}>
      {/* Desktop: the picture fills the space left of the text column at the design's scale (520px tall), standing on
          the section's bottom edge so the car's ground runs to the bottom as in the designs; only the sky fades into the page. */}
      <div
        className="absolute bottom-0 left-0 hidden h-[min(100%,520px)] [mask-image:linear-gradient(90deg,#000_72%,transparent_100%)] xl:block"
        style={{ right: `calc(max(var(--gutter), (100% - 88rem) / 2 + var(--gutter)) + ${TEXT_COL} + 16px)` }}
      >
        <Art
          data={data}
          src={wideSrc}
          isDark={isDark}
          sizes="(min-width: 1280px) 60vw, 100vw"
          carClassName="inset-x-[6%] top-[16%] bottom-[14%]"
          imageClassName="object-cover object-left"
        />
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,var(--ov-bg)_0%,transparent_100%)]" />
      </div>

      {/* Phones + tablets: the picture as a band across the top. The crop keeps a strip of ground under the tyres
          (the car stands on it), and only that ground fades into the page below. */}
      <div className="relative aspect-[1024/610] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,#000_88%,transparent_100%)] md:aspect-[2.2/1] xl:hidden">
        <Art
          data={data}
          src={tallSrc}
          isDark={isDark}
          sizes="100vw"
          carClassName="inset-x-[12%] top-[10%] bottom-[16%]"
          imageClassName="object-cover object-[50%_54%]"
        />
      </div>

      <div className="site-container relative max-xl:px-[5.86vw] xl:grid xl:grid-cols-[minmax(0,1fr)_755px] xl:gap-4 xl:pb-10 xl:pt-5">
        <div aria-hidden="true" className="hidden xl:block" />
        <div className="min-w-0 pb-[4vw] xl:pb-0">
          <p className="mt-[2.6vw] text-[clamp(14px,2.05vw,15px)] font-medium uppercase tracking-[0.03em] text-[var(--ov-blue)] xl:mt-0 xl:text-[15px]">
            {UI.eyebrow}
          </p>
          <h2
            className={`t-h2 mt-[1.5vw] font-bold tracking-[-0.02em] max-xl:text-[max(26px,min(5.86vw,var(--fs-h2)))] max-xl:leading-[1.15] xl:mt-2 xl:text-[46px] xl:leading-[1.15] ${HTML}`}
            dangerouslySetInnerHTML={{ __html: dash(data.h2) }}
          />
          {paragraphs.length ? (
            <div className={`mt-[2.2vw] flex max-w-[77vw] flex-col gap-[min(2.2vw,14px)] text-[clamp(16px,2.44vw,18px)] leading-[1.48] text-[var(--ov-muted)] xl:mt-4 xl:max-w-none xl:gap-3 xl:text-[17px] xl:leading-[1.35] ${HTML}`}>
              {paragraphs.map((html, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
            </div>
          ) : null}

          {facts.length ? (
            <div className="-mx-[1.76vw] mt-[3vw] rounded-[min(2.1vw,14px)] border border-[var(--ov-line)] bg-[var(--ov-card)] px-[3.1vw] pb-[2.6vw] pt-[3vw] [box-shadow:var(--ov-shadow)] xl:mx-0 xl:mt-5 xl:rounded-[14px] xl:px-7 xl:pb-5 xl:pt-5">
              <p className="text-[clamp(14px,2.05vw,15px)] font-medium uppercase tracking-[0.03em] text-[var(--ov-blue)] xl:text-[14px]">{UI.keyFacts}</p>
              <ul className={`mt-[2vw] grid ${factCols} xl:mt-3`}>
                {facts.map((fact, index) => (
                  <li
                    key={`${fact.label}-${index}`}
                    className={`flex min-w-0 flex-col items-center px-[1.2vw] text-center xl:flex-row xl:items-center xl:gap-2 xl:px-3 xl:text-left xl:first:pl-0 ${
                      index % 2 ? "border-l border-[var(--ov-line)]" : index ? "border-[var(--ov-line)] md:border-l" : ""
                    }`}
                  >
                    <span className="text-[var(--ov-blue)] [[data-theme=dark]_&]:xl:text-white">
                      <Icon name={factIcon(fact.label)} className="h-[min(5.9vw,44px)] w-[min(5.9vw,44px)] shrink-0 xl:h-[30px] xl:w-[30px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="mt-[1.4vw] block text-[clamp(15px,2.15vw,16px)] font-semibold leading-[1.3] xl:mt-0 xl:text-[15px]">{titleCase(fact.label)}</span>
                      <span
                        className={`mt-[0.8vw] block text-[clamp(14px,1.95vw,15px)] leading-[1.45] text-[var(--ov-muted)] xl:mt-0.5 xl:text-[14px] xl:leading-[1.35] ${HTML}`}
                        dangerouslySetInnerHTML={{ __html: dash(fact.value) }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {data.marketIntelligenceLine ? (
            <div className="-mx-[1.76vw] mt-[1.6vw] flex items-center gap-[3.4vw] rounded-[min(2.1vw,14px)] border border-[var(--ov-line)] bg-[var(--ov-card)] px-[2.7vw] py-[2.6vw] [box-shadow:var(--ov-shadow)] xl:mx-0 xl:mt-3 xl:gap-4 xl:rounded-[14px] xl:px-4 xl:py-4">
              <TargetBadge className="h-[min(10.35vw,56px)] w-[min(10.35vw,56px)] shrink-0 xl:h-[46px] xl:w-[46px]" />
              <div className="min-w-0">
                <p className="text-[clamp(14px,2.05vw,15px)] font-medium uppercase tracking-[0.03em] text-[var(--ov-blue)] xl:text-[14px]">{UI.marketIntelligence}</p>
                <p className="mt-[0.6vw] text-[clamp(15px,2.25vw,17px)] leading-[1.5] xl:mt-1 xl:text-[17px] xl:leading-[1.45]">
                  <MarketLine text={dash(data.marketIntelligenceLine)} figureClass="text-[clamp(16px,3.1vw,24px)] xl:text-[22px]" />
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
