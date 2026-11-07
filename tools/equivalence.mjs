/**
 * One-time proof for the switch to src/ (task T2): the built index.html is the same program as
 * index.html at commit 15051ec, the last hand-edited build.
 *   node tools/equivalence.mjs
 *
 * Part 1 holds only at commit 38075c3, where src/ was first committed. Later commits change src/ on
 * purpose, so after that Part 1 reports FAIL; Part 2 still shows whether play without link
 * parameters matches 15051ec.
 *
 * Part 1, static: esbuild with the build's own options, run over the old program, gives exactly the
 * same output as the build gives from src/. Prettier only changed layout, so nothing in src/ differs
 * from the old program except whitespace, quotes, parentheses and empty statements.
 * Part 2, side by side in Chrome: the old and new builds each start every chapter from the title and
 * take the same 40 Enter presses, with Math.random seeded the same way. The lines shown and the
 * story state must be identical.
 */
import http from "node:http";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";
import puppeteer from "puppeteer-core";
import { buildHtml, ESBUILD_OPTIONS } from "./build.mjs";
import { chromePath } from "../tests/chrome-path.mjs";

const OLD_COMMIT = "15051ec";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const scriptRe = /<script>([\s\S]*?)<\/script>/g;
const lastScript = (html) => [...html.matchAll(scriptRe)].at(-1);

const oldHtml = execFileSync("git", ["show", `${OLD_COMMIT}:index.html`], { cwd: root, encoding: "utf8", maxBuffer: 64 << 20 });
const newHtml = await buildHtml();
const committed = readFileSync(join(root, "index.html"), "utf8");
let ok = true;
const report = (name, pass, detail = "") => {
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? " " + detail : ""}`);
  if (!pass) ok = false;
};

console.log(`sha256 index.html at ${OLD_COMMIT}: ${sha(oldHtml)} (${Buffer.byteLength(oldHtml)} bytes)`);
console.log(`sha256 index.html built from src/: ${sha(newHtml)} (${Buffer.byteLength(newHtml)} bytes)`);
report("committed index.html is the fresh build", committed === newHtml);

// Part 1: static.
const m = lastScript(oldHtml);
const oldProgram = m[1];
const oldTemplate = oldHtml.slice(0, m.index + "<script>".length) + "/*BUILD*/" + oldHtml.slice(m.index + m[0].length - "</script>".length);
report("page around the program is unchanged", oldTemplate === readFileSync(join(root, "src/index.template.html"), "utf8"));
const fromOld = (await transform(oldProgram, ESBUILD_OPTIONS)).code;
const newProgram = lastScript(newHtml)[1];
report("esbuild(old program) === built program", fromOld === newProgram, `sha256 ${sha(fromOld)} vs ${sha(newProgram)}`);

// Part 2: side by side in Chrome.
const chrome = chromePath();
if (!existsSync(chrome)) {
  console.error(`Chrome was not found at ${chrome}. Set CHROME.`);
  process.exit(1);
}
const pages = { "/old.html": oldHtml, "/new.html": newHtml };
const server = http.createServer((req, res) => {
  const body = pages[req.url.split("?")[0]];
  res.writeHead(body ? 200 : 404, { "content-type": "text/html" });
  res.end(body || "");
});
await new Promise((r) => server.listen(8771, "127.0.0.1", r));
const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function play(path, chapter) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e && e.message ? e.message : e)));
  await page.evaluateOnNewDocument(() => {
    // Same random numbers in both builds (mulberry32, fixed seed).
    let a = 20261106;
    Math.random = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try {
      localStorage.setItem("ssq-unlocked", "4");
    } catch {}
  });
  await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:8771${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__ss && window.__ss.op, { timeout: 15000 });
  await sleep(300);
  await page.keyboard.press(`Digit${chapter}`);
  // 450 ms between presses: a bubble ignores advances in its first 0.3 s of game time, and a
  // shorter gap can land on either side of that line by chance.
  for (let i = 0; i < 40; i++) {
    await sleep(450);
    await page.keyboard.press("Enter");
  }
  await sleep(450);
  const state = await page.evaluate(() => {
    const s = window.__ss, n = s.op;
    return {
      shown: s.shown(),
      scene: n.scene, room: n.room, chip: n.chip, ctrl: n.ctrl, sqPose: n.sqPose, stars: n.stars,
      phase: s.ch2 && s.ch2.phase, mops: s.ch && s.ch.mops, verb: n.act && n.act.verb,
    };
  });
  await ctx.close();
  return { state, errors };
}

for (const chapter of [1, 2, 3, 4]) {
  const a = await play("/old.html", chapter);
  const b = await play("/new.html", chapter);
  const same = JSON.stringify(a) === JSON.stringify(b);
  const s = b.state;
  report(
    `chapter ${chapter}: 40 Enter presses give identical lines and state`,
    same,
    `(${s.shown.length} lines shown, scene ${s.scene}, room ${s.room}, phase ${s.phase}, chip ${JSON.stringify(s.chip)}, errors ${b.errors.length})`
  );
  if (!same) {
    console.log("  old:", JSON.stringify(a).slice(0, 2000));
    console.log("  new:", JSON.stringify(b).slice(0, 2000));
  }
}
await browser.close();
server.close();
console.log(ok ? "equivalence checks passed" : "equivalence checks FAILED");
process.exit(ok ? 0 : 1);
