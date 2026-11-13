/**
 * Every cut-in uses the one recipe in drawCutInChrome (docs/CUT-IN-SPEC.md).
 *   node tests/cut-in-shared.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startGame } from "./game-page.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const game = ["12-ch1-redesign.js", "13-ch1-slice.js", "14-ch1-day1.js", "14-ch1-day2.js", "60-frame-draw.js"]
  .map((name) => readFileSync(join(root, "src/game", name), "utf8"))
  .join("\n");
const blurs = game.match(/blur\(/g) || [];
const g = await startGame({ port: 8848, name: "cut-in-shared" });
g.check("the room blur is drawn in one place", blurs.length === 1, blurs.length);
const fn = (name) => (game.match(new RegExp("function " + name + "\\(\\) \\{([\\s\\S]*?)\\n    function ")) || [])[1] || "";
g.check("the bar, the day-2 zooms, and the beard cut-in call the shared frame", fn("drawCh1Cut").includes("drawCutInChrome") && fn("drawCh1Zoom").includes("drawCutInChrome") && fn("drawCh1Beard").includes("drawCutInChrome"));
g.check("dress-up keeps the white card and uses the shared X", fn("drawCh1Dress").includes("drawCutInX(") && !fn("drawCh1Dress").includes("drawCutInChrome"));

const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });
const seen = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const cv = document.querySelector("canvas");
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const cut = ss.cutIn();
  const light = (x, y) => {
    const p = cx.getImageData(x, y, 1, 1).data;
    return p[0] > 220 && p[1] > 220 && p[2] > 220;
  };
  const yellow = (x, y) => {
    const p = cx.getImageData(x, y, 1, 1).data;
    return p[0] > 180 && p[1] > 140 && p[2] < 120;
  };
  n.scene = "Q1";
  n.room = "closet";
  n.wardrobe = "closed";
  n.ctrl = false;
  n.q = [];
  n.cur = null;
  n.live = [];
  n.ch1Party = false;
  n.ch1Cut = null;
  n.ch1Zoom = null;
  n.ch1Dress = null;
  n.moPose = "hidden";
  n.sqPose = "stand";
  const open = (arm) => {
    arm();
    ss.settleRoom();
    ss.drawFrame();
    return { x: light(cut.x, cut.y - 22), wide: light(cut.x - 30, cut.y), far: light(cut.x - 52, cut.y) };
  };
  const beard = open(() => {
    n.ch1Beard = { zoom: 1, t: 0.2, closing: false };
  });
  const beats = ["lean", "dunk", "mop", "wring"].map((name) => {
    const t = { lean: 0.6, dunk: 1.7, mop: 3.2, wring: 5.4 }[name];
    n.ch1Beard = { zoom: 1, t, closing: false };
    ss.drawFrame();
    let bucket = 0;
    for (let y = 420; y < 560; y += 4) for (let x = 270; x < 360; x += 4) if (yellow(x, y)) bucket++;
    n.ch1Beard = null;
    return { name, got: ss.beardBeat(t).name, bucket };
  });
  n.ch1Beard = null;
  const bar = open(() => {
    n.ch1Cut = { id: "bar", zoom: 1, paw: { x: 400, y: 500 }, held: "", bag: 0, back: 4, glance: 0, face: 0, catches: 0, drag: false };
  });
  n.ch1Cut = null;
  const zoom = open(() => {
    n.ch1Zoom = { id: "eat", zoom: 1, paw: { x: 400, y: 500 } };
    n.ch1Fed = 0;
  });
  n.ch1Zoom = null;
  n.ch1Dress = { on: true, head: "", face: "", body: "", legs: "", extra: [] };
  n.room = "closet";
  ss.drawFrame();
  const dress = { x: light(cut.x, cut.y - 22), wide: light(cut.x - 30, cut.y) };
  n.ch1Dress = null;
  return { cut, beard, bar, zoom, dress, beats };
});
g.check("the shared zoom is half a second in and under half a second out", seen.cut.zoomIn === 0.5 && seen.cut.zoomOut === 0.4 && seen.cut.blur === 6 && seen.cut.dark === 0.35 && seen.cut.r >= 32, seen.cut);
g.check("the beard, the bar, and the day-2 zoom share the same X", seen.beard.x && seen.beard.wide && !seen.beard.far && seen.bar.x && seen.bar.wide && seen.zoom.x && seen.zoom.wide && seen.dress.x && seen.dress.wide, seen);
g.check(
  "the beard gag has four different beats and the bucket stays visible",
  seen.beats.map((b) => b.got).join(",") === "lean,dunk,mop,wring" && seen.beats.every((b) => b.bucket > 8),
  seen.beats,
);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("cut-in-shared");
