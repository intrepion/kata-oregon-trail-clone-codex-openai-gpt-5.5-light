import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");
let html = await readFile(indexPath, "utf8");

const scriptMatch = html.match(/<script type="module" crossorigin src="(.+?)"><\/script>/);
const styleMatch = html.match(/<link rel="stylesheet" crossorigin href="(.+?)">/);

if (!scriptMatch || !styleMatch) {
  throw new Error("Could not find Vite script and stylesheet assets to inline.");
}

const scriptPath = path.join(distDir, scriptMatch[1]);
const stylePath = path.join(distDir, styleMatch[1]);
const [script, style] = await Promise.all([readFile(scriptPath, "utf8"), readFile(stylePath, "utf8")]);

html = html
  .replace(styleMatch[0], `<style>\n${style}\n</style>`)
  .replace(scriptMatch[0], "")
  .replace("</body>", `<script>\n${script}\n</script>\n</body>`);

await writeFile(indexPath, html);
