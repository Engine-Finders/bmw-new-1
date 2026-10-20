"use client";

import Image from "next/image";
import Link from "next/link";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";
import { MobileCard, MobileHeading, MobileLabel, MobileLead, MobileSection } from "@/components/home/mobileKit";
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
          <div className="relative grid" style={{ gridTemplateColumns: colTpl, height: M.hdrH, background: TABLE_HEADER_BG }}>
            {data.matrix.columns.map((c, i) => (
              <span
                key={c}
                className="whitespace-nowrap font-medium uppercase"
                style={{
                  paddingTop: M.hdrLabelTop,
                  fontSize: 12,
                  lineHeight: "12px",
                  color: TABLE_HEADER_TEXT,
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

const VERDICT_PILL = {
  light: { scrap: ["#fde8e8", "#c81e1e"], safe: ["#e2f5e7", "#15803d"], watch: ["#fdf0dc", "#b45309"] },
  dark: { scrap: ["rgba(220,38,38,0.18)", "#f87171"], safe: ["rgba(34,197,94,0.16)", "#4ade80"], watch: ["rgba(245,158,11,0.16)", "#fbbf24"] },
};

// Car photo cropped to the car itself (bbox from the JSON), so it fills its slot instead of
// floating in the photo's white margin.
function CarCrop({ image, isDark, width }) {
  const [x0, y0, x1, y1] = image.bbox;
  const [W, H] = image.size;
  const boxW = width / (x1 - x0);
  const boxH = (boxW * H) / W;
  const h = boxH * (y1 - y0);
  return (
    <span className="relative shrink-0 overflow-hidden" style={{ width, height: h }}>
      <Image src={isDark ? image.dark : image.src} alt={image.alt} width={W} height={H} sizes={`${Math.round(width * 2)}px`} className={`absolute max-w-none ${isDark ? "" : "mix-blend-multiply"}`} style={{ left: -x0 * boxW, top: -y0 * boxH, width: boxW, height: boxH }} />
    </span>
  );
}

// Phone / tablet: readable stacked layout (body 17px, entries 16–18px, labels 13px).
function Phone({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const C = COL[t];
  const rule = data.ruleOfThumb;
  const [pre, ...rest] = rule.text.split(rule.percent);
  const cols = data.matrix.phoneColumns.map((c) => c.short ?? c.label.replace("\n", " "));

  return (
    <MobileSection>
      <div className="relative mb-6 h-[200px] overflow-hidden rounded-[16px]">
        <Image src={isDark ? data.headerImage.backdropDark : data.headerImage.backdropLight} alt="" fill sizes="720px" className="object-cover" />
        <Image src={data.headerImage.phoneDark} alt={data.headerImage.alt} fill sizes="400px" className="object-contain object-bottom p-3 pb-1" style={{ filter: isDark ? "brightness(0.6) contrast(1.2)" : undefined }} />
      </div>
      <MobileHeading html={data.h2} color={C.h2} accent={C.accent} />
      <MobileLead color={C.para}>{data.subHeadline}</MobileLead>

      {/* Decision matrix: one card per model */}
      <MobileCard C={C} className="mt-7">
        <h3 className="flex items-center gap-2.5 border-b px-4 py-3.5 text-[15px] font-bold uppercase tracking-[0.04em]" style={{ color: C.blue, borderColor: C.line }}>
          <BarsIcon className="h-4 w-4" />
          {data.matrix.title}
        </h3>
        <ul>
          {data.matrix.rows.map((row) => {
            const [pillBg, pillFg] = VERDICT_PILL[t][row.verdict.type];
            return (
              <li key={row.href} className="border-b last:border-b-0" style={{ borderColor: C.line }}>
                <Link href={row.href} className="block px-4 py-4 font-normal" style={{ color: C.strong }}>
                  <span className="flex items-center gap-4">
                    <CarCrop image={row.image} isDark={isDark} width={148} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[18px] font-bold leading-tight">{row.name}</span>
                      <span className="mt-0.5 block text-[14px]" style={{ color: C.code }}>{row.code}</span>
                    </span>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: C.blue }}>
                      <path d="m9 5 7 7-7 7" />
                    </svg>
                  </span>
                  <span className="mt-3 block rounded-[8px] px-3.5" style={{ background: isDark ? C.boxBg : "#f6f8fc" }}>
                    {[row.vehicleValue, row.replacementCost].map((v, i) => (
                      <span key={i} className="flex items-center justify-between gap-3 border-b py-2.5 last:border-b-0" style={{ borderColor: isDark ? C.boxBorder : "#e6eaf2" }}>
                        <span style={{ color: C.tag }}>
                          <span className="block text-[12px] font-semibold uppercase tracking-[0.03em]">{cols[i + 1]}</span>
                          <span className="block text-[11px] opacity-80">{v.tag}</span>
                        </span>
                        <span className="whitespace-nowrap text-[15px] font-semibold">{v.value}</span>
                      </span>
                    ))}
                  </span>
                  <span className="mt-3 flex items-start gap-2.5">
                    <span className="mt-[1px] h-5 w-5 shrink-0">
                      <VerdictGlyph type={GLYPH[row.verdict.type]} round className="h-full w-full" />
                    </span>
                    <span className="text-[16px] leading-[1.55]" style={{ color: C.verdict }}>
                      <span className="mr-1.5 inline-block rounded-[4px] px-2 py-[1px] text-[14px] font-semibold" style={{ background: pillBg, color: pillFg }}>{row.verdict.label}</span>
                      {row.verdict.lead === row.verdict.label ? row.verdict.text.charAt(0).toUpperCase() + row.verdict.text.slice(1) : `${row.verdict.lead} — ${row.verdict.text}`}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </MobileCard>

      {/* Rule of thumb */}
      <div className="mt-5 rounded-[12px] border p-5" style={{ background: isDark ? C.boxBg : "#f4f7fe", borderColor: isDark ? C.boxBorder : "#e6ecfa" }}>
        <div className="flex items-start justify-between gap-4">
          <h3 className="flex items-center gap-3 text-[16px] font-bold uppercase tracking-[0.03em]" style={{ color: C.strong }}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b47d4] text-white">
              <ShieldGlyph className="h-5 w-5" />
            </span>
            {rule.title}
          </h3>
          <span className="shrink-0 text-right">
            <span className="block text-[40px] font-bold leading-none tracking-[-0.03em]" style={{ color: C.blue }}>{rule.percent}</span>
            <span className="mt-1 block text-[13px] font-bold uppercase" style={{ color: C.blue }}>{data.phoneThresholdLabel}</span>
          </span>
        </div>
        <p className="mt-4 text-[17px] leading-[1.6]" style={{ color: C.strong }}>
          {pre}
          <strong className="font-bold" style={{ color: C.blue }}>{rule.percent}</strong>
          {rest.join(rule.percent)}
        </p>
        <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: C.note }}>{rule.note}</p>
      </div>

      {/* Deeper analysis links */}
      <MobileCard C={C} className="mt-5">
        <h3 className="flex items-center gap-3 px-4 pt-4 text-[16px] font-bold uppercase tracking-[0.03em]" style={{ color: C.strong }}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b47d4] text-white">
            <WrenchGlyph className="h-4 w-4" />
          </span>
          {data.deeperLinksTitle}
        </h3>
        <ul className="px-4 pb-2 pt-2">
          {data.deeperLinks.map((l) => (
            <li key={l.id} className="border-b last:border-b-0" style={{ borderColor: C.line }}>
              <Link href={l.href} className="flex items-center gap-3 py-3.5 text-[17px] font-normal" style={{ color: C.strong }}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[15px] font-bold" style={{ background: isDark ? "#10233d" : "#e8eefd", color: C.blue }}>{l.id}</span>
                <span className="flex-1">{l.label}</span>
                <Arrow className="h-5 w-5 shrink-0" style={{ color: C.blue }} />
              </Link>
            </li>
          ))}
        </ul>
      </MobileCard>

      {/* Promise */}
      <div className="mt-5 rounded-[12px] border p-5" style={{ background: isDark ? C.boxBg : "#f4f7fe", borderColor: isDark ? C.boxBorder : "#e6ecfa" }}>
        <div className="flex items-start gap-4">
          <ShieldBadge className="h-12 w-12" />
          <div>
            <p className="text-[19px] font-bold" style={{ color: C.strong }}>{data.bottomCta.title}</p>
            <p className="mt-1.5 text-[16px] leading-[1.6]" style={{ color: C.note }}>{data.bottomCta.text}</p>
          </div>
        </div>
        <Link href={data.bottomCta.href} className="mt-4 flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#023fd3] text-[17px] font-semibold text-white">
          {data.bottomCta.buttonLabel}
          <Arrow className="h-4 w-4" />
        </Link>
      </div>
    </MobileSection>
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
      <Phone data={data} isDark={isDark} />
    </section>
  );
}
