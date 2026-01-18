#!/usr/bin/env tsx

/**
 * Deploy an app to testing.spike.land/live/{app-name}
 *
 * Usage: yarn deploy <app-name>
 *
 * This script:
 * 1. Reads the app file from apps/{category}/{app-name}.tsx
 * 2. Validates the file structure
 * 3. POSTs to testing.spike.land API
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Constants
// ============================================================================

const APPS_DIR = path.join(__dirname, "../apps");
const STATE_FILE = path.join(__dirname, "../.state/apps.json");
const TESTING_API = "https://testing.spike.land";

// ============================================================================
// Helpers
// ============================================================================

interface AppState {
  name: string;
  category: string;
  phase: string;
  liveUrl?: string;
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

function saveState(state: StateFile): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function findAppFile(appName: string): string | null {
  const state = loadState();
  const app = state.apps[appName];

  if (app) {
    const appFile = path.join(APPS_DIR, app.category, `${appName}.tsx`);
    if (fs.existsSync(appFile)) {
      return appFile;
    }
  }

  // Search all categories
  const categories = fs.readdirSync(APPS_DIR).filter((f) => {
    const stat = fs.statSync(path.join(APPS_DIR, f));
    return stat.isDirectory();
  });

  for (const category of categories) {
    const appFile = path.join(APPS_DIR, category, `${appName}.tsx`);
    if (fs.existsSync(appFile)) {
      return appFile;
    }
  }

  return null;
}

function validateAppFile(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for default export
  if (!/export\s+default\s+function\s+App\s*\(/.test(content)) {
    errors.push("Missing 'export default function App()'");
  }

  // Check for React import
  if (!/import.*from\s+["']react["']/.test(content)) {
    errors.push("Missing React import");
  }

  // Check for direct DOM manipulation (bad practice)
  if (/document\.(getElementById|querySelector|createElement)/.test(content)) {
    errors.push("Avoid direct DOM manipulation - use React state");
  }

  // Check for console.log (should be removed in production)
  if (/console\.log\(/.test(content)) {
    errors.push("Remove console.log statements before deployment");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Deploy
// ============================================================================

async function deployApp(appName: string, dryRun = false): Promise<void> {
  console.log(`🚀 Deploying ${appName}...`);

  // Find the app file
  const appFile = findAppFile(appName);
  if (!appFile) {
    console.error(`❌ App file not found for: ${appName}`);
    console.error(`   Searched in: ${APPS_DIR}/*/${appName}.tsx`);
    process.exit(1);
  }

  console.log(`   Found: ${appFile}`);

  // Read and validate
  const content = fs.readFileSync(appFile, "utf-8");
  const validation = validateAppFile(content);

  if (!validation.valid) {
    console.error(`\n❌ Validation failed:`);
    for (const error of validation.errors) {
      console.error(`   • ${error}`);
    }
    process.exit(1);
  }

  console.log(`   ✅ Validation passed`);

  if (dryRun) {
    console.log(`\n📋 DRY RUN - Would deploy to: ${TESTING_API}/live/${appName}`);
    console.log(`   File size: ${content.length} bytes`);
    return;
  }

  // Deploy to testing.spike.land
  try {
    const response = await fetch(`${TESTING_API}/api/live/${appName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/typescript",
      },
      body: content,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    const liveUrl = `${TESTING_API}/live/${appName}`;

    console.log(`\n✅ Deployed successfully!`);
    console.log(`   URL: ${liveUrl}`);

    // Update state with live URL
    const state = loadState();
    if (state.apps[appName]) {
      state.apps[appName].liveUrl = liveUrl;
      saveState(state);
    }

    return;
  } catch (error) {
    // If the API doesn't exist yet, just log the intended URL
    console.log(`\n⚠️  API deployment not available (mock mode)`);
    console.log(`   Would deploy to: ${TESTING_API}/live/${appName}`);
    console.log(`   File: ${appFile}`);
    console.log(`   Size: ${content.length} bytes`);
  }
}

// ============================================================================
// Main
// ============================================================================

const [, , appName, ...flags] = process.argv;

if (!appName) {
  console.log("Deploy App to testing.spike.land");
  console.log("");
  console.log("Usage: yarn deploy <app-name> [--dry-run]");
  console.log("");
  console.log("Options:");
  console.log("  --dry-run  Validate without deploying");
  process.exit(0);
}

const dryRun = flags.includes("--dry-run");
deployApp(appName, dryRun);
