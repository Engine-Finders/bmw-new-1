"use client";

import QuoteLeadForm from "@/components/shared/QuoteLeadForm";

/** Full-page quote form — same UI as the sticky CTA modal. */
export default function QuoteForm({ onSuccess }) {
  return <QuoteLeadForm form="Quote page" onSuccess={onSuccess} className="mx-auto max-w-[520px]" />;
}
