export default function Compatibility({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Compatibility</h2>
      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns?.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows?.map((row) => (
            <tr key={`${row.model}-${row.generation}`}>
              <td>{row.model}</td>
              <td>{row.generation}</td>
              <td>{row.variantBadge}</td>
              <td>{row.years}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.crossBrandNote && <p>{data.crossBrandNote}</p>}
      <hr />
    </section>
  );
}
