import Image from "next/image";
import VIcon, { Stars } from "./VariantIcons";
import { Disclosure } from "./VariantToggles";
import { RICH_LINKS, countWord, dash, fill, plain, splitTags, parseStars, titleCaseShouting, ui } from "./variantUi";

const copy = ui.eraMap;
const LINKS = "[&_a]:font-[inherit] [&_a]:text-inherit hover:[&_a]:underline";

/** Blue tag line: "[BMW-VERIFIED]". */
export function TagLine({ tags = [], className = "" }) {
  if (!tags.length) return null;
  return (
    <span className={`t-label block text-[var(--color-v-blue)] ${className}`}>
      {tags.map((tag) => `[${tag}]`).join(" ")}
    </span>
  );
}

// "M47 (M47D20 → M47TU → M47TU2)": codes in weight 600, the bracketed detail in regular weight.
function EngineCode({ value, align = "center" }) {
  const parts = String(value || "").split(/(\([^)]*\))/).filter((part) => part.trim());
  return (
    <span className={`block ${RICH_LINKS} ${align === "center" ? "text-center" : "text-left"}`}>
      {parts.map((part, index) =>
        part.startsWith("(") ? (
          <span key={index} className={`block font-normal text-[var(--color-v-muted)] ${align === "left" ? "t-label" : ""}`} dangerouslySetInnerHTML={{ __html: part }} />
        ) : (
          <span key={index} className="block font-semibold text-[var(--color-v-text)]" dangerouslySetInnerHTML={{ __html: part.trim() }} />
        ),
      )}
    </span>
  );
}

function starColor(rating) {
  return rating >= 4 ? "var(--color-v-star-green)" : "var(--color-v-star-amber)";
}

// "★★★☆☆ pre-facelift / ★★★★☆ post-facelift [TAG]" -> one star row per part, divided.
function Reliability({ value, align = "center", starClass = "h-5 w-5" }) {
  const { main, tags } = splitTags(value);
  const parts = main.split(/\s+\/\s+(?=[★☆])/).map(parseStars).filter(Boolean);
  if (!parts.length) {
    return (
      <span className={`block ${align === "center" ? "text-center" : "text-left"}`}>
        <span className="block" dangerouslySetInnerHTML={{ __html: main }} />
        <TagLine tags={tags} />
      </span>
    );
  }
  return (
    <span className={`flex flex-col gap-2 ${align === "center" ? "items-center text-center" : "items-start text-left"}`}>
      {parts.map((part, index) => (
        <span key={index} className={`flex flex-col gap-1 ${align === "center" ? "items-center" : "items-start"} ${index ? "w-full border-t border-[var(--color-v-border)] pt-2" : ""}`}>
          <Stars rating={part.rating} className={starClass} color={starColor(part.rating)} />
          {part.caption ? <span className="t-label text-[var(--color-v-muted)]">{part.caption}</span> : null}
        </span>
      ))}
      <TagLine tags={tags} />
    </span>
  );
}

// "£3,000–£5,200 (N47) / £3,400–£5,800 (B47) [PLACEHOLDER]"
function ReconCost({ value, align = "center" }) {
  const { main, tags } = splitTags(value);
  return (
    <span className={`block ${align === "center" ? "text-center" : "text-left"}`}>
      {main.split(/\s+\/\s+/).map((part, index) => {
        const match = part.match(/^(.*?)\s*(\([^)]*\))$/);
        return (
          <span key={index} className="t-body block font-semibold text-[var(--color-v-blue)] lg:whitespace-nowrap">
            {match ? match[1] : part}
            {match ? <span className="t-label font-normal"> {match[2]}</span> : null}
          </span>
        );
      })}
      <TagLine tags={tags} className="mt-0.5" />
    </span>
  );
}

function CarImage({ src, generation, sizes }) {
  if (!src) return null;
  return (
    <span className="relative mt-1 block aspect-[16/9] w-full max-w-[150px]">
      <Image src={src} alt={`BMW ${plain(generation)}`} fill sizes={sizes} className="object-contain object-left" />
    </span>
  );
}

function MobileCard({ row }) {
  const summary = (
    <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,0.8fr)_minmax(0,0.95fr)_minmax(0,1.25fr)] gap-2 [overflow-wrap:anywhere] sm:gap-3">
      <span className="flex min-w-0 flex-col items-start gap-1.5">
        <span className="t-body max-w-full rounded-[6px] bg-[var(--color-v-blue-btn)] px-2.5 py-1 font-semibold text-white [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: row.generation }} />
        <span className="t-body text-[var(--color-v-text)]" dangerouslySetInnerHTML={{ __html: row.years }} />
        <CarImage src={row.image} generation={row.generation} sizes="120px" />
      </span>
      <span className="min-w-0 border-l border-[var(--color-v-border)] pl-2 sm:pl-3">
        <span className="t-label block text-[var(--color-v-soft)]">{copy.columns[2]}</span>
        <span className="t-body mt-1 block">
          <EngineCode value={row.engineCode} align="left" />
        </span>
      </span>
      <span className="flex min-w-0 flex-col gap-3 border-l border-[var(--color-v-border)] pl-2 sm:pl-3">
        <span>
          <span className="t-label block text-[var(--color-v-soft)]">{copy.columns[3]}</span>
          <span className="mt-1 block">
            <Reliability value={row.reliability} align="left" starClass="h-4 w-4" />
          </span>
        </span>
        <span>
          <span className="t-label block text-[var(--color-v-soft)]">{copy.columns[4]}</span>
          <span className="mt-1 block">
            <ReconCost value={row.reconCost} align="left" />
          </span>
        </span>
      </span>
    </span>
  );

  return (
    <Disclosure
      summary={summary}
      className="rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] shadow-[0_6px_18px_var(--color-v-shadow)]"
      headerClassName="flex items-center gap-1.5 p-3.5 sm:gap-2 sm:p-4"
      chevronClassName="h-5 w-5 text-[var(--color-v-text)]"
      bodyClassName="mx-4 border-t border-[var(--color-v-border)] pb-4 pt-3"
    >
      <p className="t-label text-[var(--color-v-soft)]">{copy.columns[5]}</p>
      <p className={`t-body mt-1 text-[var(--color-v-text)] ${LINKS}`} dangerouslySetInnerHTML={{ __html: dash(row.eraNote) }} />
    </Disclosure>
  );
}

export default function EraMap({ data }) {
  const rows = data?.rows || [];
  if (!rows.length) return null;

  const count = countWord(rows.length);
  const plural = rows.length === 1 ? 0 : 1;
  const subtitle = fill(copy.subtitle, { count, generations: copy.generationWord[plural], eras: copy.eraWord[plural] });
  const cell = "border-r border-[var(--color-v-border)] px-4 py-4 align-middle last:border-r-0";

  return (
    <section id="era-map" className="section-y scroll-mt-24 bg-[var(--color-v-page)] text-[var(--color-v-text)]">
      <div className="site-container">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 lg:gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-v-tile)] text-white [[data-theme=dark]_&]:border [[data-theme=dark]_&]:border-[var(--color-v-border-strong)] [[data-theme=dark]_&]:bg-[var(--color-v-panel)] [[data-theme=dark]_&]:text-[var(--color-v-blue)]">
              <VIcon name="calendarDays" className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <h2 className="t-h2" dangerouslySetInnerHTML={{ __html: titleCaseShouting(dash(data.title)) }} />
              <p className="t-p mt-2 text-[var(--color-v-muted)]">{subtitle}</p>
            </div>
          </div>
          {data.sourceNote ? (
            <aside className="hidden shrink-0 items-start gap-3 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-4 md:flex md:max-w-[300px] lg:max-w-[320px]">
              <VIcon name="info" className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-v-blue)]" />
              <p className="t-label text-[var(--color-v-muted)]">{dash(data.sourceNote)}</p>
            </aside>
          ) : null}
        </div>

        {/* Phones and tablets: one card per generation */}
        <div className="mt-6 flex flex-col gap-4 lg:hidden">
          {rows.map((row, index) => (
            <MobileCard key={`${plain(row.generation)}-${index}`} row={row} />
          ))}
        </div>

        {/* Desktop table */}
        <div className="mt-7 hidden overflow-hidden rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] shadow-[0_10px_30px_var(--color-v-shadow)] lg:block">
          <table className="t-body w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[17%]" />
              <col className="w-[11%]" />
              <col className="w-[13.5%]" />
              <col className="w-[15.5%]" />
              <col className="w-[17%]" />
              <col className="w-[26%]" />
            </colgroup>
            <thead>
              <tr className="bg-[var(--color-v-navy)] text-white [[data-theme=dark]_&]:border-b [[data-theme=dark]_&]:border-[var(--color-v-border-strong)]">
                {copy.columns.map((column) => (
                  <th key={column} scope="col" className="t-label border-r border-[var(--color-v-navy-line)] px-4 py-3.5 text-center font-semibold last:border-r-0">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${plain(row.generation)}-${index}`} className="border-t border-[var(--color-v-border)] first:border-t-0">
                  <td className={`${cell} text-left`}>
                    <span className="t-h6 block font-semibold text-[var(--color-v-blue)] [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: row.generation }} />
                    <CarImage src={row.image} generation={row.generation} sizes="150px" />
                  </td>
                  <td className={`${cell} text-center`} dangerouslySetInnerHTML={{ __html: row.years }} />
                  <td className={cell}>
                    <EngineCode value={row.engineCode} />
                  </td>
                  <td className={cell}>
                    <Reliability value={row.reliability} />
                  </td>
                  <td className={cell}>
                    <ReconCost value={row.reconCost} />
                  </td>
                  <td className={`${cell} text-left text-[var(--color-v-text)] ${LINKS}`} dangerouslySetInnerHTML={{ __html: dash(row.eraNote) }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Why use this era map? */}
        <div className="mt-6 flex flex-col gap-5 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel-soft)] p-5 lg:flex-row lg:items-center lg:gap-6 lg:px-6">
          <div className="flex items-center gap-4 lg:max-w-[44%]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-v-border-strong)] bg-[var(--color-v-panel)] text-[var(--color-v-navy)] [[data-theme=dark]_&]:text-[var(--color-v-blue)]">
              <VIcon name="shieldCheck" className="h-6 w-6" />
            </span>
            <div>
              <p className="t-h6 text-[var(--color-v-text)]">{copy.whyTitle}</p>
              <p className="t-label mt-1 text-[var(--color-v-muted)]">{copy.whyText}</p>
            </div>
          </div>
          <span aria-hidden="true" className="hidden h-12 w-px shrink-0 bg-[var(--color-v-border-strong)] lg:block" />
          <ul className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-0">
            {copy.points.map((point, index) => (
              <li key={point.label} className="relative flex items-center gap-3 lg:justify-center lg:px-3">
                {index ? <span aria-hidden="true" className="absolute left-0 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-[var(--color-v-border-strong)] lg:block" /> : null}
                <VIcon name={point.icon} className="h-8 w-8 shrink-0 text-[var(--color-v-blue)]" strokeWidth={1.6} />
                <span className="t-label leading-[1.3] text-[var(--color-v-text)]">
                  {point.label.split("|").map((line) => (
                    <span key={line} className="block whitespace-nowrap">{line}</span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
