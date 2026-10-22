"use client";

import Image from "next/image";
import Link from "next/link";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
import { MobileHeading, MobileLabel, MobileLead, MobileSection } from "@/components/home/mobileKit";
import BrandIcon from "@/components/home/brandIcon";

// BMW Engine Families - The Pillars: engine table (engine / fuel / years / enquiries / verdict)
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

const COL = {
  light: { bg: "#fefefe", h2: "#0a0f2c", accent: "#0b4fe0", para: "#4f5775", hdr: "#0b3fd6", code: "#0b1236", spec: "#2456da", text: "#1a2140", enq: "#0b1236", tag: "#1f55d8",
    vt: "#343a55", fuelIcon: "#1747e0", card: "#ffffff", border: "#eef2f8", line: "#eef2f8", hdrBand: "transparent", bar: "#9cbdf7", shadow: "0 6px 24px rgba(16,24,48,0.05)" },
  dark: { bg: "#030405", h2: "#ffffff", accent: "#2f7bec", para: "#d0d0d0", hdr: "#ffffff", code: "#ffffff", spec: "#2b93e9", text: "#eeeeef", enq: "#fafafb", tag: "#2b93e9",
    vt: "#d8dadd", fuelIcon: "#0b78e6", card: "#0e1318", border: "#3a3d40", line: "#24282d", hdrBand: "#0c0f13", bar: "#0a66e0", shadow: "none" },
};

// Desktop (lg+): engine-bay header on the right, one grid for the header row and the engine rows.
const GRID = "grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.85fr)_minmax(0,1.05fr)_minmax(0,2.6fr)] gap-x-4 px-6";

function Desktop({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  return (
    <div className="relative hidden lg:block">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 w-[58%] max-w-[976px]">
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt="" width={976} height={260} sizes="60vw" className="h-auto w-full [mask-image:linear-gradient(90deg,transparent,black_10%),linear-gradient(180deg,black_80%,transparent)] [mask-composite:intersect]" />
      </div>
      <div className="site-container section-y relative">
        <div className="max-w-[620px]">
          <h2 className="t-h2 [&_.heading-accent]:text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className="t-p mt-3 max-w-[560px]" style={{ color: C.para }}>{data.subHeadline}</p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[10px] border" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
          <div className={`${GRID} t-label items-center py-3.5 font-semibold uppercase tracking-[0.02em]`} style={{ background: TABLE_HEADER_BG, color: TABLE_HEADER_TEXT }}>
            {data.columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {data.engines.map((e) => (
            <Link key={e.code} href={e.href} className={`${GRID} relative items-center border-t py-3.5 font-normal`} style={{ color: C.text, borderColor: C.line }}>
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px]" style={{ background: C.bar }} />
              <span>
                <span className="block text-[18px] font-bold leading-tight" style={{ color: C.code }}>{e.code}</span>
                <span className="t-label block" style={{ color: C.spec }}>{e.spec}</span>
              </span>
              <span className="t-body flex items-center gap-2">
                <FuelMark fuel={e.fuel} color={C.fuelIcon} style={{ width: 18, height: 22 }} />
                {e.fuel}
              </span>
              <span className="t-body">{e.years}</span>
              <span>
                <span className="t-body block font-semibold" style={{ color: C.enq }}>{e.enquiries}</span>
                <span className="t-label block" style={{ color: C.tag }}>{e.sourceTag}</span>
              </span>
              <span className="flex items-center gap-3">
                <VerdictMark type={e.verdict.type} className="shrink-0" style={{ width: 26, height: 26 }} />
                <span className="t-body" style={{ color: C.vt }}>{e.verdict.desktop.replace(/\n/g, " ")}</span>
              </span>
            </Link>
          ))}
        </div>
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
    <MobileSection className="!pt-0">
      {/* Reference: engine bay top right, behind the heading, with the copy on the left. */}
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[270px] w-[56%] overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,black_45%),linear-gradient(180deg,black_65%,transparent)] [mask-composite:intersect]">
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt="" fill sizes="56vw" className="object-cover object-[70%_50%]" />
      </div>
      <div className="relative pt-10">
        <div className="max-w-[70%]">
          <MobileHeading html={data.h2} color={C.h2} accent={C.accent} />
        </div>
        <div className="max-w-[66%]">
          <MobileLead color={C.para}>{data.subHeadline}</MobileLead>
        </div>
      </div>

      <ul className="relative mt-7 grid grid-cols-4 rounded-[12px] border py-3.5" style={card}>
        {data.trustStrip.map((t) => (
          <li
            key={t.icon}
            className="relative flex flex-col items-center gap-1.5 px-1 text-center [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:top-1/2 [&:not(:last-child)]:after:h-[60%] [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:-translate-y-1/2 after:bg-[var(--div)]"
            style={{ "--div": isDark ? "#2a2f36" : "#e6eaf0" }}
          >
            <span className="h-7 w-7 shrink-0" style={{ color: isDark ? "#3b82f6" : C.hdr }}>
              <TrustGlyph name={t.icon} />
            </span>
            <span className="text-[13px] leading-[1.3]" style={{ color: C.text }}>
              {t.lines.map((l) => (l.startsWith("**") ? <strong key={l} className="block text-[14px] font-bold">{l.slice(2, -2)}</strong> : <span key={l} className="block">{l}</span>))}
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
  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <Desktop data={data} isDark={isDark} />

      <Phone data={data} isDark={isDark} />
    </section>
  );
}
