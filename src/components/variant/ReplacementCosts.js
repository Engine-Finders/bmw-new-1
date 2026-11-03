import Link from "next/link";
import VIcon from "./VariantIcons";
import { Accordion } from "./VariantToggles";
import { TagLine } from "./EraMap";
import { Rich, byKeyword, spaceRange, splitTags, stripMarker, ui } from "./variantUi";
import { variantFont } from "./variantFont";

const copy = ui.replacementCosts;
const FIELDS = ["engineType", "supplyOnly", "fittedIndie", "warranty", "bestFor"];

// Price / warranty value; a trailing "[PLACEHOLDER]" style tag goes on its own line.
function Value({ value }) {
  const { main, tags } = splitTags(value);
  return (
    <>
      <Rich html={spaceRange(main)} className="block" />
      <TagLine tags={tags} className="font-normal" />
    </>
  );
}

function typeIcon(row) {
  return byKeyword(copy.typeIcons, row.engineType, "icon", "gear");
}

function FilledCircle({ icon, className = "h-11 w-11 lg:h-11 lg:w-11 xl:h-12 xl:w-12" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--color-v-blue-btn)] text-white ${className}`}>
      <VIcon name={icon} solid className="h-[52%] w-[52%]" strokeWidth={2} />
    </span>
  );
}

function SoftCircle({ icon, className = "h-10 w-10" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--color-v-blue-soft)] text-[var(--color-v-blue)] [[data-theme=dark]_&]:text-[#6fa8ff] [[data-theme=light]_&]:text-[var(--color-v-navy)] ${className}`}>
      <VIcon name={icon} className="h-[54%] w-[54%]" strokeWidth={1.7} />
    </span>
  );
}

function Cta({ cta, className = "" }) {
  if (!cta?.label) return null;
  return (
    <Link href={cta.href || "/quote"} className={`t-body items-center gap-4 rounded-[6px] bg-[var(--color-v-blue-btn)] px-6 py-3 font-semibold text-white transition hover:brightness-110 ${className}`}>
      <VIcon name="arrowRight" className="h-5 w-5 shrink-0" strokeWidth={2.2} />
      <span className="text-left">{stripMarker(cta.label)}</span>
    </Link>
  );
}

function MobileSummary({ row }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-4">
      <FilledCircle icon={typeIcon(row)} className="h-12 w-12" />
      <span className="min-w-0">
        <span className="block text-[18px] font-semibold leading-snug text-[var(--color-v-text)]">{row.engineType}</span>
        <Rich html={row.bestFor} className="block text-[15px] leading-snug text-[var(--color-v-muted)]" />
      </span>
    </span>
  );
}

function MobileBody({ row, columns }) {
  return (
    <ul className="mx-4 mb-4 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] px-4">
      {FIELDS.slice(1).map((field, fieldIndex) => (
        <li key={field} className="flex items-center gap-4 border-t border-[var(--color-v-border)] py-3 first:border-t-0">
          <SoftCircle icon={copy.mobileRows[field].icon} />
          <span className="t-body flex-1 text-[var(--color-v-text)]">{columns[fieldIndex + 1]}</span>
          <span className={`t-body max-w-[55%] text-right ${field === "bestFor" ? "text-[var(--color-v-text)]" : "font-semibold text-[var(--color-v-blue)]"}`}>
            <Value value={row[field]} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ReplacementCosts({ data }) {
  const rows = data?.rows || [];
  if (!rows.length) return null;
  const columns = data.columns?.length === FIELDS.length ? data.columns : ["Engine Type", "Supply Only", "Fitted (Indie)", "Warranty", "Best For"];
  // Reference scale: 15px cells at 1024px, growing to 17px on wide screens, so prices and warranties stay on one line.
  const cell = "border-r border-[var(--color-v-border)] px-4 py-4 align-middle text-[clamp(15px,1.2vw,17px)] leading-snug last:border-r-0";
  const priceCell = `${cell} whitespace-nowrap text-center`;

  const mobileItems = rows.map((row, index) => ({
    key: `${row.engineType}-${index}`,
    summary: <MobileSummary row={row} />,
    body: <MobileBody row={row} columns={columns} />,
  }));

  return (
    <section className={`${variantFont.className} section-y lg:py-10 border-b border-[var(--color-v-border)] bg-[var(--color-v-band)] text-[var(--color-v-text)] [[data-theme=dark]_&]:bg-[var(--color-v-page)]`}>
      <div className="site-container">
        <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] lg:text-[clamp(28px,2.85vw,40px)]">{data.h2}</h2>

        {/* Phones and tablets: one card per engine type, the second one open */}
        <div className="mt-6 flex flex-col gap-3 lg:hidden">
          <Accordion
            items={mobileItems}
            defaultIndex={rows.length > 1 ? 1 : 0}
            itemClassName="rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] shadow-[0_4px_14px_var(--color-v-shadow)]"
            openItemClassName="!border-[var(--color-v-blue)] !bg-[var(--color-v-panel-soft)]"
            headerClassName="gap-3 p-4"
            chevronClassName="h-6 w-6 text-[var(--color-v-text)]"
          />
        </div>

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] lg:block">
          <table className="t-body w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[21%]" />
              <col className="w-[18%]" />
              <col className="w-[18.5%]" />
              <col className="w-[18%]" />
              <col className="w-[24.5%]" />
            </colgroup>
            <thead>
              <tr className="bg-[var(--color-v-navy)] text-white [[data-theme=dark]_&]:border-b [[data-theme=dark]_&]:border-[var(--color-v-border-strong)]">
                {columns.map((column) => (
                  <th key={column} scope="col" className="border-r border-[var(--color-v-navy-line)] px-4 py-3.5 text-center text-[clamp(15px,1.2vw,17px)] font-semibold last:border-r-0">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.engineType}-${index}`} className="border-t border-[var(--color-v-border)] first:border-t-0">
                  <td className={cell}>
                    <span className="flex items-center gap-3.5">
                      <FilledCircle icon={typeIcon(row)} />
                      <span className="font-semibold leading-snug">{row.engineType}</span>
                    </span>
                  </td>
                  <td className={priceCell}>
                    <Value value={row.supplyOnly} />
                  </td>
                  <td className={priceCell}>
                    <Value value={row.fittedIndie} />
                  </td>
                  <td className={cell}>
                    <span className="flex items-center justify-center gap-2.5 whitespace-nowrap">
                      <VIcon name="shieldCheck" solid className="h-6 w-6 shrink-0 text-[var(--color-v-blue-btn)] [[data-theme=dark]_&]:text-[var(--color-v-blue)]" />
                      <Value value={row.warranty} />
                    </span>
                  </td>
                  <td className={cell}>
                    <span className="flex items-center gap-3.5">
                      <SoftCircle icon={copy.bestForIcons[index % copy.bestForIcons.length]} className="h-11 w-11" />
                      <Rich html={row.bestFor} className="text-[0.93em] text-[var(--color-v-text)]" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.figuresNote ? (
          <div className="mt-4 flex items-start gap-4 rounded-[10px] border border-[var(--color-v-border-strong)] bg-[var(--color-v-panel-soft)] p-4 lg:items-center lg:px-6">
            <VIcon name="info" className="h-7 w-7 shrink-0 text-[var(--color-v-blue)] lg:h-6 lg:w-6" />
            <Rich as="p" html={data.figuresNote} className="text-[15px] leading-[1.6] text-[var(--color-v-muted)] lg:text-[clamp(15px,1.2vw,17px)] lg:leading-normal" />
          </div>
        ) : null}

        {data.labourEstimate || data.cta ? (
          <>
            <div className="mt-4 flex flex-col gap-4 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-4 lg:flex-row lg:items-center lg:gap-8 lg:px-6">
              <div className="flex flex-1 items-center gap-4">
                <span className="flex shrink-0 items-center justify-center text-[var(--color-v-blue)] max-lg:h-14 max-lg:w-14 max-lg:rounded-full max-lg:bg-[var(--color-v-blue-soft)]">
                  <VIcon name="wrench" className="h-8 w-8 lg:h-10 lg:w-10" strokeWidth={1.5} />
                </span>
                <p className="text-[15px] leading-[1.6] text-[var(--color-v-text)] lg:text-[clamp(15px,1.2vw,17px)] lg:leading-normal">
                  <strong className="font-semibold">{copy.labourLabel}</strong> <Rich html={data.labourEstimate} />
                </p>
              </div>
              <Cta cta={data.cta} className="hidden max-w-[310px] shrink-0 lg:inline-flex" />
            </div>
            {data.cta?.label ? (
              <Link
                href={data.cta.href || "/quote"}
                className="mt-4 flex items-center gap-4 rounded-[8px] bg-[var(--color-v-blue-btn)] px-5 py-4 text-[15px] font-semibold text-white lg:hidden"
              >
                <VIcon name="arrowRight" className="h-6 w-6 shrink-0" strokeWidth={2} />
                <span className="flex-1">{stripMarker(data.cta.label)}</span>
                <VIcon name="chevronRight" className="h-5 w-5 shrink-0" strokeWidth={2.2} />
              </Link>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
