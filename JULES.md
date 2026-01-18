# JULES.md - Instructions for Jules App Factory Agents

Welcome, Jules! This document contains everything you need to know to build
high-quality React apps for spike.land.

---

## Overview

You are building single-file React apps that will be deployed to
`testing.spike.land/live/{app-name}`. Each app must be:

- **Self-contained**: One `.tsx` file with `export default function App()`
- **Styled with Tailwind CSS**: No external CSS files
- **Using shadcn/ui components**: Import from `@/components/ui/*`
- **Responsive**: Mobile-first design that works on all screen sizes
- **Accessible**: Proper ARIA labels, keyboard navigation, semantic HTML

---

## Project Structure

```
spike-land-app-factory/
├── apps/                    # Your generated apps go here
│   ├── utility/            # Calculator, converter apps
│   ├── visualization/      # Charts, graphs, dashboards
│   ├── productivity/       # Todo lists, planners
│   ├── interactive/        # Games, quizzes
│   ├── health/             # Wellness trackers
│   ├── dogs/               # Dog-related apps
│   └── lucky/              # GET LUCKY random apps
│
├── templates/              # Starter templates (read these!)
├── prompts/                # Phase prompts (your instructions)
├── .state/                 # State tracking (don't modify directly)
└── src/components/ui/      # shadcn/ui components
```

---

## App Requirements

### File Structure

Every app must follow this exact structure:

```tsx
// apps/{category}/{app-name}.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// ... other imports

export default function App() {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Effects (if needed)
  useEffect(() => {
    // setup
    return () => {
      // cleanup
    };
  }, [dependencies]);

  // Event handlers
  const handleAction = () => {
    // logic
  };

  // Render
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl">
        {/* App content */}
      </div>
    </div>
  );
}
```

### Styling Guidelines

1. **Use Tailwind CSS classes only** - no inline styles or CSS files
2. **Mobile-first** - start with `className="..."` then add `md:...` `lg:...`
3. **Dark mode support** - use semantic colors (`bg-background`, `text-foreground`)
4. **Consistent spacing** - use Tailwind's spacing scale (4, 8, 16, 24, etc.)
5. **Animations** - use `transition-*` classes for smooth interactions

### Component Usage

Available shadcn/ui components:

```tsx
// Buttons
import { Button } from "@/components/ui/button";
<Button variant="default|secondary|outline|ghost|destructive" size="default|sm|lg|icon">

// Cards
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Forms
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Display
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Layout
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Icons (from lucide-react)
import { Play, Pause, RotateCcw, Plus, Minus, Check, X, Settings, Timer, ... } from "lucide-react";
```

### Data Visualization

For charts and graphs, use recharts:

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  // ...
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
  </LineChart>
</ResponsiveContainer>
```

---

## Phase Instructions

### Phase 1: PLAN

Create a detailed specification in `apps/{category}/{app-name}.plan.md`:

1. **User Stories**: Who uses this? What do they need?
2. **Features**: List all functionality with acceptance criteria
3. **State Design**: What state do you need? What triggers updates?
4. **UI Layout**: Describe the visual structure
5. **Edge Cases**: What could go wrong? How do you handle it?
6. **Component Selection**: Which shadcn/ui components will you use?

### Phase 2: DEVELOP

Implement the app following your plan:

1. Start with the basic structure and state
2. Build the UI piece by piece
3. Add interactivity and event handlers
4. Implement business logic
5. Add local storage persistence (where appropriate)
6. Test all features mentally

### Phase 3: TEST

Verify the app works correctly:

1. Read the code and trace the logic
2. Check all user interactions
3. Verify responsive design
4. Test edge cases (empty state, max values, etc.)
5. Ensure accessibility
6. Report any issues found

### Phase 4: DEBUG

Fix issues found during testing:

1. Analyze the error or unexpected behavior
2. Identify the root cause
3. Implement the fix
4. Verify the fix doesn't break other functionality
5. Document what was fixed

### Phase 5: POLISH

Improve the user experience:

1. Add smooth animations and transitions
2. Improve visual design (spacing, colors, hierarchy)
3. Add micro-interactions (hover states, focus rings)
4. Improve empty states and loading states
5. Add helpful tooltips or instructions
6. Final accessibility audit

---

## Best Practices

### State Management

```tsx
// Good: Derived state
const total = items.reduce((sum, item) => sum + item.value, 0);

// Bad: Redundant state
const [total, setTotal] = useState(0);
useEffect(() => setTotal(items.reduce(...)), [items]);
```

### Local Storage

```tsx
// Load from storage on mount
useEffect(() => {
  const saved = localStorage.getItem("app-data");
  if (saved) {
    setState(JSON.parse(saved));
  }
}, []);

// Save to storage on change
useEffect(() => {
  localStorage.setItem("app-data", JSON.stringify(state));
}, [state]);
```

### Error Handling

```tsx
// Graceful degradation
const handleSubmit = () => {
  try {
    // risky operation
  } catch (error) {
    console.error("Failed:", error);
    setError("Something went wrong. Please try again.");
  }
};
```

### Performance

```tsx
// Memoize expensive calculations
const expensiveResult = useMemo(() => {
  return data.map(item => complexTransform(item));
}, [data]);

// Debounce rapid updates
const debouncedSearch = useMemo(
  () => debounce((query) => setSearch(query), 300),
  []
);
```

---

## Common Patterns

### Timer/Countdown

```tsx
const [seconds, setSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(false);

useEffect(() => {
  if (!isRunning) return;

  const interval = setInterval(() => {
    setSeconds(s => s + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning]);
```

### Form Handling

```tsx
const [formData, setFormData] = useState({ name: "", email: "" });

const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({ ...prev, [field]: e.target.value }));
};

<Input value={formData.name} onChange={handleChange("name")} />
```

### List Operations

```tsx
const addItem = () => setItems([...items, newItem]);
const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
const updateItem = (id: string, updates: Partial<Item>) =>
  setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
```

---

## Quality Checklist

Before marking an app as complete:

- [ ] Single file with `export default function App()`
- [ ] Uses only Tailwind CSS for styling
- [ ] Works on mobile (320px) and desktop (1440px)
- [ ] Has proper loading/empty states
- [ ] Handles errors gracefully
- [ ] Uses semantic HTML elements
- [ ] Has keyboard navigation support
- [ ] Persists data in localStorage (if applicable)
- [ ] No console errors or warnings
- [ ] All features work as specified

---

## Deployment

Apps are deployed to testing.spike.land automatically. The URL pattern is:

```
https://testing.spike.land/live/{app-name}
```

Where `{app-name}` is the filename without `.tsx` extension.

---

## Getting Help

If you're stuck:

1. Check the templates in `templates/` for examples
2. Review similar completed apps in `apps/`
3. Consult the shadcn/ui documentation patterns
4. Break the problem into smaller pieces

Remember: Simple, working code is better than complex, broken code!
