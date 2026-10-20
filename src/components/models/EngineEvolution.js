"use client";

import { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./EngineEvolution.module.css";
import EngineEvolutionLegacy from "./EngineEvolutionLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// a space before each break keeps words apart where the break is hidden
const spaced = (html = "") => String(html).replace(/([^-])\s*<br\s*\/?>\s*/g, "$1 <br>");

const ICONS = {
  shield7: (
    <g>
      <path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 10-4.3-1.8-7.5-5.4-7.5-10V5.6z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9.6 8.8h4.8l-2.7 6.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  gear: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M10.3 2.8h3.4l.5 2.4 1.8.9 2.1-1.4 2.4 2.4-1.4 2.1.9 1.8 2.4.5v3.4l-2.4.5-.9 1.8 1.4 2.1-2.4 2.4-2.1-1.4-1.8.9-.5 2.4h-3.4l-.5-2.4-1.8-.9-2.1 1.4-2.4-2.4 1.4-2.1-.9-1.8-2.4-.5v-3.4l2.4-.5.9-1.8-1.4-2.1 2.4-2.4 2.1 1.4 1.8-.9z" />
      <circle cx="12" cy="12" r="3.6" />
    </g>
  ),
  chart: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="14" width="3.6" height="6.5" rx="0.8" />
      <rect x="10.2" y="11" width="3.6" height="9.5" rx="0.8" />
      <rect x="16.9" y="8" width="3.6" height="12.5" rx="0.8" />
      <path d="M4 10.5l5.5-4 3.5 2.5 6.5-5.5M15.8 3.5h3.7v3.7" />
    </g>
  ),
  award: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <circle cx="12" cy="9" r="3.4" />
      <path d="M8.2 13.6L6.5 21l3-1.6 2.5 2 2.5-2 3 1.6-1.7-7.4" />
    </g>
  ),
  info: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="12" cy="12" r="9.4" />
      <path d="M12.6 10.6l-1.6 5.8M12.9 7.4v.1" strokeWidth="1.8" />
    </g>
  ),
  engine: (
    <path
      d="M7 6.5h6M10 6.5v2.5M5.5 9h9.5l2 2.2h2v-1.7h2.5v7.5H19v-1.7h-2l-2.3 2.7H8.5l-2-2.2H4.5v2H2.5V11h2v2h1z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  cycle: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12a7 7 0 0 1-11.8 5.1M5 12a7 7 0 0 1 11.8-5.1" />
      <path d="M16.8 3.6v3.5h-3.5M7.2 20.4v-3.5h3.5" />
    </g>
  ),
  doc: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2.5h8.5l4 4v15H6z" />
      <path d="M14.5 2.5v4h4M8.8 10.5h7M8.8 13h7M8.8 15.5h7M8.8 18h5" />
    </g>
  ),
  chevron: <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
};

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {ICONS[name]}
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

function DesktopTable({ data, isDark }) {
  const columns = data.columns || [];
  return (
    <div className={s.table} role="table">
      <div className={`${s.tr} ${s.thead}`} role="row">
        {columns.map((column) => (
          <span key={column} role="columnheader">
            {column}
          </span>
        ))}
      </div>
      {(data.eras || []).map((era) => (
        <div key={era.key} className={s.tr} role="row">
          <span className={s.cEra} role="rowheader">
            <span className={s.eraName} dangerouslySetInnerHTML={{ __html: era.era }} />
            <span className={s.eraCar}>
              <Image src={isDark ? era.images.dark : era.images.light} alt="" fill className={s.img} sizes="(min-width: 1024px) 16vw, 1px" />
            </span>
          </span>
          <span className={s.cYears} role="cell">
            {era.years}
          </span>
          <span className={s.cEngines} role="cell" data-count={era.engines.length}>
            {era.engines.map((engine) => (
              <span key={engine.label} className={s.engine}>
                <span className={s.engineImg}>
                  <Image src={isDark ? engine.images.dark : engine.images.light} alt="" fill className={s.img} sizes="(min-width: 1024px) 7vw, 1px" />
                </span>
                <span className={s.engineLabel}>{engine.label}</span>
              </span>
            ))}
          </span>
          <span className={s.cWhy} role="cell" dangerouslySetInnerHTML={{ __html: spaced(era.whyBmwChanged) }} />
          <span className={s.cWorth} role="cell">
            <Icon name="info" className={s.infoIcon} />
            <span dangerouslySetInnerHTML={{ __html: spaced(era.worthKnowing) }} />
          </span>
        </div>
      ))}
    </div>
  );
}

function PhoneAccordion({ data, isDark }) {
  const [open, setOpen] = useState(0);
  const [lKey, lWhy, lWorth] = data.mobileLabels || ["Key Engines", "Why BMW Changed", "Worth Knowing"];
  return (
    <div className={s.acc}>
      {(data.eras || []).map((era, index) => {
        const isOpen = open === index;
        return (
          <div key={era.key} className={`${s.accItem} ${isOpen ? s.accOpen : ""}`}>
            <button type="button" className={s.accHead} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)}>
              <span className={s.accCar}>
                <Image src={(isDark ? era.images.dark : era.images.phone) || era.images.light} alt="" fill className={s.img} sizes="(max-width: 1023px) 26vw, 1px" />
              </span>
              <span className={s.accText}>
                <strong>{era.eraMobile || era.era}</strong>
                <span>{era.years}</span>
              </span>
              <span className={s.accToggle}>
                <Icon name="chevron" className={s.accChevron} />
              </span>
            </button>
            {isOpen ? (
              <div className={s.accBody}>
                {[
                  ["engine", lKey, era.keyEngines],
                  ["cycle", lWhy, era.whyBmwChangedMobile || era.whyBmwChanged],
                  ["info", lWorth, era.worthKnowingMobile || era.worthKnowing],
                ].map(([icon, label, value]) => (
                  <div key={label} className={s.accRow}>
                    <Icon name={icon} className={s.accIcon} />
                    <strong className={s.accLabel}>{label}</strong>
                    <p className={s.accValue} dangerouslySetInnerHTML={{ __html: spaced(value) }} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// Model JSONs migrated to the reference design carry `stats`; the rest keep the previous layout.
export default function EngineEvolution({ data }) {
  if (!data) return null;
  return data.stats ? <EngineEvolutionReference data={data} /> : <EngineEvolutionLegacy data={data} />;
}

function EngineEvolutionReference({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id="engine-evolution" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.panel}>
          <div className={s.top}>
            <div className={s.head}>
              <Title lines={data.titleLines || [data.h2]} className={`${s.title} ${s.deskOnly}`} />
              <Title lines={data.titleLinesMobile || data.titleLines || [data.h2]} className={`${s.title} ${s.phoneOnly}`} />
              <p className={`${s.copy} ${s.deskOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadline) }} />
              <p className={`${s.copy} ${s.phoneOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadlineMobile || data.subHeadline) }} />
            </div>
            <ul className={s.stats}>
              {(data.stats || []).map((stat) => (
                <li key={stat.title} className={s.stat}>
                  <Icon name={stat.icon} className={s.statIcon} />
                  <strong>{stat.title}</strong>
                  <span>{stat.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.deskOnly}>
            <DesktopTable data={data} isDark={isDark} />
          </div>
          <div className={s.phoneOnly}>
            <PhoneAccordion data={data} isDark={isDark} />
          </div>

          {data.footnote ? (
            <p className={s.foot}>
              <Icon name="doc" className={s.footIcon} />
              <span className={s.footText}>
                <span className={s.deskInline}>{data.footnote}</span>
                <span className={s.phoneInline} dangerouslySetInnerHTML={{ __html: spaced(data.footnoteMobile || data.footnote) }} />{" "}
                <span className={s.footTag}>{data.footnoteTag}</span>
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
