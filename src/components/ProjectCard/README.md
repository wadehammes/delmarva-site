# ProjectCard Component

A clickable project card component that displays project information and opens a detailed modal when clicked.

## Features

- **Interactive Card**: Clickable project card with hover and focus states
- **Modal Integration**: Opens a detailed modal with comprehensive project information
- **Accessible**: Full keyboard navigation support (Enter/Space to open modal)
- **Responsive Design**: Mobile-first design with responsive typography
- **Service Filtering**: Optional service-based filtering of project statistics
- **Media Display**: Shows project media with fallback handling

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `project` | `ProjectType` | Required | Project data to display |
| `selectedServiceSlug` | `string` | `undefined` | Optional service filter for stats |

## Usage

```tsx
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";

// Basic usage
<ProjectCard project={projectData} />

// With service filtering
<ProjectCard 
  project={projectData} 
  selectedServiceSlug="web-development" 
/>
```

## Interaction

- **Click**: Opens the project details modal
- **Enter/Space**: Opens the project details modal (keyboard accessible)
- **Hover**: Card lifts slightly with shadow effect
- **Focus**: Red outline for accessibility

## Modal Features

When clicked, the card opens a modal that displays:

- **Project Name**: Large, prominent title
- **Services**: Associated service tags
- **Media Gallery**: All project images/videos
- **Description**: Full project description
- **Statistics**: Project metrics and KPIs
- **Service-Filtered Stats**: When a service slug is provided

## Accessibility

- **Semantic HTML**: Uses `<button>` element for proper accessibility
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus indicators
- **Screen Reader Friendly**: Clear content structure

## Styling

The component uses CSS modules with:

- **Hover Effects**: Subtle lift animation with shadow
- **Focus States**: Clear visual indicators
- **Responsive Design**: Mobile-first approach
- **Smooth Transitions**: 0.2s ease-in-out animations 