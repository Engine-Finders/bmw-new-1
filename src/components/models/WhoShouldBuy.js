export default function WhoShouldBuy({ data }) {
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
          {data.profiles?.map((row) => (
            <tr key={row.buyerProfile}>
              <td>{row.buyerProfile}</td>
              <td>{row.rating}</td>
              <td>{row.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </section>
  );
}
