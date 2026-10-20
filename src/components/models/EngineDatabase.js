"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { engineHrefFor } from "@/components/shared/engineLink";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./EngineDatabase.module.css";
import EngineDatabaseLegacy from "./EngineDatabaseLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// Line icons drawn to match the references (24px grid, stroke = currentColor).
const ICONS = {
  cube: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 2.8l8.2 4.6v9.2L12 21.2l-8.2-4.6V7.4z" />
      <path d="M3.8 7.4L12 12l8.2-4.6M12 12v9.2" />
    </g>
  ),
  shield: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 10-4.3-1.8-7.5-5.4-7.5-10V5.6z" />
      <path d="M8.6 12.1l2.4 2.4 4.4-4.6" />
    </g>
  ),
  chart: (
    <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v2.5" />
      <path d="M4.5 9v-3A1.5 1.5 0 0 1 6 4.5" />
      <rect x="3.5" y="14" width="3.6" height="6.5" rx="1.6" />
      <rect x="10.2" y="10.5" width="3.6" height="10" rx="1.6" />
      <rect x="16.9" y="12.5" width="3.6" height="8" rx="1.6" />
      <path d="M7.1 17h3.1M13.8 15h3.1" />
    </g>
  ),
  pound: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M14.6 8.6a2.6 2.6 0 0 0-4.8 1.2c0 1.6.6 2.6.6 4 0 1.1-.6 2-1.6 2.6h6.2M8.6 12.6h4.6" />
    </g>
  ),
  bars: (
    <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <rect x="3.5" y="12" width="4.2" height="8.5" rx="1" />
      <rect x="9.9" y="4" width="4.2" height="16.5" rx="1" />
      <rect x="16.3" y="8.5" width="4.2" height="12" rx="1" />
    </g>
  ),
  poundBig: (
    <path d="M16.4 6.2a4.2 4.2 0 0 0-7.6 1.8c-.3 2.2.8 4.2.8 6.4 0 2-1 3.8-2.9 5.1h10.4M6.7 12.4h7.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  doc: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7.5h7M8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </g>
  ),
  database: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 9.8c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8M4.5 14.2c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" />
    </g>
  ),
  list: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M7.5 9h9M7.5 12.5h9M7.5 16h6" />
    </g>
  ),
  search: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5l5 5" />
    </g>
  ),
  reset: (
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M17.5 3v3.9h-3.9" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  ),
  drop: <path d="M12 2.8c3.6 4.5 6.2 8.1 6.2 11.6a6.2 6.2 0 0 1-12.4 0c0-3.5 2.6-7.1 6.2-11.6z" fill="currentColor" />,
  arrow: <path d="M4.5 12h15M13.5 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />,
  chevron: <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  sort: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 9.5l4-4 4 4M8 14.5l4 4 4-4" />
    </g>
  ),
  sortPair: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 19V5M4.5 8.5L8 5l3.5 3.5M16 5v14M12.5 15.5L16 19l3.5-3.5" />
    </g>
  ),
  info: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.2" strokeWidth="2.2" />
    </g>
  ),
};

// a space before each break keeps words apart where phones drop the breaks; [TAGS] never split
const spaced = (html = "") =>
  String(html)
    .replace(/\s*<br\s*\/?>\s*/g, " <br>")
    .replace(/(\[[A-Z][A-Z-]+\])/g, '<span style="white-space:nowrap">$1</span>');

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {ICONS[name]}
    </svg>
  );
}

const STAR = "M12 2.4l2.9 6.1 6.7.8-4.9 4.6 1.3 6.7L12 17.3l-6 3.3 1.3-6.7-4.9-4.6 6.7-.8z";

// "★★★½" -> three stars, a "½", then empty stars to five places (as in the light reference).
function Stars({ value, className }) {
  const chars = [...String(value)].filter((c) => "★☆½".includes(c));
  const slots = [];
  for (const c of chars) slots.push(c);
  while (slots.length < 5) slots.push("☆");
  const score = chars.reduce((n, c) => n + (c === "★" ? 1 : c === "½" ? 0.5 : 0), 0);
  return (
    <span className={`${s.stars} ${className || ""}`} role="img" aria-label={`${score} out of 5`}>
      {slots.slice(0, 5).map((c, i) =>
        c === "½" ? (
          <span key={i} className={s.half} aria-hidden="true">
            ½
          </span>
        ) : (
          <svg key={i} aria-hidden="true" viewBox="0 0 24 24" className={c === "★" ? s.starOn : s.starOff}>
            <path d={STAR} />
          </svg>
        )
      )}
    </span>
  );
}

// "BMW 3 Series Engine Codes — The Complete Database" -> "…Codes —" / "The Complete Database"
function splitTitle(title = "") {
  const match = String(title).match(/^(.*?\s[-–—])\s+(.*)$/);
  return match ? { main: match[1], accent: match[2] } : { main: String(title), accent: "" };
}

// "£1,500–£3,000 [PLACEHOLDER - confirm vs cost sheet]" -> cost + "[PLACEHOLDER]"
function splitCost(value = "") {
  const match = String(value).match(/^(.*?)\s*\[([A-Z][A-Z-]*)(?:\s+-[^\]]*)?\]\s*$/);
  return match ? { cost: match[1], tag: `[${match[2]}]` } : { cost: String(value), tag: "" };
}

// "— (pattern data)" -> dash + italic note
function Enquiries({ value }) {
  const str = String(value);
  const match = str.match(/^—\s*(\(.*\))$/);
  if (match) {
    return (
      <span>
        — <em className={s.pattern}>{match[1]}</em>
      </span>
    );
  }
  return <span dangerouslySetInnerHTML={{ __html: str }} />;
}

function enquiryNumber(value = "") {
  const match = String(value).match(/^\d[\d,]*/);
  return match ? Number(match[0].replaceAll(",", "")) : 0;
}

function DesktopTable({ data }) {
  const columns = data.columns || [];
  const info = new Set(data.infoColumns || []);
  const rows = (data.engines || []).slice(0, data.desktopRows || 10);
  return (
    <div className={s.table} role="table">
      <div className={`${s.tr} ${s.thead}`} role="row">
        {columns.map((column) => (
          <span key={column} className={s.th} role="columnheader">
            {column}
            {column === data.sortColumn ? <Icon name="sort" className={s.sortIcon} /> : null}
            {info.has(column) ? <Icon name="info" className={s.infoIcon} /> : null}
          </span>
        ))}
      </div>
      {rows.map((row) => {
        const { cost, tag } = splitCost(row.avgRebuildCost);
        return (
          <div key={row.engineCode} className={s.tr} role="row">
            <span className={`${s.td} ${s.code}`} role="cell" dangerouslySetInnerHTML={{ __html: row.engineCode }} />
            <span className={s.td} role="cell" dangerouslySetInnerHTML={{ __html: row.family }} />
            <span className={s.td} role="cell">{row.fuel}</span>
            <span className={s.td} role="cell">{row.displacement}</span>
            <span className={s.td} role="cell">{row.power}</span>
            <span className={s.td} role="cell">{row.years}</span>
            <span className={s.td} role="cell">{row.model}</span>
            <span className={s.td} role="cell">
              <Stars value={row.reliability} />
            </span>
            <span className={s.td} role="cell">
              <Enquiries value={row.enquiries} />
            </span>
            <span className={`${s.td} ${s.costCell}`} role="cell">
              <span>{cost}</span>
              {tag ? <span className={s.costTag}>{tag}</span> : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Phone list: the phone reference's own engines, joined to the desktop data where the code matches,
// so the displacement and generation filters have something to work on.
function PhoneDatabase({ mobile, engines }) {
  const rows = useMemo(
    () =>
      (mobile.engines || []).map((row, index) => {
        const full = engines.find((engine) => engine.engineCode === row.code) || {};
        return { ...row, index, displacement: full.displacement || "", generations: String(full.model || "").split(/\s*,\s*/).filter(Boolean), family: full.family || "" };
      }),
    [mobile, engines]
  );
  const options = useMemo(
    () => ({
      fuel: [...new Set(rows.map((row) => row.fuel))],
      displacement: [...new Set(rows.map((row) => row.displacement).filter(Boolean))],
      generation: [...new Set(rows.flatMap((row) => row.generations))],
    }),
    [rows]
  );
  const empty = { query: "", fuel: "", displacement: "", generation: "", sort: "listed" };
  const [filters, setFilters] = useState(empty);
  const set = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  const shown = rows
    .filter((row) => {
      const haystack = [row.code, row.fuel, row.family, row.displacement, ...row.generations].join(" ").replace(/<[^>]+>/g, " ").toLowerCase();
      return (
        (!filters.query || haystack.includes(filters.query.trim().toLowerCase())) &&
        (!filters.fuel || row.fuel === filters.fuel) &&
        (!filters.displacement || row.displacement === filters.displacement) &&
        (!filters.generation || row.generations.includes(filters.generation))
      );
    })
    .sort((a, b) => {
      if (filters.sort === "enquiries") return enquiryNumber(b.enquiries) - enquiryNumber(a.enquiries) || a.index - b.index;
      if (filters.sort === "code") return a.code.localeCompare(b.code);
      return a.index - b.index;
    });

  const f = mobile.filters || {};
  const [cCode, cFuel, cEnq, cView] = mobile.columns || [];

  return (
    <div className={s.phone}>
      {mobile.dataCard ? (
        <div className={s.dataCard}>
          <span className={s.dataTile}>
            <Icon name="database" className={s.dataIcon} />
          </span>
          <div>
            <p className={s.dataTitle}>{mobile.dataCard.title}</p>
            <p className={s.dataText} dangerouslySetInnerHTML={{ __html: spaced(mobile.dataCard.text) }} />
          </div>
        </div>
      ) : null}

      <label className={s.search}>
        <Icon name="search" className={s.searchIcon} />
        <input type="search" value={filters.query} onChange={set("query")} placeholder={mobile.searchPlaceholder} aria-label={mobile.searchPlaceholder} />
      </label>

      <div className={s.selects}>
        {[
          ["fuel", f.fuel],
          ["displacement", f.displacement],
          ["generation", f.generation],
        ].map(([key, label]) => (
          <label key={key} className={s.select}>
            <span className={s.selectValue}>{filters[key] || label}</span>
            <Icon name="chevron" className={s.selectChevron} />
            <select value={filters[key]} onChange={set(key)} aria-label={label}>
              <option value="">{label}</option>
              {options[key].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label className={`${s.select} ${s.sortSelect}`}>
          <span className={s.selectText}>
            <span className={s.sortLabel}>{f.sortLabel}</span>
            <span className={s.selectValue}>{filters.sort === "code" ? "Engine code" : f.sortValue}</span>
          </span>
          <Icon name="chevron" className={s.selectChevron} />
          <select value={filters.sort} onChange={set("sort")} aria-label={f.sortLabel}>
            <option value="listed">{f.sortValue}</option>
            <option value="enquiries">{f.sortValue} — highest first</option>
            <option value="code">Engine code</option>
          </select>
        </label>
      </div>

      <button type="button" className={s.reset} onClick={() => setFilters(empty)}>
        <Icon name="reset" className={s.resetIcon} />
        {mobile.reset}
      </button>

      <div className={s.pTable} role="table">
        <div className={`${s.pRow} ${s.pHead}`} role="row">
          <span role="columnheader">
            {cCode}
            <Icon name="sortPair" className={s.pSort} />
          </span>
          <span role="columnheader">
            {cFuel}
            <Icon name="sortPair" className={s.pSort} />
          </span>
          <span role="columnheader">
            {cEnq}
            <Icon name="sortPair" className={s.pSort} />
          </span>
          <span role="columnheader">{cView}</span>
        </div>
        {shown.map((row) => (
          <div key={row.code} className={s.pRow} role="row">
            <span className={s.pCode} role="cell">
              {row.code}
            </span>
            <span className={s.pFuel} role="cell">
              <Icon name="drop" className={`${s.drop} ${/diesel/i.test(row.fuel) ? s.dropDiesel : s.dropPetrol}`} />
              {row.fuel}
            </span>
            <span className={s.pEnq} role="cell">
              {row.enquiries}
            </span>
            <span className={s.pView} role="cell">
              <Link href={engineHrefFor(row.code, row.family)} aria-label={`View ${row.code}`}>
                <Icon name="arrow" className={s.pArrow} />
              </Link>
            </span>
          </div>
        ))}
        {shown.length === 0 ? <p className={s.pEmpty}>No engine codes match these filters.</p> : null}
      </div>

      {mobile.sources?.length ? (
        <div className={s.sources}>
          <p className={s.sourcesTitle}>{mobile.sourcesTitle}</p>
          {mobile.sources.map((source) => (
            <div key={source.label} className={s.source}>
              <span className={s.sourceTile}>
                <Icon name={source.icon === "chart" ? "bars" : source.icon === "pound" ? "poundBig" : "doc"} className={s.sourceIcon} />
              </span>
              <p className={s.sourceText}>
                <strong>{source.label}</strong>
                <span dangerouslySetInnerHTML={{ __html: spaced(source.text) }} />
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Model JSONs migrated to the reference design carry `stats`; the rest keep the previous layout.
export default function EngineDatabase({ data }) {
  if (!data) return null;
  return data.stats ? <EngineDatabaseReference data={data} /> : <EngineDatabaseLegacy data={data} />;
}

function EngineDatabaseReference({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const mobile = data.mobile || {};
  const mobileTitle = splitTitle(mobile.h2 || data.h2);

  return (
    <section id="engine-database" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.panel}>
          <div className={s.top}>
            <div className={`${s.head} ${s.deskOnly}`}>
              <h2 className={s.title}>
                <span>{title.main}</span>
                <br />
                <span className={s.accent}>{title.accent}</span>
              </h2>
              <p className={s.copy} dangerouslySetInnerHTML={{ __html: spaced(data.subHeadline) }} />
            </div>
            <div className={`${s.head} ${s.phoneOnly}`}>
              <h2 className={s.title}>
                <span>{mobileTitle.main}</span>
                <br />
                <span className={s.accent}>{mobileTitle.accent}</span>
              </h2>
              <p className={s.copy} dangerouslySetInnerHTML={{ __html: spaced(mobile.subHeadline || data.subHeadline) }} />
            </div>

            <ul className={`${s.stats} ${s.deskOnly}`}>
              {data.stats.map((stat) => (
                <li key={stat.label} className={s.stat}>
                  <Icon name={stat.icon} className={s.statIcon} />
                  <p className={s.statText}>
                    <strong className={s.statValue}>{stat.value}</strong>
                    <span className={s.statLabel} dangerouslySetInnerHTML={{ __html: spaced(stat.label) }} />
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.deskOnly}>
            <DesktopTable data={data} />

            <div className={s.footer}>
              <button type="button" className={s.viewAll}>
                <Icon name="list" className={s.viewIcon} />
                <span>{data.viewAllLabel}</span>
                <Icon name="chevron" className={s.viewChevron} />
              </button>
              <p className={s.showing}>{data.showingText}</p>
              <ul className={s.legend}>
                {(data.legend || []).map((item) => (
                  <li key={item.label}>
                    <Stars value={item.stars} className={s.legendStars} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {data.note ? (
              <div className={s.note}>
                <span className={s.noteIcon} aria-hidden="true">
                  i
                </span>
                <p className={s.noteText} dangerouslySetInnerHTML={{ __html: spaced(data.note) }} />
                {data.noteLink ? (
                  <Link href={data.noteLink.href} className={s.noteLink}>
                    {data.noteLink.label}
                    <Icon name="arrow" className={s.noteArrow} />
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className={s.phoneOnly}>
            <PhoneDatabase mobile={mobile} engines={data.engines || []} />
          </div>
        </div>
      </div>
    </section>
  );
}
