export default function ClosingActionCards({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2>{data.h2}</h2>
      {data.cards?.map((card) => (
        <p key={card.title}>
          {card.icon} <strong>{card.title}</strong> — {card.text}{" "}
          <a href={card.href}>{card.href}</a>
        </p>
      ))}
      {data.footerNote && <p>{data.footerNote}</p>}
      <hr />
    </section>
  );
}
