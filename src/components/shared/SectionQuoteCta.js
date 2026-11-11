"use client";

import { openQuoteModal } from "@/components/shared/quoteModal";

function Arrow({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * End-of-section CTA band (no card/box): support text left, button right on desktop.
 * Opens the sticky quote modal (same form as the floating Get a Free Quote button).
 */
export default function SectionQuoteCta({
  label = "Get a BMW Engine Quote",
  supportText = "",
  href = "/quote",
  onClick,
  className = "",
}) {
  const buttonClass =
    "inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-3 rounded-[8px] bg-[#0b47a8] px-6 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110 sm:text-[16px]";

  function handleClick(event) {
    if (onClick) {
      onClick(event);
      return;
    }
    // Prefer opening the sticky modal over navigating to /quote.
    if (!href || href === "/quote" || String(href).startsWith("/quote")) {
      event.preventDefault();
      openQuoteModal();
      return;
    }
  }

  return (
    <div
      className={`mt-8 flex w-full flex-col gap-4 border-t border-[color-mix(in_srgb,currentColor_14%,transparent)] pt-6 sm:mt-9 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${className}`}
    >
      {supportText ? (
        <p className="t-body min-w-0 max-w-[720px] flex-1 leading-[1.55] text-[var(--color-text-soft,#3b4656)]">
          {supportText}
        </p>
      ) : (
        <span className="min-w-0 flex-1" />
      )}
      <button type="button" onClick={handleClick} className={buttonClass}>
        <span>{label}</span>
        <Arrow className="h-5 w-5 shrink-0" />
      </button>
    </div>
  );
}

/** Build BMW model / generation CTA labels from a tag pill or H1. */
export function bmwContextLabel(tagPill = "", h1 = "") {
  const fromPill = String(tagPill || "")
    .split("•")[0]
    ?.trim()
    .replace(/^BMW\s+/i, "")
    .trim();
  if (fromPill) return fromPill;

  const fromH1 =
    String(h1 || "").match(/BMW\s+(.+?)\s+Engines?/i)?.[1] ||
    String(h1 || "").match(/^(.+?)\s+Engines?/i)?.[1] ||
    "";
  return fromH1.trim() || "BMW";
}

export function modelCtaCopy(modelLabel) {
  const m = modelLabel || "BMW";
  const withBrand = /^BMW\b/i.test(m) ? m : `BMW ${m}`;
  return {
    heroButton: `Explore ${m} Engine Replacement Options`,
    heroSupport: `Enter your registration to explore ${withBrand} engine replacement options and specialist guidance.`,
    problemsLabel: `Diagnose ${withBrand} Engine Problems`,
    problemsSupport: "Experiencing similar symptoms? Explore possible faults and understand your repair or replacement options.",
    costsLabel: `Get a ${withBrand} Engine Quote`,
    costsSupport: `Compare used, reconditioned and rebuilt ${withBrand} engine options with a quote tailored to your vehicle.`,
    path1Label: `Start ${withBrand} Diagnosis`,
    path1Support: "Know your engine? Explore likely faults and compare repair-versus-replacement costs.",
    path2Label: `Identify ${m.replace(/^BMW\s+/i, "")} Engine Code`,
    path2Support: "Not sure which engine you have? Identify your engine code before starting diagnosis.",
    trustLabel: `Get a ${withBrand} Engine Quote`,
    trustSupport: `Request a specialist quote based on your ${m.replace(/^BMW\s+/i, "")} engine, vehicle details and replacement requirements.`,
  };
}
