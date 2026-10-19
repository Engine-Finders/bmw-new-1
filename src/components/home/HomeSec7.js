"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";
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

// Phone spec measured on Section 7.2.png (864px capture, compared at 432px). CSS px; caps are
// cap-height tops relative to the section / card / row top; table x values are /402 of the card.
const PH = {
  inset: 15,
  img: { left: 140, top: 0, w: 292, h: 210.5 },
  h2: { left: 19, caps: 45, fs: 29.5, lh: 33.75, track: "-0.04em" },
  p: { left: 19, cap: 152, fs: 9.38, lh: 16.75 },
  trust: { top: 211.5, h: 90, iconCy: 22.75, icon: 19.5, caps: 42.5, caps2: 46.5, fs: 8.2, lh: 13.75 },
  table: { top: 314, h: 439, w: 402, hdrCap: 12, hdr: 8.3, labelX: [11.5, 126.75, 196.5, 245, 362.25], labelAlign: ["left", "center", "center", "left", "center"],
    dividers: [93.25, 161.5, 232, 326.75], rows: [31, 76.25, 122.25, 168, 213.5, 258.75, 303.75, 348.75, 393.75, 439],
    codeX: 11.5, codeCap: 13, code: 11.5, specGap: 15, spec: 7.7, fuelIconX: 113, fuelIconCy: 22, fuelIcon: { Diesel: [11, 15.5], Petrol: [13, 13] },
    fuelX: 128, fuelCap: 20, fuel: 8.4, yearsX: 174, yearsCap: 20, yearsCap2: 13.75, years: 8.4, yearsLh: 12,
    enqX: 245, enqCap: 13, enq: 8.85, tagCap: 27, tag: 7.4, iconCx: 353.75, iconCy: 22.75, icon: { watch: [19.5, 17.5], safe: [17.5, 17.5], avoid: [17.5, 17.5], solid: [17, 17], best: [17.5, 20] },
    chevCx: 387, chev: [4.5, 8] },
  legend: { top: 770, h: 65, icon: [11.5, 12, 37.5], textX: 66.5, titleCap: 14.5, title: 10.2, textCap: 31, text: 8.9, textLh: 14, chevX: 382, chevCy: 33 },
  h: 853,
};

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

function PhoneCap({ left, right, cap, fs, lh, className = "", style, children }) {
  const l = lh ?? fs * 1.2;
  return (
    <span className={`absolute ${className}`} style={{ left, right, top: cap - capOffset(fs, l), fontSize: fs, lineHeight: `${l}px`, ...style }}>
      {children}
    </span>
  );
}

function Phone({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const T = PH.table;
  const x = (v) => `${(v / T.w) * 100}%`;
  const card = { left: PH.inset, right: PH.inset, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: isDark ? "none" : "0 4px 16px rgba(16,24,48,0.04)" };
  const chevron = (style) => (
    <svg aria-hidden="true" viewBox="0 0 6 11" className="absolute" style={style} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="m.8.8 4.4 4.7L.8 10.2" />
    </svg>
  );

  return (
    <div className="relative lg:hidden" style={{ height: PH.h }}>
      <div aria-hidden="true" className="pointer-events-none absolute overflow-hidden" style={{ left: PH.img.left, right: 0, top: PH.img.top, height: PH.img.h }}>
        {isDark ? (
          <Image src={data.headerImage.dark} alt="" fill sizes="300px" className="object-cover object-right [mask-image:linear-gradient(90deg,transparent,black_30%)]" />
        ) : (
          <Image src={data.headerImage.phone} alt="" fill sizes="300px" className="object-cover object-left-top" />
        )}
      </div>

      <h2 className="absolute whitespace-nowrap font-bold [&_.heading-accent]:text-[var(--acc)]" style={{ left: PH.h2.left, top: PH.h2.caps - capOffset(PH.h2.fs, PH.h2.lh), fontSize: PH.h2.fs, lineHeight: `${PH.h2.lh}px`, letterSpacing: PH.h2.track, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2Phone }} />
      <PhoneCap left={PH.p.left} cap={PH.p.cap} fs={PH.p.fs} lh={PH.p.lh} className="whitespace-pre" style={{ color: C.para }}>{data.subHeadlinePhone}</PhoneCap>

      {/* Trust strip */}
      <ul className="absolute grid grid-cols-4" style={{ ...card, top: PH.trust.top, height: PH.trust.h, paddingRight: "2%" }}>
        {data.trustStrip.map((t, i) => (
          <li key={t.icon} className="relative text-center" style={{ borderLeft: i ? `1px solid ${C.line}` : undefined, marginTop: 14, marginBottom: 14 }}>
            <span className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ top: PH.trust.iconCy - 14, width: PH.trust.icon, height: PH.trust.icon, color: isDark ? "#3b82f6" : C.hdr }}>
              <TrustGlyph name={t.icon} />
            </span>
            <PhoneCap left={0} right={0} cap={(t.lines.length < 3 ? PH.trust.caps2 : PH.trust.caps) - 14} fs={PH.trust.fs} lh={PH.trust.lh} style={{ color: C.text }}>
              {t.lines.map((l) => (l.startsWith("**") ? <strong key={l} className="block font-bold">{l.slice(2, -2)}</strong> : <span key={l} className="block">{l}</span>))}
            </PhoneCap>
          </li>
        ))}
      </ul>

      {/* Engine table */}
      <div className="absolute overflow-hidden" style={{ ...card, top: T.top, height: T.h }}>
        {data.columns.map((c, i) => (
          <PhoneCap key={c} left={T.labelAlign[i] === "center" ? `calc(${x(T.labelX[i])} - 50px)` : x(T.labelX[i])} cap={T.hdrCap} fs={T.hdr} className={`whitespace-nowrap font-bold uppercase ${T.labelAlign[i] === "center" ? "w-[100px] text-center" : ""}`} style={{ color: isDark ? "#ffffff" : C.hdr }}>
            {c}
          </PhoneCap>
        ))}
        <span aria-hidden="true" className="absolute" style={{ left: 9, right: 9, top: T.rows[0], height: 1, background: C.line }} />
        {T.dividers.map((d) => (
          <span key={d} aria-hidden="true" className="absolute" style={{ left: x(d), top: 8, bottom: 0, width: 1, background: C.line }} />
        ))}
        {data.engines.map((e, ri) => {
          const top = T.rows[ri];
          const h = T.rows[ri + 1] - top;
          const [fw, fh] = T.fuelIcon[e.fuel] ?? T.fuelIcon.Petrol;
          const [iw, ih] = T.icon[e.verdict.type] ?? T.icon.best;
          const twoLine = e.yearsPhone.includes("\n");
          return (
            <Link key={e.code} href={e.href} className="absolute inset-x-0 font-normal" style={{ top, height: h, color: C.text }}>
              <span aria-hidden="true" className="absolute inset-y-0 left-0" style={{ width: 2, background: isDark ? C.bar : "#b2c9f5" }} />
              {ri ? <span aria-hidden="true" className="absolute" style={{ left: 9, right: 9, top: 0, height: 1, background: C.line }} /> : null}
              <PhoneCap left={x(T.codeX)} cap={T.codeCap} fs={T.code} className="whitespace-nowrap font-bold" style={{ color: C.code }}>{e.code}</PhoneCap>
              <PhoneCap left={x(T.codeX)} cap={T.codeCap + T.specGap} fs={T.spec} className="whitespace-nowrap" style={{ color: C.spec }}>{e.spec}</PhoneCap>
              <FuelMark fuel={e.fuel} color={C.fuelIcon} className="absolute" style={{ left: `calc(${x(T.fuelIconX)} - ${fw / 2}px)`, top: T.fuelIconCy - fh / 2, width: fw, height: fh }} />
              <PhoneCap left={x(T.fuelX)} cap={T.fuelCap} fs={T.fuel} className="whitespace-nowrap">{e.fuel}</PhoneCap>
              <PhoneCap left={x(T.yearsX)} cap={twoLine ? T.yearsCap2 : T.yearsCap} fs={T.years} lh={T.yearsLh} className="whitespace-pre">{e.yearsPhone}</PhoneCap>
              <PhoneCap left={x(T.enqX)} cap={T.enqCap} fs={T.enq} className="whitespace-nowrap font-bold" style={{ color: C.enq }}>{e.enquiries}</PhoneCap>
              <PhoneCap left={x(T.enqX)} cap={T.tagCap} fs={T.tag} className="whitespace-nowrap" style={{ color: C.tag }}>{e.sourceTag}</PhoneCap>
              <VerdictMark type={e.verdict.type} className="absolute" style={{ left: `calc(${x(T.iconCx)} - ${iw / 2}px)`, top: T.iconCy - ih / 2, width: iw, height: ih }} />
              {chevron({ left: `calc(${x(T.chevCx)} - ${T.chev[0] / 2}px)`, top: T.iconCy - T.chev[1] / 2, width: T.chev[0], height: T.chev[1], color: C.code })}
            </Link>
          );
        })}
      </div>

      {/* Verdict legend */}
      <Link href={data.legend.href} className="absolute font-normal" style={{ ...card, top: PH.legend.top, height: PH.legend.h }}>
        <span className="absolute flex items-center justify-center rounded-[6px] bg-[#0a55e6] text-white" style={{ left: PH.legend.icon[0], top: PH.legend.icon[1], width: PH.legend.icon[2], height: PH.legend.icon[2] }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 21h4M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.6.5.8 1.1.8 1.8V16h6v-.1c0-.7.3-1.3.8-1.8A6.5 6.5 0 0 0 12 2.5Z" />
            <path d="M12 6.5a3 3 0 0 0-3 3" />
          </svg>
        </span>
        <PhoneCap left={PH.legend.textX} cap={PH.legend.titleCap} fs={PH.legend.title} className="whitespace-nowrap font-bold" style={{ color: C.code }}>{data.legend.title}</PhoneCap>
        <PhoneCap left={PH.legend.textX} cap={PH.legend.textCap} fs={PH.legend.text} lh={PH.legend.textLh} className="whitespace-pre" style={{ color: C.vt }}>{data.legend.textPhone}</PhoneCap>
        {chevron({ left: PH.legend.chevX, top: PH.legend.chevCy - 4.5, width: 5, height: 9, color: C.code })}
      </Link>
    </div>
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

      <ScaleBox width={432} max={1.5}>

        <Phone data={data} isDark={isDark} />

      </ScaleBox>
    </section>
  );
}
