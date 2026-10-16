"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

// Verdict chips in the same muted day/night tints as the Ownership Rankings table.
const verdictStyles = {
  best: "border-[#d8e6dc] bg-[#f4f8f5] text-[#4d8f66]",
  safe: "border-[#d8e6dc] bg-[#f4f8f5] text-[#4d8f66]",
  solid: "border-[#d8e2ef] bg-[#f4f7fb] text-[#3d6fb6]",
  avoid: "border-[#e8d6d8] bg-[#f9f4f4] text-[#a15c62]",
  watch: "border-[#e8dece] bg-[#f9f6f1] text-[#a07a45]",
};
const verdictStylesDark = {
  best: "border-white/12 bg-[#16241c] text-[#8fb89a]",
  safe: "border-white/12 bg-[#16241c] text-[#8fb89a]",
  solid: "border-white/12 bg-[#132033] text-[#8fb4ea]",
  avoid: "border-white/12 bg-[#261c1e] text-[#c49a9e]",
  watch: "border-white/12 bg-[#262218] text-[#c4ae86]",
};
const verdictIcon = { best: "top-choice", safe: "safe-buy", solid: "star", avoid: "fire", watch: "check-watch" };

function stripTags(value = "") {
  return String(value).replace(/<[^>]*>/g, "").trim();
}

function VerdictChip({ verdict, isDark }) {
  const styles = isDark ? verdictStylesDark : verdictStyles;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-[0.74rem] font-semibold ${styles[verdict.type] || styles.solid}`}
    >
      <HomeIcon name={verdictIcon[verdict.type] || "star"} isDark={isDark} className="h-7 w-7" />
      <span>{verdict.label}</span>
    </span>
  );
}

// Engine photo (set server-side), else the car it is best known in, else the engine icon.
function EngineThumb({ row, isDark, className }) {
  if (row.photo) {
    return (
      <span className={`relative block shrink-0 ${className}`}>
        <Image src={row.photo} alt={`BMW ${stripTags(row.code)} engine`} fill className="object-contain" sizes="96px" />
      </span>
    );
  }
  return (
    <span className={`flex shrink-0 items-center justify-center ${className}`}>
      <HomeIcon name="engine" isDark={isDark} className="h-10 w-10" />
    </span>
  );
}

function FuelCell({ row, isDark }) {
  return (
    <span className="flex items-center gap-2">
      <HomeIcon name={/petrol/i.test(row.fuel) ? "pump" : "diesel"} isDark={isDark} className="h-8 w-8" />
      <span className="text-[0.82rem] leading-tight">{row.spec}</span>
    </span>
  );
}

function EngineRow({ row, isDark }) {
  return (
    <Link
      href={row.href || "#"}
      className={`grid grid-cols-[minmax(190px,1.05fr)_minmax(150px,0.8fr)_minmax(110px,0.6fr)_minmax(170px,0.85fr)_minmax(0,2.3fr)] items-center gap-0 border-b last:border-b-0 ${
        isDark ? "border-[var(--color-border)] text-white hover:bg-white/[0.03]" : "border-[#e4e9f0] text-[var(--color-text)] hover:bg-[var(--color-page-soft)]"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3 px-4 py-2.5">
        <EngineThumb row={row} isDark={isDark} className="h-12 w-16" />
        <span className="text-[1rem] font-bold leading-tight">{stripTags(row.code)}</span>
      </span>
      <span className="px-3 py-2.5">
        <FuelCell row={row} isDark={isDark} />
      </span>
      <span className={`px-3 py-2.5 text-[0.82rem] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}>{row.years}</span>
      <span className="px-3 py-2.5">
        <span className="block text-[0.86rem] font-bold leading-tight">{row.enquiries}</span>
        {row.sourceTag ? <span className="mt-0.5 block text-[0.66rem] font-semibold text-[var(--color-primary)]">{row.sourceTag}</span> : null}
      </span>
      <span className="flex min-w-0 items-start gap-3 px-3 py-2.5 md:px-4">
        <VerdictChip verdict={row.verdict} isDark={isDark} />
        <span className={`text-[0.8rem] leading-[1.38] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>{row.verdict.text}</span>
      </span>
    </Link>
  );
}

function EngineCard({ row, isDark }) {
  return (
    <Link
      href={row.href || "#"}
      className={`flex flex-col rounded-lg border p-3 ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[var(--color-border)] bg-white shadow-[0_4px_12px_rgba(10,26,43,0.06)]"
      }`}
    >
      <div className="flex items-center gap-3">
        <EngineThumb row={row} isDark={isDark} className="h-14 w-20" />
        <div className="min-w-0 flex-1">
          <p className={`text-[1rem] font-bold leading-tight ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{stripTags(row.code)}</p>
          <p className={`mt-0.5 text-[0.76rem] ${isDark ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
            {row.spec} • {row.years}
          </p>
        </div>
        <VerdictChip verdict={row.verdict} isDark={isDark} />
      </div>
      <p className={`mt-2 text-[0.76rem] font-semibold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
        {row.enquiries} {row.sourceTag ? <span className="font-semibold text-[var(--color-primary)]">{row.sourceTag}</span> : null}
      </p>
      <p className={`mt-1 text-[0.76rem] leading-[1.35] ${isDark ? "text-white/72" : "text-[var(--color-text-muted)]"}`}>{row.verdict.text}</p>
    </Link>
  );
}

export default function HomeSec7({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const heroImage = (isDark ? data.heroImages?.dark : data.heroImages?.light) || data.headerImage;
  const rows = data.engines?.rows || [];
  const columns = data.engines?.columns || ["Engine", "Fuel", "Years", "2025 Enquiries", "Verdict"];

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)]">
      <div className="relative overflow-hidden">
        {heroImage?.src ? (
          <div className="absolute inset-y-0 right-0 w-[58%] md:w-[46%]">
            <Image src={heroImage.src} alt={heroImage.alt || ""} fill className="object-cover object-right" sizes="(max-width: 768px) 58vw, 46vw" />
            <div
              className={
                isDark
                  ? "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(2,7,11,0.82)_34%,rgba(2,7,11,0.18)_100%)]"
                  : "absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(255,255,255,0.88)_34%,rgba(255,255,255,0.18)_100%)]"
              }
            />
          </div>
        ) : null}

        <div className="relative mx-auto w-full max-w-8xl px-3 pb-3 pt-5 md:px-6 md:pb-3.5 md:pt-8 lg:px-8">
          <div className="max-w-[720px]">
            <p className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${isDark ? "text-white/55" : "text-[var(--color-text-muted)]"}`}>
              Engine Families
            </p>
            <h2
              className={`mt-1.5 text-[2.2rem] font-bold leading-[0.98] md:text-[3.4rem] md:leading-[0.96] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}
              dangerouslySetInnerHTML={{ __html: data.h2 }}
            />
            <div className="mt-2.5">
              <MStripe />
            </div>
            <p
              className={`mt-2 max-w-[640px] text-[0.88rem] leading-[1.4] md:text-[1.05rem] md:leading-[1.45] ${isDark ? "text-white/80" : "text-[var(--color-text-muted)]"}`}
              dangerouslySetInnerHTML={{ __html: data.subHeadline }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-8xl px-3 pb-5 pt-2 md:px-6 md:pb-7 md:pt-2.5 lg:px-8">
        <div className="grid gap-2.5 md:hidden">
          {rows.map((row) => (
            <EngineCard key={stripTags(row.code)} row={row} isDark={isDark} />
          ))}
        </div>

        <div
          className={`hidden overflow-hidden rounded-xl border md:block ${
            isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#e4e9f0] bg-white shadow-[0_10px_28px_rgba(10,26,43,0.08)]"
          }`}
        >
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div
                className={`grid grid-cols-[minmax(190px,1.05fr)_minmax(150px,0.8fr)_minmax(110px,0.6fr)_minmax(170px,0.85fr)_minmax(0,2.3fr)] text-[0.68rem] font-bold uppercase tracking-[0.06em] ${
                  isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)] text-white"
                }`}
              >
                {columns.map((col, index) => (
                  <span key={col} className={index ? "px-3 py-2.5" : "px-4 py-2.5"}>
                    {col}
                  </span>
                ))}
              </div>
              {rows.map((row) => (
                <EngineRow key={stripTags(row.code)} row={row} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
