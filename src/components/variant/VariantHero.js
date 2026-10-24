"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { variantFont as heroFont } from "./variantFont";
import { useTheme } from "@/components/shared/themeProvider";
import VIcon, { UkFlag } from "./VariantIcons";
import { dash, stripMarker } from "./variantUi";

// "🔧 Supply & Fit Available" -> solid glyph + label; the designs use solid icons here.
const BADGE_ICONS = { "🔧": "wrench", "✅": "shieldCheck", "🚚": "truck", "👥": "users" };
const BADGE_FALLBACK = ["wrench", "shieldCheck", "truck", "users"];

function parseBadge(badge = "", index = 0) {
  const [emoji, ...rest] = String(badge).split(" ");
  const known = BADGE_ICONS[emoji];
  const label = known ? rest.join(" ") : String(badge);
  // Two lines as in the design: "Supply & | Fit Available", "12-Month | Warranty".
  const words = label.split(" ");
  const cut = words[1] === "&" ? 2 : 1;
  return {
    icon: known || BADGE_FALLBACK[index % BADGE_FALLBACK.length],
    lines: words.length > 1 ? [words.slice(0, cut).join(" "), words.slice(cut).join(" ")] : [label],
  };
}

// "BMW 320d Engines - from £1,800 to £7,000 · Common codes: …"
function parsePrice(priceAnchor = "") {
  const [head, ...rest] = String(priceAnchor).split(" · ");
  const index = head.indexOf(" - ");
  return {
    name: index === -1 ? head : head.slice(0, index),
    range: index === -1 ? "" : head.slice(index + 3),
    codes: rest.join(" · "),
  };
}

// "BMW 320d Engine Replacement - Compare Prices & Get Quotes": lead in text colour, the rest in blue.
function Headline({ h1 = "" }) {
  const index = h1.indexOf(" - ");
  if (index === -1) return <span dangerouslySetInnerHTML={{ __html: h1 }} />;
  return (
    <>
      <span className="block" dangerouslySetInnerHTML={{ __html: `${h1.slice(0, index)} —` }} />
      {/* "Compare Prices & | Get Quotes": the designs break the blue line after the ampersand. */}
      <span className="block text-[var(--color-v-blue)]" dangerouslySetInnerHTML={{ __html: h1.slice(index + 3).replace(/(&amp;|&)\s+/, "$1<br>") }} />
    </>
  );
}

// Hero artwork: the car already stands on its floor inside the picture, so it can never float.
// Phones: larger than the screen and anchored bottom-right (car beside the paragraph), top edge faded on the picture, bottom edge on its box.
// Desktop: fills the hero; the left of the picture is already faded for the text.
// A line-up scene (several cars, no fade of its own) stays in the right ~60% and fades into the page.
function HeroArt({ art }) {
  const width = art.lineup ? "lg:w-[62%] lg:max-w-none lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_34%)]" : "lg:w-full lg:max-w-[1440px] lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_16%)]";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -inset-x-[var(--gutter)] -top-6 bottom-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_80%,transparent_100%)] md:-top-8 lg:inset-x-auto lg:inset-y-0 lg:right-0 ${width}`}
    >
      <Image
        src={art.src}
        alt=""
        width={art.width}
        height={art.height}
        priority
        sizes="(min-width: 1440px) 1440px, (min-width: 1024px) 100vw, 140vw"
        style={{ objectPosition: art.position || (art.lineup ? "75% 70%" : "100% 80%") }}
        className={`absolute -bottom-6 right-0 h-auto w-[165%] max-w-none translate-x-[9%] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_28%)] md:-bottom-8 md:w-[110%] lg:bottom-auto lg:right-auto lg:left-0 lg:top-0 lg:translate-x-0 ${
          art.lineup
            ? "lg:h-full lg:w-full lg:object-cover lg:[mask-image:none]"
            : // Reference layout: the whole picture at the hero's width, raised so the roof lines up with the headline; its floor fades into the page.
              "lg:w-full lg:-translate-y-[14%] lg:[mask-image:linear-gradient(to_bottom,#000_72%,transparent_100%)]"
        }`}
      />
    </div>
  );
}

const PLAIN_LINKS = "[&_a]:[font-weight:inherit] [&_a]:text-inherit hover:[&_a]:underline";

export default function VariantHero({ data }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [reg, setReg] = useState("");
  if (!data) return null;

  const isDark = theme === "dark";
  const scene = data.heroScene;
  const art = data.heroArt
    ? isDark
      ? data.heroArt.dark
      : data.heroArt.light
    : scene
      ? { src: (isDark && scene.darkSrc) || scene.src, width: scene.width, height: scene.height, lineup: scene.lineup }
      : null;
  const price = parsePrice(data.priceAnchor);
  const pill = String(data.tagPill || "").split(" • ");
  const badges = (data.trustBadges || []).map(parseBadge);
  const ticker = String(data.ticker || "").replace(/^●\s*/, "").split(" · ").filter(Boolean);
  const form = data.registrationInput;

  function submit(event) {
    event.preventDefault();
    const cleaned = reg.replace(/\s+/g, "").toUpperCase();
    router.push(cleaned ? `/quote?reg=${encodeURIComponent(cleaned)}` : form?.cta?.href || "/quote");
  }

  const card = "rounded-[10px] border border-[var(--color-v-border)] bg-[var(--color-v-panel)] shadow-[0_10px_30px_var(--color-v-shadow)]";
  const field = "rounded-[8px] border border-[var(--color-v-border-strong)] bg-[var(--color-v-panel)] text-[var(--color-v-text)]";

  // Dark designs: white icons in the desktop row, blue ones in the phone card; the shield is green in both.
  const badgeIcon = (icon, desktop) =>
    icon === "shieldCheck"
      ? "text-[var(--color-v-green)]"
      : isDark
        ? desktop
          ? "text-[var(--color-v-text)]"
          : "text-[var(--color-v-blue)]"
        : "text-[var(--color-v-navy)]";

  const pillNode = pill.length ? (
    // Phones: rounder pill on a dark fill, white text in the dark design; desktop and light: blue text.
    <p className="t-label inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-[12px] max-md:text-[clamp(10.5px,2.75vw,13px)] md:gap-x-2.5 md:gap-y-1 border-[1.5px] border-[var(--color-v-blue)] bg-[color-mix(in_srgb,var(--color-v-panel)_55%,transparent)] px-4 py-2 font-medium text-[var(--color-v-blue)] md:rounded-[6px] md:border md:px-3 md:py-1.5 md:font-normal [[data-theme=dark]_&]:max-md:text-[var(--color-v-text)]">
      {pill.map((part, index) => (
        <span key={index} className="inline-flex items-center gap-2 whitespace-nowrap md:gap-2.5">
          {index ? <span aria-hidden="true">•</span> : null}
          <span className={PLAIN_LINKS} dangerouslySetInnerHTML={{ __html: part }} />
        </span>
      ))}
    </p>
  ) : null;

  const formNode = form ? (
    <form onSubmit={submit} className="flex w-full flex-col gap-3 md:flex-row md:items-stretch">
      <div className="flex min-w-0 flex-1 gap-3">
        <label className={`relative flex shrink-0 items-center gap-2 pl-3 pr-2 md:gap-2.5 md:pl-3.5 md:pr-3 ${field} bg-[var(--color-v-band)]`}>
          <span className="sr-only">Country</span>
          <UkFlag className="h-4 w-6 shrink-0 md:h-5 md:w-8" />
          <select
            defaultValue="GB"
            className="t-body cursor-pointer appearance-none bg-transparent py-3 pr-6 font-semibold text-[var(--color-v-text)] focus:outline-none"
          >
            <option value="GB">GB</option>
          </select>
          <VIcon name="chevronDown" className="pointer-events-none absolute right-3 h-4 w-4" strokeWidth={2.2} />
        </label>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Registration</span>
          <input
            type="text"
            name="reg"
            value={reg}
            onChange={(event) => setReg(event.target.value.toUpperCase())}
            placeholder={dash(form.placeholder)}
            autoComplete="off"
            className={`t-body h-full w-full px-3 py-3 placeholder:text-[length:var(--fs-label)] placeholder:text-[var(--color-v-soft)] md:px-4 md:placeholder:text-[length:var(--fs-body)] focus:outline-none focus-visible:border-[var(--color-v-blue)] ${field}`}
          />
        </label>
      </div>
      {form.cta ? (
        <button
          type="submit"
          className="t-body inline-flex shrink-0 items-center justify-center gap-3 rounded-[6px] bg-[var(--color-v-blue-btn)] text-center md:whitespace-nowrap px-6 py-3 font-semibold text-white transition hover:brightness-110"
        >
          {stripMarker(form.cta.label)}
          <VIcon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </button>
      ) : null}
    </form>
  ) : null;

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-v-page)] [background-image:linear-gradient(180deg,var(--color-v-page)_0%,var(--color-v-band)_100%)]">
        <div className="site-container relative pb-6 pt-6 md:pb-8 md:pt-8 lg:static lg:pb-8 lg:pt-9">
          {/* Phones: the art sits behind this block, car at its lower right. From lg the block has no box, so the art spans the whole hero. */}
          <div className={`relative max-md:pb-[33vw] lg:contents ${heroFont.className}`}>
            {art ? <HeroArt art={art} /> : null}
            <div className="relative max-w-[640px]">
              {pillNode}
              <h1 className="t-h1 mt-4 max-w-[17ch] font-semibold max-md:text-[clamp(28px,7.6vw,36px)] tracking-[-0.025em] text-[var(--color-v-text)] lg:mt-5">
                <Headline h1={data.h1} />
              </h1>
            </div>
            <p
              className={`t-p relative mt-4 max-w-[52%] leading-[1.75] max-md:text-[clamp(12.5px,3vw,15px)] text-[color-mix(in_srgb,var(--color-v-text)_86%,transparent)] md:max-w-[520px] md:leading-[1.6] lg:max-w-[min(560px,46%)] ${PLAIN_LINKS}`}
              dangerouslySetInnerHTML={{ __html: dash(data.subHeadline) }}
            />
          </div>

          {badges.length ? (
            <>
              {/* Desktop: one row, short centred dividers */}
              <ul className="relative mt-6 hidden max-w-[min(640px,54%)] items-center lg:flex">
                {badges.map((badge, index) => (
                  <li key={index} className="flex items-center">
                    {index ? <span aria-hidden="true" className="mx-4 h-9 w-px bg-[var(--color-v-border-strong)]" /> : null}
                    <span className="flex items-center gap-3">
                      <VIcon name={badge.icon} solid className={`h-7 w-7 shrink-0 ${badgeIcon(badge.icon, true)}`} />
                      <span className="t-label leading-[1.3] text-[var(--color-v-text)]">
                        {badge.lines.map((line) => (
                          <span key={line} className="block whitespace-nowrap">{line}</span>
                        ))}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              {/* Phone / tablet: bordered card, four columns, icon above label */}
              <ul className={`relative mt-6 grid grid-cols-4 py-4 lg:hidden ${card}`}>
                {badges.map((badge, index) => (
                  <li key={index} className="relative flex flex-col items-center gap-2 px-1 text-center">
                    {index ? <span aria-hidden="true" className="absolute left-0 top-1/2 h-[70%] w-px -translate-y-1/2 bg-[var(--color-v-border)]" /> : null}
                    <VIcon name={badge.icon} solid className={`h-8 w-8 ${badgeIcon(badge.icon)}`} />
                    <span className="t-label leading-[1.3] text-[var(--color-v-text)]">
                      {badge.lines.map((line) => (
                        <span key={line} className="block">{line}</span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {/* Price anchor + quote form: two cards in light, one panel split by a rule in dark */}
          <div className="relative mt-4 max-w-[900px] lg:mt-6 [[data-theme=dark]_&]:lg:rounded-[10px] [[data-theme=dark]_&]:lg:border [[data-theme=dark]_&]:lg:border-[var(--color-v-border-strong)] [[data-theme=dark]_&]:lg:bg-[color-mix(in_srgb,var(--color-v-panel)_80%,transparent)]">
            {data.priceAnchor ? (
              <div className="flex items-center gap-3.5 rounded-[10px] border border-[var(--color-v-border)] bg-[color-mix(in_srgb,var(--color-v-band)_85%,transparent)] px-5 py-3.5 backdrop-blur-md lg:max-w-[820px] lg:py-3 [[data-theme=dark]_&]:lg:max-w-none [[data-theme=dark]_&]:lg:rounded-none [[data-theme=dark]_&]:lg:border-0 [[data-theme=dark]_&]:lg:border-b [[data-theme=dark]_&]:lg:border-[var(--color-v-border-strong)] [[data-theme=dark]_&]:lg:bg-transparent">
                <VIcon name="tag" solid className="h-7 w-7 shrink-0 text-[var(--color-v-blue)] lg:h-6 lg:w-6 [[data-theme=dark]_&]:text-[var(--color-v-text)]" />
                <p className={`t-body flex min-w-0 flex-1 flex-col gap-x-12 gap-y-0.5 text-[var(--color-v-text)] lg:flex-row lg:flex-wrap lg:items-center lg:[&>span]:whitespace-nowrap ${PLAIN_LINKS}`}>
                  <span>
                    <strong className="font-semibold" dangerouslySetInnerHTML={{ __html: price.name }} />
                    {price.range ? <span dangerouslySetInnerHTML={{ __html: ` — ${price.range}` }} /> : null}
                  </span>
                  {price.codes ? (
                    <span className="text-[var(--color-v-blue)] lg:text-[var(--color-v-text)]" dangerouslySetInnerHTML={{ __html: dash(price.codes) }} />
                  ) : null}
                </p>
              </div>
            ) : null}
            {formNode ? (
              <div className={`mt-4 p-4 md:p-5 lg:mt-3 lg:px-4 lg:py-3.5 [[data-theme=dark]_&]:lg:mt-0 [[data-theme=dark]_&]:lg:border-0 [[data-theme=dark]_&]:lg:bg-transparent [[data-theme=dark]_&]:lg:shadow-none ${card}`}>
                {formNode}
              </div>
            ) : null}
          </div>

          {ticker.length ? (
            <ul className={`t-body relative mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4 text-[var(--color-v-text)] lg:hidden ${card}`}>
              {ticker.map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  {index === 0 ? <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[var(--color-v-green)]" /> : null}
                  {item}
                  {index < ticker.length - 1 ? <span aria-hidden="true">•</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {ticker.length ? (
        <div className="hidden border-y border-[var(--color-v-border)] bg-[var(--color-v-band)] lg:block">
          <ul className="site-container t-label flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-[var(--color-v-text)]">
            <li aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-[var(--color-v-green)]" />
            {ticker.map((item) => (
              <li key={item} className="flex items-center gap-3 whitespace-nowrap">
                <span aria-hidden="true">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
