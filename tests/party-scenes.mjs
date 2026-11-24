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
 *     a second piece swaps, the meter, GO · party, ↺ restarts with nothing on; out through the door into the
 *     older free play with no arrow dance and no "Cool hat!".
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
  await press(page);
  const seen = [];
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
          q.text === "Robots?" && (glowOnRobots = await page.evaluate(() => window.__ss.op.ch1PartyNow.glow === 1));
          q.curId === "focus" && ((teach = q), await still(page, "p1-teach-card"));
          q.text.startsWith("Mmf") && (await still(page, "p1-peek"));
        }
        // One tap per line, after it has been up a moment (a tap too soon is kept for the next line).
        if (tapped !== q.text) ((tapped = q.text), await sleep(450), await tap(page));
      }
    },
  );
  g.check("P1 ends in P2 with control", !!s, s);
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
  s = await until(page, (q) => q.now && q.now.seenBy === "backpack", 3000);
  g.check("in the glancer's cone a \"?\" comes first (seenBy, no alarm yet)", !!s && !s.now.alarm, s && s.now);
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
  s = await until(page, (q) => /They lost you/.test(q.note) || (q.now && q.now.alarm === "calm"), 12000);
  g.check("hidden in the plant, the guards give up: \"They lost you.\"", !!s, s);
  const calm = await until(page, (q) => q.now && q.now.scene === "P3", 15000);
  g.check("the calm is shown (guards walk out, witness walks back), then P3 starts: he made it", !!calm, calm);
  g.check("no script errors in the plant hide", errors.length === 0, errors.slice(0, 3));
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
  s = await until(page, (q) => q.cur === "card" && q.curId === "jail", 25000);
  g.check("the LOCKUP card says by the vent", !!s && / by the vent\./.test(s.cause), s && s.cause);
  g.check("no script errors at the vent", errors.length === 0, errors.slice(0, 3));
}

// ---------- P3 and P4 ----------
{
  const { page, errors } = await open("party:P3");
  const lines = [];
  let facing = true,
    bubbleOverBanner = false,
    eyesAt = null;
  const banner = hall.BANNER;
  let s = await until(
    page,
    (q) => q.now && q.now.scene === "P4",
    40000,
    async (q) => {
      if (q.cur !== "bub") return;
      if (!lines.includes(q.text)) {
        lines.push(q.text);
        const info = await page.evaluate(() => {
          const b = window.SSQ.beat("ch1-party"),
            p = window.__ss.op.ch1PartyNow,
            lb = window.__ss.lastBubble;
          return { mode: p.mode, bubble: lb, eyes: b.now().eyes };
        });
        eyesAt = eyesAt || info.eyes;
        if (q.text.startsWith("Let's give") || q.text.startsWith("Soon")) {
          facing = facing && info.mode === "isfred";
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
  g.check("everyone faces Isfred during his lines", facing);
  g.check("Isfred's bubble never covers the banner", !bubbleOverBanner);
  g.check("his eyes are in the middle plant, never at the vent", !!eyesAt && Math.hypot(eyesAt.x - 441, eyesAt.y - 486) < 6, eyesAt);
  g.check("P4 starts with him in the plant, control back, the door the goal", !!s && s.ctrl && s.now.pose === "hidden", s);
  const pairs = await page.evaluate(() => window.__ss.op.ch1PartyNow.mode);
  g.check("the guests dance in pairs", pairs === "pairs", pairs);
  await walk(page, 470, 600);
  s = await until(page, (q) => q.now && q.now.pose === "stand", 3000);
  g.check("steering steps him out of the plant with a flyer stuck to his back", !!s && s.now.flyer === "back", s && s.now);
  await sleep(300);
  await still(page, "p4-flyer-on-back");
  s = await until(page, (q) => q.now && q.now.scene === "P5", 12000, async (q) => q.ctrl && q.room === "hall" && (await walk(page, 477, 600)));
  g.check("through his door he walks home; the flyer drops on the floor; P5", !!s && s.now.flyer === "floor" && s.room === "closet", s && s.now);
  await still(page, "p5-home-flyer");
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
  s = await until(page, (q) => !q.now && q.party, 15000, async (q) => q.ctrl && q.room === "closet" && (await walk(page, 858, 470)));
  g.check("he walks out through his door into the older free play", !!s && s.room === "hall", s);
  const free = await page.evaluate(() => ({ spots: window.__ss.placedSpots().map((p) => p.verb), outfit: window.SSQ.beat("ch1-party").outfit() }));
  g.check("the free play offers no arrow dance (DANCE · circle is off)", !free.spots.includes("DANCE"), free.spots);
  g.check("he keeps the outfit he chose in the free play", free.outfit && free.outfit.head === "boots", free.outfit);
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

// ---------- the source: no "Cool hat!" in the free play, and the time pin unchanged ----------
const redesign = readFileSync(join(root, "src", "game", "12-ch1-redesign.js"), "utf8");
g.check("the older free play never says \"Cool hat!\"", !redesign.includes('"Cool hat!"'));
g.check("COOL_HAT_SECONDS is still the pinned 180", redesign.includes("COOL_HAT_SECONDS = 180"));
g.check("the warnings' marks are at least as tall as Squatch's head", watch.SEEN_TOO_LONG_SECONDS > 0 && readFileSync(join(root, "src", "modules", "party.js"), "utf8").includes('mark: "?", size: 42'));
// The capture rule's numbers are Brian's pinned ones (docs/TUNING-PINS.json): a pin change must change both.
const { ALARM } = await import(join(root, "src", "modules", "party-alarm.js"));
const pins = JSON.parse(readFileSync(join(root, "docs", "TUNING-PINS.json"), "utf8")).pins;
const pin = (id) => +(((pins.find((p) => p.id === id) || {}).snippet || "").match(/(?:>=|=|<)\s*([\d.]+)/) || [])[1];
g.check(
  "the party's guard speed, reach, feet circle and home delay equal the pinned numbers",
  ALARM.guard === pin("guard-speed") && ALARM.reach === pin("guard-catch") && ALARM.feet === pin("cone-feet") && ALARM.homeDelay === pin("home-search-delay"),
  { ALARM, pins: ["guard-speed", "guard-catch", "cone-feet", "home-search-delay"].map(pin) },
);
await g.finish("party-scenes");
