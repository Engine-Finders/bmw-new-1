# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
- After completing a cross-cutting/infrastructure change, document the pattern in a standalone reference markdown file (e.g., `canonical.md`) with step-by-step instructions so it can be replicated across cloned/similar projects. Write these docs to be AI-consumable — brief, structured, with code snippets the AI can follow. Confidence: 0.75
- After bulk search-and-replace operations (e.g., domain renames, string replacements across many files), verify with a grep count that zero old/stale references remain before declaring the change complete. Confidence: 0.80
- Keep registry pages.json files in sync with corresponding data directories — each JSON file in src/data/*/ becomes an entry (slug + dataFile = filename without extension, plus type field when applicable). Confidence: 0.70
- Include a \"type\" field in all registry entries indicating the data category: \"models\", \"generations\", \"variants\", or \"engines\". Confidence: 0.70
- When making a cross-cutting/infrastructure change (e.g., SEO metadata, canonicals), apply it comprehensively to all affected pages/routes at once rather than incrementally one page at a time. Confidence: 0.80

# architecture
- Route structure for BMW engines site: use /engine/[slug] for engines, and a catch-all [...slug]/page.js for models (1-segment), generations (2-segments), and variants (2-segments). Confidence: 0.70
- Prefers hard-coding URLs and configuration values directly in source code rather than using environment variables (e.g., `.env` files). Confidence: 0.85
- Prefers canonical URLs WITHOUT trailing slashes (e.g., `/engine/b37-b47` not `/engine/b37-b47/`). Confidence: 0.85
- When you want precise control over canonical URLs in Next.js without metadataBase trailing-slash normalization, use absolute URLs (e.g., `https://bmwengines.uk/engine/${slug}`) rather than relative paths (`/engine/${slug}`) in the canonical field. Confidence: 0.80

- After making SEO/infrastructure changes, verify correctness by inspecting the actual generated output files (e.g., `.html` in `.next/server/app/`) rather than trusting only that the build passes. Confidence: 0.70

# data-consistency
- When updating sections in generation JSON files (e.g., bestWorstEngines, coreVariants, engineEvolution), match the structure and field naming of existing sibling generation files for consistency across the project. Confidence: 0.65
- Consolidate multi-item arrays like petrolVariants, dieselVariants into a single string using ` · ` (space-middle-dot-space) separators instead of individual array elements. Confidence: 0.70
