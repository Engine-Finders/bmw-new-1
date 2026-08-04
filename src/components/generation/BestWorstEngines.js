"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";

const typeStyles = {
  success: {
    icon: "check",
    accent: "border-l-[#189454]",
    light: "text-[#13884a] bg-[#eafaf0]",
    dark: "text-[#67d99a] bg-[rgba(24,148,84,0.16)]",
  },
  trophy: {
    icon: "gauge",
    accent: "border-l-[var(--color-primary)]",
    light: "text-[var(--color-primary)] bg-[var(--color-primary-soft)]",
    dark: "text-[#7fb2ff] bg-[rgba(36,132,255,0.16)]",
  },
  danger: {
    icon: "warning",
    accent: "border-l-[#e03232]",
    light: "text-[#db2e2e] bg-[#fff0f0]",
    dark: "text-[#ff8b90] bg-[rgba(255,45,53,0.15)]",
  },
  fire: {
    icon: "dollar",
    accent: "border-l-[#da7a12]",
    light: "text-[#da7a12] bg-[#fff5ea]",
    dark: "text-[#ffb66a] bg-[rgba(218,122,18,0.15)]",
  },
  diamond: {
    icon: "diamond",
    accent: "border-l-[#189454]",
    light: "text-[#13884a] bg-[#eafaf0]",
    dark: "text-[#67d99a] bg-[rgba(24,148,84,0.16)]",
  },
  crown: {
    icon: "shield",
    accent: "border-l-[var(--color-primary)]",
    light: "text-[var(--color-primary)] bg-[var(--color-primary-soft)]",
    dark: "text-[#7fb2ff] bg-[rgba(36,132,255,0.16)]",
  },
};

function Card({ item, isDark }) {
  const style = typeStyles[item.type] || typeStyles.success;
  const badgeClass = isDark ? style.dark : style.light;

  return (
    <div className={`flex h-full flex-col gap-2 overflow-hidden rounded-md border border-l-4 border-[var(--color-border)] bg-[var(--color-surface)] p-3 ${style.accent}`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${badgeClass}`}>
          <GenIcon name={style.icon} className="h-3.5 w-3.5" />
        </span>
        <p className={`flex-1 text-[0.76rem] font-semibold leading-tight ${badgeClass.split(" ")[0]}`}>{item.slot}</p>
        <span className="shrink-0 text-[var(--color-text-soft)]">
          <GenIcon name="chevron" className="h-4 w-4" />
        </span>
      </div>

      <div>
        <p className="text-[1.05rem] font-bold leading-tight text-[var(--color-text)]">{item.engine}</p>
        {item.engineNote ? (
          <p className="mt-0.5 text-[0.76rem] text-[var(--color-text-muted)]">{item.engineNote}</p>
        ) : null}
      </div>

      <div className="flex items-start gap-2.5">
        <div className="relative h-36 w-14 shrink-0 overflow-hidden rounded-sm">
          <Image src="/e90/engine.png" alt={`${item.engine} engine`} fill className="object-cover" sizes="60px" />
        </div>
        <p className="text-[0.8rem] leading-[1.35] text-[var(--color-text-muted)]">&ldquo;{item.quote}&rdquo;</p>
      </div>

      <div className="mt-auto">
        <p className="border-t border-[var(--color-border)] pt-2 text-[0.78rem] leading-[1.3] text-[var(--color-text)]">
          <span className="font-semibold">Who it&apos;s for:</span> {item.whoItsFor}
        </p>
        {item.modelWideNote ? (
          <p className="mt-1.5 rounded-md bg-[var(--color-page-soft)] p-1.5 text-[0.7rem] leading-[1.3] text-[var(--color-text-soft)]">
            {item.modelWideNote}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function OverlookedCard({ item, isDark }) {
  const style = typeStyles[item.type] || typeStyles.crown;
  const badgeClass = isDark ? style.dark : style.light;

  return (
    <div className={`overflow-hidden rounded-md border border-l-4 border-[var(--color-border)] bg-[var(--color-surface)] ${style.accent}`}>
      <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.7fr_1fr] md:divide-x md:divide-[var(--color-border)]">
        <div className="flex items-start gap-3 p-5">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${badgeClass}`}>
            <GenIcon name={style.icon} className="h-5 w-5" />
          </span>
          <div>
            <p className={`text-[0.82rem] font-semibold ${badgeClass.split(" ")[0]}`}>{item.slot}</p>
            <p className="mt-1 text-[1.05rem] font-bold leading-tight text-[var(--color-text)]">{item.engine}</p>
            {item.engineNote ? <p className="mt-0.5 text-[0.78rem] text-[var(--color-text-muted)]">{item.engineNote}</p> : null}
          </div>
        </div>

        <div className="p-5 md:pt-5">
          <p className="text-[0.88rem] leading-[1.5] text-[var(--color-text-muted)]">&ldquo;{item.quote}&rdquo;</p>
        </div>

        <div className="p-5 md:flex md:items-center">
          <p className="text-[0.82rem] leading-[1.5] text-[var(--color-text)]">
            <span className="font-semibold text-[var(--color-primary)]">Who it&apos;s for: </span>
            {item.whoItsFor}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BestWorstEngines({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const items = data.items || [];
  const mainItems = items.filter((item) => !item.fullWidth);
  const wideItems = items.filter((item) => item.fullWidth);

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <span className="text-[0.75rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          04 — Best &amp; Worst Engines
        </span>
        <h2 className="mt-2 text-[2.55rem] font-bold leading-[1.05] tracking-normal text-[var(--color-text)] md:text-[3.5rem]">
          Best &amp; Worst Engines
        </h2>
        <div className="mt-3">
          <MStripe />
        </div>

        <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {mainItems.map((item) => (
            <Card key={item.slot} item={item} isDark={isDark} />
          ))}
        </div>

        {wideItems.length > 0 ? (
          <div className="mt-4 flex flex-col gap-4">
            {wideItems.map((item) => (
              <OverlookedCard key={item.slot} item={item} isDark={isDark} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
