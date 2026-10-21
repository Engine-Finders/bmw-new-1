"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";

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

function Card({ c, C, isDark, phone = false }) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[10px] border" style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow }}>
      <div className="relative aspect-[340/135] w-full">
        <Image src={isDark ? c.image.dark : phone ? c.image.phone : c.image.src} alt={c.image.alt} fill sizes={phone ? "92vw" : "(min-width: 1408px) 340px, 25vw"} className="object-cover object-left-top" />
        <span
          className={`absolute left-0 top-0 flex h-9 w-9 items-center justify-center text-[18px] text-white ${isDark ? "[clip-path:polygon(0_0,100%_0,82%_100%,0_100%)] pr-1" : "rounded-br-[6px]"}`}
          style={{ background: C.badge }}
        >
          {c.id}
        </span>
        <span className="absolute -bottom-6 left-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: isDark ? "#0b1b2c" : "#ffffff", border: C.circleBorder, color: C.glyph }}>
          <CardIcon type={c.iconType} className="h-6 w-6" strokeWidth={2.1} />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
        <h3 className="t-h6" style={{ color: C.title }}>{c.title}</h3>
        <p className="t-body mt-2" style={{ color: C.desc }}>{c.description}</p>
        <Link href={c.link.href} className="mt-auto flex items-center justify-end gap-2 pt-3 text-[15px] font-semibold" style={{ color: C.blue }}>
          {c.link.label.replace(" →", "")}
          <Arrow style={{ width: 18, height: 18 }} />
        </Link>
      </div>
    </article>
  );
}

// Desktop (lg+): faded G30 front top right, four-by-two card grid, M stripe.
function Desktop({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  return (
    <div className="relative hidden lg:block">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 w-[44%] max-w-[700px] -translate-y-[28%]">
        {isDark ? <div className="absolute inset-x-[-10%] top-[30%] h-[60%] bg-[radial-gradient(ellipse_at_50%_40%,rgba(60,84,120,0.35),transparent_70%)]" /> : null}
        <Image src={isDark ? data.headerImage.dark : data.headerImage.light} alt={data.headerImage.alt} width={662} height={504} sizes="700px" className={`relative h-auto w-full ${isDark ? "" : "mix-blend-multiply"}`} style={{ opacity: isDark ? 0.62 : 0.22 }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 58%, ${C.bg} 76%)` }} />
      </div>
      <div className="site-container section-y relative">
        <div className="max-w-[700px]">
          <h2 className="t-h2 [&_.heading-accent]:!text-[var(--acc)]" style={{ color: C.h2, "--acc": C.accent }} dangerouslySetInnerHTML={{ __html: data.h2 }} />
          <p className="t-p mt-3 max-w-[660px]" style={{ color: C.para }}>{data.subHeadline}</p>
        </div>
        <div className="mt-8 grid grid-cols-4 gap-4">
          {data.centres.map((c) => (
            <Card key={c.id} c={c} C={C} isDark={isDark} />
          ))}
        </div>
        <Stripe isDark={isDark} className="!relative mt-8 h-[10px] w-full" />
      </div>
    </div>
  );
}

// Phone / tablet: heading and copy (no header image beside the H2), stacked cards, data promise.
function Phone({ data, isDark }) {
  const C = COL[isDark ? "dark" : "light"];
  return (
    <div className="relative mx-auto w-full max-w-[720px] px-4 pb-10 pt-10 lg:hidden">
      <h2 className="t-h2 [&_.heading-accent]:text-[var(--acc)]" style={{ color: C.h2, "--acc": isDark ? "#2f7bec" : C.accent }} dangerouslySetInnerHTML={{ __html: data.h2Phone }} />
      <span aria-hidden="true" className="mt-4 block h-[4px] w-14 rounded-[1px]" style={{ background: C.blue }} />
      <p className="t-body mt-4" style={{ color: C.para }}>{data.subHeadline}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {data.centres.map((c) => (
          <Card key={c.id} c={c} C={C} isDark={isDark} phone />
        ))}
      </div>

      <div className="mt-4 flex items-start gap-4 rounded-[10px] border p-4" style={{ background: isDark ? C.card : "#f4f7fe", borderColor: isDark ? C.border : "#edf1fb" }}>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0b55f0] text-white">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
            <path d="M12 2.8 5 5.6v5.7c0 4.6 3 8.4 7 9.9 4-1.5 7-5.3 7-9.9V5.6l-7-2.8Z" />
            <path d="m8.8 12 2.2 2.2 4.3-4.4" strokeLinecap="round" />
          </svg>
        </span>
        <span>
          <span className="block text-[17px] font-bold leading-[1.35]" style={{ color: C.title }}>
            {data.footer.title} {data.footer.titleLine2}
          </span>
          <span className="t-body mt-1 block" style={{ color: C.desc }}>{data.footer.text}</span>
        </span>
      </div>

      <Stripe isDark={isDark} className="!relative mt-6 h-[9px] w-full" />
    </div>
  );
}

export default function HomeSec8({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? COL.dark.bg : COL.light.bg }}>
      <Desktop data={data} isDark={isDark} />
      <Phone data={data} isDark={isDark} />
    </section>
  );
}
