# BMW Web - Agent Notes

## Goal
Build a multi-page site (3–4 pages). Start with the **home page**. Data flow stays JSON-driven; every page and section follows **`UI_RULES.md`**. Later: swap JSON → DB with minimal changes.

## Architecture (current)

### Folders
- Home components: `src/components/home/`
- Home JSON data: `src/data/home/`
- Shared UI: `src/components/shared/` (Navbar, Footer)
- Shared JSON: `src/data/shared/` (navbar, footer)

### Naming
- Section component + JSON share the same name: `homeSec1`, `homeSec2`, …
- Files: `src/components/home/HomeSec1.js` + `src/data/home/homeSec1.json`

### Data flow
- Content is **dynamic** from JSON (one file per section).
- `src/app/page.js` imports JSON and **passes data as props** to section components.
- Later JSON → DB/API; keep the same shape so components stay unchanged.
- **H1 / H2 (home)**: live in each section JSON (`h1` / `h2`). Components render them from `data` (accent spans may use `.heading-accent`). Other pages may still hardcode until migrated.
- **Do not miss any content** when converting provided copy/data into JSON.

### Pages
- Home entry: `src/app/page.js`
- Other pages (later): same pattern - page + section JSONs + section components.
- Shared Navbar + Footer on all pages (simple skeleton for now).

### Images
- For now: full `https://` URLs (car images from the web) for testing.
- Replace with real assets later.
- `next.config.mjs` must allow remote image hosts when using `next/image`.

### UI rules (strict)
- **`UI_RULES.md` is the single source** for container, 100%-zoom fit, type scale, cards, badges, tables, buttons, responsive, images, theme and the definition of done. It overrides older notes.
- Fix once, apply everywhere: a fix for one section goes to every page/section with the same pattern.
- Check pages with `scripts/ui-audit.js` (paste into the browser console at 1536 and 1280).
- Do **not** render "/ SECTION N" labels on sections.

## Workflow
1. User provides section content (and optional layout ref image).
2. Create `src/data/home/homeSecN.json` with **all** content including H1/H2 (nothing omitted).
3. Create matching `src/components/home/HomeSecN.js` - render H1/H2 from `data`; rest from `data` props.
4. Wire in `src/app/page.js`: import JSON → pass props → render component.
5. Repeat section by section.

## Status
- [x] Folder structure + shared Navbar/Footer
- [x] homeSec1 - Hero (desktop: text left / image right; mobile: image first)
- [x] homeSec2 - Find Your Vehicle (desktop: 2-col tables; mobile: stacked list + filters/CTA)
- [x] homeSec3 - Diagnostic Calculator (desktop: 3-col how/calc/trust; mobile: stacked + example/CTA)
- [ ] Home sections 4+ (awaiting content)
- [ ] Other pages (later)

### Layout width
- See `UI_RULES.md` §1 (container) and §3 (type scale).
