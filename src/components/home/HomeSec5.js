"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";

// Comparison Hub - six numbered head-to-head cards. Desktop: two columns, photo panel + labels on
// the left of each card and the verdict copy on the right, under a G20 front / 5 Series rear pair.
// Phone: cards stacked (photo, labels, copy) and a "Not sure which is right for you?" card.
// Measurements follow the 1536px desktop and 390px phone references.

function Arrow({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5" />
    </svg>
  );
}

function OptionMark({ option, isDark, size }) {
  const box = `${size} shrink-0`;
  switch (option.icon) {
    case "alert":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={box}>
          <path d="M12 2 23.5 22H.5L12 2Z" fill="#e5232b" />
          <path d="M12 9v6.2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="12" cy="18.6" r="1.35" fill="#fff" />
        </svg>
      );
    case "check":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={box}>
          <rect x="1" y="1" width="22" height="22" rx="3" fill="#25a84a" />
          <path d="m6.3 12.4 3.8 3.8 7.6-7.9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "dot":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={box}>
          <rect x="1" y="1" width="22" height="22" rx="3" fill="#1557d6" />
          <circle cx="12" cy="12" r="4.6" fill="none" stroke="#fff" strokeWidth="2.6" />
        </svg>
      );
    case "x":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={box}>
          <rect x="1" y="1" width="22" height="22" rx="3" fill="#e5232b" />
          <path d="m7.3 7.3 9.4 9.4m0-9.4-9.4 9.4" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "car":
      return (
        <svg aria-hidden="true" viewBox="0 0 36 26" className="h-[26px] w-[36px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M6.5 11.5 9.2 4.6A2.5 2.5 0 0 1 11.5 3h13a2.5 2.5 0 0 1 2.3 1.6l2.7 6.9" />
          <path d="M4.5 11.5h27a1.5 1.5 0 0 1 1.5 1.5v6.5H3V13a1.5 1.5 0 0 1 1.5-1.5Z" />
          <path d="M5 19.5v3h5v-3m16 0v3h5v-3M6.5 15.5h4m15 0h4M14 15.5h8M3 10h2.5m25 0H33" />
        </svg>
      );
    case "drop":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={`${size} shrink-0`} fill="none" stroke={option.tone === "safe" ? "#22a447" : isDark ? "#fff" : "#0b1626"} strokeWidth="1.5">
          <path d="M12 2.2s7.2 8.2 7.2 13.2a7.2 7.2 0 0 1-14.4 0C4.8 10.4 12 2.2 12 2.2Z" />
          <path d="M8.6 15.6a3.4 3.4 0 0 0 3.2 3.3" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

// Fuel pump faces with a black (diesel) and green (petrol) nozzle in their holsters.
function FuelPumps({ isDark }) {
  const face = isDark ? "#323a46" : "#eceef1";
  const edge = isDark ? "#404957" : "#dfe2e7";
  const nozzle = (fill, shine) => (
    <svg aria-hidden="true" viewBox="0 0 120 170" preserveAspectRatio="xMidYMax meet" className="h-full w-full">
      <rect x="6" y="0" width="108" height="170" fill={face} />
      <rect x="6" y="0" width="3" height="170" fill={edge} />
      <rect x="111" y="0" width="3" height="170" fill={edge} />
      <rect x="34" y="14" width="52" height="138" rx="10" fill="#0e1014" />
      <rect x="40" y="20" width="40" height="126" rx="8" fill="#181b21" />
      <path d="M58 30c-16 0-24 12-24 28v38c0 7 5 12 12 12h8V74c0-9 5-14 12-14h6V30h-14Z" fill={fill} />
      <path d="M41 50c3-10 10-15 19-15" stroke={shine} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M72 66c13 0 18 9 18 21v83" stroke="#0a0b0e" strokeWidth="9" fill="none" strokeLinecap="round" />
      <rect x="46" y="96" width="12" height="16" rx="2" fill="#0a0b0e" />
    </svg>
  );
  return (
    <div className="grid h-full grid-cols-2 grid-rows-[100%] gap-[3%] overflow-hidden px-[6%] pt-[4%]">
      <div className="h-full">{nozzle(isDark ? "#3a404a" : "#1b1e24", isDark ? "#9aa3b0" : "#6b7380")}</div>
      <div className="h-full">{nozzle("#11823f", "#6fe09a")}</div>
    </div>
  );
}

function Panel({ item, isDark, phone }) {
  if (item.panel.kind === "fuel") {
    return (
      <div className={`h-full w-full ${isDark ? "bg-[linear-gradient(180deg,#262c35,#10151d)]" : "bg-[linear-gradient(180deg,#e3e6ea,#f8f8f9)]"}`}>
        <FuelPumps isDark={isDark} />
      </div>
    );
  }
  const src = phone && item.panelPhone ? item.panelPhone : item.panel;
  return (
    <span className="relative block h-full w-full">
      <Image src={isDark ? src.dark : src.light} alt={item.panel.alt} fill sizes={phone ? "92vw" : "340px"} className="object-cover" />
    </span>
  );
}

function Options({ item, isDark, phone }) {
  const strong = isDark ? "text-white" : "text-[#0b1426]";
  const muted = isDark ? "text-white/75" : "text-[#3a4152]";
  const plain = item.options.every((o) => !o.icon);
  const label = plain ? "text-[18px]" : item.options[0].icon === "drop" ? "text-[15px] font-medium uppercase" : "text-[16px]";
  return (
    <div className={`flex flex-wrap items-center justify-center px-3 py-3 ${plain ? "gap-x-5" : "gap-x-3"} gap-y-2`}>
      {item.options.map((option, i) => [
        i > 0 ? (
          <span key={`vs-${option.label}`} className={`${phone ? "text-[13px]" : "t-label"} ${muted}`}>
            vs
          </span>
        ) : null,
        <span key={option.label} className={`flex items-center gap-2 ${strong}`}>
          <OptionMark option={option} isDark={isDark} size={option.icon === "drop" ? "h-[24px] w-[20px]" : "h-[21px] w-[21px]"} />
          <span>
            <span className={`block font-medium leading-tight ${label}`}>{option.label}</span>
            {option.note ? <span className={`mt-[2px] block max-w-[120px] leading-[1.35] ${phone ? "text-[13px]" : "t-label"} ${muted}`}>{option.note}</span> : null}
          </span>
        </span>,
      ])}
    </div>
  );
}

function Badge({ id, phone }) {
  return (
    <span
      className={`absolute left-0 top-0 z-10 flex items-center justify-center bg-[#1557d6] font-medium text-white [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)] ${
        phone ? "h-[40px] w-[44px] pr-[7px] text-[20px]" : "h-[40px] w-[44px] pr-[7px] text-[20px]"
      }`}
    >
      {id}
    </span>
  );
}

function Card({ item, isDark, phone = false }) {
  const strong = isDark ? "text-white" : "text-[#0b1426]";
  const soft = isDark ? "text-[#c0c7d1]" : "text-[#3a4152]";
  const link = isDark ? "text-[#3d7cf2]" : "text-[#1557d6]";
  const divider = isDark ? "border-white/[0.08]" : "border-[#edf0f3]";
  const shell = isDark
    ? "border-[#16243a] bg-[#07131f]"
    : "border-[#e9ecf0] bg-white shadow-[0_4px_18px_rgba(16,24,40,0.06)]";
  const labelRow = isDark ? "bg-[#0b141e]" : "bg-[#fafafa]";

  if (phone) {
    return (
      <article className={`relative overflow-hidden rounded-[12px] border ${shell}`}>
        <Badge id={item.id} phone />
        <div className="h-[138px] overflow-hidden">
          <Panel item={item} isDark={isDark} phone />
        </div>
        <div className={`${item.options.some((o) => o.note) ? "min-h-[66px]" : "min-h-[49px]"} border-b ${divider} ${labelRow}`}>
          <Options item={item} isDark={isDark} phone />
        </div>
        <div className="px-[17px] pb-[20px] pt-[19px]">
          <p className={`t-h6 ${strong}`}>{item.title}</p>
          <p className={`t-body mt-2.5 ${soft}`}>{item.preview}</p>
          <Link href={item.link.href} className={`mt-4 flex items-center justify-end gap-[10px] pr-[6px] text-[16px] font-medium ${link}`}>
            {item.link.label}
            <Arrow className="h-[20px] w-[20px]" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={`relative grid grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] overflow-hidden rounded-[12px] border ${shell}`}>
      <Badge id={item.id} />
      <div className={`flex flex-col border-r ${divider}`}>
        <div className="aspect-[335/150] overflow-hidden">
          <Panel item={item} isDark={isDark} />
        </div>
        <div className={`flex-1 border-t ${divider} ${labelRow}`}>
          <Options item={item} isDark={isDark} />
        </div>
      </div>
      <div className="flex flex-col px-5 pb-4 pt-4">
        <h3 className={`t-h6 ${strong}`}>{item.title}</h3>
        <p className={`t-body mt-2 whitespace-pre-line ${soft}`}>{item.previewDesktop}</p>
        <Link href={item.link.href} className={`mt-auto flex items-center justify-end gap-2 pt-3 text-[15px] font-medium ${link}`}>
          {item.link.label}
          <Arrow className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default function HomeSec5({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const strong = isDark ? "text-white" : "text-[#0b1426]";
  const soft = isDark ? "text-[#d4d6db]" : "text-[#30374a]";
  const cars = data.headerCars;
  const front = isDark ? cars.frontDark : cars.frontLight;
  const rear = isDark ? cars.rearDark : cars.rearLight;
  const stripe = isDark
    ? "bg-[linear-gradient(90deg,#0b4fae_0%,#0b4fae_24%,#0a1d3f_50%,#0a1d3f_55%,#8a1020_57%,#8a1020_88%,transparent_100%)]"
    : "bg-[linear-gradient(90deg,#0347d0_0%,#0347d0_20%,#a9c1e4_42%,#c6d4ea_52%,#df1928_54%,#df1928_86%,transparent_100%)]";

  return (
    <section className={`relative overflow-hidden ${isDark ? "bg-[#030c16]" : "bg-[#fefefe]"}`}>
      {/* Desktop / tablet */}
      <div className="relative hidden md:block">
        <div className="site-container section-y relative">
          <div aria-hidden="true" className="pointer-events-none absolute right-[var(--gutter)] top-2 hidden h-[230px] w-[46%] max-w-[640px] lg:block">
            <span className="absolute bottom-0 right-0 block h-[78%] w-[48%]">
              <Image src={rear} alt="" fill sizes="320px" className="object-contain object-bottom" />
            </span>
            <span className="absolute bottom-0 left-0 block h-full w-[55%]">
              <Image src={front} alt={cars.alt} fill sizes="360px" className="object-contain object-bottom" />
            </span>
          </div>
          <div className="relative max-w-[640px]">
            <h2 className={`t-h2 ${strong}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
            <p className={`t-p mt-3 max-w-[600px] ${soft}`}>{data.subHeadlineDesktop}</p>
          </div>
          <div className="relative mt-8 grid gap-4 lg:grid-cols-2">
            {data.comparisons.map((item) => (
              <Card key={item.id} item={item} isDark={isDark} />
            ))}
          </div>
          <div aria-hidden="true" className={`mt-6 h-[10px] w-full [clip-path:polygon(0.4%_0,100%_0,99.6%_100%,0_100%)] ${stripe}`} />
        </div>
      </div>

      {/* Phone */}
      <div className="relative px-4 pb-8 pt-8 md:hidden">
        <p className={`t-h2 ${strong}`}>
          <span className="block">Comparison Hub -</span>
          <span className="heading-accent block">Head-to-Head</span>
          <span className="block">Verdicts</span>
        </p>
        <p className={`t-body mt-3 ${soft}`}>{data.subHeadline}</p>
        <div className="mt-[17px] grid gap-[21px]">
          {data.comparisons.map((item) => (
            <Card key={item.id} item={item} isDark={isDark} phone />
          ))}
        </div>
        <div className={`mt-[18px] rounded-[12px] border px-[14px] pb-[14px] pt-[14px] ${isDark ? "border-white/10 bg-[#0b141e]" : "border-[#e3e9f3] bg-[#eef3fb]"}`}>
          <div className="flex items-center gap-[12px]">
            <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-[3px] border-[#1557d6] bg-white p-[4px]">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[#1557d6] text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[28px] w-[28px]" fill="currentColor">
                  <path d="M7 3h10v4.5a5 5 0 0 1-10 0V3Zm-3 1h2.4v3.2A3.1 3.1 0 0 1 4 4.3V4Zm13.6 0H20v.3a3.1 3.1 0 0 1-2.4 2.9V4ZM10.8 13.2h2.4v3.6h3.3V19H7.5v-2.2h3.3v-3.6Z" />
                </svg>
              </span>
            </span>
            <span>
              <span className={`block text-[17px] font-semibold leading-[1.3] ${strong}`}>{data.bottomCta.title}</span>
              <span className={`t-body mt-1 block ${soft}`}>{data.bottomCta.text}</span>
            </span>
          </div>
          <Link href={data.bottomCta.href} className="mt-3 flex h-[46px] items-center justify-center gap-4 rounded-[6px] bg-[#1452d4] text-[15px] font-semibold text-white">
            {data.bottomCta.buttonLabel}
            <Arrow className="h-[22px] w-[22px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
