# Pomodoro Timer - Implementation Plan

## 1. User Stories

- As a user, I want to start a 25-minute focus timer so I can concentrate on my work.
- As a user, I want to take a 5-minute short break after my focus session.
- As a user, I want to take a 15-minute long break after several focus sessions.
- As a user, I want to customize the duration of the timers to fit my personal workflow.
- As a user, I want to see the remaining time clearly.
- As a user, I want to hear a sound when the timer finishes so I know to switch tasks.
- As a user, I want to pause and resume the timer if I get interrupted.
- As a user, I want to reset the timer to the beginning of the current interval.

## 2. Features

- **Timer Control**
  - [ ] Start/Pause/Resume functionality
  - [ ] Reset functionality
  - [ ] Skip to next interval

- **Modes**
  - [ ] Focus (Work) mode (default 25 min)
  - [ ] Short Break mode (default 5 min)
  - [ ] Long Break mode (default 15 min)

- **Configuration**
  - [ ] Adjustable duration for each mode
  - [ ] Sound toggle (on/off)
  - [ ] Auto-start breaks (optional)
  - [ ] Auto-start pomodoros (optional)

- **Visual Feedback**
  - [ ] Circular progress indicator or progress bar
  - [ ] Tab title updates with remaining time (e.g., "(24:59) Pomodoro")
  - [ ] Distinct color themes for each mode (e.g., Red for Focus, Teal for Short Break, Blue for Long Break)

- **Audio**
  - [ ] Notification sound on timer completion
  - [ ] "Tick" sound (optional, disabled by default)

## 3. State Design

```typescript
type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface Settings {
  pomodoro: number;   // minutes
  shortBreak: number; // minutes
  longBreak: number;  // minutes
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

interface TimerState {
  mode: TimerMode;
  timeLeft: number; // seconds
  isActive: boolean;
  settings: Settings;
  roundsCompleted: number; // to track when to take long break (usually every 4)
}
```

**Persistence:**
- Save `settings` to `localStorage` so user preferences are remembered.
- Optionally save `roundsCompleted`.
- We won't strictly persist `timeLeft` across page reloads to keep it simple, but we could save the "end time" timestamp if we wanted robust resumption. For this version, resetting on reload is acceptable, but saving `settings` is key.

## 4. Component Structure

- **App Container** (Centering, Theme wrapper)
  - **Header**
    - Title / Logo
    - Settings Button (opens Dialog)
  - **Main Card**
    - **Mode Selector** (Tabs or Buttons: Pomodoro, Short Break, Long Break)
    - **Timer Display** (Large text + Progress Ring)
    - **Controls** (Start/Pause, Skip)
  - **Footer**
    - Task / Status message (e.g., "#1" or "Time to focus!")
  - **Settings Dialog**
    - Inputs for minutes (Pomodoro, Short, Long)
    - Toggles for Auto-start, Sound

## 5. UI/UX Decisions

- **Components**:
  - `Card` for main container.
  - `Button` for controls (large "Start" button).
  - `Tabs` or `ToggleGroup` for mode switching.
  - `Dialog` for settings.
  - `Slider` or `Input` for time adjustments.
  - `Progress` or custom SVG for timer ring.

- **Theme**:
  - **Pomodoro**: Primary Red/Rose
  - **Short Break**: Primary Teal/Cyan
  - **Long Break**: Primary Blue/Indigo
  - The background color of the app should subtly shift to match the mode.

- **Mobile**:
  - Large touch targets for buttons.
  - Settings accessible via an icon button to save space.

## 6. Edge Cases

- **Switching modes while running**: Should pause the current timer and ask for confirmation or just switch and reset? *Decision: Switch and reset to that mode's default time.*
- **Zero duration**: Prevent settings from allowing 0 minutes. Minimum 1 minute.
- **Background tab**: Browsers throttle `setInterval`. *Solution: Use a `Worker` or compare `Date.now()` delta in the `useEffect` to ensure accuracy.*
- **Audio blocking**: Browsers block audio auto-play. *Solution: Audio only plays after user interaction (Start button).*

## 7. Accessibility

- **ARIA**:
  - Timer display should have `role="timer"`.
  - Buttons should have clear labels ("Start Timer", "Open Settings").
- **Keyboard**:
  - Spacebar to toggle Start/Pause (global listener or focused button).
  - Tab navigation through settings.
- **Contrast**:
  - Ensure white text on colored backgrounds is readable (WCAG AA).
