"use client";

// Engine page design kit: palette, shared card / disc / eyebrow / stars, and the data-text
// clean-up every engine section uses. Colours are sampled from the client references.
import { useTheme } from "@/components/shared/themeProvider";
import { variantFont } from "@/components/variant/variantFont";
import { cleanText, codeVariants, textSegments } from "./engineText";

export const sectionFont = variantFont;

export const TONES = {
  dark: {
    "--eg-page": "#00060f",
    "--eg-page-2": "#061020",
    "--eg-card": "rgba(6, 16, 30, 0.78)",
    "--eg-card-solid": "#06111f",
    "--eg-card-border": "rgba(132, 168, 222, 0.2)",
    "--eg-card-top": "rgba(74, 144, 255, 0.5)",
    "--eg-card-shadow": "0 12px 32px rgba(0, 0, 0, 0.35)",
    "--eg-text": "#ffffff",
    "--eg-muted": "rgba(222, 232, 246, 0.74)",
    "--eg-soft": "rgba(200, 214, 234, 0.58)",
    "--eg-divider": "rgba(255, 255, 255, 0.11)",
    "--eg-blue": "#1f6fff",
    "--eg-blue-strong": "#0b46d8",
    "--eg-sky": "#4d94ff",
    "--eg-tag": "#4d94ff",
    "--eg-green": "#4ade80",
    "--eg-red": "#ef4444",
    "--eg-star-off": "#5b6575",
    "--eg-disc": "rgba(12, 32, 66, 0.72)",
    "--eg-disc-ring": "rgba(78, 138, 236, 0.5)",
    "--eg-pill": "#14202f",
    "--eg-pill-text": "#ffffff",
    "--eg-band": "linear-gradient(90deg, #0b2f7a, #0a3696)",
    "--eg-band-text": "#ffffff",
    "--eg-watermark": "rgba(126, 166, 232, 0.1)",
    "--eg-cta": "linear-gradient(180deg, #1a5cf0, #0b46d8)",
    "--eg-cta-text": "#ffffff",
    "--eg-navy": "linear-gradient(160deg, #0a1f4d, #061430)",
  },
  light: {
    "--eg-page": "#eef4fd",
    "--eg-page-2": "#dfe8f5",
    "--eg-card": "rgba(255, 255, 255, 0.86)",
    "--eg-card-solid": "#ffffff",
    "--eg-card-border": "#e3e9f2",
    "--eg-card-top": "rgba(255, 255, 255, 0)",
    "--eg-card-shadow": "0 8px 24px rgba(16, 42, 86, 0.07)",
    "--eg-text": "#0b1a33",
    "--eg-muted": "#4b5565",
    "--eg-soft": "#5f6b7d",
    "--eg-divider": "#e3e9f2",
    "--eg-blue": "#1268f3",
    "--eg-blue-strong": "#0b4fd0",
    "--eg-sky": "#1268f3",
    "--eg-tag": "#1060e6",
    "--eg-green": "#15803d",
    "--eg-red": "#dc2626",
    "--eg-star-off": "#c3cede",
    "--eg-disc": "#ffffff",
    "--eg-disc-ring": "#dbe5f4",
    "--eg-pill": "#0d1b2e",
    "--eg-pill-text": "#ffffff",
    "--eg-band": "#edf3fe",
    "--eg-band-text": "#0b1a33",
    "--eg-watermark": "#cfe0fb",
    "--eg-cta": "linear-gradient(180deg, #1a5cf0, #0b46d8)",
    "--eg-cta-text": "#ffffff",
    "--eg-navy": "linear-gradient(160deg, #06245a, #031a3f)",
  },
};

/** { isDark, vars } — spread `vars` on the section's `style` so every --eg-* token resolves. */
export function useEngineTone() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return { isDark, vars: isDark ? TONES.dark : TONES.light };
}

/** Section shell classes: page colour, Inter, clipping for decorative bleed. */
export const SECTION_CLASS = `relative w-full overflow-hidden bg-[var(--eg-page)] text-[var(--eg-text)] ${variantFont.className}`;

/** The shared card: radius 10, 1px border, card fill, soft shadow, faint blue top highlight in dark. */
export const CARD =
  "rounded-[10px] border border-[var(--eg-card-border)] bg-[var(--eg-card)] [box-shadow:inset_0_1px_0_var(--eg-card-top),var(--eg-card-shadow)]";

/* ------------------------------------------------------------------ text */

/** Data copy with [TAGS] in the accent blue (never wrapping) and placeholders hidden. */
export function DataText({ text, as: Tag = "span", className = "", tagClassName = "" }) {
  const parts = textSegments(text);
  if (!parts.length) return null;
  return (
    <Tag className={className}>
      {parts.map((part, i) =>
        part.type === "tag" ? (
          <span key={i} className={`whitespace-nowrap text-[var(--eg-tag)] ${tagClassName}`}>
            {part.value}
          </span>
        ) : (
          <span key={i}>{part.value}</span>
        ),
      )}
    </Tag>
  );
}

/** `text` with the first spelling of `accent` found (e.g. the engine code) wrapped in the blue span. */
export function Accent({ text = "", accent = "", className = "text-[var(--eg-blue)]" }) {
  const value = cleanText(text);
  const hit = codeVariants(accent).find((v) => value.includes(v));
  if (!hit) return value;
  const parts = value.split(hit);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 ? <span className={className}>{hit}</span> : null}
    </span>
  ));
}

/* ------------------------------------------------------------- elements */

/** "— LABEL" (default) or "— LABEL —" (`both`). Size/weight come from className. */
export function Eyebrow({ children, both = false, className = "t-label font-semibold", lineClassName = "w-[30px]" }) {
  const line = <span aria-hidden className={`h-[2px] shrink-0 rounded-full bg-[var(--eg-blue)] ${lineClassName}`} />;
  return (
    <p className={`flex items-center gap-3 uppercase tracking-[0.04em] text-[var(--eg-blue)] ${both ? "justify-center" : ""} ${className}`}>
      {line}
      <span>{children}</span>
      {both ? line : null}
    </p>
  );
}

/** Short single blue bar under a heading. */
export function Underline({ className = "mt-3 h-[3px] w-[60px]" }) {
  return <span aria-hidden className={`block rounded-full bg-[var(--eg-blue)] ${className}`} />;
}

const DISC_SIZE = {
  sm: "h-11 w-11",
  md: "h-12 w-12 lg:h-16 lg:w-16",
  lg: "h-12 w-12 lg:h-[78px] lg:w-[78px]",
};

/** Circular icon disc with a thin ring; the icon inherits the blue colour. */
export function IconDisc({ size = "md", className = "", children }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-[var(--eg-disc-ring)] bg-[var(--eg-disc)] text-[var(--eg-blue)] [box-shadow:0_0_0_4px_color-mix(in_srgb,var(--eg-disc-ring)_18%,transparent)] ${DISC_SIZE[size] || size} ${className}`}
    >
      {children}
    </span>
  );
}

const STAR_PATH = "M12 2.6l2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5L2.6 9.5l6.5-.9z";

/** Five stars: full, half (split blue/grey) and empty. */
export function Stars({ value = 0, className = "h-5 w-5", gap = "gap-1", label = true }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className={`inline-flex items-center ${gap}`} role={label ? "img" : undefined} aria-label={label ? `${v} out of 5 stars` : undefined}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, v - i));
        return (
          <span key={i} className={`relative inline-block shrink-0 ${className}`} aria-hidden>
            <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full fill-[var(--eg-star-off)]">
              <path d={STAR_PATH} />
            </svg>
            {fill > 0 ? (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <svg viewBox="0 0 24 24" className={`h-full fill-[var(--eg-blue)] ${className}`} style={{ maxWidth: "none" }}>
                  <path d={STAR_PATH} />
                </svg>
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

/** Outlined data tag badge, e.g. BMW-VERIFIED with a shield. */
export function TagBadge({ children, className = "" }) {
  return (
    <span
      className={`t-label inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md border border-[color-mix(in_srgb,var(--eg-blue)_55%,transparent)] px-3 py-1.5 font-semibold text-[var(--eg-tag)] ${className}`}
    >
      <EIcon name="shield-check" className="h-4 w-4" />
      {children}
    </span>
  );
}

/** Simplified BMW roundel (decorative; pass a label to make it informative). */
export function BmwRoundel({ className = "h-11 w-11", label }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <circle cx="50" cy="50" r="49" fill="#0b0b0d" stroke="#c9ced6" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="31" fill="#ffffff" />
      <path d="M50 50V19a31 31 0 0 0-31 31z" fill="#1c69d4" />
      <path d="M50 50v31a31 31 0 0 0 31-31z" fill="#1c69d4" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#c9ced6" strokeWidth="1" />
      <g fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="15" textAnchor="middle">
        <text x="26" y="31" transform="rotate(-42 26 31)">B</text>
        <text x="50" y="16">M</text>
        <text x="74" y="31" transform="rotate(42 74 31)">W</text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- icons */

// Outlined line icons in the reference style: 24px grid, stroke 1.75, rounded caps/joins.
const ICONS = {
  "shield-check": <><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" /><path d="M8.6 12.2l2.3 2.3 4.5-4.6" /></>,
  shield: <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" />,
  truck: <><path d="M2.5 6.5h11v9h-11z" /><path d="M13.5 9.5h4l3 3.2v2.8h-7" /><circle cx="6.5" cy="17" r="1.8" /><circle cx="17" cy="17" r="1.8" /></>,
  rosette: <><circle cx="12" cy="9" r="5.5" /><circle cx="12" cy="9" r="2.8" /><path d="M8.6 13.4L7 21l5-2.6 5 2.6-1.6-7.6" /></>,
  headset: <><path d="M4.5 13.5V12a7.5 7.5 0 0 1 15 0v1.5" /><rect x="3.5" y="13" width="3.5" height="5.5" rx="1.5" /><rect x="17" y="13" width="3.5" height="5.5" rx="1.5" /><path d="M19 18.5c0 1.5-1.6 2.5-4 2.5h-2" /></>,
  users: <><circle cx="12" cy="7.5" r="3" /><path d="M6.5 20v-2.5a4.5 4.5 0 0 1 4.5-4.5h2a4.5 4.5 0 0 1 4.5 4.5V20" /><circle cx="5" cy="9.5" r="2.2" /><path d="M1.8 19v-1.6a3.4 3.4 0 0 1 3.4-3.4" /><circle cx="19" cy="9.5" r="2.2" /><path d="M22.2 19v-1.6a3.4 3.4 0 0 0-3.4-3.4" /></>,
  car: <><path d="M4 16.5v-4l1.8-4.6A2 2 0 0 1 7.7 6.6h8.6a2 2 0 0 1 1.9 1.3l1.8 4.6v4" /><path d="M3 12.5h18v4.5H3z" /><path d="M5 17v2h2.5v-2M16.5 17v2H19v-2" /><circle cx="7" cy="14.6" r=".9" /><circle cx="17" cy="14.6" r=".9" /></>,
  trophy: <><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z" /><path d="M7.5 6H4.5a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4" /><path d="M12 13.5V17M8.5 20.5h7l-.8-3.5H9.3z" /></>,
  engine: <><path d="M6 9h3V7h6v2h2l2 2v1.5h1.5v3H19V17h-3l-1.5 1.5H8.5L6 16H4.5v-2.5H3V11h1.5V9z" /><circle cx="12" cy="13" r="2.2" /></>,
  drop: <path d="M12 3.2c3.3 4 5.6 7.3 5.6 10.3a5.6 5.6 0 0 1-11.2 0c0-3 2.3-6.3 5.6-10.3z" />,
  gauge: <><path d="M4.2 17.5a8.5 8.5 0 1 1 15.6 0" /><path d="M12 13.5l3.6-3.6" /><circle cx="12" cy="13.5" r="1.4" /><path d="M7 11.5l.9.5M12 7.5v1M17 11.5l-.9.5" /></>,
  piston: <><rect x="6.5" y="3" width="11" height="7" rx="1.2" /><path d="M6.5 5.5h11M6.5 7.8h11" /><path d="M10 10l-1.8 6.2M14 10l1.8 6.2" /><circle cx="12" cy="18.6" r="2.4" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /><path d="M7.5 13h1.5M11.25 13h1.5M15 13h1.5M7.5 16.5h1.5M11.25 16.5h1.5M15 16.5h1.5" /></>,
  pound: <><circle cx="12" cy="12" r="9" /><path d="M14.8 8.6a2.6 2.6 0 0 0-4.8 1.4V16M8.5 12.6h4.6M8.5 16h7" /></>,
  wrench: <><path d="M14.5 4.2a4.5 4.5 0 0 0-5 6l-6 6a1.6 1.6 0 0 0 2.3 2.3l6-6a4.5 4.5 0 0 0 6-5l-2.6 2.6-2.4-.3-.3-2.4z" /></>,
  tools: <><path d="M14.6 4.5a3.8 3.8 0 0 0-4.3 5L4 15.8a1.5 1.5 0 0 0 2.1 2.1l6.3-6.3a3.8 3.8 0 0 0 5-4.3l-2.2 2.2-2-.2-.2-2z" /><path d="M4.2 4.2l1.6-.8 3.3 3.3-.8 1.6zM13.5 14.4l5.6 5.6a1.4 1.4 0 0 0 2-2l-5.6-5.6" /></>,
  box: <><path d="M12 2.8l8.2 4.6v9.2L12 21.2l-8.2-4.6V7.4z" /><path d="M3.8 7.4L12 12l8.2-4.6M12 12v9.2" /><path d="M8 5.1l8.2 4.6" /></>,
  bars: <><path d="M4 20.5h16" /><rect x="5" y="12" width="3" height="7" rx=".5" /><rect x="10.5" y="7" width="3" height="12" rx=".5" /><rect x="16" y="3.5" width="3" height="15.5" rx=".5" /></>,
  "chart-up": <><path d="M3.5 20.5h17" /><rect x="5" y="14" width="2.6" height="5" rx=".4" /><rect x="9.6" y="11.5" width="2.6" height="7.5" rx=".4" /><rect x="14.2" y="13" width="2.6" height="6" rx=".4" /><path d="M4.5 10.5l4.5-4 3.5 3 6.5-6M15.5 3.5h3.5V7" /></>,
  star: <path d={STAR_PATH} />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  "check-circle": <><circle cx="12" cy="12" r="9" /><path d="M7.8 12.3l2.8 2.8 5.6-5.8" /></>,
  warning: <><path d="M12 3.5l9 16H3z" /><path d="M12 9.5v4.8M12 17.2v.3" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.8v.2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  document: <><path d="M6 3h8.5L19 7.5V21H6z" /><path d="M14 3v5h5M9 12.5h7M9 16h7" /></>,
  "doc-search": <><path d="M5 3h8l4 4v5" /><path d="M5 3v17h6" /><circle cx="16" cy="16.5" r="3.3" /><path d="M18.4 18.9l2.6 2.6" /></>,
  pin: <><path d="M12 21.5s6.5-6.2 6.5-11.5a6.5 6.5 0 0 0-13 0c0 5.3 6.5 11.5 6.5 11.5z" /><circle cx="12" cy="10" r="2.5" /></>,
  calculator: <><rect x="5" y="2.8" width="14" height="18.4" rx="2" /><path d="M8 6.5h8v3H8zM8.5 13h.5M11.75 13h.5M15 13h.5M8.5 17h.5M11.75 17h.5M15 17h.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.3 2" /></>,
  "arrow-right": <path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5" />,
  "chevron-right": <path d="M9.5 6l6 6-6 6" />,
  "chevron-down": <path d="M6 9.5l6 6 6-6" />,
};

/** Line icon by name (stroke 1.75, currentColor). `solid` fills the shape too. */
export function EIcon({ name, className = "h-6 w-6", solid = false, strokeWidth = 1.75 }) {
  const glyph = ICONS[name];
  if (!glyph) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={solid ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {glyph}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(ICONS);
