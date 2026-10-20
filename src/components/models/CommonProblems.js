"use client";

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
    <div className={s.photo}>
      {problem.image ? <Image src={problem.image} alt="" fill className={s.photoImg} sizes="(min-width: 1024px) 13vw, 24vw" /> : null}
      <span className={s.num}>{problem.number || String(problem.id).padStart(2, "0")}</span>
    </div>
  );
}

function DesktopCard({ problem }) {
  return (
    <article className={s.card}>
      <Photo problem={problem} />
      <div className={s.body}>
        <h3 className={s.cardTitle} dangerouslySetInnerHTML={{ __html: problem.titleDesktop || problem.issue }} />
        <Severity severity={problem.severity} className={s.cardSeverity} />
        <p className={s.desc} dangerouslySetInnerHTML={{ __html: spaced(problem.descriptionDesktop || problem.description) }} />
        {problem.cost ? (
          <div className={s.cost}>
            <span className={s.costIcon} aria-hidden="true">
              £
            </span>
            <p className={s.costText}>
              <strong>{problem.cost.value}</strong>
              <span>{problem.cost.tag}</span>
            </p>
          </div>
        ) : null}
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
        <h3 className={s.pTitle}>{problem.issue}</h3>
        <p className={s.pDesc} dangerouslySetInnerHTML={{ __html: spaced(problem.descriptionMobile || problem.description) }} />
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
