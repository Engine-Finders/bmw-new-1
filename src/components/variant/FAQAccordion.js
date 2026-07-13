export default function FAQAccordion({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>FAQ</h2>
      {data.items?.map((item) => (
        <div key={item.id}>
          <h3>
            {item.id}. {item.question}
          </h3>
          <p>{item.answer}</p>
        </div>
      ))}
      {data.disclaimer && <p>{data.disclaimer}</p>}
      <hr />
    </section>
  );
}
