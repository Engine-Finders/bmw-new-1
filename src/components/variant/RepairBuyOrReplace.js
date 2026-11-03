import Image from "next/image";
import Link from "next/link";
import SceneImage from "./SceneImage";
import VIcon from "./VariantIcons";
import { TagLine } from "./EraMap";
import { Rich, byKeyword, dash, fill, pageValues, plain, spaceRange, splitTags, stripMarker, ui } from "./variantUi";
import { variantFont } from "./variantFont";

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
      <Rich html={spaceRange(main)} className={`block ${/^£[\d,]+\s*[–-]\s*£[\d,]+$/.test(String(main).trim()) ? "whitespace-nowrap" : ""}`} />
      <TagLine tags={tags} className="font-normal" />
    </>
  );
}

function NavyCircle({ icon, className = "h-11 w-11 xl:h-[50px] xl:w-[50px]" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--color-v-tile)] text-white ${className}`}>
      <VIcon name={icon} className="h-[54%] w-[54%]" strokeWidth={2} />
    </span>
  );
}

function PanelHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3.5 bg-[var(--color-v-navy)] px-4 py-2 text-white [[data-theme=dark]_&]:border-b [[data-theme=dark]_&]:border-[var(--color-v-border-strong)] lg:px-5">
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white/10">
        <VIcon name={icon} className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <h3 className="text-[14.5px] font-semibold uppercase leading-tight lg:text-[18px]">{title}</h3>
    </div>
  );
}

function Status({ status, className = "" }) {
  return (
    <span className={`flex flex-wrap items-center gap-x-2 gap-y-1 md:flex-nowrap xl:gap-x-2.5 ${className}`}>
      <VIcon name={status.icon} solid className={`h-6 w-6 shrink-0 xl:h-[26px] xl:w-[26px] ${TONE_TEXT[status.tone]}`} />
      <span className="min-w-0 text-[var(--color-v-text)] [overflow-wrap:normal] [word-break:normal]">{status.text}</span>
    </span>
  );
}

function RepairTable({ block }) {
  const rows = block?.rows || [];
  const columns = block?.columns?.length === 4 ? block.columns : ["Problem", "Repairable?", "Typical Cost", "When It Makes Sense"];
  const cell = "border-r border-[var(--color-v-border)] px-3 py-2.5 align-middle last:border-r-0 xl:px-4";
  return (
    <>
      {/* Desktop and tablet: four columns */}
      <table className="hidden h-full w-full table-fixed border-collapse text-[15px] leading-[1.4] md:table xl:text-[16px]">
        <colgroup>
          <col className="w-[31%]" />
          <col className="w-[18.5%]" />
          <col className="w-[18.5%]" />
          <col className="w-[32%]" />
        </colgroup>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column} scope="col" className={`border-r border-[var(--color-v-border)] px-4 py-2 text-[15px] font-normal text-[var(--color-v-text)] last:border-r-0 ${index === 0 ? "pl-[4.75rem] text-left" : index === 3 ? "text-left" : "text-center"}`}>
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
                <td className={`${cell} text-center font-semibold xl:!px-2 xl:text-[17px] ${TONE_TEXT[status.tone]}`}>
                  <Cost value={row.typicalCost} />
                </td>
                <td className={`${cell} text-[14px] xl:text-[15px] text-[var(--color-v-muted)]`}>
                  <Rich html={row.whenItMakesSense} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Phones: one aligned block per problem: name, then status (left) and cost (right), then when it makes sense */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-4 bg-[var(--color-v-band)] px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.04em] text-[var(--color-v-muted)] [[data-theme=dark]_&]:bg-[var(--color-v-panel-soft)]">
          <span>{columns[0]}</span>
          <span className="text-right">
            {columns[1]} · {columns[2]}
          </span>
        </div>
        {rows.map((row, index) => {
          const status = parseRepairable(row.repairable);
          return (
            <div key={`${plain(row.problem)}-${index}`} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 border-t border-[var(--color-v-border)] px-4 py-3.5">
              <NavyCircle icon={byKeyword(copy.problemIcons, row.problem, "icon", "wrench")} className="mt-0.5 h-9 w-9" />
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold leading-snug text-[var(--color-v-text)]" dangerouslySetInnerHTML={{ __html: dash(row.problem) }} />
                <div className="mt-2 flex items-start justify-between gap-3">
                  <span className="flex max-w-[48%] shrink-0 items-start gap-1.5 pt-px">
                    <VIcon name={status.icon} solid className={`h-[18px] w-[18px] shrink-0 ${TONE_TEXT[status.tone]}`} />
                    <span className="text-[13px] font-medium leading-snug text-[var(--color-v-text)]">{status.text}</span>
                  </span>
                  <span className={`min-w-0 text-right text-[14px] font-semibold leading-snug ${TONE_TEXT[status.tone]}`}>
                    <Cost value={row.typicalCost} />
                  </span>
                </div>
                <Rich as="p" html={row.whenItMakesSense} className="mt-1.5 text-[13px] leading-[1.5] text-[var(--color-v-muted)]" />
              </div>
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
    <ul className="mt-1.5 flex flex-col gap-1.5 pl-2 lg:pl-[48px]">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[13px] leading-[1.35] text-[var(--color-v-text)] lg:text-[14px] lg:leading-[1.27]">
          <VIcon name={good ? "checkCircleSolid" : "xCircleSolid"} solid className={`mt-[1px] h-4 w-4 shrink-0 ${TONE_TEXT[tone]}`} />
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
        <div className="bg-[var(--color-v-green-soft)] px-4 py-4 lg:px-6 lg:py-3">
          <p className="flex items-center gap-3 lg:gap-4">
            <VIcon name="checkCircleSolid" solid className="h-7 w-7 shrink-0 text-[var(--color-v-green)] lg:h-8 lg:w-8" />
            <span className="text-[16px] font-semibold uppercase text-[var(--color-v-green)] lg:text-[20px]">{copy.buyIf}</span>
          </p>
          <CheckList items={buy} tone="green" />
        </div>
      ) : null}
      {avoid.length ? (
        <div className="flex-1 border-t border-[var(--color-v-border)] bg-[var(--color-v-red-soft)] px-4 py-4 lg:px-6 lg:py-3">
          <p className="flex items-center gap-3 lg:gap-4">
            <VIcon name="xCircleSolid" solid className="h-7 w-7 shrink-0 text-[var(--color-v-red)] lg:h-8 lg:w-8" />
            <span className="text-[16px] font-semibold uppercase text-[var(--color-v-red)] lg:text-[20px]">{copy.avoidIf}</span>
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
  const scene = data.scene;
  const lineup = Boolean(scene?.light?.lineup); // several cars in one picture: fade the left ones out
  const engine = data.engineImage;

  return (
    <section className={`${variantFont.className} section-y lg:pb-12 lg:pt-12 relative overflow-hidden border-t border-[var(--color-v-border)] bg-[var(--color-v-page)] text-[var(--color-v-text)]`}>
      <div className="site-container relative">
        {/* Phones: the scene sits behind the heading with the car at its lower right, as in the design */}
        <div className="relative">
          {scene ? (
            <div aria-hidden="true" className="pointer-events-none absolute -inset-x-[var(--gutter)] -top-6 bottom-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_78%,transparent_100%)] lg:hidden">
              <div className={`absolute -bottom-2 right-0 w-full ${lineup ? "[mask-image:linear-gradient(90deg,transparent_0%,transparent_46%,#000_64%)]" : ""}`}>
                <SceneImage
                  art={scene}
                  sizes="100vw"
                  className="h-auto w-full max-w-none [mask-image:linear-gradient(to_bottom,transparent_0%,#000_30%)]"
                />
              </div>
            </div>
          ) : null}
          {/* Desktop, as in the reference: a full-width band whose bottom is the top of the panels (so a two-line
              heading never pushes the car away from them). The scene fades in from the left and the car stands
              between ~55% and ~80% of the width, wheels just above the panels; the engine bay fills the far
              right behind a curved, light diagonal edge. Sizes are in vw so it holds at every desktop width. */}
          {scene || engine ? (
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-9 left-1/2 hidden h-[360px] w-screen -translate-x-1/2 overflow-hidden lg:block">
              {scene ? (
                <div className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent_30%,#000_50%,#000_76.5%,transparent_78.2%)]">
                  <SceneImage
                    art={scene}
                    sizes="48vw"
                    className="absolute bottom-[calc(6px-9.13vw)] left-[30.2vw] h-auto w-[48vw] max-w-none [[data-theme=dark]_&]:bottom-[calc(6px-6.76vw)]"
                  />
                </div>
              ) : null}
              {engine ? (
                <div className="absolute right-0 top-0 h-full w-[22vw]">
                  <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_90%_at_70%_35%,#2a3240_0%,#0d1118_75%)] [clip-path:polygon(0_0,100%_0,100%_100%,52%_100%)]">
                    <Image src={engine} alt="" fill sizes="22vw" className="scale-[1.4] object-cover object-[62%_45%] brightness-[0.62] contrast-[1.15] grayscale-[0.35]" />
                    <div className="absolute inset-0 bg-[linear-gradient(200deg,transparent_45%,rgba(8,12,20,0.6)_100%)]" />
                  </div>
                  {/* the arch: a light concrete wedge from the end of the scene to the engine's diagonal edge */}
                  <div className="absolute inset-0 bg-[linear-gradient(105deg,#eef1f6_0%,#dfe4ec_55%,#c9d0db_100%)] [clip-path:polygon(0_0,4%_0,52%_100%,0_100%)] [[data-theme=dark]_&]:bg-[linear-gradient(105deg,#1a2230_0%,#252f40_60%,#323d50_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(170,182,200,0.9))] [clip-path:polygon(4%_0,6.5%_0,54.5%_100%,52%_100%)] [[data-theme=dark]_&]:bg-[linear-gradient(180deg,rgba(150,165,190,0.6),rgba(80,94,118,0.5))]" />
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="relative min-w-0 max-w-[52%] lg:max-w-[calc(55vw-var(--gutter)*1.5-(100vw-min(100vw,var(--container-8xl)))/2)]">
            {/* The heading stops well short of the car; the intro may run a little closer, as in the reference. */}
            <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] lg:max-w-[calc(100%-var(--gutter)*1.5)] lg:text-[clamp(28px,2.85vw,44px)]">{dash(data.h2).replace(/^BMW\s+/i, "")}</h2>
            <p className="mt-3 text-[14px] leading-[1.55] text-[var(--color-v-text)] lg:text-[clamp(15px,1.08vw,17px)] lg:leading-[1.6]">
              {copy.intro.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:mt-9 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-3">
          {data.canItBeRepaired ? (
            <div className="flex flex-col overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)]">
              <PanelHeader icon="wrench" title={data.canItBeRepaired.title} />
              <div className="md:min-h-0 md:flex-1">
                <RepairTable block={data.canItBeRepaired} />
              </div>
            </div>
          ) : null}
          <BuyingChecks block={data.buyingChecks} />
        </div>

        {/* Closing verdict + Don't guess. Compare. Two cards on phones, one joined card on desktop. */}
        <div className="mt-5 grid gap-4 lg:mt-7 lg:grid-cols-[minmax(0,0.95fr)_auto_minmax(0,1.3fr)] lg:gap-0 lg:overflow-hidden lg:rounded-[10px] lg:border lg:border-[var(--color-v-border)] lg:bg-[var(--color-v-panel-soft)]">
          {data.closingVerdict ? (
            <div className="flex items-start gap-4 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel-soft)] p-4 lg:gap-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-6 lg:py-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-navy)] text-white lg:h-[70px] lg:w-[70px] [[data-theme=dark]_&]:bg-[var(--color-v-tile)]">
                <VIcon name="shieldCheck" solid className="h-6 w-6 lg:h-8 lg:w-8" />
              </span>
              <div>
                <p className="text-[17px] font-semibold uppercase text-[var(--color-v-blue)] lg:text-[18px]">{copy.closingLabel}</p>
                <Rich as="p" html={data.closingVerdict} className="mt-1.5 text-[14px] leading-[1.45] text-[var(--color-v-text)]" />
              </div>
            </div>
          ) : null}
          <span aria-hidden="true" className="my-5 hidden w-px bg-[var(--color-v-border-strong)] lg:block" />
          <div className={`relative grid ${engine ? "grid-cols-[auto_minmax(0,1fr)_27%]" : "grid-cols-[auto_minmax(0,1fr)]"} items-center gap-x-4 gap-y-4 overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel-soft)] p-4 lg:grid-cols-[auto_minmax(0,1fr)_30%] lg:gap-y-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-6 lg:py-4 lg:pr-2`}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full border-2 border-[var(--color-v-blue)] text-[var(--color-v-blue)] lg:h-[60px] lg:w-[60px]">
              <VIcon name="tag" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-[20px] font-bold leading-tight tracking-[-0.01em] text-[var(--color-v-text)] lg:whitespace-normal lg:text-[26px]">{copy.compareTitle}</p>
              <p className="mt-1 text-[14px] leading-[1.4] text-[var(--color-v-muted)] lg:text-[16px]">{fill(copy.compareText, values)}</p>
            </div>
            {engine ? (
              // Phones: its own column beside the text, so it can never sit over the button below.
              <div className="pointer-events-none relative aspect-square w-full lg:row-span-2 lg:aspect-auto lg:h-[150px]">
                <span aria-hidden="true" className="absolute inset-[4%] rounded-full border border-[var(--color-v-blue)] opacity-20" />
                <span aria-hidden="true" className="absolute inset-[16%] rounded-full border border-[var(--color-v-blue)] opacity-30" />
                <span aria-hidden="true" className="absolute inset-[20%] rounded-full bg-[var(--color-v-blue)] opacity-15 blur-2xl" />
                <Image src={engine} alt="" fill sizes="(min-width: 1024px) 18vw, 34vw" className="object-contain lg:scale-[1.25]" />
              </div>
            ) : null}
            {cta?.label ? (
              <Link
                href={cta.href || "/quote"}
                className="col-span-full mt-1 inline-flex w-fit items-center lg:mt-0 justify-center gap-2 whitespace-nowrap rounded-[6px] bg-[var(--color-v-blue-btn)] px-4 py-2.5 text-[clamp(12.5px,3.3vw,15px)] font-semibold lg:gap-3 lg:px-5 lg:py-2.5 lg:text-[16px] text-white transition hover:brightness-110 lg:col-span-2 lg:col-start-1 lg:w-fit lg:whitespace-nowrap lg:px-6"
              >
                {stripMarker(cta.label)}
                <VIcon name="arrowRight" className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
              </Link>
            ) : null}
          </div>
        </div>

        {/* Trust strip */}
        {/* Phones: three to a row (five across squeezed the labels to 11px); tablets up: one row of five. */}
        <ul className="mt-5 grid grid-cols-3 gap-y-4 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] px-2 py-4 md:grid-cols-5 md:gap-y-0 lg:mt-[18px] lg:px-4 lg:py-3.5">
          {copy.trust.map((item, index) => (
            <li key={item.label} className="relative flex flex-col items-center gap-2 px-1 text-center lg:flex-row lg:justify-center lg:gap-4 lg:px-3 lg:text-left">
              {index ? <span aria-hidden="true" className={`absolute left-0 top-1/2 h-[60%] w-px -translate-y-1/2 bg-[var(--color-v-border-strong)] ${index % 3 ? "" : "md:block hidden"}`} /> : null}
              <VIcon name={item.icon} solid={Boolean(item.solid) || item.icon === "users" || item.icon === "truck"} className="h-7 w-7 shrink-0 text-[var(--color-v-blue)] [[data-theme=light]_&]:text-[var(--color-v-navy)] lg:h-8 lg:w-8" />
              <span className="t-label text-[var(--color-v-text)] max-lg:!text-[13px] max-lg:leading-tight">
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
