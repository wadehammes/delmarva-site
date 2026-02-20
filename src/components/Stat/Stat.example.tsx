import { Stat } from "./Stat.component";

export const StatExample = () => {
  return (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        padding: "2rem",
      }}
    >
      <Stat
        stat={{
          id: "stat-1",
          stat: 1500,
          statDescription: "Happy customers served",
          statType: "Numerical",
        }}
      />

      <Stat
        stat={{
          id: "stat-2",
          stat: 95,
          statDescription: "Customer satisfaction rate",
          statType: "Percentage",
        }}
      />

      <Stat
        stat={{
          id: "stat-3",
          stat: 50000,
          statDescription: "Revenue generated",
          statType: "Currency",
        }}
      />

      <Stat
        stat={{
          id: "stat-4",
          stat: 25,
          statDescription: "Years of experience",
          statType: "Numerical",
        }}
      />
    </div>
  );
};
