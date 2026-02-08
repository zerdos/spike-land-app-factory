#!/usr/bin/env tsx

/**
 * Download codeSpaces from testing.spike.land into local apps/ directory.
 *
 * Usage:
 *   yarn sync:download            # Download new/changed codeSpaces
 *   yarn sync:download --all      # Re-download all codeSpaces
 *   yarn sync:download --new-only # Only download codeSpaces not in local state
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPS_DIR = path.join(__dirname, "../apps");
const STATE_FILE = path.join(__dirname, "../.state/apps.json");
const TESTING_API = "https://testing.spike.land";

interface AppState {
  name: string;
  category: string;
  phase: string;
  attempts?: number;
  liveUrl?: string;
  codeSpaceId?: string;
  lastSyncHash?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface StateFile {
  apps: Record<string, AppState>;
  lastUpdated: string;
}

interface CodeSpaceMeta {
  codeSpace: string;
  codeHash: string;
  updatedAt: string;
}

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

function guessCategory(appName: string): string {
  const dogKeywords = ["dog", "puppy", "breed", "vet", "walk"];
  const healthKeywords = ["medication", "calorie", "workout", "meditation", "breathing", "fasting", "bmi", "sleep"];
  const vizKeywords = ["mood", "habit", "expense", "fitness", "water", "reading", "savings", "heatmap", "chart", "tracker"];
  const prodKeywords = ["todo", "planner", "goals", "note", "bookmark", "flashcard", "meeting", "decision", "priority", "focus"];
  const interKeywords = ["memory-game", "typing", "reaction", "trivia", "wordle", "tic-tac", "rock-paper", "simon"];
  const utilKeywords = ["timer", "converter", "picker", "generator", "formatter", "encoder", "calculator", "diff", "previewer", "regex", "gradient", "stopwatch"];

  const lower = appName.toLowerCase();
  if (dogKeywords.some((k) => lower.includes(k))) return "dogs";
  if (healthKeywords.some((k) => lower.includes(k))) return "health";
  if (interKeywords.some((k) => lower.includes(k))) return "interactive";
  if (vizKeywords.some((k) => lower.includes(k))) return "visualization";
  if (prodKeywords.some((k) => lower.includes(k))) return "productivity";
  if (utilKeywords.some((k) => lower.includes(k))) return "utility";
  return "imported";
}

async function fetchCodeSpaces(): Promise<CodeSpaceMeta[]> {
  const response = await fetch(`${TESTING_API}/api/codespaces`);
  if (!response.ok) {
    throw new Error(`Failed to fetch codespaces: ${response.status}`);
  }
  const data = await response.json() as { codespaces: CodeSpaceMeta[] };
  return data.codespaces;
}

async function fetchSource(codeSpaceId: string): Promise<string> {
  const response = await fetch(`${TESTING_API}/api/codespaces/${codeSpaceId}/source`);
  if (!response.ok) {
    throw new Error(`Failed to fetch source for ${codeSpaceId}: ${response.status}`);
  }
  return response.text();
}

async function main() {
  const args = process.argv.slice(2);
  const allMode = args.includes("--all");
  const newOnly = args.includes("--new-only");

  console.log("Fetching remote codeSpaces...");
  const remoteSpaces = await fetchCodeSpaces();
  console.log(`Found ${remoteSpaces.length} remote codeSpaces`);

  // Filter to c-* codeSpaces (app factory convention)
  const appSpaces = remoteSpaces.filter((cs) => cs.codeSpace.startsWith("c-"));
  console.log(`Found ${appSpaces.length} app codeSpaces (c-* prefix)`);

  if (appSpaces.length === 0) {
    console.log("No app codeSpaces found. Upload some apps first with 'yarn sync:upload'.");
    return;
  }

  const state = loadState();
  let downloaded = 0;
  let skipped = 0;

  for (const cs of appSpaces) {
    const appName = cs.codeSpace.slice(2); // Strip "c-" prefix
    const existingApp = state.apps[appName];

    // --new-only: skip if already in state
    if (newOnly && existingApp) {
      skipped++;
      continue;
    }

    // Check remote codeHash against last seen value (skip if unchanged, unless --all)
    if (!allMode && existingApp?.lastSyncHash === cs.codeHash) {
      skipped++;
      continue;
    }

    console.log(`  Downloading: ${cs.codeSpace} -> ${appName}`);

    try {
      const source = await fetchSource(cs.codeSpace);

      // Determine category
      const category = existingApp?.category || guessCategory(appName);
      const categoryDir = path.join(APPS_DIR, category);
      fs.mkdirSync(categoryDir, { recursive: true });

      // Write file
      const filePath = path.join(categoryDir, `${appName}.tsx`);
      fs.writeFileSync(filePath, source);
      console.log(`    Saved: ${filePath}`);

      // Update state
      if (!state.apps[appName]) {
        state.apps[appName] = {
          name: appName,
          category,
          phase: "develop",
          attempts: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          codeSpaceId: cs.codeSpace,
          lastSyncHash: cs.codeHash,
        };
      } else {
        state.apps[appName].codeSpaceId = cs.codeSpace;
        state.apps[appName].lastSyncHash = cs.codeHash;
        state.apps[appName].updatedAt = new Date().toISOString();
      }

      downloaded++;
    } catch (error) {
      console.error(`    Failed to download ${cs.codeSpace}:`, error);
    }
  }

  saveState(state);
  console.log(`\nDone: ${downloaded} downloaded, ${skipped} skipped`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
