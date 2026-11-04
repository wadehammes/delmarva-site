export function setupMockMatchMedia() {
  if (typeof window === "undefined") {
    return;
  }

  Object.defineProperty(window, "matchMedia", {
    value: jest.fn().mockImplementation((query) => ({
      addEventListener: jest.fn(),
      addListener: jest.fn(), // Deprecated
      dispatchEvent: jest.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: jest.fn(),
      removeListener: jest.fn(), // Deprecated
    })),
    writable: true,
  });
}
