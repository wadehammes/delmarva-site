import { screen } from "src/tests/testUtils";
import { StatPO } from "./Stat.po";

// The Stat component no longer uses GSAP — it drives animation via CSS
// transform transitions triggered by requestAnimationFrame. No mock needed.

describe("Stat", () => {
  let po: StatPO;

  beforeEach(() => {
    po = new StatPO();
  });

  it("renders the correct accessible label for numerical (1000 → 1K)", () => {
    po.render();

    expect(screen.getByRole("img", { name: "1K" })).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders the correct accessible label for currency (1000 → $1K)", () => {
    po.render({
      stat: {
        id: "stat-currency",
        stat: 1000,
        statDescription: "Revenue",
        statType: "Currency",
      },
    });

    expect(screen.getByRole("img", { name: "$1K" })).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders the correct accessible label for percentage (95 → 95%)", () => {
    po.render({
      stat: {
        id: "stat-pct",
        stat: 95,
        statDescription: "Success rate",
        statType: "Percentage",
      },
    });

    expect(screen.getByRole("img", { name: "95%" })).toBeInTheDocument();
    expect(screen.getByText("Success rate")).toBeInTheDocument();
  });

  it("renders the correct accessible label for single-digit numerical (7)", () => {
    po.render({
      stat: {
        id: "stat-7",
        stat: 7,
        statDescription: "Count",
        statType: "Numerical",
      },
    });

    expect(screen.getByRole("img", { name: "7" })).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
  });

  it("renders the correct accessible label for large numerical (7000000 → 7M)", () => {
    po.render({
      stat: {
        id: "stat-m",
        stat: 7000000,
        statDescription: "Users",
        statType: "Numerical",
      },
    });

    expect(screen.getByRole("img", { name: "7M" })).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("renders the correct accessible label for two-digit numerical (15)", () => {
    po.render({
      stat: {
        id: "stat-15",
        stat: 15,
        statDescription: "Items",
        statType: "Numerical",
      },
    });

    expect(screen.getByRole("img", { name: "15" })).toBeInTheDocument();
    expect(screen.getByText("Items")).toBeInTheDocument();
  });

  it("applies custom className to the stat container", () => {
    po.render({ className: "custom-class" });

    const statContainer = screen
      .getByRole("img", { name: "1K" })
      .closest("div");
    expect(statContainer).toHaveClass("custom-class");
  });
});
