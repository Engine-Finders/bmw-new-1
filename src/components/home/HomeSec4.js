"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import BrandIcon, { hasBrandIcon } from "@/components/home/brandIcon";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  book: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
  engine: <path d="M3 13h2v-3h4V7H7V5h8v2h-2v3h3l2 2h3v7h-3l-2 2H7v-3H5v-3H3v-2Zm6-1v7h6.2l1.8-2h2v-3h-2l-1.8-2H9Z" />,
  car: <path d="M5 13 7 7h10l2 6M4 13h16v6H4v-6Zm2 0V9m12 4V9M7 17h.01M17 17h.01" />,
  tag: <path d="M20 10 12 18 4 10V4h6l10 10ZM7.5 7.5h.01" />,
  warning: <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  flame: <path d="M12 3s1 2.5 1 4.5S11 11 11 11s.3-3-1.5-5.5C7.2 8 6 10 6 13a6 6 0 0 0 12 0c0-3.2-1.8-5.7-4.5-8.2.1 1.7-.2 3.1-1.5 4.7" />,
  users: <path d="M16 21v-2a4 4 0 0 0-8 0v2m12 0v-2.5a3.5 3.5 0 0 0-3-3.45M4 21v-2.5a3.5 3.5 0 0 1 3-3.45M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-1a3 3 0 1 0 0-6M6 10a3 3 0 1 1 0-6" />,
  crown: <path d="m3 8 4 3 5-6 5 6 4-3-2 10H5L3 8Zm4 11h10" />,
  check: <path d="m5 12 4 4L19 6" />,
  x: <path d="M8 8l8 8M16 8l-8 8" />,
  alert: <path d="M12 8v5m0 4h.01M12 3 2 21h20L12 3Z" />,
};

const verdictStyles = {
  best: "border-[#d7eadb] bg-[#f2fbf4] text-[#071827]",
  safe: "border-[#d7eadb] bg-[#eefaf3] text-[#071827]",
  avoid: "border-[#f4cfd2] bg-[#fff0f1] text-[#071827]",
  watch: "border-[#f4dfbf] bg-[#fff7ea] text-[#5b3200]",
  family: "border-[#d5e8fb] bg-[#f0f8ff] text-[#06316f]",
};

const verdictIconColors = {
  best: "text-[#f6a400]",
  safe: "text-[#35a853]",
  avoid: "text-[#df232a]",
  watch: "text-[#f59e0b]",
  family: "text-[var(--color-primary)]",
};

function Icon({ name, className = "h-6 w-6" }) {
  // The client's icon artwork where it has one; arrows and chevrons stay as line icons.
  if (hasBrandIcon(name)) return <BrandIcon name={name} className={className} />;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.trophy}
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function TrustStrip({ items, isDark }) {
  return (
    <ul
      className={`grid grid-cols-4 overflow-hidden rounded-md border shadow-[0_14px_34px_rgba(10,26,43,0.1)] md:hidden ${
        isDark ? "border-[#1f3c57] bg-[rgba(7,23,36,0.86)]" : "border-[#d7dde6] bg-white"
      }`}
    >
      {items.map((item) => (
        <li key={item.text} className={`flex min-w-0 flex-col items-center gap-2 border-r px-1.5 py-4 text-center last:border-r-0 ${isDark ? "border-[#29445e]" : "border-[#d7dde6]"}`}>
          <span className="flex h-8 w-8 items-center justify-center text-[var(--color-primary)]">
            <Icon name={item.icon} className="h-8 w-8" />
          </span>
          <span className={isDark ? "text-white" : "text-[#071827]"}>
            <strong className="block text-[0.94rem] leading-tight">{item.value}</strong>
            <span className={`block text-[0.66rem] leading-[1.28] ${isDark ? "text-white/78" : "text-[#27384a]"}`}>{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function VerdictBadge({ verdict }) {
  return (
    <span className={`inline-flex min-w-[74px] items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[0.76rem] font-bold md:min-w-[104px] md:gap-3 md:px-3 md:py-2 md:text-[0.9rem] ${verdictStyles[verdict.type] || verdictStyles.best}`}>
      <Icon name={verdict.icon} className={`h-4 w-4 md:h-5 md:w-5 ${verdictIconColors[verdict.type] || verdictIconColors.best}`} />
      <span>{verdict.text}</span>
    </span>
  );
}

function RankingIcon({ row }) {
  const dangerClass = row.verdict.type === "avoid" ? "bg-[#ed1c24]" : row.verdict.type === "watch" ? "bg-[#f59e0b]" : "bg-[var(--color-primary)]";

  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white md:h-14 md:w-14 ${dangerClass}`}>
      <Icon name={row.icon} className="h-6 w-6 md:h-8 md:w-8" />
    </span>
  );
}

function RankingRow({ row, isDark }) {
  return (
    <Link
      href={row.href}
      className={`block border-b last:border-b-0 ${
        isDark ? "border-[#223a51] text-white hover:bg-[rgba(20,46,68,0.45)]" : "border-[#dfe5ed] text-[#071827] hover:bg-[#f8fbff]"
      }`}
    >
      {/* Desktop: one row across the four columns */}
      <div className="hidden items-center md:grid md:grid-cols-[minmax(320px,1.3fr)_minmax(180px,0.78fr)_minmax(430px,2.3fr)_126px_24px] md:gap-5 md:px-6 md:py-4">
        <div className="flex min-w-0 flex-row items-center gap-5 text-left">
          <RankingIcon row={row} />
          <span className="text-[1.08rem] font-bold leading-[1.2]">{row.ranking}</span>
        </div>
        <div className={`min-w-0 border-l pl-5 ${isDark ? "border-[#223a51]" : "border-[#dfe5ed]"}`}>
          <p className="text-[1.12rem] font-bold leading-tight">{row.winner}</p>
          {row.winnerNote ? <p className={`mt-1 text-[0.85rem] leading-[1.2] ${isDark ? "text-white/75" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: row.winnerNote }} /> : null}
        </div>
        <p className={`min-w-0 border-l pl-5 text-[0.9rem] leading-[1.32] ${isDark ? "border-[#223a51] text-white/82" : "border-[#dfe5ed] text-[#172b4a]"}`} dangerouslySetInnerHTML={{ __html: row.why }} />
        <div className="flex justify-center">
          <VerdictBadge verdict={row.verdict} />
        </div>
        <span className={isDark ? "text-white" : "text-[#071827]"}>
          <ChevronIcon />
        </span>
      </div>

      {/* Mobile: a card - ranking and verdict on top, the winner, then the reason at full width */}
      <div className="px-4 py-4 md:hidden">
        <div className="flex items-center gap-3">
          <RankingIcon row={row} />
          <p className="min-w-0 flex-1 text-[0.8rem] font-bold uppercase leading-tight tracking-[0.03em] text-[var(--color-primary)]">{row.ranking}</p>
          <VerdictBadge verdict={row.verdict} />
        </div>
        <p className="mt-3 text-[1.02rem] font-bold leading-tight">
          {row.winner}
          {row.winnerNote ? (
            <span className={`ml-1.5 text-[0.8rem] font-medium ${isDark ? "text-white/70" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: row.winnerNote }} />
          ) : null}
        </p>
        <p className={`mt-1.5 text-[0.84rem] leading-[1.45] ${isDark ? "text-white/80" : "text-[#172b4a]"}`} dangerouslySetInnerHTML={{ __html: row.why }} />
      </div>
    </Link>
  );
}

// "Quick Reference: Data Sources Used in Sections 1-4" from the content, as a compact two-column table.
function DataSources({ sources, isDark }) {
  if (!sources?.rows?.length) return null;
  return (
    <div
      className={`mt-5 overflow-hidden rounded-md border ${
        isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.88)]" : "border-[#d7dde6] bg-white"
      }`}
    >
      <h3 className={`flex items-center gap-3 border-b px-4 py-3 text-[0.9rem] font-bold md:px-6 ${isDark ? "border-[#223a51] text-white" : "border-[#e4e9f0] text-[#071827]"}`}>
        <span className="text-[var(--color-primary)]">
          <Icon name="book" className="h-6 w-6" />
        </span>
        {sources.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="hidden md:table-header-group">
            <tr className={isDark ? "bg-white/5" : "bg-[#f4f7fb]"}>
              {(sources.columns || ["Claim", "Source"]).map((col) => (
                <th key={col} className={`px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.06em] md:px-6 ${isDark ? "text-white/60" : "text-[#617084]"}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sources.rows.map((row) => (
              <tr key={row.claim} className={`block border-t py-2 md:table-row md:py-0 ${isDark ? "border-[#223a51]" : "border-[#eef2f7]"}`}>
                <td className={`block px-4 text-[0.84rem] font-semibold md:table-cell md:px-6 md:py-2 md:text-[0.82rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{row.claim}</td>
                <td className={`block px-4 text-[0.78rem] md:table-cell md:px-6 md:py-2 md:text-[0.8rem] ${isDark ? "text-white/72" : "text-[#27384a]"}`}>{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function HomeSec4({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const heroImage = isDark ? data.heroImages.dark : data.heroImages.light;

  return (
    <section className={`relative overflow-hidden px-3 py-6 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 hidden h-[320px] md:block">

        {/* Banner on the right: the car (or engine) stays whole at header height */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[64%]">
          <Image src={heroImage.src} alt={heroImage.alt} fill className="object-cover object-[78%_55%] md:object-[center_55%]" sizes="100vw" />
        </div>
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,11,0.96)_0%,rgba(2,7,11,0.8)_38%,rgba(2,7,11,0.35)_74%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_44%,rgba(255,255,255,0.1)_78%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[760px] pt-2 md:pt-8">
          <h2 className={`text-[2.35rem] font-bold leading-[0.98] tracking-normal md:text-[3.6rem] ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-4 max-w-[700px] text-[0.86rem] leading-[1.45] md:text-[1.08rem] ${isDark ? "text-white/82" : "text-[#172b4a]"}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
        </div>

        <div className="mt-6">
          <TrustStrip items={data.trustStrip} isDark={isDark} />
        </div>

        <div
          className={`mt-6 overflow-hidden rounded-md border shadow-[0_14px_36px_rgba(10,26,43,0.08)] md:mt-10 ${
            isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.88)]" : "border-[#d7dde6] bg-white"
          }`}
        >
          <div className="hidden bg-[var(--color-primary)] py-3 font-bold text-white md:grid md:grid-cols-[minmax(320px,1.3fr)_minmax(180px,0.78fr)_minmax(430px,2.3fr)_126px_24px] md:gap-5 md:px-6 md:text-[0.82rem]">
            <span className="text-center md:text-left md:pl-10">{data.columns[0]}</span>
            <span>{data.columns[1]}</span>
            <span>{data.columns[2]}</span>
            <span className="text-center">{data.columns[3]}</span>
            <span />
          </div>
          {data.rankings.map((row) => (
            <RankingRow key={row.ranking} row={row} isDark={isDark} />
          ))}
        </div>

        <DataSources sources={data.dataSources} isDark={isDark} />

        <div
          className={`mt-7 flex flex-col gap-4 rounded-md border p-4 md:hidden ${
            isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.88)]" : "border-[#d7dde6] bg-[#f8fbff]"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="flex h-15 w-15 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
              <Icon name={data.bottomCta.icon} className="h-9 w-9" />
            </span>
            <div>
              <p className={`text-[0.9rem] font-bold ${isDark ? "text-white" : "text-[#071827]"}`}>{data.bottomCta.title}</p>
              <p className={`mt-1 text-[0.74rem] leading-[1.35] ${isDark ? "text-white/76" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: data.bottomCta.text }} />
            </div>
          </div>
          <Link href={data.bottomCta.href} className="btn-cta flex items-center justify-center gap-5 rounded-md bg-[var(--color-primary)] px-4 py-3 text-[0.82rem] font-bold text-white">
            <span>{data.bottomCta.buttonLabel}</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
