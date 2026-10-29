"use client";

import Image from "next/image";
import ui from "@/data/shared/enginePageUi.json";
import { CARD, DataText, EIcon, IconDisc, SECTION_CLASS, Stars, Underline, useEngineTone } from "./engineUi";
import { cleanText, formatStars, parseStars } from "./engineText";

const V = ui.verdict;

// Local glyph in the kit's line style: the reference's shield with a small solid shield inside.
const LOCAL_GLYPHS = {
  "shield-core": (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" />
      <path d="M12 8.2l3.6 1.4v2.4c0 2.2-1.5 3.9-3.6 4.6-2.1-.7-3.6-2.4-3.6-4.6V9.6z" fill="currentColor" />
    </>
  ),
};

function Glyph({ name, className }) {
  const local = LOCAL_GLYPHS[name];
  if (!local) return <EIcon name={name} className={className} />;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {local}
    </svg>
  );
}

/** "14 (3.5★ × 4 = 14)" → { points: 14, outOf: null, detail: "3.5★ × 4 = 14" }; "74/100 (…)" → { points: 74, outOf: 100 }. */
function parseScoreCell(value = "") {
  const clean = cleanText(value);
  const m = clean.match(/^(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+))?\s*(?:\((.*)\))?\s*$/);
  if (m) return { points: Number(m[1]), outOf: m[2] ? Number(m[2]) : null, detail: (m[3] || "").trim() };
  const lead = clean.match(/^(\d+(?:\.\d+)?)\s*[–:-]?\s*(.*)$/);
  return lead ? { points: Number(lead[1]), outOf: null, detail: lead[2].trim() } : { points: null, outOf: null, detail: clean };
}

/** Quote and the "(Clause 1: … Total: 23 words.)" note, split; surrounding quote marks dropped. */
function parseVerdict(value = "") {
  const raw = String(value ?? "");
  const i = raw.search(/\(\s*Clause\b/i);
  const quote = (i >= 0 ? raw.slice(0, i) : raw).trim().replace(/^["“”']+|["“”']+$/g, "");
  return { quote: cleanText(quote), note: i >= 0 ? cleanText(raw.slice(i)) : "" };
}

/** "92% confidence -based on …" → { lead: "92% confidence", rest: "– based on …" }. */
function splitConfidence(value = "") {
  const clean = cleanText(value);
  const m = clean.match(/^(\d+(?:\.\d+)?\s*%(?:\s+confidence)?)\s*(.*)$/i);
  return m ? { lead: m[1], rest: m[2] } : { lead: "", rest: clean };
}

const SOFT = "text-[color-mix(in_srgb,var(--eg-text)_84%,transparent)]";

const sentence = (text = "") => {
  // Some copy carries raw <a href> markup (b38-b48 "Avoid if"): keep the link text only.
  const clean = cleanText(String(text ?? "").replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1").replace(/<[^>]+>/g, ""));
  return clean ? clean[0].toUpperCase() + clean.slice(1) : "";
};

/** Detail copy with ★ in blue (as in the reference) and tags via DataText. */
function Detail({ text }) {
  const parts = String(text).split("★");
  return parts.map((part, i) => (
    <span key={i}>
      {i > 0 && /^\s/.test(part) ? " " : null}
      <DataText text={part} />
      {i < parts.length - 1 && /\s$/.test(part) ? " " : null}
      {i < parts.length - 1 ? <span className="text-[var(--eg-blue)]">★</span> : null}
    </span>
  ));
}

/* ----------------------------------------------------------------- cards */

function RatingCard({ starRating, confidence, isDark, className = "" }) {
  const stars = parseStars(starRating);
  const { lead, rest } = splitConfidence(confidence);
  return (
    <article className={`${CARD} p-4 md:p-6 xl:p-7 ${className}`}>
      <p className="text-[13px] font-medium text-[var(--eg-text)] md:text-[18px] xl:text-[20px] 2xl:text-[22px]">{V.ratingLabel}</p>
      <div className="mt-1.5 flex flex-wrap items-end gap-x-4 gap-y-2 md:gap-x-5 2xl:mt-2">
        <span className="text-[48px] font-bold leading-[0.95] tracking-[-0.03em] text-[var(--eg-blue)] md:text-[64px] xl:text-[72px] 2xl:text-[82px]">
          {formatStars(stars)}
        </span>
        {stars != null ? (
          <Stars value={stars} className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10" gap="gap-2 mb-1 2xl:mb-1.5" />
        ) : null}
        <span className="mb-0.5 text-[13px] text-[var(--eg-text)] md:text-[18px] xl:text-[20px] 2xl:mb-1 2xl:text-[22px]">{V.outOf}</span>
      </div>
      {lead || rest ? (
        <div className="mt-4 flex items-start gap-3 border-t border-[var(--eg-divider)] pt-4 md:mt-5 md:gap-4 md:pt-5 2xl:mt-6 2xl:gap-6 2xl:pt-6">
          <IconDisc size="h-11 w-11 md:h-14 md:w-14 2xl:h-16 2xl:w-16">
            <EIcon name="shield-check" className="h-6 w-6 md:h-7 md:w-7 2xl:h-8 2xl:w-8" />
          </IconDisc>
          <p className="min-w-0 text-[13px] leading-[1.55] text-[var(--eg-text)] md:text-[16px] xl:text-[17px] 2xl:text-[19px] 2xl:leading-[1.6]">
            {lead ? <strong className={`font-semibold ${isDark ? "text-[var(--eg-text)]" : "text-[var(--eg-blue)]"}`}>{lead}</strong> : null}
            {lead && rest ? " " : null}
            <DataText text={rest} />
          </p>
        </div>
      ) : null}
    </article>
  );
}

const QUOTE_MARK = "[font-family:Georgia,'Times_New_Roman',serif] font-bold leading-none text-[var(--eg-blue)] text-[40px] md:text-[56px] 2xl:text-[68px]";

function QuoteCard({ oneLineVerdict, className = "" }) {
  const { quote, note } = parseVerdict(oneLineVerdict);
  if (!quote && !note) return null;
  return (
    <figure className={`${CARD} px-4 pb-4 pt-4 md:px-6 md:pb-5 md:pt-6 2xl:pb-6 2xl:pl-[26px] 2xl:pr-7 2xl:pt-7 ${className}`}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 md:gap-x-4">
        <span aria-hidden className={`${QUOTE_MARK} -mt-1 h-[0.5em]`}>
          “
        </span>
        <blockquote className="flow-root pr-1 md:pr-2">
          <p className="text-[13px] leading-[1.5] text-[var(--eg-text)] md:text-[17px] xl:text-[19px] 2xl:text-[22px] 2xl:leading-[1.45]">
            {quote}
            <span aria-hidden className={`${QUOTE_MARK} float-right ml-4 mt-[0.32em] h-[0.42em] md:mt-[0.3em]`}>
              ”
            </span>
          </p>
        </blockquote>
      </div>
      {note ? <figcaption className="mt-3 text-[12px] leading-[1.45] text-[var(--eg-soft)] md:mt-4 md:text-[14px] xl:text-[15px] 2xl:mt-5">{note}</figcaption> : null}
    </figure>
  );
}

function AdviceCard({ tone, icon, title, text }) {
  const color = tone === "good" ? "text-[var(--eg-green)]" : "text-[var(--eg-red)]";
  // Phone and 1536+: icon beside the title and text (as the references). Tablet–1440: icon + title row, text full width.
  return (
    <article className={`${CARD} grid min-w-0 grid-cols-[auto_minmax(0,1fr)] content-start items-center gap-x-2.5 p-3 md:gap-x-3 md:gap-y-2 md:p-5 2xl:items-start 2xl:gap-x-3.5 2xl:gap-y-0 2xl:py-7 2xl:pl-6 2xl:pr-4`}>
      <EIcon
        name={icon}
        strokeWidth={1.6}
        className={`row-span-2 h-7 w-7 shrink-0 self-start md:row-span-1 md:h-9 md:w-9 md:self-center 2xl:row-span-2 2xl:h-[46px] 2xl:w-[46px] 2xl:self-start ${color}`}
      />
      <h3 className={`pt-0.5 text-[13px] font-semibold leading-tight md:pt-0 md:text-[18px] 2xl:pt-1 2xl:text-[20px] ${color}`}>{title}</h3>
      <p className={`mt-1 text-[12px] leading-[1.45] md:col-span-2 md:mt-0 md:text-[15px] 2xl:col-span-1 2xl:col-start-2 2xl:mt-2 2xl:leading-[1.5] ${SOFT}`}>{text}</p>
    </article>
  );
}

function ScoreCard({ title, columns, rows, total, isDark, className = "" }) {
  const [dimLabel, scoreLabel] = columns;
  const scoreParts = String(scoreLabel || "").match(/^(.*?)(\s*\(.*\))$/);
  return (
    <article className={`${CARD} flex min-w-0 flex-col overflow-hidden ${className}`}>
      <h3 className="px-4 pb-3 pt-4 text-[14px] font-semibold text-[var(--eg-text)] md:px-6 md:pb-4 md:pt-6 md:text-[20px] 2xl:px-7 2xl:pb-6 2xl:pt-7 2xl:text-[24px]">
        {title}
      </h3>
      <div className="flex items-center justify-between gap-4 px-4 py-2 text-[12px] font-medium text-[var(--eg-band-text)] [background:var(--eg-band)] md:px-6 md:py-3 md:text-[16px] 2xl:px-7 2xl:text-[18px]">
        <span>{dimLabel}</span>
        <span className="text-right">
          {scoreParts ? (
            <>
              {scoreParts[1]}
              <span className={isDark ? "" : "text-[var(--eg-blue)]"}>{scoreParts[2]}</span>
            </>
          ) : (
            scoreLabel
          )}
        </span>
      </div>
      <ul className="flex flex-1 flex-col">
        {rows.map((row) => (
          <li
            key={row.dimension}
            className="grid flex-1 grid-cols-[40px_minmax(0,1fr)_88px] items-center gap-x-3 border-b border-[var(--eg-divider)] pl-3 md:grid-cols-[52px_minmax(0,1fr)_128px] md:gap-x-4 md:pl-5 xl:grid-cols-[64px_minmax(0,165fr)_minmax(0,400fr)_128px] xl:gap-x-5 xl:pl-[18px]"
          >
            <IconDisc size="h-10 w-10 md:h-[52px] md:w-[52px] xl:h-16 xl:w-16">
              <Glyph name={row.icon} className="h-[22px] w-[22px] md:h-6 md:w-6 xl:h-8 xl:w-8 2xl:h-9 2xl:w-9" />
            </IconDisc>
            <div className="min-w-0 py-2.5 md:py-4 xl:contents">
              <p className="text-[13px] font-semibold leading-tight text-[var(--eg-text)] md:text-[17px] xl:py-5 xl:text-[18px] 2xl:text-[19px]">{row.dimension}</p>
              {row.detail ? (
                <p className={`mt-0.5 text-[12px] leading-[1.45] md:mt-1 md:text-[15px] xl:mt-0 xl:py-5 xl:pr-2 xl:text-[16px] xl:leading-[1.6] 2xl:text-[17px] 2xl:leading-[1.65] ${SOFT}`}>
                  <Detail text={row.detail} />
                </p>
              ) : (
                <span className="hidden xl:block" />
              )}
            </div>
            <div className="flex items-center justify-center self-stretch border-l border-[var(--eg-divider)] py-3">
              <p className="flex items-baseline gap-1.5 whitespace-nowrap md:gap-2 xl:gap-3.5">
                <span className="text-[22px] font-bold leading-none tracking-[-0.02em] text-[var(--eg-blue)] md:text-[34px] 2xl:text-[40px]">{row.points ?? "–"}</span>
                <span className="text-[12px] leading-none text-[var(--eg-text)] md:text-[18px] 2xl:text-[22px]">{V.outOfRow}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-5 2xl:pl-7 2xl:pr-9 2xl:py-6">
        <p className="text-[13px] font-medium uppercase leading-tight tracking-[0.02em] text-[var(--eg-text)] md:text-[17px] 2xl:text-[19px]">{V.totalLabel}</p>
        <p className="flex items-baseline gap-1.5 whitespace-nowrap md:gap-2.5">
          <span className="text-[24px] font-bold leading-none tracking-[-0.02em] text-[var(--eg-blue)] md:text-[38px] 2xl:text-[44px]">{total ?? "–"}</span>
          <span className="text-[13px] leading-none text-[var(--eg-text)] md:text-[20px] 2xl:text-[26px]">{V.totalOutOf}</span>
        </p>
      </div>
    </article>
  );
}

export default function VerdictRating({ data, facts, engineImage }) {
  const { isDark, vars } = useEngineTone();
  if (!data) return null;

  const icons = V.dimensionIcons || {};
  const parsed = (data.scoreBreakdown?.rows || [])
    .map((row) => ({ dimension: cleanText(row.dimension), ...parseScoreCell(row.score) }))
    .filter((row) => row.dimension);
  const isTotal = (row) => /^total\b/i.test(row.dimension) || row.outOf === 100;
  const rows = parsed.filter((row) => !isTotal(row)).map((row) => ({ ...row, icon: icons[row.dimension] || icons.fallback || "gauge" }));
  const totalRow = parsed.find(isTotal);
  const sum = rows.reduce((acc, row) => acc + (row.points || 0), 0);
  const total = facts?.score ?? totalRow?.points ?? (rows.length ? sum : null);
  const columns = data.scoreBreakdown?.columns?.length === 2 ? data.scoreBreakdown.columns.map((c) => cleanText(c)) : V.columns;
  const engineSrc = typeof engineImage === "string" ? engineImage : engineImage?.src;

  return (
    <section aria-labelledby="verdict-heading" className={`${SECTION_CLASS} section-y`} style={isDark ? vars : { ...vars, "--eg-page": "#f8fafd" }}>
      {engineSrc && !isDark ? (
        <div aria-hidden className="pointer-events-none absolute -bottom-[70px] -left-[50px] hidden aspect-square w-[460px] opacity-[0.16] grayscale lg:block">
          <Image src={engineSrc} alt="" fill sizes="460px" className="object-contain" />
        </div>
      ) : null}
      <div className="site-container relative">
        <h2 id="verdict-heading" className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--eg-text)] md:text-[38px] 2xl:text-[48px]">
          {V.h2}
        </h2>
        <Underline className="mt-2.5 h-[3px] w-[60px] md:mt-3" />

        <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-2 md:gap-4 lg:grid-cols-[41fr_59fr] lg:grid-rows-[auto_auto_1fr] lg:gap-x-6 2xl:mt-[22px]">
          <RatingCard
            starRating={data.starRating}
            confidence={data.confidence}
            isDark={isDark}
            className="md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1"
          />
          <QuoteCard oneLineVerdict={data.oneLineVerdict} className="md:col-start-2 md:row-start-1 lg:col-start-1 lg:row-start-2" />
          {rows.length ? (
            <ScoreCard
              title={cleanText(data.scoreNote) || V.scoreTitle}
              columns={columns}
              rows={rows}
              total={total}
              isDark={isDark}
              className="md:col-span-2 md:row-start-2 lg:col-span-1 lg:col-start-2 lg:row-span-3 lg:row-start-1"
            />
          ) : null}
          {data.bestFor || data.avoidIf ? (
            <div className="grid grid-cols-2 gap-3 self-start md:col-span-2 md:row-start-3 md:gap-4 lg:col-span-1 lg:col-start-1 lg:row-start-3 2xl:gap-3.5">
              {data.bestFor ? <AdviceCard tone="good" icon="check-circle" title={V.bestForLabel} text={sentence(data.bestFor)} /> : null}
              {data.avoidIf ? <AdviceCard tone="bad" icon="warning" title={V.avoidIfLabel} text={sentence(data.avoidIf)} /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
