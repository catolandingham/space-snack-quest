/**
 * Shared start-up for the Phase 1 suites: serves index.html, starts headless Chrome,
 * and opens the game. Not a suite itself (run-all.mjs skips it).
 *   const g = await startGame({ port: 8781 });
 *   const { page } = await g.open("?ch=2");
 *   g.check("name", ok, detail); ... await g.finish("suite name");
 */
import http from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromePath } from "./chrome-path.mjs";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The words Brian approves: docs/PHASE-1-, PHASE-2-, PHASE-3- and CHAPTER-1-LINES-FOR-BRIAN.md,
// row number -> the "In the game now" column. With where: true, row number -> { where, words }.
export function readLines({ where = false } = {}) {
  const out = {};
  for (const file of ["PHASE-1-LINES-FOR-BRIAN.md", "PHASE-2-LINES-FOR-BRIAN.md", "PHASE-3-LINES-FOR-BRIAN.md", "CHAPTER-1-LINES-FOR-BRIAN.md", "CH1-LINES-FOR-BRIAN.md"])
    for (const line of (existsSync(join(root, "docs", file)) ? readFileSync(join(root, "docs", file), "utf8") : "").split("\n")) {
      const m = line.match(/^\| (\d+\.\d+) \| ([^|]*) \| ([^|]*) \|/);
      if (m) out[m[1]] = where ? { where: m[2].trim(), words: m[3].trim() } : m[3].trim();
    }
  return out;
}
// "HIDE · crate (note)" -> "HIDE · crate"
export const actionOf = (cell) => (cell.match(/^([A-Z][A-Z ]* \u00b7 [^(]+?)\s*(\(|$)/) || [])[1] || "";

export async function startGame({ port, name }) {
  let puppeteer;
  try {
    puppeteer = (await import("puppeteer-core")).default;
  } catch {
    console.error(`puppeteer-core is not installed, so the ${name} tests cannot start. From the repo root: npm install`);
    process.exit(1);
  }
  const chrome = chromePath();
  if (!existsSync(chrome)) {
    console.error(`Chrome was not found at ${chrome}. Set CHROME to the Chrome or Chromium binary.`);
    process.exit(1);
  }
  const html = await readFile(join(root, "index.html"));
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(html);
  });
  await new Promise((r) => server.listen(port, "127.0.0.1", r));
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
  } catch (err) {
    server.close();
    console.error(`Chrome at ${chrome} did not start: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
  const fails = [];
  const check = (label, ok, detail) => {
    console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail === undefined || ok ? "" : " " + JSON.stringify(detail)}`);
    if (!ok) fails.push(label);
  };
  async function open(query = "?ch=2", viewport = { width: 1100, height: 800 }) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e && e.message ? e.message : e)));
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${port}/index.html${query}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.__ss && window.__ss.op, { timeout: 15000 });
    if (query.includes("ch=2")) await page.waitForFunction(() => String(window.__ss.op.scene || "").startsWith("G"), { timeout: 15000 });
    await sleep(300);
    return { ctx, page, errors };
  }
  async function key(page, code) {
    await page.evaluate((code) => {
      window.dispatchEvent(new KeyboardEvent("keydown", { code, bubbles: true }));
      window.dispatchEvent(new KeyboardEvent("keyup", { code, bubbles: true }));
    }, code);
  }
  async function finish(label) {
    await browser.close();
    server.close();
    if (fails.length) {
      console.error("Failed:", fails.join(", "));
      process.exit(1);
    }
    console.log(`${label} checks passed`);
  }
  return { open, check, key, finish, browser };
}
