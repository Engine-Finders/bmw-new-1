import Image from "next/image";
import Link from "next/link";
import VIcon from "./VariantIcons";
import { Rich, stripMarker } from "./variantUi";

// "Ready to Compare? Get Matched With a Vetted BMW Specialist →" -> heading + subheading.
function splitHeadline(headline = "") {
  const clean = String(headline).trim();
  const index = clean.indexOf("? ");
  if (index === -1) return { title: stripMarker(clean), sub: "" };
  return { title: clean.slice(0, index + 1), sub: stripMarker(clean.slice(index + 2)) };
}

export default function QuotesCta({ data }) {
  if (!data?.headline) return null;
  const { title, sub } = splitHeadline(data.headline);
  const button = data.button;

  return (
    <section className="bg-[var(--color-v-page)] pb-[var(--section-y)]">
      <div className="site-container">
        <div className="relative isolate overflow-hidden rounded-[12px] bg-[var(--color-v-banner)] text-white [[data-theme=dark]_&]:border [[data-theme=dark]_&]:border-[var(--color-v-border-strong)]">
          {data.background ? (
            <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-full md:w-[62%]">
              <Image src={data.background} alt="" fill sizes="(min-width: 768px) 62vw, 100vw" className="object-cover object-[75%_50%]" />
              <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-v-banner)_45%,transparent)] mix-blend-multiply" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-v-banner)_0%,color-mix(in_srgb,var(--color-v-banner)_55%,transparent)_30%,transparent_65%)]" />
            </div>
          ) : null}
          <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center gap-x-2 gap-y-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-4 md:p-8 lg:px-9 lg:py-8">
            <div className="relative z-10">
              <h2 className="t-h3 text-white">{title}</h2>
              {sub ? (
                <p className="t-h5 mt-2 flex flex-wrap items-center gap-x-2 text-white">
                  {sub}
                  <VIcon name="arrowRight" className="h-6 w-6" strokeWidth={2} />
                </p>
              ) : null}
              {data.supportingLine ? <Rich as="p" html={data.supportingLine} className="t-body mt-3 max-w-[460px] text-white/90 [&_a]:!text-white [&_a]:underline" /> : null}
              {button?.label ? (
                <Link
                  href={button.href || "/quote"}
                  className="t-body mt-6 hidden items-center justify-center gap-3 whitespace-nowrap rounded-[6px] bg-[var(--color-v-green-btn)] px-6 py-3 font-semibold text-white transition hover:brightness-110 md:inline-flex"
                >
                  {stripMarker(button.label)}
                  <VIcon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </Link>
              ) : null}
            </div>
            {data.image ? (
              <div className="pointer-events-none relative -mr-8 aspect-[3/2] md:-my-4 md:-mr-4">
                <span aria-hidden="true" className="absolute inset-x-[10%] bottom-[6%] h-[12%] rounded-[50%] bg-black/60 blur-xl" />
                <Image src={data.image} alt={`BMW ${data.vehicle || ""}`.trim()} fill sizes="(min-width: 768px) 40vw, 60vw" className="object-contain" />
              </div>
            ) : null}
            {button?.label ? (
              <Link
                href={button.href || "/quote"}
                className="t-body relative z-10 col-span-2 flex w-full items-center justify-center gap-3 rounded-[6px] bg-[var(--color-v-green-btn)] px-5 py-3 text-center font-semibold text-white md:hidden"
              >
                {stripMarker(button.label)}
                <VIcon name="arrowRight" className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
