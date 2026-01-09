import { rmSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const SRC = "src";
const DIST = "dist";

function clean() {
  if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
  mkdirSync(`${DIST}/css`, { recursive: true });
  mkdirSync(`${DIST}/js`, { recursive: true });
  mkdirSync(`${DIST}/assets`, { recursive: true });
}

function copyStatic() {
  cpSync(`${SRC}/index.html`, `${DIST}/index.html`, { force: true });
  cpSync(`${SRC}/404.html`, `${DIST}/404.html`, { force: true });
  cpSync(`${SRC}/js`, `${DIST}/js`, { recursive: true, force: true });
  cpSync(`${SRC}/assets`, `${DIST}/assets`, { recursive: true, force: true });
}

function buildCss() {
  // pas input pad aan als je input.css gebruikt
  execSync(
    "npx tailwindcss -i ./src/css/main.css -o ./dist/css/main.css --postcss --minify",
    { stdio: "inherit" }
  );
}

clean();
copyStatic();
buildCss();
