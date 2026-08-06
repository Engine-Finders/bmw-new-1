"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";

const verdictStyles = {
  warning: { icon: "warning", light: "text-[#d97517] bg-[#fff6eb]", dark: "text-[#ffb05a] bg-[rgba(236,139,31,0.14)]" },
  success: { icon: "check", light: "text-[#13884a] bg-[#eefaf3]", dark: "text-[#67d99a] bg-[rgba(24,148,84,0.16)]" },
  danger: { icon: "warning", light: "text-[#db2e2e] bg-[#fff0f0]", dark: "text-[#ff8b90] bg-[rgba(255,45,53,0.15)]" },
  info: { icon: "info", light: "text-[var(--color-primary)] bg-[var(--color-primary-soft)]", dark: "text-[#7fb2ff] bg-[rgba(36,132,255,0.16)]" },
};

function VerdictPill({ verdictType, text, isDark }) {
  const style = verdictStyles[verdictType] || verdictStyles.info;
  const classes = isDark ? style.dark : style.light;

  return (
    <span className={`inline-flex items-start gap-2 rounded-md px-2.5 py-1.5 text-[0.78rem] leading-[1.25] ${classes}`}>
      <GenIcon name={style.icon} className="mt-0.5 h-4 w-4 shrink-0" />
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </span>
  );
}

function DesktopRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid grid-cols-[110px_100px_1fr_130px_150px_1.4fr] items-center gap-px ${rowClass} px-5 py-3.5 text-[0.85rem] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engine }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
      <VerdictPill verdictType={row.verdictType} text={row.ownershipVerdict} isDark={isDark} />
    </div>
  );
}

const MOBILE_COLS = "grid-cols-[90px_90px_140px_110px_120px_220px]";

function MobileRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid ${MOBILE_COLS} items-center gap-px ${rowClass} px-3 py-3 text-[0.72rem] leading-[1.3] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-2 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engine }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.typicalMileage }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.commonMajorFailure }} />
      <span className={`px-2 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.repairCostSpecialist }} />
      <span className={`px-2 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.replacementCostRecon }} />
      <VerdictPill verdictType={row.verdictType} text={row.ownershipVerdict} isDark={isDark} />
    </div>
  );
}

const takeawayIcons = ["diamond", "chart", "trophy"];
const COLUMN_ICONS = ["engine", "gauge", "warning", "wrench", "refresh", "shield"];

export default function OwnershipEconomics({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const headerBg = isDark ? "bg-[#0a1f44]" : "bg-[var(--color-primary)]";
  const headerDivider = isDark ? "border-white/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative -mt-8 mb-6 h-[170px] w-full md:hidden">
        <Image src="/e90/section11.png" alt="" fill className="object-cover object-[65%_30%]" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,var(--color-page)_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <h2 className="text-[2.55rem] font-bold leading-[1.05] tracking-normal text-[var(--color-text)] md:text-[3.5rem]" dangerouslySetInnerHTML={{ __html: data.h2 }} />
        <div className="mt-3">
          <MStripe />
        </div>

        <div className="mt-6 hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid grid-cols-[110px_100px_1fr_130px_150px_1.4fr] gap-px ${headerBg} px-5 py-3 text-[0.82rem] font-semibold text-white`}>
            {data.columns?.map((col, index) => (
              <span key={col} className={`flex items-center gap-2 px-3 border-r ${headerDivider} last:border-r-0`}>
                <GenIcon name={COLUMN_ICONS[index]} className="h-4 w-4 shrink-0" />
                {col}
              </span>
            ))}
          </div>
          <div className={bodyWrapperBg}>
            {data.rows?.map((row) => (
              <DesktopRow key={row.engine} row={row} isDark={isDark} />
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:hidden">
          <div className="min-w-[850px]">
            <div className={`grid ${MOBILE_COLS} gap-px ${headerBg} px-3 py-2.5 text-[0.7rem] font-semibold leading-[1.2] text-white`}>
              {data.columns?.map((col, index) => (
                <span key={col} className={`flex items-center gap-1.5 px-2 border-r ${headerDivider} last:border-r-0`}>
                  <GenIcon name={COLUMN_ICONS[index]} className="h-3.5 w-3.5 shrink-0" />
                  {col}
                </span>
              ))}
            </div>
            <div className={bodyWrapperBg}>
              {data.rows?.map((row) => (
                <MobileRow key={row.engine} row={row} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_1fr]">
          {data.economicsRule ? (
            <div className="rounded-md border border-[var(--color-primary)] bg-[var(--color-primary-soft)] p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <GenIcon name="scale" className="h-6 w-6" />
                </span>
                <p className="text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: data.economicsRule.title }} />
              </div>
              <p className="mt-3 text-[0.85rem] leading-[1.5] text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: data.economicsRule.text }} />
              {data.economicsRule.highlight ? (
                <p className="mt-2 text-[0.9rem] font-bold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: data.economicsRule.highlight }} />
              ) : null}
            </div>
          ) : null}

          {data.keyTakeaways?.length > 0 ? (
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-[0.78rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                Key Takeaways
              </p>
              <ul className="mt-3 flex flex-col gap-3">
                {data.keyTakeaways.map((item, index) => (
                  <li key={item.question} className="flex items-start gap-3 border-t border-[var(--color-border)] pt-3 first:border-t-0 first:pt-0">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                      <GenIcon name={takeawayIcons[index % takeawayIcons.length]} className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.85rem] font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.question }} />
                      <p className="text-[0.8rem] leading-[1.4] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </div>
                    <span className="mt-1 shrink-0 text-[var(--color-primary)]">
                      <GenIcon name="chevron" className="h-4 w-4" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
