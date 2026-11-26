/**
 * The party in disguise, P6 (party plan P6; src/modules/party-free.js, party-toys.js, party-snacks.js,
 * party-dance.js, party-outfit.js), checked at phone size:
 *   - walking in from the dress-up, nobody jumps (Squatch or the cast, 60 at most from one frame to the next),
 *     Isfred stays at the bar, the camera and the octopus where P4 left them, the lights stay down;
 *   - no goal chip and no outline in free play; the guests mill (they move between places, and nobody jumps);
 *   - three songs with a light colour each (the group photo between the first and the second), closing time after the
 *     third (P8b), early closing after the dance and two other toys; the songs last COOL_HAT_SECONDS (180) in all;
 *   - in a whole disguise a cone shows "?" only and nobody ever looks twice, however long he stands there; with fur
 *     showing, "?" then "!" as in P2;
 *   - nothing tips (Brian 2026-11-24, "Lose it all"): no crooked piece, no warning sign over him, no straightening;
 *     the plants and the vent do nothing to a disguise; a piece comes off only when the pyramid crashes and on the
 *     octopus's second hug, and it flies (it is seen landing, never just gone); with nothing left on, the vent's fur
 *     rule is back;
 *   - the dance: DANCE · circle in the spotlight opens the whole screen with the stick and button hidden and its
 *     own ↺; every tap is a move and the crowd cheers louder; it ends with the song; the guests clap;
 *   - the snacks: GRAB · snacks on the action button at the
 *     bar opens the close-up, each tapped snack is stars, pulling a snack two others stand on topples the pyramid
 *     (the rule and the close-up are checked in tests/party-snack-stack.mjs and tests/party-snacks.mjs), the flying cup knocks a piece off and
 *     everyone stares for 4 seconds; the bartender's two catches; the octopus only after the first minute, his
 *     lines, the first hug is just a hug and the second knocks a piece off; the hallway doorway (not a toy: it does not
 *     count toward early closing): he is bounced back and thinks "I can't go there. Mops will see me." (no beard;
 *     tests/party-round3.mjs measures the bounce);
 *   - the conga: it forms, its route passes the vent once, walking into its tail joins it and tows him, steering
 *     leaves it; ↺ restarts P6 just inside his door with the same outfit and song; sounds named in the plan play.
 * Stills at 375 x 812 go to tests/out/party-stills/ (p6-*.png).
 *   node tests/party-free.mjs
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const OUT = join(root, "tests", "out", "party-stills");
mkdirSync(OUT, { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const g = await startGame({ port: 9101, name: "party-free" });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const free = await import(join(root, "src", "modules", "party-free.js"));
const toys = await import(join(root, "src", "modules", "party-toys.js"));
const vent = await import(join(root, "src", "modules", "party-vent.js"));
const snacks = await import(join(root, "src", "modules", "party-snacks.js"));

async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1400);
  return o;
}
const st = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur;
    return {
      now: window.SSQ.beat("ch1-party").now(),
      room: n.room,
      ctrl: !!n.ctrl,
      cur: c ? c.k : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      cause: c && c.id === "jail" ? c.cause : "",
      x: Math.round(n.sq.x),
      y: Math.round(n.sq.y),
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      chip: window.__ss.chipNow(),
      ring: n.lastRing && n.T - n.lastRing.T < 0.3 ? n.lastRing.id : "",
      stars: n.stars || 0,
      full: !!document.querySelector('canvas[aria-label="dance"]'),
    };
  });
// Writes into the party's state (the test sets the clock or a place, never the result it checks).
const set = (page, f, arg) => page.evaluate(`(${f})(window.__ss.op.ch1PartyNow, window.__ss.op, ${JSON.stringify(arg || null)})`);
const place = (page, x, y) => page.evaluate((p) => ((window.__ss.op.sq.x = p[0]), (window.__ss.op.sq.y = p[1])), [x, y]);
const walk = (page, x, y) => page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [x, y]);
const press = (page) => page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
const next = (page) => page.evaluate(() => window.__ss.opTap());
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
const bubbleName = (page) => page.evaluate(() => (window.__ss.lastBubble ? String(window.__ss.lastBubble.name) : "none"));
const played = (page) => page.evaluate(() => window.SSQ.beat("ch1-party").now().sound.played);
// Everyone's place every 50 ms: Squatch, the guests, Isfred. A step over 60 inside one room is a jump.
const watchStart = (page) =>
  page.evaluate(() => {
    window.__w = [];
    window.__wT = setInterval(() => {
      const n = window.__ss.op,
        p = n.ch1PartyNow;
      if (!p) return;
      const pts = { sq: [n.sq.x, n.sq.y], isfred: [p.isfred.x, p.isfred.y] };
      for (const [id, q] of Object.entries(p.people || {})) pts[id] = [q.x, q.y];
      window.__w.push({ room: n.room, pts });
    }, 50);
  });
const watchJumps = (page) =>
  page.evaluate(() => {
    clearInterval(window.__wT);
    const w = window.__w,
      out = [];
    for (let i = 1; i < w.length; i++)
      if (w[i].room === w[i - 1].room)
        for (const id of Object.keys(w[i].pts)) {
          const a = w[i - 1].pts[id],
            b = w[i].pts[id];
          a && b && Math.hypot(a[0] - b[0], a[1] - b[1]) > 60 && out.push([id, a.map(Math.round), b.map(Math.round)]);
        }
    return { samples: w.length, jumps: out.slice(0, 6) };
  });

// ---------- the numbers ----------
g.check("the songs last COOL_HAT_SECONDS in all, and the pin is 180", free.COOL_HAT_SECONDS === 180 && free.SONG_SECONDS * 3 === 180, free.SONG_SECONDS);
{
  // the conga's loop passes near the vent once (one stretch of the route within the vent's reach)
  let inside = 0,
    was = false;
  for (let d = 0; d < 2000; d += 4) {
    const at = toys.congaAt(d),
      near = vent.ventDistance(at) <= vent.VENT.near;
    near && !was && inside++;
    was = near;
    if (d > 0 && Math.hypot(at.x - hall.CONGA_ROUTE[0].x, at.y - hall.CONGA_ROUTE[0].y) < 2 && d > 100) break;
  }
  g.check("the conga's route passes near the vent once a loop", inside === 1, inside);
}

// ---------- walking in from the dress-up ----------
{
  const { page, errors } = await open("party:P5");
  await set(page, (p) => {
    p.outfit = { head: "boots", face: "shades", body: "tutu", legs: "scarf" };
    p.phase = "out";
  });
  await place(page, 800, 470);
  const before = await page.evaluate(() => {
    const P = window.__ss.op.ch1PartyNow;
    return P.outfit;
  });
  await watchStart(page);
  await walk(page, 870, 470);
  let s = await until(page, (q) => q.now && q.now.scene === "P6" && q.ctrl, 15000);
  g.check("out through his door in his outfit, P6 begins in the hall with control", !!s && s.room === "hall", s && s.now && s.now.scene);
  await sleep(2500);
  const j = await watchJumps(page);
  g.check("walking in, nobody jumps (Squatch, Isfred, every guest)", j.samples > 30 && j.jumps.length === 0, j);
  s = await st(page);
  g.check("Isfred is still at the bar's top end, where he walked in P3", Math.hypot(s.now.isfred.x - hall.CAST.isfredBar.x, s.now.isfred.y - hall.CAST.isfredBar.y) < 2, s.now.isfred);
  g.check("he wears the outfit he chose, whole", JSON.stringify(s.now.worn) === JSON.stringify(before) && !s.now.fur, s.now.worn);
  await still(page, "p6-walk-in");
  // no goal chip and no outline in free play
  let chips = 0,
    rings = 0;
  for (let i = 0; i < 20; i++) {
    const q = await st(page);
    q.chip && chips++;
    q.ring && rings++;
    await sleep(200);
  }
  g.check("free play shows no goal chip and no outline", chips === 0 && rings === 0, { chips, rings });
  // the guests mill: they move, and nobody jumps
  const a = (await st(page)).now.people;
  await watchStart(page);
  await sleep(6000);
  const b = (await st(page)).now.people,
    moved = Object.keys(a).filter((id) => Math.hypot(a[id].x - b[id].x, a[id].y - b[id].y) > 20);
  const j2 = await watchJumps(page);
  g.check("the guests mill (at least three move somewhere new)", moved.length >= 3, moved);
  g.check("milling, nobody jumps", j2.jumps.length === 0, j2);
  g.check("the band plays song 1 (the sound and the light)", s.now.song === 0 && (await played(page)).includes("song0"), s.now.song);
  g.check("no errors walking in", errors.length === 0, errors);
  await page.close();
}

// ---------- songs, closing, early closing ----------
{
  const { page } = await open("party:P6");
  await place(page, 150, 560);
  await set(page, (p, n, a) => (p.songT = a - 0.3), free.SONG_SECONDS);
  // the first song's end is the group photo moment (tests/party-round4.mjs); the next song starts when everyone is back
  let s = await until(page, (q) => q.now.shot && q.now.shot.phase === "settle", 3000);
  g.check("after the first song's time: the group photo moment (the hall settles first), the band quiet", !!s && s.now.song === 0 && s.now.sound.song === -1, s && [s.now.shot, s.now.song]);
  await page.evaluate(() => { for (let i = 0; i < 800 && window.__ss.op.ch1PartyNow.shot.phase !== "done"; i++) window.__ss.tick(0.05); });
  s = await until(page, (q) => q.now.song === 1, 3000);
  g.check("when everyone is back the band plays the next song (song 2)", !!s, s && s.now.song);
  g.check("song 2 sounds", (await played(page)).includes("song1"));
  await still(page, "p6-song-2-light");
  await set(page, (p, n, a) => ((p.song = 2), (p.songT = a - 0.3)), free.SONG_SECONDS);
  await watchStart(page);
  s = await until(page, (q) => q.now && q.now.scene === "P8b", 4000);
  await sleep(600);
  const jc = await watchJumps(page);
  g.check("into closing time nobody jumps (the guests stay where they milled)", jc.jumps.length === 0, jc);
  g.check("after the third song: closing time (P8b), the speaker's line", !!s && /party's over/.test(s.text), s && [s.now && s.now.scene, s.text]);
  await page.close();
}
{
  const { page } = await open("party:P6");
  await place(page, 150, 560);
  await set(page, (p) => ((p.done.photo = true), (p.done.conga = true)));
  await sleep(500);
  let s = await st(page);
  g.check("two toys but no dance: no early closing", s.now.song === 0 && !s.now.early, s.now);
  await set(page, (p) => (p.done.dance = true));
  await sleep(600);
  s = await st(page);
  g.check("danced and two other toys before the group photo's moment: closing waits for the photo", s.now.song === 0 && !s.now.early, [s.now.song, s.now.early]);
  // the photo moment is over (the second song is playing)
  await set(page, (p) => ((p.shot = { phase: "done" }), (p.song = 1), (p.songT = 5)));
  s = await until(page, (q) => q.now.early, 2000);
  g.check("danced and two other toys: the band goes straight to its last song", !!s && s.now.song === 2, s && s.now);
  await page.close();
}
{
  // Trying the hallway doorway is not a toy (Brian 2026-11-24): the dance, one toy and a push back at the doorway do
  // not bring closing time early.
  const { page } = await open("party:P6");
  await set(page, (p) => ((p.done.dance = true), (p.done.photo = true), (p.shot = { phase: "done" }), (p.song = 1), (p.songT = 5)));
  await place(page, 830, 322);
  await walk(page, 940, 320);
  let s = await until(page, (q) => q.cur === "bub", 6000);
  await next(page);
  s = await until(page, (q) => q.ctrl && !q.cur, 4000);
  await sleep(600);
  s = await st(page);
  g.check("pushed back at the hallway doorway (it happened)", s.now.bounced === 1, s.now.bounced);
  g.check("the dance, one toy and the hallway doorway: no early closing (the doorway is not a toy)", s.now.song === 1 && !s.now.early && !("hallway" in s.now.done), [s.now.song, s.now.early, s.now.done]);
  await page.close();
}

// ---------- sight in disguise ----------
// Runs the game `secs` seconds at once with its own update (the frame loop keeps drawing meanwhile).
const run = (page, secs) => page.evaluate((n) => { for (let i = 0; i < n; i++) window.__ss.tick(0.05); }, Math.round(secs / 0.05));
// Squatch's box and the box of the bubble or the label on screen now (game positions), for "nothing over Squatch".
const overSquatch = (page) =>
  page.evaluate(() => {
    const n = window.__ss.op,
      k = window.SSQ.engine().hallSizes().squatch,
      sq = { x0: n.sq.x - 19 * k, x1: n.sq.x + 19 * k, y0: n.sq.y - 50 * k, y1: n.sq.y + 2 },
      hit = (b) => !!b && b.x0 < sq.x1 && b.x1 > sq.x0 && b.y0 < sq.y1 && b.y1 > sq.y0,
      bub = window.__ss.lastBubble,
      bb = bub ? { x0: bub.x, x1: bub.x + bub.w, y0: bub.y - 24, y1: bub.y + (bub.h || 60) } : null,
      cap = n.lastCap && n.T - (n.lastCapT || n.T) < 0.3 ? n.lastCap.box : n.lastCap ? n.lastCap.box : null;
    return { bubble: hit(bb), label: hit(cap), bubbleText: bub ? bub.text : "", label_: n.lastCap ? n.lastCap.text : "" };
  });
{
  // In full disguise, standing still in the dance spotlight, in front of everyone: never caught (the plan, P6:
  // "In disguise, guests are fooled"), in his first minute and after it.
  const { page } = await open("party:P6");
  await place(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 6);
  // meanwhile the guests mill past him: nobody comes into him or right in front of him (where a taller guest would
  // cover him), walking or waiting, measured every tick after he arrives
  const near = await page.evaluate((n) => {
    const op = window.__ss.op,
      p = op.ch1PartyNow;
    let min = 999,
      who = null;
    for (let i = 0; i < n; i++) {
      window.__ss.tick(0.05);
      if (i < 40) continue;
      for (const [id, g] of Object.entries(p.people)) {
        const dy = g.y - op.sq.y,
          d = Math.hypot(g.x - op.sq.x, dy > 0 ? dy * 0.6 : dy);
        d < min && ((min = d), (who = [id, Math.round(g.x), Math.round(g.y)]));
      }
    }
    return { min: Math.round(min), who };
  }, Math.round(40 / 0.05));
  g.check("guests milling past never walk into him or right in front of him", near.min >= free.FREE.clearOf * 0.9, near);
  await run(page, 20);
  let s = await st(page);
  g.check("full disguise, standing still 60 s in the spotlight in his first minute: never caught", s.now.scene === "P6" && !s.now.alarm && s.now.gone.length === 0, [s.now.scene, s.now.alarm]);
  await set(page, (p) => ((p.ft = 61), (p.songT = 0), (p.song = 0)));
  await place(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 6);
  await run(page, 55);
  s = await st(page);
  g.check("and 55 s more after his first minute: never caught", s.now.scene === "P6" && !s.now.alarm, [s.now.scene, s.now.alarm]);
  await page.close();
}
{
  // He stands on a spot the guests mill to (by the bar's top end): whoever heads there goes round him or waits a
  // moment and heads somewhere else; nobody freezes, and nobody stands in him.
  const { page } = await open("party:P6");
  const spot = hall.MILL.find((m) => m.id === "bar-top");
  await place(page, spot.x, spot.y);
  const r = await page.evaluate((n) => {
    const op = window.__ss.op,
      p = op.ch1PartyNow,
      leads = ["teal", "robot", "backpack"],
      was = {},
      walked = { teal: 0, robot: 0, backpack: 0 };
    let min = 999,
      who = null,
      block = 0;
    for (let i = 0; i < n; i++) {
      window.__ss.tick(0.05);
      // how long a group waits on him (not counting the conga, which takes the dancers)
      for (const id of leads) {
        const q = p.people[id];
        q.task || (block = Math.max(block, q.blockT || 0));
        was[id] && (walked[id] += Math.hypot(q.x - was[id][0], q.y - was[id][1]));
        was[id] = [q.x, q.y];
      }
      if (i < 40) continue;
      for (const [id, g] of Object.entries(p.people)) {
        const dy = g.y - op.sq.y,
          d = Math.hypot(g.x - op.sq.x, dy > 0 ? dy * 0.6 : dy);
        d < min && ((min = d), (who = [id, Math.round(g.x), Math.round(g.y)]));
      }
    }
    return { min: Math.round(min), who, block: Math.round(block * 10) / 10, walked: Object.values(walked).map(Math.round) };
  }, Math.round(50 / 0.05));
  g.check("standing on a milling spot: no group waits on him longer than a moment, and every group keeps moving", r.block <= free.FREE.giveWay + 0.1 && r.walked.every((d) => d > 150), r);
  g.check("and nobody stands in him or right in front of him", r.min >= free.FREE.clearOf * 0.9, r);
  await page.close();
}
{
  const { page } = await open("party:P6");
  // stand in front of the bartender (she does not move): her cone holds him
  await place(page, 770, 455);
  await sleep(2000);
  const s = await st(page);
  g.check("in disguise, a look shows only \"?\" (no alarm)", s.now.seenBy === "bartender" && !s.now.alarm, [s.now.seenBy, s.now.alarm]);
  await still(page, "p6-disguise-question");
  await page.close();
}
// Nothing tips and nobody looks twice (Brian 2026-11-24, "Lose it all"). Counts the red-ringed warning discs drawn
// (party-art.js drawWarning strokes its ring in #e5533d) over `ms`.
const warningDiscs = (page, ms) =>
  page.evaluate(async (ms) => {
    const stroke = CanvasRenderingContext2D.prototype.stroke;
    let n = 0;
    CanvasRenderingContext2D.prototype.stroke = function (...a) {
      String(this.strokeStyle).toLowerCase() === "#e5533d" && this.lineWidth >= 2 && n++;
      return stroke.apply(this, a);
    };
    await new Promise((ok) => setTimeout(ok, ms));
    CanvasRenderingContext2D.prototype.stroke = stroke;
    return n;
  }, ms);
{
  // In front of the bartender for 12 s after his first minute, whole disguise: "?" over her the whole time and no
  // second look of any kind (she never turns to him, no bigger "?", no alarm).
  const { page } = await open("party:P6");
  await set(page, (p) => (p.ft = 61));
  await place(page, 770, 455);
  const marks = await page.evaluate(async () => {
    const fill = CanvasRenderingContext2D.prototype.fillText,
      sizes = new Set();
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) {
      (t === "?" || t === "!") && sizes.add(t + Math.round((parseFloat((String(this.font).match(/(\d+(\.\d+)?)px/) || [0, 0])[1]) * this.getTransform().a * 960) / this.canvas.width));
      return fill.call(this, t, ...r);
    };
    for (let i = 0; i < 240; i++) window.__ss.tick(0.05);
    await new Promise((ok) => setTimeout(ok, 400));
    CanvasRenderingContext2D.prototype.fillText = fill;
    return [...sizes];
  });
  const s = await st(page);
  g.check("a whole disguise in someone's sight for 12 s after the first minute: only the one \"?\" is ever drawn (no bigger second look, no \"!\")", marks.length === 1 && marks[0][0] === "?" && s.now.seenBy === "bartender" && !s.now.alarm && s.now.scene === "P6", marks);
  g.check("the party's state has no crooked piece and no curious guest any more", !("tip" in s.now) && !("curious" in s.now), Object.keys(s.now));
  await page.close();
}
{
  const { page } = await open("party:P6");
  await set(page, (p) => (p.lostPieces = ["head"]));
  await place(page, 770, 455);
  const t0 = Date.now();
  const s = await until(page, (q) => q.now && q.now.alarm, 4000);
  g.check("with fur showing, \"?\" then the alarm in under 2 seconds (as in P2)", !!s && Date.now() - t0 < 2000, s && s.now.alarm);
  await page.close();
}

// ---------- pieces: the plants and the vent do nothing to a disguise ----------
{
  const { page } = await open("party:P6");
  const pl = hall.HALL.plants.find((q) => q.id === "middle");
  await set(page, (p) => (p.ft = 61));
  const before = (await played(page)).length;
  const brush = async () => {
    await place(page, 560, 600);
    await sleep(300);
    await place(page, pl.leaves.x1 + 6, pl.leaves.y1 + 10);
    await sleep(400);
  };
  const discs = warningDiscs(page, 2400);
  await brush();
  await brush();
  await brush();
  let s = await st(page);
  const heard = (await played(page)).slice(before).filter((x) => ["rip", "fwip", "pieceOff", "whoosh"].includes(x));
  g.check("after his first minute, brushing past a plant three times: nothing comes off, nothing flies, he does not shake", s.now.gone.length === 0 && s.now.flying === 0 && !s.now.fur && (await page.evaluate(() => !window.__ss.op.ch1PartyNow.shake)), [s.now.gone, s.now.flying]);
  g.check("and no warning sign is drawn over him, and no snag sound plays", (await discs) === 0 && heard.length === 0, [await discs, heard]);
  await still(page, "p6-plant-nothing");
  // with fur showing (a piece gone in a big moment), the plants hide him again
  await set(page, (p) => (p.lostPieces = ["head"]));
  await place(page, hall.SPOTS.plantMiddle.x, hall.SPOTS.plantMiddle.y);
  g.check("with fur showing, the plants hide him again (HIDE · plant)", (await until(page, (q) => q.act === "HIDE · plant", 3000)) !== null);
  await page.close();
}
{
  const { page } = await open("party:P6");
  await set(page, (p) => (p.ft = 61));
  const before = (await played(page)).length;
  await place(page, hall.HALL.vent.x + 30, hall.HALL.vent.y + 10);
  // (Brian 2026-11-25, showing-5 note 3, and R108: in disguise the vent sucks in his costume, a piece at a time)
  let s = await until(page, (q) => q.now.gone.length >= 1, 4000);
  const heard = (await played(page)).slice(before).filter((x) => ["fwip", "pieceOff", "whoosh"].includes(x));
  g.check("after his first minute, staying at the vent in a whole disguise: it sucks his hat in (the warning, then the piece flies into the grille), and no alarm", !!s && s.now.gone[0] === "head" && !s.now.alarm && heard.includes("whoosh") && heard.includes("pieceOff"), s && [s.now.gone, s.now.alarm, heard]);
  await sleep(250);
  await still(page, "p6-vent-costume");
  // stepping away, it takes nothing more
  await place(page, 480, 470);
  await sleep(2500);
  s = await st(page);
  g.check("stepping away from the vent, it takes nothing more", s.now.gone.length === 1, s.now.gone);
  await set(page, (p) => ((p.lostPieces = ["head", "face", "body", "legs"]), (p.seenBy = ""), (p.seenT = 0)));
  await place(page, hall.HALL.vent.x + 30, hall.HALL.vent.y + 10);
  s = await until(page, (q) => q.now && q.now.alarm, 6000);
  const where = s && (await page.evaluate(() => window.__ss.op.ch1PartyNow.alarm.where));
  g.check("with nothing left on, the vent's fur rule is back: fur goes in and the alarm starts", !!s, s && [s.now.alarm, where]);
  await page.close();
}

// ---------- the dance ----------
{
  const { page, errors } = await open("party:P6");
  const stars0 = (await st(page)).stars;
  await walk(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  let s = await until(page, (q) => q.act === "DANCE · circle", 8000);
  g.check("in the spotlight the button is DANCE · circle", !!s, s && s.act);
  await sleep(300);
  const lab = await overSquatch(page);
  g.check("the DANCE · circle label sits clear of Squatch", lab.label_ === "DANCE · circle" && !lab.label, lab);
  await press(page);
  s = await until(page, (q) => q.full, 3000);
  g.check("the dance fills the screen", !!s);
  const hidden = await page.evaluate(() => [document.querySelector('[aria-label="Move"]'), document.querySelector('[role="button"]')].filter(Boolean).every((el) => getComputedStyle(el).visibility === "hidden"));
  g.check("the stick and the action button are hidden during the dance", hidden);
  const top = await page.evaluate(() => (document.elementFromPoint(34, 34) || {}).getAttribute && document.elementFromPoint(34, 34).getAttribute("aria-label"));
  g.check("the dance keeps its own ↺ (the top-left corner is the dance view)", top === "dance", top);
  const c0 = (await st(page)).now.dance.cheer;
  // Brian 2026-11-24: he touches the glowing spots (before: every tap anywhere was a move); the dance itself is
  // checked in tests/party-dance.mjs.
  for (let i = 0; i < 6; i++) {
    await page.waitForFunction(() => ((d) => d && d.live && d.seen && d.seen.glow)(window.__ss.op.ch1PartyNow.dance), { timeout: 6000 });
    const at = await page.evaluate(() => window.__ss.op.ch1PartyNow.dance.seen.glow);
    await page.touchscreen.tap(at.x, at.y);
    await sleep(60);
  }
  s = await st(page);
  g.check("every glowing spot he taps is a move, and the crowd cheers louder", s.now.dance.moves === 6 && s.now.dance.cheer > c0, s.now.dance);
  g.check("each move sounds (robot) and the crowd cheers", (await played(page)).filter((x) => x === "robot").length === 6 && (await played(page)).includes("cheer"));
  await still(page, "p6-dance-full-screen");
  await set(page, (p, n, a) => ((p.songT = a - 0.2), (p.dance.t = 20)), free.SONG_SECONDS);
  s = await until(page, (q) => !q.full && q.ctrl, 4000);
  g.check("the dance ends with the song; back in the hall the guests clap", !!s && s.now.done.dance && (await page.evaluate(() => window.__ss.op.ch1PartyNow.clap > 0)), s && s.now.done);
  await still(page, "p6-after-dance-clap");
  // Brian 2026-11-24: "can we have it that you can get a certain number of points for doing macarena correctly?"
  // (before: the dance gave no points). Five stars for each spot tapped in time; six were.
  g.check("the dance's stars: 5 for each spot he tapped in time", s && s.stars === stars0 + 6 * 5, s && s.stars - stars0);
  g.check("no errors in the dance", errors.length === 0, errors);
  await page.close();
}

// (The photo is the group photo now, one moment after the first song: tests/party-round4.mjs.)

// ---------- the snacks ----------
{
  const { page } = await open("party:P6");
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  // Away from the bar nothing offers the snacks; at the bar the action button alone does (GRAB · snacks): no ring
  // and no little picture over the pyramid (Brian 2026-11-24).
  await place(page, 600, 560);
  await sleep(400);
  let s = await st(page);
  g.check("away from the bar, no snack action is offered", s.act !== "GRAB · snacks", s.act);
  await walk(page, L.spot.x - 20, L.spot.y + 20);
  s = await until(page, (q) => q.act === "GRAB · snacks", 8000);
  g.check("walking up to the bar, the action button reads GRAB · snacks", !!s, s && s.act);
  await sleep(300);
  const ringsAtBar = await page.evaluate(async () => {
    // counts round rings stroked in white or near-white (the old paw icon was a white disc with a picture in it)
    const arc = CanvasRenderingContext2D.prototype.arc,
      ell = CanvasRenderingContext2D.prototype.ellipse;
    let n = 0;
    const near = (ctx, x, y) => { const m = ctx.getTransform(), k = ctx.canvas.width / 960, gx = (m.a * x + m.e) / k, gy = (m.d * y + m.f) / k; return gx > 820 && gx < 920 && gy > 470 && gy < 540; };
    CanvasRenderingContext2D.prototype.arc = function (x, y, r, ...a) { r > 20 && near(this, x, y) && n++; return arc.call(this, x, y, r, ...a); };
    CanvasRenderingContext2D.prototype.ellipse = function (x, y, rx, ...a) { rx > 20 && near(this, x, y) && n++; return ell.call(this, x, y, rx, ...a); };
    await new Promise((ok) => setTimeout(ok, 300));
    CanvasRenderingContext2D.prototype.arc = arc;
    CanvasRenderingContext2D.prototype.ellipse = ell;
    return n;
  });
  g.check("no ring or disc is drawn over the pyramid any more", ringsAtBar === 0 && !("paw" in s.now), ringsAtBar);
  const lab = await overSquatch(page);
  g.check("the GRAB · snacks label sits clear of Squatch", lab.label_ === "GRAB · snacks" && !lab.label, lab);
  await still(page, "p6-grab-snacks");
  await press(page);
  s = await until(page, (q) => q.now.snack, 6000);
  g.check("pressing it steps him to the bar and opens the close-up", !!s);
  await sleep(600);
  await still(page, "p6-snack-close-up");
  await set(page, (p) => (p.ft = 61));
  const stars0 = (await st(page)).stars;
  // Brian 2026-11-24: a tap takes a snack (no dragging), and the pile falls by what he takes, not after five.
  // He taps while her back is turned, with time to spare.
  const tapSnack = async (i) => {
    await page.waitForFunction(() => ((c) => c && c.phase === "back" && c.t > 0.4 && c.t < 2.5 && !c.reach)(window.__ss.op.ch1PartyNow.snack), { timeout: 15000 });
    const [, x, y] = L.cut.snacks[i];
    await page.evaluate((a) => window.__ss.ch1Pointer("down", a[0], a[1]), [x, y]);
  };
  await tapSnack(0); // the cake on top: nothing is on it
  s = await until(page, (q) => q.now.snacks.bag === 1, 3000);
  g.check("a tapped snack goes in the bag and is stars", !!s && s.stars === stars0 + snacks.SNACK_STARS && !s.now.snacks.toppled, s && [s.now.snacks, s.stars - stars0]);
  s = await until(page, (q) => q.cur === "bub", 2000);
  g.check("after his first snack: \"Got one!\"", !!s && s.text === "Got one!", s && s.text);
  await sleep(500);
  await next(page);
  await until(page, (q) => q.cur !== "bub", 3000);
  await tapSnack(7); // a middle cup of the counter row: two pies stand on it
  s = await until(page, (q) => q.now.snacks.toppled && !q.now.snack, 4000);
  g.check("pulling a snack two others stand on topples the pyramid and the zoom pulls back, with no stars for it", !!s && s.stars === stars0 + snacks.SNACK_STARS, s && [s.now.snacks, s.stars - stars0]);
  await sleep(500);
  await still(page, "p6-pyramid-topples");
  // (if another guest's line comes up meanwhile, the octopus's hiccup for one, he taps it away as a kid would)
  const lines = [];
  s = await until(page, (q) => q.now.gone.length === 1, 6000, async (q) => q.cur === "bub" && (lines.push(q.text), await sleep(350), await next(page)));
  g.check("the flying cup knocks a piece off (after the first minute)", !!s, s ? s.now.gone : lines);
  g.check("everyone turns to stare for 4 seconds", !!s && s.now.stare > 2 && s.now.stare <= 4, s && s.now.stare);
  // measured: every guest's cone points at where he stood
  const aims = await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow,
      at = p.stare && p.stare.at;
    return window.SSQ.beat("ch1-party").cones().filter((c) => p.people[c.id]).map((c) => {
      const want = Math.atan2(at.y - c.oy, at.x - c.ox);
      return Math.abs(Math.atan2(Math.sin(c.a - want), Math.cos(c.a - want)));
    });
  });
  g.check("their cones all point at where he stood", aims.length >= 6 && aims.every((d) => d < 0.05), aims);
  await still(page, "p6-stare");
  await page.close();
}
{
  const { page } = await open("party:P6");
  await place(page, 770, 540);
  await set(page, (p) => ((p.snacks = p.snacks || { bag: 0, taken: [], toppled: false, chain: -1 }), window.__ss.op.ctrl = false));
  await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow;
    p.snack = { zoom: 1, paw: { x: 480, y: 560 }, held: -1, phase: "back", t: 0, back: 0, catches: 0 };
  });
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  // Brian 2026-11-24: a tap takes a snack, so the catch is his paw out while she faces him (before, the test held
  // a snack until she turned round).
  const holdUntilCaught = async () => {
    await page.waitForFunction(() => ((c) => c && c.phase === "face")(window.__ss.op.ch1PartyNow.snack), { timeout: 15000 });
    const [, x, y] = L.cut.snacks[0];
    await page.evaluate((a) => window.__ss.ch1Pointer("down", a[0], a[1]), [x, y]);
    return until(page, (q) => q.cur === "bub", 12000);
  };
  let s = await holdUntilCaught();
  g.check("his paw out while she faces him: \"...Nice gloves.\"", !!s && s.text === "...Nice gloves.", s && s.text);
  await next(page);
  await until(page, (q) => q.cur !== "bub", 3000);
  s = await holdUntilCaught();
  g.check("the second time: \"Wait a second... fur!\"", !!s && s.text === "Wait a second... fur!", s && s.text);
  await sleep(200);
  g.check("over the bartender's bubble, a name (\"The bartender\"), never blank", (await bubbleName(page)) === "The bartender", await bubbleName(page));
  await next(page);
  s = await until(page, (q) => q.now && q.now.alarm, 3000);
  g.check("then she runs to the alarm (P7)", !!s && s.now.scene === "P7" && !s.now.snack, s && s.now);
  await page.close();
}

// ---------- the octopus ----------
// Counts the octopus's drawn arms (party-octopus-art.js strokes each in the picture's pink) over a few frames.
const armStrokes = (page) =>
  page.evaluate(async () => {
    const stroke = CanvasRenderingContext2D.prototype.stroke;
    let n = 0,
      frames = 0;
    CanvasRenderingContext2D.prototype.stroke = function (...a) {
      String(this.strokeStyle).toLowerCase() === "#dc7896" && n++;
      return stroke.apply(this, a);
    };
    await new Promise((ok) => {
      const f = () => (++frames >= 6 ? ok() : requestAnimationFrame(f));
      requestAnimationFrame(f);
    });
    CanvasRenderingContext2D.prototype.stroke = stroke;
    return Math.round(n / frames);
  });
// Runs the game `secs` seconds; whenever the octopus comes within 110 of Squatch, Squatch is put in the far corner
// (a kid running away). Returns what the octopus did, sampled every tick.
const runAway = (page, secs, stopAt) =>
  page.evaluate(
    (n, stopAt) => {
      const op = window.__ss.op,
        p = op.ch1PartyNow,
        g = p.people["octopus-guest"],
        corners = [[170, 560], [650, 340], [640, 590], [200, 330]],
        out = { modes: [], maxStep: 0, boredAt: -1, armsAtBored: -1, hugs: p.oct.hugs };
      let was = [g.x, g.y];
      for (let i = 0; i < n; i++) {
        if (Math.hypot(g.x - op.sq.x, g.y - op.sq.y) < 110) {
          const far = corners.slice().sort((a, b) => Math.hypot(b[0] - g.x, b[1] - g.y) - Math.hypot(a[0] - g.x, a[1] - g.y))[0];
          ((op.sq.x = far[0]), (op.sq.y = far[1]));
        }
        window.__ss.tick(0.05);
        const o = p.oct;
        out.modes[out.modes.length - 1] !== o.mode && out.modes.push(o.mode);
        o.mode === "bored" && out.boredAt < 0 && ((out.boredAt = Math.round(o.t * 100) / 100), (out.armsAtBored = o.arms));
        out.maxStep = Math.max(out.maxStep, Math.hypot(g.x - was[0], g.y - was[1]));
        was = [g.x, g.y];
        if (stopAt && o.mode === stopAt) break;
      }
      return { ...out, hugs: p.oct.hugs, at: [Math.round(g.x), Math.round(g.y)], arms: p.oct.arms, mode: p.oct.mode };
    },
    Math.round(secs / 0.05),
    stopAt || "",
  );
{
  const octo = await import(join(root, "src", "modules", "party-octopus.js"));
  const art = await import(join(root, "src", "modules", "party-octopus-art.js"));
  g.check("the octopus chases for 20 seconds (Brian's yes changed the pinned 10), at his pinned speed (170 since Brian's written yes of 2026-11-25; Squatch walks at 190)", octo.OCT_CHASE_SECONDS === 20 && octo.OCT_SPEED === 170, [octo.OCT_CHASE_SECONDS, octo.OCT_SPEED]);
  {
    // his arms thrown out: the outer two point up and out, far wider than hanging down, and the middle two stay under him
    const hang = [0, 5].map((i) => art.armAt(i, 500, 500, 100, 0, 0)),
      out = [0, 1, 2, 3, 4, 5].map((i) => art.armAt(i, 500, 500, 100, 1, 0));
    g.check(
      "arms out: the outer arms' tips are above where they join him and more than a grown-up's height apart; hanging they are under him",
      out[0].y1 < out[0].y0 && out[5].y1 < out[5].y0 && out[5].x1 - out[0].x1 > 80 && hang[1].x1 - hang[0].x1 < 40 && hang[0].y1 > hang[0].y0 + 30 && out[2].y1 > out[2].y0 + 30 && out[3].y1 > out[3].y0 + 30,
      [out[0], out[5], hang[0]],
    );
  }
  const { page } = await open("party:P6");
  await sleep(3000);
  const oc = (await st(page)).now.people["octopus-guest"];
  await place(page, oc.x - 60, oc.y);
  await sleep(1500);
  let s = await st(page);
  g.check("in his first minute the octopus never starts", s.now.oct.mode !== "chase" && s.cur !== "bub", s.now.oct);
  g.check("before a chase he is his approved picture (no arm is drawn by the game)", (await armStrokes(page)) === 0);
  await set(page, (p) => (p.ft = 61));
  s = await until(page, (q) => q.cur === "bub", 4000);
  g.check("after the first minute: \"*hic* Fellow tourist!\"", !!s && s.text === "*hic* Fellow tourist!", s && s.text);
  await sleep(200);
  g.check("over the octopus, the name is the game's own \"Tourist\"", (await bubbleName(page)) === "Tourist", await bubbleName(page));
  const arms = await armStrokes(page);
  s = await st(page);
  g.check("as he speaks all his arms are already out (six arms drawn, thrown out)", arms === 6 && s.now.oct.arms === 1, [arms, s.now.oct]);
  await still(page, "p6-octopus");
  await next(page);
  // (Brian 2026-11-25, showing-5 note 7) he lunges and gives a first, harmless hug before Squatch thinks anything
  s = await until(page, (q) => q.now.oct.mode === "hug", 4000);
  g.check("then he lunges: the octopus catches him, a hug holds him (no control during the squeeze), with its squish", !!s && s.now.oct.hugs === 1 && !s.ctrl && (await played(page)).includes("squish"), s && [s.now.oct, s.ctrl]);
  await sleep(350);
  await still(page, "p6-octopus-hug");
  s = await until(page, (q) => q.cur === "bub", 4000);
  g.check("only after the hug Squatch thinks \"Those arms will pull off my disguise!\" (once)", !!s && s.text === "Those arms will pull off my disguise!" && s.now.oct.hugs === 1, s && s.text);
  g.check("the first hug is just a hug: nothing comes off, nothing flies, no fur", !!s && s.now.gone.length === 0 && s.now.flying === 0 && !s.now.fur, s && s.now.gone);
  const ob = await overSquatch(page);
  g.check("that thought sits clear of Squatch", !ob.bubble, ob);
  await next(page);
  s = await until(page, (q) => q.cur === "bub" && q.text !== "Those arms will pull off my disguise!", 3000);
  g.check("then \"I gotta juke this fool.\"", !!s && s.text === "I gotta juke this fool.", s && s.text);
  await next(page);
  s = await until(page, (q) => q.ctrl && q.now.oct.mode === "chase", 3000);
  g.check("then the real chase: he has control, the octopus is after him, the chip says \"Squatch: get away from the octopus!\"", !!s && s.chip === "Squatch: get away from the octopus!" && s.now.scene === "P6", s && [s.ctrl, s.now.oct, s.chip]);
  // before the chase, he hiccups on the spot a moment (the kid's head start)
  const o1 = s.now.people["octopus-guest"];
  await sleep(700);
  const o2 = (await st(page)).now.people["octopus-guest"];
  g.check("at the chase's start he stays where he is for a moment (a head start)", Math.hypot(o1.x - o2.x, o1.y - o2.y) < 2, [o1, o2]);
  // the kid runs: the chase lasts its 20 seconds, then he is bored
  const r = await runAway(page, 26, "back");
  g.check("kept away from, he chases until his 20 seconds are up, then stands bored (arms still out as the sigh starts)", r.boredAt >= 20 && r.boredAt < 20.2 && r.armsAtBored > 0.9 && r.hugs === 1, r);
  g.check("chasing, he never jumps (his longest step in a tick is his walking pace)", r.maxStep <= octo.OCT_SPEED * 0.05 + 0.5, r.maxStep);
  g.check("his bored sigh sounds", (await played(page)).includes("huff"));
  g.check("bored, his arms drop before he walks off", r.mode === "back" && r.arms < 0.2, [r.mode, r.arms]);
  const back = await runAway(page, 30, "snacks");
  g.check("then he walks back to the snacks (seen walking all the way, no jump)", back.mode === "snacks" && Math.hypot(back.at[0] - hall.OCTOPUS_SNACKS.x, back.at[1] - hall.OCTOPUS_SNACKS.y) < 3 && back.maxStep <= octo.OCT.stroll * 0.05 + 0.5, back);
  g.check("back at the snacks he is his approved picture again (no arm drawn by the game)", (await armStrokes(page)) === 0);
  // with his real rest between chases (nothing zeroed): he rests, and comes again without his lines
  const o3 = (await st(page)).now.people["octopus-guest"];
  await place(page, o3.x - 60, o3.y - 30);
  let lines = 0;
  s = await until(page, (q) => q.now.oct.hugs === 2, 30000, async (q) => q.cur === "bub" && (lines++, await next(page)));
  g.check("after his real rest he chases again, with no lines this time", !!s && lines === 0, [s && s.now.oct, lines]);
  // closing time waits for the squeeze: the last song ends in the middle of the hug
  await set(page, (p, n, a) => ((p.song = 2), (p.songT = a)), free.SONG_SECONDS);
  await sleep(250);
  s = await st(page);
  g.check("the last song ending in the middle of a hug: closing time waits for him to be let go", s.now.scene === "P6" && s.now.oct.mode === "hug" && s.now.gone.length === 0, [s.now.scene, s.now.oct]);
  await set(page, (p) => ((p.song = 0), (p.songT = 0)));
  s = await until(page, (q) => q.now.oct.mode !== "hug", 4000);
  await sleep(120);
  s = await st(page);
  g.check("the second hug knocks a piece off as he lets go (it flies), and he goes back to the snacks", !!s && s.now.gone.length === 1 && s.now.flying === 1 && s.now.oct.mode === "back" && (await played(page)).includes("pieceOff"), s && [s.now.gone, s.now.flying, s.now.oct]);
  await still(page, "p6-octopus-second-hug");
  await page.close();
}
{
  // One moment at a time: with the octopus at the snacks and Squatch beside him after his first minute, the pyramid
  // crashing and the stare are never interrupted by the octopus's line; he starts once the stare is over.
  const { page } = await open("party:P6");
  await place(page, 150, 585);
  await run(page, 12);
  let s = await st(page);
  g.check("(the octopus has strolled to the snacks)", s.now.oct.mode === "snacks", s.now.oct);
  await page.evaluate((spot) => {
    const n = window.__ss.op,
      p = n.ch1PartyNow;
    p.ft = 61;
    // the pyramid starts to fall (what party-snacks.js startTopple does), with Squatch at the bar
    ((p.snacks.toppled = true), (p.snacks.chain = 0), (n.sq.x = spot.x), (n.sq.y = spot.y));
  }, hall.SNACK_SPOT);
  const seen = await page.evaluate(() => {
    const n = window.__ss.op,
      p = n.ch1PartyNow,
      out = { bub: 0, chase: 0, stared: 0, gone: 0 };
    for (let i = 0; i < 400 && (p.snacks.chain < 1 || p.stare); i++) {
      window.__ss.tick(0.05);
      n.cur && n.cur.k === "bub" && out.bub++;
      p.oct.mode !== "snacks" && out.chase++;
      p.stare && out.stared++;
      out.gone = (p.lostPieces || []).length;
    }
    return out;
  });
  g.check("while the pyramid crashes and everyone stares, the octopus says nothing and stays at the snacks", seen.bub === 0 && seen.chase === 0 && seen.stared > 40 && seen.gone === 1, seen);
  s = await until(page, (q) => q.cur === "bub" || !!q.now.alarm, 4000);
  g.check("once the stare is over the party goes on (the octopus starts, or a guest sees his fur)", !!s, s && [s.text, s.now.alarm]);
  await page.close();
}
{
  // An alarm in the middle of a chase: his arms drop and nothing holds Squatch.
  const { page } = await open("party:P6");
  await sleep(3000);
  const oc = (await st(page)).now.people["octopus-guest"];
  await set(page, (p) => ((p.ft = 61), (p.oct.said = true)));
  await place(page, oc.x - 100, oc.y - 20);
  let s = await until(page, (q) => q.now.oct.mode === "chase", 4000);
  await set(page, (p) => (p.lostPieces = ["head"]));
  await place(page, 770, 455);
  s = await until(page, (q) => q.now && q.now.alarm, 5000);
  g.check("an alarm during a chase: the octopus drops his arms and gives up", !!s && s.now.oct.mode === "back" && s.now.oct.arms === 0, s && s.now.oct);
  await page.close();
}

// ---------- the hallway ----------
{
  const { page } = await open("party:P6");
  await place(page, 830, 322);
  await walk(page, 940, 320);
  let s = await until(page, (q) => q.cur === "bub", 6000);
  g.check("walking into the hallway doorway: he thinks \"I can't go there. Mops will see me.\"", !!s && s.text === "I can't go there. Mops will see me.", s && s.text);
  await still(page, "p6-hallway-mops");
  const mb = await overSquatch(page);
  g.check("the thought sits clear of Squatch", !mb.bubble, mb);
  await next(page);
  s = await until(page, (q) => q.ctrl && !q.cur, 4000);
  g.check("he is bounced back out of the doorway and cannot go through", !!s && s.x < hall.HALLWAY_ZONE.x0 && s.x > hall.HALLWAY_ZONE.x0 - 70 && s.room === "hall", s && [s.x, s.y]);
  g.check("bounced back he stands clear of Isfred (nobody stands inside anybody)", !!s && Math.hypot(s.x - s.now.isfred.x, s.y - s.now.isfred.y) >= free.FREE.clearOf * 0.9, s && [s.x, s.y, s.now.isfred]);
  g.check("the bump and the uh-oh sound", (await played(page)).includes("bump") && (await played(page)).includes("uhoh"));
  await page.close();
}

// ---------- the conga ----------
{
  const { page } = await open("party:P6");
  await place(page, 700, 600);
  await set(page, (p, n, a) => (p.songT = a), toys.CONGA.start);
  let s = await until(page, (q) => q.now.conga && q.now.conga.formed, 15000);
  g.check("the conga forms (its dancers walk to it, nobody jumps)", !!s);
  await sleep(1500);
  await still(page, "p6-conga");
  const tail = await page.evaluate(() => {
    const p = window.__ss.op.ch1PartyNow;
    return p.people.backpack;
  });
  await place(page, tail.x - 10, tail.y + 30);
  s = await until(page, (q) => q.now.conga.joined, 4000);
  g.check("walking into its tail joins it", !!s && s.now.done.conga);
  const a = await st(page);
  await sleep(1500);
  const b = await st(page);
  g.check("in the line he is towed along", Math.hypot(a.x - b.x, a.y - b.y) > 30, [a.x, a.y, b.x, b.y]);
  await still(page, "p6-conga-towed");
  const here = await st(page);
  s = await until(page, (q) => !q.now.conga.joined, 3000, async () => walk(page, here.x, Math.min(600, here.y + 80)));
  g.check("steering away leaves the line", !!s);
  await page.close();
}

// ---------- the dance's way out ----------
{
  const { page } = await open("party:P6");
  await walk(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  await until(page, (q) => q.act === "DANCE · circle", 8000);
  await press(page);
  await until(page, (q) => q.full, 3000);
  await page.touchscreen.tap(375 - 36, 36);
  const s = await until(page, (q) => !q.full && q.ctrl, 2000);
  g.check("the dance has a way out: its close button ends it at once and gives control back", !!s && !s.now.dance, s && s.now);
  g.check("with no moves made it does not count as a dance (no early closing from it)", !!s && !s.now.done.dance, s && s.now.done);
  await page.close();
}

// ---------- ↺ ----------
{
  const { page } = await open("party:P6");
  await set(page, (p) => ((p.song = 1), (p.lostPieces = ["head"])));
  await place(page, 300, 500);
  await page.evaluate(() => window.SSQ.beat("ch1-party").restart());
  await sleep(500);
  const s = await st(page);
  g.check("↺ restarts P6 just inside his door, the same outfit whole, the song that was playing", s.now.scene === "P6" && Math.hypot(s.x - hall.SPOTS.doorway.x, s.y - hall.SPOTS.doorway.y) < 3 && s.now.gone.length === 0 && s.now.song === 1, [s.now.scene, s.x, s.y, s.now.gone, s.now.song]);
  await page.close();
}

{
  const { page } = await open("party:P6");
  await walk(page, hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4);
  await until(page, (q) => q.act === "DANCE · circle", 8000);
  await press(page);
  await until(page, (q) => q.full, 3000);
  await page.touchscreen.touchStart(34, 34);
  await sleep(1000);
  await page.touchscreen.touchEnd();
  await sleep(600);
  let s = await st(page);
  g.check("holding the dance view's own ↺ restarts P6: the dance closed, back inside his door", !s.full && s.now.scene === "P6" && !s.now.dance && Math.hypot(s.x - hall.SPOTS.doorway.x, s.y - hall.SPOTS.doorway.y) < 3, [s.full, s.x, s.y]);
  await page.evaluate(() => (window.__ss.op.ch1PartyNow.snack = { zoom: 1, paw: { x: 480, y: 560 }, held: -1, phase: "back", t: 0, back: 0, catches: 0 }));
  await page.evaluate(() => window.__ss.sectionReset());
  await sleep(500);
  s = await st(page);
  g.check("↺ with the snack close-up open restarts P6 with it closed", s.now.scene === "P6" && !s.now.snack && s.ctrl, s.now.snack);
  await page.close();
}

await g.finish("party-free");
