"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./AtAGlance.module.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// Fallbacks for model JSONs that predate the per-row icon field.
const metricIcons = {
  Generations: "layers",
  "Years Produced": "calendar",
  "Engine Codes Tracked": "engine",
  "Fuel Types": "fuel",
  "Most Enquired Engine (2025)": "trend",
  "Most Reliable": "shield",
  "Highest-Risk": "warning",
  "Highest Risk": "warning",
  "Typical Replacement Cost": "pound",
  "Typical Host Value": "tag",
  "Overall Rating": "star",
};

const RATING_TEXT = "A perfect blend of performance, engineering excellence, and drivability.";

// Line icons drawn to match the reference (24px grid, stroke = currentColor).
const ICONS = {
  layers: (
    <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <path d="M12 3.2l8.8 4.6-8.8 4.6-8.8-4.6z" fill="currentColor" />
      <path d="M3.2 12.2l8.8 4.6 8.8-4.6M3.2 16.4l8.8 4.6 8.8-4.6" strokeLinecap="round" />
    </g>
  ),
  calendar: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M7.5 13h1M11.5 13h1M15.5 13h1M7.5 16.5h1M11.5 16.5h1M15.5 16.5h1" strokeWidth="2" />
    </g>
  ),
  engine: (
    <path
      d="M7 6.5h6M10 6.5v2.5M5.5 9h9.5l2 2.2h2v-1.7h2.5v7.5H19v-1.7h-2l-2.3 2.7H8.5l-2-2.2H4.5v2H2.5V11h2v2h1z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  fuel: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 14.5 5v15.5M3 20.5h13M4.5 11h10" />
      <path d="M14.5 8.5h1.6a1.4 1.4 0 0 1 1.4 1.4v6.6a1.5 1.5 0 0 0 3 0V8.2L18 5.5" />
    </g>
  ),
  trend: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 3.5v17h17" />
      <path d="M7 15.5l4-4.5 3 2.5 5.5-6" />
      <path d="M15.5 7.5h4v4" />
    </g>
  ),
  shield: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 10-4.3-1.8-7.5-5.4-7.5-10V5.6z" />
      <path d="M8.6 12.1l2.4 2.4 4.4-4.6" />
    </g>
  ),
  warning: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 4.2a2 2 0 0 1 3.4 0l7.6 13.2a2 2 0 0 1-1.7 3H4.4a2 2 0 0 1-1.7-3z" />
      <path d="M12 9.5v4.5M12 17h.01" strokeWidth="2.1" />
    </g>
  ),
  pound: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.6 8.6a2.6 2.6 0 0 0-4.8 1.2c0 1.6.6 2.6.6 4 0 1.1-.6 2-1.6 2.6h6.2M8.6 12.6h4.6" />
    </g>
  ),
  tag: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.6 12.6l-8 8a1.6 1.6 0 0 1-2.2 0l-7-7a1.6 1.6 0 0 1-.5-1.1V4.6A1.6 1.6 0 0 1 4.5 3h7.9a1.6 1.6 0 0 1 1.1.5l7 7a1.6 1.6 0 0 1 0 2.1z" />
      <circle cx="8" cy="8" r="1.4" />
    </g>
  ),
  star: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" />
    </g>
  ),
};

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {ICONS[name] || ICONS.layers}
    </svg>
  );
}

function BadgeShield() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={s.badgeIcon}>
      <path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 10-4.3-1.8-7.5-5.4-7.5-10V5.6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8.6 12.1l2.4 2.4 4.4-4.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Green rosette with a check (reliable) / red disc with "!" (risk).
function Flag({ type }) {
  if (type === "alert") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={`${s.flag} ${s.flagAlert}`}>
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <path d="M12 6.5v7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="12" cy="17.3" r="1.5" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${s.flag} ${s.flagOk}`}>
      <path
        d="M12 1.8l2.3 1.9 2.9-.6 1.1 2.8 2.8 1.1-.6 2.9 1.9 2.3-1.9 2.3.6 2.9-2.8 1.1-1.1 2.8-2.9-.6L12 22.2l-2.3-1.9-2.9.6-1.1-2.8-2.8-1.1.6-2.9L1.6 12l1.9-2.3-.6-2.9 2.8-1.1 1.1-2.8 2.9.6z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="5.6" fill="none" stroke="#fff" strokeWidth="1.8" />
      <path d="M9.6 12.1l1.7 1.7 3.2-3.3" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stars({ filled, total, className }) {
  return (
    <span className={`${s.stars} ${className || ""}`} aria-label={`${filled} out of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} aria-hidden="true" viewBox="0 0 24 24" className={i < filled ? s.starOn : s.starOff}>
          <path d="M12 2.6l2.85 6.05 6.65.8-4.9 4.55 1.25 6.6L12 17.35 6.15 20.6l1.25-6.6-4.9-4.55 6.65-.8z" />
        </svg>
      ))}
    </span>
  );
}

// "★★★★☆ 3.9/5" -> stars + score
function parseRating(value = "") {
  const match = String(value).match(/^([★☆]+)\s*(.*)$/);
  if (!match) return null;
  return { filled: (match[1].match(/★/g) || []).length, total: match[1].length, score: match[2] };
}

// "N47D20C — ... [BMW-VERIFIED]" -> text + badge names
function splitBadges(value = "") {
  const badges = [];
  const text = String(value)
    .replace(/\s*\[([A-Z][A-Z-]+)\]/g, (_, name) => {
      badges.push(name);
      return "";
    })
    .trim();
  return { text, badges };
}

function Badge({ name }) {
  return (
    <span className={s.badge}>
      <BadgeShield />
      <span>{name}</span>
    </span>
  );
}

// "BMW 3 Series at a Glance" -> "BMW 3 Series" / "at a Glance"
function splitTitle(title = "") {
  const str = String(title);
  const index = str.indexOf("at a Glance");
  return index > 0 ? { before: str.slice(0, index).trim(), accent: str.slice(index) } : { before: str, accent: "" };
}

function RowValue({ row }) {
  const rating = parseRating(row.value);
  if (rating) {
    return (
      <span className={s.value}>
        <Stars filled={rating.filled} total={rating.total} />
        {rating.score ? <span className={s.score}>{rating.score}</span> : null}
      </span>
    );
  }
  const { text, badges } = splitBadges(row.value);
  return (
    <span className={s.value}>
      <span dangerouslySetInnerHTML={{ __html: text }} />
      {row.flag ? <Flag type={row.flag} /> : null}
      {badges.map((name) => (
        <Badge key={name} name={name} />
      ))}
    </span>
  );
}

// Phone cards: from the JSON's mobileCards, else built from the table rows.
function mobileCardsFrom(data) {
  if (data.mobileCards?.length) return data.mobileCards;
  return (data.rows || [])
    .filter((row) => !parseRating(row.value))
    .map((row) => {
      const { text, badges } = splitBadges(row.value);
      return { label: row.metric, icon: row.icon, tone: row.tone, flag: row.flag, value: text, badge: badges[0], wide: /Most Enquired/.test(row.metric) };
    });
}

// Which column each card sits in (a wide card takes the whole row), and which cards close the grid.
function placeCards(cards) {
  let col = 0;
  let row = 0;
  const placed = cards.map((card) => {
    if (card.wide) {
      const out = { ...card, side: "wide", row };
      if (col === 1) out.row = ++row;
      row++;
      col = 0;
      return out;
    }
    const out = { ...card, side: col === 0 ? "left" : "right", row };
    if (col === 1) row++;
    col = col === 0 ? 1 : 0;
    return out;
  });
  const lastRow = placed[placed.length - 1]?.row;
  return placed.map((card) => ({ ...card, last: card.row === lastRow }));
}

// a space before each break keeps words apart where phones drop the breaks
const spaced = (html = "") => String(html).replace(/\s*<br\s*\/?>\s*/g, " <br>");

const isRisk = (item) => item.tone === "risk" || /^Highest[- ]Risk$/.test(item.label || item.metric || "");

function MobileCard({ card }) {
  const icon = card.icon || metricIcons[card.label] || "layers";
  const side = card.side === "wide" ? s.cardWide : card.side === "right" ? s.cardRight : s.cardLeft;
  return (
    <li className={`${s.card} ${side} ${card.last ? s.cardLast : ""} ${isRisk(card) ? s.risk : ""}`}>
      <span className={s.cardTile}>
        <Icon name={icon} className={s.tileIcon} />
      </span>
      <div className={s.cardBody}>
        <p className={`${s.cardLabel} ${card.labelStrong ? s.cardLabelStrong : ""}`} dangerouslySetInnerHTML={{ __html: card.label }} />
        <p className={`${s.cardValue} ${s[`size_${card.size || "md"}`] || ""}`}>
          <span dangerouslySetInnerHTML={{ __html: spaced(card.value) }} />
          {card.flag && !card.note ? <Flag type={card.flag} /> : null}
        </p>
        {card.note ? (
          <p className={s.cardNote}>
            <span dangerouslySetInnerHTML={{ __html: spaced(card.note) }} />
            {card.flag ? <Flag type={card.flag} /> : null}
          </p>
        ) : null}
        {card.badge ? <Badge name={card.badge} /> : null}
      </div>
    </li>
  );
}

function RatingCard({ rating }) {
  const parsed = parseRating(rating.value);
  return (
    <div className={s.ratingCard}>
      <span className={s.ratingRing} aria-hidden="true">
        <span className={s.ratingDisc}>
          <svg viewBox="0 0 24 24" className={s.ratingIcon}>
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3.2 1.6" />
            <path d="M12 6.8l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#fff" />
          </svg>
        </span>
      </span>
      <div className={s.ratingBody}>
        <p className={s.ratingLabel}>{rating.label}</p>
        {parsed ? (
          <div className={s.ratingRow}>
            <Stars filled={parsed.filled} total={parsed.total} className={s.ratingStars} />
            {parsed.score ? <span className={s.ratingScore}>{parsed.score}</span> : null}
          </div>
        ) : null}
        {rating.text ? <p className={s.ratingText}>{rating.text}</p> : null}
      </div>
    </div>
  );
}

export default function AtAGlance({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const rows = data.rows || [];
  const [metricHead, valueHead] = data.tableHeaders || ["Metric", "Value"];
  const scene = isDark ? data.sceneDark : data.scene;
  const ratingRow = rows.find((row) => parseRating(row.value));
  const rating = data.mobileRating || (ratingRow ? { label: ratingRow.metric, value: ratingRow.value, text: RATING_TEXT } : null);
  const cards = placeCards(mobileCardsFrom(data));
  // phone car: light and dark each have their own crop, placed the same way
  const phoneScene = isDark ? data.scenePhoneDark : data.scenePhone;

  return (
    <section className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.inner}>
          <div className={`${s.art} ${phoneScene ? s.hasPhoneScene : ""}`} aria-hidden="true">
            <div className={s.band} />
            {scene ? (
              <div className={s.scene} style={!isDark && data.sceneMask ? { "--scene-mask": `url("${data.sceneMask}")` } : undefined}>
                <Image src={scene} alt="" fill sizes="(min-width: 1024px) 82vw, 110vw" />
              </div>
            ) : null}
            <div className={s.lineA} />
            <div className={s.lineB} />
          </div>

          <div className={`${s.head} ${phoneScene ? s.headPhoneScene : ""}`}>
            {/* phone light reference: its car and backdrop, standing on the cards as in the reference */}
            {phoneScene ? (
              <div className={`${s.scenePhone} ${isDark ? s.scenePhoneDark : ""}`} aria-hidden="true">
                <Image src={phoneScene} alt="" fill sizes="56vw" />
              </div>
            ) : null}
            <h2 className={s.title}>
              <span dangerouslySetInnerHTML={{ __html: title.before }} />
              {title.accent ? (
                <>
                  <br />
                  <span className={s.accent} dangerouslySetInnerHTML={{ __html: title.accent }} />
                </>
              ) : null}
            </h2>
            {data.subHeadline ? <p className={s.copy} dangerouslySetInnerHTML={{ __html: data.subHeadline }} /> : null}
          </div>

          <div className={s.table} role="table">
            <div className={`${s.row} ${s.headRow}`} role="row">
              <span className={s.tileCell} />
              <span className={s.labelCell} role="columnheader">{metricHead}</span>
              <span className={s.valueCell} role="columnheader">{valueHead}</span>
            </div>
            {rows.map((row) => (
              <div key={row.metric} className={`${s.row} ${isRisk(row) ? s.risk : ""}`} role="row">
                <span className={s.tileCell}>
                  <span className={s.tile}>
                    <Icon name={row.icon || metricIcons[row.metric]} className={s.tileIcon} />
                  </span>
                </span>
                <span className={s.labelCell} role="cell" dangerouslySetInnerHTML={{ __html: row.metric }} />
                <span className={s.valueCell} role="cell">
                  <RowValue row={row} />
                </span>
              </div>
            ))}
          </div>

          <div className={s.mobile}>
            <ul className={s.cards}>
              {cards.map((card) => (
                <MobileCard key={card.label} card={card} />
              ))}
            </ul>
            {rating ? <RatingCard rating={rating} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
