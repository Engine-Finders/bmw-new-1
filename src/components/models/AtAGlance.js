export default function AtAGlance({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.rows?.map((row) => (
            <tr key={row.metric}>
              <td>{row.metric}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </section>
  );
}
