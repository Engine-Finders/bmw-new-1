"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";

// "Can I Repair My … Engine — or Should I Replace It?" (model page). Built to the reference:
// heading, two-line intro and the "smarter way" callout beside the car, two path cards, and the
// navy "Stop guessing" bar. Phones stack the same blocks; path cards put the icon beside the heading.

const ICONS = {
  calculator: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <rect x="7.5" y="5" width="9" height="4" rx="0.6" />
      <path d="M8 12.5h.01M12 12.5h.01M16 12.5h.01M8 15.5h.01M12 15.5h.01M16 15.5h.01M8 18.5h.01M12 18.5h.01M16 18.5h.01" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  ),
  engineSearch: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3 10v5M3 12.5h2M5 9h2l1.5-2H13v2h2.5l1.5 2v1" />
      <path d="M5 9v7h3l1.5 2H12" />
      <path d="M8 5h5M10.5 5v2" />
      <circle cx="16.5" cy="15.5" r="3.5" />
      <path d="m19 18 2.5 2.5" />
    </g>
  ),
  docSearch: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M13.5 21H6a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 6 3h7l4.5 4.5V10" />
      <path d="M13 3v4.5h4.5M7.5 10h6M7.5 13h3" />
      <circle cx="15.5" cy="16" r="3.2" />
      <path d="m17.8 18.3 2.7 2.7" />
    </g>
  ),
  engineQuestion: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3 10v5M3 12.5h2M5 9h2l1.5-2H13v2h2.5l2 2.5V16l-2 2.5H9.5L8 16H5z" />
      <path d="M8 5h5M10.5 5v2" />
      <path d="M10.2 11a1.5 1.5 0 1 1 2.1 1.4c-.5.2-.8.6-.8 1.1M11.5 15.4h.01" />
    </g>
  ),
  check: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.2 2.7 2.7L16.2 9.4" />
    </g>
  ),
  bars: <path d="M4 20h16M6 16v-5M10 16V8M14 16v-6M18 16V5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  shieldCheck: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 5.8v5.6c0 4.4 2.9 8 7 9.6 4.1-1.6 7-5.2 7-9.6V5.8z" />
      <path d="m8.8 12 2.3 2.3 4.3-4.4" />
    </g>
  ),
  target: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <path d="m13.5 10.5 6-6M17 4.5h2.5V7" />
    </g>
  ),
  info: (
    <g>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 10.5v6M12 7.5h.01" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
};

function Icon({ name, className = "h-6 w-6" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {ICONS[name] || ICONS.check}
    </svg>
  );
}

const flat = (html = "") => String(html).replace(/\s*<br\s*\/?>\s*/g, " ");

const COL = {
  light: { bg: "#f7f9fc", text: "#071423", muted: "#3b4656", accent: "#0b57e3", card: "#ffffff", border: "#e3e8f0", soft: "#eef3fc", line: "#e6eaf0", shadow: "0 8px 24px rgba(10,26,43,0.06)" },
  dark: { bg: "#05080d", text: "#ffffff", muted: "#c3cad6", accent: "#3b82f6", card: "#0b1220", border: "#1f2c40", soft: "rgba(59,130,246,0.12)", line: "#1f2c40", shadow: "none" },
};

function PathCard({ card, C, isDark }) {
  const solid = card.button?.style === "solid";
  return (
    <article className="flex flex-col rounded-[12px] border p-5 lg:p-6" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
      <span className="w-fit rounded-[4px] bg-[#0b57e3] px-2 py-1 text-[13px] font-semibold uppercase leading-none text-white">{card.badge}</span>
      <div className="mt-4 flex items-center gap-4 lg:flex-row-reverse lg:items-start lg:justify-between">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full lg:h-[84px] lg:w-[84px]" style={{ background: C.soft, color: C.accent }}>
          <Icon name={card.icon} className="h-9 w-9 lg:h-11 lg:w-11" />
        </span>
        <div className="min-w-0">
          <h3 className="t-h5" style={{ color: C.text }}>
            <span style={{ color: C.accent }}>{card.titleAccent}</span> <span dangerouslySetInnerHTML={{ __html: flat(card.title) }} />
          </h3>
          <p className="t-body mt-1.5" style={{ color: C.muted }} dangerouslySetInnerHTML={{ __html: flat(card.text) }} />
        </div>
      </div>

      {card.button ? (
        <Link
          href={card.button.href || "/tools/diagnostic-wizard"}
          className={`mt-5 flex items-center gap-4 rounded-[8px] px-4 py-3 font-normal transition hover:brightness-110 ${solid ? "bg-[#0b57e3] text-white" : "border"}`}
          style={solid ? undefined : { borderColor: C.accent, color: C.text }}
        >
          <span style={solid ? undefined : { color: C.accent }}>
            <Icon name={card.button.icon} className="h-8 w-8 shrink-0" />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-[16px] font-semibold" style={solid ? undefined : { color: C.accent }}>{card.button.label}</span>
            <span className={`t-label mt-0.5 block ${solid ? "text-white/85" : ""}`} style={solid ? undefined : { color: C.muted }}>{card.button.sub}</span>
          </span>
          <span style={solid ? undefined : { color: C.accent }}>
            <Icon name="arrow" className="h-5 w-5 shrink-0" />
          </span>
        </Link>
      ) : null}

      {card.features?.length ? (
        <ul className="mt-5 grid grid-cols-3 border-t pt-4" style={{ borderColor: C.line }}>
          {card.features.map((f, i) => (
            <li key={f.title} className="flex flex-col items-start gap-1.5 px-2 first:pl-0 lg:flex-row lg:gap-2.5" style={i ? { borderLeft: `1px solid ${C.line}` } : undefined}>
              <span style={{ color: C.accent }}>
                <Icon name={f.icon} className="h-6 w-6 shrink-0" />
              </span>
              <span className="min-w-0">
                <strong className="block text-[14px] font-semibold leading-tight lg:text-[15px]" style={{ color: C.text }}>{f.title}</strong>
                <span className="mt-0.5 block text-[13px] leading-[1.35] lg:text-[15px]" style={{ color: C.muted }}>{f.text}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {card.note ? (
        <div className="mt-4 flex items-start gap-3 rounded-[8px] p-3" style={{ background: C.soft }}>
          <span style={{ color: C.accent }}>
            <Icon name="info" className="h-6 w-6 shrink-0" />
          </span>
          <p className="t-label" style={{ color: C.muted }}>
            <strong className="block font-semibold" style={{ color: C.text }}>{card.note.title}</strong>
            {card.note.text}
          </p>
        </div>
      ) : null}
    </article>
  );
}

// Model JSONs without the reference fields get the same blocks built from h2 / intro / paths.
function withDefaults(data) {
  if (data.pathCards) return data;
  const h2 = String(data.h2 || "").replace(/\s+-\s+/g, " — ");
  const model = h2.match(/My\s+(.+?)\s+Engine/i)?.[1] || "BMW";
  const marker = h2.indexOf("or Should I Replace It?");
  const sentences = String(data.intro || "").replace(/\s+-\s+/g, " — ").match(/[^.!?]+[.!?]+/g) || [String(data.intro || "")];
  const href = data.paths?.[0]?.href || "/tools/diagnostic-wizard";
  return {
    ...data,
    titleLines: marker > 0 ? [h2.slice(0, marker).trim(), `<span>${h2.slice(marker)}</span>`] : [h2, ""],
    introLead: sentences.slice(0, -1).join(" ").trim() || sentences[0],
    introBody: "",
    callout: { title: "The smarter way to decide:", text: sentences.length > 1 ? sentences.at(-1).trim() : "Get a personalised repair-vs-replace verdict using real UK cost data." },
    pathCards: [
      {
        badge: "PATH 1",
        icon: "engineSearch",
        titleAccent: "Know",
        title: "your engine?",
        text: `Launch the BMW diagnostic calculator with ${model} pre-selected.`,
        button: { style: "solid", icon: "calculator", label: `Launch ${model} Diagnostic Calculator`, sub: `${model} pre-selected`, href },
        features: [
          { icon: "check", title: `${model} pre-selected`, text: "All generations covered" },
          { icon: "bars", title: "Real UK cost data", text: "Used, recon & rebuilt" },
          { icon: "shieldCheck", title: "Instant verdict", text: "Repair vs replace" },
        ],
      },
      {
        badge: "PATH 2",
        icon: "docSearch",
        titleAccent: "Not sure",
        title: "which engine you have?",
        text: "We’ll identify it first.",
        button: { style: "outline", icon: "engineQuestion", label: "Identify My Engine First", sub: "Then launch the diagnostic calculator", href: data.paths?.[1]?.href || href },
        note: { title: "Identification is the first step inside the tool.", text: "We’ll pinpoint your exact engine code before running the diagnostics." },
      },
    ],
    banner: {
      title: "Stop guessing. Get the right answer.",
      text: "Our calculator compares real repair and replacement costs against your car’s value — so you know the financially smarter move.",
      cta: { label: "Start Your Verdict Now", href },
    },
  };
}

export default function CalculatorCTA({ data: raw }) {
  const { theme } = useTheme();
  if (!raw) return null;
  const data = withDefaults(raw);
  const isDark = theme === "dark";
  const C = COL[isDark ? "dark" : "light"];
  const [line1, line2] = data.titleLines || [data.h2, ""];
  const banner = data.banner;
  // The reference car (white G20 on the skyline backdrop) for the 3 Series; other models use their own photo.
  const car = /3 Series/.test(data.h2 || "") && !isDark ? "/model/s11-calc-light.webp" : data.image;

  return (
    <section className="relative overflow-hidden" style={{ background: C.bg }}>
      <div className="site-container section-y relative">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <h2 className="t-h2 [&_span]:text-[var(--acc)]" style={{ color: C.text, "--acc": C.accent }}>
              <span className="!text-inherit" dangerouslySetInnerHTML={{ __html: line1 }} /> <span className="!text-inherit" dangerouslySetInnerHTML={{ __html: line2 }} />
            </h2>
            {data.introLead ? <p className="t-p mt-4" style={{ color: C.text }}>{data.introLead}</p> : null}
            {data.introBody ? <p className="t-body mt-1.5" style={{ color: C.muted }} dangerouslySetInnerHTML={{ __html: flat(data.introBody) }} /> : null}
            {data.callout ? (
              <div className="mt-5 flex items-start gap-3 rounded-[10px] border p-4" style={{ background: C.soft, borderColor: C.border }}>
                <span style={{ color: C.accent }}>
                  <Icon name="calculator" className="h-9 w-9 shrink-0" />
                </span>
                <p className="t-body" style={{ color: C.text }}>
                  <strong className="font-semibold" style={{ color: C.accent }}>{data.callout.title}</strong> {flat(data.callout.text)}
                </p>
              </div>
            ) : null}
          </div>
          {car ? (
            <div aria-hidden="true" className="relative mx-auto aspect-[1015/760] w-full max-w-[560px] [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent,black_14%,black_88%,transparent),linear-gradient(180deg,transparent,black_12%,black_86%,transparent)]">
              <Image src={car} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-contain" />
            </div>
          ) : null}
        </div>

        {data.pathCards?.length ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {data.pathCards.map((card) => (
              <PathCard key={card.badge} card={card} C={C} isDark={isDark} />
            ))}
          </div>
        ) : null}

        {banner ? (
          <div className="mt-4 flex flex-col gap-4 rounded-[12px] bg-[#0a1630] p-5 text-white md:flex-row md:items-center md:justify-between lg:px-6">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <Icon name="target" className="h-8 w-8" />
              </span>
              <div>
                <h3 className="t-h6">{banner.title}</h3>
                <p className="t-body mt-1 text-white/80">{flat(banner.text)}</p>
              </div>
            </div>
            <Link href={banner.cta?.href || "/tools/diagnostic-wizard"} className="inline-flex shrink-0 items-center justify-center gap-3 rounded-[8px] bg-[#0b57e3] px-7 py-3.5 text-[16px] font-semibold text-white transition hover:brightness-110">
              {banner.cta?.label}
              <Icon name="arrow" className="h-5 w-5" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
