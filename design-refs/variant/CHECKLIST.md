# Variant page — reference checklist

Reference page `/3-series/320d`. Built from the images in this folder (copied from `~/Downloads/uk/BMW (2)/BMW Variant/`).
Sizes follow `UI_RULES.md` §1–§3 (type scale, `.site-container`, `.section-y`); structure, order, colours, icons and weights follow the images.
Allowed differences everywhere: no "SECTION N" badges; type-scale px instead of mockup px.

Legend: DL = desktop light, DD = desktop dark, M = mobile (390). `[x]` done, `[~]` done with a noted deviation (see bottom).

## 1 Hero — `VariantHero.js` (Section 1.png top, Section 1-dark.png, Section 1.a-mobile.png, Section 1-mobile-dark.png)

1. [x] Full-bleed background: BMW arch + skyline (light), night arch (dark) — DL DD M
2. [x] Car stands on its own floor inside one hero picture, with reflection, arch and skyline (no floating cut-out) — DL DD M. `/3-series/320d` uses the reference artwork (`public/320d/hero_*.webp`, via `src/data/shared/variantHeroArt.json`); every other variant uses its generation's stage scene; 7 Series and the 2002 (no per-generation photos) use the model line-up scene
3. [x] Outlined blue pill "BMW 320d • 1998–present • 4 Engine Generations" — DL DD M
4. [x] H1: dark lead "BMW 320d Engine Replacement —" + blue "Compare Prices & Get Quotes" — DL DD M
5. [x] Paragraph (M47/N47/B47 links in text colour) — DL DD; M: beside the car
6. [x] 4 trust badges: wrench, green shield-check, truck, people; 2-line labels; short centred dividers — DL DD
7. [x] M: badges in a bordered card, 4 columns, icon above label
8. [x] Price anchor glass bar: tag icon, bold name + "— from £… to £…", "Common codes: …" — DL DD
9. [x] M: price anchor in a card, codes on the second line in blue
10. [x] Form card: UK flag + "GB" select with chevron, reg input, blue button "… Now →" — DL; DD: one panel with the price row above a rule
11. [x] M: select + input row, full-width button below
12. [x] Ticker band full width: green dot first, items separated by dots — DL DD
13. [x] M: ticker wraps inside a bordered card

## 1B Era Map — `EraMap.js` (Section 1.png from "Through Time", Section 1-dark.png, Section 1b-mobile.png)

1. [x] Navy rounded calendar tile + H2 "The 320d Through Time — Era Map" + subtitle — DL DD M
2. [x] Info note box (i icon) on the right — DL DD (hidden on M, as in the image)
3. [x] Navy header: Generation, Years, Engine Code, Reliability, Recon Cost (Guide), Era Note — DL DD
4. [x] Generation cell: blue code with the car image below — DL DD
5. [x] Engine code: codes semibold, bracketed detail regular — DL DD M
6. [x] Reliability: green (4+) / orange stars incl. half stars, caption, blue tag; F30 pre/post-facelift split by a divider — DL DD M
7. [x] Recon cost in blue, "(N47)/(B47)" small, blue tag — DL DD M
8. [x] Era note — DL DD; M below a divider
9. [x] "Why use this era map?" strip: shield circle, title + text, vertical divider, 4 icon+label items — DL DD M
10. [x] M: one card per generation (blue code pill, years, car | Engine Code | Reliability + Recon Cost), chevron toggles the era note, expanded by default
11. [x] 0 rows → section not rendered (42 pages)

## 2 Replacement Costs — `ReplacementCosts.js` (Section 2+3.png top, dark, Section 2-mobile.png)

1. [x] H2 from JSON — DL DD M
2. [x] Navy header: Engine Type, Supply Only, Fitted (Indie), Warranty, Best For — DL DD
3. [x] Engine type: filled blue circle (tag / gear / flask / star) + name — DL DD M
4. [x] Warranty: blue shield-check + text — DL DD
5. [x] Best For: light circle icon (car / scales / clock / shield) + text — DL DD
6. [x] Pale-blue info note (i icon) — DL DD M
7. [x] Labour card: wrench, bold "Labour estimate:" + text, 2-line blue button with arrow on its left — DL DD
8. [x] M: accordion (icon, name, best-for subtitle, chevron), 2nd row open by default, rows Supply / Fitted / Warranty / Best For with soft icons and right-aligned blue values
9. [x] M: labour card, then full-width button (arrow left, chevron right)

## 3 Common Problems — `CommonProblems.js` (Section 2+3.png middle, dark, section-3 Mobile.png top)

1. [x] H2 "Common Problems With BMW {variant} Engines" — DL DD M
2. [x] Cards 3 per row, balanced (4 → 2+2, 5 → 3+2, 6 → 3+3) — DL DD
3. [x] Coloured left border + coloured circle icon from the urgency (red / yellow / orange) — DL DD M
4. [x] Title "1. … (…)" — DL DD; M: name + bracketed detail on its own line
5. [x] Label rows with small outline icons: Symptoms, Typical Mileage, Repair Cost, Replacement Cost, Urgency (coloured dot) — DL DD M
6. [x] Bold "Our recommendation:" + paragraph — DL DD M
7. [x] Blue "Read the full … guide →" + path on the next line, pinned to the card bottom — DL DD M
8. [x] M: tab bar (icon + short name), active tab in the urgency colour with an underline, first tab active, one card at a time, icon tile beside every row

## 3B Ready to Compare — `QuotesCta.js` (Section 2+3.png bottom, dark, section-3 Mobile.png bottom)

1. [x] Rounded navy banner inside the container, night city background — DL DD M
2. [x] Car stands on its own floor inside the banner picture (no cut-out): `/3-series/320d` uses `public/320d/compare_*.webp`; every other variant its generation's stage scene (line-up scene for 7 Series / 2002) — DL DD M
3. [x] H2 "Ready to Compare?", subheading "Get Matched With a Vetted BMW Specialist →", paragraph — DL DD M
4. [x] Green button — DL DD; M full width

## 4 Repair, Buy or Replace — `RepairBuyOrReplace.js` (Section 4.png, dark derived, Section 4-mobile.png)

1. [x] H2 + 2-line paragraph — DL DD M
2. [~] Car (standing on its floor, fading in from the left) + engine on an angled panel top-right — DL DD; M car beside the intro
3. [x] Left panel: navy header "CAN IT BE REPAIRED?" with a wrench circle — DL DD M
4. [x] Columns Problem / Repairable? / Typical Cost / When It Makes Sense; navy filled circle icons in Problem — DL DD
5. [x] Repairable? icon + text only (green check Yes, red x Usually No, orange triangle Sometimes), cost coloured to match — DL DD M
6. [x] Right panel: navy header "BUYING THIS 320D? CHECK THESE FIRST" with a search icon — DL DD M
7. [x] BUY IF (green check, green heading, green bullets); AVOID IF (pale red, red x, red heading, red bullets) — DL DD M
8. [x] Closing card (pale blue): navy shield circle, "CLOSING VERDICT" blue caps + paragraph — DL DD M
9. [x] After a divider: tag icon in an outline circle, "Don't Guess. Compare." + text + blue button "Compare 320d engine prices before you buy →", engine with glow rings — DL DD; M: closing verdict and "Don't Guess" are two separate cards
10. [x] Trust strip: 5 items (icon + 2 lines), short dividers — DL DD M
11. [x] M: combined "Repairable? / Typical Cost" header, cards stacked as in Section 4-mobile.png

## 5 Buying Checklist — `BuyingChecklist.js` (Section 5+6 (c).png top, dark derived, Section 5-mobile.png)

1. [x] Light background with arch/skyline, car standing on its floor on the right (scene picture, fades into the page on the left and bottom) — DL DD M
2. [x] H2 "Buying Checklist" + intro — DL DD M
3. [x] 2 columns × 4 cards (1–4 left, 5–8 right); navy rounded tile with white glyph, bold "N. Title", description — DL DD
4. [x] Navy "Why this matters" card under the car (shield icon, white heading + text) — DL DD M
5. [x] M: intro left, car right; single column rows with tile, title, text and › chevron (visual only); navy card last

## 6 Engine Codes — `EngineCodes.js` (Section 5+6.png bottom, dark derived, Section 6-mobilee.png)

1. [x] H2 "ENGINE CODES" uppercase; subtitle with "Section 1B's Era Map" linking to `#era-map` — DL DD M
2. [x] Navy header: Engine Code, Years, Power, 2025 Enquiries, Avg. Recon Cost — DL DD
3. [x] Engine image left, blue code right — DL DD
4. [x] Enquiries "—" over "(pattern data)", or value + blue tag; cost + blue tag — DL DD M
5. [x] Right: "TECHNICAL SPECS" + blue caps generation label; rows icon + label | value with a vertical divider — DL DD M
6. [~] CTA card: outlined arrow circle, white heading, subline, faded engine background — DL DD M
7. [x] M: four tabs in one row (code + years), active tab navy-filled; card with the engine image beside the code and icon rows (right-aligned values); specs card; CTA card

## 7 Market Intelligence — `MarketIntelligence.js` (Section 7+8+9.png top, dark derived, Section 7+8-mobile.png top)

1. [x] H2 + subtitle — DL DD M
2. [x] 3×2 stat cards: navy circle icon, small label (+ bold highlight line), big blue value, caption, blue tag — DL DD; M 2 columns
3. [x] 6th card: Regional Demand list (region | %, dividers, tag), "Other Regions" = remainder — DL DD M
4. [~] "Regional Demand Breakdown" card: UK map in blue shades (largest share darkest), 4 callout bubbles with thin leader lines — DL DD M

## 8 FAQ — `FAQAccordion.js` (Section 7+8+9.png middle, dark derived, Section 7+8-mobile.png bottom)

1. [x] Bordered panel, H2, light "?" circle top-right — DL DD M
2. [x] Two balanced columns (max one item difference) — DL DD
3. [x] Bordered cards: navy numbered circle, bold question, chevron, answer below; open by default, chevrons toggle — DL DD
4. [x] Disclaimer box: i icon, bold "Disclaimer:" + text — DL DD; M filled navy i circle
5. [x] M: collapsed accordion rows with numbered circles, one open at a time

## 9 Trust + final CTA — `TrustCta.js` (Section 7+8+9.png bottom, dark derived, Section 9-mobile.png)

1. [x] H2 "Why UK BMW 320d Owners Trust BMWEngines.uk" + short two-tone blue underline — DL DD M
2. [x] 3 cards: blue filled circle (shield / scales / truck), title, text — DL DD M
3. [x] CTA banner: car on its own floor, nose pointing at the text (left, fading into the banner), heading + text + green button (centre), engine (right) — DL DD. The car picture is mirrored (number plate re-pasted so it still reads correctly): `public/320d/s9_*.webp`, `public/generation/stage-r/*`, `public/model/hero/*-scene-r.webp`
4. [x] M: heading/text/button left, car top right with the engine overlapping below it
5. [x] Trust row: 5 items (icon, bold label, caption), short dividers — DL DD
6. [x] M: trust row omitted (not in Section 9-mobile.png)

## Deviations (`[~]`)

- 1.2, 3B.2, 4.2, 5.1, 9.3: cars are never cut-outs on a separate background. `/3-series/320d` uses the client's artwork (`public/320d/hero_*`, `compare_*`; see `src/data/shared/variantHeroArt.json`); every other variant uses its generation's stage scene (car already standing on its floor, light + dark) or, for 7 Series and the 2002, the model line-up scene with the left cars faded out. Number plates are therefore each photo's own, not always "320d".
- 9.3: `public/320d/trust_*.webp` (client file) has a smeared car and plate, so it is not used; Section 9 composes the same scene picture with the variant's engine cut-out instead.
- 6: three alternate desktop layouts exist (`Section 5+6.png`, `(b)`, `(c)`). The built layout follows `Section 5+6.png` because `Section 6-mobilee.png` and the page copy ("Compare 320d engine prices for your BMW") match it; `(b)`/`(c)` use a specs strip and a "Need an engine for your 320d?" card instead.
- 4.2: there is no engine-bay photo asset; the angled panel shows the variant's engine cut-out on a navy panel.
- 6.6: the faded engine background uses the variant's engine cut-out (luminosity blend), not a dedicated engine-bay photo.
- 7.4: the repo has boundary data for England's regions only; Scotland, Wales and Northern Ireland are simplified outlines (`src/data/shared/ukDemandMap.json`, built once at design time). Shading ranks the named regions (1st darkest).
