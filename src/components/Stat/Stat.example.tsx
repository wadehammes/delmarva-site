import { Stat } from "./Stat.component";

export const StatExample = () => {
  return (
    <div
      style={{
        padding: "2rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "2rem",
      }}
    >
      <Stat
        value={1500}
        description="Happy customers served"
        type="Numerical"
      />

      <Stat
        value={95}
        description="Customer satisfaction rate"
        type="Percentage"
      />

      <Stat value={50000} description="Revenue generated" type="Currency" />

      <Stat value={25} description="Years of experience" type="Numerical" />
    </div>
  );
};
