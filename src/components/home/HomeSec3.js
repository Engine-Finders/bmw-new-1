"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import BrandIcon, { hasBrandIcon } from "@/components/home/brandIcon";
import Sec3Icon, { hasSec3Icon } from "@/components/home/Sec3Icons";

const iconPaths = {
  chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7H3" />,
  engine: <path d="M3 13h2v-3h4V7H7V5h8v2h-2v3h3l2 2h3v7h-3l-2 2H7v-3H5v-3H3v-2Zm6-1v7h6.2l1.8-2h2v-3h-2l-1.8-2H9Z" />,
  gear: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />,
  shield: <path d="M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.5 1.5L15 10" />,
  shortcut: <path d="M9 12h6M9 8h6m-6 8h3M5 4h14v16H5V4Zm12 2H7v12h10V6Z" />,
  car: <path d="M5 13 7 7h10l2 6M4 13h16v6H4v-6Zm2 0V9m12 4V9M7 17h.01M17 17h.01" />,
  clipboard: <path d="M9 4h6l1 2h3v15H5V6h3l1-2Zm1 7h4m-4 4h6m-6 4h5" />,
  thermometer: <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0ZM5 14h3m-3-4h3" />,
  disc: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6.4-2.4-4.3 4.3M5.6 17.4l4.3-4.3M6.6 5.6l4.3 4.3M17.4 18.4l-4.3-4.3" />,
  drop: <path d="M12 3s7 7.1 7 12a7 7 0 0 1-14 0c0-4.9 7-12 7-12Z" />,
  bolt: <path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />,
  smoke: <path d="M7 17c0-2 1.2-3.1 2.6-4.2C11 11.6 12 10.7 12 9.2A2.9 2.9 0 0 0 9.1 6c-1.2 0-2.2.6-3 1.8M14 18c0-1.5.8-2.4 2-3.4 1.2-.9 2-1.8 2-3.2A2.4 2.4 0 0 0 15.6 9c-.8 0-1.5.3-2.1 1M5 21c0-1.3.7-2.2 1.7-3M11 21c0-1.3.8-2.2 1.8-3M17 21c0-1.3.8-2.2 1.8-3" />,
  fuel: <path d="M6 5h7v14H6V5Zm7 2h2l3 3v7a2 2 0 0 1-2 2h-1m-7-6h3" />,
  flame: <path d="M12 3s1 2.5 1 4.5S11 11 11 11s.3-3-1.5-5.5C7.2 8 6 10 6 13a6 6 0 0 0 12 0c0-3.2-1.8-5.7-4.5-8.2.1 1.7-.2 3.1-1.5 4.7" />,
  refresh: <path d="M20 6v5h-5M4 18v-5h5M18.2 9A7 7 0 0 0 6.7 6.7L4 9m2 6a7 7 0 0 0 11.3 2.3L20 15" />,
  exhaust: <path d="M4 15c3 0 3-4 6-4h5v5h-5c-3 0-3 4-6 4m11-6h3a3 3 0 0 0 0-6h-2m-4 3c-1-3-3-5-7-5" />,
  steering: <path d="M12 6a6 6 0 1 0 6 6m-6-6v6m0-6A6 6 0 0 0 6 12m6 0h6m-6 0-4.5 4.5M12 12l4.5 4.5" />,
  warning: <path d="M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z" />,
  wrench: <path d="m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z" />,
  question: <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.3-1.7 2.7M12 17h.01" />,
  users: <path d="M16 21v-2a4 4 0 0 0-8 0v2m12 0v-2.5a3.5 3.5 0 0 0-3-3.45M4 21v-2.5a3.5 3.5 0 0 1 3-3.45M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-1a3 3 0 1 0 0-6M6 10a3 3 0 1 1 0-6" />
};

const severityMeta = {
  catastrophic: {
    label: "Catastrophic",
    shortLabel: "STOP",
    badge: "border-[#f7c8cc] bg-[#fff0f1] text-[#c42430]",
    darkBadge: "border-[rgba(255,90,100,0.34)] bg-[rgba(255,45,53,0.14)] text-[#ff9aa0]",
    panel: "border-[#ef939b] bg-[#fff3f4]",
    darkPanel: "border-[rgba(255,90,100,0.34)] bg-[rgba(55,10,15,0.88)]",
    icon: "warning"
  },
  immediate: {
    label: "Immediate",
    shortLabel: "RECOVER",
    badge: "border-[#f5d4ad] bg-[#fff6ea] text-[#d97810]",
    darkBadge: "border-[rgba(246,161,73,0.34)] bg-[rgba(246,161,73,0.14)] text-[#ffba6c]",
    panel: "border-[#f0c58a] bg-[#fff7ed]",
    darkPanel: "border-[rgba(246,161,73,0.34)] bg-[rgba(56,28,4,0.88)]",
    icon: "thermometer"
  },
  monitor: {
    label: "Monitor",
    shortLabel: "WATCH",
    badge: "border-[#ecd7a7] bg-[#fff9ea] text-[#9c6a00]",
    darkBadge: "border-[rgba(222,177,65,0.34)] bg-[rgba(222,177,65,0.13)] text-[#ffd473]",
    panel: "border-[#e7d39d] bg-[#fffdf1]",
    darkPanel: "border-[rgba(222,177,65,0.34)] bg-[rgba(50,40,8,0.88)]",
    icon: "disc"
  },
  low: {
    label: "Low Risk",
    shortLabel: "REPAIR",
    badge: "border-[#cce7d7] bg-[#eefaf3] text-[#17824f]",
    darkBadge: "border-[rgba(77,198,124,0.34)] bg-[rgba(24,148,84,0.13)] text-[#74d7a1]",
    panel: "border-[#cde8d7] bg-[#f4fdf7]",
    darkPanel: "border-[rgba(77,198,124,0.34)] bg-[rgba(8,43,25,0.88)]",
    icon: "shield"
  }
};

const verdictMeta = {
  repair: {
    title: "Repair it",
    text: "Repair cost is proportionate to the car's value and the selected engine route does not improve the maths enough to justify replacement.",
    badge: "border-[#cce7d7] bg-[#eefaf3] text-[#17824f]",
    darkBadge: "border-[rgba(77,198,124,0.34)] bg-[rgba(24,148,84,0.13)] text-[#74d7a1]"
  },
  replace: {
    title: "Replace the engine",
    text: "Replacement looks commercially stronger than major repair on the numbers provided, especially given this diagnosis risk profile.",
    badge: "border-[#d4e3fb] bg-[#eff6ff] text-[#0d59cc]",
    darkBadge: "border-[rgba(79,146,255,0.34)] bg-[rgba(11,103,220,0.14)] text-[#8bb8ff]"
  },
  exit: {
    title: "Proceed carefully or walk away",
    text: "The projected spend is too close to the car's value. This is where the specialist inspection decides whether the car is still worth saving.",
    badge: "border-[#f5d4ad] bg-[#fff6ea] text-[#d97810]",
    darkBadge: "border-[rgba(246,161,73,0.34)] bg-[rgba(246,161,73,0.14)] text-[#ffba6c]"
  }
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 1.9 }) {
  // The client's icon artwork where it has one; arrows and chevrons stay as line icons.
  if (hasSec3Icon(name)) return <Sec3Icon name={name} className={className} />;
  if (hasBrandIcon(name)) return <BrandIcon name={name} className={className} scale={1} />;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name] || iconPaths.question}
    </svg>
  );
}

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function fmtCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(value);
}

function formatStepValue(value) {
  if (value >= 1000) {
    return `GBP${value / 1000}k`;
  }

  return `GBP${value}`;
}

function averageRange(range) {
  return (range.low + range.high) / 2;
}

function getReplacementRange(diagnosis, engineOptions, selectedEngine) {
  const option = engineOptions.find((item) => item.id === selectedEngine) || engineOptions[0];

  return {
    low: Math.round(diagnosis.replacementBase.low * option.multiplier),
    high: Math.round(diagnosis.replacementBase.high * option.multiplier)
  };
}

function getMainDealerRange(range, multiplier) {
  return {
    low: Math.round(range.low * multiplier),
    high: Math.round(range.high * multiplier)
  };
}

function getVerdict(diagnosis, carValue, selectedEngine, ageId, engineOptions) {
  const replacement = getReplacementRange(diagnosis, engineOptions, selectedEngine);
  const repairMid = averageRange(diagnosis.repairCost);
  const replacementMid = averageRange(replacement);
  const repairPct = carValue ? repairMid / carValue : 0;
  const replacePct = carValue ? replacementMid / carValue : 0;
  const ageAdjustments = {
    under5: 0.1,
    "5to10": 0.04,
    "10to15": 0,
    over15: -0.08
  };
  const ageAdjustment = ageAdjustments[ageId] || 0;
  const replaceThreshold = 0.68 + ageAdjustment;
  const repairThreshold = 0.3 + ageAdjustment / 2;
  let decision = "exit";

  if (diagnosis.severity === "catastrophic" || diagnosis.severity === "immediate") {
    if (repairPct <= 0.22) {
      decision = "repair";
    } else if (replacePct <= replaceThreshold) {
      decision = "replace";
    }
  } else if (repairPct <= repairThreshold || (diagnosis.severity === "low" && repairPct <= 0.45 + ageAdjustment / 2)) {
    decision = "repair";
  } else if (replacePct <= replaceThreshold) {
    decision = "replace";
  }

  return {
    decision,
    repairMid,
    replacement,
    replacementMid,
    replacementPct: Math.round(replacePct * 100),
    repairPct: Math.round(repairPct * 100)
  };
}

function ProgressBar({ percent }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(117,126,140,0.18)]">
      <div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300" style={{ width: `${percent}%` }} />
    </div>
  );
}

function StepIndicator({ labels, stageIndex, isDark }) {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      {labels.map((label, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === stageIndex;
        const done = stepNumber < stageIndex;

        return (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border t-label font-bold ${
                  done || active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : isDark
                      ? "border-[#375067] bg-transparent text-white/64"
                      : "border-[#d7dde6] bg-transparent text-[#607085]"
                }`}
              >
                {done ? "✓" : stepNumber}
              </span>
              <span className={`t-label truncate font-semibold uppercase tracking-[0.04em] ${done || active ? "text-[var(--color-primary)]" : isDark ? "text-white/62" : "text-[#607085]"}`}>
                {label}
              </span>
            </div>
            {index < labels.length - 1 ? <span className={`h-px flex-1 ${done ? "bg-[var(--color-primary)]" : isDark ? "bg-[#375067]" : "bg-[#d7dde6]"}`} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function Chevron({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

// Card surfaces shared by the three columns (reference: white cards on light, navy glass on dark).
function card(isDark) {
  return isDark ? "border-[#1e3350] bg-[rgba(10,18,30,0.92)]" : "border-[#e3e8ef] bg-white";
}
function innerCard(isDark) {
  return isDark ? "border-[#1e3350] bg-[rgba(16,26,42,0.9)]" : "border-[#e8ecf2] bg-white";
}

function TrustStrip({ items, isDark, phone = false }) {
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/78" : "text-[#3b4656]";
  return (
    <ul
      className={`grid grid-cols-4 rounded-[10px] border ${phone ? "px-1 py-3.5" : "py-3"} ${
        isDark ? "border-[#1e3350] bg-[rgba(10,18,30,0.85)]" : "border-[#e6eaf0] bg-white shadow-[0_8px_30px_rgba(10,26,43,0.06)]"
      }`}
    >
      {items.map((item) => (
        <li
          key={item.text}
          className={`relative flex [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:right-0 [&:not(:last-child)]:after:top-1/2 [&:not(:last-child)]:after:h-[60%] [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:-translate-y-1/2 ${
            isDark ? "after:bg-white/12" : "after:bg-[#e3e8ef]"
          } ${phone ? "flex-col items-center gap-1.5 px-1 text-center" : "items-center gap-3 px-4"}`}
        >
          <span className={isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}>
            <Icon name={item.icon} className={phone ? "h-8 w-8" : "h-8 w-8 shrink-0"} />
          </span>
          <span className={phone ? "text-[13px] leading-[1.3]" : "t-label"}>
            <span className={`block ${strong}`}>
              {item.lead ? <span className={phone ? "block" : ""}>{item.lead} </span> : null}
              {item.value ? <strong className={`font-semibold ${phone ? "block text-[15px]" : "text-[16px]"}`}>{item.value}</strong> : null}
              {item.tail ? <span className={phone ? "block" : ""}> {item.tail}</span> : null}
            </span>
            <span className={`block ${soft}`}>{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function HowItWorks({ data, isDark, numbered = false }) {
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/75" : "text-[#3b4656]";
  return (
    <div className={`flex h-full flex-col rounded-[10px] border p-4 ${card(isDark)}`}>
      <h3 className={`t-label px-1 pt-1 font-semibold uppercase tracking-[0.02em] ${isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}`}>
        {data.title}
      </h3>
      {/* Desktop: the step cards share the column height, so no empty block is left under them. */}
      <ul className={`mt-3 grid flex-1 ${numbered ? "gap-0" : "auto-rows-fr gap-2.5"}`}>
        {data.steps.map((step, i) =>
          numbered ? (
            <li key={step.step} className="relative grid grid-cols-[32px_46px_minmax(0,1fr)_16px] items-center gap-3 py-3">
              {i < data.steps.length - 1 ? <span className={`absolute left-[15px] top-[50%] h-full w-px ${isDark ? "bg-white/15" : "bg-[#dfe5ee]"}`} /> : null}
              <span className="relative flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#0b47a8] t-body font-semibold text-white">{step.step}</span>
              <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[6px] bg-[#0b4fc0] text-white">
                <Icon name={step.icon} className="h-7 w-7" />
              </span>
              <span className={`${i < data.steps.length - 1 ? `border-b pb-3 ${isDark ? "border-white/10" : "border-[#e6eaf0]"}` : ""}`}>
                <span className={`block text-[17px] font-semibold leading-[1.3] ${strong}`}>{step.title}</span>
                <span className={`t-body mt-1 block ${soft}`}>{step.text}</span>
              </span>
              <Chevron className={`h-4 w-4 ${strong}`} />
            </li>
          ) : (
            <li key={step.step} className={`relative flex flex-col rounded-[8px] border px-4 py-3.5 ${innerCard(isDark)}`}>
              <span className="flex items-center gap-3 pr-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[#0b4fc0] text-white">
                  <Icon name={step.icon} className="h-[22px] w-[22px]" />
                </span>
                <span className="min-w-0">
                  <span className={`t-label block font-medium ${isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}`}>Step {step.step}</span>
                  <span className={`t-h6 block ${strong}`}>{step.title}</span>
                </span>
              </span>
              <Chevron className={`absolute right-3 top-4 h-4 w-4 ${strong}`} />
              <span className={`t-body mt-2 block ${soft}`}>{step.text}</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

function WhyTrust({ title, items, isDark, phone = false }) {
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/75" : "text-[#3b4656]";
  const heading = `t-label px-1 pt-1 font-semibold uppercase tracking-[0.02em] ${isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}`;
  if (phone) {
    return (
      <div className={`rounded-[10px] border p-4 ${card(isDark)}`}>
        <h3 className={heading}>{title}</h3>
        <ul className="mt-2">
          {items.map((item) => (
            <li key={item.title} className={`border-b py-3.5 last:border-b-0 ${isDark ? "border-white/10" : "border-[#e6eaf0]"}`}>
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0b4fc0] text-white">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <span className={`flex-1 text-[17px] font-semibold leading-[1.3] ${strong}`}>{item.title}</span>
                <Chevron className={`h-4 w-4 ${strong}`} />
              </span>
              <span className={`t-body mt-2 block ${soft}`}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className={`flex h-full flex-col rounded-[10px] border p-4 ${card(isDark)}`}>
      <h3 className={heading}>{title}</h3>
      <ul className="mt-3 grid gap-2.5">
        {items.map((item) => (
          <li key={item.title} className={`relative flex flex-col rounded-[8px] border px-4 py-3.5 ${innerCard(isDark)}`}>
            <span className="flex items-center gap-3 pr-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b4fc0] text-white">
                <Icon name={item.icon} className="h-[22px] w-[22px]" />
              </span>
              <span className={`t-h6 ${strong}`}>{item.title}</span>
            </span>
            <Chevron className={`absolute right-3 top-4 h-4 w-4 ${strong}`} />
            <span className={`t-body mt-2 block ${soft}`}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SymptomTiles({ tiles, selectedId, onSelect, isDark, phone = false }) {
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const tone = (active) =>
    active
      ? "border-[#0b4fc0] bg-[#eef3fb] ring-1 ring-[#0b4fc0]"
      : isDark
        ? "border-[#1e3350] bg-[rgba(16,26,42,0.9)] hover:border-[#3b82f6]"
        : "border-[#e8ecf2] bg-white hover:border-[#0b4fc0]";
  if (!phone) {
    // Desktop: two columns of compact options (icon left, label right) so every label fits at 15px.
    return (
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile) => {
          const active = selectedId === tile.id;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => onSelect(tile.id)}
              className={`flex min-w-0 items-center gap-3 rounded-[6px] border px-3 py-2.5 text-left transition ${tone(active)}`}
            >
              <span className={`shrink-0 ${isDark && !active ? "text-[#3b82f6]" : "text-[#0b4fc0]"}`}>
                <Icon name={tile.icon} className="h-8 w-8" />
              </span>
              <span className={`t-label min-w-0 flex-1 leading-[1.3] ${active ? "text-[#0b1626]" : strong}`}>{tile.label}</span>
              <Chevron className={`h-4 w-4 shrink-0 ${active ? "text-[#0b1626]" : strong}`} />
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {tiles.map((tile, i) => {
        const active = selectedId === tile.id;
        const lastAlone = i === tiles.length - 1 && tiles.length % 3 === 1;
        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => onSelect(tile.id)}
            className={`flex min-w-0 flex-col items-center rounded-[6px] border px-1.5 pb-3 pt-3.5 text-center transition ${lastAlone ? "col-start-2" : ""} ${tone(active)}`}
          >
            <span className={isDark && !active ? "text-[#3b82f6]" : "text-[#0b4fc0]"}>
              <Icon name={tile.icon} className="h-11 w-11" />
            </span>
            <span className={`mt-2.5 max-w-full text-[14px] leading-[1.35] ${active ? "text-[#0b1626]" : strong}`}>{tile.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ExampleResult({ data, isDark }) {
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/78" : "text-[#3b4656]";
  const blue = isDark ? "text-[#5b9bff]" : "text-[#0b4fc0]";
  return (
    <div className={`rounded-[10px] border p-4 ${isDark ? "border-[#1e3350] bg-[rgba(10,18,30,0.92)]" : "border-[#e3e8ef] bg-[#f4f7fc]"}`}>
      <span className={`inline-block rounded-[4px] px-2.5 py-1.5 t-label font-medium ${isDark ? "bg-white/10 text-[#5b9bff]" : "bg-[#e3ebf8] text-[#0b4fc0]"}`}>{data.label}</span>
      <h3 className={`mt-4 t-h5 ${strong}`}>{data.title}</h3>
      <div className={`mt-4 rounded-[8px] border p-4 ${innerCard(isDark)}`}>
        <p className={`t-body font-medium ${strong}`}>{data.fault}</p>
        <span className="mt-2.5 inline-block rounded-[4px] bg-[#fde2e2] px-2.5 py-1 t-label text-[#c81e1e]">{data.likelihood}</span>
        {data.rows.map(([k, v]) => (
          <p key={k} className={`mt-2.5 t-label ${strong}`}>
            {k} <span className={soft}>{v}</span>
          </p>
        ))}
        <p className={`mt-4 t-label ${strong}`}>{data.repairLabel}</p>
        <p className={`mt-1 t-num ${blue}`}>{data.repair}</p>
        <p className={`mt-3 t-label ${strong}`}>{data.replaceLabel}</p>
        <p className={`mt-1 t-num ${blue}`}>{data.replace}</p>
        <p className={`mt-4 flex items-center gap-2 t-label ${soft}`}>
          <Icon name="shield" className={`h-4 w-4 ${blue}`} />
          {data.basis}
        </p>
      </div>
      <div className={`mt-3.5 flex gap-4 rounded-[8px] p-4 ${isDark ? "bg-white/[0.05]" : "bg-[#e9eff9]"}`}>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#c9d8f1] text-[#0b47a8]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8">
            <path d="M12 2.5 4.5 5.5v6c0 5 3.3 9 7.5 10 4.2-1 7.5-5 7.5-10v-6L12 2.5Z" fill="#0b47a8" />
            <path d="m8.5 12 2.4 2.4L15.8 9.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>
          <span className={`block t-body font-medium ${strong}`}>{data.verdictTitle}</span>
          <span className={`mt-1 block t-label leading-[1.5] ${soft}`}>{data.verdictText}</span>
        </span>
      </div>
      <a href="#diagnose" className="mt-4 flex items-center justify-between rounded-[4px] bg-[#0b47a8] px-6 py-3.5 t-body font-medium text-white">
        {data.cta}
        <ArrowIcon className="h-5 w-5" />
      </a>
      <p className={`mt-3.5 text-center t-label leading-[1.6] ${soft}`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 inline h-3.5 w-3.5 align-[-2px]" fill="currentColor">
          <path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1Zm2 0h6V7a3 3 0 0 0-6 0v3Z" />
        </svg>
        {data.badges[0]} • {data.badges[1]}
        <br />
        {data.badges[2]}
      </p>
    </div>
  );
}

function PromiseCard({ data, isDark }) {
  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/78" : "text-[#3b4656]";
  return (
    <div className={`rounded-[10px] border p-5 ${card(isDark)}`}>
      <div className="flex gap-4">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-11 w-11 shrink-0">
          <path d="m12 1.5 2.6 2 3.2-.3.9 3.1 2.8 1.6-1 3.1 1 3.1-2.8 1.6-.9 3.1-3.2-.3-2.6 2-2.6-2-3.2.3-.9-3.1-2.8-1.6 1-3.1-1-3.1 2.8-1.6.9-3.1 3.2.3 2.6-2Z" fill="#0b47a8" />
          <path d="m8 12.2 2.8 2.8L16.5 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className={`t-body font-medium ${strong}`}>{data.title}</p>
          {data.lines.map((line) => (
            <p key={line} className={`mt-1 t-body leading-[1.5] ${soft}`}>
              {line}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-1" aria-hidden="true">
        {["#1c69d4", "#0b3d91", "#e4262c"].map((c) => (
          <span key={c} className="h-[7px] w-[12px] -skew-x-[30deg]" style={{ backgroundColor: c }} />
        ))}
        <span className={`ml-3 h-[2px] flex-1 ${isDark ? "bg-white/15" : "bg-[#dfe5ee]"}`} />
      </div>
    </div>
  );
}

function ShortcutCard({ diagnosis, isDark, onSelect }) {
  const severity = severityMeta[diagnosis.severity];

  return (
    <button
      type="button"
      onClick={() => onSelect(diagnosis.key)}
      className={`rounded-lg border p-3 text-left transition hover:border-[var(--color-primary)] ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)] hover:bg-[rgba(18,38,56,0.9)]" : "border-[#d7dde6] bg-white hover:bg-[#f8fbff]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon name={diagnosis.icon} className="h-5 w-5" />
        </span>
        <span className={`rounded-full border px-2 py-1 t-label font-bold uppercase tracking-[0.04em] ${isDark ? severity.darkBadge : severity.badge}`}>
          {severity.shortLabel}
        </span>
      </div>
      <p className={`mt-3 t-label font-semibold leading-tight ${isDark ? "text-white" : "text-[#071827]"}`}>{diagnosis.shortcutLabel}</p>
      <p className={`mt-1 t-label leading-[1.4] ${isDark ? "text-white/68" : "text-[#27384a]"}`}>{diagnosis.evidenceLabel}</p>
    </button>
  );
}

function CategoryCard({ category, selected, isDark, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className={`rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : isDark
            ? "border-[#223343] bg-[rgba(14,28,41,0.84)] hover:border-[#375067]"
            : "border-[#d7dde6] bg-white hover:border-[var(--color-primary)]"
      }`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${selected ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"}`}>
        <Icon name={category.icon} className="h-5 w-5" />
      </span>
      <p className={`mt-3 t-body font-semibold leading-tight ${selected ? "text-[#071827]" : isDark ? "text-white" : "text-[#071827]"}`}>{category.label}</p>
      <p className={`mt-1 t-label leading-[1.35] ${selected ? "text-[#27384a]" : isDark ? "text-white/72" : "text-[#27384a]"}`}>{category.description}</p>
    </button>
  );
}

function AnswerButton({ answer, isDark, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(answer.diagnosisKey)}
      className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-4 text-left transition ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)] text-white hover:border-[#375067]" : "border-[#d7dde6] bg-white text-[#071827] hover:border-[var(--color-primary)] hover:bg-[#f8fbff]"}`}
    >
      <span className="t-label leading-[1.4]">{answer.label}</span>
      <span className="shrink-0 text-[var(--color-primary)]">
        <ArrowIcon className="h-4 w-4" />
      </span>
    </button>
  );
}

function SeverityBadge({ severity, isDark }) {
  const meta = severityMeta[severity];

  return <span className={`inline-flex rounded-full border px-3 py-1.5 t-label font-bold uppercase tracking-[0.04em] ${isDark ? meta.darkBadge : meta.badge}`}>{meta.label}</span>;
}

function OverridePanel({ diagnosis, isDark, onContinue }) {
  const meta = severityMeta[diagnosis.severity];

  return (
    <div className={`rounded-xl border p-5 md:p-6 ${isDark ? meta.darkPanel : meta.panel}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${isDark ? "bg-[rgba(255,255,255,0.08)] text-white" : "bg-white text-[#071827]"}`}>
          <Icon name={meta.icon} className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <SeverityBadge severity={diagnosis.severity} isDark={isDark} />
          <h3 className={`mt-3 t-h5 ${isDark ? "text-white" : "text-[#071827]"}`}>{diagnosis.overrideCopy.headline}</h3>
          <p className={`mt-3 t-body leading-[1.5] ${isDark ? "text-white/78" : "text-[#27384a]"}`}>{diagnosis.overrideCopy.body}</p>
          <ul className="mt-4 grid gap-2">
            {diagnosis.overrideCopy.actions.map((action) => (
              <li key={action} className={`flex items-start gap-3 t-label leading-[1.45] ${isDark ? "text-white/74" : "text-[#27384a]"}`}>
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                  <Icon name="shield" className="h-3 w-3" strokeWidth={2.3} />
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <button type="button" onClick={onContinue} className="flex items-center justify-center gap-3 rounded-lg bg-[var(--color-primary)] px-5 py-3 t-label font-bold text-white">
              <span>I understand - continue</span>
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostCard({ title, value, note, highlight, isDark }) {
  return (
    <article className={`rounded-lg border p-4 ${highlight ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#d7dde6] bg-white"}`}>
      <p className={`t-label font-bold uppercase tracking-[0.04em] ${highlight ? "text-[var(--color-primary)]" : isDark ? "text-white/62" : "text-[#607085]"}`}>{title}</p>
      <p className={`mt-2 text-[18px] font-bold leading-tight ${highlight ? "text-[#071827]" : isDark ? "text-white" : "text-[#071827]"}`}>{value}</p>
      <p className={`mt-1 t-label leading-[1.35] ${highlight ? "text-[#27384a]" : isDark ? "text-white/68" : "text-[#27384a]"}`}>{note}</p>
    </article>
  );
}

function ResultsScreen({ diagnosis, verdict, engineOption, ctas, isDark, calculatorContext }) {
  const severity = severityMeta[diagnosis.severity];
  const verdictInfo = verdictMeta[verdict.decision];
  const dealerRange = getMainDealerRange(verdict.replacement, diagnosis.dealerMultiplier);

  function goToQuoteWithCalculator(event) {
    event.preventDefault();
    const calculator = {
      source: "diagnostic-calculator",
      category: calculatorContext?.categoryLabel || "",
      diagnosis: diagnosis.headline || "",
      diagnosisKey: diagnosis.key || "",
      severity: severity?.label || diagnosis.severity || "",
      evidence: diagnosis.evidenceLabel || "",
      engineCodes: (diagnosis.engineCodes || []).join(" / "),
      vehicleAge: calculatorContext?.ageLabel || "",
      carValue: calculatorContext?.carValue != null ? fmtCurrency(calculatorContext.carValue) : "",
      engineRoute: engineOption?.label || "",
      repairCost: `${fmtCurrency(diagnosis.repairCost.low)} - ${fmtCurrency(diagnosis.repairCost.high)}`,
      replacementCost: `${fmtCurrency(verdict.replacement.low)} - ${fmtCurrency(verdict.replacement.high)}`,
      dealerEstimate: `${fmtCurrency(dealerRange.low)} - ${fmtCurrency(dealerRange.high)}`,
      replacementVsValue: `${verdict.replacementPct}%`,
      repairVsValue: `${verdict.repairPct}%`,
      verdict: verdictInfo?.title || "",
    };

    try {
      sessionStorage.setItem("bmw_quote_calculator", JSON.stringify(calculator));
    } catch {
      // Quote form still works without calculator context
    }

    const href = ctas.quote?.href && ctas.quote.href !== "#" ? ctas.quote.href : "/quote";
    const url = href.includes("?") ? `${href}&from=calculator` : `${href}?from=calculator`;
    window.location.assign(url);
  }

  return (
    <div className="grid gap-5">
      <section className={`rounded-xl border p-5 shadow-[0_12px_34px_rgba(10,26,43,0.06)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.9)]" : "border-[#d7dde6] bg-white"}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <SeverityBadge severity={diagnosis.severity} isDark={isDark} />
              <span className={`t-label font-semibold uppercase tracking-[0.04em] ${isDark ? "text-white/62" : "text-[#607085]"}`}>{diagnosis.evidenceLabel}</span>
            </div>
            <h3 className={`mt-3 t-h5 ${isDark ? "text-white" : "text-[#071827]"}`}>{diagnosis.headline}</h3>
            <p className={`mt-3 max-w-[760px] t-body leading-[1.55] ${isDark ? "text-white/78" : "text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: diagnosis.summary }} />
          </div>
          <div className={`rounded-xl border px-4 py-3 ${isDark ? severity.darkBadge : severity.badge}`}>
            <p className="t-label font-bold uppercase tracking-[0.04em]">Tracked engine codes</p>
            <p className="mt-1 t-label font-semibold leading-tight">{diagnosis.engineCodes.join(" / ")}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <CostCard title="Repair cost" value={`${fmtCurrency(diagnosis.repairCost.low)} - ${fmtCurrency(diagnosis.repairCost.high)}`} note="If the issue is caught before secondary damage spreads." isDark={isDark} />
          <CostCard title={engineOption.label} value={`${fmtCurrency(verdict.replacement.low)} - ${fmtCurrency(verdict.replacement.high)}`} note="Replacement range for the engine route you selected." highlight isDark={isDark} />
          <CostCard title="Main dealer estimate" value={`${fmtCurrency(dealerRange.low)} - ${fmtCurrency(dealerRange.high)}`} note="Indicative dealer-level pricing using the same fault profile." isDark={isDark} />
          <CostCard title="Replacement vs car value" value={`${verdict.replacementPct}%`} note={`Repair sits near ${verdict.repairPct}% of car value.`} isDark={isDark} />
        </div>
      </section>

      <section className={`rounded-xl border p-5 shadow-[0_12px_34px_rgba(10,26,43,0.06)] ${isDark ? "border-[#223343] bg-[rgba(10,21,32,0.9)]" : "border-[#d7dde6] bg-white"}`}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
          <div>
            <h4 className={`t-label font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]`}>Commonly affecting</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {diagnosis.chassis.map((item) => (
                <span key={`${item.code}-${item.model}`} className={`rounded-lg border px-3 py-2 t-label ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)] text-white" : "border-[#d7dde6] bg-[#fbfdff] text-[#071827]"}`}>
                  <strong>{item.model}</strong> {item.code}
                  <span className={`${isDark ? "text-white/64" : "text-[#607085]"}`}> {item.years}</span>
                </span>
              ))}
            </div>

            <h4 className="mt-5 t-label font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">OEM references</h4>
            <div className={`mt-3 overflow-hidden rounded-lg border ${isDark ? "border-[#223343]" : "border-[#d7dde6]"}`}>
              {diagnosis.oemParts.map((part) => (
                <div key={part.part} className={`grid grid-cols-[minmax(0,1fr)_minmax(140px,0.8fr)] gap-3 border-b px-4 py-3 last:border-b-0 ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#d7dde6] bg-white"}`}>
                  <span className={`t-label ${isDark ? "text-white/78" : "text-[#27384a]"}`}>{part.label}</span>
                  <span className={`t-label font-semibold ${isDark ? "text-white" : "text-[#071827]"}`}>{part.part}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className={`rounded-xl border p-4 ${isDark ? verdictInfo.darkBadge : verdictInfo.badge}`}>
              <p className="t-label font-bold uppercase tracking-[0.04em]">Verdict</p>
              <p className="mt-2 text-[18px] font-bold leading-tight">{verdictInfo.title}</p>
              <p className="mt-2 t-label leading-[1.45]" dangerouslySetInnerHTML={{ __html: verdictInfo.text }} />
            </div>

            <div className={`mt-4 rounded-xl border p-4 ${isDark ? "border-[#223343] bg-[rgba(14,28,41,0.84)]" : "border-[#d7dde6] bg-[#fbfdff]"}`}>
              <p className="t-label font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">Next steps</p>
              <ul className="mt-3 grid gap-2">
                {diagnosis.nextSteps.map((step) => (
                  <li key={step} className={`flex items-start gap-3 t-label leading-[1.45] ${isDark ? "text-white/76" : "text-[#27384a]"}`}>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                      <Icon name="shield" className="h-3 w-3" strokeWidth={2.3} />
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={goToQuoteWithCalculator}
                  className="btn-cta flex items-center justify-center gap-3 rounded-lg bg-[var(--color-primary)] px-5 py-3 t-label font-bold text-white"
                >
                  <span>{ctas.quote.label}</span>
                  <ArrowIcon className="h-4 w-4" />
                </button>
                <Link href={ctas.specialist.href} className={`flex items-center justify-center gap-3 rounded-lg border px-5 py-3 t-label font-bold ${isDark ? "border-[#375067] bg-[rgba(14,28,41,0.84)] text-white" : "border-[#d7dde6] bg-white text-[#071827]"}`}>
                  <span>{ctas.specialist.label}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomeSec3({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const calculator = data.calculator;
  const diagnosesByKey = Object.fromEntries(calculator.diagnoses.map((item) => [item.key, item]));
  const [stage, setStage] = useState("entry");
  const [selectedTileId, setSelectedTileId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedDiagnosisKey, setSelectedDiagnosisKey] = useState("");
  const [selectedAgeId, setSelectedAgeId] = useState("");
  const [carValue, setCarValue] = useState(calculator.valueSteps[2]);
  const [selectedEngine, setSelectedEngine] = useState(calculator.engineOptions[0].id);

  const selectedCategory = calculator.categories.find((item) => item.id === selectedCategoryId) || null;
  const selectedDiagnosis = diagnosesByKey[selectedDiagnosisKey] || null;
  const selectedEngineOption = calculator.engineOptions.find((item) => item.id === selectedEngine) || calculator.engineOptions[0];
  const verdict = selectedDiagnosis ? getVerdict(selectedDiagnosis, carValue, selectedEngine, selectedAgeId, calculator.engineOptions) : null;
  const stageIndexMap = { entry: 1, question: 1, override: 1, vehicle: 2, engine: 3, results: 3 };
  const progressMap = { entry: 20, question: 34, override: 40, vehicle: 66, engine: 86, results: 100 };

  const strong = isDark ? "text-white" : "text-[#0b1626]";
  const soft = isDark ? "text-white/78" : "text-[#3b4656]";
  const sub = isDark ? "text-white/72" : "text-[#607085]";

  function resetFlow() {
    setStage("entry");
    setSelectedTileId("");
    setSelectedCategoryId("");
    setSelectedDiagnosisKey("");
    setSelectedAgeId("");
    setCarValue(calculator.valueSteps[2]);
    setSelectedEngine(calculator.engineOptions[0].id);
  }

  function continueFromTiles() {
    const tile = data.symptomTiles.find((t) => t.id === selectedTileId);
    if (!tile) return;
    setSelectedCategoryId(tile.categoryId);
    setStage("question");
  }

  function goToDiagnosis(key) {
    const diagnosis = diagnosesByKey[key];
    if (!diagnosis) return;
    setSelectedDiagnosisKey(key);
    setStage(diagnosis.severity === "catastrophic" || diagnosis.severity === "immediate" ? "override" : "vehicle");
  }

  const renderStepOne = (phone = false) => (
      <div className={phone ? "" : "flex h-full flex-col"}>
        <p className={`t-label font-semibold uppercase tracking-[0.02em] ${isDark ? "text-[#3b82f6]" : "text-[#0b4fc0]"}`}>{data.step1.label}</p>
        <h3 className={`t-h5 mt-2 ${strong}`}>{data.step1.title}</h3>
        <p className={`t-body mt-1.5 ${sub}`}>{data.step1.text}</p>
        <div className="mt-4">
          <SymptomTiles tiles={data.symptomTiles} selectedId={selectedTileId} onSelect={setSelectedTileId} isDark={isDark} phone={phone} />
        </div>
        <button
          type="button"
          onClick={continueFromTiles}
          aria-disabled={!selectedTileId}
          className={`mt-6 flex items-center justify-between gap-4 rounded-[4px] bg-[#0b47a8] px-7 py-3 text-[15px] font-semibold text-white ${phone ? "w-full" : "w-[336px] max-w-full"} ${
            selectedTileId ? "" : "opacity-95"
          }`}
        >
          <span className="flex-1 text-center">{data.step1.cta}</span>
          <ArrowIcon className="h-5 w-5" />
        </button>
      </div>
    );

  // Stages after the symptom grid keep the existing diagnosis flow.
  const flow =
    stage === "entry" ? null : (
      <div>
        <div className="mb-5">
          <ProgressBar percent={progressMap[stage]} />
          <div className="mt-4">
            <StepIndicator labels={calculator.stepLabels} stageIndex={stageIndexMap[stage]} isDark={isDark} />
          </div>
        </div>

        {stage === "question" && selectedCategory ? (
          <div>
            <p className="t-label font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">{data.step1.label}</p>
            <h3 className={`mt-2 t-h5 ${strong}`}>{selectedCategory.question}</h3>
            <p className={`mt-2 t-label leading-[1.45] ${soft}`}>Choose the closest symptom cluster. We route high-risk faults into safety advice before showing cost maths.</p>
            <div className="mt-5 grid gap-3">
              {selectedCategory.answers.map((answer) => (
                <AnswerButton key={answer.label} answer={answer} isDark={isDark} onSelect={goToDiagnosis} />
              ))}
            </div>
            <button type="button" onClick={() => setStage("entry")} className={`mt-5 t-label font-semibold ${sub}`}>
              Back to symptom categories
            </button>
          </div>
        ) : null}

        {stage === "override" && selectedDiagnosis ? <OverridePanel diagnosis={selectedDiagnosis} isDark={isDark} onContinue={() => setStage("vehicle")} /> : null}

        {stage === "vehicle" ? (
          <div>
            <p className="t-label font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">Step 2 of 3</p>
            <h3 className={`mt-2 t-h5 ${strong}`}>Tell us about your vehicle</h3>
            <div className="mt-5">
              <p className={`t-label font-bold uppercase tracking-[0.04em] ${sub}`}>Vehicle age</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {calculator.ageOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedAgeId(item.id)}
                    className={`rounded-full border px-4 py-2 t-label font-semibold ${
                      selectedAgeId === item.id ? "border-[#0b4fc0] bg-[#0b4fc0] text-white" : isDark ? "border-[#1e3350] bg-[rgba(16,26,42,0.9)] text-white" : "border-[#d7dde6] bg-white text-[#0b1626]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className={`t-label font-bold uppercase tracking-[0.04em] ${sub}`}>Estimated current value</p>
              <div className={`mt-3 rounded-xl border px-5 py-4 ${innerCard(isDark)}`}>
                <strong className={`t-h4 block leading-none ${strong}`}>{fmtCurrency(carValue)}</strong>
                <span className={`mt-1 block t-label ${sub}`}>What would the car roughly sell for in its current condition?</span>
                <input
                  type="range"
                  min={0}
                  max={calculator.valueSteps.length - 1}
                  step={1}
                  value={calculator.valueSteps.indexOf(carValue)}
                  onChange={(event) => setCarValue(calculator.valueSteps[Number(event.target.value)])}
                  className="mt-4 w-full accent-[#0b4fc0]"
                />
                <div className={`mt-3 flex justify-between gap-2 t-label ${sub}`}>
                  {calculator.valueSteps.map((step) => (
                    <span key={step}>{formatStepValue(step)}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setStage(selectedCategoryId ? "question" : "entry")} className={`t-label font-semibold ${sub}`}>
                Back
              </button>
              <button
                type="button"
                onClick={() => setStage("engine")}
                disabled={!selectedAgeId}
                className="flex items-center justify-center gap-3 rounded-[4px] bg-[#0b47a8] px-5 py-3 t-label font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                CONTINUE TO STEP 3
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {stage === "engine" ? (
          <div>
            <p className="t-label font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]">Step 3 of 3</p>
            <h3 className={`mt-2 t-h5 ${strong}`}>Which replacement path are you comparing?</h3>
            <p className={`mt-2 t-label leading-[1.45] ${soft}`}>This changes the replacement range and therefore the verdict. Reconditioned stays the conservative baseline.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {calculator.engineOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedEngine(option.id)}
                  className={`rounded-xl border p-4 text-left ${selectedEngine === option.id ? "border-[#0b4fc0] bg-[#eef3fb]" : innerCard(isDark)}`}
                >
                  <p className={`t-body font-semibold leading-tight ${selectedEngine === option.id ? "text-[#0b1626]" : strong}`}>{option.label}</p>
                  <p className={`mt-2 t-label leading-[1.35] ${selectedEngine === option.id ? "text-[#3b4656]" : sub}`}>{option.subLabel}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setStage("vehicle")} className={`t-label font-semibold ${sub}`}>
                Back
              </button>
              <button type="button" onClick={() => setStage("results")} className="flex items-center justify-center gap-3 rounded-[4px] bg-[#0b47a8] px-5 py-3 t-label font-medium text-white">
                SEE DIAGNOSIS AND COSTS
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {stage === "results" && selectedDiagnosis && verdict ? (
          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className={`t-h5 ${strong}`}>Diagnosis, cost range, and ownership verdict</h3>
              <button type="button" onClick={resetFlow} className={`t-label font-semibold ${sub}`}>
                Start again
              </button>
            </div>
            <ResultsScreen
              diagnosis={selectedDiagnosis}
              verdict={verdict}
              engineOption={selectedEngineOption}
              ctas={calculator.ctas}
              isDark={isDark}
              calculatorContext={{
                categoryLabel: selectedCategory?.label || "",
                ageLabel: calculator.ageOptions.find((item) => item.id === selectedAgeId)?.label || "",
                carValue,
              }}
            />
          </div>
        ) : null}
      </div>
    );

  return (
    <section id="diagnose" className={`relative overflow-hidden ${isDark ? "bg-[#05090f]" : "bg-[#f9fafc]"}`}>
      {/* ---------- Desktop / tablet ---------- */}
      <div className="relative hidden md:block">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 h-[470px] w-[60%] [mask-image:linear-gradient(90deg,transparent_0%,black_32%),linear-gradient(180deg,black_70%,transparent)] [mask-composite:intersect] ${
            isDark
              ? "bg-[radial-gradient(ellipse_at_62%_40%,#2a3240_0%,#11161e_45%,#05090f_80%)]"
              : "bg-[radial-gradient(ellipse_at_62%_35%,#ffffff_0%,#eceef1_45%,#dfe2e6_75%,#f9fafc_100%)]"
          }`}
        />
        <div className="site-container section-y relative">
          <div aria-hidden="true" className="pointer-events-none absolute right-[var(--gutter)] top-6 h-[360px] w-[470px] max-w-[36%] xl:max-w-[40%]">
            <div className={`absolute inset-x-[4%] -bottom-[2%] h-[10%] rounded-[50%] blur-xl ${isDark ? "bg-black/80" : "bg-black/35"}`} />
            <Image src={isDark ? data.images.desktop.dark : data.images.desktop.light} alt={data.images.desktop.alt} fill sizes="40vw" className="object-contain object-bottom" />
          </div>
          <div className="relative max-w-[620px]">
            <h2 className={`t-h2 [&>span]:whitespace-nowrap ${strong}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
            <p className={`t-p mt-4 max-w-[560px] ${soft}`}>{data.subHeadline}</p>
          </div>
          <div className="relative z-10 mt-7 max-w-[900px]">
            <TrustStrip items={data.trustStrip} isDark={isDark} />
          </div>

          <div className="relative mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.1fr)]">
            <div className="hidden xl:block">
              <HowItWorks data={data.howItWorks} isDark={isDark} />
            </div>
            <div className={`flex flex-col rounded-[10px] border p-5 ${isDark ? "border-[#2563eb]/60 bg-[rgba(10,18,30,0.92)]" : "border-[#c9d8f1] bg-white"}`}>
              {stage === "entry" ? renderStepOne() : flow}
            </div>
            <div className="hidden xl:block">
              <WhyTrust title={data.whyTrustTitle} items={calculator.whyTrust} isDark={isDark} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:hidden">
              <HowItWorks data={data.howItWorks} isDark={isDark} />
              <WhyTrust title={data.whyTrustTitle} items={calculator.whyTrust} isDark={isDark} />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Phone (same layout in both themes; only colours change) ---------- */}
      <div className="relative px-4 pb-8 pt-8 md:hidden">
        <h2 className={`t-h2 relative ${strong}`}>
          Diagnose Your <span className="heading-accent">BMW</span> Engine Problem
        </h2>
        <p className={`t-body relative mt-3 ${soft}`}>{data.subHeadline}</p>
        {/* Reference: the car sits right under the copy, on the right, bleeding off the edge. */}
        <div aria-hidden="true" className="pointer-events-none relative -mr-4 mt-2 ml-auto h-[150px] w-[72%] overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,black_22%)]">
          <div className="absolute inset-y-0 left-0 w-[125%]">
            <Image src={data.images.phone.src} alt={data.images.phone.alt} fill sizes="80vw" className="object-contain object-left-bottom" />
          </div>
        </div>
        <div className="relative z-10 -mt-4">
          <TrustStrip items={data.trustStrip} isDark={isDark} phone />
        </div>
        <div className="relative mt-4">
          <HowItWorks data={data.howItWorks} isDark={isDark} numbered />
        </div>
        <div className={`relative mt-4 rounded-[10px] border p-4 ${card(isDark)}`}>{stage === "entry" ? renderStepOne(true) : flow}</div>
        <div className="relative mt-4">
          <WhyTrust title={data.whyTrustTitle} items={calculator.whyTrust} isDark={isDark} phone />
        </div>
      </div>
    </section>
  );
}
