"use client";

import Image from "next/image";
import Link from "next/link";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
import { MobileCard, MobileHeading, MobileLabel, MobileLead, MobileSection } from "@/components/home/mobileKit";

// The BMW Failure Database - engine failures + warning signs tables with severity and links,
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

const COL = {
  light: { bg: "#ffffff", h2: "#05070f", accent: "#05070f", para: "#2e3245", card: "#ffffff", border: "#e8ebf0", line: "#eef0f3", hdrBand: "#f8f9f9", tabBg: "#ffffff", tabEdge: "#e8ebf0",
    sq: "#0048b9", tabText: "#0b1236", label: "#1d2230", num: "#0b4fe0", title: "#0b1236", desc: "#1e2230", sev: "#1d2230", link: "#0b4fe0", keyMuted: "#40465a", shadow: "0 2px 10px rgba(16,24,48,0.03)" },
  dark: { bg: "#01060e", h2: "#ffffff", accent: "#ffffff", para: "#e1e4e9", card: "#03070d", border: "#3d434b", line: "#21252c", hdrBand: "#00030a", tabBg: "linear-gradient(90deg,#03244d,#011a36)", tabEdge: "#1b3558",
    sq: "#003f97", tabText: "#ffffff", label: "#f2f4f7", num: "#2f7bec", title: "#ffffff", desc: "#e1e4e9", sev: "#ffffff", link: "#3b82f6", keyMuted: "#c4c9d1", shadow: "none" },
};

// One grid for the column headings and the rows, so each heading starts where its column does.
const GRID = "grid grid-cols-[44px_minmax(0,1.15fr)_minmax(0,2.6fr)_minmax(0,0.85fr)_minmax(0,0.75fr)] gap-x-4 px-5";

function Table({ block, C, titleKey }) {
  const Icon = block.icon === "warning" ? Warn : Gear;
  return (
    <div className="overflow-hidden rounded-[8px] border" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
      <div className="relative flex h-11 items-center">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[340px] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_100%,0_100%)]" style={{ background: C.tabEdge }} />
        <span aria-hidden="true" className="absolute left-0 top-0 h-[calc(100%-1px)] w-[339px] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_100%,0_100%)]" style={{ background: C.tabBg }} />
        <span className="relative flex h-full w-14 items-center justify-center text-white" style={{ background: C.sq }}>
          <Icon style={{ width: 22, height: 22 }} />
        </span>
        <h3 className="t-label relative ml-4 font-semibold uppercase tracking-[0.02em]" style={{ color: C.tabText }}>{block.title}</h3>
      </div>
      <div className={`${GRID} t-label items-center py-2.5 font-semibold uppercase tracking-[0.02em]`} style={{ background: TABLE_HEADER_BG, color: TABLE_HEADER_TEXT }}>
        {block.columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {block.rows.map((r) => (
        <Link key={r.id} href={r.link.href} className={`${GRID} items-center border-t py-3 font-normal`} style={{ borderColor: C.line }}>
          <span className="t-num" style={{ color: C.num }}>{r.id}</span>
          <h4 className="text-[17px] font-semibold leading-[1.3]" style={{ color: C.title }}>{(titleKey && r[titleKey] ? r[titleKey] : r.title).replace(/\n/g, " ")}</h4>
          <p className="t-body" style={{ color: C.desc }}>{r.description}</p>
          <span className="t-body flex items-center gap-2.5" style={{ color: C.sev }}>
            <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: SEV[r.severity.type] }} />
            {r.severity.label}
          </span>
          <span className="t-body flex items-center gap-2 font-medium" style={{ color: C.link }}>
            {r.link.label}
            <Arrow style={{ width: 16, height: 16 }} />
          </span>
        </Link>
      ))}
    </div>
  );
}

function Desktop({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  return (
    <div className="relative hidden lg:block">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 aspect-[836/226] w-[54%] max-w-[836px]">
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt="" fill sizes="54vw" className="object-cover [mask-image:linear-gradient(90deg,transparent,black_12%)]" />
      </div>
      <div className="site-container section-y relative">
        <div className="max-w-[640px]">
          <h2 className="t-h2 [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <span aria-hidden="true" className="mt-4 block h-[3px] w-[82px] bg-[linear-gradient(90deg,#0b55e6_60%,transparent)]" />
          <p className="t-p mt-4 max-w-[600px]" style={{ color: C.para }}>{data.subHeadline}</p>
        </div>

        <div className="mt-8 grid gap-5">
          <Table block={data.engineFailures} C={C} titleKey="titleDesktop" />
          <Table block={data.warningSigns} C={C} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[8px] border px-6 py-3.5" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
          <span className="t-label font-bold uppercase" style={{ color: C.title }}>Urgency key:</span>
          {data.urgencyKey.map((u) => (
            <span key={u.type} className="t-label flex items-center gap-2.5" style={{ color: C.title }}>
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ background: SEV[u.type] }} />
              <span>
                {u.label}
                <span style={{ color: C.keyMuted }}> - {u.text}</span>
              </span>
            </span>
          ))}
        </div>
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
      <MobileHeading html={data.h2} color={C.h2} accent={isDark ? "#2f7bec" : "#0b4fe0"} />
      <div className="relative mt-5 h-[170px] overflow-hidden rounded-[16px]">
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt={data.headerImage.alt} fill sizes="720px" className="object-cover object-[65%_50%]" />
      </div>
      <MobileLead color={C.para} className="!mt-5">{data.subHeadline}</MobileLead>

      {blocks.map((b) => {
        const Icon = b.icon === "warning" ? Warn : Gear;
        return (
          <MobileCard key={b.title} C={C} className="mt-6">
            <p className="flex items-center gap-3 border-b px-4 py-3.5 text-[16px] font-bold uppercase tracking-[0.03em]" style={{ color: isDark ? "#ffffff" : "#0b4fe0", borderColor: C.line }}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#0b47d8] text-white">
                <Icon style={{ width: 17, height: 17 }} />
              </span>
              {b.title}
            </p>
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
                <span style={{ color: C.keyMuted }}> - {u.text}</span>
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
      <Desktop data={data} isDark={isDark} />
      <Phone data={data} isDark={isDark} />
    </section>
  );
}
