import Image from "next/image";
import Link from "next/link";
import VIcon from "./VariantIcons";
import { Tabs } from "./VariantToggles";
import { TagLine } from "./EraMap";
import { byKeyword, dash, plain, splitTags, stripMarker, ui } from "./variantUi";
import { variantFont } from "./variantFont";

const copy = ui.engineCodes;
const FIELDS = ["engineCode", "years", "power", "enquiries", "avgReconCost"];

// Short values ("2015/16–present", "190–224 bhp") stay on one line; longer ones may wrap.
const short = (value = "") => plain(value).length <= 16;

// "- (within 1,450 JLR-wide N47 figure) [TAG]" -> "—" over the bracketed note; values keep their tag.
function Enquiries({ value, align = "center" }) {
  const { main, tags } = splitTags(value);
  const dashed = main.match(/^[-–—]\s*(.*)$/);
  return (
    <span className={`block ${align === "center" ? "text-center" : "text-right"}`}>
      {dashed ? (
        <>
          <span className="block">—</span>
          {dashed[1] ? <span className="t-label block text-[var(--color-v-muted)] lg:!text-[clamp(11.5px,0.82vw,13.5px)] lg:leading-snug">{dashed[1]}</span> : null}
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

function EngineThumb({ src, className = "h-[clamp(40px,3.2vw,52px)] w-[clamp(46px,3.8vw,60px)]" }) {
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
    <div className="rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-5 shadow-[0_6px_18px_var(--color-v-shadow)] lg:rounded-[8px] lg:px-[clamp(16px,1.6vw,26px)] lg:pb-[clamp(8px,0.8vw,14px)] lg:pt-[clamp(14px,1.2vw,20px)]">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[length:var(--fs-p)] font-medium uppercase text-[var(--color-v-text)] lg:text-[clamp(15px,1.2vw,20px)]">{copy.specsTitle}</span>
        {label ? <span className="t-label uppercase tracking-normal text-[var(--color-v-blue)] lg:text-[clamp(10.5px,0.75vw,12.5px)]">{label}</span> : null}
      </p>
      <dl className="mt-3 lg:mt-[clamp(8px,0.8vw,14px)]">
        {items.map((item, index) => {
          const name = stripMarker(item.label);
          return (
            <div key={`${name}-${index}`} className="t-body grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center border-t max-lg:text-[14px] border-[var(--color-v-border)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:text-[clamp(12.5px,0.93vw,15px)] lg:leading-snug">
              <dt className="flex min-w-0 items-center gap-3 py-2.5 pr-3 text-[var(--color-v-text)] lg:gap-[clamp(10px,1vw,16px)] lg:border-r lg:border-[var(--color-v-border)] lg:py-[clamp(5px,0.4vw,8px)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-blue-soft)] text-[var(--color-v-blue)] lg:h-auto lg:w-auto lg:bg-transparent">
                  <VIcon name={byKeyword(copy.specIcons, name, "icon", "gear")} className="h-5 w-5" />
                </span>
                <span className="min-w-0">{name}</span>
              </dt>
              <dd className="min-w-0 py-2.5 pl-2 text-[var(--color-v-text)] lg:py-[clamp(5px,0.4vw,8px)] lg:pl-[clamp(12px,1.5vw,24px)]">{dash(item.value)}</dd>
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
      className="group relative isolate flex items-center gap-5 overflow-hidden rounded-[10px] bg-[linear-gradient(100deg,#00296f_0%,#022b73_45%,#0a1a35_100%)] p-5 font-normal text-white shadow-[0_14px_34px_var(--color-v-shadow)] lg:min-h-[clamp(110px,8.6vw,140px)] lg:gap-[clamp(14px,1.4vw,22px)] lg:rounded-[8px] lg:px-[clamp(18px,1.6vw,26px)] lg:py-[clamp(16px,1.4vw,22px)] [[data-theme=dark]_&]:bg-[var(--color-v-tile)]"
    >
      {engine ? (
        <span aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[55%] opacity-40 mix-blend-luminosity">
          <Image src={engine} alt="" fill sizes="20vw" className="object-cover object-left" />
          <span className="absolute inset-0 bg-[linear-gradient(90deg,#022b73_0%,transparent_60%)] [[data-theme=dark]_&]:bg-[linear-gradient(90deg,var(--color-v-tile)_0%,transparent_60%)]" />
        </span>
      ) : null}
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/80 lg:h-[clamp(40px,3vw,48px)] lg:w-[clamp(40px,3vw,48px)] lg:self-start lg:mt-1">
        <VIcon name="arrowRight" className="h-7 w-7" strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="t-h5 block font-bold text-white lg:max-w-[20ch] lg:text-[clamp(19px,1.7vw,28px)] lg:font-semibold lg:leading-[1.15]">{stripMarker(cta.label)}</span>
        <span className="t-body mt-1 block text-white/90 lg:mt-[clamp(6px,0.6vw,10px)] lg:max-w-[24ch] lg:text-[clamp(13px,0.98vw,16px)] lg:leading-snug">{copy.ctaSubline}</span>
      </span>
    </Link>
  );
}

function MatchNote({ note }) {
  if (!note) return null;
  const text = dash(note);
  const match = text.match(new RegExp(copy.eraMapPhraseMatch));
  if (!match) return <p className="t-p mt-2 text-[var(--color-v-text)] max-lg:text-[14.5px] lg:mt-[clamp(6px,0.6vw,10px)] lg:text-[clamp(14px,0.98vw,16px)]">{text}</p>;
  return (
    <p className="t-p mt-2 text-[var(--color-v-text)] max-lg:text-[14.5px] lg:mt-[clamp(6px,0.6vw,10px)] lg:text-[clamp(14px,0.98vw,16px)]">
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
  const cell = "border-r border-[var(--color-v-border)] px-2.5 py-[clamp(6px,0.5vw,9px)] align-middle last:border-r-0";

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
        <div className="grid grid-cols-[28%_minmax(0,1fr)] items-start gap-x-2">
          <span className="relative block aspect-[3/4] w-full self-center">
            {row.image ? <Image src={row.image} alt={plain(row.engineCode)} fill sizes="34vw" className="object-contain" /> : null}
          </span>
          <div className="min-w-0">
        <p className="t-h6 font-bold text-[var(--color-v-text)]">{plain(row.engineCode)}</p>
        <dl className="mt-1">
          {FIELDS.slice(1).map((field, fieldIndex) => (
            <div key={field} className="flex items-center gap-1.5 border-t border-[var(--color-v-border)] py-2 text-[13px] leading-snug">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-blue-soft)] text-[var(--color-v-blue)]">
                <VIcon name={copy.mobileRows[field]} className="h-3.5 w-3.5" />
              </span>
              <dt className="shrink-0 text-[var(--color-v-text)]">{columns[fieldIndex + 1]}</dt>
              <dd className="min-w-0 flex-1 text-right text-[var(--color-v-text)] [overflow-wrap:normal] [&_*]:[overflow-wrap:normal] [&_.t-label]:!text-[12.5px]">
                {field === "enquiries" ? <Enquiries value={row.enquiries} align="right" /> : field === "avgReconCost" ? <Cost value={row.avgReconCost} align="right" /> : dash(row[field])}
              </dd>
            </div>
          ))}
        </dl>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <section className={`${variantFont.className} section-y lg:pb-[clamp(26px,2.2vw,40px)] lg:pt-[clamp(26px,2.3vw,40px)] border-t border-[var(--color-v-border)] bg-[var(--color-v-page)] text-[var(--color-v-text)]`}>
      <div className="site-container grid gap-6 lg:grid-cols-[minmax(0,1.59fr)_minmax(0,1fr)] lg:gap-[clamp(24px,2.6vw,44px)]">
        <div className="min-w-0">
          <h2 className="t-h2 font-bold uppercase lg:pt-[clamp(4px,0.5vw,8px)] lg:text-[clamp(28px,2.65vw,44px)] lg:leading-none lg:tracking-[-0.01em]">{copy.h2}</h2>
          <MatchNote note={data.matchNote} />

          <div className="mt-5 lg:hidden">
            <Tabs
              tabs={tabs}
              label={copy.h2}
              listClassName="flex gap-1.5"
              tabClassName="min-w-0 flex-1 rounded-t-[10px] border border-b-0 px-1 py-2.5 text-center [&_.t-label]:text-[12.5px] [&_.t-body]:text-[length:var(--fs-label)]"
              activeClassName="border-[var(--color-v-tile)] bg-[var(--color-v-tile)] text-white"
              inactiveClassName="border-[var(--color-v-border)] bg-[var(--color-v-panel)] text-[var(--color-v-text)]"
            />
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] shadow-[0_10px_30px_var(--color-v-shadow)] lg:mt-[clamp(14px,1.1vw,20px)] lg:block lg:rounded-[6px]">
            <table className="w-full table-fixed border-collapse text-[clamp(13px,0.98vw,16px)] leading-snug">
              <colgroup>
                <col className="w-[30%]" />
                <col className="w-[16.5%]" />
                <col className="w-[14%]" />
                <col className="w-[18.5%]" />
                <col className="w-[21%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--color-v-navy)] text-white [[data-theme=dark]_&]:border-b [[data-theme=dark]_&]:border-[var(--color-v-border-strong)]">
                  {columns.map((column, index) => (
                    <th key={column} scope="col" className={`border-r border-[var(--color-v-navy-line)] px-3 py-[clamp(8px,0.6vw,11px)] text-[clamp(12px,0.85vw,14px)] font-medium last:border-r-0 text-center`}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${plain(row.engineCode)}-${index}`} className="border-t border-[var(--color-v-border)] first:border-t-0">
                    <td className={cell}>
                      <span className="flex items-center gap-[clamp(8px,0.9vw,14px)]">
                        <EngineThumb src={row.image} />
                        <span className="min-w-0 text-[clamp(14px,1.05vw,17px)] font-medium text-[var(--color-v-blue)]">{plain(row.engineCode)}</span>
                      </span>
                    </td>
                    <td className={`${cell} text-center ${short(row.years) ? "xl:whitespace-nowrap" : ""}`}>{dash(row.years)}</td>
                    <td className={`${cell} break-words text-center ${short(row.power) ? "xl:whitespace-nowrap" : ""}`}>{dash(row.power)}</td>
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

        <div className="flex flex-col gap-4 lg:gap-[clamp(10px,0.9vw,16px)]">
          <SpecsCard specs={data.technicalSpecs} />
          <CtaCard cta={data.cta} engine={data.engineImage} />
        </div>
      </div>
    </section>
  );
}
