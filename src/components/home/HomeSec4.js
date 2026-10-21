"use client";

import Image from "next/image";
import Link from "next/link";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
import BrandIcon from "@/components/home/brandIcon";
import VerdictGlyph from "@/components/home/VerdictGlyph";

// BMW Ownership Rankings — ranking / winner / why / verdict table under a grille header.
// Phone adds the trust strip above the table and the "Honest, Data-Backed" card below it.

const TONE = { red: "bg-[#e3262b]", orange: "bg-[#f5a20b]" };

function Chevron({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

// Verdict: icon + word only (no chip / background box).
function Verdict({ verdict, isDark, phone = false }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${isDark ? "text-white" : "text-[#0b1626]"} ${phone ? "shrink-0 text-[15px]" : "text-[16px]"}`}>
      <VerdictGlyph type={verdict.type} isDark={isDark} className={phone ? "h-[22px] w-[22px] shrink-0" : "h-6 w-6 shrink-0"} />
      {verdict.text}
    </span>
  );
}

function RankIcon({ row, phone }) {
  const tone = phone && row.phoneTone ? TONE[row.phoneTone] : "bg-[#0b4fc0]";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full text-white ${tone} ${phone ? "h-9 w-9" : "h-12 w-12"}`}>
      <BrandIcon name={row.icon} className={phone ? "h-5 w-5" : "h-7 w-7"} scale={1} />
    </span>
  );
}

// Phone badges: value on one line, description on at most two (same sizes as every phone badge row).
function TrustStrip({ items, isDark }) {
  return (
    <ul className={`grid grid-cols-4 rounded-[10px] border py-3.5 ${isDark ? "border-[#1e3350] bg-[rgba(10,18,30,0.9)]" : "border-[#e6eaf0] bg-white"}`}>
      {items.map((item) => (
        <li
          key={item.text}
          className={`relative flex flex-col items-center px-0.5 text-center [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:top-1/2 [&:not(:last-child)]:after:h-[60%] [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:-translate-y-1/2 ${
            isDark ? "after:bg-white/10" : "after:bg-[#e6eaf0]"
          }`}
        >
          <span className={isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}>
            <BrandIcon name={item.icon} className="h-7 w-7" scale={1} />
          </span>
          <span className={`mt-1.5 whitespace-nowrap text-[15px] font-semibold leading-tight ${isDark ? "text-white" : "text-[#0b1626]"}`}>
            {item.value}
            {item.tail ? <span className="font-normal"> {item.tail}</span> : null}
          </span>
          <span className={`mt-0.5 text-[13px] leading-[1.3] ${isDark ? "text-white/80" : "text-[#3b4656]"}`}>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

// One grid for header and rows: every heading starts exactly where its column's content starts.
const COLS = "grid grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)_minmax(0,1.75fr)_120px]";

export default function HomeSec4({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/80" : "text-[#2a3646]";
  const line = isDark ? "border-white/[0.08]" : "border-[#e8ecf1]";
  const grille = isDark ? data.headerImage.dark : data.headerImage.light;

  return (
    <section className={`relative overflow-hidden ${isDark ? "bg-[#060a10]" : "bg-[#fbfcfd]"}`}>
      {/* Desktop / tablet */}
      <div className="relative hidden md:block">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[300px] w-[47%] overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,black_16%),linear-gradient(180deg,black_62%,transparent_100%)] [mask-composite:intersect]"
        >
          <div className="absolute -right-[3%] -top-[4%] aspect-[1092/490] w-[104%] origin-left [transform:perspective(1400px)_rotateY(14deg)]">
            <Image src={grille} alt="" fill sizes="55vw" className="object-contain object-top" />
          </div>
        </div>
        <div className="site-container section-y relative">
          <div className="max-w-[700px]">
            <h2 className={`t-h2 ${strong}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
            <p className={`t-p mt-3 max-w-[620px] ${soft}`}>{data.subHeadline}</p>
          </div>

          <div
            className={`relative mt-8 overflow-hidden rounded-[10px] border ${
              isDark ? "border-white/[0.1] bg-[rgba(10,16,26,0.88)]" : "border-[#e6eaf0] bg-white shadow-[0_8px_30px_rgba(10,26,43,0.06)]"
            }`}
          >
            <div className={`${COLS} t-label items-center px-4 py-3.5 font-semibold uppercase tracking-[0.02em]`} style={{ background: TABLE_HEADER_BG, color: TABLE_HEADER_TEXT }}>
              {data.columns.map((c) => (
                <span key={c} className="px-4">
                  {c}
                </span>
              ))}
            </div>
            {data.rankings.map((row) => (
              <Link key={row.ranking} href={row.href} className={`${COLS} items-center border-b px-4 py-3 font-normal last:border-b-0 ${line} ${strong}`}>
                <span className={`flex items-center gap-4 border-r px-4 py-1.5 ${line}`}>
                  <RankIcon row={row} />
                  <span className="t-body">{row.ranking}</span>
                </span>
                <span className={`border-r px-4 py-1.5 ${line}`}>
                  <span className="block text-[18px] font-medium leading-tight">{row.winner}</span>
                  {row.winnerNote ? <span className={`t-label mt-1 block ${soft}`}>{row.winnerNote}</span> : null}
                </span>
                <span className={`t-body px-4 ${soft}`}>{row.why}</span>
                <span className="px-4">
                  <Verdict verdict={row.verdict} isDark={isDark} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="relative px-4 pb-8 pt-8 md:hidden">
        <h2 className={`t-h2 ${strong}`}>BMW Ownership Rankings</h2>
        <p className={`t-body mt-3 ${soft}`}>{data.subHeadline}</p>
        <div className="mt-4">
          <TrustStrip items={data.trustStrip} isDark={isDark} />
        </div>

        <ul className="mt-4 grid gap-3">
          {data.rankings.map((row) => (
            <li key={row.ranking}>
              <Link href={row.href} className={`block rounded-[12px] border p-4 font-normal ${isDark ? "border-white/10 bg-[#0b111a]" : "border-[#e3e7ed] bg-white"} ${strong}`}>
                <span className="flex items-center gap-3">
                  <RankIcon row={row} phone />
                  <span className={`flex-1 text-[14px] font-semibold uppercase leading-[1.35] tracking-[0.02em] ${isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}`}>{row.ranking}</span>
                  <Verdict verdict={row.verdict} isDark={isDark} phone />
                </span>
                <span className="mt-3 block text-[18px] font-bold leading-tight">
                  {row.winner}
                  {row.winnerNote ? <span className={`ml-1.5 text-[14px] font-normal ${soft}`}>{row.winnerNote}</span> : null}
                </span>
                <span className={`t-body mt-1.5 flex items-start gap-2 ${soft}`}>
                  <span className="flex-1">{row.why}</span>
                  <Chevron className="mt-1 h-4 w-4 shrink-0" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={`mt-4 flex flex-col gap-3 rounded-[8px] border p-4 ${isDark ? "border-white/10 bg-[#0b111a]" : "border-[#e3e7ed] bg-[#f6f8fb]"}`}>
          <div className="flex gap-3.5">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-12 w-12 shrink-0">
              <path d="M12 2 4 5v6.5c0 5 3.4 9.3 8 10.5 4.6-1.2 8-5.5 8-10.5V5l-8-3Z" fill="#0b47a8" />
              <path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              <span className={`block text-[17px] font-semibold ${strong}`}>{data.bottomCta.title}</span>
              <span className={`t-body mt-1 block ${soft}`}>{data.bottomCta.text}</span>
            </span>
          </div>
          <Link href={data.bottomCta.href} className="flex items-center justify-center gap-3 rounded-[4px] bg-[#0b47a8] py-3 text-[15px] font-semibold text-white">
            {data.bottomCta.buttonLabel}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
