"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

/** Sample nav data — fill remaining items later. Paths match the PDF spec. */
export const navMenus = [
  {
    id: "models",
    label: "MODELS",
    kind: "models",
    groups: [
      {
        title: "Saloons & Tourers",
        items: [
          { label: "1 Series", href: "/1-series", variants: 17, generations: 8 },
          { label: "3 Series", href: "/3-series", variants: 29, generations: 13 },
          { label: "5 Series", href: "/5-series", variants: 24, generations: 13 },
        ],
      },
      {
        title: "SUV (X)",
        items: [
          { label: "X3", href: "/x3", variants: 14, generations: 4 },
          { label: "X5", href: "/x5", variants: 17, generations: 4 },
        ],
      },
      {
        title: "M Performance",
        items: [
          { label: "M3", href: "/m3", variants: 2, generations: 4 },
          { label: "M5", href: "/m5", variants: 2, generations: 5 },
        ],
      },
      {
        title: "Other",
        items: [
          { label: "Z Series", href: "/z-series", variants: 23, generations: 0 },
          { label: "i Series", href: "/i-series", variants: 0, generations: 0 },
        ],
      },
    ],
  },
  {
    id: "engines",
    label: "ENGINES",
    kind: "columns",
    groups: [
      {
        title: "Modern (B-series)",
        links: [
          { label: "B37/B47", href: "/engine/b47" },
          { label: "B38/B48", href: "/engine/b48" },
          { label: "B57/B58", href: "/engine/b58" },
        ],
      },
      {
        title: "N-series",
        links: [
          { label: "N13/N20", href: "/engine/n20" },
          { label: "N47", href: "/engine/n47" },
          { label: "N54, N55", href: "/engine/n54" },
        ],
      },
      {
        title: "M-series (classic)",
        links: [
          { label: "M50/M52/M54", href: "/engine/m54" },
          { label: "M57", href: "/engine/m57" },
        ],
      },
      {
        title: "S-series (M Division)",
        links: [
          { label: "S50/S52/S54", href: "/engine/s54" },
          { label: "S55", href: "/engine/s55" },
        ],
      },
    ],
    footerLink: { label: "View All Engines →", href: "/engine" },
  },
  {
    id: "problems",
    label: "PROBLEMS & SYMPTOMS",
    kind: "columns",
    groups: [
      {
        title: "Common Failures",
        links: [
          { label: "Timing Chain (N47)", href: "/failures/timing-chain-n47" },
          { label: "HPFP Failure (N54)", href: "/failures/hpfp-n54" },
          { label: "Oil Consumption (N63)", href: "/failures/oil-consumption-n63" },
        ],
        viewAll: { label: "View All (26) →", href: "/failures" },
      },
      {
        title: "Symptoms",
        links: [
          { label: "Black Smoke", href: "/symptoms/black-smoke" },
          { label: "Blue Smoke", href: "/symptoms/blue-smoke" },
          { label: "Cold Start Rattle", href: "/symptoms/cold-start-rattle" },
        ],
        viewAll: { label: "View All (63) →", href: "/symptoms" },
      },
      {
        title: "Warning Lights",
        links: [
          { label: "Engine Management Light", href: "/warning-lights/engine-management" },
          { label: "Oil Pressure Warning", href: "/warning-lights/oil-pressure" },
        ],
        viewAll: { label: "View All (10) →", href: "/warning-lights" },
      },
      {
        title: "Fault Codes",
        links: [
          { label: "P0300 series", href: "/fault-codes/p0300" },
          { label: "P0016–P0018", href: "/fault-codes/p0016" },
        ],
        viewAll: { label: "View All (30) →", href: "/fault-codes" },
      },
    ],
  },
  {
    id: "guides",
    label: "GUIDES",
    kind: "columns",
    groups: [
      {
        title: "Buying & Ranking",
        links: [
          { label: "Best BMW Engines Ranked", href: "/blog/best-bmw-engines-ranked" },
          { label: "Generation Comparisons", href: "/blog/generation-comparisons" },
        ],
      },
      {
        title: "Ownership",
        links: [
          { label: "How Long Do BMW Engines Last", href: "/blog/how-long-do-bmw-engines-last" },
          { label: "High Mileage Maintenance", href: "/blog/high-mileage-maintenance" },
        ],
      },
      {
        title: "Problems Explained",
        links: [
          { label: "Timing Chain Failure Timelines", href: "/blog/timing-chain-failure-timelines" },
          { label: "Myth-Busting", href: "/blog/myth-busting" },
        ],
      },
    ],
    footerLink: { label: "View All Guides →", href: "/blog" },
  },
  {
    id: "resources",
    label: "RESOURCES",
    kind: "columns",
    groups: [
      {
        title: "Compare & Research",
        links: [
          { label: "Compare Models & Engines", href: "/compare" },
          { label: "Fitment Guide", href: "/fitment" },
          { label: "Technical Library", href: "/technical" },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Repair vs Replace Calculator", href: "/tools/repair-vs-replace-calculator" },
          { label: "Ownership Cost Calculator", href: "/tools/ownership-cost-calculator" },
          { label: "VIN Decoder", href: "/tools/vin-decoder" },
        ],
      },
      {
        title: "Data & Reports",
        links: [
          { label: "Research Centre", href: "/data" },
          { label: "Reliability Index 2026", href: "/data/engine-failure-index-2026" },
          { label: "Failure Trends 2026", href: "/data/bmw-failure-trends-2026" },
          { label: "Cost Index 2026", href: "/data/bmw-cost-index-2026" },
          { label: "Most Reliable by Year", href: "/data/most-reliable-bmw-engines-by-year" },
        ],
      },
    ],
    footerLink: { label: "All Tools →", href: "/tools" },
  },
];

const linkClass =
  "block text-sm font-semibold text-[var(--color-text)] no-underline hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const mutedLinkClass =
  "block text-sm font-bold text-[var(--color-primary)] no-underline hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

function Chevron({ open }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 7l5 5 5-5" />
    </svg>
  );
}

function CaretRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 5l5 5-5 5" />
    </svg>
  );
}

function modelChildLinks(model) {
  return [
    { label: `${model.label} Overview`, href: model.href },
    { label: `All Variants (${model.variants})`, href: `${model.href}#variants` },
    ...(model.generations > 0
      ? [{ label: `All Generations (${model.generations})`, href: `${model.href}#generations` }]
      : []),
  ];
}

function flatModels(menu) {
  return menu.groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));
}

function ModelsPanel({ menu, activeModelHref, setActiveModelHref, onNavigate }) {
  const models = flatModels(menu);
  const active = models.find((m) => m.href === activeModelHref) || models[0];

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_14rem]">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {menu.groups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">{group.title}</p>
            <ul className="grid gap-1">
              {group.items.map((item) => {
                const isActive = active?.href === item.href;
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-sm font-semibold no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                        isActive ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "text-[var(--color-text)] hover:bg-[var(--color-page-soft)]"
                      }`}
                      onMouseEnter={() => setActiveModelHref(item.href)}
                      onFocus={() => setActiveModelHref(item.href)}
                      aria-expanded={isActive}
                    >
                      <span>{item.label}</span>
                      <CaretRight />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {active ? (
        <div className="rounded border border-[var(--color-border)] bg-[var(--color-page-soft)] p-3">
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">{active.label}</p>
          <ul className="grid gap-1">
            {modelChildLinks(active).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass} onClick={onNavigate}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ColumnsPanel({ menu, onNavigate }) {
  return (
    <>
      <div className={`grid gap-4 ${menu.groups.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {menu.groups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">{group.title}</p>
            <ul className="grid gap-1.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass} onClick={onNavigate}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {group.viewAll ? (
              <Link href={group.viewAll.href} className={`mt-3 ${mutedLinkClass}`} onClick={onNavigate}>
                {group.viewAll.label}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
      {menu.footerLink ? (
        <div className="mt-4 border-t border-[var(--color-border)] pt-3">
          <Link href={menu.footerLink.href} className={mutedLinkClass} onClick={onNavigate}>
            {menu.footerLink.label}
          </Link>
        </div>
      ) : null}
    </>
  );
}

export function DesktopNavMenus() {
  const [openId, setOpenId] = useState(null);
  const [activeModelHref, setActiveModelHref] = useState(navMenus[0].groups[0].items[0].href);
  const rootRef = useRef(null);
  const baseId = useId();
  const openMenu = navMenus.find((menu) => menu.id === openId) || null;
  const panelId = openMenu ? `${baseId}-${openMenu.id}-panel` : undefined;

  useEffect(() => {
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpenId(null);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setOpenId(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative hidden flex-1 lg:block">
      <ul className="flex items-center justify-center gap-5 xl:gap-7">
        {navMenus.map((menu) => {
          const isOpen = openId === menu.id;
          return (
            <li key={menu.id}>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)] no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => setOpenId(isOpen ? null : menu.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setOpenId(isOpen ? null : menu.id);
                  }
                }}
              >
                <span>{menu.label}</span>
                <Chevron open={isOpen} />
              </button>
            </li>
          );
        })}
      </ul>

      {openMenu ? (
        <div
          id={panelId}
          role="region"
          aria-label={openMenu.label}
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(96vw,72rem)] -translate-x-1/2 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_16px_40px_var(--color-shadow)]"
        >
          {openMenu.kind === "models" ? (
            <ModelsPanel
              menu={openMenu}
              activeModelHref={activeModelHref}
              setActiveModelHref={setActiveModelHref}
              onNavigate={() => setOpenId(null)}
            />
          ) : (
            <ColumnsPanel menu={openMenu} onNavigate={() => setOpenId(null)} />
          )}
        </div>
      ) : null}
    </div>
  );
}

function MobileRowButton({ label, onClick, expanded, chevron = "plus" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm font-semibold text-[var(--color-text)]"
    >
      <span>{label}</span>
      {chevron === "plus" ? <span className="text-lg leading-none">{expanded ? "−" : "+"}</span> : <CaretRight />}
    </button>
  );
}

export function MobileNavMenus({ onNavigate }) {
  const [stack, setStack] = useState([{ type: "root" }]);
  const current = stack[stack.length - 1];

  function push(frame) {
    setStack((prev) => [...prev, frame]);
  }

  function pop() {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function goLink(href) {
    onNavigate?.();
    setStack([{ type: "root" }]);
  }

  if (current.type === "root") {
    return (
      <ul className="grid gap-1">
        {navMenus.map((menu) => (
          <li key={menu.id} className="border-b border-[var(--color-border)]">
            <MobileRowButton label={menu.label} onClick={() => push({ type: "menu", menuId: menu.id })} chevron="plus" />
          </li>
        ))}
      </ul>
    );
  }

  const menu = navMenus.find((item) => item.id === current.menuId);
  if (!menu) return null;

  if (current.type === "menu" && menu.kind === "models") {
    const models = flatModels(menu);
    return (
      <div>
        <button type="button" onClick={pop} className="mb-2 text-sm font-bold text-[var(--color-primary)]">
          ← {menu.label}
        </button>
        <ul className="grid gap-1">
          {models.map((model) => (
            <li key={model.href} className="border-b border-[var(--color-border)]">
              <MobileRowButton label={model.label} onClick={() => push({ type: "model", menuId: menu.id, modelHref: model.href })} chevron="plus" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (current.type === "model") {
    const model = flatModels(menu).find((item) => item.href === current.modelHref);
    if (!model) return null;
    return (
      <div>
        <button type="button" onClick={pop} className="mb-2 text-sm font-bold text-[var(--color-primary)]">
          ← {model.label}
        </button>
        <ul className="grid gap-1">
          {modelChildLinks(model).map((link) => (
            <li key={link.href} className="border-b border-[var(--color-border)]">
              <Link href={link.href} className={`${linkClass} py-2.5`} onClick={() => goLink(link.href)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (current.type === "menu") {
    return (
      <div>
        <button type="button" onClick={pop} className="mb-2 text-sm font-bold text-[var(--color-primary)]">
          ← {menu.label}
        </button>
        <div className="grid gap-4">
          {menu.groups.map((group) => (
            <div key={group.title}>
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">{group.title}</p>
              <ul className="grid gap-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${linkClass} py-1.5`} onClick={() => goLink(link.href)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {group.viewAll ? (
                <Link href={group.viewAll.href} className={`mt-2 ${mutedLinkClass}`} onClick={() => goLink(group.viewAll.href)}>
                  {group.viewAll.label}
                </Link>
              ) : null}
            </div>
          ))}
          {menu.footerLink ? (
            <Link href={menu.footerLink.href} className={mutedLinkClass} onClick={() => goLink(menu.footerLink.href)}>
              {menu.footerLink.label}
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return null;
}
