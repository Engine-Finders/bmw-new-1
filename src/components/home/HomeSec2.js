"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import VerdictGlyph from "@/components/home/VerdictGlyph";
import GrilleImage from "@/components/home/GrilleImage";

// Find Your Vehicle — desktop: two tables (1–8 Series, Z, i | X, M, classics); phone: search,
// filter chips, a single list, "View all models" and a trust card with the CTA.

// Verdict text colour per type (no box behind it); dark theme uses white text like the reference.
const TEXT = {
  warning: "text-[#e06a0a]",
  crown: "text-[#e06a0a]",
  success: "text-[#138a49]",
  trophy: "text-[#1d4fd8]",
  fire: "text-[#1d4fd8]",
  diamond: "text-[#5b35c9]",
  danger: "text-[#d92020]",
};

function Verdict({ verdict, isDark, mobile = false }) {
  const text = isDark ? "text-white" : TEXT[verdict.type] || TEXT.success;
  const icon = mobile ? "h-[15px] w-[15px]" : "h-[17px] w-[17px]";
  return (
    <span
      className={`inline-flex flex-col gap-0.5 ${text} ${mobile ? "text-[0.8rem]" : "text-[0.9rem]"}`}
    >
      <span className={`flex items-center ${mobile ? "gap-2" : "gap-2"}`}>
        <VerdictGlyph type={verdict.type} isDark={isDark} round={mobile} className={`${icon} shrink-0`} />
        <span className={`leading-tight ${mobile ? "" : "whitespace-nowrap"}`}>{verdict.title}</span>
      </span>
      {verdict.also ? (
        <span className={`flex items-center ${mobile ? "gap-3" : "gap-2"}`}>
          <VerdictGlyph type={verdict.also.type} isDark={isDark} round={mobile} className={`${icon} shrink-0`} />
          <span className="leading-tight">{verdict.also.title}</span>
        </span>
      ) : null}
      {verdict.note ? (
        <span className={`leading-[1.45] ${isDark ? "text-white/80" : "text-[#3b4656]"} ${mobile ? "pl-[26px] text-[0.7rem]" : "pl-[25px] text-[0.72rem]"}`}>
          {verdict.note}
        </span>
      ) : null}
    </span>
  );
}

function ModelName({ item, className }) {
  return (
    <span className={className}>
      {item.model.map((m, i) => (
        <span key={m.name}>
          {i > 0 ? " / " : null}
          <Link href={m.href} className="font-[inherit] hover:underline">
            {m.name}
          </Link>
        </span>
      ))}
    </span>
  );
}

function CarThumb({ item, className }) {
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <Image src={item.image.src} alt={item.image.alt} fill sizes="120px" className="object-contain object-center" />
    </span>
  );
}

function Table({ rows, columns, isDark, right = false }) {
  const grid = right ? "grid-cols-[124px_96px_minmax(0,1fr)_minmax(0,1.18fr)]" : "grid-cols-[124px_96px_minmax(0,1fr)_minmax(0,1.12fr)]";
  const line = isDark ? "border-white/[0.07]" : "border-[#e8ecf1]";
  return (
    <div className={right ? `border-l ${isDark ? "border-white/[0.1]" : "border-[#e3e8ef]"}` : ""}>
      <div
        className={`grid ${grid} items-center py-3 text-[0.95rem] font-medium uppercase tracking-[0.01em] ${isDark ? "text-white" : "text-white"}`}
        style={{ background: isDark ? "linear-gradient(180deg,#0f2a52,#0b2040)" : "#0b4fc0" }}
      >
        <span className="col-span-2 pl-[42%]">{columns[0]}</span>
        <span className="pl-3">{columns[1]}</span>
        <span className="pl-[14%]">{columns[2]}</span>
      </div>
      <div className="px-4">
        {rows.map((item) => (
          <div
            key={item.model[0].name}
            className={`grid ${grid} min-h-[52px] items-center border-b py-2 last:border-b-0 ${line} ${isDark ? "text-white" : "text-[#0b1626]"}`}
          >
            <CarThumb item={item} className="h-[42px] w-[112px]" />
            <ModelName item={item} className="text-[1.1rem] font-medium" />
            <span className={`pl-3 pr-4 text-[0.98rem] leading-[1.4] ${isDark ? "text-white/85" : "text-[#2a3646]"}`}>{item.generations}</span>
            <span className="pr-3">
              <Verdict verdict={item.verdict} isDark={isDark} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function categoryOf(item) {
  const name = item.model[0].name.toLowerCase();
  if (name === "i series") return "electric";
  if (/^m\d/.test(name)) return "m";
  if (/^x/.test(name)) return "x";
  if (/series$/.test(name)) return "series";
  return "other";
}

export default function HomeSec2({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const left = data.models.slice(0, data.split);
  const right = data.models.slice(data.split);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.models.filter((item) => {
      if (filter !== "all" && categoryOf(item) !== filter) return false;
      if (!q) return true;
      return `${item.model.map((m) => m.name).join(" ")} ${item.generations}`.toLowerCase().includes(q);
    });
  }, [data.models, filter, query]);
  const mobileRows = showAll ? filtered : filtered.slice(0, data.mobileLimit);

  const heading = isDark ? "text-white" : "text-[#0b1626]";
  const muted = isDark ? "text-white/80" : "text-[#2a3646]";

  return (
    <section id="find-your-vehicle" className={`find-your-vehicle relative overflow-hidden ${isDark ? "bg-[#060a10]" : "bg-[#f7f9fb]"}`}>
      {/* Desktop / tablet */}
      <div className="relative mx-auto hidden w-full max-w-[1600px] px-6 pb-12 pt-14 md:block lg:px-[3%]">
        <GrilleImage src={isDark ? data.headerImage.dark : data.headerImage.light} className="right-0 top-0 h-[218px] w-[56%]" fadeStart="90%" position="object-cover object-[35%_100%]" />
        <div className="relative max-w-[600px] pl-2 lg:pl-[2.5%]">
          <h2 className={`text-[3.4rem] font-bold leading-[1.05] tracking-[-0.02em] lg:text-[4rem] ${heading}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className={`mt-3 max-w-[470px] text-[1.15rem] leading-[1.4] lg:text-[1.2rem] ${muted}`}>{data.subHeadline}</p>
        </div>
        <div
          className={`relative mt-6 grid overflow-hidden rounded-[14px] border lg:grid-cols-[1fr_1.03fr] ${
            isDark ? "border-[#1b3256] bg-[rgba(12,20,32,0.92)]" : "border-[#e3e8ef] bg-white shadow-[0_8px_30px_rgba(10,26,43,0.06)]"
          }`}
        >
          <Table rows={left} columns={data.columns} isDark={isDark} />
          <Table rows={right} columns={data.columns} isDark={isDark} right />
        </div>
      </div>

      {/* Phone */}
      <div className="relative px-4 pb-6 pt-8 md:hidden">
        <GrilleImage src={isDark ? data.headerImage.dark : data.headerImage.light} className="right-0 top-3 h-[112px] w-[44%]" fadeStart="92%" position="object-cover object-[30%_100%]" />
        <div className="relative max-w-[60%]">
          <h2 className={`text-[1.85rem] font-bold leading-[1.1] tracking-[-0.02em] ${heading}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className={`mt-2.5 text-[0.85rem] leading-[1.45] ${muted}`}>{data.subHeadline}</p>
        </div>

        <label
          className={`relative mt-6 flex items-center gap-3 rounded-[8px] border px-4 py-3 ${
            isDark ? "border-white/15 bg-[#0b111a] text-white/60" : "border-[#d9dee6] bg-white text-[#3b4656]"
          }`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder={data.searchPlaceholder}
            className={`w-full bg-transparent text-[0.9rem] outline-none ${isDark ? "text-white placeholder:text-white/45" : "text-[#0b1626] placeholder:text-[#8a94a3]"}`}
          />
        </label>

        <div className="relative mt-3.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {data.filters.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setFilter(f.value);
                  setShowAll(false);
                }}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[0.78rem] font-medium ${
                  active
                    ? "border-[#0a55d6] bg-[#0a55d6] text-white"
                    : isDark
                      ? "border-white/15 bg-[#0b111a] text-white"
                      : "border-[#d9dee6] bg-white text-[#0b1626]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className={`relative mt-3.5 overflow-hidden rounded-[8px] border ${isDark ? "border-white/10 bg-[#0b111a]" : "border-[#e3e7ed] bg-white"}`}>
          {mobileRows.map((item) => (
            <div
              key={item.model[0].name}
              className={`grid grid-cols-[78px_minmax(0,1fr)_140px] items-center gap-2.5 border-b px-2.5 py-2.5 ${
                isDark ? "border-white/10 text-white" : "border-[#e8ecf1] text-[#0b1626]"
              }`}
            >
              <CarThumb item={item} className="h-[30px] w-[78px]" />
              <span className="min-w-0">
                <ModelName item={item} className="block text-[0.95rem] font-semibold leading-tight" />
                <span className={`mt-0.5 block text-[0.75rem] leading-[1.4] ${muted}`}>{item.generations}</span>
              </span>
              <span>
                <Verdict verdict={item.verdict} isDark={isDark} mobile />
              </span>
            </div>
          ))}
          {!mobileRows.length ? <p className={`px-4 py-5 text-sm ${muted}`}>No models match your search.</p> : null}
          {filtered.length > data.mobileLimit ? (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="flex w-full items-center justify-center gap-3 py-3.5 text-[0.95rem] text-[#0a4fc2]"
            >
              {showAll ? "Show fewer models" : `${data.viewAll.label} (${filtered.length})`}
              <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-4 w-4 ${showAll ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className={`relative mt-3.5 rounded-[8px] border p-4 ${isDark ? "border-white/10 bg-[#0b111a]" : "border-[#e3e7ed] bg-[#f9fbfd]"}`}>
          <div className="flex gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a4fc2] text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <span>
              <span className={`block text-[0.9rem] font-semibold ${heading}`}>{data.trust.title}</span>
              <span className={`mt-1 block text-[0.8rem] leading-[1.45] ${muted}`}>{data.trust.text}</span>
            </span>
          </div>
          <Link
            href={data.cta.href}
            className="mt-3.5 flex items-center justify-center gap-3 rounded-[4px] bg-[#0b47a8] py-3 text-[0.9rem] font-semibold text-white"
          >
            {data.cta.buttonLabel}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
