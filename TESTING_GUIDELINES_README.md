# Testing Guidelines

## Page Object Model (POM) Pattern

### Page Object (PO) Responsibilities
- **Rendering**: Use custom `render` from `test-utils.tsx`
- **API Setup**: Handle `mockApiResponse` setup in render method
- **Extend BasePageObject**: All POs should extend `BasePageObject`
- **NO screen queries**: Don't use `screen.getBy*` in POs
- **NO userEvent interactions**: Don't use `userEvent` in POs
- **NO helper functions**: Don't create helper functions that perform user actions

### Spec File Responsibilities
- **Screen queries**: Use `screen.getBy*`, `screen.queryBy*` for element selection
- **User interactions**: Use `userEvent` for all user interactions directly in tests
- **Assertions**: All expect statements and assertions
- **Test logic**: Arrange-Act-Assert pattern with line breaks

## API Mocking

### Mock API Functions (not mutation hooks)
```typescript
jest.mock('src/api/urls')
const mockApi = jest.mocked(api)
```

### Use mockApiResponse Helper
```typescript
import { mockApiResponse } from 'src/tests/mocks/mockApiResponse'

// In PO setupApiMocks method - simplified usage
setupApiMocks() {
  mockApiResponse(true, this.mockHubspotLeadGeneration)
  mockApiResponse(true, this.mockResendProjectRequest)
}

// With custom responses (optional)
setupApiMocks() {
  mockApiResponse(true, this.mockApiFunction, customResponse, customError)
}
```

## Test Structure

### Arrange-Act-Assert with Line Breaks
```typescript
describe('Component', () => {
  let po: ComponentPO
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    jest.clearAllMocks()
    po = new ComponentPO()
    user = userEvent.setup()
  })

  it('should handle form submission', async () => {
    // Arrange
    po.setupApiMocks()
    po.render()

    const nameInput = screen.getByLabelText(/name/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Act
    await user.type(nameInput, 'John Doe')
    await user.click(submitButton)

    // Assert
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  })
})
```

## User Interactions

### Do User Actions Directly in Spec Files
```typescript
// ✅ Correct - Direct user interactions
const nameInput = screen.getByLabelText(/name/i)
await user.type(nameInput, 'John Doe')

const submitButton = screen.getByRole('button', { name: /submit/i })
await user.click(submitButton)

// ❌ Wrong - Helper functions for user actions
await fillInputByLabel(/name/i, 'John Doe')
await clickButtonByText(/submit/i)
```

### Setup userEvent in beforeEach
```typescript
let user: ReturnType<typeof userEvent.setup>

beforeEach(() => {
  user = userEvent.setup()
})
```

## Assertions

### Single Expect per waitFor
```typescript
// ✅ Correct - One expect per waitFor
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})

await waitFor(() => {
  expect(po.mockApiFunction).toHaveBeenCalledWith(expectedData)
})

// ❌ Wrong - Multiple expects in one waitFor
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
  expect(po.mockApiFunction).toHaveBeenCalledWith(expectedData)
})
```

### Separate waitFor for Different Assertions
```typescript
// ✅ Correct - Separate waitFor for different types of assertions
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})

await waitFor(() => {
  expect(po.mockApiFunction).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
  })
})
```

## PO File Structure

### Basic PO Template
```typescript
// ComponentPO.po.tsx
import { render } from 'src/tests/testUtils'
import { BasePageObject } from 'src/tests/basePageObject.po'
import { mockApiResponse } from 'src/tests/mocks/mockApiResponse'
import { api } from 'src/api/urls'

jest.mock('src/api/urls')
const mockApi = jest.mocked(api)

export class ComponentPO extends BasePageObject {
  public mockApiFunction = mockApi.someFunction

  constructor(props?: { debug?: boolean; raiseOnFind?: boolean }) {
    super(props)
  }

  setupApiMocks() {
    mockApiResponse(true, this.mockApiFunction)
  }

  render() {
    return render(<Component />)
  }
}
```

### Spec File Structure
```typescript
// Component.spec.tsx
import { screen, waitFor } from 'src/tests/testUtils'
import userEvent from '@testing-library/user-event'
import { ComponentPO } from './Component.po'

describe('Component', () => {
  let po: ComponentPO
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    jest.clearAllMocks()
    po = new ComponentPO()
    user = userEvent.setup()
  })

  // All test logic, screen queries, userEvent interactions
})
```

## Code Quality

### Avoid Redundant Comments
- Don't comment obvious assertions
- Use descriptive test names instead

### Reset Mocks in beforeEach
```typescript
beforeEach(() => {
  jest.clearAllMocks()
})
```

### Use Proper TypeScript
- No `any` types
- Use proper interfaces and types
- Import types from helper files when needed

### Use Absolute Imports
```typescript
// ✅ Correct
import { render } from 'src/tests/testUtils'

// ❌ Wrong
import { render } from '../../tests/testUtils'
```

## File Organization

### Import Order
1. React imports
2. Testing library imports
3. User event imports
4. Component imports
5. PO imports
6. Mock setup

### Mock Setup
```typescript
jest.mock('react-google-recaptcha', () => {
  return React.forwardRef<HTMLDivElement>((props, ref) => (
    <div ref={ref} data-testid="recaptcha-mock" />
  ))
})

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
}))
```

## Common Patterns

### Form Testing
```typescript
it('submits form with correct data', async () => {
  po.setupApiMocks()
  po.render()

  const nameInput = screen.getByLabelText(/name/i)
  const emailInput = screen.getByLabelText(/email/i)
  const submitButton = screen.getByRole('button', { name: /submit/i })

  await user.type(nameInput, 'John Doe')
  await user.type(emailInput, 'john@example.com')
  await user.click(submitButton)

  await waitFor(() => {
    expect(po.mockApiFunction).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })
})
```

### Error Testing
```typescript
it('shows error message on API error', async () => {
  po.setupApiMocks()
  po.render()

  // Fill form and submit
  const submitButton = screen.getByRole('button', { name: /submit/i })
  await user.click(submitButton)

  await waitFor(() => {
    expect(screen.getByText(/error message/i)).toBeInTheDocument()
  })
})
```

# Provisioner Component Testing Guidelines

These rules and best practices must be followed for all component tests in this codebase:

## 1. Mock API Functions with jest.mock
- Use `jest.mock('src/api/urls', ...)` to mock API functions at the top of the test file.
- Access and set mock responses via `require('src/api/urls')` inside each test.

## 2. Use userEvent for User Interactions
- Always use `userEvent` for typing, clicking, and other user actions.

## 3. No TypeScript/Runtime Errors
- Use proper TypeScript types - never use `any`.
- Use helper functions from `src/tests/helpers/apiMocks.ts` for API mocking.
- Use helper functions from `src/tests/helpers/formHelpers.ts` for form interactions.

## 4. Arrange-Act-Assert Pattern
- Clearly separate setup, action, and assertion phases in each test.
- Add line breaks between these phases for readability.

## 5. Helper Functions for DRYness
- Use helpers like `fillForm` and `submitForm` to avoid repetition.
- Use shared helpers from `/src/tests/helpers/` for common operations.

## 6. No Redundant Comments
- Only add comments if they clarify non-obvious logic.

## 7. Consistent Mock Reset
- Use `jest.clearAllMocks()` in a `beforeEach` to reset mocks between tests.

## 8. Test Coverage
- Render and check all key UI elements.
- Validate all user input and error states.
- Test both success and failure API responses.
- Test all interactive elements (e.g., checkboxes, buttons).

## 9. Use Page Object Model (POM)
- Create a `.po.tsx` file for each component with complex interactions.
- Use regular methods (not getters) for page object actions and assertions.
- Keep test logic separate from UI interaction logic.
- Page objects should handle rendering, API mocking, and setup only.
- Initialize page object in `beforeEach` for each test suite.

## 10. Proper TypeScript Types
- Never use `any` - use proper types for all parameters and return values.
- Use `MockedFunction<T>` for mocked functions.
- Use `Record<string, unknown>` for object types.
- Use proper interfaces for complex types.

---

**All new and refactored tests must follow these guidelines.** 