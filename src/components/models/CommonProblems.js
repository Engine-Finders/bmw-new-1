export default function CommonProblems({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.subHeadline && <p>{data.subHeadline}</p>}

      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            {data.columns?.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.problems?.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.issue}</td>
              <td>{row.description}</td>
              <td>
                {row.severity?.icon} {row.severity?.label}
              </td>
              <td>
                {row.link && <a href={row.link.href}>{row.link.label}</a>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.urgencyKey?.length > 0 && (
        <>
          <h3>Urgency key</h3>
          <ul>
            {data.urgencyKey.map((item) => (
              <li key={item.label}>
                {item.icon} {item.label} — {item.text}
              </li>
            ))}
          </ul>
        </>
      )}
      <hr />
    </section>
  );
}
