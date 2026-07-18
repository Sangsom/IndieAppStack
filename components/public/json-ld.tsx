type JsonLdProps = {
  // Pass `null` to render nothing (e.g. an empty ItemList).
  data: object | null;
};

// Renders structured data as a native <script> tag. The "<" character is
// escaped to its unicode equivalent so values sourced from the database
// (tool names, article titles) can't break out of the script tag and inject
// markup. See node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
export function JsonLd({ data }: JsonLdProps) {
  if (!data) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
