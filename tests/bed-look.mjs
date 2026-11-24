/**
 * Squatch in bed has no purple bar in front of him (Brian, 2026-11-23, on PR #84: "we got that weird extra line
 * back on the bed where it shows up in front of the bed"). The bed's purple mattress is part of the locked home
 * picture (docs/locked-rooms/home-room-empty-closed-v6.png); the game used to draw its own purple bar across him
 * too (from before the room was a locked picture). Asleep and sitting up, the part of the picture just under the
 * mattress, where the bar hung down over the crate, must look exactly like the locked picture, and the source
 * must not draw the bar.
 *   node tests/bed-look.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const g = await startGame({ port: 8975, name: "bed-look" });
const { page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });
await page.evaluate(() => window.__ss.lockedReady);
for (const pose of ["sleep", "sit"]) {
  const r = await page.evaluate(async (pose) => {
    const ss = window.__ss,
      n = ss.op;
    n.q = [];
    n.cur = null;
    Object.assign(n, { scene: "Q1", room: "closet", wardrobe: "closed", sqPose: pose, sqLift: 0, ctrl: false, moPose: "hidden" });
    ss.tick(0.02);
    ss.drawFrame();
    const cv = document.querySelector("canvas"),
      k = cv.width / 960;
    const im = await new Promise((ok, no) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = no;
      i.src = "docs/locked-rooms/home-room-empty-closed-v6.png";
    });
    const o = document.createElement("canvas");
    o.width = cv.width;
    o.height = cv.height;
    o.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
    // Under the mattress, across the crate: where the old bar (y 422 to 450) hung below the mattress.
    const x0 = Math.round(130 * k),
      y0 = Math.round(441 * k),
      w = Math.round(150 * k),
      h = Math.round(8 * k);
    const a = cv.getContext("2d").getImageData(x0, y0, w, h).data,
      b = o.getContext("2d").getImageData(x0, y0, w, h).data;
    let d = 0,
      purple = 0;
    for (let i = 0; i < a.length; i += 4) {
      d += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
      purple += a[i] > 140 && a[i] < 200 && a[i + 2] > 220 && a[i + 1] < 170 ? 1 : 0;
    }
    return { diff: d / (a.length / 4) / 3, purple, area: a.length / 4 };
  }, pose);
  g.check(`${pose === "sleep" ? "asleep" : "sitting up"} in bed: no purple bar under the mattress, the picture shows as locked`, r.diff < 6 && r.purple === 0, r);
}
const draw = readFileSync(join(root, "src", "game", "60-frame-draw.js"), "utf8");
g.check("the bed drawing has no purple bar of its own (m(120, 422, 170, 28, ...) with #a98bff)", !/m\(120, 422, 170, 28, 12\),\s*r\("#a98bff"/.test(draw));
g.check("no page errors", errors.length === 0, errors);
await g.finish("bed-look");
