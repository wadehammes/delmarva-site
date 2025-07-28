# LocaleSwitcherSelect Component

A fully accessible language switcher component that allows users to change the website's language between English and Spanish.

## Accessibility Features

### Screen Reader Support
- **Proper labeling**: Uses `aria-label` and `aria-describedby` for clear identification
- **Live announcements**: Announces loading states, success, and error messages
- **Status updates**: Provides feedback when language changes occur
- **Descriptive text**: Includes helpful descriptions for each language option

### Keyboard Navigation
- **Full keyboard support**: Can be operated entirely with keyboard
- **Focus management**: Clear focus indicators with proper outline styles
- **Space/Enter support**: Standard select element behavior maintained

### Visual Accessibility
- **High contrast support**: Enhanced focus styles for high contrast mode
- **Loading states**: Visual and programmatic indication of loading
- **Error handling**: Clear error messages and fallback behavior
- **Disabled states**: Proper styling when component is disabled

### ARIA Attributes
- `aria-busy`: Indicates when language switching is in progress
- `aria-describedby`: Links to descriptive text
- `aria-label`: Provides accessible name
- `aria-live`: Announces dynamic content changes
- `aria-hidden`: Hides decorative elements from screen readers

### Error Handling
- Prevents rapid successive language switches
- Provides fallback to current language on errors
- Announces errors to screen readers
- Maintains component state consistency

## Usage

```tsx
import LocaleSwitcherSelect from 'src/components/LocaleSwitcherSelect/LocaleSwitcherSelect.component';

// Use in your component
<LocaleSwitcherSelect />
```

## Supported Languages

- 🇺🇸 English (`en`)
- 🇲🇽 Español (`es`)

## Browser Support

- Modern browsers with full accessibility support
- Screen reader compatible (NVDA, JAWS, VoiceOver, TalkBack)
- High contrast mode support
- Reduced motion support (via CSS media queries) 