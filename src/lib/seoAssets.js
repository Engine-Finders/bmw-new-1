/** Default live assets (public/hero-day.webp). Replaces missing /images/*.jpg|png. */
export const DEFAULT_OG_IMAGE = "https://bmwengines.uk/hero-day.webp";
export const DEFAULT_LOGO = "https://bmwengines.uk/hero-day.webp";

function isBrokenSeoAsset(url) {
  if (!url || typeof url !== "string") return true;
  // Site has no /public/images — these 404 in GSC.
  if (/bmwengines\.uk\/images\//i.test(url)) return true;
  return false;
}

export function resolveSeoImage(url, { logo = false } = {}) {
  if (isBrokenSeoAsset(url)) return logo ? DEFAULT_LOGO : DEFAULT_OG_IMAGE;
  return url;
}

/** Deep-fix logo/image URLs inside JSON-LD before render. */
export function sanitizeJsonLd(node) {
  if (Array.isArray(node)) return node.map(sanitizeJsonLd);
  if (!node || typeof node !== "object") return node;

  const out = Array.isArray(node) ? [] : { ...node };
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === "string" && (key === "logo" || key === "image" || key === "url")) {
      const looksLikeAsset = /\.(jpe?g|png|webp|gif|svg)(\?|#|$)/i.test(value) || /\/images\//i.test(value);
      if (looksLikeAsset && isBrokenSeoAsset(value)) {
        out[key] = key === "logo" ? DEFAULT_LOGO : DEFAULT_OG_IMAGE;
      } else {
        out[key] = value;
      }
    } else if (value && typeof value === "object") {
      out[key] = sanitizeJsonLd(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
