# Link Component

A wrapper around Next.js Link for consistent navigation.

Hash-only URLs (`href="#section-id"`) use **`scrollIntoView({ behavior: "smooth" })`**, update the address bar with **`history.replaceState`** (so the browser does not apply a second instant jump from **`location.hash`**), and **`dispatchEvent(HashChangeEvent)`** so **`useHash`** and other listeners stay in sync. Respect **`prefers-reduced-motion`** (`behavior: "auto"` when reduced).

## Usage
```tsx
import { Link } from "src/components/Link/Link.component";

<Link href="/contact">Contact</Link>
``` 