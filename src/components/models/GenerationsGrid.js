export default function GenerationsGrid({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.subHeadline && <p>{data.subHeadline}</p>}

      {data.cards?.map((card) => (
        <div key={card.title}>
          <h3>{card.title}</h3>
          {card.badge && <p>{card.badge}</p>}
          {card.meta && <p>{card.meta}</p>}
          {card.rating && <p>{card.rating}</p>}
          {card.verdict && (
            <p>
              <strong>Our Verdict:</strong> {card.verdict}
            </p>
          )}
          {card.cta && (
            <p>
              <a href={card.cta.href}>{card.cta.label}</a>
            </p>
          )}
        </div>
      ))}

      {data.rangeTable && (
        <>
          <h3>{data.rangeTable.title}</h3>
          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                {data.rangeTable.columns?.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rangeTable.rows?.map((row) => (
                <tr key={row.model}>
                  <td>{row.model}</td>
                  <td>{row.engineCode}</td>
                  <td>{row.power}</td>
                  <td>{row.induction}</td>
                  <td>{row.years}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {data.comparisonLink && (
        <p>
          <a href={data.comparisonLink.href}>{data.comparisonLink.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
