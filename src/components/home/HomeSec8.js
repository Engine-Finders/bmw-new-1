"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";
import ScaleBox from "@/components/home/ScaleBox";

// BMW Knowledge Centres — eight numbered engine cards (4 × 2 on desktop, stacked on phones)
// under a G30 front view, closed by the M-colour stripe.

function CardIcon({ type, className = "h-6 w-6", style, strokeWidth = 1.9 }) {
  const common = { style, fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "wrench")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...common}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
      </svg>
    );
  if (type === "trophy")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...common}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    );
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} {...common}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  );
}

function Arrow({ style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={style} fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M3.5 12h16.5m-6.5-6.5L20 12l-6.5 6.5" />
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

// Desktop spec measured on the 1536px references (Section 8.1.png light, Section 8.png dark).
// Tops are cap-height tops relative to the section top; card values are relative to the card.
const SPEC = {
  light: {
    padL: 77, padR: 80, gap: 17, cols: [333, 334, 333, 328], h: 942,
    h2: { cap: 79, fs: 52.5, lh: 60, track: "-0.045em", dx: -1 }, p: { cap: 149, fs: 15.8, lh: 26 },
    car: { left: 879, top: -209, width: 715, opacity: 0.22 },
    rows: [{ top: 249, h: 315, img: 131, title: 146, desc: 182, explore: 282 }, { top: 580, h: 309, img: 120, title: 136, desc: 174, explore: 274 }],
    badge: { w: 32, h: 35, top: 2, fs: 20 }, circle: { cx: 72, cy: [37.5, 36], d: 52, glyph: 26 },
    pad: 18, title: 20.4, desc: [14, 22], explore: 15, exploreRight: 15, exploreGap: 6, exploreWeight: 700, glyphStroke: 2.1,
    bar: { top: 913, h: 10, left: 68, right: 61 },
  },
  dark: {
    padL: 67, padR: 71, gap: 21, cols: [340, 334, 327, 334], h: 936,
    h2: { cap: 57, fs: 59, lh: 66, track: "-0.03em", dx: -1 }, p: { cap: 126, fs: 17.6, lh: 27.5 },
    car: { left: 832, top: -230, width: 774, opacity: 0.62 },
    rows: [{ top: 225, h: 319, img: 143, title: 160, desc: 195, explore: 289 }, { top: 560, h: 307, img: 130, title: 146, desc: 183, explore: 276 }],
    badge: { w: 47, h: 55, top: 0, fs: 28 }, circle: { cx: 84, cy: [43, 40], d: 57, glyph: 33 },
    pad: 16, title: 21.3, desc: [14.3, 21.2], explore: 16, exploreRight: 16, exploreGap: 8, exploreWeight: 400, glyphStroke: 2.4,
    bar: { top: 891, h: 25, left: 46, right: 0 },
  },
};

const COL = {
  light: { bg: "#fefefe", h2: "#0a0f2c", accent: "#0b4fe0", para: "#3f4766", title: "#0b1236", desc: "#2b3150", blue: "#0b4fe0", card: "#ffffff", border: "#eceef2",
    shadow: "0 4px 18px rgba(16,24,48,0.05)", badge: "#0b55f0", circleBg: "#ffffff", circleBorder: "1px solid #2a62e8", glyph: "#0b4fe0" },
  dark: { bg: "#030a12", h2: "#ffffff", accent: "#ffffff", para: "#e4e6ea", title: "#ffffff", desc: "#c9ccd2", blue: "#2f7bec", card: "#06111c", border: "#2a3644",
    shadow: "none", badge: "linear-gradient(160deg,#0b48a8,#062c6c)", circleBg: "rgba(3,10,18,0.55)", circleBorder: "2px solid rgba(255,255,255,0.92)", glyph: "#ffffff" },
};

function Stripe({ isDark, style, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute block [clip-path:polygon(0.4%_0,100%_0,99.6%_100%,0_100%)] ${className}`}
      style={{
        background: isDark
          ? "linear-gradient(90deg,#0a3c8a 0%,#0d4fb0 36%,#122a57 40%,#1c2b55 68%,#a3141f 74%,#c1121f 90%,rgba(193,18,31,0) 100%)"
          : "linear-gradient(90deg,#0055f3 0%,#0055f3 37%,#2f6fe8 38%,#7a74b8 60%,#b25a78 73%,#d40c20 74%,#d40c20 90%,rgba(212,12,32,0.15) 100%)",
        ...style,
      }}
    />
  );
}

function Desktop({ data, isDark }) {
  const t = isDark ? "dark" : "light";
  const S = SPEC[t];
  const C = COL[t];

  return (
    <div className="relative mx-auto hidden w-full max-w-[1600px] overflow-hidden lg:block" style={{ height: S.h }}>
      <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: `calc(100% - ${1536 - S.car.left}px)`, top: S.car.top, width: S.car.width }}>
        {isDark ? <div className="absolute inset-x-[-10%] top-[30%] h-[60%] bg-[radial-gradient(ellipse_at_50%_40%,rgba(60,84,120,0.35),transparent_70%)]" /> : null}
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt={data.headerImage.alt} width={662} height={504} sizes="780px" className={`relative h-auto w-full ${isDark ? "" : "mix-blend-multiply"}`} style={{ opacity: S.car.opacity }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 58%, ${C.bg} 76%)` }} />
      </div>

      <h2 className="absolute whitespace-nowrap font-bold [&_.heading-accent]:!text-[var(--acc)]" style={{ left: S.padL + S.h2.dx, top: S.h2.cap - capOffset(S.h2.fs, S.h2.lh), fontSize: S.h2.fs, lineHeight: `${S.h2.lh}px`, letterSpacing: S.h2.track, color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
      <Cap as="p" left={S.padL} cap={S.p.cap} fs={S.p.fs} lh={S.p.lh} className="whitespace-pre" style={{ color: C.para }}>{data.subHeadlineDesktop}</Cap>

      {S.rows.map((r, ri) => (
        <div key={ri} className="absolute grid" style={{ left: S.padL, right: S.padR, top: r.top, height: r.h, columnGap: S.gap, gridTemplateColumns: S.cols.map((w) => `minmax(0,${w}fr)`).join(" ") }}>
          {data.centres.slice(ri * 4, ri * 4 + 4).map((c) => (
            <article key={c.id} className="relative overflow-hidden rounded-[8px]" style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
              <div className="absolute inset-x-0 top-0" style={{ height: r.img }}>
                <Image src={isDark ? c.image.dark : c.image.src} alt={c.image.alt} fill sizes="340px" className="object-cover object-left-top" />
              </div>
              <span
                className={`absolute left-0 flex items-center justify-center text-white ${isDark ? "[clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]" : "rounded-br-[6px] rounded-tl-[8px]"}`}
                style={{ top: S.badge.top, width: S.badge.w, height: S.badge.h, background: C.badge, fontSize: S.badge.fs, lineHeight: 1, paddingRight: isDark ? 8 : 0 }}
              >
                {c.id}
              </span>
              <span className="absolute flex items-center justify-center rounded-full" style={{ left: S.circle.cx - S.circle.d / 2, top: S.circle.cy[ri] - S.circle.d / 2, width: S.circle.d, height: S.circle.d, background: C.circleBg, border: C.circleBorder, color: C.glyph }}>
                <CardIcon type={c.iconType} className="" style={{ width: S.circle.glyph, height: S.circle.glyph }} strokeWidth={S.glyphStroke} />
              </span>
              <Cap as="h3" left={S.pad} cap={r.title} fs={S.title} className="whitespace-nowrap font-bold tracking-[-0.02em]" style={{ color: C.title }}>{c.title}</Cap>
              <Cap as="p" left={S.pad} cap={r.desc} fs={S.desc[0]} lh={S.desc[1]} className="whitespace-pre" style={{ color: C.desc }}>{c.descriptionDesktop}</Cap>
              <Link href={c.link.href} className="absolute flex items-center" style={{ fontWeight: S.exploreWeight, right: S.exploreRight, top: r.explore - capOffset(S.explore, S.explore * 1.2), fontSize: S.explore, lineHeight: `${S.explore * 1.2}px`, color: C.blue, gap: S.exploreGap }}>
                {c.link.label.replace(" →", "")}
                <Arrow style={{ width: 19, height: 19 }} />
              </Link>
            </article>
          ))}
        </div>
      ))}

      <Stripe isDark={isDark} style={{ left: S.bar.left, right: S.bar.right, top: S.bar.top, height: S.bar.h }} />
    </div>
  );
}

// Phone spec measured on Section 8.2.png (two 431px panels; the second continues the first).
const PH = {
  h: 3582, inset: [22, 19],
  img: { left: 208, top: 1, w: 201, h: 384 },
  h2: { left: 24, cap: 66, fs: 41, lh: 54, track: "-0.03em" }, underline: { top: 186, w: 56 },
  p: { left: 25, cap: 219, fs: 14.4, lh: 23.3, gap2: 87 },
  cards: [
    { top: 385, h: 372, img: 167, title: 179, desc: 218, explore: 329 },
    { top: 770, h: 358, img: 162, title: 170, desc: 211, explore: 318 },
    { top: 1140, h: 332, img: 162, title: 170, desc: 209, explore: 292 },
    { top: 1484, h: 360, img: 133, title: 141, desc: 175, explore: 300 },
    { top: 1856.5, h: 358, img: 169, title: 179, desc: 222, explore: 315 },
    { top: 2227.5, h: 376, img: 169, title: 179, desc: 221, explore: 332 },
    { top: 2615.5, h: 350, img: 166, title: 176, desc: 218, explore: 307 },
    { top: 2979.5, h: 364, img: 163, title: 171, desc: 210, explore: 320 },
  ],
  badge: { left: 15.5, top: 13, w: 37, h: 41, fs: 26 }, circle: { cx: 48, cy: 79.5, d: 67, glyph: 36 }, photoX: 110,
  pad: 19, title: 23, desc: [15, 23.3], explore: 16, exploreRight: 18,
  footer: { top: 3362.5, h: 171, disc: [19, 20, 61], textX: 105, titleCap: 31, titleLh: 26, title: 17.9, textCap: 89, text: 13.2, textLh: 22 },
  bar: { top: 3553.5, h: 9, left: 445 - 431, right: 0 },
};

function Phone({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  const card = { left: PH.inset[0], right: PH.inset[1], background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: C.shadow };

  return (
    <div className="relative overflow-hidden lg:hidden" style={{ height: PH.h }}>
      <div aria-hidden="true" className="pointer-events-none absolute right-0 overflow-hidden" style={{ top: PH.img.top, width: PH.img.w, height: PH.img.h }}>
        {isDark ? (
          <Image src={data.centres[5].image.dark} alt="" fill sizes="210px" className="object-cover object-right [mask-image:linear-gradient(200deg,black_40%,transparent_85%)]" />
        ) : (
          <Image src={data.headerImage.phone} alt="" fill sizes="210px" className="object-cover object-left-top" />
        )}
      </div>

      <h2 className="absolute whitespace-nowrap font-bold [&_.heading-accent]:text-[var(--acc)]" style={{ left: PH.h2.left, top: PH.h2.cap - capOffset(PH.h2.fs, PH.h2.lh), fontSize: PH.h2.fs, lineHeight: `${PH.h2.lh}px`, letterSpacing: PH.h2.track, color: C.h2, "--acc": isDark ? "#2f7bec" : C.accent }} dangerouslySetInnerHTML={{ __html: data.h2Phone }} />
      <span aria-hidden="true" className="absolute h-[4px] rounded-[1px]" style={{ left: PH.p.left, top: PH.underline.top, width: PH.underline.w, background: C.blue }} />
      {data.subHeadlinePhone.map((para, i) => (
        <Cap key={i} as="p" left={PH.p.left} cap={PH.p.cap + i * PH.p.gap2} fs={PH.p.fs} lh={PH.p.lh} className="whitespace-pre" style={{ color: isDark ? C.para : "#27306a" }}>{para}</Cap>
      ))}

      {data.centres.map((c, i) => {
        const k = PH.cards[i];
        return (
          <article key={c.id} className="absolute overflow-hidden" style={{ ...card, top: k.top, height: k.h }}>
            <div className="absolute right-[2px] top-[2px]" style={{ left: PH.photoX, height: k.img }}>
              <Image src={isDark ? c.image.dark : c.image.phone} alt={c.image.alt} fill sizes="290px" className={isDark ? "object-cover object-right" : "object-cover object-left-top"} />
            </div>
            <span className={`absolute flex items-center justify-center text-white ${isDark ? "" : "rounded-[3px]"}`} style={{ left: PH.badge.left, top: PH.badge.top, width: PH.badge.w, height: PH.badge.h, background: C.badge, fontSize: PH.badge.fs, lineHeight: 1 }}>
              {c.id}
            </span>
            <span className="absolute flex items-center justify-center rounded-full" style={{ left: PH.circle.cx - PH.circle.d / 2, top: PH.circle.cy - PH.circle.d / 2, width: PH.circle.d, height: PH.circle.d, background: isDark ? "rgba(47,123,236,0.14)" : "#eef3fd", color: isDark ? "#ffffff" : C.glyph }}>
              <CardIcon type={c.iconType} style={{ width: PH.circle.glyph, height: PH.circle.glyph }} className="" strokeWidth={2.4} />
            </span>
            <Cap as="h3" left={PH.pad} cap={k.title} fs={PH.title} className="whitespace-nowrap font-bold tracking-[-0.02em]" style={{ color: C.title }}>{c.title}</Cap>
            <Cap as="p" left={PH.pad} cap={k.desc} fs={PH.desc[0]} lh={PH.desc[1]} className="whitespace-pre" style={{ color: C.desc }}>{c.descriptionPhone}</Cap>
            <Link href={c.link.href} className="absolute flex items-center font-bold" style={{ right: PH.exploreRight, top: k.explore - capOffset(PH.explore, PH.explore * 1.2), fontSize: PH.explore, lineHeight: `${PH.explore * 1.2}px`, color: C.blue, gap: 8 }}>
              {c.link.label.replace(" →", "")}
              <Arrow style={{ width: 20, height: 20 }} />
            </Link>
          </article>
        );
      })}

      <div className="absolute" style={{ ...card, top: PH.footer.top, height: PH.footer.h, background: isDark ? C.card : "#f4f7fe", border: `1px solid ${isDark ? C.border : "#edf1fb"}`, boxShadow: "none" }}>
        <span className="absolute flex items-center justify-center rounded-full text-white" style={{ left: PH.footer.disc[0], top: PH.footer.disc[1], width: PH.footer.disc[2], height: PH.footer.disc[2], background: "#0b55f0" }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[42%] w-[42%]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
            <path d="M12 2.8 5 5.6v5.7c0 4.6 3 8.4 7 9.9 4-1.5 7-5.3 7-9.9V5.6l-7-2.8Z" />
            <path d="m8.8 12 2.2 2.2 4.3-4.4" strokeLinecap="round" />
          </svg>
        </span>
        <Cap as="p" left={PH.footer.textX} cap={PH.footer.titleCap} fs={PH.footer.title} lh={PH.footer.titleLh} className="whitespace-nowrap font-bold" style={{ color: C.title }}>
          <span className="block">{data.footer.title}</span>
          <span className="block">{data.footer.titleLine2}</span>
        </Cap>
        <Cap as="p" left={PH.footer.textX} cap={PH.footer.textCap} fs={PH.footer.text} lh={PH.footer.textLh} className="whitespace-pre" style={{ color: C.desc }}>{data.footer.textPhone}</Cap>
      </div>

      <Stripe isDark={isDark} style={{ left: PH.bar.left, right: PH.bar.right, top: PH.bar.top, height: PH.bar.h }} />
    </div>
  );
}

export default function HomeSec8({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <ScaleBox width={1536}>
        <Desktop data={data} isDark={isDark} />
      </ScaleBox>
      <ScaleBox width={431} max={1.5}>
        <Phone data={data} isDark={isDark} />
      </ScaleBox>
    </section>
  );
}
