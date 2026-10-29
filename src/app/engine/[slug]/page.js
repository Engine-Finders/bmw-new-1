import { notFound } from "next/navigation";
import pages from "@/data/registery/engines/pages.json";
import EngineHero from "@/components/engine/EngineHero";
import AtAGlance from "@/components/engine/AtAGlance";
import VerdictRating from "@/components/engine/VerdictRating";
import Compatibility from "@/components/engine/Compatibility";
import CostGuide from "@/components/engine/CostGuide";
import FAQAccordion from "@/components/engine/FAQAccordion";
import TrustCta from "@/components/engine/TrustCta";
import { enginePageImages } from "@/components/shared/pageCarImages";
import { engineCode, enquiriesFrom, glanceMap, modelsFittedOf, normHyphen, parseScore, parseYears, realignCompatibility } from "@/components/engine/engineText";
import { resolveSeoImage, sanitizeJsonLd } from "@/lib/seoAssets";

async function getPageData(dataFile) {
  try {
    const data = await import(`@/data/engines/${dataFile}.json`);
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
  const data = await getPageData(entry.dataFile);
  if (!data?.meta) return {};

  const { meta } = data;
  const canonical = meta.canonical || `https://bmwengines.uk/engine/${slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: meta.openGraph
      ? {
          title: meta.openGraph.title,
          description: meta.openGraph.description,
          type: meta.openGraph.type || "website",
          url: meta.openGraph.url,
          images: meta.openGraph.image ? [resolveSeoImage(meta.openGraph.image)] : undefined,
          siteName: meta.openGraph.siteName,
        }
      : undefined,
    twitter: meta.twitter
      ? {
          card: meta.twitter.card,
          title: meta.twitter.title,
          description: meta.twitter.description,
          images: meta.twitter.image ? [resolveSeoImage(meta.twitter.image)] : undefined,
        }
      : undefined,
  };
}

export default async function EnginePage({ params }) {
  const { slug } = await params;
  const entry = pages.find((page) => page.slug === slug);
  if (!entry) notFound();

  const data = await getPageData(entry.dataFile);
  if (!data) notFound();

  // At a Glance metric names normalised (8 pages spell "Cross‑Brand Fitment" with U+2011).
  const glanceRows = (data.atAGlance?.rows || []).map((row) => ({ ...row, metric: normHyphen(row.metric) }));
  const atAGlance = data.atAGlance ? { ...data.atAGlance, rows: glanceRows } : data.atAGlance;
  const glance = glanceMap(glanceRows);
  const engineLabel = glance["Engine Family"] || "BMW Engine";
  const yearsProduced = glance["Years Produced"] || "";
  const modelsFitted = modelsFittedOf(glance);
  const crossBrandFitment = glance["Cross-Brand Fitment"] || "";
  // "[Score]/100" pages fall back to the verdict breakdown's Total row ("76/100 (Sum of…)").
  const totalRow = (data.verdictRating?.scoreBreakdown?.rows || []).find((row) => /^total/i.test(row.dimension || ""));
  // Facts every section derives copy from (never hard-coded per engine).
  const facts = {
    engineLabel,
    code: engineCode(engineLabel),
    yearsProduced,
    years: parseYears(yearsProduced),
    modelsFitted,
    crossBrandFitment,
    fuel: glance.Fuel || "",
    configuration: glance["Configuration / Displacement"] || "",
    score: parseScore(glance["Overall Engine Score"]) ?? parseScore(totalRow?.score),
    enquiries: enquiriesFrom(data.hero),
  };
  const { engineImage, heroCar, compatibility } = enginePageImages(slug, engineLabel, realignCompatibility(data.compatibility));

  return (
    <main className="flex flex-col">
      {data.meta?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(sanitizeJsonLd(data.meta.jsonLd)),
          }}
        />
      )}
      <EngineHero data={data.hero} facts={facts} glanceRows={glanceRows} engineImage={engineImage} heroCar={heroCar} />
      <AtAGlance data={atAGlance} facts={facts} engineImage={engineImage} heroCar={heroCar} />
      <VerdictRating data={data.verdictRating} facts={facts} engineImage={engineImage} />
      <Compatibility
        data={compatibility}
        facts={facts}
        engineLabel={engineLabel}
        yearsProduced={yearsProduced}
        modelsFitted={modelsFitted}
        crossBrandFitment={crossBrandFitment}
        engineImage={engineImage}
        heroCar={heroCar}
      />
      <CostGuide data={data.costGuide} facts={facts} engineLabel={engineLabel} />
      <FAQAccordion data={data.faq} facts={facts} engineLabel={engineLabel} engineImage={engineImage} heroCar={heroCar} />
      <TrustCta data={data.trustCta} facts={facts} engineLabel={engineLabel} />
    </main>
  );
}
