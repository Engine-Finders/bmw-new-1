export default function TrustBlock({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.signals?.map((item) => (
        <p key={item.title}>
          {item.icon} <strong>{item.title}</strong> — {item.text}
        </p>
      ))}
      <hr />
    </section>
  );
}
