export default function EditorialPullQuote({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.title}</h2>
      <blockquote>
        <p>{data.quote}</p>
      </blockquote>
      <hr />
    </section>
  );
}
