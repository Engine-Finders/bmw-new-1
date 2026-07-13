export default function OwnershipVerdict({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.metrics?.map((row) => (
        <p key={row.metric}>
          <strong>{row.metric}:</strong> {row.ourCall}
        </p>
      ))}
      {data.oneLineVerdict && (
        <p>
          <strong>One-line verdict:</strong> {data.oneLineVerdict}
        </p>
      )}
      <hr />
    </section>
  );
}
