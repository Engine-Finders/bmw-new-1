"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";

const COLUMN_ICONS = ["car", "engine", "tag", "refresh", "shield", "clock"];

function DesktopRow({ row, isDark }) {
  const rowClass = isDark
    ? "bg-black text-white"
    : "bg-[var(--color-table-surface)] text-[var(--color-text)]";
  const cellDivider = isDark ? "border-white/15" : "border-[var(--color-border)]";
  const mutedText = isDark ? "text-white/70" : "text-[var(--color-text-muted)]";
  const codeText = isDark ? "text-[#7fb2ff]" : "text-[var(--color-primary)]";
  const borderBottom = isDark ? "border-white/15" : "border-[var(--color-border)]";

  return (
    <div
      className={`grid grid-cols-[1.3fr_1fr_1fr_1.1fr_1fr_0.8fr] items-center gap-px ${rowClass} px-5 py-3.5 text-[0.85rem] border-b ${borderBottom} last:border-b-0`}
    >
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.variant }} />
      <span className={`px-3 ${codeText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.engineCode }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.usedSupply }} />
      <span className={`px-3 font-semibold border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.reconditionedSupply }} />
      <span className={`px-3 ${mutedText} border-r ${cellDivider}`} dangerouslySetInnerHTML={{ __html: row.rebuiltSupply }} />
      <span className={`px-3 ${mutedText}`} dangerouslySetInnerHTML={{ __html: row.labourHours }} />
    </div>
  );
}

function FuelGroup({ title, icon, rows, isDark }) {
  if (!rows?.length) return null;

  const headerBg = isDark ? "bg-[#0a1f44]" : "bg-[var(--color-primary)]";

  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur">
      <div className={`flex items-center gap-2 ${headerBg} px-4 py-2.5 text-[0.8rem] font-semibold uppercase tracking-wide text-white`}>
        <GenIcon name={icon} className="h-4 w-4" />
        {title}
      </div>
      {rows.map((row) => (
        <div key={row.engineCode} className="border-b border-[var(--color-border)] p-4 last:border-b-0">
          <div className="flex items-center justify-between">
            <p className="text-[0.92rem] font-bold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.variant }} />
            <span className="text-[0.78rem] font-semibold text-[var(--color-primary)]" dangerouslySetInnerHTML={{ __html: row.engineCode }} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-y-1 text-[0.8rem]">
            <span className="text-[var(--color-text-soft)]">Used</span>
            <span className="text-right text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.usedSupply }} />
            <span className="text-[var(--color-text-soft)]">Reconditioned</span>
            <span className="text-right font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.reconditionedSupply }} />
            <span className="text-[var(--color-text-soft)]">Rebuilt</span>
            <span className="text-right text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.rebuiltSupply }} />
            <span className="text-[var(--color-text-soft)]">Labour</span>
            <span className="text-right text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: row.labourHours }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReplacementCosts({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const headerBg = isDark ? "bg-[#0a1f44]" : "bg-[var(--color-primary)]";
  const headerDivider = isDark ? "border-white/20" : "border-white/25";
  const bodyWrapperBg = isDark ? "bg-black" : "bg-[var(--color-table-surface)]";

  const petrolRows = data.rows?.filter((row) => row.fuelType === "petrol") || [];
  const dieselRows = data.rows?.filter((row) => row.fuelType === "diesel") || [];

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hidden md:block">
          <Image src="/e90/engine_replacement.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-page)_0%,rgba(2,7,11,0.72)_32%,transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_100%)]" />
        </div>

        <div className="relative h-[200px] w-full md:hidden">
          <Image src="/e90/engine_replacement.png" alt="" fill className="object-cover object-[75%_center]" sizes="100vw" priority />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--color-page)_100%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-8xl px-4 py-6 md:px-8 md:py-10">
          <h2 className="max-w-[720px] text-[2.55rem] font-bold leading-[1.05] tracking-normal text-[var(--color-text)] md:text-[3.5rem]" dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <div className="mt-3">
            <MStripe />
          </div>
          {data.subHeadline ? (
            <p className="mt-5 max-w-[560px] text-[1rem] leading-[1.5] text-[var(--color-text-muted)] md:text-[1.08rem]" dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
          ) : null}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="mt-6 hidden overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur md:block">
          <div className={`grid grid-cols-[1.3fr_1fr_1fr_1.1fr_1fr_0.8fr] gap-px ${headerBg} px-5 py-3 text-[0.82rem] font-semibold text-white`}>
            {data.columns?.map((col, index) => (
              <span key={col} className={`flex items-center gap-2 px-3 border-r ${headerDivider} last:border-r-0`}>
                <GenIcon name={COLUMN_ICONS[index]} className="h-4 w-4 shrink-0" />
                {col}
              </span>
            ))}
          </div>
          <div className={bodyWrapperBg}>
            {data.rows?.map((row) => (
              <DesktopRow key={row.engineCode} row={row} isDark={isDark} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:hidden">
          <FuelGroup title="Petrol Engines" icon="car" rows={petrolRows} isDark={isDark} />
          <FuelGroup title="Diesel Engines" icon="engine" rows={dieselRows} isDark={isDark} />
        </div>

        {data.trustStrip?.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:grid-cols-4">
            {data.trustStrip.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <GenIcon name={item.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[0.85rem] font-semibold text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: item.title }} />
                  <p className="text-[0.76rem] leading-[1.35] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {data.note ? <p className="mt-4 text-[0.78rem] text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: data.note }} /> : null}
      </div>
    </section>
  );
}