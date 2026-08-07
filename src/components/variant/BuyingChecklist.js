export default function BuyingChecklist({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Buying Checklist</h2>
      {data.intro && <p dangerouslySetInnerHTML={{ __html: data.intro }} />}
      {data.items?.length > 0 && (
        <ul>
          {data.items.map((item) => (
            <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
      <hr />
    </section>
  );
}
