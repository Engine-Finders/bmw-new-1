"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import QuoteLeadForm from "@/components/shared/QuoteLeadForm";
import { QUOTE_MODAL_EVENT } from "@/components/shared/quoteModal";

export default function FreeQuoteSticky() {
  const [open, setOpen] = useState(false);
  const [initialReg, setInitialReg] = useState("");
  const [loadCalculator, setLoadCalculator] = useState(false);
  const titleId = useId();
  const closeRef = useRef(null);
  const [formKey, setFormKey] = useState(0);

  function openModal({ reg = "", fromCalculator = false } = {}) {
    setInitialReg(String(reg || "").replace(/\s+/g, "").toUpperCase());
    setLoadCalculator(Boolean(fromCalculator));
    setFormKey((k) => k + 1);
    setOpen(true);
  }

  useEffect(() => {
    function onOpen(event) {
      openModal(event.detail || {});
    }
    window.addEventListener(QUOTE_MODAL_EVENT, onOpen);
    return () => window.removeEventListener(QUOTE_MODAL_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] hover:bg-[var(--color-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Get a Free Quote
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-4" role="presentation">
          <button type="button" aria-label="Close quote form" className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative z-[61] max-h-[94vh] w-full max-w-[520px] overflow-y-auto">
            <Suspense fallback={<p className="rounded-[16px] bg-white p-4 text-sm text-[#617084]">Loading…</p>}>
              <QuoteLeadForm
                key={formKey}
                form="Floating quote"
                initialReg={initialReg}
                autoLookup={Boolean(initialReg)}
                loadCalculator={loadCalculator}
                showClose
                onClose={() => setOpen(false)}
                titleId={titleId}
                closeRef={closeRef}
              />
            </Suspense>
          </div>
        </div>
      ) : null}
    </>
  );
}
