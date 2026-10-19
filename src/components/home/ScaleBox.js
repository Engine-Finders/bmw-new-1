"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Renders children at a fixed design width and scales the whole block to the available width,
 * so pixel-measured layouts keep their proportions at every viewport. `max` caps upscaling;
 * when capped, the block is centred. Height follows the scaled content (accordions included).
 */
export default function ScaleBox({ width, max = 1, children }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [box, setBox] = useState({ s: 1, h: null, x: 0 });

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return undefined;
    const update = () => {
      const w = o.clientWidth;
      const s = Math.min(max, w / width);
      setBox({ s, h: i.offsetHeight * s, x: Math.max(0, (w - width * s) / 2) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width, max]);

  return (
    <div ref={outer} className="relative w-full overflow-hidden" style={{ height: box.h ?? undefined }}>
      <div ref={inner} style={{ width, transform: `translateX(${box.x}px) scale(${box.s})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}
