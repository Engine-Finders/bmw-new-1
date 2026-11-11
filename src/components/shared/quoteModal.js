/** Global sticky quote modal trigger (used by hero + section CTAs). */

export const QUOTE_MODAL_EVENT = "bmw:open-quote-modal";

/**
 * Open the floating quote form (same as the sticky "Get a Free Quote" button).
 * @param {{ reg?: string, fromCalculator?: boolean }} [opts]
 */
export function openQuoteModal(opts = {}) {
  if (typeof window === "undefined") return;
  const reg = String(opts.reg || "")
    .replace(/\s+/g, "")
    .toUpperCase();
  window.dispatchEvent(
    new CustomEvent(QUOTE_MODAL_EVENT, {
      detail: {
        reg,
        fromCalculator: Boolean(opts.fromCalculator),
      },
    }),
  );
}
