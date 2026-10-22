import carImages from "@/data/shared/carImages.json";

// Model name patterns, matched case-insensitively against free text such as
// "BMW 3 Series F30", "M3 E46", "X5 G05 (B57)", "BMW 320d" or "M440i". The model that
// appears first in the text wins. Engine codes (N47, M54, S63...) deliberately match nothing.
const MODEL_PATTERNS = [
  ["2002", /\b2002\b|\b02[\s-]?series\b/],
  ["xm", /\bxm\b/],
  ["x1", /\bi?x1\b/],
  ["x2", /\bi?x2\b/],
  ["x3", /\bi?x3\b/],
  ["x4", /\bx4\b/],
  ["x5", /\bx5\b/],
  ["x6", /\bx6\b/],
  ["x7", /\bx7\b/],
  ["z3", /\bz3\b/],
  ["z4", /\bz4\b/],
  ["z8", /\bz8\b/],
  ["m1", /\bm1\b/],
  ["m2", /\bm2\b/],
  ["m3", /\bm3\b/],
  ["m4", /\bm4\b/],
  ["m5", /\bm5\b/],
  ["m6", /\bm6\b/],
  ["m8", /\bm8\b/],
  ["i-series", /\bi[\s-]?series\b/],
  ["z-series", /\bz[\s-]?series\b/],
];
// "3 Series", "5-Series"
const SERIES_PATTERN = /\b([1-8])[\s-]?series\b/;
// Variant names: "320d", "530e", "118i", "225xe", "M340i", "M550d", "M760Li"
const VARIANT_PATTERN = /\bm?([1-8])\d{2}(?:d|i|e|is|li|ld|xd|xe|td|ti|tds|ci|si|sd|ix)\b/;
// The i4 and i5 are built on the 4 Series Gran Coupé (G26) and 5 Series (G60/G61).
const I_MODELS = [
  [/\bi4\b/, "4-series|g26"],
  [/\bi5\b/, "5-series|g60"],
];

const GENERATION_PATTERN = /\b([efgu]\d{2})\b/;
const YEAR_PATTERN = /\b(19[5-9]\d|20[0-3]\d)\b/;

// Engine-only labels (e.g. comparison cards "N47 vs B47") get the car each engine is best known
// in, so every slot still shows a BMW.
const ENGINE_CAR = [
  [/\bn47/, "3 series e90"],
  [/\bb47/, "3 series f30 lci"],
  [/\bn57/, "5 series f10"],
  [/\bb57/, "x5 g05"],
  [/\bb58/, "3 series g20"],
  [/\bb48/, "1 series f40"],
  [/\bn55/, "x3 f25"],
  [/\bn54/, "3 series e92"],
  [/\bn63/, "x5 e70"],
  [/\bs63/, "m5 f10"],
  [/\bm54/, "3 series e46"],
  [/\bm57/, "5 series e39"],
  [/^bmw$/, "3 series g20"],
];

// Generations with no photo of their own, shown with the M car of the same body
// (the M6 is a 6 Series, the M8 Coupé/Convertible/Gran Coupé are the G15/G14/G16).
const POOL_ALIAS = {
  "6-series|e24": "m6|e24",
  "6-series|e63": "m6|e63",
  "6-series|e64": "m6|e64",
  "6-series|f06": "m6|f06",
  "6-series|f12": "m6|f12",
  "6-series|f13": "m6|f13",
  "8-series|g14": "m8|f91",
  "8-series|g15": "m8|f92",
  "8-series|g16": "m8|f93",
  "m3|e90": "m3|e92",
  "m3|e93": "m3|e92",
  "m5|g99": "m5|g90",
  "m6|e64": "m6|e63",
  "m6|f12": "m6|f13",
  "m4|g83": "m4|g82",
  "i-series|g26": "4-series|g26",
  "i-series|g60": "5-series|g60",
  "z-series|e85": "z4|e85",
  "z-series|e86": "z4|e86",
  "z-series|e89": "z4|e89",
  "z-series|g29": "z4|g29",
  "z-series|e52": "z8|e52",
  "z-series|e36": "z3|e36 7",
};

// Photo views, in the order a section falls back to when a model runs out of unused photos.
const VIEWS = ["45", "side", "front"];

function normalise(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[‐-―]/g, "-")
    .replace(/\s+/g, " ");
}

function findModel(text) {
  let best = null;
  const consider = (model, match) => {
    if (match && (!best || match.index < best.index)) best = { model, index: match.index };
  };
  for (const [model, pattern] of MODEL_PATTERNS) consider(model, text.match(pattern));
  const series = text.match(SERIES_PATTERN);
  if (series) consider(`${series[1]}-series`, series);
  const variant = text.match(VARIANT_PATTERN);
  if (variant) consider(`${variant[1]}-series`, variant);
  return best?.model || null;
}

// Latest generation of `model` that had started by `year`.
function generationForYear(model, year) {
  let best = null;
  for (const [key, start] of Object.entries(carImages.generationStart)) {
    const [keyModel, generation] = key.split("|");
    if (keyModel !== model || generation.endsWith(" lci") || start > year) continue;
    if (!best || start > best.start) best = { generation, start };
  }
  return best?.generation || null;
}

function resolve(key) {
  let out = key;
  for (let hops = 0; POOL_ALIAS[out] && hops < 3; hops += 1) out = POOL_ALIAS[out];
  return out;
}

/**
 * Photo pool key ("3-series|f30", "x5|g05", "m3|e46", ...) for a BMW described by free text,
 * or null when the text names no BMW we have photos of.
 */
export function carKeyFor(...hints) {
  let text = normalise(hints.filter((hint) => typeof hint === "string" && hint).join(" ").trim());
  if (!text) return null;
  const iModel = I_MODELS.find(([pattern]) => pattern.test(text));
  if (iModel && !/\b[1-8][\s-]?series\b/.test(text)) return iModel[1];
  if (!findModel(text) && !GENERATION_PATTERN.test(text)) {
    text = ENGINE_CAR.find(([pattern]) => pattern.test(text))?.[1] || text;
  }

  let generation = text.match(GENERATION_PATTERN)?.[1] || null;
  const model = findModel(text) || (generation && carImages.generationModel[generation]) || null;
  if (!model) return null;
  // Z3 roadster (E36/7) and coupé (E36/8) share the E36 code.
  if (model === "z3" || (model === "z-series" && generation === "e36")) {
    generation = /\be36\s*\/?\s*8\b|coup/.test(text) ? "e36 8" : "e36 7";
    return `z3|${generation}`;
  }

  const year = text.match(YEAR_PATTERN)?.[1];
  if (!generation && year) generation = generationForYear(model, Number(year));

  const { pools, generationStart } = carImages;
  const faceliftKey = resolve(`${model}|${generation} lci`);
  const isFacelift =
    /\blci\b/.test(text) || (year && generationStart[faceliftKey] && Number(year) >= generationStart[faceliftKey]);
  if (generation && isFacelift && pools[faceliftKey]) return faceliftKey;
  const exact = resolve(`${model}|${generation}`);
  if (generation && pools[exact]) return exact;
  const fallback = carImages.defaultGeneration[model];
  return fallback ? resolve(`${model}|${fallback}`) : null;
}

function photoPath(file) {
  return `${carImages.basePath}${file}`;
}

// Pools are model|generation -> view -> [file, colour]; colours were checked from the pixels.
const COLOUR = new Map();
const POOL_FILES = {};
for (const [key, views] of Object.entries(carImages.pools)) {
  POOL_FILES[key] = {};
  for (const [view, entries] of Object.entries(views)) {
    POOL_FILES[key][view] = entries.map(([file, colour]) => {
      COLOUR.set(file, colour);
      return file;
    });
  }
}

function colourOf(file) {
  return COLOUR.get(file) || "other";
}

/**
 * 45-degree front-view photo for a BMW described by free text, e.g.
 * carImageFor("3 Series", "F30") or carImageFor("BMW X5").
 * Picks the exact generation when one is mentioned, else the model's default photo.
 * Returns null when nothing matches, so callers can keep their own fallback.
 */
export function carImageFor(...hints) {
  const key = carKeyFor(...hints);
  const file = key && POOL_FILES[key]?.["45"]?.[0];
  return file ? photoPath(file) : null;
}

/**
 * Model key ("3-series", "x5", "m3", ...) for free text such as a hero tag pill, or null.
 */
export function carModelFor(...hints) {
  return findModel(normalise(hints.filter(Boolean).join(" ")));
}

/**
 * Hero for a model page: the client's line-up scene for that model, plus the photos it is made
 * of so the rest of the page can avoid showing them again.
 */
export function heroCarFor(model) {
  return carImages.heroes[model] || null;
}

/**
 * Hero for one generation ("3-series|f30", from carKeyFor): a 45-degree cut-out at 20-25 KB and
 * the scene it stands in, plus `car`, the pool photo it was made from, so the rest of the page can avoid it.
 */
export function generationHeroFor(key) {
  return (key && carImages.generationHeroes[key]) || null;
}

/** Cut-out photo path of a generation hero's car (the car the generation's scene shows). */
export function generationHeroCar(key) {
  const photo = generationHeroFor(key);
  return photo?.car ? photoPath(photo.car) : null;
}

/** BMW's own hero background (no car) for the current theme. */
export function heroBackground(isDark) {
  return isDark ? carImages.background.dark : carImages.background.light;
}

// Engine names as written in copy -> engine photo key (cut out, transparent).
// First matching rule wins, so the most specific codes come first.
const ENGINE_PATTERNS = [
  [/\bs68/, "s68b44"],
  [/\bs63b44t4\b|\bs63 ?tu4\b/, "s63b44t4"],
  [/\bs63b44t3\b/, "s63b44t3"],
  [/\bs63b44t2\b/, "s63b44t2"],
  [/\bs63b44t0\b/, "s63b44t0"],
  [/\bs63b44a\b/, "s63b44a"],
  [/\bs63/, "s63b44t0"],
  [/\bs58 ?tu2\b/, "s58tu2"],
  [/\bs58/, "s58b30t"],
  [/\bs55/, "s55b30a"],
  [/\bb57d30c\b/, "b57d30c"],
  [/\bb57/, "b57d30-a-b"],
  [/\bb58b30o0\b/, "b58b30o0"],
  [/\bb58d30\b/, "b58d30"],
  [/\bb58/, "b58b30"],
  [/\bb47 ?tu2\b/, "b47tu2"],
  [/\bb47d20d\b/, "b47d20d"],
  [/\bb47c20\b/, "b47c20"],
  [/\bb47/, "b47d20"],
  [/\bb37/, "b37d15"],
  [/\bb38b15/, "b38b15m0"],
  [/\bb38/, "b38a15a"],
  [/\bb48d20\b/, "b48d20"],
  [/\bb48b20/, "b48b20b"],
  [/\bb4[68]/, "b48a20"],
  [/\bn13/, "n13b16a"],
  [/\bn20/, "n20b20"],
  [/\bn47d16\b/, "n47d16"],
  [/\bn47/, "n47d20c"],
  [/\bn57d30t0\b|\bn57s\b|\btri-?turbo\b/, "n57d30t0"],
  [/\bn57/, "n57d30a"],
  [/\bn55/, "n55b30"],
];

/** Photo of the engine named in free text ("N47D20C", "B58", "S63 V8"), or null. */
export function engineImageFor(text) {
  const clean = normalise(String(text || ""));
  const key = ENGINE_PATTERNS.find(([pattern]) => pattern.test(clean))?.[1];
  return key ? carImages.engines[key] || null : null;
}

/** The engine photo that best represents a model (e.g. the 3 Series' B47 diesel). */
export function modelEngineImage(model) {
  const key = carImages.modelEngine[model];
  return key ? carImages.engines[key] : null;
}

// Other photo pools of the same model, nearest generation (by start year) first.
function siblingKeys(key) {
  const [model] = key.split("|");
  const start = (k) => carImages.generationStart[k] ?? Infinity;
  return Object.keys(POOL_FILES)
    .filter((k) => k !== key && k.split("|")[0] === model)
    .sort((a, b) => Math.abs(start(a) - start(key)) - Math.abs(start(b) - start(key)));
}

/**
 * Hands out car photos for one page so no photo is shown twice. Each section asks for all
 * its photos at once and gets one view (45-degree, side, front) for the whole section, so
 * rows stay consistent; colours rotate through grey, black, white, silver and blue.
 * When a model has fewer photos than the page needs, the least-used photo is repeated.
 */
export function createCarPicker(alreadyUsed = [], { siblings = false } = {}) {
  const used = new Map();
  const colourCount = new Map();

  const take = (file) => {
    used.set(file, (used.get(file) || 0) + 1);
    const colour = colourOf(file);
    colourCount.set(colour, (colourCount.get(colour) || 0) + 1);
    return photoPath(file);
  };
  alreadyUsed.forEach(take);

  // Of the unused photos, the one whose colour the page has shown least so far.
  const leastShownColour = (files) =>
    files.reduce((best, file) =>
      (colourCount.get(colourOf(file)) || 0) < (colourCount.get(colourOf(best)) || 0) ? file : best
    );

  return function pickSection(hintList, { view = "45" } = {}) {
    const keys = hintList.map((hints) => carKeyFor(...[].concat(hints)));
    const need = {};
    keys.forEach((key) => {
      if (key) need[key] = (need[key] || 0) + 1;
    });

    const order = [view, ...VIEWS.filter((v) => v !== view)];
    const free = (key, v) => (POOL_FILES[key]?.[v] || []).filter((file) => !used.has(file));
    const sectionView =
      order.find((v) => Object.entries(need).every(([key, count]) => free(key, v).length >= count)) || view;

    // Rows of one section get different colours first; across the page, the least-shown colour wins.
    const sectionColours = new Set();
    const takeForSection = (files) => {
      let fresh = files.filter((file) => !sectionColours.has(colourOf(file)));
      if (!fresh.length) {
        // Every colour this model comes in is already in the section: start the rotation again.
        sectionColours.clear();
        fresh = files;
      }
      const file = leastShownColour(fresh);
      sectionColours.add(colourOf(file));
      return take(file);
    };

    return keys.map((key) => {
      if (!key) return null;
      for (const v of [sectionView, ...order.filter((o) => o !== sectionView)]) {
        const files = free(key, v);
        if (files.length) return takeForSection(files);
      }
      // `siblings`: out of photos of this generation, use the nearest generation of the same model
      // rather than showing a photo twice.
      for (const sibling of siblings ? siblingKeys(key) : []) {
        for (const v of order) {
          const files = free(sibling, v);
          if (files.length) return takeForSection(files);
        }
      }
      const pool = POOL_FILES[key]?.[sectionView] || POOL_FILES[key]?.["45"] || [];
      if (!pool.length) return null;
      const leastUsed = [...pool].sort((a, b) => (used.get(a) || 0) - (used.get(b) || 0))[0];
      return take(leastUsed);
    });
  };
}
