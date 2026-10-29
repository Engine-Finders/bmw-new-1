"use client";

import MStripe from "@/components/reusableComponents/MStripe";
import { sectionDescription, sectionH2 } from "./generationSection";

// "Costs -By Variant" → "Costs – By Variant": a bare hyphen used as a dash in the data.
const spacedDash = (text = "") => String(text).replace(/(\S)\s+-(?=\S)/g, "$1 – ");

export default function GenerationSectionHeader({
  title,
  subHeadline,
  isDark,
  sectionBg,
  mobilePlain = false,
}) {
  const wrapperBg = mobilePlain
    ? isDark
      ? "bg-transparent md:bg-[var(--color-page)]"
      : "bg-transparent md:bg-[#eef2f7]"
    : sectionBg;

  return (
    <div className={`relative overflow-hidden ${wrapperBg}`}>
      <div className="relative mx-auto w-full max-w-8xl px-4 pb-3 pt-5 md:px-8 md:pb-4 md:pt-6">
        <div className="max-w-[650px]">
          <h2 className={`font-bold tracking-normal text-[var(--color-text)] ${sectionH2}`}>
            {title.main ? <span dangerouslySetInnerHTML={{ __html: spacedDash(title.main) }} /> : null}
            {title.accent ? (
              <>
                {title.main ? <br /> : null}
                <span
                  className="text-[var(--color-chrome-bright)]"
                  dangerouslySetInnerHTML={{ __html: spacedDash(title.accent) }}
                />
              </>
            ) : null}
          </h2>
          <div className="mt-2.5">
            <MStripe />
          </div>
          {subHeadline ? (
            <p
              className={`mt-2.5 max-w-[610px] text-[var(--color-text-muted)] ${sectionDescription}`}
              dangerouslySetInnerHTML={{ __html: subHeadline }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
