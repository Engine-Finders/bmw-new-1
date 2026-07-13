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
            <tr key={`${row.variant}-${row.engineCode}`}>
              <td>{row.variant}</td>
              <td>{row.engineCode}</td>
              <td>{row.usedSupply}</td>
              <td>{row.reconditionedSupply}</td>
              <td>{row.rebuiltSupply}</td>
              <td>{row.labourHours}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.note && <p>{data.note}</p>}
      <hr />
    </section>
  );
}
