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
          {problem.symptoms && <p>Symptoms: {problem.symptoms}</p>}
          {problem.typicalMileage && (
            <p>Typical mileage: {problem.typicalMileage}</p>
          )}
          {problem.repairCost && <p>Repair cost: {problem.repairCost}</p>}
          {problem.replacementCost && (
            <p>Replacement cost: {problem.replacementCost}</p>
          )}
          {problem.urgency && (
            <p>
              Urgency: {problem.urgency.icon} {problem.urgency.label} —{" "}
              {problem.urgency.text}
            </p>
          )}
          {problem.recommendation && <p>{problem.recommendation}</p>}
          {problem.failureLink && (
            <p>
              <a href={problem.failureLink.href}>
                {problem.failureLink.label}
              </a>
            </p>
          )}
        </div>
      ))}
      <hr />
    </section>
  );
}
