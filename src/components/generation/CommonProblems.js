"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import SectionQuoteCta, { bmwContextLabel, modelCtaCopy } from "@/components/shared/SectionQuoteCta";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import { bandColor } from "./generationSection";

// Colours from the designs (light and dark desktop, dark phone).
const TONES = {
  light: {
    "--cp-bg": "#f7f9fc",
    "--cp-card": "#ffffff",
    "--cp-border": "#e3e8ef",
    "--cp-line": "#e9edf3",
    "--cp-text": "#0b1726",
    "--cp-muted": "#3f4a59",
    "--cp-soft": "#6b7685",
    "--cp-blue": "#0a52cc",
    "--cp-badge": "#0a52cc",
    "--cp-red": "#d62828",
    "--cp-orange": "#d9730d",
    "--cp-tier-head": "#f6f8fb",
    "--cp-cat-head": "#fdeeee",
    "--cp-cat-border": "#f3cdcd",
    "--cp-photo": "#eef2f7",
    "--cp-cta-bg": "transparent",
    "--cp-cta-text": "#0a52cc",
    "--cp-cta-border": "#0a52cc",
    "--cp-disc": "#ffffff",
    "--cp-disc-ring": "#0a52cc",
    "--cp-disc-glyph": "#0a52cc",
    "--cp-shadow": "0 10px 28px rgba(10,26,43,0.06)",
  },
  dark: {
    "--cp-bg": "#06101d",
    "--cp-card": "#0a1525",
    "--cp-border": "#26324a",
    "--cp-line": "#1d2a3c",
    "--cp-text": "#ffffff",
    "--cp-muted": "rgba(255,255,255,0.84)",
    "--cp-soft": "rgba(255,255,255,0.62)",
    "--cp-blue": "#3d8ff0",
    "--cp-badge": "#0d52cc",
    "--cp-red": "#ff5a52",
    "--cp-orange": "#f59532",
    "--cp-tier-head": "#0f1d31",
    "--cp-cat-head": "rgba(229,72,77,0.16)",
    "--cp-cat-border": "rgba(229,72,77,0.4)",
    "--cp-photo": "#05090f",
    "--cp-cta-bg": "#0b56d6",
    "--cp-cta-text": "#ffffff",
    "--cp-cta-border": "#0b56d6",
    "--cp-disc": "#0a2350",
    "--cp-disc-ring": "#2f80f0",
    "--cp-disc-glyph": "#ffffff",
    "--cp-shadow": "0 12px 30px rgba(0,0,0,0.35)",
  },
};

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";

function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)/g, " - ");
}

// "BMW 3 Series E90 - Common Problems" -> "BMW 3 Series E90" + "Common Problems".
function splitTitle(value = "") {
  const match = String(value ?? "").match(/^(.*?)\s+[--–]\s+(.*)$/);
  return match ? { main: match[1], accent: match[2] } : { main: String(value ?? ""), accent: "" };
}

// "N47D20C Timing Chain Stretch" -> code + name.
function splitProblem(title = "") {
  const value = String(title ?? "").trim();
  const space = value.indexOf(" ");
  return space === -1 ? { code: value, name: "" } : { code: value.slice(0, space), name: value.slice(space + 1) };
}

const ctaLabel = (cta) => String(cta?.label || "").replace(/\s*→\s*$/, "").trim();
const number = (id, index) => String(id ?? index + 1).padStart(2, "0");

/* ---------- Icons (24px grid, currentColor) ---------- */
const PATHS = {
  car: (
    <>
      <path d="M5 11 6.6 6.6A2 2 0 0 1 8.5 5.3h7a2 2 0 0 1 1.9 1.3L19 11" />
      <path d="M3.5 11.5A1.5 1.5 0 0 1 5 11h14a1.5 1.5 0 0 1 1.5 1.5V17a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
      <path d="M6 18v1.5M18 18v1.5M7 14.5h1.5M15.5 14.5H17" />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 17a8.5 8.5 0 1 1 17 0" />
      <path d="m12 16 3.6-4.6M6.2 12.4l1 .6M12 8.5v1.2M17.8 12.4l-1 .6" />
      <circle cx="12" cy="16.4" r="1.3" />
    </>
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
    </>
  ),
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  warning: (
    <>
      <path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" fill="currentColor" fillOpacity="0.14" />
      <path d="M12 9v4.5M12 17h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 4.8 5.6v6c0 4.4 3 8 7.2 9.6 4.2-1.6 7.2-5.2 7.2-9.6v-6z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.4h.01" />
    </>
  ),
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chart: (
    <>
      <path d="M6 20v-6M12 20V9M18 20V4" strokeWidth="3.2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.2 12.2 2.6 2.6 5-5.4" />
    </>
  ),
  shieldFlag: (
    <>
      <path d="M12 2.8 4.8 5.6v6c0 4.4 3 8 7.2 9.6 4.2-1.6 7.2-5.2 7.2-9.6v-6z" />
      <path d="M12 5.4v13.4M12 12H7.4" />
    </>
  ),
};

function Icon({ name, className, strokeWidth = 1.7 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

const TRUST_ICONS = { shield: "shieldFlag", chart: "chart", wrench: "wrench", check: "check" };

function Badge({ children, className = "" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[6px] bg-[var(--cp-badge)] font-semibold leading-none text-white ${className}`}>
      {children}
    </span>
  );
}

function RiskBadge({ level, className = "" }) {
  if (!level) return null;
  const tone = /high/i.test(level) ? "red" : "orange";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border px-2.5 py-1.5 text-[14px] font-medium leading-none ${className}`}
      style={{ color: `var(--cp-${tone})`, borderColor: `var(--cp-${tone})`, background: `color-mix(in srgb, var(--cp-${tone}) 12%, transparent)` }}
    >
      <Icon name="alert" className="h-[18px] w-[18px]" strokeWidth={2} />
      {level}
    </span>
  );
}

function Field({ icon, label, html, className = "" }) {
  if (!String(html ?? "").trim()) return null;
  return (
    <div className={`grid grid-cols-[18px_minmax(0,1fr)] gap-x-2.5 ${className}`}>
      <Icon name={icon} className="mt-px h-[18px] w-[18px] text-[var(--cp-blue)]" />
      <div className="min-w-0">
        <p className="text-[14px] font-medium leading-snug text-[var(--cp-blue)]">{label}</p>
        <p className={`mt-0.5 text-[14px] leading-[1.5] text-[var(--cp-muted)] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(html) }} />
      </div>
    </div>
  );
}

// One tier: its label on a tinted bar, then Dealer | Specialist prices side by side, then the work and the note.
// Prices wrap inside their cell: some carry a note in brackets ("£800–£1,500 (recall may apply)").
// (The design squeezes label + both prices into one row; at readable sizes the prices need the card's full width.)
function Tier({ tier }) {
  const catastrophic = /catastroph|replacement/i.test(tier.tier || "");
  const cell = "min-w-0 px-3 py-2";
  return (
    <div className="overflow-hidden rounded-[8px] border" style={{ borderColor: catastrophic ? "var(--cp-cat-border)" : "var(--cp-border)" }}>
      <p
        className="flex items-center gap-1.5 px-3 py-2 text-[13.5px] font-medium leading-tight"
        style={{ background: catastrophic ? "var(--cp-cat-head)" : "var(--cp-tier-head)", color: catastrophic ? "var(--cp-red)" : "var(--cp-blue)" }}
      >
        <Icon name={catastrophic ? "warning" : "wrench"} className="h-4 w-4 shrink-0" />
        <span className={HTML} dangerouslySetInnerHTML={{ __html: tier.tier }} />
      </p>
      <div className="grid grid-cols-2 border-t border-[var(--cp-line)] [&>*]:min-w-0">
        <div className={cell}>
          <span className="block text-[12.5px] leading-tight text-[var(--cp-soft)]">Dealer</span>
          <span className={`mt-0.5 block text-[14.5px] font-medium leading-tight text-[var(--cp-text)] [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(tier.dealer) || "-" }} />
        </div>
        <div className={`${cell} border-l border-[var(--cp-line)]`}>
          <span className="block text-[12.5px] leading-tight text-[var(--cp-soft)]">Specialist</span>
          <span className={`mt-0.5 block text-[14.5px] font-medium leading-tight text-[var(--cp-text)] [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(tier.specialist) || "-" }} />
        </div>
      </div>
      {tier.work || tier.note ? (
        <div className="border-t border-[var(--cp-line)] px-3 py-2 text-[13.5px] leading-[1.45] text-[var(--cp-muted)]">
          {tier.work ? <p className={HTML} dangerouslySetInnerHTML={{ __html: dash(tier.work) }} /> : null}
          {tier.note ? <p className={HTML} dangerouslySetInnerHTML={{ __html: dash(tier.note) }} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function Details({ problem, withRootCause = true, withSummary = true }) {
  const tiers = problem.tieredCosts || [];
  const label = ctaLabel(problem.cta);
  return (
    <>
      {withSummary ? (
        <div className="flex flex-col gap-3.5">
          <Field icon="car" label="Affected models:" html={problem.affectedModels} />
          <Field icon="gauge" label="Typical failure mileage:" html={problem.typicalFailureMileage} />
          {withRootCause ? <Field icon="cog" label="Root cause:" html={problem.rootCause} /> : null}
        </div>
      ) : withRootCause ? (
        <Field icon="cog" label="Root cause:" html={problem.rootCause} />
      ) : null}

      {tiers.length ? (
        <div className="mt-4 border-t border-[var(--cp-line)] pt-3.5">
          <p className="text-[13px] font-medium uppercase tracking-[0.03em] text-[var(--cp-blue)]">Tiered Cost Table</p>
          <div className="mt-2.5 flex flex-col gap-2.5">
            {tiers.map((tier, index) => (
              <Tier key={`${tier.tier}-${index}`} tier={tier} />
            ))}
          </div>
        </div>
      ) : null}

      {problem.recommendation ? (
        <div className="mt-4">
          <p className="flex items-center gap-2 text-[13.5px] font-medium uppercase tracking-[0.03em] text-[var(--cp-blue)]">
            <Icon name="shield" className="h-[18px] w-[18px]" />
            Our Recommendation
          </p>
          <p className={`mt-1.5 text-[14px] leading-[1.55] text-[var(--cp-muted)] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(problem.recommendation) }} />
        </div>
      ) : null}

      {/* Grows in the desktop cards so every card's button sits on its bottom edge. */}
      <span aria-hidden="true" className="block min-h-4 flex-1" />
      {label ? (
        <a
          href={problem.cta?.href || "/quote"}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] border px-3 py-2.5 text-center text-[14px] font-medium leading-snug no-underline transition hover:brightness-110"
          style={{ background: "var(--cp-cta-bg)", color: "var(--cp-cta-text)", borderColor: "var(--cp-cta-border)" }}
        >
          <span className="[&_a]:text-inherit [&_a]:no-underline" dangerouslySetInnerHTML={{ __html: label }} />
          <Icon name="arrow" className="h-4 w-4 shrink-0" strokeWidth={2} />
        </a>
      ) : null}
    </>
  );
}

/* ---------- Tablets + desktop: every problem as a full card ---------- */
function ProblemCard({ problem, index }) {
  const { code, name } = splitProblem(problem.title);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[12px] border border-[var(--cp-border)] bg-[var(--cp-card)] [box-shadow:var(--cp-shadow)]">
      <div className="relative min-h-[118px] px-4 pb-2 pt-4">
        {problem.image ? (
          <div aria-hidden="true" className="absolute right-0 top-0 h-[124px] w-[48%] [mask-image:linear-gradient(90deg,transparent_0%,#000_16%)]">
            <Image src={problem.image} alt="" fill sizes="200px" className="object-contain object-right-top p-2 drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]" />
          </div>
        ) : null}
        <div className="relative flex max-w-[64%] items-start gap-3">
          <Badge className="h-9 w-9 text-[18px]">{number(problem.id, index)}</Badge>
          <div className="min-w-0">
            <p className={`text-[19px] font-semibold leading-tight text-[var(--cp-text)] ${HTML}`} dangerouslySetInnerHTML={{ __html: code }} />
            {name ? <p className={`mt-1 text-[15px] font-medium leading-snug text-[var(--cp-text)] ${HTML}`} dangerouslySetInnerHTML={{ __html: name }} /> : null}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <Details problem={problem} />
      </div>
    </article>
  );
}

/* ---------- Phones: the phone design's collapsible cards at readable sizes ---------- */
function PhoneCard({ problem, index, open, onToggle }) {
  const id = `cp-${problem.id ?? index}`;
  return (
    <li className="overflow-hidden rounded-[12px] border border-[var(--cp-border)] bg-[var(--cp-card)] [box-shadow:var(--cp-shadow)]">
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={id} className="block w-full p-3 text-left">
        {/* Photo beside the number and title; the facts and the risk run the card's full width below */}
        <span className="grid grid-cols-[84px_minmax(0,1fr)] items-start gap-3">
          <span className="relative block aspect-square overflow-hidden rounded-[8px] bg-[var(--cp-photo)]">
            {problem.image ? <Image src={problem.image} alt="" fill sizes="84px" className="object-contain p-1.5" /> : null}
          </span>
          <span className="flex min-w-0 items-start gap-2.5 pt-0.5">
            <Badge className="h-8 w-8 text-[16px]">{number(problem.id, index)}</Badge>
            <span className={`min-w-0 flex-1 pt-0.5 text-[16px] font-semibold leading-snug text-[var(--cp-text)] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(problem.title) }} />
            <Icon name="chevronDown" strokeWidth={2} className={`mt-1 h-5 w-5 shrink-0 text-[var(--cp-text)] transition-transform ${open ? "rotate-180" : ""}`} />
          </span>
        </span>
        <span className="mt-3 grid grid-cols-2 gap-x-3 border-y border-[var(--cp-line)] py-2.5 text-[13.5px] leading-snug text-[var(--cp-muted)]">
          <span className="flex min-w-0 items-start gap-1.5">
            <Icon name="car" className="mt-px h-[18px] w-[18px] shrink-0 text-[var(--cp-blue)]" />
            <span className={`min-w-0 [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(problem.affectedModels).replace(/\.$/, "") }} />
          </span>
          <span className="flex min-w-0 items-start gap-1.5 border-l border-[var(--cp-line)] pl-3">
            <Icon name="gauge" className="mt-px h-[18px] w-[18px] shrink-0 text-[var(--cp-blue)]" />
            <span className={`min-w-0 [overflow-wrap:anywhere] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(problem.typicalFailureMileage).replace(/\.$/, "") }} />
          </span>
        </span>
        <span className="mt-2.5 flex items-center gap-2.5">
          <RiskBadge level={problem.riskLevel} />
          <span className={`line-clamp-2 min-w-0 flex-1 text-[13.5px] leading-snug text-[var(--cp-muted)] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(problem.rootCause) }} />
        </span>
      </button>
      {open ? (
        <div id={id} className="border-t border-[var(--cp-line)] px-3 pb-4 pt-3.5">
          <Details problem={problem} withSummary={false} />
        </div>
      ) : null}
    </li>
  );
}

function TrustStrip({ items, note }) {
  if (!items?.length && !note) return null;
  return (
    <>
      {items?.length ? (
        <div className="mt-4 grid grid-cols-2 rounded-[12px] border border-[var(--cp-border)] bg-[var(--cp-card)] p-2 [box-shadow:var(--cp-shadow)] lg:grid-cols-4 lg:p-0">
          {items.map((item, index) => (
            <div
              key={item.title}
              className={`flex min-w-0 flex-col gap-2.5 p-3 sm:flex-row sm:items-start sm:gap-3 lg:items-center lg:gap-4 lg:px-6 lg:py-5 ${index % 2 ? "border-l border-[var(--cp-line)]" : ""} ${
                index >= 2 ? "border-t border-[var(--cp-line)] lg:border-t-0" : ""
              } ${index === 2 ? "lg:border-l" : ""}`}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 lg:h-[60px] lg:w-[60px]"
                style={{ background: "var(--cp-disc)", borderColor: "var(--cp-disc-ring)", color: "var(--cp-disc-glyph)" }}
              >
                <Icon name={TRUST_ICONS[item.icon] || "check"} className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className={`block text-[15px] font-semibold leading-snug text-[var(--cp-text)] lg:text-[17px] ${HTML}`} dangerouslySetInnerHTML={{ __html: item.title }} />
                <span className={`mt-0.5 block text-[13.5px] leading-[1.45] text-[var(--cp-muted)] lg:text-[14px] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(item.text) }} />
              </span>
            </div>
          ))}
        </div>
      ) : null}
      {note ? (
        <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-[var(--cp-border)] bg-[var(--cp-card)] px-4 py-3">
          <Icon name="shieldFlag" className="h-7 w-7 shrink-0 text-[var(--cp-blue)]" />
          <p className={`text-[13.5px] leading-[1.5] text-[var(--cp-muted)] lg:text-[14px] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(note) }} />
        </div>
      ) : null}
    </>
  );
}

export default function CommonProblems({ data , band }) {
  const { theme } = useTheme();
  const [openId, setOpenId] = useState(null);
  if (!data) return null;

  const isDark = theme === "dark";
  // Band colour from the page (sections alternate plain / tinted); the design colour when none is given.
  const vars = { ...TONES[isDark ? "dark" : "light"], ...(band ? { "--cp-bg": bandColor(isDark, band) } : {}) };
  const title = splitTitle(dash(data.h2 || "Common Problems"));
  const problems = (data.problems || []).filter((problem) => problem && problem.title);
  const copy = modelCtaCopy(bmwContextLabel("", data.h2));
  // Four across from 1024px (the design); three when a page has three or five problems, so no card sits alone.
  const desktopCols = problems.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section style={vars} className={`relative w-full overflow-hidden bg-[var(--cp-bg)] text-[var(--cp-text)] ${sectionFont.className}`}>
      <div className="site-container relative pb-10 pt-8 md:pb-12 md:pt-10 lg:pb-14 lg:pt-12">
        <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-[var(--cp-blue)] md:text-[15px] xl:text-[16px]">
          {title.accent || "Common Problems"}
        </p>
        <h2 className={`mt-2 text-[clamp(26px,7.2vw,30px)] font-semibold leading-[1.15] tracking-[-0.015em] text-[var(--cp-text)] md:text-[34px] lg:text-[40px] xl:text-[44px] ${HTML}`}>
          <span dangerouslySetInnerHTML={{ __html: title.main }} />
          {title.accent ? (
            <>
              {" -"}
              <br className="md:hidden" />
              <span className="hidden md:inline"> </span>
              <span dangerouslySetInnerHTML={{ __html: title.accent }} />
            </>
          ) : null}
        </h2>
        {data.subHeadline ? (
          <p className={`mt-2.5 max-w-[680px] text-[15px] leading-[1.6] text-[var(--cp-muted)] md:text-[16px] ${HTML}`} dangerouslySetInnerHTML={{ __html: dash(data.subHeadline) }} />
        ) : null}
        <span aria-hidden="true" className="mt-3 flex h-[3px] w-[100px]">
          <span className="w-[60%] bg-[var(--cp-blue)]" />
          <span className="w-[40%] bg-[#e3262f]" />
        </span>

        {problems.length ? (
          <>
            <ul className="mt-6 flex flex-col gap-3 md:hidden">
              {problems.map((problem, index) => {
                const key = problem.id ?? index;
                return (
                  <PhoneCard
                    key={key}
                    problem={problem}
                    index={index}
                    open={openId === key}
                    onToggle={() => setOpenId(openId === key ? null : key)}
                  />
                );
              })}
            </ul>
            <div className={`mt-7 hidden gap-4 md:grid md:grid-cols-2 ${desktopCols}`}>
              {problems.map((problem, index) => (
                <ProblemCard key={problem.id ?? index} problem={problem} index={index} />
              ))}
            </div>
          </>
        ) : null}

        <TrustStrip items={data.trustStrip} note={data.footerNote} />
        <SectionQuoteCta
          className="!mt-6"
          label={copy.problemsLabel}
          supportText={copy.problemsSupport}
          href="/quote"
        />
      </div>
    </section>
  );
}
