# VideoPlayer Component

A React component that renders videos using the `react-player` library. Supports YouTube, Vimeo, and local video files with extensive customization options.

## Features

- **Multiple video sources**: YouTube, Vimeo, and local video files
- **Responsive design**: Always responsive with 16:9 aspect ratio
- **Extensive controls**: Play, pause, volume, progress, and more
- **Customizable**: Many props for different use cases
- **Accessible**: Proper ARIA attributes and keyboard navigation support
- **Fallback support**: Optional fallback image when video fails to load
- **Event callbacks**: Comprehensive event handling

## Usage

```tsx
import { VideoPlayer } from '@/components/VideoPlayer/VideoPlayer.component';

// Basic usage with YouTube video
<VideoPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

// Vimeo video with custom controls
<VideoPlayer 
  url="https://vimeo.com/123456789"
  controls={true}
  volume={0.8}
  width="100%"
/>

// Local video file
<VideoPlayer 
  url="/videos/presentation.mp4"
  poster="/images/poster.jpg"
  loop={false}
  muted={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | **required** | URL of the video (YouTube, Vimeo, or local file) |
| `className` | `string` | - | Optional className for additional styling |
| `loop` | `boolean` | `false` | Whether the video should loop |
| `muted` | `boolean` | `false` | Whether the video should be muted |
| `playing` | `boolean` | `false` | Whether the video should play automatically |
| `volume` | `number` | `1` | Volume level (0-1) |
| `controls` | `boolean` | `true` | Whether to show player controls |
| `light` | `boolean` | `false` | Whether to show play/pause button |
| `width` | `string \| number` | `'100%'` | Width of the video container |
| `height` | `string \| number` | `'auto'` | Height of the video container |
| `objectFit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'contain'` | Object fit style for the video |
| `fallbackImage` | `string` | - | Fallback image when video fails to load |
| `progressInterval` | `number` | `1000` | Progress update interval in milliseconds |
| `showTitle` | `boolean` | `false` | Whether to show video title |
| `poster` | `string` | - | Custom poster image |
| `onReady` | `() => void` | - | Callback when video is ready to play |
| `onPlay` | `() => void` | - | Callback when video starts playing |
| `onPause` | `() => void` | - | Callback when video is paused |
| `onEnded` | `() => void` | - | Callback when video ends |
| `onError` | `(error: Error \| string) => void` | - | Callback when video encounters an error |
| `onProgress` | `(state) => void` | - | Callback when video progress changes |
| `onDuration` | `(duration: number) => void` | - | Callback when video duration is loaded |

## Examples

### Basic YouTube Video
```tsx
<VideoPlayer 
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  width="100%"
/>
```

### Vimeo Video with Custom Settings
```tsx
<VideoPlayer 
  url="https://vimeo.com/123456789"
  controls={true}
  muted={false}
  volume={0.7}
  loop={false}
  showTitle={true}
  onReady={() => console.log('Video ready')}
  onPlay={() => console.log('Video playing')}
/>
```

### Local Video File with Poster
```tsx
<VideoPlayer 
  url="/videos/presentation.mp4"
  poster="/images/presentation-poster.jpg"
  objectFit="cover"
  controls={true}
  fallbackImage="/images/video-error.jpg"
/>
```

### Responsive Video Container
```tsx
<VideoPlayer 
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  className="custom-video-player"
  onProgress={(state) => console.log('Progress:', state.played)}
  onDuration={(duration) => console.log('Duration:', duration)}
/>
```

### Autoplay Video (Muted)
```tsx
<VideoPlayer 
  url="https://vimeo.com/123456789"
  playing={true}
  muted={true}
  loop={true}
  controls={false}
  objectFit="cover"
/>
```

## Styling

The component uses CSS modules and follows mobile-first responsive design principles. The video player is always responsive with a 16:9 aspect ratio. You can customize the appearance by:

1. **Using the `className` prop** to add custom styles
2. **Modifying the CSS module** (`VideoPlayer.module.css`)
3. **Using the `objectFit` prop** to control how the video fills the container
4. **Setting custom `width` and `height`** for specific dimensions

### CSS Classes

- `.container`: Main container wrapper with 16:9 aspect ratio
- `.player`: ReactPlayer component positioned absolutely within container

## Browser Support

The component relies on `react-player` which supports:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11+ (with polyfills)

## Performance Considerations

- Videos are not muted by default for better user experience
- Use appropriate video formats and compression for local files
- Consider using `poster` for better loading experience
- YouTube and Vimeo videos are loaded asynchronously
- The 16:9 aspect ratio is maintained across all screen sizes 