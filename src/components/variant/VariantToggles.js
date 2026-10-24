"use client";

import { useId, useRef, useState } from "react";
import VIcon from "./VariantIcons";

/** One card that opens and closes its body; the chevron sits in the header (`pointsDownWhenOpen`: down while open, right when closed). */
export function Disclosure({ summary, children, defaultOpen = true, className = "", headerClassName = "", bodyClassName = "", chevronClassName = "", pointsDownWhenOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={className}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)} className={`w-full text-left ${headerClassName}`}>
        {summary}
        <VIcon name="chevronDown" strokeWidth={2.2} className={`shrink-0 transition-transform ${pointsDownWhenOpen ? (open ? "" : "-rotate-90") : open ? "rotate-180" : ""} ${chevronClassName}`} />
      </button>
      <div id={id} hidden={!open} className={bodyClassName}>
        {children}
      </div>
    </div>
  );
}

/** Cards where one is open at a time (or none). `items`: [{ key, summary, body }]. */
export function Accordion({ items = [], defaultIndex = 0, itemClassName, openItemClassName = "", headerClassName = "", chevronClassName = "" }) {
  const [openIndex, setOpenIndex] = useState(defaultIndex);
  const base = useId();
  return items.map((item, index) => {
    const open = openIndex === index;
    const id = `${base}-${index}`;
    return (
      <div key={item.key} className={`${itemClassName} ${open ? openItemClassName : ""}`}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpenIndex(open ? -1 : index)}
          className={`flex w-full items-center text-left ${headerClassName}`}
        >
          {item.summary}
          <VIcon name={open ? "chevronUp" : "chevronDown"} strokeWidth={2.2} className={`shrink-0 ${chevronClassName}`} />
        </button>
        <div id={id} hidden={!open}>
          {item.body}
        </div>
      </div>
    );
  });
}

/**
 * Tab bar + one panel. `tabs`: [{ key, label (node), panel (node), activeStyle? }]; arrow keys move
 * between tabs. Class names are strings (this is rendered from server components).
 */
export function Tabs({ tabs = [], listClassName = "", tabClassName = "", activeClassName = "", inactiveClassName = "", panelClassName = "", label }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef([]);
  if (!tabs.length) return null;

  function onKeyDown(event) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label={label} className={listClassName} onKeyDown={onKeyDown}>
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${index}`}
            aria-selected={active === index}
            aria-controls={`${base}-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            className={`${tabClassName} ${active === index ? activeClassName : inactiveClassName}`}
            style={active === index ? tab.activeStyle : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div key={tab.key} role="tabpanel" id={`${base}-panel-${index}`} aria-labelledby={`${base}-tab-${index}`} hidden={active !== index} className={panelClassName}>
          {tab.panel}
        </div>
      ))}
    </>
  );
}
