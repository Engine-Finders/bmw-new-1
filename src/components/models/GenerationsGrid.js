"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import { carImageFor } from "@/components/shared/carImage";
import s from "./GenerationsGrid.module.css";
import GenerationsGridLegacy from "./GenerationsGridLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// "BMW 3 Series E30" -> "E30"; "XJ X351 (2010–2019)" -> "X351"
function codeFromTitle(title = "", label = "") {
  let name = String(title).replace(/\s*\(.*$/, "").trim();
  const prefix = label || name.match(/^(BMW\s+\S+\s+Series|BMW\s+\S+|\S+)\s/)?.[1] || "";
  if (prefix && name.startsWith(`${prefix} `)) name = name.slice(prefix.length + 1);
  return name;
}

// "1975–1983 • M10 1.6–2.0, M20 2.0–2.3" -> years + "• engines"
function splitMeta(meta = "") {
  const [years, ...rest] = String(meta).split(/\s*•\s*/);
  return { years: years || "", engines: rest.length ? `• ${rest.join(", ")}` : "" };
}

// "BMW 3 Series Generations — Find Your Vehicle" -> "BMW 3 Series Generations —" / "Find Your Vehicle"
function splitTitle(title = "") {
  const match = String(title).match(/^(.*?\s[-–—])\s+(.*)$/);
  return match ? { main: match[1], accent: match[2] } : { main: String(title), accent: "" };
}

// Card data with fallbacks for model JSONs that predate the per-card fields.
function cardView(card, modelLabel) {
  const meta = splitMeta(card.meta);
  const badge = String(card.badge || "");
  const tag = card.badgeTag || badge.match(/\[[A-Z][A-Z-]+\]/)?.[0] || "";
  const badgeText = badge.replace(/\s*\[[A-Z][A-Z-]+\]/, "").replace(/\s+-\s+/, " — ");
  return {
    label: card.label || modelLabel,
    code: card.code || codeFromTitle(card.title, modelLabel),
    years: card.years || meta.years,
    engineLines: card.engineLines || (meta.engines ? [meta.engines] : []),
    enginesMobile: card.enginesMobile || meta.engines,
    badgeLines: card.badgeLines || (badgeText ? [badgeText] : []),
    badgeMobile: card.badgeMobile || badgeText,
    tag,
    rating: card.rating || "",
    verdictLabel: card.verdictLabel || "Our Verdict:",
    verdict: String(card.verdict || ""),
    images: card.images || (card.image ? { light: card.image, dark: card.image, phone: card.image } : {}),
    cta: card.cta || {},
  };
}

function Stars({ value, className }) {
  const chars = [...String(value)].filter((c) => "★☆½".includes(c));
  while (chars.length < 5) chars.push("☆");
  const score = chars.slice(0, 5).reduce((n, c) => n + (c === "★" ? 1 : c === "½" ? 0.5 : 0), 0);
  return (
    <span className={`${s.stars} ${className || ""}`} role="img" aria-label={`${score} out of 5`}>
      {chars.slice(0, 5).map((c, i) => (
        <svg key={i} aria-hidden="true" viewBox="0 0 24 24" className={c === "★" ? s.starOn : c === "½" ? s.starHalf : s.starOff}>
          {c === "½" ? (
            <defs>
              <clipPath id={`half-${i}`}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
          ) : null}
          <path className={s.starBase} d="M12 2.4l2.9 6.1 6.7.8-4.9 4.6 1.3 6.7L12 17.3l-6 3.3 1.3-6.7-4.9-4.6 6.7-.8z" />
          {c === "½" ? <path clipPath={`url(#half-${i})`} className={s.starFill} d="M12 2.4l2.9 6.1 6.7.8-4.9 4.6 1.3 6.7L12 17.3l-6 3.3 1.3-6.7-4.9-4.6 6.7-.8z" /> : null}
        </svg>
      ))}
    </span>
  );
}

function Chevron({ up = false, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
    </svg>
  );
}

function Arrow({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

const ICONS = {
  scale: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5v16M7.5 20.5h9M4.5 6.5h15" />
      <path d="M6.5 6.5l-3 6.5a3 2.2 0 0 0 6 0zM17.5 6.5l-3 6.5a3 2.2 0 0 0 6 0z" />
    </g>
  ),
  calendar: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </g>
  ),
  fuel: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 14.5 5v15.5M3 20.5h13" />
      <path d="M7.5 7.5h4v3.5h-4z" />
      <path d="M14.5 8.5h1.6a1.4 1.4 0 0 1 1.4 1.4v6.6a1.5 1.5 0 0 0 3 0V8.2L18 5.5" />
    </g>
  ),
  star: <path d="M12 2.6l2.85 6.05 6.65.8-4.9 4.55 1.25 6.6L12 17.35 6.15 20.6l1.25-6.6-4.9-4.55 6.65-.8z" fill="currentColor" />,
  sun: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
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

function CardImage({ images, isDark, phone = false, alt }) {
  const src = phone ? (isDark ? images.dark : images.phone) : isDark ? images.dark : images.light;
  if (!src) return null;
  return <Image src={src} alt={alt} fill className={s.carImg} sizes={phone ? "(max-width: 1023px) 50vw, 1px" : "(min-width: 1024px) 14vw, 1px"} />;
}

function BadgeBlock({ lines, tag, mobile, mobileText }) {
  if (!lines.length && !tag) return null;
  return (
    <div className={s.badgeBlock}>
      {mobile ? (
        mobileText ? <p className={s.badgeLine}>{mobileText}</p> : null
      ) : (
        lines.map((line) => (
          <p key={line} className={s.badgeLine}>
            {line}
          </p>
        ))
      )}
      {tag ? <p className={s.badgeTag}>{tag}</p> : null}
    </div>
  );
}

function ctaLabel(cta, isDark) {
  return String((isDark && cta.labelDark) || cta.label || "").replace(/\s*(?:→|â†’)\s*$/, "");
}

// Desktop card: every card starts collapsed; the header toggles it open to show the verdict
// inside the card (same behaviour as the generation cards on the other model pages).
function DesktopCard({ card, index, isDark }) {
  const [open, setOpen] = useState(false);
  const label = ctaLabel(card.cta, isDark);
  return (
    <article className={`${s.card} ${open ? s.cardOpen : ""}`}>
      <button type="button" className={s.cardHead} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className={s.num}>{index + 1}</span>
        <span className={s.cardLabel}>{card.label}</span>
        <Chevron up={open} className={s.headChevron} />
      </button>
      <h3 className={s.code} dangerouslySetInnerHTML={{ __html: card.code }} />
      <div className={s.meta}>
        <BadgeBlock lines={card.badgeLines} tag={card.tag} />
        {card.years ? <p className={s.years}>{card.years}</p> : null}
        {card.engineLines.map((line) => (
          <p key={line} className={s.engines} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </div>
      <div className={s.car}>
        <CardImage images={card.images} isDark={isDark} alt={`BMW ${card.code}`} />
      </div>
      <Stars value={card.rating} className={s.cardStars} />
      {open && card.verdict ? (
        <div className={s.verdict}>
          <p className={s.verdictLabel}>{card.verdictLabel}</p>
          <p className={s.verdictText} dangerouslySetInnerHTML={{ __html: card.verdict }} />
        </div>
      ) : null}
      <Link href={card.cta.href || "#"} className={s.cta}>
        <span dangerouslySetInnerHTML={{ __html: label }} />
        <Arrow className={s.ctaIcon} />
      </Link>
    </article>
  );
}

// Phone accordion row: open shows the big car, button, stars and verdict.
function PhoneCard({ card, index, open, onToggle, isDark }) {
  const label = ctaLabel(card.cta, isDark);
  return (
    <article className={`${s.pCard} ${open ? s.pOpen : ""}`}>
      <button type="button" className={s.pHead} aria-expanded={open} onClick={onToggle}>
        <span className={s.num}>{index + 1}</span>
        <span className={s.pText}>
          <span className={s.cardLabel}>{card.label}</span>
          <span className={s.code} dangerouslySetInnerHTML={{ __html: card.code }} />
          {open ? (
            <>
              {card.years ? <span className={s.years}>{card.years}</span> : null}
              {card.enginesMobile ? <span className={s.engines} dangerouslySetInnerHTML={{ __html: card.enginesMobile }} /> : null}
            </>
          ) : (
            <>
              <BadgeBlock lines={card.badgeLines} tag={card.tag} mobile mobileText={card.badgeMobile} />
              <span className={s.pMeta}>
                {card.years}
                {card.enginesMobile ? <span className={s.pEngines} dangerouslySetInnerHTML={{ __html: card.enginesMobile }} /> : null}
              </span>
            </>
          )}
        </span>
        {!open ? (
          <span className={s.pThumb}>
            <CardImage images={card.images} isDark={isDark} phone alt={`BMW ${card.code}`} />
          </span>
        ) : null}
        <Chevron up={open} className={s.pChevron} />
      </button>
      {open ? (
        <div className={s.pBody}>
          <div className={s.pCar}>
            <CardImage images={card.images} isDark={isDark} phone alt={`BMW ${card.code}`} />
          </div>
          <Link href={card.cta.href || "#"} className={s.pCta}>
            <span dangerouslySetInnerHTML={{ __html: label }} />
            <Arrow className={s.pCtaIcon} />
          </Link>
          <Stars value={card.rating} className={s.pStars} />
          {card.verdict ? (
            <div className={s.pVerdict}>
              <p className={s.verdictLabel}>{card.verdictLabel}</p>
              <p className={s.verdictText} dangerouslySetInnerHTML={{ __html: card.verdict }} />
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

// "N47D20C — rear-chain risk" -> code coloured by tone, the rest in the body colour.
function Cell({ cell, mobile }) {
  const text = String((mobile && cell.mobileText) || cell.text || "").replace(/\s*<br\s*\/?>\s*/g, " <br>");
  const match = text.match(/^([A-Z0-9/]+\d[A-Z0-9/]*)(.*)$/s);
  if (!cell.tone || !match) return <span dangerouslySetInnerHTML={{ __html: text }} />;
  return (
    <span>
      <span className={s[`tone_${cell.tone}`]}>{match[1]}</span>
      <span dangerouslySetInnerHTML={{ __html: match[2] }} />
    </span>
  );
}

function splitColumn(column = "") {
  const match = String(column).match(/^(.*?)\s*(\(.*\))$/);
  return match ? { main: match[1], sub: match[2] } : { main: String(column), sub: "" };
}

function RangeTable({ table, mobile }) {
  const columns = (table.columns || []).slice(1);
  // the "Our position" row is shown as the merged position column when the table has one
  const rows = (table.rows || []).filter((row) => !(table.position && /^our position$/i.test(row.label)));
  if (!rows.length) return null;
  const position = table.position;
  return (
    <div className={`${s.grid} ${mobile ? s.gridPhone : s.gridDesk}`} role="table">
      <div className={s.gHead} role="row">
        <span className={s.gCorner} />
        {columns.map((column) => {
          const { main, sub } = splitColumn(column);
          return (
            <span key={column} className={s.gTh} role="columnheader">
              {!mobile ? <Icon name="calendar" className={s.thIcon} /> : null}
              <span className={s.thText}>
                <strong>{main}</strong>
                {sub ? <span>{sub}</span> : null}
              </span>
            </span>
          );
        })}
        {position ? (
          <span className={s.posHead} role="columnheader">
            <Icon name="star" className={s.posIcon} />
            {position.title}
          </span>
        ) : null}
      </div>
      {rows.map((row, rowIndex) => (
        <div key={row.label} className={s.gRow} role="row">
          <span className={s.gLabel} role="rowheader">
            <Icon name="fuel" className={s.rowIcon} />
            {row.label}
          </span>
          {(row.cells || []).map((cell, i) => (
            <span key={i} className={s.gCell} role="cell">
              <Cell cell={cell} mobile={mobile} />
            </span>
          ))}
          {/* the merged position cell spans every body row */}
          {position && rowIndex === 0 ? (
            <span
              className={s.posText}
              role="cell"
              style={{ gridRow: `span ${rows.length}` }}
              dangerouslySetInnerHTML={{ __html: (mobile && position.mobileText) || position.text }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

// Model JSONs migrated to the reference design carry per-card `code` fields; the rest keep the previous layout.
export default function GenerationsGrid({ data }) {
  if (!data) return null;
  const migrated = (data.cards || []).some((card) => card.code);
  return migrated ? <GenerationsReference data={data} /> : <GenerationsGridLegacy data={data} />;
}

function GenerationsReference({ data }) {
  const { theme } = useTheme();
  const [openPhone, setOpenPhone] = useState(-1);

  const isDark = theme === "dark";
  const title = splitTitle(data.h2);
  const modelLabel = String(data.h2 || "").split(/\s+Generations\b/)[0];
  // Body-style variants (E36/5, E91, …) stay in the data but the grid shows the generations, as in the references.
  const source = (data.cards || []).filter((card) => !card.variant);
  const cards = source.map((card) => cardView({ ...card, image: card.image || carImageFor(card.title, data.h2) }, modelLabel));
  const table = data.rangeTable;
  const link = data.comparisonLink;
  const linkPrefix = link?.prefix || "Read the full comparison:";
  const linkLabel = String(link?.label || "").replace(linkPrefix, "").replace(/\s*→\s*$/, "").trim();

  return (
    <section id="generations" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.panel}>
          <div className={s.head}>
            <h2 className={s.title}>
              <span dangerouslySetInnerHTML={{ __html: title.main }} />
              {title.accent ? (
                <>
                  <br />
                  <span className={s.accent}>{title.accent}</span>
                </>
              ) : null}
            </h2>
            {data.subHeadline ? <p className={`${s.copy} ${s.deskOnly}`} dangerouslySetInnerHTML={{ __html: data.subHeadline }} /> : null}
            {data.subHeadline ? (
              <p className={`${s.copy} ${s.phoneOnly}`} dangerouslySetInnerHTML={{ __html: data.subHeadlineMobile || data.subHeadline }} />
            ) : null}
          </div>

          <div className={`${s.cards} ${s.deskOnly}`} style={{ "--count": cards.length }}>
            {cards.map((card, index) => (
              <DesktopCard key={`${card.code}-${index}`} card={card} index={index} isDark={isDark} />
            ))}
          </div>

          <div className={`${s.pCards} ${s.phoneOnly}`}>
            {cards.map((card, index) => (
              <PhoneCard
                key={`${card.code}-${index}`}
                card={card}
                index={index}
                isDark={isDark}
                open={openPhone === index}
                onToggle={() => setOpenPhone(openPhone === index ? -1 : index)}
              />
            ))}
          </div>

          {table?.rows?.length || link ? (
            <div className={s.compare}>
              {table?.rows?.length ? (
                <>
                  <h3 className={s.compareTitle}>
                    <Icon name="scale" className={s.compareIcon} />
                    {table.title}
                  </h3>
                  <div className={s.deskOnly}>
                    <RangeTable table={table} />
                  </div>
                  <div className={`${s.phoneOnly} ${s.gridWrap}`}>
                    <RangeTable table={table} mobile />
                  </div>
                </>
              ) : null}
              {link ? (
                <p className={s.link}>
                  <span className={s.linkIcon}>
                    <Icon name="sun" className={s.linkSvg} />
                  </span>
                  <span className={s.linkPrefix}>{linkPrefix}</span>
                  <Link href={link.href} className={s.linkA}>
                    {linkLabel}
                    <Arrow className={s.linkArrow} />
                  </Link>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
