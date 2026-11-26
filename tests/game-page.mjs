/**
 * Shared start-up for the Phase 1 suites: serves index.html, starts headless Chrome,
 * and opens the game. Not a suite itself (run-all.mjs skips it).
 *   const g = await startGame({ port: 8781 });
 *   const { page } = await g.open("?ch=2");
 *   g.check("name", ok, detail); ... await g.finish("suite name");
 *   g.known("name", stillHappens, detail) for a known problem: printed as KNOWN, never a failure.
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

/**
 * Every test server's port is moved up by SSQ_PORT_OFFSET (default 0), so two worktrees can run npm test at the same
 * time without one suite's page loading the other worktree's game (2026-11-26: two builders' runs shared ports).
 */
export const PORT_OFFSET = Number(process.env.SSQ_PORT_OFFSET || 0);

export async function startGame({ port: asked, name }) {
  const port = asked + PORT_OFFSET;
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
  // The music files the game may load: Joe's theme, and Brian's Floating in Space (not wired yet).
  const MUSIC = ["music/main-theme-from-brian.mp3", "music/floating-in-space.mp3"];
  const musicBufs = new Map();
  const server = http.createServer((req, res) => {
    let pathname = "/";
    try {
      pathname = new URL(req.url || "/", "http://127.0.0.1").pathname;
    } catch {}
    // Pictures the game loads: the locked rooms, and approved art (the party guests).
    const picDir = ["docs/locked-rooms/", "docs/approved-art/"].find((d) => pathname.startsWith("/" + d));
    if (picDir) {
      const rel = decodeURIComponent(pathname.slice(1));
      const file = join(root, rel);
      if (!file.startsWith(join(root, picDir)) || !existsSync(file)) {
        res.writeHead(404);
        res.end();
        return;
      }
      const type = file.endsWith(".png") ? "image/png" : file.endsWith(".py") ? "text/x-python" : "application/octet-stream";
      res.writeHead(200, { "content-type": type });
      res.end(readFileSync(file));
      return;
    }
    if (pathname.startsWith("/music/")) {
      const rel = decodeURIComponent(pathname.slice(1));
      const file = join(root, rel);
      if (!(MUSIC.some((f) => file === join(root, f)) && existsSync(file))) {
        res.writeHead(404);
        res.end();
        return;
      }
      musicBufs.has(file) || musicBufs.set(file, readFileSync(file));
      const musicBuf = musicBufs.get(file);
      const range = req.headers.range;
      const m = range && /bytes=(\d+)-(\d*)/.exec(range);
      if (m) {
        const start = Math.min(parseInt(m[1], 10), musicBuf.length - 1);
        const end = m[2] ? Math.min(parseInt(m[2], 10), musicBuf.length - 1) : musicBuf.length - 1;
        res.writeHead(206, {
          "content-type": "audio/mpeg",
          "content-range": `bytes ${start}-${end}/${musicBuf.length}`,
          "content-length": end - start + 1,
          "accept-ranges": "bytes",
        });
        res.end(musicBuf.subarray(start, end + 1));
        return;
      }
      res.writeHead(200, { "content-type": "audio/mpeg", "content-length": musicBuf.length, "accept-ranges": "bytes" });
      res.end(musicBuf);
      return;
    }
    // The party's recorded sounds (sounds/*.mp3, Kenney CC0: sounds/CREDITS.txt).
    if (pathname.startsWith("/sounds/") && pathname.endsWith(".mp3")) {
      const file = join(root, decodeURIComponent(pathname.slice(1)));
      if (!file.startsWith(join(root, "sounds")) || !existsSync(file)) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, { "content-type": "audio/mpeg" });
      res.end(readFileSync(file));
      return;
    }
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
  // A problem Brian knows about and that is not fixed yet: printed, never failing the suite. When it stops
  // happening, the note says so, so the change that fixes it takes it off the suite's known list.
  const known = (label, stillThere, detail) =>
    console.log(stillThere ? `KNOWN ${label}${detail === undefined ? "" : " " + JSON.stringify(detail)}` : `NOTE ${label}: this known problem did not happen. If it is fixed, take it off the known list.`);
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
  return { open, check, known, key, finish, browser };
}

// Plays Chapter 1 from its start to the morning's song step (src/modules/morning.js): every card, bubble, wait
// and cutaway picture is tapped away in the page, and the clock runs, until the kid has control with the
// sing-along goal. Returns the goal chip. For suites that start at the song step.
// With sound on, Mops's song line waits until the recording has really played a moment (src/modules/home-music.js,
// audible()), which takes real time, not game ticks: while the game waits on its own, real time is let pass.
export async function toMorningSong(page) {
  return page.evaluate(async () => {
    const ss = window.__ss,
      n = ss.op,
      until = performance.now() + 15000;
    for (let i = 0; i < 2000 && !(n.ctrl && n.ch1Morning && n.ch1Morning.step === "song"); i++) {
      if (n.cur && ["card", "bub", "wait", "cutaway"].includes(n.cur.k)) ((n.bt = 1), ss.opTap());
      ss.tick(0.05);
      if (n.cur && n.cur.k === "until" && performance.now() < until) await new Promise((ok) => setTimeout(ok, 20));
    }
    return n.ch1Chip;
  });
}

// Plays Chapter 1 from its start through the morning (singing along) until Mops has left and Squatch is home
// alone with the goal to do his homework (src/modules/home-alone.js). Returns the goal chip.
export async function toHomeAlone(page) {
  await toMorningSong(page);
  return page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    const sing = (ss.spotsNow() || []).find((s) => s.id === "sing");
    sing && sing.f();
    for (let i = 0; i < 3000 && !(n.ctrl && n.ch1Morning && n.ch1Morning.step === "home" && !n.cur); i++) {
      if (n.cur && ["card", "bub", "wait", "cutaway"].includes(n.cur.k)) ((n.bt = 1), ss.opTap());
      ss.tick(0.05);
    }
    return ss.chipNow();
  });
}

// Plays Chapter 1 from its start through the morning (singing along) and the homework to the evening: Squatch
// at home with the goal to peek out the door, where the calendar close-up can be opened. Returns the goal chip.
export async function toEvening(page) {
  await toHomeAlone(page);
  return page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    const hw = (ss.spotsNow() || []).find((s) => s.id === "homework");
    hw && hw.f();
    for (let i = 0; i < 3000 && !(n.ctrl && n.ch1PartyNow && n.ch1PartyNow.scene === "P1" && !n.cur); i++) {
      if (n.cur && ["card", "bub", "wait", "cutaway"].includes(n.cur.k)) ((n.bt = 1), ss.opTap());
      ss.tick(0.05);
    }
    return ss.chipNow();
  });
}
