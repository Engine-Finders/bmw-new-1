// Section 3 (Diagnose) icons drawn to match the reference artwork: outline icons for the
// steps, trust reasons and symptom tiles; solid glyphs for the trust strip.

const LINE = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  // Trust strip (solid)
  "real-inquiries": (
    <g fill="currentColor">
      <rect x="2.5" y="12" width="3.5" height="8.5" />
      <rect x="7.6" y="5" width="3.5" height="15.5" />
      <rect x="12.7" y="9" width="3.5" height="11.5" />
      <rect x="17.8" y="14" width="3.5" height="6.5" />
      <rect x="1.5" y="20.5" width="21" height="1.4" />
    </g>
  ),
  "vetted-specialist": (
    <path
      fill="currentColor"
      d="M21.2 6.3a.6.6 0 0 0-1-.3l-2.7 2.7-2.3-.4-.4-2.3 2.7-2.7a.6.6 0 0 0-.3-1 5.6 5.6 0 0 0-6.7 7L3.2 17.6a2.3 2.3 0 0 0 3.2 3.2L14.7 13a5.6 5.6 0 0 0 6.5-6.7Z"
    />
  ),
  "oem-references": (
    <g fill="currentColor">
      <path d="M11.2 5.4C9.2 4 6.2 3.4 2 3.5v15.2c4.2-.1 7.2.5 9.2 1.9V5.4Z" />
      <path d="M12.8 5.4c2-1.4 5-2 9.2-1.9v15.2c-4.2-.1-7.2.5-9.2 1.9V5.4Z" />
      <path d="M1 20.2c4.5-.1 8 .5 11 2 3-1.5 6.5-2.1 11-2" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </g>
  ),
  "engine-finders": (
    <g fill="currentColor">
      <path d="M6.5 2.5h11v6.2a5.5 5.5 0 0 1-11 0V2.5Z" />
      <path d="M6.5 4H3v1.6A4.2 4.2 0 0 0 6.9 10" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17.5 4H21v1.6A4.2 4.2 0 0 1 17.1 10" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.6 14h2.8v3.5h-2.8z" />
      <path d="M7 18.5h10v3H7z" />
      <path d="m12 4.6.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3.9-1.8Z" fill="#fff" />
    </g>
  ),
  // How it works (outline)
  symptoms: (
    <g {...LINE}>
      <path d="M6 3H4.5v6a4.5 4.5 0 0 0 9 0V3H12" />
      <path d="M9 13.5v1.8a4.7 4.7 0 0 0 9.4 0V12" />
      <circle cx="18.4" cy="10" r="2" />
    </g>
  ),
  vehicle: (
    <g {...LINE}>
      <path d="m5 11 1.7-4.6A2 2 0 0 1 8.6 5h6.8a2 2 0 0 1 1.9 1.4L19 11" />
      <path d="M3.5 11h17a1 1 0 0 1 1 1v5h-19v-5a1 1 0 0 1 1-1Z" />
      <path d="M5 17v2.5h3V17m8 0v2.5h3V17M6.5 14h2m7 0h2M2 9.5l2 1m18-1-2 1" />
    </g>
  ),
  diagnose: (
    <g {...LINE}>
      <path d="M9 4H6a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h6.5M15 4h3a1 1 0 0 1 1 1v6" />
      <rect x="9" y="2.5" width="6" height="3" rx="1" />
      <path d="M8 10h8M8 13.5h5" />
      <circle cx="17" cy="17" r="3" />
      <path d="m19.2 19.2 2.3 2.3" />
    </g>
  ),
  // Why trust (outline, drawn white inside blue circles)
  shield: (
    <g {...LINE}>
      <path d="M12 2.5 4.5 5.5v6c0 4.7 3.2 8.7 7.5 10 4.3-1.3 7.5-5.3 7.5-10v-6L12 2.5Z" />
      <path d="M12 5 7 7v4.6c0 3.3 2.1 6.1 5 7.1 2.9-1 5-3.8 5-7.1V7l-5-2Z" />
      <path d="m9.4 11.8 1.9 1.9 3.4-3.6" />
    </g>
  ),
  "specific-knowledge": (
    <g {...LINE}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M10.3 2.8h3.4l.5 2.5 2 .9 2.1-1.4 2.4 2.4-1.4 2.1.9 2 2.5.5v3.4l-2.5.5-.9 2 1.4 2.1-2.4 2.4-2.1-1.4-2 .9-.5 2.5h-3.4l-.5-2.5-2-.9-2.1 1.4-2.4-2.4 1.4-2.1-.9-2-2.5-.5v-3.4l2.5-.5.9-2-1.4-2.1 2.4-2.4 2.1 1.4 2-.9.5-2.5Z" />
    </g>
  ),
  "users-team": (
    <g {...LINE}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.8 19.5a6.2 6.2 0 0 1 12.4 0" />
      <circle cx="5.2" cy="9.5" r="2.3" />
      <path d="M1.8 17.5a3.9 3.9 0 0 1 4.6-3.6" />
      <circle cx="18.8" cy="9.5" r="2.3" />
      <path d="M22.2 17.5a3.9 3.9 0 0 0-4.6-3.6" />
    </g>
  ),
  "top-choice": (
    <g {...LINE}>
      <path d="M7 3h10v5.5a5 5 0 0 1-10 0V3Z" />
      <path d="M7 5H3.5v1.3A4 4 0 0 0 7.4 10.2M17 5h3.5v1.3a4 4 0 0 1-3.9 3.9" />
      <path d="M12 13.5V17m-4 4h8l-1-4H9l-1 4Z" />
      <path d="m12 5.3.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2.8-1.6Z" />
    </g>
  ),
  // Symptom tiles (outline)
  engine: (
    <g {...LINE}>
      <path d="M8 6h6M11 6V8M5.5 8h10l2 2.5h1.5V9h2v8h-2v-1.5h-1.5L15.5 18H7.5L5.5 16H4v2H2V9h2v1.5h1.5V8Z" />
    </g>
  ),
  "oil-leak": (
    <g {...LINE}>
      <path d="M12 2.8S5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.8 12 2.8Z" />
      <path d="M9 15a3 3 0 0 0 2.5 2.9" />
    </g>
  ),
  "cooling-temp": (
    <g {...LINE}>
      <path d="M10.5 13.6V3.8a1.5 1.5 0 0 1 3 0v9.8a3 3 0 1 1-3 0Z" />
      <path d="M13.5 6H16M13.5 8.5H15.5M13.5 11H16" />
      <path d="M2.5 19c1.3 0 1.3-1 2.6-1s1.3 1 2.6 1 1.3-1 2.6-1M14 19c1.3 0 1.3-1 2.6-1s1.3 1 2.6 1 1.3-1 2.6-1M3 21.5c1.3 0 1.3-1 2.6-1s1.3 1 2.6 1 1.3-1 2.6-1 1.3 1 2.6 1 1.3-1 2.6-1 1.3 1 2.6 1 1.3-1 2.6-1" />
    </g>
  ),
  chain: (
    <g {...LINE}>
      <path d="M5.5 17.5c-3-3-3-8.5 1-12.2 3.7-3.5 9.6-3.6 12.6.2 2.6 3.3 1.8 7.8-1.6 10.6L9.2 21.6c-1.4 1-3.2.7-3.7-1Z" strokeDasharray="1.6 1.2" />
      <circle cx="9" cy="13" r="3.4" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15.5" cy="7.5" r="2.6" />
      <circle cx="15.5" cy="7.5" r=".8" />
    </g>
  ),
  turbo: (
    <g {...LINE}>
      <circle cx="10" cy="13" r="7.5" />
      <circle cx="10" cy="13" r="4.2" />
      <path d="M10 8.8v8.4M5.8 13h8.4M7 10l6 6M13 10l-6 6" />
      <path d="M14 5.8h5.5a1 1 0 0 1 1 1v4h-3" />
    </g>
  ),
  battery: (
    <g {...LINE}>
      <rect x="2.5" y="6.5" width="19" height="13.5" rx="1" />
      <path d="M5.5 6.5V4h3v2.5M15.5 6.5V4h3v2.5" />
      <path d="M6 12.5h3.5M7.75 10.75v3.5M14.5 12.5H18M16.25 10.75v3.5" />
    </g>
  ),
  injector: (
    <g {...LINE}>
      <path d="m15.5 3.5 5 5M17 2l5 5" />
      <path d="m16.3 6.2-6.8 6.8 1.5 1.5 6.8-6.8" />
      <path d="m9.5 13-2.6 2.6 1.5 1.5 2.6-2.6" />
      <path d="m6.9 15.6-2.4 2.4 1.5 1.5 2.4-2.4" />
      <path d="M4.5 18 2 20.5M3.5 17l-1-1M7 21.5l-1-1" />
      <path d="M11.5 9.2 13 10.7M13 7.7l1.5 1.5" />
    </g>
  ),
  exhaust: (
    <g {...LINE}>
      <path d="M3 17.5c0-3.2 2.5-4.8 5-4.8h4.5l2.5-3.2h5.5a1.5 1.5 0 0 1 1.5 1.5v2.3a1.5 1.5 0 0 1-1.5 1.5H16l-2.3 3.5H8" />
      <path d="M3 17.5C3 20 5.2 21 7 21c2.2 0 3.8-1.6 3.8-3.5S9.2 14 7 14 3 15.2 3 17.5Z" />
      <circle cx="7" cy="17.5" r="1.4" />
      <path d="M17 6.5c.8-1.2 2.2-1.6 3.5-1M15 4.2c1.1-1.4 3.4-2 5.2-1" />
    </g>
  ),
  electrical: (
    <g {...LINE}>
      <path d="M13.5 2 5 13.5h6l-1.5 8.5L19 10h-6l.5-8Z" />
    </g>
  ),
  bulb: (
    <g {...LINE}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.4 9.4a2.6 2.6 0 1 1 3.6 2.4c-.6.3-1 .8-1 1.5v.9" />
      <circle cx="12" cy="17" r=".4" fill="currentColor" />
    </g>
  ),
};

export function hasSec3Icon(name) {
  return Boolean(ICONS[name]);
}

export default function Sec3Icon({ name, className = "h-6 w-6" }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      {icon}
    </svg>
  );
}
