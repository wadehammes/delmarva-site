# Navigation Component

The Navigation component provides the main site navigation with automatic transparency handling.

## Features

- **Dynamic Transparency**: The navigation automatically becomes transparent when scrolling over Content Hero sections
- **Background on Non-Hero Sections**: When scrolling over sections that are not Content Hero, the navigation displays with a white background and subtle shadow
- **Responsive Design**: Includes mobile navigation drawer for smaller screens
- **Scroll Behavior**: Navigation hides on scroll down and shows on scroll up
- **Smooth Transitions**: Smooth transitions between transparent and background states

## CSS Classes

The component applies different CSS classes based on the currently visible section:

- `.transparent`: Applied when scrolling over a Content Hero section
  - Uses a gradient background that fades to transparent
  - Text and logo remain white for contrast
- `.withBackground`: Applied when scrolling over non-Hero sections
  - Uses a solid white background with shadow
  - Text and logo change to dark colors for readability

## Usage

```tsx
import { Navigation } from "src/components/Navigation/Navigation";

<Navigation navigation={navigationData} />
```

## Implementation Details

The component uses the `usePage` hook to access the current page data and implements scroll-based section detection. It monitors which section is currently in view by:

1. **Section Detection**: Uses `getBoundingClientRect()` to determine which section is currently visible
2. **Threshold Calculation**: Uses a 30% viewport height threshold to determine when a section is "active"
3. **Content Type Checking**: Examines the content type of the first content item in the current section
4. **Dynamic Styling**: Applies CSS classes based on whether the current section contains a Content Hero

The transparency logic is implemented with CSS classes and smooth transitions, making it performant and visually appealing. 