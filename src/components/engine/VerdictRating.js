export default function VerdictRating({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Verdict & Rating</h2>
      {data.starRating && <p>Rating: {data.starRating}</p>}
      {data.confidence && <p>{data.confidence}</p>}
      {data.scoreNote && <p>{data.scoreNote}</p>}

      {data.scoreBreakdown && (
        <table border="1" cellPadding="4" cellSpacing="0">
          <thead>
            <tr>
              {data.scoreBreakdown.columns?.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.scoreBreakdown.rows?.map((row) => (
              <tr key={row.dimension}>
                <td>{row.dimension}</td>
                <td>{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.oneLineVerdict && <p>{data.oneLineVerdict}</p>}
      {data.bestFor && <p>Best for: {data.bestFor}</p>}
      {data.avoidIf && <p>Avoid if: {data.avoidIf}</p>}
      <hr />
    </section>
  );
}
