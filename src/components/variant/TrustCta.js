import Image from "next/image";
import Link from "next/link";
import SceneImage from "./SceneImage";
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
  const scene = data.scene;
  const trustScene = data.trustScene || scene; // same car mirrored, so it faces the text
  const lineup = Boolean(trustScene?.light?.lineup); // several cars in one picture: only the front one is shown
  const ratio = trustScene?.light?.width && trustScene.light.height ? trustScene.light.width / trustScene.light.height : 1.5;

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
            {/* The car stands on its own floor inside the picture: left on desktop (fading into the banner), top right on phones. */}
            {scene ? (
              <>
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,#000_9%,#000_72%,transparent_100%)] md:block">
                  <div
                    className={`absolute left-[34%] top-1/2 ${lineup ? "h-[165%] -translate-x-[20%] -translate-y-[70%] [mask-image:linear-gradient(90deg,#000_0%,#000_46%,transparent_60%)]" : "h-[148%] -translate-x-[29.5%] -translate-y-[54%]"}`}
                    style={{ aspectRatio: ratio }}
                  >
                    <SceneImage art={trustScene} sizes="40vw" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[48%] w-[60%] [mask-image:linear-gradient(0deg,transparent_0%,#000_22%)] md:hidden">
                  <div className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent_0%,#000_38%)]">
                    <SceneImage art={scene} sizes="60vw" className="h-full w-full object-cover object-[100%_100%]" />
                  </div>
                </div>
              </>
            ) : null}
            <div className="relative grid gap-5 p-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,0.5fr)] md:items-center md:p-6 lg:gap-6">
              <span aria-hidden="true" className="hidden md:block" />
              <div className="relative">
                {/* Phones: the engine sits beside the text (under the picture), never over the button below */}
                <div className="flex items-end gap-2 md:block">
                  <div className="relative z-10 min-w-0 max-w-[60%] flex-1 md:max-w-none">
                    <p className="t-h5 font-bold text-[var(--color-v-text)] md:text-[length:var(--fs-h4)]">{final.title}</p>
                    {final.body ? <p className="t-body mt-2 text-[var(--color-v-muted)]">{final.body}</p> : null}
                  </div>
                  {data.engineImage ? (
                    <span aria-hidden="true" className="pointer-events-none relative -mr-3 block aspect-square w-[42%] shrink-0 md:hidden">
                      <Image src={data.engineImage} alt="" fill sizes="42vw" className="object-contain" />
                    </span>
                  ) : null}
                </div>
                {button?.label ? (
                  <Link
                    href={button.href || "/quote"}
                    className="t-body relative z-10 mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--color-v-green-btn)] px-4 py-3 text-left font-semibold leading-snug text-white transition hover:brightness-110 md:w-auto md:gap-3 md:whitespace-nowrap md:px-6 md:text-center"
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
            <li key={item.label} className="relative flex items-center justify-center gap-2 px-1.5 lg:gap-3 lg:px-2">
              {index ? <span aria-hidden="true" className="absolute left-0 top-1/2 h-[60%] w-px -translate-y-1/2 bg-[var(--color-v-border-strong)]" /> : null}
              <VIcon
                name={item.icon}
                solid={["tag", "checkCircleSolid", "users", "truck"].includes(item.icon)}
                className="h-8 w-8 shrink-0 text-[var(--color-v-blue)] [[data-theme=light]_&]:text-[var(--color-v-navy)]"
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
