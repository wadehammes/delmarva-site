"use client";

import { VideoPlayer } from "./VideoPlayer.component";

export const VideoPlayerExample = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>VideoPlayer Examples</h1>

      {/* Basic YouTube Video */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Basic YouTube Video</h2>
        <VideoPlayer
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          width="100%"
          onReady={() => console.log("YouTube video ready")}
        />
      </section>

      {/* Vimeo Video with Custom Settings */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Vimeo Video with Custom Settings</h2>
        <VideoPlayer
          src="https://vimeo.com/123456789"
          controls={true}
          muted={false}
          volume={0.7}
          loop={false}
          showTitle={true}
          width="100%"
          onPlay={() => console.log("Vimeo video playing")}
          onPause={() => console.log("Vimeo video paused")}
        />
      </section>

      {/* Local Video File with Poster */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Local Video File with Poster</h2>
        <VideoPlayer
          src="/videos/presentation.mp4"
          poster="/images/presentation-poster.jpg"
          objectFit="cover"
          controls={true}
          fallbackImage="/images/video-error.jpg"
          onError={(error) => console.error("Video error:", error)}
        />
      </section>

      {/* Responsive Video Container */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Responsive Video Container (16:9 aspect ratio)</h2>
        <div style={{ maxWidth: "800px" }}>
          <VideoPlayer
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="custom-video-player"
            onTimeUpdate={(event) => console.log("Time update:", event)}
            onDurationChange={(event) => console.log("Duration change:", event)}
          />
        </div>
      </section>

      {/* Autoplay Video (Muted) */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Autoplay Video (Muted)</h2>
        <VideoPlayer
          src="https://vimeo.com/123456789"
          playing={true}
          muted={true}
          loop={true}
          controls={false}
          objectFit="cover"
          width="100%"
        />
      </section>

      {/* Video with Custom Styling */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Video with Custom Styling</h2>
        <VideoPlayer
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          width="100%"
          className="custom-video-styles"
          controls={true}
          showTitle={true}
          onEnded={() => console.log("Video ended")}
        />
      </section>

      {/* Multiple Videos Grid */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Multiple Videos Grid</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          <VideoPlayer
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            width="100%"
            controls={true}
            muted={true}
          />
          <VideoPlayer
            src="https://vimeo.com/123456789"
            width="100%"
            controls={true}
            muted={true}
          />
          <VideoPlayer
            src="/videos/sample.mp4"
            width="100%"
            controls={true}
            muted={true}
            fallbackImage="/images/fallback.jpg"
          />
        </div>
      </section>
    </div>
  );
};
