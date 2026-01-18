# Task: Polish the {app-name} App

## Context

The app has passed testing. Now make it shine!

**App**: {app-name}
**File**: `apps/{category}/{app-name}.tsx`

## Polish Objectives

### 1. Animations & Transitions

Add smooth, subtle animations where appropriate:

```tsx
// Button hover
className="transition-colors hover:bg-primary/90"

// Card appearance
className="transition-all hover:shadow-lg"

// Progress changes
className="transition-all duration-500"

// Entrance animations
className="animate-in fade-in-50 duration-300"
```

Common Tailwind animation classes:
- `transition-all`, `transition-colors`, `transition-opacity`
- `duration-150`, `duration-300`, `duration-500`
- `ease-in`, `ease-out`, `ease-in-out`

### 2. Visual Polish

Improve the visual design:

**Spacing**
- Consistent margins and padding
- Proper hierarchy with spacing
- Breathing room around elements

**Typography**
- Clear heading hierarchy
- Readable body text (not too small)
- Proper line heights

**Colors**
- Use semantic colors consistently
- Add subtle backgrounds for sections
- Ensure contrast meets accessibility standards

**Borders & Shadows**
- Subtle borders to separate sections
- Appropriate shadow levels
- Rounded corners where suitable

### 3. Micro-interactions

Add delightful touches:

**Hover States**
- Buttons scale slightly or change color
- Cards lift or highlight
- Links show underlines

**Focus States**
- Clear focus rings for keyboard navigation
- Proper outline colors

**Active States**
- Pressed state for buttons
- Selected state for options

### 4. Empty States

Make empty states friendly and helpful:

```tsx
{items.length === 0 && (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">📝</div>
    <h3 className="font-medium mb-2">No items yet</h3>
    <p className="text-sm text-muted-foreground">
      Add your first item to get started
    </p>
  </div>
)}
```

### 5. Loading States

If there are async operations, show loading states:

```tsx
{isLoading ? (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
  </div>
) : (
  // content
)}
```

### 6. Success/Error Feedback

Provide clear feedback for user actions:

```tsx
// Success
<div className="text-sm text-green-600 flex items-center gap-2">
  <Check className="h-4 w-4" />
  Saved successfully!
</div>

// Error
<div className="text-sm text-destructive flex items-center gap-2">
  <X className="h-4 w-4" />
  Something went wrong
</div>
```

### 7. Final Accessibility Pass

- All images have alt text (if any)
- Form inputs have labels
- Buttons have descriptive text or aria-label
- Color contrast is sufficient
- Keyboard navigation works throughout

## What NOT to Do

- Don't add new features
- Don't change core functionality
- Don't over-animate (keep it subtle)
- Don't make it flashy at the expense of usability

## Deliverable

Update the file `apps/{category}/{app-name}.tsx` with polish improvements.

Report:
1. What animations you added
2. What visual improvements you made
3. What micro-interactions you enhanced
4. Final line count

The app is now ready for the COMPLETE phase!
