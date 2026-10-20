"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./ModelHero.module.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// Line icons drawn to match the reference (24px grid, stroke = currentColor).
const ICON_PATHS = {
  chart: ["M3 13h4v8H3z", "M10 9h4v12h-4z", "M17 3h4v18h-4z"],
  wrench: [
    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  ],
  book: [
    "M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z",
    "M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z",
    "M5 8.5h3.5M5 11.5h3.5M5 14.5h3.5M15.5 8.5H19M15.5 11.5H19M15.5 14.5H19",
  ],
  trophy: [
    "M7 3h10v6a5 5 0 0 1-10 0z",
    "M7 5H4.5a2.5 2.5 0 0 0 2.6 4.6M17 5h2.5a2.5 2.5 0 0 1-2.6 4.6",
    "M12 14v3M9.5 17h5l1 4h-7z",
  ],
  shield: [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12 2 2 4-4",
  ],
  arrow: ["M5 12h14", "m13 6 6 6-6 6"],
};

const STAT_ICONS = ["chart", "wrench", "book", "trophy"];

function LineIcon({ name, className, strokeWidth = 1.8 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function EngineIcon({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M7 4v2h3v2H7l-2 2v3H3v-3H1v8h2v-3h2v3h3l2 2h8v-4h2v3h3V9h-3v3h-2V8h-6V6h3V4z" />
    </svg>
  );
}

// "BMW 3 Series • 1975–Present • 7 Generations • M10, M20, ..." -> brand, middle parts, engines.
function splitTagPill(tagPill = "") {
  const parts = String(tagPill).split(/\s*•\s*/).filter(Boolean);
  const hasEngines = parts.length > 2;
  return {
    brand: parts[0] || "",
    meta: hasEngines ? parts.slice(1, -1) : parts.slice(1),
    engines: hasEngines ? parts[parts.length - 1] : "",
  };
}

// "3 Series Engines - The Complete UK Guide" -> ["3 Series Engines", "The Complete ", "UK Guide"]
function splitTitle(h1 = "") {
  const match = String(h1).match(/^(.*?)\s*[-–—]\s*(.*)$/);
  const first = match ? match[1] : "";
  const rest = match ? match[2] : String(h1);
  const accentAt = rest.indexOf("UK Guide");
  return {
    first,
    plain: accentAt === -1 ? rest : rest.slice(0, accentAt),
    accent: accentAt === -1 ? "" : rest.slice(accentAt),
  };
}

// Dashes as in the reference, the enquiry count and the [BMW-VERIFIED] tag picked out.
function copyHtml(text = "") {
  return String(text)
    .replace(/\s+-\s+/g, " — ")
    .replace(/(\d[\d,]*\+)/, `<span class="${s.num}">$1</span>`)
    .replace(/(\[[A-Z][A-Z -]+\])/g, `<span class="${s.verified}">$1</span>`);
}

// Trust strip label -> the pieces each stat shows:
// "826+ Enquiries (2025) [BMW-VERIFIED] - #1 Most-Enquired BMW Model" -> value, label, tag, detail.
function parseStat(item, index) {
  let text = String(item.label || "");
  const tag = text.match(/\[[^\]]+\]/)?.[0] || "";
  if (tag) text = text.replace(tag, " ");
  const [main = "", ...rest] = text.split(/\s+[-–—]\s+/);
  const clean = main.replace(/\s+/g, " ").trim();
  const base = { tag, detail: rest.join(" – ").trim(), note: item.note || "" };

  if (/^part of\s/i.test(clean)) {
    return { ...base, shape: "partof", pre: clean.slice(0, 7), label: clean.slice(8) };
  }

  const [first, ...words] = clean.split(" ");
  if (!/^[\d.,]+\+?$/.test(first)) return { ...base, shape: "plain", label: clean };
  if (tag || base.detail) return { ...base, shape: "tagged", value: first, label: words.join(" ") };
  if (index === 1 && words.length > 1) {
    return { ...base, shape: "split", value: first, label: words[0], sub: words.slice(1).join(" ") };
  }
  return { ...base, shape: "stack", value: first, label: words.join(" ") };
}

function Stat({ item, index }) {
  const stat = parseStat(item, index);

  return (
    <li className={`${s.stat} ${s[stat.shape]}`}>
      <span className={s.statIcon}>
        <LineIcon name={STAT_ICONS[index] || "chart"} strokeWidth={1.6} />
      </span>
      <div className={s.statBody}>
        <p className={s.statHead}>
          {stat.pre ? <span className={s.pre}>{stat.pre}</span> : null}
          {stat.value ? <strong className={s.value}>{stat.value}</strong> : null}
          {stat.label ? <span className={s.label}>{stat.label}</span> : null}
        </p>
        {stat.sub ? <p className={s.statSub}>{stat.sub}</p> : null}
        {stat.tag ? (
          <p className={s.statTag}>
            {stat.tag}
            {stat.detail ? <span className={s.tagDash}> —</span> : null}
          </p>
        ) : null}
        {stat.note ? <p className={s.statNote}>{stat.note}</p> : null}
      </div>
      {stat.detail ? <p className={s.statDetail}>{stat.detail}</p> : null}
    </li>
  );
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  const upperRef = useRef(null);
  const wrapRef = useRef(null);
  const flowRef = useRef(null);
  const copyRef = useRef(null);

  // Phones: size the invisible float beside the paragraph so its lines follow the diagonal.
  // Its shape depends on where the paragraph starts and how tall it ends up, so settle in a few passes.
  useLayoutEffect(() => {
    const upper = upperRef.current;
    const wrap = wrapRef.current;
    const flow = flowRef.current;
    const copy = copyRef.current;
    if (!upper || !wrap || !flow || !copy) return undefined;

    let width = 0;
    const fit = () => {
      if (getComputedStyle(flow).display === "none") {
        wrap.style.removeProperty("--flow-top");
        wrap.style.removeProperty("--flow-h");
        return;
      }
      wrap.style.setProperty("--flow-top", `${wrap.getBoundingClientRect().top - upper.getBoundingClientRect().top}px`);
      let height = 0;
      for (let pass = 0; pass < 6; pass += 1) {
        const next = Math.ceil(copy.getBoundingClientRect().bottom - wrap.getBoundingClientRect().top);
        if (Math.abs(next - height) < 1) break;
        height = next;
        wrap.style.setProperty("--flow-h", `${height}px`);
      }
    };

    fit();
    document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(([entry]) => {
      if (Math.round(entry.contentRect.width) === width) return;
      width = Math.round(entry.contentRect.width);
      fit();
    });
    observer.observe(upper);
    return () => observer.disconnect();
  }, [data?.subHeadline, data?.h1, data?.tagPill]);

  if (!data) return null;

  const isDark = theme === "dark";
  const pill = splitTagPill(data.tagPill);
  const title = splitTitle(data.h1);
  const scene = (!isDark && data.heroSceneLight) || data.heroScene;
  const ctaHref = data.primaryCta?.href && data.primaryCta.href !== "#" ? data.primaryCta.href : "/quote";

  return (
    <section className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.card}>
          <div ref={upperRef} className={s.upper}>
            {scene ? (
              <div className={s.art} aria-hidden="true">
                <div className={s.panel}>
                  <div className={s.inner}>
                    <div className={s.sky} />
                    <div className={s.photo}>
                      <Image src={scene.src} alt="" fill sizes="(min-width: 1024px) 70vw, 130vw" priority />
                      <div className={s.wash} />
                    </div>
                  </div>
                </div>
                <div className={s.spill}>
                  <Image src={scene.src} alt="" fill sizes="70vw" />
                </div>
                <div className={s.stripe} />
                <div className={s.scrim} />
              </div>
            ) : null}

            <div className={s.content}>
              <div className={s.pill}>
                <LineIcon name="shield" className={`${s.pillIcon} ${s.pillShield}`} strokeWidth={1.9} />
                {pill.engines ? <EngineIcon className={`${s.pillIcon} ${s.pillEngineCol}`} /> : null}
                <p className={s.pillText}>
                  <span className={s.pillMeta}>
                    <span className={s.pillBrand} dangerouslySetInnerHTML={{ __html: pill.brand }} />
                    {pill.meta.map((part) => (
                      <span key={part}>
                        <span className={s.dot} aria-hidden="true">•</span>
                        <span dangerouslySetInnerHTML={{ __html: part }} />
                      </span>
                    ))}
                  </span>
                  {pill.engines ? (
                    <>
                      <span className={`${s.dot} ${s.pillSep}`} aria-hidden="true">•</span>
                      <EngineIcon className={s.pillEngineInline} />
                      <span className={s.pillEngines} dangerouslySetInnerHTML={{ __html: pill.engines }} />
                    </>
                  ) : null}
                </p>
              </div>

              <h1 className={s.title}>
                {title.first ? (
                  <>
                    <span dangerouslySetInnerHTML={{ __html: title.first }} />{" "}
                    {/* The references use an en dash, except the dark desktop one (em dash). */}
                    <span className={s.dashEn}>–</span>
                    <span className={s.dashEm}>—</span>
                    <br />
                  </>
                ) : null}
                <span dangerouslySetInnerHTML={{ __html: title.plain }} />
                {title.accent ? <span className={s.titleAccent} dangerouslySetInnerHTML={{ __html: title.accent }} /> : null}
              </h1>

              <div ref={wrapRef} className={s.copyWrap}>
                <span ref={flowRef} className={s.copyFlow} aria-hidden="true" />
                <p ref={copyRef} className={s.copy} dangerouslySetInnerHTML={{ __html: copyHtml(data.subHeadline) }} />
              </div>

              {data.primaryCta ? (
                <Link href={ctaHref} className={s.cta}>
                  <span dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*(?:→|â†’)\s*$/, "") }} />
                  <LineIcon name="arrow" strokeWidth={2.2} />
                </Link>
              ) : null}
            </div>
          </div>

          {data.trustStrip?.length > 0 ? (
            <ul className={s.stats}>
              {data.trustStrip.map((item, index) => (
                <Stat key={item.label} item={item} index={index} />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
