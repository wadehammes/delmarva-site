"use client";

import { Component, type ReactNode } from "react";

interface MapErrorBoundaryProps {
  children: ReactNode;
}

interface MapErrorBoundaryState {
  hasError: boolean;
}

export class MapErrorBoundary extends Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  constructor(props: MapErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Map Error]", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: "min(500px, 45vh)",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--colors-gray)", margin: 0 }}>
            Map unavailable
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
