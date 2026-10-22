"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./MarketIntelligence.module.css";
import MarketIntelligenceLegacy from "./MarketIntelligenceLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// a space before each break keeps words apart where the break is hidden
const spaced = (html = "") => String(html).replace(/\s*<br\s*\/?>\s*/g, " <br>");
// desktop shows the one-line text: breaks become spaces
const oneLine = (html = "") => String(html).replace(/\s*<br\s*\/?>\s*/g, " ");

const ICONS = {
  people: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6 19.5c.4-3.3 2.9-5.5 6-5.5s5.6 2.2 6 5.5z" />
      <circle cx="5.6" cy="9.6" r="2.3" />
      <path d="M1.8 18c.2-2.3 1.6-3.9 3.7-4.3" />
      <circle cx="18.4" cy="9.6" r="2.3" />
      <path d="M22.2 18c-.2-2.3-1.6-3.9-3.7-4.3" />
    </g>
  ),
  car: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15.5v-3l1.9-4.6A2 2 0 0 1 7.8 6.6h8.4a2 2 0 0 1 1.9 1.3L20 12.5v3" />
      <rect x="3" y="12" width="18" height="5" rx="1.5" />
      <path d="M5 17v2M19 17v2M6.5 14.5h1.5M16 14.5h1.5M5.2 11.5h13.6" />
    </g>
  ),
  engine: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 5.5h6M11 5.5v2.5M5.5 8h10l2 2h1.5V8.5h2v8h-2V15h-1.5l-2.5 3H8l-2-2H4v2H2.5v-7H4v2h1.5z" />
      <path d="M11.5 10.5l-1.5 2.5h2.5L11 15.5" />
    </g>
  ),
  bars: (
    <g fill="currentColor">
      <rect x="4" y="13" width="3.6" height="7" rx="0.8" />
      <rect x="10.2" y="9" width="3.6" height="11" rx="0.8" />
      <rect x="16.4" y="4.5" width="3.6" height="15.5" rx="0.8" />
    </g>
  ),
  search: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5l5 5" />
    </g>
  ),
  shield: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 10-4.3-1.8-7.5-5.4-7.5-10V5.6z" />
      <path d="M8.6 12.1l2.4 2.4 4.4-4.6" />
    </g>
  ),
  star: <path d="M12 2.8l2.7 5.7 6.2.8-4.6 4.3 1.2 6.2L12 16.7l-5.5 3.1 1.2-6.2-4.6-4.3 6.2-.8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  up: <path d="M3 17.5l6-6 4 4 8-8M15 7.5h6v6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />,
  flat: <path d="M3.5 12h16M14 6.5l5.5 5.5-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />,
  arrow: <path d="M4.5 12h15M13.5 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />,
  quote: (
    <path
      d="M5 17.5c-1.1 0-2-.9-2-2V12c0-3.3 1.7-5.6 4.8-6.6l.7 1.6C6.8 7.7 6 8.9 5.9 10.5H8c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2zm9.5 0c-1.1 0-2-.9-2-2V12c0-3.3 1.7-5.6 4.8-6.6l.7 1.6c-1.7.7-2.5 1.9-2.6 3.5h2.1c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2z"
      fill="currentColor"
    />
  ),
};

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {ICONS[name]}
    </svg>
  );
}

// the live feed's sparkline, as drawn in the references
function Sparkline() {
  const d = "M2 44 C10 46 14 38 20 40 S30 26 38 30 S46 46 54 42 S64 22 74 26 S84 40 90 36 S100 14 110 16 S122 30 130 24 S140 32 148 28 S156 34 162 30 S170 22 178 26 S186 34 192 30 S200 22 206 26";
  return (
    <svg aria-hidden="true" viewBox="0 12 210 44" className={s.spark} preserveAspectRatio="none">
      <defs>
        <linearGradient id="miSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={s.sparkFillA} />
          <stop offset="1" className={s.sparkFillB} />
        </linearGradient>
      </defs>
      <path d={`${d} L206 56 L2 56 Z`} fill="url(#miSparkFill)" />
      <path d={d} fill="none" className={s.sparkLine} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {[[38, 30], [74, 26], [110, 16], [148, 28], [178, 26], [206, 26]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.2" className={s.sparkDot} />
      ))}
    </svg>
  );
}

function SignalTable({ data }) {
  const [cSignal, cData, cTrend] = data.columns || ["Signal", "2025 Data", "Demand Trend"];
  return (
    <div className={s.table} role="table">
      <div className={`${s.tr} ${s.thead}`} role="row">
        <span role="columnheader">{cSignal}</span>
        <span role="columnheader">{cData}</span>
        <span role="columnheader">{cTrend}</span>
      </div>
      {(data.rows || []).map((row) => (
        <div key={row.signal} className={s.tr} role="row">
          <span className={s.cSignal} role="cell">
            <span className={s.rowIcon}>
              <Icon name={row.icon} className={s.rowSvg} />
            </span>
            <span className={s.signalText}>
              <strong>{row.signal}</strong>
              {row.suffix ? <span className={s.suffix}> {row.suffix}</span> : null}
            </span>
          </span>
          <span className={s.cData} role="cell">
            <strong className={s.value}>{row.value}</strong>
            <span className={s.tag}>{row.tag}</span>
            {row.note ? (
              <>
                <span className={`${s.note} ${s.deskInline}`}>{oneLine(row.note)}</span>
                <span className={`${s.note} ${s.phoneBlock}`} dangerouslySetInnerHTML={{ __html: spaced(row.noteMobile || row.note) }} />
              </>
            ) : null}
          </span>
          <span className={`${s.cTrend} ${row.trend === "flat" ? s.flat : row.trend === "down" ? s.down : s.up}`} role="cell">
            <Icon name={row.trend === "flat" ? "flat" : "up"} className={`${s.trendIcon} ${row.trend === "down" ? s.trendDown : ""}`} />
            <span className={s.trendText}>
              <span className={s.trendLine}>
                <strong>{row.trendLabel}</strong>
                {row.trendNote ? (
                  <>
                    <span className={`${s.trendNote} ${s.deskInline}`}> {oneLine(row.trendNote)}</span>
                    <span className={`${s.trendNote} ${s.phoneInline}`} dangerouslySetInnerHTML={{ __html: ` ${spaced(row.trendNoteMobile || row.trendNote)}` }} />
                  </>
                ) : null}
              </span>
              <span className={`${s.placeholder} ${s.deskInline}`}>{oneLine(row.placeholder)}</span>
              <span className={`${s.placeholder} ${s.phoneBlock}`} dangerouslySetInnerHTML={{ __html: spaced(row.placeholderMobile || row.placeholder) }} />
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function Insights({ data }) {
  return (
    <div className={s.insights}>
      <p className={s.insightsTitle}>
        <Icon name="bars" className={s.insightsIcon} />
        {data.insightsTitle}
      </p>
      <div className={s.insightList}>
        {(data.insightCards || []).map((card) => (
          <div key={card.lead} className={s.insight}>
            <span className={s.insightTile}>
              <Icon name={card.icon} className={s.insightSvg} />
            </span>
            <p className={`${s.insightText} ${s.deskBlock} ${card.textDesktop ? s.fixedLines : ""}`}>
              <strong className={card.leadStyle === "blue" ? s.leadBlue : s.leadDark}>{card.lead}</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: oneLine(card.textDesktop || card.text) }} />
            </p>
            <p className={`${s.insightText} ${s.phoneBlock}`}>
              <strong className={card.leadStyle === "blue" ? s.leadBlue : s.leadDark}>{card.lead}</strong> {card.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveFeed({ feed }) {
  if (!feed) return null;
  return (
    <div className={s.live}>
      <div className={s.liveHead}>
        <p className={s.liveTitle}>{feed.title}</p>
        <span className={s.liveBadge}>
          <span className={s.liveDot} aria-hidden="true" />
          {feed.badge}
        </span>
      </div>
      <Sparkline />
      <p className={s.liveText} dangerouslySetInnerHTML={{ __html: spaced(feed.text) }} />
      {feed.cta ? (
        <Link href={feed.cta.href} className={s.liveCta}>
          {feed.cta.label}
          <Icon name="arrow" className={s.liveArrow} />
        </Link>
      ) : null}
    </div>
  );
}

function PullQuote({ quote, isDark }) {
  if (!quote) return null;
  const images = quote.images || {};
  return (
    <div className={s.quote}>
      <div className={s.quoteBody}>
        <span className={s.quoteMark}>
          <Icon name="quote" className={s.quoteSvg} />
        </span>
        <p className={s.quoteLabel}>{quote.label || "EDITORIAL PULL-QUOTE"}</p>
        <h3 className={`${s.quoteTitle} ${s.deskBlock}`}>{oneLine(quote.title)}</h3>
        <p className={`${s.quoteTitle} ${s.phoneBlock}`} dangerouslySetInnerHTML={{ __html: spaced(quote.titleMobile || quote.title) }} />
        <p className={`${s.quoteText} ${s.deskBlock}`} dangerouslySetInnerHTML={{ __html: `“${spaced(quote.quote)}”` }} />
        <p className={`${s.quoteText} ${s.phoneBlock}`}>“{oneLine(quote.quote)}”</p>
      </div>
      {images.light || quote.image ? (
        <>
          <div className={`${s.quoteCar} ${s.deskBlock}`}>
            <Image src={(isDark ? images.dark : images.light) || quote.image} alt="" fill className={s.quoteImg} sizes="(min-width: 1024px) 36vw, 1px" />
          </div>
          <div className={`${s.quoteCar} ${s.phoneBlock}`}>
            <Image src={images.phone || images.light || quote.image} alt="" fill className={s.quoteImg} sizes="(max-width: 1023px) 46vw, 1px" />
          </div>
        </>
      ) : null}
    </div>
  );
}

// Model JSONs migrated to the reference design carry `rows`; the rest keep the previous layout.
export default function MarketIntelligence({ data, quoteData }) {
  if (!data) return null;
  return data.rows ? <MarketIntelligenceReference data={data} quote={quoteData} /> : <MarketIntelligenceLegacy data={data} quoteData={quoteData} />;
}

function MarketIntelligenceReference({ data, quote }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [line1, line2] = data.titleLines || [data.h2, ""];

  return (
    <section id="market-intelligence" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.panel}>
          <div className={s.top}>
            <h2 className={s.title}>
              {/* keep the dash on the first line (no orphaned "-") */}
              <span>{String(line1).replace(/\s+([-–-])\s*$/, "\u00a0$1")}</span>
              <br />
              <span className={s.titleLine2} dangerouslySetInnerHTML={{ __html: line2 }} />
            </h2>
            {data.stat ? (
              <div className={s.stat}>
                <span className={s.statTile}>
                  <Icon name="people" className={s.statSvg} />
                </span>
                <p className={s.statText}>
                  <strong>{data.stat.value}</strong>
                  <span>{data.stat.label}</span>
                  <span className={s.statTag}>{data.stat.tag}</span>
                </p>
              </div>
            ) : null}
          </div>

          <SignalTable data={data} />

          <div className={s.lower}>
            <Insights data={data} />
            <LiveFeed feed={data.liveFeed} />
          </div>

          <PullQuote quote={quote} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
