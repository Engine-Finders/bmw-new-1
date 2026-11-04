import { Suspense } from "react";
import QuoteForm from "@/components/shared/QuoteForm";

export const metadata = {
  title: "Get a Quote | BMW Reliability Guide",
  description: "Request free BMW engine guidance and a quote.",
};

export default function QuotePage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-3 py-6 sm:px-4 sm:py-10">
      <Suspense fallback={<p className="text-sm text-[var(--color-text-soft)]">Loading quote form…</p>}>
        <QuoteForm />
      </Suspense>
    </main>
  );
}
