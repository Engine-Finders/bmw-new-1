"use client";

import Link from "next/link";
import ui from "@/data/shared/enginePageUi.json";
import { CARD, DataText, EIcon, Eyebrow, SECTION_CLASS, useEngineTone } from "./engineUi";
import { cleanText, splitTags, stripTags, textSegments } from "./engineText";

const UI = ui.costGuide;

const LOCAL = {
  dark: {
    "--cg-tile": "rgba(31, 111, 255, 0.14)",
    "--cg-box": "transparent",
    "--cg-box-border": "var(--eg-card-border)",
    "--cg-hot-border": "#1f6fff",
    "--cg-hot-shadow": "0 0 0 1px rgba(31, 111, 255, 0.35), 0 0 32px rgba(31, 111, 255, 0.28)",
    "--cg-cta-border": "rgba(77, 148, 255, 0.28)",
    "--cg-btn": "linear-gradient(180deg, #1a5cf0, #0b46d8)",
    "--cg-btn-text": "#ffffff",
  },
  light: {
    "--eg-page": "#fafbfd",
    "--cg-tile": "#ebf1fe",
    "--cg-box": "#f5f8fd",
    "--cg-box-border": "#e8eef7",
    "--cg-hot-border": "#1268f3",
    "--cg-hot-shadow": "0 10px 30px rgba(18, 104, 243, 0.12)",
    "--cg-cta-border": "transparent",
    "--cg-btn": "#ffffff",
    "--cg-btn-text": "#0b1a33",
  },
};

const fill = (template = "", vars = {}) => String(template).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");

/** "£1,800–£3,200 [BMW-QUOTE]" → { price: "£1,800–£3,200", tag: "[BMW-QUOTE]" }. */
function priceOf(value) {
  const { text, tags } = splitTags(value);
  return { price: text, tag: tags[0] ? `[${tags[0]}]` : "" };
}

const isPopular = (row) => /^reconditioned/i.test(stripTags(row?.condition));

function iconFor(condition) {
  const icons = UI.conditionIcons || {};
  const key = Object.keys(icons).find((k) => k !== "fallback" && stripTags(condition).toLowerCase().startsWith(k.toLowerCase()));
  return icons[key] || icons.fallback || "engine";
}

/** Labour text with the hours and £/hr figures in bold, tags in blue. */
function LabourText({ text }) {
  const bold = /(\d+\s*[–-]\s*\d+\s+hours|£[\d,]+\s*[–-]\s*£[\d,]+\/hr)/g;
  return textSegments(text).map((part, i) =>
    part.type === "tag" ? (
      <span key={i} className="whitespace-nowrap text-[var(--eg-tag)]">
        {part.value}
      </span>
    ) : (
      part.value.split(bold).map((chunk, j) =>
        j % 2 ? (
          <strong key={`${i}-${j}`} className="font-semibold text-[var(--eg-text)]">
            {chunk}
          </strong>
        ) : (
          <span key={`${i}-${j}`}>{chunk}</span>
        ),
      )
    ),
  );
}

function ShieldGlyph({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" />
      <path d="M12 8.6v5.8M9.1 11.5h5.8M10 9.5l4 4M14 9.5l-4 4" strokeWidth={1.4} />
    </svg>
  );
}

/** Engine block outline, as the client's engine icon (drawn so it takes the theme blue). */
function EngineGlyph({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.8 9.5v5M2.8 12h2.4" />
      <path d="M5.2 9h2.6l1.4-1.6h5.2L15.8 9h1.4v2h1.6V9.6h2.4v6.2h-2.4v-1.4h-1.6V17l-2 2H8.2l-3-2.6z" />
      <path d="M11.8 7.4V4.8M9.4 4.8h4.8" />
    </svg>
  );
}

/** Bars with a rising trend line and arrow (the reference's CTA glyph). */
function ChartGlyph({ className = "h-14 w-14", bars = "var(--eg-blue)" }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden>
      <g fill={bars}>
        <rect x="6" y="36" width="8" height="14" rx="1" />
        <rect x="18" y="30" width="8" height="20" rx="1" />
        <rect x="30" y="34" width="8" height="16" rx="1" />
        <rect x="42" y="22" width="8" height="28" rx="1" />
      </g>
      <path d="M8 27l10-9 10 6 16-16" fill="none" stroke="#dbe7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37 8h8v8" fill="none" stroke="#dbe7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g fill={bars} stroke="#dbe7ff" strokeWidth="1.5">
        <circle cx="18" cy="18" r="2.6" />
        <circle cx="28" cy="24" r="2.6" />
      </g>
    </svg>
  );
}

function ConditionIcon({ condition, popular, size = "h-11 w-11" }) {
  if (popular) {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--eg-blue-strong)] text-white [box-shadow:0_0_0_4px_color-mix(in_srgb,var(--eg-blue)_18%,transparent)] ${size}`}>
        <EIcon name="star" solid className="h-1/2 w-1/2" />
      </span>
    );
  }
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[10px] bg-[var(--cg-tile)] text-[var(--eg-blue)] ${size}`}>
      {iconFor(condition) === "engine" ? (
        <EngineGlyph className="h-[58%] w-[58%]" />
      ) : (
        <EIcon name={iconFor(condition)} className="h-[55%] w-[55%]" />
      )}
    </span>
  );
}

function PopularTab({ className = "" }) {
  return (
    <span
      className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-[var(--eg-blue-strong)] px-3 py-1 text-[12px] font-semibold uppercase leading-[1.3] text-white lg:text-[14px] ${className}`}
    >
      {UI.mostPopular}
    </span>
  );
}

function WarrantyPill({ children }) {
  return (
    <span className="inline-flex w-fit whitespace-nowrap rounded-[6px] bg-[var(--eg-blue-strong)] px-3 py-1.5 text-[13px] font-medium leading-tight text-white lg:text-[14px]">
      {children}
    </span>
  );
}

const cardShell = (popular) =>
  popular
    ? "rounded-[10px] border border-[var(--cg-hot-border)] bg-[var(--eg-card)] [box-shadow:var(--cg-hot-shadow)]"
    : CARD;

// Body indent (under the title, as in the reference) only when the longest price still fits beside the icon.
const INDENT = {
  11: "@min-[184px]:pl-[54px]",
  13: "@min-[205px]:pl-[54px]",
  15: "@min-[228px]:pl-[54px]",
  99: "@min-[300px]:pl-[54px]",
};
const indentFor = (len) => INDENT[[11, 13, 15, 99].find((n) => len <= n)];

/* ------------------------------------------------------------- desktop */

function PriceCard({ row, indent }) {
  const popular = isPopular(row);
  const supply = priceOf(row.supplyOnly);
  const fitted = priceOf(row.fittedIndie);
  const warranty = stripTags(row.warranty);
  const label = "text-[14px] uppercase leading-tight text-[var(--eg-muted)]";
  return (
    <article className={`@container relative flex min-w-0 flex-col px-4 pb-5 ${popular ? "pt-6" : "pt-5"} ${cardShell(popular)}`}>
      {popular ? <PopularTab /> : null}
      <div className="flex items-start gap-2.5">
        <ConditionIcon condition={row.condition} popular={popular} />
        <div className="min-w-0 pt-0.5">
          <h3 className="text-[16px] font-semibold uppercase leading-tight">{stripTags(row.condition)}</h3>
          <p className={`mt-1.5 ${label}`}>{UI.labels.supplyOnly}</p>
        </div>
      </div>
      <div className={`mt-3 ${indent}`}>
        <p className="whitespace-nowrap text-[20px] font-bold leading-tight tracking-[-0.01em] @min-[250px]:text-[22px]">{supply.price || "–"}</p>
        {supply.tag ? <DataText as="p" text={supply.tag} className="mt-1 text-[14px]" /> : null}
      </div>
      <div className={`mt-4 border-t border-[var(--eg-divider)] pt-3.5 ${indent}`}>
        <p className={label}>{UI.labels.fitted}</p>
        <p className="mt-1.5 whitespace-nowrap text-[17px] font-medium leading-tight">{fitted.price || "–"}</p>
      </div>
      <div className={`mt-3.5 border-t border-[var(--eg-divider)] pt-3.5 ${indent}`}>
        <p className={label}>{UI.labels.warranty}</p>
        <div className="mt-2.5">{warranty ? <WarrantyPill>{warranty}</WarrantyPill> : "–"}</div>
      </div>
    </article>
  );
}

function IntroCard({ code, subTag, labour, note, className = "" }) {
  return (
    <article className={`@container min-w-0 ${CARD} p-5 ${className}`}>
      <div className="flex flex-col gap-4 @min-[700px]:grid @min-[700px]:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] @min-[700px]:items-start @min-[700px]:gap-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3.5">
            <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--eg-blue-strong)] text-[20px] font-semibold leading-none text-white">
              £
            </span>
            <p className="text-[15px] font-medium uppercase leading-tight tracking-[0.02em] text-[var(--eg-blue)]">{UI.eyebrow}</p>
          </div>
          <div className="@min-[420px]:pl-[50px]">
            <h2 className="mt-2 text-[22px] font-bold leading-[1.25] tracking-[-0.01em] [text-wrap:balance] @min-[420px]:-mt-1 @min-[420px]:text-[24px]">
              {fill(UI.h2, { code })}
            </h2>
            <p className="mt-2 text-[15px] leading-[1.45] text-[var(--eg-muted)]">{UI.subHeading}</p>
            {subTag ? <DataText as="p" text={subTag} className="mt-1 text-[15px]" /> : null}
          </div>
        </div>
        <div className="grid gap-3">
          {labour ? (
            <div className="flex items-start gap-2.5 rounded-[10px] border border-[var(--cg-box-border)] bg-[var(--cg-box)] p-3">
              <EIcon name="info" className="mt-px h-[22px] w-[22px] shrink-0 text-[var(--eg-blue)]" strokeWidth={1.5} />
              <p className="text-[15px] leading-[1.5] text-[var(--eg-muted)]">
                <LabourText text={labour} />
              </p>
            </div>
          ) : null}
          {note ? (
            <div className="flex items-center gap-2.5 rounded-[10px] border border-[var(--cg-box-border)] bg-[var(--cg-box)] px-3 py-2.5">
              <ShieldGlyph className="h-5 w-5 shrink-0 text-[var(--eg-blue)]" />
              <DataText as="p" text={note} className="text-[15px] leading-[1.45] text-[var(--eg-muted)]" />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function CtaCard({ href, className = "" }) {
  return (
    <article
      className={`@container flex min-w-0 flex-col rounded-[10px] border border-[var(--cg-cta-border)] px-4 py-5 text-white min-[1440px]:px-[18px] [background:var(--eg-navy)] [box-shadow:var(--eg-card-shadow)] ${className}`}
    >
      <div className="flex h-full flex-col @min-[560px]:flex-row @min-[560px]:items-center @min-[560px]:gap-6">
        <ChartGlyph className="h-14 w-14 shrink-0" />
        <div className="mt-4 min-w-0 @min-[560px]:mt-0 @min-[560px]:flex-1">
          <h3 className="text-[19px] font-bold leading-[1.25] @min-[200px]:text-[22px]">{UI.cta.title}</h3>
          <p className="mt-2 text-[15px] leading-[1.5] text-white/75">{UI.cta.text}</p>
        </div>
        <Link
          href={href}
          className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[6px] px-3 py-3 text-[14px] font-semibold uppercase text-[var(--cg-btn-text)] [background:var(--cg-btn)] @max-[559px]:mt-6 @min-[560px]:w-auto"
        >
          {UI.cta.button}
          <EIcon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------- phone */

function MobilePriceCard({ row }) {
  const popular = isPopular(row);
  const supply = priceOf(row.supplyOnly);
  const fitted = priceOf(row.fittedIndie);
  const warranty = stripTags(row.warranty);
  const label = "text-[12px] uppercase leading-tight text-[var(--eg-muted)]";
  const line = "grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] items-center gap-3";
  return (
    <article className={`relative grid grid-cols-[40px_minmax(0,1fr)] gap-3 px-3.5 pb-3.5 ${popular ? "pt-5" : "pt-4"} ${cardShell(popular)}`}>
      {popular ? <PopularTab /> : null}
      <ConditionIcon condition={row.condition} popular={popular} size="h-10 w-10" />
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold uppercase leading-tight">{stripTags(row.condition)}</h3>
        <div className={`mt-1.5 ${line} items-start`}>
          <p className={`${label} pt-1`}>{UI.labels.supplyOnly}</p>
          <div className="min-w-0">
            <p className="whitespace-nowrap text-[19px] font-bold leading-tight max-[379px]:text-[17px]">{supply.price || "–"}</p>
            {supply.tag ? <DataText as="p" text={supply.tag} className="mt-0.5 text-[13px]" /> : null}
          </div>
        </div>
        <div className={`mt-3 border-t border-[var(--eg-divider)] pt-3 ${line}`}>
          <p className={label}>{UI.labels.fitted}</p>
          <p className="whitespace-nowrap text-[16px] font-medium leading-tight max-[379px]:text-[15px]">{fitted.price || "–"}</p>
        </div>
        <div className={`mt-3 border-t border-[var(--eg-divider)] pt-3 ${line}`}>
          <p className={label}>{UI.labels.warranty}</p>
          <div>{warranty ? <WarrantyPill>{warranty}</WarrantyPill> : "–"}</div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------- section */

export default function CostGuide({ data, facts, engineLabel = "BMW Engine" }) {
  const { isDark, vars } = useEngineTone();
  if (!data) return null;

  const tone = { ...vars, ...LOCAL[isDark ? "dark" : "light"] };
  const code = facts?.code || stripTags(engineLabel).replace(/^BMW\s+/i, "");
  const rows = (data.rows || []).filter((row) => stripTags(row?.condition));
  const n = rows.length;
  const labour = data.labourEstimate || "";
  const note = cleanText(data.sharedCostNote || "");
  const subTag = rows.map((row) => priceOf(row.supplyOnly).tag).find(Boolean) || (splitTags(labour).tags[0] ? `[${splitTags(labour).tags[0]}]` : "");
  const href = data.cta?.href || UI.cta.href;
  const ctaLabel = cleanText(data.cta?.label || "").replace(/→/g, "").trim() || fill(UI.cta.mobileFallback, { code });
  const longest = Math.max(0, ...rows.flatMap((row) => [priceOf(row.supplyOnly).price.length, priceOf(row.fittedIndie).price.length]));
  const indent = indentFor(longest);

  // Wide (≥1440): one row — intro | price cards | CTA. 4 cards → 2×2 between intro and CTA. Below that the intro spans the row.
  const wideCols = n === 0 ? "minmax(0,2fr) minmax(0,1fr)" : n <= 3 ? `26fr repeat(${n}, 17.5fr) 16fr` : "26fr 17fr 17fr 16fr";
  const tall = n > 3 ? "min-[1440px]:row-span-2 min-[1440px]:row-start-1" : "";
  const ctaMd = n % 2 === 1 ? "" : "md:max-lg:col-span-2";
  const ctaLg = n % 4 === 3 ? "" : ["lg:max-[1439px]:col-span-4", "lg:max-[1439px]:col-span-3", "lg:max-[1439px]:col-span-2"][n % 4];

  return (
    <section style={tone} className={`${SECTION_CLASS} section-y pt-7 md:pt-8`}>
      <div className="site-container relative">
        {/* tablet / desktop */}
        <div
          className="hidden gap-3 md:grid md:max-lg:grid-cols-2 lg:max-[1439px]:grid-cols-4 min-[1440px]:[grid-template-columns:var(--cg-cols)]"
          style={{ "--cg-cols": wideCols }}
        >
          <IntroCard code={code} subTag={subTag} labour={labour} note={note} className={`md:max-[1439px]:col-span-full ${tall} ${n > 3 ? "min-[1440px]:col-start-1" : ""}`} />
          {rows.map((row, i) => (
            <PriceCard key={`${row.condition}-${i}`} row={row} indent={indent} />
          ))}
          <CtaCard href={href} className={`${ctaMd} ${ctaLg} ${tall} ${n > 3 ? "min-[1440px]:col-start-4" : ""}`} />
        </div>

        {/* phone */}
        <div className="md:hidden">
          <Eyebrow className="text-[13px] font-medium" lineClassName="w-[24px]">
            {UI.eyebrow}
          </Eyebrow>
          <h2 className="mt-2 text-[24px] font-bold leading-[1.2] tracking-[-0.01em]">{fill(UI.h2, { code })}</h2>
          <p className="mt-2 text-[15px] leading-[1.45] text-[var(--eg-muted)]">{UI.subHeading}</p>
          {subTag ? <DataText as="p" text={subTag} className="mt-0.5 text-[15px]" /> : null}

          {n ? (
            <div className="mt-5 grid gap-4">
              {rows.map((row, i) => (
                <MobilePriceCard key={`${row.condition}-${i}`} row={row} />
              ))}
            </div>
          ) : null}

          {labour ? (
            <div className={`${CARD} mt-4 flex items-start gap-3 p-3.5`}>
              <EIcon name="info" className="mt-0.5 h-6 w-6 shrink-0 text-[var(--eg-blue)]" strokeWidth={1.5} />
              <p className="text-[14px] leading-[1.55] text-[var(--eg-muted)]">
                <LabourText text={labour} />
              </p>
            </div>
          ) : null}
          {note ? (
            <div className={`${CARD} mt-3 flex items-center gap-3 px-3.5 py-3`}>
              <ShieldGlyph className="h-6 w-6 shrink-0 text-[var(--eg-blue)]" />
              <DataText as="p" text={note} className="text-[14px] leading-[1.5] text-[var(--eg-muted)]" />
            </div>
          ) : null}

          <Link
            href={href}
            className="mt-4 flex items-center gap-3 rounded-[10px] px-4 py-3.5 text-white [background:var(--eg-cta)] [box-shadow:0_12px_28px_rgba(11,70,216,0.3)]"
          >
            <ChartGlyph className="h-10 w-10 shrink-0" bars="rgba(255, 255, 255, 0.55)" />
            <span className="min-w-0 flex-1 text-[16px] font-semibold leading-[1.3]">{ctaLabel}</span>
            <EIcon name="arrow-right" className="h-6 w-6 shrink-0" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  );
}
