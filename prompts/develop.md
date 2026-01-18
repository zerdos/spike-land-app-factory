# Task: Develop the {app-name} App

## Context

You are implementing a React app based on an existing plan.

**App**: {app-name}
**Description**: {app-description}

## Prerequisites

1. Read the plan file: `apps/{category}/{app-name}.plan.md`
2. Review `JULES.md` for coding standards
3. Check `templates/` for similar patterns

## Requirements

### File Structure
Create a single file at: `apps/{category}/{app-name}.tsx`

The file MUST have this structure:
```tsx
// Imports
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// ... other imports

// Types (if needed)
interface MyType {
  // ...
}

// Main component
export default function App() {
  // State
  // Effects
  // Handlers
  // Return JSX
}
```

### Coding Standards
- Use TypeScript with proper types
- Use functional components with hooks
- Use Tailwind CSS classes only (no inline styles)
- Import shadcn/ui components from `@/components/ui/*`
- Import icons from `lucide-react`

### Style Guidelines
- Mobile-first responsive design
- Use semantic color variables (`bg-background`, `text-foreground`)
- Consistent spacing using Tailwind's scale
- Smooth transitions on interactive elements

### Feature Implementation
Follow the plan exactly. Implement all features listed with their acceptance criteria.

## Previous Error (if any)

{last-error}

## Deliverable

Create the file `apps/{category}/{app-name}.tsx` with the complete implementation.

When done, report:
1. What features you implemented
2. Which shadcn/ui components you used
3. Any deviations from the plan and why
4. Line count of the final file
