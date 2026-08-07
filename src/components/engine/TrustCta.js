export default function TrustCta({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>Why Owners Trust Us</h2>
      {data.trustPoints?.length > 0 && (
        <ul>
          {data.trustPoints.map((point) => (
            <li key={point} dangerouslySetInnerHTML={{ __html: point }} />
          ))}
        </ul>
      )}
      {data.finalCta && <p dangerouslySetInnerHTML={{ __html: data.finalCta }} />}
      {data.ctaButton && (
        <p>
          <a href={data.ctaButton.href}>{data.ctaButton.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
