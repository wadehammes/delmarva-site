"use client";

import { VideoPlayer } from "./VideoPlayer.component";

export const VideoPlayerExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "1200px", padding: "2rem" }}>
      <h1>VideoPlayer Examples</h1>

      {/* Basic Video Player */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Basic Video Player</h2>
        <VideoPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
      </section>

      {/* Video with Controls */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Video with Controls</h2>
        <VideoPlayer controls={true} src="https://vimeo.com/123456789" />
      </section>

      {/* Autoplay Video */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Autoplay Video</h2>
        <VideoPlayer
          autoPlay={true}
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        />
      </section>

      {/* Rounded Video Player */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Rounded Video Player</h2>
        <VideoPlayer
          controls={true}
          rounded={true}
          src="/videos/presentation.mp4"
        />
      </section>

      {/* Autoplay with Play in View */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Autoplay with Play in View</h2>
        <VideoPlayer
          autoPlay={true}
          controls={true}
          playInView={true}
          src="https://vimeo.com/123456789"
        />
      </section>

      {/* Multiple Videos Grid */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Multiple Videos Grid</h2>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          <VideoPlayer
            controls={true}
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
          <VideoPlayer
            controls={true}
            rounded={true}
            src="https://vimeo.com/123456789"
          />
          <VideoPlayer
            autoPlay={true}
            controls={true}
            src="/videos/sample.mp4"
          />
        </div>
      </section>
    </div>
  );
};
