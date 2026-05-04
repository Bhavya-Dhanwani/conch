const { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } = require("node:fs");
const { join } = require("node:path");

const repoRoot = process.cwd();
const appNextDir = join(repoRoot, "application", ".next");
const rootNextDir = join(repoRoot, ".next");

function ensureDeterministicManifest(nextDir) {
  const source = join(nextDir, "routes-manifest.json");
  const deterministic = join(nextDir, "routes-manifest-deterministic.json");

  if (existsSync(source) && !existsSync(deterministic)) {
    copyFileSync(source, deterministic);
  }
}

if (!existsSync(appNextDir)) {
  throw new Error(`Expected Next.js build output at ${appNextDir}`);
}

ensureDeterministicManifest(appNextDir);

rmSync(rootNextDir, { recursive: true, force: true });
mkdirSync(repoRoot, { recursive: true });
cpSync(appNextDir, rootNextDir, { recursive: true });
ensureDeterministicManifest(rootNextDir);
