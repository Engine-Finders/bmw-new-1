import Link from "next/link";
import SceneImage from "./SceneImage";
import VIcon from "./VariantIcons";
import { Rich, stripMarker } from "./variantUi";
import { variantFont } from "./variantFont";

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
  // Phones: the hero scene (every variant has one, car in the same spot), framed on its own below the copy.
  const phoneArt = data.scene;

  return (
    <section className={`${variantFont.className} bg-[var(--color-v-page)] pb-[var(--section-y)]`}>
      <div className="site-container">
        <div className="relative isolate overflow-hidden rounded-[12px] bg-[var(--color-v-banner)] text-white [[data-theme=dark]_&]:border [[data-theme=dark]_&]:border-[var(--color-v-border-strong)]">
          {/* The car stands on its floor inside the picture. Left fades to the banner navy so the text stays clear. */}
          {data.banner ? (
            <>
              <div aria-hidden="true" className="absolute inset-0 -z-10 hidden overflow-hidden bg-[#e9eef6] md:block [[data-theme=dark]_&]:bg-[var(--color-v-banner)]">
                <SceneImage
                  art={data.banner}
                  sizes="(min-width: 1440px) 1344px, 100vw"
                  className="absolute bottom-0 right-0 h-[88%] w-auto max-w-none [mask-image:linear-gradient(to_bottom,transparent_0%,#000_16%)]"
                />
              </div>
            </>
          ) : data.scene ? (
            <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden md:block md:w-[68%]">
              <SceneImage art={data.scene} sizes="(min-width: 768px) 68vw, 100vw" className="h-full w-full object-cover object-[78%_66%]" />
            </div>
          ) : null}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-v-banner)_0%,var(--color-v-banner)_36%,color-mix(in_srgb,var(--color-v-banner)_80%,transparent)_46%,color-mix(in_srgb,var(--color-v-banner)_55%,transparent)_52%,color-mix(in_srgb,var(--color-v-banner)_20%,transparent)_62%,transparent_72%)] max-md:hidden" />
          {!data.banner ? <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-[color-mix(in_srgb,var(--color-v-banner)_32%,transparent)] mix-blend-multiply md:block [[data-theme=dark]_&]:hidden" /> : null}
          <div className="grid grid-cols-1 items-center gap-y-5 p-5 md:min-h-[300px] md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-4 md:p-8 lg:min-h-[340px] lg:px-10 lg:py-10">
            <div className="relative z-10">
              <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-white lg:text-[clamp(28px,2.8vw,40px)]">{title}</h2>
              {sub ? (
                <p className="mt-2 text-[18px] font-semibold leading-snug text-white lg:text-[clamp(18px,1.75vw,24px)]">
                  {/* The arrow stays with the last word, never alone on a line. */}
                  {sub.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    {sub.split(" ").at(-1)}
                    <VIcon name="arrowRight" className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2} />
                  </span>
                </p>
              ) : null}
              {data.supportingLine ? <Rich as="p" html={data.supportingLine} className="mt-3 max-w-[520px] text-[15px] leading-[1.5] text-white/90 lg:text-[clamp(15px,1.35vw,18px)] [&_a]:!text-white [&_a]:underline" /> : null}
              {button?.label ? (
                <Link
                  href={button.href || "/quote"}
                  className="mt-6 hidden text-[clamp(15px,1.35vw,17px)] items-center justify-center gap-3 whitespace-nowrap rounded-[6px] bg-[var(--color-v-green-btn)] px-7 py-3.5 font-semibold text-white transition hover:brightness-110 md:inline-flex"
                >
                  {stripMarker(button.label)}
                  <VIcon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </Link>
              ) : null}
            </div>
            {/* Phones: the car gets its own framed picture between the copy and the button, so nothing overlaps. */}
            {phoneArt ? (
              <div aria-hidden="true" className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-white/10 bg-[var(--color-v-banner)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:hidden">
                <SceneImage art={phoneArt} sizes="160vw" className="absolute inset-0 h-full w-full origin-[92%_60%] scale-[1.35] object-cover" style={{ objectPosition: "78% 62%" }} />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-v-banner)_55%,transparent),transparent)]" />
              </div>
            ) : null}
            <span aria-hidden="true" className="hidden md:block" />
            {button?.label ? (
              <Link
                href={button.href || "/quote"}
                className="relative z-10 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[6px] bg-[var(--color-v-green-btn)] px-4 py-3.5 text-[clamp(14px,3.7vw,16px)] text-center font-semibold text-white md:hidden"
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
