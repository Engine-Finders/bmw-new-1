"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import BrandIcon from "@/components/home/brandIcon";

// Hero, four reference layouts: desktop light / dark (copy left, car right on the scene) and
// phone light (scene on top, copy below) / dark (copy over the dark scene, car between copy and stats).

const BLUE = "#0b4fb8";
const BLUE_DARK_THEME = "#1a5fd0";
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
        <span key={i} className="h-[9px] w-[14px] -skew-x-[30deg] md:h-[10px] md:w-[16px]" style={{ backgroundColor: color }} />
      ))}
      {line ? (
        <span
          className="ml-1 h-[2px] w-[180px] md:w-[240px]"
          style={{
            background: `linear-gradient(90deg, ${isDark ? "#2a5aa8" : "#9fb6d8"} 0%, transparent 100%)`,
          }}
        />
      ) : null}
    </div>
  );
}

function Title({ html, className }) {
  return (
    <h1
      className={`font-bold tracking-[-0.02em] [&_.heading-accent]:text-[var(--hero-accent)] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ---------- Desktop / tablet (md and up) ---------- */

function DesktopHero({ data, isDark }) {
  const text = isDark ? "text-white" : "text-[#071423]";
  const muted = isDark ? "text-white/82" : "text-[#26364a]";

  return (
    <div className="relative hidden min-h-[640px] md:block lg:min-h-[calc(100vh-88px)] lg:max-h-[920px]">
      <Image
        src={isDark ? data.image.desktop.dark : data.image.desktop.light}
        alt={data.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[78%_center] lg:object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(90deg, rgba(3,6,10,0.92) 0%, rgba(3,6,10,0.7) 38%, transparent 62%)"
            : "linear-gradient(90deg, rgba(248,250,252,0.95) 0%, rgba(248,250,252,0.75) 38%, transparent 62%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-8xl flex-col justify-center px-8 py-14 lg:min-h-[calc(100vh-88px)] lg:max-h-[920px] lg:px-[5.5%]">
        <div className="flex max-w-[660px] flex-col">
          <Title html={data.h1} className={`${text} text-[3.6rem] leading-[1.08] lg:text-[4.6rem]`} />

          <div className="mt-7">
            <Stripe isDark={isDark} />
          </div>

          <p className={`mt-7 max-w-[575px] text-[1.2rem] leading-[1.38] lg:text-[1.55rem] ${muted}`}>{data.subHeadline}</p>

          <ul
            className={`mt-8 grid max-w-[655px] grid-cols-4 rounded-[6px] border py-4 ${
              isDark
                ? "border-white/10 bg-[rgba(14,20,28,0.72)]"
                : "border-[#e3e8ef] bg-white/90 shadow-[0_10px_30px_rgba(10,26,43,0.08)]"
            }`}
          >
            {data.trustStrip.map((item) => {
              const isNumber = /\d/.test(item.value);
              return (
                <li
                  key={item.label}
                  className={`flex flex-col items-center px-2 text-center [&:not(:last-child)]:border-r ${
                    isDark ? "border-white/12" : "border-[#e3e8ef]"
                  }`}
                >
                  <span style={{ color: isDark ? BLUE_DARK_THEME : BLUE }}>
                    <BrandIcon name={item.icon} className="h-11 w-11" scale={1} />
                  </span>
                  <span className={`mt-2.5 leading-tight ${text} ${isNumber ? "text-[1.5rem] font-bold" : "text-[1.12rem] font-medium"}`}>
                    {item.value}
                  </span>
                  <span className={`mt-0.5 text-[1.05rem] leading-[1.4] ${muted}`}>{item.label}</span>
                </li>
              );
            })}
          </ul>

          <Link
            href={data.cta.href}
            className="mt-9 inline-flex w-fit items-center gap-7 rounded-[3px] px-9 py-[1.15rem] text-[1.2rem] font-bold text-white transition hover:brightness-110"
            style={{ backgroundColor: CTA_BLUE }}
          >
            {data.cta.label}
            <Arrow className="h-9 w-9" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Phone, dark ---------- */

function MobileDarkHero({ data }) {
  return (
    <div className="relative overflow-hidden bg-[#05080c] text-white md:hidden">
      <div className="relative px-6 pt-10">
        <Stripe bars={["#1c69d4", "#0b3d91", "#e4262c", "#7f93b0", "#7f93b0"]} line={false} isDark />
        <Title html={data.h1} className="mt-6 text-[2.15rem] leading-[1.12] min-[400px]:text-[2.4rem]" />
        <span className="mt-6 block h-[2px] w-[52px]" style={{ backgroundColor: BLUE_DARK_THEME }} />
        <p className="mt-6 max-w-[340px] text-[0.98rem] leading-[1.5] text-white/88">{data.subHeadline}</p>
      </div>

      {/* Scene with the car: starts behind the copy, fades into the page at both ends. */}
      <div className="relative -mt-[38%] aspect-[3/4] w-full">
        <Image
          src={data.image.mobile.dark}
          alt={data.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover [mask-image:linear-gradient(180deg,transparent_0%,black_38%,black_82%,transparent_100%)]"
        />
      </div>

      <div className="relative -mt-[16%] px-4 pb-6">
        <ul className="grid grid-cols-4 rounded-[14px] border border-white/12 bg-[rgba(12,18,26,0.82)] px-1 py-5 backdrop-blur">
          {data.trustStrip.map((item) => (
            <li key={item.label} className="flex flex-col items-center px-1 text-center [&:not(:last-child)]:border-r [&:not(:last-child)]:border-white/12">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]" style={{ color: BLUE_DARK_THEME }}>
                <BrandIcon name={item.icon} className="h-[26px] w-[26px]" scale={1} />
              </span>
              <span className="mt-3 text-[0.98rem] font-bold uppercase leading-tight">{item.value}</span>
              <span className="mt-1.5 text-[0.75rem] uppercase leading-[1.4] text-white/80">{item.label}</span>
            </li>
          ))}
        </ul>

        <Link
          href={data.cta.href}
          className="mt-4 flex items-center gap-3 rounded-[12px] border border-[#2a6ae0] p-3 text-white"
          style={{ background: "linear-gradient(90deg, #0a1f4d 0%, #0b2f7a 55%, #0a2a6b 100%)" }}
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/25">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-12 w-12">
              <path d="M12 2.5 4.5 5.5v6c0 5 3.3 9 7.5 10 4.2-1 7.5-5 7.5-10v-6L12 2.5Z" fill="#1c4fb0" stroke="#d6dde8" strokeWidth="1.2" />
              <path d="m8.5 12 2.4 2.4L15.8 9.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.95rem] font-bold tracking-[0.16em]">{data.cta.label}</span>
            <span className="mt-1 block text-[0.72rem] leading-[1.35] text-white/85">{data.cta.tagline}</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/40">
            <Arrow className="h-5 w-5" />
          </span>
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[0.72rem] text-white/70">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1Zm2 0h6V7a3 3 0 0 0-6 0v3Z" />
          </svg>
          {data.trustBadges.map((badge, i) => (
            <span key={badge} className="flex items-center gap-2">
              {i > 0 ? <span className="h-1 w-1 rounded-full bg-white/50" /> : null}
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Phone, light ---------- */

function MobileLightHero({ data }) {
  return (
    <div className="bg-white text-[#141a22] md:hidden">
      <div className="relative aspect-[976/813] w-full">
        <Image
          src={data.image.mobile.light}
          alt={data.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover [mask-image:linear-gradient(180deg,black_80%,transparent_100%)]"
        />
      </div>

      <div className="px-6 pb-8">
        <Title html={data.h1} className="mt-2 text-[2.15rem] leading-[1.12] min-[400px]:text-[2.4rem]" />
        <div className="mt-5">
          <Stripe bars={["#1c69d4", "#0b3d91", "#e4262c", "#c9d6ea", "#c9d6ea"]} />
        </div>
        <p className="mt-5 max-w-[310px] text-[0.94rem] leading-[1.55] text-[#1f2a37]">{data.subHeadline}</p>

        <ul className="mt-5 rounded-[8px] border border-[#e1e5eb] px-4 py-1">
          {data.trustStrip.map((item, i) => {
            const isNumber = /\d/.test(item.value);
            const isLast = i === data.trustStrip.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-4">
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[3px] text-white" style={{ backgroundColor: "#0a55d6" }}>
                  <BrandIcon name={item.icon} className="h-4 w-4" scale={1} />
                </span>
                <span className={`flex-1 py-2.5 text-[0.9rem] ${isLast ? "" : "border-b border-[#e1e5eb]"}`}>
                  {isNumber ? <strong className="font-bold">{item.value}</strong> : item.value} {item.label}
                </span>
              </li>
            );
          })}
        </ul>

        <Link
          href={data.cta.href}
          className="mt-5 flex items-center justify-center gap-5 rounded-[6px] py-4 text-[1.1rem] font-bold text-white"
          style={{ backgroundColor: "#0a55d6" }}
        >
          {data.cta.label}
          <Arrow className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}

export default function HomeSec1({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`relative overflow-hidden ${isDark ? "bg-[#05080c]" : "bg-white"}`}
      style={{ "--hero-accent": isDark ? BLUE_DARK_THEME : BLUE }}
    >
      <DesktopHero data={data} isDark={isDark} />
      {isDark ? <MobileDarkHero data={data} /> : <MobileLightHero data={data} />}
    </section>
  );
}
