"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ui from "@/data/shared/enginePageUi.json";
import { Accent, DataText, EIcon, Eyebrow, SECTION_CLASS, useEngineTone } from "./engineUi";
import { cleanText, engineCode } from "./engineText";

const T = ui.faq;

const fill = (value, code) => String(value || "").replaceAll("{code}", code);

/** engineImage arrives as a path string, heroCar as { src, width, height }. */
function asImage(image, width, height) {
  if (!image) return null;
  if (typeof image === "string") return { src: image, width, height };
  return image.src ? { width, height, ...image } : null;
}

/** `Cost -"How much…?"` → topic "Cost" + question "“How much…?”"; a plain question stays as is. */
function splitQuestion(raw = "") {
  const m = String(raw).match(/^\s*([^"“”]{2,40}?)\s*[-–—]\s*["“](.+?)["”]\s*$/);
  if (!m) return { topic: "", question: cleanText(raw) };
  return { topic: cleanText(m[1]), question: `“${cleanText(m[2])}”` };
}

const LINK = /<a\s+href=['"]([^'"]+)['"][^>]*>(.*?)<\/a>/gi;

/** Site links in the data ("https://bmwengines.uk/engine/n47") become relative routes. */
function localHref(href = "") {
  return href.replace(/^https?:\/\/(?:www\.)?bmwengines\.uk/i, "") || "/";
}

/** Answer copy: [TAGS] via DataText, and the few inline <a href> links in the data as real links. */
function Answer({ text = "" }) {
  const raw = String(text);
  const parts = [];
  let last = 0;
  for (const m of raw.matchAll(LINK)) {
    if (m.index > last) parts.push({ text: raw.slice(last, m.index) });
    parts.push({ href: m[1], text: m[2] });
    last = m.index + m[0].length;
  }
  if (last < raw.length) parts.push({ text: raw.slice(last) });
  return (
    <p>
      {parts.map((part, i) => {
        const before = /^\s/.test(part.text) ? " " : "";
        const after = /\s$/.test(part.text) ? " " : "";
        return part.href ? (
          <Link
            key={i}
            href={localHref(part.href)}
            className="relative z-10 font-medium text-[var(--eg-tag)] underline decoration-1 underline-offset-2 hover:no-underline"
          >
            {cleanText(part.text)}
          </Link>
        ) : (
          <span key={i}>
            {before}
            <DataText text={part.text} />
            {after}
          </span>
        );
      })}
    </p>
  );
}

function FaqRow({ item, index, open, onToggle, isDark, uid }) {
  const { topic, question } = splitQuestion(item.question);
  const answerId = `${uid}-a${index}`;

  return (
    <div
      className={`relative grid grid-cols-[32px_1px_minmax(0,1fr)_20px] items-start gap-x-3 rounded-[12px] border border-[var(--eg-card-border)] px-3.5 py-4 [box-shadow:var(--eg-card-shadow)] md:grid-cols-[40px_1px_minmax(0,1fr)_34px] md:gap-x-[19px] md:rounded-none md:border-0 md:border-t md:border-[var(--eg-divider)] md:bg-transparent md:px-[22px] md:py-[11px] md:[box-shadow:none] md:first:border-t-0 lg:pr-[30px] ${
        isDark ? "bg-[var(--eg-card)]" : "bg-[var(--eg-card-solid)]"
      }`}
    >
      <span
        aria-hidden
        className="row-span-2 grid h-8 w-8 place-items-center rounded-[6px] border border-[color-mix(in_srgb,var(--eg-blue)_26%,var(--eg-card-solid))] bg-[color-mix(in_srgb,var(--eg-blue)_8%,var(--eg-card-solid))] text-[18px] font-medium leading-none text-[var(--eg-sky)] md:h-10 md:w-10 md:text-[22px]"
      >
        {item.id ?? index + 1}
      </span>
      <span
        aria-hidden
        className={`row-span-2 h-8 w-px md:h-10 ${
          isDark
            ? "bg-[color-mix(in_srgb,var(--eg-sky)_45%,var(--eg-text))] opacity-80"
            : "bg-[color-mix(in_srgb,var(--eg-blue)_32%,var(--eg-card-solid))]"
        }`}
      />
      <h3 className="col-start-3 min-w-0 text-[16px] font-semibold leading-[1.35] text-[var(--eg-text)] md:text-[18px] md:leading-[1.3]">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={answerId}
          className="text-left after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[var(--eg-blue)]"
        >
          {topic ? (
            <>
              <span>{topic}</span> – {question}
            </>
          ) : (
            question
          )}
        </button>
      </h3>
      <span
        aria-hidden
        className="col-start-4 row-start-1 mt-px flex justify-end text-[var(--eg-sky)] md:row-span-2 md:mt-0 md:self-center"
      >
        <EIcon
          name="chevron-down"
          strokeWidth={1.7}
          className={`h-5 w-5 transition-transform duration-200 md:h-[34px] md:w-[34px] ${open ? "" : "-rotate-90"}`}
        />
      </span>
      <div
        id={answerId}
        hidden={!open}
        className={`col-start-3 row-start-2 mt-2 max-w-[720px] text-[15px] leading-[1.45] md:mt-1 md:leading-[1.37] ${
          isDark ? "text-[var(--eg-muted)]" : "text-[color-mix(in_srgb,var(--eg-text)_78%,var(--eg-muted))]"
        }`}
      >
        <Answer text={item.answer} />
      </div>
    </div>
  );
}

export default function FAQAccordion({ data, facts, engineLabel = "BMW Engine", engineImage, heroCar }) {
  const { isDark, vars } = useEngineTone();
  const uid = useId();
  const items = data?.items || [];
  const [closed, setClosed] = useState(() => new Set());

  if (!data || !items.length) return null;

  const code = (facts?.code || engineCode(engineLabel) || "").replace(/\s*\/\s*/g, "/");
  const sub = fill(T.subHeading, code);
  const engine = asImage(engineImage, 540, 540);
  const car = engine ? null : asImage(heroCar, 640, 310);
  const art = engine || car;
  const toggle = (id) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section
      style={vars}
      aria-labelledby={`${uid}-h`}
      className={`${SECTION_CLASS} [background:color-mix(in_srgb,var(--eg-card-solid)_60%,var(--eg-page))]`}
    >
      <div className="site-container relative pb-10 pt-6 md:pb-12 md:pt-9 lg:pb-4 lg:pt-[26px]">
        <div className="grid gap-5 md:gap-7 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-6">
          {/* Header + image: side by side on phone/tablet, stacked in the left column on desktop. */}
          <div className="relative flex min-w-0 items-start gap-2 lg:flex-col lg:items-stretch lg:gap-0">
            <div className="relative z-10 min-w-0 flex-1 lg:flex-none">
              <Eyebrow className="text-[15px] font-semibold" lineClassName="w-[30px]">
                {T.eyebrow}
              </Eyebrow>
              <h2
                id={`${uid}-h`}
                className="mt-2.5 text-[25px] font-bold leading-[1.15] tracking-[-0.01em] text-[var(--eg-text)] min-[400px]:text-[27px] md:mt-3 md:text-[34px] lg:mt-[14px] lg:text-[32px] lg:leading-[1.15]"
              >
                {T.h2}
              </h2>
              <p
                className={`mt-2.5 text-[15px] leading-[1.45] md:mt-3 md:text-[17px] lg:mt-[12px] lg:max-w-[25em] lg:text-[16px] lg:leading-[1.45] ${
                  isDark ? "text-[var(--eg-muted)]" : "text-[color-mix(in_srgb,var(--eg-text)_82%,var(--eg-muted))]"
                }`}
              >
                <Accent text={sub} accent={`BMW ${code}`} />
              </p>
            </div>

            {art && !isDark ? (
              // Light desktop: the heading and image sit on a pale panel that clips the image (light reference).
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-[10px] -left-6 -right-2.5 -top-5 hidden rounded-[14px] border border-[var(--eg-card-border)] bg-[linear-gradient(165deg,var(--eg-card-solid)_10%,color-mix(in_srgb,var(--eg-blue)_7%,var(--eg-card-solid)))] lg:block"
              />
            ) : null}
            {art ? (
              <div
                className={`pointer-events-none relative shrink-0 lg:min-h-[220px] lg:w-full lg:max-w-none lg:flex-1 ${
                  engine
                    ? "-mr-[calc(var(--gutter)+6%)] -mt-3 aspect-square w-[44%] max-w-[320px] md:-mr-[var(--gutter)] md:-mt-6 md:w-[30%] lg:mr-0 lg:mt-0 lg:aspect-auto"
                    : "mt-2 aspect-[640/310] w-[44%] max-w-[320px] self-center md:w-[40%] lg:mt-0 lg:aspect-auto lg:self-stretch"
                }`}
              >
                {/* Desktop: the engine bleeds off the section's left and bottom edges (dark) or the panel's (light);
                    the car sits on the column floor. */}
                <div
                  className={`absolute inset-0 ${
                    !engine
                      ? "lg:inset-x-0 lg:bottom-6 lg:top-6"
                      : isDark
                        ? "lg:inset-auto lg:-bottom-[92px] lg:left-[calc((min(100vw,88rem)_-_100vw)/2_-_var(--gutter))] lg:right-0 lg:top-0"
                        : "lg:inset-auto lg:-bottom-[10px] lg:-left-6 lg:-right-2.5 lg:top-0 lg:overflow-hidden lg:rounded-b-[14px]"
                  }`}
                >
                  {!engine ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-[8%] bottom-[2%] h-[14%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.35),transparent)]"
                    />
                  ) : null}
                  <div className={`absolute inset-0 ${engine && !isDark ? "lg:-bottom-[64px] lg:right-2.5" : ""}`}>
                    <Image
                      src={art.src}
                      alt={fill(engine ? T.imageAlt : T.carAlt || T.imageAlt, code)}
                      fill
                      sizes={engine ? "(min-width: 1024px) 480px, 44vw" : "(min-width: 1024px) 420px, 44vw"}
                      className={`object-contain ${
                        engine
                          ? `object-right-top lg:object-right-bottom ${
                              isDark
                                ? "[filter:brightness(0.8)_contrast(1.05)] lg:[mask-image:linear-gradient(to_bottom,#000_58%,transparent_97%)]"
                                : "[filter:drop-shadow(0_18px_28px_rgba(16,42,86,0.16))]"
                            }`
                          : "object-center lg:object-left-bottom"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Questions: separate cards on phone, one bordered panel from tablet up. All answers open by default. */}
          <div
            className={`grid min-w-0 gap-3 self-start md:gap-0 md:overflow-hidden md:rounded-[10px] md:border md:border-[var(--eg-card-border)] ${
              isDark
                ? "md:bg-[color-mix(in_srgb,var(--eg-card-solid)_45%,transparent)]"
                : "md:bg-[var(--eg-card-solid)] md:[box-shadow:var(--eg-card-shadow)]"
            }`}
          >
            {items.map((item, index) => {
              const id = item.id ?? index + 1;
              return (
                <FaqRow
                  key={id}
                  item={item}
                  index={index}
                  uid={uid}
                  isDark={isDark}
                  open={!closed.has(id)}
                  onToggle={() => toggle(id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
