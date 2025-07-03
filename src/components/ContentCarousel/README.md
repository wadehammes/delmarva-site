# ContentCarousel Component

A Contentful integration component that renders carousel content using the base Carousel component and ContentRenderer.

## Features

- **Contentful Integration**: Seamlessly works with Contentful CMS carousel content
- **ContentRenderer Support**: Renders any content type supported by ContentRenderer
- **Flexible Configuration**: Inherits all customization options from the base Carousel component
- **Type Safety**: Full TypeScript support with Contentful types

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `carousel` | `ContentCarousel` | **required** | Contentful carousel data |
| `className` | `string` | Optional | Additional CSS classes |
| `showNavigation` | `boolean` | `true` | Whether to show navigation arrows |
| `showPagination` | `boolean` | `true` | Whether to show pagination dots |
| `autoplay` | `boolean` | `false` | Whether to enable autoplay |
| `autoplayDelay` | `number` | `5000` | Autoplay delay in milliseconds |
| `loop` | `boolean` | `true` | Whether to enable infinite loop |
| `slidesPerView` | `number \| "auto"` | `1` | Number of slides to show at once |
| `spaceBetween` | `number` | `30` | Space between slides in pixels |

## Usage

### Basic Usage

```tsx
import { ContentCarouselComponent } from "src/components/ContentCarousel/ContentCarousel.component";
import type { ContentCarousel } from "src/contentful/parseContentCarousel";

interface Props {
  carousel: ContentCarousel;
}

export const MyComponent = ({ carousel }: Props) => {
  return <ContentCarouselComponent carousel={carousel} />;
};
```

### With Custom Configuration

```tsx
<ContentCarouselComponent
  carousel={carousel}
  autoplay={true}
  autoplayDelay={3000}
  slidesPerView={2}
  spaceBetween={20}
  showNavigation={true}
  showPagination={false}
/>
```

### In ContentRenderer

To integrate with the existing ContentRenderer system, you'll need to add the carousel case to the ContentRenderer component:

```tsx
// In ContentRenderer.component.tsx
case "contentCarousel": {
  const parsedCarousel = parseContentCarousel(content as ContentCarouselEntry);
  
  if (!parsedCarousel) {
    return null;
  }
  
  return <ContentCarouselComponent carousel={parsedCarousel} />;
}
```

## Contentful Content Types

This component works with the following Contentful content types that can be included in carousel items:

- `contentGrid` - Grid layouts
- `contentImageBlock` - Image blocks
- `contentStatBlock` - Statistic blocks
- `contentTestimonial` - Testimonial blocks
- `contentVideoBlock` - Video blocks

## Example Contentful Entry

```json
{
  "sys": {
    "id": "carousel-1",
    "contentType": {
      "sys": {
        "id": "contentCarousel"
      }
    }
  },
  "fields": {
    "entryTitle": "Featured Services",
    "slug": "featured-services",
    "carouselItems": [
      {
        "sys": {
          "id": "grid-1",
          "contentType": {
            "sys": {
              "id": "contentGrid"
            }
          }
        }
      },
      {
        "sys": {
          "id": "image-1",
          "contentType": {
            "sys": {
              "id": "contentImageBlock"
            }
          }
        }
      }
    ]
  }
}
```

## Integration with Existing Components

This component follows the same patterns as other Contentful components in the project:

1. **Type Safety**: Uses generated Contentful types
2. **Parser Integration**: Works with existing content parsers
3. **ContentRenderer**: Leverages the existing ContentRenderer for rendering individual items
4. **Error Handling**: Gracefully handles missing or invalid content

## Performance Considerations

- Only renders when carousel items are available
- Inherits performance optimizations from the base Carousel component
- Efficient re-rendering with React hooks
- SSR-safe with skeleton loading states 