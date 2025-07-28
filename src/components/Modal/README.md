# Modal Components

A collection of reusable modal components for displaying content overlays throughout the application.

## Components

### BaseModal
A foundational modal component that can be used with any content. See [BaseModal.component.md](./BaseModal.component.md) for detailed documentation.

### ProjectCardModal
A specialized modal for displaying project details, located in `src/components/ProjectCardModal/`. Built on top of BaseModal for consistency and reusability.

## Quick Start

```tsx
import { BaseModal } from "src/components/Modal/BaseModal.component";
import { ProjectCardModal } from "src/components/ProjectCardModal/ProjectCardModal.component";
import { useModal } from "src/hooks/useModal";

// For generic content
const MyComponent = () => {
  const { isOpen, open, close } = useModal();
  
  return (
    <>
      <button onClick={open}>Open Modal</button>
      <BaseModal isOpen={isOpen} onClose={close} title="My Modal">
        <p>Any content here</p>
      </BaseModal>
    </>
  );
};

// For project details
const ProjectCard = ({ project }) => {
  const { isOpen, open, close } = useModal();
  
  return (
    <>
      <button onClick={open}>View Project</button>
      <ProjectCardModal 
        isOpen={isOpen} 
        onClose={close} 
        project={project} 
      />
    </>
  );
};
```

## Features

- **Accessible**: Full keyboard navigation support (Escape to close)
- **Click Outside to Close**: Click outside the modal to dismiss
- **Portal Rendering**: Renders outside the normal DOM hierarchy
- **Body Scroll Lock**: Prevents background scrolling when modal is open
- **Responsive Design**: Mobile-first design with responsive breakpoints
- **Project Details**: Displays comprehensive project information including:
  - Project name and description
  - Associated services
  - Project media (images/videos)
  - Project statistics
  - Service-filtered stats

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Controls modal visibility |
| `onClose` | `() => void` | Required | Callback function when modal closes |
| `project` | `ProjectType \| null` | Required | Project data to display |
| `selectedServiceSlug` | `string` | `undefined` | Optional service filter for stats |

## Usage

```tsx
import { Modal } from "src/components/Modal/Modal.component";
import { useState } from "react";

const ProjectCard = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)}>
        {/* Project card content */}
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        selectedServiceSlug="web-development"
      />
    </>
  );
};
```

## Accessibility Features

- **Keyboard Navigation**: Escape key closes the modal
- **Focus Management**: Close button is properly accessible
- **ARIA Labels**: Proper labeling for screen readers
- **Click Outside**: Click outside modal area to close
- **Body Scroll Lock**: Prevents background scrolling when open

## Styling

The modal uses CSS modules with mobile-first responsive design:

- **Mobile**: 90% viewport width
- **Tablet**: 80% viewport width  
- **Desktop**: 70% viewport width
- **Large Desktop**: 60% viewport width

Includes backdrop blur effect and smooth transitions for a modern feel. 