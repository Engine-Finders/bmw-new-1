export default function CostGuide({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Cost Guide</h2>
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
            <tr key={row.condition}>
              <td>{row.condition}</td>
              <td>{row.supplyOnly}</td>
              <td>{row.fittedIndie}</td>
              <td>{row.warranty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.labourEstimate && <p>{data.labourEstimate}</p>}
      {data.sharedCostNote && <p>{data.sharedCostNote}</p>}
      {data.cta && (
        <p>
          <a href={data.cta.href}>{data.cta.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
