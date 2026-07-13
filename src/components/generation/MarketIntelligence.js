export default function MarketIntelligence({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Market Intelligence</h2>

      {data.mostRequestedEngines?.length > 0 && (
        <>
          <h3>Most requested engines</h3>
          <ul>
            {data.mostRequestedEngines.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {data.mostRequestedVariants?.length > 0 && (
        <>
          <h3>Most requested variants</h3>
          <ul>
            {data.mostRequestedVariants.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {data.averageReplacementCost && (
        <p>Average replacement cost: {data.averageReplacementCost}</p>
      )}

      {data.mostCommonFailures?.length > 0 && (
        <>
          <h3>Most common failures</h3>
          <ul>
            {data.mostCommonFailures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {data.liveFeed?.length > 0 && (
        <>
          <h3>Live feed</h3>
          <table border="1" cellPadding="4" cellSpacing="0">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Location</th>
                <th>Issue</th>
                <th>Enquiries</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.liveFeed.map((row) => (
                <tr key={`${row.vehicle}-${row.location}-${row.issue}`}>
                  <td>{row.vehicle}</td>
                  <td>{row.location}</td>
                  <td>{row.issue}</td>
                  <td>{row.enquiries}</td>
                  <td>{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <hr />
    </section>
  );
}
