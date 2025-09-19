# ContentfulAssetRenderer Component

A specialized component for rendering Contentful assets (both images and videos) directly from Contentful's Asset API.

## Features

- **Automatic Media Type Detection**: Automatically detects whether an asset is a video or image based on URL patterns
- **Video Support**: Renders video files using the VideoPlayer component with controls
- **Image Support**: Renders images using Next.js Image component with optimization
- **Responsive Design**: Images are styled to be responsive with proper aspect ratios
- **Type Safety**: Full TypeScript support with proper Contentful types

## Usage

```tsx
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";

<ContentfulAssetRenderer asset={contentfulAsset} />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `asset` | `ContentfulAssetEntry` | Yes | The Contentful asset to render (Asset or AssetLink) |

## Supported Media Types

### Video Files
- **File Extensions**: `.mp4`, `.webm`, `.ogg`, `.mov`, `.avi`, `.wmv`, `.flv`, `.mkv`
- **Hosting Domains**: YouTube, Vimeo, Dailymotion
- **Rendering**: Uses VideoPlayer component with controls enabled

### Image Files
- **All other file types** are treated as images
- **Rendering**: Uses Next.js Image component with responsive styling

## Examples

### Basic Usage
```tsx
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";

function MyComponent({ contentfulAsset }) {
  return (
    <div>
      <ContentfulAssetRenderer asset={contentfulAsset} />
    </div>
  );
}
```

### With Error Handling
```tsx
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";

function MyComponent({ contentfulAsset }) {
  if (!contentfulAsset) {
    return <div>No asset available</div>;
  }

  return <ContentfulAssetRenderer asset={contentfulAsset} />;
}
```

## Implementation Details

The component uses the `isVideoUrl` utility function to determine media type based on:
1. File extension patterns
2. Known video hosting domain patterns

For video assets, it renders using the VideoPlayer component with:
- `autoPlay={false}` - Videos don't autoplay by default
- `controls={true}` - Video controls are enabled
- `src={parsedAsset.src}` - The asset URL

For image assets, it renders using Next.js Image with:
- Responsive styling (`width: "100%", height: "auto"`)
- Object fit cover for proper aspect ratio
- Alt text from Contentful asset description
- Width and height from Contentful asset details
