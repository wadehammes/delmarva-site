"use client";

import { Component, type ReactNode } from "react";

interface HeaderMediaErrorBoundaryProps {
  children: ReactNode;
}

interface HeaderMediaErrorBoundaryState {
  hasError: boolean;
}

export class HeaderMediaErrorBoundary extends Component<
  HeaderMediaErrorBoundaryProps,
  HeaderMediaErrorBoundaryState
> {
  constructor(props: HeaderMediaErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[Header Media Error]", error.message, error.stack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            alignItems: "center",
            aspectRatio: "16 / 9",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <p style={{ color: "var(--colors-gray)", margin: 0 }}>
            Image unavailable
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
