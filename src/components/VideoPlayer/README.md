# VideoPlayer Component

A React component that renders videos using the `react-player` library. Supports YouTube, Vimeo, and local video files with a simplified, focused API.

## Features

- **Multiple video sources**: YouTube, Vimeo, and local video files
- **Responsive design**: Always responsive with 16:9 aspect ratio
- **Autoplay support**: Optional autoplay with viewport detection
- **Rounded corners**: Optional rounded styling
- **SSR safe**: Uses `useIsBrowser` hook for client-side rendering
- **Debounced play**: Prevents rapid play/pause toggles

## Usage

```tsx
import { VideoPlayer } from '@/components/VideoPlayer/VideoPlayer.component';

// Basic usage with YouTube video
<VideoPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

// Autoplay video with controls
<VideoPlayer 
  src="https://vimeo.com/123456789"
  autoPlay={true}
  controls={true}
/>

// Rounded video player
<VideoPlayer 
  src="/videos/presentation.mp4"
  rounded={true}
  controls={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | URL of the video (YouTube, Vimeo, or local file) |
| `autoPlay` | `boolean` | `false` | Whether the video should play automatically |
| `controls` | `boolean` | `false` | Whether to show player controls |
| `playInView` | `boolean` | `false` | Whether to play when in view (with 200ms debounce) |
| `rounded` | `boolean` | `false` | Whether to apply rounded corners |

## Examples

### Basic Video Player
```tsx
<VideoPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
```

### Video with Controls
```tsx
<VideoPlayer 
  src="https://vimeo.com/123456789"
  controls={true}
/>
```

### Autoplay Video
```tsx
<VideoPlayer 
  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  autoPlay={true}
/>
```

### Rounded Video Player
```tsx
<VideoPlayer 
  src="/videos/presentation.mp4"
  rounded={true}
  controls={true}
/>
```

### Autoplay with Play in View
```tsx
<VideoPlayer 
  src="https://vimeo.com/123456789"
  autoPlay={true}
  playInView={true}
  controls={true}
/>
```

## Styling

The component uses CSS modules and follows mobile-first responsive design principles. The video player is always responsive with a 16:9 aspect ratio.

### CSS Classes

- `.videoPlayer`: Main container wrapper with 16:9 aspect ratio
- `.rounded`: Applies border-radius and overflow hidden for rounded corners

## Browser Support

The component relies on `react-player` which supports:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11+ (with polyfills)

## Performance Considerations

- Videos are muted by default for better autoplay compatibility
- Uses debounced play detection to prevent rapid toggles
- SSR-safe with client-side only rendering
- YouTube and Vimeo videos are loaded asynchronously
- The 16:9 aspect ratio is maintained across all screen sizes 