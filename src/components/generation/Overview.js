"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";

const factIcons = ["car", "arrow", "arrow", "car"];

// 2x2 grid on mobile (matches reference), single row on desktop.
const keyFactCellClasses = [
  "border-r border-b border-[var(--color-border)] pr-3 pb-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-2.5",
  "border-b border-[var(--color-border)] pb-3 pl-3 lg:border-b-0 lg:border-r lg:border-[var(--color-border)] lg:pb-0 lg:pl-3 lg:pr-2.5",
  "border-r border-[var(--color-border)] pr-3 pt-3 lg:border-r lg:pt-0 lg:pl-0 lg:pr-2.5",
  "pl-3 pt-3 lg:pt-0 lg:pl-3",
];

function parseKeyFacts(keyFacts) {
  if (Array.isArray(keyFacts)) return keyFacts;
  if (typeof keyFacts !== "string" || !keyFacts.trim()) return [];

  return keyFacts
    .split(" • ")
    .map((chunk) => chunk.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((chunk) => {
      const separatorIndex = chunk.indexOf(":");
      if (separatorIndex === -1) return { label: chunk, value: "" };
      return {
        label: chunk.slice(0, separatorIndex).trim(),
        value: chunk.slice(separatorIndex + 1).trim(),
      };
    });
}

export default function Overview({ data }) {
  if (!data) return null;

  const keyFacts = parseKeyFacts(data.keyFacts);

  // Split the intro into up-to-two paragraphs by sentence boundary
  const introParts = data.intro
    ? (() => {
        const text = data.intro.trim();
        const match = text.match(/^(.+?[.!?])(?:\s+)(.+)$/);
        if (match) return [match[1], match[2]];
        return [text];
      })()
    : [];

  return (
    <section className="w-full bg-[var(--color-page)] py-6 text-[var(--color-text)] md:py-8">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.6fr_1fr] md:items-stretch md:gap-0">
          {data.image?.src ? (
            <div className="relative h-[320px] overflow-hidden rounded-xl md:h-auto md:rounded-none">
              <Image
                src={data.image.src}
                alt={data.image.alt || ""}
                fill
                className="object-cover object-[15%_60%] md:object-[5%_62%]"
                sizes="(min-width: 768px) 45vw, 100vw"
                priority
              />
              {/* soft fade at the image's own right edge, blending it into the page background */}
              <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,transparent_45%,var(--color-page)_98%)] md:block" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,var(--color-page)_100%)] md:hidden" />
            </div>
          ) : null}

          {/* RIGHT: everything else stacks in this column, next to the image */}
          <div className="flex flex-col justify-center md:pl-8">
            <span className="text-[0.8rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              Overview
            </span>

            <h2 className="mt-1.5 text-[2.55rem] font-bold leading-[1.05] tracking-normal text-[var(--color-text)] md:text-[3.5rem]">
              {data.h2}
            </h2>

            <div className="mt-2.5">
              <MStripe />
            </div>

            {introParts.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3 text-[1rem] leading-[1.55] text-[var(--color-text-muted)] md:text-[1.05rem]">
                {introParts.map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>
            ) : null}

            {keyFacts.length > 0 ? (
              <div className="relative mt-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
                <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                  Key Facts
                </p>
                <div className="mt-2 grid grid-cols-2 lg:grid-cols-4 lg:items-start">
                  {keyFacts.map((fact, index) => (
                    <div key={fact.label} className={`flex items-start gap-2 ${keyFactCellClasses[index % keyFactCellClasses.length]}`}>
                      <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
                        <GenIcon name={factIcons[index % factIcons.length]} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.8rem] font-semibold leading-[1.25] text-[var(--color-text)]">{fact.label}</p>
                        <p className="mt-0.5 text-[0.74rem] leading-[1.3] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: fact.value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {data.marketIntelligenceLine ? (
              <div className="relative mt-2.5 rounded-md border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0 text-[var(--color-primary)]">
                    <GenIcon name="gauge" className="h-4 w-4" />
                  </span>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                    Market Intelligence
                  </p>
                </div>
                <p className="mt-1.5 text-[0.8rem] leading-[1.4] text-[var(--color-text)]" dangerouslySetInnerHTML={{ __html: data.marketIntelligenceLine }} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
