#!/usr/bin/env tsx

/**
 * Jules App Factory Orchestration Script
 *
 * Commands:
 *   yarn orchestrate:init <app-name> <category> - Initialize a new app
 *   yarn orchestrate:next - Get the next task for Jules
 *   yarn orchestrate:advance <app-name> --success|--failure [--reason "..."]
 *   yarn orchestrate:status - Show status of all apps
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Types
// ============================================================================

type Phase = "plan" | "develop" | "test" | "debug" | "polish" | "complete";

interface AppState {
  name: string;
  category: string;
  phase: Phase;
  attempts: number;
  lastError?: string;
  liveUrl?: string;
  codeSpaceId?: string;
  lastSyncHash?: string;
  localFileHash?: string;
  createdAt: string;
  updatedAt: string;
}

interface StateFile {
  apps: Record<string, AppState>;
  lastUpdated: string;
}

// ============================================================================
// Constants
// ============================================================================

const STATE_FILE = path.join(__dirname, "../.state/apps.json");
const PROMPTS_DIR = path.join(__dirname, "../prompts");
const APPS_DIR = path.join(__dirname, "../apps");

const PHASE_ORDER: Phase[] = ["plan", "develop", "test", "debug", "polish", "complete"];

const CATEGORIES = ["utility", "visualization", "productivity", "interactive", "health", "dogs", "lucky", "imported"];

// ============================================================================
// State Management
// ============================================================================

function loadState(): StateFile {
  if (!fs.existsSync(STATE_FILE)) {
    return { apps: {}, lastUpdated: new Date().toISOString() };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

function saveState(state: StateFile): void {
  state.lastUpdated = new Date().toISOString();
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function logHistory(appName: string, event: string, details: object): void {
  const historyDir = path.join(__dirname, "../.state/history");
  fs.mkdirSync(historyDir, { recursive: true });

  const logFile = path.join(historyDir, `${appName}.log`);
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  };

  fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
}

// ============================================================================
// Phase Management
// ============================================================================

function nextPhase(current: Phase): Phase {
  const currentIndex = PHASE_ORDER.indexOf(current);
  if (currentIndex === -1 || currentIndex >= PHASE_ORDER.length - 1) {
    return "complete";
  }
  return PHASE_ORDER[currentIndex + 1];
}

function loadPromptTemplate(phase: Phase): string {
  const promptFile = path.join(PROMPTS_DIR, `${phase}.md`);
  if (!fs.existsSync(promptFile)) {
    throw new Error(`Prompt template not found: ${promptFile}`);
  }
  return fs.readFileSync(promptFile, "utf-8");
}

function generatePrompt(app: AppState): string {
  const template = loadPromptTemplate(app.phase);

  return template
    .replace(/\{app-name\}/g, app.name)
    .replace(/\{category\}/g, app.category)
    .replace(/\{app-description\}/g, getAppDescription(app.name))
    .replace(/\{last-error\}/g, app.lastError || "None");
}

function getAppDescription(appName: string): string {
  // App descriptions from the master list
  const descriptions: Record<string, string> = {
    // Utility Tools
    "pomodoro-timer": "Customizable work/break intervals with sounds",
    "unit-converter": "Length, weight, temperature, volume conversions",
    "color-picker": "HSL/RGB/Hex picker with palette generation",
    "qr-code-generator": "Text/URL to QR code with download",
    "password-generator": "Configurable secure password creation",
    "json-formatter": "Prettify/minify JSON with syntax highlighting",
    "base64-encoder": "Encode/decode text and files",
    "lorem-ipsum-generator": "Configurable placeholder text",
    "countdown-timer": "Event countdown with shareable links",
    "stopwatch": "Lap times, history, export",
    "calculator": "Scientific calculator with history",
    "percentage-calculator": "Tip, discount, markup calculations",
    "age-calculator": "Birthday to exact age converter",
    "bmi-calculator": "With visual health range indicator",
    "mortgage-calculator": "Monthly payments with amortization chart",
    "currency-converter": "Live rates (mock data for demo)",
    "text-diff-tool": "Compare two texts side-by-side",
    "markdown-previewer": "Live markdown to HTML preview",
    "regex-tester": "Pattern testing with match highlighting",
    "gradient-generator": "CSS gradient builder with presets",

    // Data Visualization
    "daily-mood-tracker": "Emoji-based mood logging with trend chart",
    "habit-streak-tracker": "GitHub-style contribution graph",
    "expense-pie-chart": "Category breakdown visualization",
    "fitness-progress": "Weight/measurements over time",
    "sleep-quality-chart": "Sleep duration and quality trends",
    "water-intake-tracker": "Daily hydration with progress ring",
    "reading-goal-tracker": "Books/pages with yearly progress",
    "savings-goal-meter": "Visual progress toward financial goals",
    "workout-stats-dashboard": "Exercise frequency and volume",
    "productivity-heatmap": "Daily focus time visualization",

    // Productivity Apps
    "todo-list-classic": "Add, complete, filter tasks",
    "daily-planner": "Time-blocked schedule",
    "weekly-goals": "Goal setting with progress tracking",
    "note-taking-app": "Simple notes with local storage",
    "bookmark-manager": "Save and organize links",
    "flashcard-study": "Spaced repetition cards",
    "meeting-timer": "Keep meetings on track",
    "decision-maker": "Random choice from options",
    "priority-matrix": "Eisenhower box task sorter",
    "focus-mode": "Distraction blocker countdown",

    // Interactive
    "memory-game": "Card matching with levels",
    "typing-speed-test": "WPM with accuracy tracking",
    "reaction-time-test": "Click speed measurement",
    "trivia-quiz": "Multiple categories with scoring",
    "wordle-clone": "Word guessing game",
    "tic-tac-toe": "Classic game with AI opponent",
    "rock-paper-scissors": "Animated game vs computer",
    "simon-says": "Memory pattern game with sounds",

    // Health
    "medication-reminder": "Schedule and track pills",
    "calorie-counter": "Daily intake tracker",
    "workout-timer": "HIIT/Tabata intervals",
    "meditation-timer": "Guided session with bells",
    "breathing-exercise": "Box breathing animation",
    "fasting-timer": "Intermittent fasting tracker",

    // Dogs
    "dog-weight-tracker": "Weight history with chart",
    "puppy-age-calculator": "Human years equivalent",
    "dog-food-calculator": "Portion sizes by weight",
    "vet-appointment-tracker": "Vaccination schedule",
    "dog-walk-logger": "Duration and distance tracking",
    "training-progress": "Command mastery tracker",
    "breed-identifier-quiz": "Guess the breed game",
    "dog-name-generator": "Name suggestions by style",
  };

  return descriptions[appName] || `A ${appName.replace(/-/g, " ")} application`;
}

// ============================================================================
// Commands
// ============================================================================

function cmdInit(appName: string, category: string): void {
  if (!CATEGORIES.includes(category)) {
    console.error(`Invalid category. Must be one of: ${CATEGORIES.join(", ")}`);
    process.exit(1);
  }

  const state = loadState();

  if (state.apps[appName]) {
    console.error(`App "${appName}" already exists`);
    process.exit(1);
  }

  const app: AppState = {
    name: appName,
    category,
    phase: "plan",
    attempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  state.apps[appName] = app;
  saveState(state);

  // Create app directory
  const appDir = path.join(APPS_DIR, category);
  fs.mkdirSync(appDir, { recursive: true });

  logHistory(appName, "initialized", { category });

  console.log(`✅ Initialized app: ${appName} (${category})`);
  console.log(`   Phase: ${app.phase}`);
  console.log(`\nRun 'yarn orchestrate:next' to get the task prompt.`);
}

function cmdNext(): void {
  const state = loadState();

  // Find apps that need work (not complete)
  const pendingApps = Object.values(state.apps)
    .filter((app) => app.phase !== "complete")
    .sort((a, b) => {
      // Priority: fewer attempts first, then by creation date
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  if (pendingApps.length === 0) {
    console.log("🎉 No pending apps! All apps are complete.");
    console.log("\nRun 'yarn orchestrate:init <app-name> <category>' to add a new app.");
    return;
  }

  const app = pendingApps[0];
  const prompt = generatePrompt(app);

  console.log("═".repeat(60));
  console.log(`📋 JULES TASK`);
  console.log("═".repeat(60));
  console.log(`\nApp:      ${app.name}`);
  console.log(`Category: ${app.category}`);
  console.log(`Phase:    ${app.phase.toUpperCase()}`);
  console.log(`Attempts: ${app.attempts}`);
  if (app.lastError) {
    console.log(`\n⚠️  Previous Error: ${app.lastError}`);
  }
  console.log("\n" + "─".repeat(60));
  console.log("PROMPT:");
  console.log("─".repeat(60));
  console.log(prompt);
  console.log("─".repeat(60));
  console.log(`\nWhen done, run:`);
  console.log(`  yarn orchestrate:advance ${app.name} --success`);
  console.log(`  yarn orchestrate:advance ${app.name} --failure --reason "description"`);
}

function cmdAdvance(appName: string, success: boolean, reason?: string): void {
  const state = loadState();
  const app = state.apps[appName];

  if (!app) {
    console.error(`App "${appName}" not found`);
    process.exit(1);
  }

  const previousPhase = app.phase;

  if (success) {
    app.phase = nextPhase(app.phase);
    app.attempts = 0;
    app.lastError = undefined;

    logHistory(appName, "phase_complete", {
      from: previousPhase,
      to: app.phase,
    });

    console.log(`✅ ${appName}: ${previousPhase} → ${app.phase}`);

    if (app.phase === "complete") {
      console.log(`\n🎉 App "${appName}" is complete!`);
      console.log(`   Run 'yarn sync' to sync to the monorepo.`);
    }
  } else {
    app.attempts++;
    app.lastError = reason || "Unknown failure";

    logHistory(appName, "phase_failed", {
      phase: previousPhase,
      attempt: app.attempts,
      reason: app.lastError,
    });

    console.log(`❌ ${appName}: Failed (attempt ${app.attempts})`);
    console.log(`   Reason: ${app.lastError}`);

    if (app.attempts >= 3) {
      // Move to debug phase if not already there
      if (app.phase !== "debug") {
        app.phase = "debug";
        console.log(`\n⚠️  Moved to DEBUG phase after 3 failures`);
      } else {
        console.log(`\n🚨 App needs manual review - stuck in DEBUG`);
      }
    }
  }

  app.updatedAt = new Date().toISOString();
  saveState(state);
}

function cmdStatus(): void {
  const state = loadState();
  const apps = Object.values(state.apps);

  if (apps.length === 0) {
    console.log("No apps registered yet.");
    console.log("\nRun 'yarn orchestrate:init <app-name> <category>' to start.");
    return;
  }

  console.log("═".repeat(70));
  console.log("📊 APP FACTORY STATUS");
  console.log("═".repeat(70));

  // Group by phase
  const byPhase: Record<Phase, AppState[]> = {
    plan: [],
    develop: [],
    test: [],
    debug: [],
    polish: [],
    complete: [],
  };

  for (const app of apps) {
    byPhase[app.phase].push(app);
  }

  for (const phase of PHASE_ORDER) {
    const phaseApps = byPhase[phase];
    if (phaseApps.length === 0) continue;

    const emoji = {
      plan: "📝",
      develop: "🔨",
      test: "🧪",
      debug: "🐛",
      polish: "✨",
      complete: "✅",
    }[phase];

    console.log(`\n${emoji} ${phase.toUpperCase()} (${phaseApps.length})`);
    console.log("─".repeat(50));

    for (const app of phaseApps) {
      const attempts = app.attempts > 0 ? ` [${app.attempts} attempts]` : "";
      console.log(`  • ${app.name} (${app.category})${attempts}`);
    }
  }

  console.log("\n" + "═".repeat(70));
  console.log(
    `Total: ${apps.length} apps | Complete: ${byPhase.complete.length} | In Progress: ${apps.length - byPhase.complete.length}`
  );
}

// ============================================================================
// Main
// ============================================================================

const [, , command, ...args] = process.argv;

switch (command) {
  case "init":
    if (args.length < 2) {
      console.error("Usage: yarn orchestrate:init <app-name> <category>");
      process.exit(1);
    }
    cmdInit(args[0], args[1]);
    break;

  case "next":
    cmdNext();
    break;

  case "advance":
    if (args.length < 2) {
      console.error("Usage: yarn orchestrate:advance <app-name> --success|--failure [--reason '...']");
      process.exit(1);
    }
    const appName = args[0];
    const success = args.includes("--success");
    const reasonIndex = args.indexOf("--reason");
    const reason = reasonIndex > -1 ? args[reasonIndex + 1] : undefined;
    cmdAdvance(appName, success, reason);
    break;

  case "status":
    cmdStatus();
    break;

  default:
    console.log("Jules App Factory Orchestrator");
    console.log("");
    console.log("Commands:");
    console.log("  init <app-name> <category>  - Initialize a new app");
    console.log("  next                        - Get the next task for Jules");
    console.log("  advance <app-name> --success|--failure [--reason '...']");
    console.log("  status                      - Show status of all apps");
    console.log("");
    console.log("Categories:", CATEGORIES.join(", "));
}
