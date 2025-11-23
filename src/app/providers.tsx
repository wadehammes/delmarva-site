"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component, type ReactNode } from "react";
import { LocaleProvider } from "src/components/LocaleProvider/LocaleProvider.component";
import type { Locales } from "src/contentful/interfaces";
import { usePreferredTheme } from "src/hooks/usePreferredTheme";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorInfo {
  componentStack: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    try {
      // Log error to console in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error caught by boundary:", error, errorInfo);
      }

      // Check if it's a DOM manipulation error
      if (
        error.message.includes("removeChild") ||
        error.message.includes("Node")
      ) {
        console.warn("DOM manipulation error detected, attempting recovery...");
        // Reset the error state after a short delay to allow recovery
        setTimeout(() => {
          this.setState({ error: undefined, hasError: false });
        }, 100);
      }
    } catch (catchError) {
      // If error handling itself fails, log it but don't throw
      console.error("Error in error boundary:", catchError);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <button
            onClick={() => this.setState({ error: undefined, hasError: false })}
            style={{
              cursor: "pointer",
              margin: "10px",
              padding: "10px 20px",
            }}
            type="button"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
  locale: Locales;
}

function ProvidersContent({ children, locale }: ProvidersProps) {
  // Initialize theme preference
  usePreferredTheme();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default function Providers({ children, locale }: ProvidersProps) {
  return <ProvidersContent locale={locale}>{children}</ProvidersContent>;
}
