# ProjectCarousel Component

A specialized carousel component for displaying project cards using the Swiper library with a coverflow effect.

## Features

- **Coverflow Effect**: Shows three project cards at once with the middle slide active
- **Blur Effect**: Previous and next slides are blurred and scaled down
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Touch/Gesture Support**: Swipe gestures for navigation
- **Fallback**: Renders normally if only one project is provided

## Usage

```tsx
import { ProjectCarousel } from "src/components/ProjectCarousel/ProjectCarousel.component";

<ProjectCarousel 
  projects={projects} 
  selectedServiceSlug={serviceSlug} 
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projects` | `ProjectType[]` | Yes | Array of project data to display |
| `selectedServiceSlug` | `string` | No | Optional service slug to filter project stats |

## Styling

The component uses CSS custom properties for responsive sizing:

- `--project-carousel-slide-width`: Width of each slide
- `--project-carousel-slide-height`: Height of each slide  
- `--project-carousel-gap`: Gap between slides

These properties are automatically adjusted based on screen size breakpoints.

## Dependencies

- Swiper library with EffectCoverflow module
- ProjectCard component
- CSS modules for styling 