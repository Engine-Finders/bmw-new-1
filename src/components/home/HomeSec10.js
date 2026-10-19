"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";

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
  const hdr = (labels, xs, cap, fs = 11) => labels.map((l, i) => <Cap key={l} left={xs[i]} cap={cap} fs={fs} className="whitespace-nowrap uppercase" style={{ color: C.text }}>{l}</Cap>);
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
        {hline(E.hdrLine)}
        {hdr(data.engines.columns, E.hdrX, E.hdrCap, E.hdr)}
        {hline(E.hdrLine2)}
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
        {hline(M.hdrLine)}
        {hdr(data.models.columns, M.hdrX, M.hdrCap, 11)}
        {hline(M.hdrLine2)}
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
        {hline(R.hdrLine)}
        {hdr(data.replacementCosts.columns, R.hdrX, R.hdrCap, 11)}
        {hline(R.hdrLine2)}
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
        {hline(F.hdrLine)}
        {hdr(data.failures.columns, F.hdrX, F.hdrCap, 11)}
        {hline(F.hdrLine2)}
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
        {hline(L.hdrLine)}
        {hdr(data.liveFeed.columns, L.hdrX, L.hdrCap, 11)}
        {hline(L.hdrLine2)}
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

// Phone spec measured on Section 10.2.png (panel 1 = first screen, panel 2 = engines opened). CSS px at 503.
const PH = {
  heroH: 569, inset: [25, 23],
  car: { left: 293.9, top: 13.7, width: 390 }, backdrop: { left: 331, top: 1, w: 172, h: 397 },
  h2: { left: 27, cap: 64, fs: 35, lh: 39.75, track: "-0.03em" }, p: { left: 27, cap: 273, fs: 16.2, lh: 23.75 },
  stats: { top: 404, h: 149, cx: [78, 222, 362], iconTop: 15, icon: [50, 44], valueCap: 69, value: 22, labelCap: 97, label: 14.2, labelLh: 20 },
  acc: { tops: [6, 8, 6.5], h: 74, icon: [14, 13, 50], titleX: 75, cap: [20, 42], fs: 15.9, chevX: 410 },
  open: { h: 458, icon: [21, 28], titleCap: [28, 51], hdrCap: 93, hdrX: [21, 77, 211], hdrRight: 25, row0: 125, pitch: 47, rankCx: 31, codeX: 77, labelX: 206, valRight: 25, tagCap: 140 },
  fail: { mt: 12.5, h: 379, icon: [19, 21], titleX: 74, titleCap: 31, hdrCap: 79, row0: 112, pitch: 54.6, rankCx: 31.5, textX: 74, text: 13.6, textLh: 20, pillX: 342, pill: [94, 23] },
  reg: { mt: 15, h: 215, icon: [21, 14], titleX: 74, titleCap: 23, donut: { cx: 92.5, cy: 134, d: 118, inner: 58 }, dotX: 177, labelX: 204, pctX: 313, tagX: 369, row0: 66, pitch: 37.3 },
  feed: { mt: 19, h: 176, w: 470, icon: [17, 11], titleX: 61, titleCap: 19, hdrCap: 58, hdrX: [10, 141, 244], hdrRight: 30, row0: 88, pitch: 31.5, x: [10, 141, 244], right: 28, fs: 13.4 },
  footer: { mt: 16, h: 40 },
};

function Phone({ data, isDark }) {
  const [open, setOpen] = useState(null);
  const C = COL[isDark ? "dark" : "light"];
  const H = COL.dark;
  const card = { marginLeft: PH.inset[0], marginRight: PH.inset[1], background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: isDark ? "none" : "0 3px 14px rgba(16,24,48,0.06)" };
  const panels = [
    ["engines", data.engines],
    ["models", data.models],
    ["replacementCosts", data.replacementCosts],
  ];
  const chev = (up) => (
    <svg aria-hidden="true" viewBox="0 0 16 9" className="absolute" style={{ left: PH.acc.chevX, top: up ? 40 : 34, width: 15, height: 8, color: C.text }} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={up ? "M1 8 8 1.5 15 8" : "M1 1 8 7.5 15 1"} />
    </svg>
  );
  const title2 = (t, sub) => {
    if (sub) return [t, `(${sub})`];
    const m = t.match(/^(Most-Enquired)\s+(.*)$/);
    return m ? [m[1], m[2]] : [t, ""];
  };
  const fx = (v) => `${(v / PH.feed.w) * 100}%`;

  return (
    <div className="relative lg:hidden" style={{ paddingBottom: 6 }}>
      {/* Hero (dark on both themes, as in the reference) */}
      <div className="relative overflow-hidden" style={{ height: PH.heroH, background: H.bg }}>
        <span aria-hidden="true" className="pointer-events-none absolute [mask-image:linear-gradient(90deg,transparent,black_25%)]" style={{ left: PH.backdrop.left, top: PH.backdrop.top, width: PH.backdrop.w, height: PH.backdrop.h }}>
          <Image src={data.headerImage.backdrop.phone} alt="" fill sizes="180px" className="object-cover" />
        </span>
        <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: PH.car.left, top: PH.car.top, width: PH.car.width }}>
          <Image src={data.headerImage.phone} alt="" width={662} height={504} sizes="400px" className="h-auto w-full" style={{ filter: "brightness(0.66) contrast(1.2)" }} />
          <span className="absolute inset-0 mix-blend-multiply" style={{ background: "#9fb2d0", WebkitMask: `url("${data.headerImage.phone}") center / 100% 100% no-repeat`, mask: `url("${data.headerImage.phone}") center / 100% 100% no-repeat` }} />
        </div>
        <h2 className="absolute whitespace-nowrap font-bold [&_.heading-accent]:!text-[var(--acc)]" style={{ left: PH.h2.left, top: PH.h2.cap - capOffset(PH.h2.fs, PH.h2.lh), fontSize: PH.h2.fs, lineHeight: `${PH.h2.lh}px`, letterSpacing: PH.h2.track, color: "#ffffff", "--acc": H.accent }} dangerouslySetInnerHTML={{ __html: data.h2Phone }} />
        <Cap as="p" left={PH.p.left} cap={PH.p.cap} fs={PH.p.fs} lh={PH.p.lh} className="whitespace-pre" style={{ color: "#ffffff" }}>{data.subHeadlinePhone}</Cap>
        <div className="absolute rounded-[8px]" style={{ left: PH.inset[0], right: PH.inset[1], top: PH.stats.top, height: PH.stats.h, background: "rgba(14,22,32,0.92)", border: "1px solid #253142" }}>
          {data.stats.map((st, i) => (
            <span key={st.label}>
              {i ? <span aria-hidden="true" className="absolute" style={{ left: `${((PH.stats.cx[i - 1] + PH.stats.cx[i]) / 2 / 455) * 100}%`, top: 18, bottom: 18, width: 1, background: "#253142" }} /> : null}
              <span className="absolute -translate-x-1/2" style={{ left: `${(PH.stats.cx[i] / 455) * 100}%`, top: PH.stats.iconTop, width: PH.stats.icon[0], height: PH.stats.icon[1], color: "#2f7bec" }}>
                <PanelIcon name={st.icon} className="h-full w-full" />
              </span>
              <span className="absolute -translate-x-1/2 text-center" style={{ left: `${(PH.stats.cx[i] / 455) * 100}%`, top: i < 2 ? PH.stats.valueCap - capOffset(PH.stats.value, PH.stats.value * 1.2) : 70, color: "#ffffff" }}>
                {i < 2 ? <span className="block whitespace-nowrap" style={{ fontSize: PH.stats.value, lineHeight: `${PH.stats.value * 1.2}px` }}>{st.value}</span> : <span className="block whitespace-nowrap" style={{ fontSize: PH.stats.label, lineHeight: `${PH.stats.labelLh}px` }}>{st.value}</span>}
                <span className="block whitespace-pre" style={{ fontSize: PH.stats.label, lineHeight: `${PH.stats.labelLh}px`, marginTop: i < 2 ? -2 : 0 }}>{st.labelPhone}</span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Accordions */}
      {panels.map(([key, p], i) => {
        const isOpen = open === key;
        const [t1, t2] = title2(p.title, p.subtitle);
        const rows = p.rows;
        return (
          <div key={key} className="relative overflow-hidden" style={{ ...card, marginTop: PH.acc.tops[i], height: isOpen ? (key === "engines" ? PH.open.h : 100 + rows.length * PH.open.pitch) : PH.acc.h }}>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)} className="absolute inset-x-0 top-0 block text-left" style={{ height: PH.acc.h }}>
              <span className="absolute" style={{ left: PH.acc.icon[0], top: PH.acc.icon[1] - 2, width: PH.acc.icon[2], height: PH.acc.icon[2], color: C.icon }}>
                <PanelIcon name={p.icon} className="h-full w-full" />
              </span>
              <Cap left={PH.acc.titleX} cap={PH.acc.cap[0]} fs={PH.acc.fs} className="whitespace-nowrap font-bold uppercase" style={{ color: C.text }}>{t1}</Cap>
              <Cap left={PH.acc.titleX} cap={PH.acc.cap[1]} fs={p.subtitle ? 12.8 : PH.acc.fs} className="whitespace-nowrap font-bold uppercase" style={{ color: C.text }}>{t2}</Cap>
              {chev(isOpen)}
            </button>
            {isOpen ? (
              <div className="absolute inset-x-0 bottom-0" style={{ top: 0 }}>
                {p.columns.map((c, j) => (
                  <Cap key={c} left={j === p.columns.length - 1 ? undefined : [21, 77, 211][j]} right={j === p.columns.length - 1 ? PH.open.hdrRight : undefined} cap={PH.open.hdrCap} fs={10} className="whitespace-nowrap uppercase" style={{ color: C.text }}>{c}</Cap>
                ))}
                {rows.map((r, j) => {
                  const cap = PH.open.row0 + j * PH.open.pitch;
                  const val = r.enquiries || r.cost;
                  const [v, tag] = split(val);
                  return (
                    <span key={j}>
                      <span aria-hidden="true" className="absolute" style={{ left: 18, right: 18, top: cap - 23, height: 1, background: C.line }} />
                      {r.rank ? <Cap left={PH.open.rankCx - 10} cap={cap} fs={16} className="w-[20px] text-center" style={{ color: C.blue }}>{r.rank}</Cap> : null}
                      <Cap left={r.rank ? PH.open.codeX : 21} cap={cap} fs={14.5} className="whitespace-nowrap font-bold" style={{ color: C.text }}>{r.code || r.model}</Cap>
                      {r.label ? <Cap left={PH.open.labelX} cap={cap + 1} fs={12.5} className="whitespace-nowrap" style={{ color: C.soft }}>{r.label}</Cap> : null}
                      <Cap right={PH.open.valRight} cap={cap - 2} fs={16} className="whitespace-nowrap text-right font-bold" style={{ color: C.blue }}>{v}</Cap>
                      <Cap right={PH.open.valRight} cap={cap + 17} fs={10} className="whitespace-nowrap text-right" style={{ color: C.tag }}>{tag}</Cap>
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Failures */}
      <div className="relative" style={{ ...card, marginTop: PH.fail.mt, height: PH.fail.h }}>
        <span className="absolute" style={{ left: PH.fail.icon[0] - 2, top: PH.fail.icon[1] - 3, width: 38, height: 38 }}>
          <PanelIcon name={data.failures.icon} className="h-full w-full" />
        </span>
        <Cap as="h3" left={PH.fail.titleX} cap={PH.fail.titleCap} fs={15.5} className="whitespace-nowrap font-bold uppercase" style={{ color: C.text }}>{data.failures.title}</Cap>
        {data.failures.columns.map((c, j) => (
          <Cap key={c} left={j === 2 ? undefined : [20, 74][j]} right={j === 2 ? 30 : undefined} cap={PH.fail.hdrCap} fs={10} className="whitespace-nowrap uppercase" style={{ color: C.text }}>{c}</Cap>
        ))}
        {data.failures.rows.map((r, j) => {
          const cap = PH.fail.row0 + j * PH.fail.pitch;
          return (
            <span key={r.rank}>
              <span aria-hidden="true" className="absolute" style={{ left: 18, right: 18, top: cap - 15, height: 1, background: C.line }} />
              <Cap left={PH.fail.rankCx - 10} cap={cap} fs={18} className="w-[20px] text-center" style={{ color: C.blue }}>{r.rank}</Cap>
              <Cap left={PH.fail.textX} cap={cap} fs={PH.fail.text} lh={PH.fail.textLh} className="whitespace-pre" style={{ color: C.soft }}>{r.failurePhone}</Cap>
              <span className="absolute flex items-center justify-center rounded-[3px] text-white" style={{ left: PH.fail.pillX, top: cap - 2, width: PH.fail.pill[0], height: PH.fail.pill[1], fontSize: 14, background: RISK_BG[r.risk.type] }}>{r.risk.label}</span>
            </span>
          );
        })}
      </div>

      {/* Regional */}
      <div className="relative" style={{ ...card, marginTop: PH.reg.mt, height: PH.reg.h }}>
        <span className="absolute" style={{ left: PH.reg.icon[0] - 2, top: PH.reg.icon[1] - 2, width: 36, height: 36, color: C.icon }}>
          <PanelIcon name={data.regionalDemand.icon} className="h-full w-full" />
        </span>
        <Cap as="h3" left={PH.reg.titleX} cap={PH.reg.titleCap} fs={15.5} className="whitespace-nowrap font-bold uppercase" style={{ color: C.text }}>{data.regionalDemand.title}</Cap>
        <span className="absolute" style={{ left: PH.reg.donut.cx - PH.reg.donut.d / 2, top: PH.reg.donut.cy - PH.reg.donut.d / 2, width: PH.reg.donut.d, height: PH.reg.donut.d }}>
          <Donut size={PH.reg.donut.d} inner={PH.reg.donut.inner} isDark={isDark} />
        </span>
        {data.regionalDemand.rows.map((r, j) => {
          const cap = PH.reg.row0 + j * PH.reg.pitch;
          return (
            <span key={r.region}>
              <span aria-hidden="true" className="absolute rounded-full" style={{ left: PH.reg.dotX, top: cap - 1, width: 13, height: 13, background: ["#0b50e3", "#1f5fe8", "#2f6fef", "#6f9ef4"][j] }} />
              <Cap left={PH.reg.labelX} cap={cap} fs={14.2} className="whitespace-nowrap" style={{ color: C.text }}>{r.region}</Cap>
              <Cap left={PH.reg.pctX} cap={cap} fs={14.5} className="whitespace-nowrap font-bold" style={{ color: C.text }}>{r.percentage}</Cap>
              <Cap left={PH.reg.tagX} cap={cap + 1} fs={9.6} className="whitespace-nowrap" style={{ color: C.tag }}>{r.source}</Cap>
            </span>
          );
        })}
      </div>

      {/* Live feed */}
      <div className="relative" style={{ ...card, marginTop: PH.feed.mt, height: PH.feed.h }}>
        <span className="absolute" style={{ left: PH.feed.icon[0] - 2, top: PH.feed.icon[1] - 2, width: 32, height: 32, color: C.icon }}>
          <PanelIcon name={data.liveFeed.icon} className="h-full w-full" />
        </span>
        <Cap as="h3" left={PH.feed.titleX} cap={PH.feed.titleCap} fs={15.2} className="whitespace-nowrap font-bold uppercase" style={{ color: C.text }}>{data.liveFeed.title}</Cap>
        {data.liveFeed.columns.map((c, j) => (
          <Cap key={c} left={j < 3 ? fx(PH.feed.hdrX[j]) : undefined} right={j === 3 ? PH.feed.hdrRight : undefined} cap={PH.feed.hdrCap} fs={9.8} className="whitespace-nowrap uppercase" style={{ color: C.text }}>{c}</Cap>
        ))}
        <span aria-hidden="true" className="absolute" style={{ left: 8, right: 8, top: PH.feed.hdrCap + 15, height: 1, background: C.line }} />
        {data.liveFeed.rows.map((r, j) => {
          const cap = PH.feed.row0 + j * PH.feed.pitch;
          return (
            <span key={r.vehicle}>
              {[r.vehicle, r.location, r.issue].map((v, k) => (
                <Cap key={k} left={fx(PH.feed.x[k])} cap={cap} fs={PH.feed.fs} className="whitespace-nowrap" style={{ color: C.soft }}>{v}</Cap>
              ))}
              <Cap right={PH.feed.right} cap={cap} fs={PH.feed.fs} className="whitespace-nowrap" style={{ color: C.soft }}>{r.timestamp}</Cap>
            </span>
          );
        })}
      </div>

      <p className="flex items-center justify-center gap-2" style={{ marginTop: PH.footer.mt, height: 24, fontSize: 14.6, color: C.soft }}>
        <span style={{ width: 16, height: 16, color: C.icon }}>
          <PanelIcon name="refresh" className="h-full w-full" />
        </span>
        <span>
          {data.liveFeed.footer.split("BMWEngines.uk")[0]}
          <span style={{ color: C.blue }}>BMWEngines.uk</span>
          {data.liveFeed.footer.split("BMWEngines.uk")[1]}
        </span>
      </p>
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
      <ScaleBox width={503} max={1.5}>
        <Phone data={data} isDark={isDark} />
      </ScaleBox>
    </section>
  );
}
