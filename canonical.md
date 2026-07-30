# Canonical URL Setup (Next.js)

Every page auto-generates `<link rel="canonical">` with no manual maintenance.

## 1. Root layout — metadataBase

In `src/app/layout.js`, add `metadataBase` to the static metadata export:

```js
export const metadata = {
  metadataBase: new URL("https://yourdomain.com/"),
  title: "...",
  description: "...",
};
```

Note: `metadataBase` MUST end with `/` or Next.js will strip trailing slashes from relative canonicals.

## 2. Every page — generateMetadata with canonical

Each `page.js` exports a `generateMetadata()` that returns `alternates.canonical`.
**Use absolute URLs** (not relative like `/path`) — relative paths get normalized by `metadataBase`
and Next.js may add/strip trailing slashes. Absolute URLs preserve exact format.

If data files have a `meta.canonical` field, use it; otherwise auto-generate from route params.

### Home page (`page.js`):

```js
export function generateMetadata() {
  return {
    alternates: { canonical: "https://yourdomain.com/" },
  };
}
```

### Dynamic routes (e.g. `[slug]/page.js`):

```js
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPageData(slug);
  const canonical = data?.meta?.canonical || `https://yourdomain.com/${slug}`;

  return {
    title: data?.meta?.title,
    description: data?.meta?.description,
    alternates: { canonical },
  };
}
```

### Catch-all routes (e.g. `[...slug]/page.js`):

```js
export async function generateMetadata({ params }) {
  const { slug: segments } = await params; // e.g. ["1-series", "e87"]
  const data = await getPageData(segments);
  const canonical = data?.meta?.canonical || `https://yourdomain.com/${segments.join("/")}`;

  return {
    title: data?.meta?.title,
    description: data?.meta?.description,
    alternates: { canonical },
  };
}
```

## 3. Data files (optional)

JSON data files can optionally override the canonical with a `meta.canonical` field.
Use absolute URLs, no trailing slash:

```json
{
  "meta": {
    "title": "Page Title",
    "description": "Page description.",
    "canonical": "https://yourdomain.com/some/path"
  }
}
```

If `meta.canonical` is missing or empty, it falls back to auto-generated from route params.

## Result

Every page outputs:

```html
<link rel="canonical" href="https://yourdomain.com/1-series/e87" />
```

— either from data or auto-generated. No per-page manual work needed.

## 4. Sitemap

Create `src/app/sitemap.js`. Next.js auto-detects this and generates `sitemap.xml` at build time.
Import the same page registries used by your routes, iterate them, output absolute URLs:

```js
import modelPages from "@/data/registy/models/pages.json";
import genPages from "@/data/registy/generations/pages.json";
import variantPages from "@/data/registy/variants/pages.json";
import enginePages from "@/data/registy/engines/pages.json";

const BASE_URL = "https://yourdomain.com";

export default function sitemap() {
  const entries = [];

  // Home
  entries.push({
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  });

  // Models: /1-series, /3-series, ...
  for (const { slug } of modelPages) {
    entries.push({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Generations: /1-series/e87, /3-series/e90, ...
  for (const { parent, slug } of genPages) {
    entries.push({
      url: `${BASE_URL}/${parent}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Variants: /1-series/114i, /3-series/320d, ...
  for (const { parent, slug } of variantPages) {
    entries.push({
      url: `${BASE_URL}/${parent}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Engines: /engine/b37-b47, /engine/n62-n63, ...
  for (const { slug } of enginePages) {
    entries.push({
      url: `${BASE_URL}/engine/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
```

Next.js outputs `https://yourdomain.com/sitemap.xml` automatically — no manual work needed.
