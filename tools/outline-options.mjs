// The goal outline options sheet for Brian (2026-11-26, video note 0:18: "I really don't see the yellow outline on the
// closet or other places... thicker and maybe darker... a universal rule change... look at a few options"). Nothing in
// the game changes: this draws five looks of the same moment, each on the closet (Day 2's taller closet), a hide spot
// (the party hall's middle plant) and a person (Mops), every panel the whole picture at a phone's width (375 px):
//   A  a thicker dark-gold line (4 px on the phone) with a soft outer glow
//   B  a white and gold double line (it pulses in the game; the still shows it at full)
//   C  a bouncing arrow over the thing, plus a thicker line
//   D  the soft full glow behind the thing, as the lunch sneak uses it (lunch-sneak-art.js drawNextGlow)
//   E  the dashed gold line, as the game draws it now (outline.js)
// Also (phase-3 item 8) one game still at the closet goal with option A and no label on the picture, the words only on
// the button.
//   SSQ_PORT_OFFSET=5000 node tools/outline-options.mjs <out folder>
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const out = process.argv[2] || "tests/out/outline-options";
mkdirSync(out, { recursive: true });
// outline.js and tall-closet.js as plain functions in the page (both have no imports)
const lib = ["outline.js", "tall-closet.js"].map((f) => readFileSync(join(root, "src", "modules", f), "utf8").replace(/^export /gm, "")).join("\n");

const g = await startGame({ port: 9771, name: "outline-options" });
const { page } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);
await sleep(1200);
await page.evaluate(() => (window.requestAnimationFrame = () => 0));
await page.evaluate(`window.__oo = (function () { ${lib}; return { thingMask, grow, outlineCanvas, OUTLINE, drawTallCloset, TALL_BOX }; })();`);

// The five looks, drawn on a 960 x 640 scene canvas round the thing inside `box` (game positions).
const STYLES = `
  const GOLD = "#ffcf33", DARK = "#c78a00";
  // the thing's mask inside box (padded), and a band from gap to gap + width outside it, as a canvas at (x, y)
  function band(scene, box, gap, width, color) {
    const pad = gap + width + 2, x = Math.floor(box.x0) - pad, y = Math.floor(box.y0) - pad,
      w = Math.ceil(box.x1 - box.x0) + 2 * pad, h = Math.ceil(box.y1 - box.y0) + 2 * pad;
    const cut = document.createElement("canvas"); cut.width = w; cut.height = h;
    const cx = cut.getContext("2d", { willReadFrequently: true });
    cx.drawImage(scene, x, y, w, h, 0, 0, w, h);
    const thing = __oo.thingMask(cx.getImageData(0, 0, w, h).data, w, h);
    const inner = __oo.grow(thing, w, h, gap), outer = __oo.grow(thing, w, h, gap + width);
    const o = document.createElement("canvas"); o.width = w; o.height = h;
    const ox = o.getContext("2d"), img = ox.createImageData(w, h);
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
    for (let k = 0; k < w * h; k++) if (outer[k] && !inner[k]) (img.data[k * 4] = r, img.data[k * 4 + 1] = g, img.data[k * 4 + 2] = b, img.data[k * 4 + 3] = 255);
    ox.putImageData(img, 0, 0);
    return { canvas: o, x, y, thing, w, h };
  }
  function glowUnder(ctx, scene, box) {
    // drawNextGlow (lunch-sneak-art.js): a soft pulsing yellow glow behind the thing, well bigger than it
    const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2,
      rad = Math.max(56, Math.max(box.x1 - box.x0, box.y1 - box.y0) * 0.95), a = 0.95,
      gr = ctx.createRadialGradient(cx, cy, 4, cx, cy, rad);
    gr.addColorStop(0, "rgba(255,214,80," + a + ")");
    gr.addColorStop(0.55, "rgba(255,224,110," + a * 0.55 + ")");
    gr.addColorStop(1, "rgba(255,224,110,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    // the thing itself back on top of its glow (cut out of the scene by its own shape)
    const m = band(scene, box, 0, 1, "#000000");
    const t = document.createElement("canvas"); t.width = m.w; t.height = m.h;
    const tx = t.getContext("2d"), im = tx.createImageData(m.w, m.h);
    const src = scene.getContext("2d").getImageData(m.x, m.y, m.w, m.h).data;
    for (let k = 0; k < m.w * m.h; k++) if (m.thing[k]) for (let j = 0; j < 4; j++) im.data[k * 4 + j] = src[k * 4 + j];
    tx.putImageData(im, 0, 0);
    ctx.drawImage(t, m.x, m.y);
  }
  function arrowOver(ctx, box) {
    const x = (box.x0 + box.x1) / 2, y = Math.max(40, box.y0 - 18);
    ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-26, -30); ctx.lineTo(-11, -30); ctx.lineTo(-11, -62); ctx.lineTo(11, -62); ctx.lineTo(11, -30); ctx.lineTo(26, -30); ctx.closePath();
    ctx.fillStyle = GOLD; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = "#1e2430"; ctx.lineJoin = "round"; ctx.stroke();
    ctx.restore();
  }
  // 4 px on a 375 px phone is about 10 game px (the picture is about 345 px wide there)
  function drawStyle(ctx, scene, box, s) {
    ctx.drawImage(scene, 0, 0);
    if (s === "A") {
      const b = band(scene, box, 1, 10, DARK);
      ctx.save(); ctx.shadowColor = "rgba(255,196,40,.95)"; ctx.shadowBlur = 18;
      ctx.drawImage(b.canvas, b.x, b.y); ctx.drawImage(b.canvas, b.x, b.y); ctx.restore();
    } else if (s === "B") {
      const w = band(scene, box, 1, 6, "#ffffff"), o = band(scene, box, 7, 6, GOLD);
      ctx.drawImage(o.canvas, o.x, o.y); ctx.drawImage(w.canvas, w.x, w.y);
    } else if (s === "C") {
      const b = band(scene, box, 1, 10, GOLD);
      ctx.drawImage(b.canvas, b.x, b.y);
      arrowOver(ctx, box);
    } else if (s === "D") {
      glowUnder(ctx, scene, box);
    } else if (s === "E") {
      const o = __oo.outlineCanvas(scene, box);
      ctx.drawImage(o.canvas, o.x, o.y);
    }
  }
`;
await page.evaluate(`window.__oo.styles = (function () { ${STYLES}; return { drawStyle, band }; })();`);

// The three scenes, each the whole 960 x 640 picture, and the box round the thing in it.
await page.evaluate(async () => {
  const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  const [home, hall] = await Promise.all([load("docs/locked-rooms/home-room-empty-closed-v6.png"), load("docs/locked-rooms/hall-room-empty-v2.png")]);
  // the tall closet's own pictures load on first use
  const warm = document.createElement("canvas").getContext("2d");
  for (let i = 0; i < 40 && !__oo.drawTallCloset(warm, false); i++) await new Promise((r) => setTimeout(r, 50));
  const scene = (draw) => {
    const c = document.createElement("canvas");
    c.width = 960;
    c.height = 640;
    const x = c.getContext("2d", { willReadFrequently: true });
    draw(x);
    return c;
  };
  const e = window.SSQ.engine(),
    mopsAt = { x: 770, y: 540 },
    k = (e.squatchScale && e.squatchScale()) || 3;
  window.__oo.scenes = {
    closet: { canvas: scene((x) => (x.drawImage(home, 0, 0, 960, 640), __oo.drawTallCloset(x, false))), box: { x0: 30, x1: 172, y0: Math.floor(__oo.TALL_BOX.y0) - 8, y1: 352 }, label: "the closet" },
    plant: { canvas: scene((x) => x.drawImage(hall, 0, 0, 960, 640)), box: { x0: 392, x1: 494, y0: 432, y1: 556 }, label: "a hide spot: the party hall's plant" },
    mops: { canvas: scene((x) => (x.drawImage(home, 0, 0, 960, 640), e.drawMopsOn(x, mopsAt.x, mopsAt.y, k * 1.15, { f: -1 }))), box: { x0: mopsAt.x - 110, x1: mopsAt.x + 110, y0: mopsAt.y - 60 * k * 1.15, y1: mopsAt.y + 16 }, label: "a person: Mops" },
  };
});

// The sheet: a page of 375-wide panels, rows A to E, columns closet, plant, Mops.
const ROWS = [
  ["A", "A: a thicker dark-gold line (4 px on a phone) with a soft glow"],
  ["B", "B: a white and gold double line (pulses in the game)"],
  ["C", "C: a bouncing arrow over it, plus a thicker line"],
  ["D", "D: the soft full glow behind it (as the lunch sneak)"],
  ["E", "E: the dashed gold line, as now"],
];
const COLS = ["closet", "plant", "mops"];
const html = await page.evaluate(
  (ROWS, COLS) => {
    const panels = [];
    for (const [s] of ROWS)
      for (const c of COLS) {
        const sc = __oo.scenes[c],
          cv = document.createElement("canvas");
        cv.width = 960;
        cv.height = 640;
        __oo.styles.drawStyle(cv.getContext("2d"), sc.canvas, sc.box, s);
        panels.push({ s, c, url: cv.toDataURL("image/png") });
      }
    return panels;
  },
  ROWS,
  COLS,
);
const cell = (p) => `<img src="${p.url}" style="width:375px;height:250px;display:block;border-radius:8px;border:2px solid #1e2430">`;
const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;padding:16px;background:#fff;font:600 17px system-ui,-apple-system,sans-serif;color:#1e2430}
h1{font-size:22px;margin:0 0 4px} p{margin:0 0 12px;font-weight:400}
.row{margin:14px 0 0} .lab{font-size:20px;margin:0 0 6px} .cells{display:flex;gap:10px}
.cap{font-weight:400;font-size:14px;margin:4px 0 0;width:375px}
</style></head><body>
<h1>Goal outline options for the whole game (pick one)</h1>
<p>Each panel is the whole picture at a phone's width. Columns: ${COLS.map((c) => (c === "closet" ? "the closet" : c === "plant" ? "a hide spot (the party hall's plant)" : "a person (Mops)")).join(", ")}.</p>
${ROWS.map(([s, words]) => `<div class="row"><div class="lab">${words}</div><div class="cells">${COLS.map((c) => `<div>${cell(html.find((p) => p.s === s && p.c === c))}</div>`).join("")}</div></div>`).join("\n")}
</body></html>`;
const sp = await g.browser.newPage();
await sp.setViewport({ width: 375 * 3 + 52, height: 800, deviceScaleFactor: 2 });
await sp.setContent(sheet, { waitUntil: "load" });
await sp.screenshot({ path: join(out, "outline-options.png"), fullPage: true });
console.log("saved", join(out, "outline-options.png"));

// Item 8: the game at the closet goal (Day 2), option A on the closet, no label on the picture: the words only on the
// button. The canvas is drawn once without the goal (no outline, no label), then the goal is put back so the button
// says OPEN · closet, and option A is drawn over the clean picture.
await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    hm = window.SSQ.beat("ch1-home-morning");
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(22);
  hm.jump("closet");
  // he has walked to the wardrobe, where OPEN · closet works (the button says it)
  n.sq.x = 300;
  n.sq.y = 398;
  n.sq.f = -1;
  for (let i = 0; i < 10; i++) ss.tick(0.05);
});
const still = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    cv = document.querySelector("canvas");
  n.ctrl = false;
  ss.drawFrame();
  const clean = document.createElement("canvas");
  clean.width = cv.width;
  clean.height = cv.height;
  clean.getContext("2d").drawImage(cv, 0, 0);
  n.ctrl = true;
  for (let i = 0; i < 3; i++) ss.tick(0.05);
  ss.drawFrame();
  const btn = ss.offerNow();
  const ctx = cv.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  __oo.styles.drawStyle(ctx, clean, __oo.scenes.closet.box, "A");
  return { button: btn ? btn.verb + " · " + btn.cap : "", w: cv.width, h: cv.height };
});
await page.screenshot({ path: join(out, "closet-option-A-no-label.png") });
console.log("saved", join(out, "closet-option-A-no-label.png"), JSON.stringify(still));
process.exit(0);
