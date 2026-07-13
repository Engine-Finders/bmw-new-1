export default function ReplacementCosts({ data }) {
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
          {data.rows?.map((row) => (
            <tr key={row.engineType}>
              <td>{row.engineType}</td>
              <td>{row.supplyOnly}</td>
              <td>{row.fittedIndie}</td>
              <td>{row.warranty}</td>
              <td>{row.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.figuresNote && <p>{data.figuresNote}</p>}
      {data.labourEstimate && <p>{data.labourEstimate}</p>}
      {data.cta && (
        <p>
          <a href={data.cta.href}>{data.cta.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
