/**
 * Mops's mop bucket (Brian 2026-11-26, phase-3 item 3, video note 0:39: "I like this mop bucket... Let's go with it
 * moving forward."): the bucket the bedtime story's pictures drew is his bucket everywhere it shows, from one drawing
 * (src/modules/mop-bucket.js).
 *   - In the home room it is drawn over the locked picture's painted bucket (the picture itself never changes), in the
 *     same place, under the people: the painted bucket's water no longer shows, the new yellow bucket does, inside the
 *     floor box the room's solids give the bucket.
 *   - Squatch standing behind it: the bucket is drawn again over him (as the room did with the painted one), and the
 *     floor is not painted over him.
 *   - The bedtime story's bucket pictures and the home room use the same drawing functions.
 * Played on a phone (375 x 812), Day 2's home room.
 *   node tests/mop-bucket.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const g = await startGame({ port: 9756, name: "mop-bucket" });
const { page, errors } = await g.open("?ch=1&beat=day2", { width: 375, height: 812, isMobile: true, hasTouch: true });
await page.evaluate(() => window.__ss.lockedReady);
await new Promise((r) => setTimeout(r, 1200));

// Counts pixels of a colour kind in a box of game positions (the canvas is the 960 x 640 picture, scaled).
const look = (sq) =>
  page.evaluate((sq) => {
    const n = window.__ss.op;
    if (sq) Object.assign(n.sq, sq), (n.sqPose = "stand");
    else (n.sq.x = 300), (n.sq.y = 590);
    window.__ss.drawFrame();
    const cv = document.querySelector("canvas"),
      k = cv.width / 960,
      c = cv.getContext("2d");
    const count = (x0, y0, x1, y1, test) => {
      const d = c.getImageData(Math.round(x0 * k), Math.round(y0 * k), Math.max(1, Math.round((x1 - x0) * k)), Math.max(1, Math.round((y1 - y0) * k))).data;
      let m = 0;
      for (let i = 0; i < d.length; i += 4) test(d[i], d[i + 1], d[i + 2]) && m++;
      return m;
    };
    const grey = (r, g2, b) => Math.abs(r - 0x59) < 18 && Math.abs(g2 - 0x65) < 18 && Math.abs(b - 0x7d) < 18,
      rim = (r, g2, b) => Math.abs(r - 0xe0) < 18 && Math.abs(g2 - 0xa8) < 18 && b < 70,
      blue = (r, g2, b) => r < 170 && g2 > 200 && b > 235,
      yellow = (r, g2, b) => r > 230 && g2 > 180 && b < 90,
      fur = (r, g2, b) => r > 80 && r < 130 && g2 > 50 && g2 < 90 && b < 60;
    return {
      scene: n.scene,
      drawn: window.SSQ.homeBucketDrawn(),
      // the painted bucket's water stood up out of its top, at about y 500 to 506: plain floor now
      oldWater: count(540, 498, 580, 505, blue),
      // the new bucket's body (yellow) and its water inside the rim
      body: count(545, 525, 575, 555, yellow),
      water: count(545, 509, 575, 513, blue),
      // past the bucket's right side, where the old code bucket once stood (tests/scene1-morning.mjs): no yellow
      past: count(602, 520, 640, 560, yellow),
      furInBody: count(545, 525, 575, 555, fur),
      // only the new bucket has these: grey wheels at its foot, and its darker rim sticking out left of where the
      // painted bucket's side was (x 532)
      wheels: count(536, 562, 582, 571, grey),
      rimOut: count(522, 505, 531, 513, rim),
    };
  }, sq);

const a = await look(null);
g.check("Day 2's home room (the locked picture) is on screen", a.scene === "QB", a.scene);
g.check("the mop bucket is drawn in the home room", !!a.drawn, a.drawn);
g.check("in the painted bucket's place: middle x 559, its wheels on the floor at y 568, no wider than x 518 to 600", a.drawn && a.drawn.x0 >= 518 && a.drawn.x1 <= 600 && a.drawn.y1 === 568 && Math.abs((a.drawn.x0 + a.drawn.x1) / 2 - 559) <= 1, a.drawn);
g.check("the painted bucket no longer shows (its water above the new rim is plain floor)", a.oldWater === 0, a.oldWater);
g.check("the new bucket shows: a yellow body, water inside its rim, its grey wheels and its rim wider than the painted bucket", a.body > 100 && a.water > 10 && a.wheels > 4 && a.rimOut > 4, a);
g.check("nothing yellow past its right side (where the old code bucket stood)", a.past === 0, a.past);
// Squatch standing just behind it (his feet at y 545, above the bucket's foot at 568): his legs and body are where the
// bucket's body is, so without the bucket drawn again over him his fur would show there
const b = await look({ x: 559, y: 545 });
g.check("Squatch standing behind it: the bucket is drawn over him (yellow, none of his fur in front of it)", b.body > 100 && b.furInBody === 0 && b.wheels > 4, b);
const c = await look({ x: 559, y: 580 });
g.check("(the check can see him: standing in front of the bucket, his fur covers its body)", c.furInBody > 50, c.furInBody);

const art = readFileSync(join(root, "src", "modules", "bedtime-story-art.js"), "utf8"),
  bucket = readFileSync(join(root, "src", "modules", "mop-bucket.js"), "utf8"),
  draw = readFileSync(join(root, "src", "game", "60-frame-draw.js"), "utf8");
g.check("one drawing: the bedtime pictures and the home room both draw it with mop-bucket.js", /from "\.\/mop-bucket\.js"/.test(art) && /drawMopBucketFront\(ctx, B\.cx/.test(art) && /drawMopBucketFront\(ctx, H\.cx/.test(bucket));
g.check("the older program reaches it only through window.SSQ, guarded", (draw.match(/window\.SSQ && window\.SSQ\.drawHomeBucket && window\.SSQ\.drawHomeBucket\(e/g) || []).length === 2);
g.check("no page errors", errors.length === 0, errors);
await page.close();
await g.finish("mop-bucket");
