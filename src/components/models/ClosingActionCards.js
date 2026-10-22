"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./ClosingActionCards.module.css";
import ClosingActionCardsLegacy from "./ClosingActionCardsLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// a space before each break keeps words apart where the break is hidden
const spaced = (html = "") => String(html).replace(/([^-])\s*<br\s*\/?>\s*/g, "$1 <br>");

const ICONS = {
  search: (
    <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
      <circle cx="10.2" cy="10.2" r="7.4" />
      <path d="m15.6 15.6 6 6" />
    </g>
  ),
  stethoscope: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.4 1.8H4.2a1 1 0 0 0-1 1v5.4a4.7 4.7 0 0 0 9.4 0V2.8a1 1 0 0 0-1-1h-1.2" />
      <path d="M7.9 12.9v2.5a5.2 5.2 0 0 0 10.4 0v-2" />
      <circle cx="18.3" cy="10.9" r="2.6" />
    </g>
  ),
  handshake: (
    <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8.6 4.6 5l2.6 1.4" />
      <path d="M23 8.6 19.4 5l-4.6 1.5-4.2 3.6a1.5 1.5 0 0 0 2.1 2.1l2.6-1.9 5.3 5" />
      <path d="M1 8.6 4.4 12l1.5-1.4M18.6 14.3l-5.9 5a1.5 1.5 0 0 1-2-.1l-5.5-5.1" />
      <path d="m7.9 16.5 1.7-1.7M10.1 18.6l1.7-1.7M19.6 12.3 23 8.9M7.2 6.4l3.1-.9" />
    </g>
  ),
  arrow: (
    <path d="M3 12h17.4m-6.6-6.8 6.8 6.8-6.8 6.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {ICONS[name]}
    </svg>
  );
}

function ActionCard({ card, isDark }) {
  const art = card.art || {};
  const artSrc = isDark ? art.dark || art.light : art.light;

  return (
    <Link href={card.href || "#"} className={`${s.card} ${s[card.tone] || ""} ${s[`art-${art.kind}`] || ""}`}>
      {artSrc ? (
        <span className={s.art} aria-hidden="true">
          <Image src={artSrc} alt="" fill className={s.artImg} sizes="(min-width: 1024px) 31vw, 90vw" />
        </span>
      ) : null}
      <span className={s.tile}>
        <Icon name={card.icon} className={s.tileIcon} />
      </span>
      <span className={s.body}>
        <h3 className={s.cardTitle}>
          {(card.titleLines || [card.title]).map((line, index) => (
            <span key={index} className={s.titleLine} dangerouslySetInnerHTML={{ __html: `${index ? " " : ""}${line}` }} />
          ))}
        </h3>
        <span className={s.cardBar} aria-hidden="true" />
        <p className={s.cardText} dangerouslySetInnerHTML={{ __html: spaced(card.text) }} />
        <span className={s.cardCta}>
          {card.cta}
          <Icon name="arrow" className={s.ctaArrow} />
        </span>
      </span>
    </Link>
  );
}

function ClosingActionCardsReference({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hero = data.heroImage || {};
  const heroSrc = isDark ? hero.dark || hero.light : hero.light;
  // Phones show the line-up once: when the header picture is the same line-up as the first card's, it is left to the card.
  const repeatsCardArt = (data.cards || []).some((card) => card.art && [card.art.light, card.art.dark].includes(heroSrc));

  return (
    <section id="ready-to-decide" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={`site-container ${s.frame}`}>
        <div className={s.panel}>
          <div className={s.head}>
            {heroSrc ? (
              <span className={`${s.hero} ${repeatsCardArt ? s.heroRepeat : ""}`} aria-hidden="true">
                <Image src={heroSrc} alt="" fill className={s.heroImg} sizes="(min-width: 1024px) 68vw, 80vw" />
              </span>
            ) : null}
            <h2 className={s.title}>
              {(data.titleLines || [data.h2]).map((line, index) => (
                <span key={index} className={s.titleLine} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </h2>
            <span className={s.bar} aria-hidden="true" />
            <p className={`${s.intro} ${s.deskOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.intro) }} />
            <p className={`${s.intro} ${s.phoneOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.introMobile || data.intro) }} />
          </div>

          <div className={s.cards}>
            {(data.cards || []).map((card) => (
              <ActionCard key={card.title} card={card} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ClosingActionCards({ data }) {
  if (!data) return null;
  return data.titleLines ? <ClosingActionCardsReference data={data} /> : <ClosingActionCardsLegacy data={data} />;
}
