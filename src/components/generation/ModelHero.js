"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import { variantFont as heroFont } from "@/components/variant/variantFont";
import ui from "@/data/shared/generationPageUi.json";

// Hero backgrounds sampled from the designs: a near-white wash in light, deep navy in dark.
const HERO_BG = { light: "#fafcfe", dark: "#010d1c" };

// Phones frame every hero the same way (as in the phone designs): the car spans 16%→100% of the screen,
// its wheels stand on the CTA and its roof clears the copy by 2%. `car` is where the car sits inside each
// kind of art, as fractions of the art's width/height.
const PHONE_ART = {
  // The page's own portrait artwork (e.g. /e90/hero_mobile_day.webp).
  own: { ratio: 1486 / 1686, car: { left: 0.04, right: 0.939, top: 0.371, bottom: 0.795 } },
  // BMW's stage scene: one car right of centre, 33–72% down. Its bright sky fades in late, behind the
  // last line of copy at most, so blue figures there stay readable.
  stage: { ratio: 3 / 2, car: { left: 0.446, right: 0.95, top: 0.335, bottom: 0.728 }, skyFrom: 0.7 },
  // The model's line-up: framed on its newest cars (right of frame, 50–87% down). Its busy skyline
  // only fades in just above the cars so it never sits behind the copy.
  lineup: { ratio: 16 / 9, car: { left: 0.423, right: 0.997, top: 0.5, bottom: 0.87 }, skyFrom: 0.6 },
};
const PHONE_CAR = { left: 0.162, right: 1, gap: 0.02 };

function phoneFrame({ ratio, car, skyFrom = 0 }) {
  const width = (PHONE_CAR.right - PHONE_CAR.left) / (car.right - car.left);
  const left = PHONE_CAR.left - car.left * width;
  const height = width / ratio;
  const roof = car.top * height;
  const wheels = car.bottom * height;
  const pct = (value) => `${(value * 100).toFixed(2)}%`;
  // Sky fades in behind the last lines of copy; the ground fades out behind the CTA.
  const sky = (share) => pct(car.top * (skyFrom + (1 - skyFrom) * share));
  const fadeY = `linear-gradient(to bottom, transparent ${sky(0)}, rgba(0,0,0,.3) ${sky(0.6)}, rgba(0,0,0,.85) ${sky(1)}, #000 ${pct(car.top + 0.05)}, #000 ${pct(car.bottom)}, transparent ${pct(car.bottom + 0.06)})`;
  // Art that starts inside the screen fades in from its left edge instead of showing a seam.
  const fadeX = left > 0 ? `linear-gradient(to right, transparent 0%, #000 ${pct(0.22 / width)})` : "linear-gradient(#000, #000)";
  const mask = `${fadeY}, ${fadeX}`;
  return {
    band: { aspectRatio: `1 / ${(wheels - roof + PHONE_CAR.gap).toFixed(4)}` },
    art: {
      left: pct(left),
      width: pct(width),
      aspectRatio: String(ratio),
      marginTop: pct(-(roof - PHONE_CAR.gap)),
      maskImage: mask,
      WebkitMaskImage: mask,
      maskComposite: "intersect",
      WebkitMaskComposite: "source-in",
    },
  };
}

// Line icons as drawn in the designs (24px grid, currentColor).
const ICONS = {
  bars: (
    <>
      <rect x="3" y="13" width="4.2" height="8" rx="0.8" fill="currentColor" stroke="none" />
      <rect x="9.9" y="8.5" width="4.2" height="12.5" rx="0.8" fill="currentColor" stroke="none" />
      <rect x="16.8" y="4" width="4.2" height="17" rx="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  // Crossed wrench + screwdriver, scaled to the ~18-unit footprint of the bars/book/trophy;
  // the stroke is compensated so it keeps the same weight.
  tools: (
    <g transform="translate(-1.8 -1.8) scale(1.15)" strokeWidth="1.48">
      <path d="M15.6 4.2a3.6 3.6 0 0 0-3.4 4.7L4.6 16.5a1.6 1.6 0 0 0 2.3 2.3l7.6-7.6a3.6 3.6 0 0 0 4.7-3.4l-2 2-2.1-.6-.6-2.1z" />
      <path d="m4.5 5.5 1-1 2.2 1.3 4.6 4.6M12.6 12.6l1.2-1.2 5.8 5.8a.85.85 0 0 1 0 1.2l-1.2 1.2a.85.85 0 0 1-1.2 0z" />
    </g>
  ),
  book: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M6 3h12v6a6 6 0 0 1-12 0z" />
      <path d="M12 15v3M8 21h8M9 21l1-3h4l1 3" />
    </>
  ),
  trophyStar: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M6 3h12v6a6 6 0 0 1-12 0z" fill="currentColor" />
      <path d="m12 5.6.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 7.7l2-.3z" fill="var(--hero-icon-cut)" stroke="none" />
      <path d="M12 15v3M8 21h8M9 21l1-3h4l1 3" />
    </>
  ),
  car: (
    <>
      <path d="M5 11 6.6 6.6A2 2 0 0 1 8.5 5.3h7a2 2 0 0 1 1.9 1.3L19 11" />
      <path d="M3.5 11.5A1.5 1.5 0 0 1 5 11h14a1.5 1.5 0 0 1 1.5 1.5V17a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
      <path d="M6 18v1.5M18 18v1.5M7 14.5h1.5M15.5 14.5H17" />
    </>
  ),
  engine: (
    <>
      <path d="M8 6h6M11 6v2.5" />
      <path d="M5.5 8.5h9l2 2h2v-1.5h2.5v7H18.5V14.5h-2l-2.5 3.5H8.5L6 15.5H4.5v-5h1z" fill="currentColor" />
      <path d="M2 11v4" />
    </>
  ),
  carFront: (
    <>
      <path d="M5 11 6.6 6.6A2 2 0 0 1 8.5 5.3h7a2 2 0 0 1 1.9 1.3L19 11" />
      <path d="M3.5 11.5A1.5 1.5 0 0 1 5 11h14a1.5 1.5 0 0 1 1.5 1.5V17a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
      <path d="M7 14.5h1.5M15.5 14.5H17" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

// Trust strip order is the same on every generation page: enquiries, body style, engine codes, Engine Finders.
// Desktop and phone designs draw different glyphs for the middle two.
const STAT_ICONS = {
  desktop: ["bars", "tools", "book", "trophy"],
  phone: ["bars", "car", "engine", "trophyStar"],
};

// "BMW 3 Series E90 Engines -The Complete UK Guide" -> "… Engines — The Complete UK Guide".
function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)/g, " — ");
}

// One paragraph per sentence, as in the designs.
function paragraphs(html = "") {
  return dash(html)
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .filter(Boolean);
}

// Enquiry counts ("256+") and data tags ("[BMW-VERIFIED]") in blue; markup is left alone.
function highlight(html = "") {
  return html
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith("<")
        ? part
        : part.replace(
            /(\d[\d,]*\+|\[[^\]]+\])/g,
            (match) =>
              `<span class="whitespace-nowrap text-[var(--hero-blue)]${match.startsWith("[") ? "" : " font-semibold lg:font-normal"}">${match}</span>`,
          ),
    )
    .join("");
}

function splitTagPill(tagPill = "") {
  return String(tagPill).split(" • ").filter(Boolean);
}

// "256+ E90 Enquiries (2025) [BMW-VERIFIED]" -> value / label / tag; "Part of Engine Finders" -> lead / label.
function splitStat(label = "") {
  const tagMatch = label.match(/\s*\[([^\]]+)\]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  const text = (tagMatch ? label.slice(0, tagMatch.index) : label).trim();
  const [first, ...rest] = text.split(" ");
  // A leading count is the figure ("256+", "7"), unless it is part of the model name ("3 Series Enquiries").
  if (/^\d[\d,]*\+?$/.test(first) && rest.length && rest[0] !== "Series") return { value: first, label: rest.join(" "), tag, lead: "" };
  const lead = text.match(/^(Part of)\s+(.+)$/i);
  if (lead) return { value: "", lead: lead[1], label: lead[2], tag };
  // Long body lists ("Saloon/Coupé/Convertible") may break after each slash.
  return { value: "", lead: "", label: text.replace(/\//g, "/​"), tag };
}

// Thin three-colour M rule under the headline, slanted at both ends like the M stripes.
function MRule() {
  return (
    <span aria-hidden="true" className="ml-[2px] mt-3.5 flex h-[3px] w-[88px] -skew-x-[35deg] md:mt-6 md:w-[120px]">
      <span className="w-[27%] bg-[#0773f9]" />
      <span className="w-[26%] bg-[#03339a]" />
      <span className="w-[47%] bg-[#f40715]" />
    </span>
  );
}

function DesktopStrip({ items, isDark }) {
  return (
    <ul
      className={`mt-10 hidden w-full max-w-[1120px] grid-cols-4 rounded-[10px] border lg:grid ${
        isDark
          ? "border-white/15 bg-[rgba(11,24,38,0.72)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          : "border-white/80 bg-white/85 shadow-[0_10px_30px_rgba(10,26,43,0.08)]"
      } backdrop-blur-md`}
    >
      {items.map((item, index) => {
        const stat = splitStat(item.label);
        return (
          <li key={item.label} className="relative flex min-w-0 items-center gap-4 px-6 py-6 xl:gap-5 xl:px-8">
            {index ? <span aria-hidden="true" className={`absolute left-0 top-1/2 h-[56%] w-px -translate-y-1/2 ${isDark ? "bg-white/15" : "bg-[#dfe4eb]"}`} /> : null}
            <Icon name={STAT_ICONS.desktop[index] || "bars"} strokeWidth={1.7} className={`h-10 w-10 shrink-0 xl:h-11 xl:w-11 ${isDark ? "text-white" : "text-[var(--hero-blue)]"}`} />
            <div className="min-w-0 text-[var(--hero-text)]">
              {stat.value ? (
                <>
                  <strong className="block text-[24px] font-medium leading-[1.15]">{stat.value}</strong>
                  <span className="block text-[15px] leading-[1.45]">{stat.label}</span>
                </>
              ) : stat.lead ? (
                <>
                  <span className="block text-[15px] leading-[1.45]">{stat.lead}</span>
                  <strong className="block text-[20px] font-semibold leading-[1.25]">{stat.label}</strong>
                </>
              ) : (
                <strong className="block text-[20px] font-semibold leading-[1.25]">{stat.label}</strong>
              )}
              {stat.tag ? <span className="block text-[15px] leading-[1.45] text-[var(--hero-blue)]">[{stat.tag}]</span> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function PhoneStrip({ items, isDark }) {
  const captions = ui.hero?.trustCaptions || [];
  // The enquiries column is a touch wider on phones so its "BMW-VERIFIED" tag fits on one line.
  return (
    <ul
      className={`mt-4 grid grid-cols-[1.12fr_0.86fr_1fr_1fr] rounded-[12px] border px-1 py-[18px] md:mt-6 md:grid-cols-4 md:px-3 md:py-5 lg:hidden ${
        isDark ? "border-white/20 bg-white/[0.03]" : "border-[#eef1f5] bg-white shadow-[0_6px_22px_rgba(10,26,43,0.07)]"
      }`}
    >
      {items.map((item, index) => {
        const stat = splitStat(item.label);
        const caption = captions[index];
        return (
          <li key={item.label} className="relative flex min-w-0 flex-col items-center px-0.5 text-center md:px-2 text-[var(--hero-text)]">
            {index ? <span aria-hidden="true" className={`absolute left-0 top-0 h-full w-px ${isDark ? "bg-white/15" : "bg-[#e9ecf0]"}`} /> : null}
            <span
              className={`flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] md:h-14 md:w-14 ${
                isDark ? "border-[#245fa6] bg-[#09192a] text-white" : "border-[#dde4ed] bg-white text-[var(--hero-blue)]"
              }`}
            >
              <Icon name={STAT_ICONS.phone[index] || "bars"} strokeWidth={2} className="h-[23px] w-[23px] md:h-7 md:w-7" />
            </span>
            {stat.value ? <strong className="mt-2.5 block text-[19px] font-semibold leading-[1.2] md:text-[20px]">{stat.value}</strong> : null}
            {stat.lead ? <strong className="mt-3 block text-[12px] font-semibold leading-[1.35] min-[400px]:text-[13px] md:text-[15px]">{stat.lead}</strong> : null}
            <span
              className={`block leading-[1.35] ${
                stat.value
                  ? "mt-1 text-[12px] md:text-[14px]"
                  : stat.lead
                    ? "text-[12px] font-semibold min-[390px]:whitespace-nowrap min-[400px]:text-[13px] md:text-[15px]"
                    : // Long body lists ("Saloon/Coupé/Convertible/…") step down so each part fits its column.
                      // Single words wider than the column ("Convertible", "Hatchback") step down so they never spill over it.
                      `mt-2.5 font-semibold [overflow-wrap:anywhere] ${
                        stat.label.length > 14
                          ? "text-[12.5px] md:text-[15px]"
                          : stat.label.length > 10
                            ? "text-[12.5px] min-[400px]:text-[13.5px] md:text-[17px]"
                            : stat.label.length > 7
                              ? "text-[13.5px] min-[400px]:text-[15px] md:text-[17px]"
                              : "text-[17px]"
                      }`
              }`}
            >
              {stat.label}
            </span>
            {stat.tag ? (
              <span className="mt-1.5 inline-flex items-center gap-0.5 whitespace-nowrap text-[10.5px] font-semibold leading-tight text-[var(--hero-blue)] min-[400px]:text-[11px] md:gap-1 md:text-[13px]">
                <Icon name="shieldCheck" strokeWidth={2.2} className="h-2.5 w-2.5 shrink-0 max-[379px]:hidden min-[400px]:h-3 min-[400px]:w-3 md:h-3.5 md:w-3.5" />
                {stat.tag}
              </span>
            ) : null}
            {caption ? <span className="mt-1 block text-[11.5px] leading-[1.35] opacity-85 min-[400px]:text-[12px] md:text-[14px]">{caption}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const pill = splitTagPill(data.tagPill);
  const alt = data.image?.alt || (pill[0] || "").replace(/<[^>]*>/g, "");
  // The page's own hero artwork when it has one, else this generation in BMW's stage scene (set server-side).
  const scene = data.heroScene;
  const wide = data.image
    ? (isDark ? data.image.dark : data.image.light) || data.image.light
    : scene
      ? (isDark && scene.darkSrc) || scene.src
      : null;
  const tall = data.image ? (isDark ? data.image.mobileDark : data.image.mobileLight) || null : null;
  // A single car in BMW's stage scene (not the page's own artwork, not a several-car line-up).
  const stage = Boolean(!data.image && scene && !scene.lineup);
  // The model's line-up scene (several cars across the frame) when this generation has no photo of its own.
  const lineup = Boolean(!data.image && scene?.lineup);
  const bg = isDark ? HERO_BG.dark : HERO_BG.light;
  const cta = data.primaryCta;
  const ctaLabel = cta ? String(cta.label || "").replace(/\s*→\s*$/, "") : "";

  const phone = tall
    ? { src: tall, ...phoneFrame(PHONE_ART.own) }
    : { src: wide, ...phoneFrame(stage ? PHONE_ART.stage : lineup ? PHONE_ART.lineup : PHONE_ART.own) };

  const vars = {
    "--hero-bg": bg,
    "--hero-text": isDark ? "#ffffff" : "#0b1521",
    // Phone copy is set darker than desktop copy in the designs.
    "--hero-body": isDark ? "#e3e9f1" : "#2b313b",
    "--hero-muted": isDark ? "#c3ccd7" : "#4a5260",
    "--hero-blue": isDark ? "#2f86f6" : "#0b52cc",
    "--hero-icon-cut": isDark ? "#09192a" : "#ffffff",
  };

  return (
    <section style={vars} className={`relative overflow-hidden bg-[var(--hero-bg)] text-[var(--hero-text)] ${heroFont.className}`}>
      {/* Desktop: the scene fills the hero on the right and fades into the page behind the copy; its sky fades
          into the page at the top. Sized by width (never cropped wider than the copy allows). Scenes are pushed 10%
          below the hero, which clips their corner mark and stands the car on the trust strip; the page's own artwork
          sits higher, as designed, with the car clear above the strip. */}
      {wide ? (
        <div
          className={`absolute right-0 hidden aspect-[3/2] w-full max-w-[1640px] xl:block ${
            data.image ? "bottom-[22px]" : "bottom-0 translate-y-[10%]"
          }`}
        >
          <Image
            src={wide}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1640px) 1640px, 100vw"
            // The ground fades out just under the wheels (79.5% down), before the artwork's generator mark (from 83%).
            className={`object-cover ${data.image ? "[mask-image:linear-gradient(to_bottom,#000_78%,transparent_83%)]" : ""}`}
          />
          <div
            className={`absolute inset-0 ${
              data.image
                ? // Its tall skyline sits behind the copy, so the page washes further over it.
                  "bg-[linear-gradient(90deg,var(--hero-bg)_0%,color-mix(in_srgb,var(--hero-bg)_94%,transparent)_30%,color-mix(in_srgb,var(--hero-bg)_62%,transparent)_43%,transparent_60%)]"
                : "bg-[linear-gradient(90deg,var(--hero-bg)_0%,color-mix(in_srgb,var(--hero-bg)_92%,transparent)_24%,color-mix(in_srgb,var(--hero-bg)_55%,transparent)_40%,transparent_58%)]"
            }`}
          />
          <div className="absolute inset-x-0 top-0 h-[30%] bg-[linear-gradient(180deg,var(--hero-bg)_0%,transparent_100%)]" />
          {data.image ? null : (
            <div className="absolute inset-x-0 bottom-[10%] h-24 bg-[linear-gradient(0deg,var(--hero-bg)_0%,transparent_100%)]" />
          )}
        </div>
      ) : null}

      <div className="site-container relative pb-8 pt-6 md:pb-10 md:pt-10 lg:pb-16 lg:pt-16">
        <div className="relative z-10">
          {pill.length ? (
            <p
              className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-[8px] border px-3 py-2 text-[13.5px] leading-[1.35] max-[389px]:gap-x-1.5 max-[389px]:px-2.5 max-[389px]:text-[12.5px] md:gap-x-2.5 md:px-4 md:py-2.5 md:text-[16px] lg:px-4 lg:py-2 ${
                isDark ? "border-[#1f5fc4] bg-[rgba(0,4,14,0.55)] text-white" : "border-[#bccfee] bg-white/80 text-[var(--hero-blue)]"
              }`}
            >
              <Icon name="carFront" strokeWidth={1.9} className="mr-1 h-[18px] w-[18px] shrink-0 text-[var(--hero-blue)] md:h-5 md:w-5 lg:hidden" />
              {pill.map((part, index) => (
                <span key={index} className="inline-flex items-center gap-2 whitespace-nowrap max-[389px]:gap-1.5 md:gap-2.5">
                  {index ? <span aria-hidden="true">•</span> : null}
                  <span className="[&_a]:[font-weight:inherit] [&_a]:text-inherit" dangerouslySetInnerHTML={{ __html: part }} />
                </span>
              ))}
            </p>
          ) : null}

          <h1 className="t-h1 mt-[18px] max-w-[11em] font-bold leading-[1.1] tracking-[-0.025em] max-md:text-[clamp(30px,8.9vw,36px)] md:mt-5 lg:mt-7">
            <span dangerouslySetInnerHTML={{ __html: dash(data.h1) }} />
          </h1>

          <MRule />

          <div className="mt-4 flex max-w-[360px] flex-col gap-3 text-[14.5px] leading-[1.6] text-[var(--hero-body)] md:mt-6 md:max-w-[540px] md:gap-3.5 md:text-[17px] lg:mt-7 lg:max-w-[520px] lg:gap-4 lg:text-[18px] lg:leading-[1.45] lg:text-[var(--hero-muted)] [&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline">
            {paragraphs(data.subHeadline).map((html, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: highlight(html) }} />
            ))}
          </div>
        </div>

        {/* Phones: the car right under the copy, its wheels on the CTA; the sky fades in behind the last lines. */}
        {wide ? (
          <div aria-hidden="true" className="pointer-events-none relative -mx-[var(--gutter)] md:hidden" style={phone.band}>
            <div className="absolute top-0" style={phone.art}>
              <Image src={phone.src} alt="" fill priority sizes="110vw" className="object-cover" />
            </div>
          </div>
        ) : null}

        {/* Tablets + small laptops: the scene below the copy; its sky rises behind the last lines. */}
        {wide ? (
          <div
            aria-hidden="true"
            className={`pointer-events-none relative -mx-[var(--gutter)] hidden overflow-hidden md:block xl:hidden ${
              stage
                ? "[mask-image:linear-gradient(to_bottom,transparent_0%,#000_24%,#000_92%,transparent_100%)]"
                : // Dark art has a brighter watermark, so it fades in later to keep the blue figures readable.
                  isDark
                  ? "[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_14%,#000_44%,#000_92%,transparent_100%)]"
                  : "[mask-image:linear-gradient(to_bottom,transparent_0%,#000_32%,#000_92%,transparent_100%)]"
            } ${tall || lineup ? "-mt-[4%]" : "-mt-[6%]"} aspect-[16/9]`}
          >
            <Image src={wide} alt="" fill sizes="100vw" className="object-cover object-[70%_40%]" />
          </div>
        ) : null}

        <div className="relative z-10">
          {cta ? (
            <Link
              href={cta.href || "/quote"}
              className={`${wide ? "mt-0 md:mt-2" : "mt-7"} flex h-[52px] w-full items-center justify-center gap-3 rounded-[8px] bg-[linear-gradient(180deg,#0662ec_0%,#004bc7_100%)] px-6 text-[18px] font-medium text-white shadow-[0_10px_24px_rgba(4,80,200,0.26)] transition hover:brightness-110 md:h-auto md:w-fit md:px-9 md:py-3.5 lg:rounded-[4px] lg:py-3.5 lg:text-[19px] xl:mt-10`}
            >
              <span dangerouslySetInnerHTML={{ __html: ctaLabel }} />
              <Icon name="arrow" strokeWidth={2.2} className="h-5 w-5 shrink-0" />
            </Link>
          ) : null}

          {data.trustStrip?.length ? (
            <>
              <DesktopStrip items={data.trustStrip} isDark={isDark} />
              <PhoneStrip items={data.trustStrip} isDark={isDark} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
