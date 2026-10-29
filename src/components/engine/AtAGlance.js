"use client";

import Image from "next/image";
import { iconFileFor } from "@/components/home/homeIcons";
import ui from "@/data/shared/enginePageUi.json";
import { Accent, BmwRoundel, CARD, EIcon, Eyebrow, IconDisc, SECTION_CLASS, Stars, TagBadge, Underline, useEngineTone } from "./engineUi";
import { cleanText, glanceMap, isExclusive, normHyphen, splitTags } from "./engineText";

const T = ui.atAGlance;

// Canonical metric names (page.js already normalises U+2011; the models row has two spellings).
const METRICS = [
  // `client`: the client's own icon artwork (HomeIcon) where it matches the reference glyph.
  { key: "Engine Family", id: "family", icon: "engine", client: "engine" },
  { key: "Fuel", id: "fuel", icon: "drop", solid: true },
  { key: "Configuration / Displacement", id: "config", icon: "piston", client: "piston" },
  { key: "Power Range", id: "power", icon: "gauge" },
  { key: "Years Produced", id: "years", icon: "calendar", client: "calendar" },
  { key: "Models Fitted", id: "models", icon: "car", client: "car", prefix: true },
  { key: "Cross-Brand Fitment", id: "cross", icon: "roundel" },
  { key: "Overall Engine Score", id: "score", icon: "shield-check" },
];

// Light streaks across the page colour (the references' soft diagonal sheen).
const SHEEN = {
  dark: "linear-gradient(118deg, transparent 58%, rgba(40, 92, 190, 0.07) 70%, transparent 82%)",
  light:
    "linear-gradient(118deg, transparent 8%, rgba(255, 255, 255, 0.7) 22%, transparent 36%, transparent 58%, rgba(255, 255, 255, 0.6) 72%, transparent 86%)",
};

function fill(template = "", values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");
}

/** Rows keyed by canonical metric id, in display order; unknown metrics appended with a fallback icon. */
function collectMetrics(rows = []) {
  const map = glanceMap(rows);
  const used = new Set();
  const out = METRICS.map((m) => {
    const metric = Object.keys(map).find((k) => (m.prefix ? k.startsWith(m.key) : normHyphen(k).toLowerCase() === m.key.toLowerCase()));
    if (!metric) return null;
    used.add(metric);
    return { ...m, metric, value: map[metric] };
  }).filter(Boolean);
  const extra = Object.keys(map)
    .filter((k) => !used.has(k))
    .map((k) => ({ key: k, id: k, icon: "info", metric: k, value: map[k] }));
  return [...out, ...extra];
}

function labelOf(item, mobile = false) {
  if (mobile && T.mobileLabels?.[item.key]) return T.mobileLabels[item.key];
  return T.labels?.[item.key] || item.metric;
}

/** Leading model count: "8+ models" → 8, "E39 M5, E52 Z8 (2 models)" → 2, "8 Series (E31) …" → null. */
function modelCount(value = "") {
  const text = splitTags(value).text;
  const m = text.match(/(\d+)\+?\s*models?\b/i) || text.match(/^(\d+)\+?(?!\s*(?:Series|\d|\.))/i);
  return m ? Number(m[1]) : null;
}

function descriptionOf(item, facts) {
  const code = facts?.code || "";
  const d = T.descriptions || {};
  if (item.id === "config") return fill(d["Configuration / Displacement"], { code });
  if (item.id === "years") {
    const span = facts?.years?.span;
    if (!span) return "";
    return span >= 10 ? d.yearsDecade : fill(d.yearsShort, { n: span });
  }
  if (item.id === "models") {
    const n = modelCount(item.value);
    return n != null && n <= 3 && d.modelsFew ? d.modelsFew : d["Models Fitted"];
  }
  if (item.id === "cross") return fill(isExclusive(item.value) ? d.crossBrandExclusive : d.crossBrandShared, { code });
  return "";
}

/* ------------------------------------------------------------ watermarks */

function CalendarMark({ className }) {
  return (
    <svg viewBox="0 0 140 150" className={className} aria-hidden>
      <rect x="0" y="16" width="140" height="134" rx="16" fill="currentColor" />
      <rect x="30" y="0" width="12" height="38" rx="6" fill="currentColor" />
      <rect x="98" y="0" width="12" height="38" rx="6" fill="currentColor" />
      <rect x="11" y="50" width="118" height="89" rx="7" fill="var(--eg-card-solid)" opacity="0.45" />
      <g fill="currentColor">
        {[62, 88, 114].map((y) => [22, 51, 80, 109].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="17" height="15" rx="2.5" />))}
      </g>
    </svg>
  );
}

function CarMark({ className }) {
  return (
    <svg viewBox="0 0 200 112" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M46 14c3-7 9-10 17-10h74c8 0 14 3 17 10l14 34h6c4 0 6 2 6 5s-2 5-6 5h-2l4 6c3 4 4 8 4 13v25c0 4-3 6-6 6h-14c-4 0-6-2-6-6v-8H46v8c0 4-2 6-6 6H26c-3 0-6-2-6-6V77c0-5 1-9 4-13l4-6h-2c-4 0-6-2-6-5s2-5 6-5h6z"
      />
      <g fill="var(--eg-card-solid)" opacity="0.5">
        <path d="M56 18c2-5 5-7 10-7h68c5 0 8 2 10 7l11 28H45z" />
        <rect x="32" y="66" width="34" height="11" rx="5.5" />
        <rect x="134" y="66" width="34" height="11" rx="5.5" />
        <rect x="86" y="63" width="12" height="17" rx="4" />
        <rect x="102" y="63" width="12" height="17" rx="4" />
        <rect x="62" y="86" width="76" height="7" rx="3.5" />
      </g>
    </svg>
  );
}

function RoundelMark({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M50 50V20a30 30 0 0 0-30 30zM50 50v30a30 30 0 0 0 30-30z" fill="currentColor" />
      <g fill="currentColor" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="15" textAnchor="middle">
        <text x="26.5" y="31" transform="rotate(-42 26.5 31)">B</text>
        <text x="50" y="16.5">M</text>
        <text x="73.5" y="31" transform="rotate(42 73.5 31)">W</text>
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------- pieces */

function MetricIcon({ item, className }) {
  if (item.icon === "roundel") return <BmwRoundel className="h-[80%] w-[80%]" />;
  if (item.client) return <ClientGlyph name={item.client} className={className} />;
  return <EIcon name={item.icon} solid={item.solid} className={className} />;
}

/**
 * The client's icon artwork used as a mask and filled with --eg-blue, so it is exactly the same blue as the
 * EIcon glyphs beside it in both themes.
 */
function ClientGlyph({ name, className }) {
  const file = iconFileFor(name);
  if (!file) return null;
  const url = `url("/${encodeURIComponent("BMW Blue")}/${encodeURIComponent(file.replace(/\.png$/i, ".webp"))}")`;
  const mask = { maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" };
  return <span aria-hidden className={`block shrink-0 bg-[var(--eg-blue)] ${className}`} style={mask} />;
}

/** Value text with any [TAG] set small in blue after it (Power shows its tag as a badge instead). */
function ValueText({ value, className, tagClassName = "text-[13px] lg:text-[15px]" }) {
  const { text, tags } = splitTags(value);
  return (
    <p className={`min-w-0 font-bold text-[var(--eg-text)] [overflow-wrap:anywhere] ${className}`}>
      {text}
      {tags.map((tag) => (
        <span key={tag} className={`ml-2 inline-block whitespace-nowrap align-middle font-semibold tracking-normal text-[var(--eg-tag)] ${tagClassName}`}>
          [{tag}]
        </span>
      ))}
    </p>
  );
}

const isLong = (value) => splitTags(value).text.length > 20;

// Desktop sizes step up at md (tablet, 2 columns), lg (4 across), xl (1280) and 2xl (the 1536 reference).
const SOFT = "text-[color-mix(in_srgb,var(--eg-text)_84%,transparent)]";
const LABEL = "text-[14px] font-medium uppercase leading-tight tracking-[0.02em] text-[color-mix(in_srgb,var(--eg-text)_80%,transparent)] 2xl:text-[15px]";
const VALUE = "text-[24px] leading-[1.15] tracking-[-0.01em] xl:text-[26px] 2xl:text-[30px]";
const VALUE_LONG = "text-[19px] leading-[1.25] xl:text-[20px] 2xl:text-[22px]";
const DISC = "h-16 w-16 xl:h-[68px] xl:w-[68px] 2xl:h-[78px] 2xl:w-[78px]";
const GLYPH = "h-8 w-8 xl:h-10 xl:w-10 2xl:h-11 2xl:w-11";
const DESC = `text-[15px] leading-[1.5] ${SOFT} 2xl:text-[16px]`;

function ScoreValue({ score, compact = false }) {
  const missing = score == null;
  const stars = missing ? null : Math.round((score / 20) * 2) / 2;
  return (
    <>
      <p className={`whitespace-nowrap font-bold leading-none text-[var(--eg-text)] ${compact ? "text-[18px]" : "text-[22px] xl:text-[24px] 2xl:text-[28px]"}`}>
        <span className={`tracking-[-0.02em] text-[var(--eg-blue)] ${compact ? "text-[28px]" : "text-[36px] xl:text-[38px] 2xl:text-[44px]"}`}>
          {missing ? T.scoreMissing || "–" : score}
        </span>
        /100
      </p>
      {stars != null ? (
        <Stars
          value={stars}
          className={compact ? "h-[19px] w-[19px]" : "h-[22px] w-[22px] 2xl:h-6 2xl:w-6"}
          gap={compact ? "gap-[5px] mt-2" : "gap-1.5 mt-3 xl:gap-1 2xl:mt-4 2xl:gap-1.5"}
        />
      ) : null}
    </>
  );
}

/** Row 1: Engine Family, Fuel, Power Range, Engine Score — disc top-left, text centred beside it. */
function StatCard({ item, facts }) {
  const { text, tags } = splitTags(item.value);
  let body;
  if (item.id === "score") {
    body = <ScoreValue score={facts?.score ?? null} />;
  } else if (item.id === "power") {
    body = (
      <>
        <p className={`min-w-0 font-bold text-[var(--eg-text)] [overflow-wrap:anywhere] ${isLong(item.value) ? VALUE_LONG : VALUE}`}>{text}</p>
        {tags[0] ? <TagBadge className="mt-3 2xl:mt-4">{tags[0]}</TagBadge> : null}
      </>
    );
  } else {
    body = (
      <>
        <ValueText value={item.value} className={isLong(item.value) ? VALUE_LONG : VALUE} />
        <Underline className="mt-4 h-[3px] w-10 2xl:mt-5" />
      </>
    );
  }
  return (
    <article className={`${CARD} flex min-w-0 items-start gap-4 p-5 xl:gap-[18px] xl:px-6 2xl:gap-[22px] 2xl:pl-9 2xl:pr-6`}>
      <IconDisc size={DISC}>
        <MetricIcon item={item} className={GLYPH} />
      </IconDisc>
      <div className="min-w-0 flex-1 self-center pt-2 xl:pt-4 2xl:pt-5">
        <h3 className={LABEL}>{labelOf(item)}</h3>
        <div className="mt-2.5 2xl:mt-3">{body}</div>
      </div>
    </article>
  );
}

// Room kept beside the text at the widths where each watermark is shown, so long values wrap before it.
const MARK_ROOM = {
  years: "xl:mr-[120px] 2xl:mr-[150px]",
  models: "xl:mr-[150px] 2xl:mr-[175px]",
  cross: "md:mr-[150px] lg:mr-0 xl:mr-[150px] 2xl:mr-[170px]",
};

/** Rows 2–3: label, value, description, plus the image / watermark on the right. */
function FeatureCard({ item, facts, media, className = "" }) {
  const desc = descriptionOf(item, facts);
  const long = isLong(item.value);
  let art = null;
  let reserve = null;
  if (item.id === "config" && media) {
    const car = media.kind === "car";
    art = (
      <div
        aria-hidden
        className={`pointer-events-none absolute ${
          car ? "bottom-0 right-0 aspect-[640/310] max-h-[92%] w-[44%] max-w-[340px]" : "-bottom-[12%] right-[2%] top-[4%] w-[35%] max-w-[280px]"
        }`}
      >
        <Image src={media.src} alt="" fill sizes="340px" className="object-contain object-bottom" />
      </div>
    );
    // Inline so no responsive padding utility can override the room kept for the image.
    reserve = { paddingRight: car ? "45%" : "36%" };
  } else if (item.id === "years") {
    art = <CalendarMark className="pointer-events-none absolute right-[4%] hidden xl:block top-1/2 h-[118px] w-[110px] -translate-y-1/2 text-[var(--eg-watermark)] 2xl:h-[148px] 2xl:w-[138px]" />;
  } else if (item.id === "models") {
    art = <CarMark className="pointer-events-none absolute bottom-[6%] hidden xl:block right-[7%] w-[150px] text-[var(--eg-watermark)] 2xl:w-[180px]" />;
  } else if (item.id === "cross") {
    art = <RoundelMark className="pointer-events-none absolute -bottom-6 hidden md:block lg:hidden xl:block right-[4%] h-[150px] w-[150px] text-[var(--eg-watermark)] 2xl:h-[172px] 2xl:w-[172px]" />;
  }
  return (
    <article className={`${CARD} relative min-w-0 overflow-hidden ${className}`}>
      {art}
      <div className="relative flex items-start gap-4 p-6 lg:gap-4 xl:gap-5 xl:px-8 xl:py-7 2xl:gap-[26px] 2xl:px-9 2xl:py-[34px]" style={reserve || undefined}>
        <IconDisc size={`${DISC} ${item.id === "cross" ? "" : "mt-1"}`}>
          <MetricIcon item={item} className={GLYPH} />
        </IconDisc>
        <div className={`min-w-0 flex-1 pt-1.5 2xl:pt-2.5 ${MARK_ROOM[item.id] || ""}`}>
          <h3 className={LABEL}>{labelOf(item)}</h3>
          <ValueText value={item.value} className={`mt-2.5 2xl:mt-3 ${long ? VALUE_LONG : VALUE}`} />
          {desc ? <p className={`mt-3 max-w-[300px] xl:max-w-[275px] 2xl:mt-4 ${DESC}`}>{desc}</p> : null}
        </div>
      </div>
    </article>
  );
}

/** Phone: disc | label | divider | value list row. */
function MobileRow({ item, facts }) {
  const { text, tags } = splitTags(item.value);
  let value;
  if (item.id === "score") value = <ScoreValue score={facts?.score ?? null} compact />;
  else if (item.id === "power")
    value = (
      <>
        <p className={`font-bold leading-[1.2] tracking-[-0.01em] text-[var(--eg-text)] [overflow-wrap:anywhere] ${text.length > 24 ? "text-[14px]" : "text-[16px]"}`}>{text}</p>
        {tags[0] ? <TagBadge className="mt-2 max-w-full gap-1.5! px-2! py-1! text-[12px]!">{tags[0]}</TagBadge> : null}
      </>
    );
  else
    value = (
      <ValueText value={item.value} className={`leading-[1.2] tracking-[-0.01em] ${text.length > 24 ? "text-[14px]" : "text-[16px]"}`} tagClassName="text-[12px]" />
    );
  return (
    <li className={`${CARD} grid min-h-[70px] grid-cols-[48px_minmax(0,0.88fr)_1px_minmax(0,1.32fr)] items-center gap-x-2.5 rounded-[12px] py-[11px] pl-3 pr-2`}>
      <IconDisc size="h-12 w-12">
        <MetricIcon item={item} className="h-[30px] w-[30px]" />
      </IconDisc>
      <h3 className="min-w-0 text-[13.5px] leading-[1.25] text-[var(--eg-muted)]">{labelOf(item, true)}</h3>
      <span aria-hidden className="h-11 w-px self-center bg-[var(--eg-divider)]" />
      <div className="min-w-0 pl-0.5">{value}</div>
    </li>
  );
}

function TrustBar({ facts }) {
  const items = (T.trustBar || []).map((item) => ({
    ...item,
    text: item.text?.includes("{enquiries}") && !facts?.enquiries ? item.fallback || item.text : fill(item.text, { enquiries: facts?.enquiries }),
  }));
  if (!items.length) return null;
  return (
    <ul className={`${CARD} mt-3 grid grid-cols-2 md:mt-4 xl:grid-cols-4`}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`relative flex min-w-0 flex-col items-start gap-1.5 p-3 md:flex-row md:items-center md:gap-3 md:px-4 md:py-5 xl:gap-3.5 xl:px-5 2xl:gap-4 2xl:px-6 2xl:py-[22px] ${
            i % 2 ? "before:absolute before:left-0 before:top-1/2 before:h-[55%] before:w-px before:-translate-y-1/2 before:bg-[var(--eg-divider)]" : ""
          } ${i === 2 ? "xl:before:absolute xl:before:left-0 xl:before:top-1/2 xl:before:h-[55%] xl:before:w-px xl:before:-translate-y-1/2 xl:before:bg-[var(--eg-divider)]" : ""} ${
            i > 1 ? "border-t border-[var(--eg-divider)] xl:border-t-0" : ""
          }`}
        >
          <EIcon
            name={item.icon}
            solid={item.icon === "users"}
            strokeWidth={1.6}
            className="h-7 w-7 shrink-0 text-[var(--eg-blue)] md:h-9 md:w-9 xl:h-10 xl:w-10 2xl:h-11 2xl:w-11"
          />
          <div className="min-w-0">
            <h3 className="text-[12px] font-semibold uppercase leading-tight tracking-[0.02em] text-[var(--eg-text)] md:text-[14px] xl:text-[15px]">
              {item.title}
            </h3>
            <p className={`mt-1 text-[12px] leading-[1.45] md:text-[14px] xl:text-[15px] 2xl:mt-1.5 ${SOFT}`}>{cleanText(item.text)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AtAGlance({ data, facts, engineImage, heroCar }) {
  const { isDark, vars } = useEngineTone();
  if (!data) return null;

  const items = collectMetrics(data.rows);
  const by = Object.fromEntries(items.map((item) => [item.id, item]));
  const code = facts?.code || "";
  const h2 = fill(T.h2, { code }).replace(/\s+/g, " ").trim();
  const engineSrc = typeof engineImage === "string" ? engineImage : engineImage?.src;
  const media = engineSrc ? { kind: "engine", src: engineSrc } : heroCar?.src ? { kind: "car", src: heroCar.src } : null;

  const top = ["family", "fuel", "power", "score"].map((id) => by[id]).filter(Boolean);
  const topCols = top.length === 4 ? "32fr 33fr 35fr 30fr" : `repeat(${top.length || 1}, minmax(0, 1fr))`;
  const lower = ["config", "years", "models", "cross"].map((id) => by[id]).filter(Boolean);
  const extras = items.filter((item) => !METRICS.some((m) => m.id === item.id));
  // Desktop: row 2 is 55:45 (config | years), row 3 is 50:50 (models | cross) on a 20-column grid.
  // Tablet: config and cross span both columns; years and models pair up.
  const SPAN = {
    config: "md:col-span-2 lg:col-span-11",
    years: "lg:col-span-9",
    models: "lg:col-span-10",
    cross: "md:col-span-2 lg:col-span-10",
  };

  return (
    <section
      aria-labelledby="at-a-glance-heading"
      className={`${SECTION_CLASS} section-y`}
      style={{ ...vars, backgroundImage: isDark ? SHEEN.dark : SHEEN.light }}
    >
      <div className="site-container relative">
        <header className="mx-auto max-w-[960px] text-center">
          <Eyebrow both className="text-[14px] font-semibold md:text-[18px] 2xl:text-[20px]" lineClassName="w-[22px] md:w-[30px]">
            {T.eyebrow}
          </Eyebrow>
          <h2
            id="at-a-glance-heading"
            className="mt-2 text-balance text-[24px] font-bold leading-[1.12] tracking-[-0.02em] md:text-[36px] lg:text-[44px] 2xl:mt-1.5 2xl:text-[54px]"
          >
            <Accent text={h2} accent={code} />
          </h2>
          {T.subHeading ? (
            <p className={`mx-auto mt-2.5 max-w-[345px] text-[13.5px] leading-[1.5] md:max-w-[620px] md:text-[17px] 2xl:mt-2.5 2xl:text-[18px] 2xl:leading-[1.55] ${SOFT}`}>
              {T.subHeading}
            </p>
          ) : null}
        </header>

        {/* Phone: list rows */}
        <ul className="mt-6 grid gap-2.5 md:hidden">
          {items.map((item) => (
            <MobileRow key={item.id} item={item} facts={facts} />
          ))}
        </ul>

        {/* Tablet + desktop: card grid */}
        <div className="mt-7 hidden md:block 2xl:mt-6">
          {top.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:[grid-template-columns:var(--ag-top)]" style={{ "--ag-top": topCols }}>
              {top.map((item) => (
                <StatCard key={item.id} item={item} facts={facts} />
              ))}
            </div>
          ) : null}
          {lower.length || extras.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-20 2xl:mt-[18px] 2xl:gap-y-[18px]">
              {lower.map((item) => (
                <FeatureCard key={item.id} item={item} facts={facts} media={item.id === "config" ? media : null} className={SPAN[item.id]} />
              ))}
              {extras.map((item) => (
                <FeatureCard key={item.id} item={item} facts={facts} className="lg:col-span-10" />
              ))}
            </div>
          ) : null}
        </div>

        <TrustBar facts={facts} />
      </div>
    </section>
  );
}
