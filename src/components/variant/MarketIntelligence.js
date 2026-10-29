import ukMap from "@/data/shared/ukDemandMap.json";
import VIcon from "./VariantIcons";
import { TagLine } from "./EraMap";
import { byKeyword, dash, fill, pageValues, splitTags, ui } from "./variantUi";

const copy = ui.marketIntelligence;
const NUMBER = /^(?:approximately\s+|around\s+|~)?(£?[\d][\d,.]*(?:\s*[–-]\s*£?[\d][\d,.]*)?%?)\s*(.*)$/i;
const capitalise = (text = "") => (text ? text[0].toUpperCase() + text.slice(1) : text);

/**
 * "N47 rear timing chain - approximately 65% of pre-2016 320d enquiries [TAG]"
 * -> { title: "N47 rear timing chain", stat: "65%", caption: "of pre-2016 320d enquiries", tags }.
 */
function parseMetric(label = "", value = "") {
  const { main, tags } = splitTags(value);
  const index = main.indexOf(" - ");
  const left = index === -1 ? main : main.slice(0, index).trim();
  const right = index === -1 ? "" : main.slice(index + 3).trim();
  const failure = /failure/i.test(label);

  if (right) {
    const numbered = right.match(NUMBER);
    if (numbered && /^\D{0,14}\d/.test(right)) return { title: left, stat: numbered[1], caption: numbered[2], tags };
    if (failure) return { title: left, stat: "", caption: capitalise(right), tags };
    return { title: "", stat: left, caption: capitalise(right), tags };
  }
  const numbered = left.match(NUMBER);
  if (numbered && /^[£\d]/.test(left)) return { title: "", stat: numbered[1], caption: numbered[2], tags };
  return { title: "", stat: left, caption: "", tags };
}

// "London (22%), South East (18%), North West (12%) [TAG]" -> rows + the remaining share as "Other Regions".
function parseRegions(value = "") {
  const { main, tags } = splitTags(value);
  const rows = main
    .split(",")
    .map((part) => part.trim().match(/^(.*?)\s*\((\d+(?:\.\d+)?)%\)$/))
    .filter(Boolean)
    .map((match) => ({ name: match[1].trim(), share: Number(match[2]) }));
  const rest = Math.round(100 - rows.reduce((sum, row) => sum + row.share, 0));
  if (rows.length && rest > 0) rows.push({ name: copy.otherRegions, share: rest, other: true });
  return { rows, tags };
}

// Map regions a data row covers ("Midlands" covers East and West Midlands, "East of England" is "Eastern").
function regionMatches(rowName, mapName) {
  const row = rowName.toLowerCase().replace(/^east of england$/, "eastern").replace(/^yorkshire.*$/, "yorkshire and the humber");
  const map = mapName.toLowerCase();
  return map === row || (row === "midlands" && map.endsWith("midlands")) || (row === "north" && (map === "north east" || map === "north west"));
}

const SHADES = ["var(--color-v-map-5)", "var(--color-v-map-4)", "var(--color-v-map-3)"];
// Bubble slots around the map (viewBox units): two on the right, two on the left.
const SLOTS = { right: [[372, 300], [392, 410]], left: [[52, 345], [62, 470]] };
// Phones: a wider picture with the bubbles beside the map rather than over it.
const WIDE_SLOTS = { right: [[505, 165], [545, 330]], left: [[-85, 215], [-45, 395]] };
const WIDE_BOX = [-190, 0, 800, 560];

function DemandMap({ rows, wide = false }) {
  const [x0, , width, height] = wide ? WIDE_BOX : ukMap.viewBox;
  const slots = wide ? WIDE_SLOTS : SLOTS;
  const named = rows.filter((row) => !row.other);
  const fillFor = (region) => {
    const rank = named.findIndex((row) => regionMatches(row.name, region.name));
    if (rank !== -1) return SHADES[Math.min(rank, SHADES.length - 1)];
    return region.country === "England" ? "var(--color-v-map-2)" : "var(--color-v-map-1)";
  };

  // Each bubble points at its region; "Other Regions" points at the largest unnamed English region.
  const target = (row) => {
    const hits = ukMap.regions.filter((region) => (row.other ? region.name === "South West" : regionMatches(row.name, region.name)));
    if (!hits.length) return null;
    return [hits.reduce((s, r) => s + r.cx, 0) / hits.length, hits.reduce((s, r) => s + r.cy, 0) / hits.length];
  };
  const bubbles = rows
    .map((row) => ({ ...row, at: target(row) }))
    .filter((row) => row.at)
    .slice(0, 4);
  const byX = [...bubbles].sort((a, b) => b.at[0] - a.at[0]);
  const right = byX.slice(0, 2).sort((a, b) => a.at[1] - b.at[1]);
  const left = byX.slice(2).sort((a, b) => a.at[1] - b.at[1]);
  const placed = [...right.map((row, i) => ({ ...row, slot: slots.right[i] })), ...left.map((row, i) => ({ ...row, slot: slots.left[i] }))];

  return (
    <div className="relative mx-auto w-full max-w-[460px]" style={{ aspectRatio: `${width} / ${height}` }}>
      <svg viewBox={(wide ? WIDE_BOX : ukMap.viewBox).join(" ")} className="absolute inset-0 h-full w-full" role="img" aria-label={rows.map((row) => `${row.name} ${row.share}%`).join(", ")}>
        {ukMap.regions.map((region) => (
          <path key={region.name} d={region.d} fill={fillFor(region)} stroke="var(--color-v-panel)" strokeWidth="1.2" strokeLinejoin="round" />
        ))}
        {placed.map((row) => (
          <path
            key={row.name}
            d={`M ${row.slot[0]} ${row.slot[1]} Q ${(row.slot[0] + row.at[0]) / 2} ${row.slot[1] - 30} ${row.at[0]} ${row.at[1]}`}
            fill="none"
            stroke="var(--color-v-border-strong)"
            strokeWidth="1.2"
          />
        ))}
      </svg>
      {placed.map((row) => (
        <span
          key={row.name}
          className={`absolute flex ${wide ? "h-[27%]" : "h-[17%]"} w-auto -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[var(--color-v-border-strong)] bg-[var(--color-v-panel)] text-center shadow-[0_6px_16px_var(--color-v-shadow)]`}
          style={{ left: `${((row.slot[0] - x0) / width) * 100}%`, top: `${(row.slot[1] / height) * 100}%`, aspectRatio: "1 / 1" }}
        >
          <span className={`${wide ? "text-[15px] font-bold" : "t-num"} text-[var(--color-v-blue)]`}>{row.share}%</span>
          <span className={`${wide ? "text-[12px]" : "t-label"} max-w-[92%] leading-tight text-[var(--color-v-text)]`}>{row.name}</span>
        </span>
      ))}
    </div>
  );
}

function StatCard({ item }) {
  const icon = byKeyword(copy.icons, item.label, "icon", "barChart");
  const metric = parseMetric(item.label, item.value);
  return (
    <div className="flex h-full flex-col rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-3.5 shadow-[0_6px_18px_var(--color-v-shadow)] md:p-5">
      <div className="flex items-start gap-2.5 md:gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-tile)] text-white md:h-14 md:w-14">
          <VIcon name={icon} className="h-[54%] w-[54%]" strokeWidth={2} />
        </span>
        <p className="t-label min-w-0 pt-0.5 text-[var(--color-v-text)]">
          {item.label}
          {metric.title ? <span className="t-body mt-0.5 block font-semibold">{dash(metric.title)}</span> : null}
        </p>
      </div>
      {metric.stat ? <p className="t-h3 mt-3 break-words font-bold text-[var(--color-v-blue)] md:mt-4 lg:text-[length:var(--fs-h4)]">{metric.stat}</p> : null}
      {metric.caption ? <p className="t-body mt-2 text-[var(--color-v-text)]">{dash(metric.caption)}</p> : null}
      <TagLine tags={metric.tags} className="mt-2" />
    </div>
  );
}

function RegionCard({ item, regions }) {
  return (
    <div className="flex h-full flex-col rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-3.5 shadow-[0_6px_18px_var(--color-v-shadow)] md:p-5">
      <div className="flex items-center gap-2.5 md:gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-tile)] text-white md:h-14 md:w-14">
          <VIcon name="barChart" className="h-[54%] w-[54%]" strokeWidth={2} />
        </span>
        <p className="t-label text-[var(--color-v-text)]">{item.label}</p>
      </div>
      <dl className="t-body mt-4">
        {regions.rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between gap-3 border-t border-[var(--color-v-border)] py-1.5 first:border-t-0">
            <dt className="text-[var(--color-v-text)]">{row.name}</dt>
            <dd className="font-semibold text-[var(--color-v-text)]">{row.share}%</dd>
          </div>
        ))}
      </dl>
      <TagLine tags={regions.tags} className="mt-2" />
    </div>
  );
}

export default function MarketIntelligence({ data, vehicle }) {
  const items = data?.items || [];
  if (!items.length) return null;
  const values = pageValues(vehicle);
  const regionalItem = items.find((item) => /regional/i.test(item.label));
  const regions = regionalItem ? parseRegions(regionalItem.value) : { rows: [], tags: [] };

  return (
    <section className="section-y border-t border-[var(--color-v-border)] bg-[var(--color-v-page)] text-[var(--color-v-text)]">
      <div className="site-container grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:gap-6">
        <div className="min-w-0">
          <h2 className="t-h2">{copy.h2}</h2>
          <p className="t-p mt-2 text-[var(--color-v-text)]">{fill(copy.subtitle, values)}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
            {items.map((item) =>
              item === regionalItem && regions.rows.length ? (
                <RegionCard key={item.label} item={item} regions={regions} />
              ) : (
                <StatCard key={item.label} item={item} />
              ),
            )}
          </div>
        </div>
        {regions.rows.length ? (
          <div className="flex flex-col rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-5 shadow-[0_6px_18px_var(--color-v-shadow)] lg:p-6">
            <h3 className="t-h6 text-[var(--color-v-text)]">{copy.mapTitle}</h3>
            <div className="mt-4 flex flex-1 items-center lg:hidden">
              <DemandMap rows={regions.rows} wide />
            </div>
            <div className="mt-4 hidden flex-1 items-center lg:flex">
              <DemandMap rows={regions.rows} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
