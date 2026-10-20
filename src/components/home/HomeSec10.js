"use client";

import Image from "next/image";
import { useState } from "react";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";
import { MobileCard, MobileHeading, MobileLead } from "@/components/home/mobileKit";

// BMW Market Intelligence — header with stats card, then six data panels (3 × 2 on desktop).
// On phones the first three panels are accordions (closed until tapped), the rest stay open.

function PanelIcon({ name, className = "h-7 w-7" }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "engine":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M7 5h7v2h-2v2h3l2 2h2v-2h2v8h-2v-2h-2l-2 3H9l-2-3H5v2H3V9h2v2h2V9h3V7H7V5Z" />
        </svg>
      );
    case "car":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M5.5 10 7 5.5A2 2 0 0 1 8.9 4h6.2a2 2 0 0 1 1.9 1.5L18.5 10H20a1 1 0 0 1 1 1v6h-2v2h-3v-2H8v2H5v-2H3v-6a1 1 0 0 1 1-1h1.5Zm2.2 0h8.6l-1.2-3.8H8.9L7.7 10ZM6.5 14.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm11 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" />
        </svg>
      );
    case "pound":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
          <circle cx="12" cy="12" r="10" />
          <path d="M15 8.5a2.8 2.8 0 0 0-5 1.7V17m-1.5-4H13M8.5 17h7" />
        </svg>
      );
    case "warning":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="#f5a20b" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 3 2 21h20L12 3Z" />
          <path d="M12 10v5m0 3h.01" strokeLinecap="round" />
        </svg>
      );
    case "globe":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2c2.8 3 4 6.4 4 10s-1.2 7-4 10c-2.8-3-4-6.4-4-10s1.2-7 4-10Z" />
        </svg>
      );
    case "pulse":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M2 12h4l2-5 4 12 3-9 2 2h5" />
        </svg>
      );
    case "users":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
          <circle cx="9" cy="7" r="3.5" />
          <circle cx="17" cy="8" r="2.8" />
          <path d="M2 20c0-4 3-7 7-7s7 3 7 7H2Zm15 0c0-2.4-.8-4.6-2.2-6.2A5 5 0 0 1 22.5 18v2H17Z" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M20 6v5h-5M4 18v-5h5M18.2 9A7 7 0 0 0 6.7 6.7L4 9m2 6a7 7 0 0 0 11.3 2.3L20 15" />
        </svg>
      );
  }
}

const DONUT_PARTS = [
  [0.47, "#0b50e3"],
  [0.13, "#2f6fef"],
  [0.15, "#6f9ef4"],
  [0.13, "#a9c4f7"],
  [0.12, "#d4e2fb"],
];

// Ring chart: the reference draws London as the dark right half, then lighter blues anticlockwise.
function Donut({ size, inner, isDark }) {
  const stops = DONUT_PARTS.reduce((acc, [v, c], i) => {
    const from = i ? acc[i - 1].to : 0;
    return acc.concat({ from, to: from + v, c: isDark && i === 4 ? "#6c8fd6" : c });
  }, []);
  const bg = `conic-gradient(${stops.map((s) => `${s.c} ${s.from * 360}deg ${s.to * 360}deg`).join(",")})`;
  return (
    <span aria-hidden="true" className="absolute rounded-full" style={{ width: size, height: size, background: bg, WebkitMask: `radial-gradient(circle, transparent ${inner / 2}px, black ${inner / 2 + 0.5}px)`, mask: `radial-gradient(circle, transparent ${inner / 2}px, black ${inner / 2 + 0.5}px)` }} />
  );
}

// Arial cap-height offset: where a capital's top sits inside a line box of height lh.
const capOffset = (fs, lh) => (lh - 1.117 * fs) / 2 + 0.189 * fs;

function Cap({ as: Tag = "span", left, right, cap, fs, lh, className = "", style, children }) {
  const l = lh ?? fs * 1.2;
  return (
    <Tag className={`absolute ${className}`} style={{ left, right, top: cap - capOffset(fs, l), fontSize: fs, lineHeight: `${l}px`, ...style }}>
      {children}
    </Tag>
  );
}

// "1,450 [BMW-VERIFIED]" -> value + source tag.
const split = (t) => {
  const m = t.match(/^(.*?)\s*(\[.*\])$/);
  return m ? [m[1], m[2]] : [t, ""];
};

const RISK_BG = { catastrophic: "#e1251f", immediate: "#f47b20", monitor: "#f7b500", low: "#22a447" };

// Desktop spec measured on the 1536px references (Section 10.1.png light, Section 10.png dark).
// Section-relative tops; card x/y values are relative to each card's top-left.
const SPEC = {
  light: {
    h: 947, h2: { left: 38, caps: 55, fs: 46.5, lh: 51, track: "-0.03em" }, p: { left: 40, cap: 209, fs: 15.9, lh: 25 },
    backdrop: { left: 600, top: 1, w: 596, h: 290 }, car: { left: 709.9, top: -51, width: 469.7 },
    stats: { left: 1200, top: 23, w: 283, h: 251 },
    cols: [[37, 548], [562, 969], [984, 1484]], rows: [[295, 323], [635, 246]],
    footer: { line: 898, cap: 912 },
  },
  dark: {
    h: 944, h2: { left: 36, caps: 53, fs: 46.5, lh: 50, track: "-0.035em" }, p: { left: 37, cap: 207, fs: 15.2, lh: 24.5 },
    backdrop: { left: 600, top: 1, w: 592, h: 287 }, car: { left: 706.5, top: -55, width: 473.4 },
    stats: { left: 1197, top: 27, w: 292, h: 240 },
    cols: [[32, 543], [560, 970], [987, 1489]], rows: [[290, 324], [631, 245]],
    footer: { line: 893, cap: 909 },
  },
};

const COL = {
  light: { bg: "#ffffff", h2: "#05070f", accent: "#0b4fe0", para: "#262b3d", card: "#ffffff", border: "#e8ebf0", line: "#edf0f3", text: "#0b1236", soft: "#2a2f40", blue: "#0b4fe0", tag: "#2a63e6", icon: "#0b4fe0", shadow: "0 2px 12px rgba(16,24,48,0.04)" },
  dark: { bg: "#03080f", h2: "#ffffff", accent: "#2f7bec", para: "#e3e6ea", card: "#0a1119", border: "#273140", line: "#1d2631", text: "#ffffff", soft: "#dfe3e8", blue: "#3b82f6", tag: "#3b82f6", icon: "#2f7bec", shadow: "none" },
};

// Card internals (shared by both themes), measured on the light reference.
const K = {
  head: { icon: [17, 17, 36], title: { left: 62, cap: 25, fs: 15.5 } },
  eng: { hdrLine: 58, hdrCap: 68, hdrLine2: 86, hdrX: [19, 81, 224, 383], row0: 98, pitch: 31.5, rankCx: 33.5, codeX: 82, labelCx: 250.5, enqRight: 22, fs: 15, label: 14, hdr: 11, dividers: [61, 176, 329] },
  mod: { hdrLine: 61, hdrCap: 71, hdrLine2: 88, hdrX: [22, 72, 274], row0: 102, pitch: 37.8, rankCx: 32.5, modelX: 73, enqX: 253, fs: 14.3, dividers: [58, 233] },
  cost: { sub: { cap: 40, fs: 13.6 }, hdrLine: 65, hdrCap: 76, hdrLine2: 93, hdrX: [25, 245], row0: 106, pitch: 32.7, codeX: 25, costX: 188, fs: 15, divider: 153 },
  fail: { hdrLine: 49, hdrCap: 60, hdrLine2: 75, hdrX: [17, 75, 411], row0: 87, pitch: 33.75, rankCx: 30, failX: 75, pillX: 395, pill: [95, 21], fs: 13, dividers: [] },
  reg: { donut: { cx: 90, cy: 136, d: 151, inner: 74 }, dotX: 186, labelX: 206, pctX: 289, tagX: 322, row0: 75, pitch: 45, fs: 12.5 },
  feed: { hdrLine: 60, hdrCap: 74, hdrLine2: 93, hdrX: [21, 156, 285, 409], row0: 110, pitch: 52, x: [18, 156, 257, 406], fs: 14.8 },
};

// Dark reference: same cards, slightly different inner rhythm.
const KD = {
  ...K,
  eng: { ...K.eng, hdrLine: 53, hdrCap: 63, hdrLine2: 80, row0: 91, pitch: 30.67, enqRight: 24 },
  mod: { ...K.mod, row0: 103, pitch: 39 },
  cost: { ...K.cost, row0: 107, pitch: 31.8 },
  fail: { ...K.fail, row0: 90, pillDy: 3 },
  reg: { ...K.reg, row0: 79, pitch: 43, donut: { ...K.reg.donut, cy: 139 } },
  feed: { ...K.feed, x: [11, 149, 250, 399], hdrX: [16, 151, 280, 404] },
};

function CardHead({ title, icon, C, sub, at }) {
  const [ix, iy, tx, tc] = at;
  const t = title.replace(/\s*\(2025\)$/, "");
  const yr = /\(2025\)$/.test(title);
  return (
    <>
      <span className="absolute" style={{ left: ix - 3, top: iy - 6, width: K.head.icon[2], height: K.head.icon[2], color: C.icon }}>
        <PanelIcon name={icon} className="h-full w-full" />
      </span>
      <Cap as="h3" left={tx} cap={tc - (sub ? 4 : 0)} fs={K.head.title.fs} className="whitespace-nowrap" style={{ color: C.text }}>
        <span className="uppercase">{t}</span>
        {yr ? " (2025)" : ""}
      </Cap>
      {sub ? <Cap left={tx} cap={K.cost.sub.cap - 7} fs={K.cost.sub.fs} className="whitespace-nowrap uppercase" style={{ color: C.text }}>({sub})</Cap> : null}
    </>
  );
}

function Desktop({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const S = SPEC[t];
  const C = COL[t];
  const card = (ci, ri) => ({ left: S.cols[ci][0], width: S.cols[ci][1] - S.cols[ci][0], top: S.rows[ri][0], height: S.rows[ri][1], background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow });
  const hline = (top, inset = 0) => <span aria-hidden="true" className="absolute" style={{ left: inset, right: inset, top, height: 1, background: C.line }} />;
  const vline = (left, top, bottom) => <span key={left} aria-hidden="true" className="absolute" style={{ left, top, bottom, width: 1, background: C.line }} />;
  const hdr = (labels, xs, cap, fs = 11) => labels.map((l, i) => <Cap key={l} left={xs[i]} cap={cap} fs={fs} className="whitespace-nowrap uppercase" style={{ color: TABLE_HEADER_TEXT }}>{l}</Cap>);
  const band = (top, bottom) => <span aria-hidden="true" className="absolute inset-x-0" style={{ top, height: bottom - top + 1, background: TABLE_HEADER_BG }} />;
  const Kt = isDark ? KD : K;
  const E = Kt.eng, M = Kt.mod, R = Kt.cost, F = Kt.fail, G = Kt.reg, L = Kt.feed;

  return (
    <div className="relative mx-auto hidden w-full max-w-[1536px] overflow-hidden lg:block" style={{ height: S.h }}>
      <span aria-hidden="true" className="pointer-events-none absolute [mask-image:linear-gradient(90deg,transparent,black_12%,black_97%,transparent)]" style={{ left: S.backdrop.left, top: S.backdrop.top, width: S.backdrop.w, height: S.backdrop.h }}>
        <Image src={data.headerImage.backdrop[t]} alt="" fill sizes="600px" className="object-cover" />
      </span>
      <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: S.car.left, top: S.car.top, width: S.car.width }}>
        <Image src={data.headerImage[t]} alt={data.headerImage.alt} width={662} height={504} sizes="470px" className={`relative h-auto w-full ${isDark ? "" : "mix-blend-multiply"}`} style={{ filter: isDark ? "brightness(0.52) contrast(1.2)" : "brightness(1.55)" }} />
        {isDark ? <span className="absolute inset-0 mix-blend-multiply" style={{ background: "#9fb2d0", WebkitMask: `url("${data.headerImage.dark}") center / 100% 100% no-repeat`, mask: `url("${data.headerImage.dark}") center / 100% 100% no-repeat` }} /> : null}
      </div>

      <h2 className="absolute whitespace-nowrap font-bold [&_.heading-accent]:!text-[var(--acc)]" style={{ left: S.h2.left, top: S.h2.caps - capOffset(S.h2.fs, S.h2.lh), fontSize: S.h2.fs, lineHeight: `${S.h2.lh}px`, letterSpacing: S.h2.track, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
      <Cap as="p" left={S.p.left} cap={S.p.cap} fs={S.p.fs} lh={S.p.lh} className="whitespace-pre" style={{ color: C.para }}>{data.subHeadlineDesktop}</Cap>

      {/* Stats */}
      <div className="absolute rounded-[8px]" style={{ left: S.stats.left, top: S.stats.top, width: S.stats.w, height: S.stats.h, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        {data.stats.map((st, i) => {
          const y = [0, 80, 160][i];
          const big = i < 2;
          return (
            <span key={st.label}>
              {i ? <span aria-hidden="true" className="absolute" style={{ left: 18, right: 18, top: y + 12, height: 1, background: C.line }} /> : null}
              <span className="absolute" style={{ left: 22, top: y + 30, width: 36, height: 36, color: C.icon }}>
                <PanelIcon name={st.icon} className="h-full w-full" />
              </span>
              {big ? (
                <>
                  <Cap left={82} cap={y + (isDark ? 30 : 31)} fs={29} className="whitespace-nowrap" style={{ color: C.text }}>{st.value}</Cap>
                  <Cap left={82} cap={y + 67} fs={13.2} className="whitespace-nowrap" style={{ color: C.soft }}>{st.label}</Cap>
                </>
              ) : (
                <>
                  <Cap left={82} cap={y + (isDark ? 26 : 32)} fs={13.6} className="whitespace-nowrap" style={{ color: C.soft }}>{st.value}</Cap>
                  <Cap left={82} cap={y + (isDark ? 46 : 52)} fs={13.6} className="whitespace-nowrap" style={{ color: C.soft }}>{st.label}</Cap>
                </>
              )}
            </span>
          );
        })}
      </div>

      {/* Engines */}
      <div className="absolute overflow-hidden rounded-[8px]" style={card(0, 0)}>
        <CardHead title={data.engines.title} icon={data.engines.icon} C={C} at={isDark ? [14, 16, 60, 23] : [17, 17, 62, 25]} />
        {band(E.hdrLine, E.hdrLine2)}
        {hdr(data.engines.columns, E.hdrX, E.hdrCap, E.hdr)}
        {E.dividers.map((d) => vline(d, E.hdrLine2 + 4, 10))}
        {data.engines.rows.map((r, i) => {
          const cap = E.row0 + i * E.pitch;
          const [v, tag] = split(r.enquiries);
          return (
            <span key={r.code}>
              {i ? hline(cap - 12) : null}
              <Cap left={E.rankCx - 10} cap={cap} fs={16} className="w-[20px] text-center" style={{ color: C.blue }}>{r.rank}</Cap>
              <Cap left={E.codeX} cap={cap} fs={E.fs} className="whitespace-nowrap font-bold" style={{ color: C.text }}>{r.code}</Cap>
              <Cap left={E.labelCx - 60} cap={cap} fs={E.label} className="w-[120px] whitespace-nowrap text-center" style={{ color: C.soft }}>{r.label}</Cap>
              <Cap right={E.enqRight} cap={cap} fs={13.2} className="whitespace-nowrap" style={{ color: C.tag }}>
                <span className="font-bold" style={{ color: C.blue }}>{v}</span> {tag}
              </Cap>
            </span>
          );
        })}
      </div>

      {/* Models */}
      <div className="absolute overflow-hidden rounded-[8px]" style={card(1, 0)}>
        <CardHead title={data.models.title} icon={data.models.icon} C={C} at={isDark ? [19, 18, 67, 25] : [22, 21, 72, 25]} />
        {band(M.hdrLine, M.hdrLine2)}
        {hdr(data.models.columns, M.hdrX, M.hdrCap, 11)}
        {M.dividers.map((d) => vline(d, M.hdrLine2 + 4, 10))}
        {data.models.rows.map((r, i) => {
          const cap = M.row0 + i * M.pitch;
          const [v, tag] = split(r.enquiries);
          return (
            <span key={r.model}>
              {i ? hline(cap - 15) : null}
              <Cap left={M.rankCx - 10} cap={cap - 1} fs={17} className="w-[20px] text-center" style={{ color: C.blue }}>{r.rank}</Cap>
              <Cap left={M.modelX} cap={cap} fs={M.fs} className="whitespace-nowrap" style={{ color: C.text }}>{r.model}</Cap>
              <Cap left={M.enqX} cap={cap} fs={13.4} className="whitespace-nowrap" style={{ color: C.tag }}>
                <span className="font-bold" style={{ color: C.blue }}>{v}</span> {tag}
              </Cap>
            </span>
          );
        })}
      </div>

      {/* Replacement cost index */}
      <div className="absolute overflow-hidden rounded-[8px]" style={card(2, 0)}>
        <CardHead title={data.replacementCosts.title} icon={data.replacementCosts.icon} C={C} sub={data.replacementCosts.subtitle} at={isDark ? [20, 16, 67, 25] : [23, 24, 69, 25]} />
        {band(R.hdrLine, R.hdrLine2)}
        {hdr(data.replacementCosts.columns, R.hdrX, R.hdrCap, 11)}
        {vline(R.divider, R.hdrLine2 + 4, 10)}
        {data.replacementCosts.rows.map((r, i) => {
          const cap = R.row0 + i * R.pitch;
          const [v, tag] = split(r.cost);
          return (
            <span key={r.code}>
              {i ? hline(cap - 13) : null}
              <Cap left={R.codeX} cap={cap} fs={16} className="whitespace-nowrap font-bold" style={{ color: C.text }}>{r.code}</Cap>
              <Cap left={R.costX} cap={cap} fs={14} className="whitespace-nowrap" style={{ color: C.tag }}>
                <span style={{ color: C.soft }}>{v}</span> {tag}
              </Cap>
            </span>
          );
        })}
      </div>

      {/* Failures */}
      <div className="absolute overflow-hidden rounded-[8px]" style={card(0, 1)}>
        <CardHead title={data.failures.title} icon={data.failures.icon} C={C} at={isDark ? [19, 12, 60, 21] : [17, 10, 62, 21]} />
        {band(F.hdrLine, F.hdrLine2)}
        {hdr(data.failures.columns, F.hdrX, F.hdrCap, 11)}
        {data.failures.rows.map((r, i) => {
          const cap = F.row0 + i * F.pitch;
          const m = r.failure.match(/^(.*?)\s*(\(.*\))$/);
          return (
            <span key={r.rank}>
              {i ? hline(cap - 12) : null}
              <Cap left={F.rankCx - 10} cap={cap - 1} fs={17} className="w-[20px] text-center" style={{ color: C.blue }}>{r.rank}</Cap>
              <Cap left={F.failX} cap={cap} fs={F.fs} className="whitespace-nowrap" style={{ color: C.soft }}>
                {m ? m[1] : r.failure}
                {m ? <span className="text-[10.5px]"> {m[2]}</span> : null}
              </Cap>
              <span className="absolute flex items-center justify-center rounded-[2px] text-white" style={{ left: F.pillX, top: cap - 6 + (F.pillDy || 0), width: F.pill[0], height: F.pill[1], fontSize: 13.5, background: RISK_BG[r.risk.type] }}>{r.risk.label}</span>
            </span>
          );
        })}
      </div>

      {/* Regional demand */}
      <div className="absolute overflow-hidden rounded-[8px]" style={card(1, 1)}>
        <CardHead title={data.regionalDemand.title} icon={data.regionalDemand.icon} C={C} at={isDark ? [20, 13, 68, 24] : [22, 10, 69, 21]} />
        {hline(48)}
        <span className="absolute" style={{ left: G.donut.cx - G.donut.d / 2, top: G.donut.cy - G.donut.d / 2, width: G.donut.d, height: G.donut.d }}>
          <Donut size={G.donut.d} inner={G.donut.inner} isDark={isDark} />
        </span>
        {data.regionalDemand.rows.map((r, i) => {
          const cap = G.row0 + i * G.pitch;
          return (
            <span key={r.region}>
              <span aria-hidden="true" className="absolute rounded-full" style={{ left: G.dotX, top: cap - 1, width: 14, height: 14, background: ["#0b50e3", "#1f5fe8", "#2f6fef", "#4f86f2"][i] }} />
              <Cap left={G.labelX} cap={cap} fs={G.fs} className="whitespace-nowrap" style={{ color: C.text }}>{r.region}</Cap>
              <Cap left={G.pctX} cap={cap} fs={14} className="whitespace-nowrap" style={{ color: C.text }}>{r.percentage}</Cap>
              <Cap left={G.tagX} cap={cap + 1} fs={10.5} className="whitespace-nowrap" style={{ color: C.tag }}>{r.source}</Cap>
            </span>
          );
        })}
      </div>

      {/* Live feed */}
      <div className="absolute overflow-hidden rounded-[8px]" style={card(2, 1)}>
        <CardHead title={data.liveFeed.title} icon={data.liveFeed.icon} C={C} at={isDark ? [16, 14, 59, 23] : [20, 16, 69, 22]} />
        {band(L.hdrLine, L.hdrLine2)}
        {hdr(data.liveFeed.columns, L.hdrX, L.hdrCap, 11)}
        {data.liveFeed.rows.map((r, i) => {
          const cap = L.row0 + i * L.pitch;
          return (
            <span key={r.vehicle}>
              {i ? hline(cap - 25) : null}
              {[r.vehicle, r.location, r.issue, r.timestamp].map((v, j) => (
                <Cap key={j} left={L.x[j]} cap={cap} fs={L.fs} className="whitespace-nowrap" style={{ color: C.soft }}>{v}</Cap>
              ))}
            </span>
          );
        })}
      </div>

      <span aria-hidden="true" className="absolute" style={{ left: S.cols[0][0], right: 1536 - S.cols[2][1], top: S.footer.line, height: 1, background: C.line }} />
      <Cap as="p" left={0} right={46} cap={S.footer.cap} fs={14.7} className="text-center" style={{ color: C.soft }}>
        {data.liveFeed.footer.split("BMWEngines.uk")[0]}
        <span style={{ color: C.blue }}>BMWEngines.uk</span>
        {data.liveFeed.footer.split("BMWEngines.uk")[1]}
      </Cap>
    </div>
  );
}

// Phone / tablet: readable stacked layout (body 17px, entries 16–18px, labels 13px).
function Phone({ data, isDark }) {
  const [open, setOpen] = useState(null);
  const C = COL[isDark ? "dark" : "light"];
  const H = COL.dark;
  const panels = [
    ["engines", data.engines],
    ["models", data.models],
    ["replacementCosts", data.replacementCosts],
  ];
  const head = (p) => (
    <span className="flex items-center gap-3">
      <span className="h-8 w-8 shrink-0" style={{ color: C.icon }}>
        <PanelIcon name={p.icon} className="h-full w-full" />
      </span>
      <span className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.02em]" style={{ color: C.text }}>
        {p.title}
        {p.subtitle ? <span className="block text-[14px] font-semibold normal-case tracking-normal" style={{ color: C.soft }}>({p.subtitle})</span> : null}
      </span>
    </span>
  );
  const valueTag = (text) => {
    const [v, tag] = split(text);
    return (
      <span className="shrink-0 text-right">
        <span className="block text-[17px] font-bold" style={{ color: C.blue }}>{v}</span>
        <span className="block text-[13px]" style={{ color: C.tag }}>{tag}</span>
      </span>
    );
  };

  return (
    <div className="lg:hidden">
      {/* Hero: dark in both themes, as in the reference */}
      <div className="relative overflow-hidden" style={{ background: H.bg }}>
        <div className="relative mx-auto max-w-[720px] px-4 pb-8 pt-10">
          <div className="relative mb-6 h-[200px] overflow-hidden rounded-[16px]">
            <Image src={data.headerImage.backdrop.dark} alt="" fill sizes="720px" className="object-cover" />
            <Image src={data.headerImage.phone} alt={data.headerImage.alt} fill sizes="400px" className="object-contain object-bottom px-4 pt-3" style={{ filter: "brightness(0.66) contrast(1.2)" }} />
          </div>
          <MobileHeading html={data.h2} color="#ffffff" accent={H.accent} />
          <MobileLead color="#e6e9ee">{data.subHeadline}</MobileLead>
          <ul className="mt-6 grid grid-cols-3 rounded-[12px] border" style={{ background: "rgba(14,22,32,0.92)", borderColor: "#253142" }}>
            {data.stats.map((st, i) => (
              <li key={st.label} className="flex flex-col items-center px-2 py-4 text-center" style={{ borderLeft: i ? "1px solid #253142" : undefined }}>
                <span className="h-8 w-8" style={{ color: "#2f7bec" }}>
                  <PanelIcon name={st.icon} className="h-full w-full" />
                </span>
                <span className="mt-2 text-[23px] font-bold leading-tight text-white">{i < 2 ? st.value : null}</span>
                <span className="mt-0.5 text-[14px] leading-[1.35] text-[#d7dbe1]">{i < 2 ? st.label : `${st.value} ${st.label}`}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto grid max-w-[720px] gap-4 px-4 pb-10 pt-6">
        {/* Accordions */}
        {panels.map(([key, p]) => {
          const isOpen = open === key;
          return (
            <MobileCard key={key} C={C}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left">
                {head(p)}
                <svg aria-hidden="true" viewBox="0 0 16 9" className={`h-2.5 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: C.text }}>
                  <path d="M1 1 8 7.5 15 1" />
                </svg>
              </button>
              {isOpen ? (
                <ul className="border-t px-4" style={{ borderColor: C.line }}>
                  {p.rows.map((r, j) => (
                    <li key={j} className="flex items-center gap-3 border-b py-3 last:border-b-0" style={{ borderColor: C.line }}>
                      {r.rank ? <span className="w-5 shrink-0 text-[18px] font-semibold" style={{ color: C.blue }}>{r.rank}</span> : null}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[17px] font-bold" style={{ color: C.text }}>{r.code || r.model}</span>
                        {r.label ? <span className="block text-[15px]" style={{ color: C.soft }}>{r.label}</span> : null}
                      </span>
                      {valueTag(r.enquiries || r.cost)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </MobileCard>
          );
        })}

        {/* Failures */}
        <MobileCard C={C} className="px-4 pt-4">
          {head(data.failures)}
          <ul className="mt-2">
            {data.failures.rows.map((r) => (
              <li key={r.rank} className="flex gap-3 border-t py-3.5" style={{ borderColor: C.line }}>
                <span className="w-5 shrink-0 text-[19px] font-semibold leading-[1.3]" style={{ color: C.blue }}>{r.rank}</span>
                <span className="flex-1">
                  <span className="block text-[17px] leading-[1.45]" style={{ color: C.soft }}>{r.failure}</span>
                  <span className="mt-2 inline-block rounded-[4px] px-2.5 py-1 text-[14px] font-semibold text-white" style={{ background: RISK_BG[r.risk.type] }}>{r.risk.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </MobileCard>

        {/* Regional demand */}
        <MobileCard C={C} className="p-4">
          {head(data.regionalDemand)}
          <div className="mt-4 flex items-center gap-5">
            <span className="relative h-[116px] w-[116px] shrink-0">
              <Donut size={116} inner={56} isDark={isDark} />
            </span>
            <ul className="grid flex-1 gap-2.5">
              {data.regionalDemand.rows.map((r, j) => (
                <li key={r.region} className="flex items-center gap-2.5 text-[16px]" style={{ color: C.text }}>
                  <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ background: ["#0b50e3", "#1f5fe8", "#2f6fef", "#6f9ef4"][j] }} />
                  <span className="flex-1">{r.region}</span>
                  <span className="font-bold">{r.percentage}</span>
                </li>
              ))}
              <li className="text-[13px]" style={{ color: C.tag }}>{data.regionalDemand.rows[0].source}</li>
            </ul>
          </div>
        </MobileCard>

        {/* Live feed */}
        <MobileCard C={C} className="px-4 pt-4">
          {head(data.liveFeed)}
          <ul className="mt-2">
            {data.liveFeed.rows.map((r) => (
              <li key={r.vehicle} className="border-t py-3" style={{ borderColor: C.line }}>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[17px] font-bold" style={{ color: C.text }}>{r.vehicle}</span>
                  <span className="shrink-0 text-[14px]" style={{ color: C.soft }}>{r.timestamp}</span>
                </span>
                <span className="mt-0.5 block text-[16px]" style={{ color: C.soft }}>
                  {r.issue} · {r.location}
                </span>
              </li>
            ))}
          </ul>
        </MobileCard>

        <p className="flex items-center justify-center gap-2 text-center text-[15px]" style={{ color: C.soft }}>
          <span className="h-4 w-4 shrink-0" style={{ color: C.icon }}>
            <PanelIcon name="refresh" className="h-full w-full" />
          </span>
          <span>
            {data.liveFeed.footer.split("BMWEngines.uk")[0]}
            <span style={{ color: C.blue }}>BMWEngines.uk</span>
            {data.liveFeed.footer.split("BMWEngines.uk")[1]}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function HomeSec10({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <ScaleBox width={1536}>
        <Desktop data={data} isDark={isDark} />
      </ScaleBox>
      <Phone data={data} isDark={isDark} />
    </section>
  );
}
