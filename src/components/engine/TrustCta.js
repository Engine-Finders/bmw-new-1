export default function TrustCta({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Why Owners Trust Us</h2>
      {data.trustPoints?.length > 0 && (
        <ul>
          {data.trustPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
      {data.finalCta && <p>{data.finalCta}</p>}
      {data.ctaButton && (
        <p>
          <a href={data.ctaButton.href}>{data.ctaButton.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
