export default function TrustCta({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.trustPoints?.map((point) => (
        <div key={point.title}>
          <h3>{point.title}</h3>
          <p>{point.text}</p>
        </div>
      ))}
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
