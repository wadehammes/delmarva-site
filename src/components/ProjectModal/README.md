# ProjectModal Component

A standalone modal component for displaying detailed project information. This is the original project-specific modal that was moved from the Modal directory.

## Features

- **Project-Specific Content**: Displays comprehensive project information
- **Service Integration**: Shows associated services as tags
- **Media Gallery**: Displays project images and videos
- **Statistics Display**: Shows project metrics with service filtering
- **Responsive Design**: Mobile-first design with responsive layout
- **Accessible**: Full keyboard navigation and screen reader support
- **Portal Rendering**: Renders outside normal DOM hierarchy

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Controls modal visibility |
| `onClose` | `() => void` | Required | Callback when modal closes |
| `project` | `ProjectType \| null` | Required | Project data to display |
| `selectedServiceSlug` | `string` | `undefined` | Optional service filter for stats |

## Usage

```tsx
import { ProjectModal } from "src/components/ProjectModal/ProjectModal.component";
import { useModal } from "src/hooks/useModal";

const ProjectCard = ({ project }) => {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <button onClick={open}>View Project</button>
      
      <ProjectModal
        isOpen={isOpen}
        onClose={close}
        project={project}
        selectedServiceSlug="web-development"
      />
    </>
  );
};
```

## Content Sections

The modal displays the following project information:

### Header
- **Project Name**: Large, prominent title
- **Services**: Associated service tags (if any)

### Media Section
- **Primary Media**: Main project image/video
- **Additional Media**: Grid of additional project media (if available)

### Description Section
- **Project Description**: Full project description text

### Statistics Section
- **Project Statistics**: Key metrics and KPIs
- **Service Filtering**: When `selectedServiceSlug` is provided, shows only relevant stats

## Accessibility Features

- **Keyboard Navigation**: Escape key closes modal
- **Click Outside**: Click backdrop to close
- **Focus Management**: Proper focus indicators
- **ARIA Support**: Semantic HTML with proper ARIA attributes
- **Screen Reader Friendly**: Clear content structure and labeling

## Styling

The component uses CSS modules with:
- **Mobile-first responsive design**
- **Flexible grid layouts** for media gallery
- **Consistent spacing** and typography
- **Service tag styling** with brand colors
- **Statistics cards** with background styling
- **Backdrop blur effect** for modern feel

## Note

This component is the original project modal that was moved from the Modal directory. For new implementations, consider using the `ProjectCardModal` component which is built on top of the reusable `BaseModal` component. 