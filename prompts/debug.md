# Task: Debug the {app-name} App

## Context

Issues were found during testing. You need to fix them.

**App**: {app-name}
**File**: `apps/{category}/{app-name}.tsx`

## Previous Error

{last-error}

## Debugging Process

### 1. Understand the Issue

Read the error description carefully. Identify:
- What behavior is expected?
- What behavior is occurring?
- What part of the code is likely responsible?

### 2. Locate the Problem

Read through the implementation file and find:
- The specific function or component causing the issue
- The line numbers involved
- Related state or props

### 3. Analyze Root Cause

Determine WHY the bug exists:
- Logic error in a condition or calculation?
- Missing state update?
- Incorrect event handler?
- Race condition or timing issue?
- Type mismatch?

### 4. Implement the Fix

Make the minimal change needed to fix the issue:
- Don't refactor unrelated code
- Don't add features
- Keep the fix focused and testable

### 5. Verify the Fix

After making changes:
- Does the original issue still occur?
- Did the fix break any other functionality?
- Are there any TypeScript errors?

## Common Issues and Solutions

### State Not Updating
```tsx
// Wrong - mutating state
setItems(items.push(newItem));

// Right - new array
setItems([...items, newItem]);
```

### Effect Running Too Often
```tsx
// Wrong - missing dependency
useEffect(() => {
  doSomething(value);
}, []); // value changes but effect doesn't run

// Right - include dependency
useEffect(() => {
  doSomething(value);
}, [value]);
```

### Timer Not Cleaning Up
```tsx
// Wrong - memory leak
useEffect(() => {
  setInterval(tick, 1000);
}, []);

// Right - cleanup
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

### localStorage Parse Error
```tsx
// Wrong - no error handling
const data = JSON.parse(localStorage.getItem("key"));

// Right - with fallback
const saved = localStorage.getItem("key");
const data = saved ? JSON.parse(saved) : defaultValue;
```

## Deliverable

Update the file `apps/{category}/{app-name}.tsx` with your fixes.

Report:
1. What the root cause was
2. What changes you made
3. How you verified the fix works

If the issue is unclear or cannot be fixed, explain why and request clarification.
