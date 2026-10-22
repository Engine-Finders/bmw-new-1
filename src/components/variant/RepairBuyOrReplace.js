import Image from "next/image";
import Link from "next/link";
import VIcon from "./VariantIcons";
import { TagLine } from "./EraMap";
import { Rich, byKeyword, dash, fill, pageValues, plain, splitTags, stripMarker, ui } from "./variantUi";

const copy = ui.repairBuyOrReplace;

// "✅ Yes" / "❌ Usually No" / "⚠️ Sometimes" -> status + text without the emoji.
function parseRepairable(value = "") {
  const text = String(value).replace(/^[\s✅❌⚠️️]+/u, "").trim();
  if (value.includes("✅")) return { tone: "green", icon: "checkCircleSolid", text };
  if (value.includes("❌")) return { tone: "red", icon: "xCircleSolid", text };
  return { tone: "orange", icon: "alertSolid", text };
}

const TONE_TEXT = {
  green: "text-[var(--color-v-green)]",
  red: "text-[var(--color-v-red)]",
  orange: "text-[var(--color-v-orange)]",
};

// "£400–£900 [PLACEHOLDER]": the cost, then the tag on its own line.
function Cost({ value }) {
  const { main, tags } = splitTags(value);
  return (
    <>
      <Rich html={main} className="block" />
      <TagLine tags={tags} className="font-normal" />
    </>
  );
}

function NavyCircle({ icon, className = "h-11 w-11" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--color-v-tile)] text-white ${className}`}>
      <VIcon name={icon} className="h-[50%] w-[50%]" />
    </span>
  );
}

function PanelHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-4 bg-[var(--color-v-navy)] px-4 py-3 text-white [[data-theme=dark]_&]:border-b [[data-theme=dark]_&]:border-[var(--color-v-border-strong)] lg:px-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
        <VIcon name={icon} className="h-5 w-5" strokeWidth={2} />
      </span>
      <h3 className="t-body font-semibold uppercase lg:text-[length:var(--fs-p)]">{title}</h3>
    </div>
  );
}

function Status({ status, className = "" }) {
  return (
    <span className={`flex flex-wrap items-center gap-x-2 gap-y-1 xl:gap-x-3 ${className}`}>
      <VIcon name={status.icon} solid className={`h-6 w-6 shrink-0 xl:h-7 xl:w-7 ${TONE_TEXT[status.tone]}`} />
      <span className="min-w-0 text-[var(--color-v-text)]">{status.text}</span>
    </span>
  );
}

function RepairTable({ block }) {
  const rows = block?.rows || [];
  const columns = block?.columns?.length === 4 ? block.columns : ["Problem", "Repairable?", "Typical Cost", "When It Makes Sense"];
  const cell = "border-r border-[var(--color-v-border)] px-3 py-3.5 align-middle last:border-r-0 xl:px-4";
  return (
    <>
      {/* Desktop and tablet: four columns */}
      <table className="t-body hidden w-full table-fixed border-collapse md:table">
        <colgroup>
          <col className="w-[31%]" />
          <col className="w-[20%]" />
          <col className="w-[18%]" />
          <col className="w-[31%]" />
        </colgroup>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column} scope="col" className={`t-label border-r border-[var(--color-v-border)] px-4 py-3 font-normal text-[var(--color-v-text)] last:border-r-0 ${index === 0 ? "pl-[4.75rem] text-left" : index === 3 ? "text-left" : "text-center"}`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const status = parseRepairable(row.repairable);
            return (
              <tr key={`${plain(row.problem)}-${index}`} className="border-t border-[var(--color-v-border)]">
                <td className={cell}>
                  <span className="flex items-center gap-4">
                    <NavyCircle icon={byKeyword(copy.problemIcons, row.problem, "icon", "wrench")} />
                    <span className="min-w-0 font-semibold text-[var(--color-v-text)]" dangerouslySetInnerHTML={{ __html: dash(row.problem) }} />
                  </span>
                </td>
                <td className={cell}>
                  <Status status={status} className="justify-center" />
                </td>
                <td className={`${cell} text-center font-semibold ${TONE_TEXT[status.tone]}`}>
                  <Cost value={row.typicalCost} />
                </td>
                <td className={`${cell} text-[var(--color-v-muted)]`}>
                  <Rich html={row.whenItMakesSense} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Phones: "Repairable? / Typical Cost" share one header, as in the design */}
      <div className="md:hidden">
        <div className="t-label grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.05fr)_minmax(0,1fr)] gap-2 px-3 py-3 text-[var(--color-v-text)]">
          <span className="pl-10">{columns[0]}</span>
          <span>
            {columns[1]}
            <span className="block">{columns[2]}</span>
          </span>
          <span>{columns[3]}</span>
        </div>
        {rows.map((row, index) => {
          const status = parseRepairable(row.repairable);
          return (
            <div key={`${plain(row.problem)}-${index}`} className="t-body grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.05fr)_minmax(0,1fr)] items-center gap-2 border-t border-[var(--color-v-border)] px-3 py-3">
              <span className="flex items-center gap-2">
                <NavyCircle icon={byKeyword(copy.problemIcons, row.problem, "icon", "wrench")} className="h-8 w-8" />
                <span className="t-label min-w-0 font-semibold text-[var(--color-v-text)]" dangerouslySetInnerHTML={{ __html: dash(row.problem) }} />
              </span>
              <span className="flex flex-col gap-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <VIcon name={status.icon} solid className={`h-6 w-6 shrink-0 ${TONE_TEXT[status.tone]}`} />
                  <span className="t-label min-w-0 text-[var(--color-v-text)]">{status.text}</span>
                </span>
                <span className={`font-semibold ${TONE_TEXT[status.tone]}`}>
                  <Cost value={row.typicalCost} />
                </span>
              </span>
              <Rich html={row.whenItMakesSense} className="t-label text-[var(--color-v-muted)]" />
            </div>
          );
        })}
      </div>
    </>
  );
}

function CheckList({ items, tone }) {
  const good = tone === "green";
  return (
    <ul className="mt-3 flex flex-col gap-2 pl-0 lg:pl-[52px]">
      {items.map((item) => (
        <li key={item} className="t-body flex gap-3 text-[var(--color-v-text)]">
          <VIcon name={good ? "checkCircleSolid" : "xCircleSolid"} solid className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${TONE_TEXT[tone]}`} />
          <Rich html={stripMarker(item)} />
        </li>
      ))}
    </ul>
  );
}

function BuyingChecks({ block }) {
  if (!block) return null;
  const buy = block.buyIf || [];
  const avoid = block.avoidIf || [];
  return (
    <div className="flex flex-col overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)]">
      <PanelHeader icon="search" title={block.title} />
      {buy.length ? (
        <div className="bg-[var(--color-v-green-soft)] px-4 py-5 lg:px-5">
          <p className="flex items-center gap-4">
            <VIcon name="checkCircleSolid" solid className="h-9 w-9 shrink-0 text-[var(--color-v-green)]" />
            <span className="t-h6 uppercase text-[var(--color-v-green)]">{copy.buyIf}</span>
          </p>
          <CheckList items={buy} tone="green" />
        </div>
      ) : null}
      {avoid.length ? (
        <div className="flex-1 border-t border-[var(--color-v-border)] bg-[var(--color-v-red-soft)] px-4 py-5 lg:px-5">
          <p className="flex items-center gap-4">
            <VIcon name="xCircleSolid" solid className="h-9 w-9 shrink-0 text-[var(--color-v-red)]" />
            <span className="t-h6 uppercase text-[var(--color-v-red)]">{copy.avoidIf}</span>
          </p>
          <CheckList items={avoid} tone="red" />
        </div>
      ) : null}
    </div>
  );
}

export default function RepairBuyOrReplace({ data, vehicle }) {
  if (!data) return null;
  const values = pageValues(vehicle || data.vehicle);
  const cta = data.cta;
  const car = data.image;
  const engine = data.engineImage;

  return (
    <section className="section-y relative overflow-hidden border-t border-[var(--color-v-border)] bg-[var(--color-v-page)] text-[var(--color-v-text)]">
      {/* Desktop: car on an angled panel with the engine, top right */}
      {car || engine ? (
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 hidden h-[300px] w-[48%] lg:block">
          {engine ? (
            <div className="absolute inset-y-0 right-0 w-[46%] overflow-hidden bg-[linear-gradient(135deg,var(--color-v-tile),var(--color-v-banner))] [clip-path:polygon(28%_0,100%_0,100%_100%,0_100%)]">
              <Image src={engine} alt="" fill sizes="22vw" className="scale-125 object-cover object-center opacity-90" />
            </div>
          ) : null}
          {car ? (
            <div className="absolute bottom-[2%] right-[30%] aspect-[3/2] w-[62%]">
              <span className="absolute inset-x-[8%] bottom-[5%] h-[12%] rounded-[50%] bg-black/35 blur-xl" />
              <Image src={car} alt="" fill sizes="30vw" className="object-contain" />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="site-container relative">
        <div className="flex items-end gap-2 lg:block lg:min-h-[180px]">
          <div className="min-w-0 flex-1 lg:max-w-[52%]">
            <h2 className="t-h2">{dash(data.h2)}</h2>
            <p className="t-p mt-3 text-[var(--color-v-text)]">
              {copy.intro.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </p>
          </div>
          {car ? (
            <div className="pointer-events-none relative -mr-[var(--gutter)] aspect-[3/2] w-[46%] shrink-0 lg:hidden">
              <Image src={car} alt={`BMW ${values.variant}`} fill sizes="46vw" className="object-contain" />
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-4">
          {data.canItBeRepaired ? (
            <div className="overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)]">
              <PanelHeader icon="wrench" title={data.canItBeRepaired.title} />
              <RepairTable block={data.canItBeRepaired} />
            </div>
          ) : null}
          <BuyingChecks block={data.buyingChecks} />
        </div>

        {/* Closing verdict + Don't guess. Compare. */}
        <div className="mt-5 grid gap-4 lg:grid-cols-1">
          <div className="grid overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel-soft)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)]">
            {data.closingVerdict ? (
              <div className="flex items-start gap-5 p-5 lg:p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-navy)] text-white lg:h-16 lg:w-16 [[data-theme=dark]_&]:bg-[var(--color-v-tile)]">
                  <VIcon name="shieldCheck" className="h-7 w-7 lg:h-8 lg:w-8" />
                </span>
                <div>
                  <p className="t-h6 uppercase text-[var(--color-v-blue)]">{copy.closingLabel}</p>
                  <Rich as="p" html={data.closingVerdict} className="t-body mt-2 text-[var(--color-v-text)]" />
                </div>
              </div>
            ) : null}
            <span aria-hidden="true" className="my-6 hidden w-px bg-[var(--color-v-border-strong)] lg:block" />
            <div className="grid grid-cols-[auto_minmax(0,1fr)_32%] items-center gap-x-4 gap-y-4 border-t border-[var(--color-v-border)] p-5 sm:grid-cols-[auto_minmax(0,1fr)_34%] lg:border-t-0 lg:p-6 lg:pr-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full border-2 border-[var(--color-v-blue)] text-[var(--color-v-blue)] lg:h-14 lg:w-14">
                <VIcon name="tag" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="t-h5 font-bold text-[var(--color-v-text)] lg:text-[length:var(--fs-h4)]">{copy.compareTitle}</p>
                <p className="t-body mt-1 text-[var(--color-v-muted)]">{fill(copy.compareText, values)}</p>
              </div>
              {engine ? (
                <div className="pointer-events-none relative row-span-1 aspect-square w-full sm:row-span-2">
                  <span aria-hidden="true" className="absolute inset-[4%] rounded-full border border-[var(--color-v-blue)] opacity-20" />
                  <span aria-hidden="true" className="absolute inset-[16%] rounded-full border border-[var(--color-v-blue)] opacity-30" />
                  <span aria-hidden="true" className="absolute inset-[20%] rounded-full bg-[var(--color-v-blue)] opacity-15 blur-2xl" />
                  <Image src={engine} alt="" fill sizes="(min-width: 1024px) 18vw, 34vw" className="object-contain" />
                </div>
              ) : <span />}
              {cta?.label ? (
                <Link
                  href={cta.href || "/quote"}
                  className="t-body col-span-3 inline-flex items-center justify-center gap-3 rounded-[6px] bg-[var(--color-v-blue-btn)] px-6 py-3 font-semibold text-white transition hover:brightness-110 sm:col-span-1 sm:col-start-2 sm:w-fit"
                >
                  {stripMarker(cta.label)}
                  <VIcon name="arrowRight" className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <ul className="mt-5 grid grid-cols-5 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] px-2 py-4 lg:px-4">
          {copy.trust.map((item, index) => (
            <li key={item.label} className="relative flex flex-col items-center gap-2 px-1 text-center lg:flex-row lg:justify-center lg:gap-4 lg:px-3 lg:text-left">
              {index ? <span aria-hidden="true" className="absolute left-0 top-1/2 h-[60%] w-px -translate-y-1/2 bg-[var(--color-v-border-strong)]" /> : null}
              <VIcon name={item.icon} solid={item.icon === "users" || item.icon === "truck"} className="h-7 w-7 shrink-0 text-[var(--color-v-blue)] [[data-theme=light]_&]:text-[var(--color-v-navy)] lg:h-8 lg:w-8" />
              <span className="t-label text-[var(--color-v-text)]">
                <span className="block">{fill(item.label, values)}</span>
                <span className="block text-[var(--color-v-muted)]">{item.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
