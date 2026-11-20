/**
 * Phone screenshots of two builds at the same moments.
 *   node tools/phone-shot.mjs <old.html> <new.html> <out-dir>
 *
 * The game clock is stepped by hand, with the same random numbers, so a frame
 * does not depend on how fast the machine is. Prints how many pixels differ.
 */
import http from "node:http";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { join } from "node:path";
import puppeteer from "puppeteer-core";
import { chromePath } from "../tests/chrome-path.mjs";

const [oldPath, newPath, outDir] = process.argv.slice(2);
if (!oldPath || !newPath || !outDir) {
  console.error("usage: node tools/phone-shot.mjs <old.html> <new.html> <out-dir>");
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });
const pages = { "/old.html": readFileSync(oldPath), "/new.html": readFileSync(newPath) };
const server = http.createServer((req, res) => {
  const body = pages[req.url.split("?")[0]];
  res.writeHead(body ? 200 : 404, { "content-type": "text/html" });
  res.end(body || "");
});
await new Promise((r) => server.listen(8798, "127.0.0.1", r));
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: "new", args: ["--no-sandbox", "--disable-gpu"] });

const MOMENTS = [
  { id: "ch1-open", chapter: 1, ticks: 0 },
  { id: "ch1-two-seconds", chapter: 1, ticks: 40 },
  { id: "ch2-open", chapter: 2, ticks: 0 },
  { id: "ch2-two-seconds", chapter: 2, ticks: 40 },
];

function decodePNG(buf) {
  let o = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat = [];
  while (o < buf.length) {
    const len = buf.readUInt32BE(o);
    o += 4;
    const type = buf.toString("ascii", o, o + 4);
    o += 4;
    const data = buf.subarray(o, o + len);
    o += len + 4;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
  }
  const channels = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(width * height * 4);
  let i = 0;
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[i++];
    const row = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = prev[x];
      const ul = x >= channels ? prev[x - channels] : 0;
      let v = raw[i++];
      if (filter === 1) v = (v + left) & 255;
      else if (filter === 2) v = (v + up) & 255;
      else if (filter === 3) v = (v + ((left + up) >> 1)) & 255;
      else if (filter === 4) {
        const p = left + up - ul;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - ul);
        v = (v + (pa <= pb && pa <= pc ? left : pb <= pc ? up : ul)) & 255;
      }
      row[x] = v;
    }
    prev = row;
    for (let x = 0; x < width; x++) {
      const s = (y * width + x) * 4;
      const r = x * channels;
      out[s] = row[r];
      out[s + 1] = row[r + 1];
      out[s + 2] = row[r + 2];
      out[s + 3] = channels === 4 ? row[r + 3] : 255;
    }
  }
  return { width, height, data: out };
}

function diffCount(a, b) {
  if (a.width !== b.width || a.height !== b.height) return { pixels: -1, width: a.width, height: a.height, other: [b.width, b.height] };
  let pixels = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    if (a.data[i] !== b.data[i] || a.data[i + 1] !== b.data[i + 1] || a.data[i + 2] !== b.data[i + 2] || a.data[i + 3] !== b.data[i + 3]) pixels++;
  }
  return { pixels, width: a.width, height: a.height };
}

async function shoot(which, moment) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e && e.message ? e.message : e)));
  await page.evaluateOnNewDocument(() => {
    let now = 1000;
    performance.now = () => now;
    window.__advance = (ms) => {
      now += ms;
    };
    window.requestAnimationFrame = () => 1;
    window.cancelAnimationFrame = () => {};
    let a = 20261106;
    Math.random = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.goto(`http://127.0.0.1:8798/${which}.html?ch=${moment.chapter}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__ss && window.__ss.op && window.__ss.op.scene, { timeout: 10000 });
  const state = await page.evaluate((ticks) => {
    const ss = window.__ss;
    for (let i = 0; i < ticks; i++) {
      window.__advance(50);
      ss.tick(0.05);
    }
    ss.drawFrame();
    const n = ss.op;
    return { scene: n.scene, room: n.room, chip: n.chip, pose: n.sqPose };
  }, moment.ticks);
  const png = await page.screenshot({ type: "png" });
  await page.close();
  return { png, state, errors };
}

let failed = 0;
for (const moment of MOMENTS) {
  const a = await shoot("old", moment);
  const b = await shoot("new", moment);
  const fileA = join(outDir, `${moment.id}-before.png`);
  const fileB = join(outDir, `${moment.id}-after.png`);
  writeFileSync(fileA, a.png);
  writeFileSync(fileB, b.png);
  const pixels = diffCount(decodePNG(a.png), decodePNG(b.png));
  const sameState = JSON.stringify(a.state) === JSON.stringify(b.state);
  const ok = pixels.pixels === 0 && sameState && a.errors.length === 0 && b.errors.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? "MATCH" : "DIFFER"} ${moment.id} pixels=${pixels.pixels} state=${JSON.stringify(a.state)} / ${JSON.stringify(b.state)} errors ${a.errors.length}/${b.errors.length}`);
  if (a.errors.length || b.errors.length) console.log(a.errors, b.errors);
}
await browser.close();
server.close();
if (failed) process.exit(1);
console.log("phone shots match");
