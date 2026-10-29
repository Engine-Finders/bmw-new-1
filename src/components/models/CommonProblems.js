"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./CommonProblems.module.css";
import CommonProblemsLegacy from "./CommonProblemsLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// a space before each break keeps words apart where phones drop the breaks
// (no space after a hyphen, so "high-<br>mileage" still reads "high-mileage")
const spaced = (html = "") => String(html).replace(/([^-])\s*<br\s*\/?>\s*/g, "$1 <br>");

// "Common BMW 3 Series Engine Problems" -> "Common BMW 3 Series" / "Engine Problems"
function splitTitle(title = "") {
  const str = String(title);
  const index = str.indexOf("Engine Problems");
  return index > 0 ? { main: str.slice(0, index).trim(), accent: str.slice(index) } : { main: str, accent: "" };
}

function Arrow({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

function Severity({ severity, className }) {
  return (
    <span className={`${s.severity} ${s[`sev_${severity?.type || "monitor"}`] || ""} ${className || ""}`}>
      <span className={s.dot} aria-hidden="true" />
      {severity?.label}
    </span>
  );
}

function LearnMore({ link, className }) {
  if (!link) return null;
  return (
    <Link href={link.href || "#"} className={`${s.learn} ${className || ""}`}>
      {String(link.label || "Learn more").replace(/\s*→\s*$/, "")}
      <Arrow className={s.learnArrow} />
    </Link>
  );
}

function Photo({ problem }) {
  return (
    <div className={`${s.photo} ${problem.partPhoto ? s.partPhoto : ""}`}>
      {problem.image ? (
        <Image src={problem.image} alt="" fill className={s.photoImg} sizes="(min-width: 1024px) 13vw, 24vw" />
      ) : (
        // No part photo for this problem: an engine glyph, so the slot never reads as a broken image.
        <svg aria-hidden="true" viewBox="0 0 24 24" className={s.photoEmpty}>
          <path d="M6 9h3V7h6v2h2l2 2v1.5h1.5v3H19V17h-3l-1.5 1.5H8.5L6 16H4.5v-2.5H3V11h1.5V9z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
      <span className={s.num}>{problem.number || String(problem.id).padStart(2, "0")}</span>
    </div>
  );
}

// Description: at most six lines with an ellipsis; "Read more" opens the rest when it is longer.
function ClampedText({ html, className }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const check = () => {
      if (!open) setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, html]);

  return (
    <>
      <p ref={ref} className={`${className} ${open ? "" : s.clamp6}`} dangerouslySetInnerHTML={{ __html: html }} />
      {overflows || open ? (
        <button type="button" className={s.readMore} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? "Read less" : "Read more"}
        </button>
      ) : null}
    </>
  );
}

function DesktopCard({ problem }) {
  return (
    <article className={s.card}>
      <Photo problem={problem} />
      <div className={s.body}>
        <h3 className={s.cardTitle} dangerouslySetInnerHTML={{ __html: problem.issue }} />
        <Severity severity={problem.severity} className={s.cardSeverity} />
        <ClampedText className={s.desc} html={problem.description} />
        <LearnMore link={problem.link} className={s.cardLearn} />
      </div>
    </article>
  );
}

function PhoneCard({ problem }) {
  return (
    <article className={s.pCard}>
      <Photo problem={problem} />
      <div className={s.pBody}>
        <p className={s.pTitle}>{problem.issue}</p>
        <ClampedText className={s.pDesc} html={problem.description} />
      </div>
      <div className={s.pSide}>
        <Severity severity={problem.severity} />
        <LearnMore link={problem.link} className={s.pLearn} />
      </div>
    </article>
  );
}

function UrgencyKey({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className={s.key}>
      <p className={s.keyTitle}>{title}</p>
      <ul className={s.keyList}>
        {items.map((item) => (
          <li key={item.label} className={`${s.keyItem} ${s[`sev_${item.type}`] || ""}`}>
            <span className={s.keyDot} aria-hidden="true" />
            <p className={s.keyText}>
              <strong>{item.label}</strong>
              <span dangerouslySetInnerHTML={{ __html: spaced(item.text) }} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Model JSONs migrated to the reference design carry `titleDesktop`; the rest keep the previous layout.
export default function CommonProblems({ data }) {
  if (!data) return null;
  const migrated = (data.problems || []).some((problem) => problem.titleDesktop);
  return migrated ? <CommonProblemsReference data={data} /> : <CommonProblemsLegacy data={data} />;
}

function CommonProblemsReference({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const problems = data.problems || [];

  return (
    <section id="common-problems" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.inner}>
          <h2 className={s.title}>
            <span>{title.main}</span> <span className={s.accent}>{title.accent}</span>
          </h2>
          <span className={s.bar} aria-hidden="true" />
          <p className={`${s.copy} ${s.deskOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadline) }} />
          <p className={`${s.copy} ${s.phoneOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadlineMobile || data.subHeadline) }} />

          <div className={`${s.grid} ${s.deskOnly}`}>
            {problems.map((problem) => (
              <DesktopCard key={problem.id} problem={problem} />
            ))}
          </div>

          <div className={`${s.pList} ${s.phoneOnly}`}>
            {problems.map((problem) => (
              <PhoneCard key={problem.id} problem={problem} />
            ))}
          </div>

          <UrgencyKey title={data.urgencyTitle || "URGENCY KEY"} items={data.urgencyKey} />
        </div>
      </div>
    </section>
  );
}
