"use client";

import { useState } from "react";
import UkPlateInput from "@/components/shared/UkPlateInput";
import { openQuoteModal } from "@/components/shared/quoteModal";

function Arrow({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * Hero-only registration form: yellow UK plate + CTA → opens sticky quote modal
 * (with optional reg so the form can auto-fetch vehicle details).
 */
export default function HeroRegQuoteForm({
  buttonLabel = "Explore BMW Engine Replacement Options",
  supportText = "",
  placeholder = "Your Reg",
  fallbackHref = "/quote",
  className = "",
  buttonClassName = "",
  supportClassName = "",
}) {
  const [reg, setReg] = useState("");

  function submit(event) {
    event.preventDefault();
    const cleaned = reg.replace(/\s+/g, "").toUpperCase();
    openQuoteModal({ reg: cleaned });
  }

  return (
    <form onSubmit={submit} className={`w-full max-w-[680px] ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <UkPlateInput
          value={reg}
          onChange={setReg}
          placeholder={placeholder}
          className="w-full sm:min-w-0 sm:flex-1"
        />
        <button
          type="submit"
          className={`inline-flex shrink-0 items-center justify-center gap-3 rounded-[6px] bg-[#0b47a8] px-6 py-3.5 text-[15px] font-semibold leading-tight text-white transition hover:brightness-110 sm:min-w-[240px] sm:max-w-[340px] sm:text-[16px] ${buttonClassName}`}
        >
          <span className="text-left">{buttonLabel}</span>
          <Arrow className="h-5 w-5 shrink-0" />
        </button>
      </div>
      {supportText ? (
        <p className={`t-label mt-2.5 max-w-[680px] leading-[1.45] text-[var(--color-text-soft,#5b6b7c)] ${supportClassName}`}>
          {supportText}
        </p>
      ) : null}
    </form>
  );
}
