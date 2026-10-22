"use client";

import { useId } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./OwnershipVerdict.module.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// Fallbacks for model JSONs that predate the per-row icon/tone fields.
const metricIcons = {
  "Overall Ownership Rating": ["star", "blue"],
  "Replacement Economics": ["scale", "orange"],
  Reliability: ["shield", "green"],
  "Most Reliable Engine": ["trophy", "gold"],
  "Highest-Risk Engine": ["warning", "red"],
  "Best Used Buy": ["cart", "blue"],
  "Best Petrol Buy": ["fuel", "green"],
  "Average Engine Replacement": ["pound", "blue"],
  "Most Common Failure Enquiry": ["chart", "purple"],
  "BMW Ranking": ["crown", "copper"],
};

// Row icons, drawn to match the reference (24px grid).
const ICONS = {
  star: (
    <path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6l-5.3 2.9 1.1-5.9-4.4-4.1 6-.8z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
  ),
  scale: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5v16M7.5 20.5h9M4.5 6.5h15M12 3.5" />
      <path d="M6.5 6.5l-3 6.5a3 2.2 0 0 0 6 0zM17.5 6.5l-3 6.5a3 2.2 0 0 0 6 0z" />
      <path d="M3.5 13h6M14.5 13h6" />
    </g>
  ),
  shield: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.8l7.5 2.8v5.6c0 4.6-3.2 8.2-7.5 10-4.3-1.8-7.5-5.4-7.5-10V5.6z" />
      <path d="M8.6 12.1l2.4 2.4 4.4-4.6" />
    </g>
  ),
  trophy: (
    <g fill="currentColor">
      <path d="M7 3h10v6.2a5 5 0 0 1-10 0z" />
      <path d="M7 4.6H3.6v1.6a4 4 0 0 0 3.9 4l-.3-1.6a2.4 2.4 0 0 1-2-2.4h1.8zM17 4.6h3.4v1.6a4 4 0 0 1-3.9 4l.3-1.6a2.4 2.4 0 0 0 2-2.4H17z" />
      <path d="M10.8 13.8h2.4v3.4h-2.4zM8.2 17.4h7.6v1.6H8.2zM7.2 19.4h9.6v1.8H7.2z" />
    </g>
  ),
  warning: (
    <g>
      <path d="M12 3.2L22 20.4H2z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 9.2v5.6" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="12" cy="17.6" r="1.2" fill="#fff" />
    </g>
  ),
  cart: (
    <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 4h2.6l2.4 11h11l2-8H6.3" />
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="17.2" cy="19" r="1.4" />
    </g>
  ),
  fuel: (
    <g>
      <path d="M4.5 4.6A1.6 1.6 0 0 1 6.1 3h6.8a1.6 1.6 0 0 1 1.6 1.6V20.5h-10z" fill="currentColor" />
      <path d="M6.6 5.2h5.8v4.6H6.6z" fill="#fff" opacity=".9" />
      <path d="M3.6 20.6h11.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14.5 9h1.6a1.4 1.4 0 0 1 1.4 1.4v6.4a1.3 1.3 0 0 0 2.6 0V8.6L17.8 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  pound: (
    <path d="M16.6 6.4a4 4 0 0 0-7.3 1.6c-.4 2 .7 4.1.7 6.4 0 2.2-1.2 4.4-3.3 5.6h10.4M6.6 12.4h7.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chart: (
    <g>
      <path d="M3.5 3.5v17h17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.3 14.2h2.1v5.4H6.3zM9.9 12.2H12v7.4H9.9zM13.5 15h2.1v4.6h-2.1zM17.1 10.6h2.1v9h-2.1z" fill="currentColor" />
      <path d="M6.4 11.2l3.6-3.6 3.2 2.8 5.8-5.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  crown: (
    <path d="M3.5 8l4.6 4 3.9-6.4 3.9 6.4 4.6-4-1.6 9.4H5.1zM5.2 20h13.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

// Summary strip icons (filled, as in the reference).
const STAT_ICONS = {
  chart: (
    <g>
      <path d="M3.5 14.5h3.4v6H3.5zM8.7 11.5h3.4v9H8.7zM13.9 8.6h3.4v11.9h-3.4z" fill="currentColor" />
      <path d="M3.6 10.6l5.6-5 3.4 2.6 6.6-5.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.6 2.6h3.8v3.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  shield: ICONS.shield,
  gear: (
    <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round">
      <path d="M10.2 2.8h3.6l.5 2.6 1.9.9 2.2-1.5 2.6 2.6-1.5 2.2.9 1.9 2.6.5v3.6l-2.6.5-.9 1.9 1.5 2.2-2.6 2.6-2.2-1.5-1.9.9-.5 2.6h-3.6l-.5-2.6-1.9-.9-2.2 1.5-2.6-2.6 1.5-2.2-.9-1.9-2.6-.5v-3.6l2.6-.5.9-1.9-1.5-2.2 2.6-2.6 2.2 1.5 1.9-.9z" />
      <circle cx="12" cy="12" r="3.2" />
    </g>
  ),
  book: (
    <g fill="currentColor">
      <path d="M2.2 5.2c3.4-.8 6.6-.4 9.1 1.4v14c-2.5-1.7-5.7-2.1-9.1-1.4z" />
      <path d="M21.8 5.2c-3.4-.8-6.6-.4-9.1 1.4v14c2.5-1.7 5.7-2.1 9.1-1.4z" />
      <path d="M1 7.4h.8v12.4c3.6-.7 7-.2 10.2 1.6 3.2-1.8 6.6-2.3 10.2-1.6V7.4h.8v13.8c-3.7-.9-7.3-.5-11 1.4-3.7-1.9-7.3-2.3-11-1.4z" />
    </g>
  ),
  trophy: ICONS.trophy,
};

function Icon({ name, set = ICONS, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {set[name] || set.shield}
    </svg>
  );
}

function Stars({ filled, total }) {
  return (
    <span className={s.stars} aria-label={`${filled} out of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} aria-hidden="true" viewBox="0 0 24 24" className={i < filled ? s.starOn : s.starOff}>
          <path d="M12 2.6l2.85 6.05 6.65.8-4.9 4.55 1.25 6.6L12 17.35 6.15 20.6l1.25-6.6-4.9-4.55 6.65-.8z" />
        </svg>
      ))}
    </span>
  );
}

// "BMW 3 Series – The Ownership Verdict" -> "BMW 3 Series –" / "The Ownership Verdict"
function splitTitle(title = "") {
  const match = String(title).match(/^(.*?\s[-–—])\s+(.*)$/);
  return match ? { before: match[1], accent: match[2] } : { before: String(title), accent: "" };
}

// Picks a leading rating / warning / medal glyph off a call so it can be drawn as an icon.
function parseCall(text = "") {
  const str = String(text);
  const stars = str.match(/^([★☆]+)\s*/);
  if (stars) {
    return { lead: "stars", filled: (stars[1].match(/★/g) || []).length, total: stars[1].length, html: str.slice(stars[0].length) };
  }
  const warn = str.match(/^⚠️?\s*/);
  if (warn) return { lead: "warning", html: str.slice(warn[0].length) };
  const medal = str.match(/^🥇\s*/);
  if (medal) return { lead: "medal", html: str.slice(medal[0].length) };
  return { lead: null, html: str };
}

function callHtml(html) {
  // Line breaks in the copy were set for the old type size; let the text wrap to the column instead.
  return html.replace(/\s*<br[^>]*>\s*/g, " ").replace(/\[BMW-VERIFIED\]/g, `<span class="${s.verified}">[BMW-VERIFIED]</span>`);
}

function Call({ text }) {
  const call = parseCall(text);

  if (call.lead === "stars") {
    return (
      <p className={s.call}>
        <Stars filled={call.filled} total={call.total} />
        <span dangerouslySetInnerHTML={{ __html: callHtml(call.html) }} />
      </p>
    );
  }

  if (call.lead) {
    return (
      <div className={`${s.call} ${s.hanging} ${call.lead === "medal" ? s.hangMedal : ""}`}>
        {call.lead === "warning" ? (
          <Icon name="warning" className={s.warnIcon} />
        ) : (
          <span className={s.medal} aria-hidden="true">🥇</span>
        )}
        <p dangerouslySetInnerHTML={{ __html: callHtml(call.html) }} />
      </div>
    );
  }

  return <p className={s.call} dangerouslySetInnerHTML={{ __html: callHtml(call.html) }} />;
}

function VerdictShield() {
  // each copy (desktop / phone placement) needs its own gradient ids: a hidden copy's defs don't paint
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden="true" viewBox="0 0 80 92" className={s.shieldArt}>
      <defs>
        <linearGradient id={`${id}e`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={s.shieldEdgeA} />
          <stop offset="1" className={s.shieldEdgeB} />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={s.shieldFaceA} />
          <stop offset="1" className={s.shieldFaceB} />
        </linearGradient>
      </defs>
      <path d="M40 2l36 13v26c0 23-15.5 41-36 49C19.5 82 4 64 4 41V15z" fill={`url(#${id}e)`} />
      <path d="M40 10.5l28.5 10.3V41c0 18.4-12.1 32.9-28.5 40C23.6 73.9 11.5 59.4 11.5 41V20.8z" fill={`url(#${id}f)`} />
      <path d="M26.5 45.5l9.5 9.5 18-19" fill="none" className={s.shieldTick} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OwnershipVerdict({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const title = splitTitle((isDark && data.h2Dark) || data.h2);
  const [metricHead, callHead] = data.tableHeaders || ["Verdict Metric", "Our Call"];
  const stats = data.summaryStats || [];
  // A full scene photo (car on its own backdrop) when the model has one, else the car cut-out.
  const scene = isDark ? data.sceneDark : data.scene;
  const cutout = scene ? null : data.image;

  return (
    <section className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={`site-container ${s.frame}`}>
        <div className={s.inner}>
          {scene ? (
            <div className={s.art} aria-hidden="true">
              <div className={s.scene}>
                <Image src={scene} alt="" fill sizes="(min-width: 1024px) 75vw, 100vw" />
              </div>
              {/* light reference: the skyline carries on past the table's right edge */}
              {!isDark ? (
                <div className={s.sceneEdge}>
                  <Image src={scene} alt="" fill sizes="75vw" />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={s.top}>
            <div className={s.left}>
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

              <div className={s.carSlot}>
                {cutout ? (
                  <Image src={cutout} alt="" fill className={s.cutout} sizes="(min-width: 1024px) 560px, 45vw" />
                ) : null}
              </div>

              {data.oneLineVerdict ? (
                <div className={`${s.verdict} ${s.verdictDesktop}`}>
                  <VerdictShield />
                  <svg aria-hidden="true" viewBox="0 0 24 20" className={s.quote}>
                    <path d="M2 2h8v7.5c0 4.6-2.6 7.6-6.9 8.5l-1-2.3c2.3-.8 3.4-2.4 3.5-4.7H2zM14 2h8v7.5c0 4.6-2.6 7.6-6.9 8.5l-1-2.3c2.3-.8 3.4-2.4 3.5-4.7H14z" />
                  </svg>
                  <p className={s.verdictLabel}>{data.oneLineVerdictLabel || "One-line verdict:"}</p>
                  <p className={s.verdictText} dangerouslySetInnerHTML={{ __html: data.oneLineVerdict }} />
                </div>
              ) : null}
            </div>

            <div className={s.table} role="table">
              <div className={s.head} role="row">
                <span role="columnheader">{metricHead}</span>
                <span role="columnheader">{callHead}</span>
              </div>
              {(data.metrics || []).map((row) => {
                const [fallbackIcon, fallbackTone] = metricIcons[row.metric] || ["shield", "blue"];
                const tone = row.tone || fallbackTone;
                return (
                  <div key={row.metric} className={`${s.row} ${s[`tone_${tone}`] || ""}`} role="row">
                    <div className={s.metric} role="cell">
                      <span className={s.iconCircle}>
                        <Icon name={row.icon || fallbackIcon} className={s.rowIcon} />
                      </span>
                      <span className={s.metricLabel} dangerouslySetInnerHTML={{ __html: row.metric }} />
                    </div>
                    <div className={s.callCell} role="cell">
                      <Call text={row.ourCall} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {data.oneLineVerdict ? (
            <div className={`${s.verdict} ${s.verdictMobile}`}>
              <VerdictShield />
              <svg aria-hidden="true" viewBox="0 0 24 20" className={s.quote}>
                <path d="M2 2h8v7.5c0 4.6-2.6 7.6-6.9 8.5l-1-2.3c2.3-.8 3.4-2.4 3.5-4.7H2zM14 2h8v7.5c0 4.6-2.6 7.6-6.9 8.5l-1-2.3c2.3-.8 3.4-2.4 3.5-4.7H14z" />
              </svg>
              <p className={s.verdictLabel}>{data.oneLineVerdictLabel || "One-line verdict:"}</p>
              <p className={s.verdictText} dangerouslySetInnerHTML={{ __html: data.oneLineVerdict }} />
            </div>
          ) : null}

          {stats.length > 0 ? (
            <ul className={s.stats}>
              {stats.map((stat) => (
                <li key={`${stat.value}-${stat.label}`} className={`${s.stat} ${s[`stat_${stat.iconKey}`] || ""}`}>
                  <span className={s.statIcon}>
                    <Icon name={stat.iconKey} set={STAT_ICONS} />
                  </span>
                  <p className={s.statText}>
                    {stat.value ? <strong className={s.statValue} dangerouslySetInnerHTML={{ __html: stat.value }} /> : null}
                    <span dangerouslySetInnerHTML={{ __html: stat.label }} />
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
