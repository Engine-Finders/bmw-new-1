export default function RepairBuyOrReplace({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>

      {data.canItBeRepaired && (
        <>
          <h3>{data.canItBeRepaired.title}</h3>
          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                {data.canItBeRepaired.columns?.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.canItBeRepaired.rows?.map((row) => (
                <tr key={row.problem}>
                  <td>{row.problem}</td>
                  <td>{row.repairable}</td>
                  <td>{row.typicalCost}</td>
                  <td dangerouslySetInnerHTML={{ __html: row.whenItMakesSense }} />
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {data.buyingChecks && (
        <>
          <h3>{data.buyingChecks.title}</h3>
          {data.buyingChecks.buyIf?.length > 0 && (
            <>
              <h4>Buy if</h4>
              <ul>
                {data.buyingChecks.buyIf.map((item) => (
                  <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            </>
          )}
          {data.buyingChecks.avoidIf?.length > 0 && (
            <>
              <h4>Avoid if</h4>
              <ul>
                {data.buyingChecks.avoidIf.map((item) => (
                  <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {data.closingVerdict && <p dangerouslySetInnerHTML={{ __html: data.closingVerdict }} />}
      {data.cta && (
        <p>
          <a href={data.cta.href}>{data.cta.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
