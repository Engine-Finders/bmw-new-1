export default function QuotesCta({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.headline}</h2>
      {data.supportingLine && <p dangerouslySetInnerHTML={{ __html: data.supportingLine }} />}
      {data.button && (
        <p>
          <a href={data.button.href}>{data.button.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
