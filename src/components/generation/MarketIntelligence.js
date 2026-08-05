"use client";

import MStripe from "@/components/reusableComponents/MStripe";
import GenIcon from "./GenIcons";

function StatCard({ icon, title, children }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <GenIcon name={icon} className="h-4 w-4" />
      </span>
      <p className="text-[0.68rem] font-semibold uppercase leading-[1.25] tracking-wide text-[var(--color-primary)]">{title}</p>
      {children}
    </div>
  );
}

function RankedList({ items }) {
  return (
    <ol className="flex flex-col gap-1">
      {items?.map((item, index) => (
        <li key={item} className="flex gap-1.5 text-[0.74rem] leading-[1.3] text-[var(--color-text)]">
          <span className="font-semibold text-[var(--color-primary)]">{index + 1}.</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ol>
  );
}

export default function MarketIntelligence({ data }) {
  if (!data) return null;

  return (
    <section className="w-full border-t border-[var(--color-border)] bg-[var(--color-page)] py-8 text-[var(--color-text)] md:py-10">
      <div className="relative mx-auto w-full max-w-8xl px-4 md:px-8">
        <span className="text-[0.75rem] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Section 9
        </span>
        <h2 className="mt-2 text-[2.3rem] font-bold uppercase leading-[1.05] tracking-normal text-[var(--color-text)] md:text-[3rem]">
          Market Intelligence
        </h2>
        <div className="mt-3">
          <MStripe />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon="chart" title="Most Requested E90 Engines (2025)">
              <RankedList items={data.mostRequestedEngines} />
            </StatCard>
            <StatCard icon="car" title="Most Requested E90 Variants">
              <RankedList items={data.mostRequestedVariants} />
            </StatCard>
            <StatCard icon="dollar" title="Average E90 Replacement Cost">
              <p className="text-[1.5rem] font-bold text-[var(--color-text)]">{data.averageReplacementCost}</p>
              {data.averageReplacementCostNote ? (
                <p className="text-[0.68rem] leading-[1.3] text-[var(--color-text-soft)]" dangerouslySetInnerHTML={{ __html: data.averageReplacementCostNote }} />
              ) : null}
            </StatCard>
            <StatCard icon="warning" title="Most Common E90 Failures">
              <RankedList items={data.mostCommonFailures} />
            </StatCard>
          </div>

          {data.liveFeed?.length > 0 ? (
            <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-table-surface)] shadow-[0_14px_40px_var(--color-shadow)] backdrop-blur">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3 text-[0.85rem] font-semibold text-[var(--color-text)]">
                <GenIcon name="gauge" className="h-4 w-4 text-[var(--color-primary)]" />
                Live Feed
              </div>

              <div className="hidden grid-cols-[1.2fr_0.9fr_1fr] gap-2 border-b border-[var(--color-border)] bg-[var(--color-page-soft)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-wide text-[var(--color-text-soft)] md:grid">
                <span>Vehicle</span>
                <span>Location</span>
                <span>Issue</span>
              </div>

              {data.liveFeed.map((row, index) => (
                <div
                  key={`${row.vehicle}-${row.location}`}
                  className={`px-4 py-3 text-[0.8rem] text-[var(--color-text)] ${
                    index === data.liveFeed.length - 1 ? "" : "border-b border-[var(--color-border)]"
                  }`}
                >
                  <div className="grid grid-cols-[1.2fr_0.9fr_1fr] items-start gap-2">
                    <span className="font-semibold">{row.vehicle}</span>
                    <span className="text-[var(--color-text-muted)]">{row.location}</span>
                    <span className="text-[var(--color-text-muted)]">{row.issue}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[0.72rem] text-[var(--color-text-soft)]">
                    <span>{row.enquiries}</span>
                    <span>•</span>
                    <span>{row.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
