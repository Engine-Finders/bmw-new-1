import Link from "next/link";
import VIcon from "./VariantIcons";
import { Tabs } from "./VariantToggles";
import { Rich, TONE_VAR, byKeyword, dash, fill, pageValues, plain, stripMarker, ui, urgencyTone } from "./variantUi";

const copy = ui.commonProblems;
const ROWS = ["symptoms", "typicalMileage", "repairCost", "replacementCost"];

// "N47 Rear Timing Chain Failure (E90, early F30)" -> name + bracketed detail.
function splitTitle(title = "") {
  const match = String(title).match(/^(.*?)\s*(\([^)]*\))\s*$/);
  return match ? { name: match[1], detail: match[2] } : { name: String(title), detail: "" };
}

function shortName(problem) {
  const fromList = byKeyword(copy.tabNames, problem.title, "name");
  if (fromList) return fromList;
  return plain(splitTitle(dash(problem.title)).name).split(" — ")[0].split(" ").slice(0, 2).join(" ");
}

function ToneCircle({ tone, icon, className = "h-12 w-12" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full text-white ${className}`} style={{ background: TONE_VAR[tone] }}>
      <VIcon name={icon} className="h-[50%] w-[50%]" strokeWidth={2} />
    </span>
  );
}

function Urgency({ urgency, tone }) {
  if (!urgency?.label && !urgency?.text) return null;
  return (
    <>
      <span aria-hidden="true" className="mx-1 inline-block h-3 w-3 translate-y-[1px] rounded-full" style={{ background: TONE_VAR[tone] }} />
      {[urgency.label, urgency.text].filter(Boolean).join(" — ")}
    </>
  );
}

function FailureLink({ link, className = "" }) {
  if (!link?.label) return null;
  return (
    <Link href={link.href || "#"} className={`t-body block font-normal text-[var(--color-v-blue)] hover:underline ${className}`}>
      {stripMarker(link.label)} <span aria-hidden="true">→</span>
      {link.href ? <span className="block">{link.href}</span> : null}
    </Link>
  );
}

function rowValue(problem, key) {
  return <Rich html={problem[key]} />;
}

function Card({ problem, index }) {
  const tone = urgencyTone(problem.urgency, index);
  const icon = byKeyword(copy.problemIcons, problem.title, "icon", "wrench");
  const number = problem.id ?? index + 1;
  return (
    <article
      className="flex h-full flex-col rounded-[10px] border border-[var(--color-v-border)] border-l-[3px] bg-[var(--color-v-panel)] p-5 shadow-[0_6px_18px_var(--color-v-shadow)]"
      style={{ borderLeftColor: TONE_VAR[tone] }}
    >
      <div className="flex items-center gap-4">
        <ToneCircle tone={tone} icon={icon} />
        <h3 className="t-h6 text-[var(--color-v-text)]">
          {number}. <Rich html={splitTitle(problem.title).name} />
          {splitTitle(problem.title).detail ? <Rich html={splitTitle(problem.title).detail} className="block" /> : null}
        </h3>
      </div>
      <ul className="t-body mt-4 flex flex-col gap-2.5 text-[var(--color-v-text)]">
        {ROWS.filter((key) => problem[key]).map((key) => (
          <li key={key} className="flex gap-3">
            <VIcon name={copy.rowIcons[key]} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--color-v-muted)]" />
            <p>
              <strong className="font-semibold">{copy.labels[key]}</strong> {rowValue(problem, key)}
            </p>
          </li>
        ))}
        {problem.urgency?.label || problem.urgency?.text ? (
          <li className="flex gap-3">
            <VIcon name={copy.rowIcons.urgency} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--color-v-muted)]" />
            <p>
              <strong className="font-semibold">{copy.labels.urgency}</strong> <Urgency urgency={problem.urgency} tone={tone} />
            </p>
          </li>
        ) : null}
      </ul>
      {problem.recommendation ? (
        <div className="t-body mt-4 text-[var(--color-v-text)]">
          <p className="font-semibold">{copy.labels.recommendation}</p>
          <Rich as="p" html={problem.recommendation} className="mt-0.5" />
        </div>
      ) : null}
      <FailureLink link={problem.failureLink} className="mt-auto pt-5" />
    </article>
  );
}

function MobilePanel({ problem, index }) {
  const tone = urgencyTone(problem.urgency, index);
  const icon = byKeyword(copy.problemIcons, problem.title, "icon", "wrench");
  const { name, detail } = splitTitle(problem.title);
  const number = problem.id ?? index + 1;
  const tile = (name) => (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-v-band)] text-[var(--color-v-muted)] [[data-theme=dark]_&]:bg-[var(--color-v-panel-soft)]">
      <VIcon name={name} className="h-5 w-5" />
    </span>
  );
  return (
    <article className="rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-4 shadow-[0_6px_18px_var(--color-v-shadow)]">
      <div className="flex items-center gap-4 border-b border-[var(--color-v-border)] pb-4">
        <ToneCircle tone={tone} icon={icon} className="h-14 w-14" />
        <h3 className="t-h6 text-[var(--color-v-text)]">
          {number}. <Rich html={name} />
          {detail ? <Rich html={detail} className="t-body block font-normal text-[var(--color-v-muted)]" /> : null}
        </h3>
      </div>
      <ul className="t-body flex flex-col gap-3 border-b border-[var(--color-v-border)] py-4 text-[var(--color-v-text)]">
        {ROWS.filter((key) => problem[key]).map((key) => (
          <li key={key} className="flex items-center gap-3">
            {tile(copy.rowIcons[key])}
            <p>
              <strong className="font-semibold">{copy.labels[key]}</strong> {rowValue(problem, key)}
            </p>
          </li>
        ))}
        {problem.urgency?.label || problem.urgency?.text ? (
          <li className="flex items-center gap-3">
            {tile(copy.rowIcons.urgency)}
            <p>
              <strong className="font-semibold">{copy.labels.urgency}</strong> <Urgency urgency={problem.urgency} tone={tone} />
            </p>
          </li>
        ) : null}
      </ul>
      {problem.recommendation ? (
        <div className="flex gap-3 border-b border-[var(--color-v-border)] py-4">
          {tile(copy.rowIcons.recommendation)}
          <div className="t-body text-[var(--color-v-text)]">
            <p className="font-semibold">{copy.labels.recommendation}</p>
            <Rich as="p" html={problem.recommendation} className="mt-0.5" />
          </div>
        </div>
      ) : null}
      {problem.failureLink?.label ? (
        <div className="flex items-center gap-3 pt-4">
          {tile(copy.rowIcons.link)}
          <FailureLink link={problem.failureLink} />
        </div>
      ) : null}
    </article>
  );
}

export default function CommonProblems({ data, vehicle }) {
  const problems = data?.problems || [];
  if (!problems.length) return null;
  const h2 = data.h2 || fill(copy.h2, pageValues(vehicle));
  // Balanced rows: 4 -> 2 + 2, 5 -> 3 + 2, 6 -> 3 + 3.
  const columns = problems.length === 4 ? "lg:grid-cols-2" : problems.length === 1 ? "lg:grid-cols-1" : problems.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  const tabs = problems.map((problem, index) => {
    const tone = urgencyTone(problem.urgency, index);
    return {
      key: `${plain(problem.title)}-${index}`,
      activeStyle: { color: TONE_VAR[tone], borderBottomColor: TONE_VAR[tone] },
      label: (
        <>
          <ToneCircle tone={tone} icon={byKeyword(copy.problemIcons, problem.title, "icon", "wrench")} className="h-9 w-9 sm:h-10 sm:w-10" />
          <span>{shortName(problem)}</span>
        </>
      ),
      panel: <MobilePanel problem={problem} index={index} />,
    };
  });

  return (
    <section className="section-y bg-[var(--color-v-page)] text-[var(--color-v-text)]">
      <div className="site-container">
        <h2 className="t-h2">{h2}</h2>

        <div className="mt-6 lg:hidden">
          <Tabs
            tabs={tabs}
            label={h2}
            listClassName="flex overflow-x-auto rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)]"
            tabClassName="t-body flex min-w-[33.333%] flex-1 shrink-0 items-center justify-center gap-2 border-b-[3px] px-2 py-3 text-left font-semibold leading-tight [overflow-wrap:anywhere] sm:px-3 [&+&]:border-l [&+&]:border-l-[var(--color-v-border)]"
            inactiveClassName="border-b-transparent text-[var(--color-v-text)]"
            panelClassName="mt-4"
          />
        </div>

        <div className={`mt-7 hidden gap-4 lg:grid ${columns}`}>
          {problems.map((problem, index) => (
            <Card key={`${plain(problem.title)}-${index}`} problem={problem} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
