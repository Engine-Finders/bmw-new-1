"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { navMenus } from "@/components/shared/navData";

export { navMenus };

const linkClass =
  "block text-sm font-semibold text-[var(--color-text)] no-underline hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const mutedLinkClass =
  "block text-sm font-bold text-[var(--color-primary)] no-underline hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
const topLinkClass =
  "inline-flex items-center text-sm font-semibold text-[var(--color-text)] no-underline hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

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
  const firstModelHref = navMenus.find((menu) => menu.kind === "models")?.groups?.[0]?.items?.[0]?.href || "/1-series";
  const [activeModelHref, setActiveModelHref] = useState(firstModelHref);
  const rootRef = useRef(null);
  const baseId = useId();
  const openMenu = navMenus.find((menu) => menu.id === openId && menu.kind !== "link") || null;
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
      <ul className="flex items-center justify-center gap-4 xl:gap-6">
        {navMenus.map((menu) => {
          if (menu.kind === "link") {
            return (
              <li key={menu.id}>
                <Link href={menu.href} className={topLinkClass}>
                  {menu.label}
                </Link>
              </li>
            );
          }

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
          className="absolute left-1/2 top-full z-50 mt-3 max-h-[70vh] w-[min(96vw,72rem)] -translate-x-1/2 overflow-y-auto border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_16px_40px_var(--color-shadow)]"
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
            {menu.kind === "link" ? (
              <Link href={menu.href} className={`${linkClass} py-2.5`} onClick={() => goLink(menu.href)}>
                {menu.label}
              </Link>
            ) : (
              <MobileRowButton label={menu.label} onClick={() => push({ type: "menu", menuId: menu.id })} chevron="plus" />
            )}
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
