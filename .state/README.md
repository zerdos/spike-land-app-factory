# State Directory

This directory tracks the progress of apps through the Jules App Factory pipeline.

## Files

- `apps.json` - Master state file containing all app metadata and current phase
- `history/` - Log files for each app showing state transitions

## State Structure

```json
{
  "apps": {
    "app-name": {
      "name": "app-name",
      "category": "utility",
      "phase": "develop",
      "attempts": 0,
      "lastError": null,
      "liveUrl": "https://testing.spike.land/live/app-name",
      "createdAt": "2026-01-18T00:00:00.000Z",
      "updatedAt": "2026-01-18T00:00:00.000Z"
    }
  },
  "lastUpdated": "2026-01-18T00:00:00.000Z"
}
```

## Phases

1. `plan` - Creating specification and design
2. `develop` - Implementing the app
3. `test` - Verifying functionality
4. `debug` - Fixing issues found during testing
5. `polish` - UI/UX improvements
6. `complete` - Ready for sync to monorepo

## Commands

```bash
# Initialize a new app
yarn orchestrate:init pomodoro-timer utility

# Get next task
yarn orchestrate:next

# Advance app state
yarn orchestrate:advance pomodoro-timer --success
yarn orchestrate:advance pomodoro-timer --failure --reason "Timer not working"

# Check status
yarn orchestrate:status
```

## DO NOT

- Edit `apps.json` directly - use the orchestration scripts
- Delete history logs - they're useful for debugging pipeline issues
