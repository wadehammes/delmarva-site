# Accordion Component

A reusable, accessible accordion component with animated content and keyboard navigation support.

## Features

- **Accessible**: Full ARIA support with proper semantic HTML
- **Keyboard Navigation**: Supports Enter and Space key activation
- **Animated**: Smooth height transitions for opening/closing content
- **Responsive**: Mobile-first design with responsive typography
- **Customizable**: Minimal styling that can be easily customized
- **Screen Reader Friendly**: Proper labeling and announcements

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | The accordion header text |
| `children` | `ReactNode` | Required | The content to display when expanded |
| `defaultOpen` | `boolean` | `false` | Whether the accordion starts in an open state |
| `className` | `string` | `undefined` | Additional CSS classes for styling |
| `headerElement` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "div"` | `"h3"` | The HTML element to use for the accordion header |
| `data-tracking-click` | `string` | `undefined` | Tracking attribute for analytics |

## Usage

```tsx
import { Accordion } from "src/components/Accordion";

// Basic usage
<Accordion title="Frequently Asked Questions">
  <p>This is the content that will be shown when the accordion is expanded.</p>
</Accordion>

// With default open state
<Accordion title="Important Information" defaultOpen={true}>
  <p>This accordion will be open by default.</p>
</Accordion>

// With custom styling
<Accordion 
  title="Custom Styled Accordion" 
  className="my-custom-accordion"
  data-tracking-click="faq-section"
>
  <div>
    <h4>Subheading</h4>
    <p>Any content can go here, including other components.</p>
  </div>
</Accordion>
```

## Accessibility Features

- Uses semantic HTML with `<h3>` for headers and `<section>` for content
- Proper ARIA attributes: `aria-expanded`, `aria-controls`, `aria-labelledby`
- Keyboard support for Enter and Space keys
- Focus management with visible focus indicators
- Screen reader announcements for state changes

## Styling

The component uses CSS modules and follows the project's design system:

- Mobile-first responsive design
- Uses CSS custom properties for colors and spacing
- Smooth transitions for all interactive states
- Minimal default styling for easy customization

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Graceful degradation for older browsers
- No JavaScript dependencies beyond React 