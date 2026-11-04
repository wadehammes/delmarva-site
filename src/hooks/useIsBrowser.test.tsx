import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { useIsBrowser } from "./useIsBrowser";

const ClientProbe = () => {
  const isBrowser = useIsBrowser();

  if (!isBrowser) {
    return null;
  }

  return <span>client-ready</span>;
};

describe("useIsBrowser", () => {
  it("renders client-only children after mount", () => {
    render(<ClientProbe />);

    expect(screen.getByText("client-ready")).toBeInTheDocument();
  });
});
