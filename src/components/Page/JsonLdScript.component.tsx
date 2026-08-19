export interface JsonLdScriptProps {
  id: string;
  json: string;
}

export const JsonLdScript = (props: JsonLdScriptProps) => {
  const { id, json } = props;

  return (
    <script id={id} type="application/ld+json">
      {json}
    </script>
  );
};
