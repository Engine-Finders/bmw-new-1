"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/shared/themeProvider";
import { variantFont as sectionFont } from "@/components/variant/variantFont";
import { bandColor } from "./generationSection";

// Colours sampled from the designs (desktop and phone, dark); light is the same design on the white studio.
const TONES = {
  light: {
    "--tc-bg": "#eceef2",
    "--tc-text": "#0b1726",
    "--tc-muted": "#3d4a5c",
    "--tc-blue": "#0a5fd8",
    "--tc-red": "#e3202b",
    "--tc-icon": "#0a5fd8",
    "--tc-box": "rgba(255,255,255,0.9)",
    "--tc-box-line": "#b8cbe6",
    "--tc-card": "rgba(255,255,255,0.94)",
    "--tc-card-line": "#d6dfeb",
    "--tc-divider": "#d9e1ec",
    "--tc-disc": "#eef4fd",
    "--tc-disc-ring": "#a7c1ea",
    "--tc-cta": "rgba(255,255,255,0.9)",
    "--tc-cta-line": "#8fb0e6",
    "--tc-cta-card": "linear-gradient(180deg,#f6f9ff 0%,#e7effc 100%)",
    "--tc-cta-glow": "0 14px 34px rgba(10,60,150,0.12)",
    "--tc-btn": "linear-gradient(180deg,#0c5fe0 0%,#0846b8 100%)",
    "--tc-shadow": "0 10px 26px rgba(10,26,43,0.08)",
  },
  dark: {
    "--tc-bg": "#030b16",
    "--tc-text": "#ffffff",
    "--tc-muted": "rgba(236,242,250,0.8)",
    "--tc-blue": "#1d76ef",
    "--tc-red": "#e91a27",
    "--tc-icon": "#2a7ce6",
    "--tc-box": "rgba(3,10,22,0.72)",
    "--tc-box-line": "#2b4d78",
    "--tc-card": "rgba(1,13,30,0.86)",
    "--tc-card-line": "#1b2a3e",
    "--tc-divider": "#21324a",
    "--tc-disc": "#03132d",
    "--tc-disc-ring": "#0f4aa8",
    "--tc-cta": "rgba(1,12,25,0.84)",
    "--tc-cta-line": "#174a86",
    "--tc-cta-card": "linear-gradient(180deg,#041a3d 0%,#020f26 100%)",
    "--tc-cta-glow": "0 0 0 1px rgba(29,118,239,0.18), 0 18px 40px rgba(0,30,90,0.45)",
    "--tc-btn": "linear-gradient(180deg,#0653d4 0%,#083ea6 100%)",
    "--tc-shadow": "none",
  },
};

// The studio (public/generation/trust/): the E90 artwork with its car taken out, extended upwards so the neon bands
// run behind the heading on phones. Every generation's car stands where the E90 stands: E90 = the box below, in
// fractions of the plate (2908 x 2112): rear bumper 41%, front wheel 95.5% across, tyres 84% down.
const PLATE = { width: 2908, height: 2112 };
const BOX = { left: 0.4102, right: 0.9546, bottom: 0.8414 };
const BOX_W = BOX.right - BOX.left;
const RATIO = PLATE.height / PLATE.width;
const plateSrc = (isDark) => `/generation/trust/plate-${isDark ? "dark" : "light"}.webp`;
const pct = (value) => `${(value * 100).toFixed(2)}%`;

// Desktop: the scene fills the heading + trust-points area, right-aligned; it is scaled so the car's rear starts
// just right of the text column (whatever the screen width), its tyres well above the CTA bar with the glossy floor
// running down to it, as in the design. A car never
// rises above --ct, the bottom of the heading lines that reach over it. Lengths are in the stage's container units.
const DESKTOP_VARS = {
  "--cl": "max(var(--gutter), calc((100cqw - 88rem) / 2 + var(--gutter)))",
  "--tx": "calc(var(--cl) + var(--tc-col))",
  "--cx": "calc(var(--tx) + 28px)",
  "--wb": `min(calc((100cqw - var(--cx)) * ${(BOX_W / (1 - BOX.left)).toFixed(4)}), 1040px)`,
  "--pw": `calc(var(--wb) / ${BOX_W.toFixed(4)})`,
  "--ph": `calc(var(--pw) * ${RATIO.toFixed(5)})`,
  "--ty": "calc(100cqh - 84px)",
  "--pt": `calc(var(--ty) - var(--ph) * ${BOX.bottom})`,
};

// Desktop heading: wraps naturally inside HEADING px (as the design's "…Owners Trust / BMWEngines.uk"), so its first
// lines may reach over the car; the car's top stays below the lines wider than the text column. Server render: a
// greedy-wrap estimate (Inter Bold ≈ 0.62 em per character); in the browser the real line boxes are measured.
const HEADING = {
  lg: { font: 40, width: 660, col: 500, top: 44 },
  xl: { font: 46, width: 760, col: 560, top: 44 },
};
function headingCap(text, { font, width, col, top }) {
  const em = font * 0.62;
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = 0;
  for (const word of words) {
    const w = word.length * em;
    if (line && line + em * 0.5 + w > width) {
      lines.push(line);
      line = w;
    } else line = line ? line + em * 0.5 + w : w;
  }
  if (line) lines.push(line);
  const last = lines.reduce((acc, value, index) => (value > col - 8 ? index + 1 : acc), 0);
  return Math.round(top + last * font * 1.12 + (last ? 18 : 0));
}
const DESKTOP_PLATE = { left: "calc(100cqw - var(--pw))", top: "var(--pt)", width: "var(--pw)", height: "var(--ph)" };

// Phones and tablets: a band under the heading with the car across 17%→96% of the screen (as in the phone design),
// the plate's wall running up behind the heading. Tablets keep the phone framing, capped at an 860px-wide scene.
const PHONE_VARS = {
  "--w": "min(100cqw, 860px)",
  "--r": "calc(100cqw - var(--w) * 0.04)",
  "--bw": "calc(var(--w) * 0.79)",
  "--pw": `calc(var(--bw) / ${BOX_W.toFixed(4)})`,
  "--ph": `calc(var(--pw) * ${RATIO.toFixed(5)})`,
  "--ty": "calc(var(--w) * 0.47)",
  "--pt": `calc(var(--ty) - var(--ph) * ${BOX.bottom})`,
  // the band tucks 24px up under the heading's rule (the car's roof sits level with it, right of the text, as in
  // the phone design); no car rises above the rule
  "--ct": "26px",
  height: "calc(var(--w) * 0.57)",
  marginTop: "-24px",
};
const PHONE_PLATE = {
  left: `calc(var(--r) - var(--bw) - var(--pw) * ${BOX.left})`,
  top: "var(--pt)",
  width: "var(--pw)",
  height: "var(--ph)",
};

function stripTags(value = "") {
  return String(value ?? "").replace(/<[^>]*>/g, "");
}

// "Why UK BMW E90 Owners Trust BMWEngines.uk" -> lead + brand ("BMWEngines", one spelling on every page) + ".uk".
function splitHeading(value = "") {
  const clean = stripTags(value).trim();
  const match = clean.match(/^(.*?)\s*(BMW\s*Engines?)(\.uk)\s*$/i);
  if (!match) return { lead: clean, brand: "", tld: "" };
  return { lead: match[1].trim(), brand: "BMWEngines", tld: match[3].toLowerCase() };
}

// "Find the best … rely on. Compare real prices … confidence." -> first sentence + the rest.
function splitFinal(text = "") {
  const clean = stripTags(text).trim();
  const index = clean.indexOf(". ");
  return index === -1 ? { lead: clean, rest: "" } : { lead: clean.slice(0, index + 1), rest: clean.slice(index + 2) };
}

/* ---------- Icons (24px grid, currentColor, outlined as in the designs) ---------- */
const PATHS = {
  shield: (
    <>
      <path d="M12 2.9 4.9 5.7v5.6c0 4.5 3 8.3 7.1 9.8 4.1-1.5 7.1-5.3 7.1-9.8V5.7z" />
      <path d="m8.7 12.1 2.3 2.3 4.4-4.6" />
    </>
  ),
  scales: (
    <>
      <path d="M12 4.6v15.2M8.2 19.8h7.6M4.7 7.1h14.6" />
      <circle cx="12" cy="3.9" r="0.9" />
      <path d="m4.7 7.1-2.6 6.1M4.7 7.1l2.6 6.1M19.3 7.1l-2.6 6.1M19.3 7.1l2.6 6.1" />
      <path d="M2 13.2h5.4a2.7 2.7 0 0 1-5.4 0zM16.6 13.2H22a2.7 2.7 0 0 1-5.4 0z" />
    </>
  ),
  wrench: (
    <path d="M14.3 6.2a4.6 4.6 0 0 1 5.6-1.1l-3.1 3.1.4 2.6 2.6.4 3.1-3.1a4.6 4.6 0 0 1-6.3 6l-7.9 7.9a2 2 0 0 1-2.9-2.9l7.9-7.9a4.6 4.6 0 0 1 .6-5zM5.2 19.3h.01" />
  ),
  rosette: (
    <>
      <circle cx="12" cy="9.2" r="6.4" />
      <path d="m12 5.9 1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" />
      <path d="m8.4 14.4-2.3 6.4 2.7-.9 1.7 2.3 1.5-5.4M15.6 14.4l2.3 6.4-2.7-.9-1.7 2.3-1.5-5.4" />
    </>
  ),
  chevron: <path d="m9 5.5 6.5 6.5L9 18.5" />,
};
const POINT_ICONS = ["shield", "scales", "wrench"];

function Icon({ name, className, strokeWidth = 1.5 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

// This generation's photo standing on the studio floor: the visible car spans the E90's box (its empty side margins
// spill outside), tyres on the box's bottom edge, with a contact shadow and a soft reflection in the glossy floor.
// The box's top may rise for taller cars, but never above --ct (px from the stage top), so a heading stays clear.
function StudioCar({ src, fit, alt, isDark, sizes }) {
  // shadows and reflection appear with the photo, never as an empty blob while it loads
  const [shown, setShown] = useState(false);
  const photoRef = useRef(null);
  useEffect(() => {
    const img = photoRef.current;
    if (!img) return undefined;
    const done = () => setShown(true);
    if (img.complete && img.naturalWidth) done();
    else img.addEventListener("load", done, { once: true });
    return () => img.removeEventListener("load", done);
  }, [src]);
  const visible = Math.max(1 - fit.top - fit.bottom, 0.5);
  const span = Math.max(1 - fit.left - fit.right, 0.5);
  const wrap = { left: pct(-fit.left / span), right: pct(-fit.right / span), top: 0, bottom: 0 };
  const maxHeight = pct(1 / visible);
  const photo = { maxHeight, transform: `translateY(${pct(fit.bottom)})` };
  const mirror = { maxHeight, transform: `translateY(-${pct(fit.bottom)}) scaleY(-1)` };
  const filter = isDark ? "brightness(0.9) saturate(0.96)" : "none";
  return (
    <div className="absolute" style={{ left: pct(BOX.left), right: pct(1 - BOX.right), bottom: pct(1 - BOX.bottom), top: "max(26%, calc(var(--ct) - var(--pt)))" }}>
      <div aria-hidden="true" className={`absolute inset-x-[5%] bottom-[-6%] h-[15%] rounded-[50%] blur-2xl transition-opacity duration-300 ${shown ? "" : "opacity-0"} ${isDark ? "bg-black/80" : "bg-black/25"}`} />
      <div className="absolute" style={wrap}>
        {/* Reflection: the car mirrored under the tyre line, fading out within a third of its height */}
        <div aria-hidden="true" className={`absolute inset-x-0 top-full flex h-full items-start justify-center transition-opacity duration-300 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9)_0%,transparent_30%)] ${shown ? (isDark ? "opacity-30" : "opacity-20") : "opacity-0"}`}>
          <Image src={src} alt="" width={fit.width} height={fit.height} sizes={sizes} className="h-auto w-full object-contain object-bottom blur-[1px]" style={{ ...mirror, filter }} />
        </div>
        <div aria-hidden="true" className={`absolute inset-x-[16%] bottom-[-1.5%] h-[4.5%] rounded-[50%] blur-[5px] transition-opacity duration-300 ${shown ? "" : "opacity-0"} ${isDark ? "bg-black/90" : "bg-black/40"}`} />
        <div className="absolute inset-0 flex items-end justify-center">
          <Image ref={photoRef} src={src} alt={alt} width={fit.width} height={fit.height} sizes={sizes} className="relative h-auto w-full object-contain object-bottom" style={{ ...photo, filter }} />
        </div>
      </div>
    </div>
  );
}

function Scene({ data, isDark, plate, alt, phone }) {
  const { car, carImageFit } = data;
  const sizes = phone ? "(min-width: 768px) 140vw, 160vw" : "110vw";
  const carSizes = phone ? "(min-width: 768px) 70vw, 80vw" : "60vw";
  const box = phone ? PHONE_PLATE : DESKTOP_PLATE;
  // The plate's top and bottom fade into the section, so its edges never show at any size (phones: the floor is
  // gone by the band's bottom edge, 93.6% down the plate, where the trust cards begin).
  const mask = phone
    ? "linear-gradient(to bottom, transparent 0%, #000 20%, #000 76%, transparent 93%)"
    : "linear-gradient(to bottom, transparent 0%, #000 20%, #000 84%, transparent 100%)";
  const masked = { ...box, maskImage: mask, WebkitMaskImage: mask };
  return (
    <>
      <div className="absolute" style={masked}>
        <Image src={plate} alt={data.art ? alt : ""} fill sizes={sizes} className="object-cover" />
      </div>
      {phone ? (
        // Floor fades into the section where the trust cards begin
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(0deg,var(--tc-bg)_0%,transparent_100%)]" />
      ) : (
        // Text column sits on the plain studio wall: the plate fades out towards the left edge
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, var(--tc-bg) 0px, var(--tc-bg) calc(var(--tx) - 40px), transparent calc(var(--cx) + 70px))" }}
        />
      )}
      {!data.art && car && carImageFit ? (
        <div className="absolute" style={masked}>
          <StudioCar src={car} fit={carImageFit} alt={alt} isDark={isDark} sizes={carSizes} />
        </div>
      ) : null}
    </>
  );
}

// The heading's real line boxes: the bottom of the last line reaching past the text column, as --ct on the stage.
function useHeadingCap(stageRef, headingRef, key) {
  useEffect(() => {
    const stage = stageRef.current;
    const heading = headingRef.current;
    if (!stage || !heading) return undefined;
    const desktop = window.matchMedia("(min-width: 1024px)");
    // reading the boxes forces layout, so a resize, breakpoint flip or font swap is measured as it lands
    const update = () => {
      if (!desktop.matches) {
        stage.style.removeProperty("--ct");
        return;
      }
      const col = parseFloat(getComputedStyle(stage).getPropertyValue("--tc-col")) || 560;
      const top = stage.getBoundingClientRect().top;
      const left = heading.getBoundingClientRect().left;
      const range = document.createRange();
      range.selectNodeContents(heading);
      let bottom = 0;
      for (const rect of range.getClientRects()) {
        if (rect.width && rect.right > left + col - 4) bottom = Math.max(bottom, rect.bottom);
      }
      stage.style.setProperty("--ct", `${Math.round(bottom ? bottom - top + 16 : 0)}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    observer.observe(heading);
    desktop.addEventListener("change", update);
    window.addEventListener("resize", update);
    document.fonts?.ready.then(update);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [stageRef, headingRef, key]);
}

export default function TrustCta({ data , band }) {
  const { theme } = useTheme();
  const stageRef = useRef(null);
  const headingRef = useRef(null);
  useHeadingCap(stageRef, headingRef, data?.h2);
  if (!data) return null;

  const isDark = theme === "dark";
  // Band colour from the page (sections alternate plain / tinted); the design colour when none is given.
  const vars = { ...TONES[isDark ? "dark" : "light"], ...(band ? { "--tc-bg": bandColor(isDark, band) } : {}) };
  const heading = splitHeading(data.h2);
  const final = splitFinal(data.finalCta);
  const points = data.trustPoints || [];
  const button = data.ctaButton;
  // Prefer doc CTA wording derived from the section H2 / generation context.
  const fromH2 = String(data.h2 || "").replace(/^Why UK\s+/i, "").replace(/\s+Owners Trust.*$/i, "").trim();
  const trustLabel = fromH2 ? `Get a ${/^BMW\b/i.test(fromH2) ? fromH2 : `BMW ${fromH2}`} Engine Quote` : "";
  const trustSupport = fromH2
    ? `Request a specialist quote based on your ${fromH2.replace(/^BMW\s+/i, "")} engine, vehicle details and replacement requirements.`
    : "";
  const label = trustLabel || stripTags(button?.label).replace(/\s*→\s*$/, "").trim();
  // The page's own artwork (E90: its car already in the studio), else the studio with this generation's car.
  const art = data.art;
  const plate = art ? (isDark ? art.dark || art.light : art.light || art.dark) : plateSrc(isDark);
  const model = heading.lead.replace(/^Why UK\s+/i, "").replace(/\s+Owners Trust$/i, "");
  const alt = art?.alt || (data.car ? `${model} ${data.carView === "45" ? "at three-quarters" : "from the rear"}` : "");
  const full = `${heading.lead} ${heading.brand}${heading.tld}`.trim();
  const caps = { "--ct-lg": `${headingCap(full, HEADING.lg)}px`, "--ct-xl": `${headingCap(full, HEADING.xl)}px` };

  return (
    <section style={vars} className={`relative w-full overflow-hidden bg-[var(--tc-bg)] text-[var(--tc-text)] ${sectionFont.className}`}>
      <div ref={stageRef} className="relative [container-type:inline-size] [--tc-col:500px] lg:[--ct:var(--ct-lg)] xl:[--tc-col:560px] xl:[--ct:var(--ct-xl)]" style={caps}>
        <div className="pointer-events-none absolute inset-0 hidden [container-type:size] lg:block" style={DESKTOP_VARS}>
          <Scene data={data} isDark={isDark} plate={plate} alt={alt} />
        </div>

        <div className="site-container relative z-10 pt-7 md:pt-10 lg:pt-11">
          <h2 ref={headingRef} className="text-[clamp(26px,7.6vw,32px)] font-bold leading-[1.12] tracking-[-0.02em] md:max-w-[640px] md:text-[40px] lg:max-w-[660px] xl:max-w-[760px] xl:text-[46px]">
            {heading.lead}
            {heading.brand ? (
              <>
                {" "}
                <span className="whitespace-nowrap">
                  {heading.brand}
                  <span className="text-[var(--tc-blue)]">{heading.tld}</span>
                </span>
              </>
            ) : null}
          </h2>
          {/* Blue + red rule under the heading (phone design) */}
          <span aria-hidden="true" className="mt-3 flex gap-1.5 lg:hidden">
            <span className="h-[3px] w-7 rounded-full bg-[var(--tc-blue)]" />
            <span className="h-[3px] w-7 rounded-full bg-[var(--tc-red)]" />
          </span>
        </div>

        {/* Phones + tablets: the car in its studio under the heading */}
        <div className="pointer-events-none relative lg:hidden" style={PHONE_VARS}>
          <Scene data={data} isDark={isDark} plate={plate} alt={alt} phone />
        </div>

        {points.length ? (
          <ul className="site-container relative z-10 flex flex-col gap-3 pb-4 md:gap-4 lg:mt-7 lg:gap-7 lg:pb-[62px]">
            {points.map((point, index) => (
              <li
                key={point.title}
                className="grid grid-cols-[auto_1px_minmax(0,1fr)_auto] items-center gap-x-3 rounded-[12px] border border-[var(--tc-card-line)] bg-[var(--tc-card)] px-3.5 py-4 [box-shadow:var(--tc-shadow)] md:gap-x-5 md:px-6 md:py-5 lg:w-[var(--tc-col)] lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-x-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:[box-shadow:none]"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--tc-disc-ring)] bg-[var(--tc-disc)] text-[var(--tc-icon)] md:h-[68px] md:w-[68px] lg:h-[72px] lg:w-[72px] lg:rounded-[10px] xl:h-20 xl:w-20 lg:border-[1.5px] lg:border-[var(--tc-box-line)] lg:bg-[var(--tc-box)]">
                  <Icon name={POINT_ICONS[index % POINT_ICONS.length]} className="h-7 w-7 md:h-9 md:w-9 xl:h-10 xl:w-10" />
                </span>
                <span aria-hidden="true" className="h-[78%] w-px self-center bg-[var(--tc-divider)] lg:hidden" />
                <div className="min-w-0 lg:pt-0.5">
                  <h3 className="text-[17px] font-semibold leading-[1.3] tracking-[-0.01em] md:text-[20px] lg:text-[20px] xl:text-[22px]">{stripTags(point.title)}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.55] text-[var(--tc-muted)] first-letter:uppercase md:text-[16px] lg:mt-2 lg:text-[17px] lg:leading-[1.6] xl:text-[18px]">
                    {stripTags(point.text)}
                  </p>
                </div>
                <Icon name="chevron" strokeWidth={2} className="h-5 w-5 shrink-0 text-[var(--tc-blue)] md:h-6 md:w-6 lg:hidden" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {final.lead || label ? (
        <div className="site-container relative z-10 pb-8 pt-1 md:pb-10 lg:pb-11 lg:pt-0">
          <div className="rounded-[14px] border border-[var(--tc-cta-line)] bg-[image:var(--tc-cta-card)] px-3.5 pb-4 pt-5 [box-shadow:var(--tc-cta-glow)] md:px-7 md:pb-7 md:pt-7 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-7 lg:rounded-[12px] lg:bg-none lg:bg-[var(--tc-cta)] lg:px-8 lg:py-[22px] lg:backdrop-blur-md lg:[box-shadow:none]">
            <div className="flex items-center gap-4 md:gap-6 lg:contents">
              <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(29,118,239,0.22)_0%,transparent_70%)] text-[var(--tc-icon)] ring-1 ring-[var(--tc-disc-ring)] md:h-[88px] md:w-[88px] lg:h-auto lg:w-auto lg:bg-none lg:ring-0">
                <Icon name="rosette" strokeWidth={1.4} className="h-11 w-11 md:h-12 md:w-12 lg:h-[76px] lg:w-[76px] xl:h-[88px] xl:w-[88px]" />
              </span>
              {final.lead || trustSupport ? (
                <p className="min-w-0 text-[15px] leading-[1.55] text-[var(--tc-muted)] md:text-[16px] lg:text-[17px] xl:text-[18px]">
                  <span className="block text-[17px] font-medium leading-[1.4] text-[var(--tc-text)] md:text-[19px] lg:text-[19px] xl:text-[21px]">
                    {final.lead || trustSupport}
                  </span>
                  {final.rest && !trustSupport ? <span className="mt-1 block">{final.rest}</span> : null}
                  {trustSupport && final.lead ? <span className="mt-1 block">{trustSupport}</span> : null}
                </p>
              ) : null}
            </div>
            {label ? (
              <a
                href={button?.href || "/quote"}
                className="mt-5 flex min-h-[56px] w-full items-center gap-2 rounded-[8px] bg-[image:var(--tc-btn)] px-4 py-3 text-white shadow-[0_10px_24px_rgba(6,70,200,0.28)] transition hover:brightness-110 md:mt-6 lg:mt-0 lg:w-[400px] lg:gap-5 lg:px-6 lg:py-4 xl:w-[460px] xl:px-7"
              >
                <span className="min-w-0 flex-1 text-center text-[14px] font-semibold uppercase leading-[1.35] tracking-[0.01em] [text-wrap:balance] md:text-[16px] lg:text-left lg:text-[16px] xl:text-[17px]">{label}</span>
                <Icon name="chevron" strokeWidth={2.2} className="h-6 w-6 shrink-0" />
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
