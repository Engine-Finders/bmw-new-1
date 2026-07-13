export default function OwnershipEconomics({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>

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
            <tr key={row.engine}>
              <td>{row.engine}</td>
              <td>{row.typicalMileage}</td>
              <td>{row.commonMajorFailure}</td>
              <td>{row.repairCostSpecialist}</td>
              <td>{row.replacementCostRecon}</td>
              <td>{row.ownershipVerdict}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.economicsRule && (
        <>
          <h3>{data.economicsRule.title}</h3>
          <p>{data.economicsRule.text}</p>
        </>
      )}

      {data.keyTakeaways?.length > 0 && (
        <>
          <h3>Key takeaways</h3>
          <ul>
            {data.keyTakeaways.map((item) => (
              <li key={item.question}>
                <strong>{item.question}</strong> — {item.answer}
              </li>
            ))}
          </ul>
        </>
      )}
      <hr />
    </section>
  );
}
