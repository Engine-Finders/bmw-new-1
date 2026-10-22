// UI audit for UI_RULES.md. Paste into the browser console on any page (run at 1536 and 1280 wide).
// Reports: horizontal overflow, containers off the navbar edge, text off the type scale,
// clipped or over-bold buttons, scaled artboards, and whether the hero fits the viewport.
(() => {
  const desktop = window.innerWidth >= 1024;
  const minSize = desktop ? 15 : 13;
  const desktopScale = [15, 16, 17, 18, 19, 20, 24, 34, 44, 54, 60];
  const px = (v) => Math.round(parseFloat(v) * 10) / 10;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && s.visibility !== "hidden" && s.opacity !== "0";
  };
  const label = (el) => {
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 3).join(".") : "";
    return el.tagName.toLowerCase() + (cls ? "." + cls : "");
  };
  const text = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ").trim();

  const report = { width: window.innerWidth, overflow: null, containers: [], smallText: [], offScale: {}, buttons: [], scaled: [], hero: null };

  // 1. Horizontal page scroll
  const extra = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  report.overflow = extra > 0 ? `page is ${extra}px wider than the viewport` : "none";

  // 2. Every top-level .site-container starts on the navbar's content edge
  const nav = document.querySelector("header nav");
  const edge = (el) => el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft);
  const navEdge = nav ? edge(nav) : null;
  document.querySelectorAll(".site-container").forEach((el) => {
    if (el.parentElement.closest(".site-container") || !visible(el) || navEdge === null) return;
    const diff = Math.round(edge(el) - navEdge);
    if (Math.abs(diff) > 1) report.containers.push({ el: label(el), offBy: diff + "px" });
  });
  document.querySelectorAll("main section").forEach((sec) => {
    if (!visible(sec) || sec.parentElement.closest("main section") || navEdge === null) return;
    if (!sec.querySelector(".site-container") && !sec.closest(".site-container")) {
      report.containers.push({ el: label(sec), offBy: "no .site-container" });
    }
    const heading = [...sec.querySelectorAll("h1, h2, h3")].find(visible);
    const diff = heading ? Math.round(heading.getBoundingClientRect().left - navEdge) : 0;
    if (Math.abs(diff) > 1) report.containers.push({ el: `${label(sec)} heading "${heading.innerText.slice(0, 30)}"`, offBy: diff + "px" });
  });

  // 3. Text sizes
  document.querySelectorAll("body *").forEach((el) => {
    if (el.closest("svg, script, style, noscript, .sr-only") || !text(el) || !visible(el)) return;
    const size = px(getComputedStyle(el).fontSize);
    if (size < minSize) report.smallText.push({ size, el: label(el), text: text(el).slice(0, 50) });
    else if (desktop && !desktopScale.includes(size)) {
      (report.offScale[size] ||= []).length < 5 && report.offScale[size].push(`${label(el)} "${text(el).slice(0, 40)}"`);
    }
  });

  // 4. Buttons: label must fit, weight ≤ 700
  document.querySelectorAll("button, a.btn-cta, [role=button]").forEach((el) => {
    if (!visible(el)) return;
    const s = getComputedStyle(el);
    const clipped = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
    if (clipped || parseInt(s.fontWeight, 10) > 700) {
      report.buttons.push({ el: label(el), text: el.innerText.trim().slice(0, 40), clipped, weight: s.fontWeight });
    }
  });

  // 5. Scaled artboards
  document.querySelectorAll("main *").forEach((el) => {
    const s = getComputedStyle(el);
    const definesU = s.getPropertyValue("--u").trim() && !getComputedStyle(el.parentElement).getPropertyValue("--u").trim();
    if (definesU || (s.transform !== "none" && /matrix\((?!1, 0, 0, 1)/.test(s.transform) && el.querySelector("h1,h2,h3,p"))) {
      report.scaled.push(label(el));
    }
  });

  // 6. Hero (first section) fits under the navbar
  const hero = document.querySelector("main section");
  if (hero) {
    const navH = document.querySelector("header")?.offsetHeight || 0;
    const h = Math.round(hero.getBoundingClientRect().height);
    report.hero = `${h}px tall, viewport leaves ${window.innerHeight - navH}px → ${h <= window.innerHeight - navH ? "fits" : "TOO TALL"}`;
  }

  console.log(`UI audit @ ${report.width}px — overflow: ${report.overflow}; hero: ${report.hero}`);
  if (report.containers.length) console.table(report.containers);
  if (report.smallText.length) console.table(report.smallText);
  if (Object.keys(report.offScale).length) console.log("Off-scale desktop sizes:", report.offScale);
  if (report.buttons.length) console.table(report.buttons);
  if (report.scaled.length) console.log("Scaled artboards:", [...new Set(report.scaled)]);
  return {
    overflow: report.overflow,
    hero: report.hero,
    misalignedContainers: report.containers.length,
    textBelowMin: report.smallText.length,
    offScaleSizes: Object.keys(report.offScale).map(Number).sort((a, b) => a - b),
    buttonIssues: report.buttons.length,
    scaledArtboards: new Set(report.scaled).size,
    details: report,
  };
})();
