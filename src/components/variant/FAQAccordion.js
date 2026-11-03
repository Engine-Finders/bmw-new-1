import VIcon from "./VariantIcons";
import { Accordion, Disclosure } from "./VariantToggles";
import { Rich, balancedColumns, dash, ui } from "./variantUi";

const copy = ui.faq;

function NumberBadge({ value, className = "h-7 w-7" }) {
  return (
    <span className={`t-label flex shrink-0 items-center justify-center rounded-full bg-[var(--color-v-tile)] font-semibold text-white ${className}`}>{value}</span>
  );
}

function Question({ item, index, weight = "font-semibold" }) {
  return (
    <span className="flex min-w-0 flex-1 items-start gap-3">
      <NumberBadge value={item.id ?? index + 1} />
      <Rich html={item.question} className={`t-body pt-0.5 text-[var(--color-v-text)] ${weight}`} />
    </span>
  );
}

// The design sets the disclaimer as three sentences on their own lines (the middle break only on desktop).
function breakDisclaimer(html = "") {
  return String(html)
    .replace(/\s+(Actual costs vary)/, '<br class="max-lg:hidden" />$1')
    .replace(/\s+(Every engine supplied)/, "<br />$1");
}

export default function FAQAccordion({ data }) {
  const items = data?.items || [];
  if (!items.length) return null;
  const columns = balancedColumns(items.map((item, index) => ({ item, index })));

  return (
    <section className="section-y border-t border-[var(--color-v-border)] bg-[var(--color-v-band)] text-[var(--color-v-text)] [[data-theme=dark]_&]:bg-[var(--color-v-page)]">
      <div className="site-container">
        <div className="rounded-[12px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-4 shadow-[0_8px_24px_var(--color-v-shadow)] md:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="t-h2">{data.h2 || copy.h2}</h2>
            <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-v-border)] bg-[var(--color-v-band)] text-[var(--color-v-border-strong)] lg:h-20 lg:w-20 [[data-theme=dark]_&]:bg-[var(--color-v-panel-soft)]">
              <VIcon name="help" className="h-8 w-8 lg:h-12 lg:w-12" strokeWidth={2.4} />
            </span>
          </div>

          {/* Desktop: two balanced columns, answers open */}
          <div className="mt-6 hidden gap-4 lg:grid lg:grid-cols-2">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-4">
                {column.map(({ item, index }) => (
                  <Disclosure
                    key={`${item.question}-${index}`}
                    summary={<Question item={item} index={index} />}
                    className="rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] px-4 py-4 lg:px-5"
                    headerClassName="flex items-start gap-3"
                    chevronClassName="mt-1 h-5 w-5 text-[var(--color-v-text)]"
                    bodyClassName="pl-10 pt-2"
                    pointsDownWhenOpen
                  >
                    <Rich as="p" html={item.answer} className="t-body text-[var(--color-v-muted)]" />
                  </Disclosure>
                ))}
              </div>
            ))}
          </div>

          {/* Phones and tablets: collapsed rows, one open at a time */}
          <div className="mt-5 flex flex-col gap-2 lg:hidden">
            <Accordion
              items={items.map((item, index) => ({
                key: `${item.question}-${index}`,
                summary: <Question item={item} index={index} weight="font-normal" />,
                body: <Rich as="p" html={item.answer} className="t-body px-4 pb-4 pl-[3.25rem] text-[var(--color-v-muted)]" />,
              }))}
              defaultIndex={-1}
              itemClassName="rounded-[8px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)]"
              headerClassName="gap-3 px-4 py-3"
              chevronClassName="h-5 w-5 text-[var(--color-v-blue)]"
            />
          </div>

          {data.disclaimer ? (
            <div className="mt-5 flex items-start gap-4 rounded-[10px] border border-[var(--color-v-border-strong)] bg-[var(--color-v-panel-soft)] p-4 lg:items-center lg:px-6">
              <span className="flex shrink-0 items-center justify-center text-[var(--color-v-blue)] max-lg:h-10 max-lg:w-10 max-lg:rounded-full max-lg:bg-[var(--color-v-blue-btn)] max-lg:text-white">
                <VIcon name="info" className="h-7 w-7 max-lg:h-6 max-lg:w-6" />
              </span>
              <p className="t-body text-[var(--color-v-text)]">
                <strong className="font-semibold">{copy.disclaimerLabel}</strong> <Rich html={breakDisclaimer(data.disclaimer)} />
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
