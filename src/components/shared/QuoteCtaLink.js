"use client";

import Link from "next/link";
import { openQuoteModal } from "@/components/shared/quoteModal";

function isQuoteHref(href) {
  if (!href) return false;
  const value = String(href);
  return value === "/quote" || value.startsWith("/quote?") || value.startsWith("/quote#");
}

/**
 * Renders like a Link, but quote destinations open the sticky Free Quote modal instead.
 */
export default function QuoteCtaLink({ href = "/quote", className = "", children, onClick, ...rest }) {
  if (!isQuoteHref(href)) {
    return (
      <Link href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    let reg = "";
    let fromCalculator = false;
    try {
      const url = new URL(String(href || "/quote"), typeof window !== "undefined" ? window.location.origin : "https://bmwengines.uk");
      reg = url.searchParams.get("reg") || url.searchParams.get("vrm") || "";
      fromCalculator = url.searchParams.get("from") === "calculator";
    } catch {
      /* ignore */
    }
    openQuoteModal({ reg, fromCalculator });
  }

  return (
    <button type="button" className={className} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
