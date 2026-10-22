"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";

// Why BMW Owners Trust BMWEngines.uk - four trust cards, a 3-column FAQ, and the final CTA panel.
// Phone stacks everything and ends with the disclaimer card.

function SignalIcon({ name, className = "h-8 w-8", style }) {
  switch (name) {
    case "heart":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M12 21s-8-5.2-8-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8 3.2C20 15.8 12 21 12 21Z" />
        </svg>
      );
    case "wrench":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M21 6.5a5.5 5.5 0 0 1-7.4 5.2l-8 8a2.1 2.1 0 0 1-3-3l8-8A5.5 5.5 0 0 1 17.5 1l-3.3 3.3.9 3.6 3.6.9L22 5.5c-.6.3-1 .6-1 1Z" />
        </svg>
      );
    case "trophy":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M6 3h12v5a6 6 0 0 1-12 0V3Zm-3.5 1H5v3.6A3.4 3.4 0 0 1 2.5 4.3V4ZM19 4h2.5v.3A3.4 3.4 0 0 1 19 7.6V4ZM10.5 14.5h3v3.5H17v2.5H7V18h3.5v-3.5Z" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <rect x="3" y="13" width="4" height="8" />
          <rect x="10" y="9" width="4" height="12" />
          <rect x="17" y="5" width="4" height="16" />
          <path d="m3 10 6-5 4 3 7-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

function Plus({ open, className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={open ? "M5 12h14" : "M12 5v14M5 12h14"} />
    </svg>
  );
}

function Check({ className = "h-4 w-4" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
      <circle cx="12" cy="12" r="11" fill="#1d4fd8" />
      <path d="m7 12.3 3.2 3.2L17 8.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stars({ count = 5, size = 24 }) {
  return (
    <span className="flex gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`flex items-center justify-center ${i === count - 1 ? "bg-[linear-gradient(90deg,#00b67a_50%,#dcdce6_50%)]" : "bg-[#00b67a]"}`} style={{ width: size, height: size }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: size * 0.68, height: size * 0.68 }} fill="#fff">
            <path d="m12 3 2.6 6 6.4.6-4.9 4.2 1.5 6.3L12 16.8 6.4 20.1l1.5-6.3L3 9.6l6.4-.6L12 3Z" />
          </svg>
        </span>
      ))}
    </span>
  );
}

function Chat({ style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={style} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M8.5 15.5H6l-3 2.6V8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1.5" />
      <path d="M10 11.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2V20l-2.6-2.2H12a2 2 0 0 1-2-2v-4.3Z" />
    </svg>
  );
}

function Phone({ style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={style} fill="currentColor">
      <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />
    </svg>
  );
}

function Shield({ style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={style} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M12 2.8 5 5.6v5.7c0 4.6 3 8.4 7 9.9 4-1.5 7-5.3 7-9.9V5.6l-7-2.8Z" />
      <path d="m8.8 12 2.2 2.2 4.3-4.4" strokeLinecap="round" />
    </svg>
  );
}

// CTA car with the light trails reflected on it: a blue/red tint clipped to the car's own shape (CSS only).
function LitCar({ src, alt, dark, sizes }) {
  const mask = `url("${src}") center / 100% 100% no-repeat`;
  return (
    <>
      <Image src={src} alt={alt} width={662} height={504} sizes={sizes} className="relative h-auto w-full" style={{ filter: dark ? "brightness(0.5) contrast(1.25)" : "brightness(1.6)" }} />
      <span
        aria-hidden="true"
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: dark
            ? "linear-gradient(90deg, rgba(70,130,255,0.55) 0%, rgba(70,130,255,0.12) 22%, transparent 40%, transparent 60%, rgba(255,60,95,0.12) 78%, rgba(255,60,95,0.55) 100%)"
            : "linear-gradient(90deg, rgba(70,130,255,0.28) 0%, transparent 28%, transparent 72%, rgba(255,70,100,0.28) 100%)",
          WebkitMask: mask,
          mask,
        }}
      />
    </>
  );
}

const COL = {
  light: { bg: "#fefefe", h2: "#05070f", accent: "#0b4fe0", para: "#262b3d", card: "#ffffff", border: "#e8ebf0", line: "#eef0f3", text: "#0b1236", soft: "#2a2f40", blue: "#0b4fe0", iconBg: "#0b55e6", iconSoft: "#eef3fd", sep: "#2a62e8", shadow: "0 4px 18px rgba(16,24,48,0.05)", btn2Bg: "#ffffff", btn2Border: "#d7dbe2", btn2Text: "#0b1236" },
  dark: { bg: "#050b14", h2: "#ffffff", accent: "#1f6fe6", para: "#e8ebef", card: "#0a1420", border: "#2a3646", line: "#1d2733", text: "#ffffff", soft: "#e3e6ea", blue: "#2f7bec", iconBg: "#0b55e6", iconSoft: "#10233d", sep: "#1f63d6", shadow: "none", btn2Bg: "rgba(255,255,255,0.02)", btn2Border: "#3b4555", btn2Text: "#ffffff" },
};

// Trust card: icon and heading on one row, description underneath from the card's left edge.
function TrustCard({ s, C, phone = false }) {
  return (
    <div className="rounded-[8px] border p-5" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
      <div className="flex items-center gap-4">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] ${phone ? "" : "text-white"}`} style={phone ? { background: C.iconSoft, color: C.blue } : { background: C.iconBg }}>
          <SignalIcon name={s.icon} className="h-8 w-8" />
        </span>
        <span>
          <span className="t-label block font-bold" style={{ color: C.blue }}>{String(s.id).padStart(2, "0")}</span>
          {phone ? (
            <p className="text-[18px] font-bold leading-[1.3]" style={{ color: C.text }}>{s.title}</p>
          ) : (
            <h3 className="text-[18px] font-bold leading-[1.3]" style={{ color: C.text }}>{s.title}</h3>
          )}
        </span>
      </div>
      <p className="t-body mt-3" style={{ color: C.soft }}>
        {s.description}
        {s.inline ? (
          <>
            {" "}
            {s.inline.before}
            <span className="font-semibold" style={{ color: C.blue }}>{s.inline.link}</span>
            {s.inline.after}
          </>
        ) : null}
      </p>
      {s.highlight ? <p className="t-body mt-2 font-semibold" style={{ color: C.blue }}>{s.highlight}</p> : null}
    </div>
  );
}

// "Frequently Asked Questions" with the last word in the accent colour, like the other headings.
function FaqTitle({ title, C }) {
  const words = String(title).split(" ");
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span style={{ color: C.blue }}>{last}</span>
    </>
  );
}

function Faq({ q, isOpen, onToggle, C }) {
  return (
    <div className="rounded-[6px] border" style={{ background: C.card, borderColor: C.border }}>
      <button type="button" aria-expanded={isOpen} onClick={onToggle} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="t-body" style={{ color: C.text }}>{q.q}</span>
        <span className="h-4 w-4 shrink-0" style={{ color: C.blue }}>
          <Plus open={isOpen} className="h-full w-full" />
        </span>
      </button>
      {isOpen ? (
        <p className="t-body border-t px-4 pb-4 pt-3" style={{ color: C.soft, borderColor: C.line }}>
          {q.a}
        </p>
      ) : null}
    </div>
  );
}

// CTA button: icon, label (semibold, not bold) and sub-label, sized so the text always fits.
function CtaButton({ cta, primary, C }) {
  const Icon = primary ? Chat : Phone;
  return (
    <a
      href={cta.href}
      className={`flex min-h-[60px] items-center gap-3 rounded-[6px] px-5 py-3 font-normal ${primary ? "bg-[#0b47d8] text-white" : "border"}`}
      style={primary ? undefined : { background: C.btn2Bg, borderColor: C.btn2Border, color: C.btn2Text }}
    >
      <Icon style={{ width: 24, height: 24, flexShrink: 0 }} />
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[15px] font-semibold tracking-[0.01em]">{cta.label}</span>
        <span className="mt-0.5 block whitespace-nowrap text-[13px] opacity-90">{cta.subLabel}</span>
      </span>
    </a>
  );
}

function Review({ review, C, className = "" }) {
  return (
    <div className={className}>
      <span className="flex items-center gap-1 text-[18px] font-semibold" style={{ color: C.text }}>
        <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: 22, height: 22 }} fill="#00b67a">
          <path d="m12 2 2.9 7 7.6.6-5.8 4.9 1.8 7.5L12 18 5.5 22l1.8-7.5L1.5 9.6 9.1 9 12 2Z" />
        </svg>
        {review.brand}
      </span>
      <span className="mt-1.5 block">
        <Stars count={review.stars} size={22} />
      </span>
      <span className="t-label mt-1.5 block" style={{ color: C.soft }}>{review.score}</span>
    </div>
  );
}

function Desktop({ data, isDark, open, setOpen }) {
  const t = isDark ? "dark" : "light";
  const C = COL[t];
  const cta = data.cta;
  const cols = [0, 1, 2].map((c) => data.faq.items.slice(c * 3, c * 3 + 3).map((q, j) => [q, c * 3 + j]));

  return (
    <div className="relative hidden lg:block">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[260px] w-[56%]">
        <Image src={data.workshop[t]} alt="" fill sizes="56vw" className="object-cover [mask-image:linear-gradient(90deg,transparent,black_18%),linear-gradient(180deg,black_80%,transparent)] [mask-composite:intersect]" />
      </div>
      <div className="site-container section-y relative">
        <div className="max-w-[640px]">
          <h2 className="t-h2 [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className="t-p mt-3 max-w-[560px]" style={{ color: C.para }}>{data.subHeadline}</p>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4">
          {data.signals.map((s) => (
            <TrustCard key={s.id} s={s} C={C} />
          ))}
        </div>

        <div className="mt-10 flex items-end justify-between gap-4">
          <h3 className="t-h4" style={{ color: C.text }}>
            <FaqTitle title={data.faq.title} C={C} />
          </h3>
          <p className="t-label" style={{ color: C.soft }}>
            {data.faq.more.lead}{" "}
            <a href={data.faq.more.href} className="font-semibold" style={{ color: C.blue }}>{data.faq.more.label} →</a>
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 items-start gap-6">
          {cols.map((col, ci) => (
            <div key={ci} className="grid gap-2">
              {col.map(([q, i]) => (
                <Faq key={q.q} q={q} C={C} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
              ))}
            </div>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[10px] border" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
          <span aria-hidden="true" className="absolute inset-y-0 right-0 w-[40%] [mask-image:linear-gradient(90deg,transparent,black_20%)]">
            <Image src={cta.backdrop[t]} alt="" fill sizes="40vw" className="object-cover" />
          </span>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[-6%] right-[5%] w-[min(30%,420px)]">
            <LitCar src={cta.images[t]} alt={cta.images.alt} dark={isDark} sizes="420px" />
          </span>
          <div className="relative max-w-[66%] p-8">
            <h2 className="t-h4 [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.text, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: cta.h2 }} />
            <p className="t-p mt-2" style={{ color: C.soft }}>{cta.subHeadline}</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {cta.stats.map((st) => (
                <li key={st} className="t-label flex items-center gap-2" style={{ color: C.soft }}>
                  <Check className="h-4 w-4" />
                  {st}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <CtaButton cta={cta.primaryCta} primary C={C} />
              <CtaButton cta={cta.secondaryCta} C={C} />
              <Review review={cta.review} C={C} className="ml-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Phone / tablet: same blocks stacked, one text scale (heading, 16px body, 15px labels).
function PhoneView({ data, isDark, open, setOpen }) {
  const C = COL[isDark ? "dark" : "light"];
  const cta = data.cta;
  const W = data.phoneHero.size[0];

  return (
    <div className="relative mx-auto w-full max-w-[720px] px-4 pb-10 pt-10 lg:hidden">
      <p className="t-h2 [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2Phone }} />
      <p className="t-body mt-3" style={{ color: C.para }}>{data.subHeadline}</p>
      <span aria-hidden="true" className="pointer-events-none mx-auto mt-4 block w-[86%] max-w-[420px]">
        <Image src={data.phoneHero.src} alt={data.phoneHero.alt} width={W} height={data.phoneHero.size[1]} sizes="420px" className="h-auto w-full" />
      </span>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {data.signals.map((s) => (
          <TrustCard key={s.id} s={s} C={C} phone />
        ))}
      </div>

      {/* Same heading style as the other phone section headings, with breathing room above. */}
      <p className="t-h2 mt-12" style={{ color: C.text }}>
        <FaqTitle title={data.faq.title} C={C} />
      </p>
      <p className="t-body mt-3" style={{ color: C.soft }}>
        {data.faq.more.lead}{" "}
        <a href={data.faq.more.href} className="font-semibold" style={{ color: C.blue }}>{data.faq.more.label} →</a>
      </p>
      <div className="mt-4 grid gap-2">
        {data.faq.items.map((q, i) => (
          <Faq key={q.q} q={q} C={C} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[10px] border" style={{ background: isDark ? C.card : "#f4f7fd", borderColor: C.border }}>
        <div className="px-5 pt-6 text-center">
          <p className="t-h4 [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.text, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: cta.h2Phone }} />
          <p className="t-body mt-2" style={{ color: C.soft }}>{cta.subHeadline}</p>
        </div>
        <ul className="mt-4 grid gap-2.5 px-5">
          {cta.stats.map((st) => (
            <li key={st} className="t-body flex items-center gap-2.5" style={{ color: C.soft }}>
              <Check className="h-[18px] w-[18px]" />
              {st}
            </li>
          ))}
        </ul>
        <div className="relative mt-5 overflow-hidden bg-[#05080e]" style={{ aspectRatio: "369 / 250" }}>
          <Image src={cta.backdrop.phone} alt="" fill sizes="360px" className="object-cover" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-[4%] bottom-[2%]">
            <LitCar src={cta.images.dark} alt={cta.images.alt} dark sizes="420px" />
          </span>
        </div>
        <div className="grid gap-3 bg-[#05080e] px-4 pb-5 pt-2">
          <CtaButton cta={cta.primaryCta} primary C={C} />
          <CtaButton cta={cta.secondaryCta} C={{ ...C, btn2Bg: "rgba(0,0,0,0.25)", btn2Border: "#5b6472", btn2Text: "#ffffff" }} />
        </div>
        <Review review={cta.review} C={C} className="px-5 py-5" />
      </div>

      <div className="mt-6 flex items-start gap-4 rounded-[10px] border p-4" style={{ background: isDark ? C.card : "#f4f7fd", borderColor: C.border }}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px]" style={{ background: isDark ? "#10233d" : "#e6edfb", color: C.blue }}>
          <Shield style={{ width: 28, height: 28 }} />
        </span>
        <span>
          <p className="text-[17px] font-bold" style={{ color: C.blue }}>{data.disclaimer.title}</p>
          <p className="t-body mt-1" style={{ color: C.soft }}>{data.disclaimer.text}</p>
        </span>
      </div>
    </div>
  );
}

export default function HomeSec12({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(null);
  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <Desktop data={data} isDark={isDark} open={open} setOpen={setOpen} />
      <PhoneView data={data} isDark={isDark} open={open} setOpen={setOpen} />
    </section>
  );
}
