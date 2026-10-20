// Shared phone/tablet building blocks for home sections 6–12: one readable type scale
// (heading 32px, body 17px, entries 16–18px, labels 13px) and one card style.

export function MobileSection({ children, className = "" }) {
  return <div className={`relative mx-auto w-full max-w-[720px] px-4 pb-10 pt-10 lg:hidden ${className}`}>{children}</div>;
}

export function MobileHeading({ html, color, accent, className = "" }) {
  return (
    <h2
      className={`text-[32px] font-bold leading-[1.15] tracking-[-0.02em] [&_.heading-accent]:!text-[var(--acc)] ${className}`}
      style={{ color, "--acc": accent }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MobileLead({ children, color, className = "" }) {
  return (
    <p className={`mt-3 text-[17px] leading-[1.6] ${className}`} style={{ color }}>
      {children}
    </p>
  );
}

export function MobileCard({ children, C, className = "", style }) {
  return (
    <div className={`overflow-hidden rounded-[12px] border ${className}`} style={{ background: C.card, borderColor: C.border, boxShadow: C.shadow === "none" ? undefined : "0 4px 16px rgba(16,24,48,0.05)", ...style }}>
      {children}
    </div>
  );
}

// Small uppercase caption (column names, "Key engines" …): 11px, the smallest size used on phones.
export function MobileLabel({ children, color, className = "" }) {
  return (
    <span className={`block text-[13px] font-semibold uppercase tracking-[0.03em] ${className}`} style={{ color }}>
      {children}
    </span>
  );
}
