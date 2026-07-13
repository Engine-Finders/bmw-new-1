export default function EngineEvolution({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns?.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.eras?.map((row) => (
            <tr key={row.era}>
              <td>{row.era}</td>
              <td>{row.years}</td>
              <td>{row.keyEngines}</td>
              <td>{row.whyBmwChanged}</td>
              <td>{row.worthKnowing}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </section>
  );
}
