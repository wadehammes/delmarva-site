# Button Component

A reusable button component with various styles and states.

## Features

- Multiple button variants (primary, secondary, outline)
- Different sizes (small, medium, large)
- Loading state support
- Disabled state handling
- Custom styling support

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline"` | `"primary"` | Button style variant |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Button size |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `disabled` | `boolean` | `false` | Disables the button |
| `children` | `ReactNode` | Required | Button content |

## Usage

```tsx
import { Button } from "src/components/Button";

// Basic usage
<Button>Click me</Button>

// With variant
<Button variant="secondary">Secondary Button</Button>

// With loading state
<Button loading>Loading...</Button>
``` 