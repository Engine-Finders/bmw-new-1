export default function EngineHero({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      {data.tagPill && <p>{data.tagPill}</p>}
      <h1>{data.h1}</h1>
      {data.subHeadline && <p>{data.subHeadline}</p>}

      {data.trustStrip?.length > 0 && (
        <ul>
          {data.trustStrip.map((item) => (
            <li key={item.label}>
              {item.icon} {item.label}
            </li>
          ))}
        </ul>
      )}

      {data.primaryCta && (
        <p>
          <a href={data.primaryCta.href}>{data.primaryCta.label}</a>
        </p>
      )}
      <hr />
    </section>
  );
}
