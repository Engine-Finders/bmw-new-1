"use client";

import { useEffect, useId, useRef, useState } from "react";

export function FreeQuoteForm({ onClose }) {
  function handleSubmit(event) {
    event.preventDefault();
    // Form wiring later
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <p className="text-sm text-[var(--color-text-muted)]">Placeholder form — fields will be updated later.</p>

      <label className="grid gap-1 text-sm font-semibold text-[var(--color-text)]">
        Name
        <input
          type="text"
          name="name"
          className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-normal"
          placeholder="Your name"
        />
      </label>

      <label className="grid gap-1 text-sm font-semibold text-[var(--color-text)]">
        Email
        <input
          type="email"
          name="email"
          className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-normal"
          placeholder="you@example.com"
        />
      </label>

      <label className="grid gap-1 text-sm font-semibold text-[var(--color-text)]">
        Phone
        <input
          type="tel"
          name="phone"
          className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-normal"
          placeholder="Phone number"
        />
      </label>

      <label className="grid gap-1 text-sm font-semibold text-[var(--color-text)]">
        Message
        <textarea
          name="message"
          rows={4}
          className="resize-y rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-normal"
          placeholder="Tell us about your BMW / engine needs"
        />
      </label>

      <div className="mt-1 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-[var(--color-border-strong)] px-4 py-2.5 text-sm font-bold text-[var(--color-text)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function FreeQuoteSticky() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef(null);

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
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] hover:bg-[var(--color-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Get a Free Quote
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center" role="presentation">
          <button
            type="button"
            aria-label="Close quote form"
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[61] w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_20px_48px_rgba(0,0,0,0.28)]"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 id={titleId} className="text-lg font-bold text-[var(--color-text)]">
                Get a Free Quote
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-[var(--color-border)] px-2 py-1 text-sm font-bold text-[var(--color-text)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <FreeQuoteForm onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
