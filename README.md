# Jules App Factory

A scalable system for generating high-quality React apps using Jules workforce.

## Overview

This repository is a lightweight factory for generating single-file React apps that deploy to `testing.spike.land`. It's designed for rapid iteration with Jules AI agents, with successful apps synced back to the main spike-land-nextjs monorepo.

## Quick Start

```bash
# Install dependencies
yarn install

# Start the dev server (for previewing apps)
yarn dev

# Initialize a new app
yarn orchestrate:init pomodoro-timer utility

# Get the next task for Jules
yarn orchestrate:next

# Mark task complete
yarn orchestrate:advance pomodoro-timer --success

# Check status
yarn orchestrate:status

# Sync completed apps to monorepo
yarn sync
```

## Architecture

### Pipeline Phases

Each app goes through these phases (one Jules instance per phase):

```
1. PLAN       → Jules creates spec + component structure
2. DEVELOP    → Jules implements the full app
3. TEST       → Jules verifies it works
4. DEBUG      → Jules fixes any issues found
5. POLISH     → Jules improves UI/UX, adds animations
6. COMPLETE   → Ready for sync to monorepo
```

### Directory Structure

```
spike-land-app-factory/
├── apps/                    # Generated apps (one file each)
│   ├── utility/            # Calculators, converters
│   ├── visualization/      # Charts, dashboards
│   ├── productivity/       # Todo lists, planners
│   ├── interactive/        # Games, quizzes
│   ├── health/             # Wellness trackers
│   ├── dogs/               # Dog-related apps
│   └── lucky/              # Random/serendipitous apps
│
├── templates/              # Starter templates for reference
│   ├── basic.tsx          # Minimal starter
│   ├── with-form.tsx      # Form-based apps
│   ├── with-chart.tsx     # Data visualization
│   ├── with-game.tsx      # Interactive games
│   └── with-timer.tsx     # Timer-based apps
│
├── prompts/                # Phase prompt templates
│   ├── plan.md            # Planning phase
│   ├── develop.md         # Development phase
│   ├── test.md            # Testing phase
│   ├── debug.md           # Debugging phase
│   └── polish.md          # Polish phase
│
├── scripts/                # Orchestration scripts
│   ├── orchestrate.ts     # Main state machine
│   ├── deploy-to-live.ts  # Deploy to testing.spike.land
│   ├── sync-to-mono.ts    # Sync to monorepo
│   └── generate-prompt.ts # Generate prompts
│
├── .state/                 # State tracking
│   ├── apps.json          # App metadata
│   └── history/           # Transition logs
│
├── src/                    # Dev server source
│   ├── components/ui/     # shadcn/ui components
│   └── lib/               # Utilities
│
├── JULES.md               # Instructions for Jules agents
└── package.json
```

## Commands

| Command | Description |
|---------|-------------|
| `yarn dev` | Start Vite dev server for previewing |
| `yarn build` | Build for production |
| `yarn orchestrate:init <app> <category>` | Initialize a new app |
| `yarn orchestrate:next` | Get the next task |
| `yarn orchestrate:advance <app> --success\|--failure` | Advance state |
| `yarn orchestrate:status` | Show all app statuses |
| `yarn deploy <app>` | Deploy to testing.spike.land |
| `yarn sync` | Sync completed apps to monorepo |
| `yarn prompt <app> [phase]` | Generate a prompt |

## Categories

| Category | Description | Count |
|----------|-------------|-------|
| Utility | Calculators, converters, generators | 20 |
| Visualization | Charts, dashboards, trackers | 20 |
| Productivity | Todo lists, planners, notes | 20 |
| Interactive | Games, quizzes, puzzles | 55 |
| Health | Wellness and fitness trackers | 50 |
| Dogs | Dog-related apps | 35 |
| Lucky | Random/serendipitous apps | ∞ |

## For Jules Agents

Read `JULES.md` for complete instructions on:
- File structure requirements
- Available shadcn/ui components
- Coding standards
- Testing checklist

## Tech Stack

- **React** 18 with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **recharts** for data visualization
- **lucide-react** for icons
- **Vite** for development

## Syncing to Monorepo

Completed apps are synced to:
```
spike-land-nextjs/packages/react-app-examples/
```

This happens automatically when you run `yarn sync`.

## License

MIT - SPIKE LAND LTD
