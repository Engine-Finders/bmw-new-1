"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import BrandIcon from "@/components/home/brandIcon";
import VerdictGlyph from "@/components/home/VerdictGlyph";

// BMW Ownership Rankings — ranking / winner / why / verdict table under a grille header.
// Phone adds the trust strip above the table and the "Honest, Data-Backed" card below it.

const PILL = {
  light: {
    best: "border-[#dcefe0] bg-[#f1faf3]",
    safe: "border-[#dcefe0] bg-[#f1faf3]",
    avoid: "border-[#f8d3d5] bg-[#fff1f2]",
    watch: "border-[#f9e2c2] bg-[#fff7ec]",
    family: "border-[#d6e4fa] bg-[#f0f6ff]",
  },
  dark: {
    best: "border-[#1e3350] bg-[rgba(16,30,52,0.95)]",
    safe: "border-[rgba(34,164,71,0.3)] bg-[rgba(22,70,40,0.55)]",
    avoid: "border-[rgba(227,38,43,0.35)] bg-[rgba(90,18,24,0.6)]",
    watch: "border-[rgba(245,158,11,0.3)] bg-[rgba(80,55,10,0.55)]",
    family: "border-[#1e3350] bg-[rgba(16,30,52,0.95)]",
  },
};

const TONE = { red: "bg-[#e3262b]", orange: "bg-[#f5a20b]" };

function Chevron({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function Verdict({ verdict, isDark, phone = false }) {
  const cls = (isDark ? PILL.dark : PILL.light)[verdict.type] || PILL.light.best;
  return (
    <span
      className={`inline-flex items-center rounded-[5px] border ${cls} ${isDark ? "text-white" : "text-[#0b1626]"} ${
        phone ? "shrink-0 gap-1.5 px-2 py-1 text-[0.8rem]" : "w-[130px] gap-3 px-4 py-2.5 text-[1.05rem]"
      }`}
    >
      <VerdictGlyph type={verdict.type} isDark={isDark} className={phone ? "h-[14px] w-[14px] shrink-0" : "h-7 w-7"} />
      {verdict.text}
    </span>
  );
}

function RankIcon({ row, phone }) {
  const tone = phone && row.phoneTone ? TONE[row.phoneTone] : "bg-[#0b4fc0]";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full text-white ${tone} ${phone ? "h-[30px] w-[30px]" : "h-14 w-14"}`}>
      <BrandIcon name={row.icon} className={phone ? "h-4 w-4" : "h-8 w-8"} scale={1} />
    </span>
  );
}

function TrustStrip({ items, isDark }) {
  return (
    <ul className={`grid grid-cols-4 rounded-[8px] border px-1 py-4 ${isDark ? "border-[#1e3350] bg-[rgba(10,18,30,0.9)]" : "border-[#e6eaf0] bg-white"}`}>
      {items.map((item) => (
        <li key={item.text} className={`flex flex-col items-center px-1 text-center [&:not(:last-child)]:border-r ${isDark ? "border-white/10" : "border-[#e6eaf0]"}`}>
          <span className={isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}>
            <BrandIcon name={item.icon} className="h-6 w-6" scale={1} />
          </span>
          <strong className={`mt-2 text-[1rem] font-semibold ${isDark ? "text-white" : "text-[#0b1626]"}`}>{item.value}</strong>
          <span className={`mt-0.5 text-[0.74rem] leading-[1.4] ${isDark ? "text-white/80" : "text-[#3b4656]"}`}>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

export default function HomeSec4({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/80" : "text-[#2a3646]";
  const line = isDark ? "border-white/[0.08]" : "border-[#e8ecf1]";
  const grille = isDark ? data.headerImage.dark : data.headerImage.light;
  const desktopGrid = "grid-cols-[minmax(0,0.95fr)_minmax(0,0.6fr)_minmax(0,1.55fr)_150px_32px]";

  return (
    <section className={`relative overflow-hidden ${isDark ? "bg-[#060a10]" : "bg-[#fbfcfd]"}`}>
      {/* Desktop / tablet */}
      <div className="relative mx-auto hidden w-full max-w-[1600px] px-6 pb-12 pt-[69px] md:block lg:pl-[5.7%] lg:pr-[7.1%]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[310px] w-[47%] overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,black_16%),linear-gradient(180deg,black_62%,transparent_100%)] [mask-composite:intersect]"
        >
          <div className="absolute -right-[3%] -top-[4%] aspect-[1092/490] w-[104%] origin-left [transform:perspective(1400px)_rotateY(14deg)]">
            <Image src={grille} alt="" fill sizes="55vw" className="object-contain object-top" />
          </div>
        </div>
        <div className="relative max-w-[700px]">
          <h2 className={`whitespace-nowrap text-[3rem] font-bold leading-[1.12] tracking-[-0.02em] lg:text-[3.45rem] ${strong}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className={`mt-2 max-w-[600px] text-[1.06rem] leading-[1.5] ${soft}`}>{data.subHeadline}</p>
        </div>

        <div
          className={`relative mt-[16px] overflow-hidden rounded-[10px] border ${
            isDark ? "border-white/[0.1] bg-[rgba(10,16,26,0.88)]" : "border-[#e6eaf0] bg-white shadow-[0_8px_30px_rgba(10,26,43,0.06)]"
          }`}
        >
          <div
            className={`grid ${desktopGrid} items-center border-b px-9 py-4 text-[0.95rem] ${line} ${
              isDark ? "bg-[rgba(14,30,58,0.7)] text-white" : "font-medium text-[#0b4fc0]"
            }`}
          >
            <span>{data.columns[0]}</span>
            <span>{data.columns[1]}</span>
            <span>{data.columns[2]}</span>
            <span className="text-center">{data.columns[3]}</span>
            <span />
          </div>
          <div className="px-5">
            {data.rankings.map((row) => (
              <Link
                key={row.ranking}
                href={row.href}
                className={`grid ${desktopGrid} items-center border-b py-2.5 font-normal last:border-b-0 ${line} ${strong}`}
              >
                <span className={`flex items-center gap-6 border-r py-1.5 pl-4 pr-3 ${line}`}>
                  <RankIcon row={row} />
                  <span className="text-[1.1rem] leading-[1.4]">{row.ranking}</span>
                </span>
                <span className={`border-r px-7 py-1.5 ${line}`}>
                  <span className="block text-[1.3rem] font-medium leading-tight">{row.winner}</span>
                  {row.winnerNote ? <span className={`mt-1 block text-[0.92rem] leading-[1.4] ${soft}`}>{row.winnerNote}</span> : null}
                </span>
                <span className={`px-6 text-[0.92rem] leading-[1.55] ${soft}`}>{row.why}</span>
                <span className="flex justify-center">
                  <Verdict verdict={row.verdict} isDark={isDark} />
                </span>
                <span className="flex justify-end">
                  <Chevron />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="relative px-4 pb-6 pt-8 md:hidden">
        <h2 className={`text-[1.95rem] font-bold leading-[1.15] tracking-[-0.02em] ${strong}`}>BMW Ownership Rankings</h2>
        <p className={`mt-2.5 text-[0.95rem] leading-[1.5] ${soft}`}>{data.subHeadline}</p>
        <div className="mt-4">
          <TrustStrip items={data.trustStrip} isDark={isDark} />
        </div>

        <ul className="mt-4 grid gap-3">
          {data.rankings.map((row) => (
            <li key={row.ranking}>
              <Link href={row.href} className={`block rounded-[12px] border p-4 font-normal ${isDark ? "border-white/10 bg-[#0b111a]" : "border-[#e3e7ed] bg-white"} ${strong}`}>
                <span className="flex items-center gap-3">
                  <RankIcon row={row} phone />
                  <span className={`flex-1 text-[13px] font-semibold uppercase leading-[1.35] tracking-[0.02em] ${isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}`}>{row.ranking}</span>
                  <Verdict verdict={row.verdict} isDark={isDark} phone />
                </span>
                <span className="mt-3 block text-[17px] font-bold leading-tight">
                  {row.winner}
                  {row.winnerNote ? <span className={`ml-1.5 text-[13px] font-normal ${soft}`}>{row.winnerNote}</span> : null}
                </span>
                <span className={`mt-1.5 flex items-start gap-2 text-[14px] leading-[1.55] ${soft}`}>
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
              <span className={`block text-[1.05rem] font-semibold ${strong}`}>{data.bottomCta.title}</span>
              <span className={`mt-1 block text-[0.875rem] leading-[1.55] ${soft}`}>{data.bottomCta.text}</span>
            </span>
          </div>
          <Link href={data.bottomCta.href} className="flex items-center justify-center gap-3 rounded-[4px] bg-[#0b47a8] py-3 text-[0.85rem] font-medium text-white">
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
