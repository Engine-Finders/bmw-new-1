export default function EngineCodes({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Engine Codes</h2>

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
            <tr key={row.engineCode}>
              <td>{row.engineCode}</td>
              <td>{row.years}</td>
              <td>{row.power}</td>
              <td>{row.enquiries}</td>
              <td>{row.avgReconCost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.matchNote && <p>{data.matchNote}</p>}

      {data.technicalSpecs && (
        <>
          <h3>{data.technicalSpecs.title}</h3>
          <ul>
            {data.technicalSpecs.items?.map((item) => (
              <li key={item.label}>
                {item.label}: {item.value}
              </li>
            ))}
          </ul>
        </>
      )}

      {data.cta && (
        <p>
          <a href={data.cta.href}>{data.cta.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
