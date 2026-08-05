export default function TrustCta({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.trustPoints?.map((point) => (
        <div key={point.title}>
          <h3>{point.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: point.text }} />
        </div>
      ))}
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
