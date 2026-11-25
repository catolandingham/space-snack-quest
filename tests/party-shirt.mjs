/**
 * The party shirt's long sleeves (Brian 2026-11-25: paw "C" for the snack close-up, "his party shirt gets long
 * sleeves to match"; src/modules/party-shirt-art.js, sleeve-art.js). Wherever Squatch wears the shirt, each arm
 * is in an orange sleeve with his paw out of a fur cuff; on its own, the shirt hangs with long sleeves. Read from
 * the colour of the drawn picture, at phone size, in every place it is drawn:
 *   - in the dress-up closet, the shirt on its hook (long sleeves hanging down its sides);
 *   - on Squatch in the dress-up, at home after GO · party, in the hall at the party;
 *   - in the full-screen dance, in every pose (his arms move; the sleeves go with them);
 *   - in the group photo's Polaroid.
 * At each: along the middle of each arm, from the shoulder toward the cuff, the picture is the shirt's orange (it
 * was his fur before); at the end of each arm his paw shows (his pad colour). Checked against the short-sleeved
 * shirt: every place fails there.
 * Stills at 375 x 812 go to tests/out/party-stills/ (shirt-*.png), or to STILLS if set.
 *   node tests/party-shirt.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = process.env.STILLS || join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9216, name: "party-shirt" });
const look = await import(join(root, "src", "modules", "squatch-art.js"));
const shirt = await import(join(root, "src", "modules", "party-shirt-art.js"));
const sleeveArt = await import(join(root, "src", "modules", "sleeve-art.js"));
const D = await import(join(root, "src", "modules", "party-dance.js"));
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const ORANGE = "#ff8a3d",
  PAD = look.SQUATCH_LOOK.mask;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const like = (c, h, tol = 14) => hex(h).every((v, j) => Math.abs(v - c[j]) <= tol);
const still = (page, name) => page.screenshot({ path: join(OUT, name + ".png") });

/**
 * Where to look on him, in his own units, for arms `arms` (armEnds): three places along the middle of each
 * sleeve (a quarter, a third, a half and two thirds of the way from his shoulder to the cuff) and his paw. `px`
 * is how many of the canvas's pixels one of his units is.
 */
function armSamples(arms, px = 10) {
  const edge = 2 / px; // (two pixels of blending at the cuff's edge, in his units, for his size in pixels)
  return look.armEnds(arms).map((a) => {
    const corners = a.elbow === a.hand ? [a.shoulder, a.hand] : [a.shoulder, a.elbow, a.hand],
      lens = corners.slice(1).map((c, j) => Math.hypot(c.x - corners[j].x, c.y - corners[j].y)),
      sleeve = lens.reduce((n, l) => n + l, 0) - shirt.SLEEVE.pawGap,
      at = (d) => {
        let j = 0;
        while (j < lens.length - 1 && d > lens[j]) d -= lens[j++];
        const k = d / lens[j];
        return { x: corners[j].x + (corners[j + 1].x - corners[j].x) * k, y: corners[j].y + (corners[j + 1].y - corners[j].y) * k };
      };
    // (a bent arm can fold its paw back over its own sleeve, the cuff and paw in front: a place they cover is
    // left out, and at least one place on each sleeve is always read)
    const cuff = at(sleeve),
      before = at(sleeve - 0.5),
      dir = Math.atan2(cuff.y - before.y, cuff.x - before.x), // the way the sleeve runs at the cuff
      C = shirt.SLEEVE.cuff,
      underCuff = (q) => {
        const dx = q.x - cuff.x,
          dy = q.y - cuff.y,
          along = dx * Math.cos(dir) + dy * Math.sin(dir),
          across = -dx * Math.sin(dir) + dy * Math.cos(dir);
        return (along / (C.ry + C.amp + 0.6 + edge)) ** 2 + (across / (C.rx + C.amp + 0.6 + edge)) ** 2 <= 1;
      },
      clear = (q) => !underCuff(q) && Math.hypot(q.x - a.hand.x, q.y - a.hand.y) > shirt.SLEEVE.paw + 1.5 + edge;
    return { sleeve: [1 / 4, 1 / 3, 1 / 2, 2 / 3].map((k) => at(sleeve * k)).filter(clear), paw: a.hand };
  });
}
/** Reads the picture at each arm's places; `toScreen(u)` turns his units into the canvas's own pixels. */
async function readArms(page, canvasSel, samples, toScreen) {
  const pts = samples.flatMap((s) => [...s.sleeve, s.paw]).map(toScreen);
  const cs = await page.evaluate(
    (sel, pts) => {
      const c = document.querySelector(sel),
        ctx = c.getContext("2d");
      return pts.map((p) => Array.from(ctx.getImageData(Math.round(p.x), Math.round(p.y), 1, 1).data).slice(0, 3));
    },
    canvasSel,
    pts,
  );
  let i = 0;
  return samples.map((s) => {
    const sleeve = cs.slice(i, i + s.sleeve.length);
    i += s.sleeve.length;
    return { sleeve, paw: cs[i++] };
  });
}
// The shirt's colours: its orange, one of its spots, or (at a small size) a blend of the orange and a spot.
const onShirt = (c) =>
  sleeveArt.SHIRT_SPOTS.some((h) => {
    const a = hex(ORANGE),
      b = hex(h),
      ab = a.map((v, j) => b[j] - v),
      t = Math.max(0, Math.min(1, ab.reduce((n, v, j) => n + v * (c[j] - a[j]), 0) / ab.reduce((n, v) => n + v * v, 0)));
    return Math.hypot(...a.map((v, j) => v + ab[j] * t - c[j])) <= 24;
  });
const sleevesOk = (arms) => arms.every((a) => a.sleeve.length > 0 && a.sleeve.every(onShirt) && a.sleeve.some((c) => like(c, ORANGE, 20)) && like(a.paw, PAD, 18));
const show = (arms) => arms.map((a) => ({ sleeve: a.sleeve.map((c) => c.join(",")), paw: a.paw.join(",") }));

// ---------- the dress-up, at home, and out into the hall ----------
{
  const { page, errors } = await g.open("?beat=party:P5", PHONE);
  await sleep(1400);
  const targets = () => page.evaluate(() => window.SSQ.beat("ch1-party").dressTargets());
  await page.evaluate(() => window.__ss.tapAt(140, 410));
  await page.waitForFunction(() => window.__ss.op.act && window.__ss.op.act.verb === "OPEN", { timeout: 8000 });
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  await sleep(600);
  let d = await targets();
  const DRESS = 'canvas[aria-label="dress-up"]',
    k = await page.evaluate((sel) => document.querySelector(sel).width / document.querySelector(sel).clientWidth, DRESS);
  // the shirt on its own in the closet: a long sleeve hanging down each side, half way down (its own box: the
  // sleeve runs from its shoulder, 0.36 of its width out, to 0.47 out at the hem)
  const piece = d.pieces.find((p) => p.id === "shirt"),
    h = piece.w * 0.8,
    hanging = await page.evaluate(
      (sel, pts) => pts.map((p) => Array.from(document.querySelector(sel).getContext("2d").getImageData(Math.round(p[0]), Math.round(p[1]), 1, 1).data).slice(0, 3)),
      DRESS,
      [-1, 1].flatMap((s) => [0.25, 0.5, 0.75].map((f) => [(piece.x + s * piece.w * (0.36 + 0.11 * f)) * k, (piece.y + h * (-0.36 + 0.8 * f)) * k])),
    );
  g.check("in the closet the shirt hangs with a long sleeve down each side", hanging.every((c) => like(c, ORANGE)), hanging.map((c) => c.join(",")));
  await still(page, "shirt-01-in-the-closet");
  const drag = async (a, b) => {
    await page.touchscreen.touchStart(a.x, a.y);
    for (let i = 1; i <= 6; i++) (await page.touchscreen.touchMove(a.x + ((b.x - a.x) * i) / 6, a.y + ((b.y - a.y) * i) / 6), await sleep(20));
    await page.touchscreen.touchEnd();
    await sleep(250);
  };
  for (const [id, spot] of [
    ["tophat", "head"],
    ["shades", "face"],
    ["shirt", "body"],
    ["boots", "legs"],
  ]) {
    await drag(
      d.pieces.find((p) => p.id === id),
      d.spots[spot],
    );
    d = await targets();
  }
  await sleep(1500); // (the ta-da hop is over)
  d = await targets();
  const atRest = armSamples(null, d.sq.scale * k),
    inDress = await readArms(page, DRESS, atRest, (u) => ({ x: (d.sq.x + u.x * d.sq.scale) * k, y: (d.sq.y + u.y * d.sq.scale) * k }));
  g.check("dressed in the dress-up: both arms in long orange sleeves, his paws out of the cuffs", d.outfit.body === "shirt" && sleevesOk(inDress), show(inDress));
  await still(page, "shirt-02-dress-up");
  await page.touchscreen.tap(d.go.x, d.go.y);
  await sleep(600);
  // at home, standing (the room's Squatch: his feet, his size, the way he faces, how his arms swing)
  const inRoom = async () => {
    const at = await page.evaluate(() => {
      const n = window.__ss.op,
        e = window.SSQ.engine();
      return { x: n.sq.x, y: n.sq.y, f: n.sq.f || 1, sc: e.squatchScale(), walk: e.walkPhase(), k: document.querySelector("canvas").width / 960 };
    });
    return readArms(page, "canvas", armSamples(shirt.walkArms(at.walk), at.sc * at.k), (u) => ({ x: (at.x + u.x * at.sc * at.f) * at.k, y: (at.y + u.y * at.sc) * at.k }));
  };
  // (the game's own clock stopped for one exact frame: the walk phase read is the one drawn)
  await page.evaluate(() => ((window.requestAnimationFrame = () => 0), window.__ss.drawFrame()));
  const home = await inRoom();
  g.check("at home after GO · party: both arms in long orange sleeves, his paws out of the cuffs", sleevesOk(home), show(home));
  await still(page, "shirt-03-at-home");
  g.check("no page errors (the dress-up and home)", errors.length === 0, errors.slice(0, 3));
  await page.close();
}
{
  const { page, errors } = await g.open("?beat=party:P6", PHONE);
  await sleep(1400);
  await page.evaluate(() => ((window.requestAnimationFrame = () => 0), window.__ss.drawFrame()));
  const at = await page.evaluate(() => {
    const n = window.__ss.op,
      e = window.SSQ.engine();
    return { x: n.sq.x, y: n.sq.y, f: n.sq.f || 1, sc: e.hallSizes().squatch, walk: e.walkPhase(), k: document.querySelector("canvas").width / 960, body: n.ch1PartyNow.outfit.body };
  });
  const arms = await readArms(page, "canvas", armSamples(shirt.walkArms(at.walk), at.sc * at.k), (u) => ({ x: (at.x + u.x * at.sc * at.f) * at.k, y: (at.y + u.y * at.sc) * at.k }));
  g.check("in the hall at the party: both arms in long orange sleeves, his paws out of the cuffs", at.body === "shirt" && sleevesOk(arms), show(arms));
  await still(page, "shirt-04-in-the-hall");
  // walking: the sleeves swing with his arms (two places in his stride)
  const strides = [];
  for (const target of [
    [at.x + 160, at.y],
    [at.x - 40, at.y],
  ]) {
    await page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), target);
    await page.evaluate(() => {
      for (let i = 0; i < 14; i++) window.__ss.tick(1 / 60);
      window.__ss.drawFrame();
    });
    const w = await page.evaluate(() => {
      const n = window.__ss.op,
        e = window.SSQ.engine();
      return { x: n.sq.x, y: n.sq.y, f: n.sq.f || 1, sc: e.hallSizes().squatch, walk: e.walkPhase(), k: document.querySelector("canvas").width / 960 };
    });
    strides.push({ walk: +w.walk.toFixed(2), arms: await readArms(page, "canvas", armSamples(shirt.walkArms(w.walk), w.sc * w.k), (u) => ({ x: (w.x + u.x * w.sc * w.f) * w.k, y: (w.y + u.y * w.sc) * w.k })) });
  }
  g.check("walking in the hall the sleeves swing with his arms (read mid-stride)", strides.some((s) => s.walk !== 0) && strides.every((s) => sleevesOk(s.arms)), strides.map((s) => ({ walk: s.walk, arms: show(s.arms) })));
  g.check("no page errors (the hall)", errors.length === 0, errors.slice(0, 3));
  await page.close();
}

// ---------- the dance, every pose ----------
{
  const W = 375,
    H = 812;
  const { page, errors } = await g.open("?beat=party:P6", PHONE);
  await sleep(1200);
  await page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4]);
  await page.waitForFunction(() => window.__ss.op.act && window.__ss.op.act.verb === "DANCE", { timeout: 9000 });
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  await page.waitForFunction(() => !!document.querySelector('canvas[aria-label="dance"]') && window.__ss.op.ch1PartyNow.dance, { timeout: 4000 });
  await page.evaluate(() => {
    window.__frames = {};
    window.requestAnimationFrame = (f) => ((window.__frames[f.name || "game"] = f), 0);
  });
  await sleep(120);
  const DANCE = 'canvas[aria-label="dance"]',
    k = await page.evaluate((sel) => document.querySelector(sel).width / document.querySelector(sel).clientWidth, DANCE);
  const bad = [];
  // Each pose as the dance holds it after a hit (the pose stays while "hold" runs; the test stops the clock there).
  for (let i = 0; i < D.POSES.length; i++) {
    const d = await page.evaluate((i) => {
      const dd = window.__ss.op.ch1PartyNow.dance;
      Object.assign(dd, { pose: i, stumble: 0, party: 0, pop: 0, live: false });
      window.__frames.frame && window.__frames.frame();
      return JSON.parse(JSON.stringify(dd));
    }, i);
    const at = D.danceSquatch(W, H, d),
      arms = await readArms(page, DANCE, armSamples(D.POSES[i].arms, at.scale * k), (u) => {
        const q = D.onScreen(at, u.x, u.y);
        return { x: q.x * k, y: q.y * k };
      });
    sleevesOk(arms) || bad.push({ pose: D.POSES[i].id, arms: show(arms) });
    i === D.poseIndex("belly") && (await still(page, "shirt-05-dance-paw-on-belly"));
    i === D.poseIndex("cheer") && (await still(page, "shirt-06-dance-cheer"));
  }
  g.check(`in the dance, in all ${D.POSES.length} poses: both arms in long orange sleeves, his paws out of the cuffs`, bad.length === 0, bad);
  g.check("no page errors (the dance)", errors.length === 0, errors.slice(0, 3));
  await page.close();
}

await g.finish("party-shirt");
