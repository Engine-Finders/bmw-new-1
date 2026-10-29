"use client";

import Image from "next/image";
import Link from "next/link";
import ui from "@/data/shared/enginePageUi.json";
import { CARD, DataText, EIcon, Eyebrow, IconDisc, SECTION_CLASS, useEngineTone } from "./engineUi";
import { isExclusive, stripTags } from "./engineText";

const UI = ui.compatibility;

// Section-only tones on top of the kit palette (light section is near-white with a soft blue glow).
const LOCAL = {
  dark: {
    "--cm-line": "rgba(46, 112, 255, 0.6)",
    "--cm-tick": "rgba(46, 112, 255, 0.42)",
    "--cm-glow": "radial-gradient(closest-side, rgba(31, 111, 255, 0.16), rgba(31, 111, 255, 0.05) 55%, transparent)",
    "--cm-years": "rgba(77, 148, 255, 0.55)",
    "--cm-other-border": "var(--eg-card-border)",
    "--cm-soft": "rgba(31, 111, 255, 0.1)",
    "--cm-soft-border": "rgba(77, 148, 255, 0.3)",
  },
  light: {
    "--eg-page": "#fcfdfe",
    "--cm-line": "rgba(18, 104, 243, 0.55)",
    "--cm-tick": "rgba(18, 104, 243, 0.4)",
    "--cm-glow": "radial-gradient(closest-side, rgba(18, 104, 243, 0.1), rgba(18, 104, 243, 0.04) 60%, transparent)",
    "--cm-years": "rgba(18, 104, 243, 0.45)",
    "--cm-other-border": "#d3dceb",
    "--cm-soft": "#f3f6fe",
    "--cm-soft-border": "#e3e9f2",
  },
};

const fill = (template = "", vars = {}) => String(template).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
const noHtml = (value) => String(value ?? "").replace(/<[^>]*>/g, "");
/** Data value as plain text: HTML, [TAGS] and placeholders removed, dashes cleaned. */
const bare = (value) => stripTags(noHtml(value));
const isBlank = (value) => !value || /^[\s\-–—]*$/.test(value);

/* ------------------------------------------------------------------ data */

const FIELDS = ["model", "generation", "variantBadge", "years"];

/** Photos were picked for the shifted rows: give each re-chunked row the one for its generation (or model). */
function rematchPhotos(rows, original) {
  const pool = [...new Set(original.map((row) => row.image).filter(Boolean))];
  const used = new Set();
  const pick = (test) => {
    const hit = pool.find((src) => !used.has(src) && test(String(src).toLowerCase()));
    if (hit) used.add(hit);
    return hit || null;
  };
  return rows.map((row) => {
    const codes = bare(row.generation).toLowerCase().match(/\b[a-z]\d{2}\b/g) || [];
    const model = bare(row.model).replace(/^BMW\s+/i, "").toLowerCase().replace(/\s+/g, "-");
    const image = pick((src) => codes.some((code) => src.includes(`-${code}-`))) || pick((src) => src.includes(`-${model}-`));
    return { ...row, image, cardImage: null };
  });
}

/** Two pages' tables leaked an "Engine" header cell, shifting every field: re-chunk as model, generation, variant, years, engine. */
function realign(rows) {
  if (!rows.length || !/^engine$/i.test(bare(rows[0].model))) return rows;
  const cells = rows.flatMap((row) => FIELDS.map((field) => row[field] ?? ""));
  const out = [];
  for (let i = 1; i + 3 < cells.length; i += 5) {
    const [model, generation, variantBadge, years] = cells.slice(i, i + 4);
    out.push({ model, generation, variantBadge, years });
  }
  return rematchPhotos(out, rows);
}

/** Fitment rows become cards; "Variant notes:"-style rows become a notes strip. */
function splitRows(rows = []) {
  const cards = [];
  const notes = [];
  realign(rows).forEach((row) => {
    const model = bare(row.model);
    if (/:$/.test(model)) {
      const items = [row.generation, row.variantBadge, row.years].map((v) => bare(v).replace(/^\*\s*/, "")).filter((v) => !isBlank(v));
      if (items.length) notes.push({ label: model.replace(/:$/, ""), items });
      return;
    }
    if (isBlank(model) || (isBlank(bare(row.generation)) && isBlank(bare(row.variantBadge)))) return;
    cards.push(row);
  });
  return { cards, notes };
}

/** "1 Series" → 1 + SERIES; "X1", "M3", "Z3 M Roadster" → big code + rest; long names stay whole. */
function modelMark(model) {
  const name = bare(model).replace(/^BMW\s+/i, "");
  const series = name.match(/^(\d+)\s+Series\b\s*(.*)$/i);
  if (series) return { big: series[1], label: [UI.seriesLabel, series[2]].filter(Boolean).join(" ") };
  const [first = "", ...rest] = name.split(/\s+/);
  if (first.length <= 4) return { big: first, label: rest.join(" ") };
  return { big: name, label: "", word: true };
}

/** Comma / semicolon / spaced-slash separated variants, ignoring anything in brackets. */
function variantCount(value) {
  return bare(value)
    .replace(/\([^)]*\)/g, "")
    .split(/,|;|\s\/\s/)
    .filter((part) => part.trim()).length;
}

const yearsText = (value) => {
  const text = bare(value).replace(/\bpresent\b/i, "Present");
  return isBlank(text) ? "" : text;
};

/** "8+ models", "10+ (1, 2 …)", "E39 M5, E52 Z8 (2 models)" → "8+ BMW models"; else the distinct models in the rows. */
function modelsLabel(modelsFitted, cards) {
  const raw = bare(modelsFitted);
  const distinct = new Set(cards.map((row) => bare(row.model).replace(/^BMW\s+/i, ""))).size;
  const n =
    raw.match(/^(\d+\+?)\s*(?:models?\b|\(|$)/i)?.[1] ||
    raw.match(/\((\d+\+?)\s*models?\)/i)?.[1] ||
    (distinct ? String(distinct) : "");
  if (!n) return UI.modelsFallback;
  return fill(n === "1" ? UI.models.one : UI.models.many, { n });
}

/** Note text without editor link stubs ("→ [link]", "→ [landroverengine.uk/…]"). */
const noteText = (value) => String(value ?? "").replace(/\s*→\s*\[[^\]]*\]/g, "").replace(/\s+\./g, ".").trim();

/**
 * Where "Other BMW models" + "Compatibility verified" go so the last grid row ends flush:
 * free ≥ 2 → side by side (verified takes the rest), free 1 → stacked in that cell, free 0 → a new row.
 */
function metaLayout(used, cols) {
  const free = (cols - (used % cols)) % cols;
  if (free === 1) return { stack: true, other: 1, verified: 1 };
  if (free >= 2) {
    const other = free >= 4 ? 2 : 1;
    return { stack: false, other, verified: free - other };
  }
  const other = cols >= 5 ? 2 : 1;
  return { stack: false, other, verified: cols - other };
}

const SPAN = {
  md: ["", "md:col-span-1", "md:col-span-2"],
  lg: ["", "lg:col-span-1", "lg:col-span-2", "lg:col-span-3"],
  xl: ["", "xl:col-span-1", "xl:col-span-2", "xl:col-span-3", "xl:col-span-4", "xl:col-span-5"],
};
// Full cards where they sit side by side, compact ones where the pair shares one cell.
const VIS = {
  md: { on: "md:flex", off: "md:hidden" },
  lg: { on: "lg:flex", off: "lg:hidden" },
  xl: { on: "xl:flex", off: "xl:hidden" },
};
const WRAP = {
  md: { stack: "md:grid md:col-span-1", split: "md:contents" },
  lg: { stack: "lg:grid lg:col-span-1", split: "lg:contents" },
  xl: { stack: "xl:grid xl:col-span-1", split: "xl:contents" },
};

/* -------------------------------------------------------------- elements */

function Photo({ src, alt, sizes, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-contain" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[var(--eg-soft)] opacity-50">
          <EIcon name="car" className="h-12 w-12" strokeWidth={1.25} />
        </span>
      )}
    </div>
  );
}

function Mark({ model, compact = false }) {
  const mark = modelMark(model);
  if (mark.word) {
    return (
      <span className={`block font-bold leading-[1.1] text-[var(--eg-blue)] ${compact ? "text-[17px]" : "text-[22px]"}`}>{mark.big}</span>
    );
  }
  return (
    <span className={`flex min-w-0 ${compact ? "flex-col items-start gap-1" : "items-baseline gap-2"}`}>
      <span className={`font-bold leading-none text-[var(--eg-blue)] ${compact ? "text-[28px]" : "text-[34px]"}`}>{mark.big}</span>
      {mark.label ? (
        <span className={`min-w-0 font-semibold uppercase leading-tight ${compact ? "text-[12px]" : "text-[15px]"}`}>{mark.label}</span>
      ) : null}
    </span>
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

function FitmentCard({ facts, crossBrandFitment, isDark, className = "" }) {
  const fitment = crossBrandFitment || facts?.crossBrandFitment || "";
  if (!stripTags(fitment)) return null;
  const exclusive = isExclusive(fitment);
  return (
    <div
      className={`flex items-start gap-2.5 md:gap-3 lg:gap-4 ${
        isDark ? `${CARD} p-3 md:p-3.5 lg:px-5 lg:py-4` : "border-[var(--eg-card-border)] py-1 max-md:rounded-[10px] max-md:border max-md:bg-[var(--eg-card)] max-md:p-3 md:border-l md:pl-5"
      } ${className}`}
    >
      <IconDisc size="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" className={isDark ? "rounded-[10px]" : ""}>
        <ShieldGlyph className="h-[18px] w-[18px] md:h-5 md:w-5 lg:h-6 lg:w-6" />
      </IconDisc>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase leading-tight tracking-[0.02em] text-[var(--eg-blue)] lg:text-[15px]">
          {exclusive ? UI.exclusive.title : UI.shared.title}
        </p>
        {exclusive ? (
          <p className="mt-1.5 text-[12px] leading-[1.5] text-[var(--eg-text)] lg:text-[15px] lg:leading-[1.6]">
            {UI.exclusive.text.split(/(?<=\.)\s+/).map((sentence) => (
              <span key={sentence} className="xl:block">
                {sentence}{" "}
              </span>
            ))}
          </p>
        ) : (
          <DataText
            as="p"
            text={fitment}
            className="mt-1.5 text-[12px] leading-[1.5] text-[var(--eg-text)] lg:text-[15px] lg:leading-[1.6]"
          />
        )}
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="relative h-[11px] w-[11px] shrink-0 rounded-full border-2 border-[var(--eg-blue)]"
      style={{ background: "radial-gradient(circle, var(--eg-blue) 0 2px, var(--eg-page) 2.5px)" }}
    />
  );
}

function Timeline({ years, className = "" }) {
  if (!years) return null;
  const n = years.span;
  return (
    <div className={`flex items-center gap-3 lg:gap-4 ${className}`}>
      <span className="shrink-0 text-[20px] font-semibold leading-none text-[var(--eg-blue)] lg:text-[24px]">{years.start}</span>
      <div className="relative grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)_auto] items-center">
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--cm-line)]" />
        <span
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-[7px] -translate-y-1/2"
          style={{ background: "repeating-linear-gradient(90deg, transparent 0 39px, var(--cm-tick) 39px 40px)" }}
        />
        <Dot />
        {n > 0 ? (
          <span className="relative mx-2 justify-self-center whitespace-nowrap rounded-full bg-[var(--eg-blue)] px-3 py-1 text-[12px] font-semibold uppercase leading-[1.35] text-white lg:px-4 lg:py-1.5 lg:text-[14px]">
            {fill(n === 1 ? UI.timelinePillOne : UI.timelinePill, { n })}
          </span>
        ) : (
          <span />
        )}
        <Dot />
      </div>
      <span className="shrink-0 text-[20px] font-semibold leading-none text-[var(--eg-blue)] lg:text-[24px]">{years.endLabel}</span>
    </div>
  );
}

function variantsLabel(row) {
  const count = variantCount(row.variantBadge);
  if (!count) return "";
  return fill(count === 1 ? UI.variants.one : UI.variants.many, { n: count });
}

function GenerationCard({ row, isDark }) {
  const generation = bare(row.generation);
  const variants = bare(noHtml(row.variantBadge));
  const years = yearsText(row.years);
  const count = variantsLabel(row);
  const model = bare(row.model);
  return (
    <article className={`${CARD} flex min-w-0 flex-col px-4 pb-4 pt-4 min-[1440px]:px-5`}>
      <h3 className="relative z-[1] min-w-0">
        <Mark model={row.model} />
      </h3>
      <Photo
        src={row.image || row.cardImage}
        alt={`BMW ${model.replace(/^BMW\s+/i, "")}${isBlank(generation) ? "" : ` (${generation})`}`}
        sizes="210px"
        className="mx-auto -mt-3 aspect-[1.6/1] w-full max-w-[214px]"
      />
      {isBlank(generation) ? null : (
        <span className="mx-auto mt-2 max-w-full rounded-lg bg-[var(--eg-pill)] px-3.5 py-1 text-center text-[15px] font-medium leading-[1.35] text-[var(--eg-pill-text)]">
          {generation}
        </span>
      )}
      {isBlank(variants) ? null : <p className="mt-2.5 text-center text-[16px] leading-[1.4] text-[var(--eg-text)]">{variants}</p>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-1.5 gap-y-2 pt-4">
        {years ? (
          <span className="whitespace-nowrap rounded-md border border-[var(--cm-years)] px-2 py-0.5 text-[14px] leading-[1.45] text-[var(--eg-sky)]">
            {years}
          </span>
        ) : (
          <span />
        )}
        {count ? (
          <span className="ml-auto inline-flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold uppercase text-[var(--eg-sky)]">
            {count}
            <EIcon name={isDark ? "arrow-right" : "chevron-right"} className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        ) : null}
      </div>
    </article>
  );
}

function PlusDisc({ className = "h-12 w-12" }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--eg-blue-strong)] text-white [box-shadow:0_0_0_5px_color-mix(in_srgb,var(--eg-blue)_22%,transparent)] ${className}`}
    >
      <EIcon name="plus" className="h-1/2 w-1/2" strokeWidth={1.75} />
    </span>
  );
}

function OtherCard({ code, compact, isDark, className = "" }) {
  return (
    <article
      className={`flex min-w-0 rounded-[10px] border border-[var(--cm-other-border)] bg-[var(--eg-card)] [box-shadow:inset_0_1px_0_var(--eg-card-top),var(--eg-card-shadow)] ${
        isDark ? "" : "border-dashed"
      } ${compact ? "flex-col items-start gap-2 p-4" : "flex-col items-center justify-center p-5 text-center"} ${className}`}
    >
      <div className={compact ? "flex items-center gap-3" : "contents"}>
        <PlusDisc className={compact ? "h-9 w-9" : "h-12 w-12"} />
        <h3 className={`text-[15px] font-semibold uppercase leading-tight ${compact ? "" : "mt-4 text-[16px]"}`}>{UI.other.title}</h3>
      </div>
      <p className={`text-[15px] leading-[1.5] text-[var(--eg-muted)] ${compact ? "" : "mt-2"}`}>{fill(UI.other.text, { code })}</p>
      <Link
        href={UI.other.href}
        className={`inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--eg-sky)] hover:underline ${compact ? "" : "mt-2.5"}`}
      >
        {UI.other.link}
        <EIcon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
      </Link>
    </article>
  );
}

function VerifiedCard({ compact, className = "" }) {
  return (
    <article className={`${CARD} @container flex min-w-0 ${compact ? "p-4" : "p-3"} ${className}`}>
      <div
        className={`flex w-full gap-3.5 rounded-[8px] ${
          compact ? "" : "flex-col border border-[var(--cm-soft-border)] bg-[var(--cm-soft)] p-4 @min-[220px]:flex-row @min-[220px]:items-center lg:gap-4"
        }`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[color-mix(in_srgb,var(--eg-blue)_16%,transparent)] text-[var(--eg-blue)]">
          <EIcon name="document" className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold uppercase leading-tight text-[var(--eg-blue)]">{UI.verified.title}</h3>
          {compact ? null : <p className="mt-2 text-[15px] leading-[1.5] text-[var(--eg-muted)]">{UI.verified.text}</p>}
          <DataText as="p" text={UI.verified.tag} className={`text-[15px] ${compact ? "mt-1" : "mt-2"}`} />
        </div>
      </div>
    </article>
  );
}

function NoteBar({ icon = "shield", children, className = "" }) {
  return (
    <div className={`${CARD} relative z-20 flex items-center gap-3 px-4 py-3 lg:gap-4 lg:px-6 ${className}`}>
      <span className="shrink-0 text-[var(--eg-blue)]">
        {icon === "shield" ? <ShieldGlyph className="h-6 w-6" /> : <EIcon name={icon} className="h-6 w-6" />}
      </span>
      <div className="min-w-0 text-[13px] leading-[1.5] text-[var(--eg-text)] md:text-[15px]">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------- phone rows */

function MobileRow({ row }) {
  const generation = bare(row.generation);
  const variants = bare(noHtml(row.variantBadge));
  const years = yearsText(row.years);
  const model = bare(row.model);
  const label = "text-[12px] leading-tight text-[var(--eg-muted)]";
  return (
    <article className={`${CARD} rounded-[12px] py-2.5 pl-3 pr-2`}>
      <div className="grid grid-cols-[minmax(0,1fr)_20px] items-center gap-1">
        <div className="min-w-0">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-2">
            <h3 className="min-w-[48px] max-w-[84px] self-start">
              <Mark model={row.model} compact />
            </h3>
            <Photo
              src={row.image || row.cardImage}
              alt={`BMW ${model.replace(/^BMW\s+/i, "")}${isBlank(generation) ? "" : ` (${generation})`}`}
              sizes="130px"
              className="aspect-[16/9] w-full"
            />
            <div className="min-w-0">
              <p className={label}>{UI.mobileLabels.generation}</p>
              {isBlank(generation) ? (
                <p className="mt-1 text-[13px]">–</p>
              ) : (
                <span className="mt-1.5 inline-block max-w-full rounded-lg bg-[var(--eg-pill)] px-2.5 py-1 text-[12px] font-medium leading-[1.3] text-[var(--eg-pill-text)]">
                  {generation}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-[var(--eg-divider)] pt-2">
            <div className="min-w-0">
              <p className={label}>{UI.mobileLabels.variant}</p>
              <p className="mt-1 text-[13px] leading-[1.4] text-[var(--eg-text)]">{isBlank(variants) ? "–" : variants}</p>
            </div>
            <div className="min-w-[78px] border-l border-[var(--eg-divider)] pl-3">
              <p className={label}>{UI.mobileLabels.years}</p>
              <p className="mt-1 whitespace-nowrap text-[14px] font-medium leading-[1.4] text-[var(--eg-sky)]">{years || "–"}</p>
            </div>
          </div>
        </div>
        <EIcon name="chevron-right" className="h-5 w-5 text-[var(--eg-sky)]" strokeWidth={2} />
      </div>
    </article>
  );
}

/* --------------------------------------------------------------- section */

export default function Compatibility({
  data,
  facts,
  engineLabel = "BMW Engine",
  modelsFitted = "",
  crossBrandFitment = "",
  engineImage,
  heroCar,
}) {
  const { isDark, vars } = useEngineTone();
  if (!data) return null;

  const tone = { ...vars, ...LOCAL[isDark ? "dark" : "light"] };
  const code = facts?.code || stripTags(engineLabel).replace(/^BMW\s+/i, "");
  const { cards, notes } = splitRows(data.rows || []);
  const years = facts?.years || null;
  const models = modelsLabel(modelsFitted || facts?.modelsFitted, cards);
  const sub = (years ? UI.subHeading : UI.subHeading.replace(/\s*from \{years\}/, "")).split(/(\{\w+\})/);
  const fitment = crossBrandFitment || facts?.crossBrandFitment || "";
  const note = noteText(data.crossBrandNote) || stripTags(fitment);
  // engineImage arrives as a path ("/engines/n47d20c.webp"); the cut-outs are 540×540. Accept { src, width, height } too.
  const engineSrc = typeof engineImage === "string" ? engineImage : engineImage?.src;
  const engine = engineSrc ? { src: engineSrc, width: engineImage?.width || 540, height: engineImage?.height || 540 } : null;
  const car = !engine && heroCar?.src ? heroCar : null;
  const engineInGrid = Boolean(engine && cards.length);

  const n = cards.length;
  const meta = {
    md: metaLayout(n, 2),
    lg: metaLayout(n, 3),
    xl: metaLayout(n + (engineInGrid ? 1 : 0), 5),
  };
  const wrapClass = ["md", "lg", "xl"].map((bp) => WRAP[bp][meta[bp].stack ? "stack" : "split"]).join(" ");
  const spanClass = (key) => ["md", "lg", "xl"].map((bp) => SPAN[bp][meta[bp].stack ? 1 : meta[bp][key]]).join(" ");
  const anyStack = ["md", "lg", "xl"].some((bp) => meta[bp].stack);
  const visible = (compact) => ["md", "lg", "xl"].map((bp) => VIS[bp][meta[bp].stack === compact ? "on" : "off"]).join(" ");

  const media = engine || car;

  return (
    <section style={tone} className={`${SECTION_CLASS} section-y pb-6 lg:pb-5`} aria-labelledby="compat-h2">
      {/* soft blue glow behind the engine corner */}
      <span aria-hidden className="pointer-events-none absolute -right-[12%] -top-[26%] h-[620px] w-[620px] md:h-[860px] md:w-[860px]" style={{ background: "var(--cm-glow)" }} />

      {/* phone: engine in the top-right corner, behind the fitment card */}
      {engine ? (
        <div aria-hidden className="pointer-events-none absolute -right-7 top-2 w-[58%] max-w-[250px] md:hidden">
          <Image src={engine.src} width={engine.width} height={engine.height} alt="" sizes="200px" className="h-auto w-full" />
        </div>
      ) : null}

      <div className="site-container relative">
        {/* ---------- top band ---------- */}
        <div className="relative z-10 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-6 xl:grid-cols-5 xl:gap-x-3">
          <div className={`${engine ? "grid grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)] items-start gap-3" : ""} md:block xl:col-span-4 xl:flex xl:items-start xl:justify-between xl:gap-8`}>
            <div className="min-w-0">
              <Eyebrow className="text-[13px] font-medium lg:text-[15px]" lineClassName="w-[24px] lg:w-[30px]">
                {UI.eyebrow}
              </Eyebrow>
              <h2 id="compat-h2" className="mt-2 text-[26px] font-bold leading-[1.12] tracking-[-0.01em] md:mt-3 md:text-[30px] lg:text-[34px]">
                {UI.h2}
              </h2>
              <p className="mt-2 text-[15px] leading-[1.5] text-[var(--eg-muted)] md:mt-3 md:text-[16px] lg:text-[17px]">
                {sub.map((part, i) =>
                  part === "{code}" ? (
                    <span key={i}>{code}</span>
                  ) : part === "{models}" ? (
                    <span key={i} className="font-medium text-[var(--eg-sky)]">
                      {models}
                    </span>
                  ) : part === "{years}" ? (
                    <span key={i} className="whitespace-nowrap font-medium text-[var(--eg-sky)]">
                      {years.label}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </p>
            </div>
            <FitmentCard
              facts={facts}
              crossBrandFitment={fitment}
              isDark={isDark}
              className={`${engine ? "mt-[76px]" : "mt-4"} md:mt-5 md:max-w-[440px] xl:mr-[4%] xl:mt-1 xl:max-w-[420px] xl:shrink-0`}
            />
          </div>

          {media ? (
            <div
              aria-hidden={engine ? true : undefined}
              className={`pointer-events-none relative hidden self-center md:block md:w-[210px] lg:w-[270px] ${
                engine && engineInGrid ? "xl:hidden" : "xl:col-start-5 xl:row-span-2 xl:row-start-1 xl:w-auto xl:self-stretch"
              } ${engine ? "md:-mr-6 md:-mt-4 xl:m-0" : ""}`}
            >
              <Image
                src={media.src}
                width={media.width}
                height={media.height}
                alt={engine ? "" : fill(UI.carAlt, { code })}
                sizes="(min-width: 1280px) 300px, 270px"
                className="h-auto w-full xl:absolute xl:inset-x-0 xl:top-1/2 xl:-translate-y-1/2"
              />
            </div>
          ) : null}

          <Timeline years={years} className="mt-6 md:col-span-2 md:mt-6 lg:mt-7 xl:col-span-4 xl:col-start-1" />
        </div>

        {/* ---------- phone list ---------- */}
        {n ? (
          <div className="mt-5 grid gap-3 md:hidden">
            {cards.map((row, i) => (
              <MobileRow key={`${bare(row.model)}-${bare(row.generation)}-${i}`} row={row} />
            ))}
            <article className={`${CARD} grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] px-3 py-3`}>
              <PlusDisc className="h-10 w-10" />
              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold uppercase leading-tight">{UI.other.title}</h3>
                <p className="mt-1 text-[12px] leading-[1.45] text-[var(--eg-muted)]">{fill(UI.other.text, { code })}</p>
              </div>
              <Link href={UI.other.href} className="inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold text-[var(--eg-sky)]">
                {UI.other.link}
                <EIcon name="chevron-right" className="h-4 w-4" strokeWidth={2} />
              </Link>
            </article>
          </div>
        ) : null}

        {/* ---------- card grid (tablet / desktop) ---------- */}
        {n ? (
          <div className="relative mt-6 hidden gap-3 md:grid md:grid-cols-2 lg:mt-7 lg:grid-cols-3 xl:grid-cols-5">
            {engineInGrid ? (
              <div aria-hidden className="pointer-events-none relative hidden xl:col-start-5 xl:row-start-1 xl:block">
                <Image
                  src={engine.src}
                  width={engine.width}
                  height={engine.height}
                  alt=""
                  sizes="380px"
                  className="absolute -left-[3%] -top-[205px] h-auto w-[162%] max-w-none"
                />
              </div>
            ) : null}
            {cards.map((row, i) => (
              <GenerationCard key={`${bare(row.model)}-${bare(row.generation)}-${i}`} row={row} isDark={isDark} />
            ))}
            <div className={`gap-3 ${wrapClass}`}>
              <OtherCard code={code} compact={false} isDark={isDark} className={`${spanClass("other")} ${visible(false)}`} />
              {anyStack ? <OtherCard code={code} compact isDark={isDark} className={visible(true)} /> : null}
              <VerifiedCard compact={false} className={`${spanClass("verified")} ${visible(false)}`} />
              {anyStack ? <VerifiedCard compact className={visible(true)} /> : null}
            </div>
          </div>
        ) : null}

        {notes.length ? (
          <div className="mt-3 grid gap-3">
            {notes.map((group) => (
              <NoteBar key={group.label} icon="info">
                <span className="font-semibold">{group.label}: </span>
                {group.items.join(" · ")}
              </NoteBar>
            ))}
          </div>
        ) : null}

        {note ? (
          <NoteBar className="mt-3">
            <DataText text={note} />
          </NoteBar>
        ) : null}

      </div>
    </section>
  );
}
