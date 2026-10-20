import {
  carKeyFor,
  carModelFor,
  createCarPicker,
  engineImageFor,
  generationHeroFor,
  heroCarFor,
  modelEngineImage,
} from "@/components/shared/carImage";
import carImages from "@/data/shared/carImages.json";

// Server-side: give every car slot on a page its own photo before the page renders, so
// the same picture never shows twice on one page and colours vary from row to row.
// Sections are filled in page order; components keep `image` when it is set.

function stripTags(text = "") {
  return String(text ?? "").replace(/<[^>]*>/g, " ");
}

function assign(items, pick, hintsFor, options) {
  if (!items?.length) return items;
  const images = pick(items.map(hintsFor), options);
  return items.map((item, index) => ({ ...item, image: images[index] || null }));
}

// Model key for a model page: from the hero pill ("BMW 3 Series • 1975–Present • ..."), else the H1.
function modelOfPage(data) {
  const pill = stripTags(data.hero?.tagPill).split("•")[0];
  return carModelFor(pill) || carModelFor(stripTags(data.hero?.h1));
}

/** Model page (/3-series, /x5, ...): hero scene, then each section's car photos. */
export function withModelPageImages(data) {
  if (!data) return data;
  const model = modelOfPage(data);
  const hero = model ? heroCarFor(model) : null;
  const pick = createCarPicker(hero?.cars || []);
  const out = { ...data };

  if (out.hero) {
    out.hero = {
      ...out.hero,
      model,
      heroCar: hero?.src ? { src: hero.src, width: hero.width, height: hero.height } : null,
      // The bright line-up backdrop made for the model hero when there is one, else the scene;
      // the light theme gets its hazier version (pale sky and skyline, cars at full colour).
      heroScene: hero?.backdrop || hero?.scene || null,
      heroSceneLight: hero?.backdropLight || null,
    };
  }

  // Sections are about this model: hints carry the model name so "F30" alone resolves.
  const modelName = model ? model.replace("-", " ") : "";

  if (out.ownershipVerdict) {
    const [image] = pick([[modelName, stripTags(out.ownershipVerdict.h2)]]);
    out.ownershipVerdict = { ...out.ownershipVerdict, image };
  }

  if (out.generations?.cards) {
    out.generations = {
      ...out.generations,
      cards: assign(out.generations.cards, pick, (card) => [modelName, stripTags(card.title), stripTags(card.years)]),
    };
  }

  if (out.editorialPullQuote) {
    const quote = out.editorialPullQuote;
    const [image] = pick([[modelName, stripTags(quote.title), stripTags(quote.quote)]], { view: "side" });
    out.editorialPullQuote = { ...quote, image };
  }

  if (out.replacementCosts?.tables) {
    out.replacementCosts = {
      ...out.replacementCosts,
      tables: assign(out.replacementCosts.tables, pick, (table) => [modelName, stripTags(table.title)]),
    };
  }

  if (out.engineEvolution?.eras) {
    out.engineEvolution = {
      ...out.engineEvolution,
      eras: assign(out.engineEvolution.eras, pick, (era) => [modelName, stripTags(era.era), stripTags(era.years)]),
    };
  }

  if (out.whoShouldBuy?.profiles) {
    out.whoShouldBuy = {
      ...out.whoShouldBuy,
      profiles: assign(out.whoShouldBuy.profiles, pick, (row) => [modelName, stripTags(row.verdict)]),
    };
  }

  if (out.calculatorCta) {
    const [image] = pick([[modelName, stripTags(out.calculatorCta.h2)]]);
    out.calculatorCta = { ...out.calculatorCta, image };
  }

  if (out.closingActionCards) {
    out.closingActionCards = {
      ...out.closingActionCards,
      // Transparent line-up of the model's generations; the line-up photo only when there is none.
      heroCar: hero?.lineup ? { ...hero.lineup, cutout: true } : hero?.card || null,
      engineImage: modelEngineImage(model),
    };
  }

  return out;
}

// Hero for a generation or variant page: that generation's car standing in BMW's own scene
// (light and dark), or, when there is no photo of it, the client's line-up scene for the model.
// `used` is the pool photo it shows, so the rest of the page avoids it.
function generationHero(key, model) {
  const photo = generationHeroFor(key);
  if (photo) return { heroScene: photo.scene, used: [photo.car] };
  return { heroScene: heroCarFor(model)?.scene || null, used: [] };
}

// First engine photo matching any of the texts (engine codes, titles), or null when none does.
function firstEngineImage(...texts) {
  for (const text of texts) {
    const image = text ? engineImageFor(stripTags(text)) : null;
    if (image) return image;
  }
  return null;
}

// Model key of a generation/variant page's parent model, from the page's hint text.
function parentModel(hints) {
  const model = carModelFor(...hints);
  if (model) return model;
  const key = carKeyFor(...hints);
  return key ? key.split("|")[0] : null;
}

/** Generation page (/3-series/f30, ...): that generation's photos, none shown twice. */
export function withGenerationPageImages(data) {
  if (!data) return data;
  const hints = [stripTags(data.hero?.tagPill), stripTags(data.hero?.h1)];
  const key = carKeyFor(...hints);
  const model = parentModel(hints);
  const { used, ...hero } = generationHero(key, model);
  const pick = createCarPicker(used, { siblings: true });
  const out = { ...data };

  if (out.hero) out.hero = { ...out.hero, ...hero };

  if (out.overview) {
    const [image] = pick([hints]);
    out.overview = { ...out.overview, image };
  }

  if (out.coreVariants) {
    const [image] = pick([hints], { view: "side" });
    out.coreVariants = { ...out.coreVariants, image };
  }

  // Engine photo per problem card: the engine it names, else this generation's engine of the same size
  // ("3.0 diesel ..." -> its 3.0 engine), else the generation's first engine. Non-engine problems get none.
  if (out.commonProblems?.problems) {
    const engines = (out.engineDatabase?.engines || []).map((row) => {
      const text = `${row.engineCode} ${row.family}`;
      return {
        photo: firstEngineImage(text),
        size: String(row.displacement || row.family || "").match(/\d\.\d/)?.[0],
      };
    });
    const engineImageForProblem = (problem) => {
      const text = stripTags(`${problem.title} ${problem.affectedModels}`);
      if (/non[\s-]?engine/i.test(text)) return null;
      const named = firstEngineImage(text);
      if (named) return named;
      const sameSize = engines.filter((engine) => engine.size && text.includes(engine.size));
      if (sameSize.length) return sameSize.find((engine) => engine.photo)?.photo || null;
      return engines.find((engine) => engine.photo)?.photo || null;
    };
    out.commonProblems = {
      ...out.commonProblems,
      problems: out.commonProblems.problems.map((problem) => ({ ...problem, image: engineImageForProblem(problem) })),
    };
  }

  // Closing block: the model's line-up scene (unless the hero already shows it).
  if (out.trustCta) {
    const scene = heroCarFor(model)?.scene;
    out.trustCta = { ...out.trustCta, image: scene && scene !== hero.heroScene ? scene.src : null };
  }

  return out;
}

/** Variant page (/3-series/320d, ...): hero, era map and banners get photos of that car, none shown twice. */
export function withVariantPageImages(data, parentSlug = "") {
  if (!data) return data;
  const pill = stripTags(data.hero?.tagPill);
  const firstEra = data.eraMap?.rows?.[0] || {};
  const parent = parentSlug.replace(/-/g, " ");
  // The newest era is the car most people own today; the hero shows that generation.
  const lastEra = data.eraMap?.rows?.filter((row) => /\b[efgu]\d{2}\b/i.test(stripTags(row.generation))).at(-1) || firstEra;
  const hints = [pill.split("•")[0], parent, stripTags(lastEra.generation), stripTags(lastEra.years)];
  const key = carKeyFor(...hints);
  const model = parentModel([pill.split("•")[0], parent]);
  const { used, ...hero } = generationHero(key, model);
  const pick = createCarPicker(used, { siblings: true });
  // "BMW 320d • 1998–present • ..." -> "320d", for copy such as "Every 320d has a story".
  const vehicle = pill.split("•")[0].replace(/^\s*BMW\s+/i, "").trim() || "BMW";
  const engineCodes = (data.engineCodes?.rows || []).map((row) => row.engineCode);
  const eraEngines = (data.eraMap?.rows || []).map((row) => row.engineCode);
  const engineImage = firstEngineImage(pill, ...engineCodes, ...eraEngines);
  const out = { ...data };

  if (out.hero) out.hero = { ...out.hero, ...hero, vehicle };

  if (out.eraMap?.rows) {
    const images = pick(out.eraMap.rows.map((row) => [pill.split("•")[0], parent, stripTags(row.generation), stripTags(row.years)]));
    out.eraMap = { ...out.eraMap, vehicle, rows: out.eraMap.rows.map((row, index) => ({ ...row, image: images[index] })) };
  }

  if (out.quotesCta) {
    const [image] = pick([hints]);
    out.quotesCta = { ...out.quotesCta, image, vehicle };
  }

  if (out.repairBuyOrReplace) {
    const [image] = pick([hints], { view: "side" });
    out.repairBuyOrReplace = { ...out.repairBuyOrReplace, image, engineImage, vehicle };
  }

  if (out.buyingChecklist) {
    const [image] = pick([hints]);
    out.buyingChecklist = { ...out.buyingChecklist, image, vehicle };
  }

  if (out.engineCodes?.rows) {
    out.engineCodes = {
      ...out.engineCodes,
      engineImage,
      rows: out.engineCodes.rows.map((row) => ({ ...row, image: firstEngineImage(row.engineCode) || engineImage })),
    };
  }

  if (out.trustCta) {
    const [image] = pick([hints]);
    out.trustCta = { ...out.trustCta, image, engineImage, vehicle };
  }

  return out;
}

/**
 * Engine page (/engine/n47, ...): that engine's photo for every engine slot, or null when there is
 * none (older engines such as the M20 or S14); the hero then shows the car the engine is best known in.
 * Compatible models get a car photo each, none shown twice: `cardImage` for the desktop card of
 * the row's model, `image` for the row in the mobile list (only one of the two lists shows).
 */
export function enginePageImages(slug, engineLabel, compatibility) {
  const page = carImages.enginePages[slug];
  const engineImage = page?.engine ? carImages.engines[page.engine] || null : firstEngineImage(engineLabel);
  const car = !engineImage && page?.car ? generationHeroFor(page.car) : null;
  const heroCar = car ? { src: car.src, width: car.width, height: car.height } : null;
  if (!compatibility?.rows) return { engineImage, heroCar, compatibility };

  const used = car ? [car.car] : [];
  const rows = compatibility.rows;
  const modelOf = (row) => stripTags(row.model).replace(/[‐-―]/g, "-").replace(/\s+/g, " ").trim();
  // Desktop cards: one per model, pictured by the last generation listed for it (as the card shows).
  const models = [...new Set(rows.map(modelOf))];
  const lastRow = (model) => rows.filter((row) => modelOf(row) === model).at(-1);
  const cardPhotos = createCarPicker(used, { siblings: true })(models.map((model) => [model, stripTags(lastRow(model).generation)]));
  const cardImage = Object.fromEntries(models.map((model, index) => [model, cardPhotos[index]]));
  const rowPhotos = createCarPicker(used, { siblings: true })(
    rows.map((row) => [stripTags(row.model), stripTags(row.generation), stripTags(row.years)])
  );

  return {
    engineImage,
    heroCar,
    compatibility: {
      ...compatibility,
      rows: rows.map((row, index) => ({ ...row, image: rowPhotos[index], cardImage: cardImage[modelOf(row)] })),
    },
  };
}

/** Home page: every section with car or engine photos, in page order, after the hero car. */
export function withHomeImages(sections, heroCars = []) {
  const pick = createCarPicker(heroCars);
  const out = { ...sections };

  const sec2 = out.homeSec2;
  if (sec2?.categories) {
    const all = sec2.categories.flatMap((category) => category.models || []);
    const name = (item) => (typeof item.model === "string" ? item.model : (item.model || []).map((m) => m.name).join(" "));
    // Model name only, so each card shows the current generation of that model.
    const images = pick(all.map((item) => [name(item)]));
    let index = 0;
    out.homeSec2 = {
      ...sec2,
      categories: sec2.categories.map((category) => ({
        ...category,
        models: (category.models || []).map((item) => ({ ...item, photo: item.photo || images[index++] || sceneFor(name(item)) })),
      })),
    };
  }

  const sec5 = out.homeSec5;
  if (sec5?.comparisons) {
    // Engines get engine photos; the rest are BMWs with different colours on each side of a card.
    const sidesOf = (item) => item.sides || [item.left || {}, item.right || {}];
    const sides = sec5.comparisons.flatMap(sidesOf);
    const engineText = (side) => `${side.label || ""} ${side.hint || ""}`;
    const special = sides.map((side) => (/\b[bnms]\d{2}\b/i.test(engineText(side)) ? engineImageFor(engineText(side)) : null));
    const carSlots = sides.map((side, index) => (special[index] ? null : [side.label, side.hint || ""]));
    const picked = pick(carSlots.filter(Boolean));
    let next = 0;
    const images = carSlots.map((slot, index) => special[index] || (slot ? picked[next++] : null));
    let cursor = 0;
    out.homeSec5 = {
      ...sec5,
      comparisons: sec5.comparisons.map((item) => {
        const withPhotos = sidesOf(item).map((side) => ({ ...side, photo: images[cursor++] }));
        return item.sides
          ? { ...item, sides: withPhotos }
          : { ...item, left: withPhotos[0], right: withPhotos[1] };
      }),
    };
  }

  const sec6 = out.homeSec6;
  if (sec6?.matrix?.rows) {
    out.homeSec6 = {
      ...sec6,
      matrix: { ...sec6.matrix, rows: assignPhotos(sec6.matrix.rows, pick, (row) => [stripTags(row.model)]) },
    };
  }

  // Engine families: each engine's own photo, else the car it is best known in.
  const sec7 = out.homeSec7;
  if (sec7?.engines?.rows) {
    out.homeSec7 = {
      ...sec7,
      engines: {
        ...sec7.engines,
        rows: sec7.engines.rows.map((row) => ({ ...row, photo: engineImageFor(stripTags(row.engine)) || carImageForEngine(row.engine, pick) })),
      },
    };
  }

  // Live enquiry feed: side views, so it reads differently from the 45-degree tables above.
  const sec10 = out.homeSec10;
  if (sec10?.liveFeed?.rows) {
    out.homeSec10 = {
      ...sec10,
      liveFeed: { ...sec10.liveFeed, rows: assignPhotos(sec10.liveFeed.rows, pick, (row) => [row.vehicle], { view: "side" }) },
    };
  }

  const sec11 = out.homeSec11;
  if (sec11?.eras) {
    const images = pick(sec11.eras.map((era) => [era.photoHint || ""]));
    out.homeSec11 = {
      ...sec11,
      eras: sec11.eras.map((era, index) => ({ ...era, photo: images[index] || sceneFor(era.photoHint) })),
    };
  }

  return out;
}

function carImageForEngine(engine, pick) {
  const [photo] = pick([[stripTags(engine)]]);
  return photo || null;
}

// Models with no photo of their own (7 Series, i Series, XM, 2002) use the client's line-up scene.
function sceneFor(name = "") {
  const model = carModelFor(name) || (/\b7[\s-]?series\b/i.test(name) ? "7-series" : null);
  return heroCarFor(model)?.card?.src || null;
}

function assignPhotos(rows, pick, hintsFor, options) {
  const images = pick(rows.map(hintsFor), options);
  return rows.map((row, index) => ({ ...row, photo: images[index] || null }));
}
