"use client";

import Link from "next/link";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./FAQAccordion.module.css";
import FAQAccordionLegacy from "./FAQAccordionLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// a space before each break keeps words apart where the break is hidden
const spaced = (html = "") => String(html).replace(/([^-])\s*<br\s*\/?>\s*/g, "$1 <br>");

function answerHtml(value = "") {
  return String(value ?? "")
    .replaceAll("✅", "")
    .replaceAll("❌", "")
    .replace(/\s+/g, " ")
    .trim();
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

function Chevron({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path d="M3.5 12h16m-6.2-6.2 6.2 6.2-6.2 6.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="1.6" />
        <path d="M8.3 7.5h1M11 7.5h4.7M8.3 10.5h1M11 10.5h4.7M8.3 13.5h1M11 13.5h4.7M8.3 16.5h1M11 16.5h4.7" />
      </g>
    </svg>
  );
}

function Item({ item }) {
  return (
    <details className={s.item}>
      <summary className={s.summary}>
        <span className={s.num}>{item.id}</span>
        <span className={`${s.question} ${s.deskInline}`}>{item.question}</span>
        <span className={`${s.question} ${s.phoneInline}`} dangerouslySetInnerHTML={{ __html: spaced(item.questionMobile || item.question) }} />
        <Chevron className={s.chevron} />
      </summary>
      <p className={s.answer} dangerouslySetInnerHTML={{ __html: answerHtml(item.answer) }} />
    </details>
  );
}

// Model JSONs migrated to the reference design carry `compare`; the rest keep the previous layout.
export default function FAQAccordion({ data }) {
  if (!data) return null;
  return data.compare ? <FAQReference data={data} /> : <FAQAccordionLegacy data={data} />;
}

function FAQReference({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const items = data.items || [];
  const half = Math.ceil(items.length / 2);
  const compare = data.compare || {};

  return (
    <section id="faq" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.panel}>
          <div className={s.card}>
            <Title lines={data.titleLines || [data.h2]} className={`${s.title} ${s.deskOnly}`} />
            <Title lines={data.titleLinesMobile || data.titleLines || [data.h2]} className={`${s.title} ${s.phoneOnly}`} />
            <div className={s.lists}>
              {[items.slice(0, half), items.slice(half)].map((col, index) => (
                <div key={index} className={s.col}>
                  {col.map((item) => (
                    <Item key={item.id} item={item} />
                  ))}
                </div>
              ))}
            </div>
            <div className={s.compare}>
              <span className={s.compareIcon}>
                <DocIcon className={s.docIcon} />
              </span>
              <p className={s.compareText}>
                <strong>{compare.title}</strong>
                <span className={s.deskInline}>{compare.text}</span>
                <span className={s.phoneInline} dangerouslySetInnerHTML={{ __html: compare.textMobile || compare.text }} />
              </p>
              <Link href={compare.href || "#"} className={s.cta} aria-label={compare.cta}>
                <span className={s.ctaLabel}>{compare.cta}</span>
                <Arrow className={s.ctaArrow} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
