import SceneImage from "./SceneImage";
import VIcon from "./VariantIcons";
import { byKeyword, dash, fill, pageValues, splitTitle, ui } from "./variantUi";
import { variantFont } from "./variantFont";

const copy = ui.buyingChecklist;

// "including which engine era…" -> "Including which engine era…", as the designs show.
const sentence = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);

function Tile({ icon, className = "h-10 w-10 lg:h-[clamp(42px,4.1vw,56px)] lg:w-[clamp(42px,4.1vw,56px)]" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[7px] bg-[var(--color-v-blue-btn)] lg:rounded-[5px] lg:bg-[var(--color-v-tile)] text-white ${className}`}>
      <VIcon name={icon} className="h-[56%] w-[56%]" strokeWidth={1.9} />
    </span>
  );
}

// The reference's blue shield badge: a bevelled metal rim around a blue shield with a white tick.
function BadgeShield({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 74" className={className}>
      <defs>
        <linearGradient id="bc-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f7fb" />
          <stop offset="0.5" stopColor="#9aa6b8" />
          <stop offset="1" stopColor="#e3e8ef" />
        </linearGradient>
        <linearGradient id="bc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d7bff" />
          <stop offset="1" stopColor="#0b3fbf" />
        </linearGradient>
      </defs>
      <path d="M32 2 60 12v22c0 18-12 31-28 38C16 65 4 52 4 34V12Z" fill="url(#bc-rim)" />
      <path d="M32 8 54 16v18c0 15-9.6 25.6-22 31.4C19.6 59.6 10 49 10 34V16Z" fill="url(#bc-fill)" />
      <path d="M32 8v57.4C19.6 59.6 10 49 10 34V16Z" fill="#ffffff" opacity="0.08" />
      <path d="m21 36 8 8 15-17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhyCard({ values, className = "" }) {
  return (
    <div className={`flex items-start gap-4 rounded-[8px] bg-[var(--color-v-banner)] px-4 py-5 text-white shadow-[0_14px_34px_var(--color-v-shadow)] lg:gap-[clamp(16px,1.7vw,24px)] lg:rounded-[6px] lg:px-[clamp(20px,2.3vw,32px)] lg:py-[clamp(22px,2.2vw,30px)] [[data-theme=dark]_&]:border [[data-theme=dark]_&]:border-[var(--color-v-border-strong)] ${className}`}>
      <VIcon name="shieldCheck" className="h-9 w-9 shrink-0 lg:h-[clamp(34px,3.3vw,46px)] lg:w-[clamp(34px,3.3vw,46px)]" strokeWidth={1.5} />
      <div>
        <p className="text-[18px] font-semibold leading-tight text-white lg:text-[clamp(17px,1.66vw,24px)]">{copy.whyTitle}</p>
        <p className="mt-1.5 text-[14px] leading-[1.5] text-white/90 lg:mt-[clamp(10px,1vw,14px)] lg:text-[clamp(13px,1.27vw,18px)]">{fill(copy.whyText, values)}</p>
      </div>
    </div>
  );
}

export default function BuyingChecklist({ data, vehicle }) {
  const items = (data?.items || []).map(splitTitle);
  if (!items.length) return null;
  const values = pageValues(vehicle || data.vehicle);
  const rows = Math.ceil(items.length / 2);
  const scene = data.scene;
  const lineup = Boolean(scene?.light?.lineup); // several cars in one picture: fade the left ones out

  return (
    <section className={`${variantFont.className} section-y lg:pb-[clamp(34px,3.5vw,52px)] lg:pt-[clamp(40px,4vw,60px)] xl:pb-[1.9vw] xl:pt-[2.7vw] relative overflow-hidden border-t border-[var(--color-v-border)] bg-[var(--color-v-band)] text-[var(--color-v-text)] [[data-theme=dark]_&]:bg-[var(--color-v-page)]`}>
      {/* Phones: the car stands on its own floor at the top right, fading into the page on the left and bottom. */}
      {scene ? (
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[250px] w-[66%] lg:hidden">
          <div className="absolute inset-0 [mask-image:linear-gradient(0deg,transparent_0%,#000_26%)]">
            <div className={`absolute inset-0 ${lineup ? "[mask-image:linear-gradient(90deg,transparent_0%,transparent_28%,#000_56%)]" : "[mask-image:linear-gradient(90deg,transparent_0%,transparent_26%,#000_52%)]"}`}>
              <SceneImage art={scene} sizes="70vw" className="absolute inset-0 h-full w-full max-w-none object-cover object-[100%_64%]" />
            </div>
          </div>
        </div>
      ) : null}
      {/* Desktop, as in the reference: arch and skyline over the right ~45%, the car (~39% of the width) standing on
          its floor between ~59% and ~96%, fading into the page on the left and under the "Why this matters" card. */}
      {scene ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden h-[min(66vw,980px)] lg:block xl:hidden [mask-image:linear-gradient(180deg,#000_62%,transparent_86%)]">
          <div className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent_38%,#000_60%,#000_92%,transparent_97.6%)]">
            <SceneImage
              art={scene}
              sizes="84vw"
              className="absolute left-[13.8vw] top-[-5.6vw] h-auto w-[84vw] max-w-none [[data-theme=dark]_&]:top-[-2.6vw]"
            />
          </div>
        </div>
      ) : null}

      {/* Large screens, as in the wide reference: the dark scene fills the right half (in both themes) with the car
          standing between ~59% and ~98% of the width, fading into the light page on the left. */}
      {scene ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
          <div className="absolute inset-0 [mask-image:linear-gradient(90deg,transparent_40%,#000_58%)]">
            <SceneImage
              art={{ light: scene.dark || scene.light, dark: scene.dark || scene.light }}
              sizes="90vw"
              className="absolute left-[9.45vw] top-[-13.7vw] h-auto w-[90.2vw] max-w-none"
            />
          </div>
        </div>
      ) : null}

      <div className="site-container relative">
        <div className="grid gap-6 xl:hidden lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-[clamp(18px,2vw,36px)]">
          <div className="min-w-0">
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="whitespace-nowrap text-[28px] font-semibold leading-tight tracking-[-0.02em] lg:text-[clamp(40px,4.3vw,60px)]">{copy.h2}</h2>
                {data.intro ? (
                  <p className="mt-3 max-w-[50%] text-[15px] leading-[1.55] text-[var(--color-v-text)] lg:mt-[clamp(10px,1vw,16px)] lg:max-w-[clamp(410px,40vw,600px)] lg:text-[clamp(15px,1.45vw,20px)] lg:leading-[1.5]">
                    {dash(data.intro)}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Desktop: two columns (1–4 left, 5–8 right). Phones: one column with a tick box per row. */}
            <ol
              className="mt-4 grid grid-cols-1 gap-[5px] lg:mt-[clamp(20px,2.1vw,32px)] lg:grid-flow-col lg:grid-cols-[minmax(0,1.17fr)_minmax(0,1fr)] lg:gap-[6px] lg:[grid-template-rows:repeat(var(--rows),auto)]"
              style={{ "--rows": rows }}
            >
              {items.map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  className="flex items-center gap-3.5 rounded-[8px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] px-3 py-2.5 lg:items-start lg:gap-[clamp(12px,1.25vw,20px)] lg:rounded-[4px] lg:px-[clamp(12px,1.2vw,20px)] lg:py-[clamp(13px,1.3vw,20px)] lg:shadow-[0_3px_10px_var(--color-v-shadow)]"
                >
                  <Tile icon={byKeyword(copy.itemIcons, item.title, "icon", "checkCircle")} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold leading-snug text-[var(--color-v-text)] lg:text-[clamp(14.5px,1.42vw,20px)]">
                      {index + 1}. {item.title}
                    </p>
                    {item.text ? (
                      <p className="mt-0.5 text-[13px] leading-[1.4] text-[var(--color-v-text)] lg:text-[var(--color-v-muted)] lg:mt-[clamp(3px,0.4vw,6px)] lg:text-[clamp(12px,1.12vw,17px)] lg:leading-[1.45]">{sentence(dash(item.text))}</p>
                    ) : null}
                  </div>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--color-v-text)] lg:hidden" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
                    <path d="M8 12.3l2.8 2.8L16.2 9.6" />
                  </svg>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col justify-end gap-4 lg:pl-[clamp(0px,1vw,16px)]">
            <WhyCard values={values} />
          </div>
        </div>

        {/* Large screens: uppercase heading, a 4 × 2 grid of centred cards (number badge, outline icon, title, text)
            and the translucent "Buy smart" card on the dark scene. Sizes follow the reference at 1536px, in vw. */}
        <div className="hidden xl:grid xl:grid-cols-[minmax(0,58%)_minmax(0,1fr)] xl:gap-[2.6vw]">
          <div className="min-w-0">
            <h2 className="text-[clamp(32px,2.85vw,52px)] font-bold uppercase leading-none tracking-[-0.015em]">{copy.h2}</h2>
            {data.intro ? (
              <p className="mt-[1vw] max-w-[34vw] text-[clamp(14px,0.95vw,18px)] leading-[1.45] text-[var(--color-v-text)]">{dash(data.intro)}</p>
            ) : null}
            <ol className="mt-[1.3vw] grid grid-cols-4 gap-[0.75vw]">
              {items.map((item, index) => (
                <li
                  key={`wide-${item.title}-${index}`}
                  className="relative flex flex-col items-center rounded-[8px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] px-[0.7vw] pb-[1vw] pt-[1.6vw] text-center shadow-[0_4px_14px_var(--color-v-shadow)]"
                >
                  <span className="absolute left-[0.8vw] top-[0.8vw] flex h-[1.5vw] w-[1.5vw] items-center justify-center rounded-[4px] bg-[var(--color-v-blue-btn)] text-[clamp(11px,0.78vw,15px)] font-semibold text-white">
                    {index + 1}
                  </span>
                  <VIcon
                    name={byKeyword(copy.wideItemIcons, item.title, "icon", byKeyword(copy.itemIcons, item.title, "icon", "checkCircle"))}
                    className="h-[3.2vw] w-[3.2vw] text-[var(--color-v-blue-btn)] [[data-theme=dark]_&]:text-[var(--color-v-blue)]"
                    strokeWidth={1.3}
                  />
                  <p className="mt-[0.9vw] text-[clamp(14px,1.1vw,21px)] font-medium leading-tight text-[var(--color-v-text)]">{item.title}</p>
                  {item.text ? (
                    <p className="mt-[0.35vw] text-[clamp(11.5px,0.83vw,16px)] leading-[1.3] text-[var(--color-v-muted)]">{sentence(dash(item.text))}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col justify-end pb-[1.1vw]">
            <div className="flex items-center gap-[1.6vw] rounded-[8px] border border-white/15 bg-[rgba(16,24,40,0.62)] px-[2vw] py-[1.5vw] text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <BadgeShield className="h-[4.8vw] w-[4.2vw] shrink-0" />
              <div className="min-w-0">
                <p className="text-[clamp(16px,1.2vw,23px)] font-semibold leading-tight text-white">{copy.wideWhyTitle}</p>
                <p className="mt-[0.7vw] text-[clamp(13px,0.92vw,18px)] leading-[1.55] text-white/85">{fill(copy.wideWhyText, values)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
