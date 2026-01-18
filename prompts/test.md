# Task: Test the {app-name} App

## Context

You are testing a React app that has been developed.

**App**: {app-name}
**File**: `apps/{category}/{app-name}.tsx`
**Plan**: `apps/{category}/{app-name}.plan.md`

## Testing Process

### 1. Code Review

Read the implementation file and verify:

**Structure**
- [ ] Has `export default function App()`
- [ ] Uses React imports correctly
- [ ] All imports are from allowed sources (@/components/ui/*, lucide-react, recharts)
- [ ] No external CSS imports

**TypeScript**
- [ ] All state has proper types
- [ ] Event handlers have correct parameter types
- [ ] No `any` types used
- [ ] Interfaces/types are defined for complex objects

**React Patterns**
- [ ] No direct DOM manipulation
- [ ] Effects have correct dependencies
- [ ] State updates are immutable
- [ ] No memory leaks (cleanup in useEffect)

### 2. Feature Verification

Compare implementation against the plan:

For each feature in the plan:
- [ ] Feature is implemented
- [ ] All acceptance criteria are met
- [ ] Edge cases are handled

### 3. UI/UX Check

- [ ] Layout looks reasonable at 320px width (mobile)
- [ ] Layout looks reasonable at 1024px width (desktop)
- [ ] Buttons have hover/focus states
- [ ] Inputs are properly labeled
- [ ] Empty states are handled
- [ ] Loading states (if applicable) are present

### 4. Accessibility Audit

- [ ] All interactive elements are keyboard accessible
- [ ] Form inputs have associated labels
- [ ] Color is not the only means of conveying information
- [ ] Touch targets are at least 44x44px on mobile

### 5. Performance Check

- [ ] No unnecessary re-renders (check effect dependencies)
- [ ] Large lists use proper keys
- [ ] Heavy computations are memoized (if needed)

### 6. localStorage (if used)

- [ ] Data is saved on change
- [ ] Data is loaded on mount
- [ ] Handles missing/corrupted data gracefully

## Deliverable

Report your findings:

### Passed
List all checks that passed.

### Issues Found
For each issue:
- **Severity**: Critical / Major / Minor
- **Location**: File and line number
- **Description**: What's wrong
- **Suggested Fix**: How to fix it

### Recommendation

- [ ] **PASS**: Ready for polish phase
- [ ] **FAIL**: Needs fixes in debug phase

If FAIL, clearly explain what must be fixed before proceeding.
