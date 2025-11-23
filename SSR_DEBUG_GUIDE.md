# SSR (Server-Side Rendering) Debugging Guide

## 🚨 Issue: ReferenceError: document is not defined

This error occurs when client-side code tries to access browser APIs (`document`, `window`, etc.) during server-side rendering.

### ✅ Fixes Applied

1. **Modal Component**: Added client-side mounting checks
2. **Navigation Component**: Added client-side mounting checks
3. **Proper SSR Handling**: Components now wait for client-side hydration

### 🔧 Root Cause

The error was caused by:
- Direct access to `document.body` in `createPortal`
- Direct access to `document` and `window` in `useEffect` hooks
- No client-side mounting checks

### 🛠️ Solutions Implemented

#### 1. Modal Component Fix
```typescript
// Before (Problematic)
export const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    document.addEventListener("keydown", handleEscape); // ❌ SSR Error
    document.body.style.overflow = "hidden"; // ❌ SSR Error
  }, []);

  return createPortal(modalContent, document.body); // ❌ SSR Error
};

// After (Fixed with useIsBrowser hook)
export const Modal = ({ isOpen, onClose, children }) => {
  const isBrowser = useIsBrowser(); // ✅ Reusable hook

  useEffect(() => {
    if (!isBrowser) return; // ✅ Skip during SSR

    document.addEventListener("keydown", handleEscape); // ✅ Safe
    document.body.style.overflow = "hidden"; // ✅ Safe
  }, [isBrowser]);

  if (!isBrowser) return null; // ✅ Don't render during SSR

  return createPortal(modalContent, document.body); // ✅ Safe
};
```

#### 2. Navigation Component Fix
```typescript
// Before (Problematic)
useEffect(() => {
  window.addEventListener("scroll", handleScroll); // ❌ SSR Error
  document.getElementById("section"); // ❌ SSR Error
}, []);

// After (Fixed with useIsBrowser hook)
const isBrowser = useIsBrowser(); // ✅ Reusable hook

useEffect(() => {
  if (!isBrowser) return; // ✅ Skip during SSR

  window.addEventListener("scroll", handleScroll); // ✅ Safe
  document.getElementById("section"); // ✅ Safe
}, [isBrowser]);
```

### 📋 Best Practices for SSR

#### 1. Always Check for Client-Side Mounting
```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// Use isMounted before accessing browser APIs
if (!isMounted) return null;
```

#### 3. Use useIsBrowser Hook
```typescript
// Create a custom hook
export const useIsBrowser = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  return isBrowser;
};

// Use in components
const isBrowser = useIsBrowser();
if (!isBrowser) return null;
```

#### 4. Conditional Rendering
```typescript
// Render different content for SSR vs client
{typeof window !== 'undefined' ? (
  <ClientOnlyComponent />
) : (
  <SSRFallback />
)}
```

### 🔍 Common SSR Issues

#### 1. Browser APIs
- `document` - DOM manipulation
- `window` - Browser window object
- `localStorage` - Browser storage
- `sessionStorage` - Session storage
- `navigator` - Browser information

#### 2. Third-Party Libraries
- GSAP animations
- Chart libraries
- Map components
- Video players

#### 3. Event Listeners
- Scroll events
- Resize events
- Keyboard events
- Mouse events

### 🚀 Prevention Strategies

#### 1. Component Structure
```typescript
"use client"; // ✅ Mark client components

export const Component = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Early return for SSR
  if (!isMounted) {
    return <div>Loading...</div>; // Or null
  }

  // Safe to use browser APIs here
  return <div>Client-side content</div>;
};
```

#### 2. Hook Pattern
```typescript
const useClientOnly = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
};
```

#### 3. Error Boundaries
```typescript
class SSRErrorBoundary extends React.Component {
  componentDidCatch(error) {
    if (error.message.includes('document is not defined')) {
      // Handle SSR errors gracefully
    }
  }
}
```

### 📊 Testing SSR

#### 1. Build Test
```bash
# Test production build
pnpm run build
pnpm run start

# Check for SSR errors in console
```

#### 2. Development Test
```bash
# Test in development
pnpm run dev

# Disable JavaScript to test SSR-only rendering
```

#### 3. Lighthouse Test
```bash
# Test with Lighthouse
npx lighthouse https://your-site.com --view
```

### 🎯 Expected Results

After applying these fixes:
- ✅ No more "document is not defined" errors
- ✅ Proper SSR rendering
- ✅ Smooth client-side hydration
- ✅ Better user experience
- ✅ Improved SEO (proper SSR)

### 📞 If Issues Persist

1. Check all components for browser API usage
2. Use `grep` to search for `document.` and `window.`
3. Add error boundaries around problematic components
4. Consider using `dynamic` imports for browser-only components
5. Test with JavaScript disabled to verify SSR works

### 🔄 Maintenance

- Regularly audit components for SSR compatibility
- Add SSR tests to your CI/CD pipeline
- Monitor for SSR-related errors in production
- Keep dependencies updated (some may have SSR fixes) 