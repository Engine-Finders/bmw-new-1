"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";
import { MobileHeading, MobileLabel, MobileLead, MobileSection } from "@/components/home/mobileKit";
import BrandIcon from "@/components/home/brandIcon";

// BMW Engine Families — The Pillars: engine table (engine / fuel / years / enquiries / verdict)
// under an engine-bay header framed by blue diagonals. Phone adds the trust strip and a legend card.

// Icons use tight viewBoxes so the box size is the ink size measured on the references.
const VB = { watch: "1 2.5 22 19", safe: "1.1 1.1 21.8 21.8", avoid: "1.1 1.1 21.8 21.8", solid: "2.2 2.2 19.6 18.8", best: "2.5 3 19 17.5" };

function VerdictMark({ type, style, className = "" }) {
  const p = { "aria-hidden": "true", viewBox: VB[type] ?? VB.best, className, style };
  switch (type) {
    case "watch":
      return (
        <svg {...p}>
          <path d="M12 2.5 23 21.5H1L12 2.5Z" fill="#f5a20b" />
          <path d="M12 9v6" stroke="#2b1600" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="18" r="1.25" fill="#2b1600" />
        </svg>
      );
    case "safe":
      return (
        <svg {...p} fill="none" stroke="#22a447" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="m7.5 12.3 3 3 6-6.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "avoid":
      return (
        <svg {...p} fill="none" stroke="#e3262b" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="m8.5 8.5 7 7m0-7-7 7" strokeLinecap="round" />
        </svg>
      );
    case "solid":
      return (
        <svg {...p} fill="none" stroke="#1d4fd8" strokeWidth="1.6" strokeLinejoin="round">
          <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8Z" />
        </svg>
      );
    default:
      return (
        <svg {...p} fill="#1d4fd8">
          <path d="M6 3h12v5a6 6 0 0 1-12 0V3Zm-3.5 1H5v3.6A3.4 3.4 0 0 1 2.5 4.3V4ZM19 4h2.5v.3A3.4 3.4 0 0 1 19 7.6V4ZM10.5 14.5h3v3.5H17v2.5H7V18h3.5v-3.5Z" />
          <circle cx="12" cy="7.5" r="2" fill="#fff" />
        </svg>
      );
  }
}

function FuelMark({ fuel, color = "#1d6ff0", style, className = "" }) {
  return fuel === "Diesel" ? (
    <svg aria-hidden="true" viewBox="4.2 1.7 15.6 21.1" className={className} style={style} fill="none" stroke={color} strokeWidth="1.6">
      <path d="M12 2.5s7 7.6 7 12.5a7 7 0 0 1-14 0c0-4.9 7-12.5 7-12.5Z" />
      <path d="M12 11.5s3 3 3 5a3 3 0 0 1-6 0c0-2 3-5 3-5Z" fill={color} stroke="none" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="3.2 2.2 18.6 19.6" className={className} style={style} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M4 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17H4Zm0-10h10" />
      <path d="M6 5.5h6v3.5H6z" fill={color} />
      <path d="M14 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3" />
    </svg>
  );
}

// Arial cap-height offset: where a capital's top sits inside a line box of height lh.
const capOffset = (fs, lh) => (lh - 1.117 * fs) / 2 + 0.189 * fs;
const padFor = (cap, fs, lh = fs * 1.2) => cap - capOffset(fs, lh);

// Desktop spec measured on the 1536px references (Section 7.1.png light, Section 7.png dark).
// Card x values are px from the card's left edge at 1536 and become % of the card width.
const SPEC = {
  light: {
    padL: 73, h2: { cap: 72, fs: 53, lh: 59, track: "-0.04em", dx: -2.5 }, p: { cap: 196, fs: 16, lh: 24 }, underline: null, img: { top: 0, left: 560 - 0, w: 976 },
    card: { top: 258, left: 72, right: 74, w: 1390, hdrH: 47, hdrCap: 20, hdr: 14, bar: 3, bottom: 30 },
    cols: [0, 230, 404, 585.5, 821, 1390], labelX: [36.5, 295.5, 471, 621.5, 882],
    rows: [70, 68.5, 66.5, 64, 64, 65, 65, 72, 72], codeCap: [19, 18, 16.5, 16, 16, 17, 17, 19, 16.5], enqCap: [20, 20, 18.5, 17, 17, 18, 18, 22, 20], vtCap: [20, 20, 18.5, 16, 16, 17, 18, 13, 20],
    codeX: 35.5, code: 20, codeBold: true, specGap: 25.7, spec: 13.4, fuelIconX: 278.5, fuelIconDy: { Diesel: 17, Petrol: 15.5 }, fuelIcon: { Diesel: [17.6, 24], Petrol: [19, 20] }, fuelX: 312.5, fuelDy: 13, fuel: 13.3,
    yearsCenter: true, yearsX: null, yearsDy: 13, years: 14, enqX: 620.5, enq: 15.3, enqBold: true, tagGap: 22.5, tag: 14.2,
    iconX: 871.5, iconDy: 15.5, icon: { watch: [30, 28.5], safe: [28, 28], avoid: [28, 28], solid: [26, 26], best: [28, 29] }, vtX: 909, vt: [14.6, 21],
  },
  dark: {
    padL: 73, h2: { cap: 63, fs: 56, lh: 62, track: "-0.045em", dx: -1 }, p: { cap: 206, fs: 16.65, lh: 25 }, underline: { top: 185, w: 92 }, img: { top: 0, left: 560, w: 976 },
    card: { top: 260, left: 70, right: 86, w: 1380, hdrH: 46.5, hdrCap: 19, hdr: 14.8, bar: 4, bottom: 48 },
    cols: [0, 237.5, 390.5, 549.5, 792.5, 1380], labelX: [35.5, 284.5, 440, 584, 831],
    rows: [64, 63, 62, 61, 62, 61, 61, 79, 68], codeCap: [14.5, 14.5, 14.5, 13.5, 14.5, 13.5, 12.5, 19.5, 13], enqCap: [15.5, 15.5, 15.5, 15.5, 15.5, 14.5, 14.5, 22.5, 17.5], vtCap: [14.5, 13.5, 13.5, 12.5, 13.5, 12.5, 13.5, 12.5, 17.5],
    codeX: 34.5, code: 22, codeBold: true, specGap: 26.5, spec: 14.4, fuelIconX: 280, fuelIconDy: { Diesel: 17.5, Petrol: 16 }, fuelIcon: { Diesel: [18.4, 25], Petrol: [20, 21] }, fuelX: 308, fuelDy: 11, fuel: 14.2,
    yearsCenter: false, yearsX: 422, yearsDy: 12, years: 14.6, enqX: 584, enq: 17.8, enqBold: false, tagGap: 23, tag: 15.2,
    iconX: 842.5, iconDy: 15, icon: { watch: [34, 31.5], safe: [31, 31], avoid: [31, 31], solid: [29, 29], best: [31, 32] }, vtX: 875, vt: [14.8, 21.5],
  },
};

const COL = {
  light: { bg: "#fefefe", h2: "#0a0f2c", accent: "#0b4fe0", para: "#4f5775", hdr: "#0b3fd6", code: "#0b1236", spec: "#2456da", text: "#1a2140", enq: "#0b1236", tag: "#1f55d8",
    vt: "#343a55", fuelIcon: "#1747e0", card: "#ffffff", border: "#eef2f8", line: "#eef2f8", hdrBand: "transparent", bar: "#9cbdf7", shadow: "0 6px 24px rgba(16,24,48,0.05)" },
  dark: { bg: "#030405", h2: "#ffffff", accent: "#2f7bec", para: "#d0d0d0", hdr: "#ffffff", code: "#ffffff", spec: "#2b93e9", text: "#eeeeef", enq: "#fafafb", tag: "#2b93e9",
    vt: "#d8dadd", fuelIcon: "#0b78e6", card: "#0e1318", border: "#3a3d40", line: "#24282d", hdrBand: "#0c0f13", bar: "#0a66e0", shadow: "none" },
};

function Desktop({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const S = SPEC[t];
  const C = COL[t];
  const K = S.card;
  const pct = (v) => `${(v / K.w) * 100}%`;
  const tpl = S.cols.slice(1).map((c, i) => `minmax(0,${c - S.cols[i]}fr)`).join(" ");
  const fs = (size, lh) => ({ fontSize: size, lineHeight: `${lh ?? size * 1.2}px` });

  return (
    <div className="relative mx-auto hidden w-full max-w-[1600px] lg:block" style={{ paddingLeft: S.padL, paddingBottom: K.bottom }}>
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 w-[63.5%] max-w-[976px]">
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt="" width={976} height={260} sizes="976px" className="h-auto w-full [mask-image:linear-gradient(90deg,transparent,black_8%)]" />
      </div>

      <div className="relative" style={{ height: K.top }}>
        <h2 className="absolute whitespace-nowrap font-bold [&_.heading-accent]:text-[var(--acc)]" style={{ left: S.h2.dx, top: padFor(S.h2.cap, S.h2.fs, S.h2.lh), ...fs(S.h2.fs, S.h2.lh), letterSpacing: S.h2.track, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
        {S.underline ? <span aria-hidden="true" className="absolute left-0 h-[3px] bg-[linear-gradient(90deg,#0a5bd8_55%,transparent)]" style={{ top: S.underline.top, width: S.underline.w }} /> : null}
        <p className="absolute whitespace-pre-line" style={{ top: padFor(S.p.cap, S.p.fs, S.p.lh), ...fs(S.p.fs, S.p.lh), color: C.para }}>{data.subHeadlineDesktop}</p>
      </div>

      <div className="relative overflow-hidden rounded-[10px]" style={{ marginLeft: K.left - S.padL, marginRight: K.right, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <div className="relative uppercase" style={{ height: K.hdrH, background: C.hdrBand, color: C.hdr, borderBottom: `1px solid ${C.line}` }}>
          {data.columns.map((c, i) => (
            <span key={c} className={`absolute whitespace-nowrap ${isDark ? "" : "font-bold"}`} style={{ left: pct(S.labelX[i]), top: padFor(K.hdrCap, K.hdr), ...fs(K.hdr) }}>{c}</span>
          ))}
        </div>
        {data.engines.map((e, ri) => {
          const code = S.codeCap[ri];
          const [iw, ih] = S.icon[e.verdict.type] ?? S.icon.best;
          const [fw, fh] = S.fuelIcon[e.fuel] ?? S.fuelIcon.Petrol;
          return (
            <Link key={e.code} href={e.href} className="relative grid font-normal" style={{ gridTemplateColumns: tpl, minHeight: S.rows[ri], color: C.text, borderTop: ri ? `1px solid ${C.line}` : undefined }}>
              <span aria-hidden="true" className="absolute inset-y-0 left-0" style={{ width: K.bar, background: C.bar }} />
              <span style={{ paddingLeft: S.codeX, paddingTop: padFor(code, S.code) }}>
                <span className={`block whitespace-nowrap ${S.codeBold ? "font-bold" : ""}`} style={{ ...fs(S.code), color: C.code }}>{e.code}</span>
                <span className="block whitespace-nowrap" style={{ ...fs(S.spec), marginTop: S.specGap - S.code * 1.2 + capOffset(S.code, S.code * 1.2) - capOffset(S.spec, S.spec * 1.2), color: C.spec }}>{e.spec}</span>
              </span>
              <span className="relative" style={{ borderLeft: `1px solid ${C.line}` }}>
                <FuelMark fuel={e.fuel} color={C.fuelIcon} className="absolute" style={{ left: `calc(${((S.fuelIconX - S.cols[1]) / (S.cols[2] - S.cols[1])) * 100}% - ${fw / 2}px)`, top: code + S.fuelIconDy[e.fuel === "Diesel" ? "Diesel" : "Petrol"] - fh / 2, width: fw, height: fh }} />
                <span className="absolute whitespace-nowrap" style={{ left: `${((S.fuelX - S.cols[1]) / (S.cols[2] - S.cols[1])) * 100}%`, top: padFor(code + S.fuelDy, S.fuel), ...fs(S.fuel) }}>{e.fuel}</span>
              </span>
              <span className={`whitespace-nowrap ${S.yearsCenter ? "text-center" : ""}`} style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: S.yearsCenter ? 0 : `${((S.yearsX - S.cols[2]) / (S.cols[3] - S.cols[2])) * 100}%`, paddingTop: padFor(code + S.yearsDy, S.years), ...fs(S.years) }}>{e.years}</span>
              <span style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: `${((S.enqX - S.cols[3]) / (S.cols[4] - S.cols[3])) * 100}%`, paddingTop: padFor(S.enqCap[ri], S.enq) }}>
                <span className={`block whitespace-nowrap ${S.enqBold ? "font-bold" : ""}`} style={{ ...fs(S.enq), color: C.enq }}>{e.enquiries}</span>
                <span className="block whitespace-nowrap" style={{ ...fs(S.tag), marginTop: S.tagGap - S.enq * 1.2 + capOffset(S.enq, S.enq * 1.2) - capOffset(S.tag, S.tag * 1.2), color: C.tag }}>{e.sourceTag}</span>
              </span>
              <span className="relative" style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: S.vtX - S.cols[4], paddingRight: 16, paddingTop: padFor(S.vtCap[ri], S.vt[0], S.vt[1]) }}>
                <VerdictMark type={e.verdict.type} className="absolute" style={{ left: S.iconX - S.cols[4] - iw / 2, top: code + S.iconDy - ih / 2, width: iw, height: ih }} />
                <span className="block whitespace-pre-line" style={{ ...fs(S.vt[0], S.vt[1]), color: C.vt }}>{e.verdict.desktop}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Trust-strip artwork drawn to the phone reference (bars, wrench, open book, trophy).
function TrustGlyph({ name }) {
  if (name === "real-inquiries")
    return (
      <svg aria-hidden="true" viewBox="0 0 19 18" className="h-full w-full" fill="currentColor">
        <rect x="0" y="8" width="5" height="10" rx="0.6" /><rect x="7" y="0" width="5" height="18" rx="0.6" /><rect x="14" y="5" width="5" height="13" rx="0.6" />
      </svg>
    );
  if (name === "vetted-specialist")
    return (
      <svg aria-hidden="true" viewBox="1.4 0.6 21 21" className="h-full w-full" fill="currentColor">
        <path d="M21 6.5a5.5 5.5 0 0 1-7.4 5.2l-8 8a2.1 2.1 0 0 1-3-3l8-8A5.5 5.5 0 0 1 17.5 1l-3.3 3.3.9 3.6 3.6.9L22 5.5c-.6.3-1 .6-1 1Z" />
      </svg>
    );
  if (name === "oem-references")
    return (
      <svg aria-hidden="true" viewBox="0 0 20 16" className="h-full w-full" fill="currentColor">
        <path d="M0 1.2C2.8.2 6.3.3 9.3 2v14C6.3 14.4 2.8 14.3 0 15.3V1.2Z" /><path d="M20 1.2c-2.8-1-6.3-.9-9.3.8v14c3-1.6 6.5-1.7 9.3-.7V1.2Z" />
      </svg>
    );
  return <VerdictMark type="best" className="h-full w-full" />;
}

const VERDICT_TONE = { watch: "#d97706", safe: "#16a34a", avoid: "#dc2626", solid: "#1d4fd8", best: "#1d4fd8" };

// Phone / tablet: readable stacked layout (body 17px, entries 16–18px, labels 13px).
function Phone({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const card = { background: C.card, borderColor: C.border };

  return (
    <MobileSection>
      <div className="relative mb-6 h-[170px] overflow-hidden rounded-[16px]">
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt={data.headerImage.alt} fill sizes="720px" className="object-cover object-[70%_50%]" />
      </div>
      <MobileHeading html={data.h2} color={C.h2} accent={C.accent} />
      <MobileLead color={C.para}>{data.subHeadline}</MobileLead>

      <ul className="mt-7 grid grid-cols-2 gap-3">
        {data.trustStrip.map((t) => (
          <li key={t.icon} className="flex items-center gap-3 rounded-[12px] border px-3.5 py-3.5" style={card}>
            <span className="h-6 w-6 shrink-0" style={{ color: isDark ? "#3b82f6" : C.hdr }}>
              <TrustGlyph name={t.icon} />
            </span>
            <span className="text-[15px] leading-[1.35]" style={{ color: C.text }}>
              {t.lines.map((l) => (l.startsWith("**") ? <strong key={l} className="block font-bold">{l.slice(2, -2)}</strong> : <span key={l} className="block">{l}</span>))}
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-5 grid gap-3">
        {data.engines.map((e) => (
          <li key={e.code}>
            <Link href={e.href} className="block rounded-[12px] border border-l-[3px] px-4 py-4 font-normal" style={{ ...card, borderLeftColor: isDark ? C.bar : "#9cbdf7", color: C.text }}>
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-[22px] font-bold leading-tight" style={{ color: C.code }}>{e.code}</span>
                  <span className="mt-0.5 block text-[15px]" style={{ color: C.spec }}>{e.spec}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <VerdictMark type={e.verdict.type} style={{ width: 24, height: 24 }} />
                  <span className="text-[15px] font-bold" style={{ color: VERDICT_TONE[e.verdict.type] ?? C.code }}>{e.verdict.label}</span>
                </span>
              </span>
              <span className="mt-3 grid grid-cols-[auto_auto_1fr] gap-x-5 border-y py-3" style={{ borderColor: C.line }}>
                <span>
                  <MobileLabel color={C.tag}>{data.columns[1]}</MobileLabel>
                  <span className="mt-1 flex items-center gap-1.5 text-[16px]">
                    <FuelMark fuel={e.fuel} color={C.fuelIcon} style={{ width: 12, height: 16 }} />
                    {e.fuel}
                  </span>
                </span>
                <span>
                  <MobileLabel color={C.tag}>{data.columns[2]}</MobileLabel>
                  <span className="mt-1 block whitespace-nowrap text-[16px]">{e.years}</span>
                </span>
                <span>
                  <MobileLabel color={C.tag}>{data.columns[3].replace(/^\d{4}\s/, "")}</MobileLabel>
                  <span className="mt-1 block text-[16px] font-bold" style={{ color: C.enq }}>{e.enquiries.replace(/ enquiries$/, "")}</span>
                  <span className="block whitespace-nowrap text-[12px]" style={{ color: C.tag }}>{e.sourceTag}</span>
                </span>
              </span>
              <span className="mt-3 flex items-start gap-2 text-[16px] leading-[1.55]" style={{ color: C.vt }}>
                <span className="flex-1">{e.verdict.text.charAt(0).toUpperCase() + e.verdict.text.slice(1)}</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: C.code }}>
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link href={data.legend.href} className="mt-5 flex items-center gap-4 rounded-[12px] border p-4 font-normal" style={card}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#0a55e6] text-white">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 21h4M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.6.5.8 1.1.8 1.8V16h6v-.1c0-.7.3-1.3.8-1.8A6.5 6.5 0 0 0 12 2.5Z" />
            <path d="M12 6.5a3 3 0 0 0-3 3" />
          </svg>
        </span>
        <span className="flex-1">
          <span className="block text-[18px] font-bold" style={{ color: C.code }}>{data.legend.title}</span>
          <span className="mt-1 block text-[16px] leading-[1.55]" style={{ color: C.vt }}>{data.legend.text}</span>
        </span>
      </Link>
    </MobileSection>
  );
}

export default function HomeSec7({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/80" : "text-[#2a3646]";
  const blue = isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]";
  const line = isDark ? "border-white/[0.08]" : "border-[#e8ecf1]";
  const panel = isDark ? "border-white/[0.1] bg-[rgba(10,16,26,0.9)]" : "border-[#e6eaf0] bg-white";
  const grid = "grid-cols-[minmax(0,1.05fr)_minmax(0,0.68fr)_minmax(0,0.72fr)_minmax(0,1.05fr)_minmax(0,2.5fr)]";

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <ScaleBox width={1536}>
        <Desktop data={data} isDark={isDark} />
      </ScaleBox>

      <Phone data={data} isDark={isDark} />
    </section>
  );
}
