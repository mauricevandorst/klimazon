import chokidar from "chokidar";
import { mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const SRC = "src";
const DOCS = "docs";

function ensureDirs() {
  mkdirSync(path.join(DOCS, "css"), { recursive: true });
  mkdirSync(path.join(DOCS, "js"), { recursive: true });
  mkdirSync(path.join(DOCS, "assets"), { recursive: true });
}

function copyFile(from, to) {
  ensureDirs();
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { force: true });
}

function copyDir(from, to) {
  ensureDirs();
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true, force: true });
}

function removePath(p) {
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

function initialSync() {
  ensureDirs();
  copyFile(path.join(SRC, "index.html"), path.join(DOCS, "index.html"));
  copyFile(path.join(SRC, "404.html"), path.join(DOCS, "404.html"));
  copyDir(path.join(SRC, "js"), path.join(DOCS, "js"));
  copyDir(path.join(SRC, "assets"), path.join(DOCS, "assets"));
}

function toDocsPath(srcPath) {
  // src/xyz -> docs/xyz
  return path.join(DOCS, path.relative(SRC, srcPath));
}

ensureDirs();
initialSync();

// Tailwind watcher (dev: geen minify)
const tw = spawn(
  process.platform === "win32" ? "npm.cmd" : "npm",
  [
    "exec",
    "--",
    "tailwindcss",
    "-i",
    "./src/css/main.css",
    "-o",
    "./docs/css/main.css",
    "--postcss",
    "--watch",
  ],
  {
    stdio: "inherit",
    shell: process.platform === "win32", // belangrijk voor Windows + spaties in paden
  }
);

// File watchers: html, js, assets
const watcher = chokidar.watch(
  [
    `${SRC}/index.html`,
    `${SRC}/404.html`,
    `${SRC}/js/**`,
    `${SRC}/assets/**`,
  ],
  { ignoreInitial: true }
);

watcher
  .on("add", (p) => {
    const dest = toDocsPath(p);
    copyFile(p, dest);
  })
  .on("change", (p) => {
    const dest = toDocsPath(p);
    copyFile(p, dest);
  })
  .on("unlink", (p) => {
    const dest = toDocsPath(p);
    removePath(dest);
  })
  .on("addDir", (p) => {
    const dest = toDocsPath(p);
    mkdirSync(dest, { recursive: true });
  })
  .on("unlinkDir", (p) => {
    const dest = toDocsPath(p);
    removePath(dest);
  });

// Netjes afsluiten
function shutdown(code = 0) {
  try {
    watcher.close();
  } catch {}
  try {
    tw.kill("SIGINT");
  } catch {}
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
