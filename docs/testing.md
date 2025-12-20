# Testing Documentation

## Overview

The AgentAuri.AI project uses Jest and React Testing Library to ensure code quality and maintainability. The test suite includes 180+ test cases across 1,795 lines of test code, covering hooks, components, and utility functions.

## Quick Start

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (re-runs tests on file changes)
pnpm test:watch

# Coverage report
pnpm test:coverage

# CI mode (optimized for continuous integration)
pnpm test:ci

# Run specific test file
pnpm test -- use-pixel-animation.test.ts

# Run specific test by name
pnpm test -- -t "should initialize with idle phase"
```

### Coverage Requirements

All metrics must meet **80% minimum** threshold:
- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## Test Files

| File | Location | Lines | Tests | Purpose |
|------|----------|-------|-------|---------|
| use-pixel-animation.test.ts | /src/hooks/ | 690 | 40+ | Animation hook logic |
| logo.test.tsx | /src/components/ui/ | 667 | 80+ | Logo component rendering |
| utils.test.ts | /src/lib/ | 438 | 60+ | Utility function behavior |

## Test Coverage

### 1. use-pixel-animation.test.ts

Tests for the pixel animation hook (`src/hooks/use-pixel-animation.ts`)

**Test Categories:**
- **Initial State** (3 tests) - Validates initial hook state with different configurations
- **Boot Animation Sequence** (6 tests) - Tests progressive pixel reveal during boot animation
- **Glitch Functionality** (7 tests) - Verifies glitch effect triggers and behavior
- **Reset Functionality** (4 tests) - Tests reset to initial state and animation cancellation
- **Cleanup on Unmount** (3 tests) - Ensures proper resource cleanup
- **Edge Cases** (8 tests) - Tests boundary conditions (zero pixels, large numbers, rapid calls)
- **Return Value Structure** (2 tests) - Validates hook API contract

**Key Test Scenarios:**
- Initial state with autoPlay true/false
- Progressive pixel reveal during boot animation
- Transition to pulse phase after boot completion
- onBootComplete callback invocation
- Glitch triggering from pulse and idle phases
- Animation frame cancellation on unmount
- Handling of edge cases (0, 1, 10000 pixels)

### 2. logo.test.tsx

Tests for the Logo component (`src/components/ui/logo.tsx`)

**Test Categories:**
- **Rendering with Default Props** (4 tests) - Basic rendering and structure validation
- **Rendering with Custom Text** (4 tests) - Custom text and character handling
- **Variants** (6 tests) - Hero, compact, and icon variant testing
- **Accessibility Attributes** (3 tests) - ARIA labels and semantic HTML
- **Click Interactions** (6 tests) - Click handlers in different phases
- **Different Animation Phases** (7 tests) - Pixel visibility in boot, pulse, glitch phases
- **Animation Configuration** (5 tests) - Custom durations and callbacks
- **Glow Effect** (5 tests) - Glow styling for different variants
- **Custom Class Names** (3 tests) - className merging and application
- **SVG Rendering** (3 tests) - SVG structure and attributes
- **PIXEL_LETTERS Export** (4 tests) - Letter matrix validation
- **Edge Cases** (5 tests) - Empty text, special characters, case handling
- **Integration** (2 tests) - Integration with usePixelAnimation hook

### 3. utils.test.ts

Tests for the cn utility function (`src/lib/utils.ts`)

**Test Categories:**
- **Basic Functionality** (8 tests) - String merging and falsy value handling
- **Conditional Classes** (5 tests) - Object and array-based conditional classes
- **Tailwind CSS Conflict Resolution** (10 tests) - Tailwind class conflict handling
- **Responsive and Variant Classes** (6 tests) - Responsive and pseudo-class handling
- **Real-World Use Cases** (6 tests) - Component composition scenarios
- **Edge Cases** (9 tests) - Whitespace, special characters, duplicates
- **TypeScript Type Safety** (5 tests) - Type checking and return values
- **Performance Considerations** (3 tests) - High-volume argument handling
- **Integration** (2 tests) - clsx and twMerge integration

## Test Configuration

### jest.config.ts

- Uses Next.js Jest configuration
- Test environment: jsdom
- Module name mapping for @ alias
- Coverage thresholds: 80% for all metrics
- Ignores .next and node_modules directories

### jest.setup.ts

- Imports @testing-library/jest-dom matchers
- Mocks window.matchMedia
- Mocks requestAnimationFrame/cancelAnimationFrame
- Mocks performance.now()
- Mocks IntersectionObserver
- Suppresses common warning messages

## Common Testing Patterns

### Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
    jest.useFakeTimers()
  })

  afterEach(() => {
    // Cleanup after each test
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Feature Category', () => {
    it('should do something specific', () => {
      // Arrange: Set up test conditions
      const component = render(<Component />)

      // Act: Perform action
      fireEvent.click(screen.getByRole('button'))

      // Assert: Verify result
      expect(screen.getByText('Expected')).toBeInTheDocument()
    })
  })
})
```

### Testing Conditional Rendering

```typescript
it('should show element when condition is true', () => {
  render(<Component condition={true} />)
  expect(screen.getByText('Visible')).toBeInTheDocument()
})

it('should hide element when condition is false', () => {
  render(<Component condition={false} />)
  expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
})
```

### Testing Async Behavior

```typescript
it('should load data asynchronously', async () => {
  render(<Component />)

  expect(screen.getByText('Loading...')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

### Testing User Events

```typescript
it('should handle click', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick} />)

  fireEvent.click(screen.getByRole('button'))

  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Testing Hooks

```typescript
it('should update state', () => {
  const { result } = renderHook(() => useCustomHook())

  expect(result.current.count).toBe(0)

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})
```

## Common Assertions

### React Testing Library

```typescript
// Element queries
screen.getByRole('button')
screen.getByText('Hello')
screen.getByLabelText('Email')
screen.queryByText('Optional') // Returns null if not found
screen.findByText('Async') // Returns promise

// Assertions
expect(element).toBeInTheDocument()
expect(element).toHaveAttribute('aria-label', 'Logo')
expect(element).toHaveClass('active')
expect(element).not.toBeVisible()

// User interactions
fireEvent.click(button)
fireEvent.change(input, { target: { value: 'new value' } })
```

### Jest Matchers

```typescript
// Basic
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTruthy()
expect(value).toBeDefined()

// Numbers
expect(value).toBeGreaterThan(5)
expect(value).toBeLessThanOrEqual(10)

// Strings
expect(string).toContain('substring')
expect(string).toMatch(/regex/)

// Arrays/Objects
expect(array).toHaveLength(3)
expect(array).toContain(item)
expect(object).toHaveProperty('key', 'value')

// Functions
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledTimes(2)
expect(fn).toHaveBeenCalledWith(arg1, arg2)

// Negation
expect(value).not.toBe(other)
```

## Timer Utilities

```typescript
// Use fake timers
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

// Advance timers
act(() => {
  jest.advanceTimersByTime(1000) // Advance 1 second
})

// Run all timers
act(() => {
  jest.runAllTimers()
})
```

## Mocking

```typescript
// Mock module
jest.mock('@/hooks/use-pixel-animation')

// Mock function
const mockFn = jest.fn()
mockFn.mockReturnValue('value')
mockFn.mockResolvedValue('async value')
mockFn.mockImplementation(() => 'custom')

// Mock hook
const mockUseHook = useHook as jest.MockedFunction<typeof useHook>
mockUseHook.mockReturnValue({
  data: 'test',
  loading: false,
})

// Restore mocks
jest.clearAllMocks() // Clear call history
jest.resetAllMocks() // Clear + reset implementation
jest.restoreAllMocks() // Restore original implementation
```

## Debugging

```typescript
// View component output
screen.debug() // Prints DOM to console

// View specific element
screen.debug(screen.getByRole('button'))

// Get all test names
pnpm test -- --listTests

// Run with verbose output
pnpm test -- --verbose

// Run specific test file
pnpm test -- logo.test.tsx

// Run specific test by name
pnpm test -- -t "should render with compact variant"
```

### View Coverage Report

After running `pnpm test:coverage`, open `coverage/lcov-report/index.html` in a browser.

## Troubleshooting

### "Not wrapped in act(...)" warning

```typescript
// Wrap state updates in act()
act(() => {
  result.current.updateState()
})
```

### "Can't perform React state update on unmounted component"

```typescript
// Ensure cleanup in useEffect
useEffect(() => {
  let mounted = true

  fetchData().then(data => {
    if (mounted) setState(data)
  })

  return () => { mounted = false }
}, [])
```

### "Unable to find element"

```typescript
// Use queryBy for elements that might not exist
const element = screen.queryByText('Optional')
expect(element).not.toBeInTheDocument()

// Use findBy for async elements
const element = await screen.findByText('Async')
```

### Flaky tests

```typescript
// Use waitFor for eventually true conditions
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument()
}, { timeout: 3000 })
```

### Tests timeout

Increase timeout with `jest.setTimeout(10000)` in test file

### Animation tests are flaky

Always use `jest.useFakeTimers()` and advance timers explicitly with `jest.advanceTimersByTime()`

### Module not found errors

Check `moduleNameMapper` in jest.config.ts matches your path aliases

### Tests pass locally but fail in CI

Use `pnpm test:ci` to run in CI mode locally

## Best Practices

1. **Test behavior, not implementation**
   - Test what users see and do, not internal state
   - Use accessible queries (getByRole, getByLabelText)

2. **Keep tests independent**
   - Each test should run in isolation
   - Don't rely on test execution order

3. **Use descriptive test names**
   - Start with "should"
   - Describe expected behavior clearly

4. **Arrange-Act-Assert pattern**
   - Setup → Action → Verification

5. **Mock external dependencies**
   - API calls, timers, browser APIs
   - Keep tests fast and deterministic

6. **Test edge cases**
   - Empty states, error states
   - Boundary conditions
   - Invalid inputs

7. **Maintain coverage**
   - Aim for 80%+ coverage
   - Focus on critical paths

8. **Keep tests readable**
   - Avoid complex logic in tests
   - Use helper functions for common setups
   - Comment complex scenarios

## CI/CD Integration

The test suite is designed for CI/CD integration:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: pnpm test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Mocking Strategy

### Animation APIs

- `requestAnimationFrame` and `cancelAnimationFrame` are mocked using setTimeout/clearTimeout
- `performance.now()` is mocked to return Date.now()
- Jest fake timers are used for time-dependent tests

### React Hooks

- `usePixelAnimation` is mocked in logo.test.tsx to isolate component testing
- Mock return values provide full control over animation state

### Browser APIs

- `window.matchMedia` is mocked for responsive behavior testing
- `IntersectionObserver` is mocked for viewport-based features

## Adding New Tests

When adding new tests:

1. **Group Related Tests**: Use describe blocks to group related test cases
2. **Clear Test Names**: Use "should" statements that describe expected behavior
3. **Test One Thing**: Each test should verify a single behavior
4. **Mock Dependencies**: Mock external dependencies appropriately
5. **Clean Up**: Use cleanup functions to reset state between tests
6. **Document Complex Tests**: Add comments for complex test scenarios
7. **Test Edge Cases**: Include tests for boundary conditions
8. **Maintain Coverage**: Ensure new code meets 80% coverage threshold

## Maintenance

### Regular Tasks

- Run tests before each commit
- Update tests when features change
- Add tests for new features before implementation (TDD)
- Review coverage reports to identify untested code paths
- Refactor flaky tests immediately
- Keep documentation updated

### Performance Optimization

- Use `jest --maxWorkers=4` to control parallelization
- Skip unnecessary beforeEach/afterEach when not needed
- Use `test.skip` or `describe.skip` for temporarily disabled tests

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Test Statistics

| Metric | Value |
|--------|-------|
| **Total Test Files** | 3 |
| **Total Test Lines** | 1,795 |
| **Total Test Cases** | 180+ |
| **Coverage Target** | 80% |
| **Test Categories** | 25+ |
| **Test Execution Time** | <10 seconds (local) |
| **Flaky Tests** | 0 |

## Future Enhancements

Potential improvements for the test suite:
1. Visual regression testing with Chromatic or Percy
2. Integration tests for full user flows
3. Performance benchmarking tests
4. Accessibility testing with axe-core
5. E2E tests with Playwright or Cypress
6. Mutation testing for test quality verification
7. Contract testing for API integrations
8. Load testing for animation performance
