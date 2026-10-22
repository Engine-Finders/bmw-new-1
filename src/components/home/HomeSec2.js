"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
import VerdictGlyph from "@/components/home/VerdictGlyph";
import GrilleImage from "@/components/home/GrilleImage";

// Find Your Vehicle - desktop: two tables (1–8 Series, Z, i | X, M, classics); phone: search,
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
  const icon = mobile ? "h-5 w-5" : "h-[18px] w-[18px]";
  return (
    <span className={`inline-flex flex-col gap-1 ${text} ${mobile ? "text-[14px]" : "text-[15px]"}`}>
      <span className="flex items-center gap-2">
        <VerdictGlyph type={verdict.type} isDark={isDark} round={mobile} className={`${icon} shrink-0`} />
        <span className="leading-[1.3]">{verdict.title}</span>
      </span>
      {verdict.also ? (
        <span className="flex items-center gap-2">
          <VerdictGlyph type={verdict.also.type} isDark={isDark} round={mobile} className={`${icon} shrink-0`} />
          <span className="leading-[1.3]">{verdict.also.title}</span>
        </span>
      ) : null}
      {verdict.note ? (
        <span className={`leading-[1.4] ${isDark ? "text-white/80" : "text-[#3b4656]"} ${mobile ? "pl-7 text-[13px]" : "pl-[26px] text-[15px]"}`}>
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
          <Link href={m.href} className="font-normal hover:underline">
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

// One grid template for the header and the rows, so every heading starts where its column does.
const GRID = "grid grid-cols-[96px_minmax(76px,0.7fr)_minmax(0,1fr)_minmax(0,1.25fr)] gap-x-4 px-5";

function Table({ rows, columns, isDark, right = false }) {
  const line = isDark ? "border-white/[0.07]" : "border-[#e8ecf1]";
  return (
    <div className={right ? `border-t lg:border-l lg:border-t-0 ${isDark ? "border-white/[0.1]" : "border-[#e3e8ef]"}` : ""}>
      <div className={`${GRID} t-label items-center py-3 font-semibold uppercase tracking-[0.02em]`} style={{ background: TABLE_HEADER_BG, color: TABLE_HEADER_TEXT }}>
        <span className="col-span-2">{columns[0]}</span>
        <span>{columns[1]}</span>
        <span>{columns[2]}</span>
      </div>
      {rows.map((item) => (
        <div
          key={item.model[0].name}
          className={`${GRID} min-h-[60px] items-center border-b py-2.5 last:border-b-0 ${line} ${isDark ? "text-white" : "text-[#0b1626]"}`}
        >
          <CarThumb item={item} className="h-[40px] w-[96px]" />
          <ModelName item={item} className="t-body" />
          <span className={`t-body ${isDark ? "text-white/85" : "text-[#2a3646]"}`}>{item.generations}</span>
          <span>
            <Verdict verdict={item.verdict} isDark={isDark} />
          </span>
        </div>
      ))}
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
      <div className="relative hidden md:block">
        <GrilleImage src={isDark ? data.headerImage.dark : data.headerImage.light} className="right-0 top-0 h-[230px] w-[52%]" fadeStart="88%" position="object-cover object-[35%_100%]" />
        <div className="site-container section-y relative">
          <div className="max-w-[620px]">
            <h2 className={`t-h2 ${heading}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
            <p className={`t-p mt-3 max-w-[520px] ${muted}`}>{data.subHeadline}</p>
          </div>
          <div
            className={`relative mt-8 grid overflow-hidden rounded-[14px] border lg:grid-cols-2 ${
              isDark ? "border-[#1b3256] bg-[rgba(12,20,32,0.92)]" : "border-[#e3e8ef] bg-white shadow-[0_8px_30px_rgba(10,26,43,0.06)]"
            }`}
          >
            <Table rows={left} columns={data.columns} isDark={isDark} />
            <Table rows={right} columns={data.columns} isDark={isDark} right />
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="relative px-4 pb-8 pt-8 md:hidden">
        {/* Reference: large white/black grille top right, bleeding off the edge behind the heading. */}
        <GrilleImage src={isDark ? data.headerImage.dark : data.headerImage.light} className="-right-2 top-0 h-[190px] w-[50%]" fadeStart="78%" position="object-cover object-[22%_70%]" />
        <div className="relative max-w-[62%]">
          <p className={`t-h2 ${heading}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className={`t-body mt-3 ${muted}`}>{data.subHeadline}</p>
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
            className={`w-full bg-transparent text-[15px] outline-none ${isDark ? "text-white placeholder:text-white/45" : "text-[#0b1626] placeholder:text-[#8a94a3]"}`}
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
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium ${
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
              className={`grid grid-cols-[84px_minmax(0,1fr)_132px] items-center gap-2.5 border-b px-3 py-3 ${
                isDark ? "border-white/10 text-white" : "border-[#e8ecf1] text-[#0b1626]"
              }`}
            >
              <CarThumb item={item} className="h-[36px] w-[84px]" />
              <span className="min-w-0">
                <ModelName item={item} className="block text-[17px] leading-tight" />
                <span className={`mt-1 block text-[14px] leading-[1.4] ${muted}`}>{item.generations}</span>
              </span>
              <span>
                <Verdict verdict={item.verdict} isDark={isDark} mobile />
              </span>
            </div>
          ))}
          {!mobileRows.length ? <p className={`t-body px-4 py-5 ${muted}`}>No models match your search.</p> : null}
          {filtered.length > data.mobileLimit ? (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="t-body flex w-full items-center justify-center gap-3 py-3.5 text-[#0a4fc2]"
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
              <span className={`block text-[16px] font-semibold ${heading}`}>{data.trust.title}</span>
              <span className={`t-body mt-1 block ${muted}`}>{data.trust.text}</span>
            </span>
          </div>
          <Link
            href={data.cta.href}
            className="mt-3.5 flex items-center justify-center gap-3 rounded-[4px] bg-[#0b47a8] py-3 text-[15px] font-semibold text-white"
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
