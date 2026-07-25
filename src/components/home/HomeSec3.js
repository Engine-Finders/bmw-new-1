"use client";

import Image from "next/image";
import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  book: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z" />,
  trophy: <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8" />,
  stethoscope: <path d="M6 4v6a4 4 0 0 0 8 0V4M4 4h4m4 0h4m-3 10a5 5 0 0 0 10 0v-1m-3-2a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />,
  car: <path d="M5 13 7 7h10l2 6M4 13h16v6H4v-6Zm2 0V9m12 4V9M7 17h.01M17 17h.01" />,
  clipboard: <path d="M9 4h6l1 2h3v15H5V6h3l1-2Zm1 7h4m-4 4h6m-6 4h5" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  gear: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />,
  users: <path d="M16 21v-2a4 4 0 0 0-8 0v2m12 0v-2.5a3.5 3.5 0 0 0-3-3.45M4 21v-2.5a3.5 3.5 0 0 1 3-3.45M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-1a3 3 0 1 0 0-6M6 10a3 3 0 1 1 0-6" />,
  engine: <path d="M3 13h2v-3h4V7H7V5h8v2h-2v3h3l2 2h3v7h-3l-2 2H7v-3H5v-3H3v-2Zm6-1v7h6.2l1.8-2h2v-3h-2l-1.8-2H9Z" />,
  drop: <path d="M12 3s7 7.1 7 12a7 7 0 0 1-14 0c0-4.9 7-12 7-12Z" />,
  thermometer: <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0ZM5 14h3m-3-4h3" />,
  disc: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6.4-2.4-4.3 4.3M5.6 17.4l4.3-4.3M6.6 5.6l4.3 4.3M17.4 18.4l-4.3-4.3" />,
  turbo: <path d="M4 13a6 6 0 0 1 6-6h5v4h3a3 3 0 0 1 0 6h-4a5 5 0 0 1-5 4H5l2.8-3.2A6 6 0 0 1 4 13Zm6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />,
  battery: <path d="M6 7V5m8 2V5M4 7h14v12H4V7Zm14 4h2v4h-2M8 13h6m-3-3v6" />,
  sparkplug: <path d="m14 3 4 4-3 3 2 2-5 5-2-2-4 4-2-2 4-4-2-2 5-5 2 2 3-3-2-2Z" />,
  exhaust: <path d="M4 15c3 0 3-4 6-4h5v5h-5c-3 0-3 4-6 4m11-6h3a3 3 0 0 0 0-6h-2m-4 3c-1-3-3-5-7-5" />,
  bolt: <path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />,
  question: <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.3-1.7 2.7M12 17h.01" />,
};

function Icon({ name, className = "h-7 w-7" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.question}
    </svg>
  );
}

function ChevronIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function TrustStrip({ items, isDark }) {
  return (
    <ul
      className={`grid grid-cols-4 overflow-hidden rounded-[0.7rem] border shadow-[0_14px_34px_rgba(10,26,43,0.12)] backdrop-blur lg:max-w-[880px] ${
        isDark ? "border-[#1f3c57] bg-[rgba(7,23,36,0.82)]" : "border-[#d7dde6] bg-white/95"
      }`}
    >
      {items.map((item) => (
        <li
          key={`${item.value}-${item.text}`}
          className={`flex min-w-0 flex-col items-center justify-start gap-2 border-r px-1.5 py-4 text-center last:border-r-0 lg:flex-row lg:justify-center lg:gap-4 lg:px-6 lg:py-4 lg:text-left ${
            isDark ? "border-[#29445e]" : "border-[#d7dde6]"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--color-primary)] lg:h-10 lg:w-10">
            <Icon name={item.icon} className="h-8 w-8 lg:h-9 lg:w-9" />
          </span>
          <span className={`min-w-0 ${isDark ? "text-white" : "text-[#071827]"}`}>
            {item.label ? <span className="block text-[0.72rem] leading-tight lg:inline lg:text-[0.9rem]">{item.label} </span> : null}
            <strong className="block text-[0.96rem] leading-tight lg:inline lg:text-[1rem]">{item.value}</strong>
            <span className={`block text-[0.7rem] leading-[1.25] lg:text-[0.82rem] ${isDark ? "text-white/78" : "text-[#27384a]"}`}>{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function HowStep({ step, isDark }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-lg border px-3 py-3 shadow-[0_8px_24px_rgba(10,26,43,0.05)] lg:gap-4 lg:px-4 lg:py-4 ${
        isDark ? "border-[#223a51] bg-[rgba(12,32,48,0.72)]" : "border-[#d7dde6] bg-white"
      }`}
    >
      <span className="flex h-15 w-15 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
        <Icon name={step.icon} className="h-9 w-9" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.95rem] font-bold leading-tight text-[var(--color-primary)]">Step {step.step}</p>
        <p className={`mt-1 text-[0.78rem] font-bold leading-tight lg:text-[0.9rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{step.title}</p>
        <p className={`mt-1 text-[0.68rem] leading-[1.42] lg:text-[0.78rem] ${isDark ? "text-white/76" : "text-[#27384a]"}`}>{step.text}</p>
      </div>
      <span className={`shrink-0 ${isDark ? "text-white" : "text-[#071827]"}`}>
        <ChevronIcon />
      </span>
    </li>
  );
}

function SymptomTile({ symptom, index, total, isDark }) {
  const isLast = index === total - 1;

  return (
    <Link
      href={symptom.href}
      className={`flex min-h-[84px] items-center rounded-lg border text-center transition hover:border-[var(--color-primary)] md:min-h-[126px] ${
        isDark ? "border-[#244159] bg-[rgba(13,33,49,0.74)] text-white hover:bg-[rgba(20,46,68,0.84)]" : "border-[#d7dde6] bg-white text-[#071827] hover:bg-[#f4f7fb]"
      } ${
        isLast ? "col-span-3 justify-between px-8 py-3 md:col-span-1 md:flex-col md:justify-center md:px-3 md:py-4" : "flex-col justify-center px-3 py-4"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center text-[var(--color-primary)] md:h-12 md:w-12">
        <Icon name={symptom.icon} className="h-9 w-9 md:h-10 md:w-10" />
      </span>
      <span className={`${isLast ? "flex-1 md:flex-none" : ""} text-[0.7rem] font-medium leading-[1.22] md:text-[0.9rem]`}>{symptom.label}</span>
      <span className={isDark ? "text-white" : "text-[#071827]"}>
        <ChevronIcon className="h-4 w-4" />
      </span>
    </Link>
  );
}

function TrustSignal({ signal, isDark }) {
  return (
    <li
      className={`flex items-center gap-3 border-b px-3 py-3 last:border-b-0 lg:gap-4 lg:rounded-lg lg:border lg:px-4 lg:py-4 ${
        isDark ? "border-[#223a51] bg-[rgba(12,32,48,0.72)]" : "border-[#d7dde6] lg:bg-white"
      }`}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white lg:h-16 lg:w-16">
        <Icon name={signal.icon} className="h-8 w-8 lg:h-9 lg:w-9" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-[0.78rem] font-bold leading-tight lg:text-[0.9rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{signal.title}</p>
        <p className={`mt-1 text-[0.68rem] leading-[1.35] lg:text-[0.78rem] ${isDark ? "text-white/76" : "text-[#27384a]"}`}>{signal.text}</p>
      </div>
      <span className={`${isDark ? "text-white" : "text-[#071827]"} lg:hidden`}>
        <ChevronIcon />
      </span>
    </li>
  );
}

export default function HomeSec3({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const heroImage = isDark ? data.heroImages.dark : data.heroImages.light;

  return (
    <section className={`relative overflow-hidden ${isDark ? "bg-[#02070b]" : "bg-white"} px-2 py-0 lg:py-8`}>
      <div className="relative mx-auto w-full max-w-8xl">
        <div className="relative min-h-[515px] overflow-hidden lg:min-h-[360px]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            className="object-cover object-[62%_center] lg:object-center"
            sizes="100vw"
            priority
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-[linear-gradient(90deg,rgba(2,7,11,0.98)_0%,rgba(2,7,11,0.84)_36%,rgba(2,7,11,0.28)_78%)] lg:bg-[linear-gradient(90deg,rgba(2,7,11,0.92)_0%,rgba(2,7,11,0.6)_34%,rgba(2,7,11,0.1)_72%)]"
                : "bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.86)_40%,rgba(255,255,255,0.1)_78%)]"
            }`}
          />
          <div className={`absolute inset-x-0 bottom-0 h-32 ${isDark ? "bg-[linear-gradient(0deg,#02070b_0%,transparent_100%)]" : "bg-[linear-gradient(0deg,white_0%,transparent_100%)]"}`} />

          <div className="relative z-10 max-w-[660px] px-0 pb-40 pt-9 lg:px-0 lg:pb-24 lg:pt-10">
            <h2 className={`text-[2.45rem] font-bold leading-[0.96] tracking-normal md:text-[3.1rem] lg:text-[3.95rem] ${isDark ? "text-white" : "text-[var(--color-text)]"}`}>
              Diagnose Your <span className="block text-[var(--color-primary)]">BMW</span> Engine Problem
            </h2>
            <div className="mt-4">
              <MStripe />
            </div>
            <p className={`mt-4 max-w-[560px] text-[0.86rem] leading-[1.45] md:text-[1.02rem] lg:mt-5 lg:text-[1.05rem] ${isDark ? "text-white/88" : "text-[var(--color-text-muted)]"}`}>{data.subHeadline}</p>
          </div>

          <div className="absolute inset-x-0 bottom-5 z-20 px-0 lg:bottom-0 lg:px-0">
            <TrustStrip items={data.trustStrip} isDark={isDark} />
          </div>
        </div>

        <div className="relative z-10 mt-4 grid gap-3 md:grid-cols-[minmax(245px,0.82fr)_minmax(360px,1.18fr)] lg:mt-7 lg:grid-cols-[minmax(270px,0.92fr)_minmax(520px,1.85fr)_minmax(270px,0.92fr)] lg:items-stretch lg:gap-4">
          <aside
            className={`rounded-xl border p-4 shadow-[0_12px_34px_rgba(10,26,43,0.08)] lg:rounded-lg lg:p-5 ${
              isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.88)]" : "border-[#d7dde6] bg-white"
            }`}
          >
            <h3 className="text-[0.86rem] font-bold uppercase text-[var(--color-primary)] lg:text-[1rem]">How It Works</h3>
            <ul className="mt-4 grid gap-4">
              {data.howItWorks.steps.map((step) => (
                <HowStep key={step.step} step={step} isDark={isDark} />
              ))}
            </ul>
          </aside>

          <div
            className={`rounded-xl border p-4 shadow-[0_12px_34px_rgba(10,26,43,0.08)] lg:rounded-lg lg:p-6 ${
              isDark ? "border-[rgba(7,95,216,0.78)] bg-[rgba(7,23,36,0.9)]" : "border-[rgba(7,95,216,0.28)] bg-white"
            }`}
          >
            <p className="text-[0.86rem] font-bold uppercase text-[var(--color-primary)] lg:text-[1rem]">{data.calculator.stepLabel}</p>
            <p className={`mt-2 text-[1.3rem] font-bold leading-tight lg:mt-3 lg:text-[1.8rem] ${isDark ? "text-white" : "text-[#071827]"}`}>{data.calculator.title}</p>
            <p className={`mt-2 max-w-[560px] text-[0.78rem] leading-[1.35] lg:text-[0.95rem] ${isDark ? "text-white/78" : "text-[#27384a]"}`}>{data.calculator.instruction}</p>

            <div className="mt-5 grid grid-cols-3 gap-2 lg:grid-cols-5">
              {data.calculator.symptoms.map((symptom, index) => (
                <SymptomTile key={symptom.label} symptom={symptom} index={index} total={data.calculator.symptoms.length} isDark={isDark} />
              ))}
            </div>

            <Link href={data.calculator.cta.href} className="mt-5 flex items-center justify-center gap-8 rounded-md bg-[var(--color-primary)] px-5 py-4 text-[1rem] font-bold text-white shadow-[0_10px_22px_rgba(7,95,216,0.28)]">
              <span>{data.calculator.cta.label}</span>
              <ArrowIcon />
            </Link>
          </div>

          <aside
            className={`rounded-xl border p-4 shadow-[0_12px_34px_rgba(10,26,43,0.08)] md:col-span-2 lg:col-span-1 lg:rounded-lg lg:p-5 ${
              isDark ? "border-[#223a51] bg-[rgba(7,23,36,0.88)]" : "border-[#d7dde6] bg-white"
            }`}
          >
            <h3 className="text-[0.86rem] font-bold uppercase text-[var(--color-primary)] lg:text-[1rem]">Why Trust This Diagnosis?</h3>
            <ul className={`mt-4 overflow-hidden rounded-lg border lg:grid lg:gap-3 lg:border-0 ${isDark ? "border-[#223a51]" : "border-[#d7dde6]"}`}>
              {data.whyTrust.signals.map((signal) => (
                <TrustSignal key={signal.title} signal={signal} isDark={isDark} />
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
