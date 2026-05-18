# Hooks

This directory is for **client React hooks** exported as **`use*`** (`useModal`, **`useOptimizedInView`**, etc.). It does **not** contain **`*.module.css`** (see [conventions — CSS](../../docs/handbook/conventions.md)); hook-related shared styles live in **`src/styles/`** (e.g. **`entryReveal.module.css`**). Pure helpers—not hooks—belong in **`src/utils/`** (**`inView.helpers.ts`**, **`serverLocale.helpers.ts`**, **`react.helpers.ts`**, …).

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
      
      {isOpen ? <Modal onClose={close}>Content</Modal> : null}
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

Also exports **`useDOMCleanup`** for coordinating GSAP / DOM teardown in client components.

### usePreferredTheme

Hook for managing user's preferred theme (light/dark).

### useOptimizedInView

Intersection-driven **`inView`** state using **`react-intersection-observer`** (**`useOnInView`**). Defaults and option types: **`src/utils/inView.helpers.ts`** (`resolveInViewOptions`, **`OptimizedInViewOptions`**). Re-exported type: **`OptimizedInViewOptions`** from **`useOptimizedInView.ts`**.

### useEntryReveal

Uses **`useOnInView`** ( **`react-intersection-observer`** ) to toggle **`.visible`** on the observed node via **`classList`**, avoiding an extra React re-render when scrolling. Styles live in **[`src/styles/entryReveal.module.css`](../styles/entryReveal.module.css)** (**`prefers-reduced-motion`** respected).

Use from **client** components only: attach **`ref`** to the root element that should animate and merge with **`mergeRefs`** from **`src/utils/react.helpers.ts`** when the component forwards a ref.

#### API

| Property | Type | Description |
|----------|------|-------------|
| `ref` | Intersection observer ref callback | Attach to the animating root element |
| `revealClassName` | `string` | Base class only; **`useEntryReveal`** adds the visible token in the observer callback |
