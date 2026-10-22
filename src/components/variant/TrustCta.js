import Image from "next/image";
import Link from "next/link";
import VIcon from "./VariantIcons";
import { Rich, dash, fill, pageValues, stripMarker, ui } from "./variantUi";

const copy = ui.trustCta;

// "Find the best … rely on. Compare prices … confidence." -> heading + paragraph.
function splitFinal(text = "") {
  const clean = dash(text).trim();
  const index = clean.indexOf(". ");
  if (index === -1) return { title: clean, body: "" };
  return { title: clean.slice(0, index + 1), body: clean.slice(index + 2) };
}

export default function TrustCta({ data, vehicle }) {
  if (!data) return null;
  const values = pageValues(vehicle || data.vehicle);
  const points = data.trustPoints || [];
  const final = splitFinal(data.finalCta);
  const button = data.ctaButton;
  const bg = data.background;

  return (
    <section className="section-y border-t border-[var(--color-v-border)] bg-[var(--color-v-page)] text-[var(--color-v-text)]">
      <div className="site-container">
        <h2 className="t-h2">{data.h2 || fill(copy.h2, values)}</h2>
        <span aria-hidden="true" className="mt-3 flex h-[3px] w-32">
          <span className="w-1/2 rounded-l-full bg-[var(--color-v-blue-soft)] [[data-theme=light]_&]:bg-[var(--color-v-border-strong)]" />
          <span className="w-1/2 rounded-r-full bg-[var(--color-v-blue-btn)]" />
        </span>

        {points.length ? (
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {points.map((point, index) => (
              <li key={point.title} className="flex items-start gap-5 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] p-5 shadow-[0_6px_18px_var(--color-v-shadow)]">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-v-blue-btn)] text-white lg:h-[72px] lg:w-[72px]">
                  <VIcon name={copy.pointIcons[index % copy.pointIcons.length]} className="h-8 w-8" />
                </span>
                <div className="min-w-0">
                  <h3 className="t-h5 text-[var(--color-v-text)]">{dash(point.title)}</h3>
                  <Rich as="p" html={point.text} className="t-body mt-2 text-[var(--color-v-muted)]" />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {final.title ? (
          <div className="relative mt-5 overflow-hidden rounded-[12px] border border-[var(--color-v-border)] bg-[var(--color-v-panel-soft)]">
            {bg ? (
              <div aria-hidden="true" className="absolute right-0 top-0 h-[60%] w-[60%] opacity-70 md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-[42%] md:opacity-100">
                <Image src={bg.light} alt="" fill sizes="40vw" className="object-cover object-[75%_45%] [[data-theme=dark]_&]:hidden" />
                <Image src={bg.dark} alt="" fill sizes="40vw" className="hidden object-cover object-[75%_45%] [[data-theme=dark]_&]:block" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-v-panel-soft)_0%,transparent_40%)] md:bg-[linear-gradient(90deg,transparent_55%,var(--color-v-panel-soft)_100%)]" />
              </div>
            ) : null}
            <div className="relative grid gap-5 p-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,0.55fr)] md:items-center md:p-6 lg:gap-6">
              {data.image ? (
                <div className="pointer-events-none relative hidden aspect-[3/2] md:block">
                  <span aria-hidden="true" className="absolute inset-x-[8%] bottom-[5%] h-[12%] rounded-[50%] bg-black/35 blur-xl" />
                  <Image src={data.image} alt={`BMW ${values.variant}`} fill sizes="30vw" className="object-contain" />
                </div>
              ) : null}
              <div className="relative">
                <div className="relative z-10 max-w-[56%] md:max-w-none">
                  <p className="t-h5 font-bold text-[var(--color-v-text)] md:text-[length:var(--fs-h4)]">{final.title}</p>
                  {final.body ? <p className="t-body mt-2 text-[var(--color-v-muted)]">{final.body}</p> : null}
                </div>
                {/* Phones: car over the engine on the right */}
                <div aria-hidden="true" className="pointer-events-none absolute -right-3 top-0 flex w-[50%] flex-col md:hidden">
                  {data.image ? (
                    <span className="relative block aspect-[3/2] w-full">
                      <Image src={data.image} alt="" fill sizes="50vw" className="object-contain" />
                    </span>
                  ) : null}
                  {data.engineImage ? (
                    <span className="relative -mt-2 ml-[12%] block aspect-square w-[88%]">
                      <Image src={data.engineImage} alt="" fill sizes="45vw" className="object-contain" />
                    </span>
                  ) : null}
                </div>
                {button?.label ? (
                  <Link
                    href={button.href || "/quote"}
                    className="t-body relative z-10 mt-5 inline-flex max-w-[56%] items-center justify-center gap-3 rounded-[6px] bg-[var(--color-v-green-btn)] px-5 py-3 font-semibold text-white transition hover:brightness-110 md:max-w-none md:whitespace-nowrap md:px-6"
                  >
                    {stripMarker(button.label)}
                    <VIcon name="arrowRight" className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
                  </Link>
                ) : null}
              </div>
              {data.engineImage ? (
                <div className="pointer-events-none relative hidden aspect-square md:block">
                  <Image src={data.engineImage} alt="" fill sizes="20vw" className="object-contain" />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Desktop trust row (the phone design ends with the banner) */}
        <ul className="mt-4 hidden grid-cols-5 rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] px-4 py-4 md:grid">
          {copy.trust.map((item, index) => (
            <li key={item.label} className="relative flex items-center justify-center gap-3 px-2">
              {index ? <span aria-hidden="true" className="absolute left-0 top-1/2 h-[60%] w-px -translate-y-1/2 bg-[var(--color-v-border-strong)]" /> : null}
              <VIcon
                name={item.icon}
                solid={["tag", "checkCircleSolid", "users", "truck"].includes(item.icon)}
                className="h-7 w-7 shrink-0 text-[var(--color-v-blue)] [[data-theme=light]_&]:text-[var(--color-v-navy)]"
              />
              <span className="t-label min-w-0 text-[var(--color-v-text)]">
                <span className="block font-semibold">{item.label}</span>
                <span className="block text-[var(--color-v-muted)]">{item.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
