"use client";

import Link from "next/link";
import ui from "@/data/shared/enginePageUi.json";
import { CARD, DataText, EIcon, SECTION_CLASS, useEngineTone } from "./engineUi";
import { cleanText, engineCode } from "./engineText";

const T = ui.trust;

const fill = (value, code) => String(value || "").replaceAll("{code}", code);

/** "Title: text" or "Title -text" → { title, text }, split at whichever separator comes first. */
function splitPoint(point = "") {
  const clean = cleanText(point);
  const cuts = [clean.indexOf(":"), clean.indexOf(" – ")].filter((i) => i > 0);
  if (!cuts.length) return { title: clean, text: "" };
  const at = Math.min(...cuts);
  const sep = clean[at] === ":" ? 1 : 3;
  return { title: clean.slice(0, at).trim(), text: clean.slice(at + sep).trim() };
}

/** finalCta → first sentence (title), the rest (white) and the blue clause from `blueFrom` on. */
function splitCta(text = "", blueFrom = "") {
  const at = blueFrom ? text.toLowerCase().indexOf(blueFrom.toLowerCase()) : -1;
  const before = (at >= 0 ? text.slice(0, at) : text).trim();
  const blue = at >= 0 ? text.slice(at).trim() : "";
  const m = before.match(/^(.+?[.!?])\s+(.+)$/);
  return m ? { title: m[1], rest: m[2], blue } : { title: before, rest: "", blue };
}

/* Duotone glyphs in the reference style (24 grid, round caps); colour comes from currentColor. */
function TrustGlyph({ name, className, isDark }) {
  const common = {
    viewBox: "0 0 24 24",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  if (name === "shield-check") {
    return (
      <svg {...common}>
        <path d="M12 2.8l7.6 2.9v5.6c0 4.8-3.2 8.7-7.6 9.9-4.4-1.2-7.6-5.1-7.6-9.9V5.7z" fill="currentColor" fillOpacity={0.14} />
        <path d="M8.5 12.1l2.5 2.5 4.6-4.8" className={isDark ? "text-[var(--eg-text)]" : ""} stroke="currentColor" strokeWidth={1.7} />
      </svg>
    );
  }
  if (name === "doc-search") {
    return (
      <svg {...common}>
        <path d="M5.6 2.9h7.6l4.6 4.6v5.2M5.6 2.9A1.6 1.6 0 0 0 4 4.5v14.4a1.6 1.6 0 0 0 1.6 1.6h4.6" fill="currentColor" fillOpacity={0.14} />
        <path d="M13.2 2.9v4.6h4.6" />
        <circle cx="14.6" cy="15" r="4.2" fill="var(--eg-card-solid)" />
        <path d="M13 16.4v-1.3M14.6 16.4v-2.6M16.2 16.4v-1.8" strokeWidth={1.4} />
        <path d="M17.7 18.1l3 3" strokeWidth={2.2} />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg {...common} strokeWidth={1.2}>
        <path d="M12 22s7.3-6.7 7.3-12.6a7.3 7.3 0 0 0-14.6 0C4.7 15.3 12 22 12 22z" fill="currentColor" />
        <circle cx="12" cy="9.5" r="2.9" fill="var(--eg-card-solid)" stroke="none" />
      </svg>
    );
  }
  return <EIcon name={name} className={className} />;
}

function TrustCard({ point, icon, isDark }) {
  return (
    <article
      className={`${CARD} flex min-w-0 items-start gap-[22px] px-[14px] py-4 md:gap-6 md:px-5 lg:flex-col lg:gap-3 lg:px-6 lg:py-6 xl:flex-row xl:gap-[16px] xl:py-[18px] ${
        isDark ? "" : "bg-[linear-gradient(160deg,var(--eg-card-solid),color-mix(in_srgb,var(--eg-blue)_3%,var(--eg-card-solid)))]"
      }`}
    >
      <span
        aria-hidden
        className={`grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full border border-[var(--eg-disc-ring)] bg-[var(--eg-disc)] text-[var(--eg-blue)] ${
          isDark
            ? "[box-shadow:0_0_22px_color-mix(in_srgb,var(--eg-blue)_22%,transparent),inset_0_0_14px_color-mix(in_srgb,var(--eg-blue)_14%,transparent)] lg:-mx-2 lg:h-auto lg:w-auto lg:border-0 lg:bg-transparent lg:[box-shadow:none]"
            : "[box-shadow:0_8px_22px_rgba(16,42,86,0.08),0_0_0_5px_color-mix(in_srgb,var(--eg-disc-ring)_35%,transparent)] lg:h-[78px] lg:w-[78px]"
        }`}
      >
        <TrustGlyph name={icon} isDark={isDark} className={`h-[52px] w-[52px] ${isDark ? "lg:h-[76px] lg:w-[76px]" : "lg:h-[62px] lg:w-[62px]"}`} />
      </span>
      <div className="min-w-0">
        <h3 className="text-[18px] font-semibold leading-[1.3] text-[var(--eg-text)] lg:text-[20px]">{point.title}</h3>
        {point.text ? (
          <DataText
            as="p"
            text={point.text}
            className={`mt-1.5 text-pretty text-[15px] leading-[1.45] lg:mt-[7px] lg:leading-[1.42] ${
              isDark ? "text-[var(--eg-muted)]" : "text-[color-mix(in_srgb,var(--eg-text)_80%,var(--eg-muted))]"
            }`}
          />
        ) : null}
      </div>
    </article>
  );
}

export default function TrustCta({ data, facts, engineLabel = "BMW Engine" }) {
  const { isDark, vars } = useEngineTone();
  if (!data) return null;

  const code = (facts?.code || engineCode(engineLabel) || "").replace(/\s*\/\s*/g, "/");
  const points = (data.trustPoints || []).map(splitPoint).filter((p) => p.title);
  const icons = T.icons || [];
  const cta = cleanText(data.finalCta) || fill(T.ctaFallback, code);
  const { title, rest, blue } = splitCta(cta, T.blueFrom);
  const lead = blue.match(/^(and)\s+(.+)$/i); // phone keeps "and" white, as the reference does
  const label = cleanText(data.ctaButton?.label || "").replace(/\s*(→|->)\s*$/, "") || fill(T.buttonFallback, code);
  const href = data.ctaButton?.href || T.href;
  const TitleTag = points.length ? "h3" : "h2";
  const blueClass = "text-[color-mix(in_srgb,var(--eg-sky)_80%,var(--eg-text))]";

  return (
    <section
      style={vars}
      className={`${SECTION_CLASS} border-t border-[var(--eg-divider)] ${
        isDark ? "" : "[background:color-mix(in_srgb,var(--eg-card-solid)_60%,var(--eg-page))]"
      }`}
    >
      <div className="site-container pb-10 pt-7 md:pb-12 md:pt-10 lg:pb-9 lg:pt-[26px]">
        {points.length ? (
          <>
            <h2 className="flex items-center gap-3 text-[16px] font-semibold uppercase leading-tight tracking-[0.04em] text-[var(--eg-blue)] lg:gap-[13px] lg:normal-case lg:tracking-normal lg:text-[28px] lg:leading-[1.2] lg:text-[var(--eg-text)]">
              <span aria-hidden className="h-[2px] w-[30px] shrink-0 rounded-full bg-[var(--eg-blue)] lg:w-[25px]" />
              {T.h2}
            </h2>
            <div className="mt-4 grid gap-3 lg:mt-2 lg:grid-cols-[30fr_31fr_31fr] lg:gap-5">
              {points.map((point, index) => (
                <TrustCard key={point.title} point={point} icon={icons[index % (icons.length || 1)]} isDark={isDark} />
              ))}
            </div>
          </>
        ) : null}

        {/* Final CTA: centred card on phone/tablet, one glowing row on desktop. */}
        <div
          className={`relative flex flex-col items-center gap-4 rounded-[12px] border px-3.5 pb-4 pt-5 text-center md:px-8 md:pb-6 md:pt-7 lg:flex-row lg:items-center lg:gap-8 lg:py-5 lg:pl-9 lg:pr-[30px] 2xl:gap-[40px] 2xl:pl-[46px] lg:text-left ${
            points.length ? "mt-5 lg:mt-5" : ""
          } ${
            isDark
              ? "border-[var(--eg-blue)] [background:color-mix(in_srgb,var(--eg-card-solid)_45%,var(--eg-page))] [box-shadow:0_0_22px_color-mix(in_srgb,var(--eg-blue)_42%,transparent),inset_0_0_26px_color-mix(in_srgb,var(--eg-blue)_10%,transparent)]"
              : "border-[color-mix(in_srgb,var(--eg-blue)_22%,var(--eg-card-solid))] [background:linear-gradient(100deg,color-mix(in_srgb,var(--eg-blue)_7%,var(--eg-card-solid)),var(--eg-card-solid)_70%)] [box-shadow:var(--eg-card-shadow)]"
          }`}
        >
          <span
            aria-hidden
            className={`grid shrink-0 place-items-center text-[var(--eg-blue)] ${
              isDark
                ? ""
                : "h-[72px] w-[72px] rounded-full bg-[var(--eg-card-solid)] [box-shadow:0_10px_24px_rgba(16,42,86,0.1),0_0_0_6px_color-mix(in_srgb,var(--eg-disc-ring)_40%,transparent)] lg:h-[88px] lg:w-[88px]"
            }`}
          >
            <EIcon
              name="shield-check"
              strokeWidth={isDark ? 0.85 : 1.3}
              className={isDark ? "-my-1 h-14 w-14 lg:-mx-4 lg:-my-3 lg:h-[104px] lg:w-[104px]" : "h-12 w-12 lg:h-[64px] lg:w-[64px]"}
            />
          </span>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-6 lg:gap-y-4 2xl:gap-x-[32px]">
            <div className="min-w-0 lg:flex-[1_1_400px]">
              <TitleTag className="text-balance text-[22px] font-bold leading-[1.25] text-[var(--eg-text)] lg:text-pretty lg:text-[17px] lg:font-semibold lg:leading-[1.45] 2xl:text-[18.5px]">
                {title}
              </TitleTag>
              {rest || blue ? (
                <p className="mt-2 text-pretty text-[16px] leading-[1.45] text-[var(--eg-text)] lg:mt-0 lg:text-[17px] lg:font-medium lg:leading-[1.45] 2xl:text-[18.5px]">
                  {rest ? <span className="lg:block">{rest} </span> : null}
                  {blue ? (
                    lead ? (
                      <span className="lg:block">
                        <span className="text-[var(--eg-text)] lg:text-[color-mix(in_srgb,var(--eg-sky)_80%,var(--eg-text))]">{lead[1]} </span>
                        <span className={`font-semibold lg:font-medium ${blueClass}`}>{lead[2]}</span>
                      </span>
                    ) : (
                      <span className={`font-semibold lg:block lg:font-medium ${blueClass}`}>{blue}</span>
                    )
                  ) : null}
                </p>
              ) : null}
            </div>
            <Link
              href={href}
              className="btn-cta inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] px-3.5 py-3 text-[14px] font-semibold min-[400px]:text-[15px] md:gap-3 md:px-6 md:text-[16px] text-[var(--eg-cta-text)] [background:var(--eg-cta)] lg:w-auto lg:px-7 lg:py-[18px] lg:text-[18px] lg:leading-[1.2] 2xl:gap-[14px] 2xl:px-[36px] 2xl:py-[20px] 2xl:text-[20px]"
            >
              <span className="whitespace-normal md:whitespace-nowrap">{label}</span>
              <EIcon name="arrow-right" strokeWidth={2} className="h-[18px] w-[18px] shrink-0 md:h-5 md:w-5 lg:h-6 lg:w-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
