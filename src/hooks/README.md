# Hooks

This directory contains custom React hooks used throughout the application.

## usePreferredTheme

A hook that detects the user's system theme preference and automatically sets CSS custom properties for background and text colors.

### Usage

```tsx
import { usePreferredTheme } from "src/hooks/usePreferredTheme";

function MyComponent() {
  const theme = usePreferredTheme();
  
  return (
    <div>
      Current theme: {theme}
    </div>
  );
}
```

### Features

- Automatically detects system theme preference using `prefers-color-scheme` media query
- Sets `data-theme` attribute on the HTML element ("light" or "dark")
- CSS handles theme variables through attribute selectors
- Listens for system theme changes and updates automatically
- SSR-safe (only runs on client side)
- Returns the current theme as "light" or "dark"

### How it works

The hook sets a `data-theme` attribute on the HTML element, and CSS uses attribute selectors to control theme variables:

```css
[data-theme="light"] {
  --color-bg: var(--colors-white);
  --color-text: var(--colors-black);
}

[data-theme="dark"] {
  --color-bg: var(--colors-black);
  --color-text: var(--colors-white);
}
```

## useIsBrowser

A hook that determines if the code is running in a browser environment.

### Usage

```tsx
import { useIsBrowser } from "src/hooks/useIsBrowser";

function MyComponent() {
  const isBrowser = useIsBrowser();
  
  if (!isBrowser) {
    return <div>Loading...</div>;
  }
  
  return <div>Browser content</div>;
}
```

## useHash

A hook that tracks the current URL hash and provides methods to update it.

### Usage

```tsx
import { useHash } from "src/hooks/useHash";

function MyComponent() {
  const [hash, setHash] = useHash();
  
  return (
    <div>
      <p>Current hash: {hash}</p>
      <button onClick={() => setHash("section1")}>
        Go to Section 1
      </button>
    </div>
  );
}
``` 