export default function ReplacementCosts({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.subHeadline && <p>{data.subHeadline}</p>}

      {data.tables?.map((table) => (
        <div key={table.title}>
          <h3>{table.title}</h3>
          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                {table.columns?.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows?.map((row) => (
                <tr key={row.model}>
                  <td>{row.model}</td>
                  <td>{row.engineCode}</td>
                  <td>{row.usedSupply}</td>
                  <td>{row.reconditionedSupply}</td>
                  <td>{row.rebuiltSupply}</td>
                  <td>{row.labourHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {data.figuresNote && <p>{data.figuresNote}</p>}
      {data.labourEstimate && <p>{data.labourEstimate}</p>}

      {data.economicsBox && (
        <>
          <h3>{data.economicsBox.title}</h3>
          <p>{data.economicsBox.text}</p>
        </>
      )}
      <hr />
    </section>
  );
}
