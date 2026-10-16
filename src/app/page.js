import HomeSec1 from "@/components/home/HomeSec1";
import HomeSec2 from "@/components/home/HomeSec2";
import HomeSec3 from "@/components/home/HomeSec3";
import HomeSec4 from "@/components/home/HomeSec4";
import HomeSec5 from "@/components/home/HomeSec5";
import HomeSec6 from "@/components/home/HomeSec6";
import HomeSec7 from "@/components/home/HomeSec7";
import HomeSec8 from "@/components/home/HomeSec8";
import HomeSec9 from "@/components/home/HomeSec9";
import HomeSec10 from "@/components/home/HomeSec10";
import HomeSec11 from "@/components/home/HomeSec11";
import HomeSec12 from "@/components/home/HomeSec12";
import HomeSec13 from "@/components/home/HomeSec13";
import HomeSec14 from "@/components/home/HomeSec14";
import homeSec1Data from "@/data/home/homeSec1.json";
import homeSec2Data from "@/data/home/homeSec2.json";
import homeSec3Data from "@/data/home/homeSec3.json";
import homeSec4Data from "@/data/home/homeSec4.json";
import homeSec5Data from "@/data/home/homeSec5.json";
import homeSec6Data from "@/data/home/homeSec6.json";
import homeSec7Data from "@/data/home/homeSec7.json";
import homeSec8Data from "@/data/home/homeSec8.json";
import homeSec9Data from "@/data/home/homeSec9.json";
import homeSec10Data from "@/data/home/homeSec10.json";
import homeSec11Data from "@/data/home/homeSec11.json";
import homeSec12Data from "@/data/home/homeSec12.json";
import homeSec13Data from "@/data/home/homeSec13.json";
import homeSec14Data from "@/data/home/homeSec14.json";
import homeSchema from "@/data/home/homeSchema.json";
import { withHomeImages } from "@/components/shared/pageCarImages";
import carImages from "@/data/shared/carImages.json";

const DESCRIPTION =
  "The UK's Most Trusted BMW Ownership Guide. Reliability rankings, real failure data, honest repair-vs-replace economics for every BMW model ever sold in the UK. Powered by 24,650+ real UK enquiries.";

export function generateMetadata() {
  return {
    title: "BMW Engines UK — The Complete Ownership Guide",
    description: DESCRIPTION,
    alternates: {
      canonical: "https://bmwengines.uk/",
    },
    openGraph: {
      title: "BMW Engines UK — The Complete Ownership Guide",
      description: DESCRIPTION,
      url: "https://bmwengines.uk/",
      siteName: "BMWEngines.uk",
      locale: "en_GB",
      type: "website",
    },
  };
}

export default function Home() {
  // The hero car photos (light + dark theme) are already on screen, so sections below skip them.
  const sections = withHomeImages(
    {
      homeSec2: homeSec2Data,
      homeSec5: homeSec5Data,
      homeSec6: homeSec6Data,
      homeSec7: homeSec7Data,
      homeSec10: homeSec10Data,
      homeSec11: homeSec11Data,
    },
    carImages.homeHeroCars || []
  );

  // Sections follow the order of the BMW homepage content (sections 1-12; 12 is trust, FAQ and final CTA).
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <HomeSec1 data={homeSec1Data} />
      <HomeSec2 data={sections.homeSec2} />
      <HomeSec3 data={homeSec3Data} />
      <HomeSec4 data={homeSec4Data} />
      <HomeSec5 data={sections.homeSec5} />
      <HomeSec6 data={sections.homeSec6} />
      <HomeSec7 data={sections.homeSec7} />
      <HomeSec8 data={homeSec8Data} />
      <HomeSec9 data={homeSec9Data} />
      <HomeSec10 data={sections.homeSec10} />
      <HomeSec11 data={sections.homeSec11} />
      <HomeSec12 data={homeSec12Data} />
      <HomeSec13 data={homeSec13Data} />
      <HomeSec14 data={homeSec14Data} />
    </main>
  );
}
