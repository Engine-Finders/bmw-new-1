/**
 * Map DVLA / vehicle-lookup text → a local photo under /public/cars.
 * Model-level only (no generation/variant). Unknown → default BMW image.
 */

import carModelImages from "@/data/shared/carModelImages.json";

const DEFAULT_IMAGE = carModelImages.default || carModelImages["3-series"];

function clean(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Turn API model/series text into a cars-folder model key.
 * Examples: "3 SERIES" → 3-series, "320D" → 3-series, "X5" → x5, "M3" → m3
 */
export function modelSlugFromSeries(series = "") {
  const text = clean(series);
  if (!text) return "";

  if (/\b2002\b/.test(text)) return "3-series";
  if (/\bxm\b/.test(text)) return "xm";
  if (/\bz\s*[348]?\b/.test(text) || /\bz[348]\b/.test(text)) return "z-series";
  if (/\bi[x0-9]?\b/.test(text) || /\bi series\b/.test(text)) return "i-series";

  // M cars before bare series / 320 codes
  const mCar = text.match(/\bm\s*([1-8])\b/);
  if (mCar) return `m${mCar[1]}`;

  const xCar = text.match(/\bx\s*([1-7])\b/);
  if (xCar) return `x${xCar[1]}`;

  const namedSeries = text.match(/\b([1-8])\s*series\b/);
  if (namedSeries) return `${namedSeries[1]}-series`;

  // 116d, 320i, 520d, 730Ld, 840i → N-series
  const code = text.match(/\b([1-8])\d{2}[a-z]{0,3}\b/);
  if (code) return `${code[1]}-series`;

  return "";
}

/**
 * @param {{ brand?: string, series?: string, model?: string }} vehicle
 * @returns {string} public image path under /cars/...
 */
export function resolveModelImage(vehicle = {}) {
  const slug = modelSlugFromSeries(vehicle.series || vehicle.model || "");
  return (slug && carModelImages[slug]) || DEFAULT_IMAGE;
}

export const DEFAULT_MODEL_IMAGE = DEFAULT_IMAGE;
