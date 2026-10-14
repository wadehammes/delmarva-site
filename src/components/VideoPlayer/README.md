# VideoPlayer Component

A React component that renders videos with [react-player](https://github.com/cookpete/react-player). Supports YouTube, Vimeo, direct files, and Contentful asset URLs.

## Features

- **Multiple video sources**: YouTube, Vimeo, and local / CDN video files
- **Responsive design**: 16:9 aspect ratio by default; optional fill mode for hero backgrounds
- **Autoplay support**: Optional autoplay with viewport-driven `playInView`
- **Rounded corners**: Optional rounded styling
- **SSR safe**: Loads react-player on the client via `next/dynamic`

## Usage

```tsx
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";

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
| `src` | `string` | **required** | URL of the video (YouTube, Vimeo, or file) |
| `autoPlay` | `boolean` | `false` | Whether the video should play automatically |
| `controls` | `boolean` | `false` | Whether to show player controls |
| `playInView` | `boolean` | `false` | Play while true (debounced 200ms); pause when false |
| `fill` | `boolean` | `false` | Fill the parent height with cover-style video (hero backgrounds) |
| `loop` | `boolean` | file URLs loop; embeds do not | Whether the video should loop |
| `rounded` | `boolean` | `false` | Whether to apply rounded corners |
| `title` | `string` | `"Video player"` | Accessible title for the player |

## Examples

### Video with Controls

```tsx
<VideoPlayer src="https://vimeo.com/123456789" controls={true} />
```

### Hero background (play when in view)

```tsx
<VideoPlayer fill playInView={inView} src={mediaUrl} />
```

## Styling

The component uses CSS modules. Default layout keeps a 16:9 aspect ratio; `fill` removes the aspect ratio and uses `object-fit: cover` on the underlying video element.
