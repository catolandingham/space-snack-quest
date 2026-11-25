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
    n.ch1PartyNow = null;
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

// The party in disguise (P6, src/modules/party-free.js): three songs share the pinned 3 minutes
// (COOL_HAT_SECONDS), and closing time (P8b, the wall speaker's line) comes after the third, not sooner, with no
// "Cool hat!". The test sets the party's clock just short of the end, as the older check did.
const hat = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const b = window.SSQ.beat("ch1-party");
  n.q = [];
  n.cur = null;
  n.log = [];
  b.jump("P6");
  const p = n.ch1PartyNow;
  // He stands behind the crowd at the front of the hall, where nobody is looking.
  n.sq.x = 600;
  n.sq.y = 585;
  ss.tick(0.05);
  Object.assign(p, { song: 2, songT: 60 - 0.3, ft: 180 - 0.3 });
  ss.tick(0.2);
  const before = b.now().scene;
  ss.tick(0.2);
  ss.tick(0.05);
  const said = n.log.filter((e) => e.k === "bub").map((e) => e.text).concat(n.cur && n.cur.b ? [n.cur.b.text] : []);
  return { before, after: b.now() && b.now().scene, said };
});
const free = await import(new URL("../src/modules/party-free.js", import.meta.url).href);
g.check(
  "the party in disguise lasts its 3 minutes (three songs), then closing time, not sooner, with no \"Cool hat!\"",
  free.COOL_HAT_SECONDS === 180 && free.SONG_SECONDS * 3 === 180 && hat.before === "P6" && hat.after === "P8b" && hat.said.includes("The party's over. Good night, Stormtop!") && !hat.said.includes("Cool hat!"),
  hat,
);
// The balloon (and the balloon kid), the octopus's two-hug alarm, the SNAP photo button and the snack bar cut-in
// went with the old free play on purpose (party rebuild, half two). Their replacements in P6 are checked in
// tests/party-free.mjs: the octopus's hugs knock a piece off, the camera's flash pays the photo bonus once, and
// the snack close-up (five snacks topple the pyramid; the bartender's two catches).

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
    // The party's full-screen dress-up: drag a piece onto each bare spot, then GO · party, with the finger's own
    // pointer events on the view (src/modules/fullscreen.js).
    const dress = window.SSQ.beat("ch1-party") && window.SSQ.beat("ch1-party").dressTargets();
    if (dress) {
      const cv = document.querySelector('canvas[aria-label="dress-up"]');
      const ev = (type, p) => cv.dispatchEvent(new PointerEvent(type, { clientX: p.x, clientY: p.y, pointerId: 7, bubbles: true }));
      if (dress.go) ev("pointerdown", dress.go);
      else {
        const spot = ["head", "face", "body", "legs"].find((k) => !dress.outfit[k]);
        (ev("pointerdown", dress.pieces[0]), ev("pointermove", dress.spots[spot]), ev("pointerup", dress.spots[spot]));
        acts.push("DRESS " + dress.pieces[0].id + " · " + spot);
      }
      ss.tick(0.05);
      still = 0;
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
    // The party in disguise and closing time (src/modules/party-free.js, party-endings.js).
    const pb = window.SSQ.beat("ch1-party"),
      pn = pb && pb.now();
    if (pn && pn.dance) {
      // The full-screen dance: he taps the glowing spot (the dance notes where it is); it ends with the song.
      const cv = document.querySelector('canvas[aria-label="dance"]'),
        dn = n.ch1PartyNow && n.ch1PartyNow.dance,
        gl = dn && dn.live && dn.seen && dn.seen.glow;
      cv && gl && i % 4 === 0 && cv.dispatchEvent(new PointerEvent("pointerdown", { clientX: gl.x, clientY: gl.y, pointerId: 8, bubbles: true }));
      cv && gl && i % 4 === 0 && cv.dispatchEvent(new PointerEvent("pointerup", { clientX: gl.x, clientY: gl.y, pointerId: 8, bubbles: true }));
      ss.tick(0.1);
      still = 0;
      continue;
    }
    if (pn && pn.scene === "P6" && pn.done.dance && n.ctrl && !n.cur) {
      // After the dance he enjoys the party until closing time, the way a careful kid does: he stands where no cone
      // reaches, and steps somewhere else when someone looks his way or turns for a second look.
      const cones = pb.cones();
      const inCone = (c, x, y) => {
        const dx = x - c.ox,
          dy = y - 20 - c.oy;
        let a = Math.atan2(dy, dx) - c.a;
        while (a > Math.PI) a -= 2 * Math.PI;
        while (a < -Math.PI) a += 2 * Math.PI;
        return Math.abs(a) <= c.half + 0.08 && Math.hypot(dx, dy) <= c.len + 16;
      };
      const seen = (x, y) => cones.some((c) => inCone(c, x, y));
      const curious = pn.curious && pn.curious.phase !== "wait";
      if (seen(n.sq.x, n.sq.y) || curious || n.sq.y < 400) {
        // (clear of the vent, the plants, the hallway doorway and the octopus's place by the snacks)
        const SAFE = [[600, 585], [320, 585], [560, 470], [420, 470], [250, 585], [520, 585], [130, 585]];
        const far = (x, y) => !curious || !pn.curious || Math.hypot(x - n.sq.x, y - n.sq.y) > 120;
        const to = SAFE.find(([x, y]) => !seen(x, y) && far(x, y)) || SAFE.find(([x, y]) => !seen(x, y));
        to && ((n.sq.x = to[0]), (n.sq.y = to[1]));
      }
      n.sqPose = "stand";
      ss.tick(0.2);
      still = 0;
      continue;
    }
    if (pn && pn.scene === "P8b" && pn.mops && n.ctrl && !n.cur) {
      // Closing time: Mops has come in mopping; Squatch walks over to him, and they go home together.
      n.sq.x = pn.mops.x - 50;
      n.sq.y = pn.mops.y + 4;
      acts[acts.length - 1] === "WALK · Mops" || acts.push("WALK · Mops");
      ss.tick(0.05);
      still = 0;
      continue;
    }
    if (pn && pn.scene === "P8b" && !n.cur && !pn.mops) {
      // The band packs up and everyone leaves, two by two (he has control meanwhile and stays where he is).
      ss.tick(0.1);
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
      // A spot with a place to stand: a circle (r) or a box (the home-alone desk). A doorway the party walks him
      // through has no button: standing in it is the action.
      const spots = ss.spotsNow().filter((s) => s && (s.verb || s.r > 0) && (s.r > 0 || s.box) && s.id !== "home-calendar");
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
      if (!spot.verb) {
        acts.push("WALK · " + spot.id);
        ss.tick(0.05);
        still = 0;
        continue;
      }
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
// The party night (src/modules/party.js): the peek, the plant, home through his door, the dress-up, out through his
// door; the party in disguise (the dance), closing time, and walking home with Mops.
const wantActs = ["SING ALONG", "DO · homework", "PEEK · door", "HIDE · plant", "WALK · go-home", "OPEN · closet", "DRESS tophat · head", "DRESS shades · face", "DRESS shirt · body", "DRESS boots · legs", "WALK · go-party", "DANCE · circle", "WALK · Mops", "TAKE · gift", "PUT · box", "DROP · box", "LOOK · calendar", "TAKE · lunch", "SNEAK · hallway", "GIVE · lunch", "FEED · lunch", "FEED · bag", "TAKE · snack", "DROP · snack", "HIDE · plant", "GO · hall", "HIDE · plant", "GO · home", "GRAB · copies", "MARK · order", "POST · mailbox", "GO · door", "ROLL · ball", "GRAB · pink slip", "RETURN · empty crate", "DROP · snacks", "DROP · snacks", "DROP · snacks", "DROP · snacks", "DROP · snacks", "LEAVE · food", "PUT · slip", "PACK · box", "PACK · bucket", "PUT ON · jacket", "GO · ship", "BOARD · scanner"];
g.check("the player does the new actions in order", JSON.stringify(play.acts) === JSON.stringify(wantActs), play.acts);
const must = [
  "Stormtop Cloud Resort, floating above Jupiter.",
  "This is Squatch. He's a Sasquatch.",
  "\u266A I'm floating in space! \u266A",
  "\u266A Weeee-eenn-nnttt! \u266A",
  "Mmf mmf... mm-mmf... mmf!",
  "Robots?",
  // The party plan trims the welcome to three Isfred lines (src/modules/party-lines.js), with the teach card
  // and the band's song between.
  "Stay out of their sight!",
  "Let's give a big hello to our friends from Bleep-Bloop Robotics!",
  "Soon their helper robots will be here, to help with the heavy work.",
  "And now... put your hands together for the Croc Boys!",
  "Stormtop-vania 1-2-3-4-5!",
  "I've never gotten to dance at a party.",
  // Closing time and the walk home with Mops (party-endings.js); the raid and Mops finding the flyer went with
  // the old free play.
  "The party's over. Good night, Stormtop!",
  "Everyone out there has someone.",
  "You have me.",
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
g.check("the vent board and the Moon Pie buttons are drawn", play.shown.includes("IDEAS FOR GUARDIANS") && play.shown.includes("Return empty crate"), play.shown);
// The red FUR alarm is part of the locked party hall picture now (its words are in the picture, not drawn text):
// it shows on the back wall, by the hallway doorway, during the party.
const { HALL } = await import(new URL("../src/modules/party-hall.js", import.meta.url).href);
const red = await page.evaluate((a) => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = null;
  window.SSQ.beat("ch1-party").jump("P2");
  // past the fade into the room
  for (let i = 0; i < 30; i++) ss.tick(0.05);
  ss.drawFrame();
  const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
  const k = cv.width / 960;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  let reds = 0,
    all = 0;
  for (let y = a.y0 + 2; y < a.y1 - 2; y += 2)
    for (let x = a.x0 + 2; x < a.x1 - 2; x += 2) {
      const p = cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
      all++;
      p[0] > 170 && p[1] < 110 && p[2] < 110 && reds++;
    }
  return { room: n.room, reds, all };
}, HALL.alarm);
g.check("the red FUR alarm shows on the party hall's back wall", red.room === "hall" && red.reds > red.all * 0.25, red);
g.check("a clean chapter still earns the never-caught bonus", play.tally.some((line) => line.includes("Never caught")), play.tally);

// The balloon that stayed in later hall scenes went with the old free play on purpose (party rebuild, half two),
// and so did the snack bar cut-in: the snack close-up is checked in tests/party-free.mjs.
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
