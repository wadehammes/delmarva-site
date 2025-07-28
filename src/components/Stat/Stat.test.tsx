import { screen } from "src/tests/testUtils";
import { StatPO } from "./Stat.po";

// Mock GSAP to avoid issues in test environment
jest.mock("gsap", () => ({
  gsap: {
    registerPlugin: jest.fn(),
    timeline: jest.fn(() => ({
      kill: jest.fn(),
      to: jest.fn().mockReturnThis(),
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

  it("renders with initial value of 0K for numerical (1000)", () => {
    po.render();

    expect(screen.getByText("0K")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders with initial value of $0K for currency (1000)", () => {
    po.render({
      stat: { description: "Revenue", type: "Currency", value: 1000 },
    });

    expect(screen.getByText("$0K")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders with initial value of 0% for percentage (95)", () => {
    po.render({
      stat: { description: "Success rate", type: "Percentage", value: 95 },
    });

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("Success rate")).toBeInTheDocument();
  });

  it("renders with initial value of 0 for single digit numerical (7)", () => {
    po.render({
      stat: { description: "Count", type: "Numerical", value: 7 },
    });

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
  });

  it("renders with initial value of 0M for large numerical (7000000)", () => {
    po.render({
      stat: { description: "Users", type: "Numerical", value: 7000000 },
    });

    expect(screen.getByText("0M")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("renders with initial value of 00 for small numerical (15)", () => {
    po.render({
      stat: { description: "Items", type: "Numerical", value: 15 },
    });

    expect(screen.getByText("00")).toBeInTheDocument();
    expect(screen.getByText("Items")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    po.render({ className: "custom-class" });

    const statElement = screen.getByText("0K").closest("div");
    expect(statElement).toHaveClass("custom-class");
  });
});
