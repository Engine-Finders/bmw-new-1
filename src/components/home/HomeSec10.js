"use client";

import Image from "next/image";
import { useState } from "react";
import { TABLE_HEADER_BG, TABLE_HEADER_TEXT } from "@/components/shared/tableHeader";
import { useTheme } from "@/components/shared/themeProvider";
import { MobileCard, MobileHeading, MobileLead } from "@/components/home/mobileKit";

// BMW Market Intelligence - header with stats card, then six data panels (3 × 2 on desktop).
// On phones the first three panels are accordions (closed until tapped), the rest stay open.

function PanelIcon({ name, className = "h-7 w-7" }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "engine":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M7 5h7v2h-2v2h3l2 2h2v-2h2v8h-2v-2h-2l-2 3H9l-2-3H5v2H3V9h2v2h2V9h3V7H7V5Z" />
        </svg>
      );
    case "car":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M5.5 10 7 5.5A2 2 0 0 1 8.9 4h6.2a2 2 0 0 1 1.9 1.5L18.5 10H20a1 1 0 0 1 1 1v6h-2v2h-3v-2H8v2H5v-2H3v-6a1 1 0 0 1 1-1h1.5Zm2.2 0h8.6l-1.2-3.8H8.9L7.7 10ZM6.5 14.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm11 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" />
        </svg>
      );
    case "pound":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
          <circle cx="12" cy="12" r="10" />
          <path d="M15 8.5a2.8 2.8 0 0 0-5 1.7V17m-1.5-4H13M8.5 17h7" />
        </svg>
      );
    case "warning":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="#f5a20b" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 3 2 21h20L12 3Z" />
          <path d="M12 10v5m0 3h.01" strokeLinecap="round" />
        </svg>
      );
    case "globe":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2c2.8 3 4 6.4 4 10s-1.2 7-4 10c-2.8-3-4-6.4-4-10s1.2-7 4-10Z" />
        </svg>
      );
    case "pulse":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M2 12h4l2-5 4 12 3-9 2 2h5" />
        </svg>
      );
    case "users":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
          <circle cx="9" cy="7" r="3.5" />
          <circle cx="17" cy="8" r="2.8" />
          <path d="M2 20c0-4 3-7 7-7s7 3 7 7H2Zm15 0c0-2.4-.8-4.6-2.2-6.2A5 5 0 0 1 22.5 18v2H17Z" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M20 6v5h-5M4 18v-5h5M18.2 9A7 7 0 0 0 6.7 6.7L4 9m2 6a7 7 0 0 0 11.3 2.3L20 15" />
        </svg>
      );
  }
}

const DONUT_PARTS = [
  [0.47, "#0b50e3"],
  [0.13, "#2f6fef"],
  [0.15, "#6f9ef4"],
  [0.13, "#a9c4f7"],
  [0.12, "#d4e2fb"],
];

// Ring chart: the reference draws London as the dark right half, then lighter blues anticlockwise.
function Donut({ size, inner, isDark }) {
  const stops = DONUT_PARTS.reduce((acc, [v, c], i) => {
    const from = i ? acc[i - 1].to : 0;
    return acc.concat({ from, to: from + v, c: isDark && i === 4 ? "#6c8fd6" : c });
  }, []);
  const bg = `conic-gradient(${stops.map((s) => `${s.c} ${s.from * 360}deg ${s.to * 360}deg`).join(",")})`;
  return (
    <span aria-hidden="true" className="absolute rounded-full" style={{ width: size, height: size, background: bg, WebkitMask: `radial-gradient(circle, transparent ${inner / 2}px, black ${inner / 2 + 0.5}px)`, mask: `radial-gradient(circle, transparent ${inner / 2}px, black ${inner / 2 + 0.5}px)` }} />
  );
}

// "1,450 [BMW-VERIFIED]" -> value + source tag.
const split = (t) => {
  const m = t.match(/^(.*?)\s*(\[.*\])$/);
  return m ? [m[1], m[2]] : [t, ""];
};

const RISK_BG = { catastrophic: "#e1251f", immediate: "#f47b20", monitor: "#f7b500", low: "#22a447" };

const COL = {
  light: { bg: "#ffffff", h2: "#05070f", accent: "#0b4fe0", para: "#262b3d", card: "#ffffff", border: "#e8ebf0", line: "#edf0f3", text: "#0b1236", soft: "#2a2f40", blue: "#0b4fe0", tag: "#2a63e6", icon: "#0b4fe0", shadow: "0 2px 12px rgba(16,24,48,0.04)" },
  dark: { bg: "#03080f", h2: "#ffffff", accent: "#2f7bec", para: "#e3e6ea", card: "#0a1119", border: "#273140", line: "#1d2631", text: "#ffffff", soft: "#dfe3e8", blue: "#3b82f6", tag: "#3b82f6", icon: "#2f7bec", shadow: "none" },
};

function CardHead({ title, icon, C, sub }) {
  const t = title.replace(/\s*\(2025\)$/, "");
  const yr = /\(2025\)$/.test(title);
  return (
    <div className="flex items-start gap-3 px-4 pb-3 pt-4">
      <span className="h-8 w-8 shrink-0" style={{ color: C.icon }}>
        <PanelIcon name={icon} className="h-full w-full" />
      </span>
      <h3 className="t-label pt-1 font-semibold leading-[1.35]" style={{ color: C.text }}>
        <span className="uppercase">{t}</span>
        {yr ? " (2025)" : ""}
        {sub ? <span className="mt-0.5 block font-normal uppercase">({sub})</span> : null}
      </h3>
    </div>
  );
}

// Table inside a card: one grid template for the heading row and the data rows.
function MiniTable({ columns, cols, rows, C }) {
  return (
    <div>
      <div className={`grid ${cols} t-label items-center gap-x-3 px-4 py-2 font-semibold uppercase`} style={{ background: TABLE_HEADER_BG, color: TABLE_HEADER_TEXT }}>
        {columns.map((c, i) => (
          <span key={c} className={i === columns.length - 1 && columns.length > 2 ? "text-right" : ""}>
            {c}
          </span>
        ))}
      </div>
      {rows.map((cells, i) => (
        <div key={i} className={`grid ${cols} items-center gap-x-3 border-t px-4 py-2`} style={{ borderColor: C.line }}>
          {cells}
        </div>
      ))}
    </div>
  );
}

// Desktop (lg+): heading + stats beside the G30, then a 3 × 2 grid of data cards in the shared container.
function Desktop({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const C = COL[t];
  const cardCls = "overflow-hidden rounded-[8px] border";
  const cardStyle = { background: C.card, borderColor: C.border, boxShadow: C.shadow };
  const tag = (v) => <span className="t-label block whitespace-nowrap" style={{ color: C.tag }}>{v}</span>;

  return (
    <div className="relative hidden lg:block">
      <div className="site-container section-y relative">
        <div className="grid grid-cols-[minmax(0,1fr)_300px] items-start gap-6">
          <div className="relative min-h-full">
            <div aria-hidden="true" className="absolute bottom-0 right-0 hidden h-[240px] w-[min(34%,360px)] min-[1400px]:block">
              <span className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(90deg,transparent,black_14%,black_86%,transparent)]">
                <Image src={data.headerImage.backdrop[t]} alt="" fill sizes="360px" className="object-cover" />
              </span>
              <div className="absolute inset-x-[8%] bottom-0">
                <Image src={data.headerImage[t]} alt={data.headerImage.alt} width={662} height={504} sizes="300px" className={`relative h-auto w-full ${isDark ? "" : "mix-blend-multiply"}`} style={{ filter: isDark ? "brightness(0.52) contrast(1.2)" : "brightness(1.55)" }} />
              </div>
            </div>
            <div className="relative max-w-[680px]">
              <h2 className="t-h2 [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
              <p className="t-p mt-4 max-w-[600px]" style={{ color: C.para }}>{data.subHeadline}</p>
            </div>
          </div>
          <div className={`${cardCls} px-5 py-2`} style={cardStyle}>
            {data.stats.map((st, i) => (
              <div key={st.label} className="flex items-center gap-4 border-t py-4 first:border-t-0" style={{ borderColor: C.line }}>
                <span className="h-9 w-9 shrink-0" style={{ color: C.icon }}>
                  <PanelIcon name={st.icon} className="h-full w-full" />
                </span>
                <span>
                  <span className={i < 2 ? "t-h5 block font-bold" : "t-body block"} style={{ color: i < 2 ? C.text : C.soft }}>{st.value}</span>
                  <span className="t-label block" style={{ color: C.soft }}>{st.label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Three across from 1280px; at 1024–1279 two across, so the four-column tables keep readable cells. */}
        <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-3">
          {/* Engines */}
          <div className={cardCls} style={cardStyle}>
            <CardHead title={data.engines.title} icon={data.engines.icon} C={C} />
            <MiniTable
              C={C}
              columns={data.engines.columns}
              cols="grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)_124px]"
              rows={data.engines.rows.map((r) => {
                const [v, tg] = split(r.enquiries);
                return [
                  <span key="r" className="t-body font-semibold" style={{ color: C.blue }}>{r.rank}</span>,
                  <span key="c" className="t-body font-bold" style={{ color: C.text }}>{r.code}</span>,
                  <span key="l" className="t-label" style={{ color: C.soft }}>{r.label}</span>,
                  <span key="e" className="text-right leading-tight">
                    <span className="t-body block font-bold" style={{ color: C.blue }}>{v}</span>
                    {tag(tg)}
                  </span>,
                ];
              })}
            />
          </div>

          {/* Models */}
          <div className={cardCls} style={cardStyle}>
            <CardHead title={data.models.title} icon={data.models.icon} C={C} />
            <MiniTable
              C={C}
              columns={data.models.columns}
              cols="grid-cols-[44px_minmax(0,1fr)_124px]"
              rows={data.models.rows.map((r) => {
                const [v, tg] = split(r.enquiries);
                return [
                  <span key="r" className="t-body font-semibold" style={{ color: C.blue }}>{r.rank}</span>,
                  <span key="m" className="t-body" style={{ color: C.text }}>{r.model}</span>,
                  <span key="e" className="text-right leading-tight">
                    <span className="t-body block font-bold" style={{ color: C.blue }}>{v}</span>
                    {tag(tg)}
                  </span>,
                ];
              })}
            />
          </div>

          {/* Replacement cost index */}
          <div className={cardCls} style={cardStyle}>
            <CardHead title={data.replacementCosts.title} icon={data.replacementCosts.icon} C={C} sub={data.replacementCosts.subtitle} />
            <MiniTable
              C={C}
              columns={data.replacementCosts.columns}
              cols="grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]"
              rows={data.replacementCosts.rows.map((r) => {
                const [v, tg] = split(r.cost);
                return [
                  <span key="c" className="t-body font-bold" style={{ color: C.text }}>{r.code}</span>,
                  <span key="v" className="leading-tight">
                    <span className="t-body block" style={{ color: C.soft }}>{v}</span>
                    {tag(tg)}
                  </span>,
                ];
              })}
            />
          </div>

          {/* Failures */}
          <div className={cardCls} style={cardStyle}>
            <CardHead title={data.failures.title} icon={data.failures.icon} C={C} />
            <MiniTable
              C={C}
              columns={data.failures.columns}
              cols="grid-cols-[44px_minmax(0,1fr)_108px]"
              rows={data.failures.rows.map((r) => [
                <span key="r" className="t-body font-semibold" style={{ color: C.blue }}>{r.rank}</span>,
                <span key="f" className="t-label" style={{ color: C.soft }}>{r.failure}</span>,
                <span key="p" className="t-label flex justify-end">
                  <span className="rounded-[3px] px-2 py-0.5 text-white" style={{ background: RISK_BG[r.risk.type] }}>{r.risk.label}</span>
                </span>,
              ])}
            />
          </div>

          {/* Regional demand */}
          <div className={cardCls} style={cardStyle}>
            <CardHead title={data.regionalDemand.title} icon={data.regionalDemand.icon} C={C} />
            <div className="flex items-center gap-5 border-t px-4 py-5" style={{ borderColor: C.line }}>
              <span className="relative block h-[140px] w-[140px] shrink-0">
                <Donut size={140} inner={68} isDark={isDark} />
              </span>
              <ul className="grid flex-1 gap-3">
                {data.regionalDemand.rows.map((r, i) => (
                  <li key={r.region} className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ background: ["#0b50e3", "#1f5fe8", "#2f6fef", "#4f86f2"][i] }} />
                    <span className="t-label flex-1" style={{ color: C.text }}>{r.region}</span>
                    <span className="leading-tight">
                      <span className="t-body block font-bold" style={{ color: C.text }}>{r.percentage}</span>
                      {tag(r.source)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Live feed */}
          <div className={cardCls} style={cardStyle}>
            <CardHead title={data.liveFeed.title} icon={data.liveFeed.icon} C={C} />
            <MiniTable
              C={C}
              columns={data.liveFeed.columns}
              cols="grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.85fr)]"
              rows={data.liveFeed.rows.map((r) =>
                [r.vehicle, r.location, r.issue, r.timestamp].map((v, j) => (
                  <span key={j} className={`t-label ${j === 3 ? "text-right" : ""}`} style={{ color: C.soft }}>
                    {v}
                  </span>
                )),
              )}
            />
          </div>
        </div>

        <p className="t-label mt-5 border-t pt-4 text-center" style={{ color: C.soft, borderColor: C.line }}>
          {data.liveFeed.footer.split("BMWEngines.uk")[0]}
          <span style={{ color: C.blue }}>BMWEngines.uk</span>
          {data.liveFeed.footer.split("BMWEngines.uk")[1]}
        </p>
      </div>
    </div>
  );
}

// Phone / tablet: readable stacked layout (body 17px, entries 16–18px, labels 13px).
function Phone({ data, isDark }) {
  const [open, setOpen] = useState(null);
  const C = COL[isDark ? "dark" : "light"];
  const H = COL.dark;
  const panels = [
    ["engines", data.engines],
    ["models", data.models],
    ["replacementCosts", data.replacementCosts],
  ];
  const head = (p) => (
    <span className="flex items-center gap-3">
      <span className="h-8 w-8 shrink-0" style={{ color: C.icon }}>
        <PanelIcon name={p.icon} className="h-full w-full" />
      </span>
      <span className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.02em]" style={{ color: C.text }}>
        {p.title}
        {p.subtitle ? <span className="block text-[14px] font-semibold normal-case tracking-normal" style={{ color: C.soft }}>({p.subtitle})</span> : null}
      </span>
    </span>
  );
  const valueTag = (text) => {
    const [v, tag] = split(text);
    return (
      <span className="shrink-0 text-right">
        <span className="block text-[17px] font-bold" style={{ color: C.blue }}>{v}</span>
        <span className="block text-[13px]" style={{ color: C.tag }}>{tag}</span>
      </span>
    );
  };

  return (
    <div className="lg:hidden">
      {/* Hero: dark in both themes, as in the reference */}
      <div className="relative overflow-hidden" style={{ background: H.bg }}>
        <div className="relative mx-auto max-w-[720px] px-4 pb-8 pt-10">
          <div className="relative mb-6 h-[200px] overflow-hidden rounded-[16px]">
            <Image src={data.headerImage.backdrop.dark} alt="" fill sizes="720px" className="object-cover" />
            <Image src={data.headerImage.phone} alt={data.headerImage.alt} fill sizes="400px" className="object-contain object-bottom px-4 pt-3" style={{ filter: "brightness(0.66) contrast(1.2)" }} />
          </div>
          <MobileHeading html={data.h2} color="#ffffff" accent={H.accent} />
          <MobileLead color="#e6e9ee">{data.subHeadline}</MobileLead>
          <ul className="mt-6 grid grid-cols-3 rounded-[12px] border" style={{ background: "rgba(14,22,32,0.92)", borderColor: "#253142" }}>
            {data.stats.map((st, i) => (
              <li key={st.label} className="flex flex-col items-center px-2 py-4 text-center" style={{ borderLeft: i ? "1px solid #253142" : undefined }}>
                <span className="h-8 w-8" style={{ color: "#2f7bec" }}>
                  <PanelIcon name={st.icon} className="h-full w-full" />
                </span>
                <span className="mt-2 text-[23px] font-bold leading-tight text-white">{i < 2 ? st.value : null}</span>
                <span className="mt-0.5 text-[14px] leading-[1.35] text-[#d7dbe1]">{i < 2 ? st.label : `${st.value} ${st.label}`}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto grid max-w-[720px] gap-4 px-4 pb-10 pt-6">
        {/* Accordions */}
        {panels.map(([key, p]) => {
          const isOpen = open === key;
          return (
            <MobileCard key={key} C={C}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left">
                {head(p)}
                <svg aria-hidden="true" viewBox="0 0 16 9" className={`h-2.5 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: C.text }}>
                  <path d="M1 1 8 7.5 15 1" />
                </svg>
              </button>
              {isOpen ? (
                <ul className="border-t px-4" style={{ borderColor: C.line }}>
                  {p.rows.map((r, j) => (
                    <li key={j} className="flex items-center gap-3 border-b py-3 last:border-b-0" style={{ borderColor: C.line }}>
                      {r.rank ? <span className="w-5 shrink-0 text-[18px] font-semibold" style={{ color: C.blue }}>{r.rank}</span> : null}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[17px] font-bold" style={{ color: C.text }}>{r.code || r.model}</span>
                        {r.label ? <span className="block text-[15px]" style={{ color: C.soft }}>{r.label}</span> : null}
                      </span>
                      {valueTag(r.enquiries || r.cost)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </MobileCard>
          );
        })}

        {/* Failures */}
        <MobileCard C={C} className="px-4 pt-4">
          {head(data.failures)}
          <ul className="mt-2">
            {data.failures.rows.map((r) => (
              <li key={r.rank} className="flex gap-3 border-t py-3.5" style={{ borderColor: C.line }}>
                <span className="w-5 shrink-0 text-[19px] font-semibold leading-[1.3]" style={{ color: C.blue }}>{r.rank}</span>
                <span className="flex-1">
                  <span className="block text-[17px] leading-[1.45]" style={{ color: C.soft }}>{r.failure}</span>
                  <span className="mt-2 inline-block rounded-[4px] px-2.5 py-1 text-[14px] font-semibold text-white" style={{ background: RISK_BG[r.risk.type] }}>{r.risk.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </MobileCard>

        {/* Regional demand */}
        <MobileCard C={C} className="p-4">
          {head(data.regionalDemand)}
          <div className="mt-4 flex items-center gap-5">
            <span className="relative h-[116px] w-[116px] shrink-0">
              <Donut size={116} inner={56} isDark={isDark} />
            </span>
            <ul className="grid flex-1 gap-2.5">
              {data.regionalDemand.rows.map((r, j) => (
                <li key={r.region} className="flex items-center gap-2.5 text-[16px]" style={{ color: C.text }}>
                  <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ background: ["#0b50e3", "#1f5fe8", "#2f6fef", "#6f9ef4"][j] }} />
                  <span className="flex-1">{r.region}</span>
                  <span className="font-bold">{r.percentage}</span>
                </li>
              ))}
              <li className="text-[13px]" style={{ color: C.tag }}>{data.regionalDemand.rows[0].source}</li>
            </ul>
          </div>
        </MobileCard>

        {/* Live feed */}
        <MobileCard C={C} className="px-4 pt-4">
          {head(data.liveFeed)}
          <ul className="mt-2">
            {data.liveFeed.rows.map((r) => (
              <li key={r.vehicle} className="border-t py-3" style={{ borderColor: C.line }}>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[17px] font-bold" style={{ color: C.text }}>{r.vehicle}</span>
                  <span className="shrink-0 text-[14px]" style={{ color: C.soft }}>{r.timestamp}</span>
                </span>
                <span className="mt-0.5 block text-[16px]" style={{ color: C.soft }}>
                  {r.issue} · {r.location}
                </span>
              </li>
            ))}
          </ul>
        </MobileCard>

        <p className="flex items-center justify-center gap-2 text-center text-[15px]" style={{ color: C.soft }}>
          <span className="h-4 w-4 shrink-0" style={{ color: C.icon }}>
            <PanelIcon name="refresh" className="h-full w-full" />
          </span>
          <span>
            {data.liveFeed.footer.split("BMWEngines.uk")[0]}
            <span style={{ color: C.blue }}>BMWEngines.uk</span>
            {data.liveFeed.footer.split("BMWEngines.uk")[1]}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function HomeSec10({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <Desktop data={data} isDark={isDark} />
      <Phone data={data} isDark={isDark} />
    </section>
  );
}
