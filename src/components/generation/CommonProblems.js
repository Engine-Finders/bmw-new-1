"use client";

import Image from "next/image";
import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";

function TieredCostTable({ tiers }) {
  if (!tiers?.length) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-md border border-[var(--color-border)]">
      {tiers.map((tier) => {
        const isCatastrophic = tier.tier.toLowerCase().includes("catastrophic");
        const toneClass = isCatastrophic ? "text-[#db2e2e]" : "text-[var(--color-primary)]";

        return (
          <div key={tier.tier} className="border-b border-[var(--color-border)] p-3 last:border-b-0">
            <p className={`flex items-center gap-1.5 text-[0.76rem] font-semibold uppercase tracking-wide ${toneClass}`}>
              <GenIcon name={isCatastrophic ? "warning" : "wrench"} className="h-3.5 w-3.5" />
              {tier.tier}
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[0.78rem]">
              <span className="text-[var(--color-text-soft)]">Dealer</span>
              <span className="text-right text-[var(--color-text)]">{tier.dealer}</span>
              <span className="text-[var(--color-text-soft)]">Specialist</span>
              <span className="text-right font-semibold text-[var(--color-text)]">{tier.specialist}</span>
            </div>
            <p className="mt-1.5 text-[0.76rem] leading-[1.35] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: tier.work }} />
            {tier.note ? <p className="mt-0.5 text-[0.72rem] italic text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: tier.note }} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function splitTitle(title = "") {
  const spaceIndex = title.indexOf(" ");
  if (spaceIndex === -1) return { code: title, name: "" };
  return { code: title.slice(0, spaceIndex), name: title.slice(spaceIndex + 1) };
}

function ProblemCard({ problem }) {
  const { code, name } = splitTitle(problem.title);

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)] text-[0.8rem] font-bold text-white">
              {String(problem.id).padStart(2, "0")}
            </span>
            <p className="text-[1rem] font-bold leading-tight text-[var(--color-text)]">{code}</p>
          </div>
          {name ? <p className="mt-1 text-[1rem] font-bold leading-tight text-[var(--color-text)]">{name}</p> : null}
        </div>
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
          <Image src="/e90/section6.png" alt={problem.title} fill className="object-cover" sizes="90px" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pt-3 text-[0.8rem]">
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
            <GenIcon name="clock" className="h-3.5 w-3.5" />
            Affected models:
          </p>
          <p className="mt-0.5 text-[var(--color-text-muted)]">{problem.affectedModels}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
            <GenIcon name="clock" className="h-3.5 w-3.5" />
            Typical failure mileage:
          </p>
          <p className="mt-0.5 text-[var(--color-text-muted)]">{problem.typicalFailureMileage}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
            <GenIcon name="wrench" className="h-3.5 w-3.5" />
            Root cause:
          </p>
          <p className="mt-0.5 leading-[1.45] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.rootCause }} />
        </div>
      </div>

      <div className="px-4">
        <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">
          Tiered Cost Table
        </p>
        <TieredCostTable tiers={problem.tieredCosts} />
      </div>

      {problem.recommendation ? (
        <div className="px-4 pt-3">
          <p className="flex items-center gap-1.5 text-[0.76rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            <GenIcon name="shield" className="h-3.5 w-3.5" />
            Our Recommendation
          </p>
          <p className="mt-1 text-[0.8rem] leading-[1.45] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: problem.recommendation }} />
        </div>
      ) : null}

      {problem.cta ? (
        <div className="mt-auto px-4 pb-4 pt-4">
          <a
            href={problem.cta.href}
            className="flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-center text-[0.8rem] font-semibold text-white"
          >
            {problem.cta.label.replace(/\s*→\s*$/, "")}
            <GenIcon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default function CommonProblems({ data }) {
  if (!data) return null;

  return (
    <section className="w-full bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <h2 className="text-[2.55rem] font-bold leading-[1.05] tracking-normal text-[var(--color-text)] md:text-[3.5rem]">
          {data.h2 || "Common Problems"}
        </h2>
        <div className="mt-3">
          <MStripe />
        </div>
        {data.subHeadline ? (
          <p className="mt-5 max-w-[560px] text-[1rem] leading-[1.5] text-[var(--color-text-muted)] md:text-[1.08rem]" dangerouslySetInnerHTML={{ __html: data.subHeadline }} />
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.problems?.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {data.trustStrip?.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:grid-cols-4">
            {data.trustStrip.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <GenIcon name={item.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[0.85rem] font-semibold text-[var(--color-text)]">{item.title}</p>
                  <p className="text-[0.76rem] leading-[1.35] text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {data.footerNote ? (
          <p className="mt-4 text-center text-[0.76rem] text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: data.footerNote }} />
        ) : null}
      </div>
    </section>
  );
}
