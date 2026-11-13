/**
 * Standing play rules from the 2026-11-13 party review.
 *   node tests/play-rules.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8855, name: "play-rules" });
const { ctx, page, errors } = await g.open("?ch=1");

const rules = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const plant = ss.ch1Plant();
  const stage = ss.ch1Stage();
  const hits = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const guestHeads = [
    [250, 460],
    [320, 530],
    [620, 450],
    [740, 470],
    [200, 610],
    [520, 610],
    [660, 600],
  ].map(([x, y]) => ({ x: x - 16, y: y - 70, w: 32, h: 26 }));

  n.q = [];
  n.cur = null;
  n.live = [];
  n.ch1Chip = "";
  n.ch1Dress = null;
  n.ch1MopsLeave = 0;
  n.ch1Song = false;
  n.ch1Cut = null;
  n.ch1Zoom = null;
  n.scene = "QA";
  n.room = "hall";
  n.ctrl = false;
  n.ch1Party = true;
  ss.tick(0.05);
  const chipCut = n.chip || "";
  n.ctrl = true;
  n.ch1ToPlant = true;
  ss.tick(0.05);
  const chipPlay = n.chip || "";
  n.scene = "Q1";
  n.room = "closet";
  n.ctrl = false;
  n.ch1ToPlant = false;
  n.ch1Chip = "";
  ss.tick(0.05);
  const chipHome = n.chip || "";

  n.room = "hall";
  n.scene = "QA";
  n.ch1Party = true;
  n.ch1Talk = 0;
  n.ch1Dim = false;
  n.sqPose = "hidden";
  n.sq.x = plant.cx;
  n.sq.y = plant.y1;
  n.cur = { k: "bub", b: { who: "sq", text: "Robots?", style: "whisper" } };
  ss.drawFrame();
  const sqBub = ss.lastBubble;
  const sqOnGuest = guestHeads.some((h) => sqBub && hits(sqBub, h));
  n.ch1Talk = 1;
  n.cur = { k: "bub", b: { who: "official", text: "Welcome, everybody, to the Stormtop Space Party!", style: "say" } };
  ss.drawFrame();
  const isBub = ss.lastBubble;
  const isOnGuest = guestHeads.some((h) => isBub && isBub.head && hits(isBub, h));
  const faces = (n.ch1Face || []).slice();
  const eyes = n.ch1Eyes;
  const cam = n.ch1Cam;
  const goalSneak = (() => {
    n.ctrl = true;
    n.ch1ToPlant = true;
    n.ch1PeekReady = false;
    n.cur = null;
    ss.drawFrame();
    return n.ch1Goal;
  })();

  n.room = "closet";
  n.scene = "Q1";
  n.ctrl = true;
  n.ch1PeekReady = true;
  n.ch1ToPlant = false;
  n.ch1Party = false;
  n.ch1Talk = 0;
  n.ch1Song = false;
  n.ch1Dress = null;
  n.sqPose = "stand";
  n.sq.x = 860;
  n.sq.y = 470;
  n.q = [];
  n.cur = null;
  ss.tick(0.05);
  ss.drawFrame();
  const box = n.capBox;
  const door = box && box.h >= 44 && box.w >= 44;
  ss.tapAt(box.x + box.w / 2, box.y + box.h / 2, true);
  let arrived = null;
  for (let i = 0; i < 280 && !(n.room === "hall" && n.ctrl); i++) ss.tick(0.05);
  if (n.room === "hall" && n.ctrl) arrived = { x: Math.round(n.sq.x), y: Math.round(n.sq.y), sneak: !!n.ch1ToPlant };

  n.ch1ToPlant = true;
  n.ctrl = true;
  n.room = "hall";
  n.scene = "QA";
  n.ch1Party = true;
  n.sq.x = plant.cx;
  n.sq.y = plant.cy;
  n.sqPose = "stand";
  n.q = [];
  n.cur = null;
  ss.tick(0.05);
  const hide = ss.offerNow();
  hide && hide.f();
  let dress = null;
  for (let i = 0; i < 500 && !dress; i++) {
    if (n.cur && (n.cur.k === "bub" || n.cur.k === "wait" || n.cur.k === "card")) {
      n.bt = 1;
      ss.opTap();
    }
    ss.tick(0.05);
    if (n.ch1Dress && n.ch1Dress.on) dress = { veil: n.ch1Veil, fade: n.ch1DressIn };
  }
  n.ch1Dim = true;
  n.ch1Talk = 1;
  n.sqPose = "hidden";
  n.cur = null;
  ss.drawFrame();
  const show = !!n.ch1Dim;

  return {
    plant,
    stage,
    chipCut,
    chipPlay,
    chipHome,
    sqBub,
    sqOnGuest,
    isBub,
    isOnGuest,
    faces,
    eyes,
    cam,
    goalSneak,
    door,
    arrived,
    dress,
    show,
  };
});

const headAt = (b) => b && b.head && { x: b.head.x + b.head.w / 2, y: b.head.y + b.head.h / 2 };
const sqHead = headAt(rules.sqBub);
const isHead = headAt(rules.isBub);
g.check(
  "a hidden Squatch bubble comes from the plant, not a guest",
  !!sqHead && Math.abs(sqHead.x - rules.plant.cx) < 24 && Math.abs(sqHead.y - rules.plant.cy) < 24 && !rules.sqOnGuest,
  { sqHead, plant: rules.plant, sqOnGuest: rules.sqOnGuest },
);
g.check(
  "Isfred's bubble points at the stage",
  !!isHead && isHead.x > rules.stage.x0 && isHead.x < rules.stage.x1 && isHead.y < rules.stage.feet && !rules.isOnGuest,
  { isHead, stage: rules.stage },
);
g.check("a cutscene does not show the party look-around chip", rules.chipCut === "", rules.chipCut);
g.check("the look-around chip shows only when he can move", rules.chipPlay === "Squatch: look around the party", rules.chipPlay);
g.check("the walk home does not say go to the ship", rules.chipHome === "", rules.chipHome);
g.check(
  "guests face the stage while Isfred talks",
  JSON.stringify(rules.faces) === JSON.stringify([1, 1, -1, -1, 1, -1, -1]),
  rules.faces,
);
g.check("hiding eyes are centered on the middle plant", rules.eyes && rules.eyes.x === rules.plant.cx && rules.eyes.y === rules.plant.cy, rules.eyes);
g.check("the plant goal is an outline, not a circle", rules.goalSneak && rules.goalSneak.shape === "outline" && rules.goalSneak.x1 - rules.goalSneak.x0 > 40, rules.goalSneak);
g.check("the PEEK label is a finger-sized tap and it peeks", rules.door && rules.arrived && rules.arrived.sneak, rules);
g.check(
  "peeking does not walk him onto the plant",
  rules.arrived && Math.hypot(rules.arrived.x - rules.plant.cx, rules.arrived.y - rules.plant.cy) > 40,
  rules.arrived,
);
g.check("the dress-up board does not start black", rules.dress && rules.dress.veil < 0.05 && rules.dress.fade < 0.6, rules.dress);
g.check("the camera lens points up toward the stage", rules.cam && rules.cam.lens.y < rules.cam.body.y, rules.cam);
g.check("the Croc Boys show can draw", rules.show === true, rules.show);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("play-rules");
