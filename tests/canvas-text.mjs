/**
 * Canvas words at the iPad sizes in tests/screen-fit.mjs.
 * Flags text under 14 CSS px, contrast under 3:1, text not fully on the canvas,
 * and two texts overlapping by more than 25% of the smaller box.
 * Known failures are listed in tests/canvas-text-allow.json until Brian decides the fix.
 * This test does not change words, font sizes, or layout.
 *   node tests/canvas-text.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const allow = JSON.parse(readFileSync(new URL("./canvas-text-allow.json", import.meta.url), "utf8"));
const MIN_CSS = 14;
const CONTRAST = 3;
const OVERLAP = 0.25;
const SIZES = {
  "iPad portrait": { width: 768, height: 1024 },
  "iPad landscape": { width: 1024, height: 768 },
};

function lum(rgb) {
  const lin = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function ratio(a, b) {
  const L1 = lum(a);
  const L2 = lum(b);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}
function area(box) {
  return Math.max(0, box.w) * Math.max(0, box.h);
}
function overlapOf(a, b) {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (w <= 0 || h <= 0) return 0;
  const small = Math.min(area(a), area(b));
  return small > 0 ? (w * h) / small : 0;
}

const g = await startGame({ port: 8933, name: "canvas-text" });
const failures = [];
const unassessed = [];

for (const [sizeName, size] of Object.entries(SIZES)) {
  const { page } = await g.open("?ch=1", { width: size.width, height: size.height, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    const fill = CanvasRenderingContext2D.prototype.fillText;
    const stroke = CanvasRenderingContext2D.prototype.strokeText;
    const parse = (style) => {
      if (typeof style !== "string") return null;
      const hex = style.match(/^#([0-9a-f]{6})$/i);
      if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16));
      const rgb = style.match(/^rgba?\(([^)]+)\)/i);
      if (!rgb) return null;
      const p = rgb[1].split(",").map((n) => Number(n.trim()));
      if (p.length >= 4 && p[3] < 0.99) return null;
      if (p.some((n) => Number.isNaN(n))) return null;
      return p.slice(0, 3);
    };
    const note = function (text, x, y) {
      const s = String(text ?? "");
      if (!s.trim()) return;
      const m = this.measureText(s);
      const px = Number((/(\d+(?:\.\d+)?)px/.exec(this.font) || [])[1] || 0);
      const ascent = m.actualBoundingBoxAscent || px * 0.8;
      const descent = m.actualBoundingBoxDescent || px * 0.2;
      let left = x;
      if (this.textAlign === "center") left = x - m.width / 2;
      else if (this.textAlign === "right" || this.textAlign === "end") left = x - m.width;
      let top = y - ascent;
      if (this.textBaseline === "top" || this.textBaseline === "hanging") top = y;
      else if (this.textBaseline === "bottom" || this.textBaseline === "alphabetic") top = y - ascent;
      const ink = parse(String(this.fillStyle));
      let behind = null;
      try {
        const px0 = Math.max(0, Math.min(this.canvas.width - 1, Math.round(x)));
        const py0 = Math.max(0, Math.min(this.canvas.height - 1, Math.round(y)));
        behind = Array.from(this.getImageData(px0, py0, 1, 1).data).slice(0, 3);
      } catch {
        behind = null;
      }
      (window.__textLog || (window.__textLog = [])).push({
        text: s,
        x: left,
        y: top,
        w: m.width,
        h: ascent + descent,
        px,
        ink,
        behind,
      });
    };
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...rest) {
      note.call(this, text, x, y);
      return fill.call(this, text, x, y, ...rest);
    };
    CanvasRenderingContext2D.prototype.strokeText = function (text, x, y, ...rest) {
      note.call(this, text, x, y);
      return stroke.call(this, text, x, y, ...rest);
    };
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  // Wait for the game to set up its test hook: on a slower machine (GitHub's runner) it is not there yet
  // right after DOMContentLoaded, and reading it failed with "Cannot read properties of undefined".
  await page.waitForFunction(() => window.__ss, { timeout: 30000 });
  await page.evaluate(() => window.__ss.lockedReady);
  const screens = await page.evaluate(async () => {
    const ss = window.__ss;
    const n = ss.op;
    const shot = (name, setup) => {
      window.__textLog = [];
      n.ch1Dress = null;
      n.ch1Cut = null;
      n.ch1Mini = "";
      n.ch1Morning = null;
      n.ch1Veil = 0;
      n.cur = null;
      n.q = [];
      setup();
      n.ch1Veil = 0;
      for (let i = 0; i < 8; i++) ss.tick(0.05);
      ss.drawFrame();
      const css = document.querySelector("canvas").getBoundingClientRect().width / 960;
      const seen = new Set();
      const texts = [];
      for (const t of window.__textLog || []) {
        const key = t.text + "@" + Math.round(t.x) + "," + Math.round(t.y);
        if (seen.has(key)) continue;
        seen.add(key);
        texts.push(t);
      }
      return { name, css, texts, canvas: { w: 960, h: 640 } };
    };
    const party = () => {
      n.scene = "QA";
      n.room = "hall";
      n.ch1Party = true;
      n.ch1Day2 = false;
      n.ch1Office = false;
      n.ch1D = false;
      n.ctrl = true;
      n.q = [];
      n.cur = null;
      n.sqPose = "stand";
      n.sq.x = 400;
      n.sq.y = 530;
      n.moPose = "hidden";
      ss.hall.camX = 0;
    };
    return [
      shot("opening card", () => {
        n.scene = "O1";
        n.room = "closet";
        n.ch1Party = false;
        n.ch1Day2 = false;
        n.ctrl = false;
        n.q = [];
        n.cur = { k: "card", id: "squatch", text: "This is Squatch. He's a Sasquatch." };
      }),
      // The morning (src/modules/morning.js): the speaker's bubble with its sound lines, the two cutaway
      // pictures, and the song with notes from the speaker; each with the "tap" cue.
      shot("morning speaker", () => {
        n.scene = "Q1";
        n.room = "closet";
        n.ch1Party = false;
        n.ch1Day2 = false;
        n.ch1Morning = { step: "waking", t: 1, notes: false };
        n.sqPose = "sit";
        n.moPose = "mop";
        n.cur = { k: "bub", b: { who: "speaker", text: "Good morning, Stormtop! Big party in the hall tonight!", style: "say" } };
      }),
      shot("morning cutaway 1", () => {
        n.scene = "Q1";
        n.room = "closet";
        n.ch1Morning = { step: "talk", t: 1, notes: false };
        n.cur = { k: "cutaway", id: "beard", panel: 0 };
      }),
      shot("morning cutaway 2", () => {
        n.scene = "Q1";
        n.room = "closet";
        n.ch1Morning = { step: "talk", t: 1, notes: false };
        n.cur = { k: "cutaway", id: "beard", panel: 1 };
      }),
      shot("song", () => {
        n.scene = "Q1";
        n.room = "closet";
        n.ch1Morning = { step: "sing", t: 1, notes: true, notesAt: n.T - 1.5 };
        n.ctrl = true;
        n.cur = { k: "bub", b: { who: "mops", text: "\u266A Weeee-eenn-nnttt! \u266A", style: "song" } };
        n.moPose = "stand";
        n.mo.x = 800;
        n.mo.y = 470;
        n.sq.x = 600;
        n.sq.y = 470;
      }),
      shot("home start", () => ss.ch1JumpBeat(22)),
      shot("dress-up", () => {
        n.scene = "Q1";
        n.room = "closet";
        n.wardrobe = "open";
        n.ch1Dress = { on: true, head: "", face: "", body: "", legs: "", extra: [] };
        n.ch1Veil = 0;
        n.cur = null;
        n.ctrl = true;
      }),
      shot("lunch sneak", () => ss.ch1JumpBeat(25)),
      shot("photo wall", () => ss.ch1JumpBeat(37)),
      shot("night paw", () => ss.ch1JumpBeat(42)),
      shot("office cutscene", () => ss.ch1JumpBeat(59)),
      shot("tape review", () => ss.ch1JumpBeat(60)),
      shot("party", party),
      shot("dance", () => {
        party();
        n.ch1Disguise = true;
        n.ch1Flyer = true;
        n.ch1Mini = "dance";
        n.ch1Dance = { t: 1, score: 10, cheer: 0, notes: [{ dir: "L", at: 2.5, hit: false }] };
      }),
      shot("karaoke", () => {
        party();
        n.ch1Disguise = true;
        n.ch1Flyer = true;
        n.ch1Mini = "karaoke";
        n.ch1Kara = { t: 1, howls: 1 };
      }),
      shot("snack cut-in", () => {
        party();
        n.ch1Disguise = true;
        n.ch1Flyer = true;
        n.ch1Cut = { id: "bar", zoom: 1, paw: { x: 480, y: 520 }, held: "", bag: 0, back: 5, glance: 0, face: 0, catches: 0, drag: false };
      }),
      shot("lockup card", () => {
        party();
        n.ctrl = false;
        n.cur = { k: "card", id: "jail", text: "LOCKUP", by: "s6", cause: "A tourist saw Squatch in the hall. Security caught him.", restart: "Holding pen. This part starts over." };
      }),
      shot("tally", () => {
        n.scene = "Q9";
        n.room = "office";
        n.ch1Office = true;
        n.ctrl = false;
        n.cur = { k: "panel", id: "tally" };
      }),
    ];
  });
  for (const screen of screens) {
    const texts = screen.texts.filter((t) => t.w > 1 && t.h > 1);
    for (const t of texts) {
      const cssPx = t.px * screen.css;
      if (!(cssPx >= MIN_CSS)) failures.push({ size: sizeName, screen: screen.name, text: t.text, reason: "size", detail: cssPx.toFixed(1) + " CSS px" });
      if (!t.ink || !t.behind) unassessed.push({ size: sizeName, screen: screen.name, text: t.text, why: "color behind the text could not be read" });
      else if (t.text === "♪" || t.text === "♫")
        unassessed.push({ size: sizeName, screen: screen.name, text: t.text, why: "a floating note; the background moves, so contrast is not a fixed check" });
      else if (ratio(t.ink, t.behind) < CONTRAST)
        failures.push({ size: sizeName, screen: screen.name, text: t.text, reason: "contrast", detail: ratio(t.ink, t.behind).toFixed(2) + ":1" });
      const off = t.x < -2 || t.y < -2 || t.x + t.w > screen.canvas.w + 2 || t.y + t.h > screen.canvas.h + 2;
      if (off) failures.push({ size: sizeName, screen: screen.name, text: t.text, reason: "off-screen", detail: Math.round(t.x) + "," + Math.round(t.y) });
    }
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const share = overlapOf(texts[i], texts[j]);
        const notes = (t) => t === "♪" || t === "♫";
        if (notes(texts[i].text) && notes(texts[j].text)) continue;
        if (share > OVERLAP)
          failures.push({
            size: sizeName,
            screen: screen.name,
            text: texts[i].text + " / " + texts[j].text,
            reason: "overlap",
            detail: Math.round(share * 100) + "%",
          });
      }
    }
  }
  if (sizeName === "iPad landscape") {
    const office = await page.evaluate(() => {
      const ss = window.__ss;
      ss.ch1JumpBeat(59);
      ss.op.ch1Dress = null;
      ss.op.ch1Cut = null;
      ss.op.ch1Veil = 0;
      ss.drawFrame();
      const c = document.querySelector("canvas");
      const g = c.getContext("2d");
      const at = (x, y) => Array.from(g.getImageData(x, y, 1, 1).data);
      return { robot: at(280, 460), isfred: at(430, 450), bottom: at(280, 630), alien: ss.alienScale("office"), robotScale: ss.adultPxFor("office") / 47 };
    });
    const blueCutOff = office.bottom[2] > 200 && office.bottom[0] < 100 && office.bottom[1] < 160;
    g.check(
      "the office robot is the white robot, on screen, next to Isfred",
      office.robot[0] > 220 && office.robot[1] > 220 && office.robot[2] > 220 && office.isfred[0] > 160 && office.isfred[2] > 180 && !blueCutOff,
      office,
    );
  }
  const mopsChip = screens
    .filter((screen) => screen.name === "song")
    .flatMap((screen) => screen.texts.filter((t) => t.text === "Mops" && t.ink && t.behind).map((t) => ratio(t.ink, t.behind)));
  const worst = mopsChip.length ? Math.min(...mopsChip) : 0;
  if (!(worst >= 4.5))
    failures.push({ size: sizeName, screen: "song", text: "Mops", reason: "contrast", detail: (worst || 0).toFixed(2) + ":1, want 4.5" });
  g.check(sizeName + ": the Mops name chip is at least 4.5:1", worst >= 4.5, worst.toFixed(2));
  await page.close();
}

const keyOf = (f) => [f.size, f.screen, f.reason, f.text].join(" | ");
const known = new Set((allow.known || []).map(keyOf));
const fresh = failures.filter((f) => !known.has(keyOf(f)));
g.check("no new canvas-text failures", fresh.length === 0, fresh);
g.check("known failures stay listed with a TODO", allow.todo && Array.isArray(allow.known), allow.todo);
if (failures.length) {
  console.log("CANVAS TEXT FAILURES");
  for (const f of failures) console.log(keyOf(f) + " | " + f.detail);
}
if (unassessed.length) console.log("CONTRAST NOT ASSESSED " + unassessed.length);
await g.finish("canvas-text");
