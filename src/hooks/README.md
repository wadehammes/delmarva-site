# Hooks

Custom React hooks and form mutation hooks used across the app. Handbook overview: [docs/handbook/source-layout.md](../../docs/handbook/source-layout.md).

## Browser and lifecycle

### useIsBrowser

Returns **`true`** after client mount (via **`useLayoutEffect`**). Use to gate browser-only APIs or avoid SSR mismatches.

### useDOMCleanup

From [useIsBrowser.ts](./useIsBrowser.ts). Tracks mount state and registers cleanup callbacks—used by GSAP accordions to kill timelines on unmount or locale change.

| Method | Description |
|--------|-------------|
| **`isMounted()`** | Whether the component is still mounted |
| **`addCleanup(fn)`** | Register a cleanup function |
| **`removeCleanup(fn)`** | Unregister a cleanup function |

## Visibility and UI state

### useOptimizedInView

Intersection Observer wrapper for performant in-view detection. Powers **Stat** ticker animation when **`trigger`** is not passed explicitly.

### useModal

Local open/close/toggle state for simple modals.

### useHash

Syncs component state with the URL hash.

### useProjectModal

Jotai-backed project modal (open project by slug). See **`src/atoms/`**.

### useServerLocale

Reads the active locale in client components under localized layouts.

## Form mutations

Thin **`useMutation`** wrappers in **`src/hooks/mutations/`**—each calls **`api.*`** from [src/api/urls.ts](../api/urls.ts):

| File | Form |
|------|------|
| [useSendGeneralInquiryForm.mutation.ts](./mutations/useSendGeneralInquiryForm.mutation.ts) | General Inquiry |
| [useSendRequestAProposalForm.mutation.ts](./mutations/useSendRequestAProposalForm.mutation.ts) | Request a Proposal |
| [useSendJoinOurTeamForm.mutation.ts](./mutations/useSendJoinOurTeamForm.mutation.ts) | Join Our Team |

Keep side effects (toasts, navigation) at the call site when possible. See [docs/handbook/patterns.md](../../docs/handbook/patterns.md).
