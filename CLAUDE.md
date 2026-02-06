# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Jules App Factory — a pipeline for generating single-file React apps using AI agents (Jules). Apps deploy to `testing.spike.land/live/{app-name}` and sync to the `spike-land-nextjs` monorepo when complete.

## Commands

```bash
# Dev server (port 5173, previews templates and generated apps)
yarn dev

# Build (runs tsc then vite build)
yarn build

# Lint (eslint, zero warnings allowed)
yarn lint

# Orchestration
yarn orchestrate:init <app-name> <category>   # Initialize new app
yarn orchestrate:next                          # Get next pending task
yarn orchestrate:advance <app> --success       # Advance to next phase
yarn orchestrate:advance <app> --failure --reason "msg"  # Record failure
yarn orchestrate:status                        # Show all apps by phase

# Deployment & sync
yarn deploy <app-name>           # Deploy to testing.spike.land (validates first)
yarn sync                        # Sync COMPLETE apps to spike-land-nextjs monorepo
yarn prompt <app-name> [phase]   # Generate phase-specific prompt for Jules
```

Scripts are TypeScript, run via `tsx` (e.g., `tsx scripts/orchestrate.ts next`).

## Architecture

### 6-Phase Pipeline

Each app progresses: **PLAN → DEVELOP → TEST → DEBUG → POLISH → COMPLETE**

- State tracked in `.state/apps.json` with history logs in `.state/history/`
- After 3 consecutive failures in a phase, auto-downgrades to DEBUG
- Phase prompts live in `prompts/{plan,develop,test,debug,polish}.md`

### App Constraints

- **Single-file**: Each app is one `.tsx` file at `apps/{category}/{app-name}.tsx`
- **Export**: Must use `export default function App()`
- **Styling**: Tailwind CSS only (no CSS files, no inline styles), dark mode via semantic tokens (`bg-background`, `text-foreground`)
- **Components**: shadcn/ui from `@/components/ui/*` (16+ components in `src/components/ui/`)
- **Icons**: `lucide-react`
- **Charts**: `recharts`
- **3D**: `three`, `@react-three/fiber`, `@react-three/drei`

### Categories

`apps/` contains subdirectories: utility, visualization, productivity, interactive, health, dogs, lucky

### Key Directories

- `scripts/` — Orchestration (`orchestrate.ts`), deployment (`deploy-to-live.ts`), monorepo sync (`sync-to-mono.ts`), prompt generation (`generate-prompt.ts`)
- `templates/` — 5 starter templates: basic, with-form, with-chart, with-game, with-timer
- `prompts/` — Phase-specific prompt templates with `{app-name}`, `{category}`, `{app-description}`, `{last-error}` placeholders
- `src/components/ui/` — shadcn/ui component library
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `.state/` — Pipeline state (apps.json + history logs)

### Path Aliases (vite.config.ts + tsconfig.json)

- `@` → `./src`
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`

### Deployment

- `deploy-to-live.ts` validates app structure (proper exports, no DOM manipulation, no console.log) before POSTing to testing.spike.land
- `sync-to-mono.ts` copies COMPLETE apps to `../spike-land-nextjs/packages/react-app-examples/`, auto-generates `index.ts` and `README.md`

## Tech Stack

- React 18 + TypeScript (strict mode) + Vite 5
- Tailwind CSS 3.4 + tailwindcss-animate
- shadcn/ui (Radix UI primitives)
- recharts, lucide-react, three/r3f
- Node >=20, Yarn, ES modules
