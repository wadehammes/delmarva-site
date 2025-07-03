# BaseModal Component

A reusable base modal component that provides the foundation for all modal dialogs in the application.

## Features

- **Highly Configurable**: Customizable size, close behavior, and content
- **Accessible**: Full keyboard navigation and screen reader support
- **Portal Rendering**: Renders outside normal DOM hierarchy
- **Body Scroll Lock**: Prevents background scrolling when open
- **Responsive Design**: Mobile-first with multiple size options
- **Flexible Content**: Accepts any React children as content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Controls modal visibility |
| `onClose` | `() => void` | Required | Callback when modal closes |
| `children` | `ReactNode` | Required | Modal content |
| `title` | `string` | `undefined` | Optional modal title |
| `size` | `"small" \| "medium" \| "large" \| "full"` | `"medium"` | Modal size variant |
| `showCloseButton` | `boolean` | `true` | Whether to show close button |
| `closeOnClickOutside` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |

## Size Variants

- **Small**: 400px max-width (500px on tablet+)
- **Medium**: 90% viewport width, responsive scaling
- **Large**: 95% viewport width, responsive scaling  
- **Full**: 95% viewport width and height

## Usage

```tsx
import { BaseModal } from "src/components/Modal/BaseModal.component";
import { useModal } from "src/hooks/useModal";

const MyComponent = () => {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <button onClick={open}>Open Modal</button>
      
      <BaseModal
        isOpen={isOpen}
        onClose={close}
        title="My Modal"
        size="medium"
      >
        <p>This is the modal content.</p>
        <button onClick={close}>Close</button>
      </BaseModal>
    </>
  );
};
```

## Accessibility Features

- **Keyboard Navigation**: Escape key closes modal
- **Focus Management**: Proper focus trapping and restoration
- **ARIA Support**: Semantic HTML with proper ARIA attributes
- **Screen Reader Friendly**: Clear content structure and labeling
- **Click Outside**: Click backdrop to close (configurable)

## Styling

The component uses CSS modules with mobile-first responsive design and includes:

- Backdrop blur effect
- Smooth transitions and animations
- Proper focus indicators
- Responsive sizing across breakpoints 