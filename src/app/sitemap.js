import modelPages from "@/data/registery/models/pages.json";
import genPages from "@/data/registery/generations/pages.json";
import variantPages from "@/data/registery/variants/pages.json";
import enginePages from "@/data/registery/engines/pages.json";

const BASE_URL = "https://bmwengines.uk";

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
