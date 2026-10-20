"use client";

import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";
import { MobileCard, MobileHeading, MobileLabel, MobileLead, MobileSection } from "@/components/home/mobileKit";

// BMW Engine History — era timeline table (era / key engines / iconic models) with a key takeaway.

function CarGlyph({ style }) {
  return (
    <svg aria-hidden="true" viewBox="2.5 3.5 19 16" style={style} fill="currentColor">
      <path d="M5.5 10 7 5.5A2 2 0 0 1 8.9 4h6.2a2 2 0 0 1 1.9 1.5L18.5 10H20a1 1 0 0 1 1 1v6h-2v2h-3v-2H8v2H5v-2H3v-6a1 1 0 0 1 1-1h1.5Zm2.2 0h8.6l-1.2-3.8H8.9L7.7 10ZM6.5 14.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm11 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" />
    </svg>
  );
}

function TrendGlyph({ style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20v-4m4 4v-7m4 7v-5m4 5V10m4 10V7M4 12l5-5 4 3 7-6m0 0h-4m4 0v4" />
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

// Car photo sized by the car itself (bbox from the JSON): `width` is the car's width, bottom-aligned.
function Car({ image, left, bottom, width }) {
  const [x0, y0, x1, y1] = image.bbox;
  const [W, H] = image.size;
  const boxW = width / (x1 - x0);
  const boxH = (boxW * H) / W;
  const h = boxH * (y1 - y0);
  return (
    <span className="absolute overflow-hidden" style={{ left, top: bottom - h, width, height: h }}>
      <Image src={image.dark} alt={image.alt} width={W} height={H} sizes="130px" className="absolute max-w-none" style={{ left: -x0 * boxW, top: -y0 * boxH, width: boxW, height: boxH }} />
    </span>
  );
}

// Desktop spec measured on the 1536px references (Section 11.1.png light, Section 11.png dark).
// Section-relative tops; table x values are px from the card's left edge.
const SPEC = {
  light: {
    h: 942, h2: { left: 57, caps: [63, 122], fs: 51, track: "-0.03em" }, p: { left: 57, cap: 186, fs: 18.1, lh: 28.5 },
    img: { left: 650, top: 1, w: 886, h: 275 },
    card: { left: 49, right: 73, top: 278, hdr: 42, rows: [83, 80, 80, 80, 80, 80] },
    dividers: [302, 735, 1211], labelCx: [137.5, 510, 988.5], label: 15.5,
    circleCx: 51, circle: 48, eraX: 114, era: 22.5, engX: 329, eng: 20, engLh: 27, engCap1: -4.5, eimg: { x: 566, w: 128 }, cars: { x: [774, 904, 1032], w: 115, bottom: 70 }, modelsX: 1212, models: 18,
    key: { top: 818, h: 101, icon: [30, 19, 64], labelX: 131, labelCap: 36, label: 18.4, textX: 302, textCap: 32, text: 20.3, textLh: 29 },
  },
  dark: {
    h: 942, h2: { left: 55, caps: [63, 118], fs: 51, track: "-0.03em" }, p: { left: 55, cap: 181, fs: 18.1, lh: 25 },
    img: { left: 650, top: 1, w: 886, h: 270 },
    card: { left: 45, right: 68, top: 274, hdr: 45, rows: [80, 81, 81, 81, 82, 82] },
    dividers: [302, 754, 1223], labelCx: [135, 519, 1002], label: 15.5,
    circleCx: 51, circle: 48, eraX: 114, era: 22.5, engX: 345, eng: 20.6, engLh: 25, engCap1: -7.5, eimg: { x: 575, w: 124 }, cars: { x: [797, 921, 1045], w: 110, bottom: 65 }, modelsX: 1223, models: 18.9,
    key: { top: 824, h: 95, icon: [30, 17, 64], labelX: 135, labelCap: 32, label: 17.9, textX: 302, textCap: 28, text: 20.4, textLh: 29 },
  },
};

const COL = {
  light: { bg: "#fefefe", h2: "#05070f", accent: "#0b4fe0", para: "#262b3d", card: "#ffffff", border: "#e8ebf0", line: "#eef0f3", band: "linear-gradient(90deg,#3570e3,#3d74e3)", bandText: "#ffffff",
    circleBg: "#ffffff", circle: "#2a71d0", glyph: "#0b4fe0", timeline: "#1f63d6", text: "#0b1236", soft: "#1d2230", keyBg: "#ffffff", keyBorder: "#e8ebf0", keyIcon: "#0b55e6", label: "#0b4fe0", shadow: "0 2px 12px rgba(16,24,48,0.04)" },
  dark: { bg: "#01070d", h2: "#ffffff", accent: "#1f6fe6", para: "#e8ebef", card: "#010d15", border: "#2a3444", line: "#1c2632", band: "linear-gradient(90deg,#01264f,#011c3a)", bandText: "#ffffff",
    circleBg: "#040d14", circle: "#c5d6f2", glyph: "#ffffff", timeline: "#1f63d6", text: "#ffffff", soft: "#f2f4f7", keyBg: "#000e18", keyBorder: "#2a3444", keyIcon: "#0a47a0", label: "#2f7bec", shadow: "none" },
};

function Desktop({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const S = SPEC[t];
  const C = COL[t];
  const K = S.card;
  const tops = K.rows.map((_, i) => K.hdr + K.rows.slice(0, i).reduce((a, b) => a + b, 0));
  const total = K.hdr + K.rows.reduce((a, b) => a + b, 0);
  const lines = data.h2.match(/<span[^>]*>.*?<\/span>/g) || [data.h2];
  const [kt1, kt2] = data.keyTakeawayDesktop.split("\n");

  return (
    <div className="relative mx-auto hidden w-full max-w-[1536px] overflow-hidden lg:block" style={{ height: S.h }}>
      <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: S.img.left, top: S.img.top, width: S.img.w, height: S.img.h }}>
        <Image src={data.headerImage[t]} alt="" fill sizes="900px" className="object-cover [mask-image:linear-gradient(90deg,transparent,black_4%)]" />
      </div>
      {lines.map((l, i) => (
        <h2 key={i} className="absolute whitespace-nowrap font-bold [&_.heading-accent]:!text-[var(--acc)]" style={{ left: S.h2.left, top: S.h2.caps[i] - capOffset(S.h2.fs, S.h2.fs * 1.15), fontSize: S.h2.fs, lineHeight: `${S.h2.fs * 1.15}px`, letterSpacing: S.h2.track, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: l }} />
      ))}
      <Cap as="p" left={S.p.left} cap={S.p.cap} fs={S.p.fs} lh={S.p.lh} className="whitespace-pre" style={{ color: C.para }}>{data.subHeadlineDesktop}</Cap>

      <div className="absolute overflow-hidden rounded-[8px]" style={{ left: K.left, right: K.right, top: K.top, height: total, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <div className="absolute inset-x-0 top-0" style={{ height: K.hdr, background: C.band }}>
          {data.columns.map((c, i) => (
            <Cap key={c} left={S.labelCx[i] - 150} cap={K.hdr / 2 - 6} fs={S.label} className="w-[300px] text-center font-bold uppercase" style={{ color: C.bandText }}>{c}</Cap>
          ))}
        </div>
        {S.dividers.map((d) => (
          <span key={d} aria-hidden="true" className="absolute bottom-0" style={{ left: d, top: 0, width: 1, background: C.line }} />
        ))}
        <span aria-hidden="true" className="absolute" style={{ left: S.circleCx - 1.5, width: 3, top: tops[0] + K.rows[0] / 2, height: tops[5] + K.rows[5] / 2 - (tops[0] + K.rows[0] / 2), background: C.timeline }} />
        {data.eras.map((e, i) => {
          const top = tops[i];
          const h = K.rows[i];
          const c = top + h / 2;
          const eng = e.enginesDesktop.split("\n");
          return (
            <div key={e.era}>
              {i ? <span aria-hidden="true" className="absolute" style={{ left: S.circleCx + 30, right: 0, top, height: 1, background: C.line }} /> : null}
              <span className="absolute flex items-center justify-center rounded-full" style={{ left: S.circleCx - S.circle / 2, top: c - S.circle / 2, width: S.circle, height: S.circle, background: C.circleBg, border: `2px solid ${C.circle}`, color: C.glyph }}>
                <CarGlyph style={{ width: 24, height: 20 }} />
              </span>
              <Cap as="h3" left={S.eraX} cap={c - 7.5} fs={S.era} className="whitespace-nowrap font-bold" style={{ color: C.text }}>{e.era}</Cap>
              <Cap as="p" left={S.engX} cap={eng.length > 1 ? c - 19 : c + S.engCap1} fs={S.eng} lh={S.engLh} className="whitespace-pre" style={{ color: C.text }}>{e.enginesDesktop}</Cap>
              <span className="absolute" style={{ left: S.eimg.x, top: top - 2, width: S.eimg.w, height: h + 4 }}>
                <Image src={e.engineImage.src} alt={e.engineImage.alt} fill sizes="130px" className={`object-contain ${isDark ? "" : "mix-blend-multiply"}`} />
              </span>
              {e.modelImages.map((m, j) => (
                <Car key={m.src} image={m} left={S.cars.x[j]} bottom={top + S.cars.bottom} width={S.cars.w} />
              ))}
              <Cap as="p" left={S.modelsX} cap={c - 5.5} fs={S.models} className="whitespace-nowrap" style={{ color: C.soft }}>{e.models}</Cap>
            </div>
          );
        })}
      </div>

      <div className="absolute rounded-[8px]" style={{ left: K.left, right: K.right, top: S.key.top, height: S.key.h, background: C.keyBg, border: `1px solid ${C.keyBorder}`, boxShadow: C.shadow }}>
        <span className="absolute flex items-center justify-center rounded-[6px] text-white" style={{ left: S.key.icon[0], top: S.key.icon[1], width: S.key.icon[2], height: S.key.icon[2], background: C.keyIcon }}>
          <TrendGlyph style={{ width: 36, height: 36 }} />
        </span>
        <Cap as="p" left={S.key.labelX} cap={S.key.labelCap} fs={S.key.label} className="whitespace-nowrap font-bold uppercase" style={{ color: C.label }}>{data.keyTakeawayLabel}</Cap>
        <Cap as="p" left={S.key.textX} cap={S.key.textCap} fs={S.key.text} lh={S.key.textLh} className="whitespace-nowrap" style={{ color: C.text }}>
          <span className="block">{kt1}</span>
          <span className="block">{kt2}</span>
        </Cap>
      </div>
    </div>
  );
}

// Phone / tablet: readable timeline cards (body 15px, entries 14–16px, labels 11px).
function Phone({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const [, engLabel, modelLabel] = data.columns;

  return (
    <MobileSection>
      <div className="relative mb-6 h-[170px] overflow-hidden rounded-[16px]">
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt={data.headerImage.alt} fill sizes="720px" className="object-cover object-[60%_50%]" />
      </div>
      <MobileHeading html={data.h2} color={C.h2} accent={C.accent} />
      <MobileLead color={C.para}>{data.subHeadline}</MobileLead>

      <ol className="relative mt-7 grid gap-4">
        <span aria-hidden="true" className="absolute bottom-10 left-[23px] top-10 w-[2px]" style={{ background: C.timeline }} />
        {data.eras.map((e) => (
          <li key={e.era} className="relative pl-[58px]">
            <span className="absolute left-0 top-3 z-[1] flex h-12 w-12 items-center justify-center rounded-full" style={{ background: C.circleBg, border: `2px solid ${C.circle}`, color: C.glyph }}>
              <CarGlyph style={{ width: 22, height: 18 }} />
            </span>
            <MobileCard C={C} className="px-4 py-4">
              <h3 className="text-[19px] font-bold" style={{ color: C.text }}>{e.era}</h3>
              <div className="mt-3 flex items-center gap-3 border-t pt-3" style={{ borderColor: C.line }}>
                <div className="min-w-0 flex-1">
                  <MobileLabel color={C.label}>{engLabel}</MobileLabel>
                  <p className="mt-1 text-[15px] leading-[1.45]" style={{ color: C.text }}>{e.engines}</p>
                </div>
                <span className="relative h-[60px] w-[84px] shrink-0">
                  <Image src={e.engineImage.src} alt={e.engineImage.alt} fill sizes="90px" className={`object-contain ${isDark ? "" : "mix-blend-multiply"}`} />
                </span>
              </div>
              <div className="mt-3 border-t pt-3" style={{ borderColor: C.line }}>
                <MobileLabel color={C.label}>{modelLabel}</MobileLabel>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {e.modelImages.map((m) => (
                    <span key={m.src} className="relative h-[44px]">
                      <Image src={m.dark} alt={m.alt} fill sizes="110px" className="object-contain" />
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[14px]" style={{ color: C.soft }}>{e.models}</p>
              </div>
            </MobileCard>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-start gap-4 rounded-[12px] border p-4" style={{ background: isDark ? C.keyBg : "#eef3fd", borderColor: isDark ? C.keyBorder : "#e0e8fa" }}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] text-white" style={{ background: C.keyIcon }}>
          <TrendGlyph style={{ width: 26, height: 26 }} />
        </span>
        <p className="text-[15px] leading-[1.6]" style={{ color: C.text }}>
          <strong className="mr-1 font-bold uppercase" style={{ color: C.label }}>{data.keyTakeawayLabel}</strong>
          {data.keyTakeaway}
        </p>
      </div>
    </MobileSection>
  );
}

export default function HomeSec11({ data }) {
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
