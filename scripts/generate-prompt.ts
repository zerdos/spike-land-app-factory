#!/usr/bin/env tsx

/**
 * Generate a prompt for a specific app and phase
 *
 * Usage: yarn prompt <app-name> [phase]
 *
 * If no phase is specified, uses the app's current phase.
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Constants
// ============================================================================

const STATE_FILE = path.join(__dirname, "../.state/apps.json");
const PROMPTS_DIR = path.join(__dirname, "../prompts");

type Phase = "plan" | "develop" | "test" | "debug" | "polish";

// ============================================================================
// Helpers
// ============================================================================

interface AppState {
  name: string;
  category: string;
  phase: Phase;
  lastError?: string;
}

interface StateFile {
  apps: Record<string, AppState>;
}

function loadState(): StateFile {
  if (!fs.existsSync(STATE_FILE)) {
    return { apps: {} };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

function loadPromptTemplate(phase: Phase): string {
  const promptFile = path.join(PROMPTS_DIR, `${phase}.md`);
  if (!fs.existsSync(promptFile)) {
    throw new Error(`Prompt template not found: ${promptFile}`);
  }
  return fs.readFileSync(promptFile, "utf-8");
}

function getAppDescription(appName: string): string {
  const descriptions: Record<string, string> = {
    "pomodoro-timer": "Customizable work/break intervals with sounds",
    "unit-converter": "Length, weight, temperature, volume conversions",
    "color-picker": "HSL/RGB/Hex picker with palette generation",
    "dog-weight-tracker": "Weight history with chart",
    "todo-list-classic": "Add, complete, filter tasks",
    "memory-game": "Card matching with levels",
    "breathing-exercise": "Box breathing animation",
    // Add more as needed
  };

  return descriptions[appName] || `A ${appName.replace(/-/g, " ")} application`;
}

function generatePrompt(app: AppState, phase?: Phase): string {
  const usePhase = phase || app.phase;
  const template = loadPromptTemplate(usePhase);

  return template
    .replace(/\{app-name\}/g, app.name)
    .replace(/\{category\}/g, app.category)
    .replace(/\{app-description\}/g, getAppDescription(app.name))
    .replace(/\{last-error\}/g, app.lastError || "None");
}

// ============================================================================
// Main
// ============================================================================

const [, , appName, phase] = process.argv;

if (!appName) {
  console.log("Generate a prompt for a specific app");
  console.log("");
  console.log("Usage: yarn prompt <app-name> [phase]");
  console.log("");
  console.log("Phases: plan, develop, test, debug, polish");
  console.log("");
  console.log("If no phase specified, uses the app's current phase.");
  process.exit(0);
}

const state = loadState();
const app = state.apps[appName];

if (!app) {
  // Create a mock app for prompt generation
  const mockApp: AppState = {
    name: appName,
    category: "utility",
    phase: (phase as Phase) || "plan",
  };

  console.log(`⚠️  App "${appName}" not in state, generating with defaults\n`);
  console.log(generatePrompt(mockApp, phase as Phase));
} else {
  const prompt = generatePrompt(app, phase as Phase);

  console.log("═".repeat(60));
  console.log(`📋 PROMPT FOR: ${app.name}`);
  console.log(`   Category: ${app.category}`);
  console.log(`   Phase: ${phase || app.phase}`);
  console.log("═".repeat(60));
  console.log("");
  console.log(prompt);
}
