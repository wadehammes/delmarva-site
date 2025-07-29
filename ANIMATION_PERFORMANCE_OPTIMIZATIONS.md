# Animation Performance Optimizations

This document outlines the performance optimizations implemented to resolve scroll performance issues with animations.

## Issues Identified

1. **Multiple `useInView` hooks** triggering simultaneously during scrolling
2. **Heavy CSS transitions** with `will-change` properties forcing GPU layers
3. **Long transition durations** (0.8s-1s) causing jank during scrolling
4. **Transform animations** triggering layout recalculations

## Optimizations Implemented

### 1. CSS Animation Optimizations

#### Reduced Transition Durations
- **Before**: 0.8s-1s transitions
- **After**: 0.4s-0.5s transitions
- **Impact**: Faster animations, less scroll blocking

#### Improved Easing Functions
- **Before**: `ease-out`
- **After**: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard)
- **Impact**: Smoother, more natural animations

#### Reduced Transform Distances
- **Before**: `translateY(2rem-3rem)`
- **After**: `translateY(1rem-1.5rem)`
- **Impact**: Less dramatic movements, better performance

#### Removed `will-change` Properties
- **Before**: `will-change: transform, opacity` on all animated elements
- **After**: Removed to prevent unnecessary GPU layer creation
- **Impact**: Reduced memory usage and better performance

### 2. Intersection Observer Optimizations

#### Created `useOptimizedInView` Hook
```typescript
// src/hooks/useOptimizedInView.ts
export const useOptimizedInView = (options: UseOptimizedInViewOptions = {}) => {
  const {
    threshold = 0.25,        // Higher threshold for better performance
    rootMargin = "50px 0px", // Earlier triggering to reduce jank
    triggerOnce = true,      // Prevent repeated triggers
    delay = 0,
  } = options;
  
  return useInView({ threshold, rootMargin, triggerOnce, delay });
};
```

#### Optimized Observer Settings
- **Threshold**: Increased from 0.1-0.15 to 0.25
- **Root Margin**: Added 50px buffer for earlier triggering
- **Trigger Once**: Ensured all observers trigger only once
- **Impact**: Reduced observer overhead during scrolling

### 3. Component-Specific Optimizations

#### ContentCopyMediaBlock
- Reduced transition delays from 0.2s-0.5s to 0.1s-0.25s
- Implemented mobile-first responsive design
- Alphabetized CSS properties for maintainability

#### Stat Component
- Optimized GSAP animations with better performance settings
- Reduced intersection observer overhead

#### Accordion Component
- Changed from `triggerOnce: false` to `triggerOnce: true`
- Optimized intersection observer settings

## Performance Best Practices

### CSS Guidelines
1. **Use shorter transition durations** (0.3s-0.5s max)
2. **Prefer `transform` and `opacity`** over layout-changing properties
3. **Avoid `will-change`** unless absolutely necessary
4. **Use mobile-first media queries**
5. **Alphabetize CSS properties** for maintainability

### JavaScript Guidelines
1. **Use optimized intersection observers** with higher thresholds
2. **Implement `triggerOnce: true`** for scroll-triggered animations
3. **Add `rootMargin`** for earlier triggering
4. **Throttle or debounce** scroll event handlers
5. **Use `requestAnimationFrame`** for smooth animations

### Animation Guidelines
1. **Keep animations subtle** - avoid dramatic movements
2. **Use consistent easing functions** across components
3. **Test on lower-end devices** regularly
4. **Monitor FPS** during development
5. **Consider reducing motion** for accessibility

## Testing Performance

### Tools
- Chrome DevTools Performance tab
- Lighthouse performance audits
- React DevTools Profiler
- Browser FPS counters

### Metrics to Monitor
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Time to Interactive (TTI)

### Performance Targets
- **FPS**: Maintain 60fps during scrolling
- **Animation Duration**: Keep under 500ms
- **Observer Threshold**: Use 0.25 or higher
- **Memory Usage**: Monitor for memory leaks

## Future Considerations

1. **Implement intersection observer pooling** for better performance
2. **Add reduced motion support** for accessibility
3. **Consider using CSS `@media (prefers-reduced-motion)`**
4. **Implement virtual scrolling** for long lists
5. **Add performance monitoring** in production

## Files Modified

- `src/components/ContentCopyMediaBlock/ContentCopyMediaBlock.module.css`
- `src/components/ContentCopyMediaBlock/ContentCopyMediaBlock.component.tsx`
- `src/components/Stat/Stat.component.tsx`
- `src/components/Accordion/Accordion.component.tsx`
- `src/hooks/useOptimizedInView.ts` (new)

## Results

- **Improved scroll performance** with smoother animations
- **Reduced layout thrashing** during scroll events
- **Better memory usage** by removing unnecessary GPU layers
- **Consistent animation behavior** across components
- **Enhanced accessibility** with optimized observer settings 