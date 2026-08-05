"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import GenIcon from "./GenIcons";

function splitTagPill(tagPill = "") {
  const parts = tagPill.split(" • ");
  return { model: parts[0] || "", body: parts[1] || "", years: parts[2] || "" };
}

// Split a trust-strip label into a leading bold value (a number/short token)
// and the remaining text, plus any trailing [TAG] marker rendered as a badge.
function splitStat(label = "") {
  const tagMatch = label.match(/\s*\[([^\]]+)\]\s*$/);
  const tag = tagMatch ? tagMatch[1] : "";
  const text = tagMatch ? label.slice(0, tagMatch.index) : label;

  const [first, ...rest] = text.split(" ");
  const hasValue = /[0-9]/.test(first);

  return {
    value: hasValue ? first : "",
    label: hasValue ? rest.join(" ") : text,
    tag,
  };
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const pill = splitTagPill(data.tagPill);
  const imageSrc = isDark ? data.image?.dark : data.image?.light || data.image?.dark;

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] text-[var(--color-text)] md:min-h-[620px]">
      {/* Desktop: full-bleed image with left-to-right + bottom fade so the image blends into the page color */}
      <div className="absolute inset-0 hidden md:block">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={data.image?.alt || ""}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-hero-fade)_0%,var(--color-hero-overlay)_35%,transparent_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-page)_0%,transparent_28%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-8xl flex-col px-4 pb-5 pt-8 md:min-h-[620px] md:justify-center md:px-0 md:py-8">
        <div className="relative flex w-full max-w-[720px] flex-col gap-3 md:-ml-6 md:mt-0 md:gap-4">
          {/* Tag pill */}
          <span
            className={`inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-2 rounded-md border px-3 py-2 text-[0.82rem] leading-[1.35] md:px-4 md:py-2 md:text-[0.88rem] ${
              isDark
                ? "border-white/30 bg-[rgba(2,7,17,0.5)] text-white"
                : "border-[rgba(11,103,220,0.48)] bg-[rgba(255,255,255,0.58)] text-[var(--color-text-muted)]"
            }`}
          >
            <GenIcon name="car" className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            <strong className="font-semibold text-[var(--color-primary)]">{pill.model}</strong>
            <span>{pill.body}</span>
            <span>{pill.years}</span>
          </span>

          {/* Headline */}
          <h1
            className={`text-[32px] font-bold leading-[0.95] tracking-normal md:max-w-[720px] md:text-[3.5rem] md:leading-[0.94] ${
              isDark ? "text-white" : "text-[var(--color-text)]"
            }`}
          >
            {data.h1}
          </h1>

          {/* MStripe decorative accent — matches home hero (blue / blue / red / grey slashes + trailing line) */}
          <MStripe />

          {/* subHeadline — text sits over a solid section background, NOT over the car image */}
          <p
            className={`max-w-[620px] text-[0.95rem] leading-[1.45] md:text-[1.08rem] md:leading-[1.42] ${
              isDark ? "text-white/88" : "text-[var(--color-text-muted)]"
            }`}
            dangerouslySetInnerHTML={{ __html: data.subHeadline }}
          />

          {/* Mobile: FULL-BLEED car image card — escapes the content column via 100vw + translateX trick */}
          {imageSrc ? (
            <div
              className="relative mt-3 h-[240px] w-screen overflow-hidden md:hidden"
              style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
            >
              <Image
                src={imageSrc}
                alt={data.image?.alt || ""}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
              {/* Bottom-up dark fade so the image blends into the page color at its lower edge */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.35)_85%,var(--color-page)_100%)]" />
            </div>
          ) : null}

          {/* Mobile: full-width primary CTA — sits below the image card in normal flow */}
          {data.primaryCta ? (
            <Link
              href={data.primaryCta.href}
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-md bg-[var(--color-primary)] px-6 py-4 text-[1rem] font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] md:hidden"
            >
              {data.primaryCta.label.replace(/\s*→\s*$/, "")}
              <GenIcon name="arrow" className="h-5 w-5" />
            </Link>
          ) : null}

          {/* Trust strip — mobile + desktop */}
          {data.trustStrip?.length > 0 ? (
            <ul
              className={`mt-4 grid grid-cols-4 overflow-hidden rounded-md border backdrop-blur-xl md:mt-5 md:max-w-[700px] md:grid-cols-4 ${
                isDark
                  ? "border-white/10 bg-[rgba(11,17,24,0.44)] shadow-[0_14px_32px_rgba(0,0,0,0.3)]"
                  : "border-[var(--color-border)] bg-[rgba(255,255,255,0.4)] shadow-[0_14px_32px_rgba(10,26,43,0.12)]"
              }`}
            >
              {data.trustStrip.map((item) => {
                const stat = splitStat(item.label);
                return (
                  <li
                    key={item.label}
                    className={`flex flex-col items-center justify-start gap-2 border-r px-1.5 py-3.5 text-center last:border-r-0 md:flex-row md:items-start md:gap-2.5 md:border-b-0 md:border-r md:border-[var(--color-border)] md:px-3 md:py-2.5 md:text-left md:last:border-r-0 ${
                      isDark ? "border-white/10" : "border-[var(--color-border)]"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
                      <GenIcon name={item.icon} className="h-5 w-5" />
                    </span>
                    <span className={isDark ? "text-white" : "text-[var(--color-text-muted)]"}>
                      {stat.value ? (
                        <strong className="block text-[0.86rem] font-bold leading-none md:text-[1.15rem]">{stat.value}</strong>
                      ) : null}
                      <span className="mt-1 block text-[10px] leading-[1.3] md:text-[0.8rem]">{stat.label}</span>
                      {stat.tag ? (
                        <span className="mt-1 block text-[9px] font-semibold uppercase tracking-wide text-[var(--color-primary)] md:text-[0.68rem]">
                          {stat.tag}
                        </span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {/* Desktop-only CTA (pill button) */}
          {data.primaryCta ? (
            <Link
              href={data.primaryCta.href}
              className="hidden w-full items-center justify-between rounded-[1.25rem] border border-[rgba(41,115,219,0.75)] bg-[linear-gradient(180deg,rgba(14,79,184,0.98)_0%,rgba(8,59,143,0.98)_100%)] px-5 py-4 text-white shadow-lg shadow-black/30 md:flex md:w-fit md:justify-start md:gap-5 md:rounded md:border-0 md:bg-[var(--color-primary)] md:px-7 md:py-3.5 md:text-base md:shadow-lg md:shadow-[var(--color-shadow)]"
            >
              <span className="text-left">
                <span className="block text-lg font-bold tracking-[0.08em] md:text-[1.05rem] md:tracking-normal">
                  {data.primaryCta.label.replace(/\s*→\s*$/, "")}
                </span>
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[rgba(3,14,31,0.55)] md:h-auto md:w-auto md:rounded-none md:border-0 md:bg-transparent">
                <GenIcon name="arrow" className="h-7 w-7" />
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}