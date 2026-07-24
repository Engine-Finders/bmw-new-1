"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const verdictStyles = {
  warning: {
    badge: "bg-[#fff6eb] text-[#d97517] border-[#f7dfc2]",
    iconBg: "bg-[#fff1de] text-[#ec8b1f]",
    darkBadge: "bg-[rgba(236,139,31,0.14)] text-[#ffb05a] border-[rgba(236,139,31,0.34)]",
    darkIconBg: "bg-[rgba(236,139,31,0.18)] text-[#ffb05a]",
  },
  success: {
    badge: "bg-[#eefaf3] text-[#13884a] border-[#d3efde]",
    iconBg: "bg-[#e4f6eb] text-[#189454]",
    darkBadge: "bg-[rgba(24,148,84,0.16)] text-[#67d99a] border-[rgba(24,148,84,0.34)]",
    darkIconBg: "bg-[rgba(24,148,84,0.2)] text-[#67d99a]",
  },
  trophy: {
    badge: "bg-[#edf3ff] text-[#1f57d4] border-[#d4e1ff]",
    iconBg: "bg-[#e6efff] text-[#215be0]",
    darkBadge: "bg-[rgba(36,132,255,0.16)] text-[#7fb2ff] border-[rgba(36,132,255,0.34)]",
    darkIconBg: "bg-[rgba(36,132,255,0.2)] text-[#7fb2ff]",
  },
  diamond: {
    badge: "bg-[#f5efff] text-[#6d44d7] border-[#e4d8ff]",
    iconBg: "bg-[#efe7ff] text-[#6d44d7]",
    darkBadge: "bg-[rgba(141,105,230,0.16)] text-[#b69cff] border-[rgba(141,105,230,0.34)]",
    darkIconBg: "bg-[rgba(141,105,230,0.2)] text-[#b69cff]",
  },
  danger: {
    badge: "bg-[#fff0f0] text-[#db2e2e] border-[#ffd4d4]",
    iconBg: "bg-[#ffe7e7] text-[#e03232]",
    darkBadge: "bg-[rgba(255,45,53,0.15)] text-[#ff8b90] border-[rgba(255,45,53,0.34)]",
    darkIconBg: "bg-[rgba(255,45,53,0.2)] text-[#ff8b90]",
  },
  crown: {
    badge: "bg-[#fff5ea] text-[#da7a12] border-[#ffe1bc]",
    iconBg: "bg-[#fff0da] text-[#da7a12]",
    darkBadge: "bg-[rgba(218,122,18,0.15)] text-[#ffb66a] border-[rgba(218,122,18,0.34)]",
    darkIconBg: "bg-[rgba(218,122,18,0.2)] text-[#ffb66a]",
  },
  fire: {
    badge: "bg-[#fff5ec] text-[#f06d11] border-[#ffe1c5]",
    iconBg: "bg-[#ffedd8] text-[#f06d11]",
    darkBadge: "bg-[rgba(240,109,17,0.15)] text-[#ffad6c] border-[rgba(240,109,17,0.34)]",
    darkIconBg: "bg-[rgba(240,109,17,0.2)] text-[#ffad6c]",
  },
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3 7 7-7 11L5 10l7-7Z" />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3s1 2.5 1 4.5S11 11 11 11s.3-3-1.5-5.5C7.2 8 6 10 6 13a6 6 0 0 0 12 0c0-3.2-1.8-5.7-4.5-8.2.1 1.7-.2 3.1-1.5 4.7" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 8 4 3 5-6 5 6 4-3-2 10H5L3 8Zm4 11h10" />
    </svg>
  );
}

function DotIcon() {
  return <span aria-hidden="true" className="h-3 w-3 rounded-full bg-current" />;
}

function VerdictIcon({ type }) {
  switch (type) {
    case "warning":
      return <WarningIcon />;
    case "success":
      return <CheckIcon />;
    case "trophy":
      return <TrophyIcon />;
    case "diamond":
      return <DiamondIcon />;
    case "danger":
      return <DotIcon />;
    case "crown":
      return <CrownIcon />;
    case "fire":
      return <FireIcon />;
    default:
      return <CheckIcon />;
  }
}

function formatVerdictText(text) {
  return text
    .replace(/âœ…/g, "")
    .replace(/âš ï¸/g, "")
    .replace(/ðŸ†/g, "")
    .replace(/ðŸ’Ž/g, "")
    .replace(/ðŸ”´/g, "")
    .replace(/ðŸ‘‘/g, "")
    .replace(/ðŸ”¥/g, "")
    .replace(/\s+\/\s+/g, " / ")
    .trim();
}

function splitMobileFilters(filters) {
  return filters.map((filter) => {
    if (filter.label === "Z / i / CLASSIC") {
      return { ...filter, label: "ELECTRIC" };
    }

    if (filter.label === "M CARS") {
      return { ...filter, label: "M MODELS" };
    }

    return filter;
  });
}

function VerdictBadge({ verdict, mobile = false }) {
  const { theme } = useTheme();
  const style = verdictStyles[verdict.type] || verdictStyles.success;
  const text = formatVerdictText(verdict.text);
  const badgeClass = theme === "dark" ? style.darkBadge : style.badge;
  const iconClass = theme === "dark" ? style.darkIconBg : style.iconBg;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left ${badgeClass} ${
        mobile ? "text-[0.74rem] font-medium leading-[1.15] px-2.5 py-1.5" : "text-[0.82rem] font-medium leading-[1.2]"
      }`}
    >
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
        <VerdictIcon type={verdict.type} />
      </span>
      <span>{text}</span>
    </span>
  );
}

function DesktopHeader({ columns }) {
  return (
    <div className="grid grid-cols-[190px_minmax(0,1fr)_185px_28px] items-center rounded-t-[1.2rem] bg-[var(--color-primary)] px-5 py-3 text-[0.98rem] font-semibold text-white">
      <span>{columns[0]}</span>
      <span>{columns[1]}</span>
      <span>{columns[2]}</span>
      <span />
    </div>
  );
}

function DesktopRow({ item }) {
  return (
    <Link
      href={item.href}
      className="grid grid-cols-[190px_minmax(0,1fr)_185px_28px] items-center gap-3 border-b border-[var(--color-border)] px-5 py-3 text-[var(--color-text)] transition hover:bg-[var(--color-page-soft)] last:border-b-0"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded">
          <Image src={item.image.src} alt={item.image.alt} fill className="object-cover" sizes="80px" />
        </div>
        <span className="text-[1rem] font-semibold">{item.model}</span>
      </div>
      <span className="pr-3 text-[0.96rem] leading-[1.28] text-[var(--color-text-muted)]">{item.generations}</span>
      <VerdictBadge verdict={item.verdict} />
      <span className="flex justify-end text-[var(--color-text)]">
        <ChevronIcon />
      </span>
    </Link>
  );
}

function MobileRow({ item }) {
  return (
    <Link
      href={item.href}
      className="grid grid-cols-[72px_minmax(0,1fr)_126px_16px] items-center gap-2.5 border-b border-[var(--color-border)] px-3 py-2.5 text-[var(--color-text)] last:border-b-0"
    >
      <div className="relative h-11 w-16 overflow-hidden rounded">
        <Image src={item.image.src} alt={item.image.alt} fill className="object-cover" sizes="64px" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.9rem] font-semibold leading-tight">{item.model}</p>
        <p className="mt-0.5 text-[0.78rem] leading-[1.25] text-[var(--color-text-muted)]">{item.generations}</p>
      </div>
      <div className="flex justify-start">
        <VerdictBadge verdict={item.verdict} mobile />
      </div>
      <span className="flex justify-end text-[var(--color-text)]">
        <ChevronIcon />
      </span>
    </Link>
  );
}

export default function HomeSec2({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mid = Math.ceil(data.models.length / 2);
  const left = data.models.slice(0, mid);
  const right = data.models.slice(mid);
  const mobileRows = left.slice(0, 8);
  const mobileFilters = splitMobileFilters(data.filters);
  const sectionBg = theme === "dark" ? "/Section-2-bg-dark.webp" : "/Section-2-Bg-light.webp";

  return (
    <section className="relative overflow-hidden bg-[var(--color-page)] px-3 py-3 md:px-3 md:py-5">
      <div className="absolute inset-0">
        <Image
          src={sectionBg}
          alt=""
          fill
          className="object-cover object-[top_right]"
          sizes="100vw"
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(180deg,rgba(2,7,11,0.9)_0%,rgba(2,7,11,0.82)_26%,rgba(2,7,11,0.88)_100%)] md:bg-[linear-gradient(180deg,rgba(2,7,11,0.78)_0%,rgba(2,7,11,0.68)_24%,rgba(2,7,11,0.74)_100%)]"
              : "bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.95)_24%,rgba(255,255,255,0.93)_100%)]"
          }`}
        />
      </div>

      <div className="relative mx-auto w-full max-w-8xl">
        <div className="max-w-[560px] pt-2 md:max-w-[700px] md:pt-4">
          <h2 className={`text-[2.4rem] font-bold leading-[0.94] md:text-[3.35rem] ${isDark ? "text-white md:text-[var(--color-text)]" : "text-[var(--color-text)]"}`}>
            Find Your Vehicle
          </h2>
          <div className="mt-3">
            <MStripe />
          </div>
          <p
            className={`mt-3 max-w-[420px] text-[0.9rem] leading-[1.32] md:max-w-[520px] md:text-[1.08rem] md:leading-[1.38] ${
              isDark ? "text-white/84 md:text-[var(--color-text-muted)]" : "text-[var(--color-text-muted)]"
            }`}
          >
            {data.subHeadline}
          </p>
        </div>

        <div className="mt-5 md:hidden">
          <div
            className={`relative overflow-hidden rounded-[1.2rem] border shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur ${
              isDark
                ? "border-white/10 bg-[rgba(10,21,32,0.8)] text-white/60"
                : "border-[var(--color-border)] bg-[rgba(255,255,255,0.86)] text-[var(--color-text-soft)]"
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search model (e.g. 3 Series, X5, M3...)"
                className={`w-full bg-transparent text-[0.86rem] outline-none ${
                  isDark ? "placeholder:text-white/45" : "placeholder:text-[var(--color-text-soft)]"
                }`}
                readOnly
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {mobileFilters.map((filter, index) => (
              <span
                key={filter.value}
                className={`rounded-full border px-4 py-2 text-[0.8rem] font-medium ${
                  index === 0
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : isDark
                      ? "border-white/12 bg-[rgba(10,21,32,0.8)] text-white"
                      : "border-[var(--color-border)] bg-white/90 text-[var(--color-text)]"
                }`}
              >
                {filter.label}
              </span>
            ))}
          </div>

          <div
            className={`mt-5 overflow-hidden rounded-[1.5rem] border shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur ${
              isDark
                ? "border-white/10 bg-[rgba(10,21,32,0.82)]"
                : "border-[var(--color-border)] bg-[rgba(255,255,255,0.88)]"
            }`}
          >
            {mobileRows.map((item) => (
              <MobileRow key={item.model} item={item} />
            ))}

            <Link
              href={data.viewAll.href}
              className="flex items-center justify-center gap-3 px-5 py-3.5 text-[0.9rem] font-medium text-[var(--color-primary)]"
            >
              <span>{data.viewAll.label} ({data.models.length})</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>
          </div>

          <div
            className={`mt-5 rounded-[1.5rem] border p-5 shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur ${
              isDark
                ? "border-white/10 bg-[rgba(10,21,32,0.82)]"
                : "border-[var(--color-border)] bg-[rgba(255,255,255,0.84)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10" />
                </svg>
              </div>
              <div>
                <p className={`text-[0.92rem] font-semibold ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>Unbiased. Data-Driven. Trusted by Thousands.</p>
                <p className={`mt-2 text-[0.82rem] leading-[1.35] ${isDark ? "text-white/78" : "text-[var(--color-text-muted)]"}`}>
                  Independent reliability data and real ownership insights so you can make the right decision with confidence.
                </p>
              </div>
            </div>
            <Link
              href={data.cta.href}
              className="mt-5 flex items-center justify-center gap-4 rounded-[1rem] bg-[var(--color-primary)] px-6 py-3.5 text-[0.92rem] font-semibold text-white"
            >
              <span>{data.cta.buttonLabel}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-6 hidden md:block">
          <div className="grid gap-3 md:grid-cols-2">
            {[left, right].map((column, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur"
              >
                <DesktopHeader columns={data.columns} />
                {column.map((item) => (
                  <DesktopRow key={item.model} item={item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
