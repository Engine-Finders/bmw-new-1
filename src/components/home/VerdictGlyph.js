// Small coloured verdict marks used in the reference tables (⚠ ✅ 🏆 💎 🔴 👑 🔥), drawn as SVG
// so they keep the same size and colour on every platform.

const TROPHY = "M7 4h10v3a5 5 0 0 1-10 0V4Zm-3 1h3v2a3 3 0 0 1-3-3V5Zm13 0h3v-1 1a3 3 0 0 1-3 3V5Zm-6 9h2v3h3v2H8v-2h3v-3Z";

export default function VerdictGlyph({ type, isDark = false, round = false, className = "h-4 w-4" }) {
  switch (type) {
    case "warning":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path d="M12 2.5 23 21.5H1L12 2.5Z" fill="#f59e0b" />
          <path d="M12 9v6" stroke="#2b1600" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="18" r="1.25" fill="#2b1600" />
        </svg>
      );
    case "success":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          {round ? <circle cx="12" cy="12" r="11" fill="#16a34a" /> : <rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#22a447" />}
          <path d="m6.5 12.3 3.6 3.6 7.4-7.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "trophy":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path d={TROPHY} fill={isDark ? "#f5b301" : "#1d4fd8"} />
        </svg>
      );
    case "diamond":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path d="M6 3h12l4 6-10 12L2 9l4-6Z" fill={isDark ? "#8ec5ff" : "#5b35c9"} />
          <path d="M2 9h20M8.5 3 12 21M15.5 3 12 21M6 3l2.5 6M18 3l-2.5 6" stroke={isDark ? "#d8ecff" : "#8f6ff0"} strokeWidth="0.8" fill="none" />
        </svg>
      );
    case "danger":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="10.5" fill="#e3262b" />
        </svg>
      );
    case "crown":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path d="M2.5 7.5 7 11l5-7 5 7 4.5-3.5L19.5 19h-15L2.5 7.5Z" fill="#f5a20b" />
          <rect x="4.5" y="19.5" width="15" height="2.5" rx="1" fill="#e08a00" />
        </svg>
      );
    case "fire":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path d="M12 1.5c1 4 6 6.5 6 12.5a6 6 0 0 1-12 0c0-3 1.6-4.8 3-6 .2 2 1 3.2 2.2 3.8C10.6 8 11 4.5 12 1.5Z" fill="#f15a16" />
          <path d="M12 12c.6 2 3 2.8 3 5a3 3 0 0 1-6 0c0-1.6 1.6-2.6 3-5Z" fill="#ffc21a" />
        </svg>
      );
    case "best":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <path d={TROPHY} fill="#f5a20b" />
        </svg>
      );
    case "safe":
      return <VerdictGlyph type="success" round className={className} />;
    case "watch":
      return <VerdictGlyph type="warning" className={className} />;
    case "avoid":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
          <circle cx="12" cy="12" r="11" fill="#e3262b" />
          <path d="m8 8 8 8m0-8-8 8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "family":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill={isDark ? "#3b82f6" : "#1d4fd8"}>
          <circle cx="9" cy="6.5" r="3.5" />
          <circle cx="17" cy="8" r="2.8" />
          <path d="M2 20c0-4 3-7 7-7s7 3 7 7H2Zm15 0c0-2.4-.8-4.6-2.2-6.2A5 5 0 0 1 22.5 18v2H17Z" />
        </svg>
      );
    default:
      return null;
  }
}
