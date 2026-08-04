"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";

const pointIcons = ["shield", "scale", "wrench"];

function TitleWithAccent({ title }) {
  const markerIndex = title.indexOf(".uk");
  if (markerIndex === -1) return title;

  return (
    <>
      {title.slice(0, markerIndex)}
      <span className="text-[var(--color-primary)]">.uk</span>
    </>
  );
}

export default function TrustCta({ data }) {
  if (!data) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <span className="text-[0.75rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Section 11
        </span>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-stretch md:gap-0">
          <div>
            <h2 className="max-w-[560px] text-[2.3rem] font-bold leading-[1.1] tracking-normal text-[var(--color-text)] md:text-[2.6rem]">
              <TitleWithAccent title={data.h2} />
            </h2>
            <div className="mt-3">
              <MStripe />
            </div>

            <ul className="mt-6 flex flex-col gap-4">
              {data.trustPoints?.map((point, index) => (
                <li key={point.title} className="flex items-start gap-3 rounded-md border border-[var(--color-border)] p-3 md:border-0 md:p-0">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] bg-transparent text-[var(--color-primary)]">
                    <GenIcon name={point.icon || pointIcons[index % pointIcons.length]} className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.95rem] font-semibold text-[var(--color-text)]">{point.title}</p>
                    <p className="text-[0.83rem] leading-[1.45] text-[var(--color-text-muted)]">{point.text}</p>
                  </div>
                  <span className="mt-1 shrink-0 text-[var(--color-primary)]">
                    <GenIcon name="chevron" className="h-4 w-4" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-2xl md:h-auto md:rounded-none">
            <Image
              src="/e90/section11.png"
              alt="BMW 3 Series E90 rear three-quarter view"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
            {/* soft fade at the image's own left edge, blending it into the text column */}
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-page)_0%,transparent_35%)] md:block" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-page)_0%,transparent_25%,transparent_75%,var(--color-page)_100%)] md:hidden" />
          </div>
        </div>

        {data.finalCta || data.ctaButton ? (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-md border border-[var(--color-primary)] p-5 md:flex-row md:items-center md:justify-between">
            {data.finalCta ? (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)]">
                  <GenIcon name="badge" className="h-4.5 w-4.5" />
                </span>
                <p className="text-[0.88rem] leading-[1.45] text-[var(--color-text)]">{data.finalCta}</p>
              </div>
            ) : null}
            {data.ctaButton ? (
              <a
                href={data.ctaButton.href}
                className="flex w-full shrink-0 items-center justify-center gap-2 text-center rounded-md bg-[var(--color-primary)] px-5 py-3 text-[0.8rem] font-bold uppercase tracking-wide text-white shadow-[0_12px_28px_var(--color-shadow)] md:inline-flex md:w-auto md:whitespace-nowrap"
              >
                {data.ctaButton.label.replace(/\s*→\s*$/, "")}
                <GenIcon name="chevron" className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
