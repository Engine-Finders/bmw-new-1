"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";
import Link from "next/link";

function VariantPanel({ title, icon, variants, tone }) {
  if (!variants?.length) return null;
  const toneClass = tone === "diesel" ? "bg-[var(--color-primary)]" : "bg-[#189454]";

  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-white ${toneClass}`}>
        <GenIcon name={icon} className="h-6 w-6" />
      </span>
      <div>
        <p className={`text-[0.76rem] font-semibold uppercase tracking-wide ${tone === "diesel" ? "text-[var(--color-primary)]" : "text-[#189454]"}`}>
          {title}
        </p>
        <p className="mt-1 text-[0.98rem] font-bold leading-snug text-[var(--color-text)]">
          {variants.map((v, index) => (
            <span key={index}>
              <Link href={v.url}>{v.name}</Link> {index < variants.length - 1 && " • "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default function CoreVariants({ data }) {
  if (!data) return null;

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[0.75rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                Section 8
              </span>
              <h2 className="mt-2 text-[2.3rem] font-bold uppercase leading-[1.05] tracking-normal text-[var(--color-text)] md:text-[3rem]">
                Core Variants
              </h2>
              <div className="mt-3">
                <MStripe />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <VariantPanel title="Diesel Variants" icon="engine" variants={data.dieselVariants} tone="diesel" />
              <VariantPanel title="Petrol Variants" icon="car" variants={data.petrolVariants} tone="petrol" />
            </div>

            {data.scopeNote ? (
              <div className="flex flex-1 gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <span className="mt-0.5 shrink-0 text-[var(--color-primary)]">
                  <GenIcon name="info" className="h-5 w-5" />
                </span>
                <p className="text-[0.82rem] leading-[1.5] text-[var(--color-text-muted)]">
                  <span className="font-semibold text-[var(--color-text)]">Scope note: </span>
                  <span dangerouslySetInnerHTML={{ __html: data.scopeNote }} />
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative h-[280px] overflow-hidden rounded-xl md:h-full">
            <Image
              src="/e90/core_variants_dark.png"
              alt="BMW 3 Series E90"
              fill
              className="object-cover object-[38%_center]"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
