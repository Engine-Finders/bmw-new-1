"use client";

import Link from "next/link";
import MStripe from "@/components/reusableComponents/MStripe";
import { useTheme } from "@/components/shared/themeProvider";

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function HomeSec13({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // All questions from the content, spread over three columns (4 / 3 / 3 for ten).
  const base = Math.floor(data.items.length / 3);
  const extra = data.items.length % 3;
  const sizes = [0, 1, 2].map((index) => base + (index < extra ? 1 : 0));
  const columns = sizes.map((size, index) => {
    const start = sizes.slice(0, index).reduce((sum, value) => sum + value, 0);
    return data.items.slice(start, start + size);
  });

  return (
    <section className={`px-3 pb-2 pt-7 md:px-6 md:pt-8 ${isDark ? "bg-[#02070b]" : "bg-white"}`}>
      <div className="mx-auto w-full max-w-8xl">
        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className={`text-[1.55rem] font-bold leading-tight tracking-normal md:text-[2rem] ${isDark ? "text-white" : "text-[#071827]"}`} dangerouslySetInnerHTML={{ __html: data.h2 }} />
            <div className="mt-3">
              <MStripe />
            </div>
          </div>
          {data.faqHub ? (
            <p className={`text-[0.9rem] md:pt-1 ${isDark ? "text-white/74" : "text-[#172334]"}`}>
              More questions?{" "}
              <Link href={data.faqHub.href} className="font-medium text-[var(--color-primary)]">
                {data.faqHub.label} -&gt;
              </Link>
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-0">
          {columns.map((column) => (
            <div
              key={column[0].id}
              className={`flex flex-col gap-3 md:w-1/3 md:px-4 md:first:pl-0 md:last:pr-0 md:border-r md:last:border-r-0 ${
                isDark ? "md:border-[#375067]" : "md:border-[var(--color-primary)]"
              }`}
            >
              {column.map((item) => (
                <details
                  key={item.id}
                  className={`group rounded-lg border shadow-[0_8px_22px_rgba(10,26,43,0.04)] ${
                    isDark ? "border-[#223343] bg-[rgba(10,21,32,0.92)]" : "border-[#dfe5ed] bg-white"
                  }`}
                >
                  <summary className={`flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-3 text-[0.93rem] marker:hidden ${isDark ? "text-white" : "text-[#071827]"}`}>
                    <span className="min-w-0 flex-1 leading-snug">{item.question}</span>
                    <span className="shrink-0 transition-transform group-open:rotate-45">
                      <PlusIcon />
                    </span>
                  </summary>
                  <p className={`border-t px-4 pb-4 pt-3 text-[0.84rem] leading-[1.5] ${isDark ? "border-[#223343] text-white/74" : "border-[#e7ebf0] text-[#27384a]"}`} dangerouslySetInnerHTML={{ __html: item.answer }} />
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
