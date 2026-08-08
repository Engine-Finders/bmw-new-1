"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/shared/themeProvider";

const logoText = "BMW RELIABILITY GUIDE";
const links = [
  { label: "1 SERIES", href: "#" },
  { label: "3 SERIES", href: "#" },
  { label: "5 SERIES", href: "#" },
  { label: "M CARS", href: "#" },
  { label: "GUIDES", href: "#" },
  { label: "ABOUT", href: "#" },
  { label: "FORUM", href: "#" },
];
function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" />
    </svg>
  );
}

function LogoMark() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-text)] bg-[var(--color-surface)] text-[10px] font-bold leading-none md:h-14 md:w-14">
      <span className="grid h-8 w-8 grid-cols-2 overflow-hidden rounded-full border border-[var(--color-border-strong)]">
        <span className="bg-[var(--color-surface)]" />
        <span className="bg-[var(--color-primary)]" />
        <span className="bg-[var(--color-primary)]" />
        <span className="bg-[var(--color-surface)]" />
      </span>
    </span>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const nextThemeLabel = theme === "dark" ? "Switch to day theme" : "Switch to night theme";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-navbar)] backdrop-blur">
      <nav className="mx-auto flex w-full max-w-8xl items-center justify-between gap-4 px-4 py-4 md:px-8 md:py-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-[var(--color-text)]">
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-[2rem] font-extrabold tracking-normal md:text-3xl">BMW</span>
            <span className="block text-[0.95rem] font-semibold tracking-normal md:text-xl">RELIABILITY GUIDE</span>
          </span>
        </Link>
        <ul className="hidden flex-1 items-center justify-center gap-9 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="text-sm font-semibold text-[var(--color-text)]">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-5 md:flex">
          <button
            type="button"
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
            onClick={toggleTheme}
            className="flex h-12 w-12 items-center justify-center rounded border border-[var(--color-border-strong)] text-[var(--color-text)]"
          >
            <ThemeIcon theme={theme} />
          </button>
          <Link
            href="#"
            className="shrink-0 rounded bg-[var(--color-primary)] px-6 py-4 text-sm font-bold text-white shadow-sm shadow-[var(--color-shadow)]"
          >
            START YOUR RESEARCH
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded border border-[var(--color-border-strong)] text-[var(--color-text)]"
          >
            <ThemeIcon theme={theme} />
          </button>
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center text-[var(--color-text)]"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
      {isMenuOpen ? (
        <div id="mobile-nav" className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 md:hidden">
          <ul className="grid gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-[var(--color-text)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#"
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 block rounded bg-[var(--color-primary)] px-5 py-3 text-center text-sm font-bold text-white shadow-sm shadow-[var(--color-shadow)]"
          >
            START YOUR RESEARCH
          </Link>
        </div>
      ) : null}
    </header>
  );
}
