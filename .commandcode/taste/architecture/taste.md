# architecture
- Route structure for BMW engines site: use /engine/[slug] for engines, and a catch-all [...slug]/page.js for models (1-segment), generations (2-segments), and variants (2-segments). Confidence: 0.70
- Prefers hard-coding URLs and configuration values directly in source code rather than using environment variables (e.g., `.env` files). Confidence: 0.85
- Prefers canonical URLs WITHOUT trailing slashes (e.g., `/engine/b37-b47` not `/engine/b37-b47/`). Confidence: 0.85
- When you want precise control over canonical URLs in Next.js without metadataBase trailing-slash normalization, use absolute URLs (e.g., `https://bmwengines.uk/engine/${slug}`) rather than relative paths (`/engine/${slug}`) in the canonical field. Confidence: 0.80
- When generating sitemaps for Next.js, derive URLs from the same page registries that power the dynamic routes rather than scanning the filesystem or maintaining a separate URL list - this ensures the sitemap stays synced with actual pages automatically. Confidence: 0.75
- After making SEO/infrastructure changes, verify correctness by inspecting the actual generated output files (e.g., `.html` in `.next/server/app/`) rather than trusting only that the build passes. Confidence: 0.70
