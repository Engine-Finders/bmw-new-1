"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";
import { MobileCard, MobileHeading, MobileLabel, MobileLead, MobileSection } from "@/components/home/mobileKit";

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

// Phone / tablet: readable stacked layout (body 17px, entries 16–18px, labels 13px).
function Phone({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const blocks = [data.engineFailures, data.warningSigns];

  return (
    <MobileSection>
      <div className="relative mb-6 h-[170px] overflow-hidden rounded-[16px]">
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt={data.headerImage.alt} fill sizes="720px" className="object-cover object-[65%_50%]" />
      </div>
      <MobileHeading html={data.h2} color={C.h2} accent={isDark ? "#2f7bec" : "#0b4fe0"} />
      <MobileLead color={C.para}>{data.subHeadline}</MobileLead>

      {blocks.map((b) => {
        const Icon = b.icon === "warning" ? Warn : Gear;
        return (
          <MobileCard key={b.title} C={C} className="mt-6">
            <h3 className="flex items-center gap-3 border-b px-4 py-3.5 text-[16px] font-bold uppercase tracking-[0.03em]" style={{ color: isDark ? "#ffffff" : "#0b4fe0", borderColor: C.line }}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#0b47d8] text-white">
                <Icon style={{ width: 17, height: 17 }} />
              </span>
              {b.title}
            </h3>
            <ul>
              {b.rows.map((r) => (
                <li key={r.id} className="border-b last:border-b-0" style={{ borderColor: C.line }}>
                  <Link href={r.link.href} className="flex gap-3 px-4 py-4 font-normal">
                    <span className="w-5 shrink-0 text-[20px] font-semibold leading-[1.3]" style={{ color: C.num }}>{r.id}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[18px] font-bold leading-[1.3]" style={{ color: C.title }}>{r.title}</span>
                      <span className="mt-1.5 block text-[16px] leading-[1.55]" style={{ color: C.desc }}>{r.description}</span>
                      <span className="mt-3 flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: C.sev }}>
                          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: SEV[r.severity.type] }} />
                          {r.severity.label}
                        </span>
                        <span className="flex items-center gap-1.5 text-[16px] font-semibold" style={{ color: C.link }}>
                          {r.link.label}
                          <Arrow style={{ width: 16, height: 16 }} />
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </MobileCard>
        );
      })}

      <MobileCard C={C} className="mt-5 px-4 py-4">
        <MobileLabel color={isDark ? "#ffffff" : "#0b4fe0"} className="!text-[14px]">Urgency key</MobileLabel>
        <ul className="mt-3 grid gap-2.5">
          {data.urgencyKey.map((u) => (
            <li key={u.type} className="flex items-start gap-2.5 text-[16px] leading-[1.45]" style={{ color: C.title }}>
              <span aria-hidden="true" className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: SEV[u.type] }} />
              <span>
                <strong className="font-semibold">{u.label}</strong>
                <span style={{ color: C.keyMuted }}> — {u.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </MobileCard>
    </MobileSection>
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
      <Phone data={data} isDark={isDark} />
    </section>
  );
}
