export default function CommonProblems({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Common Problems</h2>
      {data.problems?.map((problem) => (
        <div key={problem.id}>
          <h3>
            {problem.id}. {problem.title}
          </h3>
          {problem.affectedModels && (
            <p>Affected models: {problem.affectedModels}</p>
          )}
          {problem.typicalFailureMileage && (
            <p>Typical failure mileage: {problem.typicalFailureMileage}</p>
          )}
          {problem.rootCause && <p>Root cause: {problem.rootCause}</p>}

          {problem.tieredCosts?.length > 0 && (
            <table border="1" cellPadding="4" cellSpacing="0">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Dealer</th>
                  <th>Specialist</th>
                  <th>Work</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {problem.tieredCosts.map((tier) => (
                  <tr key={tier.tier}>
                    <td>{tier.tier}</td>
                    <td>{tier.dealer}</td>
                    <td>{tier.specialist}</td>
                    <td>{tier.work}</td>
                    <td>{tier.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {problem.recommendation && <p>{problem.recommendation}</p>}
          {problem.cta && (
            <p>
              <a href={problem.cta.href}>{problem.cta.label}</a>
            </p>
          )}
        </div>
      ))}
      <hr />
    </section>
  );
}
