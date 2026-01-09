import { rmSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const SRC = "src";
const DOCS = "docs";

function clean() {
  if (existsSync(DOCS)) rmSync(DOCS, { recursive: true, force: true });
  mkdirSync(`${DOCS}/css`, { recursive: true });
  mkdirSync(`${DOCS}/js`, { recursive: true });
  mkdirSync(`${DOCS}/assets`, { recursive: true });
}

function copyStatic() {
  cpSync(`${SRC}/index.html`, `${DOCS}/index.html`, { force: true });
  cpSync(`${SRC}/404.html`, `${DOCS}/404.html`, { force: true });
  cpSync(`${SRC}/js`, `${DOCS}/js`, { recursive: true, force: true });
  cpSync(`${SRC}/assets`, `${DOCS}/assets`, { recursive: true, force: true });
}

function buildCss() {
  // pas input pad aan als je input.css gebruikt
  execSync(
    "npx tailwindcss -i ./src/css/main.css -o ./docs/css/main.css --postcss --minify",
    { stdio: "inherit" }
  );
}

clean();
copyStatic();
buildCss();
