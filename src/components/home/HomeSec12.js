"use client";

import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";

// Why BMW Owners Trust BMWEngines.uk — four trust cards, a 3-column FAQ, and the final CTA panel.
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

// Arial cap-height offset: where a capital's top sits inside a line box of height lh.
const capOffset = (fs, lh) => (lh - 1.117 * fs) / 2 + 0.189 * fs;

function Cap({ as: Tag = "span", left, right, cap, fs, lh, className = "", style, children }) {
  const l = lh ?? fs * 1.2;
  return (
    <Tag className={`absolute ${className}`} style={{ left, right, top: cap - capOffset(fs, l), fontSize: fs, lineHeight: `${l}px`, ...style }}>
      {children}
    </Tag>
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

// Desktop spec measured on the 1536px references (Section 12.2.png light, Section 12.png dark).
const SPEC = {
  light: {
    h: 942, h2: { left: 66, caps: [57, 114], fs: 51.5, track: "-0.03em" }, p: { left: 70, cap: 177, fs: 17.35, lh: 26.5 }, fonts: { faq: 19.4, ctaH2: 31.6, ctaSub: 16.2 },
    img: { left: 640, top: 1, w: 896, h: 243 },
    cards: { x: [[70, 404], [420, 737], [753, 1086], [1102, 1444]], top: 244, h: 260, icon: [19, 17, 61], numX: [100, 96, 96, 97], numCap: 21, titleCap: 47, descCap: [103, 106], hlCap: [204, 0, 198, 0], pitch: [19.2, 20.5, 20.3, 20.3] },
    faq: { titleX: 74, titleCap: 523, moreRight: 101, moreCap: 527, cols: [[71, 505], [536, 953], [984, 1444]], top: 555, h: 39, gap: 1, seps: [520, 968] },
    cta: { left: 71, right: 93, top: 692, h: 224, h2: [38, 21], sub: [41, 61], statsCap: 98, statX: [41, 284, 492, 679], btnTop: 138, btn1: [40, 271, 61], btn2: [329, 240, 61], tpX: 597, backdrop: { left: 843, top: 0, w: 527, h: 222 }, car: { left: 895.2, top: -40, width: 416 } },
  },
  dark: {
    h: 942, h2: { left: 75, caps: [57, 114], fs: 51.5, track: "-0.03em" }, p: { left: 78, cap: 177, fs: 17.8, lh: 26 }, fonts: { faq: 21.6, ctaH2: 33, ctaSub: 17 },
    img: { left: 662, top: 1, w: 874, h: 237 },
    cards: { x: [[76, 412], [430, 761], [779, 1108], [1127, 1464]], top: 238, h: 258, icon: [16, 17, 60], numX: [96, 95, 94, 94], numCap: 22, titleCap: 49, descCap: [105, 105], hlCap: [198, 0, 198, 0], pitch: [18.6, 20.3, 20.3, 20.3] },
    faq: { titleX: 75, titleCap: 518, moreRight: 87, moreCap: 522, cols: [[75, 515], [544, 983], [1011, 1464]], top: 547, h: 44, gap: 0, seps: [529, 997] },
    cta: { left: 75, right: 72, top: 696, h: 226, h2: [33, 26], sub: [33, 66], statsCap: 104, statX: [35, 290, 507, 697], btnTop: 145, btn1: [32, 273, 58], btn2: [323, 241, 58], tpX: 595, backdrop: { left: 869, top: 0, w: 518, h: 224 }, car: { left: 899.2, top: -42, width: 446 } },
  },
};

const COL = {
  light: { bg: "#fefefe", h2: "#05070f", accent: "#0b4fe0", para: "#262b3d", card: "#ffffff", border: "#e8ebf0", line: "#eef0f3", text: "#0b1236", soft: "#2a2f40", blue: "#0b4fe0", iconBg: "#0b55e6", sep: "#2a62e8", shadow: "0 4px 18px rgba(16,24,48,0.05)", btn2Bg: "#ffffff", btn2Border: "#d7dbe2", btn2Text: "#0b1236" },
  dark: { bg: "#050b14", h2: "#ffffff", accent: "#1f6fe6", para: "#e8ebef", card: "#0a1420", border: "#2a3646", line: "#1d2733", text: "#ffffff", soft: "#e3e6ea", blue: "#2f7bec", iconBg: "#0b55e6", sep: "#1f63d6", shadow: "none", btn2Bg: "rgba(255,255,255,0.02)", btn2Border: "#3b4555", btn2Text: "#ffffff" },
};

function Desktop({ data, isDark, open, setOpen }) {
  const t = isDark ? "dark" : "light";
  const S = SPEC[t];
  const C = COL[t];
  const K = S.cards;
  const F = S.faq;
  const A = S.cta;
  const lines = data.h2.match(/^(.*?)(<span.*<\/span>)$/);
  const h2Lines = lines ? [lines[1], lines[2]] : [data.h2];
  const cta = data.cta;

  return (
    <div className="relative mx-auto hidden w-full max-w-[1536px] overflow-hidden lg:block" style={{ height: S.h }}>
      <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: S.img.left, top: S.img.top, width: S.img.w, height: S.img.h }}>
        <Image src={data.workshop[t]} alt="" fill sizes="900px" className="object-cover [mask-image:linear-gradient(90deg,transparent,black_10%)]" />
      </div>
      {h2Lines.map((l, i) => (
        <h2 key={i} className="absolute whitespace-nowrap font-bold [&_.heading-accent]:!text-[var(--acc)]" style={{ left: S.h2.left, top: S.h2.caps[i] - capOffset(S.h2.fs, S.h2.fs * 1.15), fontSize: S.h2.fs, lineHeight: `${S.h2.fs * 1.15}px`, letterSpacing: S.h2.track, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: l }} />
      ))}
      <Cap as="p" left={S.p.left} cap={S.p.cap} fs={S.p.fs} lh={S.p.lh} className="whitespace-pre" style={{ color: C.para }}>{data.subHeadlineDesktop}</Cap>

      {data.signals.map((s, i) => {
        const [x0, x1] = K.x[i];
        const twoLine = s.titleDesktop.includes("\n");
        const descCap = twoLine ? K.descCap[1] : K.descCap[0];
        return (
          <div key={s.id} className="absolute rounded-[8px]" style={{ left: x0, width: x1 - x0, top: K.top, height: K.h, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <span className="absolute flex items-center justify-center rounded-[6px] text-white" style={{ left: K.icon[0], top: K.icon[1], width: K.icon[2], height: K.icon[2], background: C.iconBg }}>
              <SignalIcon name={s.icon} className="" style={{ width: 34, height: 34 }} />
            </span>
            <Cap left={K.numX[i]} cap={K.numCap} fs={17.5} className="font-bold" style={{ color: C.blue }}>{String(s.id).padStart(2, "0")}</Cap>
            <Cap as="h3" left={K.numX[i]} cap={K.titleCap} fs={18.6} lh={24.5} className="whitespace-pre font-bold" style={{ color: C.text }}>{s.titleDesktop}</Cap>
            <Cap as="p" left={K.numX[i]} cap={descCap} fs={14} lh={K.pitch[i]} className="whitespace-pre" style={{ color: C.soft }}>
              {s.descriptionDesktop}
              {s.inline ? (
                <>
                  {"\n"}
                  {s.inline.before}
                  <span style={{ color: C.blue }}>{s.inline.link}</span>
                  {s.inline.after}
                </>
              ) : null}
            </Cap>
            {s.highlightDesktop ? <Cap as="p" left={K.numX[i]} cap={K.hlCap[i]} fs={14.5} lh={21} className="whitespace-pre" style={{ color: C.blue }}>{s.highlightDesktop}</Cap> : null}
          </div>
        );
      })}

      <Cap as="h3" left={F.titleX} cap={F.titleCap} fs={S.fonts.faq} className="whitespace-nowrap font-bold" style={{ color: C.text }}>{data.faq.title}</Cap>
      <Cap as="p" right={F.moreRight} cap={F.moreCap} fs={13.2} className="whitespace-nowrap" style={{ color: C.soft }}>
        {data.faq.more.lead}{" "}
        <a href={data.faq.more.href} style={{ color: C.blue }}>{data.faq.more.label} →</a>
      </Cap>
      {F.seps.map((x) => (
        <span key={x} aria-hidden="true" className="absolute" style={{ left: x, top: F.top, width: 2, height: 3 * F.h + 2 * F.gap, background: C.sep }} />
      ))}
      {data.faq.items.map((q, i) => {
        const col = Math.floor(i / 3);
        const row = i % 3;
        const [x0, x1] = F.cols[col];
        const isOpen = open === i;
        return (
          <div key={q.q} className="absolute" style={{ left: x0, width: x1 - x0, top: F.top + row * (F.h + F.gap), height: F.h, zIndex: isOpen ? 5 : 1 }}>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="absolute inset-0 rounded-[6px] text-left" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <Cap left={19} cap={F.h / 2 - 5.5} fs={14.3} className="whitespace-nowrap" style={{ color: C.text }}>{q.q}</Cap>
              <span className="absolute" style={{ right: 20, top: F.h / 2 - 7, width: 14, height: 14, color: C.text }}>
                <Plus open={isOpen} className="h-full w-full" />
              </span>
            </button>
            {isOpen ? (
              <p className="absolute inset-x-0 rounded-b-[6px] px-[19px] pb-3 pt-2 text-[13.5px] leading-[1.55] shadow-lg" style={{ top: F.h - 2, background: C.card, border: `1px solid ${C.border}`, borderTop: "none", color: C.soft }}>{q.a}</p>
            ) : null}
          </div>
        );
      })}

      <div className="absolute overflow-hidden rounded-[10px]" style={{ left: A.left, right: A.right, top: A.top, height: A.h, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
        <span aria-hidden="true" className="absolute [mask-image:linear-gradient(90deg,transparent,black_14%)]" style={{ left: A.backdrop.left, top: A.backdrop.top, width: A.backdrop.w, height: A.backdrop.h }}>
          <Image src={cta.backdrop[t]} alt="" fill sizes="530px" className="object-cover" />
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute" style={{ left: A.car.left, top: A.car.top, width: A.car.width }}>
          <LitCar src={cta.images[t]} alt={cta.images.alt} dark={isDark} sizes="440px" />
        </span>
        <Cap as="h2" left={A.h2[0]} cap={A.h2[1]} fs={S.fonts.ctaH2} className="whitespace-nowrap font-bold tracking-[-0.02em] [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.text, "--acc": C.accent }}>
          <span dangerouslySetInnerHTML={{ __html: cta.h2 }} />
        </Cap>
        <Cap as="p" left={A.sub[0]} cap={A.sub[1]} fs={S.fonts.ctaSub} className="whitespace-nowrap" style={{ color: C.soft }}>{cta.subHeadline}</Cap>
        {cta.stats.map((st, i) => (
          <span key={st}>
            {i ? <span aria-hidden="true" className="absolute" style={{ left: A.statX[i] - 20, top: A.statsCap - 2, width: 1, height: 14, background: isDark ? "#3b4555" : "#c9ced8" }} /> : null}
            <span className="absolute" style={{ left: A.statX[i], top: A.statsCap - 2, width: 15, height: 15 }}>
              <Check className="h-full w-full" />
            </span>
            <Cap left={A.statX[i] + 22} cap={A.statsCap} fs={13.3} className="whitespace-nowrap" style={{ color: C.soft }}>{st}</Cap>
          </span>
        ))}
        <a href={cta.primaryCta.href} className="absolute rounded-[4px] bg-[#0b47d8] text-white" style={{ left: A.btn1[0], top: A.btnTop, width: A.btn1[1], height: A.btn1[2] }}>
          <span className="absolute" style={{ left: 18, top: A.btn1[2] / 2 - 13, width: 26, height: 26 }}><Chat style={{ width: 26, height: 26 }} /></span>
          <Cap left={58} cap={18} fs={14.5} className="whitespace-nowrap">{cta.primaryCta.label}</Cap>
          <Cap left={58} cap={37} fs={11} className="whitespace-nowrap opacity-90">{cta.primaryCta.subLabel}</Cap>
        </a>
        <a href={cta.secondaryCta.href} className="absolute rounded-[4px]" style={{ left: A.btn2[0], top: A.btnTop, width: A.btn2[1], height: A.btn2[2], background: C.btn2Bg, border: `1px solid ${C.btn2Border}`, color: C.btn2Text }}>
          <span className="absolute" style={{ left: 18, top: A.btn2[2] / 2 - 12, width: 24, height: 24 }}><Phone style={{ width: 24, height: 24 }} /></span>
          <Cap left={56} cap={18} fs={14.5} className="whitespace-nowrap">{cta.secondaryCta.label}</Cap>
          <Cap left={56} cap={37} fs={11} className="whitespace-nowrap opacity-90">{cta.secondaryCta.subLabel}</Cap>
        </a>
        <span className="absolute flex items-center gap-1" style={{ left: A.tpX, top: A.btnTop - 2, color: C.text, fontSize: 18 }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: 22, height: 22 }} fill="#00b67a">
            <path d="m12 2 2.9 7 7.6.6-5.8 4.9 1.8 7.5L12 18 5.5 22l1.8-7.5L1.5 9.6 9.1 9 12 2Z" />
          </svg>
          {cta.review.brand}
        </span>
        <span className="absolute" style={{ left: A.tpX, top: A.btnTop + 25 }}>
          <Stars count={cta.review.stars} size={21} />
        </span>
        <Cap left={A.tpX} cap={A.btnTop + 56} fs={11} className="whitespace-nowrap" style={{ color: C.soft }}>{cta.review.score}</Cap>
      </div>
    </div>
  );
}

// Phone spec measured on Section 12.4.png (two ~388px panels; the second continues the first). CSS px.
const PH = {
  heroH: 488, inset: [17, 16],
  h2: { left: 21, caps: [69, 108, 147], fs: 33.5, track: "-0.03em" }, p: { left: 21, cap: 199, fs: 14.5, lh: 26.5 },
  car: { left: 39.3, top: 246.4, width: 319 },
  cards: { mt: [4, 10, 9, 9], h: [236, 238, 235, 249], icon: [17, 32, 66], numX: 104, numCap: 22, titleCap: 48, descCap: [83, 109], hlCap: [181, null, 179, null], inlineCap: 205 },
  faq: { mt: 17, titleCap: 13, moreCap: 45, first: 67, h: 39, pitch: 47 },
  cta: { mt: 35, h: 959, h2Caps: [32, 70], h2: 29, subCaps: [117, 145], sub: 16.5, statCap: 189, statPitch: 40, statIcon: 23, statX: 53, dark: [347, 819], car: { left: -10.6, top: -8.6, width: 360.7 }, btn1: [12, 627, 343, 81], btn2: [12, 722, 343, 84], tp: { x: 29, cap: 865, starsX: 162, starsTop: 857, scoreCap: 907 } },
  disc: { mt: 41, h: 242, icon: [20, 22, 60], textX: 94, titleCap: 22, title: 16.5, textCap: 57, text: 13.2, lh: 29.5 },
};

function PhoneView({ data, isDark, open, setOpen }) {
  const C = COL[isDark ? "dark" : "light"];
  const K = PH.cards;
  const card = { marginLeft: PH.inset[0], marginRight: PH.inset[1], background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: isDark ? "none" : "0 3px 14px rgba(16,24,48,0.05)" };
  const h2Lines = data.h2Phone.match(/<span[^>]*>.*?<\/span>/g) || [];
  const cta = data.cta;
  const A = PH.cta;
  const W = data.phoneHero.size[0];

  return (
    <div className="relative lg:hidden" style={{ paddingBottom: 30 }}>
      <div className="relative overflow-hidden" style={{ height: PH.heroH, background: isDark ? "linear-gradient(180deg,#050b14,#0a1420)" : "linear-gradient(180deg,#f3f6fa,#ffffff 70%)" }}>
        {h2Lines.map((l, i) => (
          <h2 key={i} className="absolute whitespace-nowrap font-bold [&_.heading-accent]:!text-[var(--acc)]" style={{ left: PH.h2.left, top: PH.h2.caps[i] - capOffset(PH.h2.fs, PH.h2.fs * 1.15), fontSize: PH.h2.fs, lineHeight: `${PH.h2.fs * 1.15}px`, letterSpacing: PH.h2.track, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: l }} />
        ))}
        <Cap as="p" left={PH.p.left} cap={PH.p.cap} fs={PH.p.fs} lh={PH.p.lh} className="whitespace-pre" style={{ color: C.para }}>{data.subHeadlinePhone}</Cap>
        <span aria-hidden="true" className="pointer-events-none absolute" style={{ left: PH.car.left, top: PH.car.top, width: PH.car.width }}>
          <Image src={data.phoneHero.src} alt={data.phoneHero.alt} width={W} height={data.phoneHero.size[1]} sizes="330px" className="h-auto w-full" />
        </span>
      </div>

      {data.signals.map((s, i) => {
        const twoLine = s.titlePhone.includes("\n");
        return (
          <div key={s.id} className="relative" style={{ ...card, marginTop: K.mt[i], height: K.h[i] }}>
            <span className="absolute flex items-center justify-center rounded-[8px]" style={{ left: K.icon[0], top: K.icon[1], width: K.icon[2], height: K.icon[2], background: isDark ? "#10233d" : "#eef3fd", color: C.blue }}>
              <SignalIcon name={s.icon} className="" style={{ width: 34, height: 34 }} />
            </span>
            <Cap left={K.numX} cap={K.numCap} fs={13} className="font-bold" style={{ color: C.blue }}>{String(s.id).padStart(2, "0")}</Cap>
            <Cap as="h3" left={K.numX} cap={K.titleCap} fs={19.5} lh={26} className="whitespace-pre font-bold" style={{ color: C.text }}>{s.titlePhone}</Cap>
            <Cap as="p" left={K.numX} cap={twoLine ? K.descCap[1] : K.descCap[0]} fs={13} lh={21.7} className="whitespace-pre" style={{ color: C.soft }}>{s.descriptionPhone}</Cap>
            {s.highlightPhone ? <Cap as="p" left={K.numX} cap={K.hlCap[i]} fs={13.3} lh={22} className="whitespace-pre font-bold" style={{ color: C.blue }}>{s.highlightPhone}</Cap> : null}
            {s.inline ? (
              <Cap as="p" left={K.numX} cap={K.inlineCap} fs={13.3} className="whitespace-nowrap font-bold" style={{ color: C.blue }}>
                {s.inline.before}
                {s.inline.link}
                {s.inline.after}
              </Cap>
            ) : null}
          </div>
        );
      })}

      <div className="relative" style={{ marginTop: PH.faq.mt, height: PH.faq.first + 8 * PH.faq.pitch + PH.faq.h }}>
        <Cap as="h3" left={PH.inset[0]} cap={PH.faq.titleCap} fs={20} className="whitespace-nowrap font-bold" style={{ color: C.text }}>{data.faq.title}</Cap>
        <Cap as="p" left={PH.inset[0]} cap={PH.faq.moreCap} fs={13} className="whitespace-nowrap" style={{ color: C.soft }}>
          {data.faq.more.lead}{" "}
          <a href={data.faq.more.href} style={{ color: C.blue }}>{data.faq.more.label} →</a>
        </Cap>
        {data.faq.items.map((q, i) => {
          const isOpen = open === i;
          return (
            <div key={q.q} className="absolute" style={{ left: PH.inset[0] + 1, right: PH.inset[1], top: PH.faq.first + i * PH.faq.pitch, minHeight: PH.faq.h, zIndex: isOpen ? 5 : 1 }}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="relative block w-full rounded-[6px] text-left" style={{ height: PH.faq.h, background: C.card, border: `1px solid ${C.border}` }}>
                <Cap left={12} cap={PH.faq.h / 2 - 5} fs={13.3} className="whitespace-nowrap" style={{ color: C.text }}>{q.q}</Cap>
                <span className="absolute" style={{ right: 16, top: PH.faq.h / 2 - 7, width: 14, height: 14, color: C.blue }}>
                  <Plus open={isOpen} className="h-full w-full" />
                </span>
              </button>
              {isOpen ? <p className="rounded-b-[6px] px-3 pb-3 pt-2 text-[12.5px] leading-[1.55] shadow-lg" style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: "none", color: C.soft }}>{q.a}</p> : null}
            </div>
          );
        })}
      </div>

      <div className="relative overflow-hidden" style={{ ...card, marginTop: PH.cta.mt, height: A.h, background: isDark ? C.card : "#f4f7fd" }}>
        {cta.h2Phone.match(/<span class="block">.*?<\/span>(?=<span class="block">|$)/g)?.map((l, i) => (
          <Cap key={i} as="h2" left={0} right={0} cap={A.h2Caps[i]} fs={A.h2} className="whitespace-nowrap text-center font-bold tracking-[-0.02em] [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.text, "--acc": C.accent }}>
            <span dangerouslySetInnerHTML={{ __html: l }} />
          </Cap>
        ))}
        {cta.subHeadlinePhone.split("\n").map((l, i) => (
          <Cap key={i} as="p" left={0} right={0} cap={A.subCaps[i]} fs={A.sub} className="text-center" style={{ color: C.soft }}>{l}</Cap>
        ))}
        {cta.stats.map((st, i) => (
          <span key={st}>
            <span className="absolute" style={{ left: A.statIcon, top: A.statCap + i * A.statPitch - 3, width: 18, height: 18 }}>
              <Check className="h-full w-full" />
            </span>
            <Cap left={A.statX} cap={A.statCap + i * A.statPitch} fs={15} className="whitespace-nowrap" style={{ color: C.soft }}>{st}</Cap>
          </span>
        ))}
        <div className="absolute inset-x-0 overflow-hidden" style={{ top: A.dark[0], height: A.dark[1] - A.dark[0], background: "#05080e" }}>
          <span aria-hidden="true" className="absolute inset-x-0 top-0" style={{ aspectRatio: "369 / 277" }}>
            <Image src={cta.backdrop.phone} alt="" fill sizes="360px" className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(180deg,transparent,#05080e)]" />
          </span>
          <span aria-hidden="true" className="pointer-events-none absolute" style={{ left: A.car.left, top: A.car.top, width: A.car.width }}>
            <LitCar src={cta.images.dark} alt={cta.images.alt} dark sizes="420px" />
          </span>
        </div>
        <a href={cta.primaryCta.href} className="absolute rounded-[6px] bg-[#0b47d8] text-white" style={{ left: A.btn1[0], top: A.btn1[1], width: A.btn1[2], height: A.btn1[3] }}>
          <span className="absolute" style={{ left: 26, top: A.btn1[3] / 2 - 17, width: 34, height: 34 }}><Chat style={{ width: 34, height: 34 }} /></span>
          <Cap left={80} cap={22} fs={17} className="whitespace-nowrap font-bold">{cta.primaryCta.label}</Cap>
          <Cap left={80} cap={47} fs={14.5} className="whitespace-nowrap opacity-90">{cta.primaryCta.subLabel}</Cap>
        </a>
        <a href={cta.secondaryCta.href} className="absolute rounded-[6px] text-white" style={{ left: A.btn2[0], top: A.btn2[1], width: A.btn2[2], height: A.btn2[3], border: "1px solid #5b6472", background: "rgba(0,0,0,0.25)" }}>
          <span className="absolute" style={{ left: 28, top: A.btn2[3] / 2 - 14, width: 28, height: 28 }}><Phone style={{ width: 28, height: 28 }} /></span>
          <Cap left={80} cap={24} fs={17} className="whitespace-nowrap font-bold">{cta.secondaryCta.label}</Cap>
          <Cap left={80} cap={49} fs={14.5} className="whitespace-nowrap opacity-90">{cta.secondaryCta.subLabel}</Cap>
        </a>
        <span className="absolute flex items-center gap-1" style={{ left: A.tp.x, top: A.tp.cap - 9, color: C.text, fontSize: 22 }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: 30, height: 30 }} fill="#00b67a">
            <path d="m12 2 2.9 7 7.6.6-5.8 4.9 1.8 7.5L12 18 5.5 22l1.8-7.5L1.5 9.6 9.1 9 12 2Z" />
          </svg>
          {cta.review.brand}
        </span>
        <span className="absolute" style={{ left: A.tp.starsX, top: A.tp.starsTop }}>
          <Stars count={cta.review.stars} size={27} />
        </span>
        <Cap left={A.tp.x} cap={A.tp.scoreCap} fs={16} className="whitespace-nowrap" style={{ color: C.soft }}>{cta.review.score}</Cap>
      </div>

      <div className="relative" style={{ ...card, marginTop: PH.disc.mt, height: PH.disc.h, background: isDark ? C.card : "#f4f7fd" }}>
        <span className="absolute flex items-center justify-center rounded-[10px]" style={{ left: PH.disc.icon[0], top: PH.disc.icon[1], width: PH.disc.icon[2], height: PH.disc.icon[2], background: isDark ? "#10233d" : "#e6edfb", color: C.blue }}>
          <Shield style={{ width: 34, height: 34 }} />
        </span>
        <Cap as="h3" left={PH.disc.textX} cap={PH.disc.titleCap} fs={PH.disc.title} className="whitespace-nowrap font-bold" style={{ color: C.blue }}>{data.disclaimer.title}</Cap>
        <Cap as="p" left={PH.disc.textX} cap={PH.disc.textCap} fs={PH.disc.text} lh={PH.disc.lh} className="whitespace-pre" style={{ color: C.soft }}>{data.disclaimer.textPhone}</Cap>
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
      <ScaleBox width={1536}>
        <Desktop data={data} isDark={isDark} open={open} setOpen={setOpen} />
      </ScaleBox>
      <ScaleBox width={388} max={1.5}>
        <PhoneView data={data} isDark={isDark} open={open} setOpen={setOpen} />
      </ScaleBox>
    </section>
  );
}
