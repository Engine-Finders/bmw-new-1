export default function Overview({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.intro && <p>{data.intro}</p>}
      {data.keyFacts && <p>{data.keyFacts}</p>}
      {data.marketIntelligenceLine && <p>{data.marketIntelligenceLine}</p>}
      <hr />
    </section>
  );
}
