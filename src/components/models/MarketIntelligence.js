export default function MarketIntelligence({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>

      {data.signals?.length > 0 && (
        <table border="1" cellPadding="4" cellSpacing="0">
          <thead>
            <tr>
              <th>Signal</th>
              <th>Data</th>
              <th>Demand Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.signals.map((row) => (
              <tr key={row.signal}>
                <td>{row.signal}</td>
                <td>{row.data}</td>
                <td>{row.demandTrend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.insights?.length > 0 && (
        <>
          <h3>Insights from the data</h3>
          {data.insights.map((insight) => (
            <p key={insight}>{insight}</p>
          ))}
        </>
      )}

      {data.liveEnquiryFeedNote && <p>{data.liveEnquiryFeedNote}</p>}
      <hr />
    </section>
  );
}
