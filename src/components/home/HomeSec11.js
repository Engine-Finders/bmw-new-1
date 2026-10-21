"use client";

import Image from "next/image";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
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

// Car photo cropped to the car itself (bbox from the JSON) so it fills its slot.
function Car({ image, className = "" }) {
  const [x0, y0, x1, y1] = image.bbox;
  const [W, H] = image.size;
  const cw = (x1 - x0) * W;
  const ch = (y1 - y0) * H;
  return (
    <span className={`relative block overflow-hidden ${className}`} style={{ aspectRatio: `${cw} / ${ch}` }}>
      <Image
        src={image.dark}
        alt={image.alt}
        width={W}
        height={H}
        sizes="130px"
        className="absolute max-w-none"
        style={{ left: `${(-x0 / (x1 - x0)) * 100}%`, top: `${(-y0 / (y1 - y0)) * 100}%`, width: `${100 / (x1 - x0)}%`, height: `${100 / (y1 - y0)}%` }}
      />
    </span>
  );
}

const COL = {
  light: { bg: "#fefefe", h2: "#05070f", accent: "#0b4fe0", para: "#262b3d", card: "#ffffff", border: "#e8ebf0", line: "#eef0f3", band: "linear-gradient(90deg,#3570e3,#3d74e3)", bandText: "#ffffff",
    circleBg: "#ffffff", circle: "#2a71d0", glyph: "#0b4fe0", timeline: "#1f63d6", text: "#0b1236", soft: "#1d2230", keyBg: "#ffffff", keyBorder: "#e8ebf0", keyIcon: "#0b55e6", label: "#0b4fe0", shadow: "0 2px 12px rgba(16,24,48,0.04)" },
  dark: { bg: "#01070d", h2: "#ffffff", accent: "#1f6fe6", para: "#e8ebef", card: "#010d15", border: "#2a3444", line: "#1c2632", band: "linear-gradient(90deg,#01264f,#011c3a)", bandText: "#ffffff",
    circleBg: "#040d14", circle: "#c5d6f2", glyph: "#ffffff", timeline: "#1f63d6", text: "#ffffff", soft: "#f2f4f7", keyBg: "#000e18", keyBorder: "#2a3444", keyIcon: "#0a47a0", label: "#2f7bec", shadow: "none" },
};

// Desktop (lg+): one grid for the heading band and the era rows.
// Key engines column: engine image on the left, engine codes on the right.
const GRID = "grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1.45fr)_minmax(0,0.85fr)]";

function Desktop({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const [eraLabel, engLabel, modelLabel] = data.columns;

  return (
    <div className="relative hidden lg:block">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 aspect-[886/275] w-[48%] max-w-[886px]">
        <Image src={data.headerImage[isDark ? "dark" : "light"]} alt="" fill sizes="48vw" className="object-cover [mask-image:linear-gradient(90deg,transparent,black_28%),linear-gradient(180deg,black_80%,transparent)] [mask-composite:intersect]" />
      </div>
      <div className="site-container section-y relative">
        <div className="max-w-[700px]">
          <h2 className="t-h2 [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className="t-p mt-3 max-w-[460px]" style={{ color: C.para }}>{data.subHeadline}</p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[8px] border" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
          <div className={`${GRID} t-label items-center py-3 font-semibold uppercase tracking-[0.02em]`} style={{ background: TABLE_HEADER_BG, color: TABLE_HEADER_TEXT }}>
            <span className="pl-[92px]">{eraLabel}</span>
            <span className="pl-5">{engLabel}</span>
            <span className="col-span-2 pl-5">{modelLabel}</span>
          </div>
          <span aria-hidden="true" className="absolute bottom-[52px] left-[43px] top-[86px] w-[3px]" style={{ background: C.timeline }} />
          {data.eras.map((e) => (
            <div key={e.era} className={`${GRID} relative items-center border-t`} style={{ borderColor: C.line }}>
              <span className="flex items-center gap-6 py-3 pl-5">
                <span className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: C.circleBg, border: `2px solid ${C.circle}`, color: C.glyph }}>
                  <CarGlyph style={{ width: 24, height: 20 }} />
                </span>
                <h3 className="t-h6" style={{ color: C.text }}>{e.era}</h3>
              </span>
              <span className="flex h-full items-center gap-4 border-l px-5 py-3" style={{ borderColor: C.line }}>
                <span className="relative h-[64px] w-[96px] shrink-0">
                  <Image src={e.engineImage.src} alt={e.engineImage.alt} fill sizes="100px" className={`object-contain ${isDark ? "" : "mix-blend-multiply"}`} />
                </span>
                <span className="t-body" style={{ color: C.text }}>{e.engines}</span>
              </span>
              <span className="grid h-full grid-cols-3 items-end gap-3 border-l px-5 py-3" style={{ borderColor: C.line }}>
                {e.modelImages.map((m) => (
                  <Car key={m.src} image={m} className="w-full" />
                ))}
              </span>
              <span className="t-body pr-5" style={{ color: C.soft }}>{e.models}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-5 rounded-[8px] border px-6 py-4" style={{ background: C.keyBg, borderColor: C.keyBorder, boxShadow: C.shadow }}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] text-white" style={{ background: C.keyIcon }}>
            <TrendGlyph style={{ width: 28, height: 28 }} />
          </span>
          <p className="t-p" style={{ color: C.text }}>
            <strong className="mr-2 font-bold uppercase" style={{ color: C.label }}>{data.keyTakeawayLabel}</strong>
            {data.keyTakeaway}
          </p>
        </div>
      </div>
    </div>
  );
}

// Phone / tablet: readable timeline cards (body 17px, entries 16–18px, labels 13px).
function Phone({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const [, engLabel, modelLabel] = data.columns;

  return (
    <MobileSection>
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
              <h3 className="text-[22px] font-bold" style={{ color: C.text }}>{e.era}</h3>
              <div className="mt-3 border-t pt-3" style={{ borderColor: C.line }}>
                <MobileLabel color={C.label}>{engLabel}</MobileLabel>
                <div className="mt-2 flex items-center gap-3">
                  <span className="relative h-[60px] w-[84px] shrink-0">
                    <Image src={e.engineImage.src} alt={e.engineImage.alt} fill sizes="90px" className={`object-contain ${isDark ? "" : "mix-blend-multiply"}`} />
                  </span>
                  <p className="min-w-0 flex-1 text-[17px] leading-[1.45]" style={{ color: C.text }}>{e.engines}</p>
                </div>
              </div>
              <div className="mt-3 border-t pt-3" style={{ borderColor: C.line }}>
                <MobileLabel color={C.label}>{modelLabel}</MobileLabel>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {e.modelImages.map((m) => (
                    <span key={m.src} className="relative h-[64px]">
                      <Image src={m.dark} alt={m.alt} fill sizes="110px" className="object-contain" />
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[16px]" style={{ color: C.soft }}>{e.models}</p>
              </div>
            </MobileCard>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-start gap-4 rounded-[12px] border p-4" style={{ background: isDark ? C.keyBg : "#eef3fd", borderColor: isDark ? C.keyBorder : "#e0e8fa" }}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] text-white" style={{ background: C.keyIcon }}>
          <TrendGlyph style={{ width: 26, height: 26 }} />
        </span>
        <p className="text-[17px] leading-[1.6]" style={{ color: C.text }}>
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
      <Desktop data={data} isDark={isDark} />
      <Phone data={data} isDark={isDark} />
    </section>
  );
}
