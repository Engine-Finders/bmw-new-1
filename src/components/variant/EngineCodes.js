import Image from "next/image";
import Link from "next/link";
import VIcon from "./VariantIcons";
import { Tabs } from "./VariantToggles";
import { TagLine } from "./EraMap";
import { byKeyword, dash, plain, splitTags, stripMarker, ui } from "./variantUi";

const copy = ui.engineCodes;
const FIELDS = ["engineCode", "years", "power", "enquiries", "avgReconCost"];

// "- (within 1,450 JLR-wide N47 figure) [TAG]" -> "—" over the bracketed note; values keep their tag.
function Enquiries({ value, align = "center" }) {
  const { main, tags } = splitTags(value);
  const dashed = main.match(/^[-–—]\s*(.*)$/);
  return (
    <span className={`block ${align === "center" ? "text-center" : "text-right"}`}>
      {dashed ? (
        <>
          <span className="block">—</span>
          {dashed[1] ? <span className="t-label block text-[var(--color-v-muted)]">{dashed[1]}</span> : null}
        </>
      ) : main ? (
        <span className="block">{main}</span>
      ) : null}
      <TagLine tags={tags} />
    </span>
  );
}

function Cost({ value, align = "center" }) {
  const { main, tags } = splitTags(value);
  return (
    <span className={`block ${align === "center" ? "text-center" : "text-right"}`}>
      <span className="block">{main}</span>
      <TagLine tags={tags} />
    </span>
  );
}

// Tab label: the family for a combined entry ("M47D20 / M47TU / M47TU2" -> "M47"), else the code.
function shortCode(code = "") {
  const clean = plain(code).replace(/\s*\([^)]*\)/g, "").trim();
  if (clean.includes("/")) return clean.split("/")[0].trim().match(/^[A-Z]+\d+/i)?.[0] || clean.split("/")[0].trim();
  return clean;
}

// "Technical Specs (current B47D20 generation):" -> "current B47D20 generation"
function specsLabel(title = "") {
  const match = String(title).match(/\(([^)]*)\)/);
  return match ? dash(match[1]) : "";
}

function EngineThumb({ src, className = "h-14 w-[72px]" }) {
  if (!src) return null;
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <Image src={src} alt="" fill sizes="96px" className="object-contain" />
    </span>
  );
}

function SpecsCard({ specs }) {
  const items = specs?.items || [];
  if (!items.length) return null;
  const label = specsLabel(specs.title);
  return (
    <div className="rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-5 shadow-[0_6px_18px_var(--color-v-shadow)]">
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="t-h6 uppercase text-[var(--color-v-text)]">{copy.specsTitle}</span>
        {label ? <span className="t-label uppercase text-[var(--color-v-blue)]">{label}</span> : null}
      </p>
      <dl className="mt-3">
        {items.map((item, index) => {
          const name = stripMarker(item.label);
          return (
            <div key={`${name}-${index}`} className="t-body grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] border-t border-[var(--color-v-border)]">
              <dt className="flex min-w-0 items-center gap-3 border-r border-[var(--color-v-border)] py-2.5 pr-3 text-[var(--color-v-text)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-blue-soft)] text-[var(--color-v-blue)] lg:h-auto lg:w-auto lg:bg-transparent">
                  <VIcon name={byKeyword(copy.specIcons, name, "icon", "gear")} className="h-5 w-5" />
                </span>
                <span className="min-w-0">{name}</span>
              </dt>
              <dd className="min-w-0 py-2.5 pl-4 text-[var(--color-v-text)]">{dash(item.value)}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

function CtaCard({ cta, engine }) {
  if (!cta?.label) return null;
  return (
    <Link
      href={cta.href || "/quote"}
      className="group relative isolate flex items-center gap-5 overflow-hidden rounded-[10px] bg-[var(--color-v-blue-btn)] p-5 font-normal text-white shadow-[0_14px_34px_var(--color-v-shadow)] lg:p-6 [[data-theme=dark]_&]:bg-[var(--color-v-tile)]"
    >
      {engine ? (
        <span aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[55%] opacity-40 mix-blend-luminosity">
          <Image src={engine} alt="" fill sizes="20vw" className="object-cover object-left" />
          <span className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-v-blue-btn)_0%,transparent_60%)] [[data-theme=dark]_&]:bg-[linear-gradient(90deg,var(--color-v-tile)_0%,transparent_60%)]" />
        </span>
      ) : null}
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/80">
        <VIcon name="arrowRight" className="h-7 w-7" strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="t-h5 block font-bold text-white">{stripMarker(cta.label)}</span>
        <span className="t-body mt-1 block text-white/90">{copy.ctaSubline}</span>
      </span>
    </Link>
  );
}

function MatchNote({ note }) {
  if (!note) return null;
  const text = dash(note);
  const match = text.match(new RegExp(copy.eraMapPhraseMatch));
  if (!match) return <p className="t-p mt-2 text-[var(--color-v-text)]">{text}</p>;
  return (
    <p className="t-p mt-2 text-[var(--color-v-text)]">
      {text.slice(0, match.index)}
      <Link href="#era-map" className="font-normal text-[var(--color-v-blue)] hover:underline">
        {match[0]}
      </Link>
      {text.slice(match.index + match[0].length)}
    </p>
  );
}

export default function EngineCodes({ data }) {
  const rows = data?.rows || [];
  if (!rows.length) return null;
  const columns = data.columns?.length === FIELDS.length ? data.columns : ["Engine Code", "Years", "Power", "2025 Enquiries", "Avg. Recon Cost"];
  const cell = "border-r border-[var(--color-v-border)] px-3 py-3 align-middle last:border-r-0";

  const tabs = rows.map((row, index) => ({
    key: `${plain(row.engineCode)}-${index}`,
    label: (
      <>
        <span className="t-body block font-semibold">{shortCode(row.engineCode)}</span>
        <span className="t-label block">{dash(row.years)}</span>
      </>
    ),
    panel: (
      <div className="rounded-b-[10px] rounded-tr-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-4 shadow-[0_6px_18px_var(--color-v-shadow)]">
        <div className="flex items-center gap-4">
          <span className="relative block aspect-square w-[38%] shrink-0">
            {row.image ? <Image src={row.image} alt={plain(row.engineCode)} fill sizes="40vw" className="object-contain" /> : null}
          </span>
          <p className="t-h5 font-bold text-[var(--color-v-text)]">{plain(row.engineCode)}</p>
        </div>
        <dl className="mt-2">
          {FIELDS.slice(1).map((field, fieldIndex) => (
            <div key={field} className="t-body flex items-center gap-3 border-t border-[var(--color-v-border)] py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-blue-soft)] text-[var(--color-v-blue)]">
                <VIcon name={copy.mobileRows[field]} className="h-5 w-5" />
              </span>
              <dt className="shrink-0 text-[var(--color-v-text)]">{columns[fieldIndex + 1]}</dt>
              <dd className="min-w-0 flex-1 text-right text-[var(--color-v-text)]">
                {field === "enquiries" ? <Enquiries value={row.enquiries} align="right" /> : field === "avgReconCost" ? <Cost value={row.avgReconCost} align="right" /> : dash(row[field])}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    ),
  }));

  return (
    <section className="section-y border-t border-[var(--color-v-border)] bg-[var(--color-v-page)] text-[var(--color-v-text)]">
      <div className="site-container grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:gap-8">
        <div className="min-w-0">
          <h2 className="t-h2 uppercase">{copy.h2}</h2>
          <MatchNote note={data.matchNote} />

          <div className="mt-5 lg:hidden">
            <Tabs
              tabs={tabs}
              label={copy.h2}
              listClassName="flex gap-1.5 overflow-x-auto"
              tabClassName="min-w-[88px] flex-[1_0_auto] whitespace-nowrap rounded-t-[10px] border border-b-0 px-3 py-2.5 text-center"
              activeClassName="border-[var(--color-v-tile)] bg-[var(--color-v-tile)] text-white"
              inactiveClassName="border-[var(--color-v-border)] bg-[var(--color-v-panel)] text-[var(--color-v-text)]"
            />
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] shadow-[0_10px_30px_var(--color-v-shadow)] lg:block">
            <table className="t-body w-full table-fixed border-collapse">
              <colgroup>
                <col className="w-[27%]" />
                <col className="w-[17%]" />
                <col className="w-[14%]" />
                <col className="w-[21%]" />
                <col className="w-[21%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--color-v-navy)] text-white [[data-theme=dark]_&]:border-b [[data-theme=dark]_&]:border-[var(--color-v-border-strong)]">
                  {columns.map((column, index) => (
                    <th key={column} scope="col" className={`t-label border-r border-[var(--color-v-navy-line)] px-4 py-3 font-semibold last:border-r-0 text-center`}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${plain(row.engineCode)}-${index}`} className="border-t border-[var(--color-v-border)] first:border-t-0">
                    <td className={cell}>
                      <span className="flex items-center gap-3">
                        <EngineThumb src={row.image} />
                        <span className="min-w-0 font-semibold text-[var(--color-v-blue)]">{plain(row.engineCode)}</span>
                      </span>
                    </td>
                    <td className={`${cell} text-center`}>{dash(row.years)}</td>
                    <td className={`${cell} break-words text-center`}>{dash(row.power)}</td>
                    <td className={cell}>
                      <Enquiries value={row.enquiries} />
                    </td>
                    <td className={cell}>
                      <Cost value={row.avgReconCost} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SpecsCard specs={data.technicalSpecs} />
          <CtaCard cta={data.cta} engine={data.engineImage} />
        </div>
      </div>
    </section>
  );
}
