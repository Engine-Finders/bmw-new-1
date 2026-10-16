export function engineSectionBg(isDark, tinted = false) {
  if (isDark) return "bg-[var(--color-page)]";
  return tinted ? "bg-[#eef2f7]" : "bg-[var(--color-page)]";
}
