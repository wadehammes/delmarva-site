import { isVideoUrl } from "./videoUrl.helpers";

describe("videoUrl.helpers", () => {
  describe("isVideoUrl", () => {
    it("should return true for video file extensions", () => {
      expect(isVideoUrl("video.mp4")).toBe(true);
      expect(isVideoUrl("video.webm")).toBe(true);
      expect(isVideoUrl("video.ogg")).toBe(true);
      expect(isVideoUrl("video.mov")).toBe(true);
      expect(isVideoUrl("video.avi")).toBe(true);
      expect(isVideoUrl("video.wmv")).toBe(true);
      expect(isVideoUrl("video.flv")).toBe(true);
      expect(isVideoUrl("video.mkv")).toBe(true);
    });

    it("should return true for URLs with video extensions", () => {
      expect(isVideoUrl("https://example.com/video.mp4")).toBe(true);
      expect(isVideoUrl("http://cdn.example.com/assets/video.webm")).toBe(true);
      expect(isVideoUrl("/path/to/video.ogg")).toBe(true);
    });

    it("should return true for video hosting domains", () => {
      expect(isVideoUrl("https://youtube.com/watch?v=123")).toBe(true);
      expect(isVideoUrl("https://www.youtube.com/watch?v=123")).toBe(true);
      expect(isVideoUrl("https://youtu.be/123")).toBe(true);
      expect(isVideoUrl("https://vimeo.com/123")).toBe(true);
      expect(isVideoUrl("https://www.vimeo.com/123")).toBe(true);
      expect(isVideoUrl("https://dailymotion.com/video/123")).toBe(true);
      expect(isVideoUrl("https://www.dailymotion.com/video/123")).toBe(true);
    });

    it("should return false for non-video URLs", () => {
      expect(isVideoUrl("https://example.com")).toBe(false);
      expect(isVideoUrl("https://example.com/image.jpg")).toBe(false);
      expect(isVideoUrl("https://example.com/document.pdf")).toBe(false);
      expect(isVideoUrl("https://example.com/page.html")).toBe(false);
    });

    it("should return false for empty or null input", () => {
      expect(isVideoUrl("")).toBe(false);
      expect(isVideoUrl(null as unknown as string)).toBe(false);
      expect(isVideoUrl(undefined as unknown as string)).toBe(false);
    });

    it("should be case insensitive", () => {
      expect(isVideoUrl("video.MP4")).toBe(true);
      expect(isVideoUrl("video.WebM")).toBe(true);
      expect(isVideoUrl("https://YOUTUBE.com/watch?v=123")).toBe(true);
      expect(isVideoUrl("https://VIMEO.com/123")).toBe(true);
    });

    it("should handle mixed case URLs", () => {
      expect(isVideoUrl("https://Example.com/Video.MP4")).toBe(true);
      expect(isVideoUrl("https://YouTube.com/Watch?v=123")).toBe(true);
    });
  });
});
