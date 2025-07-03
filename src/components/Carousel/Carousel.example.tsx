"use client";

import { Carousel } from "src/components/Carousel/Carousel.component";

/**
 * Example component demonstrating various Carousel configurations
 */
export const CarouselExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Carousel Examples</h2>

      {/* Basic Carousel */}
      <section style={{ marginBottom: "3rem" }}>
        <h3>Basic Carousel</h3>
        <Carousel>
          <div
            style={{
              background: "#f0f0f0",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Slide 1</h4>
            <p>This is the first slide content.</p>
          </div>
          <div
            style={{
              background: "#e0e0e0",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Slide 2</h4>
            <p>This is the second slide content.</p>
          </div>
          <div
            style={{
              background: "#d0d0d0",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Slide 3</h4>
            <p>This is the third slide content.</p>
          </div>
        </Carousel>
      </section>

      {/* Autoplay Carousel */}
      <section style={{ marginBottom: "3rem" }}>
        <h3>Autoplay Carousel</h3>
        <Carousel autoplay={true} autoplayDelay={3000} loop={true}>
          <div
            style={{
              background: "#ffebee",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Auto Slide 1</h4>
            <p>This slide auto-advances every 3 seconds.</p>
          </div>
          <div
            style={{
              background: "#e8f5e8",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Auto Slide 2</h4>
            <p>This slide auto-advances every 3 seconds.</p>
          </div>
          <div
            style={{
              background: "#fff3e0",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Auto Slide 3</h4>
            <p>This slide auto-advances every 3 seconds.</p>
          </div>
        </Carousel>
      </section>

      {/* Multi-slide Carousel */}
      <section style={{ marginBottom: "3rem" }}>
        <h3>Multi-slide Carousel (Responsive)</h3>
        <Carousel
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
          slidesPerView={1}
          spaceBetween={20}
        >
          <div
            style={{
              background: "#e3f2fd",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <h4>Card 1</h4>
            <p>Responsive card content.</p>
          </div>
          <div
            style={{
              background: "#f3e5f5",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <h4>Card 2</h4>
            <p>Responsive card content.</p>
          </div>
          <div
            style={{
              background: "#e8f5e8",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <h4>Card 3</h4>
            <p>Responsive card content.</p>
          </div>
          <div
            style={{
              background: "#fff3e0",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <h4>Card 4</h4>
            <p>Responsive card content.</p>
          </div>
          <div
            style={{
              background: "#fce4ec",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <h4>Card 5</h4>
            <p>Responsive card content.</p>
          </div>
        </Carousel>
      </section>

      {/* Carousel without Navigation */}
      <section style={{ marginBottom: "3rem" }}>
        <h3>Carousel without Navigation (Pagination Only)</h3>
        <Carousel loop={true} showNavigation={false} showPagination={true}>
          <div
            style={{
              background: "#fafafa",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Pagination Only 1</h4>
            <p>Use pagination dots to navigate.</p>
          </div>
          <div
            style={{
              background: "#f5f5f5",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Pagination Only 2</h4>
            <p>Use pagination dots to navigate.</p>
          </div>
          <div
            style={{
              background: "#eeeeee",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Pagination Only 3</h4>
            <p>Use pagination dots to navigate.</p>
          </div>
        </Carousel>
      </section>

      {/* Carousel with Event Handlers */}
      <section style={{ marginBottom: "3rem" }}>
        <h3>Carousel with Event Handlers</h3>
        <Carousel>
          <div
            style={{
              background: "#e1f5fe",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Event Slide 1</h4>
            <p>Check console for slide change events.</p>
          </div>
          <div
            style={{
              background: "#f1f8e9",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Event Slide 2</h4>
            <p>Check console for slide change events.</p>
          </div>
          <div
            style={{
              background: "#fff8e1",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h4>Event Slide 3</h4>
            <p>Check console for slide change events.</p>
          </div>
        </Carousel>
      </section>
    </div>
  );
};
