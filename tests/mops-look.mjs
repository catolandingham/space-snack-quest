/**
 * Mops looks like the picture Brian approved on Nov 8 (mops-approved-nov8.png, "Yes!!"):
 * a blue work shirt with a two-point collar and a chest pocket with a white GANITOR name tag (2026-11-26; was an oval patch),
 * a short tail, floppy ears with pink insides, closed smiling eyes and a smile, a narrow beard
 * from his chin to the floor (it is his mop), dark hooves, no gold badge and no mop stick.
 * Checked in Chapter 1 (home) and Chapter 2, since every chapter draws him with the same
 * function, and in each pose that function draws (stand, facing left, walking, sway, asleep,
 * yawn, pant with head down), through the debug hook window.__ss.drawMops.
 *
 * How: the canvas calls made while Mops is drawn are recorded. Mops is put at a spot nobody else
 * uses, so his drawing is the save/translate(x, y)/.../restore block that starts there.
 * Each fill or stroke is kept with its colour and the box of its path, in Mops's own units
 * (facing right, feet at 0, the body is about x -17..17 and y -26..-8, the head is at the right).
 * Also: every music file in music/ is served by the test page as an mp3.
 *   node tests/mops-look.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8993, name: "mops look" });

// Installed in the page: records Mops's fills and strokes while drawFrame() runs once.
function recorder() {
  const P = CanvasRenderingContext2D.prototype;
  if (P.__mopsRec) return;
  P.__mopsRec = true;
  const st = (window.__mopsRec = { target: null, on: false, depth: 0, startDepth: 0, pts: [], ops: [] });
  const wrap = (name, fn) => {
    const orig = P[name];
    P[name] = function (...a) {
      fn.call(this, a);
      return orig.apply(this, a);
    };
  };
  const pt = (x, y) => st.on && st.pts.push([x, y]);
  wrap("save", () => st.depth++);
  wrap("restore", () => {
    st.depth--;
    if (st.on && st.depth < st.startDepth) st.on = false;
  });
  wrap("translate", ([x, y]) => {
    if (!st.on && st.target && Math.abs(x - st.target.x) < 0.01 && Math.abs(y - st.target.y) < 0.01) {
      st.on = true;
      st.startDepth = st.depth;
      st.pts = [];
    }
  });
  wrap("beginPath", () => ((st.pts = []), (st.lastEllipse = false)));
  wrap("moveTo", ([x, y]) => pt(x, y));
  wrap("lineTo", ([x, y]) => pt(x, y));
  wrap("quadraticCurveTo", ([cx, cy, x, y]) => (pt(cx, cy), pt(x, y)));
  wrap("bezierCurveTo", ([a, b, c2, d, x, y]) => (pt(a, b), pt(c2, d), pt(x, y)));
  wrap("arcTo", ([a, b, x, y]) => (pt(a, b), pt(x, y)));
  wrap("arc", ([x, y, r]) => (pt(x - r, y - r), pt(x + r, y + r)));
  wrap("roundRect", ([x, y, w2, h2]) => (pt(x, y), pt(x + w2, y + h2)));
  wrap("ellipse", ([x, y, rx, ry]) => {
    pt(x - rx, y - ry);
    pt(x + rx, y + ry);
    st.on && (st.lastEllipse = true);
  });
  const box = () => {
    if (!st.pts.length) return null;
    const xs = st.pts.map((p) => p[0]),
      ys = st.pts.map((p) => p[1]);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  };
  wrap("fill", function () {
    st.on && st.ops.push({ k: "fill", c: String(this.fillStyle).toLowerCase(), b: box(), oval: !!st.lastEllipse });
  });
  wrap("stroke", function () {
    st.on && st.ops.push({ k: "stroke", c: String(this.strokeStyle).toLowerCase(), b: box() });
  });
}

async function mopsOps(page, setup) {
  // Past the title, so a frame draws the game.
  await page.click("canvas");
  await page.waitForFunction(() => window.__ss.game.state === "op", { timeout: 15000 });
  await page.evaluate(recorder);
  return page.evaluate((setup) => {
    // Freeze the game's own loop so only our frame draws.
    window.requestAnimationFrame = () => 0;
    const op = window.__ss.op;
    Object.assign(op, { q: [], cur: null }, setup.op || {});
    Object.assign(op.mo, setup.mo || {});
    Object.assign(op.sq, setup.sq || {});
    const st = window.__mopsRec;
    st.target = { x: op.mo.x, y: op.mo.y };
    st.ops = [];
    st.on = false;
    window.__ss.drawFrame();
    st.target = null;
    return st.ops;
  }, setup);
}

const hex = (c) => {
  const m = /^#([0-9a-f]{6})$/.exec(c);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const isBlue = (c) => {
  const v = hex(c);
  return !!v && v[2] > 150 && v[2] > v[0] + 60 && v[2] > v[1] + 20;
};
const isGold = (c) => {
  const v = hex(c);
  return !!v && v[0] > 200 && v[1] > 140 && v[2] < 90;
};
const isWhite = (c) => {
  const v = hex(c);
  return !!v && v[0] > 235 && v[1] > 235 && v[2] > 235;
};
const isPink = (c) => {
  const v = hex(c);
  return !!v && v[0] > 220 && v[1] > 130 && v[1] < 205 && v[2] > 150 && v[2] < 215;
};
const INK = "#1e2430";
// A dark grey that is not the outline ink: the hooves.
const isHoof = (c) => {
  const v = hex(c);
  return !!v && c !== INK && v[0] < 110 && v[1] < 110 && v[2] < 120;
};
const w = (b) => b.x1 - b.x0;
const h = (b) => b.y1 - b.y0;
const inside = (a, b) => a.x0 >= b.x0 - 0.5 && a.x1 <= b.x1 + 0.5 && a.y0 >= b.y0 - 0.5 && a.y1 <= b.y1 + 0.5;

function checkLook(where, ops, pose = {}) {
  const fills = ops.filter((o) => o.k === "fill" && o.b);
  const strokes = ops.filter((o) => o.k === "stroke" && o.b);
  g.check(`${where}: Mops was drawn`, fills.length > 5, { fills: fills.length });
  // Shirt: a blue fill that covers the body from back to chest (the body is x -17..17).
  const shirt = fills.find((o) => isBlue(o.c) && w(o.b) >= 26 && h(o.b) >= 12);
  g.check(`${where}: blue shirt over the body`, !!shirt, fills.filter((o) => isBlue(o.c)));
  // Collar: two separate blue points at the neck (head side, top of the shirt), as in the picture.
  const collar = fills.filter((o) => o !== shirt && isBlue(o.c) && o.b.x1 > 8 && o.b.y0 < -20 && w(o.b) < 9);
  g.check(`${where}: shirt collar with two points at the neck`, collar.length === 2, fills.filter((o) => isBlue(o.c)).map((o) => o.b));
  // Pocket: a small blue piece on the chest, with a white oval name patch inside its top.
  const pocket = fills.find((o) => o !== shirt && !collar.includes(o) && isBlue(o.c) && w(o.b) < 12 && h(o.b) < 12 && o.b.x0 > -2 && o.b.y0 > -24);
  g.check(`${where}: chest pocket`, !!pocket, fills.filter((o) => isBlue(o.c)).map((o) => o.b));
  // (Brian 2026-11-26, Ganitor A: the old white oval name patch is now his GANITOR name tag, a white tag across the
  // pocket's top, src/modules/ganitor.js; nothing else about him changed)
  const tag = pocket && fills.find((o) => isWhite(o.c) && !o.oval && w(o.b) >= 8 && w(o.b) <= 11 && h(o.b) <= 5.5 && o.b.x0 <= pocket.b.x0 + 2 && o.b.x1 >= pocket.b.x1 - 1 && Math.abs(o.b.y1 - pocket.b.y0) < 4);
  g.check(`${where}: white GANITOR name tag across the pocket's top`, !!tag, fills.filter((o) => isWhite(o.c)).map((o) => o.b).slice(-4));
  // Tail: a white piece behind the body (the back is at x -17), up at the rump.
  const tail = fills.find((o) => isWhite(o.c) && o.b.x0 < -17 && o.b.x1 < -8 && o.b.y1 < -12);
  g.check(`${where}: short white tail at the back`, !!tail, fills.filter((o) => isWhite(o.c)).map((o) => o.b));
  // No badge: nothing gold anywhere on him.
  const gold = ops.filter((o) => isGold(o.c));
  g.check(`${where}: no gold badge`, gold.length === 0, gold);
  // No mop stick: the beard is his mop (C2 "No mop prop, ever").
  const stick = ops.filter((o) => o.k === "stroke" && o.c === "#b8a07e");
  g.check(`${where}: no mop stick`, stick.length === 0, stick.length);
  // Head: the white round fill at the front, above the body. Everything on the face is placed from it.
  const head = fills.find((o) => isWhite(o.c) && w(o.b) >= 12 && w(o.b) <= 24 && (o.b.x0 + o.b.x1) / 2 > 12 && (o.b.y0 + o.b.y1) / 2 < -20);
  g.check(`${where}: head found`, !!head, fills.filter((o) => isWhite(o.c)).map((o) => o.b));
  if (!head) return;
  const hx = (head.b.x0 + head.b.x1) / 2,
    hy = (head.b.y0 + head.b.y1) / 2;
  // Ears: floppy, one each side of the head, with pink insides (bigger than the pink nose).
  const pinks = fills.filter((o) => isPink(o.c) && w(o.b) >= 3);
  const earL = pinks.find((o) => o.b.x1 < hx - 2),
    earR = pinks.find((o) => o.b.x0 > hx + 2);
  g.check(`${where}: floppy ears with pink insides, one each side`, !!earL && !!earR, { hx, pinks: pinks.map((o) => o.b) });
  const ears = fills.filter((o) => isWhite(o.c) && w(o.b) >= 6 && w(o.b) <= 13 && h(o.b) <= 9 && Math.abs((o.b.y0 + o.b.y1) / 2 - hy) < 6 && Math.abs((o.b.x0 + o.b.x1) / 2 - hx) > 6);
  g.check(`${where}: white ear flaps beside the head`, ears.length >= 2, ears.map((o) => o.b));
  // Eyes closed: no round dark dot on the face, and a short dark line at eye height.
  const dot = fills.filter((o) => o.c === INK && w(o.b) <= 4 && inside(o.b, head.b) && o.b.y0 < hy + 1);
  g.check(`${where}: no open eye dot`, dot.length === 0, dot);
  const eye = strokes.find((o) => o.c === INK && w(o.b) >= 1.5 && w(o.b) <= 5 && h(o.b) <= 2.5 && o.b.y0 > hy - 4 && o.b.y1 < hy + 1.5 && o.b.x0 > hx - 2);
  g.check(`${where}: closed eye`, !!eye, strokes.filter((o) => o.c === INK && w(o.b) < 8).map((o) => o.b));
  // Mouth: a smile under the nose, or the round "o" when the pose calls for it.
  if (pose.mouth === "o" || pose.mouth === "open") {
    const o = fills.find((f) => f.c === INK && f.oval && f.b.y0 > hy);
    g.check(`${where}: round open mouth`, !!o);
  } else {
    const smile = strokes.find((o) => o.c === INK && w(o.b) >= 2 && w(o.b) <= 6 && h(o.b) <= 3 && o.b.y0 > hy + 1 && o.b.x0 > hx);
    g.check(`${where}: smile`, !!smile, strokes.filter((o) => o.c === INK && w(o.b) < 8).map((o) => o.b));
  }
  // Beard: narrow, from the chin to the floor, in front of the chest.
  const beard = fills.find((o) => isWhite(o.c) && o.b.x0 >= 11 && w(o.b) <= 14 && o.b.y0 <= hy + 6 && o.b.y1 >= -1);
  g.check(`${where}: narrow beard from chin to floor`, !!beard, fills.filter((o) => isWhite(o.c)).map((o) => o.b));
  // Hooves: a dark grey end on each of the four legs, at the floor.
  const hooves = strokes.filter((o) => isHoof(o.c) && o.b.y1 >= -0.5 && h(o.b) <= 3.5);
  g.check(`${where}: four dark hooves`, hooves.length === 4, hooves.map((o) => [o.c, o.b]));
}

// A spot nobody else is drawn at, so the recorder finds Mops by it. Facing right, standing.
const MO = { x: 611.25, y: 503.5, f: 1, moving: false };

// Chapter 1, home room.
{
  const { page, ctx, errors } = await g.open("?ch=1");
  const ops = await mopsOps(page, { op: { room: "closet", scene: "Q1", moPose: "stand" }, mo: MO, sq: { x: 200, y: 470 } });
  checkLook("Chapter 1 home", ops);
  g.check("Chapter 1 home: no page errors", errors.length === 0, errors);
  await ctx.close();
}
// Chapter 2, the kitchen (Mops is passed mop: true here, the case that drew the stick).
{
  const { page, ctx, errors } = await g.open("?ch=2");
  const ops = await mopsOps(page, { op: { moPose: "stand" }, mo: MO });
  checkLook("Chapter 2", ops);
  g.check("Chapter 2: no page errors", errors.length === 0, errors);
  await ctx.close();
}
// Each pose the drawing has, drawn on its own through the debug hook (the same function the game calls).
// Poses come from X2 in 60-frame-draw.js (moPose: stand, sleep, sway, yawn, pant), walking, facing left,
// and the hall song cutaway's mouth: "open" (11-ch1-hall.js).
{
  const { page, ctx, errors } = await g.open("?ch=1");
  await page.click("canvas");
  await page.waitForFunction(() => window.__ss.game.state === "op", { timeout: 15000 });
  await page.evaluate(recorder);
  const poses = [
    ["stand", {}],
    ["facing left", { f: -1 }],
    ["walking", { walk: 1.3 }],
    ["sway", { eyes: "closed", sway: 0.07 }],
    ["asleep", { eyes: "closed" }],
    ["yawn", { mouth: "o" }],
    ["pant, head down", { mouth: "o", headDown: true }],
    ["carrying the mop flag", { mop: true }],
    ["singing", { mouth: "open" }],
  ];
  const hook = await page.evaluate(() => typeof window.__ss.drawMops === "function");
  g.check("debug hook __ss.drawMops draws Mops", hook);
  if (hook)
    for (const [i, [name, opts]] of poses.entries()) {
      const ops = await page.evaluate(
        (i, opts) => {
          window.requestAnimationFrame = () => 0;
          Object.assign(window.__ss.op, { room: "closet", scene: "Q1" });
          const st = window.__mopsRec,
            x = 101.25 + i * 3.5,
            y = 403.5;
          st.target = { x, y };
          st.ops = [];
          st.on = false;
          window.__ss.drawMops(x, y, 3, opts);
          st.target = null;
          return st.ops;
        },
        i,
        opts,
      );
      checkLook(`pose ${name}`, ops, opts);
    }
  g.check("poses: no page errors", errors.length === 0, errors);
  await ctx.close();
}
// The title screen's "Sir Mops-a-Lot" is the same approved Mops (2026-11-24: he was an old white goat with a
// gold badge and a separate mop stick, against rule 14 "Mops's beard is his mop; no separate mop prop").
// He is drawn mopping with his beard, head down, at (600, 386).
{
  const { page, ctx, errors } = await g.open("");
  await page.evaluate(recorder);
  const ops = await page.evaluate(() => {
    window.requestAnimationFrame = () => 0;
    const st = window.__mopsRec;
    st.target = { x: 600, y: 386 };
    st.ops = [];
    st.on = false;
    const state = window.__ss.game.state;
    window.__ss.drawFrame();
    st.target = null;
    return { ops: st.ops, state };
  });
  g.check("title: the title screen is up", ops.state === "title", ops.state);
  checkLook("title Sir Mops-a-Lot", ops.ops, { headDown: true });
  g.check("title: no page errors", errors.length === 0, errors);
  await ctx.close();
}
// Every music file is in music/ and the test page serves it as an mp3 (src/modules/music-picks.js says where each plays).
{
  const { page, ctx } = await g.open("?ch=1");
  const { readdirSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { root } = await import("./game-page.mjs");
  for (const file of readdirSync(join(root, "music")).filter((f) => f.endsWith(".mp3")).map((f) => "music/" + f)) {
  const got = await page.evaluate(async (file) => {
    const r = await fetch(file);
    const b = new Uint8Array(await r.arrayBuffer());
    return { status: r.status, type: r.headers.get("content-type"), bytes: b.length, head: [b[0], b[1], b[2]] };
  }, file);
  const mp3 = (got.head[0] === 0x49 && got.head[1] === 0x44 && got.head[2] === 0x33) || (got.head[0] === 0xff && (got.head[1] & 0xe0) === 0xe0);
  g.check(file + " is served as an mp3", got.status === 200 && got.type === "audio/mpeg" && got.bytes > 100000 && mp3, got);
  }
  await ctx.close();
}
await g.finish("mops look");
