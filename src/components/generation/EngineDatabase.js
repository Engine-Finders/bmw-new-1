export default function EngineDatabase({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.subHeadline && <p>{data.subHeadline}</p>}

      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns?.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.engines?.map((row) => (
            <tr key={row.engineCode}>
              <td>{row.engineCode}</td>
              <td>{row.family}</td>
              <td>{row.fuel}</td>
              <td>{row.displacement}</td>
              <td>{row.power}</td>
              <td>{row.years}</td>
              <td>{row.variants}</td>
              <td>{row.reliability}</td>
              <td>{row.enquiries}</td>
              <td>{row.avgReconCost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.dataCorrections?.length > 0 && (
        <>
          <h3>Data corrections</h3>
          <ul>
            {data.dataCorrections.map((note) => (
              <li key={note.slice(0, 48)}>{note}</li>
            ))}
          </ul>
        </>
      )}
      <hr />
    </section>
  );
}
