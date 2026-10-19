"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";

// The BMW Failure Database — engine failures + warning signs tables with severity and links,
// under an engine-bay header, closed by the urgency key.

const SEV = { catastrophic: "#f1332e", immediate: "#fd9b0d", monitor: "#fce21b", low: "#39a943" };

function Gear({ style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={style} fill="currentColor">
      <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5L19.4 13ZM13 15.4a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Z" transform="translate(-1 0)" />
    </svg>
  );
}

function Warn({ style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 3.2 22 20.5H2L12 3.2Z" />
      <path d="M12 9.5v5.2" strokeLinecap="round" />
      <circle cx="12" cy="17.4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Arrow({ style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={style} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 12h16.5m-6.5-6.5L20 12l-6.5 6.5" />
    </svg>
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

// Desktop spec measured on the 1536px references (Section 9.1.png light, Section 9.png dark — same geometry).
// Section-relative tops; card x values are px from the card's left edge at 1536 (card width 1398.5).
const D = {
  h: 942, padL: 60.5, padR: 77, cardW: 1398.5,
  img: { left: 700, top: 1, w: 836, h: 226 },
  h2: { left: 69, cap: 60, fs: 54, lh: 60, track: "-0.05em" }, underline: { top: 122, w: 82 },
  p: { left: 70, cap: 143, fs: 15.7, lh: 24 },
  tables: [
    { top: 227, tab: 36, hdr: 27, rows: { light: [60, 61, 60, 60, 59], dark: [60, 61, 60, 60, 59] }, tabW: 250 },
    { top: 600, tab: 35, hdr: 27, rows: { light: [58.5, 45.5, 46, 50.5], dark: [59.5, 46.5, 47, 48.5] }, tabW: 360 },
  ],
  dividers: [60.5, 369.5, 994.5, 1216.5], sq: 54.5,
  tabText: { left: 75.5, cap: 13, fs: 16 }, hdr: { cap: 8, fs: 11.2, x: [27.5, 82.5, 401.5, 1049.5, 1280.5] },
  numCx: 30, num: { dy: -10, fs: 22.5 }, titleX: 82.5, titleX2: { light: 78, dark: 83 }, title: { dy: -7, fs: 17.3, lh: 22 }, descX: 401, desc: { fs: 13.15, lh: 17.5 },
  dotX: 1043.5, dot: 15, sevX: 1068.5, sev: { dy: -6, fs: 15 }, linkX: 1256.5, link: { dy: -6, fs: 15 },
  key: { top: 876, h: 48, label: { left: 37.5, cap: 19, fs: 14.7 }, dotX: [183.5, 620.5, 891.5, 1151.5], textX: [207.5, 643.5, 914.5, 1173.5], dot: 13, fs: 14.15 },
};

const COL = {
  light: { bg: "#ffffff", h2: "#05070f", accent: "#05070f", para: "#2e3245", card: "#ffffff", border: "#e8ebf0", line: "#eef0f3", hdrBand: "#f8f9f9", tabBg: "#ffffff", tabEdge: "#e8ebf0",
    sq: "#0048b9", tabText: "#0b1236", label: "#1d2230", num: "#0b4fe0", title: "#0b1236", desc: "#1e2230", sev: "#1d2230", link: "#0b4fe0", keyMuted: "#40465a", shadow: "0 2px 10px rgba(16,24,48,0.03)" },
  dark: { bg: "#01060e", h2: "#ffffff", accent: "#ffffff", para: "#e1e4e9", card: "#03070d", border: "#3d434b", line: "#21252c", hdrBand: "#00030a", tabBg: "linear-gradient(90deg,#03244d,#011a36)", tabEdge: "#1b3558",
    sq: "#003f97", tabText: "#ffffff", label: "#f2f4f7", num: "#2f7bec", title: "#ffffff", desc: "#e1e4e9", sev: "#ffffff", link: "#3b82f6", keyMuted: "#c4c9d1", shadow: "none" },
};

function Table({ block, spec, rows, C, titleKey, titleX }) {
  const pct = (v) => `${(v / D.cardW) * 100}%`;
  const Icon = block.icon === "warning" ? Warn : Gear;
  const tops = rows.map((_, i) => spec.tab + spec.hdr + rows.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div className="absolute overflow-hidden rounded-[8px]" style={{ left: D.padL, right: D.padR, top: spec.top, height: spec.tab + spec.hdr + rows.reduce((a, b) => a + b, 0), background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
      <span aria-hidden="true" className="absolute left-0 top-0 [clip-path:polygon(0_0,calc(100%-24px)_0,100%_100%,0_100%)]" style={{ width: spec.tabW, height: spec.tab, background: C.tabEdge }} />
      <span aria-hidden="true" className="absolute left-0 top-0 [clip-path:polygon(0_0,calc(100%-24px)_0,100%_100%,0_100%)]" style={{ width: spec.tabW - 1, height: spec.tab - 1, background: C.tabBg }} />
      <span className="absolute left-0 top-0 flex items-center justify-center rounded-tl-[8px] text-white" style={{ width: D.sq, height: spec.tab, background: C.sq }}>
        <Icon style={{ width: 24, height: 24 }} />
      </span>
      <Cap as="h3" left={D.tabText.left} cap={D.tabText.cap} fs={D.tabText.fs} className="whitespace-nowrap uppercase" style={{ color: C.tabText }}>{block.title}</Cap>
      <div className="absolute inset-x-0" style={{ top: spec.tab, height: spec.hdr, background: C.hdrBand, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        {block.columns.map((c, i) => (
          <Cap key={c} left={pct(D.hdr.x[i])} cap={D.hdr.cap} fs={D.hdr.fs} className="whitespace-nowrap uppercase" style={{ color: C.label }}>{c}</Cap>
        ))}
      </div>
      {D.dividers.map((d) => (
        <span key={d} aria-hidden="true" className="absolute bottom-0" style={{ left: pct(d), top: spec.tab + spec.hdr, width: 1, background: C.line }} />
      ))}
      {block.rows.map((r, i) => {
        const top = tops[i];
        const h = rows[i];
        const c = h / 2;
        const title = (titleKey && r[titleKey]) || r.title;
        const n = title.split("\n").length;
        const nd = r.descriptionDesktop.split("\n").length;
        return (
          <Link key={r.id} href={r.link.href} className="absolute inset-x-0 font-normal" style={{ top, height: h, borderTop: i ? `1px solid ${C.line}` : undefined }}>
            <Cap left={`calc(${pct(D.numCx)} - 10px)`} cap={c + D.num.dy} fs={D.num.fs} className="w-[20px] text-center" style={{ color: C.num }}>{r.id}</Cap>
            <Cap as="h4" left={pct(titleX)} cap={c + D.title.dy - ((n - 1) * D.title.lh) / 2} fs={D.title.fs} lh={D.title.lh} className="whitespace-pre" style={{ color: C.title }}>{title}</Cap>
            <Cap as="p" left={pct(D.descX)} cap={c - 4 - ((nd - 1) * D.desc.lh) / 2} fs={D.desc.fs} lh={D.desc.lh} className="whitespace-pre" style={{ color: C.desc }}>{r.descriptionDesktop}</Cap>
            <span aria-hidden="true" className="absolute rounded-full" style={{ left: pct(D.dotX), top: c - 1 - D.dot / 2, width: D.dot, height: D.dot, background: SEV[r.severity.type] }} />
            <Cap left={pct(D.sevX)} cap={c + D.sev.dy} fs={D.sev.fs} className="whitespace-nowrap" style={{ color: C.sev }}>{r.severity.label}</Cap>
            <Cap left={pct(D.linkX)} cap={c + D.link.dy} fs={D.link.fs} className="flex items-center gap-[9px] whitespace-nowrap" style={{ color: C.link }}>
              {r.link.label}
              <Arrow style={{ width: 16, height: 16 }} />
            </Cap>
          </Link>
        );
      })}
    </div>
  );
}

function Desktop({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const C = COL[t];
  const K = D.key;
  const pct = (v) => `${(v / D.cardW) * 100}%`;
  return (
    <div className="relative mx-auto hidden w-full max-w-[1600px] overflow-hidden lg:block" style={{ height: D.h }}>
      <div aria-hidden="true" className="pointer-events-none absolute right-0" style={{ top: D.img.top, width: `${(D.img.w / 1536) * 100}%`, maxWidth: D.img.w, aspectRatio: `${D.img.w} / ${D.img.h}` }}>
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt="" fill sizes="840px" className="object-cover [mask-image:linear-gradient(90deg,transparent,black_12%)]" />
      </div>
      <h2 className="absolute whitespace-nowrap font-bold [&_.heading-accent]:!text-[var(--acc)]" style={{ left: D.h2.left, top: D.h2.cap - capOffset(D.h2.fs, D.h2.lh), fontSize: D.h2.fs, lineHeight: `${D.h2.lh}px`, letterSpacing: D.h2.track, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
      <span aria-hidden="true" className="absolute h-[3px] bg-[linear-gradient(90deg,#0b55e6_60%,transparent)]" style={{ left: D.p.left, top: D.underline.top, width: D.underline.w }} />
      <Cap as="p" left={D.p.left} cap={D.p.cap} fs={D.p.fs} lh={D.p.lh} className="whitespace-pre" style={{ color: C.para }}>{data.subHeadlineDesktop}</Cap>

      <Table block={data.engineFailures} spec={D.tables[0]} rows={D.tables[0].rows[t]} C={C} titleKey="titleDesktop" titleX={D.titleX} />
      <Table block={data.warningSigns} spec={D.tables[1]} rows={D.tables[1].rows[t]} C={C} titleX={D.titleX2[t]} />

      <div className="absolute rounded-[8px]" style={{ left: D.padL - 2, right: D.padR, top: K.top, height: K.h, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <Cap left={K.label.left} cap={K.label.cap} fs={K.label.fs} className="whitespace-nowrap font-bold uppercase" style={{ color: C.title }}>Urgency key:</Cap>
        {data.urgencyKey.map((u, i) => (
          <span key={u.type}>
            <span aria-hidden="true" className="absolute rounded-full" style={{ left: pct(K.dotX[i]), top: K.h / 2 - 1 - K.dot / 2, width: K.dot, height: K.dot, background: SEV[u.type] }} />
            <Cap left={pct(K.textX[i])} cap={K.label.cap + 1} fs={K.fs} className="whitespace-nowrap" style={{ color: C.title }}>
              {u.label}
              <span style={{ color: C.keyMuted }}> — {u.text}</span>
            </Cap>
          </span>
        ))}
      </div>
    </div>
  );
}

// Phone spec measured on Section 9.3.png (862px capture, compared at 431px). CSS px.
const P = {
  h: 878, inset: [17.5, 23], cardW: 390.5,
  img: { left: 200, top: 0.5, w: 231, h: 168 },
  h2: { left: 17, cap: 40.5, fs: 35, lh: 30.5, track: "-0.05em" }, p: { left: 17.5, cap: 114.5, fs: 9.15, lh: 14.75 },
  tables: [
    { top: 165.5, tab: 29, tabX: 40.5, tabFs: 9.8, titleX: 42, rows: [75.5, 77.5, 77.5, 64.5, 77], title: 10, desc: 7.8, descLh: 11.5, descDy: 26.5, linkDy: [52, 55.5, 53.5, 46.5, 52] },
    { top: 574.5, tab: 28, tabX: 35, tabFs: 8.65, titleX: 38, rows: [56.5, 46, 56, 46], title: 9, desc: 7.2, descLh: 10.9, descDy: 22, linkDy: [36.5, 27.5, 30, 30] },
  ],
  sq: { left: 8, top: 5, d: 20.5 }, tabText: { left: 40.5, cap: 12, fs: 9.8 },
  dividers: [31, 295], numCx: 15, num: { cap: 10.5, fs: 14.5 }, titleX: 42, titleCap: 10, dotCx: 312.25, dotCy: 15.5, dot: 7.5, sevX: 322, sevCap: 12.5, sev: 8.4, linkX: 322, link: 8.4,
  key: { top: 814, h: 52, label: { left: 8.5, cap: 7, fs: 7.7 }, dotX: [8.5, 232.5], dotY: [19.5, 32.5], textX: [20.5, 245], textCap: [20.5, 33.5], fs: 7.25, dot: 7 },
};

function Phone({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const x = (v) => `${(v / P.cardW) * 100}%`;
  const blocks = [data.engineFailures, data.warningSigns];
  const K = P.key;
  return (
    <div className="relative overflow-hidden lg:hidden" style={{ height: P.h }}>
      <div aria-hidden="true" className="pointer-events-none absolute right-0" style={{ top: P.img.top, width: P.img.w, height: P.img.h }}>
        {isDark ? (
          <Image src={data.headerImage.dark} alt="" fill sizes="240px" className="object-cover object-right [mask-image:linear-gradient(90deg,transparent,black_30%)]" />
        ) : (
          <Image src={data.headerImage.phone} alt="" fill sizes="240px" className="object-cover object-left-top" />
        )}
      </div>
      <h2 className="absolute whitespace-nowrap font-bold [&_.heading-accent]:!text-[var(--acc)]" style={{ left: P.h2.left, top: P.h2.cap - capOffset(P.h2.fs, P.h2.lh), fontSize: P.h2.fs, lineHeight: `${P.h2.lh}px`, letterSpacing: P.h2.track, color: C.h2, "--acc": isDark ? "#2f7bec" : "#0b4fe0" }} dangerouslySetInnerHTML={{ __html: data.h2Phone }} />
      <Cap as="p" left={P.p.left} cap={P.p.cap} fs={P.p.fs} lh={P.p.lh} className="whitespace-pre" style={{ color: C.para }}>{data.subHeadlinePhone}</Cap>

      {blocks.map((b, bi) => {
        const T = P.tables[bi];
        const Icon = b.icon === "warning" ? Warn : Gear;
        const tops = T.rows.map((_, i) => T.tab + T.rows.slice(0, i).reduce((a, v) => a + v, 0));
        return (
          <div key={b.title} className="absolute overflow-hidden rounded-[6px]" style={{ left: P.inset[0], right: P.inset[1], top: T.top, height: T.tab + T.rows.reduce((a, v) => a + v, 0), background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <span className="absolute flex items-center justify-center rounded-[3px] text-white" style={{ left: P.sq.left, top: P.sq.top, width: P.sq.d, height: P.sq.d, background: "#0b47d8" }}>
              <Icon style={{ width: 12, height: 12 }} />
            </span>
            <Cap as="h3" left={T.tabX} cap={P.tabText.cap} fs={T.tabFs} className="whitespace-nowrap font-bold uppercase" style={{ color: isDark ? "#ffffff" : "#0b4fe0" }}>{b.title}</Cap>
            <span aria-hidden="true" className="absolute inset-x-0" style={{ top: T.tab, height: 1, background: C.line }} />
            {P.dividers.map((d) => (
              <span key={d} aria-hidden="true" className="absolute bottom-0" style={{ left: x(d), top: T.tab, width: 1, background: C.line }} />
            ))}
            {b.rows.map((r, i) => {
              const top = tops[i];
              const h = T.rows[i];
              return (
                <Link key={r.id} href={r.link.href} className="absolute inset-x-0 font-normal" style={{ top, height: h, borderTop: i ? `1px solid ${C.line}` : undefined }}>
                  <Cap left={`calc(${x(P.numCx)} - 8px)`} cap={P.num.cap} fs={P.num.fs} className="w-[16px] text-center" style={{ color: C.num }}>{r.id}</Cap>
                  <Cap as="h4" left={x(T.titleX)} cap={P.titleCap - (bi ? 1 : 0)} fs={T.title} className="whitespace-nowrap font-bold" style={{ color: C.title }}>{r.title}</Cap>
                  <Cap as="p" left={x(T.titleX)} cap={T.descDy} fs={T.desc} lh={T.descLh} className="whitespace-pre" style={{ color: C.desc }}>{r.descriptionPhone}</Cap>
                  <span aria-hidden="true" className="absolute rounded-full" style={{ left: `calc(${x(P.dotCx)} - ${P.dot / 2}px)`, top: P.dotCy - P.dot / 2, width: P.dot, height: P.dot, background: SEV[r.severity.type] }} />
                  <Cap left={x(P.sevX)} cap={P.sevCap} fs={P.sev} className="whitespace-nowrap" style={{ color: C.sev }}>{r.severity.label}</Cap>
                  <Cap left={x(P.linkX)} cap={T.linkDy[i]} fs={P.link} className="flex items-center gap-[5px] whitespace-nowrap font-bold" style={{ color: C.link }}>
                    {r.link.label}
                    <Arrow style={{ width: 10, height: 10 }} />
                  </Cap>
                </Link>
              );
            })}
          </div>
        );
      })}

      <div className="absolute rounded-[6px]" style={{ left: P.inset[0], right: P.inset[1], top: K.top, height: K.h, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <Cap left={K.label.left} cap={K.label.cap} fs={K.label.fs} className="whitespace-nowrap font-bold uppercase" style={{ color: isDark ? "#ffffff" : "#0b4fe0" }}>Urgency key</Cap>
        {data.urgencyKey.map((u, i) => {
          const col = [0, 1, 0, 1][i];
          const row = [0, 0, 1, 1][i];
          return (
            <span key={u.type}>
              <span aria-hidden="true" className="absolute rounded-full" style={{ left: x(K.dotX[col]), top: K.dotY[row], width: K.dot, height: K.dot, background: SEV[u.type] }} />
              <Cap left={x(K.textX[col])} cap={K.textCap[row]} fs={K.fs} className="whitespace-nowrap" style={{ color: C.title }}>
                {u.label} — {u.text}
              </Cap>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function HomeSec9({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <ScaleBox width={1536}>
        <Desktop data={data} isDark={isDark} />
      </ScaleBox>
      <ScaleBox width={431} max={1.5}>
        <Phone data={data} isDark={isDark} />
      </ScaleBox>
    </section>
  );
}
