"use client";

import { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./ReplacementCosts.module.css";
import ReplacementCostsLegacy from "./ReplacementCostsLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// a space before each break keeps words apart where the break is hidden
const spaced = (html = "") => String(html).replace(/([^-])\s*<br\s*\/?>\s*/g, "$1 <br>");
// Desktop notes wrap to their column: the copy's line breaks were set for the old type size.
const flat = (html = "") => String(html).replace(/\s*<br\s*\/?>\s*/g, " ");

const KEYS = ["model", "engineCode", "usedSupply", "reconditionedSupply", "rebuiltSupply", "labourHours"];

const ICONS = {
  pound: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 10-4.3-1.8-7.5-5.4-7.5-10V5.6z" />
      <path d="M14 8.6a2 2 0 0 0-3.7 1c0 1.2.5 2 .5 3.1 0 .9-.5 1.6-1.3 2h5M9.4 11.8h3.4" />
    </g>
  ),
  gear: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M10.3 2.8h3.4l.5 2.4 1.8.9 2.1-1.4 2.4 2.4-1.4 2.1.9 1.8 2.4.5v3.4l-2.4.5-.9 1.8 1.4 2.1-2.4 2.4-2.1-1.4-1.8.9-.5 2.4h-3.4l-.5-2.4-1.8-.9-2.1 1.4-2.4-2.4 1.4-2.1-.9-1.8-2.4-.5v-3.4l2.4-.5.9-1.8-1.4-2.1 2.4-2.4 2.1 1.4 1.8-.9z" />
      <circle cx="12" cy="12" r="3.6" />
    </g>
  ),
  wrench: (
    <path
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.4-3.4a6 6 0 0 1-7.9 7.9l-6.6 6.6a2.1 2.1 0 0 1-3-3l6.6-6.6a6 6 0 0 1 7.9-7.9z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  shield: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 10-4.3-1.8-7.5-5.4-7.5-10V5.6z" />
      <path d="M8.6 12.1l2.4 2.4 4.4-4.6" />
    </g>
  ),
  doc: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2.5h8.5l4 4v15H6z" />
      <path d="M14.5 2.5v4h4M8.8 10.5h7M8.8 13h7M8.8 15.5h7M8.8 18h5" />
    </g>
  ),
  clock: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2M12 3.8v1M12 19.2v1M3.8 12h1M19.2 12h1" />
    </g>
  ),
  info: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.2" strokeWidth="2.2" />
    </g>
  ),
  crown: <path d="M4 17.5L2.8 8.2l4.9 3.6L12 5.2l4.3 6.6 4.9-3.6L20 17.5zM4.6 19.5h14.8" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />,
  shieldBars: (
    <g>
      <path d="M12 2.6l8 3v6c0 5-3.4 8.7-8 10.6-4.6-1.9-8-5.6-8-10.6v-6z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.2 16v-3.2h2v3.2zM11 16v-5h2v5zM13.8 16V9h2v7z" fill="currentColor" />
    </g>
  ),
};

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {ICONS[name]}
    </svg>
  );
}

function CostTable({ columns, rows, mobile, className }) {
  return (
    <div className={`${s.table} ${className || ""}`} role="table">
      <div className={`${s.tr} ${s.thead}`} role="row">
        {columns.map((column) => (
          <span key={column} role="columnheader" dangerouslySetInnerHTML={{ __html: spaced(column) }} />
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={`${row.model}-${i}`} className={s.tr} role="row">
          {KEYS.map((key) => {
            const value = (mobile && row[`${key}Mobile`]) || row[key];
            // phones break prices after the dash, as in the phone reference
            const html = mobile && /Supply$/.test(key) ? String(value).replace(" – ", " –<br>") : value;
            return <span key={key} role="cell" dangerouslySetInnerHTML={{ __html: spaced(html) }} />;
          })}
        </div>
      ))}
    </div>
  );
}

function CarImage({ src, sizes }) {
  if (!src) return null;
  return <Image src={src} alt="" fill className={s.carImg} sizes={sizes} />;
}

// Model JSONs migrated to the reference design carry `generations`; the rest keep the previous layout.
export default function ReplacementCosts({ data }) {
  if (!data) return null;
  return data.generations ? <ReplacementCostsReference data={data} /> : <ReplacementCostsLegacy data={data} />;
}

function ReplacementCostsReference({ data }) {
  const { theme } = useTheme();
  const [tab, setTab] = useState(0);
  const isDark = theme === "dark";
  const gens = data.generations || [];
  const title = String(data.h2).match(/^(.*?\s[-–-])\s+(.*)$/) || [null, data.h2, ""];
  const active = gens[tab] || gens[0];

  return (
    <section id="replacement-costs" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.panel}>
          <div className={s.top}>
            <div className={s.head}>
              <h2 className={s.title}>
                <span dangerouslySetInnerHTML={{ __html: String(title[1]).replace(/\s([-–-])$/, "\u00a0$1") }} />
                <br />
                <span className={s.accent}>{title[2]}</span>
              </h2>
              <p className={`${s.copy} ${s.deskOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadline) }} />
              <p className={`${s.copy} ${s.phoneOnly}`} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadlineMobile || data.subHeadline) }} />
            </div>
            <ul className={s.trust}>
              {(data.trust || []).map((item) => (
                <li key={item.title} className={s.trustItem}>
                  <Icon name={item.icon} className={s.trustIcon} />
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* desktop: one row per generation, car card + table */}
          <div className={`${s.gens} ${s.deskOnly}`}>
            {gens.map((gen) => (
              <div key={gen.key} className={s.gen}>
                <div className={s.genCard}>
                  <p className={s.genTitle}>{gen.title}</p>
                  <p className={s.genYears}>{gen.years}</p>
                  <div className={s.genCar}>
                    <CarImage src={isDark ? gen.images?.dark : gen.images?.light} sizes="(min-width: 1024px) 20vw, 1px" />
                  </div>
                </div>
                <CostTable columns={data.columns} rows={gen.rows} />
              </div>
            ))}
          </div>

          {/* phones: tabs, one generation at a time */}
          <div className={s.phoneOnly}>
            <div className={s.tabs} role="tablist">
              {gens.map((gen, index) => (
                <button key={gen.key} type="button" role="tab" aria-selected={tab === index} className={`${s.tab} ${tab === index ? s.tabOn : ""}`} onClick={() => setTab(index)}>
                  <strong>{gen.tab}</strong>
                  <span>{gen.tabYears}</span>
                </button>
              ))}
            </div>
            {active ? (
              <div className={s.pCard} role="tabpanel">
                <p className={s.pTitle}>
                  {active.title} <span>{active.mobileYears}</span>
                </p>
                <div className={s.pCar}>
                  <CarImage src={(isDark ? active.images?.dark : active.images?.phone) || active.images?.light} sizes="(max-width: 1023px) 60vw, 1px" />
                </div>
                <CostTable columns={data.columnsMobile || data.columns} rows={active.rows} mobile className={s.pTable} />
                {data.mobileNote ? (
                  <p className={s.pNote}>
                    <Icon name="info" className={s.pNoteIcon} />
                    {data.mobileNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className={s.bottom}>
            <div className={s.notes}>
              {data.notes ? (
                <div className={s.note}>
                  <div className={s.noteHead}>
                    <Icon name="doc" className={s.noteIcon} />
                    <p className={s.noteTitle}>{data.notes.title}</p>
                  </div>
                  <p className={`${s.noteText} ${s.deskOnly}`} dangerouslySetInnerHTML={{ __html: flat(data.notes.text) }} />
                  <div className={`${s.noteList} ${s.phoneOnly}`}>
                    {(data.notes.mobileBullets || []).map((bullet) => (
                      <p key={bullet} dangerouslySetInnerHTML={{ __html: spaced(bullet) }} />
                    ))}
                  </div>
                </div>
              ) : null}
              {data.labour ? (
                <div className={`${s.note} ${s.deskFlex}`}>
                  <div className={s.noteHead}>
                    <Icon name="clock" className={s.noteIcon} />
                    <p className={s.noteTitle}>{data.labour.title}</p>
                  </div>
                  <p className={s.noteText} dangerouslySetInnerHTML={{ __html: flat(data.labour.text) }} />
                </div>
              ) : null}
            </div>
            {data.rule ? (
              <div className={s.rule}>
                <div className={s.ruleHead}>
                  <span className={s.crown}>
                    <Icon name="crown" className={s.crownSvg} />
                  </span>
                  <p className={s.ruleTitle}>{data.rule.title}</p>
                </div>
                <p className={`${s.ruleText} ${s.deskOnly}`} dangerouslySetInnerHTML={{ __html: flat(data.rule.text) }} />
                <div className={s.phoneOnly}>
                  {(data.rule.mobileParagraphs || []).map((paragraph) => (
                    <p key={paragraph} className={s.ruleText} dangerouslySetInnerHTML={{ __html: paragraph }} />
                  ))}
                </div>
                <Icon name="shieldBars" className={s.ruleShield} />
              </div>
            ) : null}
            {data.footerMobile ? (
              <p className={`${s.footer} ${s.phoneOnly}`}>
                {data.footerMobile.map((part, index) => (
                  <span key={part}>
                    {index ? <span className={s.bullet}>•</span> : null}
                    {part}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
