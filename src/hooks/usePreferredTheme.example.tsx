import { usePreferredTheme } from "./usePreferredTheme";

export const ThemeExample = () => {
  const theme = usePreferredTheme();

  return (
    <div style={{ border: "1px solid var(--color-text)", padding: "1rem" }}>
      <h3>Theme Detection Example</h3>
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <p>
        This component demonstrates the usePreferredTheme hook. The theme
        automatically updates when you change your system theme preference.
      </p>
      <p>
        Background: <code>var(--color-bg)</code>
        <br />
        Text: <code>var(--color-text)</code>
      </p>
    </div>
  );
};
