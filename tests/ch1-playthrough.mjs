/**
 * Plays the redesigned Chapter 1 from ?ch=1 to the tally card.
 *   node tests/ch1-playthrough.mjs
 *
 * The old key route (tests/routes/ch1.json) was the notice-sneak chapter. This suite drives the new
 * beats the way the story queue does: ticks, taps through bubbles, and presses each action when the
 * chapter hands control back. It checks the lines in order, a real walk off and walk in, the home
 * room (no vent, door cut, wardrobe), and the ball-hide distances.
 */
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
  const far = ss.ballHides(ss.BALL_MISS_FAR + 10, true);
  const midLook = ss.ballHides(ss.BALL_LOOK_RANGE + 20, true);
  const closeLook = ss.ballHides(ss.BALL_LOOK_RANGE - 10, true);
  const touch = ss.ballHides(ss.BALL_SPOT_NEAR - 4, false);
  ss.op.scene = "Q4";
  ss.op.room = "hangar";
  ss.op.ch1D = true;
  ss.op.ch1Night = true;
  ss.op.ctrl = true;
  ss.op.sqPose = "ball";
  ss.op.sq.x = 140;
  ss.op.sq.y = 540;
  ss.op.q = [];
  ss.op.cur = null;
  ss.tick(0.05);
  const safe = !(ss.op.cur && ss.op.cur.id === "jail");
  ss.op.sqPose = "stand";
  ss.op.sq.x = ss.CH1_VENT ? 480 : 480;
  ss.op.sq.x = 480;
  ss.op.sq.y = 430;
  ss.tick(0.05);
  const caught = ss.op.cur && ss.op.cur.id === "jail";
  return {
    far,
    midLook,
    closeLook,
    touch,
    safe,
    caught,
    near: ss.BALL_SPOT_NEAR,
    look: ss.BALL_LOOK_RANGE,
    miss: ss.BALL_MISS_FAR,
  };
});
g.check("a ball hides from a far looker and from a looker past the look range", ball.far && ball.midLook, ball);
g.check("a ball is spotted up close, or when a looker is inside the look range", !ball.closeLook && !ball.touch, ball);
g.check("the night robot misses a balled Squatch on the safe path", ball.safe, ball);
g.check("standing in front of that robot still gets caught", ball.caught, ball);

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
    shown: shown.filter((s) => /JANITOR|IDEAS FOR GUARDIANS|HAVE YOU SEEN|Order new box|Return empty crate|PULL DOWN|Brave Sasquatches/.test(s)),
    tally: ss.chTally(),
  };
});
g.check("Chapter 1 reaches the tally card", play.end === "tally", { end: play.end, acts: play.acts, scene: play.state.scene });
const wantActs = ["GRAB · yellow copy", "SIGN · paw", "POST · mailbox", "ROLL · ball", "GRAB · pink slip", "RETURN · empty crate", "TRIM · beard", "BOARD · scanner"];
g.check("the player does the new actions in order", JSON.stringify(play.acts) === JSON.stringify(wantActs), play.acts);
const must = [
  "Stormtop Cloud Resort, floating above Jupiter.",
  "This is Squatch. He's a Sasquatch.",
  "My lunch! You're the best.",
  "Universal Postal Service ship arriving!",
  "Delicious.",
  "You're gumbling! (goat mumbling)",
  "Ptoo!",
  "Quick, hide.",
  "Mail scanned. Signature pawature accepted.",
  "Six days later",
  "I hope Mops doesn't notice...",
  "Hurry, hurry, pink slip, got it!",
  "Get it before he sees it.",
  "More bleat. Less roar.",
  "HAIR... PROBABLY. PROCEED.",
  "Mops, it's a mistake!",
  "Later that evening...",
  "What happened? We need to review the security tapes.",
];
let at = -1;
const order = must.map((line) => {
  const i = play.texts.indexOf(line, at + 1);
  if (i > at) at = i;
  return [line, i];
});
g.check("the story lines show in cartoon order", order.every(([, i]) => i >= 0), order.filter(([, i]) => i < 0).map(([line]) => line));
g.check("Squatch rolled into the ball, then wore the costume", play.state.didBall === true && play.state.costume === true, play.state);
const walks = walkChanges(play.state.trail);
g.check("room changes walk off and walk in (" + walks + ")", walks >= 4, { walks, sample: play.state.trail.slice(0, 6) });
g.check("the costume, vent board, and Moon Pie buttons are drawn", play.shown.includes("JANITOR") && play.shown.includes("IDEAS FOR GUARDIANS") && play.shown.includes("Return empty crate") && play.shown.includes("PULL DOWN"), play.shown);
g.check("a clean chapter still earns the never-caught bonus", play.tally.some((line) => line.includes("Never caught")), play.tally);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-playthrough");

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
