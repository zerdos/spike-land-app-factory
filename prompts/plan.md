# Task: Plan the {app-name} App

## Context

You are building a React app for spike.land. The app will be deployed to:
`https://testing.spike.land/live/{app-name}`

Read the JULES.md file for complete instructions on:
- File structure requirements
- Available components
- Coding standards

## App Description

**{app-name}**: {app-description}

## Your Task

Create a detailed implementation plan. Write this to:
`apps/{category}/{app-name}.plan.md`

## Plan Structure

Your plan must include:

### 1. User Stories
- Who is the target user?
- What problem does this solve?
- What are the key use cases?

### 2. Features
List each feature with acceptance criteria:
```
- Feature Name
  - [ ] Criterion 1
  - [ ] Criterion 2
```

### 3. State Design
- What state variables do you need?
- What are their types?
- What triggers state changes?
- Will you persist to localStorage? What data?

### 4. Component Structure
Even though it's a single file, plan the logical sections:
- Header/title area
- Main content area
- Controls/inputs
- Results/output
- Settings (if applicable)

### 5. UI/UX Decisions
- Which shadcn/ui components will you use?
- What's the visual hierarchy?
- Mobile vs desktop layout considerations
- Color choices and theming

### 6. Edge Cases
- Empty state (no data yet)
- Error states
- Maximum/minimum values
- Invalid input handling

### 7. Accessibility
- Keyboard navigation plan
- ARIA labels needed
- Color contrast considerations

## Deliverable

Create the file `apps/{category}/{app-name}.plan.md` with your complete plan.

When done, report what you created and any questions or concerns you have about the implementation.
