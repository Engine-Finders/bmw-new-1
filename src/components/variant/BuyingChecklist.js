import Image from "next/image";
import VIcon from "./VariantIcons";
import { byKeyword, dash, fill, pageValues, splitTitle, ui } from "./variantUi";

const copy = ui.buyingChecklist;

function Tile({ icon, className = "h-12 w-12" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-v-tile)] text-white ${className}`}>
      <VIcon name={icon} className="h-[50%] w-[50%]" />
    </span>
  );
}

function WhyCard({ values, className = "" }) {
  return (
    <div className={`flex items-start gap-5 rounded-[10px] bg-[var(--color-v-banner)] p-5 text-white shadow-[0_14px_34px_var(--color-v-shadow)] lg:p-6 [[data-theme=dark]_&]:border [[data-theme=dark]_&]:border-[var(--color-v-border-strong)] ${className}`}>
      <VIcon name="shieldCheck" className="h-10 w-10 shrink-0 lg:h-11 lg:w-11" strokeWidth={1.5} />
      <div>
        <p className="t-h5 text-white">{copy.whyTitle}</p>
        <p className="t-body mt-2 text-white/90">{fill(copy.whyText, values)}</p>
      </div>
    </div>
  );
}

export default function BuyingChecklist({ data, vehicle }) {
  const items = (data?.items || []).map(splitTitle);
  if (!items.length) return null;
  const values = pageValues(vehicle || data.vehicle);
  const rows = Math.ceil(items.length / 2);
  const bg = data.background;

  return (
    <section className="section-y relative overflow-hidden border-t border-[var(--color-v-border)] bg-[var(--color-v-band)] text-[var(--color-v-text)] [[data-theme=dark]_&]:bg-[var(--color-v-page)]">
      {bg ? (
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[420px] w-[80%] lg:h-full lg:w-[55%]">
          <Image src={bg.light} alt="" fill sizes="55vw" className="object-cover object-[70%_40%] [[data-theme=dark]_&]:hidden" />
          <Image src={bg.dark} alt="" fill sizes="55vw" className="hidden object-cover object-[70%_40%] [[data-theme=dark]_&]:block" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-v-band)_0%,color-mix(in_srgb,var(--color-v-band)_60%,transparent)_25%,transparent_55%)] [[data-theme=dark]_&]:bg-[linear-gradient(90deg,var(--color-v-page)_0%,color-mix(in_srgb,var(--color-v-page)_60%,transparent)_25%,transparent_55%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,var(--color-v-band)_0%,transparent_100%)] [[data-theme=dark]_&]:bg-[linear-gradient(0deg,var(--color-v-page)_0%,transparent_100%)]" />
          <div className="absolute inset-0 hidden bg-[color-mix(in_srgb,var(--color-v-banner)_55%,transparent)] mix-blend-multiply [[data-theme=dark]_&]:block" />
        </div>
      ) : null}

      <div className="site-container relative">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-8">
          <div className="min-w-0">
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="t-h2">{copy.h2}</h2>
                {data.intro ? <p className="t-p mt-3 max-w-[460px] text-[var(--color-v-text)]">{dash(data.intro)}</p> : null}
              </div>
              {data.image ? (
                <div className="pointer-events-none relative -mr-[var(--gutter)] aspect-[3/2] w-[46%] shrink-0 lg:hidden">
                  <Image src={data.image} alt={`BMW ${values.variant}`} fill sizes="46vw" className="object-contain" />
                </div>
              ) : null}
            </div>

            {/* Desktop: two columns (1–4 left, 5–8 right). Phones: one column with a chevron per row. */}
            <ol
              className="mt-6 grid grid-cols-1 gap-3 lg:grid-flow-col lg:grid-cols-2 lg:gap-0 lg:[grid-template-rows:repeat(var(--rows),auto)]"
              style={{ "--rows": rows }}
            >
              {items.map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  className="flex items-center gap-4 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-4 lg:m-[3px] lg:items-start lg:rounded-[6px] lg:shadow-[0_4px_12px_var(--color-v-shadow)]"
                >
                  <Tile icon={byKeyword(copy.itemIcons, item.title, "icon", "checkCircle")} />
                  <div className="min-w-0 flex-1">
                    <p className="t-h6 text-[var(--color-v-text)]">
                      {index + 1}. {item.title}
                    </p>
                    {item.text ? <p className="t-body mt-0.5 text-[var(--color-v-muted)]">{dash(item.text)}</p> : null}
                  </div>
                  <VIcon name="chevronRight" className="h-5 w-5 shrink-0 text-[var(--color-v-text)] lg:hidden" strokeWidth={2.2} />
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col justify-end gap-4">
            {data.image ? (
              <div className="pointer-events-none relative hidden aspect-[3/2] w-full lg:block">
                <span aria-hidden="true" className="absolute inset-x-[8%] bottom-[5%] h-[12%] rounded-[50%] bg-black/35 blur-xl" />
                <Image src={data.image} alt={`BMW ${values.variant}`} fill sizes="40vw" className="object-contain" />
              </div>
            ) : null}
            <WhyCard values={values} />
          </div>
        </div>
      </div>
    </section>
  );
}
