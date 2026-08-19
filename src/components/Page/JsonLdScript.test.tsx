import { describe, expect, it } from "@jest/globals";
import { render } from "@testing-library/react";
import { JsonLdScript } from "src/components/Page/JsonLdScript.component";

describe("JsonLdScript", () => {
  it("renders a native script tag with string children", () => {
    const { container } = render(
      <JsonLdScript
        id="schema-structured-data"
        json='{"@context":"https://schema.org"}'
      />,
    );

    const script = container.querySelector("#schema-structured-data");

    expect(script?.tagName).toBe("SCRIPT");
    expect(script?.getAttribute("type")).toBe("application/ld+json");
    expect(script?.textContent).toBe('{"@context":"https://schema.org"}');
  });
});
