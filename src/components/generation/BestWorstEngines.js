export default function BestWorstEngines({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Best & Worst Engines</h2>
      {data.items?.map((item) => (
        <div key={item.slot}>
          <h3>{item.slot}</h3>
          <p>
            <strong>{item.engine}</strong>
          </p>
          <p>{item.quote}</p>
          {item.whoItsFor && <p>Who it&apos;s for: {item.whoItsFor}</p>}
          {item.modelWideNote && <p>{item.modelWideNote}</p>}
          {item.checkBFlag && <p>Check B flag: true</p>}
        </div>
      ))}
      <hr />
    </section>
  );
}
