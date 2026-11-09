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
  for (let i = 0; i < 30; i++) {
    if (n.cur && (n.cur.k === "card" || n.cur.k === "bub")) {
      n.bt = 1;
      ss.opTap();
    }
    ss.tick(0.05);
    if (n.scene === "O1" && n.ctrl && !(n.cur && (n.cur.k === "card" || n.cur.k === "bub"))) break;
  }
  ss.drawFrame();
  const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
  const k = cv.width / 960;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const px = (x, y) => Array.from(cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data);
  return {
    scene: ss.op.scene,
    wall: px(850, 300),
    gap: px(900, 300),
    floor: px(820, 560),
    state: ss.ch1State(),
  };
});
const rgb = (p) => p.slice(0, 3).join(",");
g.check("the opening is the home room", home.scene === "O1" && home.state.room === "closet" && home.state.wardrobe === "closed", home.state);
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
  for (const who of ["mops", "sq", "official", "tourist", "ups", "scanner", "robot"]) out.push(placed(who, setups[who]));
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
  for (let i = 0; i < 4000; i++) {
    const cur = n.cur;
    if (cur && cur.k === "panel" && cur.id === "tally") {
      ss.drawFrame();
      end = "tally";
      break;
    }
    if (cur && (cur.k === "bub" || cur.k === "card" || cur.k === "panel")) {
      if (cur.k === "panel") ss.drawFrame();
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
    if (n.ctrl && !n.cur && n.q.length === 0 && (n.scene || "")[0] === "Q") {
      if (n.scene === "Q5") {
        const rolls = ss.spotsNow().filter((s) => s && s.verb === "ROLL");
        if (rolls.length !== 1 || !(rolls[0].r > 0) || rolls[0].x < 100) return { end: "vent-roll", rolls, acts, texts: texts(), state: ss.ch1State(), shown: [], tally: [] };
      }
      const spots = ss.spotsNow().filter((s) => s && s.verb && s.r > 0);
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
      if (++still > 400) {
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
    shown: shown.filter((s) => /IDEAS FOR GUARDIANS|HAVE YOU SEEN|Order new box|Return empty crate|PULL DOWN|Brave Sasquatches/.test(s)),
    tally: ss.chTally(),
  };
});
g.check("Chapter 1 reaches the tally card", play.end === "tally", { end: play.end, acts: play.acts, scene: play.state.scene });
const wantActs = ["GRAB · yellow copy", "SIGN · paw", "POST · mailbox", "ROLL · ball", "GRAB · pink slip", "RETURN · empty crate", "PUT ON · jacket", "BOARD · scanner"];
g.check("the player does the new actions in order", JSON.stringify(play.acts) === JSON.stringify(wantActs), play.acts);
const must = [
  "Stormtop Cloud Resort, floating above Jupiter.",
  "This is Squatch. He's a Sasquatch.",
  "My lunch! You're the best.",
  "Universal Postal Service ship arriving!",
  "Isfred Bar Neshuman! The dock needs you.",
  "Delicious.",
  "You're gumbling! (goat mumbling)",
  "Ptoo!",
  "Quick, hide.",
  "Didn't you hear what Isfred Bar Neshuman said? They need me here, they're not going to replace me. Plus the Guardians are here.",
  "Mail scanned. Signature pawature accepted.",
  "Six days later",
  "I hope Mops doesn't notice...",
  "Hurry, hurry, pink slip, got it!",
  "Get it before he sees it.",
  "The code from the slip. His computer.",
  "Get out. They're checking a crate.",
  "The spare jacket. The beard. And the horns.",
  "More bleat. Less roar.",
  "HAIR... PROBABLY. PROCEED.",
  "Later that evening...",
  "Send in Mops for his Employee of the Month photo.",
  "Mops isn't here.",
  "Not here? He can't live off the station!",
  "He was replaced by the new robot shipment.",
  "I never ordered a replacement! Get me the security tapes.",
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
g.check("every room change walks off and walks in", walks === 18, { walks, sample: play.state.trail.slice(0, 8) });
const doors = doorUses(play.state.walks);
g.check(
  "the walk home uses the same hall doors as the walk over",
  play.state.siteRoom === "hall" && doors.backHall >= 3 && doors.backHome >= 3 && doors.overHall >= 4 && doors.overDelivery >= 4,
  { siteRoom: play.state.siteRoom, doors },
);
g.check("the vent board, the alarm, and the Moon Pie buttons are drawn", play.shown.includes("IDEAS FOR GUARDIANS") && play.shown.includes("Return empty crate") && play.shown.includes("PULL DOWN"), play.shown);
g.check("a clean chapter still earns the never-caught bonus", play.tally.some((line) => line.includes("Never caught")), play.tally);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-playthrough");

function doorUses(walks) {
  const use = { backHall: 0, backHome: 0, overHall: 0, overDelivery: 0 };
  for (let i = 0; i < walks.length - 1; i++) {
    const a = walks[i],
      b = walks[i + 1];
    if (a.phase !== "edge" || b.phase !== "in") continue;
    if (a.room === "hangar" && b.room === "hall" && a.x < 0 && b.x > 1000) use.backHall++;
    if (a.room === "hall" && b.room === "closet" && a.y > 700 && b.x > 1000) use.backHome++;
    if (a.room === "closet" && b.room === "hall" && a.x > 1000 && b.y > 700) use.overHall++;
    if (a.room === "hall" && b.room === "hangar" && a.x > 1000 && b.x < 0) use.overDelivery++;
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
