import { describe, expect, it } from "@jest/globals";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";

describe("parseContentfulAsset", () => {
  it("returns null when the asset link is unresolved", () => {
    expect(parseContentfulAsset(undefined)).toBeNull();
    expect(
      parseContentfulAsset({
        sys: { id: "x", linkType: "Asset", type: "Link" },
      }),
    ).toBeNull();
  });

  it("returns null when file url is missing", () => {
    expect(
      parseContentfulAsset({
        fields: {},
        sys: { id: "asset-1", type: "Asset" },
      } as Parameters<typeof parseContentfulAsset>[0]),
    ).toBeNull();
  });

  it("normalizes protocol-relative Contentful image urls", () => {
    const parsed = parseContentfulAsset({
      fields: {
        file: {
          details: { image: { height: 400, width: 800 } },
          url: "//images.ctfassets.net/space/image.jpg",
        },
      },
      sys: { id: "asset-2", type: "Asset" },
    } as Parameters<typeof parseContentfulAsset>[0]);

    expect(parsed).toEqual(
      expect.objectContaining({
        height: 400,
        id: "asset-2",
        src: expect.stringContaining("https://images.ctfassets.net"),
        width: 800,
      }),
    );
  });
});
