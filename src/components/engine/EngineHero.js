"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import ui from "@/data/shared/enginePageUi.json";
import { BmwRoundel, CARD, DataText, EIcon, SECTION_CLASS, useEngineTone } from "./engineUi";
import { cleanText, codeVariants, hasPlaceholder, normHyphen, splitFigure, splitTags, stripTags } from "./engineText";

const T = ui.hero;

/** "{code}" etc. filled from `vars`. */
function fill(template = "", vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

/* ---------------------------------------------------------------- data */

/** Pill items: the data's "BMW • N47 • Diesel • …", or built from the facts when the data has none. */
function pillItems(tagPill, facts) {
  const raw = normHyphen(tagPill || "").replace(/â€¢/g, "•");
  const items = raw.split("•").map((item) => stripTags(item)).filter(Boolean);
  if (items.length) return items;
  const fuel = stripTags(facts?.fuel).replace(/\s*\(.*?\)/g, "").trim();
  const config = stripTags(facts?.configuration).replace(/\s*\(.*?\)/g, "").trim();
  return ["BMW", facts?.code, fuel, config, facts?.years?.label].filter(Boolean);
}

/** Count of models: "8+ models" → "8+", "12 (5, 6, 7 Series…)" → "12", "M3 (E90), M5, M6" → "3". */
function modelsFigure(value = "") {
  const text = stripTags(value);
  if (!text || hasPlaceholder(value)) return "";
  const lead = text.match(/^(\d+\+?)\s*(?:models?\b|\(|$)/i);
  if (lead) return lead[1];
  const inner = text.match(/\((\d+\+?)\s+models?\)/i);
  if (inner) return inner[1];
  // Top-level comma list ("3 Series (E21, E30), 5 Series (E28), 6 Series") → its length.
  let depth = 0;
  let count = 1;
  for (const ch of text) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) count += 1;
  }
  return count > 1 ? String(count) : "";
}

/** The stat cards: figures from the hero strip, filled from At a Glance where the strip is empty or a placeholder. */
function statCards(hero, facts) {
  const strip = (hero?.trustStrip || []).map((item) => normHyphen(item?.label || ""));
  const find = (re) => strip.find((label) => re.test(label)) || "";
  const cards = [];

  const enquiries = find(/enquir/i);
  const enquiriesFigure = splitFigure(enquiries).figure || facts?.enquiries || "";
  if (enquiriesFigure) {
    cards.push({ kind: "enquiries", figure: enquiriesFigure, tags: splitTags(enquiries).tags, weight: 33 });
  }

  const models = find(/model/i);
  const modelsFig = splitFigure(models).figure || modelsFigure(facts?.modelsFitted);
  if (modelsFig) cards.push({ kind: "models", figure: modelsFig, tags: [], weight: 34 });

  const score = find(/score/i);
  const scoreFig = splitFigure(score).figure || (facts?.score != null ? `${facts.score}/100` : "");
  if (scoreFig) cards.push({ kind: "score", figure: scoreFig.includes("/") ? scoreFig : `${scoreFig}/100`, tags: [], weight: 32 });

  cards.push({ kind: "partOf", weight: 39 });
  return cards;
}

/** Lead copy split around inline <a href> links (one page links a sibling engine). */
function leadParts(text = "") {
  const out = [];
  const re = /<a\s+[^>]*href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/gi;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ href: m[1].replace(/^https?:\/\/(?:www\.)?bmwengines\.uk/i, "") || "/", text: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** Title as shown: cleaned, with a no-break space before the dash ("Engine –" never leaves "– Specs" to start a line). */
function titleText(title = "") {
  return cleanText(title).replace(/ – /, "\u00a0– ");
}

/** Weighted title length (M and W are the widest capitals in Inter Bold); drives the H1 size and fold steps. */
function titleWeight(text = "") {
  return text.length + 0.4 * (text.match(/[MW]/g) || []).length;
}

/* --------------------------------------------------------------- icons */

// Solid glyphs for the stat cards (the reference fills these; the trust bar uses the kit's line icons).
function StatGlyph({ kind, className }) {
  if (kind === "enquiries") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <circle cx="12" cy="6.4" r="3.1" />
        <path d="M7.4 21v-5.6a3.4 3.4 0 0 1 3.4-3.4h2.4a3.4 3.4 0 0 1 3.4 3.4V21z" />
        <circle cx="4.9" cy="9.2" r="2.3" />
        <path d="M1 20.2v-3.6a2.6 2.6 0 0 1 2.6-2.6h2.6a4.8 4.8 0 0 0-.4 1.9v4.3z" />
        <circle cx="19.1" cy="9.2" r="2.3" />
        <path d="M23 20.2v-3.6a2.6 2.6 0 0 0-2.6-2.6h-2.6c.26.6.4 1.24.4 1.9v4.3z" />
      </svg>
    );
  }
  if (kind === "models") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" fillRule="evenodd" aria-hidden>
        <path d="M5.6 9.6 7.2 5.4A1.9 1.9 0 0 1 9 4.2h6a1.9 1.9 0 0 1 1.8 1.2l1.6 4.2.9-.5a.7.7 0 0 1 .7 1.2l-.8.5A2.4 2.4 0 0 1 21 13v4.6a.9.9 0 0 1-.9.9H20v1.3a1 1 0 0 1-1 1h-1.6a1 1 0 0 1-1-1v-1.3H7.6v1.3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1.3h-.1a.9.9 0 0 1-.9-.9V13a2.4 2.4 0 0 1 1.8-2.3l-.8-.5a.7.7 0 0 1 .7-1.2zM7.5 9.9h9l-1.2-3.3a.8.8 0 0 0-.75-.5h-5.1a.8.8 0 0 0-.75.5zM6.6 15.5a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8zm10.8 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8z" />
      </svg>
    );
  }
  if (kind === "score") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2.8 19.8 6v5.6c0 4.7-3.3 8.5-7.8 9.7-4.5-1.2-7.8-5-7.8-9.7V6z" />
        <path d="M12 8.6v6.8M10.2 12h3.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.6 3h10.8v5.8a5.4 5.4 0 0 1-10.8 0z" />
      <path d="M6.8 5H3.6v1.2a4.2 4.2 0 0 0 3.9 4.2M17.2 5h3.2v1.2a4.2 4.2 0 0 1-3.9 4.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10.9 13.9h2.2v3.6h-2.2z" />
      <path d="M7.6 21v-1.4c0-.9.7-1.6 1.6-1.6h5.6c.9 0 1.6.7 1.6 1.6V21z" />
    </svg>
  );
}

/* ------------------------------------------------------------ elements */

function Pill({ items, isDark, wide }) {
  if (!items.length) return null;
  return (
    <div
      className={`flex w-full max-w-full items-center gap-2 ${wide ? "lg:w-max lg:max-w-[119%] xl:max-w-[129%]" : ""} rounded-[19px] border py-1 pl-1 pr-2.5 md:inline-flex md:w-auto md:gap-4 md:rounded-[23px] md:pr-5 lg:rounded-[27px] xl:gap-6 xl:pr-6 2xl:gap-[30px] 2xl:pr-7 ${
        isDark
          ? "border-white/[0.11] bg-white/[0.015]"
          : "border-[#e3eaf5] bg-white/75 shadow-[0_6px_18px_rgba(16,42,86,0.06)] backdrop-blur-md"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${isDark ? "bg-[#05080e] ring-1 ring-white/[0.12]" : ""}`}
      >
        <BmwRoundel className="h-[26px] w-[26px] md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11" label="BMW" />
      </span>
      {/* Each item carries its own leading bullet; the wrapper clips the bullet that starts a line. */}
      <div className="min-w-0 overflow-hidden">
        <ul className="-ml-[15px] flex flex-wrap items-center gap-y-0.5 py-0.5 text-[12.5px] leading-[1.35] md:-ml-[33px] md:text-[15px] lg:-ml-[25px] lg:text-[14px] lg:uppercase xl:-ml-[33px] xl:text-[15px] 2xl:-ml-[41px] 2xl:text-[16px]">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center">
              <span aria-hidden className="w-[15px] shrink-0 text-center text-[var(--eg-muted)] md:w-[33px] lg:w-[25px] xl:w-[33px] 2xl:w-[41px]">
                {"\u2022"}
              </span>
              <span className={index === 1 ? "text-[var(--eg-blue)]" : "text-[var(--eg-text)]"}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** H1 with only the engine code in blue; "/" in long codes may break the line. */
function HeroTitle({ title, code }) {
  const text = titleText(title);
  const hit = codeVariants(code || "").find((v) => text.includes(v));
  // Step the size down for long codes so the title keeps the reference's three lines where it can.
  const size =
    titleWeight(text) > 57
      ? "text-[29px] md:text-[42px] lg:text-[44px] xl:text-[50px] 2xl:text-[54px]"
      : "text-[31px] md:text-[46px] lg:text-[50px] xl:text-[60px] 2xl:text-[66px]";
  const codeSpan = (value) =>
    value.split("/").map((part, i, all) => (
      <Fragment key={i}>
        {part}
        {i < all.length - 1 ? (
          <>
            /<wbr />
          </>
        ) : null}
      </Fragment>
    ));
  let body = text;
  if (hit) {
    const at = text.indexOf(hit);
    body = (
      <>
        {text.slice(0, at)}
        <span className="text-[var(--eg-blue)]">{codeSpan(hit)}</span>
        {text.slice(at + hit.length)}
      </>
    );
  }
  return <h1 className={`font-bold leading-[1.17] tracking-[-0.02em] text-[var(--eg-text)] ${size}`}>{body}</h1>;
}

/** Plain length of the lead (tags kept, links reduced to their text). */
function leadLength(text = "") {
  return cleanText(String(text || "").replace(/<[^>]+>/g, "")).length;
}

// Desktop lead size by length, so long leads keep the fold at 1536×864: 21px (≤200 chars, n47), 19px, then 18px across the column.
const LEAD_SIZE = {
  short: "lg:max-w-[560px] xl:text-[20px] 2xl:text-[21px]",
  mid: "lg:max-w-[560px] xl:text-[19px]",
  long: "lg:max-w-none",
};

function Lead({ text, tight }) {
  const parts = leadParts(text || "");
  if (!parts.length) return null;
  const length = leadLength(text);
  const size = length > 240 ? LEAD_SIZE.long : length > 200 ? LEAD_SIZE.mid : LEAD_SIZE.short;
  return (
    <p
      className={`mt-3 max-w-[560px] text-[16px] leading-[1.5] text-[var(--eg-muted)] md:mt-5 md:max-w-[620px] md:text-[18px] ${size} ${tight ? "lg:mt-3" : ""}`}
    >
      {parts.map((part, i) =>
        part.href ? (
          <Link key={i} href={part.href} className="font-normal text-[var(--eg-tag)] underline-offset-2 hover:underline">
            {cleanText(part.text)}
          </Link>
        ) : (
          // DataText trims its copy, so keep the spaces that sit next to an inline link.
          <Fragment key={i}>
            {i > 0 && /^\s/.test(part.text) ? " " : null}
            <DataText text={part.text} />
            {i < parts.length - 1 && /\s$/.test(part.text) ? " " : null}
          </Fragment>
        ),
      )}
    </p>
  );
}

function StatCard({ card, count, index, code }) {
  const odd = count % 2 === 1 && index === count - 1;
  const copy = T.statCards[card.kind] || {};
  const label = card.kind === "models" && card.figure === "1" ? copy.labelOne || copy.label : copy.label;
  return (
    <li
      style={{ "--w": card.weight }}
      className={`${CARD} flex min-w-0 items-start gap-2 px-2.5 py-3 backdrop-blur-md md:gap-4 md:px-5 md:py-5 lg:gap-3 lg:px-4 lg:py-5 lg:[flex:var(--w)_1_0%] xl:gap-5 xl:px-6 xl:py-6 ${
        odd ? "col-span-2" : ""
      }`}
    >
      <StatGlyph kind={card.kind} className="mt-0.5 h-[30px] w-[30px] shrink-0 text-[var(--eg-blue)] md:h-11 md:w-11 lg:h-9 lg:w-9 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14" />
      {card.kind === "partOf" ? (
        <div className="min-w-0">
          <p className="text-[12px] leading-[1.3] text-[var(--eg-text)] md:text-[16px] xl:text-[18px]">{copy.pre}</p>
          <p className="mt-0.5 text-[13px] font-semibold uppercase leading-[1.25] text-[var(--eg-text)] md:text-[18px] xl:mt-1 xl:text-[21px]">
            {copy.title}
          </p>
          <p className="mt-1 text-[12px] leading-[1.35] text-[var(--eg-muted)] md:text-[14px] xl:mt-2 xl:text-[15px]">{copy.sub}</p>
        </div>
      ) : (
        <div className="min-w-0">
          <p className="text-[22px] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--eg-text)] md:text-[28px] xl:text-[32px]">
            {card.figure}
          </p>
          <p className="mt-1 text-[12px] font-medium uppercase leading-[1.25] text-[var(--eg-text)] md:text-[15px] xl:mt-1 xl:text-[18px]">
            {fill(label, { code })}
          </p>
          <p className="mt-1 text-[12px] leading-[1.35] text-[var(--eg-muted)] md:text-[14px] xl:mt-1.5 xl:text-[15px]">
            {copy.sub}
            {card.tags.map((tag) => (
              <span key={tag} className="whitespace-nowrap text-[var(--eg-tag)] max-[399px]:block">
                {` [${tag}]`}
              </span>
            ))}
          </p>
        </div>
      )}
    </li>
  );
}

function TrustBar() {
  const items = T.trustBar || [];
  if (!items.length) return null;
  return (
    <ul
      className={`${CARD} mt-4 grid grid-cols-[repeat(4,auto)] px-0.5 py-4 backdrop-blur-md max-[359px]:grid-cols-2 max-[359px]:gap-y-4 md:mt-7 md:grid-cols-4 md:px-2 md:py-6 lg:flex lg:px-0 lg:py-0 xl:mt-8`}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          className="relative flex min-w-0 flex-col items-center gap-2 px-1 text-center md:gap-3 md:px-2 lg:flex-auto lg:flex-row lg:gap-4 lg:px-5 lg:py-6 lg:text-left xl:gap-5 xl:px-7 xl:py-7 2xl:px-8"
        >
          {index > 0 ? (
            <span
              aria-hidden
              className={`absolute left-0 top-1/2 h-[86%] w-px -translate-y-1/2 bg-[var(--eg-divider)] lg:h-[44%] ${index === 2 ? "max-[359px]:hidden" : ""}`}
            />
          ) : null}
          <EIcon
            name={item.icon}
            strokeWidth={1.6}
            className="h-8 w-8 shrink-0 text-[var(--eg-blue)] md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-[50px] xl:w-[50px] 2xl:h-[54px] 2xl:w-[54px]"
          />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase leading-[1.3] tracking-[-0.01em] text-[var(--eg-text)] md:text-[14px] lg:text-[15px] lg:font-medium 2xl:text-[16px]">
              {/* Hyphenated words ("BMW-Verified") never split at the hyphen. */}
              {item.title.split(" ").map((word, i) => (
                <Fragment key={i}>
                  {i > 0 ? " " : null}
                  {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
                </Fragment>
              ))}
            </p>
            <p className="mt-1 text-[12px] leading-[1.35] text-[var(--eg-muted)] md:text-[14px] xl:mt-1.5 xl:text-[15px]">{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Right column: engine cut-out (blue rim glow in dark), the car on a floor glow, or a code watermark. */
function HeroVisual({ engineImage, heroCar, code, isDark }) {
  const engineSrc = typeof engineImage === "string" ? engineImage : engineImage?.src;
  if (engineSrc) {
    return (
      <div className="pointer-events-none relative mx-auto -mb-[11%] -mt-[2%] aspect-square w-[86%] max-w-[400px] md:-mb-[7%] md:-mt-[4%] md:max-w-[480px] lg:absolute lg:inset-x-[3%] lg:bottom-[-92px] lg:top-[-26px] lg:m-0 lg:aspect-auto lg:w-auto lg:max-w-none">
        {isDark ? (
          <span
            aria-hidden
            className="absolute right-[3%] top-[18%] h-[66%] w-[36%] rounded-full bg-[radial-gradient(closest-side,rgba(30,100,255,0.8),rgba(30,100,255,0.28)_55%,transparent)] blur-2xl"
          />
        ) : null}
        <Image
          src={engineSrc}
          alt={fill(T.engineAlt, { code })}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 90vw"
          className={`object-contain object-bottom ${isDark ? "" : "drop-shadow-[0_26px_28px_rgba(16,42,86,0.2)]"}`}
        />
      </div>
    );
  }
  if (heroCar?.src) {
    // Phone/tablet: in flow at the car's own aspect. Desktop: a box from below the pill to the cards, so a
    // tall car (X5) never reaches the pill; contain keeps it on the floor glow and never stretched.
    return (
      <div
        style={{ "--ar": `${heroCar.width} / ${heroCar.height}` }}
        className="pointer-events-none relative mx-auto mt-6 w-[92%] max-w-[480px] [aspect-ratio:var(--ar)] md:mt-8 md:max-w-[560px] lg:absolute lg:inset-x-0 lg:bottom-[6px] lg:top-[72px] lg:m-0 lg:mx-auto lg:w-[94%] lg:max-w-[620px] lg:[aspect-ratio:auto]"
      >
        <span
          aria-hidden
          className={`absolute inset-x-[4%] bottom-[-10%] h-[34%] rounded-[50%] blur-xl lg:bottom-[-26px] lg:h-[84px] ${
            isDark
              ? "bg-[radial-gradient(closest-side,rgba(40,110,255,0.42),rgba(40,110,255,0.12)_60%,transparent)]"
              : "bg-[radial-gradient(closest-side,rgba(16,42,86,0.22),rgba(16,42,86,0.06)_60%,transparent)]"
          }`}
        />
        <Image
          src={heroCar.src}
          alt={fill(T.carAlt, { code })}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 92vw"
          className="object-contain object-bottom"
        />
      </div>
    );
  }
  // No photo: the light band carries the right side, with the code as a faint watermark.
  return (
    <div aria-hidden className="pointer-events-none hidden lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center">
      <span
        className={`absolute right-[4%] top-[8%] h-[80%] w-[70%] rounded-full blur-3xl ${
          isDark ? "bg-[radial-gradient(closest-side,rgba(31,104,255,0.28),transparent)]" : "bg-[radial-gradient(closest-side,rgba(255,255,255,0.9),transparent)]"
        }`}
      />
      <span className="relative whitespace-nowrap text-[clamp(90px,10vw,170px)] font-bold leading-none tracking-[-0.03em] text-[var(--eg-watermark)]">
        {code}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- section */

export default function EngineHero({ data, facts = {}, engineImage, heroCar }) {
  const { isDark, vars } = useEngineTone();
  if (!data) return null;

  const code = facts.code || "";
  const items = pillItems(data.tagPill, facts);
  const cards = statCards(data, facts);
  const ctaLabel = cleanText((data.primaryCta?.label || fill(T.ctaFallback, { code })).replace(/\s*(?:→|â†’|->)\s*$/, ""));
  const ctaHref = data.primaryCta?.href || T.ctaHref;
  // Fold steps (1536×864): a 4-line H1 or a long lead tightens the H1 → lead → cards gaps; with no engine
  // to its right the pill may run wider than the text column (the car sits below it, see HeroVisual).
  const tight = titleWeight(titleText(data.h1)) > 61 || leadLength(data.subHeadline) > 240;
  const hasEngine = Boolean(typeof engineImage === "string" ? engineImage : engineImage?.src);

  return (
    <section style={vars} className={`${SECTION_CLASS} isolate`}>
      {/* Background: near-black navy / pale blue, with a broad diagonal light band rising to the top right. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(180deg,#00050c_0%,#01070f_60%,#030b18_100%)]"
              : "bg-[linear-gradient(180deg,#f0f5fc_0%,#e9f0fa_55%,#dfe8f5_100%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(118deg,transparent_54%,rgba(20,58,132,0.26)_56.5%,rgba(22,64,150,0.28)_64%,rgba(14,44,104,0.16)_72%,transparent_78%)]"
              : "bg-[linear-gradient(118deg,transparent_44%,rgba(255,255,255,0.75)_52%,rgba(214,228,248,0.55)_60%,rgba(255,255,255,0.6)_68%,transparent_77%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(118deg,transparent_55.5%,rgba(64,124,236,0.14)_56.5%,transparent_58.5%)]"
              : "bg-[linear-gradient(118deg,transparent_30%,rgba(255,255,255,0.55)_33%,transparent_37%)]"
          }`}
        />
      </div>

      <div className="site-container relative pb-10 pt-5 md:pb-12 md:pt-8 lg:pb-12 lg:pt-8 xl:pt-9">
        <div className="grid lg:grid-cols-[52fr_48fr] lg:gap-x-6 xl:grid-cols-[48fr_52fr]">
          <div className="relative z-10 min-w-0">
            <Pill items={items} isDark={isDark} wide={!hasEngine} />
            <div className="mt-4 md:mt-6">
              <HeroTitle title={data.h1} code={code} />
            </div>
            <Lead text={data.subHeadline} tight={tight} />
          </div>
          <div className="relative min-w-0">
            <HeroVisual engineImage={engineImage} heroCar={heroCar} code={code} isDark={isDark} />
          </div>
        </div>

        <ul className={`relative z-10 mt-3 grid grid-cols-2 gap-2 md:mt-6 md:gap-3 lg:flex lg:gap-4 ${tight ? "lg:mt-5" : "lg:mt-7"}`}>
          {cards.map((card, index) => (
            <StatCard key={card.kind} card={card} count={cards.length} index={index} code={code} />
          ))}
        </ul>

        <Link
          href={ctaHref}
          className="relative z-10 mt-4 flex min-h-[46px] w-full items-center justify-center gap-3 rounded-[8px] px-5 py-3 text-[15px] font-semibold uppercase leading-[1.25] text-[var(--eg-cta-text)] shadow-[0_10px_28px_rgba(26,92,240,0.3)] [background:var(--eg-cta)] md:mt-6 md:inline-flex md:w-auto md:px-8 md:text-[16px] lg:min-h-[56px] lg:text-[17px] xl:mt-6 xl:min-h-[61px] xl:px-10 xl:text-[19px]"
        >
          <span className="min-w-0 text-center">{ctaLabel}</span>
          <EIcon name="arrow-right" strokeWidth={2} className="h-5 w-5 shrink-0 xl:h-6 xl:w-6" />
        </Link>

        <TrustBar />
      </div>
    </section>
  );
}
