"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./WhoShouldBuy.module.css";
import WhoShouldBuyLegacy from "./WhoShouldBuyLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// a space before each break keeps words apart where the break is hidden
const spaced = (html = "") => String(html).replace(/([^-])\s*<br\s*\/?>\s*/g, "$1 <br>");

// rosette edge: a circle with twelve soft scallops
const ROSETTE = Array.from({ length: 97 }, (_, i) => {
  const a = (i / 96) * Math.PI * 2;
  const r = 6.5 + 0.55 * Math.cos(a * 12);
  return `${i ? "L" : "M"}${(12 + r * Math.sin(a)).toFixed(2)} ${(9 - r * Math.cos(a)).toFixed(2)}`;
}).join("") + "z";

const ICONS = {
  group: (
    <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7.4" r="3.5" />
      <path d="M6.4 20.6v-2.3a5.6 5.6 0 0 1 11.2 0v2.3z" />
      <path d="M8.6 5.9a2.8 2.8 0 1 0-.9 5.1M15.4 5.9a2.8 2.8 0 1 1 .9 5.1" />
      <path d="M6.6 12.9a4.4 4.4 0 0 0-5.8 4.2v1.6h4.4M17.4 12.9a4.4 4.4 0 0 1 5.8 4.2v1.6h-4.4" />
    </g>
  ),
  shieldCheck: (
    <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.4l8.4 3.1v6.3c0 5.1-3.5 8.8-8.4 10.7-4.9-1.9-8.4-5.6-8.4-10.7V5.5z" />
      <path d="M8.6 12.2l2.4 2.4 4.5-4.7" />
    </g>
  ),
  award: (
    <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d={ROSETTE} />
      <circle cx="12" cy="9" r="3.6" />
      <path d="M8.3 14.9L6 21.1l2.9-.8 1.7 2.3 1.4-4.6M15.7 14.9l2.3 6.2-2.9-.8-1.7 2.3-1.4-4.6" />
    </g>
  ),
  wheel: (
    <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="11.2" />
      <path d="M3.4 9.6c5.6-2 11.6-2 17.2 0" />
      <circle cx="12" cy="11.6" r="1.6" />
      <path d="M12 13.2v2.6M3.9 13.3c3 .2 5.5 1.9 6.2 4.6l.4 3.6c-3.4-.8-6-3.9-6.6-8.2zM20.1 13.3c-3 .2-5.5 1.9-6.2 4.6l-.4 3.6c3.4-.8 6-3.9 6.6-8.2z" />
    </g>
  ),
  family: (
    <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.7" cy="7.6" r="3" />
      <circle cx="16.3" cy="7.6" r="3" />
      <path d="M2.4 19.6v-2a5.3 5.3 0 0 1 10.6 0v2M11 19.6v-2a5.3 5.3 0 0 1 10.6 0v2" />
    </g>
  ),
  briefcase: (
    <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.8" y="7.2" width="18.4" height="13" rx="1.4" />
      <path d="M8.7 7.2V5.3c0-.7.5-1.2 1.2-1.2h4.2c.7 0 1.2.5 1.2 1.2v1.9M2.8 12.6h7.4M13.8 12.6h7.4" />
      <circle cx="12" cy="12.6" r="1.6" />
    </g>
  ),
  piggy: (
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11.6" cy="4.4" r="2" />
      <path d="M5.6 11.6c.8-2.7 3.5-4.4 7-4.4 2.2 0 4.1.6 5.5 1.7l1.6-1.6.4 2.8c.8.7 1.3 1.5 1.6 2.3h1.5v3.5h-1.6c-.6 1.2-1.6 2.2-2.8 2.9v2.6h-2.7v-1.8c-.6.1-1.2.1-1.9.1-.6 0-1.3 0-1.9-.1v1.8H8.1v-2.7c-1.6-1-2.6-2.6-2.6-4.6z" />
      <path d="M5.6 11.7c-1.3 0-2.4-1-2.4-2.3" />
      <circle cx="17.6" cy="11.4" r=".45" fill="currentColor" stroke="none" />
    </g>
  ),
  gauge: (
    <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.3 19.1A9.4 9.4 0 1 1 19.7 19.1" />
      <path d="M12 4.9v1.7M6.2 7.4l1.2 1.2M17.8 7.4l-1.2 1.2M3.3 13.4H5M20.7 13.4H19M5.5 17.9l1.2-.9M18.5 17.9l-1.2-.9" />
      <path d="M12 14.2l3.1-4" strokeWidth="1.5" />
      <circle cx="12" cy="14.3" r="1.35" fill="currentColor" stroke="none" />
    </g>
  ),
  shield: (
    <path
      d="M12 3l7.6 2.8v5.9c0 4.8-3.2 8.4-7.6 10.1-4.4-1.7-7.6-5.3-7.6-10.1V5.8z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinejoin="round"
    />
  ),
  info: (
    <g>
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <circle cx="12.3" cy="7" r="1.45" fill="#fff" />
      <path d="M10.3 10.4h2.5v6.6M10.2 17.2h4.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  arrow: <path d="M3.5 12h16m-6.2-6.2 6.2 6.2-6.2 6.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
};

const STAR = "M12 1.6l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.7l-6.4 3.5L7 14.1l-5.3-5 7.2-.9z";

// per-icon nudges (24-unit grid) so each glyph sits where the reference draws it
const FIT = {
  group: "translate(0 2)",
  shieldCheck: "translate(12 13.5) scale(1 1.05) translate(-12 -12)",
  award: "translate(12 12.7) scale(1.16 1.07) translate(-12 -12)",
  wheel: "translate(12 12.75) scale(0.958) translate(-12 -12)",
  family: "translate(12 12.5) scale(1 0.94) translate(-12 -12)",
  briefcase: "translate(10.5 12) scale(0.925 0.97) translate(-12 -12)",
  piggy: "translate(9.5 11.9) scale(0.94) translate(-12 -12)",
  gauge: "translate(10.7 11.2) scale(1 1.03) translate(-12 -12)",
  shield: "translate(11.1 11.3) scale(0.94) translate(-12 -12)",
};

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <g transform={FIT[name]}>{ICONS[name]}</g>
    </svg>
  );
}

function Title({ lines, className }) {
  return (
    <h2 className={className}>
      {lines.map((line, index) => (
        <span key={line}>
          {index ? <br /> : null}
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </span>
      ))}
    </h2>
  );
}

function Stars({ count, className }) {
  return (
    <span className={className} role="img" aria-label={`${count} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} aria-hidden="true" viewBox="0 0 24 24" className={index < count ? s.starOn : s.starOff}>
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

function DesktopTable({ data, isDark }) {
  const columns = data.columns || [];
  return (
    <div className={s.table} role="table">
      <div className={s.thead} role="row">
        {columns.map((column) => (
          <span key={column} role="columnheader">
            {column}
          </span>
        ))}
      </div>
      {(data.profiles || []).map((row) => (
        <div key={row.key} className={s.tr} role="row">
          <span className={s.cProfile} role="rowheader">
            <span className={s.car}>
              <Image src={isDark ? row.images.dark : row.images.light} alt="" fill className={s.img} sizes="(min-width: 1024px) 17vw, 1px" />
            </span>
            <span className={s.badge}>
              <Icon name={row.icon} className={s.badgeIcon} />
            </span>
            <strong className={s.name}>{row.buyerProfile}</strong>
          </span>
          <span className={s.cRating} role="cell">
            <Stars count={row.stars} className={s.stars} />
          </span>
          <span className={s.cVerdict} role="cell" dangerouslySetInnerHTML={{ __html: spaced(row.verdict) }} />
        </div>
      ))}
    </div>
  );
}

function PhoneCards({ data }) {
  return (
    <div className={s.cards}>
      {(data.profiles || []).map((row) => (
        <article key={row.key} className={s.card}>
          <span className={s.cardCar}>
            <Image src={row.images.phone || row.images.light} alt="" fill className={s.img} sizes="(max-width: 1023px) 30vw, 1px" />
          </span>
          <span className={s.badge}>
            <Icon name={row.icon} className={s.badgeIcon} />
          </span>
          <span className={s.cardHead}>
            <strong className={s.name}>{row.buyerProfile}</strong>
            <Stars count={row.stars} className={s.stars} />
          </span>
          <p className={s.cardText} dangerouslySetInnerHTML={{ __html: spaced(row.verdictMobile || row.verdict) }} />
        </article>
      ))}
    </div>
  );
}

// Model JSONs migrated to the reference design carry `proof`; the rest keep the previous layout.
export default function WhoShouldBuy({ data }) {
  if (!data) return null;
  return data.proof ? <WhoShouldBuyReference data={data} /> : <WhoShouldBuyLegacy data={data} />;
}

function WhoShouldBuyReference({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const note = data.note || {};
  const cta = data.cta || {};

  return (
    <section id="who-should-buy" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.panel}>
          <div className={s.top}>
            <div className={s.head}>
              <Title lines={data.titleLines || [data.h2]} className={`${s.title} ${s.deskOnly}`} />
              <Title lines={data.titleLinesMobile || data.titleLines || [data.h2]} className={`${s.title} ${s.phoneOnly}`} />
              <p className={`${s.copy} ${s.deskOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadline) }} />
              <p className={`${s.copy} ${s.phoneOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadlineMobile || data.subHeadline) }} />
            </div>
            <ul className={s.proof}>
              {(data.proof || []).map((item) => (
                <li key={item.title} className={s.proofItem}>
                  <Icon name={item.icon} className={s.proofIcon} />
                  <strong>{item.title}</strong>
                  <span dangerouslySetInnerHTML={{ __html: spaced(item.text) }} />
                </li>
              ))}
            </ul>
          </div>

          <div className={s.deskOnly}>
            <DesktopTable data={data} isDark={isDark} />
          </div>
          <div className={s.phoneOnly}>
            <PhoneCards data={data} />
          </div>

          <div className={s.note}>
            <Icon name="info" className={s.noteIcon} />
            <p className={s.noteText}>
              <strong>{note.title}</strong>{" "}
              <span className={s.deskInline} dangerouslySetInnerHTML={{ __html: spaced(note.text) }} />
              <span className={s.phoneInline} dangerouslySetInnerHTML={{ __html: spaced(note.textMobile || note.text) }} />
            </p>
            {cta.label ? (
              <Link href={cta.href || "#"} className={s.cta}>
                <span>{cta.label}</span>
                <Icon name="arrow" className={s.ctaArrow} />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
