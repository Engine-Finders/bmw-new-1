export default function CalculatorCTA({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.intro && <p dangerouslySetInnerHTML={{ __html: data.intro }} />}
      <ul>
        {data.paths?.map((path) => (
          <li key={path.label}>
            <a href={path.href}>{path.label}</a>
            {path.note ? <span dangerouslySetInnerHTML={{ __html: ` (${path.note})` }} /> : ""}
          </li>
        ))}
      </ul>
      <hr />
    </section>
  );
}
