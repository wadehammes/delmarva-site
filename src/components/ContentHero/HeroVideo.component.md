# HeroVideo Component

A specialized video component designed for use as background media in ContentHero sections.

## Features

- **Background Video Support**: Optimized for hero section background videos
- **Autoplay**: Automatically plays when loaded (muted for browser compliance)
- **Loop**: Continuously loops the video
- **No Controls**: Hidden controls for seamless background experience
- **Responsive**: Scales to fill the container with proper aspect ratio
- **Cross-Platform**: Supports YouTube, Vimeo, and direct video files

## Usage

```tsx
import { HeroVideo } from "src/components/ContentHero/HeroVideo.component";

<HeroVideo src="https://example.com/video.mp4" />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `src` | `string` | Yes | The video source URL (supports YouTube, Vimeo, or direct video files) |

## Supported Video Sources

- **Direct Video Files**: `.mp4`, `.webm`, `.ogg`, `.mov`, `.avi`, `.wmv`, `.flv`, `.mkv`
- **YouTube**: `youtube.com`, `youtu.be` URLs
- **Vimeo**: `vimeo.com` URLs
- **Dailymotion**: `dailymotion.com` URLs

## Browser Compatibility

- Only renders on the client side (uses `useIsBrowser` hook)
- Automatically mutes videos to comply with browser autoplay policies
- Falls back gracefully if video cannot be loaded

## Styling

The component is styled to:
- Fill the entire container (`position: absolute`, `inset: 0`)
- Maintain aspect ratio with `object-fit: cover`
- Work seamlessly with ContentHero overlay and content layers 