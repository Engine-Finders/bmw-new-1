"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";
import BrandIcon, { hasBrandIcon } from "@/components/home/brandIcon";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
};

function cleanText(value = "") {
  return value
    .replaceAll("â€”", "-")
    .replaceAll("ðŸ“Š", "")
    .replaceAll("ðŸ’š", "")
    .replaceAll("ðŸ”§", "")
    .replaceAll("ðŸ†", "")
    .trim();
}

function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }) {
  // The client's icon artwork where it has one; arrows and chevrons stay as line icons.
  if (hasBrandIcon(name)) return <BrandIcon name={name} className={className} />;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.chart}
    </svg>
  );
}

// Phone list: the client's icon artwork in a tinted tile; "when not to repair" is the green heart.
const SIGNAL_TILES = {
  chart: { icon: "real-inquiries", tone: "blue" },
  shield: { icon: "heart", tone: "green" },
  wrench: { icon: "vetted-specialist", tone: "blue" },
  trophy: { icon: "engine-finders", tone: "blue" },
};

function SignalTile({ name, isDark }) {
  const tile = SIGNAL_TILES[name] || SIGNAL_TILES.chart;
  const tone =
    tile.tone === "green"
      ? isDark ? "bg-[#0d2a1d] text-[#4fd18b]" : "bg-[#e9f8ef] text-[#2fb36a]"
      : isDark ? "bg-[#0c2748] text-[#7fb0ff]" : "bg-[#eef4ff] text-[var(--color-primary)]";
  return (
    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${tone}`}>
      <BrandIcon name={tile.icon} className="h-8 w-8" scale={1.15} />
    </span>
  );
}

function signalIcon(title) {
  const lower = title.toLowerCase();
  if (lower.includes("real data")) return "chart";
  if (lower.includes("not to repair")) return "shield";
  if (lower.includes("specialists")) return "wrench";
  return "trophy";
}

export default function HomeSec12({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`relative overflow-hidden px-3 py-7 md:px-6 md:py-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="absolute inset-x-0 top-0 hidden h-[260px] lg:block">

        {/* Banner on the right: the car (or engine) stays whole at header height */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[64%]">
          <Image src={(isDark && data.headerImageDark ? data.headerImageDark : data.headerImage).src} alt={(isDark && data.headerImageDark ? data.headerImageDark : data.headerImage).alt} fill className="object-cover object-[78%_55%] md:object-[center_55%]" sizes="100vw" />
        </div>
        <div className={isDark ? "absolute inset-0 bg-[linear-gradient(90deg,#02070b_0%,rgba(2,7,11,0.92)_42%,rgba(2,7,11,0.24)_78%)]" : "absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.92)_42%,rgba(255,255,255,0.24)_78%)]"} />
        <div className={isDark ? "absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(0deg,white_0%,transparent_100%)]"} />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[680px] pt-4 md:pt-7">
          <h2 className={`text-[2.7rem] font-bold leading-[1.04] tracking-normal md:text-[3.25rem] ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <div className="mt-4">
            <MStripe />
          </div>
          <p className={`mt-5 max-w-[620px] text-[0.9rem] leading-[1.58] md:text-[1rem] ${isDark ? "text-white/78" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: cleanText(data.subHeadline) }} />
        </div>

        {/* Phones and tablets: one card, icon tile left, title running into the description */}
        <div className={`mt-6 rounded-xl border px-4 shadow-[0_12px_28px_rgba(10,26,43,0.06)] md:px-6 lg:hidden ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.92)]" : "border-[#e3e9f1] bg-white"}`}>
          {data.signals.map((item, index) => (
            <article key={item.id} className={`flex items-start gap-4 py-4 ${index ? `border-t ${isDark ? "border-[#223343]" : "border-[#e8edf3]"}` : ""}`}>
              <SignalTile name={signalIcon(item.title)} isDark={isDark} />
              <p className={`min-w-0 text-[0.92rem] leading-[1.55] ${isDark ? "text-white/80" : "text-[#27384a]"}`}>
                <strong className="font-bold text-[var(--color-primary)]">{item.title}</strong>
                {" \u2014 "}
                <span dangerouslySetInnerHTML={{ __html: cleanText(item.description) }} />
              </p>
            </article>
          ))}
        </div>

        <div className="mt-7 hidden grid-cols-4 gap-4 lg:grid">
          {data.signals.map((item) => (
            <article key={item.id} className={`rounded-md border p-4 shadow-[0_12px_28px_rgba(10,26,43,0.06)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.92)]" : "border-[#dfe5ed] bg-white"}`}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary)] text-[0.85rem] font-bold text-white">
                  {item.id}
                </span>
                <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${isDark ? "border-[#2f4860] bg-[#0c2748] text-[#7fb0ff]" : "border-[#cfe0ff] bg-[#eef5ff] text-[var(--color-primary)]"}`}>
                  <Icon name={signalIcon(item.title)} className="h-5 w-5" strokeWidth={2.1} />
                </span>
              </div>
              <h3 className={`text-[1rem] font-bold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{item.title}</h3>
              <p className={`mt-3 text-[0.86rem] leading-[1.52] ${isDark ? "text-white/76" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: cleanText(item.description) }} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
