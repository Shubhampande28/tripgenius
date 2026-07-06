// Reusable JSON-LD emitter. Escapes `<` so user/content strings can never
// close the <script> tag (XSS via `</script>` in a description, FAQ answer…).
// Accepts a single schema object or an array of them (one <script> each).

type JsonLd = Record<string, unknown>;

function serialize(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function Schema({ data }: { data: JsonLd | JsonLd[] | null | undefined }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return null;
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(item) }}
        />
      ))}
    </>
  );
}
