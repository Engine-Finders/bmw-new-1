export default function VariantHero({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      {data.tagPill && <p>{data.tagPill}</p>}
      <h1>{data.h1}</h1>
      {data.subHeadline && <p>{data.subHeadline}</p>}

      {data.trustBadges?.length > 0 && (
        <ul>
          {data.trustBadges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
      )}

      {data.priceAnchor && <p>{data.priceAnchor}</p>}

      {data.registrationInput && (
        <p>
          {data.registrationInput.flag} {data.registrationInput.placeholder}
          {data.registrationInput.cta && (
            <>
              {" — "}
              <a href={data.registrationInput.cta.href}>
                {data.registrationInput.cta.label}
              </a>
            </>
          )}
        </p>
      )}

      {data.ticker && <p>{data.ticker}</p>}
      <hr />
    </section>
  );
}
