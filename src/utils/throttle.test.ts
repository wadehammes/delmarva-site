import { debounce, throttle } from "./throttle";

describe("throttle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call the function immediately on first call", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should not call the function again within the throttle limit", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should call the function again after the throttle limit expires", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should pass arguments to the throttled function", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    throttledFn("arg1", "arg2");
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should handle multiple throttle cycles", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 1000);

    // First call
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Multiple calls within throttle period
    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance time and call again
    jest.advanceTimersByTime(1000);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);

    // Multiple calls again
    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);

    // Advance time and call again
    jest.advanceTimersByTime(1000);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it("should work with different throttle limits", () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 500);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Should not call within 500ms
    jest.advanceTimersByTime(400);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Should call after 500ms
    jest.advanceTimersByTime(100);
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should not call the function immediately", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();
  });

  it("should call the function after the wait period", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should reset the timer on subsequent calls", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    jest.advanceTimersByTime(500);
    debouncedFn();
    jest.advanceTimersByTime(500);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments to the debounced function", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn("arg1", "arg2");
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should handle multiple rapid calls", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should work with different wait times", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    jest.advanceTimersByTime(400);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple debounce cycles", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    // First cycle
    debouncedFn();
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Second cycle
    debouncedFn();
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
