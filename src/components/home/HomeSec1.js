"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import BrandIcon from "@/components/home/brandIcon";

// Hero. Desktop: copy left, the reference car scene (front-facing F30 LCI under the arch) right. Phone/tablet (reference
// layout, both themes): H1, description, car, four glass badges in one row, CTA box, trust line.

const BLUE = "#0b4fb8";
const BLUE_DARK_THEME = "#2f72e0";
const CTA_BLUE = "#0b47a8";

function Arrow({ className = "h-6 w-6" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

// M stripe: slanted bars (blue, dark blue, red, then pale blues) and an optional fading rule.
function Stripe({ bars = ["#1c69d4", "#0b3d91", "#e4262c", "#9fb6d8", "#9fb6d8"], line = true, isDark }) {
  return (
    <div className="flex items-center gap-[3px]" aria-hidden="true">
      {bars.map((color, i) => (
        <span key={i} className="h-[8px] w-[13px] -skew-x-[30deg]" style={{ backgroundColor: color }} />
      ))}
      {line ? (
        <span
          className="ml-1 h-[2px] w-[160px] lg:w-[220px]"
          style={{ background: `linear-gradient(90deg, ${isDark ? "#2a5aa8" : "#9fb6d8"} 0%, transparent 100%)` }}
        />
      ) : null}
    </div>
  );
}

function Title({ html, className = "", as: Tag = "h1" }) {
  return <Tag className={`t-h1 [&_.heading-accent]:text-[var(--hero-accent)] ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

// Short divider between badge items: half height, centred, away from the top and bottom edges.
const shortDivider = "relative [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:top-1/2 [&:not(:last-child)]:after:h-[46%] [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:-translate-y-1/2";

/* ---------- Desktop (lg and up) ---------- */

function DesktopHero({ data, isDark }) {
  const text = isDark ? "text-white" : "text-[#071423]";
  const muted = isDark ? "text-white/85" : "text-[#26364a]";

  return (
    <div className="relative hidden [container-type:inline-size] lg:block">
      {/* Arch + skyline across the whole hero (washed out behind the copy, as in the reference). */}
      <Image
        src={isDark ? data.image.backdrop.dark : data.image.backdrop.light}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(90deg, #020407 0%, rgba(2,4,7,0.92) 30%, rgba(2,4,7,0.45) 52%, rgba(2,4,7,0) 70%)"
            : "linear-gradient(90deg, #f9f9fa 0%, rgba(249,249,250,0.92) 30%, rgba(249,249,250,0.45) 52%, rgba(249,249,250,0) 70%)",
        }}
      />

      {/* Car (reference crop). Its left edge sits ~100px right of the copy column (copy is 600px
          wide from the container edge); its right edge ~40px inside the page, so the spacing
          between copy and car stays the same at every desktop width. The crop's own background
          fades into the arch backdrop on all four sides. */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          "--cl": "max(32px, calc((100cqw - 1408px) / 2 + 32px))",
          "--car-r": "min(calc(100cqw - 40px), calc(100cqw - var(--cl) + 56px))",
          "--cw": "clamp(460px, calc(var(--car-r) - var(--cl) - 700px), 720px)",
          left: "calc(var(--car-r) - var(--cw) - var(--cw) * 0.1543)",
          width: "calc(var(--cw) * 1.213)",
          height: "calc(var(--cw) * 1.4136)",
          top: "calc(50% - var(--cw) * 0.6517)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 12%, #000 95%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 12%, #000 95%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          maskComposite: "intersect",
        }}
      >
        <Image
          src={isDark ? data.image.scene.dark : data.image.scene.light}
          alt={data.image.alt}
          fill
          priority
          sizes="(min-width: 1280px) 880px, 560px"
          className="object-cover"
        />
      </div>

      <div className="site-container relative py-14 xl:py-16">
        <div className="flex max-w-[560px] flex-col xl:max-w-[600px]">
          <Title html={data.h1} className={text} />
          <div className="mt-6">
            <Stripe isDark={isDark} />
          </div>
          <p className={`t-p mt-5 max-w-[540px] ${muted}`}>{data.subHeadline}</p>

          <ul className={`mt-7 grid w-full max-w-[560px] grid-cols-4 xl:max-w-[600px] rounded-[12px] py-3.5 ${isDark ? "glass-dark" : "glass-light"}`}>
            {data.trustStrip.map((item) => {
              const isNumber = /\d/.test(item.value);
              return (
                <li
                  key={item.label}
                  className={`${shortDivider} flex flex-col items-center px-2 text-center ${isDark ? "after:bg-white/20" : "after:bg-[#0b1626]/15"}`}
                >
                  <span style={{ color: isDark ? BLUE_DARK_THEME : BLUE }}>
                    <BrandIcon name={item.icon} className="h-7 w-7" scale={1} />
                  </span>
                  <span className={`mt-1.5 leading-tight ${text} ${isNumber ? "t-num" : "text-[16px] font-semibold"}`}>{item.value}</span>
                  <span className={`t-label mt-0.5 ${muted}`}>{item.label}</span>
                </li>
              );
            })}
          </ul>

          <Link
            href={data.cta.href}
            className="mt-7 inline-flex w-fit items-center gap-4 rounded-[4px] px-7 py-3.5 text-[16px] font-semibold tracking-[0.02em] text-white transition hover:brightness-110"
            style={{ backgroundColor: CTA_BLUE }}
          >
            {data.cta.label}
            <Arrow className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ---------- Phone / tablet (below lg), same layout in both themes ---------- */

function MobileHero({ data, isDark }) {
  const text = isDark ? "text-white" : "text-[#071423]";
  const muted = isDark ? "text-white/85" : "text-[#26364a]";
  const accent = isDark ? BLUE_DARK_THEME : BLUE;

  return (
    <div className="relative overflow-hidden lg:hidden">
      <div className="relative mx-auto max-w-[640px] px-4 pb-5 pt-6">
        <Stripe bars={["#1c69d4", "#0b3d91", "#e4262c", isDark ? "#7f93b0" : "#9fb6d8", isDark ? "#7f93b0" : "#9fb6d8"]} line={false} isDark={isDark} />
        <Title as="p" html={data.h1} className={`mt-4 ${text}`} />
        <span className="mt-4 block h-[2px] w-[52px]" style={{ backgroundColor: accent }} />
        <p className={`t-p mt-4 ${muted}`}>{data.subHeadline}</p>

        {/* Same car scene as desktop, edge to edge, fading into the page above and below. */}
        <div
          aria-hidden="true"
          className="relative -mx-4 mt-1 aspect-[786/470] [mask-composite:intersect] [mask-image:linear-gradient(180deg,transparent_0%,black_14%,black_80%,transparent_100%)]"
          style={{
            backgroundImage: `url(${isDark ? data.image.scene.dark : data.image.scene.light})`,
            backgroundSize: "cover",
            backgroundPosition: "50% 52%",
          }}
        />

        <ul className={`relative -mt-8 grid grid-cols-4 rounded-[14px] px-1 py-3 ${isDark ? "glass-dark" : "glass-light"}`}>
          {data.trustStrip.map((item) => (
            <li
              key={item.label}
              className={`${shortDivider} flex flex-col items-center px-1 text-center ${isDark ? "after:bg-white/20" : "after:bg-[#0b1626]/15"}`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${isDark ? "bg-white/[0.08]" : "bg-[#0b4fb8]/[0.08]"}`}
                style={{ color: accent }}
              >
                <BrandIcon name={item.icon} className="h-5 w-5" scale={1} />
              </span>
              <span className={`mt-1 text-[15px] font-bold uppercase leading-tight ${text}`}>{item.value}</span>
              <span className={`mt-0.5 text-[13px] uppercase leading-[1.25] ${muted}`}>{item.label}</span>
            </li>
          ))}
        </ul>

        <Link
          href={data.cta.href}
          className="mt-3 flex items-center gap-3 rounded-[12px] border border-[#2a6ae0] p-2.5 font-normal text-white"
          style={{ background: "linear-gradient(90deg, #0a1f4d 0%, #0b2f7a 55%, #0a2a6b 100%)" }}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/25">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10">
              <path d="M12 2.5 4.5 5.5v6c0 5 3.3 9 7.5 10 4.2-1 7.5-5 7.5-10v-6L12 2.5Z" fill="#1c4fb0" stroke="#d6dde8" strokeWidth="1.2" />
              <path d="m8.5 12 2.4 2.4L15.8 9.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold tracking-[0.08em]">{data.cta.label}</span>
            <span className="mt-0.5 block text-[13px] leading-[1.35] tracking-[0.02em] text-white/85">{data.cta.tagline}</span>
          </span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40">
            <Arrow className="h-5 w-5" />
          </span>
        </Link>

        <div className={`mt-3 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[13px] ${isDark ? "text-white/70" : "text-[#3b4656]"}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1Zm2 0h6V7a3 3 0 0 0-6 0v3Z" />
          </svg>
          {data.trustBadges.map((badge, i) => (
            <span key={badge} className="flex items-center gap-1.5">
              {i > 0 ? <span className={`h-1 w-1 rounded-full ${isDark ? "bg-white/50" : "bg-[#3b4656]/50"}`} /> : null}
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeSec1({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`relative overflow-hidden ${isDark ? "bg-[#020407]" : "bg-[#f9f9fa]"}`}
      style={{ "--hero-accent": isDark ? BLUE_DARK_THEME : BLUE }}
    >
      <DesktopHero data={data} isDark={isDark} />
      <MobileHero data={data} isDark={isDark} />
    </section>
  );
}
