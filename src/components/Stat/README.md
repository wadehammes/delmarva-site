# Stat Component

A React component that displays a numeric statistic with a description and animates the number using GSAP when it comes into view.

## Features

- **GSAP Animation**: Numbers animate from 0 to their target value when the component enters the viewport
- **Multiple Formats**: Supports numerical, currency, and percentage formats
- **Responsive Design**: Adapts to different screen sizes
- **Hover Effects**: Subtle hover animations for better user experience
- **Contentful Integration**: Includes parser for Contentful CMS integration

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | Required | The numeric value to display |
| `description` | `string` | Required | The description text below the number |
| `type` | `"Currency" \| "Numerical" \| "Percentage"` | `"Numerical"` | The format type for the number |
| `className` | `string` | Optional | Additional CSS classes |

## Usage

### Basic Usage

```tsx
import { Stat } from "src/components/Stat";

<Stat value={1500} description="Happy customers served" />
```

### With Different Types

```tsx
// Currency format
<Stat value={50000} description="Revenue generated" type="Currency" />

// Percentage format
<Stat value={95} description="Customer satisfaction rate" type="Percentage" />

// Numerical format (default)
<Stat value={25} description="Years of experience" type="Numerical" />
```

### With Custom Styling

```tsx
<Stat 
  value={1000} 
  description="Projects completed" 
  className="my-custom-class" 
/>
```

## Contentful Integration

The component includes a parser for Contentful CMS integration:

```tsx
import { parseContentfulStat } from "src/contentful/parseContentfulStat";
import { Stat } from "src/components/Stat";

// Parse Contentful data
const parsedStat = parseContentfulStat(contentfulEntry);

// Use in component
{parsedStat && (
  <Stat 
    value={parsedStat.value}
    description={parsedStat.description}
    type={parsedStat.type}
  />
)}
```

## Animation Details

- **Trigger**: Animation starts when the component is 80% visible in the viewport
- **Duration**: 2 seconds with a smooth easing curve
- **Format**: Numbers are properly formatted during animation (e.g., commas for thousands)
- **Reverse**: Animation reverses when scrolling back up

## Styling

The component uses CSS modules and includes:
- Responsive design for mobile, tablet, and desktop
- Hover effects with subtle elevation
- Consistent typography and spacing
- Box shadow and border radius for modern appearance

## Dependencies

- `gsap`: For scroll-triggered animations
- `classnames`: For conditional CSS class application 