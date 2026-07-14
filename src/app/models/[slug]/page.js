import { notFound } from "next/navigation";
import pages from "@/data/registery/models/pages.json";
import ModelHero from "@/components/models/ModelHero";
import OwnershipVerdict from "@/components/models/OwnershipVerdict";
import AtAGlance from "@/components/models/AtAGlance";
import GenerationsGrid from "@/components/models/GenerationsGrid";
import EngineDatabase from "@/components/models/EngineDatabase";
import CommonProblems from "@/components/models/CommonProblems";
import MarketIntelligence from "@/components/models/MarketIntelligence";
import EditorialPullQuote from "@/components/models/EditorialPullQuote";
import ReplacementCosts from "@/components/models/ReplacementCosts";
import EngineEvolution from "@/components/models/EngineEvolution";
import WhoShouldBuy from "@/components/models/WhoShouldBuy";
import CalculatorCTA from "@/components/models/CalculatorCTA";
import TrustBlock from "@/components/models/TrustBlock";
import FAQAccordion from "@/components/models/FAQAccordion";
import ClosingActionCards from "@/components/models/ClosingActionCards";

async function getPageData(type, dataFile) {
  try {
    const data = await import(`@/data/${type}/${dataFile}.json`);
    return data.default;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) return {};
  const data = await getPageData(entry.type, entry.dataFile);
  if (!data?.meta) return {};

  const { meta } = data;
  const og = meta.openGraph;
  const hasOg =
    og &&
    (og.title || og.description || og.url || og.image || og.siteName || og.type);

  return {
    title: meta.title || undefined,
    description: meta.description || undefined,
    openGraph: hasOg
      ? {
          title: og.title || undefined,
          description: og.description || undefined,
          type: og.type || "website",
          url: og.url || undefined,
          images: og.image ? [og.image] : undefined,
          siteName: og.siteName || undefined,
        }
      : undefined,
    twitter: meta.twitter?.title || meta.twitter?.description
      ? {
          card: meta.twitter.card || undefined,
          title: meta.twitter.title || undefined,
          description: meta.twitter.description || undefined,
        }
      : undefined,
  };
}

export default async function ModelPage({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) notFound();

  const data = await getPageData(entry.type, entry.dataFile);
  if (!data) notFound();

  return (
    <main
      style={{
        padding: "24px 16px 64px",
        maxWidth: 900,
        margin: "0 auto",
        lineHeight: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {data.meta?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.meta.jsonLd),
          }}
        />
      )}
      <ModelHero data={data.hero} />
      <OwnershipVerdict data={data.ownershipVerdict} />
      <AtAGlance data={data.atAGlance} />
      <GenerationsGrid data={data.generations} />
      <EngineDatabase data={data.engineDatabase} />
      <CommonProblems data={data.commonProblems} />
      <MarketIntelligence data={data.marketIntelligence} />
      <EditorialPullQuote data={data.editorialPullQuote} />
      <ReplacementCosts data={data.replacementCosts} />
      <EngineEvolution data={data.engineEvolution} />
      <WhoShouldBuy data={data.whoShouldBuy} />
      <CalculatorCTA data={data.calculatorCta} />
      <TrustBlock data={data.trustBlock} />
      <FAQAccordion data={data.faq} />
      <ClosingActionCards data={data.closingActionCards} />
    </main>
  );
}
