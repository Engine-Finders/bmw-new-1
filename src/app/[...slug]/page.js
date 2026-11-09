import { notFound } from "next/navigation";
import modelPages from "@/data/registery/models/pages.json";
import genPages from "@/data/registery/generations/pages.json";
import variantPages from "@/data/registery/variants/pages.json";

import ModelHero from "@/components/models/ModelHero";
import OwnershipVerdict from "@/components/models/OwnershipVerdict";
import AtAGlance from "@/components/models/AtAGlance";
import GenerationsGrid from "@/components/models/GenerationsGrid";
import EngineDatabase from "@/components/models/EngineDatabase";
import CommonProblems from "@/components/models/CommonProblems";
import MarketIntelligence from "@/components/models/MarketIntelligence";
import ReplacementCosts from "@/components/models/ReplacementCosts";
import EngineEvolution from "@/components/models/EngineEvolution";
import WhoShouldBuy from "@/components/models/WhoShouldBuy";
import CalculatorCTA from "@/components/models/CalculatorCTA";
import TrustBlock from "@/components/models/TrustBlock";
import FAQAccordion from "@/components/models/FAQAccordion";
import ClosingActionCards from "@/components/models/ClosingActionCards";
import { withGenerationPageImages, withModelPageImages, withVariantPageImages } from "@/components/shared/pageCarImages";
import { withReferenceSections } from "@/components/models/referenceAdapter";
import { resolveSeoImage, sanitizeJsonLd } from "@/lib/seoAssets";

import GenHero from "@/components/generation/ModelHero";
import GenEngineDatabase from "@/components/generation/EngineDatabase";
import Overview from "@/components/generation/Overview";
import BestWorstEngines from "@/components/generation/BestWorstEngines";
import OwnershipEconomics from "@/components/generation/OwnershipEconomics";
import GenProblems from "@/components/generation/CommonProblems";
import GenReplacementCosts from "@/components/generation/ReplacementCosts";
import CoreVariantsMarketGroup from "@/components/generation/CoreVariantsMarketGroup";
import GenFAQAccordion from "@/components/generation/FAQAccordion";
import GenTrustCta from "@/components/generation/TrustCta";

import VariantHero from "@/components/variant/VariantHero";
import EraMap from "@/components/variant/EraMap";
import VarReplacementCosts from "@/components/variant/ReplacementCosts";
import VarProblems from "@/components/variant/CommonProblems";
import QuotesCta from "@/components/variant/QuotesCta";
import RepairBuyOrReplace from "@/components/variant/RepairBuyOrReplace";
import BuyingChecklist from "@/components/variant/BuyingChecklist";
import EngineCodes from "@/components/variant/EngineCodes";
import VarMarketIntelligence from "@/components/variant/MarketIntelligence";
import VarFAQAccordion from "@/components/variant/FAQAccordion";
import VarTrustCta from "@/components/variant/TrustCta";

async function getModelData(dataFile) {
  try {
    const data = await import(`@/data/models/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

async function getGenData(dataFile) {
  try {
    const data = await import(`@/data/generations/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

async function getVariantData(dataFile) {
  try {
    const data = await import(`@/data/variants/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

// Pull-quote car: the matched set of tight side-view cut-outs (as on the home page's "Find Your Vehicle"), so every
// model page's quote looks the same. Models not in the set fall back to their library side view.
const SIDE_CARS = {
  "1-series": "1-series", "2-series": "2-series", "3-series": "3-series", "4-series": "4-series", "5-series": "5-series",
  "6-series": "6-series", "7-series": "7-series", "8-series": "8-series", 2002: "2002", "i-series-electric-motors": "i-series",
  m1: "m1", m2: "m2", m4: "m4", m6: "m6", x1: "x1", x2: "x2", x3: "x3", x4: "x4", x5: "x5", x6: "x6", x7: "x7", xm: "xm",
  "z-series": "z-series",
};
// The 2002's side photo keeps its studio floor; its transparent "cut" version matches the rest of the set.
const SIDE_CAR_FILES = { 2002: "cut-2002" };
function sideCarFor(slug) {
  if (!SIDE_CARS[slug]) return null;
  return `/cars/home/fyv/${SIDE_CAR_FILES[slug] || `side-${SIDE_CARS[slug]}`}.webp`;
}

function findEntry(slugSegments) {
  if (slugSegments.length === 1) {
    const single = slugSegments[0];
    const model = modelPages.find((p) => p.slug === single);
    if (model) return { entry: model, type: "models" };
    notFound();
  }

  if (slugSegments.length === 2) {
    const [parent, child] = slugSegments;
    const gen = genPages.find((p) => p.parent === parent && p.slug === child);
    if (gen) return { entry: gen, type: "generations" };

    const variant = variantPages.find((p) => p.parent === parent && p.slug === child);
    if (variant) return { entry: variant, type: "variants" };

    notFound();
  }

  notFound();
}

export async function generateStaticParams() {
  const paths = [];

  for (const page of modelPages) {
    if (!page?.slug) continue;
    paths.push({ slug: [page.slug] });
  }

  for (const page of genPages) {
    if (!page?.parent || !page?.slug) continue;
    paths.push({ slug: [page.parent, page.slug] });
  }

  for (const page of variantPages) {
    if (!page?.parent || !page?.slug) continue;
    paths.push({ slug: [page.parent, page.slug] });
  }

  return paths;
}

export async function generateMetadata({ params }) {
  const { slug: slugSegments } = await params;
  const result = findEntry(slugSegments);
  if (!result) return {};

  const { entry, type } = result;

  let data;
  if (type === "models") data = await getModelData(entry.dataFile);
  else if (type === "generations") data = await getGenData(entry.dataFile);
  else if (type === "variants") data = await getVariantData(entry.dataFile);

  if (!data?.meta) return {};

  const { meta } = data;
  const og = meta.openGraph;
  const hasOg = og && (og.title || og.description || og.url || og.image || og.siteName || og.type);
  const canonical = meta.canonical || `https://bmwengines.uk/${slugSegments.join("/")}`;

  const ogImage = og?.image ? resolveSeoImage(og.image) : undefined;
  const twitterImage = meta.twitter?.image ? resolveSeoImage(meta.twitter.image) : undefined;

  return {
    title: meta.title || undefined,
    description: meta.description || undefined,
    alternates: { canonical },
    openGraph: hasOg
      ? {
          title: og.title || undefined,
          description: og.description || undefined,
          type: og.type || "website",
          url: og.url || undefined,
          images: ogImage ? [ogImage] : undefined,
          siteName: og.siteName || undefined,
        }
      : undefined,
    twitter: meta.twitter?.title || meta.twitter?.description
      ? {
          card: meta.twitter.card || undefined,
          title: meta.twitter.title || undefined,
          description: meta.twitter.description || undefined,
          images: twitterImage ? [twitterImage] : undefined,
        }
      : undefined,
  };
}

export default async function CatchAllPage({ params }) {
  const { slug: slugSegments } = await params;
  const result = findEntry(slugSegments);

  const { entry, type } = result;

  let data;
  if (type === "models") data = await getModelData(entry.dataFile);
  else if (type === "generations") data = await getGenData(entry.dataFile);
  else if (type === "variants") data = await getVariantData(entry.dataFile);

  if (!data) notFound();

  if (type === "models") {
    // Every model page gets the 3 Series section designs, built from its own content.
    data = withReferenceSections(withModelPageImages(data));
    return (
      <main className="flex flex-col">
        {data.meta?.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sanitizeJsonLd(data.meta.jsonLd)) }}
          />
        )}
        <ModelHero data={data.hero} />
        <OwnershipVerdict data={data.ownershipVerdict} />
        <AtAGlance data={data.atAGlance} />
        <GenerationsGrid data={data.generations} />
        <EngineDatabase data={data.engineDatabase} />
        <CommonProblems data={data.commonProblems} />
        <MarketIntelligence data={data.marketIntelligence} quoteData={data.editorialPullQuote && { ...data.editorialPullQuote, sideCar: sideCarFor(entry.slug) }} />
        <ReplacementCosts data={data.replacementCosts} />
        <EngineEvolution data={data.engineEvolution} />
        <WhoShouldBuy data={data.whoShouldBuy && { ...data.whoShouldBuy, sideCar: sideCarFor(entry.slug) }} />
        <CalculatorCTA data={data.calculatorCta} />
        <TrustBlock data={data.trustBlock} />
        <FAQAccordion data={data.faq} />
        <ClosingActionCards data={data.closingActionCards} />
      </main>
    );
  }

  if (type === "generations") {
    data = withGenerationPageImages(data);
    // Sections alternate plain / tinted bands (as on the variant and engine pages). Only sections that render
    // are counted, so two neighbours never share a colour when a page leaves one out.
    // Mirrors each section's own "render nothing" rule (Best & Worst drops empty items, FAQ needs a question, the
    // variants/market block needs core variants or market data).
    const present = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(value));
    const hasText = (value) => Boolean(String(value ?? "").replace(/<[^>]+>/g, "").trim());
    const sections = [
      ["engineDatabase", present(data.engineDatabase)],
      ["overview", present(data.overview)],
      ["bestWorst", Boolean(data.bestWorstEngines?.items?.some((item) => item && [item.slot, item.engine, item.quote, item.whoItsFor].some(hasText)))],
      ["ownership", present(data.ownershipEconomics)],
      ["problems", present(data.commonProblems)],
      ["costs", present(data.replacementCosts)],
      [
        "variantsMarket",
        present(data.coreVariants) ||
          Boolean(["mostRequestedEngines", "mostRequestedVariants", "mostCommonFailures", "liveFeed"].some((key) => present(data.marketIntelligence?.[key])) || data.marketIntelligence?.averageReplacementCost),
      ],
      ["faq", Boolean(data.faq?.items?.some((item) => hasText(item?.question)))],
      ["trust", present(data.trustCta)],
    ];
    const band = {};
    sections.filter(([, shown]) => shown).forEach(([key], index) => {
      band[key] = index % 2 === 0 ? "tint" : "plain"; // the hero is near-white, so the band after it starts tinted
    });
    // "BMW 3 Series E90 Engine Codes …" -> "E90", for "Most Requested E90 Engines" and "FAQ - BMW E90".
    const generationCode = (String(data.engineDatabase?.h2 || "").match(/^BMW .*?\s(\S+)\s+(?:Engine|Powertrain) Codes/) || [])[1] || "";
    return (
      <main className="flex flex-col overflow-x-hidden">
        {data.meta?.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sanitizeJsonLd(data.meta.jsonLd)) }}
          />
        )}
        <GenHero data={data.hero} />
        <GenEngineDatabase data={data.engineDatabase} band={band.engineDatabase} />
        <Overview data={data.overview} band={band.overview} />
        <BestWorstEngines data={data.bestWorstEngines && { generationCode: entry.slug, ...data.bestWorstEngines }} band={band.bestWorst} />
        <OwnershipEconomics data={data.ownershipEconomics} band={band.ownership} />
        <GenProblems data={data.commonProblems} band={band.problems} />
        <GenReplacementCosts data={data.replacementCosts} band={band.costs} />
        <CoreVariantsMarketGroup
          coreVariants={data.coreVariants}
          marketIntelligence={data.marketIntelligence}
          band={band.variantsMarket}
          generationCode={generationCode}
        />
        <GenFAQAccordion data={data.faq} band={band.faq} generationCode={generationCode} />
        <GenTrustCta data={data.trustCta} band={band.trust} />
      </main>
    );
  }

  if (type === "variants") {
    data = withVariantPageImages(data, entry.parent, entry.slug);
    return (
      // Long engine codes and data tags break inside their cell instead of pushing it wider.
      <main className="flex flex-col overflow-x-hidden [overflow-wrap:break-word]">
        {data.meta?.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sanitizeJsonLd(data.meta.jsonLd)) }}
          />
        )}
        <VariantHero data={data.hero} />
        <EraMap data={data.eraMap} />
        <VarReplacementCosts data={data.replacementCosts} vehicle={data.hero?.vehicle} />
        <VarProblems data={data.commonProblems} vehicle={data.hero?.vehicle} />
        <QuotesCta data={data.quotesCta} />
        <RepairBuyOrReplace data={data.repairBuyOrReplace} vehicle={data.hero?.vehicle} />
        <BuyingChecklist data={data.buyingChecklist} vehicle={data.hero?.vehicle} />
        <EngineCodes data={data.engineCodes} vehicle={data.hero?.vehicle} />
        <VarMarketIntelligence data={data.marketIntelligence} vehicle={data.hero?.vehicle} />
        <VarFAQAccordion data={data.faq} vehicle={data.hero?.vehicle} />
        <VarTrustCta data={data.trustCta} vehicle={data.hero?.vehicle} />
      </main>
    );
  }

  notFound();
}
