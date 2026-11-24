/**
 * Plays the redesigned Chapter 1 from ?ch=1 to the tally card.
 *   node tests/ch1-playthrough.mjs
 *
 * The old key route (tests/routes/ch1.json) was the notice-sneak chapter. This suite drives the new
 * beats the way the story queue does: ticks, taps through bubbles, and presses each action when the
 * chapter hands control back. It checks the lines in order, a real walk off and walk in, the home
 * room (no vent, door cut, wardrobe), the spare jacket, and the ball notice rule.
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8801, name: "ch1-playthrough" });
const { ctx, page, errors } = await g.open("?ch=1");

const home = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  // The morning (src/modules/morning.js) up to the song, when the kid first has control at home.
  for (let i = 0; i < 400; i++) {
    if (n.cur && (n.cur.k === "card" || n.cur.k === "bub" || n.cur.k === "wait" || n.cur.k === "cutaway")) {
      n.bt = 1;
      ss.opTap();
    }
    ss.tick(0.05);
    if (n.ctrl && n.ch1Morning && n.ch1Morning.step === "song" && !n.cur) break;
  }
  ss.drawFrame();
  const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
  const k = cv.width / 960;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const px = (x, y) => Array.from(cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data);
  return {
    scene: ss.op.scene,
    wall: px(780, 200),
    gap: px(900, 300),
    floor: px(820, 560),
    state: ss.ch1State(),
  };
});
const rgb = (p) => p.slice(0, 3).join(",");
g.check("the opening is the home room", home.scene === "Q1" && home.state.room === "closet" && home.state.wardrobe === "closed", home.state);
g.check("the old white door slab is gone (wall, not pure white)", home.wall[0] > 220 && home.wall[0] < 255 && home.wall[2] < 250, rgb(home.wall));
g.check("the right wall is a door cut", home.gap[2] > home.gap[0] - 20 && Math.abs(home.gap[0] - 223) < 40, rgb(home.gap));
g.check("the home floor vent is gone", home.floor[2] < home.floor[0] + 30 && home.floor[0] > 160, rgb(home.floor));

const ball = await page.evaluate(() => {
  const ss = window.__ss;
  const R = ss.BALL_NOTICE_RADIUS;
  const S = ss.BALL_NOTICE_SECONDS;
  ss.op.scene = "Q4";
  ss.op.room = "hangar";
  ss.op.ch1D = true;
  ss.op.ch1Night = true;
  ss.op.ctrl = true;
  ss.op.ch1Alert = true;
  ss.op.sqPose = "ball";
  ss.op.q = [];
  ss.op.cur = null;
  ss.drawFrame();
  const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const cone = Array.from(cx.getImageData(480, 500, 1, 1).data);
  const side = Array.from(cx.getImageData(80, 500, 1, 1).data);
  ss.ballNoticeReset();
  let pass = false;
  for (let i = 0; i < 8; i++) {
    const dist = Math.abs(i - 3.5) * 80;
    if (ss.ballNotice("pass", dist, 0.25, true)) pass = true;
  }
  ss.ballNoticeReset();
  let early = false;
  let linger = false;
  for (let t = 0; t < S; t += 0.5) {
    const hit = ss.ballNotice("linger", R - 10, 0.5, true);
    if (t + 0.5 < S - 0.01 && hit) early = true;
    if (t + 0.5 >= S - 0.01) linger = hit;
  }
  ss.ballNoticeReset();
  ss.ballNotice("leave", 40, 1.5, true);
  ss.ballNotice("leave", R + 20, 0.25, true);
  const afterLeave = ss.ballNotice("leave", 40, 0.5, true);
  let safer = true;
  const fails = [];
  for (let x = 280; x <= 680; x += 40) {
    for (let y = 360; y <= 620; y += 40) {
      const stand = ss.ch1CaughtAt(x, y, "stand");
      const dist = Math.hypot(x - ss.CH1_ROBOT.x, y - ss.CH1_ROBOT.y);
      ss.op.sqPose = "ball";
      ss.ballNoticeReset();
      let noticed = false;
      for (let t = 0; t < S; t += 0.5) noticed = ss.ballNotice("grid", dist, 0.5, stand);
      if (noticed && !stand) {
        safer = false;
        fails.push({ x, y, dist, stand });
      }
      if (dist > R && noticed) {
        safer = false;
        fails.push({ x, y, dist, stand, outside: true });
      }
    }
  }
  ss.ballNoticeReset();
  let blind = false;
  for (let t = 0; t < S + 1; t += 0.5) blind = ss.ballNotice("blind", 30, 0.5, false);
  const plant = ss.ch1CaughtAt(480, 424, "hidden");
  const closeStand = ss.ch1CaughtAt(480, 424, "stand");
  return { pass, early, linger, afterLeave, safer, blind, fails: fails.slice(0, 4), plant, closeStand, cone, side, radius: R, seconds: S };
});
g.check("a robot passing by in under 2s does not notice the ball", !ball.pass && !ball.early, ball);
g.check("a robot lingering 2s within 70px notices the ball", ball.linger && ball.radius === 70 && ball.seconds === 2, ball);
g.check("leaving the radius resets the ball timer", !ball.afterLeave, ball);
g.check("a ball is always at least as safe as standing", ball.safer && !ball.blind && !ball.plant && ball.closeStand, ball);
g.check("the night robot draws a vision cone", ball.cone[0] + ball.cone[1] > ball.side[0] + ball.side[1] + 15, { cone: ball.cone, side: ball.side });

const spare = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.room = "closet";
  n.scene = "Q8";
  n.ch1D = false;
  n.ch1Duct = false;
  n.wardrobe = "open";
  n.costumeOn = false;
  n.moPose = "stand";
  n.mo.x = 430;
  n.mo.y = 510;
  n.mo.f = 1;
  n.sqPose = "stand";
  n.sq.x = 700;
  n.sq.y = 510;
  n.ch1Night = false;
  n.ctrl = false;
  n.q = [];
  n.cur = null;
  for (let i = 0; i < 16; i++) ss.tick(0.1);
  const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
  const k = cv.width / 960;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const blue = (p) => p[2] > 180 && p[0] < 100 && p[1] > 70 && p[1] < 180;
  const scan = (x0, y0, x1, y1) => {
    let nBlue = 0;
    let best = [0, 0, 0];
    for (let y = y0; y <= y1; y += 2) {
      for (let x = x0; x <= x1; x += 2) {
        const p = cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
        if (p[2] > best[2]) best = [p[0], p[1], p[2]];
        if (blue(p)) nBlue++;
      }
    }
    return { nBlue, best };
  };
  const px = (x, y) => Array.from(cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data).slice(0, 3);
  ss.drawFrame();
  const hung = scan(100, 190, 190, 280);
  const mops = scan(380, 430, 480, 500);
  const wall = px(850, 300);
  n.costumeOn = true;
  ss.drawFrame();
  const empty = scan(100, 190, 190, 280);
  const mopsStill = scan(380, 430, 480, 500);
  const canvases = Array.from(document.querySelectorAll("canvas")).map((c) => {
    const g = c.getContext("2d", { willReadFrequently: true });
    const d = g.getImageData(Math.min(c.width - 1, 400), Math.min(c.height - 1, 300), 1, 1).data;
    return { w: c.width, h: c.height, px: [d[0], d[1], d[2], d[3]] };
  });
  return { hung, empty, mops, mopsStill, room: n.room, scene: n.scene, state: ss.game.state, wall, cw: cv.width, ch: cv.height, cur: n.cur && n.cur.k, canvases };
});
g.check("the open wardrobe hangs a plain blue jacket", spare.hung.nBlue > 8, spare);
g.check(
  "once Squatch takes it, that hook is empty and Mops still wears his jacket",
  spare.empty.nBlue === 0 && spare.mops.nBlue > 4 && spare.mopsStill.nBlue > 4,
  spare,
);

const ch1Speakers = [
  ...new Set([...readFileSync(new URL("../src/game/12-ch1-redesign.js", import.meta.url), "utf8").matchAll(/\bv\("([a-z0-9]+)"/g)].map((m) => m[1])),
];
const bubbles = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const setups = {
    mops: { scene: "Q1", room: "closet", sq: [400, 520], mo: [520, 500] },
    sq: { scene: "Q1", room: "closet", sq: [400, 520], mo: [520, 500], pose: "stand" },
    official: { scene: "Q2", room: "hangar", ch1D: true, ch1Ship: true, ch1Night: false },
    tourist: { scene: "Q2", room: "hangar", ch1D: true, ch1Ship: true, scene2: "Q3", room2: "hall" },
    ups: { scene: "Q2", room: "hangar", ch1D: true, ch1Ship: true, crew: "", crew2: "tease", night2: true },
    scanner: { scene: "Q9", room: "hangar", ch1D: true, ch1Ship: true, ch1Night: false, ch1Office: false },
    robot: { scene: "Q9", room: "hall", ch1D: false, ch1Office: true },
    kid: { scene: "QA", room: "hall", party: true },
  };
  const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
  const k = cv.width / 960;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const pix = (x, y) => {
    const d = cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const placed = (who, extra) => {
    n.q = [];
    n.cur = null;
    n.ctrl = false;
    n.scene = extra.scene;
    n.room = extra.room;
    n.ch1D = !!extra.ch1D;
    n.ch1Duct = false;
    n.ch1Ship = !!extra.ch1Ship;
    n.ch1Night = !!extra.ch1Night;
    n.ch1Office = !!extra.ch1Office;
    n.ch1Crew = extra.crew || "";
    n.ch1Party = !!extra.party;
    n.sqPose = extra.pose || "stand";
    n.moPose = "stand";
    n.sq.x = (extra.sq || [400, 520])[0];
    n.sq.y = (extra.sq || [400, 520])[1];
    n.mo.x = (extra.mo || [520, 500])[0];
    n.mo.y = (extra.mo || [520, 500])[1];
    if (n.room === "hall") ss.hall.camX = 0;
    for (let i = 0; i < 8; i++) ss.tick(0.1);
    ss.drawFrame();
    const at = ss.bubbleAt(who);
    let marks = 0;
    const probe = pix(at.x, at.y + 40);
    for (let dy = 16; dy <= 88; dy += 12)
      for (let dx = -16; dx <= 16; dx += 16) {
        const p = pix(at.x + dx, at.y + dy);
        if (Math.abs(p[0] - probe[0]) + Math.abs(p[1] - probe[1]) + Math.abs(p[2] - probe[2]) > 36) marks++;
      }
    return { who, at, marks, top: at.y < 80 && Math.abs(at.x - 480) < 40 };
  };
  const out = [];
  for (const who of ["mops", "sq", "official", "tourist", "ups", "scanner", "robot", "kid"]) out.push(placed(who, setups[who]));
  out.push(placed("tourist", { scene: "Q3", room: "hall", ch1D: false }));
  out.push(placed("ups", { scene: "Q4", room: "hangar", ch1D: true, ch1Night: true, crew: "" }));
  out.push(placed("ups", { scene: "Q5", room: "hangar", ch1D: true, ch1Night: true, crew: "tease" }));
  out.push(placed("official", { scene: "Q9", room: "hall", ch1D: false, ch1Office: true }));
  return out;
});
const missingSpeaker = ch1Speakers.filter((who) => who !== "pa" && !bubbles.some((b) => b.who === who));
g.check(
  "every Chapter 1 speaker has a bubble on a drawn figure",
  missingSpeaker.length === 0 && bubbles.every((b) => !b.top && b.marks > 0),
  { missingSpeaker, bubbles },
);

const hat = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "QA";
  n.ctrl = true;
  n.ch1Party = true;
  n.ch1Disguise = true;
  n.ch1Flyer = true;
  n.ch1PartyOver = false;
  n.ch1PartyT = ss.COOL_HAT_SECONDS - 0.2;
  n.q = [];
  n.cur = null;
  ss.tick(0.3);
  const said = n.log.filter((e) => e.k === "bub").map((e) => e.text);
  return { seconds: ss.COOL_HAT_SECONDS, said, over: n.ch1PartyOver, disguise: n.ch1Disguise };
});
g.check("Cool hat! fires at 3 minutes of party play and not sooner", hat.seconds === 180 && hat.over && !hat.disguise && hat.said.includes("Cool hat!"), hat);

const balloon = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const said = () => n.log.filter((e) => e.k === "bub").map((e) => e.text);
  const arm = () => {
    n.scene = "QA";
    n.room = "hall";
    n.ch1D = false;
    n.ch1Party = true;
    n.ch1Disguise = true;
    n.ch1Flyer = true;
    n.ch1PartyOver = false;
    n.ch1PartyT = 0;
    n.ch1Balloon = "up";
    n.ch1BalloonT = 0;
    n.ch1BalloonY = 460;
    n.ch1Kid = "gasp";
    n.ch1Fur = false;
    n.ctrl = true;
    n.q = [];
    n.cur = null;
    n.log = [];
    n.sq.x = 180;
    n.sq.y = 500;
    n.sqPose = "stand";
    ss.hall.camX = 0;
  };
  const drain = (steps = 40) => {
    for (let i = 0; i < steps; i++) {
      if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel" || n.cur.k === "wait")) ss.opTap();
      ss.tick(0.2);
    }
  };
  const spot = (verb) => ss.spotsNow().find((s) => s && s.verb === verb);
  arm();
  const missedJump = !spot("JUMP");
  const gasped = n.ch1Kid;
  ss.drawFrame();
  ss.tick(ss.BALLOON_GRAB_SECONDS + 0.2);
  const ceiling = { balloon: n.ch1Balloon, kid: n.ch1Kid, gasped, disguise: n.ch1Disguise, over: n.ch1PartyOver, yell: said().includes("Scary Wookiee!"), jumpWasThere: !missedJump };
  arm();
  spot("JUMP").f();
  const jumped = { held: n.ch1Balloon === "held", legs: n.ch1JumpT > 0, kid: n.ch1Kid };
  spot("GIVE").f();
  drain();
  const back = { balloon: n.ch1Balloon, kid: n.ch1Kid, disguise: n.ch1Disguise, over: n.ch1PartyOver, yell: said().includes("Scary Wookiee!"), fur: said().includes("FUR! Security!") };
  arm();
  spot("JUMP").f();
  const walksBefore = (n.ch1Walks || []).length;
  spot("KEEP").f();
  drain(100);
  const kept = {
    yell: said().includes("Scary Wookiee!"),
    fur: said().includes("FUR! Security!"),
    over: n.ch1PartyOver,
    walked: (n.ch1Walks || []).length > walksBefore,
    window: ss.BALLOON_GRAB_SECONDS,
  };
  return { ceiling, jumped, back, kept };
});
g.check("a balloon that reaches the ceiling only makes the kid sad", balloon.ceiling.gasped === "gasp" && balloon.ceiling.balloon === "ceiling" && balloon.ceiling.kid === "sad" && balloon.ceiling.disguise && !balloon.ceiling.over && !balloon.ceiling.yell && balloon.ceiling.jumpWasThere, balloon.ceiling);
g.check("bringing the balloon back keeps the disguise and the kid stays quiet", balloon.jumped.held && balloon.jumped.legs && balloon.jumped.kid === "wide" && balloon.back.balloon === "back" && balloon.back.kid === "up" && balloon.back.disguise && !balloon.back.over && !balloon.back.yell && !balloon.back.fur, balloon);
g.check("keeping the balloon makes the kid yell and Squatch walk off", balloon.kept.yell && balloon.kept.fur && balloon.kept.over && balloon.kept.walked && balloon.kept.window === 6, balloon.kept);

const extras = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const said = () => n.log.filter((e) => e.k === "bub").map((e) => e.text);
  const arm = () => {
    n.scene = "QA";
    n.room = "hall";
    n.ch1D = false;
    n.ch1Party = true;
    n.ch1Disguise = true;
    n.ch1Flyer = true;
    n.ch1PartyOver = false;
    n.ch1PartyT = 0;
    n.ch1HatAskew = false;
    n.ch1Hugs = 0;
    n.ch1Snacks = 0;
    n.ch1Look = 0;
    n.ch1Photo = false;
    n.ch1InShot = false;
    n.ch1Spill = 0;
    n.ch1PartyDid = {};
    n.ch1Balloon = "back";
    n.ctrl = true;
    n.q = [];
    n.cur = null;
    n.log = [];
    n.stars = 0;
    n.sqPose = "stand";
    n.sq.x = 400;
    n.sq.y = 520;
    ss.hall.camX = 0;
  };
  const drain = () => {
    for (let i = 0; i < 20; i++) {
      if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel" || n.cur.k === "wait")) ss.opTap();
      ss.tick(0.05);
    }
  };
  arm();
  ss.spotsNow().find((s) => s.verb === "HUG").f();
  drain();
  const once = { askew: !!n.ch1HatAskew, disguise: n.ch1Disguise, line: said().includes("*hic* Fellow tourist!"), over: n.ch1PartyOver };
  ss.spotsNow().find((s) => s.verb === "HUG").f();
  drain();
  const twice = { disguise: n.ch1Disguise, over: n.ch1PartyOver, fur: said().includes("FUR! Security!") };
  const show = () => {
    ss.tick(0.05);
    return n.cur && n.cur.id;
  };
  const walk = (x, y) => {
    ss.tapAt(x, y);
    let at = { x: n.sq.x, y: n.sq.y };
    for (let i = 0; i < 60; i++) {
      ss.tick(0.1);
      at = { x: n.sq.x, y: n.sq.y };
      if (Math.hypot(at.x - x, at.y - y) < 14) break;
    }
    ss.tick(0.1);
    return { at, offer: ss.offerNow() && ss.offerNow().verb };
  };
  const frame = ss.CH1_FRAME;
  const cam = ss.CH1_CAM;
  const shot = { x: (frame.x0 + frame.x1) / 2, y: (frame.y0 + frame.y1) / 2 };
  arm();
  const starsIn = n.stars;
  const into = walk(shot.x, shot.y);
  ss.actionDown();
  const inside = { shot: n.ch1InShot, stars: n.stars - starsIn, bonus: ss.PHOTO_BONUS, panel: show(), into };
  arm();
  const starsOut = n.stars;
  const away = walk(cam.x, cam.y);
  ss.actionDown();
  const outside = { shot: n.ch1InShot, stars: n.stars - starsOut, panel: show(), away };
  return { once, twice, inside, outside };
});
g.check("the first octopus hug tugs the hat and the second starts the alarm", extras.once.askew && extras.once.disguise && extras.once.line && !extras.once.over && !extras.twice.disguise && extras.twice.over && extras.twice.fur, extras);
g.check(
  "walking into the shot and pressing SNAP pays the placeholder bonus",
  extras.inside.into.offer === "SNAP" && extras.inside.shot && extras.inside.stars === extras.inside.bonus && extras.inside.panel === "ch1photo",
  extras.inside,
);
g.check(
  "Squatch outside the frame gets no photo bonus",
  extras.outside.away.offer === "SNAP" && !extras.outside.shot && extras.outside.stars === 0 && extras.outside.panel === "ch1photo",
  extras.outside,
);

const play = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  ss.startOpening();
  ss.ch.caught = 0;
  ss.s1.caught = 0;
  n.stars = 0;
  n.found.delete("ghost1");
  const texts = () => n.log.filter((e) => e.k === "bub" || e.k === "card" || e.k === "panel").map((e) => e.text);
  let last = "";
  let still = 0;
  let acts = [];
  let end = "stuck";
  for (let i = 0; i < 12000; i++) {
    if (n.ch1Calendar) {
      ss.tick(0.3);
      ss.opTap();
      continue;
    }
    const cur = n.cur;
    if (cur && cur.k === "panel" && cur.id === "tally") {
      ss.drawFrame();
      end = "tally";
      break;
    }
    if (cur && (cur.k === "bub" || cur.k === "card" || cur.k === "panel" || cur.k === "wait" || cur.k === "cutaway")) {
      if (cur.k === "panel" || n.room === "duct" || n.ch1Zoom) ss.drawFrame();
      n.bt = 1;
      ss.opTap();
      ss.tick(0.05);
      still = 0;
      continue;
    }
    if (n.scene === "O1" && n.ctrl && n.moved < 120) {
      n.moved = 200;
      ss.tick(0.05);
      still = 0;
      continue;
    }
    // The morning's song step: sing along (SING ALONG works where Squatch stands, so it has no ring).
    if (n.ctrl && !n.cur && n.ch1Morning && n.ch1Morning.step === "song") {
      const sing = ss.offerNow();
      if (!sing || sing.verb !== "SING ALONG") {
        end = "no-sing " + (sing && sing.verb);
        break;
      }
      acts.push(sing.verb);
      sing.f();
      ss.tick(0.05);
      still = 0;
      continue;
    }
    if (n.ch1Raid && n.room === "hall") {
      ss.tick(0.05);
      still = 0;
      continue;
    }
    if (n.ctrl && !n.cur && n.q.length === 0 && (n.scene || "")[0] === "Q") {
      if (n.ch1PadOn) {
        for (const d of ["4", "7", "2", "3"]) ss.ch1PadPress(d);
        ss.tick(0.05);
        still = 0;
        continue;
      }
      if (n.scene === "Q5") {
        const rolls = ss.spotsNow().filter((s) => s && s.verb === "ROLL");
        if (rolls.length !== 1 || !(rolls[0].r > 0) || rolls[0].x < 100) return { end: "vent-roll", rolls, acts, texts: texts(), state: ss.ch1State(), shown: [], tally: [] };
      }
      // Optional bedroom inspections are tested separately; this route follows the story goal.
      // A spot with a place to stand: a circle (r) or a box (the home-alone desk).
      const spots = ss.spotsNow().filter((s) => s && s.verb && (s.r > 0 || s.box) && s.id !== "home-calendar");
      const spot = spots[0];
      if (!spot) {
        end = "no-spot " + n.scene;
        break;
      }
      n.sq.x = spot.x;
      n.sq.y = spot.y;
      n.sqPose = "stand";
      ss.drawFrame();
      ss.tick(0.05);
      const act = ss.offerNow();
      if (!act || !act.f) {
        end = "no-act " + n.scene + " " + (act && act.verb);
        break;
      }
      acts.push(act.verb + " · " + act.cap);
      act.f();
      ss.tick(0.05);
      still = 0;
      continue;
    }
    ss.tick(0.05);
    const mark = n.scene + "|" + (n.cur && n.cur.k) + "|" + texts().length + "|" + (n.ch1Trail || []).length;
    if (mark === last) {
        if (++still > 800) {
        end = "frozen " + mark;
        break;
      }
    } else {
      last = mark;
      still = 0;
    }
  }
  const shown = ss.shown();
  return {
    end,
    acts,
    texts: texts(),
    state: ss.ch1State(),
    shown: shown.filter((s) => /IDEAS FOR GUARDIANS|HAVE YOU SEEN|Order new box|Return empty crate|PULL DOWN|Brave Sasquatches|ORDER MORE ROBOTS|MARS LOST|MY GARDIANS|TIED TOGETHER|4723/.test(s)),
    tally: ss.chTally(),
    vent: n.ch1VentLunch || 0,
    paw: n.ch1Paw || 0,
    sucked: n.ch1PinkSucked || 0,
    one: n.ch1One || 0,
    lights: n.ch1Lights || 0,
    code: n.ch1Code || "",
    brochure: !!n.ch1Brochure,
    boxed: !!n.ch1Boxed,
    left: !!n.ch1Left,
    slipped: !!n.ch1Slipped,
    packed: n.ch1Packed || 0,
    paper: n.ch1PaperLog || [],
  };
});
g.check("Chapter 1 reaches the tally card", play.end === "tally", { end: play.end, acts: play.acts, scene: play.state.scene });
const wantActs = ["SING ALONG", "DO · homework", "PEEK · doorway", "HIDE · plant", "SHUFFLE · outfit", "GO · party", "TAKE · robot flyer", "JUMP · balloon", "GIVE · balloon", "TALK · guest", "OPEN · snack bar", "CLOSE · cut-in", "SNAP · photo", "SNAG · plant", "HIDE · bed", "TAKE · gift", "PUT · box", "DROP · box", "LOOK · calendar", "TAKE · lunch", "SNEAK · hallway", "GIVE · lunch", "FEED · lunch", "FEED · bag", "TAKE · snack", "DROP · snack", "HIDE · plant", "GO · hall", "HIDE · plant", "GO · home", "GRAB · copies", "MARK · order", "POST · mailbox", "GO · door", "ROLL · ball", "GRAB · pink slip", "RETURN · empty crate", "DROP · snacks", "DROP · snacks", "DROP · snacks", "DROP · snacks", "DROP · snacks", "LEAVE · food", "PUT · slip", "PACK · box", "PACK · bucket", "PUT ON · jacket", "GO · ship", "BOARD · scanner"];
g.check("the player does the new actions in order", JSON.stringify(play.acts) === JSON.stringify(wantActs), play.acts);
const must = [
  "Stormtop Cloud Resort, floating above Jupiter.",
  "This is Squatch. He's a Sasquatch.",
  "\u266A I'm floating in space! \u266A",
  "\u266A Weeee-eenn-nnttt! \u266A",
  "Mmf mmf... mm-mmf... mmf!",
  "Robots?",
  "Welcome, everybody, to the Stormtop Space Party!",
  "Let's give a big hello to our friends from Bleep-Bloop Robotics!",
  "Soon their helper robots will be here, to help with the heavy work.",
  "And now... put your hands together for the Croc Boys!",
  "I've never gotten to dance at a party.",
  "Love the shirt.",
  "FUR! Security!",
  "A flyer. And fur on the floor.",
  "The Guardians came! They always come when I'm scared.",
  "He forgot his lunch!",
  "Squatch! You should be hiding.",
  "My lunch! You're the best.",
  "I know you, Squatch, you're probably hungry... you know the rule, grab one snack.",
  "Universal Postal Service ship arriving!",
  "I better go see what that is.",
  "Please let me follow you, I'll be really sneaky.",
  "Okay, just this time, but hide carefully.",
  "Mops, don't worry, you know how much we love you here. Even our visitors always love you.",
  "Isfred! A crate is damaged in the mail room.",
  "Left one of the copies in the office. What do I do with the other two?",
  "I'll take care of it.",
  "Delicious.",
  "You're gumbling! (goat mumbling)",
  "Ptoo!",
  "What's the difference between fur and hair?",
  "Paperwork.",
  "I swear we had more Moon Pies... is that what they stole at lunch?",
  "Quick, hide.",
  "Are those other Sasquatches?",
  "I need to get back to work, we'll talk about it tonight.",
  "Didn't you hear what the manager said? They need me here, they're not going to replace me. Plus the Guardians are here.",
  "Mail scanned. Pawature accepted.",
  "Six days later",
  "Replaced? The manager was lying to me.",
  "I'm going to be replaced. The new robots are coming on the ship tomorrow. Remember that pancake place? Let's go find out about it.",
  "Oh, it was on the form I sent, I mean, never mind.",
  "Didn't a copy get sucked into the vent?",
  "I hope Mops doesn't notice...",
  "Hurry, hurry, pink slip, got it!",
  "Get it before he sees it.",
  "This time, take all the snacks you want.",
  "I'm worried about the Guardians. I'll leave them some food.",
  "Get out. They're checking a crate.",
  "The spare jacket. The beard. And the horns.",
  "More bleat. Less roar.",
  "HAIR... PROBABLY. PROCEED.",
  "Send in Mops for his Employee of the Month photo.",
  "Mops isn't here.",
  "Not here? He can't live off the station!",
  "He was replaced by the new robot shipment.",
  "I never ordered a replacement! Get me the security tapes.",
  "Later that evening...",
  "The base called the ship. It has to stop.",
];
let at = -1;
const order = must.map((line) => {
  const i = play.texts.indexOf(line, at + 1);
  if (i > at) at = i;
  return [line, i];
});
g.check("the story lines show in cartoon order", order.every(([, i]) => i >= 0), order.filter(([, i]) => i < 0).map(([line]) => line));
g.check(
  "Squatch hid in a crate on pickup day, climbed out, then wore the costume",
  play.state.didBall === true && play.state.peeked === true && play.state.climbed === true && play.state.inCrate === false && play.state.costume === true,
  play.state,
);
const walks = walkChanges(play.state.trail);
g.check("every room change walks off and walks in", walks >= 12, { walks, sample: play.state.trail.slice(0, 8) });
const doors = doorUses(play.state.walks);
const offPicture = (play.state.walks || []).filter((w) => w.x < 0 || w.x > 960 || w.y < 0 || w.y > 640);
g.check("walks stay on the picture", offPicture.length === 0, offPicture.slice(0, 6));
g.check(
  "the office computer is in the hallway and the walks still use the hall doors",
  play.state.siteRoom === "passage" && doors.backHome >= 2 && doors.overHall >= 2,
  { siteRoom: play.state.siteRoom, doors, walks },
);
const paper = play.paper || [];
const binAt = paper.indexOf("bin");
const pawsAt = paper.indexOf("paws");
const ventAt = paper.indexOf("vent");
g.check(
  "the pink copy reaches the bin before any vent, and the vent is only after the paw check",
  binAt >= 0 &&
    pawsAt > binAt &&
    paper.indexOf("bite") >= 0 &&
    paper.indexOf("bite") < binAt &&
    paper.indexOf("mouth") > paper.indexOf("bite") &&
    paper.indexOf("mouth") < binAt &&
    (ventAt < 0 || ventAt > pawsAt) &&
    play.vent === 0 &&
    play.paw === 1 &&
    play.sucked === 1 &&
    play.one === 1 &&
    play.lights === 1 &&
    play.code === "4723" &&
    play.brochure &&
    play.boxed &&
    play.left &&
    play.slipped &&
    play.packed === 2 &&
    paper.includes("slip") &&
    paper.includes("box") &&
    paper.indexOf("box") > paper.indexOf("slip"),
  { paper, vent: play.vent, paw: play.paw },
);
g.check(
  "the order box, the Mars letter, and the Guardian box are drawn",
  play.shown.includes("ORDER MORE ROBOTS") && play.shown.includes("MARS LOST & FOUND") && play.shown.includes("MY GARDIANS"),
  play.shown,
);
g.check("the vent board, the alarm, and the Moon Pie buttons are drawn", play.shown.includes("IDEAS FOR GUARDIANS") && play.shown.includes("Return empty crate") && play.shown.includes("PULL DOWN"), play.shown);
g.check("a clean chapter still earns the never-caught bonus", play.tally.some((line) => line.includes("Never caught")), play.tally);

const laterBalloon = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
  const k = cv.width / 960;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const redAt = (x, y) => {
    const p = cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
    return p[0] > 180 && p[1] < 130 && p[2] < 120;
  };
  const arm = (balloon) => {
    n.scene = "QA";
    n.room = "hall";
    n.ch1D = false;
    n.ch1Party = true;
    n.ch1Office = false;
    n.ch1Disguise = true;
    n.ch1PartyOver = false;
    n.ch1Balloon = balloon;
    n.ch1BalloonRest = "";
    n.ch1BalloonPopped = false;
    n.ch1BalloonPop = 0;
    n.ctrl = true;
    n.q = [];
    n.cur = null;
    n.sqPose = "stand";
    n.sq.x = 640;
    n.sq.y = 520;
    ss.hall.camX = 0;
  };
  const lock = (balloon) => {
    n.ch1Cut = null;
    arm(balloon);
    ss.spotsNow().find((s) => s.verb === "SNAG").f();
    const state = ss.ch1State();
    n.q = [];
    n.cur = null;
    return state.balloonRest;
  };
  const show = (scene) => {
    n.scene = scene;
    n.room = "hall";
    n.ch1D = false;
    n.ch1Party = false;
    n.ch1Office = false;
    n.ctrl = false;
    n.q = [];
    n.cur = null;
    ss.hall.camX = 0;
    for (let i = 0; i < 12; i++) ss.tick(0.1);
    ss.drawFrame();
  };
  const ceiling = lock("ceiling");
  const popsBeforeHall = ss.ch1State().balloonPops;
  show("Q7");
  const ceilingSeen = { rest: ss.ch1State().balloonRest, onCeiling: redAt(420, 140), tied: redAt(168, 520), pops: ss.ch1State().balloonPops - popsBeforeHall };
  n.ch1BalloonRest = "";
  ss.CH1_CHECKPOINTS.Q4();
  const loaded = ss.ch1State().balloonRest;
  const tied = lock("back");
  const popsBeforeTied = ss.ch1State().balloonPops;
  show("Q7");
  const tiedSeen = { onCeiling: redAt(420, 140), tied: redAt(168, 520), pops: ss.ch1State().balloonPops - popsBeforeTied, popped: ss.ch1State().balloonPopped };
  const kept = lock("held");
  const missed = lock("up");
  n.ch1Party = false;
  n.ch1Office = true;
  n.scene = "Q9";
  n.ctrl = true;
  n.q = [];
  n.cur = null;
  const before = ss.ch1State().balloonPops;
  ss.tick(0.05);
  ss.drawFrame();
  const once = {
    pops: ss.ch1State().balloonPops - before,
    word: ss.shown().includes("POP!"),
    ctrl: n.ctrl,
    quiet: n.q.length === 0 && !n.cur,
  };
  ss.tick(2);
  n.room = "closet";
  ss.tick(0.2);
  n.room = "hall";
  n.scene = "Q9";
  n.ch1Office = true;
  ss.tick(0.3);
  ss.drawFrame();
  return { ceiling, loaded, tied, kept, missed, ceilingSeen, tiedSeen, once, again: ss.ch1State().balloonPops - before };
});
g.check(
  "the balloon stays in later hall scenes and pops once on the last visit",
  laterBalloon.ceiling === "ceiling" &&
    laterBalloon.loaded === "ceiling" &&
    laterBalloon.tied === "tied" &&
    laterBalloon.kept === "tied" &&
    laterBalloon.missed === "ceiling" &&
    laterBalloon.ceilingSeen.rest === "ceiling" &&
    laterBalloon.ceilingSeen.onCeiling &&
    !laterBalloon.ceilingSeen.tied &&
    laterBalloon.ceilingSeen.pops === 0 &&
    laterBalloon.tiedSeen.tied &&
    !laterBalloon.tiedSeen.onCeiling &&
    !laterBalloon.tiedSeen.popped &&
    laterBalloon.once.pops === 1 &&
    laterBalloon.once.word &&
    laterBalloon.once.ctrl &&
    laterBalloon.once.quiet &&
    laterBalloon.again === 1,
  laterBalloon,
);
const slice = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "QA";
  n.room = "hall";
  n.ch1Party = true;
  n.ch1Disguise = true;
  n.ch1Flyer = true;
  n.ch1PartyOver = false;
  n.ch1PartyT = 10;
  n.ch1Cut = null;
  n.ch1BarDone = false;
  n.ch1Chain = false;
  n.ch1Bag = 0;
  n.stars = 0;
  n.ctrl = true;
  n.q = [];
  n.cur = null;
  n.log = [];
  ss.spotsNow().find((s) => s.verb === "OPEN").f();
  const opened = n.ch1Cut && n.ch1Cut.id === "bar" && n.ctrl === false;
  const t0 = n.ch1PartyT;
  ss.tick(1);
  const paused = n.ch1PartyT === t0;
  ss.ch1Pointer("down", 430, 200);
  ss.ch1Pointer("up", 40, 560);
  const bagged = n.ch1Cut && n.ch1Cut.bag === 1 && n.stars === 0;
  n.ch1Cut.face = 1;
  n.ch1Cut.held = "top";
  ss.ch1Pointer("up", 400, 300);
  ss.tick(0.05);
  const first = n.log.some((e) => e.text === "...Nice gloves.") && n.ch1Cut;
  n.ch1Cut.face = 1;
  n.ch1Cut.held = "bottom";
  const beforeAlarm = n.ch1PartyOver;
  ss.ch1Pointer("up", 400, 500);
  const second = n.log.some((e) => e.text === "Wait a second... fur!") || n.ch1PartyOver;
  n.ch1PartyOver = false;
  n.ch1Disguise = true;
  n.ch1Cut = { id: "bar", zoom: 1, paw: { x: 200, y: 500 }, held: "", bag: 1, back: 0, glance: 0, face: 0, catches: 0, drag: false };
  n.ch1Chain = false;
  ss.ch1Pointer("down", 420, 400);
  ss.ch1Pointer("up", 40, 560);
  return { opened, paused, bagged, first, second, beforeAlarm, chain: n.ch1Chain, look: n.ch1Look, bag: n.ch1Bag };
});
g.check(
  "the bar cut-in pauses the party, counts snacks, and a bottom grab spills once",
  slice.opened && slice.paused && slice.bagged && slice.first && slice.chain && slice.look === 4 && slice.bag === 2,
  slice,
);
g.check("no page errors", errors.length === 0, errors);
const pad = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.ch1PadOn = true;
  n.ch1Pad = "";
  n.ch1Step = "pad";
  n.ch1Door = false;
  ss.ch1PadPress("4");
  ss.ch1PadPress("9");
  const cleared = n.ch1Pad === "" && !n.ch1Door;
  ss.ch1PadPress("4");
  ss.ch1PadPress("7");
  ss.ch1PadPress("2");
  const mid = n.ch1Pad;
  ss.ch1PadPress("3");
  return { cleared, mid, code: n.ch1Code, door: n.ch1Door, on: n.ch1PadOn };
});
g.check("a wrong keypad digit clears, and 4723 opens the door", pad.cleared && pad.mid === "472" && pad.code === "4723" && pad.door && !pad.on, pad);
await ctx.close();
await g.finish("ch1-playthrough");

function doorUses(walks) {
  const use = { backHall: 0, backHome: 0, overHall: 0, overDelivery: 0 };
  for (let i = 0; i < walks.length - 1; i++) {
    const a = walks[i],
      b = walks[i + 1];
    if (a.phase !== "edge" || b.phase !== "in") continue;
    if (a.room === "hangar" && b.room === "hall" && a.x < 160 && b.x > 800) use.backHall++;
    if (a.room === "hall" && b.room === "closet" && a.y > 560 && b.x > 800) use.backHome++;
    if (a.room === "closet" && b.room === "hall" && a.x > 800 && b.y > 560) use.overHall++;
    if (a.room === "hall" && b.room === "hangar" && a.x > 800 && b.x < 160) use.overDelivery++;
  }
  return use;
}
function walkChanges(trail) {
  let changes = 0;
  for (let i = 1; i < trail.length; i++) {
    if (trail[i].room === trail[i - 1].room) continue;
    const before = trail.slice(Math.max(0, i - 6), i);
    const after = trail.slice(i, Math.min(trail.length, i + 6));
    const moved = (pts) =>
      pts.length >= 2 && Math.hypot(pts[pts.length - 1].x - pts[0].x, pts[pts.length - 1].y - pts[0].y) > 30;
    if (moved(before) && moved(after)) changes++;
  }
  return changes;
}
