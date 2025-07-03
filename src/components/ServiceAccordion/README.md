# ServiceAccordion Component

A service accordion component with smooth GSAP animations that reveals content in a staggered sequence when the accordion is opened.

## Features

- **Smooth Content Animation**: When the accordion opens, content elements animate in sequence:
  1. Rich text description (fades in and slides up)
  2. Stats list container
  3. Individual stat items (staggered animation with 0.06s delay between each)
  4. Call-to-action button
  5. Project carousel

- **Optimized Performance**: Clean GSAP animations without conflicting CSS transitions
- **Coordinated Timing**: Content animations are delayed slightly to let the accordion height animation complete first
- **Reverse Animation**: When the accordion closes, animations play in reverse immediately
- **Accessible**: Maintains accessibility features from the base Accordion component

## Animation Details

- **Duration**: 0.25-0.35 seconds per element for snappy, responsive feel
- **Easing**: `power1.out` for smooth, natural motion without overshoot
- **Effects**: 
  - Opacity fade (0 to 1)
  - Subtle Y-axis translation (8px to 0 for containers, 6px to 0 for stat items)
- **Stagger**: Individual stat items animate with 0.06s stagger for a quick cascading effect
- **Timing**: Content animations start 0.1s after accordion opens to prevent conflicts

## Props

```typescript
interface ServiceAccordionProps {
  service: ServiceType;
  locale: Locales;
  projects: any[];
}
```

## Usage

```tsx
<ServiceAccordion 
  service={serviceData}
  locale="en"
  projects={projectData}
/>
```

## Dependencies

- GSAP (^3.13.0)
- React (with hooks: useEffect, useRef)
- Base Accordion component 