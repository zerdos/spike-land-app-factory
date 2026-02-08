#!/usr/bin/env tsx

/**
 * Upload changed local apps to testing.spike.land codeSpaces.
 *
 * Usage:
 *   yarn sync:upload --all          # Upload all apps
 *   yarn sync:upload <app-name>     # Upload a specific app
 */

import * as crypto from "crypto";
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
  localFileHash?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface StateFile {
  apps: Record<string, AppState>;
  lastUpdated: string;
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

function md5(str: string): string {
  return crypto.createHash("md5").update(str).digest("hex");
}

function findAppFile(appName: string, category?: string): string | null {
  if (category) {
    const appFile = path.join(APPS_DIR, category, `${appName}.tsx`);
    if (fs.existsSync(appFile)) return appFile;
  }

  // Search all categories
  const categories = fs.readdirSync(APPS_DIR).filter((f) => {
    try {
      return fs.statSync(path.join(APPS_DIR, f)).isDirectory();
    } catch {
      return false;
    }
  });

  for (const cat of categories) {
    const appFile = path.join(APPS_DIR, cat, `${appName}.tsx`);
    if (fs.existsSync(appFile)) return appFile;
  }

  return null;
}

async function uploadApp(appName: string, code: string, codeSpaceId: string): Promise<boolean> {
  const response = await fetch(`${TESTING_API}/live/${codeSpaceId}/api/code`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, run: true }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`    API error: ${response.status} - ${error}`);
    return false;
  }

  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const allMode = args.includes("--all");
  const specificApp = args.find((a) => !a.startsWith("--"));

  const state = loadState();
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  // Determine which apps to upload
  let appsToUpload: string[];
  if (specificApp) {
    appsToUpload = [specificApp];
  } else if (allMode) {
    appsToUpload = Object.keys(state.apps);
  } else {
    // Upload only changed apps (hash mismatch)
    appsToUpload = Object.keys(state.apps);
  }

  for (const appName of appsToUpload) {
    const app = state.apps[appName];
    const category = app?.category;
    const appFile = findAppFile(appName, category);

    if (!appFile) {
      console.log(`  Skipping ${appName}: file not found`);
      skipped++;
      continue;
    }

    const code = fs.readFileSync(appFile, "utf-8");
    const localHash = md5(code);
    const codeSpaceId = app?.codeSpaceId || `c-${appName}`;

    // Skip unchanged files unless --all or specific app requested
    // Compare against localFileHash (our own md5 hex), not lastSyncHash (server format)
    if (!allMode && !specificApp && app?.localFileHash === localHash) {
      skipped++;
      continue;
    }

    console.log(`  Uploading: ${appName} -> ${codeSpaceId}`);

    try {
      const success = await uploadApp(appName, code, codeSpaceId);
      if (success) {
        console.log(`    Uploaded successfully`);

        // Update state
        if (!state.apps[appName]) {
          state.apps[appName] = {
            name: appName,
            category: category || "imported",
            phase: "develop",
            attempts: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            codeSpaceId,
            localFileHash: localHash,
          };
        } else {
          state.apps[appName].codeSpaceId = codeSpaceId;
          state.apps[appName].localFileHash = localHash;
          state.apps[appName].liveUrl = `${TESTING_API}/live/${codeSpaceId}`;
          state.apps[appName].updatedAt = new Date().toISOString();
        }

        uploaded++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`    Failed to upload ${appName}:`, error);
      failed++;
    }
  }

  saveState(state);
  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
