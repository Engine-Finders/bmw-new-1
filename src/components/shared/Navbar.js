"use client";

import Link from "next/link";

const logoText = "BMW RELIABILITY GUIDE";
const links = [
  { label: "1 SERIES", href: "#" },
  { label: "3 SERIES", href: "#" },
  { label: "5 SERIES", href: "#" },
  { label: "X3", href: "#" },
  { label: "X5", href: "#" },
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
          <Link
            href="#"
            className="shrink-0 rounded bg-[var(--color-primary)] px-6 py-4 text-sm font-bold text-white shadow-sm shadow-[var(--color-shadow)]"
          >
            START YOUR RESEARCH
          </Link>
        </div>
        <div className="ml-auto flex items-center md:hidden">
          <button aria-label="Open menu" className="text-[var(--color-text)]">
            <MenuIcon />
          </button>
        </div>
      </nav>
    </header>
  );
}
