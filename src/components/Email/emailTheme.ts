export const emailTheme = {
  colors: {
    blue: "#93c5fd",
    gray: "#9ca3af",
    green: "#34d399",
    orange: "#fdba74",
  },
  container: {
    margin: "0 auto",
    maxWidth: "560px",
    padding: "12px 16px 24px",
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 14,
    margin: 0,
    textAlign: "center" as const,
  },
  footerWrapper: {
    paddingTop: 12,
  },
  heading: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 20px",
    padding: "0",
    textAlign: "center" as const,
  },
  label: {
    color: "#e5e7eb",
    fontSize: "14px",
    fontWeight: 600,
    margin: "16px 0 2px",
    padding: "0",
  },
  link: {
    color: "#93c5fd",
    textDecoration: "underline",
  },
  main: {
    backgroundColor: "#1f1d1d",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  },
  section: {
    backgroundColor: "#2d2a2a",
    borderRadius: "8px",
    margin: "20px 0",
    padding: "20px",
  },
  text: {
    color: "#e5e7eb",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "4px 0",
  },
  textBlock: {
    color: "#e5e7eb",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0 0 6px",
    padding: "0",
  },
  textBlockLast: {
    color: "#e5e7eb",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
    padding: "0",
  },
} as const;
