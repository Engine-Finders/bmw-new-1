export default function BuyingChecklist({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Buying Checklist</h2>
      {data.intro && <p>{data.intro}</p>}
      {data.items?.length > 0 && (
        <ul>
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <hr />
    </section>
  );
}
