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
          description: "Happy customers served",
          type: "Numerical",
          value: 1500,
        }}
      />

      <Stat
        stat={{
          description: "Customer satisfaction rate",
          type: "Percentage",
          value: 95,
        }}
      />

      <Stat
        stat={{
          description: "Revenue generated",
          type: "Currency",
          value: 50000,
        }}
      />

      <Stat
        stat={{
          description: "Years of experience",
          type: "Numerical",
          value: 25,
        }}
      />
    </div>
  );
};
