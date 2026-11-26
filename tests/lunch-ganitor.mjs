/**
 * Round C (Brian's decisions of 2026-11-26, chat): the lunch sneak's new pieces and "Ganitor".
 *   - ROLL · ball is offered in the lunch sneak (the ball rule, DECISIONS C20 and R43: a balled-up Squatch is noticed
 *     only by someone within 70 px of him for 2 s, looking his way); not behind the counter or in the hallway.
 *   - The snack counter close-up: the plate, the pies and the ducked Squatch, bigger, on a phone; a tap on it is a tap
 *     on what it shows (the plate is TAKE · snack), never a walk into the hall it covers.
 *   - Mops's lunch is a hay sandwich, then the bag; MOPS on the bag is big enough to read (canvas-text.mjs checks it on
 *     an iPad; here, a phone).
 *   - Ganitor: A the GANITOR name tag on Mops in every scene (the word where he is drawn big enough), C the Employee
 *     of the Month photo MOPS, GANITOR in the hallway (a layer: the locked picture is unchanged), E Squatch's crayon
 *     card says MOPS THE GANITOR, and the crayon Guardians drawing (no Mops in it) has no label. (B, the PA line, is
 *     checked in home-morning.mjs.)
 *   node tests/lunch-ganitor.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const GAN = existsSync(M("ganitor.js")) ? await import(M("ganitor.js")) : null;
const P = await import(M("lunch-sneak-place.js"));
const ART = await import(M("lunch-sneak-art.js"));
const HM = await import(M("home-morning-art.js"));
const PHONE_K = 375 / 960; // a 375-wide phone shows the 960-wide picture at this size

const g = await startGame({ port: 9748, name: "lunch-ganitor" });
g.check("ganitor.js holds the Ganitor words, the four new ones approved by Brian in chat on 2026-11-26 (and his approved ME)", !!GAN && GAN.GANITOR_LINES.length >= 4 && GAN.GANITOR_LINES.every((l) => l.status === "approved" && /Brian/.test(l.source)) && GAN.GANITOR_LINES.filter((l) => /Brian, chat 2026-11-26/.test(l.source)).length === 4);

const { page, errors } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);
// sound on, as a player taps it (the music's cue is followed only while sound is on)
await new Promise((r) => setTimeout(r, 1200));
await page.click("#ss-sound");
await new Promise((r) => setTimeout(r, 600));
await page.evaluate(() => (window.requestAnimationFrame = () => 0));

// ---------- ROLL · ball ----------
const ball = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-lunch"),
    lu = beat.place,
    tick = (s) => {
      for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05);
    },
    st = () => n.ch1Lunch,
    offer = () => ((o) => (o ? o.verb + " · " + o.cap : ""))(ss.offerNow()),
    out = {};
  const teal = lu.WATCHERS.find((w) => w.id === "teal");
  // a beat clock where the teal guest has just begun her look (2.4 s of looking ahead)
  const lookAt = () => {
    for (let t = 0; t < 20; t += 0.01) {
      const p = lu.watcherNow(teal, t);
      if (p.phase === "look" && p.k < 0.01) return t;
    }
    return 0;
  };
  const place = (d) => ({ x: Math.round(teal.x + Math.cos(teal.look) * d), y: Math.round(teal.y + Math.sin(teal.look) * d) });
  const fresh = (d, roll) => {
    n.q = [];
    n.cur = null;
    ss.ch1JumpBeat(25);
    tick(0.2);
    const at = place(d);
    n.sq.x = at.x;
    n.sq.y = at.y;
    tick(0.05);
    const o = offer();
    roll && ss.offerNow() && ss.offerNow().f();
    st().t = lookAt() + 0.05;
    st().seenBy = "";
    st().seenT = 0;
    return o;
  };
  // in the open at the start: ROLL · ball is the button
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(25);
  tick(0.3);
  out.startOffer = offer();
  ss.offerNow() && ss.offerNow().f();
  tick(0.1);
  ss.drawFrame();
  out.rolled = { pose: st().pose, sqPose: n.sqPose, ctrl: n.ctrl };
  // steering takes him out of it (as out of a hiding place)
  out.offerWhileBall = offer();
  // a ball in her look 150 px off: far, so not noticed in her whole look
  out.farOffer = fresh(150, true);
  tick(2.3);
  out.far = { alarm: !!st().alarm, pose: st().pose };
  // standing there instead is seen
  fresh(150, false);
  tick(2.3);
  out.farStanding = { alarm: !!st().alarm };
  // a ball 50 px off in her look: noticed after 2 s, and the one capture rule starts
  fresh(50, true);
  tick(1.6);
  out.nearEarly = { alarm: !!st().alarm };
  tick(0.7);
  out.near = { alarm: !!st().alarm, shout: st().alarm && st().alarm.phase };
  // the music stops with the alarm (Brian 2026-11-26); the FUR! sting plays
  out.cueDuring = window.SSQ.refinedCue("sneak");
  out.hushed = window.SSQ.musicNow().hush;
  out.sting = (beat.debug().partySounds || []).filter((p) => p.name === "sting" || p === "sting").length;
  // noticed rolled up: staying rolled up there does not hide him through the search (the guards come for him)
  out.nearSpotted = !!(st().alarm && st().alarm.spotted);
  // ↺ in the alarm: the part starts again, a new visit: the quiet ends and the sneak's music comes back
  ss.sectionReset();
  tick(0.3);
  out.cueAfterRestart = window.SSQ.refinedCue("sneak");
  out.hushedAfterRestart = window.SSQ.musicNow().hush;
  // ↺ while rolled up: he stands at the step's start, nothing of the ball left
  fresh(150, true);
  ss.sectionReset();
  tick(0.3);
  out.afterReset = { pose: st().pose, sqPose: n.sqPose, ballNear: JSON.stringify(st().ballNear || {}) };
  // steering unrolls him
  fresh(150, true);
  out.beforeSteer = st().pose;
  // a tap on the floor to his right (the game's walk: n.walkTo)
  n.walkTo = { x: n.sq.x + 80, y: n.sq.y, room: n.room, lx: n.sq.x, ly: n.sq.y, lt: n.T, at: n.T };
  tick(0.3);
  out.afterSteer = { pose: st().pose, sqPose: n.sqPose };
  // rolled up in the hallway doorway's ring: SNEAK · hallway is not offered (he unrolls first)
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(25);
  tick(0.2);
  st().reached = 2;
  n.walkTo = null;
  n.sq.x = lu.LUNCH_PLACES.door.stand.x;
  n.sq.y = lu.LUNCH_PLACES.door.stand.y;
  tick(0.05);
  out.doorStanding = offer();
  beat.spots().find((q) => q.id === "lu-ball").f();
  tick(0.05);
  out.doorBall = (beat.spots() || []).map((q) => q.verb + " · " + q.cap);
  // not offered in the hallway or behind the counter
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(26);
  tick(0.3);
  out.hallwayOffers = (beat.spots() || []).map((s) => s.verb + " · " + s.cap);
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(27);
  tick(0.3);
  out.counterOffers = (beat.spots() || []).map((s) => s.verb + " · " + s.cap);
  return out;
});
g.check("in the open in the hall, the button offers ROLL · ball; pressed, he rolls into a ball (no control lost)", ball.startOffer === "ROLL · ball" && ball.rolled.pose === "ball" && ball.rolled.sqPose === "ball" && ball.rolled.ctrl, ball);
g.check("a ball out in a guest's look, but more than 70 px from her, is not noticed in her whole look", ball.farOffer === "ROLL · ball" && !ball.far.alarm && ball.far.pose === "ball", ball.far);
g.check("standing in that same spot, he is seen (the ball is what hid him)", ball.farStanding.alarm, ball.farStanding);
g.check("a ball within 70 px of her, in her look, is noticed after 2 s (not before), and the one capture rule starts (FUR!)", !ball.nearEarly.alarm && ball.near.alarm && ball.near.shout === "shout", { early: ball.nearEarly, near: ball.near });
g.check("when the alarm goes off the music stops (no music cue while the alarm is on; hushed after it) and the FUR! sting is asked for", ball.cueDuring === "" && ball.hushed === true && ball.sting >= 1, { cue: ball.cueDuring, hushed: ball.hushed, sting: ball.sting });
g.check("↺ during the alarm starts the part again: no alarm, the sneak's music cue is back and the quiet is over", ball.cueAfterRestart === "sneak" && ball.hushedAfterRestart === false, { cue: ball.cueAfterRestart, hushed: ball.hushedAfterRestart });
g.check("noticed rolled up, he is not safe staying put: the guards know where he is (as a guard who saw him hide)", ball.nearSpotted, ball);
g.check("↺ while rolled up: he stands again at the step's start, nothing of the ball left", ball.afterReset.pose !== "ball" && ball.afterReset.sqPose !== "ball" && ball.afterReset.ballNear === "{}", ball.afterReset);
g.check("moving unrolls him (as stepping out of a hiding place)", ball.beforeSteer === "ball" && ball.afterSteer.pose === "stand" && ball.afterSteer.sqPose === "stand", { before: ball.beforeSteer, after: ball.afterSteer });
g.check("rolled up in the hallway doorway, SNEAK · hallway is not offered (he must unroll first)", ball.doorStanding === "SNEAK · hallway" && !ball.doorBall.includes("SNEAK · hallway"), { standing: ball.doorStanding, ball: ball.doorBall });
g.check("ROLL · ball is not offered in the hallway or behind the counter", !ball.hallwayOffers.includes("ROLL · ball") && !ball.counterOffers.includes("ROLL · ball"), { hallway: ball.hallwayOffers, counter: ball.counterOffers });

// ---------- the snack counter close-up ----------
const cu = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-lunch"),
    tick = (s) => {
      for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05);
    },
    st = () => n.ch1Lunch,
    out = {};
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(27);
  tick(0.6);
  ss.drawFrame();
  out.drew = beat.debug().drew.closeUp || null;
  out.step = st().step;
  out.sq0 = { x: n.sq.x, y: n.sq.y };
  out.offer = ((o) => (o ? o.verb + " · " + o.cap : ""))(ss.offerNow());
  const r = document.querySelector("canvas").getBoundingClientRect();
  out.rect = { x: r.x, y: r.y, w: r.width, h: r.height };
  return out;
});
// A finger on the picture, at game position (x, y).
const touch = async (x, y) => page.touchscreen.tap(cu.rect.x + (x * cu.rect.w) / 960, cu.rect.y + (y * cu.rect.h) / 640);
const after = () =>
  page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    for (let i = 0; i < 10; i++) ss.tick(0.05);
    return { x: n.sq.x, y: n.sq.y, step: n.ch1Lunch.step, pose: n.ch1Lunch.pose };
  });
// a tap on open hall floor that the close-up covers (game 100, 560; in the close-up, not the plate): at the counter it does nothing...
await touch(100, 560);
cu.afterTapOff = await after();
cu.afterTapOff.moved = Math.hypot(cu.afterTapOff.x - cu.sq0.x, cu.afterTapOff.y - cu.sq0.y) > 1;
// ...while in the sneak (no close-up) the same tap walks him there
const sq1 = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(25);
  for (let i = 0; i < 6; i++) ss.tick(0.05);
  return { x: n.sq.x, y: n.sq.y };
});
await touch(100, 560);
const walked = await after();
cu.sameTapInSneak = Math.hypot(walked.x - sq1.x, walked.y - sq1.y) > 5;
await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(27);
  for (let i = 0; i < 12; i++) ss.tick(0.05);
  ss.drawFrame();
});
// a tap on the plate in the close-up: TAKE · snack
const plateIn = { x: (cu.drew ? cu.drew.x0 : 0) + (P.COUNTER_SPOTS.plate.x - P.COUNTER_CLOSEUP.src.x0) * P.COUNTER_CLOSEUP.k, y: (cu.drew ? cu.drew.y0 : 0) + (P.COUNTER_SPOTS.plate.y - 10 - P.COUNTER_CLOSEUP.src.y0) * P.COUNTER_CLOSEUP.k };
await touch(plateIn.x, plateIn.y);
cu.afterTapPlate = await after();
const C = P.COUNTER_CLOSEUP,
  box = cu.drew,
  inSrc = (p) => p.x > C.src.x0 && p.x < C.src.x1 && p.y > C.src.y0 && p.y < C.src.y1;
g.check("at the snack counter a framed close-up shows the counter's corner bigger, on the left of the picture", !!box && box.u === 1 && box.x0 < 60 && box.x1 < 480 && Math.abs((box.x1 - box.x0) / (C.src.x1 - C.src.x0) - C.k) < 0.01, box);
g.check("the close-up holds the plate, Squatch ducked, Mops and the counter guest", inSrc(P.COUNTER_SPOTS.plate) && inSrc(P.COUNTER_SPOTS.sq) && inSrc(P.COUNTER_SPOTS.mops) && inSrc(P.COUNTER_WATCHER), C.src);
const duckPx = 48.5 * 1.65 * ART.LOW * C.k * PHONE_K,
  platePx = P.LUNCH_SIZES.plate.w * C.k * PHONE_K;
g.check("on a 375-wide phone, in the close-up the ducked Squatch is at least 28 px tall and the plate at least 50 px wide", duckPx >= 28 && platePx >= 50, { duckPx, platePx });
g.check("a tap on the hall floor the close-up covers does nothing at the counter (he stays behind it), though the same tap in the sneak walks him there", cu.offer === "TAKE · snack" && !cu.afterTapOff.moved && cu.afterTapOff.step === "snack" && cu.sameTapInSneak, cu);
g.check("a tap on the plate in the close-up is TAKE · snack: he stands up and reaches for one pie", ["grab", "chew"].includes(cu.afterTapPlate.step) && cu.afterTapPlate.pose !== "ducked", cu.afterTapPlate);

// ---------- the bag and the hay sandwich ----------
const word = HM.BAG_WORD,
  home = word,
  hall = word * ART.BAG_IN_HALL;
g.check("MOPS on the bag: at least 17.5 game px at home and in the hall (14 CSS px on an iPad standing up) and about 7 px or more on a phone", home >= 17.5 && hall >= 17.5 && hall * PHONE_K >= 6.8, { home, hall, phoneHome: home * PHONE_K, phoneHall: hall * PHONE_K });
const eat = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    tick = (s) => {
      for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05);
    };
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(26);
  tick(0.2);
  n.sq.x = 540;
  n.sq.y = 488;
  tick(0.1);
  ss.offerNow().f();
  for (let i = 0; i < 100 && !(n.cur && n.cur.k === "bub"); i++) ss.tick(0.05);
  (n.bt = 1), ss.opTap();
  for (let i = 0; i < 10 && !(n.cur && n.cur.k === "cutaway"); i++) ss.tick(0.05);
  const out = [];
  for (let i = 0; i < 100 && n.cur && n.cur.k === "cutaway"; i++) {
    ss.drawFrame();
    const c = window.SSQ.cutaway.last();
    c && c.lunch && out.push({ t: +c.t.toFixed(2), filling: c.lunch.filling, sandwich: c.lunch.sandwich, bag: c.lunch.bag, bagBox: c.lunch.bagBox, hoof: c.lunch.hoof, tag: c.tag || null });
    ss.tick(0.05);
  }
  return out;
});
g.check("Mops's lunch is a hay sandwich (hay between two slices of bread), whole for the first moments, then eaten, then the bag", eat.length > 10 && eat.every((e) => e.filling === "hay") && eat.filter((e) => e.sandwich === 1).length >= 10 && eat.some((e) => e.sandwich === 0 && e.bag > 0) && eat[eat.length - 1].bag === 0, eat.map((e) => [e.t, e.sandwich, +e.bag.toFixed(2)]));
const e0 = eat[0] || {};
g.check("in the close-up the bag is big (its MOPS about 30 px on a phone) and his hoof holds it below the word", e0.bagBox && (e0.bagBox.x1 - e0.bagBox.x0) * PHONE_K > 50 && e0.hoof.y > e0.bagBox.y1 - (e0.bagBox.y1 - e0.bagBox.y0) * 0.25, e0);

// ---------- Ganitor A: the name tag ----------
const tags = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    tick = (s) => {
      for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05);
    },
    out = {};
  const look = (name) => {
    window.SSQ.ganitorTags();
    ss.drawFrame();
    out[name] = window.SSQ.ganitorTags();
  };
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(26); // the hallway, Mops standing
  tick(0.3);
  look("hallway");
  ss.ch1JumpBeat(27); // the hall, behind the counter
  tick(0.3);
  look("hall");
  ss.ch1JumpBeat(37); // the hallway after the ship, Mops walking with him
  tick(0.3);
  look("photos");
  return out;
});
const one = (a) => Array.isArray(a) && a.length >= 1;
g.check("A: Mops wears his GANITOR name tag in the hallway, in the hall and in the photo wall's picture", one(tags.hallway) && one(tags.hall) && one(tags.photos), tags);
g.check("A: in a room he is too small for the word to read (a clear tag shape); in the eating close-up the word GANITOR is written", [...tags.hallway, ...tags.hall].every((t) => !t.readable) && eat.length && eat[0].tag && eat[0].tag.readable && eat[0].tag.scale === 12, { room: tags.hall, closeUp: eat[0] && eat[0].tag });
const left = await page.evaluate(() => {
  const c = document.createElement("canvas");
  c.width = 960;
  c.height = 640;
  const ctx = c.getContext("2d"),
    seen = [];
  const fill = ctx.fillText.bind(ctx);
  ctx.fillText = (t, ...a) => (seen.push({ t, a: ctx.getTransform().a }), fill(t, ...a));
  window.SSQ.engine().drawMopsOn(ctx, 480, 600, 12, { f: -1, walk: 0 });
  window.SSQ.engine().drawMopsOn(ctx, 300, 600, 12, { f: 1, walk: 0 });
  return seen.filter((s) => s.t === "GANITOR");
});
g.check("A: drawn big facing left or right, the tag's word GANITOR reads the right way round (not mirrored)", left.length === 2 && left.every((s) => s.a > 0), left);
const FE = readFileSync(join(root, "src", "game", "60-frame-draw.js"), "utf8");
g.check("A: Mops's drawing gains only the tag (it takes the old name patch's place; nothing else in his drawing changed)", /window\.SSQ\.drawGanitorTag\(e, i\) : \(X\(6, -19, 2\.2, 1\.1\), r\("#ffffff", 0\.8\)\)/.test(FE));

// ---------- Ganitor C and E: the hallway wall ----------
const wall = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  ss.ch1JumpBeat(37);
  for (let i = 0; i < 6; i++) ss.tick(0.05);
  ss.drawFrame();
  const out = { wall: window.SSQ.beat("ch1-lunch").debug().wall, crayon: window.SSQ.hallwayCrayonDrawn() };
  n.ch1Office = true;
  ss.drawFrame();
  out.office = window.SSQ.beat("ch1-lunch").debug().wall;
  n.ch1Office = false;
  return out;
});
// (the locked picture's photo grid ends at about x 685 in its top three rows, 650 in the bottom row, y 214 and up)
g.check("C: in the hallway, a framed photo of Mops on the back wall labelled MOPS, GANITOR, right of the locked picture's photo grid", wall.wall && wall.wall.word === "MOPS, GANITOR" && wall.wall.frame.x0 >= 690 && wall.wall.plaque.x0 >= 655 && wall.wall.plaque.x1 <= 940 && wall.wall.plaque.y1 < 260, wall.wall);
g.check("C: not in the office", wall.office === null, wall.office);
const base = execFileSync("git", ["-C", root, "merge-base", "HEAD", "origin/main"], { encoding: "utf8" }).trim();
const locked = execFileSync("git", ["-C", root, "diff", "--name-only", base, "--", "docs/locked-rooms/*.png"], { encoding: "utf8" }).trim();
g.check("C: the locked room pictures are not changed on this branch (the wall is a layer drawn over the hallway)", locked === "", locked);
g.check("E: Squatch's crayon card on the hallway wall says ME and MOPS THE GANITOR", wall.crayon && JSON.stringify(wall.crayon.lines) === JSON.stringify(["ME", "MOPS THE", "GANITOR"]) && GAN.crayonGanitorLabel() === "MOPS THE GANITOR", wall.crayon);
const GD = readFileSync(M("guardians-drawing.js"), "utf8");
g.check("E: the crayon Guardians drawing has no Mops in it, so it writes no label (it draws no words at all)", !/fillText|strokeText/.test(GD) && !/GANITOR/.test(GD));
g.check("no page errors", errors.length === 0, errors);
await page.close();
await g.finish("lunch-ganitor");
