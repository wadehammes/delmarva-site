import { screen } from "src/tests/testUtils";
import { StatPO } from "./Stat.po";

// Mock GSAP to avoid issues in test environment
jest.mock("gsap", () => ({
  gsap: {
    registerPlugin: jest.fn(),
    timeline: jest.fn(() => ({
      fromTo: jest.fn().mockReturnThis(),
      kill: jest.fn(),
    })),
  },
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

describe("Stat", () => {
  let po: StatPO;

  beforeEach(() => {
    jest.clearAllMocks();
    po = new StatPO();
  });

  it("renders with initial value of 0", () => {
    po.render();

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders with initial value of 0 for currency", () => {
    po.render({ description: "Revenue", type: "Currency" });

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders with initial value of 0 for percentage", () => {
    po.render({ description: "Success rate", type: "Percentage" });

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Success rate")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    po.render({ className: "custom-class" });

    const statElement = screen.getByText("0").closest("div");
    expect(statElement).toHaveClass("custom-class");
  });
});
