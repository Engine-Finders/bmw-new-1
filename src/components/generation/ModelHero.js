"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import { variantFont as heroFont } from "@/components/variant/variantFont";
import ui from "@/data/shared/generationPageUi.json";

// Hero backgrounds sampled from the designs: a near-white wash in light, deep navy in dark.
const HERO_BG = { light: "#f6f8fb", dark: "#0b1826" };

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
        : part.replace(/(\d[\d,]*\+|\[[^\]]+\])/g, '<span class="whitespace-nowrap text-[var(--hero-blue)]">$1</span>'),
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

// Thin three-colour M rule under the headline.
function MRule() {
  return (
    <span aria-hidden="true" className="mt-5 flex h-[3px] w-[100px] md:mt-6 md:w-[120px]">
      <span className="w-1/4 bg-[#2f80ed]" />
      <span className="w-1/4 bg-[#1c3f94]" />
      <span className="w-1/2 bg-[#e3262f]" />
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
  return (
    <ul
      className={`mt-5 grid grid-cols-2 gap-y-5 rounded-[12px] border px-1 py-5 md:mt-6 md:grid-cols-4 md:gap-y-0 md:px-3 lg:hidden ${
        isDark ? "border-white/15 bg-[rgba(11,24,38,0.72)]" : "border-[#e6eaf0] bg-white shadow-[0_8px_24px_rgba(10,26,43,0.06)]"
      }`}
    >
      {items.map((item, index) => {
        const stat = splitStat(item.label);
        const caption = captions[index];
        return (
          <li key={item.label} className="relative flex min-w-0 flex-col items-center px-2 text-center text-[var(--hero-text)]">
            {/* Phones: two to a row, so only the right-hand item gets a divider; tablets: four across. */}
            {index ? <span aria-hidden="true" className={`absolute left-0 top-0 h-full w-px ${index % 2 ? "" : "hidden md:block"} ${isDark ? "bg-white/12" : "bg-[#e6eaf0]"}`} /> : null}
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full border md:h-14 md:w-14 ${
                isDark ? "border-[var(--hero-blue)] bg-[#0f2236] text-white" : "border-[#d9e2ee] bg-white text-[var(--hero-blue)]"
              }`}
            >
              <Icon name={STAT_ICONS.phone[index] || "bars"} strokeWidth={2} className="h-[22px] w-[22px] md:h-7 md:w-7" />
            </span>
            {stat.value ? <strong className="mt-3 block text-[18px] font-semibold leading-[1.2] md:text-[20px]">{stat.value}</strong> : null}
            {stat.lead ? <strong className="mt-3 block text-[14px] font-semibold leading-[1.35] md:text-[15px]">{stat.lead}</strong> : null}
            <span
              className={`block leading-[1.35] ${
                stat.value
                  ? "mt-1 text-[13px] md:text-[14px]"
                  : stat.lead
                    ? "text-[14px] font-semibold md:text-[15px]"
                    : // Long body lists ("Saloon/Coupé/Convertible/…") step down so each part fits its column.
                      `mt-3 font-semibold [overflow-wrap:anywhere] ${stat.label.length > 14 ? "text-[14px] md:text-[15px]" : "text-[15px] md:text-[17px]"}`
              }`}
            >
              {stat.label}
            </span>
            {stat.tag ? (
              <span className="mt-1.5 inline-flex items-center gap-1 whitespace-nowrap text-[12.5px] font-semibold leading-tight text-[var(--hero-blue)] md:text-[13px]">
                <Icon name="shieldCheck" strokeWidth={2.2} className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" />
                {stat.tag}
              </span>
            ) : null}
            {caption ? <span className="mt-1 block text-[13px] leading-[1.35] opacity-85 md:text-[14px]">{caption}</span> : null}
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

  const vars = {
    "--hero-bg": bg,
    "--hero-text": isDark ? "#ffffff" : "#0b1726",
    "--hero-muted": isDark ? "rgba(255,255,255,0.86)" : "#4a5565",
    "--hero-blue": isDark ? "#4d9bff" : "#0a5bd3",
    "--hero-icon-cut": isDark ? "#0f2236" : "#ffffff",
  };

  return (
    <section style={vars} className={`relative overflow-hidden bg-[var(--hero-bg)] text-[var(--hero-text)] ${heroFont.className}`}>
      {/* Desktop: the scene fills the hero on the right and fades into the page behind the copy.
          Sized by width (never cropped wider than the copy allows) and pushed 10% below the hero, which clips the
          artwork's corner mark and keeps the car above the trust strip; its sky fades into the page at the top. */}
      {wide ? (
        <div className="absolute bottom-0 right-0 hidden aspect-[3/2] w-full max-w-[1640px] translate-y-[10%] xl:block">
          <Image src={wide} alt={alt} fill priority sizes="(min-width: 1640px) 1640px, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--hero-bg)_0%,color-mix(in_srgb,var(--hero-bg)_92%,transparent)_24%,color-mix(in_srgb,var(--hero-bg)_55%,transparent)_40%,transparent_58%)]" />
          <div className="absolute inset-x-0 top-0 h-[30%] bg-[linear-gradient(180deg,var(--hero-bg)_0%,transparent_100%)]" />
          <div className="absolute inset-x-0 bottom-[10%] h-24 bg-[linear-gradient(0deg,var(--hero-bg)_0%,transparent_100%)]" />
        </div>
      ) : null}

      <div className="site-container relative pb-8 pt-6 md:pb-10 md:pt-10 lg:pb-16 lg:pt-16">
        <div className="relative z-10">
          {pill.length ? (
            <p
              className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-[10px] border px-3.5 py-2.5 text-[14px] leading-[1.35] md:gap-x-2.5 md:px-4 md:text-[16px] lg:rounded-[8px] lg:px-4 lg:py-2 ${
                isDark ? "border-[var(--hero-blue)] bg-[rgba(11,24,38,0.6)] text-white" : "border-[#9fbdf0] bg-white/75 text-[var(--hero-blue)]"
              }`}
            >
              <Icon name="carFront" strokeWidth={1.9} className="mr-1 h-5 w-5 shrink-0 text-[var(--hero-blue)] lg:hidden" />
              {pill.map((part, index) => (
                <span key={index} className="inline-flex items-center gap-2 whitespace-nowrap md:gap-2.5">
                  {index ? <span aria-hidden="true">•</span> : null}
                  <span className="[&_a]:[font-weight:inherit] [&_a]:text-inherit" dangerouslySetInnerHTML={{ __html: part }} />
                </span>
              ))}
            </p>
          ) : null}

          <h1 className="t-h1 mt-5 max-w-[11em] font-bold leading-[1.1] tracking-[-0.025em] max-md:text-[clamp(30px,8.4vw,40px)] lg:mt-7">
            <span dangerouslySetInnerHTML={{ __html: dash(data.h1) }} />
          </h1>

          <MRule />

          <div className="mt-6 flex max-w-[540px] flex-col gap-3.5 text-[15px] leading-[1.6] text-[var(--hero-muted)] md:text-[17px] lg:mt-7 lg:max-w-[520px] lg:gap-4 lg:text-[18px] lg:leading-[1.45] [&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline">
            {paragraphs(data.subHeadline).map((html, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: highlight(html) }} />
            ))}
          </div>
        </div>

        {/* Phones, tablets + small laptops: the car below the copy; its sky rises behind the last lines. */}
        {wide ? (
          <div
            aria-hidden="true"
            className={`pointer-events-none relative -mx-[var(--gutter)] overflow-hidden xl:hidden ${
              stage
                ? "[mask-image:linear-gradient(to_bottom,transparent_0%,#000_24%,#000_92%,transparent_100%)]"
                : // Dark art has a brighter watermark, so it fades in later to keep the blue figures readable.
                  isDark
                  ? "[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_14%,#000_44%,#000_92%,transparent_100%)]"
                  : "[mask-image:linear-gradient(to_bottom,transparent_0%,#000_32%,#000_92%,transparent_100%)]"
            } ${
              tall
                ? "-mt-[44%] aspect-[11/10] md:-mt-[4%] md:aspect-[16/9]"
                : stage
                  ? "-mt-[6%] aspect-[10/7] md:aspect-[16/9]"
                  : lineup
                    ? "-mt-[4%] aspect-[3/2] md:aspect-[16/9]"
                    : "-mt-[6%] aspect-[3/2] md:aspect-[16/9]"
            }`}
          >
            {tall ? (
              <Image src={tall} alt="" fill priority sizes="100vw" className="object-cover object-top md:hidden" />
            ) : null}
            {stage ? (
              // Phones: BMW's stage scene zoomed in on its car (centred at ~71% across, 33–72% down every scene),
              // so the car fills the screen width instead of sitting small beside the empty studio.
              <div className="absolute left-[-70.7%] top-[-24.9%] aspect-[3/2] w-[170%] md:hidden">
                <Image src={wide} alt="" fill priority sizes="170vw" className="object-cover" />
              </div>
            ) : null}
            {lineup ? (
              // Phones: the model's line-up zoomed ~1.46x on its newest cars (right of frame, 50–87% down), right edge
              // flush with the screen; the oldest car runs off the left, so the front car reads at about half the width.
              <div className="absolute left-[-45.5%] top-[-14%] aspect-[16/9] w-[146%] md:hidden">
                <Image src={wide} alt="" fill priority sizes="146vw" className="object-cover" />
              </div>
            ) : null}
            <Image
              src={wide}
              alt=""
              fill
              priority={!tall && !stage && !lineup}
              sizes="100vw"
              className={`object-cover object-[70%_40%] ${tall || stage || lineup ? "hidden md:block" : ""}`}
            />
          </div>
        ) : null}

        <div className="relative z-10">
          {cta ? (
            <Link
              href={cta.href || "/quote"}
              className={`${wide ? "mt-2" : "mt-7"} flex w-full items-center justify-center gap-3 rounded-[8px] bg-[linear-gradient(180deg,#0b63e5_0%,#0750c4_100%)] px-6 py-3.5 text-[18px] font-medium text-white shadow-[0_10px_24px_rgba(7,80,196,0.28)] transition hover:brightness-110 md:w-fit md:px-9 lg:rounded-[4px] lg:py-3.5 lg:text-[19px] xl:mt-10`}
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
