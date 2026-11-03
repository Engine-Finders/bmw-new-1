"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { useTheme } from "@/components/shared/themeProvider";
import s from "./TrustBlock.module.css";
import TrustBlockLegacy from "./TrustBlockLegacy";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

// a space before each break keeps words apart where the break is hidden
const spaced = (html = "") => String(html).replace(/([^-])\s*<br\s*\/?>\s*/g, "$1 <br>");

const ICONS = {
  chart: (
    <g fill="currentColor">
      <rect x="1.8" y="12.4" width="5" height="8.2" rx="0.5" />
      <rect x="9.5" y="7.6" width="5" height="13" rx="0.5" />
      <rect x="17.2" y="2" width="5" height="18.6" rx="0.5" />
      <rect x="0.8" y="21.7" width="22.4" height="1.4" rx="0.4" />
    </g>
  ),
  heart: (
    <path
      d="M12 21.2l-1.4-1.3C5.4 15.2 2 12.1 2 8.3 2 5.2 4.4 2.8 7.5 2.8c1.7 0 3.4.8 4.5 2.1 1.1-1.3 2.8-2.1 4.5-2.1 3.1 0 5.5 2.4 5.5 5.5 0 3.8-3.4 6.9-8.6 11.6z"
      fill="currentColor"
    />
  ),
  wrench: (
    <path
      d="M21.4 6.3l-3.3 3.3-2.9-.8-.8-2.9 3.3-3.3c-2.2-.9-4.8-.4-6.6 1.4-1.8 1.8-2.3 4.4-1.5 6.6L2.9 17.3a2.2 2.2 0 0 0 0 3.1l.7.7a2.2 2.2 0 0 0 3.1 0l6.7-6.7c2.2.8 4.8.3 6.6-1.5 1.8-1.8 2.3-4.4 1.4-6.6z"
      fill="currentColor"
    />
  ),
  shieldStar: (
    <g>
      <path d="M12 1.8l8.6 3.2v6.4c0 5.3-3.6 9.3-8.6 11.1-5-1.8-8.6-5.8-8.6-11.1V5z" fill="currentColor" />
      <path d="M12 7.2l1.35 2.75 3.05.45-2.2 2.15.52 3.03L12 14.15l-2.72 1.43.52-3.03-2.2-2.15 3.05-.45z" fill="#fff" />
    </g>
  ),
};

// per-icon sizing (24-unit grid) so each glyph matches the reference
const FIT = {
  heart: "translate(12 12) scale(1.08 1.09) translate(-12 -12)",
  wrench: "translate(12 12) scale(1.09) translate(-12 -12)",
  shieldStar: "translate(12 11.8) scale(1.03 1.05) translate(-12 -12)",
};

function Icon({ name, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <g transform={FIT[name]}>{ICONS[name]}</g>
    </svg>
  );
}

function Title({ lines, className, as: Tag = "h2" }) {
  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <span key={line}>
          {index ? <br /> : null}
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </span>
      ))}
    </Tag>
  );
}

// Model JSONs migrated to the reference design carry `items`; the rest keep the previous layout.
export default function TrustBlock({ data }) {
  if (!data) return null;
  return data.items ? <TrustBlockReference data={data} /> : <TrustBlockLegacy data={data} />;
}

function TrustBlockReference({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const art = data.art || {};

  return (
    <section id="trust" className={`${inter.className} ${s.section} ${isDark ? s.dark : s.light}`}>
      <div className={s.frame}>
        <div className={s.panel}>
          <div className={s.card}>
            {art.light ? (
              <span className={s.art}>
                <Image src={isDark ? art.dark : art.light} alt="" fill className={s.artImg} sizes="(min-width: 1024px) 54vw, 1px" />
              </span>
            ) : null}
            <Title as="p" lines={data.titleLinesMobile || data.titleLines || [data.h2]} className={`${s.title} ${s.phoneOnly}`} />
            <Title lines={data.titleLines || [data.h2]} className={`${s.title} ${s.deskOnly}`} />
            <ul className={s.items}>
              {data.items.map((item) => (
                <li key={item.title} className={s.item}>
                  <span className={`${s.tile} ${item.icon === "heart" ? s.tileGreen : ""}`}>
                    <Icon name={item.icon} className={s.tileIcon} />
                  </span>
                  <p className={s.text}>
                    <strong>{item.title}</strong>{" "}
                    <span className={s.deskInline} dangerouslySetInnerHTML={{ __html: spaced(item.text) }} />
                    <span className={s.phoneInline} dangerouslySetInnerHTML={{ __html: spaced(item.textMobile || item.text) }} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
