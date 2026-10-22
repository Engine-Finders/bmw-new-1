"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";

// Model page hero. No card container: the copy sits straight on the section background, the client's
// hero image for this model fills the right side behind a diagonal cut, and the four stats run
// underneath in the shared container. Phones: pill, H1, copy, the same image (diagonal cut), CTA,
// then the stats as a 2 × 2 grid.

// Line icons drawn to match the reference (24px grid, stroke = currentColor).
const ICON_PATHS = {
  chart: ["M3 13h4v8H3z", "M10 9h4v12h-4z", "M17 3h4v18h-4z"],
  wrench: [
    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  ],
  book: [
    "M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z",
    "M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z",
    "M5 8.5h3.5M5 11.5h3.5M5 14.5h3.5M15.5 8.5H19M15.5 11.5H19M15.5 14.5H19",
  ],
  trophy: [
    "M7 3h10v6a5 5 0 0 1-10 0z",
    "M7 5H4.5a2.5 2.5 0 0 0 2.6 4.6M17 5h2.5a2.5 2.5 0 0 1-2.6 4.6",
    "M12 14v3M9.5 17h5l1 4h-7z",
  ],
  shield: [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12 2 2 4-4",
  ],
  arrow: ["M5 12h14", "m13 6 6 6-6 6"],
};

const STAT_ICONS = ["chart", "wrench", "book", "trophy"];

function LineIcon({ name, className, strokeWidth = 1.8 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function EngineIcon({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M7 4v2h3v2H7l-2 2v3H3v-3H1v8h2v-3h2v3h3l2 2h8v-4h2v3h3V9h-3v3h-2V8h-6V6h3V4z" />
    </svg>
  );
}

// "BMW 3 Series • 1975–Present • 7 Generations • M10, M20, ..." -> brand, middle parts, engines.
function splitTagPill(tagPill = "") {
  const parts = String(tagPill).split(/\s*•\s*/).filter(Boolean);
  const hasEngines = parts.length > 2;
  return {
    brand: parts[0] || "",
    meta: hasEngines ? parts.slice(1, -1) : parts.slice(1),
    engines: hasEngines ? parts[parts.length - 1] : "",
  };
}

// "3 Series Engines - The Complete UK Guide" -> ["3 Series Engines", "The Complete ", "UK Guide"]
function splitTitle(h1 = "") {
  const match = String(h1).match(/^(.*?)\s*[-–—]\s*(.*)$/);
  const first = match ? match[1] : "";
  const rest = match ? match[2] : String(h1);
  const accentAt = rest.indexOf("UK Guide");
  return {
    first,
    plain: accentAt === -1 ? rest : rest.slice(0, accentAt),
    accent: accentAt === -1 ? "" : rest.slice(accentAt),
  };
}

// Dashes as in the reference, the enquiry count and the [BMW-VERIFIED] tag picked out.
function copyHtml(text = "") {
  return String(text)
    .replace(/\s+-\s+/g, " — ")
    .replace(/(\d[\d,]*\+)/, `<span class="font-semibold">$1</span>`)
    .replace(/(\[[A-Z][A-Z -]+\])/g, `<span class="font-semibold text-[var(--mh-accent)]">$1</span>`);
}

// Trust strip label -> value, label, source tag, detail line, note.
// "826+ Enquiries (2025) [BMW-VERIFIED] - #1 Most-Enquired BMW Model"
function parseStat(item) {
  let text = String(item.label || "");
  const tag = text.match(/\[[^\]]+\]/)?.[0] || "";
  if (tag) text = text.replace(tag, " ");
  const [main = "", ...rest] = text.split(/\s+[-–—]\s+/);
  const clean = main.replace(/\s+/g, " ").trim();
  const base = { tag, detail: rest.join(" – ").trim(), note: item.note || "" };
  if (/^part of\s/i.test(clean)) return { ...base, pre: clean.slice(0, 7), label: clean.slice(8) };
  const [first, ...words] = clean.split(" ");
  if (!/^[\d.,]+\+?$/.test(first)) return { ...base, label: clean };
  return { ...base, value: first, label: words.join(" ") };
}

function Stat({ item, index, C, phone = false }) {
  const st = parseStat(item);
  return (
    <li className={`relative flex gap-3 ${phone ? "flex-col rounded-[12px] border p-4" : "items-center px-6 py-1 [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:top-1/2 [&:not(:last-child)]:after:h-[64%] [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:-translate-y-1/2 [&:not(:last-child)]:after:bg-[var(--mh-line)]"}`} style={phone ? { background: C.card, borderColor: C.border } : undefined}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: C.iconBg, color: C.accent }}>
        <LineIcon name={STAT_ICONS[index] || "chart"} className="h-7 w-7" strokeWidth={1.7} />
      </span>
      <span className="min-w-0">
        {st.pre ? <span className="t-label block" style={{ color: C.muted }}>{st.pre}</span> : null}
        <span className="block leading-tight" style={{ color: C.text }}>
          {st.value ? <strong className="t-num mr-1.5">{st.value}</strong> : null}
          <span className={st.pre ? "t-body font-semibold" : "t-body font-medium"}>{st.label}</span>
        </span>
        {st.tag ? <span className="t-label mt-0.5 block font-semibold" style={{ color: C.accent }}>{st.tag}</span> : null}
        {st.detail ? <span className="t-label block" style={{ color: C.muted }}>{st.detail}</span> : null}
        {st.note ? <span className="t-label mt-0.5 block" style={{ color: C.muted }}>{st.note}</span> : null}
      </span>
    </li>
  );
}

const COL = {
  light: { bg: "#f6f8fc", text: "#0b1426", muted: "#3b4656", accent: "#0b57e3", card: "rgba(255,255,255,0.92)", border: "#dfe6f1", iconBg: "#eaf1fd", pill: "rgba(255,255,255,0.85)", stripe: "#9ec0f7", line: "#dfe6f1" },
  dark: { bg: "#05080d", text: "#ffffff", muted: "#c3cad6", accent: "#3b82f6", card: "rgba(14,22,34,0.88)", border: "#22324a", iconBg: "rgba(59,130,246,0.14)", pill: "rgba(10,16,26,0.75)", stripe: "#2563eb", line: "#22324a" },
};

function Pill({ pill, C, className = "" }) {
  return (
    <div className={`inline-flex items-start gap-2.5 rounded-[14px] border px-4 py-2.5 ${className}`} style={{ background: C.pill, borderColor: C.border }}>
      <LineIcon name="shield" className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.9} />
      <p className="t-label [&_a]:font-normal [&_a]:underline-offset-2 hover:[&_a]:underline" style={{ color: C.muted }}>
        <span className="font-semibold" style={{ color: C.accent }} dangerouslySetInnerHTML={{ __html: pill.brand }} />
        {pill.meta.map((part) => (
          <span key={part}>
            <span className="mx-1.5" aria-hidden="true">•</span>
            <span dangerouslySetInnerHTML={{ __html: part }} />
          </span>
        ))}
        {pill.engines ? (
          <>
            <span className="mx-1.5" aria-hidden="true">•</span>
            <EngineIcon className="mr-1 inline-block h-4 w-4 align-[-3px]" />
            <span dangerouslySetInnerHTML={{ __html: pill.engines }} />
          </>
        ) : null}
      </p>
    </div>
  );
}

function Title({ title, C, className = "" }) {
  return (
    <h1 className={`t-h1 ${className}`} style={{ color: C.text }}>
      {title.first ? (
        <>
          <span dangerouslySetInnerHTML={{ __html: title.first }} /> –<br />
        </>
      ) : null}
      <span dangerouslySetInnerHTML={{ __html: title.plain }} />
      {title.accent ? <span style={{ color: C.accent }} dangerouslySetInnerHTML={{ __html: title.accent }} /> : null}
    </h1>
  );
}

function Cta({ data, href, className = "" }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-3 rounded-[6px] bg-[#0b57e3] px-7 py-3.5 t-body font-semibold text-white transition hover:brightness-110 ${className}`}>
      <span dangerouslySetInnerHTML={{ __html: data.primaryCta.label.replace(/\s*(?:→|â†’)\s*$/, "") }} />
      <LineIcon name="arrow" className="h-5 w-5" strokeWidth={2.2} />
    </Link>
  );
}

export default function ModelHero({ data }) {
  const { theme } = useTheme();
  if (!data) return null;

  const isDark = theme === "dark";
  const C = COL[isDark ? "dark" : "light"];
  const pill = splitTagPill(data.tagPill);
  const title = splitTitle(data.h1);
  const scene = (!isDark && data.heroSceneLight) || data.heroScene;
  const ctaHref = data.primaryCta?.href && data.primaryCta.href !== "#" ? data.primaryCta.href : "/quote";
  const vars = { background: C.bg, "--mh-accent": C.accent, "--mh-line": C.line };

  return (
    <section className="relative overflow-hidden" style={vars}>
      {/* ---------- Desktop ---------- */}
      <div className="relative hidden lg:block">
        {scene ? (
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[50%] xl:w-[54%]">
            <div className="absolute inset-0 [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]">
              <Image src={scene.src} alt="" fill priority sizes="54vw" className="object-cover object-[70%_center]" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${C.bg} 0%, transparent 30%), linear-gradient(0deg, ${C.bg} 0%, transparent 22%)` }} />
            </div>
            {/* Blue band along the diagonal cut. */}
            <div className="absolute inset-y-0 left-0 w-full [clip-path:polygon(21%_0,22.6%_0,1.6%_100%,0_100%)]" style={{ background: C.stripe }} />
          </div>
        ) : null}

        <div className="site-container relative pb-8 pt-8">
          <div className="max-w-[660px]">
            <Pill pill={pill} C={C} />
            <Title title={title} C={C} className="mt-5" />
            <p className="t-p mt-5 max-w-[600px]" style={{ color: C.muted }} dangerouslySetInnerHTML={{ __html: copyHtml(data.subHeadline) }} />
            {data.primaryCta ? <Cta data={data} href={ctaHref} className="mt-7" /> : null}
          </div>

          {data.trustStrip?.length > 0 ? (
            <ul className="glass-panel relative mt-7 grid grid-cols-4 rounded-[14px] py-4" style={{ background: C.card, borderColor: C.border }}>
              {data.trustStrip.map((item, index) => (
                <Stat key={item.label} item={item} index={index} C={C} />
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* ---------- Phone / tablet ---------- */}
      <div className="site-container relative pb-8 pt-6 lg:hidden">
        <Pill pill={pill} C={C} />
        <Title title={title} C={C} className="mt-5" />
        <p className="t-body mt-4" style={{ color: C.muted }} dangerouslySetInnerHTML={{ __html: copyHtml(data.subHeadline) }} />
        {scene ? (
          <div aria-hidden="true" className="relative mr-[calc(var(--gutter)*-1)] mt-5 aspect-[16/9] [clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]">
            <Image src={scene.src} alt="" fill priority sizes="100vw" className="object-cover object-[72%_center]" />
          </div>
        ) : null}
        {data.primaryCta ? <Cta data={data} href={ctaHref} className="mt-5 w-full justify-center" /> : null}
        {data.trustStrip?.length > 0 ? (
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {data.trustStrip.map((item, index) => (
              <Stat key={item.label} item={item} index={index} C={C} phone />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
