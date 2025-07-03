# Hooks

This directory contains custom React hooks used throughout the application.

## Available Hooks

### useModal

A custom hook for managing modal state with open, close, and toggle functions.

#### Usage

```tsx
import { useModal } from "src/hooks/useModal";

const MyComponent = () => {
  const { isOpen, open, close, toggle } = useModal();

  return (
    <div>
      <button onClick={open}>Open Modal</button>
      <button onClick={close}>Close Modal</button>
      <button onClick={toggle}>Toggle Modal</button>
      
      {isOpen && <Modal onClose={close}>Content</Modal>}
    </div>
  );
};
```

#### API

| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Current modal visibility state |
| `open` | `() => void` | Function to open the modal |
| `close` | `() => void` | Function to close the modal |
| `toggle` | `() => void` | Function to toggle modal state |

### useHash

Hook for managing URL hash state.

### useIsBrowser

Hook to detect if code is running in the browser environment.

### usePreferredTheme

Hook for managing user's preferred theme (light/dark). 