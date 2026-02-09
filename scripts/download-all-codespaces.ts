#!/usr/bin/env tsx

/**
 * Download ALL codeSpaces from testing.spike.land and spike.land.
 *
 * Discovery: Lists R2 bucket keys (r2_html_*) via CF REST API to find codeSpace names.
 * Download: Fetches /live/{name}/session.json for source code.
 *
 * Usage:
 *   yarn download:all              # Download new/missing codeSpaces
 *   yarn download:all --force      # Re-download everything
 *   yarn download:all --testing    # Only from testing.spike.land R2 (esm bucket)
 *   yarn download:all --production # Only from spike.land R2 (npmprod bucket)
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOAD_DIR = path.join(__dirname, "../downloaded");
const MANIFEST_FILE = path.join(DOWNLOAD_DIR, "manifest.json");
const STATE_FILE = path.join(__dirname, "../.state/apps.json");

const ACCOUNT_ID = "1f98921051196545ebe79a450d3c71ed";
const WRANGLER_CONFIG = path.join(
  process.env.HOME || "~",
  "Library/Preferences/.wrangler/config/default.toml",
);

const BUCKETS = {
  testing: "esm",
  production: "npmprod",
} as const;

const SERVERS = {
  testing: "https://testing.spike.land",
  production: "https://spike.land",
} as const;

const CONCURRENCY = 5;

interface SessionData {
  codeSpace: string;
  code: string;
  html: string;
  css: string;
  transpiled: string;
  codeHash?: string;
  [key: string]: unknown;
}

interface ManifestEntry {
  name: string;
  codeHash: string | null;
  downloadedAt: string;
  sourceServer: string;
  sourceBytes: number;
}

interface Manifest {
  entries: Record<string, ManifestEntry>;
  lastUpdated: string;
  totalCount: number;
}

// Read wrangler OAuth token
function getAuthToken(): string {
  if (!fs.existsSync(WRANGLER_CONFIG)) {
    throw new Error(
      `Wrangler config not found at ${WRANGLER_CONFIG}. Run 'wrangler login' first.`,
    );
  }
  const content = fs.readFileSync(WRANGLER_CONFIG, "utf-8");
  const match = content.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!match) {
    throw new Error("Could not parse oauth_token from wrangler config");
  }
  return match[1];
}

// List R2 keys with prefix, handling pagination
async function listR2Keys(
  bucket: string,
  prefix: string,
  token: string,
): Promise<string[]> {
  const keys: string[] = [];
  let cursor: string | undefined;

  console.log(`  Listing R2 keys in bucket "${bucket}" with prefix "${prefix}"...`);

  while (true) {
    const params = new URLSearchParams({
      prefix,
      per_page: "1000",
    });
    if (cursor) {
      params.set("cursor", cursor);
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${bucket}/objects?${params}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `R2 list failed for bucket "${bucket}": ${response.status} ${text}`,
      );
    }

    const data = (await response.json()) as {
      result: { key: string }[];
      result_info?: { cursor?: string; is_truncated?: boolean };
    };

    for (const obj of data.result || []) {
      keys.push(obj.key);
    }

    const info = data.result_info;
    if (info?.is_truncated && info?.cursor) {
      cursor = info.cursor;
      console.log(`    ...${keys.length} keys so far, fetching next page...`);
    } else {
      break;
    }
  }

  console.log(`    Found ${keys.length} keys in "${bucket}"`);
  return keys;
}

// Extract codeSpace name from R2 key like "r2_html_aclock-GuhpaGuh" -> "aclock"
function extractCodeSpaceName(key: string): string {
  // Strip r2_html_ prefix
  let name = key.replace(/^r2_html_/, "");

  // Strip version hash suffix: name-XxxXxXxx (8 chars, mixed case + digits at end)
  // The hash is always exactly 8 chars of base62 appended with a dash
  const hashSuffixMatch = name.match(/^(.+)-[A-Za-z0-9]{8}$/);
  if (hashSuffixMatch) {
    name = hashSuffixMatch[1];
  }

  return name;
}

// Load known app names from .state/apps.json
function getStateAppNames(): string[] {
  if (!fs.existsSync(STATE_FILE)) return [];
  try {
    const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    return Object.keys(state.apps || {}).map((name) => {
      const app = state.apps[name];
      // Use codeSpaceId if available (strip c- prefix for the name)
      return app.codeSpaceId || `c-${name}`;
    });
  } catch {
    return [];
  }
}

// Load existing manifest
function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_FILE)) {
    return { entries: {}, lastUpdated: new Date().toISOString(), totalCount: 0 };
  }
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf-8"));
  } catch {
    return { entries: {}, lastUpdated: new Date().toISOString(), totalCount: 0 };
  }
}

function saveManifest(manifest: Manifest): void {
  manifest.lastUpdated = new Date().toISOString();
  manifest.totalCount = Object.keys(manifest.entries).length;
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

// Fetch session.json from a server
async function fetchSession(
  name: string,
  server: string,
): Promise<SessionData | null> {
  const url = `${server}/live/${name}/session.json`;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return null;
    return (await response.json()) as SessionData;
  } catch {
    return null;
  }
}

// Process a batch of names with controlled concurrency
async function downloadBatch(
  names: string[],
  manifest: Manifest,
  force: boolean,
): Promise<{ downloaded: number; skipped: number; failed: number }> {
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  // Process in chunks of CONCURRENCY
  for (let i = 0; i < names.length; i += CONCURRENCY) {
    const chunk = names.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      chunk.map(async (name) => {
        const filePath = path.join(DOWNLOAD_DIR, `${name}.tsx`);

        // Skip if already downloaded (unless --force)
        if (!force && fs.existsSync(filePath) && manifest.entries[name]) {
          skipped++;
          return;
        }

        // Try testing first, then production
        let session: SessionData | null = null;
        let sourceServer = "";

        session = await fetchSession(name, SERVERS.testing);
        if (session?.code) {
          sourceServer = "testing.spike.land";
        } else {
          session = await fetchSession(name, SERVERS.production);
          if (session?.code) {
            sourceServer = "spike.land";
          }
        }

        if (!session?.code) {
          failed++;
          return;
        }

        // Save source code
        fs.writeFileSync(filePath, session.code);

        // Update manifest
        manifest.entries[name] = {
          name,
          codeHash: (session.codeHash as string) || null,
          downloadedAt: new Date().toISOString(),
          sourceServer,
          sourceBytes: Buffer.byteLength(session.code, "utf-8"),
        };

        downloaded++;
        if (downloaded % 10 === 0) {
          console.log(
            `  Progress: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed (${i + chunk.length}/${names.length} processed)`,
          );
        }
      }),
    );

    // Check for unexpected errors
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("  Unexpected error:", result.reason);
        failed++;
      }
    }
  }

  return { downloaded, skipped, failed };
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const testingOnly = args.includes("--testing");
  const productionOnly = args.includes("--production");

  console.log("=== Download All CodeSpaces ===\n");

  // Get auth token
  const token = getAuthToken();
  console.log("Authenticated with wrangler OAuth token\n");

  // Discover codeSpace names from R2
  const allNames = new Set<string>();

  if (!productionOnly) {
    console.log("Phase 1a: Discovering from testing R2 (esm bucket)...");
    try {
      const keys = await listR2Keys(BUCKETS.testing, "r2_html_", token);
      for (const key of keys) {
        allNames.add(extractCodeSpaceName(key));
      }
    } catch (err) {
      console.error("  Failed to list testing R2:", err);
    }
  }

  if (!testingOnly) {
    console.log("Phase 1b: Discovering from production R2 (npmprod bucket)...");
    try {
      const keys = await listR2Keys(BUCKETS.production, "r2_html_", token);
      for (const key of keys) {
        allNames.add(extractCodeSpaceName(key));
      }
    } catch (err) {
      console.error("  Failed to list production R2:", err);
    }
  }

  // Also include names from local state
  console.log("Phase 1c: Including names from local .state/apps.json...");
  for (const name of getStateAppNames()) {
    allNames.add(name);
  }

  // Remove empty strings
  allNames.delete("");

  const nameList = [...allNames].sort();
  console.log(`\nTotal unique codeSpace names discovered: ${nameList.length}\n`);

  if (nameList.length === 0) {
    console.log("No codeSpaces found. Check your R2 bucket access.");
    return;
  }

  // Ensure download directory exists
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  // Load existing manifest
  const manifest = loadManifest();

  // Download
  console.log(
    `Phase 2: Downloading session.json for each codeSpace (concurrency: ${CONCURRENCY})...`,
  );
  if (force) console.log("  --force mode: re-downloading all files\n");

  const { downloaded, skipped, failed } = await downloadBatch(
    nameList,
    manifest,
    force,
  );

  // Save manifest
  saveManifest(manifest);

  console.log(`\n=== Done ===`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Skipped:    ${skipped}`);
  console.log(`  Failed:     ${failed}`);
  console.log(`  Total in manifest: ${manifest.totalCount}`);
  console.log(`  Manifest: ${MANIFEST_FILE}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
