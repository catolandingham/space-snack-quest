/**
 * The party night, half one (party plan P1 to P5, src/modules/party.js), checked the way it plays, at phone size:
 *   - P1: the door is outlined at home; PEEK · door walks him through it; in the hall only his head and paws show;
 *     the lines come one at a time on a tap, the banner glows on "Robots?", the teach card spotlights the
 *     glancer; he steps into the doorway (no jump) and P2 starts. No wordless wait (the yellow corner chevron).
 *   - P2: his doorway and the plant's step-in spot are outside every cone at every moment of the glancer's
 *     rhythm, and the glancer's look covers the lane; cones are drawn whole and equal to sight; "?" then "!".
 *   - The one capture rule: the witness shouts, runs under the red wall alarm, the close-up shows once a play,
 *     guards come in at the hallway doorway; caught = the LOCKUP card naming who and where, then P2 again; hidden
 *     in the plant = "They lost you.", the guards walk out, the witness walks back, then P3; through his door =
 *     a guard follows him home, HIDE · bed, "They lost you.", the calm seen from the door gap, back in his doorway.
 *   - The vent: too close, a tuft and the big warning; staying, the alarm "by the vent".
 *   - P3: Isfred's lines in order, everyone facing him, his bubble never over the banner; then the band and the
 *     pairs; his eyes in the plant, never at the vent. P4: a flyer on his back, home through his door, the flyer
 *     on the floor. P5: the full-screen dress-up (stick and button hidden), pieces snap to the nearest body spot,
 *     a second piece swaps, the meter (its ta-da chimes), GO · party, ↺ restarts with nothing on; out through the
 *     door into the party in disguise (P6, tests/party-free.mjs), nobody jumping.
 *   - Every scene's ↺ restarts that scene; every room change is a walk through a door.
 * Stills of every warning at 375 x 812 go to tests/out/party-stills/.
 *   node tests/party-scenes.mjs
 */
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const g = await startGame({ port: 8991, name: "party-scenes" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const watch = await import(join(root, "src", "modules", "party-watch.js"));

async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1400);
  return o;
}
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      b = window.SSQ.beat("ch1-party"),
      c = n.cur;
    return {
      now: b.now(),
      room: n.room,
      scene: n.scene,
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      curId: c ? c.id || "" : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      quiet: c ? !!c.quiet : false,
      cause: c && c.id === "jail" ? c.cause : "",
      x: Math.round(n.sq.x),
      y: Math.round(n.sq.y),
      pose: n.sqPose,
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      chip: window.__ss.chipNow(),
      ring: n.lastRing && n.T - n.lastRing.T < 0.3 ? n.lastRing.id : "",
      note: n.hudNote ? n.hudNote.text || "" : "",
      walks: (n.ch1Walks || []).length,
      party: !!n.ch1Party,
    };
  });
const tap = (page) => page.evaluate(() => window.__ss.opTap());
const press = (page) => page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
const place = (page, x, y) => page.evaluate((p) => ((window.__ss.op.sq.x = p[0]), (window.__ss.op.sq.y = p[1])), [x, y]);
const walk = (page, x, y) => page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [x, y]);
const until = async (page, f, ms = 15000, onWait) => {
  const t0 = Date.now();
  for (;;) {
    const s = await st(page);
    if (f(s)) return s;
    if (Date.now() - t0 > ms) return null;
    onWait && (await onWait(s));
    await sleep(100);
  }
};
const still = (page, name) => page.screenshot({ path: join(OUT, name + ".png") });
// A pixel of the game picture, at game position (x, y).
const px = (page, x, y) =>
  page.evaluate(([x, y]) => {
    const c = document.querySelector("canvas"),
      k = c.width / 960;
    return Array.from(c.getContext("2d").getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data).slice(0, 3);
  }, [x, y]);
const near = (a, hex, tol) => [1, 3, 5].every((i, j) => Math.abs(a[j] - parseInt(hex.slice(i, i + 2), 16)) <= tol);
// Squatch's position every 50 ms (for "nobody teleports"): steps bigger than 60 inside one room are jumps.
const trailStart = (page) =>
  page.evaluate(() => {
    window.__trail = [];
    window.__trailT = setInterval(() => {
      const n = window.__ss.op;
      window.__trail.push([Math.round(n.sq.x), Math.round(n.sq.y), n.room]);
    }, 50);
  });
const trailJumps = (page) =>
  page.evaluate(() => {
    clearInterval(window.__trailT);
    const t = window.__trail,
      out = [];
    for (let i = 1; i < t.length; i++) t[i][2] === t[i - 1][2] && Math.hypot(t[i][0] - t[i - 1][0], t[i][1] - t[i - 1][1]) > 60 && out.push([t[i - 1], t[i]]);
    return { samples: t.length, jumps: out };
  });
// The name over the bubble on screen ("none" before any bubble).
const bubbleName = (page) => page.evaluate(() => (window.__ss.lastBubble ? String(window.__ss.lastBubble.name) : "none"));

// ---------- P1 ----------
{
  const { page, errors } = await open("party");
  let s = await st(page);
  g.check("P1 starts at home with the peek as the goal", s.now && s.now.scene === "P1" && s.room === "closet", s);
  await place(page, 860, 480);
  s = await until(page, (q) => q.act === "PEEK · door" && q.ring === "peek");
  g.check("at the door the button is PEEK · door and the door is outlined", !!s, s);
  await still(page, "p1-home-door");
  const walks0 = s ? s.walks : 0;
  await trailStart(page);
  await press(page);
  const seen = [],
    names = [];
  let peekPx = null;
  let waits = 0,
    glowOnRobots = false,
    teach = null,
    tapped = "";
  s = await until(
    page,
    (q) => q.now && q.now.scene === "P2" && q.ctrl,
    30000,
    async (q) => {
      q.cur === "wait" && !q.quiet && waits++;
      if (q.cur === "bub" || q.cur === "card") {
        if (!seen.includes(q.text)) {
          seen.push(q.text);
          q.cur === "bub" && (await sleep(150), names.push([q.text, await bubbleName(page)]));
          if (q.text === "Robots?") {
            glowOnRobots = await page.evaluate(() => window.__ss.op.ch1PartyNow.glow === 1);
            // Only his head and paws: fur in the doorway gap, none above it where his body would stand.
            await sleep(300);
            const head = [],
              body = [];
            for (let x = 465; x <= 489; x += 4) {
              for (let y = 606; y <= 632; y += 4) head.push(await px(page, x, y));
              for (let y = 540; y <= 590; y += 5) body.push(await px(page, x, y));
            }
            peekPx = { head: head.filter((c) => near(c, "#6b4428", 40)).length, body: body.filter((c) => near(c, "#6b4428", 40)).length };
          }
          q.curId === "focus" && ((teach = q), await still(page, "p1-teach-card"));
          // after the room's fade has finished
          q.text.startsWith("Mmf") && (await sleep(800), await still(page, "p1-peek"));
        }
        // One tap per line, after it has been up a moment (a tap too soon is kept for the next line).
        if (tapped !== q.text) ((tapped = q.text), await sleep(450), await tap(page));
      }
    },
  );
  g.check("P1 ends in P2 with control", !!s, s);
  const p1Trail = await trailJumps(page);
  g.check("in P1 nobody teleports: Squatch never jumps over 60 inside a room", p1Trail.samples > 20 && p1Trail.jumps.length === 0, p1Trail.jumps.slice(0, 3));
  g.check("the peek shows only his head and paws (fur in the doorway gap, none above it)", !!peekPx && peekPx.head >= 3 && peekPx.body === 0, peekPx);
  g.check("every bubble in the peek has a real name over it", names.length >= 2 && names.every(([, nm]) => nm && nm !== "undefined" && nm !== "none"), names);
  g.check("the peek lines come in order, one at a time", JSON.stringify(seen) === JSON.stringify(["Mmf mmf... mm-mmf... mmf!", "Robots?", "Stay out of their sight!"]), seen);
  g.check("the banner glows while Squatch thinks \"Robots?\"", glowOnRobots);
  g.check("the teach card spotlights the glancer", !!teach && teach.curId === "focus");
  g.check("no wordless story wait in the peek (no yellow corner chevron)", waits === 0, waits);
  g.check("he walked through his door (the walk log grew)", s && s.walks >= walks0 + 2, { before: walks0, after: s && s.walks });
  g.check("P2 starts with him in his doorway", s && Math.abs(s.x - hall.SPOTS.doorway.x) < 3 && Math.abs(s.y - hall.SPOTS.doorway.y) < 3, s);
  g.check("no script errors in P1", errors.length === 0, errors.slice(0, 3));
}

// ---------- P2: the cones ----------
{
  const { page, errors } = await open("party:P2");
  const res = await page.evaluate(
    (spots) => {
      const b = window.SSQ.beat("ch1-party"),
        p = window.__ss.op.ch1PartyNow,
        out = { doorHit: [], plantHit: [], laneCovered: 0, glanceLooks: 0, lengths: new Set() };
      const lane = [];
      for (let i = 0; i <= 20; i++) lane.push({ x: 477 + (396 - 477) * (i / 20), y: 590 + (552 - 590) * (i / 20) });
      const inCone = (c, q) => {
        const dx = q.x - c.ox,
          dy = q.y - 20 - c.oy,
          d = Math.hypot(dx, dy);
        let a = Math.atan2(dy, dx) - c.a;
        while (a > Math.PI) a -= 2 * Math.PI;
        while (a < -Math.PI) a += 2 * Math.PI;
        return d <= c.len && Math.abs(a) <= c.half;
      };
      for (let gt = 0; gt < 6.4; gt += 0.05) {
        p.gt = gt;
        for (const c of b.cones()) {
          out.lengths.add(c.len);
          inCone(c, spots.doorway) && out.doorHit.push([gt.toFixed(2), c.id]);
          inCone(c, spots.plantMiddle) && out.plantHit.push([gt.toFixed(2), c.id]);
          c.id === "backpack" && lane.some((q) => inCone(c, q)) && out.laneCovered++;
        }
        b.now().glance === "look" && out.glanceLooks++;
      }
      p.gt = 0;
      out.lengths = [...out.lengths];
      return out;
    },
    { doorway: hall.SPOTS.doorway, plantMiddle: hall.SPOTS.plantMiddle },
  );
  g.check("his doorway is outside every cone at every moment", res.doorHit.length === 0, res.doorHit.slice(0, 5));
  g.check("the plant's step-in spot is outside every cone at every moment", res.plantHit.length === 0, res.plantHit.slice(0, 5));
  g.check("the glancer's look covers the lane between the door and the plant", res.laneCovered > 10, res.laneCovered);
  g.check("every cone is whole (full length, nothing cuts it short)", res.lengths.length === 1 && res.lengths[0] === 210, res.lengths);
  await sleep(300);
  const cmp = await page.evaluate(() => {
    const drawn = window.__ss.conesDrawn(),
      mine = window.SSQ.beat("ch1-party").cones();
    return { cut: drawn.filter((c) => c.blocked).length, odd: drawn.filter((d) => !mine.some((c) => Math.abs(c.ox - d.ox) < 0.5 && Math.abs(c.oy - d.oy) < 0.5 && Math.abs(c.a - d.a) < 1e-6 && c.len === d.len)).length };
  });
  g.check("the cones drawn are the party's own whole cones (none cut short at furniture)", cmp.cut === 0 && cmp.odd === 0, cmp);
  g.check("no script errors in P2", errors.length === 0, errors.slice(0, 3));
}

// ---------- the capture rule: caught ----------
const LANE = { x: 455, y: 500 };
async function getSeen(page) {
  await until(page, (q) => q.now && q.now.glance === "look", 10000);
  await place(page, LANE.x, LANE.y);
  return until(page, (q) => q.now && q.now.alarm === "shout", 6000);
}
{
  const { page, errors } = await open("party:P2");
  let s = await until(page, (q) => q.now && q.now.glance === "look", 10000);
  await place(page, LANE.x, LANE.y);
  await page.evaluate(() => {
    // Watch the marks the picture draws: their words and font size.
    const fill = CanvasRenderingContext2D.prototype.fillText;
    window.__marks = [];
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) {
      (t === "?" || t === "!") && window.__marks.push({ t, px: parseFloat((String(this.font).match(/(\d+(\.\d+)?)px/) || [0, 0])[1]) });
      return fill.call(this, t, ...r);
    };
  });
  s = await until(page, (q) => q.now && q.now.seenBy === "backpack", 3000);
  g.check("in the glancer's cone a \"?\" comes first (seenBy, no alarm yet)", !!s && !s.now.alarm, s && s.now);
  await sleep(200);
  const marks = await page.evaluate(() => ({ q: Math.max(0, ...window.__marks.filter((m) => m.t === "?").map((m) => m.px)), head: 25.5 * window.SSQ.engine().hallSizes().squatch }));
  g.check("the \"?\" drawn over the watcher is at least as tall as Squatch's head", marks.q >= marks.head, marks);
  await still(page, "p2-question-mark");
  s = await until(page, (q) => q.now && q.now.alarm === "shout", 3000);
  g.check("staying in sight starts the alarm: the witness shouts", !!s, s);
  await still(page, "p2-fur-shout");
  const ran = await until(page, (q) => q.now && q.now.alarm === "pull", 8000);
  const w = await page.evaluate(() => window.__ss.op.ch1PartyNow.alarm && window.__ss.op.ch1PartyNow.alarm.w);
  g.check("the witness ran to stand under the red wall alarm", !!ran && w && Math.hypot(w.x - hall.SPOTS.alarmRun.x, w.y - hall.SPOTS.alarmRun.y) < 6, w);
  const close = await page.evaluate(() => {
    const c = document.querySelector('canvas[aria-label="fur alarm"]'),
      r = c && c.getBoundingClientRect(),
      hiddenCtl = [document.querySelector('[aria-label="Move"]'), document.querySelector('[role="button"]')].every((el) => !el || el.style.visibility === "hidden");
    return { open: !!c, w: r && r.width, h: r && r.height, hiddenCtl };
  });
  g.check("the first alarm shows the full-screen close-up (whole phone screen, stick and button hidden)", close.open && close.w >= 375 && close.h >= 812 && close.hiddenCtl, close);
  await still(page, "p2-alarm-close-up");
  s = await until(page, (q) => q.now && q.now.alarm === "search", 8000);
  const guards = await page.evaluate(() => window.__ss.op.ch1PartyNow.alarm.guards.map((x) => [Math.round(x.x), Math.round(x.y)]));
  g.check("two guards come in at the hallway doorway", !!s && guards.length === 2 && guards.every(([x]) => x > 860), guards);
  await still(page, "p2-guards");
  s = await until(page, (q) => q.cur === "card" && q.curId === "jail", 15000);
  g.check("a guard reaches him: the LOCKUP card says who saw him and where", !!s && s.cause === "A tourist saw Squatch in the hall. Security caught him.", s && s.cause);
  await still(page, "p2-lockup");
  s = await until(page, (q) => q.now && q.now.scene === "P2" && q.ctrl && !q.cur, 15000, async (q) => q.cur && (await tap(page)));
  g.check("then P2 starts again, in his doorway, the alarm gone", !!s && !s.now.alarm && Math.abs(s.x - hall.SPOTS.doorway.x) < 3 && Math.abs(s.y - hall.SPOTS.doorway.y) < 3, s);
  // A second alarm in the same play: no close-up.
  s = await getSeen(page);
  await until(page, (q) => q.now && (q.now.alarm === "ring" || q.now.alarm === "pull"), 8000);
  const again = await page.evaluate(() => !!document.querySelector('canvas[aria-label="fur alarm"]'));
  g.check("the close-up shows only the first time in a play", !!s && !again, { s: !!s, again });
  g.check("no script errors in the catch", errors.length === 0, errors.slice(0, 3));
}

// ---------- the capture rule: hidden in the plant ----------
{
  const { page, errors } = await open("party:P2");
  await getSeen(page);
  await until(page, (q) => q.now && q.now.alarm === "search", 12000);
  await place(page, hall.SPOTS.plantMiddle.x + 10, hall.SPOTS.plantMiddle.y);
  let s = await until(page, (q) => q.act === "HIDE · plant", 3000);
  g.check("during the alarm the plant offers HIDE · plant", !!s, s);
  await press(page);
  s = await until(page, (q) => q.now && q.now.pose === "hidden", 3000);
  await still(page, "p2-hidden-eyes");
  s = await until(page, (q) => q.now && (q.now.lost || q.now.alarm === "calm"), 12000);
  g.check("hidden in the plant, the guards give up: \"They lost you.\"", !!s && s.now.lost, s && s.now);
  // The calm, watched: the guards walk out through the hallway doorway and the witness walks back to his spot.
  const calmSteps = [];
  const calm = await until(page, (q) => q.now && q.now.scene === "P3", 15000, async () => {
    const a = await page.evaluate(() => {
      const al = window.__ss.op.ch1PartyNow.alarm;
      return al && { g: al.guards.map((x) => [Math.round(x.x), x.room]), w: [Math.round(al.w.x), Math.round(al.w.y), al.w.hx, al.w.hy] };
    });
    a && calmSteps.push(a);
  });
  const first = calmSteps[0],
    last = calmSteps[calmSteps.length - 1];
  g.check("the calm is shown: the guards walk out of the hallway doorway (not vanish)", !!first && calmSteps.length > 5 && last.g.every(([x, room]) => x >= 930 || room === "out") && first.g.some(([x]) => x < 930), { first, last, steps: calmSteps.length });
  g.check("the calm is shown: the witness walks back to his spot", !!last && Math.hypot(last.w[0] - last.w[2], last.w[1] - last.w[3]) < 30 && Math.hypot(first.w[0] - first.w[2], first.w[1] - first.w[3]) > 100, { first: first && first.w, last: last && last.w });
  g.check("then P3 starts: he made it", !!calm, calm);
  g.check("no script errors in the plant hide", errors.length === 0, errors.slice(0, 3));
}

// ---------- the capture rule: a hide a guard watched does not count ----------
{
  const { page, errors } = await open("party:P2");
  await getSeen(page);
  await until(page, (q) => q.now && q.now.alarm === "search", 12000);
  // A guard right by the plant, looking at it, as Squatch steps in.
  // A guard looking at the plant from 170 away (in his cone, out of his reach), the other far off.
  await page.evaluate((spot) => {
    const [g0, g1] = window.__ss.op.ch1PartyNow.alarm.guards;
    Object.assign(g0, { x: spot.x + 170, y: spot.y - 10, a: Math.PI, look: 0 });
    Object.assign(g1, { x: 900, y: 320 });
  }, hall.SPOTS.plantMiddle);
  await place(page, hall.SPOTS.plantMiddle.x, hall.SPOTS.plantMiddle.y);
  await until(page, (q) => q.act === "HIDE · plant", 3000);
  await press(page);
  const hid = await until(page, (q) => q.now && q.now.pose === "hidden", 3000);
  const spotted = await page.evaluate(() => !!(window.__ss.op.ch1PartyNow.alarm && window.__ss.op.ch1PartyNow.alarm.spotted));
  g.check("he got into the plant, but the guard saw him step in", !!hid && spotted, { hid: !!hid, spotted });
  const s = await until(page, (q) => q.cur === "card" && q.curId === "jail", 15000);
  g.check("hiding while a guard is looking does not count: the guard walks over and catches him", !!s, s);
  g.check("no script errors when the hide is seen", errors.length === 0, errors.slice(0, 3));
}

// ---------- the capture rule: home, unseen, without the bed ----------
{
  const { page, errors } = await open("party:P2");
  await getSeen(page);
  await until(page, (q) => q.now && (q.now.alarm === "ring" || q.now.alarm === "search"), 12000);
  await walk(page, 477, 600);
  await until(page, (q) => q.room === "closet" && q.ctrl, 10000);
  // Behind the guard's look and out of his reach: he never sees him.
  await place(page, 860, 575);
  const s = await until(page, (q) => q.room === "hall" && q.now && q.now.pose === "peek", 20000);
  g.check("at home, unseen, the guard searches, gives up and leaves (no bed needed)", !!s, s);
  g.check("no script errors at home unseen", errors.length === 0, errors.slice(0, 3));
}

// ---------- a stage cone: someone in the crowd sees him too ----------
{
  const { page, errors } = await open("party:P2");
  // A floor spot only Isfred's or the band's cone holds.
  const spot = await page.evaluate(() => {
    const b = window.SSQ.beat("ch1-party"),
      inC = (c, x, y) => {
        const dx = x - c.ox,
          dy = y - 20 - c.oy;
        let a = Math.atan2(dy, dx) - c.a;
        while (a > Math.PI) a -= 2 * Math.PI;
        while (a < -Math.PI) a += 2 * Math.PI;
        return Math.hypot(dx, dy) <= c.len && Math.abs(a) <= c.half;
      };
    window.__ss.op.ch1PartyNow.gt = 0;
    for (let y = 330; y <= 460; y += 10)
      for (let x = 160; x <= 700; x += 10) {
        const holds = b.cones().filter((c) => inC(c, x, y)).map((c) => c.id);
        if (holds.length && holds.every((id) => id === "isfred" || id.startsWith("band")) && !window.__ss.solids().some((q) => x > q.x0 - 10 && x < q.x1 + 10 && y > q.y0 - 10 && y < q.y1 + 10)) return { x, y, holds };
      }
    return null;
  });
  spot && (await place(page, spot.x, spot.y));
  const s = await until(page, (q) => q.now && q.now.alarm === "shout", 4000);
  const w = await page.evaluate(() => window.__ss.op.ch1PartyNow.alarm && window.__ss.op.ch1PartyNow.alarm.w.id);
  g.check("staying in a stage cone: the nearest guest turns, shouts and runs (not \"?\" forever)", !!spot && !!s && ["teal", "stilt", "robot", "octopus-guest", "backpack", "camera"].includes(w), { spot, w });
  g.check("no script errors at a stage cone", errors.length === 0, errors.slice(0, 3));
}

// ---------- the capture rule: home and the bed ----------
{
  const { page, errors } = await open("party:P2");
  await getSeen(page);
  await until(page, (q) => q.now && (q.now.alarm === "ring" || q.now.alarm === "search"), 12000);
  await walk(page, 477, 600);
  let s = await until(page, (q) => q.room === "closet" && q.ctrl, 10000);
  g.check("through his door during the alarm he walks home", !!s, s);
  s = await until(page, (q) => q.act === "HIDE · bed", 4000);
  g.check("at home the button is HIDE · bed", !!s, s);
  const guard = await until(page, () => true).then(() => page.evaluate(() => !!window.__ss.op.ch1PartyNow.alarm && window.__ss.op.ch1PartyNow.alarm.phase));
  await sleep(700);
  const followed = await page.evaluate(() => !!(window.__ss.op.ch1PartyNow.alarm && window.__ss.op.ch1PartyNow.alarm.homeGuard));
  g.check("a guard follows him home half a second later", followed, guard);
  await press(page);
  await still(page, "p2-home-guard");
  s = await until(page, (q) => q.room === "hall" && q.now && q.now.pose === "peek", 15000);
  g.check("hidden under the bed, the guard gives up; the calm is seen from the door gap", !!s, s);
  await sleep(900);
  await still(page, "p2-calm-from-door");
  s = await until(page, (q) => q.now && q.now.scene === "P2" && q.ctrl && !q.now.alarm, 15000);
  g.check("then he steps back into his doorway and P2 goes on", !!s && Math.abs(s.y - hall.SPOTS.doorway.y) < 4, s);
  g.check("no script errors in the home hide", errors.length === 0, errors.slice(0, 3));
}

// ---------- the bartender sees him ----------
{
  const { page, errors } = await open("party:P2");
  await place(page, 720, 480);
  let s = await until(page, (q) => q.now && q.now.alarm === "shout", 4000);
  g.check("in the bartender's cone the alarm starts with her as the witness", !!s, s);
  const ran = await until(page, (q) => q.now && q.now.alarm === "pull", 8000);
  const w = await page.evaluate(() => window.__ss.op.ch1PartyNow.alarm && window.__ss.op.ch1PartyNow.alarm.w);
  g.check("the bartender runs to the alarm herself", !!ran && w && w.id === "bartender" && Math.hypot(w.x - hall.SPOTS.alarmRun.x, w.y - hall.SPOTS.alarmRun.y) < 6, w);
  s = await until(page, (q) => q.cur === "card" && q.curId === "jail", 25000);
  g.check("the LOCKUP card names the bartender", !!s && s.cause === "The bartender saw Squatch in the hall. Security caught him.", s && s.cause);
  g.check("no script errors with the bartender", errors.length === 0, errors.slice(0, 3));
}

// ---------- the vent ----------
{
  const { page, errors } = await open("party:P2");
  await place(page, hall.HALL.vent.x + 40, hall.HALL.vent.y + 20);
  let s = await until(page, () => true);
  await sleep(300);
  const warn = await page.evaluate(() => {
    const v = window.__ss.op.ch1PartyNow.vent;
    return v && v.t > 0;
  });
  g.check("too close to the vent: the warning (a tuft drifting, the big fur sign)", warn);
  await still(page, "p2-vent-warning");
  s = await until(page, (q) => q.now && q.now.alarm === "shout", 4000);
  g.check("staying, the fur goes in and the alarm starts", !!s, s);
  // The fur is seen going in, alarm or not: the tufts keep drifting until they reach the grille.
  let closest = 999;
  await until(page, (q) => q.now && q.now.tufts.length === 0, 4000, async (q) => {
    for (const tf of (q.now && q.now.tufts) || []) closest = Math.min(closest, Math.hypot(tf.x - hall.HALL.vent.x, tf.y - hall.HALL.vent.y));
  });
  g.check("a tuft of fur reaches the vent's grille", closest < 14, closest);
  s = await until(page, (q) => q.cur === "card" && q.curId === "jail", 25000);
  g.check("the LOCKUP card says by the vent", !!s && / by the vent\./.test(s.cause), s && s.cause);
  g.check("no script errors at the vent", errors.length === 0, errors.slice(0, 3));
}

// ---------- ↺ during P3 (the long step with no control) ----------
{
  const { page, errors } = await open("party:P3");
  await until(page, (q) => q.cur === "bub" && q.text.startsWith("Let's give"), 6000);
  await sleep(500);
  await tap(page);
  await until(page, (q) => q.cur === "bub" && q.text.startsWith("Soon"), 6000);
  await page.evaluate(() => window.__ss.sectionReset());
  const s = await until(page, (q) => q.cur === "bub", 6000);
  g.check("↺ during P3 starts the welcome again from its first line, still in the plant", !!s && s.text.startsWith("Let's give") && s.now.scene === "P3" && s.now.pose === "hidden", s);
  g.check("no script errors on ↺ in P3", errors.length === 0, errors.slice(0, 3));
}

// The positions of everyone in P4 (for the hand-off into the free play: nobody jumps).
let p4Cast = null;
// ---------- P3 and P4 ----------
{
  const { page, errors } = await open("party:P3");
  await trailStart(page);
  const lines = [],
    names = [];
  let facing = true,
    waits = 0,
    bubbleOverBanner = false,
    eyesAt = null;
  const banner = hall.BANNER;
  let s = await until(
    page,
    (q) => q.now && q.now.scene === "P4",
    40000,
    async (q) => {
      q.cur === "wait" && !q.quiet && waits++;
      if (q.cur !== "bub") return;
      if (!lines.includes(q.text)) {
        lines.push(q.text);
        await sleep(150);
        names.push([q.text, await bubbleName(page)]);
        const info = await page.evaluate(() => {
          const b = window.SSQ.beat("ch1-party"),
            p = window.__ss.op.ch1PartyNow,
            lb = window.__ss.lastBubble,
            fs = p.isfred;
          // How far each guest's look is from pointing at Isfred's face.
          const off = b
            .cones()
            .filter((c) => !c.id.startsWith("band") && c.id !== "isfred" && c.id !== "bartender")
            .map((c) => {
              let d = Math.atan2(fs.y - 40 - c.oy, fs.x - c.ox) - c.a;
              while (d > Math.PI) d -= 2 * Math.PI;
              while (d < -Math.PI) d += 2 * Math.PI;
              return Math.abs(d);
            });
          return { off, bubble: lb, eyes: b.now().eyes };
        });
        eyesAt = eyesAt || info.eyes;
        if (q.text.startsWith("Let's give") || q.text.startsWith("Soon")) {
          facing = facing && info.off.length === 6 && info.off.every((d) => d < 0.15);
          const b = info.bubble;
          b && b.x < banner.x1 && b.x + b.w > banner.x0 && b.y < banner.y1 && b.y + b.h > banner.y0 && (bubbleOverBanner = true);
          await still(page, "p3-isfred");
        }
        q.text.startsWith("I've never") && (await still(page, "p3-eyes-on-pairs"));
        await sleep(450);
        await tap(page);
      }
    },
  );
  g.check("P3's lines in order", JSON.stringify(lines) === JSON.stringify(["Let's give a big hello to our friends from Bleep-Bloop Robotics!", "Soon their helper robots will be here, to help with the heavy work.", "And now... put your hands together for the Croc Boys!", "Stormtop-vania 1-2-3-4-5!", "I've never gotten to dance at a party."]), lines);
  g.check("everyone in the crowd looks at Isfred during his lines (their cones point at him)", facing);
  g.check("every bubble in P3 has a real name over it (the band's says Croc Boys)", names.length === 5 && names.every(([, nm]) => nm && nm !== "undefined" && nm !== "none") && names[3][1] === "Croc Boys", names);
  g.check("no wordless story wait in P3 (no yellow corner chevron)", waits === 0, waits);
  g.check("Isfred's bubble never covers the banner", !bubbleOverBanner);
  g.check("his eyes are in the middle plant, never at the vent", !!eyesAt && Math.hypot(eyesAt.x - 441, eyesAt.y - 486) < 6, eyesAt);
  g.check("P4 starts with him in the plant, control back, the door the goal", !!s && s.ctrl && s.now.pose === "hidden", s);
  // The pairs: partners stand side by side and look at each other; the two without partners watch the band.
  const pairs = await page.evaluate(() => {
    const b = window.SSQ.beat("ch1-party"),
      p = window.__ss.op.ch1PartyNow,
      cones = b.cones(),
      at = (id) => p.people[id],
      looksAt = (id, to) => {
        const c = cones.find((k) => k.id === id),
          t = at(to);
        let d = Math.atan2(t.y - 28 - c.oy, t.x - c.ox) - c.a;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        return Math.abs(d) < 0.1;
      };
    return [
      ["teal", "stilt"],
      ["robot", "octopus-guest"],
    ].map(([a, c]) => ({ a, c, apart: Math.hypot(at(a).x - at(c).x, at(a).y - at(c).y), face: looksAt(a, c) && looksAt(c, a) }));
  });
  g.check("the guests dance in pairs: partners side by side, looking at each other", pairs.every((q) => q.apart < 90 && q.face), pairs);
  p4Cast = await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow;
    return { people: Object.fromEntries(Object.entries(p.people).map(([k, v]) => [k, [v.x, v.y]])), isfred: [p.isfred.x, p.isfred.y] };
  });
  await walk(page, 470, 600);
  s = await until(page, (q) => q.now && q.now.pose === "stand", 3000);
  g.check("steering steps him out of the plant with a flyer stuck to his back", !!s && s.now.flyer === "back", s && s.now);
  await sleep(300);
  await still(page, "p4-flyer-on-back");
  s = await until(page, (q) => q.now && q.now.scene === "P5", 12000, async (q) => q.ctrl && q.room === "hall" && (await walk(page, 477, 600)));
  g.check("through his door he walks home; the flyer drops on the floor; P5", !!s && s.now.flyer === "floor" && s.room === "closet", s && s.now);
  await still(page, "p5-home-flyer");
  const p3Trail = await trailJumps(page);
  g.check("from P3 to P5 nobody teleports: Squatch never jumps over 60 inside a room", p3Trail.jumps.length === 0, p3Trail.jumps.slice(0, 3));
  g.check("no script errors in P3 and P4", errors.length === 0, errors.slice(0, 3));
}

// ---------- P5 ----------
{
  const { page, errors } = await open("party:P5");
  let s = await st(page);
  g.check("P5: at home, the closet is the goal", s.now && s.now.scene === "P5" && s.room === "closet", s);
  await walk(page, 140, 410);
  s = await until(page, (q) => q.act === "OPEN · closet", 6000);
  g.check("at the closet the button is OPEN · closet, and it is outlined", !!s && (await until(page, (q) => q.ring === "dress", 2000)) !== null, s);
  await press(page);
  await sleep(500);
  const ui = await page.evaluate(() => {
    const c = document.querySelector('canvas[aria-label="dress-up"]'),
      r = c && c.getBoundingClientRect();
    const stick = document.querySelector('[aria-label="Move"]'),
      btn = document.querySelector('[role="button"]');
    return { open: !!c, w: r && r.width, h: r && r.height, stick: stick && stick.style.visibility, btn: btn && btn.style.visibility, d: window.SSQ.beat("ch1-party").dressTargets() };
  });
  g.check("the dress-up fills the whole phone screen, stick and button hidden", ui.open && ui.w >= 375 && ui.h >= 812 && ui.stick === "hidden" && ui.btn === "hidden", ui);
  const drag = async (a, b) => {
    await page.touchscreen.touchStart(a.x, a.y);
    for (let k = 1; k <= 6; k++) (await page.touchscreen.touchMove(a.x + ((b.x - a.x) * k) / 6, a.y + ((b.y - a.y) * k) / 6), await sleep(20));
    await page.touchscreen.touchEnd();
    await sleep(250);
  };
  const d0 = ui.d;
  const boots = d0.pieces.find((p) => p.id === "boots");
  await drag(boots, { x: d0.spots.head.x + 6, y: d0.spots.head.y - 4 });
  let d = await page.evaluate(() => window.SSQ.beat("ch1-party").dressTargets());
  g.check("boots dropped by his head go on his head (the nearest body spot)", d.outfit.head === "boots", d.outfit);
  await still(page, "p5-dress-boots-on-head");
  const hat = d.pieces.find((p) => p.id === "tophat");
  await drag(hat, d.spots.head);
  d = await page.evaluate(() => window.SSQ.beat("ch1-party").dressTargets());
  g.check("a second piece on a taken spot swaps the first back to the closet", d.outfit.head === "tophat" && d.pieces.some((p) => p.id === "boots"), d);
  g.check("the GO · party button waits until the meter is full", !d.go, d.go);
  for (const [id, spot] of [
    ["stache", "face"],
    ["tutu", "body"],
    ["shades", "legs"],
  ]) {
    const piece = d.pieces.find((p) => p.id === id);
    await drag(piece, d.spots[spot]);
    d = await page.evaluate(() => window.SSQ.beat("ch1-party").dressTargets());
  }
  g.check("four covered spots fill the meter and bring GO · party", !!d.go && Object.values(d.outfit).every(Boolean), d);
  await sleep(400);
  g.check("the full outfit's ta-da is not silent (the ta-da plays)", (await page.evaluate(() => window.SSQ.beat("ch1-party").now().sound.played)).includes("tada"));
  await still(page, "p5-dress-full");
  // ↺ in the middle of the dress-up restarts P5 with nothing on: the view's own ↺ (the page's is under it),
  // held with a finger as long as the page's.
  const r = await page.evaluate(() => {
    const at = { x: 10 + 24, y: 10 + 24 },
      el = document.elementFromPoint(at.x, at.y);
    return { ...at, top: el && el.getAttribute("aria-label") };
  });
  g.check("the dress-up's own ↺ is on top in the corner", r.top === "dress-up", r);
  await page.touchscreen.touchStart(r.x, r.y);
  await sleep(1000);
  await page.touchscreen.touchEnd();
  await sleep(500);
  s = await st(page);
  const after = await page.evaluate(() => ({ open: !!document.querySelector('canvas[aria-label="dress-up"]'), outfit: window.__ss.op.ch1PartyNow.outfit }));
  g.check("↺ restarts P5 with nothing on and the dress-up closed", s.now && s.now.scene === "P5" && s.now.phase === "closet" && !after.open && !Object.values(after.outfit).some(Boolean), after);
  // Dress again quickly, then GO · party and out through the door.
  await walk(page, 140, 410);
  await until(page, (q) => q.act === "OPEN · closet", 6000);
  await press(page);
  await sleep(500);
  d = await page.evaluate(() => window.SSQ.beat("ch1-party").dressTargets());
  for (const [id, spot] of [
    ["boots", "head"],
    ["stache", "face"],
    ["shirt", "body"],
    ["shades", "legs"],
  ]) {
    await drag(
      d.pieces.find((p) => p.id === id),
      d.spots[spot],
    );
    d = await page.evaluate(() => window.SSQ.beat("ch1-party").dressTargets());
  }
  await page.touchscreen.tap(d.go.x, d.go.y);
  await sleep(500);
  s = await st(page);
  g.check("GO · party: back in the room in his outfit, control back, the door the goal", s.now && s.now.phase === "out" && s.ctrl && JSON.stringify(s.now.outfit) === JSON.stringify({ head: "boots", face: "stache", body: "shirt", legs: "shades" }), s.now);
  await still(page, "p5-dressed-at-home");
  s = await until(page, (q) => q.now && q.now.scene === "P6", 15000, async (q) => q.ctrl && q.room === "closet" && (await walk(page, 858, 470)));
  g.check("he walks out through his door into the party in disguise (P6)", !!s && s.room === "hall", s && s.now);
  g.check("he keeps the outfit he chose in P6", s && s.now.worn.head === "boots", s && s.now.worn);
  // Nobody jumps on the way in: everyone where P4 left them (Isfred at the bar, the octopus at his dance spot).
  const freeCast = { people: Object.fromEntries(Object.entries(s.now.people).map(([id, q]) => [id, [q.x, q.y]])), isfred: [s.now.isfred.x, s.now.isfred.y] };
  const moved = [];
  for (const [id, [x, y]] of Object.entries(p4Cast.people)) Math.hypot(freeCast.people[id][0] - x, freeCast.people[id][1] - y) > 60 && moved.push([id, [x, y], freeCast.people[id]]);
  Math.hypot(freeCast.isfred[0] - p4Cast.isfred[0], freeCast.isfred[1] - p4Cast.isfred[1]) > 60 && moved.push(["isfred", p4Cast.isfred, freeCast.isfred]);
  g.check("into P6 nobody jumps over 60: everyone stands where P4 left them", moved.length === 0, moved);
  await sleep(500);
  await still(page, "p6-free-play-outfit");
  g.check("no script errors in P5", errors.length === 0, errors.slice(0, 3));
}

// ---------- ↺ in each scene ----------
for (const [scene, room, pose] of [
  ["P1", "closet", "stand"],
  ["P2", "hall", "stand"],
  ["P4", "hall", "hidden"],
]) {
  const { page } = await open("party:" + scene);
  await sleep(600);
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(500);
  const s = await st(page);
  g.check(`↺ in ${scene} restarts ${scene}`, s.now && s.now.scene === scene && s.room === room && s.now.pose === pose && s.ctrl, s);
}

// ---------- the source: no "Cool hat!" anywhere, and the time pin unchanged ----------
const { COOL_HAT_SECONDS } = await import(join(root, "src", "modules", "party-free.js"));
const allGame = ["12-ch1-redesign.js", "14-ch1-day1.js", "15-ch1-scene1.js"].map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
g.check("the game never says \"Cool hat!\" (the old free play is gone)", !allGame.includes('"Cool hat!"'));
g.check("COOL_HAT_SECONDS is still the pinned 180", COOL_HAT_SECONDS === 180);
// The marks' size is measured where they are drawn (P2, "?" over the glancer), not read from the source.
// The capture rule's numbers are Brian's pinned ones (docs/TUNING-PINS.json): a pin change must change both.
const { ALARM } = await import(join(root, "src", "modules", "party-alarm.js"));
const pins = JSON.parse(readFileSync(join(root, "docs", "TUNING-PINS.json"), "utf8")).pins;
const pin = (id) => +(((pins.find((p) => p.id === id) || {}).snippet || "").match(/(?:>=|=|<|:)\s*([\d.]+)/) || [])[1];
g.check(
  "the party's guard speed, reach, feet circle and home delay equal the pinned numbers",
  ALARM.guard === pin("guard-speed") && ALARM.reach === pin("guard-catch") && ALARM.feet === pin("cone-feet") && ALARM.homeDelay === pin("home-search-delay"),
  { ALARM, pins: ["guard-speed", "guard-catch", "cone-feet", "home-search-delay"].map(pin) },
);
await g.finish("party-scenes");
