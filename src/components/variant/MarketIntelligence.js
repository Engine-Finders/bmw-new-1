export default function MarketIntelligence({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Market Intelligence</h2>
      {data.items?.length > 0 && (
        <ul>
          {data.items.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      )}
      <hr />
    </section>
  );
}
