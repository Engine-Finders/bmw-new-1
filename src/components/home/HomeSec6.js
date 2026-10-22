"use client";

import Image from "next/image";
import Link from "next/link";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
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
      <svg aria-hidden="true" viewBox="0 0 30 30" className="h-6 w-6" fill="currentColor">
        <rect x="3" y="15" width="5" height="12" rx="0.5" /><rect x="10" y="6" width="5" height="21" rx="0.5" /><rect x="17" y="11" width="5" height="16" rx="0.5" /><rect x="24" y="17" width="4" height="10" rx="0.5" />
      </svg>
    );
  if (name === "note")
    return (
      <svg aria-hidden="true" viewBox="0 0 30 30" className="h-6 w-6">
        <path d="M6 3h13l5 5v19H6V3Z" fill="currentColor" />
        <path d="M10 11h10M10 15h10M10 19h10M10 23h7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  if (name === "vetted-specialist")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="M20.6 6.4 17.4 9.6l-3-3 3.2-3.2a5 5 0 0 0-6.4 6.3l-7.8 7.8a2.1 2.1 0 0 0 3 3l7.8-7.8a5 5 0 0 0 6.4-6.3Z" />
      </svg>
    );
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.5 4.5 5.5v6c0 5 3.3 9 7.5 10 4.2-1 7.5-5 7.5-10v-6L12 2.5Z" />
      <path d="m12 7.6 1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4L12 7.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Desktop (lg+): fluid layout in the shared container — decision matrix left, rule of thumb and
// deeper links right, trust strip underneath.
function Desktop({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const rule = data.ruleOfThumb;
  const card = "rounded-[10px] border";
  const cardStyle = { background: C.card, borderColor: C.border, boxShadow: C.shadow };
  const cols = "grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,1.35fr)] gap-x-4 px-5";
  const header = isDark ? data.headerImage.dark : data.headerImage.light;

  return (
    <div className="relative hidden lg:block">
      <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[290px] w-[58%] [mask-image:linear-gradient(90deg,transparent,black_18%),linear-gradient(180deg,black_80%,transparent)] [mask-composite:intersect]">
        <Image src={isDark ? data.headerImage.backdropDark : data.headerImage.backdropLight} alt="" fill sizes="60vw" className="object-cover" />
      </span>
      <div className="site-container section-y relative">
        <div aria-hidden="true" className="pointer-events-none absolute right-[calc(var(--gutter)+60px)] top-0 w-[340px] max-w-[30%]">
          <div className="absolute inset-x-[4%] top-[84%] h-[7%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0.45),rgba(0,0,0,0.12)_55%,transparent_75%)]" />
          <Image src={header} alt={data.headerImage.alt} width={590} height={523} sizes="340px" className="relative h-auto w-full" style={{ filter: isDark ? "brightness(0.6) contrast(1.2)" : "brightness(1.3) contrast(1.05)" }} />
        </div>

        <div className="relative max-w-[640px]">
          <h2 className="t-h2 [&_.heading-accent]:text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className="t-p mt-3 max-w-[600px]" style={{ color: C.para }}>{data.subHeadline}</p>
        </div>

        <div className="relative mt-8 grid grid-cols-[minmax(0,4fr)_minmax(0,1fr)] gap-4">
          {/* Decision matrix */}
          <div className={`${card} overflow-hidden`} style={cardStyle}>
            <h3 className="t-label flex items-center gap-3 px-5 py-4 font-semibold uppercase tracking-[0.02em]" style={{ color: C.strong }}>
              <BarsIcon className="h-[17px] w-[18px]" style={{ color: C.blue }} />
              {data.matrix.title}
            </h3>
            <div className={`${cols} t-label items-center py-3 font-semibold uppercase tracking-[0.02em]`} style={{ background: TABLE_HEADER_BG, color: TABLE_HEADER_TEXT }}>
              {data.matrix.columns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {data.matrix.rows.map((row) => (
              <Link key={row.href} href={row.href} className={`${cols} items-center border-t py-3 font-normal`} style={{ color: C.strong, borderColor: C.line }}>
                <span className="flex items-center gap-3">
                  <span className="relative h-[52px] w-[88px] shrink-0">
                    <Image src={isDark ? row.image.dark : row.image.src} alt={row.image.alt} fill sizes="96px" className={`object-contain ${isDark ? "" : "mix-blend-multiply"}`} />
                  </span>
                  <span className="min-w-0">
                    <span className="t-body block font-semibold">{row.name}</span>
                    <span className="t-label block" style={{ color: C.code }}>{row.code}</span>
                  </span>
                </span>
                {[row.vehicleValue, row.replacementCost].map((v, i) => (
                  <span key={i}>
                    <span className="t-body block font-semibold">{v.value}</span>
                    <span className="t-label block" style={{ color: C.tag }}>{v.tag}</span>
                  </span>
                ))}
                <span className="flex items-start gap-2.5">
                  <span className="mt-0.5 h-5 w-5 shrink-0">
                    <VerdictGlyph type={GLYPH[row.verdict.type]} round className="h-full w-full" />
                  </span>
                  <span className="t-body" style={{ color: C.verdict }}>{row.verdict.desktop.replace(/\n/g, " ")}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="grid content-start gap-4">
            {/* Rule of thumb */}
            <div className={`${card} p-5`} style={cardStyle}>
              <h3 className="t-label flex items-center gap-3 font-semibold uppercase tracking-[0.02em]" style={{ color: C.strong }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b47d4] text-white">
                  <ShieldGlyph className="h-[56%] w-[56%]" />
                </span>
                {rule.title}
              </h3>
              {/* The column is narrow (20%), so the figure sits above the quote instead of beside it. */}
              <span className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <span className="t-h3" style={{ color: C.blue }}>{rule.percent}</span>
                <span className="t-label font-semibold uppercase" style={{ color: C.blue }}>{rule.percentLabel}</span>
              </span>
              <p className="t-body mt-3" style={{ color: C.strong }}>
                <span aria-hidden="true" className="t-h4 mr-1 font-serif leading-none" style={{ color: C.quote }}>“</span>
                {rule.text}
              </p>
              <p className="t-body mt-4" style={{ color: C.note }}>{rule.note}</p>
            </div>

            {/* Deeper analysis links */}
            <div className={`${card} p-5`} style={cardStyle}>
              <h3 className="t-label flex items-center gap-3 font-semibold uppercase tracking-[0.02em]" style={{ color: C.strong }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b47d4] text-white">
                  <WrenchGlyph className="h-[50%] w-[50%]" />
                </span>
                {data.deeperLinksTitle}
              </h3>
              <ul className="mt-3">
                {data.deeperLinks.map((l) => (
                  <li key={l.id} className="border-t first:border-t-0" style={{ borderColor: C.line }}>
                    <Link href={l.href} className="t-body flex items-center gap-3 py-2.5 font-normal" style={{ color: C.strong }}>
                      <span className="t-label flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-semibold text-white" style={{ background: C.num }}>{l.id}</span>
                      <span className="flex-1">{l.label}</span>
                      <Arrow className="h-5 w-5 shrink-0" style={{ color: isDark ? "#e8ebf0" : C.blue }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <ul className={`${card} relative mt-4 grid grid-cols-4 py-4`} style={{ ...cardStyle, background: isDark ? "#081420" : C.card }}>
          {data.strip.map((item, i) => (
            <li key={item.title} className="relative flex items-center gap-4 px-5">
              {i ? <span aria-hidden="true" className="absolute left-0 top-1/2 h-[60%] w-px -translate-y-1/2" style={{ background: C.line }} /> : null}
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: C.stripCircle, color: C.stripIcon }}>
                <StripIcon name={item.icon} />
              </span>
              <span>
                <span className="block text-[16px] font-semibold leading-[1.3]" style={{ color: C.strong }}>{item.title}</span>
                <span className="t-label mt-0.5 block" style={{ color: C.para }}>{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
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
                          <span className="block text-[13px] font-semibold uppercase tracking-[0.03em]">{cols[i + 1]}</span>
                          <span className="block text-[13px] opacity-80">{v.tag}</span>
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
      <Desktop data={data} isDark={isDark} />
      <Phone data={data} isDark={isDark} />
    </section>
  );
}
