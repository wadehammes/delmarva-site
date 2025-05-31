import type { MockedFunction } from "jest-mock";
import { mockApiResponse } from "src/tests/mocks/mockApiResponse";

// biome-ignore lint/suspicious/noExplicitAny: Mock function type requires any for flexibility
export function setupApiMock<T extends (...args: any[]) => any>(
  mockApiEndpoint: MockedFunction<T>,
  shouldSucceed = true,
  // biome-ignore lint/suspicious/noExplicitAny: Mock response can be any type
  resolvedResponse?: Awaited<any>,
  // biome-ignore lint/suspicious/noExplicitAny: Mock error can be any type
  rejectedResponse?: Awaited<any>,
) {
  mockApiResponse(
    shouldSucceed,
    mockApiEndpoint,
    resolvedResponse,
    rejectedResponse,
  );
}

// biome-ignore lint/suspicious/noExplicitAny: Mock function type requires any for flexibility
export function setupMultipleApiMocks<T extends (...args: any[]) => any>(
  mocks: Array<{
    mockApiEndpoint: MockedFunction<T>;
    shouldSucceed: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: Mock response can be any type
    resolvedResponse?: Awaited<any>;
    // biome-ignore lint/suspicious/noExplicitAny: Mock error can be any type
    rejectedResponse?: Awaited<any>;
  }>,
) {
  mocks.forEach(
    ({
      mockApiEndpoint,
      shouldSucceed,
      resolvedResponse,
      rejectedResponse,
    }) => {
      setupApiMock(
        mockApiEndpoint,
        shouldSucceed,
        resolvedResponse,
        rejectedResponse,
      );
    },
  );
}
