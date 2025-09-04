# Carousel Component

A lightweight and flexible carousel component built with Swiper library, featuring hooks implementation and mobile-first responsive design.

## Features

- **Swiper Integration**: Built on top of Swiper.js for smooth, touch-friendly carousel functionality
- **Hooks Implementation**: Uses React hooks for state management and lifecycle handling
- **SSR Safe**: Includes skeleton loading state for server-side rendering compatibility
- **Mobile-First**: Responsive design with mobile-first media queries
- **Customizable**: Extensive props for customization
- **Accessible**: Proper ARIA attributes and keyboard navigation support
- **Lightweight**: Only imports necessary Swiper modules
- **Multi-instance Safe**: Uses unique IDs for controls to prevent conflicts when multiple carousels are on the same page
- **Clean Design**: Navigation arrows positioned over slides with numbered pagination between them
- **Content Containment**: Automatically constrains content to prevent layout issues with large images or content

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode[]` | **required** | Array of slide content |
| `className` | `string` | Optional | Additional CSS classes for the carousel container |
| `slideClassName` | `string` | Optional | Additional CSS classes for individual slides |
| `showNavigation` | `boolean` | `true` | Whether to show navigation arrows |
| `showPagination` | `boolean` | `true` | Whether to show pagination dots |
| `autoplay` | `boolean` | `false` | Whether to enable autoplay |
| `autoplayDelay` | `number` | `3000` | Autoplay delay in milliseconds |
| `loop` | `boolean` | `false` | Whether to enable infinite loop |
| `slidesPerView` | `number \| "auto"` | `1` | Number of slides to show at once |
| `spaceBetween` | `number` | `30` | Space between slides in pixels |
| `breakpoints` | `Record<number, Partial<SwiperProps>>` | Optional | Responsive breakpoints configuration |
| `onSlideChange` | `(swiper: SwiperType) => void` | Optional | Callback when slide changes |
| `onSwiper` | `(swiper: SwiperType) => void` | Optional | Callback when Swiper instance is created |

## Content Containment

The Carousel component automatically constrains all content to prevent layout issues. This is particularly important when rendering large images or content that might otherwise break out of the carousel bounds.

### Containment Features

- **Content Containment**: Prevents content from exceeding carousel slide boundaries
- **Overflow Handling**: Automatically handles overflow with `overflow: hidden`
- **Layout Containment**: Uses CSS `contain: layout style` for better performance
- **Responsive**: Automatically adapts to container width

## Usage

### Basic Usage

```tsx
import { Carousel } from "src/components/Carousel/Carousel.component";

<Carousel>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

### With Large Images

The Carousel automatically handles large images and prevents them from causing layout issues:

```tsx
<Carousel>
  <ContentImageBlock fields={imageData} />
  <ContentImageBlock fields={imageData2} />
</Carousel>
```

### With Custom Configuration

```tsx
<Carousel
  autoplay={true}
  autoplayDelay={5000}
  loop={true}
  slidesPerView={3}
  spaceBetween={20}
  showNavigation={true}
  showPagination={true}
>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

### Responsive Breakpoints

```tsx
<Carousel
  slidesPerView={1}
  breakpoints={{
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  }}
>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

### With Event Handlers

```tsx
import type { Swiper as SwiperType } from "swiper";

<Carousel
  onSlideChange={(swiper: SwiperType) => {
    console.log('Current slide:', swiper.activeIndex);
  }}
  onSwiper={(swiper: SwiperType) => {
    console.log('Swiper instance:', swiper);
  }}
>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

### Multiple Carousels on the Same Page

The component automatically generates unique IDs for navigation and pagination controls, so you can safely use multiple carousels on the same page without conflicts:

```tsx
<div>
  <Carousel>
    <div>Carousel 1 - Slide 1</div>
    <div>Carousel 1 - Slide 2</div>
  </Carousel>
  
  <Carousel>
    <div>Carousel 2 - Slide 1</div>
    <div>Carousel 2 - Slide 2</div>
  </Carousel>
</div>
```

### Contentful Integration

```tsx
import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentRenderer } from "src/components/ContentRenderer/ContentRenderer.component";
import type { ContentCarousel } from "src/contentful/parseContentCarousel";

interface ContentCarouselProps {
  carousel: ContentCarousel;
}

export const ContentCarouselComponent = ({ carousel }: ContentCarouselProps) => {
  return (
    <Carousel>
      {carousel.carouselItems.map((item) => (
        <ContentRenderer key={item?.sys.id} content={item} />
      ))}
    </Carousel>
  );
};
```

## Customization

### CSS Custom Properties

The component uses CSS custom properties for easy theming:

```css
:root {
  --carousel-navigation-size: 2.5rem;
  --carousel-navigation-bg: rgba(255, 255, 255, 0.9);
  --carousel-navigation-color: #333;
  --carousel-navigation-hover-bg: rgba(255, 255, 255, 1);
  --carousel-pagination-bullet-size: 0.5rem;
  --carousel-pagination-bullet-color: rgba(0, 0, 0, 0.3);
  --carousel-pagination-bullet-active-color: #000;
  --carousel-skeleton-bg: #f0f0f0;
}
```

### Custom Styling

```tsx
<Carousel
  className="my-custom-carousel"
  slideClassName="my-custom-slide"
>
  <div>Slide 1</div>
  <div>Slide 2</div>
</Carousel>
```

## Accessibility

- Navigation buttons are properly labeled and keyboard accessible
- Pagination dots are clickable and provide visual feedback
- Touch gestures are supported for mobile devices
- Focus management is handled appropriately

## Performance

- Lazy loading support through Swiper's built-in lazy loading
- Efficient re-rendering with React hooks
- Minimal bundle size with selective Swiper module imports
- Skeleton loading state prevents layout shift during SSR 