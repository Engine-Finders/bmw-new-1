"use client";

import { useId, useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import { bandColor } from "./generationSection";

// Colours sampled from the designs (dark desktop and dark phone); light is the same design in light colours.
const TONES = {
  light: {
    "--fq-bg": "#f6f8fb",
    "--fq-top": "#f6f8fb",
    "--fq-card": "#ffffff",
    "--fq-panel": "#ffffff",
    "--fq-border": "#dce3ec",
    "--fq-line": "#e6ebf2",
    "--fq-text": "#0b1726",
    "--fq-question": "#0f1c2d",
    "--fq-question-phone": "#0f1c2d",
    "--fq-muted": "#44505f",
    "--fq-blue": "#0a5bd3",
    "--fq-rule": "#0a5bd3",
    "--fq-number": "#0a52cc",
    "--fq-badge": "#e8f0fc",
    "--fq-badge-phone": "linear-gradient(180deg,#0b59d8,#0a4cc0)",
    "--fq-hover": "rgba(10,82,204,0.025)",
    "--fq-open": "rgba(10,82,204,0.035)",
    "--fq-shadow": "0 8px 24px rgba(10,26,43,0.05)",
  },
  dark: {
    "--fq-bg": "#010c1a",
    // Market Intelligence's background, which the section fades in from so the two don't meet on a hard edge.
    "--fq-top": "#00060d",
    "--fq-card": "#020f20",
    "--fq-panel": "transparent",
    "--fq-border": "#313947",
    "--fq-line": "#1b232e",
    "--fq-text": "#ffffff",
    "--fq-question": "rgba(255,255,255,0.93)",
    "--fq-question-phone": "#ffffff",
    "--fq-muted": "rgba(255,255,255,0.74)",
    "--fq-blue": "#1f8ce8",
    "--fq-rule": "#0479e1",
    "--fq-number": "#319df2",
    "--fq-badge": "#061e3e",
    "--fq-badge-phone": "linear-gradient(180deg,#012a67,#002351)",
    "--fq-hover": "rgba(255,255,255,0.018)",
    "--fq-open": "rgba(255,255,255,0.028)",
    "--fq-shadow": "none",
  },
};

const HTML = "[&_a]:[font-weight:inherit] [&_a]:text-[var(--fq-blue)] [&_a]:underline-offset-2 hover:[&_a]:underline";

function dash(value = "") {
  return String(value ?? "").replace(/\s+-\s*(?=\S)/g, " - ");
}

// Data tags ("[BMW-QUOTE]") in blue, as in the other sections; one-word tags never break.
function answerHtml(value) {
  return dash(value).replace(
    /\[[^\]<>]+\]/g,
    (tag) => `<span class="${/\s/.test(tag) ? "" : "whitespace-nowrap "}font-medium text-[var(--fq-blue)]">${tag}</span>`,
  );
}

// Thin blue "+"; its upright turns flat when the answer is open, leaving a "−".
function PlusIcon({ open }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-[14px] w-[14px] shrink-0 text-[var(--fq-blue)] [stroke-width:1.75] md:[stroke-width:2]"
    >
      <path d="M1 7h12" />
      <path
        d="M7 1v12"
        className={`origin-center transition-[rotate] duration-300 ease-out [transform-box:fill-box] motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
      />
    </svg>
  );
}

/* Phones and tablets: every question is its own rounded card (the phone design).
   Desktop (from 1024px): the cards of a column join into one bordered panel with thin dividers (the desktop design). */
function FaqItem({ item, index, uid, open, onToggle }) {
  const buttonId = `${uid}-q${index}`;
  const panelId = `${uid}-a${index}`;
  return (
    <div
      className={`overflow-hidden rounded-[6px] border border-[var(--fq-border)] bg-[var(--fq-card)] [box-shadow:var(--fq-shadow)] lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-[var(--fq-line)] lg:bg-transparent lg:[box-shadow:none] lg:first:border-t-0 ${
        open ? "[background-image:linear-gradient(var(--fq-open),var(--fq-open))]" : ""
      }`}
    >
      {/* Above the open answer, which tucks under its padding (the rows keep the design's height, so the gap would be loose). */}
      <h3 className="relative">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-[55px] w-full items-center gap-[14px] py-3 pl-[14px] pr-[19px] text-left transition-colors hover:bg-[var(--fq-hover)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--fq-blue)] md:min-h-[64px] md:py-4 md:pl-[18px] md:pr-[24px] lg:min-h-[78px]"
        >
          <span
            aria-hidden="true"
            className="flex h-[31px] w-[29px] shrink-0 items-center justify-center rounded-[4px] [background:var(--fq-badge-phone)] text-[18px] font-semibold leading-none tracking-[-0.02em] text-white md:h-[34px] md:w-[31px] md:text-[20px] lg:[background:var(--fq-badge)] lg:text-[var(--fq-number)]"
          >
            {item.id ?? index + 1}
          </span>
          <span
            className={`min-w-0 flex-1 text-[14px] leading-[1.34] text-[var(--fq-question-phone)] text-pretty md:text-[16px] md:leading-[1.4] lg:text-[var(--fq-question)] ${HTML}`}
            dangerouslySetInnerHTML={{ __html: dash(item.question) }}
          />
          <PlusIcon open={open} />
        </button>
      </h3>
      {/* Always in the page (crawlable, matches the FAQ structured data); collapsed rows are hidden from view and from tabbing. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,margin,visibility] duration-300 ease-out motion-reduce:transition-none ${open ? "visible -mt-1 grid-rows-[1fr] md:-mt-2" : "invisible grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={`break-words pb-[14px] pl-[57px] pr-[19px] text-[14px] leading-[1.6] text-[var(--fq-muted)] md:pb-5 md:pl-[63px] md:pr-[52px] md:text-[16px] ${HTML}`}
            dangerouslySetInnerHTML={{ __html: answerHtml(item.answer) }}
          />
        </div>
      </div>
    </div>
  );
}

// Up / Down / Home / End move between the questions (WAI-ARIA accordion pattern).
function moveFocus(event) {
  const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const buttons = [...event.currentTarget.querySelectorAll("button[aria-controls]")];
  const index = buttons.indexOf(event.target);
  if (index === -1) return;
  event.preventDefault();
  const last = buttons.length - 1;
  const next =
    event.key === "Home" ? 0 : event.key === "End" ? last : event.key === "ArrowDown" ? (index === last ? 0 : index + 1) : index === 0 ? last : index - 1;
  buttons[next].focus();
}

export default function FAQAccordion({ data, generationCode = "" , band }) {
  const { theme } = useTheme();
  const uid = useId();
  const [openKey, setOpenKey] = useState(null);
  if (!data) return null;

  const items = (data.items || []).filter((item) => item && String(item.question ?? "").trim());
  if (!items.length) return null;

  // Band colour from the page (sections alternate plain / tinted); the design colour when none is given.

  const vars = { ...TONES[theme === "dark" ? "dark" : "light"], ...(band ? { "--fq-bg": bandColor(theme === "dark", band), "--fq-top": bandColor(theme === "dark", band) } : {}) };
  // "FAQ - BMW E90" -> "FAQ - BMW E90"; a bare "FAQ" gets the generation when the page passes it.
  const h2 = dash(data.h2 || "FAQ").trim();
  const title = /^FAQs?$/i.test(h2) && generationCode ? `${h2} - BMW ${generationCode}` : h2;
  // Desktop: first half in the left column, the rest in the right (5 + 5 for ten questions).
  const mid = Math.ceil(items.length / 2);
  const columns = [items.slice(0, mid), items.slice(mid)].filter((column) => column.length);

  return (
    <section style={vars} className={`relative w-full overflow-hidden bg-[var(--fq-bg)] bg-[linear-gradient(180deg,var(--fq-top)_0px,var(--fq-bg)_180px)] text-[var(--fq-text)] ${sectionFont.className}`}>
      <div className="site-container pb-10 pt-8 md:pb-12 md:pt-10 lg:pb-14 lg:pt-12">
        <h2
          className={`text-[clamp(26px,7.2vw,30px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--fq-text)] md:text-[34px] lg:text-[40px] xl:text-[44px] ${HTML}`}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <span aria-hidden="true" className="mt-[7px] flex h-[3px] w-[80px] md:mt-2.5 md:w-[88px] lg:mt-3 xl:w-[96px]">
          <span className="w-[64%] bg-[var(--fq-rule)]" />
          <span className="w-[36%] bg-[#e3262f]" />
        </span>
        {data.subHeadline ? (
          <p
            className={`mt-3 max-w-[680px] text-[15px] leading-[1.6] text-[var(--fq-muted)] md:text-[16px] ${HTML}`}
            dangerouslySetInnerHTML={{ __html: dash(data.subHeadline) }}
          />
        ) : null}

        {/* Each desktop column flows on its own, so opening a row never stretches the other column. */}
        <div onKeyDown={moveFocus} className={`mt-[13px] grid gap-[7px] md:mt-5 md:gap-2.5 lg:mt-6 lg:items-start lg:gap-3 ${columns.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {columns.map((column, c) => (
            <div
              key={c}
              className="flex flex-col gap-[7px] md:gap-2.5 lg:gap-0 lg:overflow-hidden lg:rounded-[8px] lg:border lg:border-[var(--fq-border)] lg:bg-[var(--fq-panel)] lg:[box-shadow:var(--fq-shadow)]"
            >
              {column.map((item, i) => {
                const index = c * mid + i;
                const key = item.id ?? index;
                return (
                  <FaqItem
                    key={key}
                    item={item}
                    index={index}
                    uid={uid}
                    open={openKey === key}
                    onToggle={() => setOpenKey(openKey === key ? null : key)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {data.disclaimer ? (
          <p
            className={`mt-4 text-[13px] leading-[1.5] text-[var(--fq-muted)] md:mt-5 md:text-[14px] ${HTML}`}
            dangerouslySetInnerHTML={{ __html: dash(data.disclaimer) }}
          />
        ) : null}
      </div>
    </section>
  );
}
