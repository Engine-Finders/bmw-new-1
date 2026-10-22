// Line icons for the variant page (24px grid, stroke = currentColor), plus the few
// solid glyphs the designs use (hero trust badges, filled circles).

const SHIELD = "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";
const WRENCH = "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z";
const STAR = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";
const GEAR = "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z";
const TAG = "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z";

const LINE = {
  wrench: <path d={WRENCH} />,
  shield: <path d={SHIELD} />,
  shieldCheck: (
    <>
      <path d={SHIELD} />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  userBadge: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M5 21v-1.5A4.5 4.5 0 0 1 9.5 15h5a4.5 4.5 0 0 1 4.5 4.5V21" />
      <path d="m10 15 2 3 2-3" />
    </>
  ),
  tag: (
    <>
      <path d={TAG} />
      <circle cx="7.5" cy="7.5" r="1" />
    </>
  ),
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  calendarDays: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m18 15-6-6-6 6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  pound: (
    <>
      <path d="M17 7.5c0-2.5-1.8-4-4.2-4C10.3 3.5 9 5.3 9 7.6V20" />
      <path d="M6 20h12" />
      <path d="M6 12.5h8" />
    </>
  ),
  poundCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M14.8 9c0-1.4-1-2.4-2.4-2.4-1.5 0-2.4 1.1-2.4 2.5V17" />
      <path d="M8.2 17h7.6" />
      <path d="M8.2 12.5h5" />
    </>
  ),
  gear: (
    <>
      <path d={GEAR} />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  flask: (
    <>
      <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
      <path d="M6.453 15h11.094" />
      <path d="M8.5 2h7" />
    </>
  ),
  star: <path d={STAR} />,
  carFront: (
    <>
      <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" />
      <path d="M7 14h.01" />
      <path d="M17 14h.01" />
      <rect x="3" y="10" width="18" height="8" rx="2" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
    </>
  ),
  scales: (
    <>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  fan: (
    <>
      <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z" />
      <path d="M12 12v.01" />
    </>
  ),
  thermometer: (
    <>
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
      <path d="M17 6h2M17 9h2M17 12h2" />
    </>
  ),
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </>
  ),
  gauge: (
    <>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </>
  ),
  timer: (
    <>
      <path d="M10 2h4" />
      <path d="M12 14l3-3" />
      <circle cx="12" cy="14" r="8" />
    </>
  ),
  book: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8.5 11h5M11 8.5v5" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  alert: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  network: (
    <>
      <path d="M12 4.5 4.5 18h15Z" />
      <circle cx="12" cy="4.5" r="2" />
      <circle cx="4.5" cy="18" r="2" />
      <circle cx="19.5" cy="18" r="2" />
      <path d="M12 10v3" />
    </>
  ),
  fuel: (
    <>
      <path d="M3 22h12" />
      <path d="M4 9h10" />
      <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
      <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
    </>
  ),
  radiator: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 5v14M11 5v14M15 5v14" />
      <path d="M3 9h18M3 15h18" />
    </>
  ),
  pulse: <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />,
  fileText: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </>
  ),
  cloud: (
    <>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path d="M9 14.5c.8-.9 2-.9 2.8 0s2 .9 2.8 0" />
    </>
  ),
  turbo: (
    <>
      <circle cx="11" cy="13" r="8" />
      <circle cx="11" cy="13" r="2.5" />
      <path d="M11 5v5.5M18.6 10.5l-5.3 1.6M5.4 18.5l3.8-3.7M15.5 19.6l-3.2-4.4" />
      <path d="M16 5h5v4" />
    </>
  ),
  gridDots: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" strokeWidth="2.6" />
    </>
  ),
  oilCan: (
    <>
      <path d="M3 11h4l2-2h4l2 2 6-3-5 8H6a3 3 0 0 1-3-3z" />
      <path d="M10 9V6M8 6h4" />
      <path d="M21 14.5c0 .8-.6 1.5-1.3 1.5s-1.2-.7-1.2-1.5c0-.8 1.2-2.2 1.2-2.2s1.3 1.4 1.3 2.2Z" />
    </>
  ),
  engine: (
    <>
      <path d="M8 6h6" />
      <path d="M11 6v3" />
      <path d="M5 9h10l2 2h2v-1h2v7h-2v-1h-2l-2 2H8l-2-2H4v-2H2v-3h2v-2z" />
    </>
  ),
  cylinders: (
    <>
      <rect x="3" y="7" width="4" height="12" rx="1" />
      <rect x="10" y="7" width="4" height="12" rx="1" />
      <rect x="17" y="7" width="4" height="12" rx="1" />
      <path d="M5 7V4M12 7V4M19 7V4" />
    </>
  ),
  zap: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  barChart: (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  help: (
    <>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  xCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  ),
};

// Solid glyphs (fill = currentColor) with white detail where the designs show it.
const SOLID = {
  wrench: <path d={WRENCH} fill="currentColor" stroke="currentColor" strokeWidth="1" />,
  shieldCheck: (
    <>
      <path d={SHIELD} fill="currentColor" stroke="currentColor" />
      <path d="m8.5 12 2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="2.4" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11H2z" fill="currentColor" stroke="none" />
      <path d="M14 8h3.5a1 1 0 0 1 .8.4l3.5 4.4a1 1 0 0 1 .2.6V17h-8z" fill="currentColor" stroke="none" />
      <circle cx="7" cy="18" r="2.2" fill="#fff" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="18" r="2.2" fill="#fff" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="7" r="4" fill="currentColor" stroke="none" />
      <path d="M1.5 21v-1.5A5.5 5.5 0 0 1 7 14h4a5.5 5.5 0 0 1 5.5 5.5V21z" fill="currentColor" stroke="none" />
      <circle cx="17" cy="8" r="3.2" fill="currentColor" stroke="none" />
      <path d="M17.5 13.5h.5a4.5 4.5 0 0 1 4.5 4.5v3h-4.5v-1.5a7 7 0 0 0-2.4-5.3z" fill="currentColor" stroke="none" />
    </>
  ),
  tag: (
    <>
      <path d={TAG} fill="currentColor" stroke="currentColor" />
      <circle cx="7.5" cy="7.5" r="1.6" fill="#fff" stroke="none" />
    </>
  ),
  checkCircleSolid: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
      <path d="m7.5 12.2 3 3 6-6" stroke="#fff" strokeWidth="2.4" />
    </>
  ),
  xCircleSolid: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
      <path d="m15.5 8.5-7 7M8.5 8.5l7 7" stroke="#fff" strokeWidth="2.4" />
    </>
  ),
  alertSolid: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" fill="currentColor" stroke="currentColor" />
      <path d="M12 9v4M12 17h.01" stroke="#fff" strokeWidth="2.4" />
    </>
  ),
  star: <path d={STAR} fill="currentColor" stroke="currentColor" />,
};

export default function VIcon({ name, solid = false, className = "h-5 w-5", strokeWidth = 1.8, style }) {
  const glyph = (solid && SOLID[name]) || LINE[name] || SOLID[name] || LINE.check;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyph}
    </svg>
  );
}

const STAR_POINTS = "12.00,2.00 14.59,9.04 22.08,9.32 16.18,13.96 18.23,21.18 12.00,17.00 5.77,21.18 7.82,13.96 1.92,9.32 9.41,9.04";
const STAR_LEFT_HALF = "12.00,2.00 9.41,9.04 1.92,9.32 7.82,13.96 5.77,21.18 12.00,17.00";

/** Rating as five stars (outline for empty, filled for full, left half filled for a half star). */
export function Stars({ rating = 0, className = "h-5 w-5", color }) {
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`${rating} out of 5`} style={{ color }}>
      {[0, 1, 2, 3, 4].map((index) => {
        const part = rating - index >= 1 ? 1 : rating - index >= 0.5 ? 0.5 : 0;
        return (
          <svg key={index} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points={STAR_POINTS} fill={part === 1 ? "currentColor" : "none"} />
            {part === 0.5 ? <polygon points={STAR_LEFT_HALF} fill="currentColor" /> : null}
          </svg>
        );
      })}
    </span>
  );
}

/** UK flag (emoji flags render as letters on Windows). */
export function UkFlag({ className = "h-5 w-7" }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <clipPath id="uk-flag-clip">
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#uk-flag-clip)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
