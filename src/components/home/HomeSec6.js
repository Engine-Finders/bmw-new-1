"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";
import BrandIcon from "@/components/home/brandIcon";
import VerdictGlyph from "@/components/home/VerdictGlyph";

// Ownership Economics Centre — decision matrix (left), rule of thumb + deeper links (right),
// and a four-item trust strip underneath. Phone stacks them and ends with the promise card.

const GLYPH = { scrap: "avoid", safe: "safe", watch: "watch" };
const TAG = {
  scrap: "bg-[#fde2e2] text-[#c81e1e]",
  safe: "bg-[#e3f5e8] text-[#178a43]",
  watch: "bg-[#fdefd9] text-[#d97706]",
};

// Desktop spec measured from the 1536px references (Section 6.2.png light, Section 6.png dark).
// Values are px at 1536; columns are fractions so the layout scales below that width.
const SPEC = {
  light: {
    padL: 65, padR: 65, padT: 62, indent: 8, h2: [54, 59], pMt: 7, p: [15.5, 24], pW: 494, matrixMt: 24,
    cols: [909, 483], gap: 14, colGap: 14,
    car: { width: 427.4, left: "865.4px", top: -51.8, filter: "brightness(1.3) contrast(1.05)" },
    matrix: { h: 548, titleH: 55, titleIconTop: 24, titleTextTop: 25, titleX: [32, 67], hdrTop: 55, hdrH: 41, hdrLabelTop: 14,
      dividers: [268, 470, 670], width: 909, labelX: [null, 307, 496, 718], label1Pad: 13,
      rows: [77, 73, 70, 70, 68, 67], thumb: [18, 106, 72], nameX: 148, valuePad: [40, 26], iconX: 688, textX: 718, textW: 168,
      name: [14.5, 21], code: 12.5, value: 15.5, tag: 12.5, valuePitch: 20, verdict: [11, 15.7], icon: 18 },
    rule: { h: 286, iconX: 24, iconTop: 20, icon: 38, titleX: 78, titleTop: 33, quoteX: 27, quoteTop: 80, bodyX: 59, bodyTop: 84, bodyW: 258,
      body: [14, 22], pctX: 358, pctTop: 75, pct: 52, noteTop: 201, noteW: 322, note: [12, 18.5], box: false },
    links: { h: 247, iconX: 24, iconTop: 16, icon: 36, titleX: 79, titleTop: 28, rowsTop: 58, rowH: 35.5, numX: 29, num: 19, textX: 71, arrowR: 37, text: 15, box: false },
    strip: { mt: 13, h: 81, cols: [346, 342, 360, 358], padL: 31, circle: 60, gap: 19, title: 15, sub: 12.5, subW: 176, titleTop: 20, subGap: 8 },
  },
  dark: {
    padL: 81, padR: 83, padT: 57, indent: 16, h2: [50, 55], pMt: 6, p: [15.5, 24], pW: 494, matrixMt: 18,
    cols: [875, 481], gap: 15, colGap: 14,
    car: { width: 393.3, left: "864.3px", top: -47.3, filter: "brightness(0.6) contrast(1.2)" },
    matrix: { h: 561, titleH: 44, titleIconTop: 16, titleTextTop: 18, titleX: [23, 60], hdrTop: 45, hdrH: 34, hdrLabelTop: 11,
      dividers: [270, 466, 642], width: 875, labelX: [null, 296, 488, 750], label1Pad: 10,
      rows: [81.5, 81.75, 80.25, 77.75, 72.75, 73], thumb: [12, 95, 56], nameX: 133, valuePad: [28, 26], iconX: 658, textX: 696, textW: 172,
      name: [15.5, 24], code: 15.5, value: 18, tag: 12, valuePitch: 23, verdict: [11.5, 17.7], icon: 24 },
    rule: { h: 249, iconX: 20, iconTop: 12, icon: 28, titleX: 67, titleTop: 18, quoteX: 30, quoteTop: 70, bodyX: 70, bodyTop: 68, bodyW: 240,
      body: [14, 20.25], pctX: 343, pctTop: 70, pct: 52, noteTop: 178, noteW: 325, note: [12, 18], box: [17, 51, 19, 14] },
    links: { h: 287, iconX: 20, iconTop: 20, icon: 28, titleX: 67, titleTop: 27, rowsTop: 59, rowH: 41.4, numX: 37, num: 23, textX: 78, arrowR: 48, text: 15.5, box: [17, 19] },
    strip: { mt: 10, h: 95, cols: [319, 348, 356, 348], padL: 26, circle: 60, gap: 26, title: 15, sub: 12.5, subW: 186, titleTop: 26, subGap: 10 },
  },
};

const COL = {
  light: {
    bg: "#fefefe", strong: "#0b1236", h2: "#0a0f2c", accent: "#0b3fcf", para: "#4d587b", code: "#2b3258", tag: "#353d64",
    verdict: "#2b3257", label: "#0b1240", blue: "#0b3fcf", num: "#0846d6", note: "#4a5376", quote: "#b5bccc",
    card: "#ffffff", border: "#edf0f4", line: "#eef0f4", shadow: "0 6px 24px rgba(16,24,48,0.05)", titleBand: "transparent", hdrBand: "transparent",
    stripCircle: "#e4e8f0", stripIcon: "#0b3fcf", rowLine: "transparent", boxBg: "transparent", boxBorder: "transparent",
  },
  dark: {
    bg: "#02070e", strong: "#ffffff", h2: "#ffffff", accent: "#1f62d8", para: "#d3d4d6", code: "#dfdfdd", tag: "#b9bdc3",
    verdict: "#d2d5d8", label: "#f4f5f7", blue: "#2f6fe0", num: "#0a4fb4", note: "#b1b4b9", quote: "#6d7685",
    card: "#071320", border: "#1c2734", line: "#1a2531", shadow: "none", titleBand: "#020f1d", hdrBand: "#111f2f",
    stripCircle: "#2a3442", stripIcon: "#c9ced6", rowLine: "#16212d", boxBg: "#0a1624", boxBorder: "#23303f",
  },
};

// Arial cap-height offset: where a capital's top sits inside a line box of height lh.
const capOffset = (fs, lh) => (lh - 1.117 * fs) / 2 + 0.189 * fs;

function Arrow({ className = "h-5 w-5", style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

function BarsIcon({ className = "h-5 w-5", style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 17" className={className} style={style} fill="currentColor">
      <rect x="0" y="9" width="4" height="8" />
      <rect x="7" y="2" width="4" height="15" />
      <rect x="14" y="6" width="4" height="11" />
    </svg>
  );
}

function ShieldGlyph({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Z" />
      <path d="M12 8.2v7.6M9 11.5h6" strokeLinecap="round" />
    </svg>
  );
}

function WrenchGlyph({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M21 6.5a5.5 5.5 0 0 1-7.4 5.2l-8 8a2.1 2.1 0 0 1-3-3l8-8A5.5 5.5 0 0 1 17.5 1l-3.3 3.3.9 3.6 3.6.9L22 5.5c-.6.3-1 .6-1 1Z" />
    </svg>
  );
}

function ShieldBadge({ className = "h-11 w-11" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#0b4fc0] text-white ${className}`}>
      <ShieldGlyph className="h-[55%] w-[55%]" />
    </span>
  );
}

function LinkBadge({ className = "h-11 w-11" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#0b4fc0] text-white ${className}`}>
      <WrenchGlyph className="h-[50%] w-[50%]" />
    </span>
  );
}

function StripIcon({ name }) {
  if (name === "real-inquiries")
    return (
      <svg aria-hidden="true" viewBox="0 0 30 30" className="h-[30px] w-[30px]" fill="currentColor">
        <rect x="3" y="15" width="5" height="12" rx="0.5" /><rect x="10" y="6" width="5" height="21" rx="0.5" /><rect x="17" y="11" width="5" height="16" rx="0.5" /><rect x="24" y="17" width="4" height="10" rx="0.5" />
      </svg>
    );
  if (name === "note")
    return (
      <svg aria-hidden="true" viewBox="0 0 30 30" className="h-[30px] w-[30px]">
        <path d="M6 3h13l5 5v19H6V3Z" fill="currentColor" />
        <path d="M10 11h10M10 15h10M10 19h10M10 23h7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  if (name === "vetted-specialist")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[30px] w-[30px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="M20.6 6.4 17.4 9.6l-3-3 3.2-3.2a5 5 0 0 0-6.4 6.3l-7.8 7.8a2.1 2.1 0 0 0 3 3l7.8-7.8a5 5 0 0 0 6.4-6.3Z" />
      </svg>
    );
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[30px] w-[30px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.5 4.5 5.5v6c0 5 3.3 9 7.5 10 4.2-1 7.5-5 7.5-10v-6L12 2.5Z" />
      <path d="m12 7.6 1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4L12 7.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Desktop({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const S = SPEC[t];
  const C = COL[t];
  const M = S.matrix;
  const R = S.rule;
  const K = S.links;
  const P = S.strip;
  const rows = data.matrix.rows;
  const rule = data.ruleOfThumb;
  const colTpl = M.dividers.map((d, i) => d - (i ? M.dividers[i - 1] : 0)).concat(M.width - M.dividers[2]).map((w) => `minmax(0,${w}fr)`).join(" ");
  const pct = (v, w) => `${(v / w) * 100}%`;
  const cardStyle = { background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, borderRadius: 10 };
  const header = isDark ? data.headerImage.dark : data.headerImage.light;

  return (
    <div className="relative mx-auto hidden w-full max-w-[1600px] lg:block" style={{ paddingLeft: S.padL, paddingRight: S.padR, paddingTop: S.padT, paddingBottom: 40 }}>
      {/* Hero car */}
      <span aria-hidden="true" className="pointer-events-none absolute [mask-image:linear-gradient(90deg,transparent,black_14%,black_100%),linear-gradient(180deg,black_85%,transparent)] [mask-composite:intersect]" style={{ zIndex: 0, ...(isDark ? { left: 620, top: 1, width: 916, height: 264 } : { left: 640, top: 1, width: 896, height: 282 }) }}>
        <Image src={isDark ? data.headerImage.backdropDark : data.headerImage.backdropLight} alt="" fill sizes="920px" className="object-cover" />
      </span>
      <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: S.car.left, top: S.car.top, width: S.car.width, zIndex: 0 }}>
        <div className="absolute inset-x-[4%] top-[84%] h-[7%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0.45),rgba(0,0,0,0.12)_55%,transparent_75%)]" />
        <Image
          src={header}
          alt={data.headerImage.alt}
          width={590}
          height={523}
          sizes="540px"
          className="relative h-auto w-full"
          style={{ filter: S.car.filter }}
        />
        {isDark ? <span className="absolute inset-0 mix-blend-multiply" style={{ background: "#9fb2d0", WebkitMask: `url("${header}") center / 100% 100% no-repeat`, mask: `url("${header}") center / 100% 100% no-repeat` }} /> : null}
      </div>

      <div className="relative" style={{ zIndex: 1, marginLeft: S.indent }}>
        <h2 className="whitespace-nowrap font-bold tracking-[-0.02em] [&_.heading-accent]:text-[var(--acc)]" style={{ fontSize: S.h2[0], lineHeight: `${S.h2[1]}px`, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
        <p style={{ marginTop: S.pMt, fontSize: S.p[0], lineHeight: `${S.p[1]}px`, color: C.para, whiteSpace: "pre-line" }}>{data.subHeadlineDesktop}</p>
      </div>

      <div className="relative grid grid-cols-[var(--c)]" style={{ zIndex: 1, marginTop: S.matrixMt, columnGap: S.gap, rowGap: S.colGap, "--c": `minmax(0,${S.cols[0]}fr) minmax(0,${S.cols[1]}fr)` }}>
        {/* Decision matrix */}
        <div className="relative overflow-hidden" style={{ ...cardStyle, minHeight: M.h }}>
          <div className="relative" style={{ height: M.titleH, background: C.titleBand }}>
            <BarsIcon className="absolute" style={{ left: M.titleX[0], top: M.titleIconTop, width: 18, height: 17, color: C.blue }} />
            <h3 className="absolute font-medium uppercase" style={{ left: M.titleX[1], top: M.titleTextTop, fontSize: 16, lineHeight: "16px", color: C.strong }}>
              {data.matrix.title}
            </h3>
          </div>
          <div aria-hidden="true" style={{ height: 1, background: C.line, marginLeft: isDark ? 0 : 22, marginRight: isDark ? 0 : 22 }} />
          <div className="relative grid" style={{ gridTemplateColumns: colTpl, height: M.hdrH, background: C.hdrBand }}>
            {data.matrix.columns.map((c, i) => (
              <span
                key={c}
                className="whitespace-nowrap font-medium uppercase"
                style={{
                  paddingTop: M.hdrLabelTop,
                  fontSize: 12,
                  lineHeight: "12px",
                  color: C.label,
                  textAlign: i === 0 ? "center" : "left",
                  paddingLeft: i === 0 ? M.label1Pad : M.labelX[i] - M.dividers[i - 1],
                }}
              >
                {c}
              </span>
            ))}
          </div>
          <div aria-hidden="true" style={{ height: 1, background: C.line, marginLeft: isDark ? 0 : 22, marginRight: isDark ? 0 : 22 }} />
          {rows.map((row, ri) => (
            <Link
              key={row.href}
              href={row.href}
              className="relative grid items-center font-normal"
              style={{ gridTemplateColumns: colTpl, gridTemplateRows: "100%", height: M.rows[ri], color: C.strong, borderTop: ri && isDark ? `1px solid ${C.rowLine}` : undefined }}
            >
              <span className="relative flex items-center" style={{ height: "100%" }}>
                <span className="absolute" style={{ left: pct(M.thumb[0], M.dividers[0]), width: M.thumb[1], height: M.thumb[2] }}>
                  <Image src={isDark ? row.image.dark : row.image.src} alt={row.image.alt} fill sizes="96px" className={`object-contain ${isDark ? "" : "mix-blend-multiply"}`} />
                </span>
                <span className="absolute" style={{ left: pct(M.nameX, M.dividers[0]) }}>
                  <span className="block" style={{ fontSize: M.name[0], lineHeight: `${M.name[1]}px` }}>{row.name}</span>
                  <span className="block" style={{ fontSize: M.code, lineHeight: `${M.name[1]}px`, color: C.code }}>{row.code}</span>
                </span>
              </span>
              {[row.vehicleValue, row.replacementCost].map((v, i) => (
                <span key={i} style={{ paddingLeft: M.valuePad[i] }}>
                  <span className="block whitespace-nowrap" style={{ fontSize: M.value, lineHeight: `${M.valuePitch}px` }}>{v.value}</span>
                  <span className="block" style={{ fontSize: M.tag, lineHeight: `${M.valuePitch}px`, color: C.tag }}>{v.tag}</span>
                </span>
              ))}
              <span className="relative flex items-start" style={{ paddingLeft: M.iconX - M.dividers[2], gap: M.textX - M.iconX - M.icon }}>
                <span className="shrink-0" style={{ width: M.icon, height: M.icon }}><VerdictGlyph type={GLYPH[row.verdict.type]} round className="h-full w-full" /></span>
                <span className="whitespace-pre-line" style={{ fontSize: M.verdict[0], lineHeight: `${M.verdict[1]}px`, color: C.verdict }}>
                  {row.verdict.desktop}
                </span>
              </span>
            </Link>
          ))}
          {M.dividers.map((d) => (
            <span key={d} aria-hidden="true" className="absolute" style={{ left: pct(d, M.width), top: M.titleH + 1, bottom: 0, width: 1, background: C.line }} />
          ))}
        </div>

        <div className="grid content-start" style={{ rowGap: S.colGap }}>
          {/* Rule of thumb */}
          <div className="relative" style={{ ...cardStyle, height: R.h }}>
            {R.box ? <div aria-hidden="true" className="absolute" style={{ left: R.box[0], top: R.box[1], right: R.box[2], bottom: R.box[3], background: C.boxBg, border: `1px solid ${C.boxBorder}`, borderRadius: 8 }} /> : null}
            <span className="absolute flex items-center justify-center rounded-full bg-[#0b47d4] text-white" style={{ left: R.iconX, top: R.iconTop, width: R.icon, height: R.icon }}>
              <ShieldGlyph className="h-[56%] w-[56%]" />
            </span>
            <h3 className="absolute font-medium uppercase" style={{ left: R.titleX, top: R.titleTop, fontSize: 15, lineHeight: "15px", color: C.strong }}>{rule.title}</h3>
            <span aria-hidden="true" className="absolute font-serif" style={{ left: R.quoteX, top: R.quoteTop, fontSize: 44, lineHeight: "44px", color: C.quote }}>“</span>
            <p className="absolute whitespace-pre" style={{ left: R.bodyX, top: R.bodyTop, fontSize: R.body[0], lineHeight: `${R.body[1]}px`, color: C.strong }}>{rule.textDesktop}</p>
            <span className="absolute font-bold tracking-[-0.02em]" style={{ left: R.pctX, top: R.pctTop, fontSize: R.pct, lineHeight: `${R.pct}px`, color: C.blue }}>{rule.percent}</span>
            <p className="absolute whitespace-pre" style={{ left: R.bodyX, top: R.noteTop, fontSize: R.note[0], lineHeight: `${R.note[1]}px`, color: C.note }}>{rule.noteDesktop}</p>
          </div>

          {/* Deeper analysis links */}
          <div className="relative" style={{ ...cardStyle, height: K.h }}>
            {K.box ? <div aria-hidden="true" className="absolute" style={{ left: K.box[0], right: K.box[1], top: K.rowsTop, height: K.rowH * data.deeperLinks.length, background: C.boxBg, border: `1px solid ${C.boxBorder}`, borderRadius: 8 }} /> : null}
            <span className="absolute flex items-center justify-center rounded-full bg-[#0b47d4] text-white" style={{ left: K.iconX, top: K.iconTop, width: K.icon, height: K.icon }}>
              <WrenchGlyph className="h-[50%] w-[50%]" />
            </span>
            <h3 className="absolute font-medium uppercase" style={{ left: K.titleX, top: K.titleTop, fontSize: 15, lineHeight: "15px", color: C.strong }}>{data.deeperLinksTitle}</h3>
            <ul className="absolute inset-x-0" style={{ top: K.rowsTop }}>
              {data.deeperLinks.map((l, i) => (
                <li key={l.id} className="relative" style={{ height: K.rowH }}>
                  {i ? <span aria-hidden="true" className="absolute" style={{ top: 0, left: K.box ? K.box[0] : K.textX, right: K.box ? K.box[1] : 24, height: 1, background: isDark ? C.boxBorder : C.line }} /> : null}
                  <Link href={l.href} className="absolute inset-0 flex items-center font-normal" style={{ color: C.strong }}>
                    <span className="absolute flex items-center justify-center rounded-full text-white" style={{ left: K.numX, width: K.num, height: K.num, fontSize: K.num * 0.62, background: C.num }}>{l.id}</span>
                    <span className="absolute" style={{ left: K.textX, fontSize: K.text, lineHeight: `${K.text}px` }}>{l.label}</span>
                    <Arrow className="absolute" style={{ right: K.arrowR - 6, width: 20, height: 20, color: isDark ? "#e8ebf0" : C.blue }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <ul className="relative grid grid-cols-[var(--s)]" style={{ ...cardStyle, zIndex: 1, marginTop: P.mt, minHeight: P.h, background: isDark ? "#081420" : C.card, "--s": P.cols.map((w) => `minmax(0,${w}fr)`).join(" ") }}>
        {data.strip.map((s, i) => (
          <li key={s.title} className="relative flex items-center" style={{ paddingLeft: P.padL, gap: P.gap }}>
            {i ? <span aria-hidden="true" className="absolute" style={{ left: 0, top: 18, bottom: 18, width: 1, background: C.line }} /> : null}
            <span className="flex shrink-0 items-center justify-center rounded-full" style={{ width: P.circle, height: P.circle, border: `1px solid ${C.stripCircle}`, color: C.stripIcon }}>
              <StripIcon name={s.icon} />
            </span>
            <span>
              <span className="block" style={{ fontSize: P.title, lineHeight: `${P.title + 4}px`, color: C.strong }}>{s.title}</span>
              <span className="block whitespace-pre" style={{ marginTop: P.subGap - 4, fontSize: P.sub, lineHeight: "18px", color: C.para }}>{s.textDesktop}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Phone spec measured from Section 6.4.png (852px capture, compared at 426px). Values are CSS px;
// tops are cap-height tops relative to the section (or card) top, x inside the matrix is /397.
const PH = {
  h2: { left: 16, cap: 31.5, fs: 21, lh: 23 },
  p: { left: 16, cap: 85.5, fs: 8.1, lh: 12.85 },
  car: { left: 236.6, top: 8.4, width: 171.4 },
  inset: 14.5,
  matrix: {
    top: 148, h: 386.5, w: 397, titleIcon: [9, 7.5, 9.5], title: { left: 24.5, cap: 8, fs: 7.8 }, titleLine: 23.75, hdrLine: 54,
    cols: [90.5, 76, 74, 131.5, 25], hdr: { fs: [5.2, 4.5, 4.5, 5.2], lh: 6.25, caps: [[36], [31, 41], [30.5, 37, 43], [36]] },
    rowTops: [54, 110, 162.9, 215.6, 268.6, 322.9, 379.1],
    thumb: { left: 6.8, w: 41 }, nameX: 55.5, name: 7, gen: 8, code: 6.2, nameCaps: [-12.5, -1.5, 10], nameCapsShort: [-8, 4],
    valueX: [108.5, 185], value: 6.05, tag: 5.6, valueCaps: [-6, 3],
    glyphX: 256, glyph: 11, pillX: 271, pill: [23, 11, 6.4], pillTops: [11.5, 11.5, 8.1, 10.9, 12.4, 4.1], textGap: 16, verdict: [6.35, 9.75],
    chevX: 384, chev: [3, 5],
  },
  rule: { top: 542.5, h: 105, badge: [11, 12, 29], title: { left: 51, cap: 11.5, fs: 7.7 }, body: { cap: 26.5, fs: 7.65, lh: 12.75 }, note: { cap: 68.5, fs: 6.75, lh: 10.5 },
    pct: { right: 29.5, cap: 25.5, fs: 36.3 }, label: { cx: 61.25, cap: 62, fs: 7.9 }, ring: { cx: 61.25, cy: 52.5, r: 37.5, sw: 10 } },
  links: { top: 651, h: 145, icon: [11, 7.5, 15], title: { left: 36, cap: 11.5, fs: 8.25 }, row0: 34, pitch: 22.5, num: { cx: 18.5, d: 14, fs: 7.4 }, text: { left: 36, fs: 7.5 },
    lineTop: 48, lineRight: 13, arrow: { right: 17.5, w: 7.5 } },
  cta: { top: 805, h: 53, badge: [11, 11, 30], title: { left: 51.5, cap: 11.5, fs: 7.6 }, text: { cap: 25, fs: 6.7, lh: 12 }, btn: { right: 13.5, top: 14.5, w: 126, h: 26.5, fs: 7.6 } },
  h: 873,
};

const PILL = {
  light: { scrap: ["#fee4e5", "#cd1f1f"], safe: ["#def2de", "#1f8a3d"], watch: ["#fef0dc", "#de7b06"] },
  dark: { scrap: ["rgba(220,38,38,0.18)", "#f87171"], safe: ["rgba(34,197,94,0.16)", "#4ade80"], watch: ["rgba(245,158,11,0.16)", "#fbbf24"] },
};

// Absolute text placed by its cap top (Arial).
function CapText({ as: Tag = "span", left, right, cap, fs, lh, style, className = "", children }) {
  const l = lh ?? fs * 1.2;
  return (
    <Tag className={`absolute ${className}`} style={{ left, right, top: cap - capOffset(fs, l), fontSize: fs, lineHeight: `${l}px`, ...style }}>
      {children}
    </Tag>
  );
}

function ChainGlyph({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M10 14a3.5 3.5 0 0 0 5 0l3.5-3.5a3.5 3.5 0 0 0-5-5L12 7" />
      <path d="M14 10a3.5 3.5 0 0 0-5 0l-3.5 3.5a3.5 3.5 0 0 0 5 5L12 17" />
    </svg>
  );
}

// Car thumbnail sized by the car itself (bbox from the JSON), so the photo's white margin is cropped in CSS.
function Thumb({ image, isDark, left, cy, width }) {
  const [x0, y0, x1, y1] = image.bbox;
  const [W, H] = image.size;
  const boxW = width / (x1 - x0);
  const boxH = (boxW * H) / W;
  const h = boxH * (y1 - y0);
  return (
    <span className="absolute overflow-hidden" style={{ left, top: cy - h / 2, width, height: h }}>
      <Image src={isDark ? image.dark : image.src} alt={image.alt} width={W} height={H} sizes="64px" className={`absolute max-w-none ${isDark ? "" : "mix-blend-multiply"}`} style={{ left: -x0 * boxW, top: -y0 * boxH, width: boxW, height: boxH }} />
    </span>
  );
}

function Phone({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const C = COL[t];
  const M = PH.matrix;
  const R = PH.rule;
  const K = PH.links;
  const A = PH.cta;
  const rows = data.matrix.rows;
  const rule = data.ruleOfThumb;
  const x = (v) => `${(v / M.w) * 100}%`;
  const card = { left: PH.inset, right: PH.inset, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, boxShadow: isDark ? "none" : "0 2px 10px rgba(16,24,48,0.04)" };
  const soft = { left: PH.inset, right: PH.inset, background: isDark ? C.boxBg : "#f5f7fe", border: `1px solid ${isDark ? C.boxBorder : "#f0f3fb"}`, borderRadius: 6 };
  const edges = M.cols.reduce((a, w) => a.concat(a[a.length - 1] + w), [0]);
  const [pre, post] = rule.textPhone.split(rule.percent);

  return (
    <div className="relative lg:hidden" style={{ height: PH.h }}>
      <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: PH.car.left, top: PH.car.top, width: PH.car.width }}>
        {isDark ? (
          <div className="absolute inset-[-14%] bg-[radial-gradient(ellipse_at_50%_45%,rgba(70,96,140,0.35),transparent_65%)]" />
        ) : (
          <div className="absolute -inset-x-[30%] -top-[20%] bottom-[-6%] bg-[radial-gradient(ellipse_at_55%_45%,#ffffff_0%,#eef0f3_50%,rgba(254,254,254,0)_78%)]" />
        )}
        <Image src={isDark ? data.headerImage.phoneDark : data.headerImage.phone} alt={data.headerImage.alt} width={547} height={495} sizes="180px" className={`relative h-auto w-full ${isDark ? "" : "mix-blend-multiply"}`} />
      </div>

      <CapText as="h2" left={PH.h2.left} cap={PH.h2.cap} fs={PH.h2.fs} lh={PH.h2.lh} className="whitespace-nowrap font-bold tracking-[-0.02em] [&_.heading-accent]:text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }}>
        <span dangerouslySetInnerHTML={{ __html: data.h2 }} />
      </CapText>
      <CapText as="p" left={PH.p.left} cap={PH.p.cap} fs={PH.p.fs} lh={PH.p.lh} className="whitespace-pre" style={{ color: C.para }}>
        {data.subHeadlinePhone}
      </CapText>

      {/* Decision matrix */}
      <div className="absolute overflow-hidden" style={{ ...card, top: M.top, height: M.h }}>
        <BarsIcon className="absolute" style={{ left: M.titleIcon[0], top: M.titleIcon[1], width: M.titleIcon[2], height: M.titleIcon[2], color: C.blue }} />
        <CapText as="h3" left={M.title.left} cap={M.title.cap} fs={M.title.fs} className="font-bold uppercase" style={{ color: C.blue }}>{data.matrix.title}</CapText>
        <span aria-hidden="true" className="absolute" style={{ left: 7.5, right: 7.5, top: M.titleLine, height: 1, background: C.line }} />
        {data.matrix.phoneColumns.map((c, i) => (
          <span key={c.label} className="absolute text-center uppercase" style={{ left: x(edges[i]), width: x(M.cols[i]) }}>
            {[c.label.split("\n"), c.sub ? [c.sub] : []].flat().map((ln, j) => (
              <CapText key={ln} left={0} right={0} cap={M.hdr.caps[i][j]} fs={M.hdr.fs[i]} lh={M.hdr.lh} className={ln === c.sub ? "" : "font-bold"} style={{ color: ln === c.sub ? C.tag : C.blue }}>
                {ln}
              </CapText>
            ))}
          </span>
        ))}
        {[1, 2, 3].map((i) => (
          <span key={i} aria-hidden="true" className="absolute" style={{ left: x(edges[i]), top: M.titleLine + 6, height: M.hdrLine - M.titleLine - 12, width: 1, background: C.line }} />
        ))}
        <span aria-hidden="true" className="absolute" style={{ left: 7.5, right: 7.5, top: M.hdrLine, height: 1, background: C.line }} />
        <span aria-hidden="true" className="absolute" style={{ left: x(edges[2]), top: M.hdrLine + 12, bottom: 12, width: 1, background: C.line }} />
        {rows.map((row, ri) => {
          const top = M.rowTops[ri];
          const h = M.rowTops[ri + 1] - top;
          const c = h / 2;
          const [gen, ...engine] = row.code.split(" ");
          const lines = engine.length ? [[row.name, M.name], [gen, M.gen], [engine.join(" "), M.code]] : [[row.name, M.gen], [row.code, M.code]];
          const caps = engine.length ? M.nameCaps : M.nameCapsShort;
          const pt = M.pillTops[ri];
          const [pillBg, pillFg] = PILL[t][row.verdict.type];
          return (
            <Link key={row.href} href={row.href} className="absolute inset-x-0 font-normal" style={{ top, height: h, color: C.strong }}>
              <Thumb image={row.image} isDark={isDark} left={x(M.thumb.left)} cy={c} width={M.thumb.w} />
              {lines.map(([txt, fs], i) => (
                <CapText key={txt} left={x(M.nameX)} cap={c + caps[i]} fs={fs} className={`whitespace-nowrap ${i === lines.length - 1 ? "" : "font-bold"}`} style={{ color: i === lines.length - 1 ? C.code : C.strong }}>
                  {txt}
                </CapText>
              ))}
              {[row.vehicleValue, row.replacementCost].map((v, i) => (
                <span key={i}>
                  <CapText left={x(M.valueX[i])} cap={c + M.valueCaps[0]} fs={M.value} className="whitespace-nowrap">{v.value}</CapText>
                  <CapText left={x(M.valueX[i])} cap={c + M.valueCaps[1]} fs={M.tag} className="whitespace-nowrap" style={{ color: C.tag }}>{v.tag}</CapText>
                </span>
              ))}
              <span className="absolute" style={{ left: x(M.glyphX), top: pt - 0.5, width: M.glyph, height: M.glyph }}>
                <VerdictGlyph type={GLYPH[row.verdict.type]} round className="h-full w-full" />
              </span>
              <span className="absolute flex items-center justify-center rounded-[3px]" style={{ left: x(M.pillX), top: pt - 2, width: M.pill[0], height: M.pill[1], fontSize: M.pill[2], lineHeight: 1, background: pillBg, color: pillFg }}>
                {row.verdict.label}
              </span>
              <CapText left={x(M.glyphX)} cap={pt + M.textGap} fs={M.verdict[0]} lh={M.verdict[1]} className="whitespace-pre" style={{ color: C.verdict }}>
                {row.verdict.phone}
              </CapText>
              <svg aria-hidden="true" viewBox="0 0 5 9" className="absolute" style={{ left: x(M.chevX), top: c - M.chev[1] / 2 + 1, width: M.chev[0], height: M.chev[1], color: C.blue }} fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m.8.8 3.4 3.7L.8 8.2" />
              </svg>
            </Link>
          );
        })}
      </div>

      {/* Rule of thumb */}
      <div className="absolute overflow-hidden" style={{ ...soft, top: R.top, height: R.h }}>
        <svg aria-hidden="true" className="absolute" viewBox="-50 -50 100 100" style={{ right: R.ring.cx - 50, top: R.ring.cy - 50, width: 100, height: 100 }}>
          <path d={`M ${-R.ring.r * Math.sin(0.6)} ${R.ring.r * Math.cos(0.6)} A ${R.ring.r} ${R.ring.r} 0 1 1 ${R.ring.r * Math.sin(0.6)} ${R.ring.r * Math.cos(0.6)}`} fill="none" stroke={isDark ? "rgba(47,111,224,0.10)" : "#ebf0fb"} strokeWidth={R.ring.sw} />
        </svg>
        <span className="absolute flex items-center justify-center rounded-full" style={{ left: R.badge[0], top: R.badge[1], width: R.badge[2], height: R.badge[2], background: isDark ? "#10233d" : "#e4ebfa" }}>
          <svg aria-hidden="true" viewBox="3.5 1.5 17 21" style={{ width: 21, height: 25 }}>
            <path d="M12 2 4 5v6.5c0 5.3 3.4 9.4 8 10.5 4.6-1.1 8-5.2 8-10.5V5l-8-3Z" fill="#0b47d4" />
            <path d="M12 8.5 9 10v2.3c0 2 1.3 3.6 3 4 1.7-.4 3-2 3-4V10l-3-1.5Z" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
          </svg>
        </span>
        <CapText as="h3" left={R.title.left} cap={R.title.cap} fs={R.title.fs} className="font-bold uppercase" style={{ color: C.strong }}>{rule.title}</CapText>
        <CapText as="p" left={R.title.left} cap={R.body.cap} fs={R.body.fs} lh={R.body.lh} className="whitespace-pre" style={{ color: C.strong }}>
          {pre}
          <strong className="font-bold" style={{ color: C.blue }}>{rule.percent}</strong>
          {post}
        </CapText>
        <CapText as="p" left={R.title.left} cap={R.note.cap} fs={R.note.fs} lh={R.note.lh} className="whitespace-pre" style={{ color: C.note }}>{rule.notePhone}</CapText>
        <CapText right={R.pct.right} cap={R.pct.cap} fs={R.pct.fs} lh={R.pct.fs} className="font-bold tracking-[-0.07em]" style={{ color: C.blue }}>{rule.percent}</CapText>
        <CapText right={R.label.cx - 50} cap={R.label.cap} fs={R.label.fs} className="w-[100px] text-center font-bold uppercase" style={{ color: C.blue }}>{rule.percentLabel}</CapText>
      </div>

      {/* Deeper analysis links */}
      <div className="absolute" style={{ ...card, top: K.top, height: K.h }}>
        <span className="absolute flex items-center justify-center rounded-full bg-[#0b47d4] text-white" style={{ left: K.icon[0], top: K.icon[1], width: K.icon[2], height: K.icon[2] }}>
          <ChainGlyph className="h-[60%] w-[60%]" />
        </span>
        <CapText as="h3" left={K.title.left} cap={K.title.cap} fs={K.title.fs} className="font-bold uppercase" style={{ color: C.strong }}>{data.deeperLinksTitle}</CapText>
        {data.deeperLinks.map((l, i) => {
          const cap = K.row0 + i * K.pitch;
          return (
            <Link key={l.id} href={l.href} className="absolute inset-x-0 font-normal" style={{ top: 0, height: 0, color: C.strong }}>
              <span className="absolute flex items-center justify-center rounded-full" style={{ left: K.num.cx - K.num.d / 2, top: cap + 3.2 - K.num.d / 2, width: K.num.d, height: K.num.d, fontSize: K.num.fs, fontWeight: 700, background: isDark ? "#10233d" : "#e8eefd", color: C.blue }}>{l.id}</span>
              <CapText left={K.text.left} cap={cap} fs={K.text.fs} className="whitespace-nowrap">{l.label}</CapText>
              <Arrow className="absolute" style={{ right: K.arrow.right - 1, top: cap - 1, width: K.arrow.w + 2, height: K.arrow.w + 2, color: C.blue }} />
              {i < data.deeperLinks.length - 1 ? <span aria-hidden="true" className="absolute" style={{ left: K.text.left - 0.5, right: K.lineRight, top: K.lineTop + i * K.pitch, height: 1, background: C.line }} /> : null}
            </Link>
          );
        })}
      </div>

      {/* Promise */}
      <div className="absolute" style={{ ...soft, top: A.top, height: A.h }}>
        <span className="absolute flex items-center justify-center rounded-full bg-[#0b47d4]" style={{ left: A.badge[0], top: A.badge[1], width: A.badge[2], height: A.badge[2], boxShadow: isDark ? "none" : "0 0 0 2px #e6ecfb" }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[62%] w-[62%]">
            <path d="M12 2.5 5 5.2v5.6c0 4.8 3 8.5 7 9.7 4-1.2 7-4.9 7-9.7V5.2l-7-2.7Z" fill="#fff" stroke="#9db5ef" strokeWidth="1" />
            <path d="M12 7.5c.4 1.6 2.6 2.4 2.6 4.8a2.6 2.6 0 0 1-5.2 0c0-1 .5-1.7 1-2.2.1.8.6 1.3 1 1.3-.3-1.6.1-2.8.6-3.9Z" fill="#0b47d4" />
          </svg>
        </span>
        <CapText as="p" left={A.title.left} cap={A.title.cap} fs={A.title.fs} className="font-bold" style={{ color: C.strong }}>{data.bottomCta.title}</CapText>
        <CapText as="p" left={A.title.left} cap={A.text.cap} fs={A.text.fs} lh={A.text.lh} className="whitespace-pre" style={{ color: C.note }}>{data.bottomCta.textPhone}</CapText>
        <Link href={data.bottomCta.href} className="absolute flex items-center justify-center gap-[5px] rounded-[3px] bg-[#023fd3] font-normal text-white" style={{ right: A.btn.right, top: A.btn.top, width: A.btn.w, height: A.btn.h, fontSize: A.btn.fs }}>
          {data.bottomCta.buttonLabel}
          <Arrow className="h-[9px] w-[9px]" />
        </Link>
      </div>
    </div>
  );
}


export default function HomeSec6({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <ScaleBox width={1536}>
        <Desktop data={data} isDark={isDark} />
      </ScaleBox>
      <ScaleBox width={426} max={1.5}>
        <Phone data={data} isDark={isDark} />
      </ScaleBox>
    </section>
  );
}
