const { copyFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const nextDir = join(process.cwd(), ".next");
const source = join(nextDir, "routes-manifest.json");
const deterministic = join(nextDir, "routes-manifest-deterministic.json");

if (existsSync(source) && !existsSync(deterministic)) {
  copyFileSync(source, deterministic);
}
