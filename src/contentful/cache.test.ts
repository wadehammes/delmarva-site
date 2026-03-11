import { cached } from "src/contentful/cache";

const mockCachedFn = jest.fn();

jest.mock("next/cache", () => ({
  unstable_cache: (
    fn: () => Promise<unknown>,
    key: string[],
    options: object,
  ) => {
    mockCachedFn(fn, key, options);
    return () => fn();
  },
}));

describe("cached", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls unstable_cache with fn, key, and revalidate", async () => {
    const key = ["contentful", "test", "en", "false"];
    const fn = jest.fn().mockResolvedValue("result");
    const result = await cached({ fn, key });
    expect(result).toBe("result");
    expect(mockCachedFn).toHaveBeenCalledTimes(1);
    const [passedFn, passedKey, options] = mockCachedFn.mock.calls[0];
    expect(passedKey).toEqual(key);
    expect(options).toMatchObject({ revalidate: expect.any(Number) });
    expect(passedFn).toEqual(expect.any(Function));
    expect(fn).toHaveBeenCalled();
  });

  it("includes tags in options when provided", async () => {
    const key = ["contentful", "test"];
    const tags = ["contentful", "contentful-services"];
    const fn = jest.fn().mockResolvedValue(undefined);
    await cached({ fn, key, tags });
    const [, , options] = mockCachedFn.mock.calls[0];
    expect(options).toMatchObject({ tags });
  });

  it("omits tags from options when not provided", async () => {
    const key = ["contentful", "test"];
    const fn = jest.fn().mockResolvedValue(undefined);
    await cached({ fn, key });
    const [, , options] = mockCachedFn.mock.calls[0];
    expect(options).not.toHaveProperty("tags");
  });

  it("omits tags when empty array", async () => {
    const key = ["contentful", "test"];
    const fn = jest.fn().mockResolvedValue(undefined);
    await cached({ fn, key, tags: [] });
    const [, , options] = mockCachedFn.mock.calls[0];
    expect(options).not.toHaveProperty("tags");
  });

  it("uses custom revalidateSeconds when provided", async () => {
    const key = ["contentful", "test"];
    const fn = jest.fn().mockResolvedValue(undefined);
    await cached({ fn, key, revalidateSeconds: 60 });
    const [, , options] = mockCachedFn.mock.calls[0];
    expect(options).toEqual({ revalidate: 60 });
  });

  it("returns the result of the cached function", async () => {
    const key = ["contentful", "test"];
    const data = { items: [1, 2, 3] };
    const fn = jest.fn().mockResolvedValue(data);
    const result = await cached({ fn, key });
    expect(result).toEqual(data);
  });

  it("propagates errors from the cached function", async () => {
    const key = ["contentful", "test"];
    const fn = jest.fn().mockRejectedValue(new Error("fetch failed"));
    await expect(cached({ fn, key })).rejects.toThrow("fetch failed");
  });
});
