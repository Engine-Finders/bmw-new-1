// Model pages: the 3 Series page is built from model JSON that carries the redesigned sections'
// own fields (titleLines, stats, rows, generations, profiles…). The other model JSONs still have
// the original content shape. This adapter derives the redesigned fields from that content, so
// every model page renders the same section designs as the 3 Series with its own text and photos.
// Sections that already carry the redesigned fields are left untouched.

import { engineImageFor, heroCarFor, modelEngineImage } from "@/components/shared/carImage";

const strip = (html = "") => String(html ?? "").replace(/<[^>]*>/g, "");
const dash = (text = "") => String(text ?? "").replace(/\s+-\s*(?=\S)/g, " - ");
const slug = (text = "") => strip(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const pad = (n) => String(n).padStart(2, "0");

// "BMW X5 • 1999–Present • …" -> { full: "BMW X5", short: "X5" }
function modelNames(data) {
  const full = strip(String(data.hero?.tagPill || "").split("•")[0]).trim() || "BMW";
  return { full, short: full.replace(/^BMW\s+/, "") || full };
}

// "826+ Enquiries (2025) [BMW-VERIFIED]" -> "826+"; null when the hero has no count.
function enquiryCount(data) {
  for (const item of data.hero?.trustStrip || []) {
    const m = String(item.label || "").match(/^([\d,]+\+?)\s+Enquir/i);
    if (m) return m[1];
  }
  return null;
}

// "£2,000–£4,500 [PLACEHOLDER]" -> [2000, 4500]
function poundRange(text = "") {
  const nums = (String(text).match(/£\s?[\d,]+/g) || []).map((v) => Number(v.replace(/[£,\s]/g, "")));
  return nums.length ? [Math.min(...nums), Math.max(...nums)] : null;
}
const kilo = (n) => (n >= 1000 ? `£${(n / 1000).toFixed(n % 1000 ? 1 : 0)}K` : `£${n}`);

/* ---------------- generations ---------------- */

function generations(section, names) {
  if (!section?.cards || section.cards.some((c) => c.code)) return section;
  const seen = new Set();
  return {
    ...section,
    cards: section.cards.map((card) => {
      const title = strip(card.title);
      // Chassis code first (E85, F30/F31, G07 LCI), then model codes (Z4, i3, M1) when a card has no chassis code.
      const code =
        title.match(/\b[EFGU]\d{2}(?:\/\d{1,2})?(?:\/[EFGU]?\d{2})*(?:\s?LCI)?\b/)?.[0] || title.match(/\b(?:Z\d|i\d|M\d)\b/)?.[0];
      const label = title.match(/^(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth)\s+Generation/i)?.[0];
      return {
        ...card,
        label: label || names.full,
        code: code || title.replace(/\s*\(.*$/, "").replace(/^.*?\s[-–-]\s*/, "") || title,
        // The grid shows one card per generation, like the 3 Series: explainer cards ("The Line That Matters")
        // and body-style repeats (an E61 card after "E60/E61") stay in the data but out of the grid.
        variant: card.variant || isRepeat(code, card, seen),
      };
    }),
  };
}

function isRepeat(code, card, seen) {
  if (!code) return true;
  if (!card.rating && !strip(card.cta?.label)) return true;
  const parts = code.replace(/\s?LCI/, "").split("/").map((p, i, all) => (/^\d/.test(p) ? all[0].replace(/\d+$/, "") + p : p));
  const repeat = parts.every((p) => seen.has(p));
  parts.forEach((p) => seen.add(p));
  return repeat;
}

/* ---------------- engine database ---------------- */

function engineDatabase(section, names, ctx) {
  if (!section?.engines || section.stats) return section;
  const engines = section.engines;
  const count = engines.length;
  const ranges = engines.map((e) => poundRange(e.avgRebuildCost)).filter(Boolean);
  const low = ranges.length ? Math.min(...ranges.map((r) => r[0])) : null;
  const high = ranges.length ? Math.max(...ranges.map((r) => r[1])) : null;
  const generationsCount = ctx.generationsCount;
  return {
    ...section,
    stats: [
      { icon: "cube", value: String(count), label: "Engine Codes<br>Tracked" },
      { icon: "shield", value: String(generationsCount || "-"), label: `Generation${generationsCount === 1 ? "" : "s"}<br>Covered` },
      { icon: "chart", value: ctx.enquiries || "24,650+", label: ctx.enquiries ? "Enquiries<br>in 2025" : "BMW Enquiries<br>in 2025" },
      { icon: "pound", value: low != null ? `${kilo(low)}–${kilo(high)}` : "-", label: "Typical Recon<br>Cost Range" },
    ],
    sortColumn: section.columns?.[0] || "Engine Code",
    infoColumns: ["Reliability", "2025 Enquiries", "Avg. Recon Cost"],
    desktopRows: 10,
    viewAllLabel: `View all ${count} engine codes`,
    showingText: `Showing ${Math.min(10, count)} of ${count} engine codes`,
    legend: [
      { stars: "★☆☆☆☆", label: "Poor" },
      { stars: "★★★☆☆", label: "Average" },
      { stars: "★★★★☆", label: "Good" },
      { stars: "★★★★★", label: "Excellent" },
    ],
    note: "All enquiries are from 2025 (to date) and verified via our internal system.<br>Recon costs are supply only and exclude fitting.",
    noteLink: { label: "How we collect engine data", href: "/data/methodology" },
    mobile: {
      h2: `${names.short} Engine Codes - The Database`,
      subHeadline: `The complete database of ${names.full} engine codes with real UK enquiry data, fitted models, and replacement cost insights.`,
      dataCard: {
        title: "Proprietary UK Data",
        text: "Every figure below is powered by 24,650+ real UK owner enquiries in 2025. This is data you won’t find anywhere else.",
      },
      searchPlaceholder: "Search engine code, family or notes...",
      filters: { fuel: "Fuel Type", displacement: "Displacement", generation: "Generations", sortLabel: "Sort by", sortValue: "Enquiries (2025)" },
      reset: "Reset filters",
      columns: ["ENGINE CODE", "FUEL", "2025 ENQUIRIES", "VIEW"],
      engines: engines.map((e) => ({
        code: e.engineCode,
        fuel: /diesel/i.test(e.fuel) ? "Diesel" : /electric|hybrid/i.test(e.fuel) ? e.fuel : "Petrol",
        enquiries: String(e.enquiries || "").match(/^[\d,]+/)?.[0] || "-",
      })),
      sourcesTitle: "DATA SOURCES:",
      sources: [
        { icon: "chart", label: "Enquiry volumes:", text: "EM_Proprietary_Data_2025.txt [EM-VERIFIED]" },
        { icon: "pound", label: "Costs:", text: "Table A - Engine Replacement Economics [EM-QUOTE]" },
        { icon: "doc", label: "Engine codes:", text: "Cross-referenced from your existing data" },
      ],
    },
  };
}

/* ---------------- common problems ---------------- */

const URGENCY = ["catastrophic", "immediate", "monitor", "low"];

function commonProblems(section) {
  if (!section?.problems || section.problems.some((p) => p.titleDesktop)) return section;
  return {
    ...section,
    urgencyTitle: section.urgencyTitle || "URGENCY KEY",
    problems: section.problems.map((p, i) => ({ ...p, titleDesktop: p.issue, number: pad(p.id ?? i + 1) })),
    urgencyKey: (section.urgencyKey || []).map((u) => ({
      ...u,
      type: u.type || URGENCY.find((t) => String(u.label || "").toLowerCase().startsWith(t)) || "monitor",
    })),
  };
}

/* ---------------- market intelligence ---------------- */

const ENGINE_CODE = /\b[MNBS]\d{2}[A-Z]?\d{0,2}/;

function marketRow(signal) {
  const data = dash(signal.data || "");
  const tag = data.match(/\[[A-Z][A-Z -]+\]/)?.[0] || "";
  const withoutTag = data.replace(tag, "").trim();
  const value = withoutTag.match(/^[\d,]+\+?/)?.[0];
  const rawTrend = String(signal.demandTrend || "");
  const placeholder = dash(rawTrend.match(/\[PLACEHOLDER[^\]]*\]/)?.[0] || "");
  const trendText = dash(rawTrend.replace(/\[PLACEHOLDER[^\]]*\]/, "").replace(/^[^\p{L}]+/u, "").trim());
  const [trendLabel, ...noteParts] = trendText.split(/\s+-\s+/);
  const trend = /⬇|↓|falling|declin/i.test(rawTrend) ? "down" : /➡|→|stable|flat|steady/i.test(rawTrend) ? "flat" : "up";
  return {
    icon: ENGINE_CODE.test(signal.signal) ? "engine" : "car",
    signal: strip(signal.signal),
    value: value || "-",
    tag,
    note: value ? withoutTag.slice(value.length).trim() : withoutTag.replace(/^[-–-]\s*/, ""),
    trend,
    trendLabel: trendLabel || trendText,
    trendNote: noteParts.join(" - "),
    placeholder,
  };
}

function insightCard(text, index) {
  const clean = dash(strip(text));
  const colon = clean.indexOf(":");
  if (colon > 0 && colon < 40) {
    return { icon: ["search", "shield", "bars"][index] || "search", lead: clean.slice(0, colon + 1), leadStyle: "dark", text: clean.slice(colon + 1).trim() };
  }
  const words = clean.split(" ");
  return { icon: ["search", "shield", "bars"][index] || "search", lead: words.slice(0, 3).join(" "), leadStyle: "blue", text: words.slice(3).join(" ") };
}

function marketIntelligence(section, names, ctx) {
  if (!section || section.rows) return section;
  const h2 = dash(section.h2 || "");
  const [first, ...rest] = h2.split(/\s+-\s+/);
  const second = rest.join(" - ").replace(/(\d[\d,]*\+?\s+)?UK Owners/, (m) => `<span>${m}</span>`);
  return {
    ...section,
    titleLines: rest.length ? [`${first} -`, second] : [h2],
    stat: { value: ctx.enquiries || "24,650+", label: ctx.enquiries ? "Total Enquiries in 2025" : "BMW Enquiries in 2025", tag: "[BMW-VERIFIED]" },
    columns: ["Signal", "2025 Data", "Demand Trend"],
    rows: (section.signals || []).map(marketRow),
    insightsTitle: "Insights from the data:",
    insightCards: (section.insights || []).slice(0, 3).map(insightCard),
    liveFeed: { title: "Live Enquiry Feed", badge: "Live", text: "Real-time enquiry activity<br>across the UK.", cta: { label: "View Live Feed", href: "/data/most-enquired-models" } },
  };
}

function editorialQuote(quote) {
  if (!quote || quote.images) return quote;
  return { ...quote, label: quote.label || "EDITORIAL PULL-QUOTE", title: dash(quote.title), quote: dash(quote.quote) };
}

/* ---------------- replacement costs ---------------- */

function replacementCosts(section, names) {
  if (!section?.tables || section.generations) return section;
  const labourSource = dash(section.labourEstimate || section.figuresNote || "").replace(/^Labour estimate:\s*/i, "");
  const ruleAt = labourSource.search(/The [^.]{1,30}? rule\s*-/);
  const labour = (ruleAt > 0 ? labourSource.slice(0, ruleAt) : labourSource).trim();
  let ruleTitle = "";
  let ruleText = "";
  if (ruleAt > -1) {
    const ruleAll = labourSource.slice(ruleAt);
    const colon = ruleAll.indexOf(":");
    ruleTitle = colon > 0 ? ruleAll.slice(0, colon + 1) : "";
    ruleText = colon > 0 ? ruleAll.slice(colon + 1).trim() : ruleAll;
    // Some JSONs repeat the labour + rule paragraph; keep the first copy only.
    const again = ruleText.indexOf(labour.slice(0, 30));
    if (labour && again > 0) ruleText = ruleText.slice(0, again).trim();
  }
  const figuresIsNote = section.figuresNote && !/^Labour estimate/i.test(section.figuresNote);
  const columns = section.tables[0]?.columns || ["Variant", "Engine Code", "Used (Supply)", "Reconditioned (Supply)", "Rebuilt (Supply)", "Labour Hours"];
  const generationsList = section.tables.filter((table) => table.rows?.length).map((table) => {
    const title = dash(strip(table.title));
    const years = title.match(/\(([^)]*\d{4}[^)]*)\)/)?.[1] || "";
    const name = title.replace(/\s*\([^)]*\)\s*$/, "").trim();
    const tab = name.split(/\s+-\s+/)[0];
    const image = table.image;
    return {
      key: slug(name) || slug(title),
      title: name,
      years: years.replace(/–/g, " – "),
      tab,
      tabYears: years,
      mobileYears: years ? `(${years})` : "",
      rows: table.rows || [],
      images: image ? { light: image, dark: image, phone: image } : {},
    };
  });
  return {
    ...section,
    h2: dash(section.h2),
    subHeadline: dash(section.subHeadline),
    trust: [
      { icon: "pound", title: "Transparent", text: "Real UK Prices" },
      { icon: "gear", title: "Quality Assured", text: "Tested Engines" },
      { icon: "wrench", title: "Fitted by Experts", text: "Trusted Garages" },
      { icon: "shield", title: "12 Months", text: "Warranty" },
    ],
    columns,
    columnsMobile: columns.map((c) => c.replace(/\s+\(/, "<br>(").replace(/^Labour Hours$/, "Labour<br>Hours")),
    generations: generationsList,
    mobileNote: "Prices are supply only. Labour and ancillary parts extra.",
    notes: {
      title: "Important Notes",
      text: figuresIsNote ? dash(section.figuresNote) : "Prices are supply only and exclude fitting. Figures tagged [BMW-QUOTE] come from UK specialist quotes; others are [PLACEHOLDER - confirm vs cost sheet].",
      mobileBullets: [figuresIsNote ? dash(section.figuresNote) : "Prices are supply only and exclude fitting.", labour ? `Labour estimate: ${labour}` : ""].filter(Boolean),
    },
    labour: labour ? { title: "Labour Estimate", text: labour } : null,
    rule: ruleTitle || ruleText ? { title: ruleTitle || `The ${names.short} rule:`, text: ruleText, mobileParagraphs: [ruleText] } : null,
    footerMobile: ["All prices in GBP (£)", "Supply only", "Subject to availability and condition"],
  };
}

/* ---------------- engine evolution ---------------- */

function evolutionEngines(keyEngines = "") {
  return strip(keyEngines)
    .split(/\s*[,/]\s*|\s+and\s+/)
    .map((label) => label.trim())
    .filter(Boolean)
    .map((label) => {
      const image = engineImageFor(label);
      return { label, images: image ? { light: image, dark: image } : null };
    });
}

function engineEvolution(section, names, ctx) {
  if (!section?.eras || section.stats) return section;
  const h2 = dash(section.h2 || "");
  const m = h2.match(/^(.*?)\s+(Evolved)\s*-\s*(.*)$/);
  const firstYear = String(section.eras[0]?.years || "").match(/\d{4}/)?.[0];
  const span = firstYear ? new Date().getFullYear() - Number(firstYear) : null;
  const families = ctx.families;
  return {
    ...section,
    h2,
    titleLines: m ? [m[1], `${m[2]} - <span>${m[3]}</span>`] : [h2],
    titleLinesMobile: m ? [m[1], `${m[2]} -`, `<span>${m[3]}</span>`] : [h2],
    subHeadline:
      section.subHeadline ||
      `From ${families[0] ? `the ${families[0]}` : "the first engines"} to ${families.length > 1 ? `today’s ${families[families.length - 1]}` : "today"}, explore how engineering, emissions and performance shaped every generation of ${names.short} engines.`,
    stats: [
      { icon: "shield7", title: `${ctx.generationsCount || section.eras.length} Generation${(ctx.generationsCount || section.eras.length) === 1 ? "" : "s"}`, text: firstYear ? `${firstYear} to Present` : "Every era covered" },
      { icon: "gear", title: `${families.length || "Every"} Engine Famil${families.length === 1 ? "y" : "ies"}`, text: families.length > 1 ? `From ${families[0]} to ${families[families.length - 1]}` : "Every engine covered" },
      { icon: "chart", title: span ? `${span} Years of Engineering` : "Decades of Engineering", text: "Performance & Innovation" },
      { icon: "award", title: "Built for Drivers", text: "Reliability + Dynamics" },
    ],
    columns: section.columns || ["Era", "Years", "Key Engines", "Why BMW Changed", "Worth Knowing"],
    mobileLabels: ["Key Engines", "Why BMW Changed", "Worth Knowing"],
    eras: section.eras.map((era) => ({
      ...era,
      key: slug(era.era),
      era: dash(era.era),
      eraMobile: dash(era.era),
      engines: evolutionEngines(era.keyEngines),
      images: era.image ? { light: era.image, dark: era.image, phone: era.image } : {},
    })),
    footnote: `All engine reliability insights and failure patterns are based on ${ctx.enquiries ? `${ctx.enquiries} verified` : "verified UK"} enquiries in 2025. Data covers the UK market.`,
    footnoteTag: "[BMW-VERIFIED]",
  };
}

/* ---------------- who should buy ---------------- */

function buyerIcon(profile = "") {
  const p = profile.toLowerCase();
  if (/family/.test(p)) return "family";
  if (/commut|daily/.test(p)) return "briefcase";
  if (/budget|cheap|value/.test(p)) return "piggy";
  if (/perform|enthusiast|track|driver/.test(p)) return "gauge";
  return "shield";
}

function starCount(rating = "") {
  const full = (String(rating).match(/[⭐★]/g) || []).length;
  return Math.max(0, Math.min(5, full));
}

function whoShouldBuy(section, names, ctx) {
  if (!section?.profiles || section.proof) return section;
  const h2 = dash(section.h2 || `Who Should Buy a ${names.full}?`);
  return {
    ...section,
    titleLines: [h2.replace(names.full, `<span>${names.full}</span>`)],
    subHeadline: `Different buyers, different priorities. Here’s our verdict on who the ${names.short} is perfect for - and who should think twice.`,
    proof: [
      { icon: "group", title: "Built for Real Life", text: "Practical. Powerful.<br>Proven." },
      { icon: "shieldCheck", title: "Data-Backed Ratings", text: ctx.enquiries ? `${ctx.enquiries} UK enquiries<br>analysed in 2025.` : "Real UK enquiry data<br>analysed in 2025." },
      { icon: "award", title: "Honest Verdicts", text: "No hype. Just the truth<br>about ownership." },
      { icon: "wheel", title: "Buyer-Focused", text: `Find the right ${names.short}<br>for your needs.` },
    ],
    columns: section.columns || ["Buyer Profile", "Rating", "Our Verdict"],
    profiles: section.profiles.map((row) => ({
      ...row,
      key: slug(row.buyerProfile),
      icon: buyerIcon(row.buyerProfile),
      stars: starCount(row.rating),
      verdict: dash(row.verdict),
      images: row.image ? { light: row.image, dark: row.image, phone: row.image } : {},
    })),
    note: {
      title: "Real talk.",
      text: `The right ${names.short} for you depends on your budget, your mileage, and your patience for maintenance. Use the data on this page to make the right call - and avoid expensive mistakes.`,
    },
    cta: { label: `Explore ${names.short} Engines`, href: "#engine-database" },
  };
}

/* ---------------- trust block ---------------- */

function trustIcon(signal) {
  const t = `${signal.icon} ${signal.title}`.toLowerCase();
  if (/📊|data/.test(t)) return "chart";
  if (/💚|❤|not to repair|honest/.test(t)) return "heart";
  if (/🔧|special/.test(t)) return "wrench";
  return "shieldStar";
}

function trustBlock(section, names, ctx) {
  if (!section?.signals || section.items) return section;
  const h2 = dash(section.h2 || "");
  const m = h2.match(/^(.*?)\s+(Trust\s+.*)$/);
  return {
    ...section,
    titleLines: m ? [m[1], m[2].replace(/(BMWEngines\.uk)/i, "<span>$1</span>")] : [h2],
    items: section.signals.map((signal) => {
      const text = dash(signal.text).replace(/(\[[A-Z][A-Z -]+\])/g, "<span>$1</span>");
      return { icon: trustIcon(signal), title: signal.title, text: `- ${text}` };
    }),
    art: ctx.scene ? { light: ctx.scene, dark: ctx.scene } : section.art,
  };
}

/* ---------------- FAQ ---------------- */

function faq(section, names, ctx) {
  if (!section?.items || section.compare) return section;
  const h2 = dash(section.h2 || "");
  const at = h2.indexOf("Frequently Asked Questions");
  const before = at > 0 ? h2.slice(0, at).trim() : "";
  return {
    ...section,
    titleLines: at >= 0 ? [`${before ? `${before} ` : ""}<span>Frequently Asked Questions</span>`] : [h2],
    titleLinesMobile: at >= 0 ? [`${before ? `${before} ` : ""}<span>Frequently</span>`, "<span>Asked Questions</span>"] : [h2],
    items: section.items.map((item) => ({ ...item, question: dash(item.question), answer: dash(item.answer) })),
    compare: {
      title: "Need a head-to-head comparison?",
      text: `Read our in-depth ${names.full} generation and engine comparisons.`,
      cta: "Read the Comparisons",
      href: ctx.compareHref || "/compare",
    },
  };
}

/* ---------------- closing action cards ---------------- */

const CLOSING = [
  { test: /explore|generation/i, icon: "search", tone: "blue", cta: "Explore Now", kind: "lineup" },
  { test: /diagnos/i, icon: "stethoscope", tone: "green", cta: "Start Diagnosis", kind: "engine" },
  { test: /compare|special/i, icon: "handshake", tone: "orange", cta: "Compare Specialists", kind: "map" },
];

function closingCards(section, names, ctx) {
  if (!section?.cards || section.titleLines) return section;
  const heroSrc = ctx.closingCar;
  return {
    ...section,
    titleLines: ["Ready to Make", "<span>a Decision?</span>"],
    intro: "Everything you need to choose with confidence.<br>Data. Honesty. Specialists. All in one place.",
    heroImage: heroSrc ? { light: heroSrc, dark: heroSrc } : null,
    cards: section.cards.slice(0, 3).map((card, i) => {
      const spec = CLOSING.find((c) => c.test.test(card.title)) || CLOSING[i] || CLOSING[0];
      const words = strip(card.title).split(" ");
      const first = words.shift();
      const rest = words.join(" ");
      const accent = rest.includes(names.short) ? rest.replace(names.short, `<span>${names.short}</span>`) : `<span>${rest}</span>`;
      const art =
        spec.kind === "lineup"
          ? ctx.lineup && { kind: "lineup", light: ctx.lineup, dark: ctx.lineup }
          : spec.kind === "engine"
            ? ctx.engine && { kind: "engine", light: ctx.engine, dark: ctx.engine }
            : { kind: "map", light: "/model/s14-map-light.webp", dark: "/model/s14-map-light.webp" };
      return { ...card, icon: spec.icon, tone: spec.tone, titleLines: [first, accent], text: dash(card.text), cta: spec.cta, art: art || null };
    }),
  };
}

/** Fills the redesigned sections' fields for model JSONs that only have the original content. */
export function withReferenceSections(data) {
  if (!data) return data;
  const names = modelNames(data);
  const model = data.hero?.model;
  const hero = model ? heroCarFor(model) : null;
  const families = [...new Set((data.engineDatabase?.engines || []).map((e) => strip(e.family).split(/[\s/]/)[0]).filter(Boolean))];
  const ctx = {
    enquiries: enquiryCount(data),
    generationsCount: (data.generations?.cards || []).length || null,
    families,
    scene: hero?.scene?.src || null,
    lineup: hero?.lineup?.src || null,
    engine: modelEngineImage(model) || data.closingActionCards?.engineImage || null,
    closingCar: data.closingActionCards?.heroCar?.src || hero?.card?.src || null,
    compareHref: data.generations?.comparisonLink?.href,
  };
  const out = {
    ...data,
    generations: generations(data.generations, names),
    engineDatabase: engineDatabase(data.engineDatabase, names, ctx),
    commonProblems: commonProblems(data.commonProblems),
    marketIntelligence: marketIntelligence(data.marketIntelligence, names, ctx),
    editorialPullQuote: editorialQuote(data.editorialPullQuote),
    replacementCosts: replacementCosts(data.replacementCosts, names),
    engineEvolution: engineEvolution(data.engineEvolution, names, ctx),
    whoShouldBuy: whoShouldBuy(data.whoShouldBuy, names, ctx),
    trustBlock: trustBlock(data.trustBlock, names, ctx),
    faq: faq(data.faq, names, ctx),
    closingActionCards: closingCards(data.closingActionCards, names, ctx),
  };
  // Headings written with a spaced hyphen ("BMW X5 - The Ownership Verdict") read as an em dash, as on the 3 Series.
  for (const key of Object.keys(out)) {
    const section = out[key];
    if (section && typeof section === "object" && !Array.isArray(section) && typeof section.h2 === "string") {
      out[key] = { ...section, h2: dash(section.h2), subHeadline: section.subHeadline ? dash(section.subHeadline) : section.subHeadline };
    }
  }
  return out;
}
