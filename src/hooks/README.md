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

### useStableFieldId

Stable **`id`** for form controls: explicit **`id` prop**, else **`{prefix}-{name}`**, else React **`useId()`**. Used by Input, TextArea, Select, FileInput, and Checkbox.

### useProjectModal

Jotai-backed project modal (open project by slug). See **`src/atoms/`**. URL-synced lists render a single **`ProjectModalHost`** at the carousel/list level; cards with **`syncUrlOnOpen`** only open the shared modal via the atom.

### useServerLocale

Reads the active locale in client components under localized layouts.

## Form mutations

Thin **`useMutation`** wrappers in **`src/hooks/mutations/`**—each calls **`api.*`** from [src/api/urls.ts](../api/urls.ts):

| File | Form |
|------|------|
| [useSendGeneralInquiryForm.mutation.ts](./mutations/useSendGeneralInquiryForm.mutation.ts) | General Inquiry |
| [useSendRequestAProposalForm.mutation.ts](./mutations/useSendRequestAProposalForm.mutation.ts) | Request a Proposal |
| [useSendJoinOurTeamForm.mutation.ts](./mutations/useSendJoinOurTeamForm.mutation.ts) | Join Our Team |
| [useTriggerDeploy.mutation.ts](./mutations/useTriggerDeploy.mutation.ts) | Refresh-content deploy trigger |

### Deploy monitoring

[useDeployMonitor.ts](./useDeployMonitor.ts) orchestrates refresh-content deploy UX: **`useTriggerDeployMutation`** → **`api.deploy.trigger`**, **`useQuery`** for active/status polling via **`deployQueryKeys`**, and **`localStorage`** persistence per target (**`startedAt`** from the click is kept through trigger success). Status polling uses **`staleTime: 0`**, stops when Vercel reports a terminal state or **`monitoring: false`**, and uses **`refetchIntervalInBackground: true`**. Terminal Sonner toasts re-evaluate on the 1s elapsed timer (**`elapsedMs`**) as well as on status poll updates so **Refresh complete** / **Refresh may be complete** fire without a page refresh. [DeployButton.component.tsx](../components/DeployButton/DeployButton.component.tsx) is a thin wrapper around this hook.
