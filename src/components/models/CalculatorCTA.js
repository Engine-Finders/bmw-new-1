export default function CalculatorCTA({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.intro && <p>{data.intro}</p>}
      <ul>
        {data.paths?.map((path) => (
          <li key={path.label}>
            <a href={path.href}>{path.label}</a>
            {path.note ? ` (${path.note})` : ""}
          </li>
        ))}
      </ul>
      <hr />
    </section>
  );
}
