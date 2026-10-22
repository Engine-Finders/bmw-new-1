# BMW Web — UI Rules (every page, every section)

These rules apply to **all** pages (home, models, generations, variants, engines, blog, quote, static `/public` pages) and every section on them. They come from the client's review feedback (Oct 2026). When a rule here conflicts with an older note, this file wins.

**Rule zero — fix once, apply everywhere.** When feedback names one section, the same fix goes to every section and page that uses the same pattern (cards, tables, badges, buttons, headings). The client should never have to report the same problem twice on a different page.

Tokens and utility classes live in `src/app/globals.css`. Use them; do not invent one-off values.

---

## 1. Container and alignment

| Rule | How |
|---|---|
| One container for the whole site | Every section's content sits in `.site-container` (max `88rem`, side padding `--gutter`: 16px phone / 32px tablet+). Same as the navbar. |
| One left edge | Section headings, text, cards and tables start on the navbar logo's left edge. No section adds its own `max-w-*`, `px-*` or `mx-auto` wrapper around the content. |
| Full-bleed backgrounds | A background colour or image may span the full width on the `<section>`; the content inside still uses `.site-container`. |
| One vertical rhythm | Section top/bottom spacing is `.section-y` (40 / 56 / 64px). No ad-hoc `py-20`, `pt-32`, `mb-24` on sections. |
| No scaled artboards | Never build a section at a fixed reference width and scale it (`--u`, ScaleBox, `transform: scale`, `cqw` multipliers, `zoom`). Layouts are fluid. |
| No fixed heights | No `h-[…]`, `min-h-screen`, `min-h-[…]` on sections, heroes or cards. Height comes from content. Equal-height cards in a row come from grid stretch, not a set height. |

Standard section markup:

```jsx
<section className="section-y">
  <div className="site-container">
    <h2 className="t-h2">…</h2>
    …
  </div>
</section>
```

## 2. Desktop fit at 100% zoom

- At 100% browser zoom, a **standard section** (hero, intro, cards, CTA, calculator) is fully visible inside one viewport at **1536×864** and **1920×1080**. Nobody should need to zoom out to see it.
- The **hero** must show H1, paragraph, CTA, badges and image above the fold at 1536×864, navbar included.
- Exceptions: long tables and sections that are mostly data. They may scroll, but their type and spacing still follow these rules.
- Content fits by tightening spacing and layout, **never by shrinking text** below the scale in section 3.

## 3. Typography

One scale, applied through classes. The same kind of content uses the same class on every page.

| Class | Use for | Desktop ≥1024 | Tablet 768–1023 | Phone <768 | Weight |
|---|---|---|---|---|---|
| `.t-h1` | Page title (one per page) | 60 | 46 | 36 | 700 |
| `.t-h2` | Section title | 54 | 40 | 30 | 700 |
| `.t-h3` | Sub-section title | 44 | 34 | 26 | 700 |
| `.t-h4` | Block / panel title | 34 | 28 | 22 | 700 |
| `.t-h5` | Card title | 24 | 22 | 19 | 600 |
| `.t-h6` | Small card / list-group title | 20 | 19 | 17 | 600 |
| `.t-p` | Paragraphs, section intros | **18 max** | 17 | 16 | 400 |
| `.t-body` | Card descriptions, table cells, secondary text, buttons | 16 | 16 | 15 | 400 |
| `.t-num` | Prices, scores, key figures, highlighted values | 20 | 19 | 18 | 700 |
| `.t-label` | Badges, chips, icon labels, table headers, captions | 15 | 14 | 13 | 400–600 |

Hard rules:

1. **No arbitrary sizes.** No `text-[12px]`, `text-[13px]`, `text-[22px]`, `text-xs`, `text-sm`, `text-2xl` etc. for content text. Use a `.t-*` class.
2. **Desktop minimum is 15px.** Nothing readable on desktop is 9–14px — not footnotes, not table cells, not chart labels, not disclaimers.
3. **Paragraph text never exceeds 18px.** Only `.t-num` (19–20px) and headings go above it.
4. Badges / labels / supporting text stay **15–17px** on desktop.
5. **Line height comes from the class.** Do not add `leading-loose`, `leading-relaxed` or custom `leading-[…]` on headings. Multi-line headings must read as one block, not spaced-out lines.
6. **Line length:** paragraphs max ~70 characters (`max-w-[68ch]`) so 18px text stays readable.
7. **Hierarchy:** each step down must look smaller than the one above it. A card title never matches or beats its section title.
8. Headings render from JSON (`h1` / `h2` fields); accent words use `.heading-accent` / `.heading-accent-red`.

Font weight:

- Body text, descriptions, **names in lists, tables and cards (model names, engine names)**: 400.
- Card titles and table headers: 600. Section headings: 700. Key figures (`.t-num`): 700.
- Buttons: 600. **Never 800/900** anywhere.
- Trap: `globals.css` sets `a { font-weight: 900 }` in the base layer. Every content link must set its own weight (`font-normal` for names, `font-semibold` for text CTAs).

## 4. Cards with an icon (steps, trust points, features)

```
┌──────────────────────────────┐
│ [icon]  Heading              │   icon + heading on one row, vertically centred
│ Description starts here, at  │   description below, flush with the icon's
│ the icon's left edge.        │   left edge — not indented under the heading
└──────────────────────────────┘
```

- Row: `flex items-center gap-3`. Heading `.t-h6` (or `.t-h5` for large cards), description `.t-body`.
- **One icon size per card group** (default: 40px tile, 20–22px glyph). All cards in a group share the same padding (default `p-5`), gap between cards (default `gap-4`), border, radius and icon size.
- No fixed or min heights; cards end where the content ends.
- Keep the existing colours, icons, borders and copy when changing layout. Only the layout changes.

## 5. Badges, chips and stat strips

- Text `.t-label` (15–16px), icon 16–20px, compact padding (`px-3 py-1.5` for a chip; `px-4 py-3` per item in a strip). Size the badge to its content.
- **Dividers between badge items:** 1px wide, about 55% of the item height, vertically centred, with 16px space each side, colour `var(--color-border)`. **Never full-height** dividers that touch the top and bottom edges.
- **Glassmorphism:** use `.glass-light` in the light theme and `.glass-dark` in the dark theme (switch on `useTheme()`). Glass only shows over an image or gradient — check it is clearly visible in **both** themes; if it isn't, adjust the panel, not by removing the effect.

## 6. Tables and lists

- Header: `tableHeaderClass()` from `src/components/shared/tableHeader.js` (one header style site-wide), text `.t-label`, weight 600.
- Cells: `.t-body`, names at weight 400.
- **Header and content start on the same x.** `<th>` and `<td>` in a column use the same horizontal padding and the same text-align. If cell content starts with an icon or image, the header text lines up with that icon's left edge. Check every column, not just the first.
- **Status / verdict cells** (Best, Safe, Watch, Avoid…): icon + text only, coloured with tokens. **No chevrons, no filled chips, no background boxes, no borders** around the word.
- **Image + text cells:** image on the left, code/name on the right, vertically centred (`flex items-center gap-3`). Same image size in every row.
- **Two-column splits:** the component divides items evenly (`Math.ceil(rows / 2)`), counting rendered rows (including sub-rows), not groups. The columns may differ by **one row at most**. Do not hard-code the split in JSON.
- Wide tables scroll inside their own `overflow-x-auto` wrapper on small screens; the page itself never scrolls sideways.

## 7. Buttons

- Class `.btn-cta` for primary actions. Text `.t-body` (16px), weight 600, padding `px-6 py-3`, `inline-flex items-center justify-center gap-2`, `whitespace-nowrap`.
- **The full label always fits** with comfortable padding at every width from 390 to 1920: no clipping, no overflow, no ellipsis. Width is `auto`; never give a button a fixed width that is narrower than its label. If a label is long, the layout makes room — the text does not shrink.
- Icon inside a button: 16–18px.

## 8. Responsive behaviour

- Breakpoints: phone <768, tablet 768–1023, desktop ≥1024. Desktop must hold at **every** width from 1280 to 1920, not only at 1536.
- Grids use fractions / `minmax()`, not fixed pixel column widths. Add `min-w-0` to grid and flex children so text wraps instead of pushing the layout wider.
- If columns get too tight (e.g. 3 columns at 1024–1279), drop a column (3→2) rather than squeezing content or shrinking text.
- Column alignment, spacing and structure must not break between breakpoints.

## 9. Images

- Car photos: prefer a **slightly angled (three-quarter front) view** over a straight-on front view; keep the angle consistent within a section.
- Product shots use `object-contain`, never stretched or cropped through the car.
- Engine images: the exact engine for that code, sharp, never upscaled.
- Use `next/image`; remote hosts must be allowed in `next.config.mjs`.

## 10. Colour and theme

- Every colour comes from a `var(--color-*)` token (`bg-[var(--color-surface)]`, `text-[var(--color-text-muted)]`). No hard-coded hex, except the table header helper.
- Every section is checked in **light and dark** themes (`data-theme` on `<html>`, set by `themeProvider.js`). Text, borders, glass and icons must stay readable in both.

## 11. What not to add

- No "/ SECTION N" labels.
- No decoration, animation or new visual style the client did not ask for.
- When fixing one thing, do not change content, colours or icons that were not part of the request.

---

## Definition of done (before saying "fixed")

1. Every feedback point is a numbered checklist item; each one is marked done with where it was fixed. No item is skipped silently.
2. Rule zero applied: the same pattern was searched for and fixed on every other page/section.
3. Screenshots at **1280, 1440, 1536, 1920** and **390** (phone), in **light and dark**.
4. Run `scripts/ui-audit.js` in the browser console at 1536 and 1280 on every page you changed. It must report no horizontal overflow, no misaligned containers, no desktop text below 15px and no clipped buttons.
5. `npm run lint` and `npm run build` pass.

## Feedback → rule map

| Client feedback | Rule |
|---|---|
| Sections use different widths / padding | §1 |
| Sections too big at 100% zoom; hero too tall | §1 no fixed heights, §2 |
| Font sizes too large / random 11, 13, 20, 25px | §3 |
| Model names bold | §3 font weight |
| Loose line height on multi-line headings (Market Intelligence "Replacement Cost Index") | §3 rule 5 |
| Badge glass not visible; full-height dividers; oversized badges | §5 |
| Icon beside heading, description underneath | §4 |
| Left/right tables unbalanced | §6 two-column splits |
| Verdict chevrons and filled chips | §6 status cells |
| WHY heading not aligned with its column | §6 header/content x |
| Engine image left, code right | §6 image + text cells |
| Layout breaks at 1280–1800px | §8 |
| Front-facing car image | §9 |
| Button text clipped, too bold | §7 |
| "Apply to every page, not just the homepage" | Rule zero |
