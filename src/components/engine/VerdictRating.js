export default function VerdictRating({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Verdict & Rating</h2>
      {data.starRating && <p>Rating: {data.starRating}</p>}
      {data.confidence && <p dangerouslySetInnerHTML={{ __html: data.confidence }} />}
      {data.scoreNote && <p dangerouslySetInnerHTML={{ __html: data.scoreNote }} />}

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

      {data.oneLineVerdict && <p dangerouslySetInnerHTML={{ __html: data.oneLineVerdict }} />}
      {data.bestFor && <p>Best for: <span dangerouslySetInnerHTML={{ __html: data.bestFor }} /></p>}
      {data.avoidIf && <p>Avoid if: <span dangerouslySetInnerHTML={{ __html: data.avoidIf }} /></p>}
      <hr />
    </section>
  );
}
