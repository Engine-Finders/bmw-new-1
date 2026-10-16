"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import HomeIcon from "@/components/home/homeIcons";

function Chip({ item, isDark, strong = false }) {
  const className = `inline-flex items-center rounded-md border px-2 py-0.5 text-[0.74rem] leading-tight ${
    strong ? "font-bold" : "font-medium"
  } ${
    isDark
      ? "border-white/14 bg-white/[0.04] text-white/88"
      : "border-[#dfe5ed] bg-[var(--color-page-soft)] text-[var(--color-text)]"
  }`;
  if (!item.href) return <span className={className}>{item.name}</span>;
  return (
    <Link href={item.href} className={`${className} transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]`}>
      {item.name}
    </Link>
  );
}

function EraCard({ era, index, isDark }) {
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-xl border ${
        isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#e4e9f0] bg-white shadow-[0_8px_20px_rgba(10,26,43,0.06)]"
      }`}
    >
      <span
        className={`absolute left-0 top-0 z-10 flex h-[22px] min-w-[30px] items-center justify-center rounded-br-[8px] px-2 text-[0.72rem] font-bold leading-none ${
          isDark ? "bg-[var(--color-chrome)] text-[var(--color-page)]" : "bg-[var(--color-primary)] text-white"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative mx-3 mt-7 h-[88px] md:h-[96px]">
        {era.photo ? (
          <Image src={era.photo} alt={era.photoAlt || ""} fill className="object-contain object-center" sizes="(min-width: 1024px) 200px, 45vw" />
        ) : (
          <span className="flex h-full items-center justify-center">
            <HomeIcon name="timeline" isDark={isDark} className="h-14 w-14" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3.5 pt-2.5">
        <h3 className={`text-[1.15rem] font-bold leading-none ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>{era.era}</h3>
        <span aria-hidden="true" className="mt-2 h-[2px] w-8 bg-[var(--color-primary)]" />

        <p className={`mt-2.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>
          Key Engines
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {(era.engines || []).map((item) => (
            <Chip key={item.name} item={item} isDark={isDark} strong />
          ))}
        </div>

        <p className={`mt-2.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] ${isDark ? "text-white/55" : "text-[var(--color-text-soft)]"}`}>
          Iconic Models
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {(era.models || []).map((item) => (
            <Chip key={item.name} item={item} isDark={isDark} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function HomeSec11({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headerImage = (isDark && data.headerImageDark) || data.headerImage;
  const eras = data.eras || [];

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)]">
      <div className="relative overflow-hidden">
        {headerImage?.src ? (
          <div className="absolute inset-y-0 right-0 w-[58%] md:w-[46%]">
            <Image src={headerImage.src} alt={headerImage.alt || ""} fill className="object-cover object-right" sizes="(max-width: 768px) 58vw, 46vw" />
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
          <div className="max-w-[760px]">
            <p className={`text-[0.64rem] font-bold uppercase tracking-[0.14em] ${isDark ? "text-white/55" : "text-[var(--color-text-muted)]"}`}>
              Engine History
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
        <ol className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3 xl:grid-cols-6">
          {eras.map((era, index) => (
            <li key={era.era}>
              <EraCard era={era} index={index} isDark={isDark} />
            </li>
          ))}
        </ol>

        {data.keyTakeaway ? (
          <div
            className={`mt-3 flex items-start gap-3 rounded-xl border px-3.5 py-3 md:mt-4 md:items-center md:px-4 ${
              isDark ? "border-[var(--color-border)] bg-[var(--color-surface-raised)]" : "border-[#e4e9f0] bg-[var(--color-page-soft)]"
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center">
              <HomeIcon name="insight" isDark={isDark} className="h-10 w-10" />
            </span>
            <p className={`text-[0.84rem] leading-[1.45] md:text-[0.9rem] ${isDark ? "text-white/82" : "text-[var(--color-text-muted)]"}`}>
              <strong className={isDark ? "text-white" : "text-[var(--color-text)]"}>{data.keyTakeaway.label}</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: data.keyTakeaway.text }} />
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
